#!/usr/bin/env node
/**
 * Cloudflare analytics snapshot generator.
 *
 * Pulls aggregated metrics (requests + custom events) and writes:
 * - receipts/cloudflare-snapshot.json
 * - receipts/cloudflare-summary.md
 *
 * Usage:
 *   pnpm run analytics:snapshot
 *   pnpm run analytics:snapshot -- --range-days 7 --compare receipts/baseline/2025-02-01.json
 *   pnpm run analytics:snapshot -- --dry-run
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const receiptsDir = path.join(repoRoot, 'receipts')
const docsDir = path.join(repoRoot, 'docs')
const DAY_MS = 24 * 60 * 60 * 1000

const SIGNAL_DEFINITIONS = {
  'adoption.pages_touched': {
    unit: 'pages',
    direction: 'up',
    compute: ({ requests }) => computePagesTouched(requests),
    primary: value => value.count,
    evaluate: value => {
      if (value.count >= 25) return healthy(`>=25 unique slugs (${value.count})`)
      if (value.count >= 15) return watch(`15–24 unique slugs (${value.count})`)
      return breach(`<15 unique slugs (${value.count})`)
    },
    format: value => `${value.count} unique slugs`
  },
  'adoption.time_to_answer': {
    unit: 'seconds',
    direction: 'down',
    compute: ({ events }) => computeTimeToAnswer(events),
    primary: value => value.medianSeconds ?? null,
    evaluate: value => evaluateTimeToAnswer(value),
    format: value => {
      if (!value.medianSeconds && !value.p80Seconds) return 'no samples'
      const median = value.medianSeconds ? `${value.medianSeconds.toFixed(1)}s` : 'n/a'
      const p80 =
        value.p80Seconds !== null && value.p80Seconds !== undefined
          ? `${value.p80Seconds.toFixed(1)}s`
          : 'n/a'
      return `Median ${median} (p80 ${p80})`
    }
  },
  'quality.lab_pass_rate': {
    unit: '%',
    direction: 'up',
    compute: ({ events }) => computeLabPassRate(events),
    primary: value => value.percentage ?? null,
    evaluate: value => {
      if (value.percentage === null) return watch('No lab events recorded')
      if (value.percentage >= 92) return healthy(`${value.percentage.toFixed(1)}%`)
      if (value.percentage >= 88) return watch(`${value.percentage.toFixed(1)}%`)
      return breach(`${value.percentage.toFixed(1)}%`)
    },
    format: value =>
      value.percentage === null
        ? 'no lab runs'
        : `${value.percentage.toFixed(1)}% pass (${value.pass}/${value.total})`
  },
  'quality.broken_links': {
    unit: 'errors/day',
    direction: 'down',
    compute: ({ requests, rangeDays }) => computeBrokenLinks(requests, rangeDays),
    primary: value => value.perDay,
    evaluate: value => {
      if (value.perDay <= 2) return healthy(`<=2/day (${value.perDay.toFixed(1)})`)
      if (value.perDay <= 4) return watch(`3-4/day (${value.perDay.toFixed(1)})`)
      return breach(`>=5/day (${value.perDay.toFixed(1)})`)
    },
    format: value => `${value.perDay.toFixed(1)} per day (${value.total} total)`
  },
  'credibility.state_freshness': {
    unit: 'days',
    direction: 'down',
    compute: ({ stateFreshnessDays }) => ({ days: stateFreshnessDays }),
    primary: value => value.days,
    evaluate: value => {
      if (value.days === null || value.days === undefined) {
        return watch('State page missing `last_reviewed` timestamp')
      }
      if (value.days <= 30) return healthy(`<=30 days (${value.days})`)
      if (value.days <= 40) return watch(`31-40 days (${value.days})`)
      return breach(`>40 days (${value.days})`)
    },
    format: value =>
      value.days === null || value.days === undefined ? 'n/a' : `${value.days} days since update`
  },
  'credibility.exceptions_resolved': {
    unit: '%',
    direction: 'up',
    compute: ({ events }) => computeExceptionsResolved(events),
    primary: value => value.percentage ?? null,
    evaluate: value => {
      if (value.percentage === null) return watch('No exception closures recorded')
      if (value.percentage >= 100) return healthy('100% on time')
      if (value.percentage >= 90) return watch(`${value.percentage.toFixed(1)}%`)
      return breach(`${value.percentage.toFixed(1)}%`)
    },
    format: value =>
      value.percentage === null
        ? 'no closures'
        : `${value.percentage.toFixed(1)}% on time (${value.onTime}/${value.totalClosed})`
  }
}

const EVENT_ACTIONS = [
  'nb.time_to_answer.v1',
  'nb.lab_pass.pass.v1',
  'nb.lab_pass.fail.v1',
  'nb.exception_state.opened.v1',
  'nb.exception_state.closed_on_time.v1',
  'nb.exception_state.closed_late.v1',
  'nb.cta_click.v1',
  'nb.not_helpful_click.v1'
]

const SAMPLE_DATA = {
  now: new Date('2025-02-15T12:00:00Z'),
  requests: [
    ...Array.from({ length: 28 }, (_, index) => ({
      dimensions: { clientRequestPath: `/docs/sample-${index}`, edgeResponseStatus: 200 },
      sum: { requests: 30 + index }
    })),
    {
      dimensions: { clientRequestPath: '/labs/link-drift', edgeResponseStatus: 200 },
      sum: { requests: 58 }
    },
    {
      dimensions: { clientRequestPath: '/docs/404', edgeResponseStatus: 404 },
      sum: { requests: 6 }
    }
  ],
  events: [
    {
      dimensions: { action: 'nb.time_to_answer.v1' },
      sum: { events: 184 },
      quantiles: { eventDurationMsP50: 52000, eventDurationMsP80: 68000 }
    },
    {
      dimensions: { action: 'nb.lab_pass.pass.v1' },
      sum: { events: 44 }
    },
    {
      dimensions: { action: 'nb.lab_pass.fail.v1' },
      sum: { events: 3 }
    },
    {
      dimensions: { action: 'nb.exception_state.closed_on_time.v1' },
      sum: { events: 4 }
    },
    {
      dimensions: { action: 'nb.exception_state.closed_late.v1' },
      sum: { events: 1 }
    }
  ]
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const now = options.dryRun ? SAMPLE_DATA.now : new Date()
  const rangeDays =
    Number.isFinite(options.rangeDays) && options.rangeDays > 0 ? options.rangeDays : 1
  const to = now.toISOString()
  const from = new Date(now.getTime() - rangeDays * DAY_MS).toISOString()

  const baseline = options.compare ? await loadBaseline(path.resolve(options.compare)) : null

  const registry = await loadSignalRegistry()
  const stateFreshnessDays = await computeStateFreshnessDays(now, options.statePagePath)

  const datasets = options.dryRun
    ? { requests: SAMPLE_DATA.requests, events: SAMPLE_DATA.events }
    : await fetchDatasets({ from, to, actions: EVENT_ACTIONS })

  const mode = options.dryRun ? 'dry-run' : 'live'
  const summary = buildSummary({
    registry,
    datasets,
    baseline,
    rangeDays,
    from,
    to,
    generatedAt: now.toISOString(),
    stateFreshnessDays,
    mode
  })

  await mkdir(receiptsDir, { recursive: true })
  const snapshotPath = path.join(receiptsDir, 'cloudflare-snapshot.json')
  const summaryPath = path.join(receiptsDir, 'cloudflare-summary.md')

  await writeFile(snapshotPath, JSON.stringify(summary, null, 2))
  await writeFile(summaryPath, renderMarkdown(summary, baseline, options.compare))

  console.log(`Snapshot saved to ${path.relative(repoRoot, snapshotPath)}`)
  console.log(`Summary saved to ${path.relative(repoRoot, summaryPath)}`)
}

function parseArgs(argv) {
  const opts = {
    rangeDays: 1,
    dryRun: false,
    statePagePath: process.env.STATE_PAGE_PATH
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--range-days' || arg === '--rangeDays') {
      opts.rangeDays = Number(argv[i + 1])
      i += 1
    } else if (arg.startsWith('--range-days=')) {
      opts.rangeDays = Number(arg.split('=')[1])
    } else if (arg === '--compare') {
      opts.compare = argv[i + 1]
      i += 1
    } else if (arg.startsWith('--compare=')) {
      opts.compare = arg.split('=')[1]
    } else if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg.startsWith('--state-page=')) {
      opts.statePagePath = arg.split('=')[1]
    } else if (arg === '--state-page') {
      opts.statePagePath = argv[i + 1]
      i += 1
    } else {
      ;(opts.extra ??= []).push(arg)
    }
  }
  return opts
}

async function loadSignalRegistry() {
  const registryPath = path.join(repoRoot, 'reports', 'signal-registry.json')
  const raw = await readFile(registryPath, 'utf8')
  return JSON.parse(raw)
}

async function loadBaseline(comparePath) {
  try {
    const raw = await readFile(comparePath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Unable to load baseline at ${comparePath}: ${error.message}`)
  }
}

async function computeStateFreshnessDays(now, overridePath) {
  const defaultPath = path.join(docsDir, 'state', 'index.md')
  const statePath = path.resolve(overridePath ?? defaultPath)
  try {
    const content = await readFile(statePath, 'utf8')
    const fm = matter(content)
    const lastReviewed =
      fm.data.last_reviewed || fm.data.lastReviewed || fm.data.lastreviewed || null
    if (lastReviewed) {
      const reviewedDate = new Date(lastReviewed)
      if (!Number.isNaN(reviewedDate.getTime())) {
        return Math.max(0, Math.round((now.getTime() - reviewedDate.getTime()) / DAY_MS))
      }
    }
    const stats = await stat(statePath)
    return Math.max(0, Math.round((now.getTime() - stats.mtimeMs) / DAY_MS))
  } catch (error) {
    console.warn(`State page not found at ${statePath}: ${error.message}`)
    return null
  }
}

async function fetchDatasets({ from, to, actions }) {
  const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN
  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID
  const zoneTag = process.env.CLOUDFLARE_ZONE_ID || process.env.CLOUDFLARE_ZONE_TAG

  if (!token || !accountTag || !zoneTag) {
    throw new Error(
      'Missing Cloudflare credentials. Set CLOUDFLARE_ANALYTICS_TOKEN, CLOUDFLARE_ACCOUNT_ID, and CLOUDFLARE_ZONE_ID.'
    )
  }

  const requests = await fetchRequests({ token, zoneTag, from, to })
  const events = await fetchEvents({ token, accountTag, from, to, actions })

  return { requests, events }
}

async function fetchRequests({ token, zoneTag, from, to }) {
  const REQUESTS_QUERY = `
    query ($zoneTag: string!, $from: Time!, $to: Time!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequestsAdaptiveGroups(
            limit: 10000,
            filter: { datetime_geq: $from, datetime_lt: $to }
          ) {
            dimensions {
              clientRequestPath
              edgeResponseStatus
            }
            sum {
              requests
            }
          }
        }
      }
    }
  `

  const data = await cloudflareGraphQL({
    token,
    query: REQUESTS_QUERY,
    variables: { zoneTag, from, to }
  })

  return data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? []
}

async function fetchEvents({ token, accountTag, from, to, actions }) {
  const EVENTS_QUERY = `
    query ($accountTag: string!, $from: Time!, $to: Time!, $actions: [String!]!) {
      viewer {
        accounts(filter: { accountTag: $accountTag }) {
          rumActionsAdaptiveGroups(
            limit: 2000,
            filter: {
              datetime_geq: $from,
              datetime_lt: $to,
              action_in: $actions
            }
          ) {
            dimensions {
              action
              clientRequestPath
              eventTag
              applicationName
              applicationId
            }
            sum {
              events
            }
            quantiles {
              eventDurationMsP50
              eventDurationMsP75
              eventDurationMsP80
              eventDurationMsP90
            }
          }
        }
      }
    }
  `

  const data = await cloudflareGraphQL({
    token,
    query: EVENTS_QUERY,
    variables: { accountTag, from, to, actions }
  })

  return data?.viewer?.accounts?.[0]?.rumActionsAdaptiveGroups ?? []
}

async function cloudflareGraphQL({ token, query, variables }) {
  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Cloudflare API error (${response.status}): ${text}`)
  }

  const json = await response.json()
  if (json.errors?.length) {
    const details = json.errors.map(err => err.message).join('; ')
    throw new Error(`Cloudflare GraphQL errors: ${details}`)
  }

  return json.data
}

function buildSummary({
  registry,
  datasets,
  baseline,
  rangeDays,
  from,
  to,
  generatedAt,
  stateFreshnessDays,
  mode
}) {
  const signals = {}

  Object.entries(SIGNAL_DEFINITIONS).forEach(([id, definition]) => {
    const context = {
      ...datasets,
      rangeDays,
      stateFreshnessDays
    }
    const computed = definition.compute(context)
    const { status, reason } = definition.evaluate(computed)
    const primary = definition.primary(computed)
    const delta = computeDelta(id, primary, baseline)

    signals[id] = {
      value: computed,
      primary,
      unit: definition.unit,
      status,
      direction: definition.direction,
      reason,
      display: definition.format(computed),
      delta
    }
  })

  return {
    generated_at: generatedAt,
    range: { from, to, days: rangeDays },
    signals,
    mode,
    registry_version: registryVersion(registry)
  }
}

function registryVersion(registry) {
  const ids = Array.isArray(registry) ? registry.map(item => item.id).join('|') : 'unknown'
  return Buffer.from(ids).toString('base64').slice(0, 12)
}

function computePagesTouched(groups) {
  const uniquePaths = new Set()
  ;(groups ?? []).forEach(group => {
    const path = group?.dimensions?.clientRequestPath
    const status = Number(group?.dimensions?.edgeResponseStatus ?? 0)
    if (!path || Number.isNaN(status)) return
    if (!isTrackedPath(path)) return
    if (status < 400) {
      uniquePaths.add(path)
    }
  })
  return { count: uniquePaths.size }
}

function computeBrokenLinks(groups, rangeDays) {
  let total = 0
  ;(groups ?? []).forEach(group => {
    const status = Number(group?.dimensions?.edgeResponseStatus ?? 0)
    const count = Number(group?.sum?.requests ?? 0)
    const pathValue = group?.dimensions?.clientRequestPath
    if (!isTrackedPath(pathValue)) return
    if (status >= 400) {
      total += count
    }
  })
  const perDay = rangeDays > 0 ? total / rangeDays : total
  return { total, perDay }
}

function computeTimeToAnswer(events) {
  const group = (events ?? []).find(entry => entry?.dimensions?.action === 'nb.time_to_answer.v1')
  if (!group) {
    return { medianSeconds: null, p80Seconds: null, samples: 0 }
  }
  const medianMs = pickQuantile(group, [50, 'P50'])
  const p80Ms = pickQuantile(group, [80, 'P80', 90, 'P90'])

  return {
    medianSeconds: convertMsToSeconds(medianMs),
    p80Seconds: convertMsToSeconds(p80Ms),
    samples: Number(group?.sum?.events ?? 0)
  }
}

function convertMsToSeconds(value) {
  if (value === undefined || value === null) return null
  const num = Number(value)
  if (Number.isNaN(num)) return null
  return num / 1000
}

function pickQuantile(group, keys) {
  const quantiles = group?.quantiles ?? {}
  if (!quantiles) return null
  for (const key of keys) {
    if (typeof key === 'number') {
      const guessedKey = Object.keys(quantiles).find(name => name.toLowerCase().includes(`p${key}`))
      if (guessedKey && quantiles[guessedKey] !== undefined) {
        return quantiles[guessedKey]
      }
    } else if (quantiles[key] !== undefined) {
      return quantiles[key]
    }
  }
  return null
}

function computeLabPassRate(events) {
  let pass = 0
  let fail = 0
  ;(events ?? []).forEach(group => {
    const action = group?.dimensions?.action
    const count = Number(group?.sum?.events ?? 0)
    if (action === 'nb.lab_pass.pass.v1') pass += count
    if (action === 'nb.lab_pass.fail.v1') fail += count
  })
  const total = pass + fail
  if (total === 0) {
    return { percentage: null, pass: 0, total: 0 }
  }
  return { percentage: (pass / total) * 100, pass, total }
}

function computeExceptionsResolved(events) {
  const onTime = sumEvents(events, 'nb.exception_state.closed_on_time.v1')
  const late = sumEvents(events, 'nb.exception_state.closed_late.v1')
  const totalClosed = onTime + late
  if (totalClosed === 0) {
    return { percentage: null, onTime: 0, totalClosed: 0 }
  }
  return {
    percentage: (onTime / totalClosed) * 100,
    onTime,
    totalClosed
  }
}

function sumEvents(events, actionName) {
  return (events ?? [])
    .filter(group => group?.dimensions?.action === actionName)
    .reduce((sum, group) => sum + Number(group?.sum?.events ?? 0), 0)
}

function computeDelta(id, currentPrimary, baseline) {
  if (!baseline?.signals?.[id]) return null
  const previous = baseline.signals[id].primary
  if (
    currentPrimary === null ||
    currentPrimary === undefined ||
    previous === null ||
    previous === undefined
  ) {
    return null
  }
  const value = currentPrimary - previous
  const trend = value === 0 ? 'flat' : value > 0 ? 'up' : 'down'
  return { value, previous, trend }
}

function renderMarkdown(summary, baseline, baselinePath) {
  const header = `# Cloudflare analytics snapshot — ${new Date(summary.generated_at).toUTCString()}`
  const rangeLine = `Window: ${summary.range.from} → ${summary.range.to} (${summary.range.days} day${summary.range.days > 1 ? 's' : ''})`
  const baselineLine = baseline
    ? `Compared to: ${baseline.range.from} → ${baseline.range.to}${baselinePath ? ` (${baselinePath})` : ''}`
    : 'Baseline: not supplied'
  const modeLine = summary.mode === 'dry-run' ? '_Mode: dry-run sample data_' : '_Mode: live data_'

  const tableRows = [
    '| Signal | Value | Δ vs baseline | Status | Notes |',
    '| --- | --- | --- | --- | --- |'
  ]

  Object.entries(summary.signals).forEach(([id, data]) => {
    const deltaText = data.delta ? formatDelta(data.delta, data.direction) : '—'
    tableRows.push(
      `| \`${id}\` | ${data.display} | ${deltaText} | ${formatStatus(data.status)} | ${data.reason} |`
    )
  })

  return [
    header,
    '',
    rangeLine,
    baselineLine,
    modeLine,
    '',
    ...tableRows,
    '',
    '> Source: Cloudflare GraphQL aggregates + custom events. Generated via `pnpm run analytics:snapshot`.'
  ].join('\n')
}

function formatDelta(delta, direction) {
  const rounded = Math.abs(delta.value) >= 1 ? delta.value.toFixed(1) : delta.value.toPrecision(2)
  const symbol = delta.value > 0 ? '▲' : delta.value < 0 ? '▼' : '–'
  const directionNote = direction === 'down' ? ' (down good)' : ''
  return `${symbol} ${rounded}${directionNote}`
}

function formatStatus(status) {
  if (status === 'healthy') return '🟢 Healthy'
  if (status === 'watch') return '🟡 Watch'
  if (status === 'breach') return '🔴 Breach'
  return status
}

function isTrackedPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return false
  return pathname.startsWith('/docs') || pathname.startsWith('/labs')
}

function healthy(reason) {
  return { status: 'healthy', reason }
}

function watch(reason) {
  return { status: 'watch', reason }
}

function breach(reason) {
  return { status: 'breach', reason }
}

function evaluateTimeToAnswer(value) {
  if (value.samples === 0 || value.medianSeconds === null) return watch('No CTA events recorded')
  const median = value.medianSeconds
  const p80 = value.p80Seconds ?? median
  if (median <= 60 && p80 <= 70)
    return healthy(`Median ${median.toFixed(1)}s, p80 ${p80.toFixed(1)}s`)
  if (median <= 70 && p80 <= 75)
    return watch(`Median ${median.toFixed(1)}s, p80 ${p80.toFixed(1)}s`)
  return breach(`Median ${median.toFixed(1)}s, p80 ${p80.toFixed(1)}s`)
}

await main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

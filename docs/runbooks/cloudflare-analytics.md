---
title: Cloudflare analytics receipts
band: A
owner: '@lop'
change_type: minor
refresh_after_days: 45
status: live
audience: Automation and signal stewards wiring telemetry
tone: Plainspoken, candid, energetic
narrative_goal: Document how to run Cloudflare analytics safely and keep receipts fresh
nav_group: Runbooks
nav_order: 75
nav_label: Cloudflare analytics
nav:
  - sidebar
---

# Cloudflare analytics receipts

Stand up privacy-sanitized Cloudflare Analytics so every guardrail signal (adoption, quality, credibility) updates on schedule and posts receipts within 10 minutes. <a href="#snapshot-pipeline" data-primary-action>Run the snapshot pipeline</a> or <a href="#signal-mapping" data-secondary-action>Map a new signal</a>.

## Suitability and privacy review

- **Data model** — Cloudflare Web Analytics only surfaces aggregated page metrics and custom events scoped to a site token. No IPs, cookies, or user identifiers are stored when `privacy_mode: strict`.
- **Retention & locality** — Aggregates stay in Cloudflare's EU region for 30 days by default; snapshots exported to this repo keep only derived metrics (counts, medians, deltas).
- **Custom events** — `cf.event()` payloads are capped at 64 bytes and drop automatically if they contain email, IP-like strings, or fingerprint-able blobs. We keep fields to `event`, `version`, and sanitized metadata (page slug, ms durations rounded to 100 ms buckets).
- **Automation invariant** — Pulling analytics replaces at least two hours/week of manual reporting because we: (1) fetch aggregates via API, (2) auto-fill the Signal Registry JSON, and (3) generate receipt blocks for the State page with one script.
- **Stop rule** — If enabling analytics adds >15 minutes/day of CI time or exposes unsanitized data, disable the scheduled job, revert to manual measurement noted in Receipts, and open an exception entry before retrying.

### Privacy checklist

| Item                               | Status | Notes                                             |
| ---------------------------------- | ------ | ------------------------------------------------- |
| Aggregated only (no per-user logs) | ✅     | `privacy_mode: strict`, no `clientIP` fields      |
| PII guard                          | ✅     | Script rejects payload keys outside the allowlist |
| Data minimization                  | ✅     | Only page slug, action, duration bucket captured  |
| Storage                            | ✅     | Snapshots stored in repo as deltas, no raw logs   |
| Owner + stop rule                  | ✅     | Owner @lop, stop rule documented above            |

## Signal mapping

| Signal id                         | Type        | Description                                | Cloudflare metric or query                                                                                               | Refresh cadence | Direction | Thresholds / Kill criteria                                |
| --------------------------------- | ----------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------- | --------- | --------------------------------------------------------- |
| `adoption.pages_touched`          | Adoption    | Northbook pages changed per cycle          | GraphQL `viewer.zones.httpRequestsAdaptiveGroups` filtered by `edgeResponseStatus` < 400 and release git tag path prefix | Daily           | Up good   | Healthy ≥25 unique slugs / 14d; kill if <10 for 2 cycles  |
| `adoption.time_to_answer`         | Adoption    | Median seconds from landing to CTA click   | Custom event `nb.time_to_answer.v1` median duration                                                                      | Daily           | Down good | Healthy ≤60 s; kill if 80th percentile >75 s for 2 cycles |
| `quality.lab_pass_rate`           | Quality     | Percentage of annex labs passing           | Custom event `nb.lab_pass.v1` with `result` dimension                                                                    | Weekly          | Up good   | Healthy ≥92%; kill if <85% for 1 cycle                    |
| `quality.broken_links`            | Quality     | Count of 4xx/5xx exits                     | GraphQL `httpRequestsAdaptiveGroups` grouped by `edgeResponseStatus` ≥400 on `/docs` paths                               | Daily           | Down good | Healthy ≤2/day; kill if ≥5/day for 3 days                 |
| `credibility.state_freshness`     | Credibility | Days since `/state` update                 | Custom metric derived from VitePress frontmatter + commit timestamp pushed via snapshot script                           | Daily           | Down good | Healthy ≤30 days; kill if >45 days                        |
| `credibility.exceptions_resolved` | Credibility | Percent of exceptions closed before expiry | Custom event `nb.exception_state.v1` summarizing open/closed counts                                                      | Weekly          | Up good   | Healthy 100%; kill if <80% for 1 cycle                    |

All Signal Registry entries live in [`reports/signal-registry.json`](../../reports/signal-registry.json) and render for humans at [`docs/runbooks/signal-registry.md`](./signal-registry.md).

## Instrumentation guide

| Event                       | Version        | Trigger                                                    | Payload (sanitized)                               |
| --------------------------- | -------------- | ---------------------------------------------------------- | ------------------------------------------------- | ------------------------- | -------------------------- |
| `nb.time_to_answer.v1`      | `v1`           | CTA click after landing                                    | `{ "slug": "/path", "elapsed_ms_bucket": 42000 }` |
| `nb.not_helpful_click.v1`   | `v1`           | “Not helpful” button click                                 | `{ "slug": "/path", "cta": "not_helpful" }`       |
| `nb.cta_click.v1`           | `v1`           | Any CTA with `data-primary-action`/`data-secondary-action` | `{ "slug": "/path", "cta": "primary               | secondary" }`             |
| `nb.lab_pass.(pass          | fail).v1`      | `v1`                                                       | Proof Run completes                               | `{ "lab": "link-drift" }` |
| `nb.exception_state.(opened | closed_on_time | closed_late).v1`                                           | `v1`                                              | Exception open/close      | `{ "id": "home-refresh" }` |

Implementation notes:

- Wrap events inside the existing CTA scripts so pages stay runnable without JavaScript (events drop silently if JS disabled).
- Keep event schemas alongside components under `docs/.vitepress/theme/telemetry/README.md` (create if absent) with owner, version history, and retirement plan.
- Encode result/state in the action name for lab outcomes and exception state so aggregates can be derived without inspecting payloads.
- Version bumps require updating both the registry JSON and the runbook tables.

## Snapshot pipeline

1. Export `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ANALYTICS_TOKEN`, and `CLOUDFLARE_SITE_TAG` (the Web Analytics beacon token).
2. Run `pnpm run analytics:snapshot` (see [`scripts/cloudflare-snapshot.mjs`](../../scripts/cloudflare-snapshot.mjs)). It:
   - Pulls the last 1-day and 7-day windows via Cloudflare GraphQL,
   - Collates custom event aggregates from `/analytics_api/v4/graphql`,
   - Updates `reports/signal-registry.json` freshness fields,
   - Writes `receipts/cloudflare-snapshot.json` (machine), `receipts/cloudflare-summary.md` (human).
3. Attach the summary to the Receipts page and link it from the State page. Automation should finish in <10 minutes; abort otherwise.

### Baseline capture

- Run the snapshot daily for 14 days before shipping any new content/testing changes.
- Store each JSON output under `receipts/baseline/<YYYY-MM-DD>.json`.
- Compute deltas via `pnpm run analytics:snapshot -- --compare receipts/baseline/<date>.json`.
- Receipts must cite the baseline window and direction of change (up/down good per signal).

## Monitoring and rollback

- Add a lightweight GitHub Action (or cron) restricted to this script; disable it automatically if runtime >10 minutes or response includes PII-like keys.
- Post failures to the Fast Support index with owner + ETA.
- Use the stop rule in the privacy section if CI or automation time grows by 15 minutes/day or telemetry injects personal data.

## Related references

- [Signal Registry](./signal-registry.md) — Human-readable table fed by the JSON artifact.
- [Receipts](../receipts/index.md) — Where snapshots and baseline deltas surface for the public log.
- [North Star & Guardrails](../playbook/north-star-guardrails) — Contract describing the signals this runbook serves.

#!/usr/bin/env node

import * as fsSync from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Window } from 'happy-dom'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const distDir = path.join(repoRoot, 'docs/.vitepress/dist')

const CTA_DISTANCE_LIMIT = Number(process.env.PRIMARY_ACTION_MAX_DISTANCE_PX ?? 600)
const CHAR_TO_PX = Number(process.env.PRIMARY_ACTION_CHAR_TO_PX ?? 0.35)
const BLOCK_BASE_PX = Number(process.env.PRIMARY_ACTION_BLOCK_BASE_PX ?? 24)

const BLOCK_TAGS = new Set([
  'P',
  'DIV',
  'SECTION',
  'ARTICLE',
  'UL',
  'OL',
  'LI',
  'PRE',
  'TABLE',
  'BLOCKQUOTE',
  'FIGURE',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6'
])

const BONUS_PX = {
  IMG: 160,
  PICTURE: 160,
  VIDEO: 200,
  CANVAS: 200,
  SVG: 120,
  PRE: 160,
  CODE: 120,
  TABLE: 180,
  HR: 24
}

/**
 * Recursively collect .html files from a directory and push them into a Set.
 */
async function collectHtmlFiles(dir, targetSet) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch (error) {
    if (error && error.code === 'ENOENT') return
    throw error
  }

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectHtmlFiles(entryPath, targetSet)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      targetSet.add(entryPath)
    }
  }
}

/**
 * Convert a route like `/decision-spine` into the corresponding dist HTML path.
 */
function linkToHtmlPath(route) {
  const trimmed = route.replace(/^\/+/, '')
  const hasTrailingSlash = route.endsWith('/')

  if (trimmed === '') {
    return path.join(distDir, 'index.html')
  }

  const normalized = trimmed.replace(/\/+/g, '/')
  if (hasTrailingSlash) {
    return path.join(distDir, normalized, 'index.html')
  }

  return path.join(distDir, `${normalized}.html`)
}

function collectDocRoutes() {
  const docsDir = path.join(repoRoot, 'docs')
  const skipDirs = new Set(['public', '.vitepress'])
  const targets = []

  function walk(currentDir) {
    let entries
    try {
      entries = fsSync.readdirSync(currentDir, { withFileTypes: true })
    } catch (error) {
      if (error && error.code === 'ENOENT') return
      throw error
    }

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue
        walk(path.join(currentDir, entry.name))
        continue
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fullPath = path.join(currentDir, entry.name)
        const relPath = path.relative(docsDir, fullPath)
        const route = normalizeRoute(relPath)
        let requiresCTA = false

        try {
          const raw = fsSync.readFileSync(fullPath, 'utf8')
          const { data } = matter(raw)
          if (data && data.primary_action && data.layout !== 'home') {
            requiresCTA = true
          }
        } catch (error) {
          console.warn(
            `[verify-primary-actions] Unable to read frontmatter for ${relPath}: ${error.message}`
          )
        }

        targets.push({ route, requiresCTA })
      }
    }
  }

  walk(docsDir)

  return targets
}

function normalizeRoute(relPath) {
  const normalized = relPath.replace(/\\/g, '/').replace(/\.md$/, '')

  if (normalized === 'index') return '/'

  if (normalized.endsWith('/index')) {
    const base = normalized.slice(0, -6)
    return base ? `/${base}/` : '/'
  }

  return `/${normalized}`
}

async function main() {
  const targets = collectDocRoutes()
  const htmlTargets = []

  for (const target of targets) {
    const htmlPath = linkToHtmlPath(target.route)
    try {
      const stats = await fs.stat(htmlPath)
      if (stats.isFile()) {
        htmlTargets.push({ ...target, htmlPath })
      } else {
        console.warn(
          `[verify-primary-actions] Skipping non-file target: ${path.relative(repoRoot, htmlPath)}`
        )
      }
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        console.warn(
          `[verify-primary-actions] Skipping missing target: ${path.relative(repoRoot, htmlPath)}`
        )
        continue
      }
      throw error
    }
  }

  if (!htmlTargets.length) {
    console.warn('[verify-primary-actions] No documentation HTML files found. Skipping check.')
    return
  }

  const failures = []

  for (const target of htmlTargets) {
    if (!target.requiresCTA) continue

    const { hasAnchor, distance } = await analyzeHtmlFile(target.htmlPath)

    if (!hasAnchor || distance == null || distance > CTA_DISTANCE_LIMIT) {
      failures.push({
        page: target.route,
        hasAnchor,
        distance
      })
    }
  }

  if (failures.length === 0) {
    console.log('[verify-primary-actions] All Playbook and Guide pages include a primary action.')
    return
  }

  console.error('\nPrimary action CTA check failed on these pages:\n')
  for (const { page, hasAnchor, distance } of failures) {
    const detail = hasAnchor
      ? `CTA appears in estimated ~${distance}px from start of content`
      : 'CTA not found in content'

    console.error(
      ` - ${page || '/'} (${detail}). Add <a href="/runbooks/handover-20-min" data-primary-action>Do this next</a>`
    )
  }
  console.error('')

  process.exitCode = 1
}

main().catch(error => {
  console.error('[verify-primary-actions] Unexpected error:')
  console.error(error)
  process.exitCode = 1
})

async function analyzeHtmlFile(htmlPath) {
  const html = await fs.readFile(htmlPath, 'utf8')
  const window = new Window()
  window.document.write(html)

  const doc = window.document
  const contentRoot =
    doc.querySelector('#VPContent') ||
    doc.querySelector('.VPDoc') ||
    doc.querySelector('main') ||
    doc.body

  if (!contentRoot) {
    return { hasAnchor: false, distance: null }
  }

  const anchor = contentRoot.querySelector('[data-primary-action]')
  if (!anchor) {
    return { hasAnchor: false, distance: null }
  }

  const { chars, blocks, bonus } = accumulateBeforeAnchor(contentRoot, anchor)
  const estimatedDistance = Math.round(blocks * BLOCK_BASE_PX + chars * CHAR_TO_PX + bonus)

  return {
    hasAnchor: true,
    distance: estimatedDistance
  }
}

function accumulateBeforeAnchor(root, anchor) {
  let totalChars = 0
  let totalBlocks = 0
  let totalBonus = 0

  for (const child of root.childNodes) {
    const result = gatherNodeStats(child, anchor)
    totalChars += result.chars
    totalBlocks += result.blocks
    totalBonus += result.bonus
    if (result.found) break
  }

  return {
    chars: totalChars,
    blocks: totalBlocks,
    bonus: totalBonus
  }
}

function gatherNodeStats(node, anchor) {
  if (node === anchor) {
    return { chars: 0, blocks: 0, bonus: 0, found: true }
  }

  const ELEMENT_NODE = 1
  const TEXT_NODE = 3

  if (node.nodeType === TEXT_NODE) {
    return {
      chars: normalizeText(node.textContent).length,
      blocks: 0,
      bonus: 0,
      found: false
    }
  }

  if (node.nodeType !== ELEMENT_NODE) {
    return { chars: 0, blocks: 0, bonus: 0, found: false }
  }

  const element = node
  let chars = 0
  let blocks = 0
  let bonus = 0

  if (BLOCK_TAGS.has(element.tagName)) {
    blocks += 1
  }

  if (BONUS_PX[element.tagName]) {
    bonus += BONUS_PX[element.tagName]
  }

  for (const child of element.childNodes) {
    const childStats = gatherNodeStats(child, anchor)
    chars += childStats.chars
    blocks += childStats.blocks
    bonus += childStats.bonus
    if (childStats.found) {
      return { chars, blocks, bonus, found: true }
    }
  }

  return { chars, blocks, bonus, found: false }
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
}

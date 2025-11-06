#!/usr/bin/env node

import { chromium } from 'playwright'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const distDir = path.join(repoRoot, 'docs/.vitepress/dist')
const configPath = path.join(repoRoot, 'docs/.vitepress/config.ts')

/**
 * Extract the internal links listed under the "Guides" sidebar group.
 * Falls back to an empty array if the block cannot be parsed.
 */
async function getGuideLinks() {
  try {
    const configSource = await fs.readFile(configPath, 'utf8')
    const groupMatch = configSource.match(
      /text:\s*['"]Guides['"][\s\S]*?items:\s*\[([\s\S]*?)\]\s*}/
    )

    if (!groupMatch) return []

    const itemsBlock = groupMatch[1]
    const linkRegex = /link:\s*['"]([^'"]+)['"]/g
    const links = []
    let match

    while ((match = linkRegex.exec(itemsBlock)) !== null) {
      const link = match[1]
      if (link.startsWith('/')) links.push(link)
    }

    return links
  } catch (error) {
    if (error && error.code === 'ENOENT') return []
    throw error
  }
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
function linkToHtmlPath(link) {
  const clean = link.replace(/^\/+/, '').replace(/\/+$/, '')
  const base = path.join(distDir, clean)

  return clean === '' ? path.join(distDir, 'index.html') : `${base}.html`
}

async function main() {
  const expectedFiles = new Set()

  const guideLinks = await getGuideLinks()
  for (const link of guideLinks) {
    const htmlPath = linkToHtmlPath(link)
    expectedFiles.add(htmlPath)
  }

  await collectHtmlFiles(path.join(distDir, 'playbook'), expectedFiles)

  const htmlFiles = []

  for (const candidate of Array.from(expectedFiles).filter(Boolean).sort()) {
    try {
      const stats = await fs.stat(candidate)
      if (stats.isFile()) {
        htmlFiles.push(candidate)
      } else {
        console.warn(
          `[verify-primary-actions] Skipping non-file target: ${path.relative(repoRoot, candidate)}`
        )
      }
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        console.warn(
          `[verify-primary-actions] Skipping missing target: ${path.relative(repoRoot, candidate)}`
        )
        continue
      }
      throw error
    }
  }

  if (!htmlFiles.length) {
    console.warn('[verify-primary-actions] No Playbook or Guide HTML files found. Skipping check.')
    return
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()

  const failures = []

  for (const htmlPath of htmlFiles) {
    const fileUrl = pathToFileURL(htmlPath).href

    await page.goto(fileUrl)

    const { hasAnchor, distance } = await page.evaluate(() => {
      const doc = globalThis.document
      if (!doc) return { hasAnchor: false, distance: null }

      const contentRoot =
        doc.querySelector('#VPContent') ||
        doc.querySelector('.VPDoc') ||
        doc.querySelector('main') ||
        doc.body

      if (!contentRoot) return { hasAnchor: false, distance: null }

      const anchor = contentRoot.querySelector('[data-primary-action]')
      if (!anchor) return { hasAnchor: false, distance: null }

      const rootRect = contentRoot.getBoundingClientRect()
      const anchorRect = anchor.getBoundingClientRect()

      return {
        hasAnchor: true,
        distance: anchorRect.top - rootRect.top
      }
    })

    if (!hasAnchor || distance == null || distance > 600) {
      const relative =
        '/' +
        path
          .relative(distDir, htmlPath)
          .replace(/\\/g, '/')
          .replace(/index\.html$/, '')
          .replace(/\.html$/, '')

      failures.push({
        page: relative === '/index' ? '/' : relative,
        hasAnchor,
        distance
      })
    }
  }

  await browser.close()

  if (failures.length === 0) {
    console.log('[verify-primary-actions] All Playbook and Guide pages include a primary action.')
    return
  }

  console.error('\nPrimary action CTA check failed on these pages:\n')
  for (const { page, hasAnchor, distance } of failures) {
    const detail = hasAnchor
      ? `CTA appears ~${Math.round(Number(distance))}px from start of content`
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

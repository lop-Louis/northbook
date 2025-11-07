#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const packageJsonPath = path.join(repoRoot, 'package.json')
const readmePath = path.join(repoRoot, 'README.md')
const metaPath = path.join(repoRoot, 'scripts', 'scripts-meta.json')

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
const scripts = pkg.scripts || {}

const rows = []

for (const entry of meta) {
  const { name, description } = entry
  if (!scripts[name]) {
    console.warn(`[sync-readme] Skipping ${name} (not in package.json)`)
    continue
  }
  rows.push(`| \`pnpm run ${name}\` | ${description} |`)
}

if (!rows.length) {
  console.warn('[sync-readme] No script metadata matched package.json entries.')
  process.exit(0)
}

const table = ['| Command | Purpose |', '| --- | --- |', ...rows].join('\n')

const startMarker = '<!-- scripts:start -->'
const endMarker = '<!-- scripts:end -->'
const readme = fs.readFileSync(readmePath, 'utf8')

const startIndex = readme.indexOf(startMarker)
const endIndex = readme.indexOf(endMarker)

if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
  console.error(
    '[sync-readme] Unable to find script markers in README. Please ensure the file contains <!-- scripts:start --> and <!-- scripts:end -->.'
  )
  process.exit(1)
}

const nextReadme =
  readme.slice(0, startIndex + startMarker.length) +
  '\n\n' +
  table +
  '\n\n' +
  readme.slice(endIndex)

fs.writeFileSync(readmePath, nextReadme)
console.log('[sync-readme] README scripts table updated.')

#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const roots = ['docs', 'runbooks']
const boldHeadingRegex = /^\*\*(.+?)\*\*\s*$/

function walk(dir, handler) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, handler)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      handler(fullPath)
    }
  }
}

function normalizeBoldHeadings(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const lines = original.split('\n')
  let inFence = false
  let changed = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.match(boldHeadingRegex)
    if (!match) continue

    const headingText = match[1].trim()
    if (!headingText) continue

    lines[i] = `### ${headingText}`
    changed = true
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'))
    console.log(`Updated headings in ${filePath}`)
  }
}

for (const root of roots) {
  const fullRoot = path.join(process.cwd(), root)
  if (!fs.existsSync(fullRoot)) continue
  walk(fullRoot, normalizeBoldHeadings)
}

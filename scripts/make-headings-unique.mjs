#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const roots = ['docs', 'runbooks']

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

function makeHeadingsUnique(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const lines = original.split('\n')
  const counts = new Map()
  let changed = false
  let parentHeading = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const headingMatch = line.match(/^(#{2,6})\s+(.+?)\s*$/)
    if (!headingMatch) continue

    const level = headingMatch[1].length
    let text = headingMatch[2]

    if (level === 2) {
      parentHeading = text
    }

    // Skip headings that already include an em dash hint
    if (text.includes(' — ')) {
      const normalized = text.toLowerCase()
      counts.set(normalized, (counts.get(normalized) || 0) + 1)
      continue
    }

    const key = text.toLowerCase()
    const seen = counts.get(key) || 0
    counts.set(key, seen + 1)

    if (seen === 0) continue

    const suffix = parentHeading ? ` — ${parentHeading}` : ` — section ${seen + 1}`
    text = `${text}${suffix}`
    lines[i] = `${headingMatch[1]} ${text}`
    changed = true
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'))
    console.log(`Deduped headings in ${filePath}`)
  }
}

for (const root of roots) {
  const fullRoot = path.join(process.cwd(), root)
  if (!fs.existsSync(fullRoot)) continue
  walk(fullRoot, makeHeadingsUnique)
}

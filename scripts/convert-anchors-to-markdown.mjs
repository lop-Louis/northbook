#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const roots = ['docs', 'runbooks', 'README.md', 'CONTRIBUTING.md', 'GOVERNANCE.md']
const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

function walkDir(dir, handler) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath, handler)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      handler(fullPath)
    }
  }
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, '')
}

function convertAnchors(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  let replaced = false
  const updated = original.replace(anchorRegex, (_match, href, body) => {
    const label = stripHtml(body).replace(/\s+/g, ' ').trim()
    if (!label) return body
    replaced = true
    return `[${label}](${href})`
  })

  if (replaced) {
    fs.writeFileSync(filePath, updated)
    console.log(`Converted anchors in ${filePath}`)
  }
}

for (const root of roots) {
  const fullPath = path.join(process.cwd(), root)
  if (!fs.existsSync(fullPath)) continue
  if (fs.statSync(fullPath).isDirectory()) {
    walkDir(fullPath, convertAnchors)
  } else if (fullPath.endsWith('.md')) {
    convertAnchors(fullPath)
  }
}

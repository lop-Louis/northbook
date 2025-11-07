import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const repoRoot = process.cwd()
const roots = [path.join(repoRoot, 'docs'), path.join(repoRoot, 'runbooks')]
const excludedDirs = new Set(['.git', 'node_modules', 'public', '.vitepress'])

function collectMarkdownFiles() {
  const files = []

  for (const root of roots) {
    if (!fs.existsSync(root)) continue
    walk(root, files)
  }

  return files
}

function walk(dir, bucket) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (excludedDirs.has(entry.name)) continue

    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walk(entryPath, bucket)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      bucket.push(entryPath)
    }
  }
}

function extractIntro(content) {
  const markerIndex = content.indexOf('\n## ')
  return markerIndex === -1 ? content : content.slice(0, markerIndex)
}

function hasCTA(intro, attr) {
  const regex = new RegExp(`data-${attr}`)
  return regex.test(intro)
}

function runScan() {
  const files = collectMarkdownFiles()
  const issues = []
  let inspected = 0

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    const relative = path.relative(repoRoot, filePath)

    // Skip layout: home pages
    if (data && data.layout === 'home') continue

    const intro = extractIntro(content)
    const primary = hasCTA(intro, 'primary-action')
    const secondary = hasCTA(intro, 'secondary-action')

    if (!primary || !secondary) {
      const missing = [!primary ? 'primary action' : null, !secondary ? 'secondary action' : null]
        .filter(Boolean)
        .join(' & ')
      issues.push(`${relative}: Missing ${missing} CTA before the first section heading`)
    } else {
      inspected++
    }
  }

  if (issues.length) {
    console.log('UX scan found issues:')
    for (const issue of issues) {
      console.log(`- ${issue}`)
    }
    process.exitCode = 1
    return
  }

  console.log(`UX scan passed across ${inspected} markdown files with CTA pairs.`)
}

runScan()

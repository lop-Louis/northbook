import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const repoRoot = process.cwd()
const roots = [path.join(repoRoot, 'docs'), path.join(repoRoot, 'runbooks')]
const excludedDirs = new Set(['.git', 'node_modules', 'public', '.vitepress'])
const MAX_PRIMARY_ACTION_LENGTH = Number(process.env.PRIMARY_ACTION_MAX_CHARS ?? 140)

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

function checkPrimaryAction(data) {
  const issues = []
  const value = typeof data.primary_action === 'string' ? data.primary_action.trim() : ''

  if (!value) return issues

  if (value.length > MAX_PRIMARY_ACTION_LENGTH) {
    issues.push(`Primary action exceeds ${MAX_PRIMARY_ACTION_LENGTH} characters`)
  }

  if (/primary action/i.test(value)) {
    issues.push('Primary action copy should not reference “Primary action” (keep it user-facing)')
  }

  if (!/^[A-Z]/.test(value)) {
    issues.push('Primary action should start with a capitalized verb (e.g., "Use", "Apply")')
  }

  return issues
}

function checkHeadingRhythm(content) {
  const issues = []
  const headingRegex = /^#{1,6}\s+/gm
  let prevLevel = null

  for (const match of content.matchAll(headingRegex)) {
    const level = match[0].trim().split(' ')[0].length
    if (level === 1) {
      prevLevel = 1
      continue
    }

    if (prevLevel !== null && level > prevLevel + 1) {
      issues.push(`Heading level jumps from H${prevLevel} to H${level}`)
    }

    prevLevel = level
  }

  return issues
}

function runScan() {
  const files = collectMarkdownFiles()
  const problems = []
  let inspected = 0

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    const relativePath = path.relative(repoRoot, filePath)
    const fileIssues = []

    if (data && data.primary_action) {
      inspected++
      fileIssues.push(...checkPrimaryAction(data))
    }

    fileIssues.push(...checkHeadingRhythm(content))

    if (fileIssues.length) {
      problems.push({ file: relativePath, issues: fileIssues })
    }
  }

  if (problems.length) {
    console.log('UX scan found issues:')
    for (const problem of problems) {
      console.log(`- ${problem.file}`)
      for (const issue of problem.issues) {
        console.log(`  • ${issue}`)
      }
    }
    process.exitCode = 1
    return
  }

  console.log(`UX scan passed across ${inspected} markdown files with primary_action frontmatter.`)
}

runScan()

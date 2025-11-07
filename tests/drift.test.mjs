import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import matter from 'gray-matter'

const TEST_DIR = 'tests/fixtures/docs-drift'
const RUNBOOKS_DIR = 'tests/fixtures/runbooks-drift'
const SCRIPT = 'scripts/drift.mjs'

function createTestFile(filename, frontmatter, content = 'Content') {
  const filePath = path.join(TEST_DIR, filename)
  const fullContent = matter.stringify(content, frontmatter)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, fullContent)
}

function runDrift() {
  const stdout = execSync(`node ${SCRIPT}`, {
    env: { ...process.env, DOCS: TEST_DIR, RUNBOOKS: RUNBOOKS_DIR, DRIFT_FORMAT: 'json' },
    encoding: 'utf8'
  })
  return JSON.parse(stdout)
}

describe('Drift audit', () => {
  before(() => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true })
    if (fs.existsSync(RUNBOOKS_DIR)) fs.rmSync(RUNBOOKS_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(RUNBOOKS_DIR, { recursive: true })
  })

  after(() => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true })
    if (fs.existsSync(RUNBOOKS_DIR)) fs.rmSync(RUNBOOKS_DIR, { recursive: true })
  })

  it('warns on placeholder tokens', () => {
    createTestFile(
      'placeholder.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 30,
        change_type: 'patch',
        status: 'live',
        nav: ['none']
      },
      'Replace YOUR_TOKEN before shipping'
    )

    const result = runDrift()
    assert.strictEqual(result.status, 'warning')
    assert.ok(
      result.warnings.some(msg => msg.includes('placeholder')),
      'Expected placeholder warning'
    )
  })

  it('warns when patch exceeds limit', () => {
    const largeContent = 'Line\n'.repeat(300)
    createTestFile(
      'large.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 30,
        change_type: 'patch',
        status: 'live',
        nav: ['none']
      },
      largeContent
    )

    const result = runDrift()
    assert.strictEqual(result.status, 'warning')
    assert.ok(
      result.warnings.some(msg => msg.includes('patch')),
      'Expected patch size warning'
    )
  })
})

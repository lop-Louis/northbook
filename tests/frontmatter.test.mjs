import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const TEST_DIR = 'tests/fixtures/docs-frontmatter'
const RUNBOOKS_DIR = 'tests/fixtures/runbooks-frontmatter'
const SCRIPT = 'scripts/frontmatter-lint.mjs'

function createTestFile(filename, frontmatter, content = 'Content') {
  const filePath = path.join(TEST_DIR, filename)
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${typeof v === 'string' && !v.startsWith('@') ? v : JSON.stringify(v)}`)
    .join('\n')
  const fullContent = `---\n${fm}\n---\n\n${content}`
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, fullContent)
  return filePath
}

function runLint() {
  try {
    const stdout = execSync(`node ${SCRIPT}`, {
      env: {
        ...process.env,
        DOCS: TEST_DIR,
        RUNBOOKS: RUNBOOKS_DIR,
        FRONTMATTER_FORMAT: 'json'
      },
      encoding: 'utf8'
    })
    return { success: true, data: JSON.parse(stdout) }
  } catch (error) {
    const output = (error.stdout || error.stderr || '').trim()
    return {
      success: false,
      data: output ? JSON.parse(output) : null,
      code: error.status
    }
  }
}

describe('Frontmatter Lint', () => {
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

  it('passes with valid metadata', () => {
    createTestFile('valid.md', {
      title: 'Valid',
      band: 'A',
      owner: "'@user'",
      refresh_after_days: 30,
      change_type: 'patch',
      status: 'live',
      nav: ['sidebar']
    })

    const result = runLint()
    assert.ok(result.success, 'frontmatter lint should pass')
    assert.strictEqual(result.data?.status, 'passed')
  })

  it('fails when band is not A', () => {
    createTestFile('invalid-band.md', {
      title: 'Invalid',
      band: 'B',
      owner: "'@user'",
      refresh_after_days: 30,
      change_type: 'patch',
      status: 'live',
      nav: ['sidebar']
    })

    const result = runLint()
    assert.ok(!result.success)
    const violations = result.data?.violations || []
    assert.ok(violations.some(v => v.field === 'band'))
  })

  it('fails when required fields are missing', () => {
    createTestFile('missing.md', {
      title: 'Missing'
    })

    const result = runLint()
    assert.ok(!result.success)
    const violations = result.data?.violations || []
    assert.ok(violations.some(v => v.field === 'band'))
    assert.ok(violations.some(v => v.field === 'nav'))
  })
})

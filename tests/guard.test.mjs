import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import matter from 'gray-matter'

const TEST_DIR = 'tests/fixtures/docs-test'
const GUARD_SCRIPT = 'scripts/guard.mjs'

// Helper to create test markdown files
function createTestFile(filename, frontmatter, content) {
  const filePath = path.join(TEST_DIR, filename)
  const fullContent = matter.stringify(content, frontmatter)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, fullContent)
  return filePath
}

function runGuard() {
  try {
    // Temporarily override DOCS directory for testing
    const stdout = execSync(`node ${GUARD_SCRIPT}`, {
      env: { ...process.env, DOCS: TEST_DIR, GUARD_FORMAT: 'json' },
      encoding: 'utf8'
    })
    const parsed = stdout ? JSON.parse(stdout) : {}
    return { success: true, output: stdout, data: parsed }
  } catch (error) {
    const combined = `${error.stdout || ''}${error.stderr || ''}`.trim()
    let parsed = null
    if (combined) {
      try {
        parsed = JSON.parse(combined)
      } catch (err) {
        // ignore parse errors, keep raw output
      }
    }
    return {
      success: false,
      output: combined,
      data: parsed,
      code: error.status
    }
  }
}

describe('Content Guard - Forbidden Patterns', () => {
  before(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true })
    }
    fs.mkdirSync(TEST_DIR, { recursive: true })
  })

  after(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true })
    }
  })

  it('should block internal URLs', () => {
    createTestFile(
      'internal-url.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'live'
      },
      'Visit https://internal.company.com for more'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Guard should fail for internal URLs')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => /internal/i.test(msg)),
      'Should detect internal URLs'
    )
  })

  it('should block ticket IDs', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    createTestFile(
      'ticket-id.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'live'
      },
      'Fixed in JIRA-1234'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Guard should fail for ticket IDs')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => /ticket/i.test(msg)),
      'Should report ticket violation'
    )
  })
})

console.log('✅ All content guard tests configured')

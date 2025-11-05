import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const TEST_DIR = 'tests/fixtures/docs-test'
const GUARD_SCRIPT = 'scripts/guard.mjs'

// Helper to create test markdown files
function createTestFile(filename, frontmatter, content) {
  const filePath = path.join(TEST_DIR, filename)
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => {
      // Quote values that start with @ (YAML special character)
      if (typeof v === 'string' && v.startsWith('@')) {
        return `${k}: '${v}'`
      }
      return `${k}: ${JSON.stringify(v).replace(/"/g, '')}`
    })
    .join('\n')
  const fullContent = `---\n${fm}\n---\n\n${content}`
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

describe('Content Guard - Frontmatter Validation', () => {
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

  it('should pass with valid Band A frontmatter', () => {
    createTestFile(
      'valid.md',
      {
        title: 'Test Page',
        band: 'A',
        owner: '@testuser',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'live'
      },
      'Valid content'
    )

    const result = runGuard()
    assert.strictEqual(result.success, true, 'Guard should pass for valid content')
    assert.strictEqual(result.data?.status, 'green')
  })

  it('should fail when band is not A', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    createTestFile(
      'invalid-band.md',
      {
        title: 'Test',
        band: 'B',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'live'
      },
      'Content'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Guard should fail for non-A band')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => msg.includes('band=B not allowed')),
      'Should report band violation'
    )
  })

  it('should fail when required fields are missing', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    createTestFile(
      'missing-fields.md',
      {
        title: 'Test',
        band: 'A'
      },
      'Content'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Guard should fail for missing fields')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => /missing/i.test(msg)),
      'Should report missing fields'
    )
  })

  it('should fail for invalid change_type', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    createTestFile(
      'invalid-change.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'huge',
        status: 'live'
      },
      'Content'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Guard should fail for invalid change_type')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => msg.includes("Invalid change_type='huge'")),
      'Should indicate invalid change_type'
    )
  })

  it('should fail for invalid status', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    createTestFile(
      'invalid-status.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'deleted'
      },
      'Content'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Guard should fail for invalid status')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => msg.includes("Invalid status='deleted'")),
      'Should indicate invalid status'
    )
  })
})

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

  it('should warn about internal URLs', () => {
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
    const messages = result.data?.yellow || []
    assert.ok(
      messages.some(msg => /internal/i.test(msg)),
      'Should detect internal URLs'
    )
  })

  it('should warn about ticket IDs', () => {
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
    const messages = result.data?.yellow || []
    assert.ok(
      messages.some(msg => /ticket/i.test(msg)),
      'Should detect ticket IDs'
    )
  })

  it('should fail for placeholder tokens', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    createTestFile(
      'placeholder.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'live'
      },
      'API key: YOUR_TOKEN_REPLACE_ME'
    )

    const result = runGuard()
    assert.strictEqual(result.success, false, 'Should fail for placeholder tokens')
    const messages = result.data?.red || []
    assert.ok(
      messages.some(msg => /placeholder/i.test(msg)),
      'Should report placeholder use'
    )
  })
})

describe('Content Guard - Change Size Validation', () => {
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

  it('should warn when patch exceeds line limit', () => {
    const largeContent = 'Line\n'.repeat(300)

    createTestFile(
      'large-patch.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'patch',
        status: 'live'
      },
      largeContent
    )

    const result = runGuard()
    const messages = result.data?.yellow || []
    assert.ok(
      messages.some(msg => /exceeds.*patch/i.test(msg)),
      'Should warn about large patch'
    )
  })

  it('should allow major changes with large content', () => {
    fs.rmSync(TEST_DIR, { recursive: true })
    fs.mkdirSync(TEST_DIR, { recursive: true })

    const largeContent = 'Line\n'.repeat(500)

    createTestFile(
      'large-major.md',
      {
        title: 'Test',
        band: 'A',
        owner: '@test',
        refresh_after_days: 90,
        change_type: 'major',
        status: 'live'
      },
      largeContent
    )

    const result = runGuard()
    // Should not have size warnings for major changes
    const warnings = result.data?.yellow || []
    assert.strictEqual(warnings.length, 0, 'Major changes can be large without warnings')
    assert.strictEqual(result.success, true)
  })
})

console.log('✅ All content guard tests configured')

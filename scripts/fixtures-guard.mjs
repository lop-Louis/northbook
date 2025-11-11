#!/usr/bin/env node
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repoRoot = process.cwd()
const fixtures = [
  {
    name: 'good-page',
    file: 'fixtures/good-page.md',
    checks: [
      { cmd: 'guard', expectSuccess: true },
      { cmd: 'frontmatter', expectSuccess: true },
      { cmd: 'ux', expectSuccess: true }
    ]
  },
  {
    name: 'missing-opener',
    file: 'fixtures/missing-opener.md',
    checks: [{ cmd: 'ux', expectSuccess: false }]
  },
  {
    name: 'bad-cta-label',
    file: 'fixtures/bad-cta-label.md',
    checks: [{ cmd: 'guard', expectSuccess: false }]
  },
  {
    name: 'no-mapping',
    file: 'fixtures/no-mapping.md',
    checks: [{ cmd: 'frontmatter', expectSuccess: false }]
  },
  {
    name: 'sanitization-leak',
    file: 'fixtures/sanitization-leak.md',
    checks: [{ cmd: 'guard', expectSuccess: false }]
  }
]

function commandForCheck(cmd) {
  switch (cmd) {
    case 'guard':
      return ['node', ['scripts/guard.mjs']]
    case 'frontmatter':
      return ['node', ['scripts/frontmatter-lint.mjs']]
    case 'ux':
      return ['node', ['scripts/ux-scan.mjs']]
    default:
      throw new Error(`Unknown fixture command: ${cmd}`)
  }
}

function runFixture({ name, file, checks }) {
  const abs = path.join(repoRoot, file)
  if (!fs.existsSync(abs)) {
    console.warn(`Skipping fixture ${name}: ${file} not found`)
    return true
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `fixture-${name}-`))
  fs.copyFileSync(abs, path.join(tmpDir, 'index.md'))

  for (const check of checks) {
    const [cmd, args] = commandForCheck(check.cmd)
    const result = spawnSync(cmd, args, {
      cwd: repoRoot,
      env: { ...process.env, DOCS: tmpDir, RUNBOOKS: tmpDir },
      encoding: 'utf8'
    })
    const passed = result.status === 0
    if (check.expectSuccess && !passed) {
      console.error(
        `Fixture "${name}" (${check.cmd}) should pass but failed.\n${result.stdout}\n${result.stderr}`
      )
      return false
    }
    if (!check.expectSuccess && passed) {
      console.error(`Fixture "${name}" (${check.cmd}) should fail but passed.`)
      return false
    }
  }
  return true
}

let allPass = true
for (const fixture of fixtures) {
  if (!runFixture(fixture)) {
    allPass = false
  }
}

if (!allPass) {
  process.exit(1)
} else {
  console.log('Fixture guard checks passed.')
}

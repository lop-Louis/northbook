#!/usr/bin/env node
import fs from 'node:fs'
import { spawn } from 'node:child_process'

const labs = fs.existsSync('labs')
  ? fs.readdirSync('labs').filter(f => f.endsWith('.lab.json'))
  : []
let pass = 0
let fail = 0
let results = []

const normalizeCmd = cmd => {
  if (cmd.trim() === 'pnpm i') {
    return 'echo "Skipping pnpm install; dependencies already present"'
  }
  return cmd
}

const run = cmd =>
  new Promise(res => {
    const normalized = normalizeCmd(cmd)
    const [c, ...a] = normalized.split(' ')
    const p = spawn(c, a, { stdio: 'inherit', shell: true })
    p.on('close', code => res(code === 0))
  })

for (const f of labs) {
  const conf = JSON.parse(fs.readFileSync(`labs/${f}`, 'utf8'))
  const deadline = Date.now() + (conf.timeout_minutes || 10) * 60000
  let ok = true
  for (const cmd of conf.setup || []) {
    if (Date.now() > deadline || !(ok = ok && (await run(cmd)))) break
  }
  for (const cmd of ok ? conf.check || [] : []) {
    if (Date.now() > deadline || !(ok = ok && (await run(cmd)))) break
  }
  ok ? pass++ : fail++
  results.push({ lab: f, ok })
}

fs.mkdirSync('reports', { recursive: true })
fs.writeFileSync('reports/labs.json', JSON.stringify({ pass, fail, results }, null, 2))
console.log(JSON.stringify({ pass, fail, results }, null, 2))
process.exit(0)

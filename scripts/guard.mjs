import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const DOCS = 'docs'
const forbidden = [
  /\bhttps?:\/\/(intra|internal|corp)[^\s)]+/i,
  /\bJIRA-\d+\b/i,
  /\b[A-Z]{2,}-\d+\b/,
  /\bTopdanmark\b/i
]

let red = []
let yellow = []

function checkFile(p) {
  const raw = fs.readFileSync(p, 'utf8')
  const { data, content } = matter(raw)
  const miss = ['title','band','owner','refresh_after_days','change_type','status']
    .filter(k => data[k] == null)
  if (miss.length) red.push(`${p} missing ${miss.join(', ')}`)
  if (String(data.band).trim() !== 'A') red.push(`${p} band=${data.band} not allowed`)
  const hits = forbidden.filter(rx => rx.test(content))
  if (hits.length) yellow.push(`${p} possible internal reference`)
  const lines = raw.split('\n').length
  if (data.change_type === 'patch' && lines > 200) yellow.push(`${p} big change for patch`)
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p)
    else if (p.endsWith('.md')) checkFile(p)
  }
}

walk(DOCS)

if (red.length) {
  console.error('Red failures:\n' + red.map(x => ' - ' + x).join('\n'))
  process.exit(1)
}
if (yellow.length) {
  console.log('::warning::Yellow flags\n' + yellow.map(x => '- ' + x).join('\n'))
}

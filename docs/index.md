---
title: Northbook
layout: home
band: A
owner: '@lop'
refresh_after_days: 120
change_type: patch
status: live
last_reviewed: '2025-01-15'
audience: Anyone looking for Northbook guidance and entry points
tone: Plainspoken, candid, energetic
narrative_goal: Orient newcomers to the core pillars and where to start
hero:
  name: Northbook
  text: Orientation → Checks → Receipts.
  image:
    src: /logo-symbol.png
    alt: Northbook logo
  tagline: Start, Guides, Runbooks, and Fast support are wired together so every CTA lands on the next action.
  actions:
    - theme: brand
      text: Start now
      link: /start-here/
    - theme: alt
      text: Ask a question
      link: https://github.com/lop-louis/northbook/issues/new?labels=kl,question&title=[Question]%20PATH
features:
  - title: Orient in seconds
    details: Wayfinding shortcuts and the Start hub get you to the right doc without guessing.
    link: /start-here/find
    linkText: Use Wayfinding
  - title: Ship with receipts
    details: Quick-Run and Release receipts prove every change before you merge.
    link: /ops/quick-run
    linkText: Run Quick-Run
  - title: Escalate cleanly
    details: Fast support flows and runbooks keep interrupts and escalations tidy.
    link: /fix/
    linkText: Open Fast support
nav:
  - none
---

Find the answer. Use it now. <a href="./start-here/" data-primary-action>Use the starting links</a> or <a href="./runbooks/index" data-secondary-action>Browse the runbooks index</a>.

Every Start, Guide, Runbook, and Fast support page now links to the next action—orientation → checks → receipts without detours.

If this didn’t answer your question in 60 seconds, <a href="https://github.com/lop-louis/northbook/issues/new?labels=kl,feedback&title=%5BFeedback%5D%20Homepage&body=Page:%20https://northbook.guide/" data-secondary-action>tell us so we can fix it</a>.

## Governance & Safety

Automation enforces: frontmatter completeness, sanctioned band, sanitization rules, secret scan, build integrity. See [Anti-drift Content Governance](./governance) for lifecycle and gate details.

## FAQ Highlights

- New joiner? See [FAQ for New Joiners](./faq-new-joiners)
- Making decisions? Start with [Decision Spine](./decision-spine)
- Not sure if content belongs? Re-check [Band A](./band-a) examples

## Opening a PR

Before submitting:

- `pnpm run guard`
- `pnpm run docs:build`
- Ensure no internal names, hard dates, or IDs
- Keep scope aligned with declared `change_type`

## Future (Non-binding)

Monthly release captures meaningful changes in [releases](./release.md).

- Optional analytics for drift scoring
- Inclusive language heuristics
- Link freshness scoring

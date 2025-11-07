---
title: site-v2025.11
band: A
owner: '@lop'
refresh_after_days: 90
change_type: patch
status: live
last_reviewed: '2025-11-06'
audience: Readers tracking what changed in the v2025.11 release
tone: 'Plainspoken, candid, energetic'
narrative_goal: 'Summarize the notable additions, updates, and fixes in this tag'
primary_action: Use this changelog to understand what shipped in the tag.
---

Back to [Releases](../release.md)

# site-v2025.11 · Patch hygiene

<a href="#added" data-primary-action>Use this changelog to understand what shipped in the tag.</a>

**Tag date:** Mid-November release window

## Added

- “Was this helpful?” control wired to GA4 on updated pages.
- CI: Markdown link checker.
- CI: PR required-fields enforcer (Why, Exit metric, Stream/Seam ID, Exception).
- CI: Homepage↔Runbooks assertion.

## Updated

- Homepage: removed “Runbooks live here” claim until `/runbooks/` ships.
- Decision Spine, Answer Ledger: added Governance cross-links.

## Fixed

- Broken internal links caught by linkcheck.

### Governance receipts

- Zero 404s at build.
- At least one page emitted `doc_helped` events.

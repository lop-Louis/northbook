---
title: Release ops bundle · 2025-11
owner: '@lop'
date: '2025-11-09'
guardrail_mapping: governance-state
release_tag: site-v2025.11
status: live
---

# Release ops bundle · 2025-11

Monthly release artefacts live here. Follow the release folder decision for naming rules.

## Decisions

- [Cloudflare analytics decision](../../../docs/decisions/cloudflare-analytics.md)
- [Release-centric ops folders](../../../docs/decisions/release-folders.md)
- [Automate state and release pages](../../../docs/decisions/automation-state-pages.md)

## Signals

- [Analytics snapshot](../../../reports/cloudflare-snapshot.json) — Generated via pnpm run analytics:snapshot
- [Cloudflare export template](../../../reports/cloudflare-export.sample.json) — Shows the expected sanitized structure
- [Labs report](../../../reports/labs.json) — Quick-Run + Proof Run lab results

## Receipts

- [Receipts 2025-11](../../../docs/receipts/index.md#2025-11)
- [State visibility](../../../docs/runbooks/state-visibility.md)

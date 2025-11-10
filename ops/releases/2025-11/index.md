---
title: Release ops bundle · 2025-11
owner: '@lop'
date: '2025-11-09'
guardrail_mapping: governance-state
release_tag: site-v2025.11
status: live
---

# Release ops bundle · 2025-11

Monthly release artefacts live here. Follow the [release folder decision](../../../docs/decisions/release-folders.md) for naming rules.

## Decisions

- [Cloudflare analytics decision](../../../docs/decisions/cloudflare-analytics.md) — Signals now come from a sanitized Cloudflare export + snapshot.
- [Release-centric ops folders](../../../docs/decisions/release-folders.md) — Every release owns a bundle like this one.

## Signals

- Analytics snapshot: [`reports/cloudflare-snapshot.json`](../../../reports/cloudflare-snapshot.json) (generated via `pnpm run analytics:snapshot`).
- Source export: [`reports/cloudflare-export.sample.json`](../../../reports/cloudflare-export.sample.json) (pattern for the real export).
- Labs report: [`reports/labs.json`](../../../reports/labs.json).

## Receipts & state

- Public receipts entry: [`docs/receipts/index.md`](../../../docs/receipts/index.md#2025-11) quotes the snapshot above.
- State guidance: [`docs/runbooks/state-visibility.md`](../../../docs/runbooks/state-visibility.md) links here for this cycle.

## Checklist

- [x] Index created with required frontmatter.
- [x] Decisions linked.
- [x] Signals + receipts referenced.

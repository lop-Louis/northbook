---
title: Decision — Automate state and release pages
band: A
owner: '@lop'
change_type: patch
status: live
refresh_after_days: 60
decider: '@lop'
decision_date: '2025-11-09'
next_review: '2026-01-15'
success_metric: State page and release indices regenerate automatically from ops metadata within 10 minutes and fail CI when out of sync.
related_contract: ../contracts/northbook-operations-contract-v1.md
release_tag: site-v2025.11
---

# Automate state and release pages decision

Keep the State page, release indices, and cross-links generated from the release metadata. [Review the frame](#frame) or [open the latest bundle](../../ops/releases/2025-11/index.md).

## Frame

### Problem

Now that release folders centralize artefacts, manually updating State/Receipts/indices is redundant and error-prone.

### Constraints

- Must remain local-first and finish under the 10-minute CI budget.
- Generated files still need frontmatter (`owner`, `date`, `guardrail_mapping`, `release_tag`).
- CI must block when generated files drift.

### Stakes

- **If successful:** One command regenerates indices and the State page, CI verifies they’re current, and every release consistently links decisions, signals, and receipts.
- **If unsuccessful:** Operators keep duplicating work, and releases drift out of sync with receipts.

## Work plan

1. Build a Node script that scans `ops/releases/YYYY-MM/manifest.json` files and emits deterministic `index.md` files plus `docs/state/index.md`.
2. Integrate the script into `pnpm run docs:guard` and a dedicated CI step so PRs fail when generated files aren’t committed.
3. Document the new workflow in the release bundle and runbooks.

## Acceptance checks

- Generator runs locally and in CI in < 10 minutes.
- Generated files include required frontmatter and sections (Decisions, Signals, Receipts).
- State page reflects the latest release plus links to all bundles.
- CI fails if `pnpm run state:check` detects pending changes.

## Stop rule

If automation slows CI beyond 10 minutes or flakes >5% of builds over two cycles, pause it, revert to manual updates, and revisit the approach.

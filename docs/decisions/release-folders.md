---
title: Decision — Release-centric ops folders
band: A
owner: '@lop'
change_type: patch
status: live
refresh_after_days: 60
decider: '@lop'
decision_date: '2025-11-09'
next_review: '2026-01-15'
success_metric: Every release stores its ops artefacts under `ops/releases/YYYY-MM/`, Receipts and State link to the index, and CI guards the structure.
related_contract: ../contracts/northbook-operations-contract-v1.md
release_tag: site-v2025.11
---

# Release-centric ops folders decision

Cluster every release’s artefacts under one predictable directory. [Review the frame](#frame) or [open the 2025‑11 bundle](../../ops/releases/2025-11/index.md).

## Frame

### Problem

Ops artefacts (receipts, analytics snapshots, decision logs) were scattered across `docs/`, `reports/`, and ad-hoc folders. Reviewers had to guess which files belonged to a release, making monthly tagging and audits slow.

### Constraints

- Governance & Decisions seam requires visible state + receipts + decisions per release.
- Structure must be lightweight enough to maintain every month and run locally.
- CI needs to prevent future drift (files outside release folders, missing index updates).

### Stakes

- **If successful:** Contributors can open `ops/releases/YYYY-MM/index.md` to see the whole month, Receipts/State link there, and quality gates ensure every new artefact lands in the right folder.
- **If unsuccessful:** Release artefacts keep drifting, reviewers waste time locating files, and the traceability map breaks.

## Options

1. **Ad-hoc folders (status quo)** — Leave files where they are. Pros: zero work. Cons: no discoverability, high manual effort.
2. **Single flat release log** — Append everything to one markdown file. Pros: one surface. Cons: conflicts, unreadable history.
3. **Release-centric directories (chosen)** — Create `ops/releases/YYYY-MM/` with an `index.md` that links to artefacts and documents decisions. Pros: predictable path, easy to script, aligns with monthly cadence.

## Decide

- **Choice:** Option 3 — Release-centric directories.
- **Owner:** Louis (Product/Ops).
- **Scope:** Create `ops/releases/2025-11/` as the pilot, document naming conventions, update State/Receipts pages, and add a CI check.
- **Naming:** Directories follow `YYYY-MM`. Files inside follow `YYYY-MM-DD-short-name.md/json`.

## Work plan

1. Create `ops/releases/2025-11/index.md` with frontmatter (`owner`, `date`, `guardrail_mapping`, `release_tag`) and sections for Decisions, Signals, Receipts.
2. Link the pilot index from the State and Receipts pages.
3. Add `scripts/release-folders-check.mjs` + CI step to enforce naming/frontmatter/index presence.
4. Document the change in the release bundle (manifest + State ledger entry) so reviewers see it in the next tag.

## Acceptance checks

- Every release folder includes `index.md` with owner/date/guardrail mapping/release tag.
- Index lists decisions, signals, and receipts for the cycle with working links.
- State + Receipts pages reference the latest release index.
- CI blocks PRs when a release folder is missing an index or required frontmatter.

## Stop rule

If finding artefacts in this structure takes >30 minutes per week across two cycles, propose an adjustment (hybrid or flat) via a new decision entry.

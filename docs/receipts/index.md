---
title: Receipts
band: A
owner: '@lop'
change_type: patch
refresh_after_days: 30
status: live
nav_group: Start
nav_order: 25
nav_label: Release receipts
nav:
  - sidebar
---

Find the answer. Use it now. <a href="../ops/quick-run" data-primary-action>Run the Quick-Run</a> or <a href="../labs/link-drift" data-secondary-action>Open the Proof Run</a>.

### 2025-11

**Adoption** — Proof Run passed on link drift in under 10 minutes.  
**Quality** — CTA yellows 39 → 0 after auto-fix.  
**Credibility** — Release tag visible in footer for this build.

## Cloudflare analytics snapshot {#cloudflare-snapshot}

- **Command:** `pnpm run analytics:snapshot` (requires `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_ANALYTICS_TOKEN`)
- **Outputs:** `receipts/cloudflare-snapshot.json` (machine) and `receipts/cloudflare-summary.md` (human)
- **Signals covered:** Adoption (pages touched, time-to-answer), Quality (lab pass rate, broken links), Credibility (state freshness, exceptions resolved)
- **Baseline:** Store 14-day daily snapshots under `receipts/baseline/` and pass `--compare` pointing to the baseline you want deltas against.
- **SLA:** Script must finish in <10 minutes; abort and log a stop-rule breach otherwise.

## Related references

- [Monthly cadence](../monthly-release.md) — Use this process when you prep the next tag.
- [Transition operating promises](../runbooks/transition-operating-promises.md) — Paste links to fulfilled promises in each receipt.
- [Fast support index](../fix/) — Note any new fast-support flows launched during the release.

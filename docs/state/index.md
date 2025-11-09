---
title: State
band: A
owner: '@lop'
change_type: patch
refresh_after_days: 30
status: live
last_reviewed: '2025-02-15'
nav_group: Start
nav_order: 20
nav_label: State page
nav:
  - sidebar
---

# State

Public state for the Northbook contract. <a href="../receipts/#cloudflare-snapshot" data-primary-action>Open the latest receipt</a> or <a href="../playbook/north-star-guardrails" data-secondary-action>Review the guardrails</a>.

> Current snapshot uses dry-run sample data until Cloudflare credentials are connected. Replace it by running `pnpm run analytics:snapshot` with real env vars.

## Adoption

| Signal                | Latest                     | Direction | Status     |
| --------------------- | -------------------------- | --------- | ---------- |
| Pages touched         | 29 unique slugs (last 24h) | Up good   | 🟢 Healthy |
| Median time-to-answer | Median 52 s (p80 68 s)     | Down good | 🟢 Healthy |

## Quality

| Signal               | Latest              | Direction | Status     |
| -------------------- | ------------------- | --------- | ---------- |
| Lab pass rate        | 93.6 % pass (44/47) | Up good   | 🟢 Healthy |
| Broken links per day | 6/day (6 total)     | Down good | 🔴 Breach  |

## Credibility

| Signal                      | Latest              | Direction | Status     |
| --------------------------- | ------------------- | --------- | ---------- |
| State page freshness        | 0 days since update | Down good | 🟢 Healthy |
| Exceptions resolved on time | 80 % on time (4/5)  | Up good   | 🔴 Breach  |

## Traceability

- **Receipts:** [Cloudflare snapshot log](../receipts/#cloudflare-snapshot) (current mode: dry-run sample)
- **Signal Registry:** [Definitions and kill criteria](../runbooks/signal-registry.md)
- **Decision link:** See [Set up Cloudflare analytics for measurement and receipts](../decision-spine.md)

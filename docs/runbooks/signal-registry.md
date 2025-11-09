---
title: Signal Registry
band: A
owner: '@lop'
change_type: minor
refresh_after_days: 30
status: live
audience: Signal stewards and reviewers verifying guardrail coverage
tone: Plainspoken, candid, energetic
narrative_goal: Show every signal’s source, cadence, and kill criteria in one place
nav_group: Runbooks
nav_order: 76
nav_label: Signal Registry
nav:
  - sidebar
---

# Signal Registry

Single source of truth for the signals backing the Northbook contract. Every entry lists id, description, source, refresh cadence, direction, thresholds, and kill criteria. <a href="../../reports/signal-registry.json" data-primary-action>Open the JSON artifact</a> or <a href="./cloudflare-analytics" data-secondary-action>Review the analytics runbook</a>.

## Active signals

| id                                | Type        | Description                                                             | Source + query                                                                                      | Refresh | Direction | Thresholds                              | Kill criteria                                       |
| --------------------------------- | ----------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------- | --------- | --------------------------------------- | --------------------------------------------------- |
| `adoption.pages_touched`          | Adoption    | Unique public doc/lab slugs receiving <400 responses per 14-day window. | Cloudflare GraphQL `httpRequestsAdaptiveGroups` filtered to `/docs` and `/labs`; unique path count. | Daily   | Up good   | ≥25 healthy, 15–24 watch, <15 breach    | <10 for 2 cycles → pause pilots + guardrail review  |
| `adoption.time_to_answer`         | Adoption    | Median time (s) from page load to first CTA completion.                 | Custom event `nb.time_to_answer.v1` median `elapsed_ms_bucket`.                                     | Daily   | Down good | ≤60 s healthy, 61–70 watch, >70 breach  | 80th percentile >75 s for 2 cycles → freeze UI bets |
| `quality.lab_pass_rate`           | Quality     | First-run pass rate for annex labs.                                     | Custom event `nb.lab_pass.v1` `result`.                                                             | Weekly  | Up good   | ≥92% healthy, 88–91% watch, <88% breach | <85% one cycle → run lab hardening sprint           |
| `quality.broken_links`            | Quality     | Counts of 4xx/5xx exits from `/docs` or `/labs`.                        | GraphQL `httpRequestsAdaptiveGroups` with `edgeResponseStatus ≥ 400`.                               | Daily   | Down good | ≤2/day healthy, 3–4 watch, ≥5 breach    | ≥5/day for 3 days → trigger Link Integrity run      |
| `credibility.state_freshness`     | Credibility | Days since `/state` frontmatter `last_reviewed`.                        | Local repo metadata + snapshot timestamp.                                                           | Daily   | Down good | ≤30 healthy, 31–40 watch, >40 breach    | >45 days → block releases until State refreshed     |
| `credibility.exceptions_resolved` | Credibility | % of exceptions resolved before expiry.                                 | Custom event `nb.exception_state.v1` `state`.                                                       | Weekly  | Up good   | 100% healthy, 90–99% watch, <90% breach | <80% one cycle → halt new exceptions                |

## Update rules

1. **Owner + steward** — Default to @lop unless the signal is delegated; update both JSON and this table together.
2. **Refresh cadence** — `refresh_after_days` ≤2× the observed SLA. Adoption signals stay daily even if Cloudflare keeps 30-day history.
3. **Queries** — Keep concise GraphQL or event formulas that can be pasted into the snapshot script.
4. **Direction** — Explicit `up`/`down` so receipts can color deltas correctly.
5. **Thresholds** — Use healthy/watch/breach buckets and cite the stop rule in plain language.
6. **Kill criteria** — Describe what action pauses or drops the signal (freeze, revert, sprint).

## Related references

- [Cloudflare analytics receipts](./cloudflare-analytics.md) — How these signals are sourced and sanitized.
- [Receipts](../receipts/index.md) — Where deltas post per cycle.
- [North Star & Guardrails](../playbook/north-star-guardrails) — Contract requiring the registry.

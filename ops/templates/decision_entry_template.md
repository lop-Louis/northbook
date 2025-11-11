---
title: '{{ concise decision name }}'
owner: 'louis'
date: '{{ yyyy-mm-dd }}'
band: 'a'
seam: '{{ navigation | governance | signals | tests | releases }}'
decision_id: '{{ dec-2025-xx }}'
baseline_window: 'last-30-days'
north_star_id: 'ns-001'
guardrail_id: '{{ gr-101 | gr-102 | gr-103 | gr-104 | gr-105 }}'
delta_type: 'people-capacity-risk'
stop_rule: 'freeze if lab-pass < 80% or time-to-answer worsens ≥20% for 7 days.'
tags:
  - 'v{{ yyyy.mm }}-{{ seam }}'
---

## context

One paragraph: the problem this decision resolves. Link prior state if relevant.

## decision

Single bet chosen, with 2–3 bullet tradeoffs.

## scope

What is covered now; what is explicitly out-of-scope.

## acceptance

- opener pattern enforced above first section
- frontmatter keys present (`bucket, north_star_id, guardrail_id, owner, band, date, cta_primary_label, cta_secondary_label, leading_metric, lagging_metric`)
- traceability complete (pr ↔ decision/exception ↔ guardrail ↔ page ↔ signal ↔ receipt)

## receipts (expected)

- leading: {{ metric-id }} target/range
- lagging: {{ metric-id }} target/range
- attach to tag: `v{{ yyyy.mm }}-{{ seam }}`

## freeze and exit

Trigger(s) and how to recover to baseline.

## links

- state snapshot (when shipped)
- related exceptions (if any)

---
exception_id: '{{ exc-2025-xx }}'
owner: 'louis'
date: '{{ yyyy-mm-dd }}'
seam: '{{ navigation | governance | signals | tests | releases }}'
expiry: '{{ yyyy-mm-dd }}' # ≤ 30 days
trigger: '{{ what forced this }}'
exit_criteria: '{{ proof metric back within 10% of baseline for 7 days }}'
public_log: true
tags:
  - 'v{{ yyyy.mm }}-{{ seam }}'
---

## reason

Short paragraph; name the guardrail being temporarily bypassed.

## mitigation

What protects users and the brand while this is active.

## rollback

Steps to revert if needed.

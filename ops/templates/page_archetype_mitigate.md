---
bucket: 'mitigate'
north_star_id: 'ns-001'
guardrail_id: 'gr-104'
owner: 'louis'
band: 'a'
date: '{{ yyyy-mm-dd }}'
cta_primary_label: 'choose'
cta_secondary_label: 'use'
leading_metric: 'm-time-to-freeze'
lagging_metric: 'm-time-to-recovery'
---

**why**: contain damage without selling the star.

**try this**:

- action 1: choose freeze path with exit criteria
- action 2: use rollback steps and capture receipts

**exit metric**: freeze within threshold; recovery within 7 days to within 10% baseline.

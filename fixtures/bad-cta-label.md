---
title: Bad CTA Label Fixture
band: A
owner: '@fixture'
refresh_after_days: 30
change_type: patch
status: live
bucket: operate
north_star_id: ns-001
guardrail_id: gr-103
cta_primary_label: Must use now
cta_secondary_label: See example runbook
leading_metric: m-lab-pass
lagging_metric: m-defect-rate-changed-pages
date: '2025-11-11'
tags:
  - v2025.11-test
decision_link: /decisions/dec-2025-11-ia-overhaul.md
---

# Bad CTA Label Fixture

This fixture intentionally uses a banned term in the CTA label. [Must use now](../docs/operate/index) or [See example runbook](../docs/operate/runbooks-index).

Exit metric: annex labs stay ≥ 0.9 pass rate.

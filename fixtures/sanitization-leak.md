---
title: Sanitization Leak Fixture
band: A
owner: '@fixture'
refresh_after_days: 30
change_type: patch
status: live
bucket: operate
north_star_id: ns-001
guardrail_id: gr-104
cta_primary_label: Use this guardrail
cta_secondary_label: See example runbook
leading_metric: m-nav-open
lagging_metric: m-time-to-answer
date: '2025-11-11'
decision_link: /decisions/dec-2025-11-ia-overhaul.md
tags:
  - v2025.11-test
---

# Sanitization Leak Fixture

Contains personal data like John.Doe@example.com and secrets such as password=12345 to trigger red-line sanitization.

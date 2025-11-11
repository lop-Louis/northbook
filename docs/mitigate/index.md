---
title: Mitigate fast
band: A
owner: '@platform-eng'
refresh_after_days: 45
change_type: patch
status: live
audience: People clearing high-volume interrupts in under 10 minutes
tone: practical
narrative_goal: Route teams to the right fix flow and keep freezes/receipts visible
nav_group: Mitigate
nav_order: 1
nav_label: Mitigate
nav:
  - slot: main
    label: Mitigate
  - sidebar
bucket: mitigate
north_star_id: ns-001
guardrail_id: gr-102
cta_primary_label: Choose a fix flow
cta_secondary_label: See example exception
leading_metric: m-time-to-freeze
lagging_metric: m-time-to-recovery
decision_link: /decisions/dec-2025-11-ia-overhaul.md
date: '2025-11-11'
---

# Mitigate fast

Contain the blast radius first, then recover with receipts. [Choose a fix flow](#fix-flows) or [See example exception](../governance/exceptions.md).
Exit metric: freezes trigger within 24 hours and recovery finishes inside 7 days.

::: tip Tiny receipts — Mitigate (v2025.11)

- m-time-to-freeze: 6 hours average
- m-time-to-recovery: 2.5 days
  [See the receipts](../signals/receipts/v2025.11-mitigate.md)
  :::

## How this lane works

1. **Freeze quickly** — Follow the matching 10-minute fix flow below. Each one ends with a ready-to-send escalation packet.
2. **Log the exception** — Record `exc-` IDs, owner, expiry, and exit criteria in [exceptions](../governance/exceptions.md) if you step outside a guardrail.
3. **Post receipts** — Add quality/adoption deltas to `/signals/receipts/v2025.11-mitigate.md` and update the release bundle once the issue is clear.

## Fix flows

- [Teams notifications](../support/teams-notifications.md) — Restore toast/badge alerts across devices before calling IT.
- [Repo or pipeline access](../support/access-repo-pipeline.md) — Confirm membership, branch rules, and run permissions prior to filing a ticket.
- [Design System component decision](../support/ds-component-decision.md) — Decide whether to use, extend, compose, or fork without relitigating.
- [Flag not behaving on Staging](../support/flag-staging.md) — Validate env, SDK keys, and targeting before pinging Platform.
- [VWO/Bloomreach sanity](../support/vwo-bloomreach-sanity.md) — Detect duplicate injections, CSP blocks, or wrong keys fast.
- Need a bite-sized runbook? [Request a new Fix flow](https://github.com/lop-louis/go-to-docs/issues/new?labels=kl,feature&title=%5BFlow%5D%20Fix%20it%20fast%20request&body=Page:%20https://northbook.guide/mitigate/).

## Escalate when needed

- Use the [Quick-Run checklist](../navigate/quick-run.md) before/after every fast fix so the receipts stay traceable.
- When a fix requires more than 10 minutes, escalate to [Support IT](../support-it/contacting-it.md) with the packet from the flow you ran.
- Close the loop by updating `ops/releases/YYYY-MM/manifest.json` and re-running `pnpm run state:build`.

## Related references

- [Navigate Start Here](../navigate/index.md)
- [Operate playbook canon](../operate/index.md)
- [Signal registry](../operate/signal-registry.md)
- [Mitigate receipts](../signals/receipts/v2025.11-mitigate.md)

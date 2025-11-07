---
title: Shared metric visibility
change_type: minor
band: A
owner: '@lop'
refresh_after_days: 120
status: live
audience: Stream leads aligning around one transition metric
tone: 'Plainspoken, candid, energetic'
narrative_goal: Lock in the baseline -> target -> date promise and keep it visible
primary_action: >-
  Use this template to track the shared metric's baseline, target, and review
  date.
---

# Shared metric visibility

<a href="#template" data-primary-action>Use this template to track the shared metric's baseline, target, and review date.</a>

Use this template when multiple teams need a single metric to guide a transition.
Pair it with the [Monthly Release Rhythm](../monthly-release.md) so status stays current at each tag.

## Template

| Metric                                 | Baseline                                 | Target               | Target date                           | Status band                        | Notes / owner                  |
| -------------------------------------- | ---------------------------------------- | -------------------- | ------------------------------------- | ---------------------------------- | ------------------------------ |
| Short description of the shared metric | Value when transition started (range ok) | What good looks like | Month / week you expect to hit target | `on-track` / `watch` / `off-track` | Owning role + key dependencies |

**How to fill it in**

1. Name the metric in neutral terms (e.g., "Support handover SLA met %").
2. Capture the baseline using ranges if exact values are sensitive (~65%).
3. Agree on the target, time-bound to a month or sprint boundary.
4. Declare the status band so everyone knows how to react.
5. Include one sentence describing the owner + dependency (Band A phrasing only).

## Filled example

| Metric                                         | Baseline                            | Target                  | Target date | Status band | Notes / owner                                                      |
| ---------------------------------------------- | ----------------------------------- | ----------------------- | ----------- | ----------- | ------------------------------------------------------------------ |
| Watch-window incidents acknowledged within SLA | ~70% acknowledged within 30 minutes | >=90% within 30 minutes | March 2025  | watch       | Stream owner owns the play; operations steward backs up during PTO |

## Month-end update steps

Tie your updates to the [Monthly Release Rhythm](../monthly-release.md):

1. **Collect data**: Pull the latest 30-day metric snapshot 3 days before tagging.
2. **Compare vs baseline/target**: Mark the current value and whether status band shifts.
3. **Note actions**: Add one line in the Notes column summarizing the next action or risk.
4. **Publish with the tag**: When running the monthly release checklist, paste the updated table (or link) into the release notes and link it from related runbooks.
5. **Reset reminders**: Set a reminder for the next month-end pull; if no change, note "no movement" so drift is explicit.

Keeping the baseline -> target -> date table live prevents silent regression and lets everyone see progress without digging through internal systems.

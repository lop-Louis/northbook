---
title: Stop Rules Library
change_type: minor
band: A
owner: '@lop'
refresh_after_days: 60
status: 'draft'
audience: Teams pacing delivery and knowing when to pause work
tone: Plainspoken, candid, energetic
narrative_goal: Offer the framing for stop rules until full guidance ships
primary_action: Capture your top stop conditions using the format provided
---

# Stop Rules Library

Stop rules protect teams from marching forward when risk outpaces confidence. Define them before work starts so everyone knows when to pause, escalate, or roll back.

## When to write a stop rule

- The plan hinges on a guardrail metric staying green.
- Work depends on external approvals or time-limited windows.
- A previous incident showed that drift goes unnoticed until it is too late.

## Crafting effective rules

1. **Name the condition.** Describe the observable signal—not a vibe.
2. **State the action.** Pause, rollback, escalate, or regroup. Keep it unambiguous.
3. **Assign the owner.** One role pulls the brake and communicates next steps.
4. **Set the time box.** Clarify how long the pause lasts or when to reassess.
5. **Link to the metric.** Reference the dashboard or data source that triggers the rule.

## Format

| Condition                         | Action             | Owner            | Time box / Follow-up         |
| --------------------------------- | ------------------ | ---------------- | ---------------------------- |
| No named decider after kick-off   | Freeze scope       | Chapter Lead     | Resolve within 24h           |
| Approval SLA breach (48h)         | Escalate to backup | Requestor        | Backup must respond in 24h   |
| Guardrail drops below threshold   | Roll back change   | Stream owner     | Investigate within 1 hour    |
| Exit metric trending opposite way | Hold new launches  | Product Director | Convene review within 2 days |

## Maintaining the library

- Review stop rules during quarterly planning and after every major incident.
- Keep the library alongside the Decision Spine entry so the “why” and “when to stop” stay linked.
- When a rule fires, log the context in the Answer Ledger outcome to keep institutional memory sharp.

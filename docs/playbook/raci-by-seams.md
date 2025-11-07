---
title: RACI by Seams
change_type: minor
band: A
owner: '@lop'
refresh_after_days: 60
status: 'draft'
audience: Leads mapping accountability across seams
tone: Plainspoken, candid, energetic
narrative_goal: Provide a table-driven way to clarify who owns what work
primary_action: Fill out the template with roles for each seam
---

# RACI by Seams

Map the work around seams instead of teams so responsibility stays clear when streams shift. Each seam represents a boundary where ownership often fuzzes—APIs ↔ clients, platform ↔ feature, product ↔ ops.

<a href="#template" data-primary-action>Fill out the seam RACI template</a>

## Why seams, not teams

- Teams reorganize; seams persist where work hands off.
- Seams keep focus on outcomes (“Data quality”) instead of reporting lines.
- Ownership debates shrink when the table names the seam first.

## Drafting the table

1. **List the seams.** Capture the interfaces where hand-offs hurt the most.
2. **Assign roles, not people.** Roles survive reorgs; handles change.
3. **Keep it lean.** One R, one A. Add C/I only if they act on the seam.
4. **Validate with the seam owners.** Walk the table together and confirm nothing overlaps.
5. **Link to supporting docs.** Decisions go to the <u>[Decision Spine](../decision-spine.md)</u>; policies go to the <u>[Answer Ledger](../answer-ledger.md)</u>.

## Template

| Seam            | R (Responsible)  | A (Accountable)  | C (Consulted)    | I (Informed)         |
| --------------- | ---------------- | ---------------- | ---------------- | -------------------- |
| Data quality    | Data Engineer    | Analytics Lead   | Product Manager  | Support Lead         |
| Release comms   | Product Ops      | Product Director | Engineering Lead | Customer Success     |
| Incident review | Reliability Lead | CTO              | Legal, Comms     | All affected streams |

## Patterns that keep it useful

- Revisit the table during quarterly planning or after any escalation.
- Embed it in onboarding for new stream owners.
- If two seams share the same R and A, merge them or clarify the split.

Remember: this table guides accountability conversations; runbooks capture the actual steps when work kicks off.

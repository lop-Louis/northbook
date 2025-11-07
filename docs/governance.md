---
title: Anti-drift Content Governance
band: A
owner: '@lop'
refresh_after_days: 120
change_type: minor
status: live
last_reviewed: '2025-11-04'
audience: Maintainers and contributors who publish or review Northbook content
tone: Plainspoken, candid, energetic
narrative_goal: Define the guardrails that keep public docs safe and trustworthy
---

# Anti-drift Content Governance

<a href="#scope" data-primary-action>Use these rules when you edit or approve any page.</a>

<a href="./runbooks/index" data-secondary-action>Browse the Runbooks index for hands-on checklists.</a>

> Public-safe content only. Internal specifics live elsewhere. This page is the Anti-drift content governance playbook; project-level governance (RACI, automation owners, SLOs) lives in [`GOVERNANCE.md`](https://github.com/lop-Louis/go-to-docs/blob/main/GOVERNANCE.md).

Content governance ensures public documentation stays small, safe, and current.

## How this differs from project governance

- **Anti-drift content governance (this page):** Defines Band A scope, sanitization rules, review cadence, and anti-drift triggers for anything published under `docs/`.
- **Project governance ([`GOVERNANCE.md`](https://github.com/lop-Louis/go-to-docs/blob/main/GOVERNANCE.md))**: Tracks who owns the automation, how RACI works, what the SLOs and stop rules are, and when workflows change.

Update them together: policy/tone changes go here; ownership/process changes go in the root file with a cross-link back to this guide.

## Scope

This policy applies to all pages under `docs/` published to the public site.
Internal planning, decision records, and handover artifacts remain in `_ADR/` and are not part of the public build.

## Action pairs above the fold

Every page (except the homepage layout) must start with two actions before the first `##` heading:

- `<a data-primary-action>…</a>` — the default “do this now” guidance tailored to the page.
- `<a data-secondary-action>…</a>` — a complementary option (e.g., link to runbooks, governance, or deeper references) so readers have a fallback.

Keep both actions ≤ 140 characters and link only to Band A-safe destinations. Automated drift checks fail the build if either action is missing or the primary action appears more than ~600 px from the start of the content.

## Frontmatter contract

Every markdown page still needs ownership and review metadata:

```yaml
---
title: Page Title
band: A
owner: '@handle'
refresh_after_days: 60
change_type: patch | minor | major
status: live | stale | archived | draft
---
```

> CTA text now lives in the body, so you **do not** need a `primary_action` field in frontmatter. Drift prevention scripts enforce the action pair directly in the rendered content.

## Allowed Content (Band A)

Band A restricts pages to neutral, non-sensitive patterns:

- Generic role or process descriptions
- Decision-making frameworks and facilitation patterns
- Sanitized examples (no real identifiers) — see the [Handover RACI template runbook](./runbooks/handover-raci-template.md) for a ready-to-use pattern
- Ranges/relative metrics ("~15%", "5–10", "few", "several")
- Original or properly licensed code samples

### Forbidden Patterns

**Never publish:**

- Internal product / system names, proprietary URLs, screenshots
- Ticket IDs (replace with `TICKET-ID` when teaching patterns)
- Personal or customer data, real names, emails
- Exact financials, volumes, infrastructure specifics
- Hard calendar dates for internal milestones (use relative phrasing)
- Secrets, credentials, access instructions

### Common Pitfalls to Avoid

Based on usage patterns, watch for:

1. **Accidental Internal References:**
   - Wiki links, Confluence URLs → Replace with "internal wiki"
   - Slack channel names → Use "team channel" or "discussion forum"
   - Repository names → Use "the repository" or "codebase"

2. **Over-specific Metrics:**
   - "Exactly 47 PRs merged" → "~45-50 PRs" or "several dozen"
   - "Response time of 234ms" → "~200-250ms" or "sub-300ms"
   - "15 team members" → "~15 members" or "mid-sized team"

3. **Temporal Specificity:**
   - "Launched in a named quarter" → "Launched recently" or "within the past year"
   - "Meeting every Tuesday" → "Weekly meetings" or "regular cadence"
   - "Deploy by March 15" → "Deploy within 2 weeks" or "upcoming sprint"

4. **Organizational Details:**
   - Reporting structures, approval chains → Generic "stakeholders" or "decision makers"
   - Vendor names → "Third-party service" or "external provider"
   - Budget/cost details → Remove entirely or use "within budget constraints"

### Good vs. Bad Examples

| ❌ Avoid | ✅ Prefer |
|

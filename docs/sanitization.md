---
title: Sanitization Checklist
band: A
owner: "@lop"
refresh_after_days: 60
change_type: patch
status: live
---

# Sanitization Checklist

Use this checklist before submitting any PR to ensure content is public-safe.

## Pre-flight checks

- [ ] **No internal names**: Replace company, product, or vendor names with generic terms
- [ ] **No URLs**: Remove links to internal systems (intranet, internal tools, corp domains)
- [ ] **No screenshots**: If needed, redact or recreate with dummy data
- [ ] **No ticket IDs**: Strip JIRA-1234, Linear-ABC, or similar references
- [ ] **No exact numbers**: Convert to ranges ("10-20 users") or percentages ("~15% increase")
- [ ] **No calendar dates**: Use relative time ("Q2 2024" → "within 3 months")
- [ ] **No personal data**: Remove names, emails, phone numbers, or identifying details

## Code samples

- [ ] **Original work**: Code you wrote or public examples
- [ ] **License noted**: If adapted, include attribution in comments
- [ ] **No secrets**: No API keys, tokens, passwords, or connection strings

## Frontmatter required

Every page must have:

```yaml
---
title: Page Title
band: A
owner: 'company-initials'
refresh_after_days: 90
change_type: patch | minor | major
status: live | stale | archived
---
```

## Change size guidelines

- **patch**: ≤ 20 lines changed (typos, small clarifications)
- **minor**: ≤ 120 lines (new section, substantial edits)
- **major**: > 120 lines (new page, major restructure)

## Testing locally

Run before submitting:

```bash
npm run docs:dev        # Preview site
npm run guard           # Check Band A rules
```

## What happens next

1. CI runs content guard, link checker, and secret scanner
2. **Green**: Auto-merged within 1 minute
3. **Yellow**: Requires one reviewer approval
4. **Red**: Blocked until fixed

See GOVERNANCE.md in the repository root for full policy.

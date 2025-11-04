---
title: What is Band A
band: A
owner: "@lop"
refresh_after_days: 90
change_type: patch
status: live
---

# What is Band A

Band A content is **public-safe** material that can be shared openly without risk to the organization or individuals.

## What belongs in Band A

✅ **Include:**
- Role definitions and common responsibilities
- Process patterns without company-specific details
- Generic decision frameworks
- Anonymized examples with no identifying information
- Publicly available metrics as ranges (e.g., "response times between 100-500ms")
- Code samples that are original or properly licensed

✅ **Examples:**
- "A tech lead typically reviews 5-10 PRs per day"
- "Our decision spine has 4 stages: frame, options, decide, review"
- "Accessibility quick wins: keyboard navigation, ARIA labels, color contrast"

❌ **Exclude:**
- Internal product names, URLs, or screenshots
- Specific ticket IDs (JIRA-1234, etc.)
- Employee names or identifying details
- Exact revenue, costs, or customer counts
- Internal infrastructure details
- Vendor-specific implementations
- Calendar dates or project timelines

## Why Band A only

This site is **public on GitHub Pages**. Band A ensures:
- Legal compliance (no proprietary information)
- Privacy protection (no personal data)
- Longevity (generic patterns age better)
- Reusability (others can adapt without context)

## Sanitization process

Before publishing:
1. Replace company names with "the organization"
2. Convert exact numbers to ranges or percentages
3. Remove screenshots or redact sensitive areas
4. Strip internal links and ticket references
5. Review frontmatter: `band: A` is required

See [Sanitization Checklist](./sanitization) for the full process.

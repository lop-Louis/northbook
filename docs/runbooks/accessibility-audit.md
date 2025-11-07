---
title: Accessibility audit runbook
change_type: minor
band: A
owner: '@louis'
refresh_after_days: 90
status: live
audience: Product ops and accessibility leads running the quarterly sweep
tone: Plainspoken, candid, energetic
narrative_goal: Outline the repeatable tasks for verifying accessibility health
---

# Accessibility audit runbook

<a href="#purpose" data-primary-action>Use this runbook to execute the quarterly accessibility audit and log findings.</a>

<a href="./index" data-secondary-action>Browse the Runbooks index for hands-on checklists.</a>

## Purpose

Quarterly accessibility sweep for public Northbook pages. Logs reside in repo history; avoid calendar specifics for public neutrality.

## Steps

1. `pnpm run docs:build`
2. `pnpm run docs:preview`
3. In a second terminal, run Lighthouse against key pages:

```bash
npx lighthouse http://<preview-host>/northbook/decision-spine --view
npx lighthouse http://<preview-host>/northbook/accessibility-quick-wins --view
```

4. Verify semantic headings, keyboard navigation, and color/contrast. Tick findings in internal tracker.
5. File issues for remediation in GitHub with label `accessibility`.

## Notes

- Ensure alt text on any new images.
- Screen reader spot-check (VoiceOver/NVDA) at least once per half-year.
- Update this runbook if new hero components or custom widgets ship.

---
title: Sanitization Guidance
band: A
owner: '@lop'
refresh_after_days: 60
change_type: minor
status: live
last_reviewed: '2025-11-04'
audience: Contributors preparing public-safe guidance
tone: Plainspoken, candid, energetic
narrative_goal: Show how to strip risk while keeping guidance useful
---

# Sanitization Guidance

<a href="#what-sanitization-protects" data-primary-action>Use this sanitization checklist before shipping or reviewing a page.</a>

<a href="./runbooks/index" data-secondary-action>Browse the Runbooks index for hands-on checklists.</a>

Northbook only publishes guidance that the public can quote without a second thought. Use these guardrails to keep every page linkable while chore-like checklists stay in `/runbooks`.

## What Sanitization Protects

- **People** — strip personal data, names, emails, or avatars that could identify someone.
- **Systems** — remove URLs, ticket IDs, and architecture breadcrumbs tied to internal tools.
- **Signals** — convert precise numbers or dates into ranges and relative time so nothing leaks velocity or runway.
- **Brand** — recreate screenshots with dummy data instead of redacting; avoid dragging internal UI chrome into public view.

If a fact is safe enough for a press release, it is safe enough for Northbook.

## Rewrite Instead of Redact

| Risky detail | Public-safe rewrite |
|

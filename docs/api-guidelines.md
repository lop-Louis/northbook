---
title: API Guidelines (Stub)
band: A
owner: '@lop'
refresh_after_days: 120
change_type: minor
status: live
last_reviewed: '2025-11-04'
audience: Engineers designing and reviewing HTTP APIs
tone: Plainspoken, candid, energetic
narrative_goal: Capture the baseline rules for Northbook APIs until the full guide
  ships
---

# API Guidelines (Stub)

<a href="#core-principles" data-primary-action>Use these defaults when you draft or review API changes.</a>

<a href="./runbooks/index" data-secondary-action>Browse the Runbooks index for hands-on checklists.</a>

Neutral, public-safe principles for designing and evolving HTTP+JSON APIs. This page is a placeholder until a fuller version is needed.

## Core Principles

1. Consistency over cleverness
2. Minimal surface area; evolve additively
3. Predictable pagination, errors, and versioning
4. Clear separation of concerns (resource vs operation)

## Resource Modeling

- Use plural nouns: `/users`, `/invoices`
- Nest only to express containment: `/users/{id}/sessions`
- Avoid deep nesting (>2 levels) — prefer top-level plus filters

## HTTP Methods

| Method | Use |
|

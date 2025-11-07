---
title: UX + UI standard
change_type: minor
band: A
owner: '@lop'
refresh_after_days: 120
status: live
audience: Editors and maintainers shaping public-facing pages
tone: Plainspoken, candid, energetic
narrative_goal: Lock the presentation system so content stays consistent without design-by-committee
primary_action: Apply these rules before merging any layout or styling change
---

# UX + UI standard

Consistent presentation keeps trust high and review cycles short.
Use this checklist whenever you add or revise content so it ships with the same look, feel, and accessibility guarantees.

> **Primary action:** Apply these rules before merging any layout or styling change.

## Layout width

- Content column maxes at ~720px (≈75 characters) to keep lines readable.
- Avoid manual `<br>` line breaks; let the layout flow.
- Tables wider than 720px need concise labels or should be split.

## Heading rhythm

- One `#` heading per page (page title). Use `##` for major sections, `###` for optional subsections.
- Keep heading intervals even: never jump from `##` to `####`.
- Each page must surface its `primary_action` within the lead paragraph or a callout before the first `##`.

## Typography scale

- Body copy defaults to 16px; avoid inline `<font>` or size adjustments.
- Use lists for multi-step or multi-point guidance instead of long comma splices.
- Bold emphasizes key terms; italics for definitions or short asides.

## Link style

- Inline links stay descriptive and underlined. Never rely on color alone.
- External destinations note context in parentheses, e.g., `<u>[Ask a question](https://github.com/...)</u> (GitHub)`.
- Long URLs should be hidden behind descriptive text to reduce visual noise.

## Color rules

- Stick to the existing theme tokens: brand blue for primary actions, neutral gray for body text, red/yellow/green badges only when echoing automation states.
- No custom hex codes in Markdown unless cleared through the design system.
- Use emojis sparingly and only for callouts already standardized (⚠️, ✅).

## Accessibility guardrails

- Maintain 4.5:1 contrast for text; if unsure, default to theme colors.
- Never remove focus outlines; avoid inline styles that override them.
- Provide text alternatives for emojis and icons in parentheses if meaning is critical.

## Allowed components

- Markdown headings, paragraphs, bulleted/numbered lists, blockquotes, tables, fenced code blocks, callout quotes (`> Note`).
- Inline HTML limited to `<u>`, `<strong>`, `<em>`, `<code>` when Markdown cannot express the pattern.
- No custom iframes, embeds, or script tags.

## Media requirements

- Images must be sanitized, 1200px max width, and compressed.
- Each image requires meaningful `alt` text and optional caption if context is not obvious.
- Videos are not permitted; link to the internal source with a placeholder if needed.

When every page follows this standard, readers learn the rhythm once and focus on the content, not the chrome.

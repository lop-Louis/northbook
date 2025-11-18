---
title: 'receipts – v{{ yyyy.mm }}-{{ seam }}'
owner: 'louis'
date: '{{ yyyy-mm-dd }}'
tag: 'v{{ yyyy.mm }}-{{ seam }}'
---

## adoption

- {{ metric }}: {{ result }} (since last tag)

## quality

- {{ metric }}: {{ result }}

## credibility

- state freshness: {{ days }} days
- exceptions resolved on time: {{ n }}/{{ total }}

## dashboards

- link: /signals/receipts.html#{{ seam }}

---
title: Legacy layout
band: A
owner: '@lop'
refresh_after_days: 30
change_type: patch
status: live
nav:
  - none
bucket: navigate
north_star_id: ns-001
guardrail_id: gr-101
cta_primary_label: Try the Navigate path
cta_secondary_label: See example route
leading_metric: m-nav-open
lagging_metric: m-time-to-answer
decision_link: /decisions/dec-2025-11-nav-lock.md
date: '2025-11-11'
---

# Legacy layout

You’re viewing the frozen `/legacy` snapshot. [Try the Navigate path](../navigate/index.md) or [See the redirect ledger](../../ops/redirect_ledger.csv) to find the current route.
Exit metric: `/legacy` traffic stays below 5% during the freeze window.

::: warning Legacy banner — active through `v2025.12-releases`

> you’re viewing legacy content from a previous structure. the new layout lives at **/start-here/**. this banner stays until `v2025.12-releases`.
> :::

## What changed

- Top navigation now locks to **Navigate / Operate / Learn / Mitigate**.
- All redirects are tracked in [`ops/redirect_ledger.csv`](../../ops/redirect_ledger.csv) with single-hop, lowercase entries.
- Fix-it-fast flows now live under the [Mitigate landing](../mitigate/index.md); `/support/` stays available but points here for legacy context.

## Need something that isn’t mapped?

1. Search the [redirect ledger](../../ops/redirect_ledger.csv) for the old path.
2. If you still can’t find it, [open a nav question](https://github.com/lop-louis/go-to-docs/issues/new?labels=kl,question&title=%5BNavigate%5D%20Legacy%20path&body=Page:%20https://northbook.guide/legacy/).
3. Include the original URL, expected destination, and the reason you’re referencing the legacy layout.

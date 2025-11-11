---
title: North Star & Guardrails
band: A
owner: '@lop'
refresh_after_days: 90
change_type: patch
status: live
audience: Leaders and teams wanting clarity without deep technical detail
tone: 'Plainspoken, candid, reassuring'
narrative_goal: >-
  Explain how North Stars, guardrails, roles, and rhythm keep delivery steady
  without excess process
nav_group: Operate
nav_order: 5
nav_label: North Star & Guardrails
nav:
  - sidebar
bucket: operate
north_star_id: ns-001
guardrail_id: gr-103
cta_primary_label: Use this guardrail
cta_secondary_label: See example runbook
leading_metric: m-lab-pass
lagging_metric: m-defect-rate-changed-pages
decision_link: /decisions/dec-2025-11-ia-overhaul.md
date: '2025-11-11'
---

# North Star & Guardrails

Make the work predictable. Protect the North Star. Ship small, prove it, and keep receipts. [See the guardrails](#guardrails-boundaries-that-protect-the-promise) or [watch the brief](#watch-the-brief).

> **why:** help readers reach a usable answer in under **60 seconds** without being ordered around.

**try**:

- **see example:** /operate/versioning-and-releases/
- **learn more:** /playbook/guardrails/index.html

**exit metric:** `m-time-to-answer` improves ≥ 10% vs baseline for two consecutive weeks.  
**state:** /navigation/state/v2025.11-navigation.md  
**receipts:** /signals/receipts/v2025.11-navigation.md

## Watch the brief

<video controls width="100%" style="max-width: 800px; margin: 1rem 0;">
  <source src="../public/North_Star_&_Guardrails.mp4" type="video/mp4">
  Your browser does not support the video tag. [Download the walkthrough video](/North_Star_&_Guardrails.mp4).
</video>

**Do the right thing, calmly, with receipts. Speed is a byproduct, not the goal.**

What it means here:

- pages open with context, two sane options, and a clear “what good looks like”
- readers keep autonomy; we nudge by default and block only for red-lines
- we show proof monthly under seam-scoped tags (e.g., `v2025.11-navigation`)

---

## guardrails (boundaries that protect the promise)

1. **narrator tone = guide, not boss**  
   Use soft labels (try, use, choose, see example). Avoid commands (must, always, fix now, comply).

2. **opener pattern above the fold**  
   One sentence **why**, exactly **two** actions, one **exit metric** line. No walls of text up top.

3. **traceability or it didn’t happen**  
   PR ↔ decision/exception ↔ guardrail ↔ page ↔ signal ↔ receipt. Zero orphans.

4. **signals are scarce**  
   Cap at **8** active; each has an owner and 30-day refresh SLA.

5. **labs are real**  
   Any example lab must run in **≤ 10 minutes** or get cut until it can.

6. **sanitize for public**  
   No personal data, secrets, unverifiable hard numbers. Directional ranges are fine.

7. **autonomy ladder (nudge-first)**  
   L0 observe → L1 highlight → L2 nudge → L3 conscious override (with expiry) → L4 block (red-lines only).

---

## how to read a page here

- **why:** a single sentence that names the scope or tradeoff
- **try:** two reversible choices, not one path masquerading as freedom
- **exit metric:** what success looks like in one line, mapped to a metric ID

> works when: choices are real, reversible, and mapped to one leading + one lagging signal  
> fails when: the page orders people around or ships without a measurable exit

---

## exceptions with dignity

When you must break a guardrail, use an **L3 exception** with owner, date, expiry ≤ 30 days, and exit criteria.  
Public summary: /governance/exceptions.md  
Private ledger: /governance/\_exceptions_ledger.csv

---

## red-lines (hard blocks)

- gdpr or privacy leaks
- security secrets or source-of-truth tamper
- broken traceability that prevents rollback
- compliance audit prune requests

---

## receipts (what we show monthly)

- **adoption:** `m-nav-open` on key landings
- **quality:** annex lab pass rate where applicable
- **credibility:** state freshness; exceptions closed on time

Find them under the current tag: `/signals/receipts/v2025.11-navigation.md`.

---

## quick faq

- **why two actions?** Two good options preserve autonomy and reduce bounce.
- **can i be prescriptive?** Only in a safety note. Otherwise, guide.
- **what if my example takes 15 minutes?** Cut scope until the runnable part fits **≤ 10 minutes**.

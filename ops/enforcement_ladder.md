# enforcement ladder (private)

l0 observe → log only
l1 highlight → inline notice in preview
l2 nudge → pr comment with examples (merge allowed)
l3 override → merge allowed with exception (owner, expiry, exit)
l4 block → merge denied

defaults

- tone/cta pattern → l2
- missing metric mapping → l2
- signals over cap or stale → l2 then l3 next release
- missing traceability → l3
- legal/privacy/security/gdpr/source-of-truth tamper → l4

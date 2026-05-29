# Slot 73 — Start (Run 4 Exploration — arch template executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "72"
run_scope: Increment 3 — Ship to home
skills:
  - abd-architecture-template
corrections: docs/corrections-log.md — filter engineering/exploration + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-72-finished.md PASS
  - increment-3-acceptance-criteria.md present
  - docs/architecture/architecture-reference.md (Increment 2) present
```

Extend architecture template for Increment 3: shipping address capture, standard delivery option, order queue / ship-to-home fulfillment, tracking number entry, shipping notification, order status page. Update `docs/architecture/` template artifact per skill.

Guest checkout only; no accounts. StripeWave unchanged.

Write `slot-73-finished.md`.

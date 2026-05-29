# Slot 75 — Start (Run 4 Specification — CRC executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "74"
run_scope: Increment 3 — Ship to home
skills:
  - abd-class-responsibility-collaborator
corrections: docs/corrections-log.md — filter specification + business-expert + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-74-re-review-finished.md PASS
  - Run 4 exploration exit gate PASS
  - docs/domain/ubiquitous-language.md Increment 3 refresh
  - docs/story/acceptance-criteria/increment-3-acceptance-criteria.md
```

Refresh CRC + `docs/domain/domain.json` for Increment 3: shipping address, delivery option, ship-to-home fulfillment, tracking number, order status, shipping notification, order queue.

Guest checkout only; no accounts. Click-and-collect + standard delivery.

Write `slot-75-finished.md`.

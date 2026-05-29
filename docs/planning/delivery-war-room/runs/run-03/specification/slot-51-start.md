# Slot 51 — Start (Run 3 Specification — CRC executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "50"
run_scope: Increment 2 — Click-and-collect
skills:
  - abd-class-responsibility-collaborator
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:
  - slot-50-finished.md PASS — Run 3 Exploration complete
  - docs/domain/crc.md present
```

Refresh CRC + domain.json for Increment 2 concepts (cart, order, payment, guest checkout, click-and-collect fulfillment). Write `slot-51-finished.md`.

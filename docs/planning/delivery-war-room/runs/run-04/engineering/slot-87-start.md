# Slot 87 — Start (Run 4 Engineering — object model executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "86"
run_scope: Increment 3 — Ship to home domain types
skills:
  - abd-object-model
corrections: docs/corrections-log.md — filter engineering + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-86-re-review-finished.md PASS
  - docs/domain/object-model.md
  - docs/domain/crc.md Increment 3
  - packages/order/ partial Inc 3 types from slot 85
```

Typed Increment 3 domain surface: ShippingAddress, DeliveryOption, StandardDelivery, TrackingNumber, extended Order lifecycle for ship-to-home. Update `docs/domain/object-model.md` and `packages/order/shared/` (and related packages). Align to CRC + UL.

Run npm test from conf/ — 110/110 must stay green.

Write `slot-87-finished.md`.

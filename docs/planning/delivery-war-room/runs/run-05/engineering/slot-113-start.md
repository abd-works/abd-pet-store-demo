# Slot 113 — Start (Run 5 Engineering — Increment 4 object model executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "112"
run_scope: Increment 4 — Returning customers domain types
skills:
  - abd-object-model
corrections: docs/corrections-log.md — filter engineering + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-112-finished.md PASS
  - Run 5 specification stage exit gate PASS
  - docs/domain/crc.md Increment 4
  - docs/domain/increment-4-walkthrough.md
  - docs/architecture/architecture-reference.md Increment 4 handoff
  - npm test 146/146 green baseline
```

Typed Increment 4 domain surface: CustomerAccount, EmailVerification, CustomerSession, SavedAddress, SavedPaymentMethod, Wishlist, OrderHistory/Reorder extensions. Update `docs/domain/object-model.md` and shared packages per architecture reference handoff.

Run `npm test` from conf/ — 146/146 must stay green.

Write `slot-113-finished.md`.

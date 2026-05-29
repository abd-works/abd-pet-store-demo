# Slot 49 — Start (Run 3 Exploration — architecture template executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "48"
run_scope: Increment 2 — cart, order, payment (StripeWave), email confirmation, inventory reservation
skills:
  - abd-architecture-template
corrections: docs/corrections-log.md — filter exploration + engineer + Increment 2
checkpoint: none
entry_conditions_met:
  - slot-48-finished.md PASS — UX mockups reviewed
  - docs/ux/lo-fi/increment-2-click-and-collect.drawio present
  - docs/architecture/architecture-blueprint.md present
prior_artifacts:   - docs/architecture/architecture-reference.md (extend with Increment 2 mechanisms)
```

## Handoff from slot 48

UX lo-fi complete for cart/checkout/staff pick-prep. Fill or extend `architecture-reference.md` for Increment 2 cross-cutting mechanisms: cart session, order placement, StripeWave payment + webhook, confirmation email, inventory reservation for click-and-collect.

## Scope

- Increment 2 only — guest checkout, StripeWave-only active payment, click-and-collect fulfillment
- Stub or defer: accounts, shipping, PayNova/VaultPay beyond prior deferral notes
- Align to blueprint §3 and existing `packages/` structure

Write `slot-49-finished.md`. Defer scanners to reviewer slot 50.

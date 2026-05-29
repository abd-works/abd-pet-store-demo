# Slot 45 — Start (Run 3 Exploration — AC executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "44"
run_scope: Increment 2 — Click-and-collect (11 stories — AC refresh in story-graph + markdown)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
corrections: docs/corrections-log.md — filter by Affects exploration + product-owner + Increment 2
checkpoint: none
entry_conditions_met:
  - slot-44-finished.md PASS — Increment 2 UL refresh reviewed
  - docs/domain/ubiquitous-language.md increment_scope Increment 2
  - docs/story/thin-slicing.md Increment 2 authoritative
  - docs/story/story-graph.json present
```

## Handoff

Refresh Increment 2 acceptance criteria in `story-graph.json` and `docs/story/acceptance-criteria/increment-2-acceptance-criteria.md`. Align terms to Increment 2 UL (*guest checkout*, *pickup store*, *confirmation email*, StripeWave-only payment).

## Increment 2 stories (thin-slicing.md)

1. Add Product to Cart
2. Update Cart Quantity
3. Remove Product from Cart
4. Select Click-and-Collect Store
5. Check Out as Guest
6. Enter Billing Address
7. Select Payment Method (StripeWave only)
8. Process Card Payment via StripeWave
9. Confirm Order and Send Confirmation Email
10. Prepare Click-and-Collect Orders for Pickup (store employee)
11. Fulfill Click-and-Collect Order (store employee)

**Scope guard:** No accounts, shipping delivery, PayNova/VaultPay, or cart persistence across sessions.

Write `slot-45-finished.md` with artifact paths. Defer scanners to reviewer.

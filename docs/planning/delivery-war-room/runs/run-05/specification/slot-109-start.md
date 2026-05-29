# Slot 109 — Start (Run 5 Specification — Increment 4 interface design executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "108"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-interface-design
corrections: docs/corrections-log.md — filter specification + ux-designer + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-108-re-review-finished.md PASS
  - docs/ux/lo-fi/increment-4-returning-customers.md
  - docs/ux/lo-fi/increment-4-returning-customers.drawio
  - docs/ux/information-architecture.md
  - docs/story/specification-by-example/increment-4-specification-by-example.md
  - docs/domain/increment-4-walkthrough.md
```

Produce `docs/ux/increment-4-interface-design.md` from lo-fi mockups + spec-by-example + walkthrough. Scope: account registration/login/verification, saved addresses/payment, checkout selections, order history, wishlist, reorder. Guest checkout coexists; email verification gates account-only features; StripeWave sole vendor.

Write `slot-109-finished.md`.

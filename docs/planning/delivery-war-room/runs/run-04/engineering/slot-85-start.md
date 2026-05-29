# Slot 85 — Start (Run 4 Engineering — interface design implementation)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "84"
run_scope: Increment 3 — Ship to home UI
skills:
  - abd-interface-design
corrections: docs/corrections-log.md — filter engineering + ux-designer + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-84-finished.md PASS
  - Run 4 specification exit gate PASS
  - docs/ux/increment-3-interface-design.md
  - docs/architecture/architecture-reference.md Increment 3 handoff
  - npm test 110/110 green baseline (Increment 2)
```

Implement Increment 3 UI per interface spec: shipping address page, delivery option selection, order status page, guest lookup, unified staff order queue + ship-to-home fulfillment detail. Extend checkout flow (dual path). Wire server routes per architecture reference.

**Must keep 110+ tests green** — run `npm test` from conf/ before finish.

Guest checkout only; no accounts.

Write `slot-85-finished.md`.

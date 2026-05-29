# Slot 25 — Start (Run 2 Specification — CRC executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "24"
run_scope: Increment 1 — Product Catalog, Store Locator, App Shell domain modules
skills:
  - abd-class-responsibility-collaborator
corrections: docs/corrections-log.md — filter specification + business-expert + Increment 1
checkpoint: after Specification stage complete (Run 2 gate)
entry_conditions_met:
  - slot-24-finished.md PASS — Exploration stage exit
  - docs/domain/ubiquitous-language.md present
  - docs/architecture/architecture-reference.md filled for Increment 1
  - docs/ux/lo-fi/increment-1-walk-in-driver.md present
```

## Handoff from Exploration

Exploration complete for Increment 1: UL, AC, lo-fi wireframes, architecture reference mechanisms. Produce CRC for Increment 1 modules and refresh `docs/domain/domain.json` where needed.

## Scope

- Product Catalog (product, category, stock availability)
- Store Locator (store, store locator)
- App Shell wiring only if CRC classes participate in Increment 1 flows
- No Order, Payment, Customer Account, Pet modules

## Operator policy

Autonomous continuation.

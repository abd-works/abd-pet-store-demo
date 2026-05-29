# Slot 37 — Start (Run 2 Engineering — object model)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "36"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-object-model
corrections: docs/corrections-log.md
entry_conditions_met:
  - slot-36-finished.md PASS — clickable prototype pair complete
  - docs/domain/crc.md
  - docs/domain/domain.json
  - docs/domain/increment-1-walkthrough.md
  - docs/domain/ubiquitous-language.md
  - packages/store/shared/
  - packages/product-catalog/shared/
```

## Handoff

Produce typed object model for Increment 1 domain modules (store locator, product catalog, stock availability). Input: CRC + walkthrough + existing `docs/domain/object-model.md` (system-wide). Refresh Increment 1 slice only — align typed surface in `packages/*/shared` with CRC/UL. Business Expert validates at reviewer checkpoint.

## Reviewer notes from slot 36 (non-blocking for OM)

- Prototype polish items deferred to ATDD/clean-code slots.

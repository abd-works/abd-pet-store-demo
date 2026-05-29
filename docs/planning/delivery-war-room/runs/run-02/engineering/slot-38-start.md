# Slot 38 — Start (Run 2 Engineering — object model reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "37"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-object-model
prior_executor_slot: 37
artifact_paths:
  - docs/planning/delivery-war-room/slot-37-finished.md
  - docs/domain/object-model.md
  - docs/domain/domain.json
  - packages/store/shared/
  - packages/product-catalog/shared/
corrections: docs/corrections-log.md
entry_conditions_met:   - slot-37-finished.md exists
```

## Handoff

Review abd-object-model output for Increment 1. Run scanners:

```
python c:\dev\agilebydesign-skills\skills\skill-helpers\execute-skill-using-skills-rules\scripts\run_scanners.py --skill-root c:\dev\abd-pet-store-demo\.cursor\skills\abd-object-model --workspace c:\dev\abd-pet-store-demo
```

Validate against engineering.md skill 2 exit items + CRC/UL ripple.

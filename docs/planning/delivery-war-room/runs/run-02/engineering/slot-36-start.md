# Slot 36 — Start (Run 2 Engineering — abd-interface-design reviewer)

```yaml
team-role: ux-designer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "35"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-interface-design
prior_executor_slot: 35
artifact_paths:
  - docs/planning/delivery-war-room/slot-35-finished.md
  - docs/ux/increment-1-interface-design.md
  - docs/ux/lo-fi/increment-1-walk-in-driver.md
  - packages/app-client/src/App.tsx
  - packages/app-client/src/pages/
  - packages/store/client/
  - packages/product-catalog/client/
corrections: docs/corrections-log.md
entry_conditions_met:   - slot-35-finished.md exists
```

## Handoff

Review executor slot 35 `abd-interface-design` implementation pass only. Run `run_scanners.py --skill-root abd-interface-design --workspace <workspace>`. Validate against `stages/engineering.md` step 1 and interface spec. ATDD test failures are expected until slot 38+ — do not FAIL on pre-existing test drift unless navigation or labels break.

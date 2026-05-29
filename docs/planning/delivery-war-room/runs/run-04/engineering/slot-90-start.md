# Slot 90 — Start (Run 4 Engineering — Increment 3 ATDD reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "89"
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
prior_executor_slot: 89
artifact_paths:
  - docs/planning/delivery-war-room/slot-89-finished.md
  - docs/planning/delivery-war-room/slot-89-rework-finished.md
  - tests/ship-to-home/
  - tests/ship-to-home/helpers/order-api.mock.ts
  - conf/vitest.config.ts
  - conf/vitest.setup.ts
checkpoint: none
entry_conditions_met:
  - slot-89-finished.md PASS (rework complete)
  - npm test 146/146 baseline
```

Review slot 89 ATDD executor + rework. Run scanners with `--language javascript` on `abd-acceptance-test-driven-development` and `mern-technical-architecture` against `tests/ship-to-home/`. Validate engineering.md step 3 ATDD exit-gate items for Increment 3. Confirm 146/146 npm test. Write `slot-90-finished.md`.

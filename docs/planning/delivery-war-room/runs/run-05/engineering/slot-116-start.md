# Slot 116 — Start (Run 5 Engineering — Increment 4 ATDD RED reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "115"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
prior_executor_slot: 115
artifact_paths:
  - docs/planning/delivery-war-room/slot-115-finished.md
  - tests/returning-customers/
  - conf/vitest.config.ts
  - conf/vitest.setup.ts
corrections: docs/corrections-log.md — filter engineering + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-115-finished.md exists
  - docs/story/specification-by-example/increment-4-specification-by-example.md
  - docs/ux/increment-4-interface-design.md (test name mapping)
  - docs/architecture/architecture-reference.md Increment 4 handoff
  - npm test runs without infrastructure errors (RED behavior failures OK)
```

Review slot 115 ATDD executor artifacts only. Run scanners with `--language javascript` on `abd-acceptance-test-driven-development` and `mern-technical-architecture` against `tests/returning-customers/`. Validate engineering.md step 3 ATDD exit-gate items for Increment 4. Confirm npm test suite executes cleanly (behavior failures expected RED until slot 117 GREEN). No new artifacts.

Write `slot-116-finished.md`.

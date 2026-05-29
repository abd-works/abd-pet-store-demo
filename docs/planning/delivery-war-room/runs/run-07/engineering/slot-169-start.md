# Slot 169 — Start (Run 7 — Increment 6: Pet visits — clean code GREEN executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: engineering
depends_on:
  - "168"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-clean-code
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-168-finished.md exists
```

GREEN — adoption visits end-to-end production code. All Increment 6 tests PASS from `conf/`. Implement pet catalog, adoption appointment scheduling, staff workflow, visit outcome recording, and transactional notification in `packages/` per MERN clean-code patterns. Appointment booking must enforce account-gate invariant.

Write `slot-169-finished.md`.

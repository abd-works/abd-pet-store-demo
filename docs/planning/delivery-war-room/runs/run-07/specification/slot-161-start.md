# Slot 161 — Start (Run 7 — Increment 6: Pet visits — architecture reference executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: specification
depends_on:
  - "152-re-review-2"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-architecture-reference
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-152-re-review-2-finished.md exists (exploration stage PASS — parallel with CRC chain per run-7-parallel-flow.md)
```

Reference — appointment scheduling mechanism and transactional notification mechanism in `docs/architecture/architecture-reference.md`. Cover: appointment lifecycle state machine, staff workflow board, visit follow-up notification trigger. Preserve prior mechanisms (Increments 1–5).

Write `slot-161-finished.md`.

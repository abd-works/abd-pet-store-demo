# Slot 155 — Start (Run 7 — Increment 6: Pet visits — spec-by-example executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: specification
depends_on:
  - "154"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-specification-by-example
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-154-finished.md exists
```

Output: `docs/story/specification-by-example/increment-6-specification-by-example.md`.

Concrete Given/When/Then scenarios with real domain values for all 19 Increment 6 stories. Appointment booking must be account-gated (no guest booking). Include staff visit conduct and outcome recording scenarios.

Write `slot-155-finished.md`.

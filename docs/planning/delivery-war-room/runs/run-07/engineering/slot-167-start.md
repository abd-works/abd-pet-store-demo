# Slot 167 — Start (Run 7 — Increment 6: Pet visits — ATDD RED executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: engineering
depends_on:
  - "166"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-166-finished.md exists
```

Write failing acceptance tests (RED) for Increment 6 pet visits under `tests/` per MERN patterns. Cover: browse pets by species, view pet profile, request appointment (auth-gated), confirm/cancel appointment, conduct staff visit, record visit outcome, send visit follow-up notification.

Tests may fail (RED) until slot 169 GREEN — npm test must run without infrastructure errors; Increments 1–5 tests (282) remain green.

Write `slot-167-finished.md`.

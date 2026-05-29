# Slot 166 — Start (Run 7 — Increment 6: Pet visits — object model reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: engineering
depends_on:
  - "165"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-object-model
prior_executor_slot: 165
artifact_paths:
  - docs/planning/delivery-war-room/slot-165-finished.md
  - docs/domain/object-model.md
  - packages/
practice_skill_under_review: abd-object-model
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
```

Review slot 165 object model. Run abd-object-model scanners. Verify pet, appointment, and visit types; Increment 6 scope guard (no Increment 1–5 regressions); npm test still green before ATDD slot.

Write `slot-166-finished.md`.

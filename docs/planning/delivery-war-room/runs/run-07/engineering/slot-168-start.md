# Slot 168 — Start (Run 7 — Increment 6: Pet visits — ATDD RED reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: engineering
depends_on:
  - "167"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
prior_executor_slot: 167
artifact_paths:
  - docs/planning/delivery-war-room/slot-167-finished.md
  - tests/pet-visits/
practice_skill_under_review: abd-acceptance-test-driven-development
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
```

Review slot 167 ATDD tests. Run abd-acceptance-test-driven-development and mern-technical-architecture scanners. Verify RED tests map to Increment 6 scenarios; auth-gate test present; Increments 1–5 baseline (282 tests) still green. MERN test_scripts may be waived per prior Run 6 policy.

Write `slot-168-finished.md`.

# Slot 157 — Start (Run 7 — Increment 6: Pet visits — scenario walkthrough executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: specification
depends_on:
  - "156"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-scenario-walkthrough
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-156-finished.md exists
```

Walk booking + staff visit scenarios through the Increment 6 domain model. Cover: adoption appointment lifecycle (request → confirm/cancel → conduct → record outcome → notify), guest trying to book without account (rejection path), staff visit board workflow.

Output: `docs/domain/increment-6-walkthrough.md`.

Write `slot-157-finished.md`.

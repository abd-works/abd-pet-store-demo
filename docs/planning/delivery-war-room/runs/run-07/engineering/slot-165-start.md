# Slot 165 — Start (Run 7 — Increment 6: Pet visits — object model executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: engineering
depends_on:
  - "164"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-object-model
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-164-finished.md exists
```

Pet, adoption appointment, visit outcome domain types for Increment 6. Output typed shared domain in `packages/` per MERN architecture (Pet, Species, AvailabilitySlot, AdoptionAppointment, AppointmentStatus, VisitOutcome, StaffWorkflow, VisitNotification). Extend `docs/domain/object-model.md`.

Write `slot-165-finished.md`.

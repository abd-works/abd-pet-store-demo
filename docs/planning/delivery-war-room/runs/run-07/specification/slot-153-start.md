# Slot 153 — Start (Run 7 — Increment 6: Pet visits — CRC executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: specification
depends_on:
  - "152-re-review"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-class-responsibility-collaborator
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-152-finished.md exists
```

CRC — pet, adoption appointment, visit outcome for Increment 6. Cover: Pet, Species, AvailabilitySlot, AppointmentRequest, AdoptionAppointment, VisitOutcome, StaffWorkflow, TransactionalNotification.

Output: refresh `docs/domain/crc.md` Increment 6 sections.

Write `slot-153-finished.md`.

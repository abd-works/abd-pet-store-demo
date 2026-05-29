# Slot 161-rework — Start (Run 7 — Increment 6: Pet visits — Architecture reference rework executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: specification
depends_on:
  - "162"
run_scope: Increment 6 — Pet visits (targeted fix — two missing appointment repository files)
skills:
  - abd-architecture-reference
corrections: docs/corrections-log.md — filter by stage: specification · role: engineer · run: Run 7
checkpoint: none
entry_conditions_met:
  - slot-162-finished.md exists (Overall gate: REWORK REQUIRED — two missing repository files)
prior_executor_slot: 161
reviewer_slot: 162
```

**Two targeted files only. Do NOT modify existing files — add only the two missing repository implementations.**

## Fix — Write two missing MongoDB repository files

Use `packages/pet/server/pet.mongo-repository.ts` as the pattern reference for both files.

### File 1: `packages/appointment/server/appointment.mongo-repository.ts`

Mongoose-backed implementation of the appointment repository interface. Must include:
- Mongoose schema matching the `Appointment` entity fields (id, petId, customerId, staffId, slotId, status, checkedInAt, outcome, followUpAction, followUpDate, notificationStatus, cancelledAt, cancelledBy)
- `findById(id)` — returns `Appointment` or throws `AppointmentNotFoundError`
- `findByCustomer(customerId)` — returns `Appointment[]`
- `findByDateRange(storeId, from, to)` — returns `Appointment[]` for staff board queries
- `save(appointment)` — upsert
- `findPendingForReminder(windowStart, windowEnd)` — for `AppointmentReminderJob`
- `findForFollowUp(today)` — for `FollowUpNotificationJob`
- Typed domain errors: `AppointmentNotFoundError`
- Constructor injection: `constructor(private readonly model: Model<AppointmentDocument>)`

### File 2: `packages/appointment/server/slot-hold.mongo-repository.ts`

Mongoose-backed implementation for TTL slot holds. Must include:
- Mongoose schema with TTL index (`expireAfterSeconds`) matching the slot hold lifecycle
- `findBySlot(slotId)` — returns active hold or null
- `create(hold)` — creates new hold with TTL
- `release(holdId)` — deletes the hold document
- `releaseByAppointment(appointmentId)` — releases hold when appointment is confirmed or cancelled
- Constructor injection: `constructor(private readonly model: Model<SlotHoldDocument>)`

**After writing both files, verify:**
- Both files compile cleanly (no TypeScript errors visible from inspection)
- Constructor injection pattern matches `pet.mongo-repository.ts`
- No existing files modified

Write `slot-161-rework-finished.md`.

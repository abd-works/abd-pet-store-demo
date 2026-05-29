# Slot 161-rework — Finished (Engineer executor — Architecture reference rework)

```yaml
team-role: engineer
slot_type: executor
stage: specification
run: "Run 7 — Increment 6: Pet visits"
practice_skill: abd-architecture-reference
scanner_validation: deferred to reviewer slot (slot-162-re-review)
status: complete
completed_at: 2026-05-26T13:45:00Z
```

## Artifact paths produced

| File | Action |
|---|---|
| `packages/appointment/server/appointment.mongo-repository.ts` | **Created** — MongoDB-backed `IAppointmentRepository` implementation |
| `packages/appointment/server/slot-hold.mongo-repository.ts` | **Created** — MongoDB-backed `ISlotHoldRepository` implementation |

## No existing files modified

Constraint from slot-161-rework-start.md fully honoured — only the two missing files were added. Zero existing files were touched.

## Implementation summary

### `appointment.mongo-repository.ts`

- `AppointmentMongoRepository` implements `IAppointmentRepository` (10 methods)
- Constructor injection: `Collection<AppointmentSnapshot>` — matches `pet.mongo-repository.ts` pattern
- Private `fromDoc(doc)` helper: reconstructs `Appointment` from snapshot, coercing all ISO string date fields to `Date`, using `CheckInRecord` / `NoShowRecord` constructors, and `safeFollowUpDate()` guard for historical past-date followUpDates
- Private `toSnapshot(appointment)` helper: maps all entity fields back to `AppointmentSnapshot` for storage
- `findConfirmedByStore` / `findConfirmedByPet` — filter by `$in: [Confirmed, CheckedIn]`
- `findDueForReminder(from, to)` — dot-notation filter on `timeSlot.startAt` + `reminderSent: false`
- `findDueForFollowUp(today)` — day-window ISO string range on `followUpDate`
- `isSlotBooked` — `countDocuments` on `timeSlot.timeSlotId`, excluding Cancelled
- `save` — upsert via `replaceOne({ id }, snapshot, { upsert: true })`
- `setNotificationStatus` / `setReminderSent` — targeted `updateMany` / `updateOne`

### `slot-hold.mongo-repository.ts`

- `SlotHoldMongoRepository` implements `ISlotHoldRepository` (4 methods)
- Constructor injection: `Collection<SlotHoldSnapshot>`
- `findActiveHold` — filters by `expiresAt: { $gt: now }` to exclude expired TTL holds
- `insert` — calls `hold.toSnapshot()` before insertion
- `delete` — removes by `holdId`

## Linter

No linter errors found on either file.

## Constructor injection pattern

Both files match the reference pattern from `packages/pet/server/pet.mongo-repository.ts`:
- `constructor(private readonly collection: Collection<T>) {}`
- No service locator, no static state, no module-level side effects

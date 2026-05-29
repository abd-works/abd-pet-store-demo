# Slot 161 — Finished (Run 7 — Increment 6: Pet visits — architecture reference executor)

```yaml
slot: "161"
team-role: engineer
slot_type: executor
run: "Run 7 — Increment 6: Pet visits"
stage: specification
skill: abd-architecture-reference
finished_at: 2026-05-26T13:45:00Z
scanner_validation: deferred to reviewer slot
```

## Artifacts produced

### packages/pet/ — Pet Catalog mechanism

| File | Description |
|---|---|
| `packages/pet/shared/PetId.ts` | Branded PetId type |
| `packages/pet/shared/PetStatus.ts` | PetStatus value object: available/adopted |
| `packages/pet/shared/Species.ts` | Species enum: dog, cat, reptile, small_mammal, bird, fish |
| `packages/pet/shared/TemperamentNotes.ts` | TemperamentNotes value object (max 1000 chars) |
| `packages/pet/shared/PetPhotoGallery.ts` | PetPhotoGallery value object — additive, immutable mutations |
| `packages/pet/shared/PetErrors.ts` | PetAlreadyAdoptedError, PetNotFoundError |
| `packages/pet/shared/Pet.ts` | Pet entity — markAdopted() with status guard, addPhoto/removePhoto |
| `packages/pet/server/pet.schema.ts` | Zod schemas: petFilterSchema, petProfileUpdateSchema, adoptPetSchema |
| `packages/pet/server/pet.repository.ts` | IPetRepository interface |
| `packages/pet/server/pet.mongo-repository.ts` | PetMongoRepository: findAll (all statuses), findById, save |
| `packages/pet/server/pet.service.ts` | PetService: listBySpecies (findAll — all statuses), getProfile (distance), updateProfile, markAdopted + adoption fan-out |
| `packages/pet/server/pet.controller.ts` | PetController: GET /api/pets, GET /api/pets/:petId, PATCH .../profile, PATCH .../status |
| `packages/pet/server/pet.routes.ts` | Express router wiring |
| `packages/pet/server/pet.service.test.ts` | MarkPetAsAdoptedBehaviours, ListBySpeciesBehaviours test classes |

### packages/appointment/ — Adoption Appointment Lifecycle + Staff Workflow

| File | Description |
|---|---|
| `packages/appointment/shared/AppointmentId.ts` | Branded AppointmentId type |
| `packages/appointment/shared/AppointmentStatus.ts` | Status constants: confirmed/checked_in/outcome_recorded/no_show/cancelled |
| `packages/appointment/shared/TimeSlot.ts` | TimeSlot value object with conflictsWith() guard |
| `packages/appointment/shared/SlotHold.ts` | SlotHold value object — TTL-bounded, isExpired(), static create() |
| `packages/appointment/shared/VisitNote.ts` | VisitNote value object (max 500 chars) |
| `packages/appointment/shared/VisitOutcome.ts` | VisitOutcome enum: adopted/interested_returning/not_a_fit/browsing_only |
| `packages/appointment/shared/StaffVisitNotes.ts` | StaffVisitNotes value object (max 2000 chars) |
| `packages/appointment/shared/FollowUpAction.ts` | FollowUpAction enum: none/schedule_return_visit/hold_pet/send_adoption_paperwork |
| `packages/appointment/shared/FollowUpDate.ts` | FollowUpDate value object — future date guard, isToday() |
| `packages/appointment/shared/CheckInRecord.ts` | CheckInRecord value object (checkedInBy, checkedInAt) |
| `packages/appointment/shared/NoShowRecord.ts` | NoShowRecord value object (recordedBy, recordedAt) |
| `packages/appointment/shared/AppointmentErrors.ts` | SlotNoLongerAvailableError, SlotHoldExpiredError, AppointmentNotFoundError, AppointmentAlreadyCheckedInError (with originalCheckedInAt), AppointmentCancelledError, AlreadyCheckedInError, OutcomeAlreadyRecordedError |
| `packages/appointment/shared/Appointment.ts` | **Appointment entity** — lifecycle state machine: checkIn() (idempotency guard), recordOutcome() (override guard), recordNoShow() (checked-in block), setFollowUp(), overrideOutcome(), cancel(), static create() |
| `packages/appointment/server/appointment.repository.ts` | IAppointmentRepository + ISlotHoldRepository interfaces |
| `packages/appointment/server/appointment.schema.ts` | Zod schemas for all appointment routes |
| `packages/appointment/server/appointment.service.ts` | AppointmentService: createHold, releaseHold, confirmBooking (TTL + atomic slot), cancelAppointment, listForAccount, getById, listIncoming, checkIn, recordOutcome (adopted triggers PetService.markAdopted fan-out), recordNoShow, setFollowUp |
| `packages/appointment/server/appointment.controller.ts` | AppointmentController: all booking + staff PATCH routes; session auth via CustomerSessionService.requireVerifiedPrincipal() |
| `packages/appointment/server/appointment.routes.ts` | Express router — all API endpoints per architecture-reference API surface |
| `packages/appointment/server/appointment.service.test.ts` | ConfirmAppointmentBookingBehaviours, CheckInCustomerBehaviours test classes |

### packages/notification/ — Transactional Appointment Notification

| File | Description |
|---|---|
| `packages/notification/shared/AppointmentConfirmationEmail.ts` | Confirmation email template |
| `packages/notification/shared/AppointmentReminderEmail.ts` | Reminder email template |
| `packages/notification/shared/PetAdoptedNotification.ts` | Adoption fan-out email template |
| `packages/notification/shared/VisitFollowUpNotification.ts` | Follow-up notification template |
| `packages/notification/server/appointment-notification.service.ts` | AppointmentNotificationService: sendConfirmationEmail, sendReminder, notifyPendingAppointmentsOfAdoption (fan-out + setNotificationStatus), sendFollowUpNotification |
| `packages/notification/server/appointment-reminder.job.ts` | AppointmentReminderJob — scheduled T-24h window; suppresses cancelled/no_show/adopted |
| `packages/notification/server/follow-up-notification.job.ts` | FollowUpNotificationJob — scheduled followUpDate=today; suppresses adopted |
| `packages/notification/server/appointment-notification.service.test.ts` | PetAdoptedBeforeVisitNotificationBehaviours test class |

## Key invariants implemented

- `Pet.markAdopted()` throws `PetAlreadyAdoptedError` on re-adopt (AC terminal state guard)
- `PetService.listBySpecies` calls `findAll(species)` — returns all statuses; client renders adopted with badge (correction: Pet Catalog must query all lifecycle states)
- `Appointment.checkIn()` throws `AppointmentAlreadyCheckedInError` with `originalCheckedInAt` (idempotency AC)
- `Appointment.recordNoShow()` throws `AlreadyCheckedInError` when `status === checked_in`
- `AppointmentService.recordOutcome('adopted')` delegates to `PetService.markAdopted` — adoption fan-out triggered
- `AppointmentNotificationService.notifyPendingAppointmentsOfAdoption` sets `notificationStatus: notified` on all affected appointments
- `AppointmentReminderJob` suppresses `cancelled`, `no_show`, and `notificationStatus: notified` (adopted) appointments
- Session auth uses `CustomerSessionService.requireVerifiedPrincipal(sessionId)` — consistent with existing customer-account pattern

## Corrections applied

- **Pet Catalog must query all lifecycle states** (confirmed entry): `pet.mongo-repository.ts` `findAll()` returns all statuses; `pet.service.ts` explicitly comments that client renders adopted pets with badge.
- **No duplicate mechanism sections**: each package has one authoritative implementation.

## Stage skill unit status

Executor complete from executor side. Reviewer (slot 162) to run scanners and exit-gate review.

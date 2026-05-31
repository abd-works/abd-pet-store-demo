# Object Model


---

## increment-6-walkthrough

<!-- migrated from: increments/6-pet-visits/engineering/object-model.md -->

---
state: walkthrough
increment: 6
---

# Increment 6 — Walkthrough: Pet visits — gallery and in-store appointments

## Scope

**Epic:** `Pet visits - gallery and in-store appointments`

**Stories:**
- Browse Pets by Species
- View Pet Profile
- View Pet Store Location and Distance
- View Available Time Slots at Store
- Select Date and Time Slot
- Add Visit Note
- Confirm Appointment Booking
- View Upcoming and Past Appointments
- Cancel or Rebook Appointment After Pet Adoption
- Update Pet Profile
- Mark Pet as Adopted
- View Incoming Appointments
- Send Appointment Reminder
- Send Pet Adopted Before Visit Notification
- Check In Customer
- Record Visit Outcome
- Record No-Show
- Set Follow-Up Action
- Send Visit Follow-Up Notification

---

# Core Domain

## **Pet**

Pet gallery browsing and pet lifecycle scenarios walk `Pet Gallery`, `Species`, `Pet`, `Pet Card`, and `Pet Lifecycle Event`. The central CRC invariant governing all browsing: pets are never purchasable; the `appointment booking call-to-action` on a `Pet` is shown only when `pet status` is `available` and hidden when `adopted`. All pets appear in the gallery regardless of status — adopted pets render with an adopted badge.

### **Gallery browsing with species filter — happy path**

**Purpose:** Validate that `Pet Gallery` filters to a single species and presents `Pet Card` entries correctly, including the card heading and store attribution.
**Concepts traced:** Pet Gallery, Species, Pet, Pet Card

#### Walk 1 — Covers: gallery rendered with Dog species filter active (PET-001)

```
gallery: PetGallery = new PetGallery()
gallery.filterBySpecies(species: Species("Dog"))
    // Pet Gallery.filter by species — CRC invariant: when a species filter is active, only pets of that species are shown
    cards: List<PetCard> = gallery.presentPetCardPerPet(species: Species("Dog"))
        // Pet Gallery.present pet card per pet — CRC: one Pet Card per Pet returned by filter
        card1: PetCard = new PetCard(pet: Pet("PET-001"))
            card1.petPhoto      = PetPhoto("pet001_front.jpg")
            card1.petBreed      = Breed("Golden Retriever")
            card1.petSpecies    = Species("Dog")
            card1.hostingStore  = Store("STR-001", storeName: "PawPlace Bristol")
            // Pet Card.link to pet profile page — CRC invariant: each card navigates to the Pet Profile Page for that pet
        return card1
    return cards  // [card1]; expected_card_heading: "Golden Retriever · Dog · PawPlace Bristol"
// filter chip: Dog — expected_filter_style: selected-highlighted
```

#### Walk 2 — Covers: empty state — no available pets for Bird species (edge)

```
gallery: PetGallery = new PetGallery()
gallery.filterBySpecies(species: Species("Bird"))
    // Pet Gallery.show empty state when no pets — CRC invariant: empty state shown when no pets of selected species exist
    pets: List<Pet> = gallery.filterBySpecies(species: Species("Bird"))
    // pets: []
    // gallery renders: "No pets available in this category right now"
    // Pet Gallery.show empty state when no pets — CRC invariant: filter remains active; other species remain selectable
    // expected_other_species: Dog, Cat, Reptile, Small Mammal
    return []
```

### **Adopted pet profile — badge shown, booking CTA suppressed (edge path)**

**Purpose:** Validate that PET-005 (Rex, Adopted) remains viewable on profile but the booking call-to-action is hidden and an adopted badge is rendered.
**Concepts traced:** Pet, Pet Gallery

#### Walk 1 — Covers: adopted pet profile viewed by customer

```
pet: Pet = Pet("PET-005")
    pet.petStatus = "Adopted"
    pet.petBreed  = Breed("Golden Retriever")
    pet.species   = Species("Dog")
    pet.hostingStore = Store("STR-002", storeName: "PawPlace London")
// Pet.appear in pet gallery — CRC invariant: all pets appear regardless of status; adopted pets render with adopted badge
badge: String = "Adopted"
// Pet.appointment booking call-to-action — CRC invariant: shown only when pet status is available; hidden or disabled when adopted
actionArea: String = "This pet has found a home"
// profile photo, breed, species, store details remain visible — CRC invariant: adopted pets are not deleted from gallery
```

### **Mark Pet as Adopted — lifecycle event recorded, notifications triggered (cooperation)**

**Purpose:** Walk the full adoption recording path: `PetLifecycleEvent` appended, `Pet.petStatus` transitions to `Adopted`, `Pet Adopted Before Visit Notification` triggered for each pending appointment.
**Concepts traced:** Pet, Pet Lifecycle Event, Pet Adopted Before Visit Notification, Notification

#### Walk 1 — Covers: store employee marks PET-001 (Buddy) as adopted — APT-001 affected

```
pet: Pet = Pet("PET-001")
    pet.petStatus = "Available"   // before transition

// Store Employee action: mark PET-001 as Adopted
lifecycleEvent: PetLifecycleEvent = new PetLifecycleEvent()
    lifecycleEvent.lifecycleState  = "Adopted"
    lifecycleEvent.transitionedOn  = 2025-06-10
    lifecycleEvent.transitionedBy  = Store("STR-001")
    lifecycleEvent.transitionContext = "Store Employee adoption recording"
    // Pet Lifecycle Event — CRC invariant: each event is immutable once recorded
    // Pet.pet status — CRC invariant: progresses from available to adopted; cannot revert from adopted
pet.lifecycleEvents.append(lifecycleEvent)
pet.petStatus = "Adopted"

// Pet.trigger pet-adopted notification — CRC invariant: triggered when status transitions to adopted and pending appointments exist for this pet
notification: PetAdoptedBeforeVisitNotification = new PetAdoptedBeforeVisitNotification()
    notification.adoptedPet             = pet
    notification.affectedAppointment    = Appointment("APT-001")
    notification.recipient              = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    notification.includeCancelAndBrowseOptions = true
    // Pet Adopted Before Visit Notification.record notification status — CRC invariant: notified status visible per appointment on staff incoming view
    notification.recordNotificationStatus(appointment: Appointment("APT-001"))
        Appointment("APT-001").notificationStatus = "notified"
    Notification.deliverTransactionalMessage(notification)
    // notification body: "Buddy has been adopted. You can cancel your visit or browse other available pets"
    Notification.queueFailedDeliveryForRetry(notification)
    // CRC invariant: email delivery failure must not block pet lifecycle event recording
```

#### Walk 2 — Covers: idempotent adoption attempt — PET-005 already adopted (edge)

```
pet: Pet = Pet("PET-005")
    pet.petStatus = "Adopted"   // already adopted
// Store Employee attempts to mark PET-005 as Adopted again
// Pet.pet status — CRC invariant: cannot revert from adopted; status is already Adopted
// system shows: "Pet is already adopted"
// no PetLifecycleEvent recorded
// expected_notification_count: 0 — no notifications sent
```

### references

**Ref — Pet gallery and lifecycle**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Pet** — Pet, Species, Pet Gallery, Pet Card, Pet Lifecycle Event
Extract: partial

```source
pet status | (available or adopted)
    invariant: must always have a status; progresses from available to adopted; cannot revert from adopted
appear in pet gallery | Pet Gallery
    invariant: all pets appear in the gallery regardless of status; adopted pets render with an adopted badge
appointment booking call-to-action | Appointment
    invariant: shown only when pet status is available; hidden or disabled when adopted
trigger pet-adopted notification | Notification, Appointment
    invariant: triggered when status transitions to adopted and pending appointments exist for this pet
```

**Ref — Pet Gallery filter invariant**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Pet** — Pet Gallery
Extract: partial

```source
filter by species | Species, Pet
    invariant: when a species filter is active, only pets of that species are shown
show empty state when no pets | Species
    invariant: empty state shown when no pets of the selected species exist; filter remains active
```

### decisions made

- `Pet Gallery.filterBySpecies` returns pets of all `lifecycleState` values — adopted pets are included per the gallery invariant. The calling layer applies the adopted badge based on `pet.petStatus`.
- Empty-state path renders the "no pets available" message but does not deactivate the species filter — gallery CRC invariant: filter remains active.
- `PetLifecycleEvent` is appended to `Pet.lifecycleEvents` as an immutable record; `Pet.petStatus` is then updated directly on `Pet` — the event records *who transitioned, when, and why*; the status field reflects the current state.
- On adoption with zero pending appointments: `PetAdoptedBeforeVisitNotification.suppressWhenNoPendingAppointments` applies; no notification sent and no `recordNotificationStatus` call is made.

---

## **Appointment**

Booking lifecycle, slot-hold mechanics, guest rejection, cancellation, and the full staff visit-board workflow walk `Appointment`, `Time Slot`, `Appointment Request`, `Appointment Cancellation`, `Appointment Rebooking`, `Visit Outcome`, `Follow-Up Action`, and `Staff Appointment Workflow`.

### **Full appointment booking — happy path (request → hold → confirm → booked)**

**Purpose:** Walk the complete booking flow: `TimeSlot` held on selection, `AppointmentRequest` confirmed, `Appointment` created, `TimeSlot` consumed, confirmation email queued.
**Concepts traced:** Time Slot, Appointment Request, Appointment, Appointment Confirmation Email, Notification

#### Walk 1 — Covers: logged-in CUST-001 books PET-001 at STR-001, TS-001

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "available"   // before

// Customer opens booking flow from Pet Profile Page
request: AppointmentRequest = new AppointmentRequest()
    request.requestingCustomerAccount = CustomerAccount("CUST-001")
    request.requestedPet              = Pet("PET-001")   // lifecycleState: Available
    request.selectedTimeSlot          = slot
    request.optionalVisitNote         = "Bringing my two kids aged 5 and 7"
    request.slotHoldDuration          = 10  // minutes; configurable

// Time Slot.hold for appointment request — CRC invariant: slot transitions to held on selection; held slot not shown to other customers
slot.holdForAppointmentRequest(request: request)
    slot.bookingStatus = "held"

// Customer confirms
appointment: Appointment = request.confirmToCreateAppointment()
    // Appointment Request.confirm to create appointment — CRC invariant: transitions slot from held to booked and creates a confirmed appointment
    slot.consumeOnBookingConfirmation(appointment: appointment)
        // Time Slot.consume on booking confirmation — CRC invariant: once booked, no longer available to other customers
        slot.bookingStatus = "booked"
    appointment.bookingCustomerAccount   = CustomerAccount("CUST-001")
    appointment.visitedPet               = Pet("PET-001")
    appointment.hostingStore             = Store("STR-001")
    appointment.scheduledDateAndTimeSlot = slot
    appointment.visitNote                = "Bringing my two kids aged 5 and 7"
    appointment.appointmentStatus        = "confirmed"
    appointment.bookingDate              = 2025-06-09
    return appointment
// confirmation heading: "Appointment confirmed — Tue 10 Jun, 10:00 at PawPlace Bristol"

// Appointment.trigger confirmation notification
appointment.triggerConfirmationNotification()
    email: AppointmentConfirmationEmail = new AppointmentConfirmationEmail()
        email.bookingAppointment = appointment
        email.recipient          = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    // Appointment Confirmation Email.deliver on appointment confirmation — CRC invariant: must not block appointment creation when delivery fails
    email.deliverOnAppointmentConfirmation(appointment: appointment)
    // Notification.queue failed delivery for retry — CRC invariant: failure must not block appointment creation
    Notification.queueFailedDeliveryForRetry(email)
```

#### Walk 2 — Covers: hold expiry — slot released back to available (edge)

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "held"
request: AppointmentRequest = AppointmentRequest(customer: CustomerAccount("CUST-001"), slot: slot)
    request.slotHoldDuration = 10  // minutes; hold elapsed without confirmation

// Appointment Request.release slot on hold expiry — CRC invariant: expired hold returns slot to available; customer must re-select
request.releaseSlotOnHoldExpiry(slot: slot)
    // Time Slot.release on hold expiry — CRC invariant: slot returns to available if appointment request not confirmed within hold duration
    slot.releaseOnHoldExpiry(request: request)
        slot.bookingStatus = "available"
// customer sees: "Your hold has expired — please select a new time slot"
```

#### Walk 3 — Covers: concurrent selection — first to confirm wins (shared resource)

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "available"

// CUST-001 selects TS-001
request1: AppointmentRequest = new AppointmentRequest(customer: CustomerAccount("CUST-001"), slot: slot)
slot.holdForAppointmentRequest(request: request1)
    slot.bookingStatus = "held"   // held for CUST-001; TS-001 no longer shown to other customers

// CUST-002 also selects TS-001 in the same window (sees it as available before hold propagated)
request2: AppointmentRequest = new AppointmentRequest(customer: CustomerAccount("CUST-002"), slot: slot)

// CUST-001 confirms first
appointment1: Appointment = request1.confirmToCreateAppointment()
    slot.consumeOnBookingConfirmation(appointment: appointment1)
        slot.bookingStatus = "booked"

// CUST-002 attempts to confirm — slot no longer held for CUST-002
// Appointment Request.confirm to create appointment — CRC invariant: slot must be in held status for this customer to confirm
// CUST-002 blocked: "This slot is no longer available — please pick another"
// CUST-001's appointment is unaffected; expected_first_outcome: "Appointment confirmed"
```

### **Guest booking rejection — authentication gate (failure path)**

**Purpose:** Validate that a guest session cannot complete an appointment booking; the held `TimeSlot` is preserved while the guest is prompted to authenticate.
**Concepts traced:** Appointment Request, Customer Account, Time Slot

#### Walk 1 — Covers: guest attempts to confirm — blocked; TS-001 slot held during auth

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "held"   // slot held by the guest session's selection

// Guest session attempts to confirm appointment
request: AppointmentRequest = new AppointmentRequest(customer: null, slot: slot)

// Appointment Request.block on unauthenticated request — CRC invariant: booking step blocked for guest sessions
request.blockOnUnauthenticatedRequest()
    // CustomerAccount required; customer is not logged in
    // page heading: "Log in to book"
    // prompt body: "Appointments require a PawPlace account — log in or register to continue"
    // CRC invariant: slot hold maintained briefly while customer logs in or registers
    slot.bookingStatus = "held"   // unchanged; expected_slot_status: held
```

### **Appointment cancellation after pet adoption — slot released (cancel path)**

**Purpose:** Walk cancellation of APT-003 (adopted PET-005 Rex): `AppointmentCancellation` created, `TimeSlot` TS-010 released, cancellation history recorded, rebooking offer surfaced.
**Concepts traced:** Appointment, Appointment Cancellation, Time Slot, Customer Account, Appointment Rebooking

#### Walk 1 — Covers: customer cancels APT-003 — TS-010 released, rebooking offered

```
appointment: Appointment = Appointment("APT-003")
    appointment.appointmentStatus        = "confirmed"
    appointment.scheduledDateAndTimeSlot = TimeSlot("TS-010")
    appointment.visitedPet               = Pet("PET-005")   // lifecycleState: Adopted
    appointment.bookingCustomerAccount   = CustomerAccount("CUST-001")

// Appointment.cancel appointment — CRC invariant: cancellation releases the booked time slot and records in appointment history
cancellation: AppointmentCancellation = appointment.cancelAppointment()
    cancellation.cancelledAppointment  = appointment
    cancellation.cancellationDate      = 2025-06-09
    cancellation.cancellationReason    = "Pet adopted before visit"

    // Appointment Cancellation.release booked time slot — CRC invariant: releases slot back to available
    cancellation.releaseBookedTimeSlot(slot: TimeSlot("TS-010"), appointment: appointment)
        TimeSlot("TS-010").bookingStatus = "available"
        // Time Slot.release on appointment cancellation — CRC: slot returns to available when cancellation recorded before visit date

    // Appointment Cancellation.record in appointment history — CRC invariant: cancellation recorded in customer account appointment history
    cancellation.recordInAppointmentHistory(account: CustomerAccount("CUST-001"))
    appointment.appointmentStatus = "cancelled"
    // confirmation: "Appointment cancelled — time slot released"

    // Appointment Cancellation.trigger rebooking offer — CRC invariant: surfaced when customer cancels after receiving pet-adopted notification
    cancellation.triggerRebookingOffer()
        rebooking: AppointmentRebooking = new AppointmentRebooking()
            rebooking.cancelledAppointmentReference = cancellation
            // customer navigates to Pet Gallery to select a new pet
            // Appointment Rebooking.follow same booking flow — CRC invariant: follows the same booking confirmation flow as a new appointment
```

### **Staff visit board workflow — check-in, record outcome, set follow-up (staff cooperation)**

**Purpose:** Walk the complete staff-side visit lifecycle for APT-001: check-in recorded, `VisitOutcome` applied, `FollowUpAction` set, follow-up notification scheduled.
**Concepts traced:** Staff Appointment Workflow, Appointment, Visit Outcome, Follow-Up Action, Visit Follow-Up Notification, Notification

#### Walk 1 — Covers: check in CUST-001 for APT-001, record Browsing Only, set schedule-return-visit follow-up

```
workflow: StaffAppointmentWorkflow = StaffAppointmentWorkflow(store: Store("STR-001"))
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus = "confirmed"

// Staff Appointment Workflow.check in customer — CRC invariant: records checked-in time and staff member; blocked if already checked-in or cancelled
workflow.checkInCustomer(appointment: appointment, store: Store("STR-001"))
    appointment.checkedInTime     = 2025-06-10T09:55:00
    appointment.checkedInBy       = Store("STR-001")
    appointment.appointmentStatus = "checked-in"
    // staff view: "Checked in at 09:55 by STR-001"

// Record visit outcome
outcome: VisitOutcome = new VisitOutcome()
    outcome.outcomeCategory         = "Browsing Only"
    outcome.optionalStaffVisitNotes = "Customer enjoyed meeting the dog"

// Visit Outcome.record on checked-in appointment — CRC invariant: can only be recorded after appointment is in checked-in status
outcome.recordOnCheckedInAppointment(appointment: appointment)
    appointment.visitOutcome         = outcome
    appointment.staffVisitNotes      = "Customer enjoyed meeting the dog"
    appointment.appointmentStatus    = "completed"
    // outcome summary: "Browsing Only — Customer enjoyed meeting the dog"

// Set follow-up action
followUp: FollowUpAction = new FollowUpAction()
    followUp.actionType   = "schedule-return-visit"
    followUp.followUpDate = 2025-06-17

// Staff Appointment Workflow.set follow-up action — CRC invariant: follow-up action and date recorded after outcome
workflow.setFollowUpAction(appointment: appointment, followUpAction: followUp)
    appointment.followUpAction = followUp
    appointment.followUpDate   = 2025-06-17
    // follow-up detail: "Return visit scheduled for Tue 17 Jun"

// Follow-Up Action.trigger follow-up notification — CRC invariant: fires on follow-up date when action type is not none; suppressed if pet adopted before follow-up
followUp.triggerFollowUpNotification()
    // scheduled for 2025-06-17 — see Notification KA Walk for full delivery path
```

#### Walk 2 — Covers: Adopted outcome triggers pet status transition (cooperation)

```
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus = "checked-in"
pet: Pet = Pet("PET-001")
    pet.petStatus = "Available"

outcome: VisitOutcome = new VisitOutcome()
    outcome.outcomeCategory = "Adopted"

// Visit Outcome.trigger pet adoption transition — CRC invariant: adopted outcome triggers the same pet status transition and notifications as the Mark Pet as Adopted path
outcome.triggerPetAdoptionTransition(pet: pet, appointment: appointment, notification: Notification)
    lifecycleEvent: PetLifecycleEvent = new PetLifecycleEvent()
        lifecycleEvent.lifecycleState = "Adopted"
        lifecycleEvent.transitionedBy = Store("STR-001")
        // Pet Lifecycle Event — CRC invariant: immutable once recorded
    pet.lifecycleEvents.append(lifecycleEvent)
    pet.petStatus = "Adopted"
    // adoption notifications sent for any other pending appointments referencing PET-001
    // this appointment (APT-001) is now completing → status transitions to completed
    appointment.visitOutcome      = outcome
    appointment.appointmentStatus = "completed"
    // expected_notification_count for other affected appointments: 1 (if APT-002 is also for PET-001)

// Visit Outcome.trigger follow-up prompt — CRC invariant: Interested-Returning outcome prompts staff to set follow-up action
// (not applicable for Adopted outcome — no follow-up prompt shown)
```

### **Record no-show — happy path and blocked edge**

**Purpose:** Walk no-show recording for a missed confirmed appointment; validate that the no-show path is blocked when the appointment is already checked-in.
**Concepts traced:** Staff Appointment Workflow, Appointment

#### Walk 1 — Covers: no-show recorded for confirmed APT-001 after TS-001 passes

```
workflow: StaffAppointmentWorkflow = StaffAppointmentWorkflow(store: Store("STR-001"))
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus        = "confirmed"
    appointment.scheduledDateAndTimeSlot = TimeSlot("TS-001")   // start: 10:00:00; passed without check-in

// Staff Appointment Workflow.record no-show — CRC invariant: blocked if appointment is already checked-in; records staff member and timestamp; triggers follow-up notification to customer
workflow.recordNoShow(appointment: appointment, store: Store("STR-001"))
    appointment.noShowRecordedBy    = Store("STR-001")
    appointment.noShowRecordedAt    = 2025-06-10T10:45:00
    appointment.appointmentStatus   = "no-show"
    Notification.deliverTransactionalMessage(noShowNotification)
    // notification body: "You missed your visit — would you like to rebook?"
```

#### Walk 2 — Covers: no-show blocked — appointment already checked-in (edge)

```
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus = "checked-in"
    appointment.checkedInTime     = 2025-06-10T09:55:00

// Staff Appointment Workflow.record no-show — CRC invariant: blocked if appointment is already checked-in
// system shows: "Cannot mark as no-show — customer was already checked in"
// appointmentStatus remains: "checked-in"
```

### references

**Ref — Appointment booking and staff workflow**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Appointment** — Appointment, Time Slot, Appointment Request, Appointment Cancellation, Visit Outcome, Follow-Up Action, Staff Appointment Workflow
Extract: partial

```source
hold for appointment request | Appointment Request
    invariant: slot transitions to held when customer selects it; held slot is not shown to other customers
block on unauthenticated request | Customer Account
    invariant: booking step blocked for guest sessions; slot hold maintained briefly while customer logs in or registers
cancel appointment | Appointment Cancellation
    invariant: cancellation releases the booked time slot and records in appointment history
check in customer | Appointment, Store
    invariant: records checked-in time and staff member; blocked if appointment is already checked-in or cancelled
record no-show | Appointment, Store
    invariant: blocked if appointment is already checked-in; records staff member and timestamp; triggers follow-up notification to customer
set follow-up action | Appointment, Follow-Up Action
    invariant: follow-up action and date recorded after outcome or no-show; triggers visit follow-up notification on follow-up date
```

### decisions made

- `TimeSlot.holdForAppointmentRequest` (at slot selection) and `AppointmentRequest.confirmToCreateAppointment` (at booking confirm) are two distinct operations — the hold is a temporary reservation, consumed only on confirmation.
- Concurrent booking: the second caller finds the slot no longer `held` for them when it transitions to `booked` on the first confirm. CRC invariant enforces this atomically.
- `AppointmentCancellation.triggerRebookingOffer` navigates to `Pet Gallery`. `AppointmentRebooking.follow same booking flow` then governs the new booking; it must reference a new pet and new time slot per CRC invariant.
- No-show recording triggers a rebook notification via `Notification.deliverTransactionalMessage`. The rebook notification is not a named subtype in CRC; it is dispatched as a `Notification` by `Staff Appointment Workflow.record no-show`. GAP: if this notification grows to have distinct body rules (e.g., suppression on adoption), a named `NoShowRebookNotification` subtype may be warranted in a future CRC refresh.
- `StaffAppointmentWorkflow.showPetAdoptedWarningBadge` and `showNotificationStatus` are staff view read operations; they query `Appointment.visitedPet.petStatus` and the `notificationStatus` recorded by `PetAdoptedBeforeVisitNotification.recordNotificationStatus`. No additional domain operation is required.

---

## **Notification**

Four appointment-specific transactional notification subtypes introduced in Increment 6: `Appointment Confirmation Email`, `Appointment Reminder`, `Pet Adopted Before Visit Notification`, and `Visit Follow-Up Notification`. All four follow the same retry-on-failure pattern established in prior increments: `Notification.queueFailedDeliveryForRetry` must not block the domain action that triggered them.

### **Appointment reminder — sent 24h before; suppressed on cancellation and adoption (edge paths)**

**Purpose:** Validate the reminder 24-hour trigger, cancellation suppression, and the adoption-precedence suppression path.
**Concepts traced:** Appointment Reminder, Appointment, Pet, Notification

#### Walk 1 — Covers: reminder sent 24h before APT-001 (happy path)

```
appointment: Appointment = Appointment("APT-001")
    appointment.scheduledDateAndTimeSlot = TimeSlot("TS-001")   // 2025-06-10T10:00:00
    appointment.appointmentStatus        = "confirmed"
    appointment.visitedPet               = Pet("PET-001", petName: "Buddy")
    appointment.hostingStore             = Store("STR-001", storeName: "PawPlace Bristol")

// Trigger fires at 2025-06-09T10:00:00 (24h before appointment)
reminder: AppointmentReminder = new AppointmentReminder()
    reminder.reminderAppointment = appointment
    reminder.recipient           = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    // Appointment Reminder — CRC invariant: sent 24 hours before the appointment time; includes pet name, store, date/time, and visit note

Notification.deliverTransactionalMessage(reminder)
    // reminder body: "Reminder: visit Buddy at PawPlace Bristol, Tue 10 Jun 10:00. Note: Bringing kids"
Notification.queueFailedDeliveryForRetry(reminder)
    // CRC invariant: failure must not block appointment status
```

#### Walk 2 — Covers: cancelled appointment — reminder suppressed (edge)

```
appointment: Appointment = Appointment("APT-004")
    appointment.appointmentStatus = "cancelled"

// Appointment Reminder.suppress when appointment cancelled — CRC invariant: no reminder sent for cancelled or no-show appointments
reminder: AppointmentReminder = AppointmentReminder(reminderAppointment: appointment)
reminder.suppressWhenAppointmentCancelled(appointment: appointment)
    // reminder outcome: skipped — appointment cancelled
    // Notification.deliverTransactionalMessage not called
```

#### Walk 3 — Covers: adopted pet — adoption notification takes precedence over reminder (edge)

```
appointment: Appointment = Appointment("APT-003")
    appointment.visitedPet.petStatus = "Adopted"
    appointment.appointmentStatus    = "confirmed"

// Appointment Reminder.suppress when pet adopted — CRC invariant: pet-adopted-before-visit notification takes precedence; reminder suppressed
reminder: AppointmentReminder = AppointmentReminder(reminderAppointment: appointment)
reminder.suppressWhenPetAdopted(pet: Pet("PET-005"), appointment: appointment)
    // reminder outcome: skipped — adoption takes precedence
    // expected_notification_type: Pet Adopted Before Visit Notification (sent instead)
```

### **Pet Adopted Before Visit Notification — triggered on adoption; suppressed when no pending appointments (cooperation)**

**Purpose:** Walk the notification sent when a pet with pending appointments is marked adopted; validate the suppression path when no pending appointments exist.
**Concepts traced:** Pet Adopted Before Visit Notification, Pet, Appointment, Notification

#### Walk 1 — Covers: notification sent to CUST-001 on PET-001 adoption (APT-001 pending)

```
notification: PetAdoptedBeforeVisitNotification = new PetAdoptedBeforeVisitNotification()
    notification.adoptedPet             = Pet("PET-001")
    notification.affectedAppointment    = Appointment("APT-001")
    notification.recipient              = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    notification.includeCancelAndBrowseOptions = true
    // Pet Adopted Before Visit Notification — CRC invariant: one notification per affected customer with a pending appointment for the adopted pet

// Pet Adopted Before Visit Notification.record notification status — CRC invariant: notified or not-yet-notified status visible per appointment on staff incoming appointments view
notification.recordNotificationStatus(appointment: Appointment("APT-001"))
    Appointment("APT-001").notificationStatus = "notified"

Notification.deliverTransactionalMessage(notification)
    // notification body: "Buddy has been adopted. You can cancel your visit or browse other available pets"
Notification.queueFailedDeliveryForRetry(notification)
    // CRC invariant: failure must not block pet lifecycle event recording
```

#### Walk 2 — Covers: no pending appointments — adoption completes, no notification sent (edge)

```
// PET-003 is marked adopted; it has 0 confirmed pending appointments
// Pet Adopted Before Visit Notification.suppress when no pending appointments — CRC invariant: no notification sent if no pending appointments
notification: PetAdoptedBeforeVisitNotification = PetAdoptedBeforeVisitNotification(pet: Pet("PET-003"))
notification.suppressWhenNoPendingAppointments(appointments: [])
    // expected_notification_count: 0
    // adoption event completes; Notification.deliverTransactionalMessage not called
    // Pet("PET-003").petStatus = "Adopted" — lifecycle event recorded; no notification side-effect
```

### **Visit Follow-Up Notification — triggered on date; suppressed when none or pet adopted (edge paths)**

**Purpose:** Walk the follow-up notification fired on `followUpDate`; suppression when `followUpAction` is `none`; suppression when pet adopted before `followUpDate`.
**Concepts traced:** Visit Follow-Up Notification, Follow-Up Action, Appointment, Pet, Notification

#### Walk 1 — Covers: follow-up notification sent on date (hold-pet action, 2025-06-14)

```
appointment: Appointment = Appointment("APT-001")
    appointment.followUpAction = FollowUpAction(actionType: "hold-pet", followUpDate: 2025-06-14)
    appointment.visitedPet     = Pet("PET-001", petName: "Buddy", lifecycleState: "Available")
    appointment.hostingStore   = Store("STR-001", storeName: "PawPlace Bristol")

// Current date: 2025-06-14
// Follow-Up Action.trigger follow-up notification — CRC invariant: fires on follow-up date when action type is not none
followUpNotification: VisitFollowUpNotification = new VisitFollowUpNotification()
    followUpNotification.sourceAppointment        = appointment
    followUpNotification.triggeringFollowUpAction  = FollowUpAction("hold-pet")
    followUpNotification.recipient                 = CustomerAccount("CUST-001")

// Visit Follow-Up Notification — CRC invariant: sent when follow-up date arrives and follow-up action type is not none
Notification.deliverTransactionalMessage(followUpNotification)
    // notification body: "Your hold on Buddy at PawPlace Bristol expires today — visit soon"
Notification.queueFailedDeliveryForRetry(followUpNotification)
```

#### Walk 2 — Covers: follow-up action is none — notification suppressed (edge)

```
appointment: Appointment = Appointment("APT-001")
    appointment.followUpAction = FollowUpAction(actionType: "none")

// Visit Follow-Up Notification.suppress when follow-up action none — CRC invariant: notification fires only when action type is not none
followUpNotification: VisitFollowUpNotification = VisitFollowUpNotification(appointment: appointment)
followUpNotification.suppressWhenFollowUpActionNone(followUpAction: FollowUpAction("none"))
    // follow-up outcome: no notification sent
    // appointment detail reads: "No follow-up set"
```

#### Walk 3 — Covers: pet adopted before follow-up date — adoption notification takes precedence (edge)

```
appointment: Appointment = Appointment("APT-001")
    appointment.followUpAction = FollowUpAction(actionType: "schedule-return-visit", followUpDate: 2025-06-17)
    appointment.visitedPet     = Pet("PET-001", lifecycleState: "Adopted")   // adopted before 2025-06-17

// Visit Follow-Up Notification.suppress when pet adopted before follow-up — CRC invariant: pet-adopted-before-visit notification takes precedence
followUpNotification: VisitFollowUpNotification = VisitFollowUpNotification(appointment: appointment)
followUpNotification.suppressWhenPetAdoptedBeforeFollowUp(pet: Pet("PET-001"))
    // follow-up outcome: skipped — pet adopted before follow-up
    // expected_notification_type: Pet Adopted Before Visit Notification
```

### references

**Ref — Notification — Increment 6 transactional paths**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Notification** — Appointment Confirmation Email, Appointment Reminder, Pet Adopted Before Visit Notification, Visit Follow-Up Notification
Extract: partial

```source
invariant: Increment 6 — appointment confirmation email fires on booking; appointment reminder fires the day before each upcoming appointment; pet-adopted-before-visit notification fires when a booked pet transitions to adopted; visit follow-up notification fires when follow-up date arrives and action is not none
queue failed delivery for retry | Confirmation Email, Shipping Notification, Email Verification, Appointment Confirmation Email, Appointment Reminder, Pet Adopted Before Visit Notification, Visit Follow-Up Notification
    invariant: email delivery failure must not block appointment creation, appointment status, pet lifecycle event recording, or visit outcome recording
```

**Ref — Appointment Reminder suppression rules**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Notification** — Appointment Reminder
Extract: partial

```source
suppress when appointment cancelled | Appointment
    invariant: no reminder sent for cancelled or no-show appointments
suppress when pet adopted | Pet, Appointment
    invariant: pet-adopted-before-visit notification takes precedence; reminder suppressed
```

### decisions made

- All four notification subtypes share the `Notification.queueFailedDeliveryForRetry` delivery path — none blocks the domain action that triggers them. This mirrors the pattern from Increment 2 (order confirmation email) and Increment 4 (email verification).
- Reminder suppression order: (1) check `appointmentStatus` — if `cancelled` or `no-show`, suppress without sending anything; (2) check `pet.petStatus` — if `Adopted` and adoption notification not yet sent, suppress reminder and fire `PetAdoptedBeforeVisitNotification` instead.
- `PetAdoptedBeforeVisitNotification.recordNotificationStatus` writes to the `Appointment` record; `StaffAppointmentWorkflow.showNotificationStatus` reads this field to display "Customer notified" or "Not yet notified" on the staff incoming appointments view.
- GAP: `Visit Follow-Up Notification` suppression when pet adopted (`suppressWhenPetAdoptedBeforeFollowUp`) implies the system must detect that the pet became adopted between when the follow-up was set and when `followUpDate` arrives. This detection logic lives in the notification scheduler checking `pet.petStatus` at trigger time — not a separate CRC responsibility, but worth noting for implementation.
- `AppointmentConfirmationEmail` delivery path: fires unconditionally on booking confirmation; queued for retry on failure per the standard Notification pattern. The appointment is created regardless.

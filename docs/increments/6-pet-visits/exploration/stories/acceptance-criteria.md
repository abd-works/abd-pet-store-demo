# Acceptance Criteria


---

## Increment 6

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

# Acceptance criteria — Increment 6: Pet visits — gallery and in-store appointments  

**Increment outcome:** The adoption side goes live. Customers browse the *Pet* gallery, see which *Store* a pet is at and how far away it is, and book an *Appointment* to visit. Store staff see incoming bookings. Pet status (available/adopted) is employee-managed. Appointment booking is **customer-account-only** — guest checkout cannot book.  

**Builds on:** Increments 1-5 (full e-commerce spine, accounts, multi-vendor payments live).  

---  

## Story: `Browse Pets by Species`  

**Story type:** user  

### Domain terms  

- *Pet Gallery* — the browsable collection of pets available at PawPlace stores  
- *Species* — the top-level grouping: dogs, cats, reptiles, small mammals, etc.  
- *Pet Card* — the summary view of a pet in the gallery: photo, name, breed, species, and store location  
- *Pet* — an animal available for adoption at a physical store  

### Acceptance criteria  

1. **WHEN** the customer opens the *Pet Gallery*  
   **THEN** pets are grouped or filterable by *Species*  
   **AND** each *Pet Card* shows the pet's photo, name, breed, species, and which *Store* it is at  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Each pet gets a profile page... browse by species, see which store they're at"  

2. **WHEN** the customer selects a *Species* filter  
   **THEN** only pets of that species are shown  
   **AND** the filter is visually active so the customer knows it is applied  
   **Evidence:** inferred — standard filtering behavior  

3. **WHEN** no pets of the selected *Species* are currently available  
   **THEN** the gallery shows a "no pets available in this category right now" message  
   **BUT** the filter remains active and other species options are visible for selection  
   **Evidence:** inferred — empty state for filtered gallery  

---  

## Story: `View Pet Profile`  

**Story type:** user  

### Domain terms  

- *Pet Profile Page* — the detail view of a single pet  
- *Pet* — an animal available for adoption  
- *Pet Status* — available or adopted  
- *Pet Photo Gallery* — multiple photos of the pet  
- *Temperament Notes* — behavioral description (friendly, shy, energetic, etc.)  

### Acceptance criteria  

1. **WHEN** the customer opens a *Pet Profile Page*  
   **THEN** the page shows: *Pet Photo Gallery*, name, species, breed, age (approximate if unknown), *Temperament Notes*, and the *Store* where the pet is located  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Each pet gets a profile page — photo gallery, basic info (breed, age, temperament)"  

2. **WHEN** the pet's *Pet Status* is *Available*  
   **THEN** the profile shows a "Book a Visit" action linking to the appointment flow  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "People can then book an appointment to visit the pet"  

3. **WHEN** the pet's *Pet Status* is *Adopted*  
   **THEN** the profile shows an "Adopted" badge  
   **AND** the "Book a Visit" action is hidden or disabled  
   **BUT** the profile remains viewable (adopted pets are not deleted from the gallery)  
   **Evidence:** domain-sketch.md — Pet KA, `pet` concept: "status progresses from available to adopted"; invariant: "must always have a status (available or adopted)"  

4. **WHEN** the pet has no *Temperament Notes* yet  
   **THEN** the field is omitted from the profile (not shown as blank)  
   **Evidence:** inferred — optional field handling  

---  

## Story: `View Pet Store Location and Distance`  

**Story type:** user  

### Domain terms  

- *Pet Profile Page* — the detail view where the pet's store is shown  
- *Store* — the physical location where the pet is housed  
- *Distance* — the calculated distance from the customer's location to the pet's store (reuses Increment 1's distance logic)  
- *Customer Location* — browser location or entered postcode  

### Acceptance criteria  

1. **WHEN** the customer views a *Pet Profile Page*  
   **THEN** the pet's *Store* is shown with name, address, and operating hours  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "see which store they're at and how far away"  

2. **WHEN** the customer has shared their location or entered a postcode (from Increment 1)  
   **THEN** the *Distance* from *Customer Location* to the pet's *Store* is displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "how far away"  

3. **WHEN** the customer has not shared location  
   **THEN** no *Distance* is shown  
   **AND** a prompt to share location or enter postcode is displayed  
   **Evidence:** inferred — distance requires a reference point (same pattern as Increment 1)  

4. **WHEN** the customer selects the *Store* name or address on the *Pet Profile Page*  
   **THEN** the *Store Detail* page opens (the same store detail from Increment 1)  
   **Evidence:** inferred — store detail is a shared component  

---  

## Story: `View Available Time Slots at Store`  

**Story type:** user  

### Domain terms  

- *Time Slot* — a bookable window for a pet visit at a store  
- *Available Time Slots* — slots not yet booked (open for reservation)  
- *Store* — the physical location offering appointments  
- *Appointment Calendar* — the UI surface showing available dates and times  

### Acceptance criteria  

1. **WHEN** the customer initiates the appointment booking flow from a pet profile  
   **THEN** the *Appointment Calendar* shows *Available Time Slots* at the pet's *Store*  
   **AND** slots are shown for the next N days (configurable by store, e.g. 14 or 30 days)  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "book an appointment to visit the pet in-store. They'd pick a date and time slot"  

2. **WHEN** a *Time Slot* is already booked by another customer  
   **THEN** that slot does not appear in the *Available Time Slots* list  
   **Evidence:** domain-sketch.md — Pet KA, `time slot` concept: "represents a bookable window at a store for a pet visit"  

3. **WHEN** no *Time Slots* are available within the displayed date range  
   **THEN** the *Appointment Calendar* shows a "no slots available — try a later date" message  
   **Evidence:** inferred — empty state for calendar  

---  

## Story: `Select Date and Time Slot`  

**Story type:** user  

### Domain terms  

- *Selected Slot* — the specific time slot the customer picks for their visit  
- *Appointment Calendar* — the booking surface  
- *Time Slot* — a bookable window  

### Acceptance criteria  

1. **WHEN** the customer selects a *Time Slot* from the *Appointment Calendar*  
   **THEN** the *Selected Slot* is highlighted and held temporarily (e.g. 10 minutes) to prevent double-booking during the booking flow  
   **AND** the customer proceeds to the confirmation step  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "pick a date and time slot"  

2. **WHEN** the temporary hold expires before the customer confirms  
   **THEN** the *Selected Slot* is released back to the *Available Time Slots*  
   **AND** the customer is notified that the slot is no longer held and must re-select  
   **Evidence:** inferred — temporary hold to prevent double-booking without permanent reservation  

3. **WHEN** two customers select the same *Time Slot* simultaneously  
   **THEN** only the first to confirm gets the booking  
   **AND** the second customer is notified that the slot is no longer available and must pick another  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` invariant: "must not overlap with another appointment at the same store for the same time slot"  

---  

## Story: `Add Visit Note`  

**Story type:** user  

### Domain terms  

- *Visit Note* — an optional free-text note the customer attaches to the appointment (e.g. "bringing my kids", "interested in adoption paperwork")  
- *Appointment* — the booking being annotated  

### Acceptance criteria  

1. **WHEN** the customer is in the appointment confirmation step  
   **THEN** an optional *Visit Note* field is available  
   **AND** the field accepts up to a character limit (e.g. 500 characters)  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "add a note for the visit"  

2. **WHEN** the customer leaves the *Visit Note* blank  
   **THEN** the appointment proceeds without a note  
   **AND** the staff view shows no note (not "empty" or "N/A")  
   **Evidence:** inferred — optional field handling  

3. **WHEN** the customer submits a *Visit Note* that exceeds the character limit  
   **THEN** the form shows a validation error  
   **BUT** the appointment is not submitted until the note is within limits  
   **Evidence:** inferred — standard text field validation  

---  

## Story: `Confirm Appointment Booking`  

**Story type:** user  

### Domain terms  

- *Appointment Booking* — the confirmed reservation for a pet visit  
- *Customer Account* — required for booking (account-gated per domain decision)  
- *Appointment Confirmation Page* — the on-screen acknowledgment  
- *Appointment Confirmation Email* — sent to the customer's verified email  

### Acceptance criteria  

1. **WHEN** a logged-in customer confirms the appointment  
   **THEN** the *Appointment Booking* is created with: pet, store, date/time, and optional visit note  
   **AND** the customer sees the *Appointment Confirmation Page*  
   **AND** an *Appointment Confirmation Email* is sent to the customer's email  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "book an appointment to visit the pet in-store"  

2. **WHEN** a guest (not logged in) attempts to confirm an appointment  
   **THEN** the system blocks the booking and prompts the customer to log in or register  
   **AND** explains that appointments require a customer account  
   **BUT** the selected slot remains temporarily held so the customer doesn't lose it  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` concept: "booked by exactly one customer account"; thin-slicing.md — Increment 6 slicing notes: "appointment booking is customer-account-only"  

3. **WHEN** the booking is confirmed  
   **THEN** the *Time Slot* transitions from available to booked  
   **AND** the slot is no longer shown to other customers  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` invariant: "must not overlap with another appointment at the same store for the same time slot"  

4. **WHEN** the confirmation email fails to send  
   **THEN** the booking is still created (email is not a gate)  
   **AND** the email is queued for retry  
   **Evidence:** inferred — same email resilience pattern as order confirmation  

---  

## Story: `View Upcoming and Past Appointments`  

**Story type:** user  

### Domain terms  

- *Appointment List* — the customer's view of all their appointments  
- *Upcoming Appointment* — a booking with a future date/time  
- *Past Appointment* — a booking whose date/time has passed  
- *Customer Account* — appointments are tied to the logged-in customer  

### Acceptance criteria  

1. **WHEN** the customer opens their *Appointment List* from the account area  
   **THEN** upcoming appointments are shown first (soonest at top), followed by past appointments  
   **AND** each entry shows: pet name, pet photo, store, date/time, and visit note (if any)  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "view upcoming and past appointments"  

2. **WHEN** the customer has no appointments  
   **THEN** the list shows an empty state with a prompt to browse the *Pet Gallery*  
   **Evidence:** inferred — empty state handling  

3. **WHEN** an upcoming appointment's pet has been marked as *Adopted* (see *Mark Pet as Adopted*)  
   **THEN** the appointment entry shows a "pet adopted" badge  
   **AND** "Cancel" and "Browse other pets" actions are shown on the entry (see *Cancel or Rebook Appointment After Pet Adoption*)  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision  

---  

## Story: `Cancel or Rebook Appointment After Pet Adoption`  

**Story type:** user  

### Domain terms  

- *Appointment Cancellation* — the customer-initiated removal of a booked appointment  
- *Rebook* — scheduling a new appointment (different pet or different date) after cancellation  
- *Pet Adopted Before Visit* — the scenario where the pet was adopted by someone else before the customer's visit  

### Acceptance criteria  

1. **WHEN** the customer receives a *Pet Adopted Before Visit Notification* (see that story)  
   **THEN** the notification includes options to cancel the appointment or browse other available pets to rebook  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision: "notify the customer; let them cancel or rebook"  

2. **WHEN** the customer cancels the appointment  
   **THEN** the *Time Slot* is released back to available  
   **AND** the appointment moves to *Cancelled* status in the *Appointment List*  
   **Evidence:** inferred — cancellation releases the slot  

3. **WHEN** the customer chooses to rebook  
   **THEN** the system navigates to the *Pet Gallery* with available pets displayed for a new booking  
   **AND** the original cancelled appointment remains in the *Past Appointments* section  
   **Evidence:** inferred — rebook is a new booking flow, not a slot swap  

4. **WHEN** the customer neither cancels nor rebooks before the appointment date  
   **THEN** the appointment remains in the system but staff see a "pet adopted" warning on their incoming appointments view  
   **AND** the appointment is treated as a no-show after the date passes  
   **Evidence:** inferred — system does not auto-cancel; staff handle edge case  

---  

## Story: `Update Pet Profile`  

**Story type:** store employee  

### Domain terms  

- *Pet Profile* — the employee-managed data about a pet (photos, breed, age, temperament, status)  
- *Store Employee* — the front-line staff member who maintains pet profiles  
- *Pet Photo Gallery* — the set of photos displayed on the pet's profile page  

### Acceptance criteria  

1. **WHEN** *Store Employee* opens a *Pet Profile* for editing  
   **THEN** all fields are editable: name, species, breed, age, *Temperament Notes*, *Pet Photo Gallery*, and the store the pet is located at  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Each pet gets a profile page — photo gallery, basic info (breed, age, temperament)"  

2. **WHEN** *Store Employee* saves changes to a *Pet Profile*  
   **THEN** the customer-facing *Pet Profile Page* reflects the changes immediately  
   **Evidence:** inferred — admin changes are live on the customer side  

3. **WHEN** *Store Employee* uploads new photos to the *Pet Photo Gallery*  
   **THEN** the photos are added to the gallery  
   **AND** existing photos are not replaced unless explicitly removed  
   **Evidence:** inferred — additive photo management  

4. **WHEN** *Store Employee* changes the store a pet is located at (pet transferred between stores)  
   **THEN** the *Pet Profile Page* shows the new store  
   **AND** any existing appointments for that pet at the old store show a store-change notification to the customer  
   **Evidence:** inferred — pet relocation affects booked appointments  

---  

## Story: `Mark Pet as Adopted`  

**Story type:** store employee  

### Domain terms  

- *Pet Status* — available or adopted  
- *Adopted* — the terminal status for a pet  
- *Store Employee* — the front-line staff member who marks the adoption  
- *Pet* — the animal whose status is changing  

### Acceptance criteria  

1. **WHEN** *Store Employee* marks a pet as *Adopted*  
   **THEN** the *Pet Status* transitions from *Available* to *Adopted*  
   **AND** the "Book a Visit" action is disabled on the *Pet Profile Page*  
   **Evidence:** domain-sketch.md — Pet KA, `pet` concept: "status progresses from available to adopted"  

2. **WHEN** the pet has upcoming appointments at the time of adoption  
   **THEN** the system triggers a *Pet Adopted Before Visit Notification* for each affected customer (see that story)  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision: "if a pet is adopted while a customer has a pending visit appointment, notify"  

3. **WHEN** *Store Employee* attempts to mark an already-adopted pet as adopted again  
   **THEN** the system shows a "pet is already adopted" message  
   **BUT** no status change occurs  
   **Evidence:** inferred — idempotent status transition  

---  

## Story: `View Incoming Appointments`  

**Story type:** store employee  

### Domain terms  

- *Incoming Appointments* — the staff-facing list of booked appointments at their store  
- *Store Employee* — the front-line staff member viewing the schedule  
- *Appointment* — a confirmed booking with pet, customer, date/time, and visit note  

### Acceptance criteria  

1. **WHEN** *Store Employee* opens the *Incoming Appointments* view  
   **THEN** all booked appointments for their *Store* are listed, sorted by date/time (soonest first)  
   **AND** each entry shows: customer name, pet name, date/time, and visit note (if any)  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory, see incoming appointments"  

2. **WHEN** an appointment's pet has been marked *Adopted*  
   **THEN** the entry shows a "pet adopted" warning badge  
   **AND** the notification status ("notified" or "not yet notified") is displayed on the entry  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` concept linked to pet status  

3. **WHEN** there are no upcoming appointments  
   **THEN** the view shows an empty state  
   **Evidence:** inferred — standard empty state  

---  

## Story: `Send Appointment Reminder`  

**Story type:** system  

### Domain terms  

- *Appointment Reminder* — a transactional notification sent before the appointment (e.g. day-before)  
- *Customer Account* — the reminder goes to the customer's verified email  
- *Appointment* — the booking being reminded about  

### Acceptance criteria  

1. **WHEN** an *Appointment* is 24 hours away  
   **THEN** the system sends an *Appointment Reminder* email to the customer  
   **AND** the reminder includes: pet name, store address, date/time, and visit note  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Automatic confirmation email and day-before reminder"  

2. **WHEN** the appointment has been cancelled before the reminder trigger time  
   **THEN** no *Appointment Reminder* is sent  
   **Evidence:** inferred — reminders for cancelled appointments are suppressed  

3. **WHEN** the pet has been marked *Adopted* before the reminder trigger time  
   **THEN** the *Appointment Reminder* is suppressed  
   **AND** the *Pet Adopted Before Visit Notification* takes precedence (if not already sent)  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the reminder is queued for retry within a reasonable window before the appointment  
   **Evidence:** inferred — same email resilience pattern  

---  

## Story: `Send Pet Adopted Before Visit Notification`  

**Story type:** system  

### Domain terms  

- *Pet Adopted Before Visit Notification* — a transactional alert sent when a pet is adopted while a customer has a pending appointment to visit it  
- *Customer Account* — the notification goes to the customer's verified email  
- *Appointment* — the booking affected by the adoption  

### Acceptance criteria  

1. **WHEN** a pet is marked as *Adopted* (see *Mark Pet as Adopted*) and there are pending *Appointments* for that pet  
   **THEN** the system sends a *Pet Adopted Before Visit Notification* to each affected customer  
   **AND** the notification includes: pet name, adoption status, and options to cancel or browse other pets  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision: "if a pet is adopted while a customer has a pending visit appointment, notify the customer; let them cancel or rebook"  

2. **WHEN** the notification is sent  
   **THEN** it is recorded against the appointment and the notification status is visible on the staff's *Incoming Appointments* view  
   **Evidence:** inferred — staff visibility into notification status (see *View Incoming Appointments* AC 2)  

3. **WHEN** the pet is adopted but no pending appointments exist  
   **THEN** no notification is sent  
   **Evidence:** inferred — notification is appointment-dependent  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the notification is queued for retry  
   **AND** the appointment still shows the "pet adopted" badge on both customer and staff views  
   **Evidence:** inferred — email failure does not suppress the status badge  

---  

## Story: `Check In Customer`  

**Story type:** store employee  

### Domain terms  

- *Check-In* — staff-recorded confirmation that the customer has arrived at the store for their appointment  
- *Checked-In Time* — the date and time the customer actually arrived  
- *Store Employee* — the front-line staff member recording the check-in  
- *Appointment* — the booking being checked in against  

### Acceptance criteria  

1. **WHEN** *Store Employee* selects "Check In" on an appointment from the *Incoming Appointments* view  
   **THEN** the system records the *Checked-In Time* and the staff member who checked them in  
   **AND** the appointment status transitions from *Confirmed* to *Checked In*  
   **Evidence:** crc.md — Appointment, `checked-in time` and `checked-in by` properties  

2. **WHEN** the customer arrives early or late relative to the *Time Slot*  
   **THEN** check-in is still allowed — the *Checked-In Time* records the actual arrival, not the slot start  
   **Evidence:** inferred — real arrival time matters for visit analytics and staff scheduling  

3. **WHEN** *Store Employee* attempts to check in an appointment that is already checked in  
   **THEN** the system shows "already checked in" with the original *Checked-In Time*  
   **BUT** no duplicate check-in is recorded  
   **Evidence:** inferred — idempotent check-in  

4. **WHEN** *Store Employee* attempts to check in a cancelled appointment  
   **THEN** the system blocks the check-in with a "this appointment was cancelled" message  
   **Evidence:** inferred — cancelled appointments cannot transition forward  

---  

## Story: `Record Visit Outcome`  

**Story type:** store employee  

### Domain terms  

- *Visit Outcome* — what happened during the visit: adopted, interested-returning, not-a-fit, browsing-only  
- *Staff Visit Notes* — free-text observations from the staff member who was present  
- *Appointment* — the booking whose outcome is being recorded  

### Acceptance criteria  

1. **WHEN** *Store Employee* selects "Record Outcome" on a checked-in appointment  
   **THEN** the system presents outcome options: *Adopted*, *Interested — Returning*, *Not a Fit*, *Browsing Only*  
   **AND** a *Staff Visit Notes* field for observations  
   **Evidence:** crc.md — Appointment, `visit outcome` and `staff visit notes` properties  

2. **WHEN** *Store Employee* selects *Adopted* as the outcome  
   **THEN** the appointment is marked as completed with outcome *Adopted*  
   **AND** the pet status transitions to *Adopted* (triggering the same notifications as *Mark Pet as Adopted*)  
   **Evidence:** crc.md — Appointment lifecycle; same adoption flow as the employee-triggered path  

3. **WHEN** *Store Employee* selects *Interested — Returning* as the outcome  
   **THEN** the system prompts for a *Follow-Up Action* (see *Set Follow-Up Action*)  
   **Evidence:** crc.md — Appointment, `follow-up action` property  

4. **WHEN** *Store Employee* records an outcome on an appointment that already has one  
   **THEN** the system shows "outcome already recorded" with the existing data  
   **BUT** an override option is available if the staff member has correction authority  
   **Evidence:** inferred — outcomes should be stable but correctable  

5. **WHEN** *Store Employee* submits the outcome without notes  
   **THEN** the outcome is accepted (notes are optional)  
   **Evidence:** inferred — minimum viable outcome is the category; notes add intelligence  

---  

## Story: `Record No-Show`  

**Story type:** store employee  

### Domain terms  

- *No-Show* — the customer did not arrive for their appointment  
- *No-Show Recorded By* — the staff member who flagged the absence  
- *No-Show Recorded At* — the date and time the no-show was recorded (e.g. 15 minutes after slot end)  
- *Appointment* — the booking being marked as no-show  

### Acceptance criteria  

1. **WHEN** the appointment's *Time Slot* has passed and the customer has not been checked in  
   **THEN** the appointment appears in the *Incoming Appointments* view with a "no check-in" indicator  
   **AND** a "Mark No-Show" action is available  
   **Evidence:** crc.md — Appointment, `no-show recorded by` and `no-show recorded at` properties  

2. **WHEN** *Store Employee* marks the appointment as *No-Show*  
   **THEN** the system records the staff member and the timestamp of the no-show recording  
   **AND** the appointment status transitions to *No-Show*  
   **Evidence:** crc.md — Appointment status lifecycle  

3. **WHEN** a no-show is recorded  
   **THEN** the system triggers a follow-up notification to the customer offering to rebook  
   **Evidence:** crc.md — Appointment, `trigger follow-up notification | Notification`  

4. **WHEN** *Store Employee* attempts to mark a checked-in appointment as no-show  
   **THEN** the system blocks the action with a "customer was already checked in" message  
   **Evidence:** inferred — mutually exclusive states: checked-in and no-show cannot coexist  

---  

## Story: `Set Follow-Up Action`  

**Story type:** store employee  

### Domain terms  

- *Follow-Up Action* — what should happen next: none, schedule-return-visit, hold-pet, send-adoption-paperwork  
- *Follow-Up Date* — when the follow-up should occur  
- *Appointment* — the booking being annotated with a follow-up  

### Acceptance criteria  

1. **WHEN** *Store Employee* sets a *Follow-Up Action* on an appointment (after recording a visit outcome or a no-show)  
   **THEN** the system records the action type and *Follow-Up Date*  
   **AND** the follow-up is visible on the appointment detail for future reference  
   **Evidence:** crc.md — Appointment, `follow-up action` and `follow-up date` properties  

2. **WHEN** the *Follow-Up Action* is *Hold Pet*  
   **THEN** the pet's status remains *Available* but the appointment detail shows a hold note  
   **AND** the *Follow-Up Date* indicates when the hold expires  
   **Evidence:** inferred — hold is a soft reservation, not a status change; prevents over-committing the pet  

3. **WHEN** the *Follow-Up Action* is *Schedule Return Visit*  
   **THEN** a link to the booking flow for the same pet is displayed to the staff member  
   **AND** staff can create the follow-up appointment on behalf of the customer  
   **Evidence:** inferred — staff-assisted rebooking  

4. **WHEN** the *Follow-Up Date* arrives  
   **THEN** the system triggers a *Visit Follow-Up Notification* to the customer  
   **Evidence:** crc.md — Appointment, `trigger follow-up notification | Notification`  

---  

## Story: `Send Visit Follow-Up Notification`  

**Story type:** system  

### Domain terms  

- *Visit Follow-Up Notification* — a transactional notification triggered by a *Follow-Up Action* on an appointment  
- *Follow-Up Date* — the date on which the notification fires  
- *Customer Account* — the notification goes to the customer's verified email  

### Acceptance criteria  

1. **WHEN** the *Follow-Up Date* on an appointment with a *Follow-Up Action* arrives  
   **THEN** the system sends a *Visit Follow-Up Notification* to the customer  
   **AND** the notification references the pet name, store, and the follow-up context (e.g. "We're holding Bella for you — would you like to schedule your return visit?")  
   **Evidence:** crc.md — Appointment, `trigger follow-up notification | Notification`  

2. **WHEN** the appointment's *Follow-Up Action* is *None*  
   **THEN** no follow-up notification is sent  
   **Evidence:** inferred — follow-up is opt-in by staff  

3. **WHEN** the pet has been adopted by someone else before the *Follow-Up Date*  
   **THEN** the follow-up notification is suppressed  
   **AND** the *Pet Adopted Before Visit Notification* takes precedence  
   **Evidence:** inferred — same precedence pattern as appointment reminders  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the notification is queued for retry within a reasonable window  
   **Evidence:** inferred — same email resilience pattern  

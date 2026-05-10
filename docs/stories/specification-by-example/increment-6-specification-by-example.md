# Specification by Example — Increment 6: Pet visits — gallery and in-store appointments

**Template:** Scenario Outline (parameterized with Examples tables)

---

## Story: `Browse Pets by Species`

### Store (Given — above scenarios):
| storeCode | storeName         | city    | postcode |
|-----------|-------------------|---------|----------|
| STR-001   | PawPlace Bristol  | Bristol | BS1 4QT  |
| STR-002   | PawPlace London   | London  | E1 6AN   |

### Breed (Given — above scenarios):
| breedName        | species      |
|------------------|--------------|
| Golden Retriever | Dog          |
| Maine Coon       | Cat          |
| Ball Python      | Reptile      |
| Holland Lop      | Small Mammal |

### Pet (Given — above scenarios):
| pet_id  | breed            | species      | hostingStore | lifecycleState |
|---------|------------------|--------------|--------------|----------------|
| PET-001 | Golden Retriever | Dog          | STR-001      | Available      |
| PET-002 | Maine Coon       | Cat          | STR-001      | Available      |
| PET-003 | Ball Python      | Reptile      | STR-002      | Available      |
| PET-004 | Holland Lop      | Small Mammal | STR-002      | Available      |
| PET-005 | Golden Retriever | Dog          | STR-002      | Adopted        |

---

### Scenario Outline: Pet gallery shows pets filterable by species

Given the **Pet Gallery** contains **Pet** entries across multiple **Breed** species
When the customer opens the *Pet Gallery*
Then pets are grouped or filterable by **species**
  And the *Pet Card* for **Pet** *{pet_id}* shows *{expected_photo_label}*, **Breed** *{breedName}*, **species** *{species}*, and **Store** *{storeName}*
  And the card heading reads *{expected_card_heading}*

### Pet Card display (Then — below scenario):
| scenario | pet_id  | breedName        | species | storeName        | expected_photo_label       | expected_card_heading                     |
|----------|---------|------------------|---------|------------------|----------------------------|-------------------------------------------|
| 1        | PET-001 | Golden Retriever | Dog     | PawPlace Bristol | pet001_front.jpg           | Golden Retriever · Dog · PawPlace Bristol |
| 2        | PET-002 | Maine Coon       | Cat     | PawPlace Bristol | pet002_front.jpg           | Maine Coon · Cat · PawPlace Bristol       |
| 3        | PET-003 | Ball Python      | Reptile | PawPlace London  | pet003_front.jpg           | Ball Python · Reptile · PawPlace London   |

---

### Scenario Outline: Species filter applied — only matching pets shown

Given the **Pet Gallery** contains pets of multiple species
When the customer selects the **species** filter *{selected_species}*
Then only **Pet** entries with **species** *{selected_species}* are shown
  And the results heading reads *{expected_results_heading}*
  And the *{selected_species}* filter chip is displayed in *{expected_filter_style}* state

### Species filter (Then — below scenario):
| scenario | selected_species | pets_shown | expected_results_heading | expected_filter_style |
|----------|------------------|------------|--------------------------|-----------------------|
| 1        | Dog              | PET-001    | 1 Dog available          | selected-highlighted  |
| 2        | Cat              | PET-002    | 1 Cat available          | selected-highlighted  |
| 3        | Reptile          | PET-003    | 1 Reptile available      | selected-highlighted  |

---

### Scenario Outline: No available pets for selected species — empty state with options

Given the **Pet Gallery** has no **Pet** entries with **species** *{selected_species}* and **lifecycleState** *{lifecycleState}*
When the customer selects the **species** filter *{selected_species}*
Then the gallery shows *{expected_message}*
  And the *{selected_species}* filter chip is displayed in *{expected_filter_style}* state
  And the other species options *{expected_other_species}* remain selectable

### Empty species (Then — below scenario):
| scenario | selected_species | lifecycleState | expected_message                                  | expected_filter_style | expected_other_species          |
|----------|------------------|----------------|---------------------------------------------------|-----------------------|---------------------------------|
| 1        | Bird             | Available      | No pets available in this category right now      | selected-highlighted  | Dog, Cat, Reptile, Small Mammal |

---

## Story: `View Pet Profile`

### Pet (Given — above scenarios):
| pet_id  | petName | breedName        | species | dateOfBirth | hostingStore | lifecycleState |
|---------|---------|------------------|---------|-------------|--------------|----------------|
| PET-001 | Buddy   | Golden Retriever | Dog     | 2023-03-15  | STR-001      | Available      |
| PET-005 | Rex     | Golden Retriever | Dog     | 2022-06-10  | STR-002      | Adopted        |

### TemperamentAssessment (Given — above scenarios):
| pet_id  | behavioralObservation                                  | assessmentDate |
|---------|--------------------------------------------------------|----------------|
| PET-001 | Friendly with children, high energy, loves fetch       | 2025-01-10     |

### PetPhoto (Given — above scenarios):
| pet_id  | imageFile          | caption                 |
|---------|--------------------|-------------------------|
| PET-001 | pet001_front.jpg   | Front view              |
| PET-001 | pet001_playing.jpg | Playing in the garden   |

---

### Scenario Outline: Pet profile displays full details for available pet

Given a **Pet** *{pet_id}* named *{petName}* with **lifecycleState** *{lifecycleState}*
  And **Breed** *{breedName}* / **species** *{species}*
  And **dateOfBirth** *{dateOfBirth}*
  And **TemperamentAssessment** *{behavioralObservation}*
  And hosted at **Store** *{storeCode}* (*{storeName}*)
When the customer opens the *Pet Profile Page* for **Pet** *{pet_id}*
Then the page shows *{expected_photo_count}* photos in the *Pet Photo Gallery*
  And the profile heading reads *{expected_heading}*
  And the age line reads *{expected_age_label}*
  And the *Temperament Notes* section reads *{behavioralObservation}*
  And the store line reads *{storeName}*
  And the primary action button reads *{expected_action_label}*

### Pet Profile display (Then — below scenario):
| scenario | pet_id  | petName | breedName        | species | dateOfBirth | behavioralObservation                            | storeCode | storeName        | lifecycleState | expected_photo_count | expected_heading                  | expected_age_label | expected_action_label |
|----------|---------|---------|------------------|---------|-------------|--------------------------------------------------|-----------|------------------|----------------|----------------------|-----------------------------------|--------------------|-----------------------|
| 1        | PET-001 | Buddy   | Golden Retriever | Dog     | 2023-03-15  | Friendly with children, high energy, loves fetch | STR-001   | PawPlace Bristol | Available      | 2                    | Buddy · Golden Retriever · Dog   | 2 years old        | Book a Visit          |

---

### Scenario Outline: Adopted pet profile shows adopted badge and viewable details

Given a **Pet** *{pet_id}* named *{petName}* with **lifecycleState** *{lifecycleState}*
  And **Breed** *{breedName}* / **species** *{species}*
When the customer opens the *Pet Profile Page* for **Pet** *{pet_id}*
Then the profile heading reads *{expected_heading}*
  And a badge reads *{expected_badge_label}*
  And the action area reads *{expected_action_message}*
  And the profile photo, breed, species, and store details remain visible

### Adopted pet (Then — below scenario):
| scenario | pet_id  | petName | breedName        | species | lifecycleState | expected_heading                 | expected_badge_label | expected_action_message                  |
|----------|---------|---------|------------------|---------|----------------|----------------------------------|----------------------|------------------------------------------|
| 1        | PET-005 | Rex     | Golden Retriever | Dog     | Adopted        | Rex · Golden Retriever · Dog     | Adopted              | This pet has found a home                |

---

### Scenario Outline: Pet profile without temperament shows remaining sections

Given a **Pet** *{pet_id}* named *{petName}* with **lifecycleState** *{lifecycleState}* and no **TemperamentAssessment** entries
  And **Breed** *{breedName}* / **species** *{species}*
  And hosted at **Store** *{storeCode}* (*{storeName}*)
When the customer opens the *Pet Profile Page* for **Pet** *{pet_id}*
Then the profile heading reads *{expected_heading}*
  And the displayed sections are *{expected_sections}*
  And the primary action button reads *{expected_action_label}*

### Pet without temperament (Then — below scenario):
| scenario | pet_id  | petName | breedName   | species | lifecycleState | storeCode | storeName       | expected_heading                | expected_sections                                  | expected_action_label |
|----------|---------|---------|-------------|---------|----------------|-----------|-----------------|---------------------------------|----------------------------------------------------|-----------------------|
| 1        | PET-003 | Slinky  | Ball Python | Reptile | Available      | STR-002   | PawPlace London | Slinky · Ball Python · Reptile | Photo Gallery, Breed, Species, Age, Store Location | Book a Visit          |

---

## Story: `View Pet Store Location and Distance`

### Store (Given — above scenarios):
| storeCode | storeName        | addressLineOne   | city    | postcode | latitude  | longitude |
|-----------|------------------|------------------|---------|----------|-----------|-----------|
| STR-001   | PawPlace Bristol | 15 Queen Street  | Bristol | BS1 4QT  | 51.4545   | -2.5879   |

---

### Scenario Outline: Pet profile shows store details

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}*
  And **Store** *{storeCode}* has **storeName** *{storeName}*, **addressLineOne** *{addressLineOne}*, **city** *{city}*, **postcode** *{postcode}*
When the customer views the *Pet Profile Page* for **Pet** *{pet_id}*
Then the store section heading reads *{expected_store_heading}*
  And the address line reads *{expected_address_line}*

### Store display (Then — below scenario):
| scenario | pet_id  | storeCode | storeName        | addressLineOne  | city    | postcode | expected_store_heading | expected_address_line              |
|----------|---------|-----------|------------------|-----------------|---------|----------|------------------------|------------------------------------|
| 1        | PET-001 | STR-001   | PawPlace Bristol | 15 Queen Street | Bristol | BS1 4QT  | PawPlace Bristol       | 15 Queen Street, Bristol, BS1 4QT |

---

### Scenario Outline: Distance calculated when customer shares location

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}* with **latitude** *{store_lat}* and **longitude** *{store_lng}*
  And the customer has shared their location: latitude *{customer_lat}*, longitude *{customer_lng}*
When the customer views the *Pet Profile Page*
Then the distance label reads *{expected_distance_label}*

### Distance calculation (Then — below scenario):
| scenario | pet_id  | storeCode | store_lat | store_lng | customer_lat | customer_lng | expected_distance_label |
|----------|---------|-----------|-----------|-----------|--------------|--------------|-------------------------|
| 1        | PET-001 | STR-001   | 51.4545   | -2.5879   | 51.4500      | -2.5800      | 0.7 km away             |

---

### Scenario Outline: Location not shared — store section shows share prompt

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}* (*{storeName}*)
  And the customer has not shared their location
When the customer views the *Pet Profile Page*
Then the store section heading reads *{storeName}*
  And the distance area reads *{expected_prompt_text}*

### No location shared (Then — below scenario):
| scenario | pet_id  | storeCode | storeName        | expected_prompt_text                                       |
|----------|---------|-----------|------------------|------------------------------------------------------------|
| 1        | PET-001 | STR-001   | PawPlace Bristol | Share your location or enter a postcode to see distance    |

---

## Story: `View Available Time Slots at Store`

### TimeSlot (Given — above scenarios):
| timeslot_id | storeCode | startTime            | endTime              | bookingStatus |
|-------------|-----------|----------------------|----------------------|---------------|
| TS-001      | STR-001   | 2025-06-10T10:00:00  | 2025-06-10T10:30:00  | available     |
| TS-002      | STR-001   | 2025-06-10T11:00:00  | 2025-06-10T11:30:00  | available     |
| TS-003      | STR-001   | 2025-06-10T14:00:00  | 2025-06-10T14:30:00  | booked        |
| TS-004      | STR-001   | 2025-06-11T10:00:00  | 2025-06-11T10:30:00  | available     |

---

### Scenario Outline: Available time slots shown for pet's store

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}*
  And **Store** *{storeCode}* has **TimeSlot** entries for the next *{calendar_days}* days
When the customer initiates the appointment booking flow from the pet profile
Then the *Appointment Calendar* shows *{expected_slot_count}* available slots: *{expected_slots_shown}*
  And the calendar heading reads *{expected_calendar_heading}*

### Available slots display (Then — below scenario):
| scenario | pet_id  | storeCode | calendar_days | expected_slots_shown   | expected_slot_count | expected_calendar_heading          |
|----------|---------|-----------|---------------|------------------------|---------------------|------------------------------------|
| 1        | PET-001 | STR-001   | 14            | TS-001, TS-002, TS-004 | 3                   | Available appointments at PawPlace Bristol |

---

### Scenario Outline: Appointment calendar shows only available slots

Given **Store** *{storeCode}* has **TimeSlot** entries with mixed **bookingStatus** values
When the customer views the *Appointment Calendar* for **Store** *{storeCode}*
Then slot *{available_slot}* with **bookingStatus** *{available_status}* is displayed with label *{expected_slot_label}*
  And slot *{booked_slot}* with **bookingStatus** *{booked_status}* is excluded from the list

### Slot visibility (Then — below scenario):
| scenario | storeCode | available_slot | available_status | expected_slot_label         | booked_slot | booked_status |
|----------|-----------|----------------|------------------|-----------------------------|-------------|---------------|
| 1        | STR-001   | TS-001         | available        | Tue 10 Jun, 10:00 – 10:30  | TS-003      | booked        |
| 2        | STR-001   | TS-002         | available        | Tue 10 Jun, 11:00 – 11:30  | TS-003      | booked        |
| 3        | STR-001   | TS-004         | available        | Wed 11 Jun, 10:00 – 10:30  | TS-003      | booked        |

---

### Scenario Outline: No available time slots — calendar shows next-steps message

Given **Store** *{storeCode}* has no **TimeSlot** entries with **bookingStatus** *{required_status}* within *{calendar_days}* days
When the customer views the *Appointment Calendar*
Then the calendar shows *{expected_message}*
  And a *{expected_action_label}* action is displayed

### Empty calendar (Then — below scenario):
| scenario | storeCode | required_status | calendar_days | expected_message                          | expected_action_label |
|----------|-----------|-----------------|---------------|-------------------------------------------|-----------------------|
| 1        | STR-002   | available       | 14            | No slots available — try a later date     | Browse later dates    |

---

## Story: `Select Date and Time Slot`

### Scenario Outline: Selected slot held temporarily to prevent double-booking

Given a **TimeSlot** *{timeslot_id}* at **Store** *{storeCode}* with **bookingStatus** *{bookingStatus_before}*
When the customer selects **TimeSlot** *{timeslot_id}* from the *Appointment Calendar*
Then the *Selected Slot* is highlighted and held temporarily for *{hold_minutes}* minutes
  And **TimeSlot** *{timeslot_id}* **bookingStatus** transitions to *{bookingStatus_after}*
  And the confirmation step reads *{expected_confirmation_prompt}*

### Slot hold (Then — below scenario):
| scenario | timeslot_id | storeCode | bookingStatus_before | hold_minutes | bookingStatus_after | expected_confirmation_prompt                  |
|----------|-------------|-----------|----------------------|--------------|---------------------|----------------------------------------------|
| 1        | TS-001      | STR-001   | available            | 10           | held                | Slot held for 10 minutes — confirm to book   |

---

### Scenario Outline: Temporary hold expires — slot released

Given a **TimeSlot** *{timeslot_id}* with **bookingStatus** *{bookingStatus_before}* for customer *{customer_account_id}*
  And the hold has exceeded *{hold_minutes}* minutes without confirmation
When the hold timer expires
Then **TimeSlot** *{timeslot_id}* **bookingStatus** reverts to *{bookingStatus_after}*
  And the customer sees *{expected_expiry_message}*

### Hold expiry (Then — below scenario):
| scenario | timeslot_id | customer_account_id | hold_minutes | bookingStatus_before | bookingStatus_after | expected_expiry_message                                  |
|----------|-------------|---------------------|--------------|----------------------|---------------------|----------------------------------------------------------|
| 1        | TS-001      | CUST-001            | 10           | held                 | available           | Your hold has expired — please select a new time slot    |

---

### Scenario Outline: Concurrent selection — first to confirm wins

Given two customers select the same **TimeSlot** *{timeslot_id}* simultaneously
  And **CustomerAccount** *{first_customer}* confirms first
  And **CustomerAccount** *{second_customer}* attempts to confirm second
When *{second_customer}* submits confirmation
Then *{first_customer}* receives outcome *{expected_first_outcome}*
  And *{second_customer}* receives message *{expected_second_message}*
  And *{first_customer}*'s **Appointment** is unaffected

### Concurrent booking (Then — below scenario):
| scenario | timeslot_id | first_customer | second_customer | expected_first_outcome | expected_second_message                                  |
|----------|-------------|----------------|-----------------|------------------------|----------------------------------------------------------|
| 1        | TS-001      | CUST-001       | CUST-002        | Appointment confirmed  | This slot is no longer available — please pick another   |

---

## Story: `Add Visit Note`

### Scenario Outline: Visit note added within character limit

Given the customer is in the appointment confirmation step for **Pet** *{pet_id}*
  And the *Visit Note* field accepts up to *{char_limit}* characters
When the customer enters a *Visit Note*: *{visit_note}*
Then the **Appointment** is annotated with **visitNote** *{visit_note}*
  And the confirmation preview shows *{expected_note_preview}*

### Visit Note (Then — below scenario):
| scenario | pet_id  | char_limit | visit_note                                          | expected_note_preview                               |
|----------|---------|------------|-----------------------------------------------------|-----------------------------------------------------|
| 1        | PET-001 | 500        | Bringing my two kids aged 5 and 7                   | Bringing my two kids aged 5 and 7                   |
| 2        | PET-001 | 500        | Interested in adoption paperwork — previous dog owner | Interested in adoption paperwork — previous dog owner |

---

### Scenario Outline: Visit note left blank — appointment proceeds with note section hidden

Given the customer is in the appointment confirmation step for **Pet** *{pet_id}*
When the customer leaves the *Visit Note* blank
Then the **Appointment** proceeds without a note
  And the confirmation preview note section reads *{expected_note_display}*
  And the staff view note section reads *{expected_staff_display}*

### Blank note (Then — below scenario):
| scenario | pet_id  | expected_note_display   | expected_staff_display |
|----------|---------|-------------------------|------------------------|
| 1        | PET-001 | No visit note added     | (section hidden)       |

---

### Scenario Outline: Visit note exceeds character limit — validation shown

Given the customer is in the appointment confirmation step for **Pet** *{pet_id}*
  And the *Visit Note* field has a character limit of *{char_limit}*
When the customer submits a *Visit Note* of *{entered_chars}* characters
Then the form shows *{expected_validation_message}*
  And the submit button remains *{expected_button_state}*

### Note validation (Then — below scenario):
| scenario | pet_id  | char_limit | entered_chars | expected_validation_message                    | expected_button_state |
|----------|---------|------------|---------------|------------------------------------------------|-----------------------|
| 1        | PET-001 | 500        | 512           | Visit note exceeds 500-character limit (512/500) | disabled              |

---

## Story: `Confirm Appointment Booking`

### CustomerAccount (Given — above scenarios):
| customer_account_id | emailAddress     | accountStatus |
|---------------------|------------------|---------------|
| CUST-001            | jane@example.com | Verified      |

---

### Scenario Outline: Logged-in customer confirms appointment successfully

Given a **CustomerAccount** *{customer_account_id}* is logged in with **emailAddress** *{emailAddress}*
  And **Pet** *{pet_id}* at **Store** *{storeCode}* has **lifecycleState** *{lifecycleState}*
  And **TimeSlot** *{timeslot_id}* is held for *{customer_account_id}*
When the customer confirms the appointment with **visitNote** *{visitNote}*
Then an **Appointment** is created with **bookingCustomerAccount** *{customer_account_id}*, **visitedPet** *{pet_id}*, **hostingStore** *{storeCode}*, **scheduledDateAndTimeSlot** *{timeslot_id}*
  And the *Appointment Confirmation Page* reads *{expected_confirmation_heading}*
  And an *Appointment Confirmation Email* is sent to *{emailAddress}*
  And **TimeSlot** *{timeslot_id}* **bookingStatus** transitions to *{expected_slot_status}*

### Appointment (Then — below scenario):
| scenario | customer_account_id | pet_id  | storeCode | timeslot_id | visitNote                         | emailAddress     | lifecycleState | expected_confirmation_heading                        | expected_slot_status |
|----------|---------------------|---------|-----------|-------------|-----------------------------------|------------------|----------------|------------------------------------------------------|----------------------|
| 1        | CUST-001            | PET-001 | STR-001   | TS-001      | Bringing my two kids aged 5 and 7 | jane@example.com | Available      | Appointment confirmed — Tue 10 Jun, 10:00 at PawPlace Bristol | booked               |

---

### Scenario Outline: Guest user prompted to log in — slot preserved

Given a guest customer (not logged in) has selected **TimeSlot** *{timeslot_id}* for **Pet** *{pet_id}*
When the guest attempts to confirm the appointment
Then the page shows *{expected_prompt_heading}*
  And the prompt body reads *{expected_prompt_body}*
  And the **TimeSlot** *{timeslot_id}* **bookingStatus** remains *{expected_slot_status}*

### Guest prompt (Then — below scenario):
| scenario | timeslot_id | pet_id  | expected_prompt_heading | expected_prompt_body                                      | expected_slot_status |
|----------|-------------|---------|------------------------|-----------------------------------------------------------|----------------------|
| 1        | TS-001      | PET-001 | Log in to book         | Appointments require a PawPlace account — log in or register to continue | held                 |

---

### Scenario Outline: Confirmation email fails — booking still created

Given a **CustomerAccount** *{customer_account_id}* has confirmed an **Appointment** for **Pet** *{pet_id}*
  And the email delivery system is temporarily unavailable
When the confirmation email send attempt fails
Then the **Appointment** status is *{expected_appointment_status}*
  And the email delivery status is *{expected_email_status}*
  And the *Appointment Confirmation Page* still reads *{expected_page_heading}*

### Email failure (Then — below scenario):
| scenario | customer_account_id | pet_id  | expected_appointment_status | expected_email_status | expected_page_heading  |
|----------|---------------------|---------|-----------------------------|-----------------------|------------------------|
| 1        | CUST-001            | PET-001 | confirmed                   | queued for retry      | Appointment confirmed  |

---

## Story: `View Upcoming and Past Appointments`

### Appointment (Given — above scenarios):
| appointment_id | customer_account_id | pet_id  | petName | storeCode | storeName        | timeslot_id | appointmentStatus | visitNote                |
|----------------|---------------------|---------|---------|-----------|------------------|-------------|-------------------|--------------------------|
| APT-001        | CUST-001            | PET-001 | Buddy   | STR-001   | PawPlace Bristol | TS-001      | confirmed         | Bringing kids            |
| APT-002        | CUST-001            | PET-002 | Whiskers| STR-001   | PawPlace Bristol | TS-004      | completed         |                          |
| APT-003        | CUST-001            | PET-005 | Rex     | STR-002   | PawPlace London  | TS-010      | confirmed         | Want to meet the dog     |

---

### Scenario Outline: Appointments listed — upcoming first, then past

Given a **CustomerAccount** *{customer_account_id}* with **Appointment** entries
When the customer opens their *Appointment List* from the account area
Then the *Upcoming* section shows *{expected_upcoming}* sorted soonest first
  And the *Past* section shows *{expected_past}*
  And each entry displays pet name, pet photo, **Store** name, date/time, and **visitNote** (if present)

### Appointment list (Then — below scenario):
| scenario | customer_account_id | expected_upcoming      | expected_past | expected_upcoming_count | expected_past_count |
|----------|---------------------|------------------------|---------------|-------------------------|---------------------|
| 1        | CUST-001            | APT-001, APT-003       | APT-002       | 2                       | 1                   |

---

### Scenario Outline: No appointments — empty state with gallery link

Given a **CustomerAccount** *{customer_account_id}* with no **Appointment** entries
When the customer opens their *Appointment List*
Then the list heading reads *{expected_heading}*
  And the empty-state message reads *{expected_message}*
  And a link to *{expected_link_target}* is displayed with label *{expected_link_label}*

### Empty appointments (Then — below scenario):
| scenario | customer_account_id | expected_heading  | expected_message                       | expected_link_target | expected_link_label        |
|----------|---------------------|-------------------|----------------------------------------|----------------------|----------------------------|
| 1        | CUST-003            | Your Appointments | You haven't booked any visits yet      | Pet Gallery          | Browse pets to get started |

---

### Scenario Outline: Upcoming appointment for adopted pet shows badge and actions

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* (*{petName}*) with upcoming date
  And **Pet** *{pet_id}* has **lifecycleState** *{lifecycleState}*
When the customer views their *Appointment List*
Then **Appointment** *{appointment_id}* shows badge *{expected_badge_label}*
  And the entry offers action *{expected_action_1}* and action *{expected_action_2}*

### Adopted pet appointment (Then — below scenario):
| scenario | appointment_id | pet_id  | petName | lifecycleState | expected_badge_label | expected_action_1 | expected_action_2    |
|----------|----------------|---------|---------|----------------|----------------------|-------------------|----------------------|
| 1        | APT-003        | PET-005 | Rex     | Adopted        | Pet adopted          | Cancel appointment| Browse other pets    |

---

## Story: `Cancel or Rebook Appointment After Pet Adoption`

### Scenario Outline: Customer cancels appointment — time slot released

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* with **appointmentStatus** *{appointmentStatus_before}*
  And a *Pet Adopted Before Visit Notification* has been sent
When the customer cancels the **Appointment** *{appointment_id}*
Then the **TimeSlot** *{timeslot_id}* **bookingStatus** reverts to *{expected_slot_status}*
  And the **Appointment** *{appointment_id}* transitions to **appointmentStatus** *{expected_appointment_status}*
  And the confirmation reads *{expected_cancellation_message}*

### Cancellation (Then — below scenario):
| scenario | appointment_id | pet_id  | timeslot_id | appointmentStatus_before | expected_slot_status | expected_appointment_status | expected_cancellation_message                 |
|----------|----------------|---------|-------------|--------------------------|----------------------|-----------------------------|-----------------------------------------------|
| 1        | APT-003        | PET-005 | TS-010      | confirmed                | available            | cancelled                   | Appointment cancelled — time slot released    |

---

### Scenario Outline: Customer rebooks — new booking flow initiated

Given the customer has cancelled **Appointment** *{appointment_id}* for adopted **Pet** *{pet_id}*
When the customer chooses to rebook
Then the system navigates to *{expected_destination}* with available pets displayed
  And the original cancelled **Appointment** *{appointment_id}* appears in *{expected_history_section}*

### Rebook (Then — below scenario):
| scenario | appointment_id | pet_id  | expected_destination | expected_history_section |
|----------|----------------|---------|----------------------|-------------------------|
| 1        | APT-003        | PET-005 | Pet Gallery          | Past Appointments       |

---

### Scenario Outline: Customer does not act before appointment date

Given an **Appointment** *{appointment_id}* for adopted **Pet** *{pet_id}* with a future date
  And the customer has neither cancelled nor rebooked
When the appointment date passes
Then the **Appointment** staff view shows warning *{expected_staff_warning}*
  And the **Appointment** is treated as *{expected_outcome}*

### No action taken (Then — below scenario):
| scenario | appointment_id | pet_id  | expected_staff_warning                         | expected_outcome |
|----------|----------------|---------|------------------------------------------------|------------------|
| 1        | APT-003        | PET-005 | Pet adopted — customer did not cancel or rebook| no-show          |

---

## Story: `Update Pet Profile`

### Scenario Outline: Store employee updates pet profile fields

Given a **Store Employee** at **Store** *{storeCode}*
  And a **Pet** *{pet_id}* hosted at **Store** *{storeCode}*
When the *Store Employee* saves changes to: **Breed** *{new_breedName}*, **TemperamentAssessment** *{new_observation}*
Then the customer-facing *Pet Profile Page* for **Pet** *{pet_id}* shows breed *{new_breedName}*
  And the *Temperament Notes* section reads *{new_observation}*
  And the profile update timestamp reads *{expected_update_label}*

### Pet Profile update (Then — below scenario):
| scenario | pet_id  | storeCode | new_breedName    | new_observation                  | expected_update_label     |
|----------|---------|-----------|------------------|----------------------------------|---------------------------|
| 1        | PET-001 | STR-001   | Golden Retriever | Very gentle, great family dog    | Updated today             |

---

### Scenario Outline: New photos added to pet photo gallery

Given a **Store Employee** at **Store** *{storeCode}*
  And a **Pet** *{pet_id}* with *{existing_photo_count}* existing **PetPhoto** entries
When the *Store Employee* uploads new photos *{new_photo_files}*
Then the gallery total is *{expected_total_photos}* photos
  And the new photo *{new_photo_files}* appears in the gallery
  And existing photos are preserved

### Photo upload (Then — below scenario):
| scenario | pet_id  | storeCode | existing_photo_count | new_photo_files      | expected_total_photos |
|----------|---------|-----------|----------------------|----------------------|-----------------------|
| 1        | PET-001 | STR-001   | 2                    | pet001_outdoor.jpg   | 3                     |

---

### Scenario Outline: Pet transferred between stores — appointments notified

Given a **Pet** *{pet_id}* currently at **Store** *{old_storeCode}* (*{old_storeName}*)
  And existing **Appointment** entries for **Pet** *{pet_id}* at **Store** *{old_storeCode}*
When the *Store Employee* changes the **hostingStore** to **Store** *{new_storeCode}* (*{new_storeName}*)
Then the *Pet Profile Page* shows **Store** *{new_storeName}*
  And affected customers receive a notification reading *{expected_notification_body}*

### Pet transfer (Then — below scenario):
| scenario | pet_id  | old_storeCode | old_storeName    | new_storeCode | new_storeName   | expected_notification_body                                        |
|----------|---------|---------------|------------------|---------------|-----------------|-------------------------------------------------------------------|
| 1        | PET-001 | STR-001       | PawPlace Bristol | STR-002       | PawPlace London | Your visit pet has moved to PawPlace London — please check details|

---

## Story: `Mark Pet as Adopted`

### Scenario Outline: Pet marked adopted — booking disabled, notifications sent

Given a **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState_before}*
  And existing **Appointment** entries *{affected_appointments}* for **Pet** *{pet_id}*
When the *Store Employee* marks **Pet** *{pet_id}* as *{target_state}*
Then **Pet** *{pet_id}* **lifecycleState** transitions to *{expected_lifecycleState}* via **PetLifecycleEvent**
  And the *Pet Profile Page* action area reads *{expected_action_message}*
  And *{expected_notification_count}* *Pet Adopted Before Visit Notification*(s) are sent for appointments *{affected_appointments}*

### Adoption (Then — below scenario):
| scenario | pet_id  | lifecycleState_before | target_state | expected_lifecycleState | affected_appointments | expected_notification_count | expected_action_message     |
|----------|---------|----------------------|--------------|-------------------------|-----------------------|-----------------------------|-----------------------------|
| 1        | PET-001 | Available            | Adopted      | Adopted                 | APT-001               | 1                           | This pet has found a home   |

---

### Scenario Outline: Already-adopted pet — idempotent with status message

Given a **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*
When the *Store Employee* attempts to mark **Pet** *{pet_id}* as *{target_state}*
Then the system shows *{expected_status_message}*
  And the **lifecycleState** remains *{expected_lifecycleState}*
  And *{expected_notification_count}* notifications are sent

### Idempotent adoption (Then — below scenario):
| scenario | pet_id  | lifecycleState | target_state | expected_status_message    | expected_lifecycleState | expected_notification_count |
|----------|---------|----------------|--------------|----------------------------|-------------------------|-----------------------------|
| 1        | PET-005 | Adopted        | Adopted      | Pet is already adopted     | Adopted                 | 0                           |

---

## Story: `View Incoming Appointments`

### Scenario Outline: Staff sees upcoming appointments sorted by date

Given a **Store Employee** at **Store** *{storeCode}*
  And **Appointment** entries *{appointment_ids}* are booked for **Store** *{storeCode}*
When the *Store Employee* opens the *Incoming Appointments* view
Then the list shows *{expected_appointment_count}* appointments sorted *{expected_sort_order}*
  And each entry shows: customer name, pet name, date/time, and **visitNote** (if any)

### Incoming appointments (Then — below scenario):
| scenario | storeCode | appointment_ids  | expected_appointment_count | expected_sort_order |
|----------|-----------|------------------|----------------------------|---------------------|
| 1        | STR-001   | APT-001, APT-002 | 2                          | soonest first       |

---

### Scenario Outline: Adopted pet appointment shows warning badge in staff view

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*
  And the notification status is *{notification_status}*
When the *Store Employee* views the *Incoming Appointments*
Then the entry shows badge *{expected_badge_label}*
  And the notification column reads *{expected_notification_display}*

### Adopted warning (Then — below scenario):
| scenario | appointment_id | pet_id  | lifecycleState | notification_status | expected_badge_label | expected_notification_display |
|----------|----------------|---------|----------------|---------------------|----------------------|-------------------------------|
| 1        | APT-003        | PET-005 | Adopted        | notified            | Pet adopted          | Customer notified             |

---

## Story: `Send Appointment Reminder`

### Scenario Outline: Reminder sent 24 hours before appointment

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* at **Store** *{storeCode}*
  And **scheduledDateAndTimeSlot** is *{appointment_datetime}*
  And **appointmentStatus** is *{appointmentStatus}*
When the current time is *{trigger_hours}* hours before *{appointment_datetime}*
Then the system sends an *Appointment Reminder* **Notification** to **CustomerAccount** *{customer_account_id}*
  And the reminder body includes *{expected_reminder_body}*

### Reminder (Then — below scenario):
| scenario | appointment_id | pet_id  | storeCode | appointment_datetime | appointmentStatus | trigger_hours | customer_account_id | expected_reminder_body                                                     |
|----------|----------------|---------|-----------|----------------------|-------------------|---------------|---------------------|----------------------------------------------------------------------------|
| 1        | APT-001        | PET-001 | STR-001   | 2025-06-10T10:00:00  | confirmed         | 24            | CUST-001            | Reminder: visit Buddy at PawPlace Bristol, Tue 10 Jun 10:00. Note: Bringing kids |

---

### Scenario Outline: Cancelled appointment — reminder skipped, status retained

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}*
When the *{trigger_hours}*-hour reminder trigger time arrives
Then the appointment remains in status *{expected_status}*
  And the reminder outcome is *{expected_reminder_outcome}*

### Cancelled suppression (Then — below scenario):
| scenario | appointment_id | appointmentStatus | trigger_hours | expected_status | expected_reminder_outcome |
|----------|----------------|-------------------|---------------|-----------------|---------------------------|
| 1        | APT-004        | cancelled         | 24            | cancelled       | skipped — appointment cancelled |

---

### Scenario Outline: Adopted pet — adoption notification takes precedence over reminder

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*
  And the *Pet Adopted Before Visit Notification* has *{adoption_notification_status}*
When the *{trigger_hours}*-hour reminder trigger time arrives
Then the reminder outcome is *{expected_reminder_outcome}*
  And the notification sent is *{expected_notification_type}*

### Adoption precedence (Then — below scenario):
| scenario | appointment_id | pet_id  | lifecycleState | adoption_notification_status | trigger_hours | expected_reminder_outcome         | expected_notification_type          |
|----------|----------------|---------|----------------|------------------------------|---------------|-----------------------------------|-------------------------------------|
| 1        | APT-003        | PET-005 | Adopted        | not yet sent                 | 24            | skipped — adoption takes precedence | Pet Adopted Before Visit Notification |

---

## Story: `Send Pet Adopted Before Visit Notification`

### Scenario Outline: Notification sent to affected customers on adoption

Given a **Pet** *{pet_id}* is marked as *{lifecycleState}*
  And **Appointment** *{appointment_id}* for **Pet** *{pet_id}* has **appointmentStatus** *{appointmentStatus}*
  And **Appointment** *{appointment_id}* belongs to **CustomerAccount** *{customer_account_id}*
When the system processes the adoption event
Then a *Pet Adopted Before Visit Notification* is sent to *{customer_account_id}*
  And the notification body includes *{expected_notification_body}*
  And the notification is recorded against **Appointment** *{appointment_id}*

### Adoption notification (Then — below scenario):
| scenario | pet_id  | lifecycleState | appointment_id | appointmentStatus | customer_account_id | expected_notification_body                                                      |
|----------|---------|----------------|----------------|-------------------|---------------------|---------------------------------------------------------------------------------|
| 1        | PET-001 | Adopted        | APT-001        | confirmed         | CUST-001            | Buddy has been adopted. You can cancel your visit or browse other available pets |

---

### Scenario Outline: No pending appointments — adoption processed without notification

Given a **Pet** *{pet_id}* is marked as *{lifecycleState}*
  And **Pet** *{pet_id}* has *{pending_appointment_count}* **Appointment** entries with **appointmentStatus** *{appointmentStatus}*
When the system processes the adoption event
Then the adoption event completes with *{expected_notification_count}* notifications sent
  And the **Pet** *{pet_id}* **lifecycleState** is *{expected_lifecycleState}*

### No pending appointments (Then — below scenario):
| scenario | pet_id  | lifecycleState | pending_appointment_count | appointmentStatus | expected_notification_count | expected_lifecycleState |
|----------|---------|----------------|---------------------------|-------------------|-----------------------------|-------------------------|
| 1        | PET-003 | Adopted        | 0                         | confirmed         | 0                           | Adopted                 |

---

## Story: `Check In Customer`

### Scenario Outline: Customer checked in — status transitions to checked-in

Given a **Store Employee** at **Store** *{storeCode}*
  And an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*
When the *Store Employee* selects "Check In" on **Appointment** *{appointment_id}*
Then **Appointment** *{appointment_id}* **appointmentStatus** transitions to *{appointmentStatus_after}*
  And **checkedInTime** is recorded as *{checkedInTime}*
  And **checkedInBy** is recorded as **Store** *{storeCode}*
  And the staff view shows *{expected_checkin_label}*

### Check-in (Then — below scenario):
| scenario | appointment_id | storeCode | appointmentStatus_before | appointmentStatus_after | checkedInTime        | expected_checkin_label              |
|----------|----------------|-----------|--------------------------|-------------------------|----------------------|-------------------------------------|
| 1        | APT-001        | STR-001   | confirmed                | checked-in              | 2025-06-10T09:55:00  | Checked in at 09:55 by STR-001     |

---

### Scenario Outline: Early or late arrival — check-in still allowed

Given an **Appointment** *{appointment_id}* with **scheduledDateAndTimeSlot** starting at *{slot_start}*
When the *Store Employee* checks in the customer at *{actual_arrival}*
Then **checkedInTime** records *{actual_arrival}*
  And the staff view shows *{expected_timing_label}*

### Timing flexibility (Then — below scenario):
| scenario | appointment_id | slot_start           | actual_arrival       | expected_timing_label               |
|----------|----------------|----------------------|----------------------|--------------------------------------|
| 1        | APT-001        | 2025-06-10T10:00:00  | 2025-06-10T09:45:00  | Checked in 15 min early at 09:45    |
| 2        | APT-001        | 2025-06-10T10:00:00  | 2025-06-10T10:20:00  | Checked in 20 min late at 10:20     |

---

### Scenario Outline: Duplicate check-in — original time preserved with message

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}* and **checkedInTime** *{original_checkin}*
When the *Store Employee* attempts to check in again
Then the system shows *{expected_message}*
  And the **checkedInTime** remains *{original_checkin}*

### Duplicate check-in (Then — below scenario):
| scenario | appointment_id | appointmentStatus | original_checkin     | expected_message                             |
|----------|----------------|-------------------|----------------------|----------------------------------------------|
| 1        | APT-001        | checked-in        | 2025-06-10T09:55:00  | Already checked in at 09:55 — no change made |

---

### Scenario Outline: Check-in on cancelled appointment — blocked with reason

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}*
When the *Store Employee* attempts to check in
Then the system shows *{expected_block_message}*
  And the **appointmentStatus** remains *{appointmentStatus}*

### Cancelled check-in (Then — below scenario):
| scenario | appointment_id | appointmentStatus | expected_block_message                   |
|----------|----------------|-------------------|------------------------------------------|
| 1        | APT-004        | cancelled         | Cannot check in — this appointment was cancelled |

---

## Story: `Record Visit Outcome`

### Scenario Outline: Visit outcome recorded on checked-in appointment

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*
When the *Store Employee* selects "Record Outcome" and chooses *{visitOutcome}*
  And enters **staffVisitNotes** *{staffVisitNotes}*
Then the **Appointment** *{appointment_id}* **appointmentStatus** transitions to *{appointmentStatus_after}*
  And **visitOutcome** is recorded as *{visitOutcome}*
  And **staffVisitNotes** is recorded as *{staffVisitNotes}*
  And the outcome summary reads *{expected_outcome_summary}*

### Visit outcome (Then — below scenario):
| scenario | appointment_id | appointmentStatus_before | visitOutcome  | staffVisitNotes                     | appointmentStatus_after | expected_outcome_summary                                |
|----------|----------------|--------------------------|---------------|-------------------------------------|-------------------------|---------------------------------------------------------|
| 1        | APT-001        | checked-in               | Browsing Only | Customer enjoyed meeting the dog    | completed               | Browsing Only — Customer enjoyed meeting the dog        |
| 2        | APT-001        | checked-in               | Not a Fit     | Dog too energetic for small flat    | completed               | Not a Fit — Dog too energetic for small flat             |

---

### Scenario Outline: Adopted outcome triggers pet status transition

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState_before}*
When the *Store Employee* selects *{visitOutcome}* as the **visitOutcome**
Then the **Appointment** is completed with **visitOutcome** *{visitOutcome}*
  And **Pet** *{pet_id}* **lifecycleState** transitions to *{expected_lifecycleState}* via **PetLifecycleEvent**
  And adoption notifications are triggered for *{expected_notification_count}* affected appointment(s)

### Adoption via outcome (Then — below scenario):
| scenario | appointment_id | pet_id  | appointmentStatus_before | lifecycleState_before | visitOutcome | expected_lifecycleState | expected_notification_count |
|----------|----------------|---------|--------------------------|----------------------|--------------|-------------------------|-----------------------------|
| 1        | APT-001        | PET-001 | checked-in               | Available            | Adopted      | Adopted                 | 1                           |

---

### Scenario Outline: Interested-Returning outcome prompts follow-up

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*
When the *Store Employee* selects *{visitOutcome}* as the **visitOutcome**
Then the system prompts with *{expected_follow_up_prompt}*

### Follow-up prompt (Then — below scenario):
| scenario | appointment_id | appointmentStatus_before | visitOutcome           | expected_follow_up_prompt                           |
|----------|----------------|--------------------------|------------------------|-----------------------------------------------------|
| 1        | APT-001        | checked-in               | Interested — Returning | Set a follow-up action for this customer's next visit |

---

### Scenario Outline: Outcome recorded without staff notes — accepted

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*
When the *Store Employee* records **visitOutcome** *{visitOutcome}* without **staffVisitNotes**
Then the **Appointment** transitions to *{appointmentStatus_after}*
  And the outcome summary reads *{expected_outcome_summary}*
  And the notes section reads *{expected_notes_display}*

### Notes optional (Then — below scenario):
| scenario | appointment_id | appointmentStatus_before | visitOutcome  | appointmentStatus_after | expected_outcome_summary | expected_notes_display |
|----------|----------------|--------------------------|---------------|-------------------------|--------------------------|------------------------|
| 1        | APT-001        | checked-in               | Browsing Only | completed               | Browsing Only            | (no staff notes)       |

---

## Story: `Record No-Show`

### Scenario Outline: No-show recorded after time slot passes

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*
  And the **TimeSlot** *{timeslot_id}* has passed without check-in
When the *Store Employee* marks **Appointment** *{appointment_id}* as *{outcome}*
Then **appointmentStatus** transitions to *{appointmentStatus_after}*
  And **noShowRecordedBy** is recorded as **Store** *{storeCode}*
  And **noShowRecordedAt** is recorded as *{recorded_at}*
  And a rebook **Notification** is sent to the customer with body *{expected_notification_body}*

### No-show (Then — below scenario):
| scenario | appointment_id | timeslot_id | appointmentStatus_before | outcome | storeCode | recorded_at          | appointmentStatus_after | expected_notification_body                                       |
|----------|----------------|-------------|--------------------------|---------|-----------|----------------------|-------------------------|------------------------------------------------------------------|
| 1        | APT-001        | TS-001      | confirmed                | No-Show | STR-001   | 2025-06-10T10:45:00  | no-show                 | You missed your visit — would you like to rebook?                |

---

### Scenario Outline: No-show blocked for checked-in appointment — message shown

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}*
When the *Store Employee* attempts to mark as *{attempted_outcome}*
Then the system shows *{expected_block_message}*
  And the **appointmentStatus** remains *{appointmentStatus}*

### Checked-in vs no-show (Then — below scenario):
| scenario | appointment_id | appointmentStatus | attempted_outcome | expected_block_message                        |
|----------|----------------|-------------------|-------------------|-----------------------------------------------|
| 1        | APT-001        | checked-in        | No-Show           | Cannot mark as no-show — customer was already checked in |

---

## Story: `Set Follow-Up Action`

### Scenario Outline: Follow-up action recorded on appointment

Given an **Appointment** *{appointment_id}* with a recorded **visitOutcome**
When the *Store Employee* sets **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*
Then the **Appointment** *{appointment_id}* records **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*
  And the follow-up detail reads *{expected_follow_up_label}*

### Follow-up (Then — below scenario):
| scenario | appointment_id | followUpAction          | followUpDate | expected_follow_up_label                       |
|----------|----------------|-------------------------|--------------|------------------------------------------------|
| 1        | APT-001        | schedule-return-visit   | 2025-06-17   | Return visit scheduled for Tue 17 Jun          |
| 2        | APT-001        | hold-pet                | 2025-06-14   | Pet held until Sat 14 Jun                      |
| 3        | APT-001        | send-adoption-paperwork | 2025-06-12   | Adoption paperwork to be sent by Thu 12 Jun    |

---

### Scenario Outline: Hold-pet action — pet remains available with hold note

Given **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*
When the *Store Employee* confirms the follow-up
Then the **Pet** *{pet_id}* **lifecycleState** remains *{expected_lifecycleState}*
  And the appointment detail shows *{expected_hold_note}*
  And the hold expires on *{followUpDate}*

### Hold-pet (Then — below scenario):
| scenario | appointment_id | pet_id  | followUpAction | followUpDate | lifecycleState | expected_lifecycleState | expected_hold_note                       |
|----------|----------------|---------|----------------|--------------|----------------|-------------------------|------------------------------------------|
| 1        | APT-001        | PET-001 | hold-pet       | 2025-06-14   | Available      | Available               | Pet held for customer until Sat 14 Jun   |

---

### Scenario Outline: Follow-up date triggers customer notification

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*
When the current date reaches *{followUpDate}*
Then a *Visit Follow-Up Notification* is sent to **CustomerAccount** *{customer_account_id}*
  And the notification body includes *{expected_notification_body}*

### Follow-up trigger (Then — below scenario):
| scenario | appointment_id | followUpAction        | followUpDate | pet_id  | lifecycleState | customer_account_id | expected_notification_body                                      |
|----------|----------------|-----------------------|--------------|---------|----------------|---------------------|-----------------------------------------------------------------|
| 1        | APT-001        | schedule-return-visit | 2025-06-17   | PET-001 | Available      | CUST-001            | Time for your return visit to see Buddy at PawPlace Bristol     |

---

## Story: `Send Visit Follow-Up Notification`

### Scenario Outline: Follow-up notification sent on follow-up date

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}* at **Store** *{storeCode}* (*{storeName}*)
When the current date is *{followUpDate}*
Then the system sends a *Visit Follow-Up Notification* to **CustomerAccount** *{customer_account_id}*
  And the notification references *{expected_notification_body}*

### Follow-up notification (Then — below scenario):
| scenario | appointment_id | followUpAction | followUpDate | pet_id  | lifecycleState | storeCode | storeName        | customer_account_id | expected_notification_body                                           |
|----------|----------------|----------------|--------------|---------|----------------|-----------|------------------|---------------------|----------------------------------------------------------------------|
| 1        | APT-001        | hold-pet       | 2025-06-14   | PET-001 | Available      | STR-001   | PawPlace Bristol | CUST-001            | Your hold on Buddy at PawPlace Bristol expires today — visit soon    |

---

### Scenario Outline: Follow-up action set to none — no notification triggered

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}*
When any follow-up trigger date arrives
Then the follow-up outcome is *{expected_outcome}*
  And the appointment detail reads *{expected_detail_label}*

### No follow-up (Then — below scenario):
| scenario | appointment_id | followUpAction | expected_outcome         | expected_detail_label |
|----------|----------------|----------------|--------------------------|-----------------------|
| 1        | APT-001        | none           | no notification sent     | No follow-up set      |

---

### Scenario Outline: Follow-up suppressed when pet adopted before follow-up date

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*
  And **Pet** *{pet_id}* has **lifecycleState** *{lifecycleState}* (adopted before *{followUpDate}*)
When the current date reaches *{followUpDate}*
Then the follow-up outcome is *{expected_follow_up_outcome}*
  And the notification sent is *{expected_notification_type}*

### Adoption suppresses follow-up (Then — below scenario):
| scenario | appointment_id | followUpAction        | followUpDate | pet_id  | lifecycleState | expected_follow_up_outcome              | expected_notification_type                |
|----------|----------------|-----------------------|--------------|---------|----------------|-----------------------------------------|-------------------------------------------|
| 1        | APT-001        | schedule-return-visit | 2025-06-17   | PET-001 | Adopted        | skipped — pet adopted before follow-up  | Pet Adopted Before Visit Notification     |

# Lo-fi — Increment 6: Pet visits

> **Companion to** `docs/ux/lo-fi/increment-6-pet-visits.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 6 — Pet visits (13 screens: gallery, profiles, booking flow, account appointments, staff board + actions, notification preview) |
| Initial IA | `docs/ux/information-architecture.md` (Increment 1 base; Increment 6 screens AC-derived — no Design/ images) |
| AC source | `docs/story/acceptance-criteria/increment-6-acceptance-criteria.md` |
| Domain terms | `docs/domain/ubiquitous-language.md` (Run 7 exploration, slot 145–146 cycle) |
| State file | `docs/ux/lo-fi/increment-6-pet-visits-state.json` |
| Wireframe | `docs/ux/lo-fi/increment-6-pet-visits.drawio` |
| Last updated | 2026-05-26 |

## Description

Lo-fi wireframes for the adoption side of PawPlace going live in Increment 6. Customers browse the *Pet Gallery* (species filter), open a *Pet Profile Page* (available or adopted state), and book an *Appointment* to visit a pet at a *Store*. Booking is **customer-account-only** — guest users see an auth gate that holds the *Selected Slot*. Staff access the *Incoming Appointments* board, *Check-In* arriving customers, record a *Visit Outcome* (including the adopted path), set *Follow-Up Actions*, and manage *Pet Profiles* (including *Mark Pet as Adopted*). System transactional notifications are shown as a preview screen. Builds on Increments 1–5 navigation chrome and account patterns.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1–5 lo-fi patterns and standard appointment booking UX conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 1 | species/category filter | listbox | Sidebar selection; active item highlighted; all-option at top |
| Inc 1 | store list | list | Rows with photo · name · fields · action |
| Inc 4 | account nav | nav-tabs | Account area tabs — Profile · Orders · Appointments active |
| AC | pet gallery | list + listbox | Species filter sidebar + pet card rows (photo, name, breed, species, store) |
| AC | pet profile | stack form | Photo gallery thumbnails + info fields + store section + CTA |
| AC | appointment booking | form | Calendar slot picker → visit note textarea → confirm button |
| AC | guest auth gate | modal | "Appointments require a customer account" — sign-in primary + hold notice |
| AC | staff incoming appointments | list | Sorted by date/time; check-in / outcome / no-show actions per row |
| AC | staff record outcome | form | Outcome listbox (4 options) + staff visit notes textarea |
| AC | staff set follow-up | form | Follow-up action listbox + date picker |
| AC | staff pet profile editor | form | All pet fields editable; mark adopted action; photo upload list |
| AC | notification preview | stack | Email content preview with pet · store · date/time · note fields |

**Design principles applied:** Extend Increment 1–4 chrome (navigation, tabs, list patterns); use species filter listbox matching category filter pattern; appointment booking mirrors standard date/time picker + confirmation flow; staff board extends admin dashboard list pattern with per-row inline actions; account appointments tab is a new tab in the account area established in Increment 4.

---

## Screens

### pet gallery

**Layout:** sidebar  
**AC stories:** Browse Pets by Species

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Pets added to primary nav in Increment 6; logged-in chrome from Increment 4 |
| breadcrumb | header | chrome | breadcrumb | Home › Pets |
| species filter | panel | listbox | All (selected) · Dogs · Cats · Reptiles · Small Mammals | Filter is a sidebar listbox; active item highlighted; "All" is default |
| pet gallery grid | body | list | pet photo · pet name · breed · species · store name | Each row is a *Pet Card*; action: select pet card |
| gallery empty state | body | form | No pets available in this category right now · species filter remains active | Shown when filtered species has no available pets; other species remain visible |

---

### pet profile page — available

**Layout:** stack  
**AC stories:** View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail (selected) | Photo gallery thumbnails; selected photo displayed large above; action: select thumbnail |
| pet info | body | form | name · species · breed · age · temperament notes (optional) | *Temperament Notes* field omitted when empty (not shown as blank) |
| store location | body | form | store name · store address · operating hours · distance from customer location | Distance shown when customer location available; prompt to share location when absent |
| pet status | body | form | Available badge | *Pet Status* displayed as Available badge |
| book a visit CTA | body | button-bar | Book a Visit (primary) | Links to appointment booking flow; visible only when *Pet Status* is *Available* |

---

### pet profile page — adopted

**Layout:** stack  
**AC stories:** View Pet Profile (adopted state)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail | Adopted pets remain viewable — not deleted from gallery |
| pet info | body | form | name · species · breed · age · temperament notes | Same fields; profile remains viewable |
| store location | body | form | store name · store address · operating hours | Distance section preserved |
| pet status — adopted | body | form | Adopted badge | *Pet Status* displayed as Adopted badge instead of Available |
| book a visit — disabled | body | form | Book a Visit (disabled) | Button hidden or disabled; no appointment booking when *Pet Status* is *Adopted* |

---

### book appointment — guest auth gate

**Layout:** modal  
**AC stories:** Confirm Appointment Booking (guest block)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| auth gate prompt | body | form | Appointments require a customer account · Sign In (primary) · Register | Guest cannot confirm; slot held temporarily while customer authenticates |
| slot hold notice | body | form | Your selected slot is held for 10 minutes | Temporary hold preserved during auth so customer doesn't lose the slot |

---

### book appointment — select time slot

**Layout:** form  
**AC stories:** View Available Time Slots at Store · Select Date and Time Slot

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | pet name · store name · store address | Context carried forward from pet profile; read-only |
| appointment calendar | body | listbox | date header (next 14 days) · 10:00 AM · 11:00 AM (selected) · 12:00 PM · 2:00 PM · 3:00 PM | *Available Time Slots* list; already-booked slots absent; selected slot highlighted; 10-min hold on selection |
| no slots available notice | body | form | No slots available — try a later date | Shown when all slots in date range are booked |
| slot hold notice | body | form | Slot held for 10 minutes — complete booking to confirm | Shown after selection to indicate temporary hold |
| slot released notice | body | form | Your selected slot is no longer held — please select a new time | Shown when temporary hold expires before customer confirms; AC Select Date and Time Slot AC 2 |
| continue | body | button-bar | Continue (primary) · Back to pet profile | Proceeds to visit note + confirm step |

---

### appointment confirmation — review and note

**Layout:** form  
**AC stories:** Add Visit Note · Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment summary | body | form | pet name · store name · date · time slot | Read-only booking summary before confirm |
| visit note | body | form | Visit Note (optional textarea — up to 500 characters) · character count remaining | Optional field; blank note omitted from staff view (not "empty") |
| visit note validation | body | form | validation error: visit note exceeds 500 characters | Shown when note exceeds character limit; booking not submitted until within limits |
| confirm booking | body | button-bar | Confirm Booking (primary) · Back to slot selection | Confirms the *Appointment Booking*; transitions *Time Slot* from available to booked |

---

### appointment booking confirmed

**Layout:** stack  
**AC stories:** Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| confirmation header | body | form | Appointment confirmed! · booking reference | Confirmation page shown after successful booking |
| booking details | body | form | pet name · store name · date/time · visit note (if provided) · Appointment Confirmation Email sent to customer email | Full booking summary; email notice matches AC |
| post-confirmation actions | body | button-bar | View My Appointments (primary) · Browse More Pets | Navigate to appointment list or back to gallery |

---

### customer account — appointments

**Layout:** stack  
**AC stories:** View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| account nav | header | nav-tabs | Profile · Orders · Appointments (active) · Wishlist · Saved Payments | Account area tab from Increment 4; Appointments tab added in Increment 6 |
| upcoming appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · status badge · Cancel | Upcoming *Appointments* sorted soonest first; "pet adopted" badge + Cancel + Browse other pets when pet is *Adopted* |
| past appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · outcome | *Past Appointments* below upcoming; cancelled appointments shown with *Cancelled* status |
| appointments empty state | body | form | No appointments yet — Browse the Pet Gallery | Shown when no appointments exist; prompt links to *Pet Gallery* |

---

### staff — incoming appointments

**Layout:** stack  
**AC stories:** View Incoming Appointments · Check In Customer · Record No-Show

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome; minimal nav |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments (active) · Pet Profiles | *Incoming Appointments* tab active; staff-area navigation |
| appointments list | body | list | customer name · pet name · date/time · visit note (if any) · status · Check In · Record Outcome · Mark No-Show | All booked *Appointments* for this *Store*; sorted by date/time soonest first; "pet adopted" warning badge + notification status when applicable; "no check-in" indicator on past-due unvisited rows |
| already checked in | body | form | already checked in — checked in at [original Checked-In Time] | Conditional inline alert; shown when Check In is triggered but customer already checked in (Check In Customer AC 3) |
| cancelled appointment block | body | form | this appointment was cancelled — no further action available | Conditional inline alert; shown when Check In is triggered on a cancelled appointment (Check In Customer AC 4) |
| customer already checked in | body | form | customer was already checked in — no-show cannot be recorded | Conditional inline alert; shown when Mark No-Show is triggered but customer was already checked in (Record No-Show AC 4) |
| appointments empty state | body | form | No upcoming appointments | Standard empty state |

---

### staff — record outcome

**Layout:** form  
**AC stories:** Record Visit Outcome · Set Follow-Up Action

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time | Read-only; identifies the appointment being recorded |
| outcome selector | body | listbox | Adopted (selected) · Interested — Returning · Not a Fit · Browsing Only | Four *Visit Outcome* options; selecting *Adopted* triggers pet status transition; *Interested — Returning* prompts follow-up |
| staff visit notes | body | form | Staff Visit Notes (optional textarea) | *Staff Visit Notes* free-text; optional (notes-less outcome accepted) |
| outcome already recorded notice | body | form | Outcome already recorded: [existing outcome] · Override | Shown when outcome exists; override available to correction-authority staff |
| submit | body | button-bar | Record Outcome (primary) · Cancel | Saves *Visit Outcome* + *Staff Visit Notes*; *Adopted* path also transitions *Pet Status* |

---

### staff — set follow-up action

**Layout:** form  
**AC stories:** Set Follow-Up Action · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time · outcome recorded | Context from prior outcome or no-show step |
| follow-up action | body | listbox | None · Schedule Return Visit · Hold Pet · Send Adoption Paperwork | *Follow-Up Action* options; *Hold Pet* shows hold-expiry date field; *Schedule Return Visit* shows booking-flow link |
| follow-up date | body | form | Follow-Up Date (date picker) | When the follow-up notification fires; required if action is not None |
| schedule return visit link | body | form | Book new appointment for [customer name] with [pet name] | Shown only when *Schedule Return Visit* selected; staff-assisted rebooking link |
| hold expiry | body | form | Hold expires: [date] | Shown only when *Hold Pet* selected; pet remains *Available* with hold note |
| submit | body | button-bar | Set Follow-Up (primary) · Skip | Saves *Follow-Up Action* + *Follow-Up Date*; Skip omits follow-up (None) |

---

### staff — pet profile editor

**Layout:** form  
**AC stories:** Update Pet Profile · Mark Pet as Adopted

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Shared staff chrome |
| pet info form | body | form | name · species · breed · age · temperament notes · store (dropdown) | All *Pet Profile* fields editable; store dropdown for pet relocation |
| pet photo gallery — manage | body | list | photo thumbnail · alt text · remove | Existing photos listed; Upload Photo button adds to gallery additively; Remove deletes individual photo |
| pet status — mark adopted | body | form | Status: Available (dropdown — Available / Adopted) | Changing to *Adopted* triggers *Mark Pet as Adopted* flow + notifications to affected customers |
| already adopted notice | body | form | This pet is already adopted | Shown when attempting to re-mark an already-adopted pet |
| save / cancel | body | button-bar | Save Changes (primary) · Cancel | Saves profile; customer-facing *Pet Profile Page* reflects changes immediately |

---

### notification preview — appointment reminder

**Layout:** stack  
**AC stories:** Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | body | nav-tabs | Appointment Reminder (active) · Pet Adopted Before Visit · Visit Follow-Up | Preview selector for three transactional notification types |
| appointment reminder preview | body | form | Subject: Your appointment with [pet name] is tomorrow · pet name · store address · date/time · visit note | *Appointment Reminder* sent 24 hours before appointment; suppressed if cancelled or pet adopted |
| pet adopted before visit preview | body | form | Subject: [pet name] has been adopted · pet name · adoption status · Cancel Appointment (primary) · Browse Other Pets | *Pet Adopted Before Visit Notification* sent when staff marks pet adopted; includes cancel/rebook options |
| visit follow-up preview | body | form | Subject: Follow-up on your visit with [pet name] · pet name · store · follow-up context | *Visit Follow-Up Notification* triggered on *Follow-Up Date*; suppressed if pet adopted before date |
| resilience note | body | form | Email queued for retry when delivery system unavailable | Same email resilience pattern as order confirmation (Increments 2–5) |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| species filter listbox — All · Dogs · Cats · Reptiles · Small Mammals | Browse Pets by Species | AC 1–2 — filter by species; active filter visible |
| pet gallery grid rows — photo · name · breed · species · store | Browse Pets by Species | AC 1 — Pet Card fields |
| gallery empty state message | Browse Pets by Species | AC 3 — no pets in category; filter remains active |
| pet photo gallery thumbnails | View Pet Profile | AC 1 — Pet Photo Gallery |
| pet info fields: name · species · breed · age · temperament notes | View Pet Profile | AC 1 — profile fields; temperament notes omitted when empty per AC 4 |
| pet status: Available badge / Adopted badge | View Pet Profile | AC 2–3 — Book a Visit shown when Available; Adopted badge shown when Adopted |
| Book a Visit CTA (primary) / disabled | View Pet Profile | AC 2–3 — CTA present when Available; hidden/disabled when Adopted |
| store name · address · operating hours · distance | View Pet Store Location and Distance | AC 1–2 — store info + distance when location available |
| distance prompt — share location / enter postcode | View Pet Store Location and Distance | AC 3 — no distance without reference point |
| store name link → Store Detail page | View Pet Store Location and Distance | AC 4 — opens Increment 1 Store Detail |
| appointment calendar — available time slots listbox | View Available Time Slots at Store | AC 1 — Available Time Slots at store for next N days |
| already-booked slots absent from listbox | View Available Time Slots at Store | AC 2 — booked slots not shown |
| no slots available notice | View Available Time Slots at Store | AC 3 — empty calendar message |
| selected slot highlighted + slot hold notice | Select Date and Time Slot | AC 1 — slot held 10 minutes on selection |
| slot released notice (hold expired) | Select Date and Time Slot | AC 2 — hold expires; customer must re-select |
| double-booking block (AC 3) | Select Date and Time Slot | AC 3 — system-level; no customer screen; noted in spec |
| visit note textarea (optional, 500-char limit) | Add Visit Note | AC 1 — optional field with character limit |
| blank note proceeds without note field | Add Visit Note | AC 2 — blank note omitted from staff view |
| visit note validation error (over limit) | Add Visit Note | AC 3 — validation error; booking not submitted |
| guest auth gate modal — sign in / register | Confirm Appointment Booking | AC 2 — guest blocked; slot held during auth |
| Confirm Booking (primary) — creates Appointment Booking | Confirm Appointment Booking | AC 1 — booking created with pet · store · date/time · note |
| appointment confirmation page + email sent notice | Confirm Appointment Booking | AC 1 — confirmation page + email |
| slot transitions to booked (hidden from gallery) | Confirm Appointment Booking | AC 3 — slot no longer shown to other customers |
| email delivery failure (queued for retry) | Confirm Appointment Booking | AC 4 — booking not gated on email; retry queued |
| upcoming appointments list (soonest first) | View Upcoming and Past Appointments | AC 1 — sorted; pet · store · date/time · note fields |
| past appointments list | View Upcoming and Past Appointments | AC 1 — past entries below upcoming |
| "pet adopted" badge on appointment entry | View Upcoming and Past Appointments | AC 3 — adopted badge + Cancel + Browse other pets |
| appointments empty state → Browse Pet Gallery | View Upcoming and Past Appointments | AC 2 — empty state with browse prompt |
| Cancel appointment action | Cancel or Rebook Appointment After Pet Adoption | AC 2 — cancellation releases slot; moves to Cancelled in list |
| Browse other pets / Rebook | Cancel or Rebook Appointment After Pet Adoption | AC 3 — navigates to Pet Gallery for new booking |
| "pet adopted" warning + no-action rows remain | Cancel or Rebook Appointment After Pet Adoption | AC 4 — neither cancelled nor rebooked; staff see warning |
| staff appointments list — customer · pet · date/time · note · status | View Incoming Appointments | AC 1 — all store appointments sorted by date/time |
| "pet adopted" badge + notification status on staff row | View Incoming Appointments | AC 2 — adoption warning visible on staff board |
| Check In action → checked-in time recorded | Check In Customer | AC 1 — records checked-in time + staff member |
| early/late check-in allowed (actual arrival time) | Check In Customer | AC 2 — checked-in time ≠ slot start |
| "already checked in" message + original time | Check In Customer | AC 3 — idempotent check-in |
| "appointment was cancelled" block on check-in | Check In Customer | AC 4 — cancelled appointments cannot transition forward |
| Mark No-Show action → no-show recorded | Record No-Show | AC 2 — records staff member + timestamp |
| "no check-in" indicator on past-due rows | Record No-Show | AC 1 — Mark No-Show action available on overdue appointments |
| follow-up notification triggered on no-show | Record No-Show | AC 3 — system notification; no separate customer screen |
| "customer was already checked in" block | Record No-Show | AC 4 — mutually exclusive states |
| outcome selector: 4 options listbox | Record Visit Outcome | AC 1 — Adopted · Interested — Returning · Not a Fit · Browsing Only |
| Adopted outcome → pet status transitions | Record Visit Outcome | AC 2 — same adoption path as Mark Pet as Adopted |
| Interested — Returning prompts follow-up | Record Visit Outcome | AC 3 — prompts Set Follow-Up Action step |
| staff visit notes textarea (optional) | Record Visit Outcome | AC 5 — notes optional |
| outcome already recorded + override | Record Visit Outcome | AC 4 — existing outcome shown; override for correction authority |
| follow-up action listbox (None · Schedule · Hold · Paperwork) | Set Follow-Up Action | AC 1 — action type + follow-up date saved |
| Hold Pet → hold expiry date | Set Follow-Up Action | AC 2 — pet remains Available; hold note displayed |
| Schedule Return Visit → booking link | Set Follow-Up Action | AC 3 — staff-assisted rebooking |
| follow-up notification triggered on Follow-Up Date | Set Follow-Up Action | AC 4 — Visit Follow-Up Notification fires on date |
| pet info fields + store dropdown editable | Update Pet Profile | AC 1 — all fields editable including store location |
| save changes → immediate customer-facing update | Update Pet Profile | AC 2 — profile page reflects changes immediately |
| photo gallery management — upload additively | Update Pet Profile | AC 3 — additive upload; existing photos not replaced unless removed |
| store transfer → store-change notification | Update Pet Profile | AC 4 — relocation triggers notification to affected customers |
| pet status dropdown → Mark as Adopted | Mark Pet as Adopted | AC 1 — status transitions Available → Adopted; Book a Visit disabled |
| notification triggered for pending appointments | Mark Pet as Adopted | AC 2 — Pet Adopted Before Visit Notification sent to affected customers |
| already adopted notice | Mark Pet as Adopted | AC 3 — idempotent; no change if already adopted |
| appointment reminder preview (24h before) | Send Appointment Reminder | AC 1 — pet · store · date/time · note in reminder |
| reminder suppressed if cancelled | Send Appointment Reminder | AC 2 — no reminder for cancelled appointments |
| reminder suppressed if pet adopted | Send Appointment Reminder | AC 3 — adopted notification takes precedence |
| email queued for retry | Send Appointment Reminder | AC 4 — email resilience pattern |
| pet adopted before visit notification — cancel/rebook options | Send Pet Adopted Before Visit Notification | AC 1 — notification includes cancel + browse options |
| notification status on staff view | Send Pet Adopted Before Visit Notification | AC 2 — staff sees "notified" / "not yet notified" |
| no notification when no pending appointments | Send Pet Adopted Before Visit Notification | AC 3 — appointment-dependent |
| email retry when delivery unavailable | Send Pet Adopted Before Visit Notification | AC 4 — badge shown regardless of email failure |
| visit follow-up notification preview | Send Visit Follow-Up Notification | AC 1 — fires on Follow-Up Date with pet · store · follow-up context |
| no follow-up when action is None | Send Visit Follow-Up Notification | AC 2 — follow-up is opt-in by staff |
| follow-up suppressed if pet adopted | Send Visit Follow-Up Notification | AC 3 — adopted notification takes precedence |
| follow-up email retry | Send Visit Follow-Up Notification | AC 4 — same resilience pattern |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| pet gallery | Browse Pets by Species | Pet Gallery · Species · Pet Card · Pet · Store |
| pet profile page — available | View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store | Pet Profile Page · Pet · Pet Status · Pet Photo Gallery · Temperament Notes · Store · Distance · Customer Location · Time Slot · Available Time Slots · Appointment Calendar |
| pet profile page — adopted | View Pet Profile (adopted state) | Pet Profile Page · Pet · Pet Status · Adopted |
| book appointment — guest auth gate | Confirm Appointment Booking | Customer Account · Selected Slot · Appointment Booking |
| book appointment — select time slot | View Available Time Slots at Store · Select Date and Time Slot | Time Slot · Available Time Slots · Appointment Calendar · Selected Slot |
| appointment confirmation — review and note | Add Visit Note · Confirm Appointment Booking | Visit Note · Appointment · Appointment Booking |
| appointment booking confirmed | Confirm Appointment Booking | Appointment Booking · Appointment Confirmation Page · Appointment Confirmation Email · Customer Account |
| customer account — appointments | View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption | Appointment List · Upcoming Appointment · Past Appointment · Customer Account · Appointment Cancellation · Rebook · Pet Adopted Before Visit |
| staff — incoming appointments | View Incoming Appointments · Check In Customer · Record No-Show | Incoming Appointments · Store Employee · Appointment · Check-In · Checked-In Time · No-Show · No-Show Recorded By · No-Show Recorded At |
| staff — record outcome | Record Visit Outcome · Set Follow-Up Action | Visit Outcome · Staff Visit Notes · Appointment · Follow-Up Action · Follow-Up Date |
| staff — set follow-up action | Set Follow-Up Action · Send Visit Follow-Up Notification | Follow-Up Action · Follow-Up Date · Visit Follow-Up Notification |
| staff — pet profile editor | Update Pet Profile · Mark Pet as Adopted | Pet Profile · Store Employee · Pet Photo Gallery · Pet Status · Adopted · Pet |
| notification preview — appointment reminder | Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification | Appointment Reminder · Pet Adopted Before Visit Notification · Visit Follow-Up Notification · Customer Account · Appointment |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Full returns / refunds UI | Deferred to Increment 7 |
| *Product* / checkout / payment UI | Increments 1–5 — preserved, not reproduced here |
| Online pet adoption paperwork form | Physical process — staff handles offline (noted via Follow-Up Action) |
| Admin notification settings | Back-office scope; notification content is configurable but not a customer screen |
| Pet availability calendar per store | Out of scope for Increment 6 |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout paths (Increments 2–3) | Guest shopping unchanged; appointment booking adds account gate separately |
| Account nav chrome (Increment 4) | Appointments tab added alongside Profile · Orders · Wishlist · Saved Payments |
| Store detail (Increment 1) | Reused from pet profile's store link |
| Distance / location entry (Increment 1) | Reused on pet profile to show distance to pet's store |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/ux/lo-fi/increment-6-pet-visits-state.json" --out "docs/ux/lo-fi/increment-6-pet-visits.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-26 | initial | 13 Increment 6 screens (pet gallery, profile states, booking flow, customer account, staff board + actions, pet profile editor, notification preview); state JSON + drawio generated. |
| 2026-05-26 | rework (slot 149-rework) | F1: added slot released notice region to select time slot screen. F3: Browse other pets action added to upcoming appointments. F4: label corrected to distance from customer location. F2: 3 conditional inline alert regions added to staff — incoming appointments (already checked in, cancelled appointment block, customer already checked in). State JSON + drawio regenerated. |
| 2026-05-26 | rework (slot 150-rework2) | B1: inserted \slot released notice\ row between \slot hold notice\ and \continue\ in book appointment — select time slot screen table. lo-fi.md only; state.json unchanged. |

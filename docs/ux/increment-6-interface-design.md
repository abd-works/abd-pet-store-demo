# Interface design — Increment 6 (Pet visits)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-6-pet-visits.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–5 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 6 — Pet visits (13 screens, 19 stories) |
| Lo-fi reference | `docs/ux/lo-fi/increment-6-pet-visits.md` |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-6-acceptance-criteria.md` |
| Domain terms | `docs/domain/ubiquitous-language.md` (Run 7 exploration, slots 145–146 cycle) |
| Initial IA | `docs/ux/information-architecture.md` (Increment 1 base; Increment 6 screens AC-derived) |
| Prior interface specs | `docs/ux/increment-5-interface-design.md` and earlier |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/pet/` (new), `packages/appointment/` (new), `packages/notification/` (extend), `packages/app-client/src/pages/` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-26 (Specification slot 159) |

## Description

Increment 6 brings the adoption side of PawPlace live. Customers browse the *Pet Gallery* (species filter), open a *Pet Profile Page* (available or adopted state), and book an *Appointment* to visit a pet at a *Store*. Booking is **customer-account-only** — guest users see an auth gate that holds the *Selected Slot* while they authenticate. Staff access the *Incoming Appointments* board, *Check In* arriving customers, record a *Visit Outcome* (including the adopted path), set *Follow-Up Actions*, and manage *Pet Profiles* (including *Mark Pet as Adopted*). System transactional notifications are shown as a preview screen covering *Appointment Reminder*, *Pet Adopted Before Visit Notification*, and *Visit Follow-Up Notification*. Builds on Increments 1–5 navigation chrome and account patterns.

---

## Host project conventions

Same baseline as Increments 2–5; additions for pet and appointment domain modules.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; customer-facing pages in `packages/app-client/src/pages/`; staff pages in `packages/app-client/src/pages/staff/`; new modules: `packages/pet/`, `packages/appointment/`
- **State management:** React component state + `CustomerSessionContext`; appointment booking wizard step state (slot selection → note → confirm); staff board uses server-polled list; no persistent client-side booking state across sessions (slot hold is server-managed)
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions; extend Increment 1–4 sidebar and list patterns for pet gallery and staff board; form layout matches Increment 2–4 checkout form conventions
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass per new/changed screen
- **Performance budget:** no explicit bundle cap — do not regress Increment 5 baseline; lazy-load staff-area routes; pet gallery and profile routes can eager-load (customer critical path)

---

## Pet and appointment domain extension

Increment 5 completed multi-vendor payment and closed the checkout spine. Increment 6 opens the adoption domain as a separate module family. All Increment 1–5 paths are preserved unchanged.

| Actor | Entry point | Booking gate | Staff path |
| --- | --- | --- | --- |
| **Guest** | `/pets` — *Pet Gallery* | Auth gate on booking attempt — slot held during auth | n/a |
| **Logged in (verified)** | `/pets` — *Pet Gallery* | Direct to booking flow | n/a |
| **Store Employee** | `/staff/appointments` | n/a | *Incoming Appointments* board → outcome / follow-up / check-in |

**Checkout progress tabs:** unchanged from Increments 3–5 — pet gallery and appointment booking are separate flows with their own breadcrumb chrome; they do not share the checkout wizard spine.

**Account area tabs:** *Appointments* tab added alongside *Profile* · *Orders* · *Wishlist* · *Saved Payments* (established Increment 4). Accounts tab is new in Increment 6.

**System-only paths (no dedicated customer screen):** *Appointment Reminder* sending (24h trigger — system), *Pet Adopted Before Visit Notification* trigger (on staff adoption action — system), *Visit Follow-Up Notification* trigger (on *Follow-Up Date* — system). These produce email content shown in the notification preview screen (staff-viewable reference only). Email resilience queuing is the same pattern as Increments 2–5 order confirmation.

---

## Screens (carried from lo-fi)

| Screen | Layout | Route (planned) | Stories | Change |
| --- | --- | --- | --- | --- |
| pet gallery | sidebar | `/pets` | Browse Pets by Species | **New** |
| pet profile page — available | stack | `/pets/:petId` | View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store | **New** |
| pet profile page — adopted | stack | `/pets/:petId` (adopted state) | View Pet Profile (adopted state) | **New** — conditional state on same route |
| book appointment — guest auth gate | modal | `/pets/:petId/book` (guest) | Confirm Appointment Booking | **New** — modal overlay on pet profile or book route |
| book appointment — select time slot | form | `/pets/:petId/book/slots` | View Available Time Slots at Store · Select Date and Time Slot | **New** |
| appointment confirmation — review and note | form | `/pets/:petId/book/confirm` | Add Visit Note · Confirm Appointment Booking | **New** |
| appointment booking confirmed | stack | `/pets/:petId/book/confirmed` | Confirm Appointment Booking | **New** |
| customer account — appointments | stack | `/account/appointments` | View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption | **New** — new tab in account area |
| staff — incoming appointments | stack | `/staff/appointments` | View Incoming Appointments · Check In Customer · Record No-Show | **New** |
| staff — record outcome | form | `/staff/appointments/:appointmentId/outcome` | Record Visit Outcome · Set Follow-Up Action | **New** |
| staff — set follow-up action | form | `/staff/appointments/:appointmentId/follow-up` | Set Follow-Up Action · Send Visit Follow-Up Notification | **New** |
| staff — pet profile editor | form | `/staff/pets/:petId/edit` | Update Pet Profile · Mark Pet as Adopted | **New** |
| notification preview — appointment reminder | stack | `/staff/notifications/preview` | Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification | **New** — staff reference screen |

---

## Screen specs (from lo-fi — regions verbatim)

### pet gallery

**Layout:** sidebar  
**Route:** `/pets`  
**AC stories:** Browse Pets by Species

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | *Pets* added to primary nav in Increment 6; logged-in chrome from Increment 4 |
| breadcrumb | header | chrome | breadcrumb | Home › Pets |
| species filter | panel | listbox | All (selected) · Dogs · Cats · Reptiles · Small Mammals | Filter is a sidebar listbox; active item highlighted; "All" is default; `aria-selected` per item |
| pet gallery grid | body | list | pet photo · pet name · breed · species · store name | Each row is a *Pet Card*; action: select pet card → navigate to `/pets/:petId`; `role="listitem"` per card |
| gallery empty state | body | form | No pets available in this category right now · species filter remains active | Shown when filtered species has no available pets; other species remain visible; empty state text in `aria-live="polite"` region |

**Conditional states:**
- Filter listbox `aria-selected="true"` on active species; `aria-selected="false"` on others
- Empty state rendered when `pets.length === 0` after species filter applied
- Gallery grid re-renders on species selection without full-page reload (React state update)

---

### pet profile page — available

**Layout:** stack  
**Route:** `/pets/:petId` (when `petStatus === "available"`)  
**AC stories:** View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail (selected) | Photo gallery thumbnails; selected photo displayed large above; action: select thumbnail updates main image; `aria-label="Pet photos"` on listbox |
| pet info | body | form | name · species · breed · age · temperament notes (optional) | *Temperament Notes* field omitted when empty — not rendered as blank; all fields read-only labels |
| store location | body | form | store name · store address · operating hours · distance from customer location | *Distance* shown when *Customer Location* available; prompt to share location or enter postcode when absent; store name is a link → Store Detail page (Increment 1) |
| pet status | body | form | Available badge | *Pet Status* displayed as Available badge; `aria-label="Pet status: Available"` |
| book a visit CTA | body | button-bar | Book a Visit (primary) | Links to appointment booking flow; visible only when *Pet Status* is *Available*; if guest → auth gate; if logged in → `/pets/:petId/book/slots` |

**Conditional states:**
- If guest clicks Book a Visit → show guest auth gate modal (slot hold begins)
- Distance region shows distance when `customerLocation` available; prompt shown when absent
- Store name link routes to existing Increment 1 Store Detail page

---

### pet profile page — adopted

**Layout:** stack  
**Route:** `/pets/:petId` (when `petStatus === "adopted"`)  
**AC stories:** View Pet Profile (adopted state)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail | Adopted pets remain viewable — not deleted from gallery; same photo listbox pattern |
| pet info | body | form | name · species · breed · age · temperament notes | Same fields as available state; profile remains viewable |
| store location | body | form | store name · store address · operating hours | Distance section preserved; store name link preserved |
| pet status — adopted | body | form | Adopted badge | *Pet Status* displayed as Adopted badge; `aria-label="Pet status: Adopted"` |
| book a visit — disabled | body | form | Book a Visit (disabled) | Button rendered as disabled (`disabled` attribute + `aria-disabled="true"`); no booking action; no CTA when *Pet Status* is *Adopted* |

**Conditional states:**
- Same route as available state; component branches on `petStatus`
- "Book a Visit" button rendered disabled (not hidden) to preserve screen structure consistency; screen reader announces "Book a Visit, dimmed"

---

### book appointment — guest auth gate

**Layout:** modal  
**Route:** modal overlay on `/pets/:petId/book` (guest branch)  
**AC stories:** Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| auth gate prompt | body | form | Appointments require a customer account · Sign In (primary) · Register | Guest cannot confirm; slot held temporarily (10 min) while customer authenticates; modal `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to heading |
| slot hold notice | body | form | Your selected slot is held for 10 minutes | Temporary hold preserved during auth so customer doesn't lose the *Selected Slot*; shown as `aria-live="polite"` notice |

**Conditional states:**
- Modal opens when guest selects Book a Visit; background (pet profile) remains inert (`aria-inert` or `inert` attribute)
- Sign In navigates to login route with `returnTo` param; after login, booking flow resumes
- Hold expires after 10 min server-side; if expired before auth completes, return to slot selection with slot released notice

---

### book appointment — select time slot

**Layout:** form  
**Route:** `/pets/:petId/book/slots`  
**AC stories:** View Available Time Slots at Store · Select Date and Time Slot

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | pet name · store name · store address | Context carried forward from pet profile; read-only; `aria-label` on each field |
| appointment calendar | body | listbox | date header (next 14 days) · 10:00 AM · 11:00 AM (selected) · 12:00 PM · 2:00 PM · 3:00 PM | *Available Time Slots* list; already-booked slots absent from list; selected slot highlighted (`aria-selected="true"`); 10-min hold on selection (server-side); keyboard: up/down arrows navigate slots |
| no slots available notice | body | form | No slots available — try a later date | Shown when all slots in date range are booked; `aria-live="polite"` |
| slot hold notice | body | form | Slot held for 10 minutes — complete booking to confirm | Shown after slot selection to indicate temporary hold; `aria-live="polite"` |
| slot released notice | body | form | Your selected slot is no longer held — please select a new time | Shown when temporary hold expires before customer confirms (*Select Date and Time Slot* AC 2); `role="alert"` |
| continue | body | button-bar | Continue (primary) · Back to pet profile | Proceeds to review and note step; Back navigates to `/pets/:petId` |

**Conditional states:**
- Slot hold started server-side when slot selected; UI shows 10-min countdown or static notice
- If hold expires: `role="alert"` slot released notice shown; Continue button disabled until new slot selected
- Double-booking (AC 3): server rejects second confirm; customer sees slot released notice on `/pets/:petId/book/confirm` — no separate customer screen; handled as a conflict error at confirm step

---

### appointment confirmation — review and note

**Layout:** form  
**Route:** `/pets/:petId/book/confirm`  
**AC stories:** Add Visit Note · Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment summary | body | form | pet name · store name · date · time slot | Read-only booking summary before confirm; `aria-label` per field |
| visit note | body | form | Visit Note (optional textarea — up to 500 characters) · character count remaining | Optional field; `aria-label="Visit Note (optional)"` + `aria-describedby` pointing to character count |
| visit note validation | body | form | validation error: visit note exceeds 500 characters | Shown when note exceeds character limit; `role="alert"`; booking not submitted until within limits |
| confirm booking | body | button-bar | Confirm Booking (primary) · Back to slot selection | Confirms the *Appointment Booking*; transitions *Time Slot* from available to booked; Back → `/pets/:petId/book/slots` |

**Conditional states:**
- Character counter updates live (`aria-live="polite"` on count); validation error on submit if over limit
- Blank *Visit Note*: textarea submitted empty; server stores no note; staff view shows no note field (not "empty")
- Slot conflict: if server returns slot-taken error, show slot released notice inline and route to `/pets/:petId/book/slots`

---

### appointment booking confirmed

**Layout:** stack  
**Route:** `/pets/:petId/book/confirmed`  
**AC stories:** Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| confirmation header | body | form | Appointment confirmed! · booking reference | Confirmation page shown after successful booking; `aria-live="polite"` on confirmation message (page load) |
| booking details | body | form | pet name · store name · date/time · visit note (if provided) · Appointment Confirmation Email sent to customer email | Full booking summary; email sent notice uses customer's verified email address; visit note shown only if provided |
| post-confirmation actions | body | button-bar | View My Appointments (primary) · Browse More Pets | View My Appointments → `/account/appointments`; Browse More Pets → `/pets` |

**Conditional states:**
- Visit note region omitted from booking details when no note provided
- Email failure (AC 4): booking confirmed page still shown; email queued for retry; no error shown to customer (booking is not gated on email)

---

### customer account — appointments

**Layout:** stack  
**Route:** `/account/appointments`  
**AC stories:** View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| account nav | header | nav-tabs | Profile · Orders · Appointments (active) · Wishlist · Saved Payments | Account area tab from Increment 4; *Appointments* tab added in Increment 6; `aria-current="page"` on Appointments tab |
| upcoming appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · status badge · Cancel | Upcoming *Appointments* sorted soonest first; "pet adopted" badge + Cancel + Browse other pets when pet is *Adopted*; `aria-label` per list item includes pet name and date |
| past appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · outcome | *Past Appointments* below upcoming; cancelled appointments shown with *Cancelled* status badge |
| appointments empty state | body | form | No appointments yet — Browse the Pet Gallery | Shown when no appointments exist; Browse the Pet Gallery links to `/pets` |

**Conditional states:**
- Upcoming list: when appointment's pet is *Adopted* → show "pet adopted" badge + Cancel button + "Browse other pets" link (→ `/pets`)
- Cancel action: `POST /api/appointments/:id/cancel` → slot released; appointment moves to past/cancelled; list refreshes
- Past appointments: *Cancelled* status badge shown on cancelled entries; *Adopted* badge shown on past entries where pet was adopted

---

### staff — incoming appointments

**Layout:** stack  
**Route:** `/staff/appointments`  
**AC stories:** View Incoming Appointments · Check In Customer · Record No-Show

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome; minimal nav |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments (active) · Pet Profiles | *Incoming Appointments* tab active; `aria-current="page"` on active tab |
| appointments list | body | list | customer name · pet name · date/time · visit note (if any) · status · Check In · Record Outcome · Mark No-Show | All booked *Appointments* for this *Store*; sorted by date/time soonest first; "pet adopted" warning badge + notification status when applicable; "no check-in" indicator on past-due unvisited rows; row actions have `aria-label` referencing customer and pet name |
| already checked in | body | form | already checked in — checked in at [original Checked-In Time] | Conditional inline alert (`role="alert"`); shown when Check In triggered but customer already checked in (Check In Customer AC 3) |
| cancelled appointment block | body | form | this appointment was cancelled — no further action available | Conditional inline alert (`role="alert"`); shown when Check In triggered on a cancelled appointment (Check In Customer AC 4) |
| customer already checked in | body | form | customer was already checked in — no-show cannot be recorded | Conditional inline alert (`role="alert"`); shown when Mark No-Show triggered but customer was already checked in (Record No-Show AC 4) |
| appointments empty state | body | form | No upcoming appointments | Standard empty state |

**Conditional states:**
- Check In button: `POST /api/staff/appointments/:id/check-in` → records *Checked-In Time* + staff member; button label changes to "Checked In" with timestamp; already-checked-in alert if already transitioned
- Mark No-Show button: `POST /api/staff/appointments/:id/no-show` → records *No-Show Recorded By* + *No-Show Recorded At*; blocks if appointment is checked-in (customer-already-checked-in alert)
- Past-due rows (slot end passed, not checked in): "no check-in" indicator shown; Mark No-Show action available
- "pet adopted" badge + notification status shown on rows where pet is *Adopted* (from *Mark Pet as Adopted* or *Record Visit Outcome* with *Adopted* outcome)

---

### staff — record outcome

**Layout:** form  
**Route:** `/staff/appointments/:appointmentId/outcome`  
**AC stories:** Record Visit Outcome · Set Follow-Up Action

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time | Read-only; identifies the appointment being recorded; `aria-label` per field |
| outcome selector | body | listbox | Adopted (selected) · Interested — Returning · Not a Fit · Browsing Only | Four *Visit Outcome* options; selecting *Adopted* triggers pet status transition; *Interested — Returning* prompts follow-up; `aria-label="Visit Outcome"` on listbox |
| staff visit notes | body | form | Staff Visit Notes (optional textarea) | *Staff Visit Notes* free-text; optional (notes-less outcome accepted); `aria-label="Staff Visit Notes (optional)"` |
| outcome already recorded notice | body | form | Outcome already recorded: [existing outcome] · Override | Shown when outcome exists; override available to correction-authority staff; `role="alert"` on notice |
| submit | body | button-bar | Record Outcome (primary) · Cancel | Saves *Visit Outcome* + *Staff Visit Notes*; *Adopted* path also transitions *Pet Status* to *Adopted* and triggers *Pet Adopted Before Visit Notification* for affected customers; Cancel → back to `/staff/appointments` |

**Conditional states:**
- Selecting *Adopted*: server `POST /api/staff/appointments/:id/outcome` with `{ outcome: "adopted" }` → triggers pet status change + notification fan-out
- Selecting *Interested — Returning*: after submit, redirect to `/staff/appointments/:appointmentId/follow-up` with prompt
- Outcome already recorded: pre-populate outcome selector with existing value; show notice; Override button clears existing outcome for re-submission (correction-authority check server-side)

---

### staff — set follow-up action

**Layout:** form  
**Route:** `/staff/appointments/:appointmentId/follow-up`  
**AC stories:** Set Follow-Up Action · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time · outcome recorded | Context from prior outcome or no-show step; read-only |
| follow-up action | body | listbox | None · Schedule Return Visit · Hold Pet · Send Adoption Paperwork | *Follow-Up Action* options; `aria-label="Follow-Up Action"` on listbox |
| follow-up date | body | form | Follow-Up Date (date picker) | When the *Visit Follow-Up Notification* fires; required if action is not None; `aria-label="Follow-Up Date"` + `aria-required="true"` when visible |
| schedule return visit link | body | form | Book new appointment for [customer name] with [pet name] | Shown only when *Schedule Return Visit* selected; staff-assisted rebooking link to booking flow |
| hold expiry | body | form | Hold expires: [date] | Shown only when *Hold Pet* selected; pet remains *Available* with hold note; `aria-live="polite"` |
| submit | body | button-bar | Set Follow-Up (primary) · Skip | Saves *Follow-Up Action* + *Follow-Up Date*; Skip omits follow-up (sets action to *None*); both → back to `/staff/appointments` |

**Conditional states:**
- *None* selected: date picker hidden, submit saves action:none
- *Hold Pet* selected: show hold expiry field; `aria-required` on follow-up date; pet status remains *Available* server-side with hold note flag
- *Schedule Return Visit* selected: show booking link; staff opens booking flow in new tab or same window
- *Follow-Up Date* reached: system triggers *Visit Follow-Up Notification* (background job); suppressed if pet already *Adopted*

---

### staff — pet profile editor

**Layout:** form  
**Route:** `/staff/pets/:petId/edit`  
**AC stories:** Update Pet Profile · Mark Pet as Adopted

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Shared staff chrome |
| pet info form | body | form | name · species · breed · age · temperament notes · store (dropdown) | All *Pet Profile* fields editable; store dropdown for pet relocation; `aria-label` per field; `aria-required` on required fields |
| pet photo gallery — manage | body | list | photo thumbnail · alt text · remove | Existing photos listed with alt text input per photo; Upload Photo button adds to gallery additively; Remove deletes individual photo; `aria-label="Upload photo"` on upload button |
| pet status — mark adopted | body | form | Status: Available (dropdown — Available / Adopted) | Changing to *Adopted* triggers *Mark Pet as Adopted* flow + notifications to affected customers; `aria-label="Pet Status"` on dropdown |
| already adopted notice | body | form | This pet is already adopted | Shown when attempting to re-mark an already-adopted pet; `role="alert"` |
| save / cancel | body | button-bar | Save Changes (primary) · Cancel | Saves profile; customer-facing *Pet Profile Page* reflects changes immediately; Cancel → back to `/staff/appointments` or prior page |

**Conditional states:**
- Pet Status dropdown: changing from *Available* to *Adopted* shows confirmation dialog before submit (destructive action — triggers notifications)
- Already adopted: if `petStatus === "adopted"`, dropdown shows Adopted (read-only) + already-adopted notice; no re-submission
- Store transfer (AC 4): if store dropdown changes, server triggers store-change notification to customers with affected appointments
- Photo upload: `<input type="file" multiple>` with progressive upload; each uploaded photo appended to gallery list; existing photos not replaced unless Remove clicked

---

### notification preview — appointment reminder

**Layout:** stack  
**Route:** `/staff/notifications/preview`  
**AC stories:** Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | body | nav-tabs | Appointment Reminder (active) · Pet Adopted Before Visit · Visit Follow-Up | Preview selector for three transactional notification types; `aria-current="page"` on active tab |
| appointment reminder preview | body | form | Subject: Your appointment with [pet name] is tomorrow · pet name · store address · date/time · visit note | *Appointment Reminder* sent 24 hours before appointment; suppressed if cancelled or pet adopted |
| pet adopted before visit preview | body | form | Subject: [pet name] has been adopted · pet name · adoption status · Cancel Appointment (primary) · Browse Other Pets | *Pet Adopted Before Visit Notification* sent when staff marks pet adopted; includes cancel/rebook options |
| visit follow-up preview | body | form | Subject: Follow-up on your visit with [pet name] · pet name · store · follow-up context | *Visit Follow-Up Notification* triggered on *Follow-Up Date*; suppressed if pet adopted before date |
| resilience note | body | form | Email queued for retry when delivery system unavailable | Same email resilience pattern as order confirmation (Increments 2–5) |

**Conditional states:**
- Tab switch updates preview content; no server call per tab (static reference templates)
- All three notification types use same email retry pattern: if delivery unavailable, queued within a reasonable window

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Pet gallery (species filter + card list) | `PetGalleryPage.tsx`, `PetCard.tsx`, `SpeciesFilter.tsx` | `packages/pet/server/pet-catalog/` |
| Pet profile page (available + adopted states) | `PetProfilePage.tsx`, `PetPhotoGallery.tsx`, `StoreLocationSection.tsx` | `packages/pet/server/pet-profile/` |
| Book appointment — guest auth gate | `GuestAuthGateModal.tsx` | `packages/appointment/server/booking/` (slot-hold API) |
| Book appointment — slot selection | `AppointmentSlotPickerPage.tsx`, `AppointmentCalendar.tsx` | `packages/appointment/server/slot-availability/` |
| Appointment confirmation — note + confirm | `AppointmentConfirmPage.tsx` | `packages/appointment/server/booking/` |
| Appointment booking confirmed | `AppointmentConfirmedPage.tsx` | `packages/appointment/server/booking/` |
| Customer account — appointments | `CustomerAppointmentsPage.tsx`, `AppointmentListItem.tsx` | `packages/appointment/server/customer-appointments/` |
| Staff — incoming appointments | `StaffAppointmentBoardPage.tsx`, `StaffAppointmentRow.tsx` | `packages/appointment/server/staff-board/` |
| Staff — record outcome | `RecordOutcomePage.tsx` | `packages/appointment/server/visit-outcome/` |
| Staff — set follow-up action | `SetFollowUpPage.tsx` | `packages/appointment/server/follow-up/` |
| Staff — pet profile editor | `StaffPetProfileEditorPage.tsx`, `PetPhotoManager.tsx` | `packages/pet/server/pet-profile-editor/` |
| Notification preview | `NotificationPreviewPage.tsx` | `packages/notification/server/preview/` |
| Appointment reminder (system) | (no customer UI — server-scheduled job) | `packages/notification/server/appointment-reminder/` |
| Pet adopted before visit notification (system) | (no customer UI — triggered by adoption action) | `packages/notification/server/pet-adopted-notification/` |
| Visit follow-up notification (system) | (no customer UI — triggered by follow-up date) | `packages/notification/server/follow-up-notification/` |
| Slot hold management | (server-side — no dedicated component) | `packages/appointment/server/slot-hold/` |

---

## AC → behaviour → test mapping

One row per Increment 6 AC clause. Test names trace to story title and clause number. Status **pending (Engineering)** until implementation pass.

### Browse Pets by Species

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Browse Pets by Species | 1 | *Pet Gallery* shows pets filterable by *Species*; each *Pet Card* shows photo, name, breed, species, and *Store* | `Browse Pets by Species — AC 1: gallery shows pet cards with species filter` | pending (Engineering) |
| Browse Pets by Species | 2 | Selecting a *Species* filter shows only pets of that species; filter is visually active | `Browse Pets by Species — AC 2: species filter narrows gallery and shows active state` | pending (Engineering) |
| Browse Pets by Species | 3 | When no pets available in selected *Species*, gallery shows empty state message; filter remains active | `Browse Pets by Species — AC 3: empty state for filtered species preserves filter` | pending (Engineering) |

### View Pet Profile

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Pet Profile | 1 | *Pet Profile Page* shows *Pet Photo Gallery*, name, species, breed, age, *Temperament Notes*, and *Store* | `View Pet Profile — AC 1: profile page shows all fields and photo gallery` | pending (Engineering) |
| View Pet Profile | 2 | When *Pet Status* is *Available*, profile shows "Book a Visit" action | `View Pet Profile — AC 2: Book a Visit CTA visible when pet available` | pending (Engineering) |
| View Pet Profile | 3 | When *Pet Status* is *Adopted*, profile shows *Adopted* badge and "Book a Visit" is disabled; profile remains viewable | `View Pet Profile — AC 3: adopted badge shown and booking CTA disabled when adopted` | pending (Engineering) |
| View Pet Profile | 4 | When pet has no *Temperament Notes*, field is omitted from profile | `View Pet Profile — AC 4: temperament notes omitted when empty` | pending (Engineering) |

### View Pet Store Location and Distance

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Pet Store Location and Distance | 1 | *Pet Profile Page* shows pet's *Store* with name, address, and operating hours | `View Pet Store Location and Distance — AC 1: store info shown on profile` | pending (Engineering) |
| View Pet Store Location and Distance | 2 | When *Customer Location* available, *Distance* to *Store* is displayed | `View Pet Store Location and Distance — AC 2: distance shown when customer location available` | pending (Engineering) |
| View Pet Store Location and Distance | 3 | When no *Customer Location*, no *Distance* shown and prompt to share location or enter postcode displayed | `View Pet Store Location and Distance — AC 3: no distance without location reference; prompt shown` | pending (Engineering) |
| View Pet Store Location and Distance | 4 | Selecting *Store* name on *Pet Profile Page* opens *Store Detail* page (Increment 1) | `View Pet Store Location and Distance — AC 4: store name link opens store detail page` | pending (Engineering) |

### View Available Time Slots at Store

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Available Time Slots at Store | 1 | *Appointment Calendar* shows *Available Time Slots* at pet's *Store* for next N days | `View Available Time Slots at Store — AC 1: calendar shows available slots for configured date range` | pending (Engineering) |
| View Available Time Slots at Store | 2 | Already-booked *Time Slots* do not appear in *Available Time Slots* list | `View Available Time Slots at Store — AC 2: booked slots absent from calendar` | pending (Engineering) |
| View Available Time Slots at Store | 3 | When no *Time Slots* available in date range, calendar shows empty state message | `View Available Time Slots at Store — AC 3: no slots available message shown when calendar empty` | pending (Engineering) |

### Select Date and Time Slot

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Date and Time Slot | 1 | Selecting a *Time Slot* highlights *Selected Slot* and holds it temporarily (10 min) to prevent double-booking | `Select Date and Time Slot — AC 1: slot selection highlights and holds slot for 10 minutes` | pending (Engineering) |
| Select Date and Time Slot | 2 | When temporary hold expires, *Selected Slot* released back to available and customer notified to re-select | `Select Date and Time Slot — AC 2: hold expiry releases slot and notifies customer to re-select` | pending (Engineering) |
| Select Date and Time Slot | 3 | When two customers select same slot simultaneously, only first to confirm gets booking; second sees slot-no-longer-available notice | `Select Date and Time Slot — AC 3: simultaneous selection conflict resolves to first confirm` | pending (Engineering) |

### Add Visit Note

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Add Visit Note | 1 | Optional *Visit Note* field accepts up to 500 characters; character count displayed | `Add Visit Note — AC 1: visit note field accepts up to 500 characters with count` | pending (Engineering) |
| Add Visit Note | 2 | Blank *Visit Note* proceeds without note; staff view shows no note | `Add Visit Note — AC 2: blank note omitted from booking and staff view` | pending (Engineering) |
| Add Visit Note | 3 | *Visit Note* exceeding character limit shows validation error; booking not submitted | `Add Visit Note — AC 3: validation error when note exceeds 500 characters` | pending (Engineering) |

### Confirm Appointment Booking

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Confirm Appointment Booking | 1 | Logged-in customer confirms booking; *Appointment Booking* created; *Appointment Confirmation Page* shown; *Appointment Confirmation Email* sent | `Confirm Appointment Booking — AC 1: confirmation page and email on booking success` | pending (Engineering) |
| Confirm Appointment Booking | 2 | Guest attempting to confirm blocked; prompt to log in or register with explanation; *Selected Slot* held during auth | `Confirm Appointment Booking — AC 2: guest blocked with auth gate; slot held during authentication` | pending (Engineering) |
| Confirm Appointment Booking | 3 | On booking confirmed, *Time Slot* transitions to booked and is no longer shown to other customers | `Confirm Appointment Booking — AC 3: confirmed slot transitions to booked and removed from available` | pending (Engineering) |
| Confirm Appointment Booking | 4 | Email failure does not gate the booking; booking created and email queued for retry | `Confirm Appointment Booking — AC 4: booking created on email failure; email queued for retry` | pending (Engineering) |

### View Upcoming and Past Appointments

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Upcoming and Past Appointments | 1 | *Appointment List* shows upcoming appointments (soonest first), then past; each entry shows pet, store, date/time, and visit note | `View Upcoming and Past Appointments — AC 1: appointment list sorted with upcoming first` | pending (Engineering) |
| View Upcoming and Past Appointments | 2 | Empty *Appointment List* shows empty state with prompt to browse *Pet Gallery* | `View Upcoming and Past Appointments — AC 2: empty state shown with browse prompt when no appointments` | pending (Engineering) |
| View Upcoming and Past Appointments | 3 | When appointment's pet is *Adopted*, entry shows "pet adopted" badge with Cancel and Browse other pets actions | `View Upcoming and Past Appointments — AC 3: adopted badge with cancel and rebook actions on affected entry` | pending (Engineering) |

### Cancel or Rebook Appointment After Pet Adoption

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Cancel or Rebook Appointment After Pet Adoption | 1 | *Pet Adopted Before Visit Notification* includes cancel and browse-other-pets options | `Cancel or Rebook Appointment After Pet Adoption — AC 1: notification includes cancel and browse options` | pending (Engineering) |
| Cancel or Rebook Appointment After Pet Adoption | 2 | Customer cancels appointment; *Time Slot* released; appointment moves to *Cancelled* in *Appointment List* | `Cancel or Rebook Appointment After Pet Adoption — AC 2: cancellation releases slot and marks appointment cancelled` | pending (Engineering) |
| Cancel or Rebook Appointment After Pet Adoption | 3 | Customer chooses to rebook; navigates to *Pet Gallery*; original cancelled appointment remains in past | `Cancel or Rebook Appointment After Pet Adoption — AC 3: rebook navigates to gallery; cancelled appointment preserved in past` | pending (Engineering) |
| Cancel or Rebook Appointment After Pet Adoption | 4 | Customer neither cancels nor rebooks; appointment remains; staff see "pet adopted" warning; treated as no-show after date | `Cancel or Rebook Appointment After Pet Adoption — AC 4: uncancelled adoption appointment shows warning on staff board` | pending (Engineering) |

### Update Pet Profile

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Update Pet Profile | 1 | All *Pet Profile* fields editable by *Store Employee*: name, species, breed, age, *Temperament Notes*, *Pet Photo Gallery*, store | `Update Pet Profile — AC 1: all profile fields editable in staff editor` | pending (Engineering) |
| Update Pet Profile | 2 | Saving *Pet Profile* changes reflects immediately on customer-facing *Pet Profile Page* | `Update Pet Profile — AC 2: saved changes visible immediately on customer profile page` | pending (Engineering) |
| Update Pet Profile | 3 | New photos added to *Pet Photo Gallery* additively; existing photos not replaced unless removed | `Update Pet Profile — AC 3: photo upload is additive; existing photos preserved unless removed` | pending (Engineering) |
| Update Pet Profile | 4 | Changing pet's store triggers store-change notification to customers with affected appointments | `Update Pet Profile — AC 4: store transfer triggers notification to customers with existing appointments` | pending (Engineering) |

### Mark Pet as Adopted

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Mark Pet as Adopted | 1 | *Store Employee* marks pet as *Adopted*; *Pet Status* transitions to *Adopted*; "Book a Visit" disabled on *Pet Profile Page* | `Mark Pet as Adopted — AC 1: pet status transitions to adopted and booking CTA disabled` | pending (Engineering) |
| Mark Pet as Adopted | 2 | When pet has pending *Appointments*, system triggers *Pet Adopted Before Visit Notification* for each affected customer | `Mark Pet as Adopted — AC 2: pending appointments trigger adopted-before-visit notification to customers` | pending (Engineering) |
| Mark Pet as Adopted | 3 | Re-marking already-adopted pet shows "pet is already adopted" message; no status change | `Mark Pet as Adopted — AC 3: idempotent — already adopted pet shows notice with no change` | pending (Engineering) |

### View Incoming Appointments

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Incoming Appointments | 1 | Staff *Incoming Appointments* shows all booked appointments at store, sorted by date/time; each entry shows customer, pet, date/time, visit note | `View Incoming Appointments — AC 1: staff board shows all appointments sorted by date` | pending (Engineering) |
| View Incoming Appointments | 2 | When appointment's pet is *Adopted*, entry shows "pet adopted" warning badge and notification status | `View Incoming Appointments — AC 2: adopted pet badge and notification status on staff board entry` | pending (Engineering) |
| View Incoming Appointments | 3 | No upcoming appointments shows empty state | `View Incoming Appointments — AC 3: empty state shown when no appointments` | pending (Engineering) |

### Send Appointment Reminder

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Appointment Reminder | 1 | System sends *Appointment Reminder* email 24 hours before appointment with pet name, store address, date/time, visit note | `Send Appointment Reminder — AC 1: reminder email sent 24h before with correct fields` | pending (Engineering) |
| Send Appointment Reminder | 2 | *Appointment Reminder* suppressed for cancelled appointments | `Send Appointment Reminder — AC 2: reminder suppressed for cancelled appointment` | pending (Engineering) |
| Send Appointment Reminder | 3 | *Appointment Reminder* suppressed when pet is *Adopted*; *Pet Adopted Before Visit Notification* takes precedence | `Send Appointment Reminder — AC 3: reminder suppressed when pet adopted; adopted notification takes precedence` | pending (Engineering) |
| Send Appointment Reminder | 4 | Email delivery failure queues reminder for retry within reasonable window before appointment | `Send Appointment Reminder — AC 4: delivery failure queues reminder for retry` | pending (Engineering) |

### Send Pet Adopted Before Visit Notification

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Pet Adopted Before Visit Notification | 1 | When pet marked *Adopted* with pending *Appointments*, *Pet Adopted Before Visit Notification* sent to each affected customer with cancel and browse-other-pets options | `Send Pet Adopted Before Visit Notification — AC 1: notification sent to affected customers on adoption with cancel and browse options` | pending (Engineering) |
| Send Pet Adopted Before Visit Notification | 2 | Notification recorded against appointment; notification status visible on staff *Incoming Appointments* view | `Send Pet Adopted Before Visit Notification — AC 2: notification status visible on staff board` | pending (Engineering) |
| Send Pet Adopted Before Visit Notification | 3 | When pet adopted but no pending appointments, no notification sent | `Send Pet Adopted Before Visit Notification — AC 3: no notification when no pending appointments` | pending (Engineering) |
| Send Pet Adopted Before Visit Notification | 4 | Email delivery failure queues notification; "pet adopted" badge shown regardless of email failure | `Send Pet Adopted Before Visit Notification — AC 4: delivery failure queues notification; badge shown regardless` | pending (Engineering) |

### Check In Customer

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Check In Customer | 1 | *Store Employee* checks in appointment; system records *Checked-In Time* and staff member; status transitions to *Checked In* | `Check In Customer — AC 1: check-in records time and staff member; status transitions` | pending (Engineering) |
| Check In Customer | 2 | Early or late customer check-in allowed; *Checked-In Time* records actual arrival | `Check In Customer — AC 2: check-in records actual arrival regardless of slot start time` | pending (Engineering) |
| Check In Customer | 3 | Attempting to check in already checked-in appointment shows "already checked in" with original time; no duplicate recorded | `Check In Customer — AC 3: duplicate check-in shows original time; no duplicate recorded` | pending (Engineering) |
| Check In Customer | 4 | Attempting to check in cancelled appointment blocked with "this appointment was cancelled" message | `Check In Customer — AC 4: check-in blocked for cancelled appointment` | pending (Engineering) |

### Record Visit Outcome

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Record Visit Outcome | 1 | *Store Employee* selects outcome from four options: *Adopted* · *Interested — Returning* · *Not a Fit* · *Browsing Only*; *Staff Visit Notes* field available | `Record Visit Outcome — AC 1: outcome selector shows four options with staff notes field` | pending (Engineering) |
| Record Visit Outcome | 2 | Selecting *Adopted* marks appointment completed with *Adopted* outcome; pet status transitions to *Adopted* triggering same notifications | `Record Visit Outcome — AC 2: adopted outcome transitions pet status and triggers notifications` | pending (Engineering) |
| Record Visit Outcome | 3 | Selecting *Interested — Returning* prompts *Set Follow-Up Action* step | `Record Visit Outcome — AC 3: interested-returning outcome prompts follow-up action flow` | pending (Engineering) |
| Record Visit Outcome | 4 | Recording outcome on appointment with existing outcome shows existing data with override option | `Record Visit Outcome — AC 4: existing outcome shown with override option for correction authority` | pending (Engineering) |
| Record Visit Outcome | 5 | Outcome submitted without *Staff Visit Notes* accepted; notes optional | `Record Visit Outcome — AC 5: outcome accepted without staff notes` | pending (Engineering) |

### Record No-Show

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Record No-Show | 1 | After *Time Slot* passes without customer check-in, appointment shows "no check-in" indicator with Mark No-Show action | `Record No-Show — AC 1: past-due unchecked-in appointments show no-show indicator and action` | pending (Engineering) |
| Record No-Show | 2 | *Store Employee* marks appointment *No-Show*; system records staff member and timestamp; status transitions to *No-Show* | `Record No-Show — AC 2: no-show records staff member and timestamp; status transitions` | pending (Engineering) |
| Record No-Show | 3 | No-show triggers follow-up notification to customer offering to rebook | `Record No-Show — AC 3: no-show triggers follow-up notification to customer` | pending (Engineering) |
| Record No-Show | 4 | Attempting no-show on checked-in appointment blocked with "customer was already checked in" message | `Record No-Show — AC 4: no-show blocked for checked-in appointment` | pending (Engineering) |

### Set Follow-Up Action

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Set Follow-Up Action | 1 | *Store Employee* sets *Follow-Up Action* type and *Follow-Up Date*; system records and makes visible on appointment detail | `Set Follow-Up Action — AC 1: follow-up action and date saved and visible on appointment` | pending (Engineering) |
| Set Follow-Up Action | 2 | *Hold Pet* follow-up: pet status remains *Available* with hold note; *Follow-Up Date* shows hold expiry | `Set Follow-Up Action — AC 2: hold pet preserves available status with hold note and expiry date` | pending (Engineering) |
| Set Follow-Up Action | 3 | *Schedule Return Visit* follow-up shows booking link to staff for same pet | `Set Follow-Up Action — AC 3: schedule return visit shows staff-assisted booking link` | pending (Engineering) |
| Set Follow-Up Action | 4 | On *Follow-Up Date*, system triggers *Visit Follow-Up Notification* to customer | `Set Follow-Up Action — AC 4: follow-up notification triggered on follow-up date` | pending (Engineering) |

### Send Visit Follow-Up Notification

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Visit Follow-Up Notification | 1 | System sends *Visit Follow-Up Notification* on *Follow-Up Date* with pet name, store, and follow-up context | `Send Visit Follow-Up Notification — AC 1: notification sent on follow-up date with correct fields` | pending (Engineering) |
| Send Visit Follow-Up Notification | 2 | When *Follow-Up Action* is *None*, no follow-up notification sent | `Send Visit Follow-Up Notification — AC 2: no notification when follow-up action is none` | pending (Engineering) |
| Send Visit Follow-Up Notification | 3 | When pet adopted before *Follow-Up Date*, follow-up notification suppressed; *Pet Adopted Before Visit Notification* takes precedence | `Send Visit Follow-Up Notification — AC 3: follow-up suppressed when pet adopted; adopted notification takes precedence` | pending (Engineering) |
| Send Visit Follow-Up Notification | 4 | Email delivery failure queues follow-up notification for retry | `Send Visit Follow-Up Notification — AC 4: delivery failure queues follow-up notification` | pending (Engineering) |

---

## Accessibility implementation

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | `aria-label` on species filter listbox, appointment calendar listbox, all form fields (visit note, outcome selector, follow-up action, all pet profile editor fields); `<label for>` on textarea and date picker; photo upload input labelled; `aria-labelledby` on auth gate dialog |
| Focus order matches reading order | planned | Pet gallery: nav → filter sidebar → gallery grid → empty state. Booking flow: nav → breadcrumb → context → calendar → hold notice → continue. Staff board: nav → tabs → appointment list rows (actions last per row). Modal: heading → body content → primary action → secondary action |
| Focus is visible | planned | Increment 1–5 focus styles retained; listbox selected item uses border + `aria-selected`; modal traps focus while open |
| Errors programmatically associated | planned | `role="alert"` on visit note validation error, slot released notice, already-checked-in notice, cancelled appointment block, already-adopted notice; `aria-describedby` on visit note textarea → character count + validation error |
| State cues not colour-only | planned | *Available* / *Adopted* badges use text label (not colour alone); "no check-in" indicator uses text; slot hold / released notices use text; notification status on staff board uses text ("notified" / "not yet notified") |
| Keyboard reachable | planned | All gallery filter, pet card, booking step navigation, slot calendar selection, outcome selector, follow-up action, staff row actions keyboard-reachable without mouse |
| Modal focus trap | planned | Guest auth gate: focus trapped inside dialog; background inert; Escape closes modal and returns focus to trigger element |
| Axe (or host equivalent) passes | planned | Run on all new screens in Engineering ATDD pass |

---

## Performance constraints

| Constraint | Budget | Notes |
| --- | --- | --- |
| Screen bundle size | No explicit cap | Increment 5 baseline preserved; pet and appointment modules added as separate route chunks |
| Staff routes | Lazy-load on navigation | `/staff/*` routes lazy-loaded — not on critical customer path |
| Pet gallery image loading | Lazy-load per card | Pet card photos `loading="lazy"`; main photo on profile eager-loaded (above fold) |
| Appointment calendar | Non-blocking slot fetch | Available slots fetched async on page load; calendar renders skeleton until data ready |
| Slot hold (server) | 10-minute server-side hold | Client shows static hold notice; no polling required unless hold expiry feedback needed |
| Email retry (system) | Non-blocking | Email send is async; confirmation page shown immediately; retry queue in background |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | No heavy animation in booking flow or staff board; status badge transitions use CSS classes only |

---

## Scope guard (implementation)

| Excluded | Rationale |
| --- | --- |
| Returns / refunds UI | Deferred to Increment 7 |
| Product / checkout / payment UI | Increments 1–5 — preserved, not reproduced |
| Online adoption paperwork form | Physical process — staff handles offline (noted via *Follow-Up Action*: *Send Adoption Paperwork*) |
| Admin notification settings | Back-office scope; notification content configurable but not a customer screen |
| Pet availability calendar per store | Out of scope for Increment 6 |
| Pet breeding or lineage management | Out of scope |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout paths (Increments 2–3) | Guest shopping unchanged; appointment booking adds account gate separately |
| Account nav chrome (Increment 4) | *Appointments* tab added alongside Profile · Orders · Wishlist · Saved Payments |
| Store Detail page (Increment 1) | Reused from pet profile's store link |
| Distance / location entry (Increment 1) | Reused on pet profile to show *Distance* to pet's *Store* |
| Multi-vendor payment flow (Increment 5) | Unchanged — appointment booking is a separate domain |

---

## Affordance trace (Increment 6)

See lo-fi § Affordance trace — all affordances mapped to AC story and clause. Spec implementation targets and AC → behaviour → test mapping above cover each row.

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-26 | initial | Specification slot 159 — Increment 6 interface spec from lo-fi; 13 screens; 19 stories; 65 AC clauses mapped; pet gallery, profile states, booking flow, customer account appointments, staff board + actions, pet profile editor, notification preview; all pending Engineering |

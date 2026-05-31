---  
state: crc  
increment_scope: Increment 7 — Returns and refunds
specification_refresh: Run 8 slot 179
---  

# Module: [PawPlace]  

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.  

**Increment scope (Specification Run 8):** Increment 7 — Returns and refunds. **Refreshed CRC** for *Order* (*Return* promoted to full lifecycle with *Return Request*, *Return Eligibility*, *Return Window*, *Return Reason*, *Returned Items*, *Return Status*, *Return Label*, *Return QR Code*, *In-Store Return*, *Manager Override*; *Restocking* introduced; *Order* entry-point responsibility activated), *Payment* (*Refund* refreshed with full routing lifecycle — *Refund Status*, *Refund Retry* introduced; *Payment* and *Payment Vendor* refund responsibilities activated), *Notification* (*Return Received Notification*, *Refund Completed Notification*, *Refund Under Review Notification* introduced; *Notification* triggering event updated for Increment 7 paths), and Boundary *Admin Dashboard* (*in-store return lookup* and *manager override surface* added). Supporting KAs retained unchanged from Increment 6: *Product Catalog*, *Pet*, *Appointment*, *Store*, *Customer Account*.  

**Core terms**:  
- product catalog  
- product  
- product image  
- category  
- customer review  
- stock availability  
- pet  
- species  
- breed  
- pet photo  
- temperament assessment  
- health record  
- pet lifecycle event  
- pet source  
- pet lineage  
- appointment  
- time slot  
- availability slot  
- appointment cancellation  
- appointment rebooking  
- staff appointments view  
- store  
- store locator  
- click-and-collect  
- pickup fulfillment  
- ship-to-home fulfillment  
- customer account  
- guest checkout  
- pet profile  
- wishlist  
- communication preferences  
- saved address  
- shopping cart  
- cart item  
- order  
- order line item  
- billing address  
- shipping address  
- delivery option  
- standard delivery  
- tracking number  
- return  
- return request  
- return eligibility  
- return window  
- return reason  
- returned items  
- return status  
- return label  
- return QR code  
- in-store return  
- manager override  
- restocking  
- payment  
- payment vendor  
- saved payment method  
- refund  
- refund status  
- refund retry  
- notification  
- confirmation email  
- shipping notification  
- appointment reminder  
- pet adopted notification  
- visit follow-up notification  
- return received notification  
- refund completed notification  
- refund under review notification  
- notification preferences  
- restock alert  

**Key Abstractions (term grouping)**:  
- **Product Catalog**: product catalog, product, product image, category, customer review, stock availability  
- **Pet**: pet, species, breed, pet gallery, pet card, pet photo, temperament assessment, health record, pet lifecycle event, pet source, pet lineage, pet profile  
- **Appointment**: appointment, time slot, availability slot, appointment request, appointment cancellation, appointment rebooking, visit outcome, follow-up action, staff appointment workflow  
- **Store**: store, store locator, click-and-collect, pickup fulfillment, ship-to-home fulfillment  
- **Customer Account**: customer account, guest checkout, wishlist, communication preferences, saved address  
- **Order**: order, order line item, shopping cart, cart item, billing address, shipping address, delivery option, standard delivery, tracking number, return, return request, return eligibility, return window, return reason, returned items, return status, return label, return QR code, in-store return, manager override, restocking  
- **Payment**: payment, payment vendor, saved payment method, refund, refund status, refund retry  
- **Notification**: notification, confirmation email, shipping notification, appointment reminder, pet adopted notification, visit follow-up notification, return received notification, refund completed notification, refund under review notification, notification preferences, restock alert  

---  

# Core Domain  

## **Product Catalog**  

The browsable, searchable collection of pet supplies. Single source of truth for product identity, pricing, stock truth, and review ownership.  

### **Product Catalog**  
browsable product collection        | Product  
filter and search results           | Product, Category  
                                    |   invariant: no other abstraction may duplicate product identity, stock truth, or review ownership  
review and rating system            | Customer Review, Product  

### **Product**  
product name                        |  
SKU                                 |  
                                    |   invariant: must be unique across the entire catalog  
price                               |  
                                    |   invariant: must be positive; historical orders retain the price at time of purchase, not the current price  
brand                               |  
images                              | Product Image  
description                        |  
weight                              |  
length                              |  
width                               |  
height                              |  
categories                          | Category  
                                    |   invariant: must always belong to at least one category  
stock availability                  | Stock Availability  
                                    |   invariant: must always expose current stock availability  
accumulated customer reviews        | Customer Review  
aggregate star rating               |  
                                    |   invariant: recomputed when a review is created, edited, or deleted  
review count                        |  

### **Product Image**  
image file                          |  
alt text                            |  
display order                       |  
uploaded date                       |  

### **Category**  
category name                       |  
parent category                     | Category  
                                    |   invariant: top-level categories have no parent; nesting depth is finite  
display order                       |  
active status                       |  
accept product into multiple categories | Product  

### **Customer Review**  
authoring customer account          | Customer Account  
                                    |   invariant: must be authored by exactly one customer account; guest checkout sessions cannot leave reviews  
review date                         |  
star rating                         |  
review title                        |  
written text                        |  
photo attachment                    |  
attached product                    | Product  
                                    |   invariant: must be attached to exactly one product  
contribute to aggregate rating      | Product  

### **Stock Availability**  
product                             | Product  
                                    |   invariant: one stock availability record per product per stocking location (store)  
stocking store                      | Store  
stock level                         |  
                                    |   invariant: numeric quantity held at the stocking store; edited by store employee via admin dashboard  
quantity on hand                    |  
reserved quantity                   |  
available-to-sell quantity          |  
                                    |   invariant: available-to-sell must never go negative; if it reaches zero, purchasability is false  
per-store walk-in availability display | Store  
                                    |   invariant: must reflect current stock level immediately after store employee update  
reorder point                       |  
reorder quantity                    |  
low stock threshold                 |  
last restocked date                 |  
expected restock date               |  
backorder enabled                   |  
gate order flow                     | Order  
                                    |   invariant: prevents checkout of items with zero available-to-sell unless backorder is enabled  
reserve quantity on order confirm   | Order, Stock Availability  
                                    |   invariant: reserved quantity increases at *pickup store* when *order* confirms; released if *payment* fails  
trigger restock alert               | Restock Alert, Notification  
                                    |   invariant: must be current — stale availability that misleads a walk-in customer is a domain failure  
refresh from store employee edit    | Admin Dashboard  

### references  

**Ref — Product catalog and browsing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: lines 3–5  
Extract: whole  

```source  
So the basic idea is we're building an online pet store — think of it as the go-to place for pet owners and people looking to become pet owners. The core of the site is a shopping experience for pet supplies: food, toys, beds, leashes, grooming products, aquarium gear, the whole lot. People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.  

The product catalog needs to be rich. Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews. We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.  
```  

### decisions made  

- Customer review authorship modeled as a responsibility on Customer Review with Customer Account as collaborator — two-sided relationship with Customer Account aggregating authored reviews.  
- Aggregate star rating is a derived property on Product, not its own class — recomputed on review lifecycle events.  
- Photo review is an optional attribute of Customer Review, not a subtype — no distinct behavior in the source.  
- Stock Availability extracted as its own class with full inventory data — quantity on hand, reserved, available-to-sell, reorder point, low stock threshold, restock dates, backorder status.  
- **Introduced Product Image** as a first-class concept — same pattern as Pet Photo. Each image has its own file, alt text, and display order. Product references a collection of Product Image.  
- **Decomposed dimensions** into length, width, height as separate properties — the parenthetical `(length, width, height with unit)` was hiding three distinct data fields.  
- Category needs hierarchy (parent category) for navigation — pet stores organize products in trees.  
- Product carries price as a domain property — price is snapshotted to Order Line Item at purchase time so historical orders survive price changes.  
- **No parenthetical values on the right side.** Properties that hold simple data (name, SKU, price, dates, counts) have an empty collaborator column — the property name is the data. Properties that reference another concept list the concept as a collaborator.  
- **Increment 2 refresh (slot 51):** *reserve quantity on order confirm* at *pickup store* when *order* confirms; checkout gating active for *add to cart* and cart validation.  

---  

## **Pet**  

Everything pet — store animals showcased online for adoption visits, and customer-owned pet profiles that drive personalised recommendations and reorder reminders. Store pets carry sourcing provenance, health records, temperament assessments, breed data, photos, lineage, and a full auditable lifecycle. The *species* grouping is the primary browsing dimension; *breed* provides fine-grained filtering within a species. Customer pet profiles capture species, breed, age, and dietary needs. The central rule distinguishing pet browsing from product shopping: pets are never purchasable online.  

### **Pet**  
species                            | Species  
                                   |   invariant: must always be associated with exactly one species  
breed                              | Breed  
date of birth                      |  
hosting store                      | Store  
                                   |   invariant: must always be associated with exactly one store  
pet source                         | Pet Source  
lineage                            | Pet Lineage  
photos                             | Pet Photo  
temperament assessments            | Temperament Assessment  
health records                     | Health Record  
lifecycle events                   | Pet Lifecycle Event  
pet status                         | (available or adopted)  
                                   |   invariant: must always have a status; progresses from available to adopted; cannot revert from adopted  
appear in pet gallery               | Pet Gallery  
                                   |   invariant: all pets appear in the gallery regardless of status; adopted pets render with an adopted badge  
appointment booking call-to-action | Appointment  
                                   |   invariant: shown only when pet status is available; hidden or disabled when adopted  
                                   |   invariant: must never expose a purchase path  
trigger pet-adopted notification    | Notification, Appointment  
                                   |   invariant: triggered when status transitions to adopted and pending appointments exist for this pet  

### **Breed**  
breed name                         |  
species                            | Species  
size                               |  
coat type                          |  
typical temperament range          |  
exercise needs                     |  

### **Species**  
species name                       |  
                                   |   invariant: one of a fixed set — dogs, cats, birds, fish, small mammals, reptiles  
group pets in gallery              | Pet Gallery, Pet  
                                   |   invariant: every pet must be associated with exactly one species  

### **Pet Gallery**  
browsable pet collection           | Pet  
filter by species                  | Species, Pet  
                                   |   invariant: when a species filter is active, only pets of that species are shown  
show empty state when no pets      | Species  
                                   |   invariant: empty state shown when no pets of the selected species exist; filter remains active  
present pet card per pet           | Pet Card, Pet  

### **Pet Card**  
pet photo                          | Pet Photo  
pet name                           |  
pet breed                          | Breed  
pet species                        | Species  
hosting store                      | Store  
link to pet profile page           | Pet  
                                   |   invariant: each card navigates to the Pet Profile Page for that pet  

### **Pet Photo**  
image file                         |  
caption                            |  
uploaded by                        | Store  
upload date                        |  

### **Temperament Assessment**  
behavioral observation             |  
assessed by                        | Store  
assessment date                    |  

### **Health Record**  
record type                        |  
condition or event description     |  
recorded date                      |  
recorded by                        | Store  
shareable status                   |  
                                   |   invariant: health history shared online must only include entries marked as shareable  

### **Pet Lifecycle Event**  
lifecycle state                    |  
transitioned on                    |  
transitioned by                    | Store  
transition context                 |  
                                   |   invariant: each event is immutable once recorded  
                                   |   invariant: transitions follow allowed state paths — no skipping quarantine after intake if health check is pending  

### **Pet Source**  
supplier type                      |  
supplier name                      |  
supplier location                  |  
supplier phone                     |  
supplier email                     |  
intake date                        |  
provenance documentation           |  
                                   |   invariant: every pet must trace to exactly one source  

### **Pet Lineage**  
sire                               | Pet  
dam                                | Pet  
pedigree documentation             |  
generation depth                   |  

### **Pet Profile**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account  
pet name                            |  
pet species                         |  
pet breed                           |  
date of birth or approximate age    |  
known allergies                     |  
preferred food type                 |  
special dietary requirements        |  
enable personalised recommendations | Notification, Product  
enable smart reorder timing         | Order, Notification  

### references  

**Ref — Pets and in-store visits**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 7  
Extract: whole  

```source  
Now here's the important bit about the pets themselves: **you cannot buy a pet online**. That's not how this works. What we're offering is the ability to browse available animals — dogs, cats, birds, fish, small mammals, reptiles — and then **register an appointment** to come visit them in store. The idea is that buying a living creature should involve meeting it, seeing how it behaves, making sure it's the right fit. So the online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing. And then there's a big clear call-to-action to book a visit.  
```  

**Ref — Admin pet management**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentence about store staff managing pet profiles.  

```source  
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.  
```  

**Ref — Customer pet profiles**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: partial  
Part: Sentences about customer pet profiles and reorder reminders.  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

### decisions made  

- Decomposed "browsable profile" parenthetical into first-class classes — photos, breed, temperament assessments, health records each carry their own data and lifecycle.  
- **Decomposed breed characteristics** — `(size, coat type, typical temperament range, exercise needs)` was hiding four separate properties on Breed.  
- **Decomposed supplier contact** — `(name, location, phone, email)` was hiding four separate properties on Pet Source.  
- Introduced Pet Lifecycle Event as a state-carrier — each transition records when, who, and why.  
- Expanded lifecycle states beyond available/adopted to include intake, quarantine, available, reserved, adopted, transferred, returned.  
- Introduced Pet Source for provenance — breeders, rescues, shelters, private surrenders.  
- Introduced Pet Lineage for pedigree — sire, dam, documentation.  
- Age is derived from date of birth, not stored directly.  
- Pet adoption triggers notification to customers with pending appointments via Pet Lifecycle Event.  
- **Pet Profile moved to Pet KA.** Pet Profile is data about a pet — species, breed, dietary needs, allergies. It belongs in the Pet KA even though it is owned by a Customer Account. Customer Account references Pet Profile as a collaborator.  
- **Increment 6 refresh (slot 153):** *Pet* gains `species | Species` as a direct responsibility — every pet must belong to exactly one species; species is on Pet directly (not only via Breed) because the gallery is organised by species facet and Pet carries the browsing identity independently of Breed. *Pet* gains `pet status` (available or adopted) as an explicit responsibility — status gates the booking CTA and drives the gallery badge. *Pet* triggers `pet-adopted notification` when status transitions to adopted with pending appointments. *Species* introduced as a first-class grouping concept anchoring the gallery filter — previously implied as a property on Breed. *Pet Gallery* introduced as the browsable collection with species-filter and empty-state responsibilities. *Pet Card* introduced as the gallery summary surface (photo, name, breed, species, store, profile link).  

---  

## **Appointment**  

A scheduled visit binding a customer account, a pet, and a store. The bridge between online pet browsing and in-store interaction.  

### **Appointment**  
booking customer account            | Customer Account  
                                    |   invariant: must be booked by exactly one customer account; guest checkout cannot book  
visited pet                         | Pet  
                                    |   invariant: must reference exactly one pet  
hosting store                       | Store  
                                    |   invariant: must reference exactly one store  
scheduled date and time slot        | Time Slot  
                                    |   invariant: must always have a confirmed and booked time slot  
visit note                          |  
booking date                        |  
appointment status                  | (booked, confirmed, checked-in, completed, cancelled, no-show)  
                                    |   invariant: booked → confirmed → checked-in → completed; booked or confirmed → cancelled; confirmed → no-show  
                                    |   invariant: cancelled and no-show appointments cannot advance further  
cancellation reason                 |  
checked-in time                     |  
checked-in by                       | Store  
                                    |   invariant: blocked if appointment is already checked-in or cancelled  
visit outcome                       | Visit Outcome  
                                    |   invariant: can only be recorded after appointment is in checked-in status  
staff visit notes                   |  
follow-up action                    | Follow-Up Action  
follow-up date                      |  
no-show recorded by                 | Store  
no-show recorded at                 |  
                                    |   invariant: cannot mark no-show on an already checked-in appointment  
cancel appointment                  | Appointment Cancellation  
                                    |   invariant: cancellation releases the booked time slot and records in appointment history  
rebook after cancellation           | Appointment Rebooking  
                                    |   invariant: rebooking must reference a new pet and a new time slot; cancelled slot must not be reused  
trigger confirmation notification   | Appointment Confirmation Email, Notification  
trigger reminder notification       | Appointment Reminder, Notification  
                                    |   invariant: reminder suppressed when appointment is cancelled, no-show, or pet is adopted before trigger time  
trigger pet-adopted notification    | Pet Adopted Before Visit Notification, Notification  
                                    |   invariant: triggered when associated pet transitions to adopted status  
trigger follow-up notification      | Visit Follow-Up Notification, Notification  
                                    |   invariant: triggered on follow-up date when follow-up action is not None  
record in appointment history       | Customer Account  
appear on staff incoming bookings   | Staff Appointment Workflow  

### **Time Slot**  
start time                          |  
end time                            |  
duration                            |  
available date-and-time window      | Store  
                                    |   invariant: scoped to a specific store's operating hours  
slot booking status                 | (available, held, booked, blocked)  
                                    |   invariant: available → held when customer selects slot in booking flow; held → booked on appointment confirmation; held → available on hold expiry or cancellation; booked → available on appointment cancellation  
hold for appointment request        | Appointment Request  
                                    |   invariant: slot transitions to held when customer selects it; held slot is not visible to other customers in the available set  
release on hold expiry              | Appointment Request  
                                    |   invariant: slot returns to available if the appointment request is not confirmed within the hold duration  
consume on booking confirmation     | Appointment  
                                    |   invariant: once booked, no longer available to other customers  
release on appointment cancellation | Appointment Cancellation  
                                    |   invariant: slot returns to available when the cancellation is recorded before the visit date  
present filtered by store and date  | Store  

### **Appointment Request**  
requesting customer account         | Customer Account  
                                    |   invariant: must be submitted by a verified customer account; guest sessions cannot initiate a booking request  
requested pet                       | Pet  
                                    |   invariant: must reference exactly one pet with status available  
selected time slot                  | Time Slot  
                                    |   invariant: slot transitions to held status on selection; held slot not shown to other customers  
slot hold duration                  | (minutes, configurable; e.g. 10)  
                                    |   invariant: hold expires if booking is not confirmed within hold duration  
optional visit note                 |  
                                    |   invariant: maximum 500 characters  
confirm to create appointment       | Appointment, Time Slot  
                                    |   invariant: confirmation transitions time slot from held to booked and creates a confirmed appointment  
release slot on hold expiry         | Time Slot  
                                    |   invariant: expired hold returns slot to available; customer must re-select  
block on unauthenticated request    | Customer Account  
                                    |   invariant: booking step blocked for guest sessions; slot hold maintained briefly while customer logs in or registers  

### **Appointment Cancellation**  
cancelled appointment               | Appointment  
                                    |   invariant: must reference the appointment being withdrawn  
cancellation date                   |  
cancellation reason                 |  
release booked time slot            | Time Slot, Appointment  
                                    |   invariant: releases the time slot back to available so another customer may book it  
record in appointment history       | Customer Account  
                                    |   invariant: cancellation recorded in the customer account's appointment history  
trigger rebooking offer             | Appointment Rebooking  
                                    |   invariant: offer surfaced when customer cancels after receiving pet-adopted notification  

### **Appointment Rebooking**  
cancelled appointment reference     | Appointment Cancellation  
                                    |   invariant: must link to the prior appointment cancellation for history and context  
new pet selected                    | Pet  
                                    |   invariant: must reference a newly selected pet  
new time slot selected              | Time Slot  
                                    |   invariant: must not reuse the time slot released by the prior appointment cancellation  
new store                           | Store  
follow same booking flow            | Appointment  
                                    |   invariant: follows the same booking confirmation flow as a new appointment  
record in appointment history       | Customer Account  
                                    |   invariant: rebooking recorded in appointment history with link to the cancelled appointment  

### **Visit Outcome**  
outcome category                    | (adopted, interested-returning, not-a-fit, browsing-only)  
                                    |   invariant: one of four categories must be selected; outcome cannot be recorded before appointment is checked-in  
optional staff visit notes          |  
record on checked-in appointment    | Appointment  
                                    |   invariant: outcome recorded against the appointment; each appointment has at most one recorded outcome  
trigger follow-up prompt            | Appointment, Staff Appointment Workflow  
                                    |   invariant: interested-returning outcome prompts staff to set a follow-up action  
trigger pet adoption transition     | Pet, Appointment, Notification  
                                    |   invariant: adopted outcome triggers the same pet status transition and notifications as the Mark Pet as Adopted path  

### **Follow-Up Action**  
action type                         | (none, schedule-return-visit, hold-pet, send-adoption-paperwork)  
follow-up date                      |  
                                    |   invariant: follow-up date required when action type is not none  
holding appointment                 | Appointment  
trigger follow-up notification      | Visit Follow-Up Notification, Notification, Appointment  
                                    |   invariant: notification fires on follow-up date when action type is not none; suppressed if pet adopted before follow-up date  

### **Staff Appointment Workflow**  
incoming appointments view          | Appointment, Store  
                                    |   invariant: lists confirmed and checked-in appointments for the staff member's store, sorted soonest first  
show pet-adopted warning badge      | Appointment, Pet  
                                    |   invariant: appointments with adopted pets show a warning badge  
show notification status            | Appointment, Pet Adopted Before Visit Notification  
                                    |   invariant: notified or not-yet-notified status visible per appointment entry  
check in customer                   | Appointment, Store  
                                    |   invariant: records checked-in time and staff member; blocked if appointment is already checked-in or cancelled  
record no-show                      | Appointment, Store  
                                    |   invariant: blocked if appointment is already checked-in; records staff member and timestamp; triggers follow-up notification to customer  
set follow-up action                | Appointment, Follow-Up Action  
                                    |   invariant: follow-up action and date recorded after outcome or no-show; triggers visit follow-up notification on follow-up date  
surface on admin dashboard          | Admin Dashboard  

### references  

**Ref — Appointment booking system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: whole  

```source  
The appointment system needs to be tied to a specific store location. We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children." They get a confirmation email, a reminder the day before, and the store staff should see it on their end too.  
```  

**Ref — Increment 6 stories and acceptance criteria**  
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md  
Locator: stories — Select Date and Time Slot, Confirm Appointment Booking, Check In Customer, Record Visit Outcome, Record No-Show, Set Follow-Up Action  
Extract: partial  

```source  
Select Date and Time Slot AC 1: slot is highlighted and held temporarily (e.g. 10 minutes) to prevent double-booking during the booking flow.
Confirm Appointment Booking AC 2: guest blocked; slot hold maintained while customer logs in or registers.
Record Visit Outcome AC 2: adopted outcome transitions pet to Adopted status and triggers same notifications as Mark Pet as Adopted.
Record No-Show AC 3: no-show triggers a follow-up notification to the customer offering to rebook.
Set Follow-Up Action AC 4: follow-up date arrival triggers a Visit Follow-Up Notification to the customer.
```  

### decisions made  

- Time slot carries real temporal data — start time, end time, duration.  
- Appointment has its own lifecycle: booked → confirmed → completed / cancelled / no-show. Cancellation requires a reason.  
- Booking date records when the appointment was created (distinct from the scheduled visit date).  
- Time slot has a booking status (available, booked, blocked) — "blocked" covers staff-reserved or maintenance windows.  
- Visit tracking: checked-in time, checked-in by, visit outcome (adopted, interested-returning, not-a-fit, browsing-only), staff visit notes, follow-up action (none, schedule-return-visit, hold-pet, send-adoption-paperwork), follow-up date.  
- No-show tracking: no-show recorded by, no-show recorded at — provides audit trail and triggers follow-up notifications.  
- Follow-up notification trigger: when staff record a follow-up action, the appointment triggers a follow-up notification to the customer on the follow-up date.  
- **Increment 6 refresh (slot 153):** *Time Slot* gains a four-value booking status (available, held, booked, blocked) and a temporary hold mechanism — slots transition to *held* when a customer selects them in the booking flow and return to *available* on expiry. *Appointment Request* introduced as a first-class concept carrying the in-progress booking state (selected slot, hold duration, optional visit note, guest-block rule) so the hold-and-confirm flow has an explicit owner. *Appointment Cancellation* introduced as a first-class concept — carries cancellation date, reason, time slot release, history recording, and rebooking trigger; passes the active-verb test. *Appointment Rebooking* introduced as a first-class concept — links back to the cancelled appointment, requires a new pet and time slot (must not reuse the released slot), follows the standard booking flow. *Availability slot* resolved as alias for *Time Slot* — no separate CRC class. *Visit Outcome* promoted from bare property to a class — structured category (adopted, interested-returning, not-a-fit, browsing-only) with follow-up prompt trigger and adoption-path trigger. *Follow-Up Action* promoted from property to a class — action type and date, owns the follow-up notification trigger. *Staff Appointment Workflow* introduced as the staff-side coordination surface (incoming view, check-in, no-show, follow-up, admin dashboard surface) — maps to the UL concept *staff appointments view* expanded to include workflow operations.  

---  

## **Store**  

A physical retail location anchoring the offline dimension — where pets live, appointments happen, click-and-collect is fulfilled, and in-store returns are processed.  

### **Store**  
store name                          |  
store code                          |  
address line one                    |  
address line two                    |  
city                                |  
county or region                    |  
postcode                            |  
country                             |  
                                    |   invariant: must always have a valid street address  
latitude                            |  
longitude                           |  
                                    |   invariant: must always have valid coordinates  
opening time per day                |  
closing time per day                |  
holiday overrides                   |  
                                    |   invariant: must always have operating hours  
phone number                        |  
email address                       |  
active status                       |  
product specialisation              | Category  
hosted pets                         | Pet  
time slots for booking              | Time Slot  
fulfill click-and-collect orders    | Click-and-Collect, Order  
preferred store tailoring           | Customer Account  

### **Store Locator**  
map view                            | Store  
list view                           | Store  
show all stores without search      | Store  
                                    |   invariant: Increment 1 — no specialization filter or account-gated features  
display store address on selection  | Store  
display operating hours on selection | Store  
display contact details on selection | Store  
position store on map at geo-coordinates | Store  
filter stores by availability       | Store  
filter stores by specialisation     | Store, Category  
filter stores by distance           | Store  
shared location input               |  
postcode input                      |  
calculate distance from customer    | Store  
sort nearest-first                  | Store  
                                    |   invariant: when location input present, smallest distance ranks first  

### **Click-and-Collect**  
originating order                   | Order  
                                    |   invariant: must reference a specific order  
selected pickup store               | Store  
                                    |   invariant: must reference a specific store for pickup; no shipping address required  
pickup status                       |  
estimated ready time                |  
collection window                   |  
one of two delivery options         | Delivery Option  
                                    |   invariant: Increment 3 — standard delivery and click-and-collect both offered; express and same-day deferred  
trigger pickup fulfillment          | Pickup Fulfillment  
notify customer when ready          | Notification, Confirmation Email  
trigger store-side fulfillment      | Store  

### **Pickup Fulfillment**  
originating order                   | Order  
                                    |   invariant: preparation and handoff must occur at the pickup store recorded on the order  
pickup store                        | Store  
preparation status                  |  
mark order ready for pickup         | Order  
                                    |   invariant: transitions order from confirmed to ready for pickup  
confirm customer handoff            | Order  
                                    |   invariant: transitions order from ready for pickup to collected  
display guest contact on queue      | Guest Checkout  
surface on click-and-collect queue  | Admin Dashboard  
                                    |   invariant: pending orders sorted oldest first on staff queue  

### **Ship-to-Home Fulfillment**  
originating order                   | Order  
                                    |   invariant: packing and dispatch must reflect the shipping address recorded on the order  
shipping address to pack against    | Shipping Address  
order line items to pack            | Order Line Item  
fulfillment status                  |  
mark order fulfilled                | Order  
                                    |   invariant: transitions order from confirmed to fulfilled  
prompt for tracking number          | Tracking Number  
                                    |   invariant: tracking number recommended but not blocking in Increment 3  
trigger shipping notification       | Shipping Notification, Notification  
                                    |   invariant: fires when tracking number entered at fulfillment or added later  
transition order status to shipped  | Order, Tracking Number  
                                    |   invariant: fulfilled to shipped when dispatch confirmed with tracking number  
display guest contact on queue      | Guest Checkout  
surface on order queue              | Admin Dashboard  
                                    |   invariant: pending ship-to-home orders sorted oldest first alongside click-and-collect orders  

### references  

**Ref — Store locator**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 11  
Extract: whole  

```source  
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.  
```  

**Ref — Store geo and operations**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: partial  
Part: Sentences describing store geo-tagging, address, and operational details.  

```source  
We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits.  
```  

**Ref — Click-and-collect**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences about click-and-collect.  

```source  
Speaking of which — click-and-collect should probably be an option. Order online, pick up at your local store. Saves on shipping and gets people in the door.  
```  

**Ref — Increment 3 ship-to-home scope**  
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
Locator: Increment 3  
Extract: partial  

```source  
Outcome: A customer can complete the same purchase journey but have it shipped to a delivery address. Standard delivery only.  
Slicing notes: Still guest checkout, still StripeWave-only. Standard delivery only — defer express and same-day. Manual shipping label creation by staff.  
```  

**Ref — View and Process Incoming Orders (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "View and Process Incoming Orders" / acceptance_criteria item 3  
Extract: partial  

```source  
3. **WHEN** *Store Staff* marks a *Shipping Order* as *Fulfilled*  
**THEN** the system prompts for a tracking number (manual entry in Increment 3)  
**AND** entering the tracking number triggers the shipping notification  
```  

### decisions made  

- **Decomposed Store address** into line 1, line 2, city, county, postcode, country — same pattern as Saved Address. No parenthetical blobs.  
- **Decomposed geo-coordinates** into latitude and longitude as separate properties.  
- **Decomposed operating hours** into opening time per day, closing time per day, and holiday overrides — not a parenthetical blob.  
- **Decomposed Store Locator filters** into separate responsibilities — filter by availability, by specialisation, by distance — instead of `(by availability, specialisation, distance)`.  
- **Decomposed customer location** into shared location and entered postcode as separate inputs.  
- Click-and-Collect enriched with pickup lifecycle.  
- **Increment 2 refresh (slot 51):** *Pickup Fulfillment* introduced as store-side workflow; *click-and-collect queue* on *admin dashboard* in scope. Increment 1 locator behaviors unchanged.  
- **Increment 3 refresh (slot 75):** *Ship-to-Home Fulfillment* parallels *Pickup Fulfillment* — packing/dispatch workflow with *shipping address*, *tracking number*, and *shipping notification* dependencies; *order queue* unifies ship-to-home and click-and-collect on *admin dashboard*; *Click-and-Collect* no longer sole *delivery option*.  

---  

## **Customer Account**  

The persistent identity tying a person's entire PawPlace relationship together — history, preferences, saved details, and authored content.  

### **Customer Account**  
first name                          |  
last name                           |  
email address                       |  
                                    |   invariant: must be unique across all accounts  
phone number                        |  
username                            |  
password hash                       |  
registration date                   |  
account verification status         | Account Verification Status  
                                    |   invariant: must remain unverified until email verification succeeds  
account status                      |  
register via email and password     | Email Verification  
log in                              | Customer Session  
log out                             | Customer Session  
reset password                      | Customer Session  
                                    |   invariant: password reset invalidates all customer sessions on all devices  
order history                       | Order History  
appointment history                 | Appointment  
                                    |   invariant: live from Increment 6 — lists upcoming (soonest first) and past appointments; appointment booking is customer-account-only  
wishlist                            | Wishlist  
address book                        | Address Book  
saved payment methods               | Saved Payment Method  
                                    |   invariant: Increment 5 — supports StripeWave card tokens, PayNova wallet tokens, and VaultPay identity tokens selectable at the payment method selector  
pet profiles                        | Pet Profile  
preferred store                     | Store  
authored customer reviews           | Customer Review  
communication preferences           | Communication Preferences  
retroactively associate guest orders | Order, Guest Checkout  
                                    |   invariant: prior guest orders placed with the same email appear in order history after registration  
drive account-only features         | Email Verification, Wishlist, Address Book, Saved Payment Method, Order History  
                                    |   invariant: wishlist, saved address, saved payment method, order history, and reorder unlock only after email verification succeeds  
drive reorder reminders             | Pet Profile, Order, Notification  
                                    |   invariant: customer pet CRUD deferred past Increment 4  

### **Customer Session**  
authenticated customer account      | Customer Account  
                                    |   invariant: unverified accounts must not receive account-only feature access  
session token                       |  
device context                      |  
last activity timestamp             |  
inactivity timeout                  |  
create on successful login          | Customer Account, Email Verification  
persist across visits on same device | Customer Account  
allow concurrent sessions             | Customer Account  
                                    |   invariant: multiple concurrent sessions per customer account across different devices  
invalidate on logout                 | Customer Account  
invalidate all sessions              | Customer Account  
                                    |   invariant: log out everywhere invalidates every active session  
merge guest shopping cart on login   | Shopping Cart, Guest Checkout  
                                    |   invariant: duplicate product entries sum quantities when guest cart merges into account cart  

### **Email Verification**  
target customer account             | Customer Account  
verification link                   | Verification Link  
send verification email             | Notification  
queue for retry on delivery failure | Notification  
resend verification                 | Verification Link, Notification  
block account-only features         | Customer Account, Customer Session  
                                    |   invariant: login and account-only features blocked until customer confirms ownership via valid verification link  
transition account verification status | Account Verification Status  
                                    |   invariant: account verification status becomes verified only when customer clicks a valid non-expired verification link  

### **Verification Link**  
unique link token                   |  
expiry time                         |  
one-time use flag                   |  
                                    |   invariant: expires after configured window (for example 24 hours); already-used link shows already verified message  
offer resend when expired           | Email Verification  

### **Account Verification Status**  
verification label                  | (unverified or verified)  
                                    |   invariant: remains unverified until email verification succeeds via valid verification link  
gate customer session access        | Customer Session  
                                    |   invariant: blocks customer session creation with account-only access when unverified  

### **Address Book**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account  
saved addresses                     | Saved Address  
default address designation         | Saved Address  
accept new entry from checkout      | Saved Address, Shipping Address  
accept new entry from account settings | Saved Address  
                                    |   invariant: first saved address becomes default address automatically; deleting default address requires selecting a new default when other saved addresses remain  

### **Guest Checkout**  
guest email                         |  
                                    |   invariant: must be valid before checkout advances to payment  
guest first name                    |  
guest last name                     |  
guest phone                         |  
collect billing address             | Billing Address  
                                    |   invariant: billing address required on every order regardless of delivery option; not persisted after transaction — copied to confirmed order only  
collect shipping address            | Shipping Address  
                                    |   invariant: required when standard delivery selected; skipped when click-and-collect is the delivery option  
complete purchase without account   | Order  
                                    |   invariant: guest checkout remains available alongside logged-in checkout — registration and login are optional paths  
                                    |   invariant: guest details must not persist beyond the transaction; order retains guest email and address snapshots for communications  
promote account creation            | Customer Account, Order History, Saved Address  
                                    |   invariant: prompt is dismissible; does not block completed order; surfaces value of order history, saved address, and reorder  

### **Billing Address**  
billing name                        |  
address line one                    |  
address line two                    |  
city                                |  
county or region                    |  
postcode                            |  
country                             |  
pre-fill shipping address           | Shipping Address  
                                    |   invariant: when customer selects same as billing, shipping address fields copy from billing address  
select from saved address           | Saved Address, Customer Account  
                                    |   invariant: logged-in customers may select saved address instead of manual entry  
copy to confirmed order             | Order  
                                    |   invariant: required fields must be complete before checkout advances to payment  
                                    |   invariant: guest path does not persist beyond order snapshot; logged-in save opt-in stores to address book via shipping step  

### **Shipping Address**  
recipient name                      |  
address line one                    |  
address line two                    |  
city                                |  
county or region                    |  
postcode                            |  
country                             |  
pre-fill from billing address       | Billing Address  
                                    |   invariant: individual field overrides replace only the changed field; remaining pre-filled fields unchanged  
pre-fill from saved address         | Saved Address, Address Book  
                                    |   invariant: default address pre-selected for logged-in customers unless customer chooses another saved address  
copy to confirmed order             | Order  
                                    |   invariant: required fields must be complete before checkout advances from the shipping step  
                                    |   invariant: must not be required for click-and-collect orders  
                                    |   invariant: guest path does not persist beyond order snapshot  
save to address book on opt-in      | Address Book, Saved Address  
                                    |   invariant: logged-in customer may save address to address book when completing checkout with new address  

### **Wishlist**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; guest sessions do not have wishlists  
wishlist items                      | Wishlist Item  
persist across customer sessions    | Customer Account, Customer Session  
link to catalog for price and stock | Product, Stock Availability  
require verified customer account   | Email Verification, Customer Session  
                                    |   invariant: guest customers see login prompt instead of add-to-wishlist  

### **Wishlist Item**  
parent wishlist                     | Wishlist  
referenced product                  | Product  
                                    |   invariant: must reference exactly one product on one wishlist  
current catalog price at display    | Product  
current stock availability at display | Stock Availability  
add to shopping cart                | Shopping Cart  
                                    |   invariant: adding to cart does not remove item from wishlist until explicitly removed  

### **Communication Preferences**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; guest sessions cannot opt into marketing  
promotional opt-in                  |  
restock alerts opt-in               |  
pet care tips opt-in                |  
event notifications opt-in          |  
granular opt-in and opt-out         | Notification  
                                    |   invariant: marketing notifications must never be sent without explicit opt-in for that category  
last updated date                   |  

### **Saved Address**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; guest checkout collects addresses per-transaction only  
address label                       |  
address line one                    |  
address line two                    |  
city                                |  
county or region                    |  
postcode                            |  
country                             |  
default shipping flag               |  
default billing flag                |  
                                    |   invariant: default address pre-selected on shipping step at checkout unless customer chooses another  
selectable at checkout              | Order, Billing Address, Shipping Address  
manage from account settings        | Address Book  
                                    |   invariant: historical orders retain a snapshot of the address used; soft-deletion does not break past order references  
                                    |   invariant: deleting the default address requires selecting a new default when other saved addresses remain  

### references  

**Ref — User accounts**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: whole  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

**Ref — Authentication**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 15  
Extract: whole  

```source  
For authentication, we're doing standard username and password authentication — registration, login, logout, password reset, email verification, session management, the works. Nothing exotic, just solid and reliable. If someone's logged in on their phone they shouldn't get randomly kicked out every ten minutes.  
```  

**Ref — Shopping and guest checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about guest checkout and account creation appeal.  

```source  
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.  
```  

**Ref — Notification preferences (account side)**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: partial  
Part: Sentences about preference management.  

```source  
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

**Ref — Register Account (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Register Account" / acceptance_criteria item 2  
Extract: partial  

```source  
2. **WHEN** the customer submits a valid *Registration Form*  
**THEN** a *Customer Account* is created with status *Unverified*  
**AND** the system triggers *Send Email Verification*  
```  

### decisions made  

- **Decomposed authenticate** — `(registration, login, logout, password reset, email verification)` was five operations collapsed into one parenthetical. Now separate: log in, log out, reset password on Customer Account; registration via email and password; email verification on Email Verification; session lifecycle on Customer Session.  
- **Introduced Customer Session** as state-carrier for authenticated context — device-scoped sessions, concurrent multi-device access, guest cart merge on login, log out everywhere.  
- **Introduced Email Verification** and **Verification Link** — mandatory verification gates account-only features; verification email queued for retry without blocking registration confirmation.  
- **Introduced Address Book** as collection class for saved address management — default address designation, checkout save opt-in, account settings CRUD.  
- **Introduced Wishlist Item** as state-carrier — one product entry per wishlist with catalog price and stock at display time; add-to-cart without removing from wishlist.  
- **Introduced Order History** under Order KA — chronicle of account orders with retroactive guest-order association.  
- **Decomposed Guest Checkout billing** — billing address extracted to Billing Address state-carrier; shipping address when standard delivery selected.  
- **Increment 2 refresh (slot 51):** guest checkout and guest email only — registration, login, saved address, and saved payment method deferred to Increment 4.  
- **Increment 3 refresh (slot 75):** Shipping Address introduced; guest checkout remains valid alongside ship-to-home and click-and-collect.  
- **Increment 4 refresh (slot 101):** registration, login, logout, password reset, email verification, customer session, address book, saved address checkout selection, wishlist, order history, reorder, account-persistent shopping cart, saved payment method checkout selection — customer pet CRUD and communication preferences UI remain deferred per thin-slicing.md.  
- **Increment 5 refresh (slot 127):** saved payment methods span StripeWave, PayNova, and VaultPay vendor tokens selectable at payment method selector; Increment 4 account and session behaviors unchanged.  
- **Canonical naming:** customer pet replaces pet profile label for customer's own pet record in key abstractions; Pet Profile remains under Pet KA for store animal presentation.  
- **Increment 6 refresh (slot 153):** *appointment history* is now live — lists upcoming (soonest first) and past appointments; appointment booking is customer-account-only (guest checkout cannot book). *Customer pet CRUD* and *communication preferences UI* remain deferred to Increment 9.  

---  

## **Order**  

The complete purchase lifecycle from cart through delivery and potential return. Owns financial summary, line items, shipping details, and tracking.  

### **Order**  
order number                        |  
                                    |   invariant: must be unique across all orders  
order date                          |  
placing party                       | Customer Account, Guest Checkout  
                                    |   invariant: associates with customer account when purchaser is logged in; retains guest email snapshot for guest orders  
guest email snapshot                |  
order line items                    | Order Line Item  
                                    |   invariant: must have at least one line item  
billing address line one            |  
billing address line two            |  
billing city                        |  
billing county or region            |  
billing postcode                    |  
billing country                     |  
                                    |   invariant: billing address snapshotted at order time — required on every order regardless of delivery option; may originate from saved address selection or manual entry  
shipping address line one           |  
shipping address line two           |  
shipping city                       |  
shipping county or region           |  
shipping postcode                   |  
shipping country                    |  
                                    |   invariant: shipping address snapshotted when delivery option is standard delivery; may originate from saved address, default address pre-fill, or manual entry; not required for click-and-collect  
pickup store name snapshot          |  
pickup store address snapshot       |  
pickup store operating hours snapshot |  
                                    |   invariant: pickup store details snapshotted when delivery option is click-and-collect  
delivery option                     | Delivery Option  
                                    |   invariant: must have either shipping address (standard delivery) or pickup store (click-and-collect) matching the chosen delivery option  
subtotal                            |  
tax amount                          |  
shipping cost                       |  
                                    |   invariant: recorded when standard delivery selected; zero when click-and-collect  
order total                         |  
                                    |   invariant: order total must equal subtotal + tax + shipping cost  
currency                            |  
completed payment                   | Payment, Payment Method Selector  
                                    |   invariant: must have completed payment confirmation before confirmed; payment processes through vendor selected at payment method selector  
order status                        |  
                                    |   invariant: click-and-collect lifecycle — placed → confirmed → ready for pickup → collected  
                                    |   invariant: ship-to-home lifecycle — placed → confirmed → fulfilled → shipped → delivered  
tracking number                     | Tracking Number  
estimated delivery date             |  
trigger confirmation notification   | Notification, Confirmation Email  
                                    |   invariant: confirmation email must be attempted; delivery failure must not block order confirmation  
trigger shipping notification       | Notification, Shipping Notification  
                                    |   invariant: fires when tracking number recorded on ship-to-home order  
expose guest order lookup           | Guest Checkout  
                                    |   invariant: guest lookup requires matching order number and guest email — no order details leak to unrelated emails  
provide entry point for returns     | Return, Return Eligibility, Order History  
                                    |   invariant: "Return" action appears on eligible order in order history when return eligibility is satisfied  
provide entry point for reorders    | Order History, Reorder  
                                    |   invariant: reorder sources order line items from order history for logged-in verified customer accounts  

### **Order Line Item**  
ordered product                     | Product  
product name snapshot               |  
SKU snapshot                        |  
unit price snapshot                  |  
                                    |   invariant: must capture the price at the moment the order is confirmed, not the current catalog price  
quantity                            |  
                                    |   invariant: must be at least one  
line discount                       |  
line total                          |  

### **Shopping Cart**  
owning party                        | Customer Account, Guest Checkout  
                                    |   invariant: persists across devices and customer sessions for logged-in customer accounts; session-scoped for guests until login merges guest cart into account cart  
cart items                          | Cart Item  
created date                        |  
last modified date                  |  
cart subtotal                       |  
validate quantities against stock   | Stock Availability, Cart Item  
                                    |   invariant: cart item quantities validated against current stock availability at render time  
merge duplicate product entries     | Cart Item  
                                    |   invariant: duplicate product entries merge by incrementing quantity  
transition to checkout              | Guest Checkout, Customer Account, Saved Address, Saved Payment Method, Payment Method Selector  
                                    |   invariant: guest checkout or authenticated checkout with saved entity selection; payment step presents payment method selector with StripeWave, PayNova, and VaultPay  

### **Cart Item**  
product in cart                     | Product  
quantity                            |  
                                    |   invariant: must be at least one; zero is equivalent to removal  
unit price at time of adding        |  
line price                          |  
reflect current stock availability  | Stock Availability  
                                    |   invariant: quantity must not exceed available-to-sell at any store for Increment 2 checkout  

### **Delivery Option**  
delivery method name                |  
                                    |   invariant: Increment 4 — standard delivery and click-and-collect offered; express and same-day deferred  
standard delivery fulfillment       | Standard Delivery  
click-and-collect fulfillment       | Click-and-Collect  
selected during checkout            | Order  
                                    |   invariant: determines whether shipping address or pickup store is required on the order  
shipping cost                       | Order  
                                    |   invariant: recorded on order when standard delivery selected  
estimated delivery window           | Standard Delivery  
delivery instructions               |  
                                    |   invariant: deferred — not required for click-and-collect or standard delivery in Increment 4  

### **Standard Delivery : Delivery Option**  
confirm shipping address destination | Shipping Address, Order  
                                    |   invariant: must always reference complete shipping address on the order  
estimated delivery window           |  
shipping cost                       | Order  
trigger ship-to-home fulfillment    | Ship-to-Home Fulfillment  
                                    |   invariant: sole ship-to-home option in Increment 4 — express and same-day deferred  

### **Tracking Number**  
carrier reference                   |  
carrier name                        |  
shipment date                       |  
originating order                   | Order  
                                    |   invariant: must belong to exactly one ship-to-home order; duplicate entry replaces prior value  
trigger shipping notification       | Shipping Notification, Notification  
transition order status to shipped  | Order  
                                    |   invariant: transitions order status from fulfilled to shipped when dispatch confirmed  
link to carrier tracking page       | Order  
                                    |   invariant: recommended at ship-to-home fulfillment but not blocking — staff may add later via order detail  

### **Order History**  
owning customer account             | Customer Account  
                                    |   invariant: accessible only to logged-in verified customer account holders  
associated orders                   | Order  
                                    |   invariant: lists all orders associated with the account, most recent first  
retroactive guest order inclusion   | Order, Guest Checkout  
                                    |   invariant: prior guest orders placed with the same email as the registered account appear in order history  
display order summary per row       | Order  
open full order detail              | Order, Order Line Item, Delivery Option, Payment, Tracking Number  
provide entry point for reorder     | Reorder  

### **Reorder**  
source order                        | Order, Order History  
                                    |   invariant: must source order line items from an order in the customer's order history  
target shopping cart                | Shopping Cart  
add products with original quantities | Order Line Item, Product  
merge duplicate cart items          | Cart Item  
                                    |   invariant: duplicate product quantities sum when merging into existing cart items  
skip delisted products              | Product  
                                    |   invariant: delisted products skipped with clear message; partial reorder succeeds  
warn on out of stock products       | Stock Availability, Cart Item  
                                    |   invariant: out-of-stock products added with stock warning and proceed-or-remove choice  
navigate to shopping cart for review | Shopping Cart  

### **Return**  
originating order                   | Order  
                                    |   invariant: must reference exactly one originating order  
return date                         |  
initiating party                    | Customer Account, Guest Checkout, In-Store Return  
                                    |   invariant: associates with customer account when initiated online; supports guest order return via order number and guest email  
return request                      | Return Request  
                                    |   invariant: creates the return record and links it to the originating order  
returned items                      | Returned Items  
return status                       | Return Status  
return label                        | Return Label  
return QR code                      | Return QR Code  
                                    |   invariant: both generated on successful return request submission; both encode the same return reference  
route refund through original vendor | Refund, Payment  
                                    |   invariant: refund must always route through the payment vendor that handled the original transaction  
support partial returns             | Returned Items, Order Line Item  
                                    |   invariant: items already in "return in progress" cannot be returned again; remaining eligible items are still returnable  
reflect in customer account         | Customer Account, Order  
                                    |   invariant: return visible under order detail regardless of whether initiated online or in-store  

### **Return Request**  
selected order line items           | Order Line Item  
quantities to return                |  
return reason                       | Return Reason  
create return record                | Return, Order  
                                    |   invariant: must be made against an order that passes return eligibility; items already in "return in progress" are excluded  
surface return status immediately   | Return Status, Customer Account  

### **Return Eligibility**  
eligible items                      | Order Line Item, Order  
return window check                 | Return Window  
ineligibility reason                |  
evaluate per item                   | Order Line Item  
                                    |   invariant: evaluated per item — some items in an order may be eligible while others are not  
hide or disable return action       | Order, Order History  
                                    |   invariant: "Return" action must not appear on an order whose return window has expired; ineligible items must show a clear reason  

### **Return Window**  
configured period                   |  
delivery date anchor                | Order  
collection date anchor              | Order, Click-and-Collect  
                                    |   invariant: period starts from delivery date for standard delivery or collection date for click-and-collect  
category-specific variation         | Category  
                                    |   invariant: varies by product category or promotional conditions — configuration, not domain logic  

### **Return Reason**  
reason category                     | (wrong size, damaged in transit, not as described, changed mind, other)  
reason text                         |  
inspection policy hint              | Return  
                                    |   invariant: some reasons (e.g. damaged in transit) may qualify for auto-approval without physical inspection  

### **Returned Items**  
order line item reference           | Order Line Item  
returned quantity                   |  
                                    |   invariant: returned quantities cannot exceed original ordered quantities minus any previously returned quantities for the same order line item  
per-item return status              | Return Status  
                                    |   invariant: tracks per-item return status separately when items are inspected individually  
trigger restocking on inspection pass | Restocking, Product, Stock Availability  

### **Return Status**  
lifecycle state                     | (initiated, label generated, shipped back, received, inspected, refund processing, completed)  
update on label generation          | Return Label  
update on carrier scan              |  
update on warehouse receipt         | Notification, Return Received Notification  
                                    |   invariant: triggers return received notification when transitioning to "received"  
update on inspection completion     |  
update on refund processing         | Refund  
surface on order detail             | Order, Order History  

### **Return Label**  
return address                      |  
order number                        | Order  
return reference                    |  
carrier barcode                     |  
                                    |   invariant: printable PDF generated when return request is submitted successfully  
                                    |   invariant: must encode the same return reference as the return QR code  

### **Return QR Code**  
return reference                    | Return Label  
                                    |   invariant: mobile-displayable code generated alongside return label for carrier drop-off  
                                    |   invariant: encodes the same return reference as the return label so either can be used at a drop-off point  

### **In-Store Return**  
order lookup by order number        | Order  
order lookup by customer email      | Customer Account, Guest Checkout  
store employee initiator            | Store  
                                    |   invariant: must be recorded against the original order; must route refund through the original payment vendor  
follow same refund routing invariant | Refund, Payment  
reflect in customer account         | Customer Account, Order  
                                    |   invariant: reflects in customer account under order detail just as online returns do  
support guest order returns         | Guest Checkout  
                                    |   invariant: guest order returns use order number and guest email — refund routing is order-level, not account-level  

### **Manager Override**  
approving manager                   |  
override reason                     |  
approval timestamp                  |  
allow in-store return to proceed    | In-Store Return, Return Eligibility  
                                    |   invariant: escalation when standard return eligibility rules would block the return (e.g. outside return window, wrong item condition)  
                                    |   invariant: requires explicit manager approval — not available on online self-service path  
record for audit                    |  
                                    |   invariant: approving manager and override reason recorded for audit trail  

### **Restocking**  
returned product                    | Product  
returned quantity                   | Returned Items  
destination store                   | Store  
inspection result                   | (pass, fail)  
replenish stock availability        | Stock Availability  
                                    |   invariant: only items that pass inspection are restocked; failed items are not returned to stock  

### references  

**Ref — Shopping cart persistence**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about shopping cart persistence.  

```source  
For the shopping side, we need all the standard e-commerce functionality. A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).  
```  

**Ref — Order confirmation and shipping**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 19  
Extract: whole  

```source  
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.  
```  

**Ref — Checkout delivery options**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentence listing delivery options.  

```source  
Checkout flow: shipping address, billing address, delivery options (standard, express, maybe same-day for local), and then payment.  
```  

**Ref — Returns and exchanges**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: whole  

```source  
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.  
```  

**Ref — Initiate Return from Order History (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Initiate Return from Order History"  
Extract: partial  

```source  
1. WHEN the customer selects "Return" on an eligible order in Order History  
THEN the system shows which items in the order are Return Eligible  
AND the customer selects the items and quantities to return, plus a return reason  
```  

**Ref — Generate Return Label or QR Code (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Generate Return Label or QR Code"  
Extract: partial  

```source  
1. WHEN the Return Request is submitted  
THEN the system generates a Return Label (PDF) and a Return QR Code  
AND both are shown on the return confirmation page and emailed to the customer  
```  

**Ref — Process In-Store Return (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Process In-Store Return"  
Extract: partial  

```source  
1. WHEN a customer brings an item to the store for return  
THEN the staff dashboard provides an order lookup by order number or customer email  
AND a "Start Return" action is displayed on the matched order  
4. WHEN the item is not eligible for return (outside window, wrong condition)  
THEN the staff dashboard shows the ineligibility reason  
AND a "Manager Override" action is displayed, requiring manager approval before the return proceeds  
```  

**Ref — Increment 7 returns and refunds scope**  
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
Locator: Increment 7  
Extract: partial  

```source  
Outcome: Customers can initiate a return from their order history, get a printable label or QR code, and watch the refund land back on their original payment method. In-store returns are reflected in the customer's account too.  
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.  
```  

### decisions made  

- Introduced Order Line Item and Cart Item as state-carrier classes — many-to-many relationships with their own data.  
- **Decomposed Order address snapshots** into 6 properties each for shipping and billing — line 1, line 2, city, county, postcode, country. No parenthetical blobs.  
- Order carries real financial data: order number, subtotal, tax, shipping cost, total, currency.  
- Tracking number and estimated delivery date added for shipping notifications.  
- Return enriched with real lifecycle: return date, reason, returned items, quantity, condition, status.  
- Delivery Option carries delivery method name, estimated days, shipping cost, delivery instructions — shipping fields deferred for Increment 2 click-and-collect-only slice.  
- **Increment 2 refresh (slot 51):** *Guest checkout* sole cart owner; session-scoped cart; *click-and-collect* sole *delivery option*; pickup store and billing address snapshots on *order*; click-and-collect lifecycle on *order status*; *order confirmation page* remains presentation surface in UL only — no CRC block.  
- **Increment 3 refresh (slot 75):** *Shipping Address* and *Tracking Number* introduced; *Standard Delivery* subtype on *Delivery Option*; ship-to-home lifecycle on *order status*; shipping cost on *order total*; *ship-to-home fulfillment* owns store-side packing/dispatch; guest order lookup invariant on *order*; presentation surfaces (*order status page*, *order queue*) omitted per Increment 2 precedent.  
- **Increment 4 refresh (slot 101):** *Order* accepts *customer account* or *guest checkout* placing party; *shopping cart* account-persistent with guest cart merge on login; *billing address* and *shipping address* support *saved address* selection and checkout save opt-in; *order history* and *reorder* introduced; *return* remains deferred to Increment 7.  
- **Increment 5 refresh (slot 127):** *Order* and *shopping cart* checkout transition routes through *payment method selector*; *payment* must complete via selected vendor before confirmation.  
- **Increment 7 refresh (slot 179):** *Return* fully elaborated from deferred stub to full lifecycle. *Return Request*, *Return Eligibility*, *Return Window*, *Return Reason*, *Returned Items*, *Return Status*, *Return Label*, *Return QR Code*, *In-Store Return*, *Manager Override*, and *Restocking* introduced as separate classes. *Order* entry-point responsibility activated — "Return" action gated by *return eligibility*. *Return Label* and *Return QR Code* are separate classes — each has a distinct format (PDF vs mobile code) and usage context (at home vs carrier drop-off), though both encode the same return reference. *In-Store Return* is a full class, not a property of *Return* — it carries distinct behavior (staff order lookup, *manager override*, guest-order support). *Manager Override* is a full class — it carries escalation behavior, audit recording, and conditional availability. *Restocking* introduced as the post-inspection replenishment of returned items back to *stock availability*. *Returned Items* is a collection-like class — it manages the subset of *order line item* being returned, tracks per-item status, and triggers restocking.  

---  

## **Payment**  

Financial transaction handling across three integrated vendors. Owns vendor abstraction, payment method selector presentation, webhook processing, transient-error retry policy, hard-decline handling, refund routing with full customer-facing lifecycle, and saved payment method lifecycle across StripeWave, PayNova, and VaultPay.  

### **Payment**  
payment reference                   |  
associated order                    | Order  
                                    |   invariant: must be associated with exactly one order  
payment amount                      |  
                                    |   invariant: must equal the order total at time of payment  
currency                            |  
payment date                        |  
payment method used                 | Payment Vendor, Saved Payment Method, Payment Method Selector  
payment status                      |  
processing vendor                   | Payment Vendor  
                                    |   invariant: Increment 5 — records StripeWave, PayNova, or VaultPay selected at payment method selector  
vendor transaction reference        | Vendor Transaction Reference  
process through selected vendor     | Payment Method Selector, StripeWave, PayNova, VaultPay, Saved Payment Method  
                                    |   invariant: must not confirm order until payment confirmation succeeds  
reconcile via webhook callback      | Webhook Callback  
                                    |   invariant: applies when customer-facing request times out — for any active vendor  
initiate payment retry on transient error | Payment Retry, Transient Error, Payment Vendor  
                                    |   invariant: automatic retry only for transient error within retry window — never for hard decline  
surface hard decline immediately    | Hard Decline, Payment Method Selector  
                                    |   invariant: surfaces decline reason and alternative vendor options without automatic retry  
continue payment retry in background | Payment Retry, Order, Confirmation Email  
                                    |   invariant: success confirms order and fires confirmation email even when customer navigates away  
route refund through original vendor | Refund, Payment Vendor, Refund Status  
                                    |   invariant: refund triggered by return completion; routes through the vendor that captured the original charge  
                                    |   invariant: refund amount must match the returned items value  
initiate refund retry on vendor failure | Refund Retry, Refund, Payment Vendor  
                                    |   invariant: automatic retry when vendor is temporarily unavailable; customer sees "refund processing" — not "refund failed"  

### **Payment Method Selector**  
present StripeWave card entry       | StripeWave, Saved Payment Method  
present PayNova digital wallet      | PayNova, Digital Wallet, Saved Payment Method  
present VaultPay buy-now-pay-later  | VaultPay, Buy-now-pay-later, Saved Payment Method  
present saved payment methods       | Saved Payment Method, Customer Account  
pre-select default payment method   | Default Payment Method, Saved Payment Method, Customer Account  
route charge to selected vendor     | Payment, StripeWave, PayNova, VaultPay  
                                    |   invariant: must always offer at least StripeWave  
                                    |   invariant: must not confirm order until selected vendor returns payment confirmation  
display alternatives on decline     | Hard Decline, Payment Retry, StripeWave, PayNova, VaultPay  
                                    |   invariant: on decline or retry exhaustion displays all vendor options without confirming order  

### **Payment Confirmation**  
originating payment                 | Payment  
                                    |   invariant: must arrive from the same payment vendor that initiated the charge  
vendor confirmation reference       | Vendor Transaction Reference  
confirmation timestamp              |  
confirm associated order            | Order, Stock Availability  
                                    |   invariant: triggers order transition to confirmed and inventory reservation  
trigger confirmation email          | Notification, Confirmation Email  

### **Vendor Transaction Reference**  
vendor-assigned identifier          |  
originating payment vendor          | Payment Vendor  
                                    |   invariant: enables webhook callback reconciliation and future refund routing to the correct vendor API  
record on completed payment         | Payment  

### **Webhook Callback**  
originating payment vendor          | StripeWave, PayNova, VaultPay  
                                    |   invariant: Increment 5 — applies uniformly across all three active vendors  
vendor payload                      |  
reconciliation status               |  
reconcile pending payment           | Payment  
                                    |   invariant: must reconcile against the pending payment for exactly one order  
update order on success             | Order, Payment Confirmation  

### **Payment Vendor**  
vendor name                         |  
vendor code                         |  
supported payment types             |  
active status                       |  
                                    |   invariant: Increment 5 exposes StripeWave, PayNova, and VaultPay through payment method selector  
authorize                           | Payment  
capture                             | Payment  
settle                              | Payment  
process refund                      | Refund, Refund Status  
                                    |   invariant: Increment 7 — StripeWave card refunds, PayNova wallet credits, VaultPay instalment plan adjustments all routable  
tokenize for saved payment method   | Saved Payment Method, Customer Account  
                                    |   invariant: raw card numbers and wallet secrets never persist on customer account  
                                    |   invariant: each vendor owns its own decline semantics — PawPlace surfaces reason and offers alternatives without overriding vendor decisions  

### **StripeWave : Payment Vendor**  
credit and debit card processing    |  
receive card details or saved token | Saved Payment Method  
return payment confirmation         | Payment Confirmation  
send webhook callback               | Webhook Callback  
participate in payment retry        | Payment Retry, Transient Error  
                                    |   invariant: primary card processor since Increment 2; card entry UX unchanged from Increments 2–4  

### **PayNova : Payment Vendor**  
digital wallet provider             | Digital Wallet  
wallet authentication flow          | Digital Wallet  
redirect or embed wallet auth       | Digital Wallet  
return payment confirmation         | Payment Confirmation, Vendor Transaction Reference  
                                    |   invariant: returns confirmation or decline reason such as insufficient balance or wallet locked  
save PayNova wallet token           | Saved Payment Method, Customer Account  
                                    |   invariant: stores vendor token only — never wallet secrets  
participate in payment retry        | Payment Retry, Transient Error  
                                    |   invariant: retries through same PayNova session on transient error  

### **VaultPay : Payment Vendor**  
buy-now-pay-later channel           | Buy-now-pay-later  
redirect or embed BNPL flow         | Buy-now-pay-later  
perform eligibility check           | Eligibility Check  
present instalment plan             | Instalment Plan  
return payment confirmation         | Payment Confirmation, Vendor Transaction Reference, Instalment Plan  
                                    |   invariant: declines are VaultPay decision — PawPlace surfaces unavailability and offers StripeWave and PayNova alternatives  
save VaultPay identity token        | Saved Payment Method, Customer Account  
                                    |   invariant: pre-fills VaultPay identity but still requires eligibility check each transaction  
participate in payment retry        | Payment Retry, Transient Error  
                                    |   invariant: retries through same VaultPay session on transient error  

### **Digital Wallet**  
mobile wallet credentials channel   | PayNova  
                                    |   invariant: authorises payment through PayNova wallet credentials rather than typed card details  

### **Buy-now-pay-later**  
installment payment channel         | VaultPay  
                                    |   invariant: requires eligibility check and customer acceptance of instalment plan before payment confirmation  

### **Eligibility Check**  
credit assessment result            | VaultPay  
transaction eligibility             | VaultPay  
                                    |   invariant: performed by VaultPay during BNPL checkout; must complete before instalment plan is presented  
                                    |   invariant: approval is per transaction — not permanent  

### **Instalment Plan**  
installment count                   | VaultPay  
installment amount                  | VaultPay  
installment schedule                | VaultPay  
                                    |   invariant: VaultPay-approved schedule presented before BNPL capture; PawPlace records reference on payment  

### **Transient Error**  
failure type                        | (vendor timeout, HTTP 5xx, or network interruption)  
retryable failure classification    |  
trigger automatic payment retry     | Payment Retry, Payment Vendor, Retry Window  
display retrying payment indicator  | Payment Method Selector  
                                    |   invariant: no manual customer action required during automatic retries within retry window  

### **Hard Decline**  
decline reason                      | Payment Vendor  
non-retryable failure classification |  
                                    |   invariant: insufficient funds, card or wallet blocked, fraud flag, or BNPL eligibility failure  
                                    |   invariant: must not trigger automatic payment retry  
surface immediately at selector     | Payment Method Selector, StripeWave, PayNova, VaultPay  
                                    |   invariant: PawPlace surfaces decline reason and alternative payment vendor options immediately  

### **Payment Retry**  
attempt count                       |  
retry status                        |  
background continuation flag        |  
re-attempt through same vendor      | Payment, Payment Vendor, Transient Error  
                                    |   invariant: must always use same payment vendor as original attempt  
                                    |   invariant: must never retry a hard decline  
run within retry window             | Retry Window  
confirm order on success            | Order, Payment Confirmation, Confirmation Email  
                                    |   invariant: background success confirms order and fires confirmation email when customer navigates away  
notify on exhaustion                | Payment Method Selector, Notification  
                                    |   invariant: on exhaustion returns payment method selector with all vendor options  

### **Retry Window**  
maximum attempt count               |  
time limit                          |  
                                    |   invariant: exhaustion ends automatic retries and surfaces manual alternatives at payment method selector  

### **Refund**  
refund reference                    |  
originating return                  | Return  
                                    |   invariant: triggered by return completion — inspection pass or auto-approval  
refund amount                       | Returned Items  
                                    |   invariant: must match the returned items value  
refund date                         |  
route through original vendor       | Payment Vendor, Vendor Transaction Reference  
                                    |   invariant: must always route through the payment vendor that handled the original transaction  
vendor refund API route             | StripeWave, PayNova, VaultPay  
                                    |   invariant: StripeWave card refunds, PayNova wallet credits, VaultPay instalment plan adjustments  
refund status                       | Refund Status  
handle vendor failure               | Refund Retry  
                                    |   invariant: vendor failure queued for automatic re-attempt; customer sees "refund processing" — never "refund failed"  
escalate on retry exhaustion        | Refund Status, Notification, Refund Under Review Notification  
                                    |   invariant: transitions refund status to "requires review" and triggers refund under review notification  
invisible vendor mechanics          |  
                                    |   invariant: customer sees only refund status and the payment method the credit lands on — not vendor mechanics  

### **Refund Status**  
lifecycle state                     | (processing, completed, requires review)  
transition to processing            | Return, Refund, Payment Vendor  
                                    |   invariant: transitions when return inspection passes and refund request is sent to payment vendor  
transition to completed             | Payment Vendor, Notification, Refund Completed Notification  
                                    |   invariant: transitions when payment vendor confirms credit has been issued; triggers refund completed notification  
transition to requires review       | Refund Retry, Notification, Refund Under Review Notification  
                                    |   invariant: transitions when refund retry exhausts without vendor confirmation; triggers refund under review notification  
surface on order detail             | Order, Order History  
timing expectation note             |  
                                    |   invariant: shows "refunds typically take X business days depending on your payment provider" while in processing state  
                                    |   invariant: must not show "refund failed" to the customer — processing or requires review are the only non-success states visible  

### **Refund Retry**  
attempt count                       |  
retry status                        |  
configured window                   |  
re-attempt through same vendor      | Refund, Payment Vendor  
                                    |   invariant: must always use the same payment vendor as the original refund attempt  
                                    |   invariant: automatic retry when vendor is temporarily unavailable (timeout, API error)  
transition refund status on exhaustion | Refund Status  
                                    |   invariant: on exhaustion transitions refund status to "requires review"  
                                    |   invariant: must not surface vendor failure to customer as "refund failed"  

### **Saved Payment Method**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; not exposed to guest checkout  
customer-assigned label             |  
vendor-token reference              | Payment Vendor, StripeWave, PayNova, VaultPay  
processing vendor                   | Payment Vendor  
last four digits                    |  
card brand                          |  
wallet provider                     |  
expiry month                        |  
expiry year                         |  
                                    |   invariant: Increment 5 — supports StripeWave card tokens, PayNova wallet tokens, and VaultPay identity tokens  
                                    |   invariant: vendor token must remain valid or be marked expired for method to be usable  
                                    |   invariant: stores only vendor token — never raw card numbers or wallet secrets  
date added                          |  
default payment method flag         | Default Payment Method  
                                    |   invariant: first saved method becomes default unless customer changes default in account settings  
selectable at checkout              | Payment Method Selector, Order, Payment  
save during checkout on opt-in      | Customer Account, StripeWave, PayNova, VaultPay  
                                    |   invariant: logged-in customer may save when completing checkout with new vendor credentials  
add and soft-delete                 | Customer Account  
                                    |   invariant: deletion must not break refund routing on past orders  

### **Default Payment Method**  
pre-selected saved payment method   | Saved Payment Method  
                                    |   invariant: pre-selected at payment method selector for logged-in customers  
assigned on first save              | Saved Payment Method, Customer Account  
                                    |   invariant: first saved method becomes default unless customer changes default in account settings  

### references  

**Ref — Payment vendors and checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentences describing the three payment vendors and their integration.  

```source  
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.  
```  

**Ref — Process Digital Wallet Payment via PayNova (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Process Digital Wallet Payment via PayNova"  
Extract: partial  

```source  
WHEN the customer selects PayNova (Digital Wallet) at the payment step  
THEN the system redirects to or embeds the PayNova wallet authentication flow  
AND the customer authorises the payment using their mobile wallet credentials  
```  

**Ref — Process Buy-Now-Pay-Later via VaultPay (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Process Buy-Now-Pay-Later via VaultPay"  
Extract: partial  

```source  
WHEN the customer selects VaultPay (Buy-Now-Pay-Later) at the payment step  
THEN the system redirects to or embeds VaultPay's BNPL flow  
AND VaultPay performs the Eligibility Check and presents the Instalment Plan to the customer  
```  

**Ref — Retry Failed Payment (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Retry Failed Payment"  
Extract: partial  

```source  
WHEN a Payment fails due to a Transient Error (timeout, vendor 5xx, network issue)  
THEN the system automatically retries the payment through the same Payment Vendor  
AND the customer sees a "retrying payment" indicator — no manual action required  
```  

**Ref — Returns and refund routing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: partial  
Part: Sentences about refund routing through original payment vendor.  

```source  
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.  
```  

**Ref — Increment 5 thin slice**  
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
Locator: Increment 5  
Extract: partial  

```source  
Outcome: Customers can pay with PayNova (mobile wallet) and VaultPay (buy-now-pay-later) in addition to StripeWave. Failed payments retry automatically across all three.  
Slicing notes: Proves the payment vendor abstraction generalises beyond StripeWave. Refund routing is in scope so Increment 7 can build cleanly.  
```  

**Ref — Route Refund through Original Payment Vendor (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Route Refund through Original Payment Vendor"  
Extract: partial  

```source  
1. WHEN the returned item is received and inspected (or the return is auto-approved)  
THEN the system initiates a Refund through the Original Payment Vendor for that order  
AND the refund amount matches the returned items' value  
5. WHEN the refund request to the vendor fails (vendor downtime, API error)  
THEN the refund is queued for retry  
AND the customer sees "refund processing" status — not "refund failed"  
BUT if retries exhaust, the return status escalates to "refund requires manual review"  
```  

**Ref — Track Refund Status (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Track Refund Status"  
Extract: partial  

```source  
1. WHEN the customer views the Order Detail for a returned order  
THEN the Refund Status is visible: processing, completed, or requires review  
2. WHEN the Refund is completed by the vendor  
THEN the Refund Status transitions to Completed  
AND the customer receives a "refund completed" notification (email)  
```  

**Ref — Increment 7 refund routing design rule**  
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
Locator: Increment 7  
Extract: partial  

```source  
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.  
```  

### decisions made  

- **Increment 5 refresh (slot 127):** StripeWave, PayNova, and VaultPay all active — Increment 4 sole-vendor deferral superseded for this scope.  
- **Introduced Payment Method Selector** — owns multi-vendor presentation, default pre-selection, and decline or retry-exhaustion fallback UX distinct from any single vendor integration.  
- **Introduced Transient Error and Hard Decline** as separate concepts — automatic payment retry applies only to transient error (independence test).  
- **Introduced Payment Retry and Retry Window** — payment retry owns retry policy; retry window is its configured limit.  
- **Introduced Vendor Transaction Reference** — reconciliation identity recorded on payment for webhook and refund routing.  
- **Eligibility Check and Instalment Plan** stay under Payment KA as VaultPay-specific concepts, not a separate KA.  
- **Digital Wallet and Buy-now-pay-later** modeled as channel properties on PayNova and VaultPay subtypes — same behavior family, different channel label.  
- **Default Payment Method** modeled as property concept on Saved Payment Method — pre-selection at payment method selector.  
- Payment carries real financial data: reference, amount, currency, date, status. Payment status tracks authorization lifecycle: pending → authorized → captured → settled / failed / refunded.  
- **Decomposed Saved Payment Method** — processing vendor discriminator added for multi-vendor tokens; wallet provider for PayNova display; BNPL label path for VaultPay.  
- **Increment 4 refresh (slot 101):** Saved Payment Method checkout selection and save-during-checkout opt-in preserved; StripeWave card path UX unchanged from Increments 2–4.  
- **Increment 2 refresh (slot 51):** Payment Confirmation and Webhook Callback introduced; saved payment method deferred until Increment 4.  
- **Increment 7 refresh (slot 179):** *Refund* fully activated from Increment 5 foundation to full customer-facing lifecycle. *Refund Status* introduced as its own class — carries distinct lifecycle rules (processing → completed or requires review), customer-facing visibility behavior, timing expectation notes, and escalation triggers (active-verb test; not a property of *Refund*). *Refund Retry* introduced as its own class — while the resilience pattern parallels *Payment Retry*, it operates on a different lifecycle event (post-return inspection, not checkout) and carries its own exhaustion semantics (escalation to "requires review" vs. returning the *payment method selector*). *Payment* responsibility "route refund through original vendor" activated — supersedes "foundation for Increment 7" language. *Payment Vendor* responsibility "process refund" activated — all three vendor refund APIs routable.  

---  

## **Notification**  

The communication layer delivering transactional and marketing messages. Transactional notifications are event-driven and mandatory; marketing notifications are opt-in only.  

### **Notification**  
notification subject                |  
notification body                   |  
notification channel                |  
sent date                           |  
delivery status                     |  
triggering event                    | Order, Appointment, Pet, Refund, Refund Status, Return Status, Stock Availability, Payment Confirmation, Tracking Number, Email Verification  
                                    |   invariant: Increment 4 — confirmation email fires unconditionally on order confirmation; shipping notification fires when tracking number recorded on ship-to-home order; verification email fires on account registration  
                                    |   invariant: Increment 6 — appointment confirmation email fires on booking; appointment reminder fires the day before each upcoming appointment; pet-adopted-before-visit notification fires when a booked pet transitions to adopted; visit follow-up notification fires when follow-up date arrives and action is not none  
                                    |   invariant: Increment 7 — return received notification fires when return status transitions to "received"; refund completed notification fires when refund status transitions to "completed"; refund under review notification fires when refund status transitions to "requires review"  
recipient                           | Customer Account, Guest Checkout  
                                    |   invariant: guest email from guest checkout or registered email on customer account for logged-in orders; appointment notifications deliver only to customer account email — appointment booking is account-gated; return and refund notifications support both customer account email and guest email paths  
deliver transactional message       | Order, Appointment, Confirmation Email, Shipping Notification, Email Verification, Appointment Confirmation Email, Appointment Reminder, Pet Adopted Before Visit Notification, Visit Follow-Up Notification, Return Received Notification, Refund Completed Notification, Refund Under Review Notification  
deliver marketing message           | Communication Preferences  
                                    |   invariant: marketing notifications deferred in Increment 4  
check communication preferences     | Communication Preferences  
                                    |   invariant: checked before every marketing send — not applicable to transactional notifications  
queue failed delivery for retry     | Confirmation Email, Shipping Notification, Email Verification, Appointment Confirmation Email, Appointment Reminder, Pet Adopted Before Visit Notification, Visit Follow-Up Notification, Return Received Notification, Refund Completed Notification, Refund Under Review Notification  
                                    |   invariant: email delivery failure must not block order confirmation, order status transition to shipped, account registration, appointment creation, appointment status, pet lifecycle event recording, visit outcome recording, return processing, or refund status transition  

### **Confirmation Email**  
originating order                   | Order  
                                    |   invariant: must include order number, order line item list, total paid, masked payment method, and delivery details  
recipient guest email               | Guest Checkout  
recipient customer account email    | Customer Account  
masked payment method display       | Payment, Saved Payment Method, StripeWave, PayNova, VaultPay  
                                    |   invariant: vendor-appropriate mask — last four digits and card brand for StripeWave, wallet provider for PayNova, BNPL label for VaultPay  
pickup store address                | Store  
pickup store operating hours        | Store  
shipping address snapshot           | Shipping Address  
                                    |   invariant: shown for standard delivery orders; pickup store address shown for click-and-collect orders  
order status page link              | Order  
deliver on payment confirmation     | Payment Confirmation  
                                    |   invariant: must not block order confirmation when delivery fails  
queue for retry on failure          | Notification  

### **Shipping Notification**  
originating order                   | Order  
                                    |   invariant: must include order number, order line items shipped, carrier name, tracking number, and estimated delivery window  
items shipped                       | Order Line Item  
carrier name                        | Tracking Number  
tracking number                     | Tracking Number  
estimated delivery window           |  
recipient guest email               | Guest Checkout  
recipient customer account email    | Customer Account  
order status page link              | Order  
deliver when tracking number recorded | Tracking Number, Ship-to-Home Fulfillment  
                                    |   invariant: does not fire without a tracking number; staff may add tracking later to trigger delivery  
                                    |   invariant: must not block order status transition to shipped when delivery fails  
queue for retry on failure          | Notification  

### **Notification Preferences**  
promotional opt-in                  |  
restock alerts opt-in               |  
pet care tips opt-in                |  
event notifications opt-in          |  
checked at delivery time            | Notification  
stored on customer account          | Customer Account  
enforced by notification system     | Notification  

### **Appointment Confirmation Email**  
booking appointment                 | Appointment  
                                    |   invariant: must include pet name, store address, date and time, and optional visit note  
recipient customer email            | Customer Account  
deliver on appointment confirmation | Appointment  
                                    |   invariant: must not block appointment creation when email delivery fails  
queue for retry on failure          | Notification  

### **Appointment Reminder**  
reminder appointment                | Appointment  
                                    |   invariant: sent 24 hours before the appointment time; includes pet name, store address, date and time, and visit note  
recipient customer email            | Customer Account  
suppress when appointment cancelled | Appointment  
                                    |   invariant: no reminder sent for cancelled or no-show appointments  
suppress when pet adopted           | Pet, Appointment  
                                    |   invariant: pet-adopted-before-visit notification takes precedence; reminder suppressed  
queue for retry on failure          | Notification  

### **Pet Adopted Before Visit Notification**  
adopted pet                         | Pet  
affected appointment                | Appointment  
                                    |   invariant: one notification per affected customer with a pending appointment for the adopted pet  
recipient customer email            | Customer Account  
include cancel and browse options   | Appointment, Pet Gallery  
                                    |   invariant: notification includes options to cancel the appointment or browse other available pets  
record notification status          | Appointment  
                                    |   invariant: notified or not-yet-notified status visible per appointment on the staff incoming appointments view  
suppress when no pending appointments | Appointment  
                                    |   invariant: no notification sent if no pending appointments exist for the adopted pet  
queue for retry on failure          | Notification  

### **Visit Follow-Up Notification**  
source appointment                  | Appointment  
triggering follow-up action         | Follow-Up Action  
                                    |   invariant: sent when follow-up date arrives and follow-up action type is not none  
recipient customer email            | Customer Account  
suppress when pet adopted before follow-up | Pet  
                                    |   invariant: pet-adopted-before-visit notification takes precedence if pet adopted before follow-up date  
suppress when follow-up action none | Follow-Up Action  
queue for retry on failure          | Notification  

### **Return Received Notification**  
originating order                   | Order  
returned items summary              | Returned Items  
                                    |   invariant: includes order number, returned items summary, and note that inspection and refund processing are underway  
recipient customer account email    | Customer Account  
recipient guest email               | Guest Checkout  
deliver on return status received   | Return Status  
                                    |   invariant: fires when return status transitions to "received"; must not block return processing on delivery failure  
queue for retry on failure          | Notification  

### **Refund Completed Notification**  
refunded amount                     | Refund  
payment method returned to          | Payment, Saved Payment Method  
                                    |   invariant: includes refunded amount and the payment method the credit was returned to (masked card, wallet, or BNPL adjustment)  
recipient customer account email    | Customer Account  
recipient guest email               | Guest Checkout  
deliver on refund status completed  | Refund Status  
                                    |   invariant: fires when refund status transitions to "completed"; must not fire before vendor confirmation  
queue for retry on failure          | Notification  

### **Refund Under Review Notification**  
return and order reference          | Return, Order  
support guidance                    |  
                                    |   invariant: includes guidance to contact support and a reference to the return and order details  
recipient customer account email    | Customer Account  
recipient guest email               | Guest Checkout  
deliver on refund status requires review | Refund Status, Refund Retry  
                                    |   invariant: fires when refund status transitions to "requires review"; must not fire while refund retry is still active  
queue for retry on failure          | Notification  

### **Restock Alert**  
monitored product                   | Product  
                                    |   invariant: monitors a specific product the customer has previously purchased  
monitoring customer account         | Customer Account  
last purchase date                  |  
average purchase interval           |  
next expected reorder date          |  
fire on purchase frequency signal   | Notification, Customer Account  
                                    |   invariant: fires when the current date approaches or passes the next expected reorder date  
gated by communication preferences  | Communication Preferences  
                                    |   invariant: only sent if opt-in is active for restock alerts  

### references  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: whole  

```source  
We want a proper **email and notification system**. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

**Ref — Send Return and Refund Status Update (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Send Return and Refund Status Update"  
Extract: partial  

```source  
1. WHEN the return is received and processing begins  
THEN the system sends a "return received" notification to the customer  
2. WHEN the refund is completed by the vendor  
THEN the system sends a "refund completed" notification with the refunded amount and the payment method it was returned to  
3. WHEN the refund requires manual review (vendor failure, policy exception)  
THEN the system sends a "refund under review" notification with guidance to contact support if needed  
4. WHEN the email delivery system is temporarily unavailable  
THEN the notification is queued for retry  
AND the return/refund status is still updated in the system (notification failure does not block processing)  
```  

**Ref — Increment 7 return notification stories**  
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
Locator: Increment 7  
Extract: partial  

```source  
Stories: Send Return and Refund Status Update (transactional)  
```  

### decisions made  

- Notification carries real message data: subject, body, channel, sent date, delivery status.  
- Delivery status tracks the full dispatch lifecycle: queued → sent → delivered / bounced / failed.  
- **Decomposed Notification Preferences opted-in categories** into separate opt-in flags — promotional, restock alerts, pet care tips, event notifications — matching Communication Preferences.  
- Restock Alert enriched with real purchase-frequency data: last purchase date, average interval, next expected reorder date.  
- Restock Alert tracks a specific product × customer account pairing.  
- **Increment 2 refresh (slot 51):** *Confirmation Email* introduced as transactional path; marketing and restock alert deferred.  
- **Increment 3 refresh (slot 75):** *Shipping Notification* introduced as second transactional path — fires when *tracking number* recorded; *Confirmation Email* extended with *shipping address* for standard delivery orders and *order status page* link; email retry must not block *order status* transition to shipped.  
- **Increment 4 refresh (slot 101):** *Notification* recipient includes *customer account* email for logged-in orders; *Email Verification* added as transactional trigger; verification email retry must not block registration confirmation.  
- **Increment 6 refresh (slot 153):** Four appointment notification subtypes introduced: *Appointment Confirmation Email* (triggered on booking confirmation; must not block appointment creation on failure), *Appointment Reminder* (24-hour pre-appointment trigger; suppressed when cancelled, no-show, or pet adopted), *Pet Adopted Before Visit Notification* (triggered when pet adopted with pending appointments; includes cancel and browse options; notification status visible to staff), *Visit Follow-Up Notification* (triggered on follow-up date when action type is not none; suppressed if pet adopted before follow-up date). All four follow the same retry-on-failure pattern as prior transactional notifications.  
- **Increment 7 refresh (slot 179):** Three return/refund notification types introduced: *Return Received Notification* (triggered when *return status* transitions to "received"; includes order number and returned items summary), *Refund Completed Notification* (triggered when *refund status* transitions to "completed"; includes refunded amount and masked payment method), *Refund Under Review Notification* (triggered when *refund status* transitions to "requires review" after *refund retry* exhaustion; includes support guidance). All three support both *customer account* email and *guest email* recipient paths — returns can be initiated from guest orders via *in-store return*. All three follow the same retry-on-failure pattern: delivery failure queued for retry, must not block return processing or refund status transition.  

---  

# Boundary Domain  

### **Content** *(owned by: Content Management — future module)*  
content title                       |  
publication date                    |  
content body                        |  
content author                      |  
published content surface           | Notification  
                                    |   invariant: only published content is visible to PawPlace; authoring and versioning are external concerns  

### **Admin Dashboard** *(owned by: Store Operations — future module)*  
stock level edit form               | Store, Product, Stock Availability  
                                    |   invariant: store employee selects store and product, edits stock level, submits; customer stock availability updates immediately  
click-and-collect fulfillment queue | Click-and-Collect, Order, Pickup Fulfillment  
                                    |   invariant: lists confirmed click-and-collect orders pending pickup fulfillment, sorted oldest first; shows order number, line items, guest email  
order queue                         | Order, Ship-to-Home Fulfillment, Pickup Fulfillment  
                                    |   invariant: Increment 3 — unified staff view of confirmed orders across standard delivery and click-and-collect; shows order number, line items, delivery type label, guest email; routes to ship-to-home or click-and-collect fulfillment detail  
inventory levels surface            | Product, Stock Availability  
                                    |   invariant: inventory dashboard is a Store Owner concern; stock updates are a Store Employee concern  
incoming appointments surface       | Appointment, Staff Appointment Workflow  
                                    |   invariant: live from Increment 6 — staff view of booked appointments per store; check-in, no-show, and outcome recording via Staff Appointment Workflow  
pet profile edit surface            | Pet  
                                    |   invariant: live from Increment 6 — store employees can update pet name, species, breed, age, temperament notes, photos, and hosting store assignment  
in-store return lookup              | Order, In-Store Return, Return Eligibility, Manager Override  
                                    |   invariant: Increment 7 — staff search by order number or customer email, view return eligibility, initiate return, and invoke manager override when needed  
                                    |   invariant: data and rules owned by Order; presentation owned by Store Operations  
consume events and data             | Order, Appointment, Pet, Product  
                                    |   invariant: Store Employee handles day-to-day operations; Store Owner has business oversight; Admin is platform-level (content publishing)  

### references  

**Ref — Content and blog**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 33  
Extract: whole  

```source  
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.  
```  

**Ref — Admin dashboard**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences describing the admin dashboard capabilities.  

```source  
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.  
```  

### decisions made  

- Content gains real data: title, publication date, body, author — even as a boundary concept, PawPlace needs to display this content and must know what shape it arrives in.  
- **Admin dashboard** canonical name aligned with ubiquitous language (was Store Dashboard in prior CRC pass). It surfaces data from core domain classes but does not own domain data within PawPlace's boundary.  
- **Increment 2 refresh (slot 51):** *click-and-collect fulfillment queue* in scope alongside stock level edit; appointments and pet profile surfaces deferred.  
- **Increment 3 refresh (slot 75):** *order queue* added — unified view of standard delivery and click-and-collect orders; manual tracking entry and label creation only — no automated carrier integration.  
- Three actor roles interact with the full dashboard vision: Store Employee (operations), Store Owner (business oversight), Admin (content publishing).  
- **Increment 6 refresh (slot 153):** *incoming appointments surface* and *pet profile edit surface* are now active — deferred language removed. *Staff Appointment Workflow* added as a collaborator for the appointments surface, owning the check-in, no-show, and follow-up operations as domain coordination rather than pure boundary concerns.  
- **Increment 7 refresh (slot 179):** *in-store return lookup* added — staff search by order number or customer email, view return eligibility, initiate return, and invoke manager override. Data and rules owned by *Order*; presentation owned by *Store Operations*.  


---

## increment-8 (rollup)

<!-- migrated from: end-to-end/specification/crc.md -->

# Crc


---

## marketing-engine-campaigns-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---
state: crc
sprint_scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
stories:
  - Send Promotional Email
  - Send Personalized Recommendation
  - Send Restock Alert
  - Send In-Store Event Notification
---

# Module: [Marketing Engine]

Scope: Sprint 3 — consent-gated delivery of admin *Promotional Email*, system-generated *Personalized Recommendation*, inventory-triggered *Restock Alert*, and store-matched *In-Store Event Notification*. Preference management, list enrollment, and content publishing are out of scope for this artifact — those collaborators are boundary dependencies from Sprint 2 and Sprint 4.

**Core terms**:
- marketing communication
- promotional email
- personalized recommendation
- restock alert
- in-store event notification
- in-store event

**Key Abstractions (term grouping)**:
- **Marketing Communication**: marketing communication, promotional email, personalized recommendation, restock alert, in-store event notification, in-store event

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated sending layer for promotional, personalized, and alert-based messages. This sprint owns how each message type is created or triggered, how recipients are targeted, and how *Communication Preferences* are enforced at delivery time — not at batch creation time.

### **Marketing Communication**
delivery target customer account      | Customer Account
marketing category gate               | Marketing Category, Communication Preferences
check communication preferences at delivery | Communication Preferences
                                      |   invariant: must never be sent without explicit opt-in for the relevant marketing category
                                      |   invariant: preference check must occur at delivery time, not batch creation time
route to verified customer email      | Customer Account
                                      |   invariant: guest checkout sessions cannot receive marketing communications
queue for retry on delivery failure   |
                                      |   invariant: delivery failure must queue for retry — message is not silently discarded
lifecycle: (stateless)
invariants:
  - must never be sent without explicit opt-in for the relevant marketing category
  - preference check must occur at delivery time

### **Promotional Email**
creating admin                        | (admin user)
promotional content                   | (sales, new products, seasonal offers)
target marketing category             | Marketing Category
send to marketing email list          | Marketing Email List, Communication Preferences, Customer Account
respect realtime opt-out at delivery  | Communication Preferences
include unsubscribe link              | Unsubscribe
                                      |   invariant: unsubscribe link must immediately opt customer out of promotions category on click
queue for retry on delivery failure   | Marketing Communication
                                      |   invariant: must not be delivered to customers who opted out between batch creation and delivery
lifecycle: (stateless)
invariants:
  - delivered only to marketing email list members with active promotions category opt-in

### **Personalized Recommendation**
target customer account               | Customer Account
personalization sources               | Purchase History, Browsing History, Pet Profile
target marketing category             | Marketing Category
recommended product set               | Product
generate from purchase history        | Purchase History, Product
generate from browsing patterns       | Browsing History, Product
generate from pet profile data        | Pet Profile, Product
exclude out-of-stock products         | Product, Stock Availability
send when recommendations opted in    | Communication Preferences, Customer Account
skip when no personalization data     | Customer Account, Purchase History, Browsing History, Pet Profile
                                      |   invariant: must be genuinely personalized — if no data exists to personalize against, do not send
                                      |   invariant: must never recommend an out-of-stock product
                                      |   invariant: generic suggestions are handled by promotional email, not this channel
lifecycle: (stateless)
invariants:
  - must not send when customer lacks purchase history and browsing data
  - must exclude out-of-stock products from recommendation set

### **Restock Alert**
triggering product                    | Product
stock transition signal             | Stock Availability
target wishlisted customers           | Wishlist, Customer Account
target marketing category             | Marketing Category
send when restock alerts opted in     | Communication Preferences, Customer Account
skip when product not wishlisted      | Wishlist
skip when restock category opted out  | Communication Preferences
best-effort availability signal       | Product, Product Details Page
                                      |   invariant: must not be sent to customers who have not opted in to restock alerts, even if the product is on their wishlist
                                      |   invariant: is a best-effort signal — product may go back out of stock before the customer acts
                                      |   invariant: must not send when no customer has the product on their wishlist
lifecycle: (stateless)
invariants:
  - sent only when stock availability transitions from out-of-stock to in-stock
  - requires product on customer wishlist and restock alerts category opt-in

### **In-Store Event**
event location store                  | Store
event type                            | (adoption day, grooming workshop, training session)
creating admin                        | (admin user)
scheduled event date                  |
discoverable on store detail page     | Store Details Page
                                      |   invariant: event remains visible on store detail page for walk-in discovery even when no notification is sent
lifecycle: (stateless)
invariants:
  - must be associated with exactly one store location

### **In-Store Event Notification**
source in-store event                 | In-Store Event
event location store                  | Store
target marketing category             | Marketing Category
match customer preferred store        | Store, Customer Account
send when events category opted in    | Communication Preferences, Customer Account
skip when no preferred store set      | Customer Account, Store
                                      |   invariant: must not be sent when no preferred store is set — system does not guess proximity
                                      |   invariant: must not send when event location differs from customer preferred store
                                      |   invariant: must not send without explicit opt-in for events marketing category
lifecycle: (stateless)
invariants:
  - sent only to customers whose preferred store matches event location

### references

**Ref — Email marketing and campaigns**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe. Personalised recommendations, restock alerts, in-store event notifications.
```

**Ref — Campaign and alert stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Send Promotional Email, Send Personalized Recommendation, Send Restock Alert, Send In-Store Event Notification
Extract: acceptance criteria

```source
WHEN admin creates and sends a Promotional Email
THEN the email is delivered only to customers on the Marketing Email List who have opted in to the promotions Marketing Category

WHEN a customer on the list has opted out between batch creation and delivery
THEN the email is not delivered to that customer
AND the opt-out is respected because the system checks Communication Preferences at delivery time, not at batch creation time

WHEN the system generates a Personalized Recommendation for a customer
THEN the recommendation is based on purchase history, browsing patterns, or Pet Profile data
AND it is sent only if the customer has opted in to the recommendations Marketing Category

WHEN a Product's Stock Availability transitions from out-of-stock to in-stock
THEN the system sends a Restock Alert to each customer who has the Product on their Wishlist and has opted in to the restock alerts Marketing Category

WHEN admin creates an in-store event (adoption day, grooming workshop, training session)
THEN the system sends In-Store Event Notifications to customers whose preferred Store matches the event location and who have opted in to the events Marketing Category
```

### decisions made

- *Marketing communication* is the KA class listed first — send-time consent gate, verified-email routing, and retry-on-failure apply to all four message types in this sprint (every-behavior-has-backing-responsibility).
- *Promotional email*, *personalized recommendation*, *restock alert*, and *in-store event notification* are separate classes, not subtypes — each has distinct triggering logic, targeting criteria, and invariants per UL independence test.
- *In-store event* introduced as its own class — admin creation, store association, and walk-in discoverability are distinct from the notification send path (state-carrier for event metadata).
- *Purchase history* and *browsing history* introduced as boundary collaborators for personalization — owned by Customer Account and browsing modules; this sprint only consumes them for recommendation generation (scope-fit test).
- *Restock alert* targets via *wishlist* intersection with category opt-in — wishlist membership alone is insufficient (UL invariant).
- *In-store event notification* requires exact preferred-store match — no proximity guessing; event still discoverable on *store details page* when notification is suppressed (UL invariant).
- Preference enrollment (*communication preferences*, *marketing email list*, *marketing category*) is boundary from Sprint 2 — referenced as collaborators, not re-modeled (scope-fit test).

---

# Boundary Domain

### **Communication Preferences**
marketing category opt-in statuses    | Marketing Category
check at delivery time                | Marketing Communication, Promotional Email, Personalized Recommendation, Restock Alert, In-Store Event Notification
                                      |   invariant: changes persist immediately — send path must read current state at delivery
lifecycle: (stateless)
invariants:
  - enforced at delivery time, not batch creation time

### **Marketing Category**
category name                         | (promotions, recommendations, restock alerts, events)
unit of consent for send              | Marketing Communication
lifecycle: (stateless)
invariants: (none)

### **Marketing Email List**
member customer accounts              | Customer Account, Communication Preferences
eligibility for promotional email     | Promotional Email
lifecycle: (stateless)
invariants:
  - membership requires at least one active marketing category opt-in

### **Unsubscribe**
execute via promotional email link    | Promotional Email, Communication Preferences, Marketing Email List
opt out promotions category           | Marketing Category
show confirmation page                | (you have been unsubscribed)
                                      |   invariant: must take effect immediately
                                      |   invariant: must not suppress transactional notifications
lifecycle: (stateless)
invariants:
  - email-link path produces confirmation page

### **Customer Account**
verified email delivery target        | Marketing Communication
preferred store                       | Store, In-Store Event Notification
purchase history source               | Purchase History
lifecycle: (stateless)
invariants:
  - guest sessions cannot receive marketing communications

### **Wishlist**
wishlisted products per customer      | Product, Customer Account
restock alert targeting source        | Restock Alert
lifecycle: (stateless)
invariants: (none)

### **Product**
recommended in personalized set       | Personalized Recommendation
restock alert subject                 | Restock Alert, Stock Availability
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
inventory state on product            | Product
out-of-stock to in-stock transition   | Restock Alert
exclude out-of-stock from recommendations | Personalized Recommendation
lifecycle: (stateless)
invariants:
  - transition to in-stock triggers restock alert evaluation

### **Store**
event host location                   | In-Store Event, In-Store Event Notification
customer preferred store match        | Customer Account, In-Store Event Notification
lifecycle: (stateless)
invariants: (none)

### **Pet Profile**
species breed age data                | (pet attributes)
feed personalized recommendation      | Personalized Recommendation
lifecycle: (stateless)
invariants: (none)

### **Purchase History**
past orders for customer              | Customer Account, Order
personalization input                 | Personalized Recommendation
lifecycle: (stateless)
invariants: (none)

### **Browsing History**
viewed products for customer          | Customer Account, Product
personalization input                 | Personalized Recommendation
lifecycle: (stateless)
invariants: (none)

### **Product Details Page**
display current stock status          | Product, Stock Availability
                                      |   invariant: shows updated out-of-stock status when product goes back out of stock after restock alert
lifecycle: (stateless)
invariants: (none)

### **Store Details Page**
list discoverable in-store events     | In-Store Event, Store
lifecycle: (stateless)
invariants:
  - events visible for walk-in discovery regardless of notification eligibility

### references

**Ref — Marketing communication boundaries**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: Marketing Communication KA, boundary concepts
Extract: partial

```source
Marketing Communication depends on customer account for preference storage and delivery target, on product for restock triggers, on wishlist for restock targeting, and on store for event-location matching.

Wishlist (boundary) — provides the product list used to target restock alerts — only wishlisted products trigger the alert.

Store (boundary) — provides the preferred-store match used to target in-store event notifications.

Pet profile (boundary) — provides pet-related data (species, breed, age) that feeds personalized recommendation algorithms.

Stock availability (boundary) — is the inventory state of a product whose transition from out-of-stock to in-stock triggers a restock alert.
```

**Ref — Sprint 2 preference CRC**
Source: docs/end-to-end/specification/crc.md
Locator: Marketing Communication, Communication Preferences, Marketing Email List
Extract: partial

```source
Communication preferences — per-customer opt-in record, immediate persist, category listing.

Marketing email list — membership derivation, affirmative opt-in invariant, timestamp recording.

Marketing communication — send-time gate responsibilities — must never be sent without opt-in; preference check at delivery time.
```

### decisions made

- *Communication preferences*, *marketing category*, and *marketing email list* are boundary from Sprint 2 — this sprint consumes them at send time without duplicating preference-management responsibilities (scope-fit test; aligned with preferences CRC).
- *Purchase history* and *browsing history* split as boundary inputs — personalization algorithm ownership stays outside Marketing Engine; recommendation class orchestrates reads (dependency-magnet split).
- *Unsubscribe* boundary carries email-link execution for *promotional email* — full preferences-page unsubscribe deferred to Sprint 4; send-time opt-out via link is in scope for *Send Promotional Email* AC.
- *Product details page* and *store details page* are presentation boundary — restock best-effort display and event walk-in discovery without owning inventory or event persistence (mirrors Sprint 1 *Product Details Page* pattern).

---


---

## marketing-engine-content-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---

state: crc

sprint_scope: Increment 8 Sprint 4 — Content publishing and unsubscribe

stories:

  - Publish Marketing Content

  - Unsubscribe from Marketing

---



# Module: [Marketing Engine]



Scope: Sprint 4 — *Content* authoring lifecycle (draft → published) for *Blog Post* and *Pet Care Guide*, public index and detail surfaces, species-tag cross-linking, and full *Unsubscribe* execution via signed email token and preferences toggle with idempotent confirmation. Campaign sending and preference enrollment are out of scope for this artifact — those collaborators are boundary dependencies from Sprint 2 and Sprint 3.



**Core terms**:

- content

- blog post

- pet care guide

- blog index

- guide index

- unsubscribe



**Key Abstractions (term grouping)**:

- **Content**: content, blog post, pet care guide, blog index, guide index

- **Marketing Communication**: unsubscribe, unsubscribe token



---



# Core Domain



## **Content**



*Content* is published material for on-site customer education, SEO, and marketing email fodder. This sprint owns the draft-to-published lifecycle, public read surfaces, and guide cross-linking behavior. Admin role permissions and campaign dispatch remain boundary concerns.



### **Content**

authored material for site and email | Blog Post, Pet Care Guide

lifecycle status                      | (draft or published)

publish date                          | (date when published)

title                                 | (article title)

summary                               | (index listing summary)

body                                  | (full article text)

transition draft to published         | Blog Post, Pet Care Guide

hide draft from customers               | Blog Index, Guide Index

                                      |   invariant: draft content must never be visible to customers

expose published via own URL          | Blog Post, Pet Care Guide

                                      |   invariant: published content must always be accessible via its own URL

lifecycle: (draft → published)

invariants:

  - draft content must never be visible to customers

  - published content must always be accessible via its own URL



### **Blog Post**

author attribution                    | Content Author

publish date on index                 | Blog Index, Content

save as draft                         | Content, Admin Content Area

publish to live                       | Content, Blog Index

reflect edits on live page            | Content

preserve publish date on edit         | Content

                                      |   invariant: edits to a published post must not change the publish date unless explicitly requested

display on blog index                 | Blog Index

                                      |   invariant: must display title, summary, date, and author on the blog index

display full article on detail URL    | Content

lifecycle: (draft → published)

invariants:

  - must display title, summary, date, and author on the blog index



### **Pet Care Guide**

pet type or species tags              | (dogs, cats, senior pets, specific breeds)

publish date on index                 | Guide Index, Content

save as draft                         | Content, Admin Content Area

publish to live                       | Content, Guide Index, Pet Browsing Area, Product Browsing Area

require tag before publish            | Guide Index

                                      |   invariant: must carry at least one pet type or species tag

cross-link from tagged browsing areas | Pet Browsing Area, Product Browsing Area

                                      |   invariant: must appear in relevant browsing areas matching its tags

display on guide index                | Guide Index

                                      |   invariant: must display title, summary, pet type or species tag, and date on the guide index

display full guide on detail URL      | Content

lifecycle: (draft → published)

invariants:

  - must carry at least one pet type or species tag



### **Blog Index**

published blog posts                  | Blog Post

list with title summary date author   | Blog Post

                                      |   invariant: only published blog posts appear — drafts are excluded

lifecycle: (stateless)

invariants:

  - lists published blog posts only



### **Guide Index**

published pet care guides             | Pet Care Guide

list with title summary tag date      | Pet Care Guide

                                      |   invariant: only published guides appear — drafts are excluded

lifecycle: (stateless)

invariants:

  - lists published pet care guides only



### references



**Ref — Content and blog**

Source: external-context/requirements-chat-with-product-owner.md

Locator: line 33

Extract: whole



```source

Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.

```



**Ref — Content stories**

Source: docs/end-to-end/exploration/stories/acceptance-criteria.md

Locator: Publish Blog Post, Publish Pet Care Guide

Extract: acceptance criteria



```source

WHEN Content Author creates and publishes a Blog Post

THEN the post appears on the Blog Index with title, summary, date, and author

AND the full post is accessible via its own URL



WHEN Content Author saves a Blog Post as draft

THEN the post is not visible to customers

AND the draft remains editable and publishable from the admin content area



WHEN Content Author creates and publishes a Pet Care Guide

THEN the guide appears on the Guide Index with title, summary, pet type/species tag, and date

AND the full guide is accessible via its own URL



WHEN Content Author attempts to publish a guide without any pet type or species tag

THEN the system requires at least one tag before publishing

BUT the draft is not lost — it can be saved and tagged later

```



### decisions made



- *Content* is the KA class listed first — shared draft/publish lifecycle and content-wide invariants live here; *Blog Post* and *Pet Care Guide* carry type-specific metadata and linking behavior (aligned with UL independence test — separate concepts, not subtypes).

- *Blog post* and *pet care guide* are separate classes — distinct index metadata, tag requirements, and cross-linking rules outweigh shared lifecycle (UL decision carried forward).

- *Blog index* and *guide index* introduced as collection classes — listing published items with exclusion of drafts is collection-level behavior beyond a single post or guide (collection-class rule).

- Publish-date preservation on edit modeled on *Blog Post* only — pet care guide AC does not specify date preservation; shared *Content* lifecycle handles draft visibility (every-behavior-has-backing-responsibility).

- *Content author* and *admin content area* are boundary — role permissions and staff UI owned by Store Operations; this sprint models publish lifecycle and public surfaces only (scope-fit test).



---



## **Marketing Communication**



*Marketing Communication* in this sprint covers the full *Unsubscribe* execution path deferred from Sprint 2 and Sprint 3 — signed email-link token, immediate category opt-out, idempotent confirmation, and transactional-notification isolation.



### **Marketing Communication**

carry unsubscribe link in message     | Unsubscribe, Unsubscribe Token

                                      |   invariant: every marketing communication must include a category-scoped unsubscribe link

lifecycle: (stateless)

invariants:

  - unsubscribe link must target the sending marketing category



### **Unsubscribe**

target marketing category             | Marketing Category

execute via email link                | Unsubscribe Token, Communication Preferences, Marketing Email List, Marketing Communication

execute via preferences toggle        | Communication Preferences, Marketing Email List

take effect immediately               | Communication Preferences, Marketing Email List

                                      |   invariant: must take effect immediately — no further marketing communications of that category after execution

                                      |   invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed

show confirmation after email link    | Unsubscribe Confirmation Page

                                      |   invariant: email-link path produces a you have been unsubscribed confirmation page

repeat email link idempotently        | Unsubscribe Token, Communication Preferences

                                      |   invariant: repeat clicks show the same confirmation without error — action is idempotent

lifecycle: (stateless)

invariants:

  - must not suppress transactional notifications



### **Unsubscribe Token**

signed payload account and category   | Customer Account, Marketing Category

verify on email link request          | Unsubscribe

encode account id and category        | Customer Account, Marketing Category

                                      |   invariant: token must be signed to prevent tampering with account or category

lifecycle: (stateless)

invariants:

  - token encodes exactly one marketing category per unsubscribe action



### references



**Ref — Easy unsubscribe**

Source: external-context/requirements-chat-with-product-owner.md

Locator: line 25

Extract: whole



```source

Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe.

```



**Ref — Unsubscribe story**

Source: docs/end-to-end/exploration/stories/acceptance-criteria.md

Locator: Unsubscribe from Marketing Emails

Extract: acceptance criteria



```source

WHEN the customer clicks the Unsubscribe link in any Marketing Communication

THEN the customer is immediately opted out of that Marketing Category

AND a "you've been unsubscribed" confirmation page is shown



WHEN the customer unsubscribes via the Communication Preferences page

THEN the change takes effect immediately

AND no further Marketing Communications of that Marketing Category are sent



WHEN the customer unsubscribes from all Marketing Categories

THEN Transactional Notifications (order confirmations, shipping updates, appointment reminders) are unaffected



WHEN the customer clicks an Unsubscribe link for a Marketing Category they have already unsubscribed from

THEN the confirmation page still shows "you've been unsubscribed" — the action is idempotent

BUT no error or confusing message is displayed

```



### decisions made



- *Unsubscribe token* introduced as state-carrier — signed email-link payload (account + category) is distinct from the opt-out act itself; verification and tamper protection belong on the token, not on *Unsubscribe* (introduce-state-carrier-class rule).

- Full *Unsubscribe* responsibilities consolidated here — Sprint 2 preferences CRC deferred email-link confirmation; Sprint 3 campaigns CRC carried promotional-link boundary only; Sprint 4 owns complete *Unsubscribe from Marketing* story (scope-fit test).

- Idempotent repeat execution modeled explicitly — AC requires graceful repeat clicks without error (every-behavior-has-backing-responsibility).

- *Marketing communication* retains send-time unsubscribe-link inclusion — links generated at dispatch collaborate with *Unsubscribe Token*; preference mutation remains on *Communication Preferences* boundary (explicit-chain-of-responsibility).



---



# Boundary Domain



### **Communication Preferences**

marketing category opt-in statuses    | Marketing Category

toggle category opt-in                  | Marketing Category, Marketing Email List, Unsubscribe

persist immediately on toggle           | Customer Account

                                      |   invariant: changes persist immediately — unsubscribe via preferences page uses same path as Sprint 2

lifecycle: (stateless)

invariants:

  - enforced at delivery time for marketing sends



### **Marketing Category**

category name                         | (promotions, recommendations, restock alerts, events)

unit of consent for unsubscribe       | Unsubscribe

lifecycle: (stateless)

invariants: (none)



### **Marketing Email List**

member customer accounts              | Customer Account, Communication Preferences

remove on category opt-out            | Communication Preferences, Unsubscribe

lifecycle: (stateless)

invariants:

  - membership requires at least one active marketing category opt-in



### **Customer Account**

verified email delivery target        | Marketing Communication

store communication preferences       | Communication Preferences

lifecycle: (stateless)

invariants: (none)



### **Transactional Notification**

delivery target                       | Customer Account

unaffected by marketing unsubscribe   | Unsubscribe, Notification Preferences

                                      |   invariant: order confirmations, shipping updates, and appointment reminders continue regardless of marketing opt-out

lifecycle: (stateless)

invariants:

  - marketing unsubscribe must not suppress transactional notifications



### **Notification Preferences**

transactional category settings       | Transactional Notification

                                      |   invariant: separate from communication preferences — marketing unsubscribe does not alter these settings

lifecycle: (stateless)

invariants: (none)



### **Content Author**

create edit publish content           | Content, Blog Post, Pet Care Guide, Admin Content Area

                                      |   invariant: only authenticated staff with content author role may publish

lifecycle: (stateless)

invariants: (none)



### **Admin Content Area**

present draft and publish actions     | Content Author, Blog Post, Pet Care Guide

retain editable draft                 | Content

                                      |   invariant: failed publish validation must not discard draft content

lifecycle: (stateless)

invariants: (none)



### **Unsubscribe Confirmation Page**

render unsubscribed message           | Unsubscribe

link to communication preferences     | Communication Preferences, Customer Account

lifecycle: (stateless)

invariants: (none)



### **Pet Browsing Area**

surface guides matching species tags  | Pet Care Guide, Guide Index

lifecycle: (stateless)

invariants: (none)



### **Product Browsing Area**

surface guides matching species tags  | Pet Care Guide, Guide Index

lifecycle: (stateless)

invariants: (none)



### references



**Ref — Content author boundary**

Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md

Locator: content author, Content KA decisions

Extract: partial



```source

Content author (boundary) — is the admin role that creates, edits, and publishes content — owned by the admin/operations module.



Blog index and guide index are property-level listings with no independent behavior beyond listing published items.

```



**Ref — Sprint 2 preference CRC**

Source: docs/end-to-end/specification/crc.md

Locator: Communication Preferences, Unsubscribe partial scope

Extract: partial



```source

Unsubscribe included with delta responsibilities only for sprint stories — full email-link confirmation flow deferred to Sprint 4; preferences-toggle path and transactional-notification isolation are in scope for Set Communication Preferences.



Communication preferences — per-customer opt-in record, immediate persist, category listing.

```



**Ref — Sprint 3 campaigns CRC**

Source: docs/end-to-end/specification/crc.md

Locator: Unsubscribe boundary

Extract: partial



```source

Unsubscribe boundary carries email-link execution for promotional email — full preferences-page unsubscribe deferred to Sprint 4; send-time opt-out via link is in scope for Send Promotional Email AC.

```



### decisions made



- *Communication preferences*, *marketing category*, and *marketing email list* are boundary from Sprint 2 — this sprint invokes them for unsubscribe execution without duplicating preference-management responsibilities (scope-fit test).

- *Transactional notification* and *notification preferences* are boundary from Notification module — unsubscribe isolation invariant enforced by collaboration, not by mutating transactional settings (aligned with preferences CRC).

- *Content author* and *admin content area* are boundary — Store Operations owns staff auth and editor UI; content lifecycle classes own publish rules (scope-fit test; mirrors UL).

- *Pet browsing area* and *product browsing area* are presentation boundary — tag-based cross-linking surfaces guides without owning guide persistence (mirrors Sprint 3 *Product Details Page* pattern).

- *Unsubscribe confirmation page* is presentation boundary — renders post-token confirmation without owning opt-out mutation (receiver-not-responsible-for-receiving).



---




---

## marketing-engine-preferences-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---
state: crc
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
stories:
  - Set Notification Preferences
  - Set Communication Preferences
  - Opt In to Marketing Email List
---

# Module: [Marketing Engine]

Scope: Sprint 2 — transactional *Notification Preferences* management (boundary), marketing *Communication Preferences* and *Marketing Category* opt-in, affirmative *Marketing Email List* enrollment with timestamp, and account-settings presentation. Review submission, campaign sending, and content publishing are out of scope for this artifact.

**Core terms**:
- communication preferences
- marketing category
- marketing email list
- opt-in
- marketing communication

**Key Abstractions (term grouping)**:
- **Marketing Communication**: communication preferences, marketing category, marketing email list, opt-in, marketing communication, unsubscribe

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated messaging layer. This sprint owns how customers record per-category marketing opt-in, how membership on the *Marketing Email List* is derived and timestamped, and how send-time checks respect preferences. Transactional *Notification Preferences* remain a boundary concern of the Notification module.

### **Marketing Communication**
marketing category                    | Marketing Category
delivery target customer account      | Customer Account
check communication preferences at send | Communication Preferences
                                      |   invariant: must never be sent without explicit opt-in for the relevant marketing category
                                      |   invariant: preference check must occur at delivery time, not batch creation time
route to verified customer email      | Customer Account
                                      |   invariant: guest checkout sessions cannot receive marketing communications
lifecycle: (stateless)
invariants:
  - must never be sent without explicit opt-in for the relevant marketing category
  - preference check must occur at delivery time

### **Communication Preferences**
owning customer account               | Customer Account
marketing category opt-in statuses    | Marketing Category
list categories with opt-in status    | Marketing Category
toggle category opt-in                | Marketing Category, Marketing Email List, Unsubscribe
persist immediately on toggle         | Customer Account
                                      |   invariant: changes persist immediately on toggle — no separate save action
                                      |   invariant: new marketing categories default to opt-out for every customer
                                      |   invariant: opting out of a category stops further marketing communications of that category after the toggle
offer promotional opt-in at registration | Marketing Email List, Marketing Category
offer promotional opt-in at checkout  | Marketing Email List, Marketing Category
                                      |   invariant: registration and checkout opt-in checkbox is unchecked by default
lifecycle: (stateless)
invariants:
  - new marketing categories default to opt-out
  - changes persist immediately on toggle

### **Marketing Category**
category name                         | (promotions, recommendations, restock alerts, events)
opt-in status per customer            | Communication Preferences
extensible category catalog           |
default new category to opt-out       | Communication Preferences
                                      |   invariant: new categories must default to opt-out — no broadcast without explicit opt-in for that category
lifecycle: (stateless)
invariants:
  - new categories default to opt-out

### **Marketing Email List**
member customer accounts              | Customer Account, Communication Preferences
add on affirmative category opt-in    | Communication Preferences, Customer Account
record opt-in timestamp               | Communication Preferences
remove on category opt-out            | Communication Preferences, Unsubscribe
derive membership from any opt-in     | Communication Preferences
                                      |   invariant: opt-in must always be affirmative — no customer is added without an explicit action
                                      |   invariant: membership requires at least one active marketing category opt-in
lifecycle: (stateless)
invariants:
  - opt-in must always be affirmative
  - checkbox at registration and checkout is unchecked by default

### **Opt In**
affirmative enrollment action         | Communication Preferences, Marketing Email List
recorded timestamp                    | Marketing Email List
target marketing category             | Marketing Category
lifecycle: (stateless)
invariants:
  - must be an explicit customer action — never implied or pre-checked

### **Unsubscribe**
target marketing category             | Marketing Category
execute via email link                | Marketing Communication, Communication Preferences, Marketing Email List
execute via preferences toggle        | Communication Preferences, Marketing Email List
take effect immediately               | Communication Preferences, Marketing Email List
                                      |   invariant: must take effect immediately — no further marketing communications of that category after execution
                                      |   invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed
show confirmation after email link    | (you have been unsubscribed)
lifecycle: (stateless)
invariants:
  - must not suppress transactional notifications

### references

**Ref — Email marketing and preferences**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe.
```

**Ref — Preference stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Set Notification Preferences, Set Communication Preferences, Opt In to Marketing Email List
Extract: acceptance criteria

```source
WHEN the customer opens Communication Preferences from account settings
THEN all available Marketing Categories are listed (promotions, recommendations, restock alerts, events)
AND each shows the current opt-in/opt-out status

WHEN the customer toggles a Marketing Category
THEN the change persists immediately on toggle — no separate "save" action is required
AND no Marketing Communications of an opted-out category are sent after the toggle

WHEN the customer opts in to promotional emails via Communication Preferences
THEN the customer is added to the Marketing Email List
AND the opt-in is recorded with a timestamp

WHEN the customer opts in during account registration or checkout
THEN the opt-in checkbox is unchecked by default — opt-in must be affirmative
AND if checked, the customer is added to the Marketing Email List
```

### decisions made

- *Communication preferences* is the KA class listed first — per-customer opt-in record, immediate persist, and category listing are owned here, not on *Customer Account* (independence test from UL).
- *Marketing category* earns its own class — unit of consent, extensibility, and default opt-out invariant are distinct from the preference aggregate (independence test from UL).
- *Marketing email list* earns its own class — membership derivation, affirmative opt-in invariant, and timestamp recording are collection-level behavior beyond a single toggle (collection-class rule).
- *Opt in* introduced as a stateless collaboration concept — registration, checkout, and preferences-page paths share affirmative-action and timestamp semantics without a separate lifecycle subtype (scope-fit test).
- *Unsubscribe* included with delta responsibilities only for sprint stories — full email-link confirmation flow deferred to Sprint 4; preferences-toggle path and transactional-notification isolation are in scope for *Set Communication Preferences* and *Opt In* AC.
- *Marketing communication* carries send-time gate responsibilities — supports "no send without opt-in" AC even though campaign stories are a later sprint (every-behavior-has-backing-responsibility).
- *Notification preferences* is boundary — transactional category toggles and critical-notification rules are owned by the Notification module; this sprint models the account-settings collaboration surface only (scope-fit test; aligned with UL).

---

# Boundary Domain

### **Notification Preferences**
owning customer account               | Customer Account
order updates setting                 | (on or off)
shipping setting                      | (on or off)
appointments setting                  | (on or off)
returns setting                       | (on or off)
list categories with current setting  | Transactional Notification
toggle category setting               | Transactional Notification, Customer Account
persist immediately on toggle         | Customer Account
enforce at delivery time              | Transactional Notification
protect critical categories           | Transactional Notification
                                      |   invariant: order confirmation and refund completion cannot be disabled — critical transactional notifications remain sent
                                      |   invariant: disabling all optional categories still allows critical notifications with an explanatory note
lifecycle: (stateless)
invariants:
  - critical transactional notifications cannot be suppressed

### **Transactional Notification**
notification category                 | (order updates, shipping, appointments, returns)
delivery target                       | Customer Account
respect category preference at send   | Notification Preferences
                                      |   invariant: optional follow-up notifications may respect preference; mandatory confirmations always send
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
store communication preferences       | Communication Preferences
store notification preferences        | Notification Preferences
verified email delivery target        | Marketing Communication
require login for preference pages    | Account Settings
                                      |   invariant: guest checkout sessions cannot manage communication or notification preferences on account
lifecycle: (stateless)
invariants:
  - guest sessions cannot manage account preferences

### **Account Settings**
present notification preferences      | Notification Preferences, Customer Account
present communication preferences     | Communication Preferences, Customer Account
prompt guest to log in or register    | Customer Account
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Notification preferences boundary**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: notification preferences boundary, communication preferences
Extract: partial

```source
notification preferences (boundary) — governs transactional notification settings (order updates, shipping, appointments, returns) — separate from communication preferences which govern marketing opt-in.

communication preferences — is the per-customer record of which marketing categories have active opt-in status; stored on the customer account but enforced by the marketing communication system at delivery time.

customer account (boundary) — stores the customer's communication preferences and provides the verified email delivery target for marketing communications.
```

**Ref — Set Notification Preferences story**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Set Notification Preferences
Extract: acceptance criteria

```source
WHEN the customer opens Notification Preferences from account settings
THEN the available notification categories are listed (order updates, shipping, appointments, returns)
AND each category shows the current setting (on/off)

WHEN the customer toggles a notification category
THEN the preference is saved immediately
AND future Transactional Notifications of that type respect the updated preference

WHEN the customer disables all transactional notifications
THEN critical notifications (e.g. order confirmation, refund completion) are still sent — they are non-optional
```

### decisions made

- *Notification preferences* and *Transactional Notification* are boundary — owned by the Notification module; this sprint depends on them for transactional toggle behavior and critical-category rules (scope-fit test).
- Transactional categories modeled as order updates, shipping, appointments, returns — aligned with *Set Notification Preferences* AC; distinct from marketing *Marketing Category* names (slash-terms-resolved: no conflation of notification preferences with communication preferences).
- *Account settings* introduced as presentation boundary — hosts preference pages and guest-login prompt without owning preference persistence (mirrors *Product Details Page* pattern from Sprint 1 reviews CRC).
- Critical-notification protection modeled on *Notification Preferences* with *Transactional Notification* as collaborator — enforcement at send remains on the Notification module.

---


---

## marketing-engine-reviews-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---
state: crc
sprint_scope: Increment 8 Sprint 1 — Customer reviews
stories:
  - Submit Written Review with Star Rating
  - Submit Photo Review
  - Read Customer Reviews
---

# Module: [Marketing Engine]

Scope: Sprint 1 — verified customer reviews with star ratings, optional written text and photos, aggregate social proof on the product details page, and read-side pagination and sorting. Marketing communications and content publishing are out of scope for this artifact.

**Core terms**:
- customer review
- star rating
- review photo
- aggregate star rating

**Key Abstractions (term grouping)**:
- **Customer Review**: customer review, star rating, review photo, aggregate star rating, product reviews

---

# Core Domain

## **Customer Review**

*Customer Review* is the social-proof mechanism that attaches verified customer opinions to products. Only customers who have purchased the product may author a review; each review carries a mandatory star rating, optional written text, and optional photos. Individual scores roll up into an aggregate displayed on the product details page.

### **Customer Review**
authoring customer account          | Customer Account
                                    |   invariant: must be authored by exactly one verified customer account that has purchased the product — guest checkout sessions cannot leave reviews
attached product                    | Product
                                    |   invariant: must attach to exactly one product
star rating                         | Star Rating
                                    |   invariant: must carry exactly one star rating; written text is optional
written text                        |
review photos                       | Review Photo
review date                         |
verify purchaser before submission  | Customer Account, Product
submit with star rating and text    | Customer Account, Product, Star Rating, Product Reviews, Aggregate Star Rating
attach review photos on submit      | Review Photo, Product Reviews
contribute star rating to aggregate | Product, Aggregate Star Rating
edit existing review                | Customer Account, Star Rating, Review Photo, Product Reviews, Aggregate Star Rating
remove review                       | Product Reviews, Aggregate Star Rating, Product
lifecycle: (stateless)
invariants:
  - must be authored by exactly one verified customer account that has purchased the product
  - must carry exactly one star rating between 1 and 5; written text is optional

### **Star Rating**
numeric score                       | (integer 1 through 5)
                                    |   invariant: must be an integer between 1 and 5 inclusive; no half-stars or zero stars
minimum required review input       | Customer Review
feeds aggregate computation         | Aggregate Star Rating, Product
lifecycle: (stateless)
invariants:
  - must be an integer between 1 and 5 inclusive

### **Review Photo**
image attachment on review          | Customer Review
display as inline thumbnail         | Product Details Page
expand to full size in lightbox     | Product Details Page
validate supported format and size  | Customer Review
                                    |   invariant: must be a supported image format and within configured size limits
                                    |   invariant: upload failure must not discard the parent review's written text or star rating
lifecycle: (stateless)
invariants:
  - upload failure must not discard the parent review's written text or star rating

### **Aggregate Star Rating**
derived average of star ratings     | Star Rating, Customer Review
displayed on product details page   | Product Details Page, Product
recompute on review create          | Customer Review, Product
recompute on review edit            | Customer Review, Product
recompute on review delete          | Customer Review, Product
suppress display when no reviews    | Product Details Page, Product Reviews
                                    |   invariant: must not be displayed as zero when no reviews exist — show nothing or a prompt instead
lifecycle: (stateless)
invariants:
  - must not be displayed as zero when no reviews exist

### **Product Reviews**
accumulated reviews for product     | Customer Review, Product
default sort by newest first        | Customer Review
sort by oldest                      | Customer Review
sort by highest rating              | Customer Review, Star Rating
sort by lowest rating               | Customer Review, Star Rating
paginate or lazy-load listing       | Customer Review, Product Details Page
lifecycle: (stateless)
invariants:
  - default listing order is newest first

### references

**Ref — Customer reviews and ratings**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: whole

```source
We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.
Other customers should be able to see them and they should factor into some kind of aggregate star rating on the product.
```

**Ref — Review stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Submit Written Review with Star Rating, Submit Photo Review, Read Customer Reviews
Extract: acceptance criteria

```source
WHEN a logged-in customer opens the review form on a Product Details Page
THEN the form collects a Star Rating (1–5) and an optional written review (free text)
AND the customer must have purchased the Product to access the form

WHEN the customer submits a valid Customer Review
THEN the review is associated with the Product and the customer's Customer Account
AND the review appears on the Product Details Page sorted by newest first
AND the Product's Aggregate Star Rating is recomputed to include the new Star Rating

WHEN there are many Customer Reviews
THEN the reviews are paginated or lazy-loaded
AND sort controls are provided: newest, oldest, highest rating, lowest rating
```

### decisions made

- *Customer Review* is the KA class listed first — social-proof authorship, submission, and lifecycle events are owned here, not on *Product*.
- *Aggregate star rating* earns its own class — independent computation behavior, recompute triggers, and a no-reviews display invariant (independence test from UL).
- *Review photo* earns its own class — upload validation and graceful failure isolation are distinct from written text submission (independence test from UL).
- *Product Reviews* introduced as a collection class — pagination, default sort, and sort controls are collection-level behavior beyond holding reviews (collection-class rule).
- Photo review is not a subtype of *customer review* — photos are optional attachments with no distinct moderation or lifecycle (scope-fit test; aligned with UL decisions).
- Review submission gating modeled on *Customer Review* with *Customer Account* and *Product* as collaborators — the receiver is not responsible for being verified (receiver-not-responsible rule).
- *Product details page* is boundary — presentation and form visibility live on the Product Catalog surface; core review rules stay in this module.

---

# Boundary Domain

### **Product**
attached customer reviews           | Customer Review, Product Reviews
aggregate star rating               | Aggregate Star Rating
recompute aggregate on review change | Customer Review, Aggregate Star Rating
host product details page           | Product Details Page
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
verify product purchase history     | Product
author customer reviews             | Customer Review
                                    |   invariant: only verified purchasers may create a customer review
lifecycle: (stateless)
invariants:
  - guest checkout sessions cannot leave reviews

### **Product Details Page**
display aggregate star rating       | Aggregate Star Rating, Product
list customer reviews               | Product Reviews
display review photo thumbnails     | Review Photo
open photo lightbox at full size    | Review Photo
show be the first to review prompt  | Product, Product Reviews
present review submission form      | Customer Review, Customer Account
hide form for non-purchasers        | Customer Account, Product
prompt guest to log in or register  | Customer Account
                                    |   invariant: guest prompt must not navigate away from the product details page
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Product catalog boundary**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: product, product details page boundary concepts
Extract: partial

```source
product (boundary) — is the entity a customer review attaches to and whose aggregate star rating is derived from accumulated reviews; owns the product details page where reviews are displayed.

customer account (boundary) — is the authoring identity that gates review submission — only verified purchasers of the product may create a customer review.

product details page (boundary) — is the presentation surface where customer reviews and the aggregate star rating are displayed for a product.
```

### decisions made

- *Product*, *Customer Account*, and *Product Details Page* are boundary — owned by Product Catalog and Customer Account modules; this sprint depends on them for attachment, authorship verification, and read-side presentation (scope-fit test).
- Form visibility and guest-login prompt modeled on *Product Details Page* as presentation responsibilities — purchase verification remains on *Customer Account* with *Product*.

---


---

## increment-9 (rollup)

<!-- migrated from: end-to-end/specification/crc.md -->

# Crc


---

## power-ups-pet-inventory-crc

<!-- migrated from: increments/9-power-ups/specification/crc.md -->

---
state: crc
sprint_scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
stories:
  - Create Customer Pet
  - Update Customer Pet
  - View Inventory Dashboard
  - Display Low Stock Badge
  - Allow Backorder Purchase
---

# Module: [Power-ups]

Scope: Sprint 3 — logged-in *customer pet profile* CRUD under "My Pets", and the admin *inventory dashboard* replacing the Increment 1 stock form with search, sort, filter, inline *stock level* editing, *low stock alert* badges, *inventory export*, and customer-facing *backorder purchase*. Product search, my store tailoring, and marketing campaigns are out of scope for this artifact.

**Core terms**:
- customer pet profile
- inventory dashboard
- low stock alert
- low stock threshold
- stock level
- inventory export
- backorder purchase

**Key Abstractions (term grouping)**:
- **Customer Pet Profile**: customer pet profile
- **Inventory Dashboard**: inventory dashboard, low stock alert, low stock threshold, stock level, inventory export, backorder purchase

---

# Core Domain

## **Customer Pet Profile**

*Customer Pet Profile* records the customer's own pet — name, species, breed, age or date of birth, and photo — owned by a logged-in *customer account*, listed under "My Pets", and feeding downstream personalized recommendation algorithms.

### **Customer Pet Profile**
pet name                              | (text)
species                               | (dog, cat, reptile, etc.)
breed                                 | (optional text)
age or date of birth                  | (optional)
photo                                 | (optional image)
owning customer account               | Customer Account
require logged-in customer account    | Customer Account, Account Settings
prompt guest to log in or register    | Customer Account, Account Settings
                                      |   invariant: guest sessions cannot create or persist a customer pet profile
                                      |   invariant: guest prompt must not navigate away from the current page
create with optional fields           | Customer Pet Profiles, Customer Account
update editable fields                | Customer Pet Profiles, Customer Account
persist changes immediately           | Customer Account, Customer Pet Profiles
confirm before delete                 | Customer Pet Profiles, Customer Account
feed personalization data             | (species, breed, age for downstream recommendation algorithms)
                                      |   invariant: species and breed data saved on profile feeds downstream personalized recommendation algorithms
lifecycle: (stateful)
invariants:
  - guest sessions cannot create or persist a customer pet profile
  - species and breed data feeds downstream recommendation algorithms

### **Customer Pet Profiles**
listed under my pets                  | Customer Pet Profile, Account Settings
show empty state when none            | Account Settings
support multiple profiles per account | Customer Pet Profile, Customer Account
add new profile entry                 | Customer Pet Profile, Customer Account
remove deleted profile from list      | Customer Pet Profile, Customer Account
                                      |   invariant: each pet has its own customer pet profile entry
                                      |   invariant: all profiles for the account are listed under my pets
lifecycle: (stateless)
invariants:
  - each pet has its own customer pet profile entry
  - all profiles for the account are listed under my pets

### references

**Ref — Pet profile requirements**
Source: context/requirements-chat-with-product-owner.md
Locator: line 15
Extract: partial

```source
pet profiles for their own pets
basic pet profile — name, species, breed, age
```

**Ref — Pet profile stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Create Customer Pet, Update Customer Pet (story-graph)
Extract: acceptance criteria

```source
WHEN a logged-in customer opens "My Pets" from account settings
THEN a list of their customer pet profiles is displayed (or an empty state with "add your first pet")

WHEN the customer creates a new customer pet profile
THEN the form collects: name, species, breed (optional), age or date of birth (optional), and photo (optional)
AND the profile is saved to the customer account

WHEN the customer opens a customer pet profile for editing
THEN all fields are editable: name, species, breed, age, and photo

WHEN the customer deletes a customer pet profile
THEN the profile is removed from "My Pets"
AND the deletion is confirmed with a "are you sure" prompt
```

**Ref — Customer pet profile ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: customer pet profile boundary stub
Extract: partial

```source
customer pet profile — records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)
is owned by a logged-in customer account — guest sessions are prompted to log in before creating a profile
supports multiple profiles per customer account, each listed under "My Pets"
feeds downstream personalized recommendation algorithms with species, breed, and age data
```

### decisions made

- *Customer pet profile* is the KA class listed first — field ownership, login gate, guest prompt without navigation, and personalization feed are owned here (independence test from UL).
- *Customer pet profiles* introduced as collection class — listing under "My Pets", empty state, and multi-pet support are collection-level behaviors, not entity-level (collection-class pattern from CRC skill).
- Delete confirmation modeled on *customer pet profile* with *customer pet profiles* collaboration — destructive action stays on the entity; list removal on the collection (explicit chain of responsibility).
- Personalization feed modeled as responsibility on *customer pet profile* without naming downstream recommendation engine — boundary to Marketing Engine increment (scope-fit test).

---

## **Inventory Dashboard**

*Inventory Dashboard* is the admin stock oversight interface listing all *products* at the *store staff* member's *store* with current *stock levels*, search, sort, and filter. It replaces the bare-bones Increment 1 stock form, surfaces *low stock alert* badges driven by *low stock threshold*, supports *inventory export*, and introduces *backorder purchase* relaxing the out-of-stock checkout gate.

### **Inventory Dashboard**
replacing increment one stock form     |
list products at staff store          | Store Staff, Store, Product
current stock level per product row   | Stock Level, Product
search product list                   | Product
sort by name stock level category     | Product, Category, Stock Level
filter product list                   | Product, Category, Stock Level
low stock only filter                 | Low Stock Alert, Stock Level, Product
inline stock level editing            | Stock Level, Stock Availability, Product
preserve existing stock data          | Stock Level
                                      |   invariant: transition from the prior form must not lose data
                                      |   invariant: stock edits must persist immediately and reflect in customer-facing stock availability
inventory export action               | Inventory Export, Store Staff, Store
lifecycle: (stateless)
invariants:
  - transition from the prior form must not lose data
  - stock edits must persist immediately and reflect in customer-facing stock availability

### **Low Stock Alert**
visual badge on product row           | Inventory Dashboard, Product, Stock Level
trigger below low stock threshold     | Low Stock Threshold, Stock Level
drive low stock only filter           | Inventory Dashboard, Stock Level
disappear above threshold             | Stock Level, Low Stock Threshold
supersede at zero stock level         | Stock Level, Stock Availability
                                      |   invariant: must appear on every product whose stock level is below the low stock threshold
                                      |   invariant: must disappear when the stock level is raised above the threshold
                                      |   invariant: at zero stock level the out-of-stock indicator supersedes the low stock alert badge
lifecycle: (stateless)
invariants:
  - must appear on every product whose stock level is below the low stock threshold
  - must disappear when the stock level is raised above the threshold

### **Low Stock Threshold**
configurable stock level boundary     | (non-negative integer)
determine low stock alert trigger     | Low Stock Alert, Stock Level
per product configuration             | Product
lifecycle: (stateless)
invariants:
  - determines the boundary between adequately stocked and needs attention

### **Stock Level**
numeric quantity at store             | Product, Store
determine stock availability state    | Stock Availability
trigger low stock alert               | Low Stock Alert, Low Stock Threshold
show out of stock at zero             | Stock Availability, Low Stock Alert
edit inline on inventory dashboard    | Inventory Dashboard, Stock Availability
reject negative or non-numeric input  | Inventory Dashboard
                                      |   invariant: must always be a non-negative value
                                      |   invariant: edits must propagate to customer-facing stock availability in real time
                                      |   invariant: invalid stock level updates are rejected and previous stock level remains unchanged
lifecycle: (stateful)
invariants:
  - must always be a non-negative value
  - edits must propagate to customer-facing stock availability in real time

### **Inventory Export**
csv download scoped to staff store    | Store Staff, Store
include product name category stock   | Product, Category, Stock Level
include last updated timestamp        | Stock Level
                                      |   invariant: export covers the store staff member's store only
                                      |   invariant: multi-store export is not supported in this increment
lifecycle: (stateless)
invariants:
  - export covers the store staff member's store only

### **Backorder Purchase**
relax out-of-stock purchase gate      | Stock Availability, Product
show backorder indicator on product page | Product, Stock Availability
enable add to cart when enabled       | Product, Stock Availability
show backorder label in cart          | Product
show backorder status at checkout     | Product
signal ship when restocked            | Product, Stock Availability
disable when backorder not enabled    | Stock Availability, Product
                                      |   invariant: when enabled and product is out of stock, add to cart remains available with backorder messaging
                                      |   invariant: when not enabled, out-of-stock products retain prior increment behavior — add to cart disabled
                                      |   invariant: when stock level rises above zero, normal in-stock purchase flow resumes
lifecycle: (stateless)
invariants:
  - when not enabled, existing out-of-stock gate remains
  - restocking restores normal purchase flow

### references

**Ref — Inventory management requirements**
Source: context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
store staff need a dashboard to manage inventory
```

**Ref — Inventory dashboard stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: View Inventory Dashboard, Display Low Stock Badge, Allow Backorder Purchase
Extract: acceptance criteria

```source
WHEN store staff opens the inventory dashboard
THEN all products at their store are listed with current stock levels
AND the dashboard supports search, sort (by name, stock level, category), and filter

WHEN a product's stock level falls below the configured low stock threshold
THEN a low stock alert badge is shown on that product's row
AND a "low stock only" filter is available on the inventory dashboard

WHEN store staff exports inventory data
THEN the inventory export produces a CSV with product name, category, current stock level, and last updated timestamp
AND the export covers the store staff member's store only

WHEN a product is currently out of stock and backorder purchase is enabled for that product
THEN the product page shows a "Backorder" indicator instead of "Out of Stock"
AND the "Add to Cart" action is available
```

**Ref — Inventory dashboard ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: Inventory Dashboard KA
Extract: partial

```source
Inventory Dashboard is the admin-facing stock oversight interface that replaces the bare-bones stock editing form from Increment 1, giving store staff a consolidated view of all products at their store with current stock levels, search, sort, and filter capabilities. It surfaces low stock alerts when a product's stock level falls below a configurable low stock threshold, supports inline stock level editing with immediate persist, and provides inventory export for offline analysis. The increment also introduces backorder purchase, relaxing the out-of-stock purchase gate.
```

### decisions made

- *Inventory dashboard* is the KA class listed first — list/search/sort/filter, form replacement, and data preservation invariants are owned here (independence test from UL).
- *Low stock alert*, *low stock threshold*, *stock level*, *inventory export*, and *backorder purchase* earn separate classes — each has independent invariants or cross-concept interactions per UL decisions (independence test).
- Out-of-stock indicator at zero modeled on *stock level* collaborating with *low stock alert* — Display Low Stock Badge AC #5: badge superseded by out-of-stock state (explicit chain).
- Invalid stock level rejection modeled on *stock level* — View Inventory Dashboard AC #6; previous value preserved on validation failure.
- *Backorder purchase* modeled as behavioral gate relaxation on *stock availability* via collaboration — does not redefine catalog ownership of availability state (scope-fit test).

---

# Boundary Domain

### **Customer Account**
own customer pet profiles             | Customer Pet Profile, Customer Pet Profiles
provide login identity                | Customer Pet Profile, Account Settings
persist pet profile data              | Customer Pet Profile
lifecycle: (stateless)
invariants:
  - guest sessions cannot persist customer pet profiles

### **Account Settings**
present my pets entry point           | Customer Pet Profiles, Customer Account
host pet profile create and edit      | Customer Pet Profile, Customer Pet Profiles
prompt guest to log in or register    | Customer Account, Customer Pet Profile
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

### **Store Staff**
open inventory dashboard              | Inventory Dashboard, Store
edit stock levels at assigned store   | Stock Level, Inventory Dashboard
export inventory for assigned store   | Inventory Export, Store
lifecycle: (stateless)
invariants: (none)

### **Product**
stock level subject on dashboard      | Stock Level, Inventory Dashboard
backorder purchase target             | Backorder Purchase, Stock Availability
low stock threshold configuration     | Low Stock Threshold
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
real-time availability state          | Stock Level, Product
updated by stock level edits          | Stock Level, Inventory Dashboard
purchase gate relaxed by backorder    | Backorder Purchase, Product
lifecycle: (stateless)
invariants: (none)

### **Store**
scope inventory dashboard to location | Inventory Dashboard, Store Staff
scope inventory export to location    | Inventory Export, Store Staff
lifecycle: (stateless)
invariants: (none)

### **Category**
sort dimension on inventory dashboard | Inventory Dashboard, Product
filter dimension on inventory dashboard | Inventory Dashboard, Product
column in inventory export            | Inventory Export, Product
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: customer account, store staff, product, stock availability, store, category boundary stubs
Extract: partial

```source
customer account (boundary) — stores the my store preference, owns customer pet profiles, and provides the login identity that gates preference-setting and pet profile creation.

store staff (boundary) — is the admin actor who uses the inventory dashboard to manage stock levels at their store.

product (boundary) — is the entity whose stock levels are viewed, edited, and alerted on in the inventory dashboard.

stock availability (boundary) — is the real-time availability state of a product that the inventory dashboard reflects and that backorder purchase relaxes the purchase gate for.

store (boundary) — scopes the inventory dashboard and inventory export to a single physical location.

category (boundary) — is a sort and filter dimension on the inventory dashboard and a column in the inventory export.
```

### decisions made

- *Customer account* and *account settings* are boundary — owned by Customer Account module; this sprint depends on them for pet profile ownership and My Pets presentation (scope-fit test from UL).
- *Store staff*, *product*, *stock availability*, *store*, and *category* are boundary — owned by Product Catalog and Store Operations; dashboard behaviors depend on them without redefining ownership (scope-fit test).
- *Account settings* introduced as presentation boundary for My Pets — mirrors Sprint 2 account settings pattern for guest-login prompt without navigation.

---


---

## power-ups-search-crc

<!-- migrated from: increments/9-power-ups/specification/crc.md -->

---
state: crc
sprint_scope: Increment 9 Sprint 1 — Product search and filter
stories:
  - Search Products by Keyword
  - Filter Products
---

# Module: [Power-ups]

Scope: Sprint 1 — keyword *product search* with relevance-ranked *search results*, conjunctive *filter facets* (category, pet type, brand, price range, *stock availability*), and removable *active filters* on the *product catalog* and search results page. Store preference, inventory dashboard, and pet profiles are out of scope for this artifact.

**Core terms**:
- product search
- search results
- filter facet
- active filter

**Key Abstractions (term grouping)**:
- **Product Search**: product search, search results, filter facet, active filter

---

# Core Domain

## **Product Search**

*Product Search* is the keyword-based discovery mechanism that matches *products* by name, description, *category*, or brand and produces *search results* ranked by relevance. It works alongside *filter facets* that narrow the result set on the *product catalog* or search results page.

### **Product Search**
entered keyword                     | (text entered by customer)
globally accessible entry point     |
match products by keyword           | Product Catalog, Product, Category
rank matches by relevance           | Search Results, Product
support partial keyword match       | Product, Search Results
support fuzzy keyword match         | Product, Search Results
produce search results              | Search Results, Product Catalog
show empty guidance when no match   | Search Results, Category
                                    |   invariant: must always be accessible from every page
                                    |   invariant: must never return results outside the product catalog published set
lifecycle: (stateless)
invariants:
  - must always be accessible from every page
  - must never return results outside the product catalog published set

### **Search Results**
ranked product ordering             | Product
                                    |   invariant: ordered by relevance — closest match first
narrow to active filter intersection | Active Filter, Product
show no results message             | Category
                                    |   invariant: includes suggestions — popular categories and alternative keywords when keyword matches no products
update on filter change             | Active Filter, Filter Facet, Product
                                    |   invariant: updates immediately when customer applies or removes an active filter
lifecycle: (stateless)
invariants:
  - ordered by relevance — closest match first
  - updates immediately when customer applies or removes an active filter

### **Filter Facet**
facet dimension name                | (category, pet type, brand, price range, or stock availability)
matching product count per value    | Product, Active Filter
narrow product list                 | Product Catalog, Product, Search Results, Active Filter
apply facet value as active filter  | Active Filter, Search Results, Product
combine conjunctively               | Active Filter, Filter Facet
update match counts                 | Active Filter, Product
clear all applied selections        | Active Filter, Search Results, Product
show zero matches guidance          | Active Filter, Search Results
                                    |   invariant: facet counts must always reflect the current combined filter state
                                    |   invariant: must never show stale counts after a filter change
                                    |   invariant: displays no products match your filters message with clear all filters action when combined active filters produce zero results
lifecycle: (stateless)
invariants:
  - facet counts must always reflect the current combined filter state
  - must never show stale counts after a filter change

### **Price Range Filter Facet : Filter Facet**
min-max range selection             | Product
                                    |   invariant: uses continuous min-max range rather than discrete value selections
lifecycle: (stateless)
invariants:
  - uses continuous min-max range rather than discrete value selections

### **Active Filter**
applied facet selection             | Filter Facet
removable chip display              |
remove and expand results           | Search Results, Filter Facet, Product
request clear all on zero results   | Filter Facet, Search Results
lifecycle: (stateless)
invariants:
  - removal expands the product list and recalculates remaining facet counts

### references

**Ref — Product search and filtering**
Source: context/requirements-chat-with-product-owner.md
Locator: line 3
Extract: partial

```source
We want good filtering and search — browse by category, by pet type, by brand, whatever makes sense.
```

**Ref — Search stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Search Products by Keyword, Filter Products
Extract: acceptance criteria

```source
WHEN the customer enters a keyword in the Search Bar and submits
THEN the Search Results show products whose name, description, category, or brand match the keyword
AND results are ranked by relevance (closest match first)

WHEN the customer is browsing the Product Catalog or viewing Search Results
THEN filter facets are available: category, pet type, brand, price range, and stock availability
AND each filter facet shows the count of matching products per value

WHEN the customer combines multiple filter facets (e.g. pet type = "dog" AND category = "food")
THEN the results narrow to the intersection of all active filters
AND filter facet counts update to reflect the combined state of all active filters
```

**Ref — Product Search ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: Product Search KA
Extract: partial

```source
Product Search is the keyword-based discovery mechanism that lets customers find products by name, description, category, or brand, producing search results ranked by relevance. It works alongside filter facets that narrow the result set by category, pet type, brand, price range, and stock availability, each facet showing match counts that update as filters are combined.
```

### decisions made

- *Product Search* is the KA class listed first — keyword matching, partial and fuzzy matching, global accessibility, and empty-state guidance are owned here (independence test from UL).
- *Search results* earns its own class — relevance ranking, active-filter intersection, empty-state guidance, and immediate update on filter change are live artifact behavior, not mere output of search (independence test from UL).
- *Filter facet* earns its own class — conjunctive combination, per-value match counts, count-accuracy invariant, and zero-results clear-all action are collection-level narrowing behavior (independence test from UL).
- *Active filter* earns its own class — removable chip display, expansion on removal, and clear-all trigger on zero results are distinct from the facet dimension definition (independence test from UL).
- *Price range filter facet* is a subtype of *filter facet* — min-max range selection is the only delta; narrowing and count-update contract is identical (Liskov substitution holds).
- Pet type, brand, and category are facet dimension instances — they follow the same behavior as other filter facets and do not earn separate classes (typing call: instance from UL).
- Search bar is not modeled — it is the UI entry point for *product search* with no independent domain behavior; global accessibility is an invariant on *product search* (scope-fit test from UL).
- Conjunctive filter combination and clear-all behavior modeled on *filter facet* rather than introducing an *active filters* collection — the UL names *active filter* as individual selections; group behavior stays on the facet that applies them (collection-class rule assessed; no unique supersession or sequential processing beyond conjunctive intersection).

---

# Boundary Domain

### **Product Catalog**
searchable product corpus             | Product
browsable product corpus              | Product, Filter Facet
published product set                 | Product
                                    |   invariant: product search queries only the published product set
lifecycle: (stateless)
invariants:
  - product search queries only the published product set

### **Product**
product name                          |
description                           |
brand                                 |
category membership                   | Category
stock availability state              | Stock Availability
matched by keyword search             | Product Search
filtered by facet dimension           | Filter Facet
lifecycle: (stateless)
invariants: (none)

### **Category**
category name                         |
filter facet dimension                | Filter Facet
suggest popular categories on empty search | Product Search, Search Results
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
in-stock indicator                    | Product
filter facet dimension                | Filter Facet
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Product Search boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: product, category, stock availability, product catalog boundary stubs
Extract: partial

```source
product (boundary) — is the entity matched, ranked, and filtered by product search and filter facets.

category (boundary) — is one of the filter facet dimensions used to narrow products by product type or pet type.

stock availability (boundary) — is one of the filter facet dimensions used to narrow products to only those currently in stock.

product catalog (boundary) — is the searchable corpus that product search queries and that filter facets operate over.
```

### decisions made

- *Product*, *category*, *stock availability*, and *product catalog* are boundary — owned by Product Catalog; this sprint depends on them for matching, filtering, and the searchable corpus (scope-fit test).
- Keyword matching fields (name, description, brand) modeled as boundary properties on *product* — search ranking and matching operations stay on *product search* (receiver-not-responsible rule).
- Popular category suggestions on empty search modeled as collaboration between *search results*, *product search*, and boundary *category* — category ownership stays in Product Catalog.

---


---

## power-ups-stores-crc

<!-- migrated from: increments/9-power-ups/specification/crc.md -->

---
state: crc
sprint_scope: Increment 9 Sprint 2 — Store preference and tailoring
stories:
  - Filter Stores by Availability and Specialization
  - Set My Store Preference
  - Tailor Experience to Preferred Store
---

# Module: [Power-ups]

Scope: Sprint 2 — *my store* preference on *customer account*, *tailored experience* behaviors (stock availability default, *store locator* highlight, *click-and-collect* pre-selection), and *store locator* filter dimensions (*store specialization filter*, *product availability filter*). Product search, inventory dashboard, and pet profiles are out of scope for this artifact.

**Core terms**:
- my store
- tailored experience
- store specialization filter
- product availability filter

**Key Abstractions (term grouping)**:
- **My Store**: my store, tailored experience, store specialization filter, product availability filter

---

# Core Domain

## **My Store**

*My Store* is the customer's declared preferred *store*, persisted on the *customer account* across sessions and devices, that activates a *tailored experience*. The *store locator* gains *store specialization filter* and *product availability filter* dimensions so customers can discover the right *store* before setting the preference.

### **My Store**
preferred store                       | Store
owning customer account               | Customer Account
persist across sessions and devices   | Customer Account
replace previous preference           | Tailored Experience, Store
                                      |   invariant: only one my store per customer account at any time
                                      |   invariant: setting a new store replaces the old one immediately and switches tailored experience without delay
set from store detail page            | Store, Customer Account
set from account settings             | Account Settings, Store, Customer Account
require logged-in customer account    | Customer Account, Account Settings
prompt guest to log in or register    | Customer Account, Account Settings
                                      |   invariant: guest sessions cannot set my store
                                      |   invariant: guest prompt must not navigate away from the current page
                                      |   invariant: when no my store is set, no store-specific tailoring is applied
lifecycle: (stateful)
invariants:
  - only one my store per customer account at any time
  - guest sessions cannot set my store

### **Tailored Experience**
triggering my store preference        | My Store, Customer Account
default stock availability to preferred store | Stock Availability, Product, My Store
highlight preferred store in locator  | Store Locator, My Store, Store
pre-select preferred store at checkout | Click-and-Collect, My Store, Store
keep full store list for override     | Click-and-Collect, Store
apply no tailoring when unset         | My Store
                                      |   invariant: when my store is set, stock availability on product pages defaults to the preferred store without manual selection
                                      |   invariant: when my store is set, preferred store is visually highlighted on store locator
                                      |   invariant: when my store is set, click-and-collect checkout pre-selects preferred store while full store list remains available
                                      |   invariant: when no my store is set, previous-increment default behavior is preserved
reflect preference change immediately | My Store, Stock Availability, Store Locator, Click-and-Collect
lifecycle: (stateless)
invariants:
  - no tailoring when no my store is set

### **Store Specialization Filter**
filter dimension on store locator     | Store Locator
matching store specialization value   | Store Specialization, Store
narrow store list by specialization   | Store Locator, Store
combine conjunctively with product availability filter | Product Availability Filter, Store Locator, Store
show zero matches guidance            | Store Locator
offer clear filters action            | Store Locator, Product Availability Filter
                                      |   invariant: shows only stores whose store specialization matches the customer selection
                                      |   invariant: when combined filters produce zero results, displays no stores match your filters message with clear filters action
lifecycle: (stateless)
invariants:
  - conjunctive narrowing when both filter dimensions are active

### **Product Availability Filter**
filter dimension on store locator     | Store Locator
selected product for availability     | Product
narrow store list by in-stock product  | Store, Stock Availability, Store Locator
combine conjunctively with store specialization filter | Store Specialization Filter, Store Locator, Store
                                      |   invariant: shows only stores whose stock availability for the selected product indicates the item is available
lifecycle: (stateless)
invariants:
  - conjunctive narrowing when both filter dimensions are active

### references

**Ref — Store personalization**
Source: context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: partial

```source
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.
```

**Ref — Store experience stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Filter Stores by Availability and Specialization, Set My Store Preference, Tailor Experience to Preferred Store
Extract: acceptance criteria

```source
WHEN the customer filters by store specialization (e.g. "reptile section")
THEN only stores with that declared store specialization are shown

WHEN the customer filters by product availability filter for a specific product
THEN only stores where that product is in stock are shown

WHEN a logged-in customer selects "Set as My Store" on a store detail page or from account settings
THEN the selected store is saved as the customer's my store
AND the preference persists across sessions and devices

WHEN the customer has a my store set and views a product page
THEN stock availability on the product page defaults to the preferred store

WHEN the customer has a my store set and opens the store locator
THEN the preferred store is visually highlighted

WHEN the customer has a my store set and enters checkout with click-and-collect
THEN the preferred store is pre-selected in the click-and-collect store-selection step
AND the full store list remains available for override
```

**Ref — My Store ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: My Store KA
Extract: partial

```source
My Store is the customer's declared preferred store, persisted on the customer account across sessions and devices, that activates a tailored experience: stock availability defaults to the preferred store, the store locator highlights it, and click-and-collect checkout pre-selects it. Alongside the preference, the store locator gains store specialization filter and product availability filter dimensions so customers can discover the right store before setting it.
```

### decisions made

- *My store* is the KA class listed first — single preference per account, immediate replacement, login gate, and guest prompt without navigation are owned here (independence test from UL).
- *Tailored experience* earns its own class — stock default, locator highlight, and checkout pre-selection are three distinct behaviors activated by one trigger, with a no-store-set invariant separate from preference persistence (independence test from UL).
- *Store specialization filter* and *product availability filter* earn separate classes — one narrows by store attribute, the other by per-product stock state; conjunctive combination and shared zero-results guidance are modeled on both with collaboration (independence test from UL).
- *Store specialization* is not modeled as a core class — it is a property of boundary *store* referenced by *store specialization filter* (typing call from UL).
- Guest login prompt modeled on *my store* with *account settings* collaboration — matches UL requirement to avoid navigation away; *customer account* owns identity (receiver-not-responsible).
- Immediate tailored-experience switch on preference change modeled as collaboration from *my store* to *tailored experience* and downstream surfaces — supports Set My Store AC without duplicating persistence on tailoring class.

---

# Boundary Domain

### **Store**
physical location identity            |
declared store specialization         | Store Specialization
settable as my store                  | My Store
filtered by specialization dimension  | Store Specialization Filter
filtered by product availability      | Product Availability Filter
highlighted when preferred            | Tailored Experience, Store Locator
lifecycle: (stateless)
invariants: (none)

### **Store Locator**
discovery surface for stores          | Store
host store specialization filter      | Store Specialization Filter
host product availability filter      | Product Availability Filter
highlight preferred store             | Tailored Experience, My Store, Store
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
store my store preference             | My Store
provide login identity                | My Store, Account Settings
persist preference across sessions    | My Store
                                      |   invariant: guest sessions cannot persist my store
lifecycle: (stateless)
invariants:
  - guest sessions cannot set my store

### **Click-and-Collect**
store selection step at checkout      | Store
accept pre-selected preferred store   | Tailored Experience, My Store, Store
expose full store list for override   | Store
lifecycle: (stateless)
invariants: (none)

### **Store Specialization**
declared area of expertise            | (reptile section, premium dog food)
filter dimension value                | Store Specialization Filter, Store
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
per-product per-store availability    | Product, Store
default to preferred store on product page | Tailored Experience, My Store, Product
filter stores by in-stock product     | Product Availability Filter, Product, Store
lifecycle: (stateless)
invariants: (none)

### **Product**
selected product for availability filter | Product Availability Filter
stock availability on product page    | Stock Availability, Tailored Experience
lifecycle: (stateless)
invariants: (none)

### **Account Settings**
present my store preference editor    | My Store, Customer Account
prompt guest to log in or register    | Customer Account, My Store
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

### references

**Ref — My Store boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: store, store locator, customer account, click-and-collect, store specialization, stock availability boundary stubs
Extract: partial

```source
store (boundary) — is the physical location that can be set as my store and filtered by store specialization filter and product availability filter.

store locator (boundary) — is the discovery surface where store specialization filter and product availability filter operate and where the tailored experience highlights the preferred store.

customer account (boundary) — stores the my store preference and provides the login identity that gates preference-setting.

click-and-collect (boundary) — provides the checkout store-selection step that the tailored experience pre-selects with the preferred store.

store specialization (boundary) — is a property of store — the declared area of expertise used as a filter dimension by store specialization filter.

stock availability (boundary) — is the per-product, per-store availability state used by product availability filter and defaulted by tailored experience on product pages.
```

### decisions made

- *Store*, *store locator*, *customer account*, and *click-and-collect* are boundary — owned by Store and prior increments; this sprint depends on them for filtering, persistence, highlighting, and checkout pre-selection (scope-fit test from UL).
- *Stock availability* and *product* are boundary — owned by Product Catalog; tailoring defaults and product availability filter depend on per-store stock state without redefining catalog ownership.
- *Account settings* introduced as presentation boundary — hosts preference editor and guest-login prompt without owning preference persistence (mirrors Marketing Engine Sprint 2 pattern).
- *Store specialization* modeled as boundary property stub — no independent behavior outside filter dimension (typing call from UL).

---

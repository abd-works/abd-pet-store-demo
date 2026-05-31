# Ubiquitous language

Whole-solution domain vocabulary for PawPlace.

## Core domain (Increments 1–7)

# Module: PawPlace

Concept sketch for PawPlace — an online pet store with e-commerce for pet supplies and in-store adoption visits. Term groupings aligned to `domain-terms.md` (`state: domain-terms`, slot 04 PASS). Supersedes `key-abstractions.md` for canonical vocabulary; that file remains as a domain-sketch baseline (`state: domain-sketch`).

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.

**Increment scope (Exploration Run 8):** Increment 7 — Returns and refunds. Active Key Abstractions refreshed: *Order* (*return* promoted to full lifecycle with *return request*, *return eligibility*, *return window*, *return reason*, *returned items*, *return status*, *return label*, *return QR code*, *in-store return*, *manager override*), *Payment* (*refund* refreshed with full routing lifecycle — *refund status*, *refund retry*, vendor-specific routing, *refund completion notification*), *Notification* (*return received notification*, *refund completed notification*, *refund under review notification* introduced). Supporting KAs retained unchanged from Increment 6: *Product Catalog*, *Pet*, *Appointment*, *Store*, *Customer Account*. Boundary: *admin dashboard* (*return* lookup surface). Deferred: *customer pet* CRUD (Increment 9), express/same-day delivery — vocabulary retained but behaviors outside the returns/refunds slice are not refreshed here.

**Terms**:
- **Product Catalog**
  - **product catalog** — browsable, searchable collection of pet supplies and single source of truth for product identity, pricing, categorization, stock, and reviews
  - **product** — pet supply item available for online purchase
  - **product image** — visual asset attached to a product
  - **category** — grouping that organizes products for browsing and filtering
  - **customer review** — star rating with optional text and photo attached to a product
  - **stock availability** — real-time indicator of whether a product is purchasable at a store
  - **stock level** — numeric quantity of a product held at a given store
  - **product page** — detail surface for a single product
  - **restocking** — replenishment of returned items back to stock availability after inspection
- **Pet**
  - **pet** — store animal showcased online for adoption visits, not online purchase
  - **species** — top-level animal classification (dog, cat, bird, fish, small mammal, reptile) used as the primary filter dimension in the pet gallery
  - **breed** — specific species-and-variety classification on a pet (e.g. Golden Retriever, Siamese, Betta)
  - **pet photo** — image on a pet profile showing the animal
  - **temperament assessment** — staff note on a pet's behavior and suitability
  - **health record** — medical and care history shared on a pet profile
  - **pet lifecycle event** — recorded state change in a pet's adoption status
  - **pet source** — provenance of a pet (rescued, breeder-supplied, transferred)
  - **pet lineage** — breed parentage for pedigree documentation
  - **pet profile** — online presentation of a store animal for adoption browsing
- **Appointment**
  - **appointment** — scheduled visit for a customer to meet a pet at a store; account-gated
  - **time slot** — available date-and-time window for a pet visit at a store
  - **availability slot** — alias for time slot; canonical term is time slot
  - **visit outcome** — result recorded after a completed appointment
  - **check-in** — recorded customer arrival at the store for an appointment
  - **no-show** — appointment where the customer did not arrive and did not cancel
  - **follow-up action** — staff-initiated step after an appointment concludes
  - **appointment cancellation** — customer-initiated withdrawal from a booked appointment before the visit date
  - **appointment rebooking** — replacement appointment created when a prior one is cancelled, typically after a pet is adopted
  - **staff appointments view** — store-employee surface listing all incoming appointment bookings for the store
- **Store**
  - **store** — physical retail location hosting pets, appointments, and click-and-collect pickup
  - **store locator** — map and list discovery feature for finding stores by distance and specialization
  - **map view** — geographic display of store locations on a map
  - **list view** — sequential readable list of all stores
  - **geo-coordinates** — latitude and longitude positioning a store on the map
  - **address** — street address of a store
  - **operating hours** — times when a store is open to the public
  - **contact details** — phone, email, or other ways to reach a store
  - **distance** — calculated proximity from a customer to a store
  - **postcode** — customer-entered text representing their location
  - **shared location** — device-based geolocation provided by the customer
  - **nearest-first** — sort order ranking closest stores at the top
  - **click-and-collect** — delivery option to order online and pick up at a selected store
  - **pickup store** — customer-selected store where a click-and-collect order is collected
  - **pickup fulfillment** — store-side preparation and handoff of click-and-collect orders
  - **ship-to-home fulfillment** — store-side packing and dispatch of standard-delivery orders
  - **order queue** — staff view of confirmed orders across delivery types
- **Customer Account**
  - **customer account** — persistent customer identity tying together history, preferences, and saved data
  - **account verification status** — unverified or verified state gating account-only features on a customer account
  - **customer session** — authenticated context that keeps a logged-in customer signed in across visits and devices
  - **email verification** — mandatory confirmation process before account-only features unlock
  - **verification link** — unique, time-limited link sent to confirm email ownership
  - **guest checkout** — purchase path without creating an account
  - **guest email** — contact address collected during guest checkout for order communications
  - **address book** — collection of saved addresses aggregated on the customer account
  - **saved address** — shipping or billing address stored for reuse at checkout
  - **default address** — pre-selected saved address used at checkout unless overridden
  - **wishlist** — customer-curated list of products not yet purchased
  - **wishlist item** — one saved product entry on a wishlist
  - **communication preferences** — opt-in and opt-out settings for marketing notification categories
  - **customer pet** — customer's own pet record used for recommendations and reorder timing
- **Order**
  - **order** — complete purchase lifecycle from cart through delivery or return
  - **shopping cart** — persistent container of products intended for purchase
  - **cart item** — one product entry with quantity in a shopping cart
  - **order line item** — one product with price snapshot in a confirmed order
  - **billing address** — address collected at checkout for payment and receipt purposes
  - **shipping address** — delivery destination collected at checkout for ship-to-home orders
  - **delivery option** — fulfillment method recorded on an order — *standard delivery* or *click-and-collect*
  - **standard delivery** — ship-to-home delivery option with estimated window and shipping cost
  - **order status** — lifecycle state of an order visible to customer and staff
  - **tracking number** — carrier reference entered when a ship-to-home order is dispatched
  - **order confirmation page** — post-purchase surface showing order number, items, total, and delivery details
  - **order status page** — customer-facing surface showing current *order status* and delivery or tracking details
  - **order history** — chronicle of past orders associated with a customer account
  - **reorder** — action that adds all products from a past order into the shopping cart
  - **return** — reversal of part or all of an order initiated from order history or in-store
  - **return request** — customer-submitted initiation of a return specifying items, quantities, and reason
  - **return eligibility** — gate determining whether an order or item qualifies for return based on the return window and item condition
  - **return window** — configured time period after delivery within which a return may be initiated
  - **return reason** — customer-selected or staff-recorded explanation for returning items
  - **returned items** — subset of order line items and quantities the customer is sending back
  - **return status** — lifecycle state of a return: initiated, label generated, shipped back, received, inspected, *refund* processing, completed
  - **return label** — printable PDF with return address, order number, return reference, and carrier barcode
  - **return QR code** — mobile-displayable code for carrier drop-off encoding the same return reference as the label
  - **in-store return** — store-employee-initiated return recorded against the original order when a customer brings items back physically
  - **manager override** — staff escalation allowing an in-store return to proceed when standard eligibility rules would block it
- **Payment**
  - **payment** — financial transaction for an order across integrated payment vendors
  - **payment vendor** — third-party payment processor behind unified checkout
  - **payment method selector** — checkout step presenting card, digital wallet, BNPL, and saved methods
  - **payment confirmation** — vendor signal that a payment authorization or capture succeeded
  - **vendor transaction reference** — vendor-assigned identifier recorded on a completed payment
  - **webhook callback** — asynchronous vendor notification reconciling in-flight payments
  - **saved payment method** — tokenized payment credential stored on a customer account
  - **default payment method** — pre-selected saved payment method at checkout unless overridden
  - **digital wallet** — PayNova mobile wallet payment channel
  - **buy-now-pay-later** — VaultPay installment payment channel
  - **eligibility check** — VaultPay per-transaction credit and BNPL assessment
  - **instalment plan** — VaultPay approved payment schedule presented to the customer
  - **transient error** — retryable payment failure such as timeout, vendor 5xx, or network loss
  - **hard decline** — non-retryable payment failure such as insufficient funds, fraud flag, or blocked account
  - **payment retry** — automatic re-attempt through the same payment vendor for transient errors
  - **retry window** — configured time and attempt limit governing payment retries
  - **refund** — reverse payment routed through the original payment vendor triggered by a completed return
  - **refund status** — lifecycle state of a refund visible to the customer: processing, completed, or requires review
  - **refund retry** — automatic re-attempt of a failed refund request through the same vendor API
- **Notification**
  - **notification** — transactional or marketing message delivered to a customer
  - **confirmation email** — transactional email sent when an order is confirmed, with delivery or pickup details
  - **shipping notification** — transactional email sent when a ship-to-home order ships, with tracking number
  - **appointment reminder** — transactional notification sent the day before a scheduled appointment with date, time, pet, and store details
  - **pet adopted notification** — transactional notification sent to a customer when the pet on their upcoming appointment has been adopted before the visit date
  - **visit follow-up notification** — transactional notification sent after a completed appointment with follow-up details and any next-step offer
  - **return received notification** — transactional notification sent when the returned items are received and processing begins
  - **refund completed notification** — transactional notification sent when the refund is completed by the vendor with amount and payment method details
  - **refund under review notification** — transactional notification sent when a refund requires manual review with guidance to contact support
  - **notification preferences** — category opt-in definitions enforced at delivery time
  - **restock alert** — notification when a previously purchased product is back in stock or likely needs reordering
- **content** *(boundary — owned by Content Management)*
- **admin dashboard** *(boundary — owned by Store Operations)*

Customers browse the *product catalog* and *pet* gallery online, book an *appointment* at a *store* to meet a *pet*, and purchase supplies through *order* and *payment* flows tied to their *customer account*. *Store* anchors offline operations — each *pet* lives at a *store*, *appointment* visits happen there, *click-and-collect* *order* are fulfilled on site, and *in-store return* are processed by staff. *Notification* delivers transactional *notification* unconditionally and marketing *notification* only when *communication preferences* allow. A *pet* cannot be purchased online; the only acquisition path is an in-store visit booked through *appointment*. When a *customer* initiates a *return* from *order history*, the system validates *return eligibility* within the *return window*, generates a *return label* or *return QR code*, and tracks *return status* through receipt, inspection, and *refund* completion. Every *refund* routes through the *payment vendor* that handled the original transaction; *refund status* is visible to the *customer* and *refund retry* handles vendor failures transparently.

---

# Core Domain

## Product Catalog

*Product Catalog* is the browsable and searchable collection of all pet supplies available for online purchase — the single source of truth for *product* identity, pricing, categorization, real-time *stock availability*, and the *customer review* system. It owns filtering and search so customers can narrow results by *category*, pet type, or brand without being exposed to irrelevant items. No other abstraction may duplicate *product* identity, *stock availability* truth, or *customer review* ownership. *Product Catalog* collaborates with *Order* (which reads current price at purchase time) and *Customer Account* (whose *wishlist* links back to *product*). Invariant: *product* identity, stock truth, and *customer review* ownership belong exclusively to *Product Catalog*.

### product catalog

- owns the browsable, searchable collection of pet supplies and is the single source of truth for what is available for sale
- provides filtering and search so customers can narrow results by *category*, pet type, or brand
- owns the *customer review* and rating system — reviews attach social proof directly to *product*
- collaborates with *Order* by supplying current *product* prices at purchase time and with *Customer Account* through *wishlist* links back to *product*
- **Invariant:** no other abstraction may duplicate *product* identity, *stock availability* truth, or *customer review* ownership

### product

- is a pet supply item (food, toy, bed, leash, grooming product, aquarium gear) available for purchase through the online store
- carries multiple *product images*, a description, and weight and dimensions where relevant
- belongs to at least one *category* and may belong to several simultaneously
- exposes real-time *stock availability* so checkout never surprises the customer with a backorder
- accumulates *customer reviews* that contribute to an aggregate star rating
- **Invariant:** must always belong to at least one *category*; must always expose current *stock availability*

### product image

- is a visual asset attached to a *product*, carrying a source file reference, alt text, and a display order
- composes under a single *product*, ideally covering multiple angles
- presents on the *product* detail page to support purchase decisions

### category

- organizes *product* into browsable groups — by product type, pet type, or brand
- allows a *product* to belong to multiple *category* simultaneously; *category* assignments are not exclusive
- acts as a filter facet enabling customers to narrow catalog results without scrolling through irrelevant items

### customer review

- attaches a one-to-five star rating, optional written text, and optional photo to a *product*
- aggregates with other *customer reviews* into the *product*'s star rating and review count
- shows photo reviews where a customer's pet uses the *product*, adding social proof
- **Invariant:** must be attached to exactly one *product*; only one *customer review* per *customer account* per *product*

### stock availability

- is a real-time indicator of whether a *product* is purchasable and how much quantity is available to sell at a given *store*
- computes from *stock level* at each *store* (quantity on hand minus reserved quantity)
- displays on the *product page* per *store* so a walk-in customer knows where to find the item
- gates the purchase path — a *product* that is out of stock at all stores must not offer *add to cart* (Increment 2: *cart item* quantity reflects *stock availability* at render time; checkout blocked when unavailable)
- reserves quantity when an *order* is confirmed so concurrent shoppers cannot oversell the same *stock level*
- updates immediately when *store employee* changes *stock level* via the *admin dashboard*
- **Invariant:** must always be current; stale availability that permits checkout of an unavailable *product* is a domain failure

### stock level

- *(property on stock availability)* — numeric quantity of a *product* held at a given *store*
- is edited by *store employee* through the *admin dashboard* stock form
- drives the customer-visible *stock availability* status for that *store* and *product* pair

### product page

- *(presentation surface)* — detail view for a single *product* showing name, *description*, *product images*, *category* membership, and per-store *stock availability*
- in Increment 2 exposes *add to cart* when *stock availability* permits at least one *store*; defers *customer review* and keyword search
- is reachable from *product catalog* category browsing and from the *shopping cart* for quantity review

### restocking

- is the replenishment of *stock availability* when a *returned items* passes inspection and the item is placed back into sellable inventory
- updates *stock level* at the *store* where the item was originally sourced or the designated *return* warehouse
- fires asynchronously after *return status* transitions to "inspected" — does not block the *refund* path
- **Invariant:** *stock level* increase must match returned quantity only after inspection confirms sellable condition

### Decisions made

- *Product image*, *category*, *customer review*, and *stock availability* stay under *Product Catalog*, not their own KAs — each has no meaning outside a *product* or the catalog itself (independence test).
- Filtering and search are behaviors of *Product Catalog*, not separate terms — they describe how the catalog is navigated.
- *Customer review* and *stock availability* are concepts, not properties — each carries distinct rules and interactions beyond a simple data slot.
- *Stock level* is a property on *stock availability* — it carries the numeric truth staff edit and *customers* never see raw counts in Increment 1 (independence test).
- *Product page* is a presentation surface, not a KA — it composes *product* detail and *stock availability* for one browsing session (scope-fit test).
- *Restocking* stays under *Product Catalog* — it is a *stock availability* behavior triggered by *return* inspection (scope-fit test); the trigger is owned by *Order* / *return*, the stock effect is owned here.
- Increment 2 enables *add to cart* on the *product page* when *stock availability* permits; defers *customer review* and keyword search per `thin-slicing.md`.
- Increment 1 walk-in-only behavior on the *product page* is superseded for Increment 2 scope.

### References

**Ref — Product catalog and browsing**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 3–5
Extract: partial

```source
The product catalog needs to be rich. Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews.
```

**Ref — Product catalog filtering**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 3
Extract: partial

```source
People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.
```

**Ref — Rating and reviews**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 5
Extract: partial

```source
We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing.
```

**Ref — Stock availability**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 5
Extract: partial

```source
Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.
```

---

## Pet

*Pet* is an available animal — dog, cat, bird, fish, small mammal, or reptile — showcased online as a browsable gallery organized by *species* and filterable by *breed*, but explicitly not purchasable through the site. It owns the animal's *pet profile*, including *species*, *breed*, *pet photo*, *temperament assessment*, and *health record*, and collaborates with *Store* (each *pet* is located at exactly one *store*) and *Appointment* (the call-to-action from a *pet*'s page drives the booking flow). *Pet* has its own lifecycle managed by store staff: available, adoption-in-progress, and adopted — transitions recorded as *pet lifecycle event*. The *species* grouping is the primary browsing dimension; *breed* provides fine-grained filtering within a species. Invariant: a *pet* must always be associated with exactly one *store* and exactly one *species*; a *pet*'s online presence must always lead to an *appointment* booking path and never to a purchase path.

### pet

- is an available animal classified by *species* and *breed*, showcased in a browsable gallery but explicitly not purchasable through the site
- presents a *pet profile* with *species*, *breed*, age, *pet photos*, *temperament assessment*, and *health record* details the store is comfortable sharing
- is located at exactly one *store* and shows the customer which *store* and how far away it is
- drives the *appointment* booking call-to-action — account-gated; never a purchase path
- transitions through lifecycle states managed by store staff via *pet lifecycle events*: available, adoption-in-progress, adopted
- **Invariant:** must always be associated with exactly one *store* and exactly one *species*; must never expose a purchase path

### species

- is the top-level animal classification grouping *pet* records in the gallery — dog, cat, bird, fish, small mammal, reptile
- serves as the primary filter dimension on the *pet* gallery so customers can narrow results to a single animal type before browsing *breed* details
- groups coarser than *breed* — one *species* contains many *breed* values (e.g. *species* "dog" contains Golden Retriever, Labrador, Poodle)
- shows as a gallery tab or filter facet on the customer-facing pet browsing surface
- **Invariant:** every *pet* must belong to exactly one *species*

### breed

- is a specific species-and-variety classification on a *pet* (e.g. Golden Retriever, Siamese, Betta) nested within a *species*
- provides fine-grained filtering within a *species* for customers who know the animal type they prefer
- shows on the *pet profile* alongside age, *temperament assessment*, and *health record*

### pet photo

- is an image on a *pet profile* showing the animal to prospective visitors
- composes under a *pet*; store staff upload new *pet photos* as part of managing the *pet*'s listing
- drives engagement on the *pet* gallery page

### temperament assessment

- is a store-staff note on a *pet*'s behavior and suitability — e.g., good with children, nervous around other dogs, suitable for first-time owners
- surfaces on the *pet profile* to help customers decide whether to book a visit
- updates based on staff observation over time

### health record

- captures medical and care history for a *pet* that the store is comfortable sharing — vaccinations, vet check dates, treatments
- surfaces on the *pet profile* to reassure prospective visitors
- exposes only details store staff choose to share publicly

### pet lifecycle event

- records a state change in a *pet*'s status — typically: available, adoption-in-progress, or adopted
- is recorded by store staff when a *pet*'s circumstances change
- derives the *pet*'s current status from the most recent *pet lifecycle event* and shows it on the *pet profile*

### pet source

- records the provenance of a *pet* — e.g., rescued, breeder-supplied, or transferred from another *store*
- informs store staff context and may surface on the *pet profile* where appropriate
- **Invariant:** every *pet* must trace to exactly one *pet source*

### pet lineage

- captures the *breed* parentage of a *pet* — relevant for registered pedigrees or cross-breed documentation
- may surface on the *pet profile* for customers interested in parentage when considering adoption

### pet profile

- is the online presentation of a store *pet*: its *breed*, age, *pet photos*, *temperament assessment*, *health record*, *pet source*, and *pet lineage*
- is maintained by store staff — uploading new *pet photos*, recording *pet lifecycle events* such as "adopted," and updating assessments
- drives the *appointment* call-to-action and must never expose a purchase path
- is distinct from *customer pet* — *pet profile* describes a store animal available for adoption; *customer pet* describes an animal the customer already owns

### Decisions made

- *Species*, *breed*, *pet photo*, *temperament assessment*, *health record*, *pet lifecycle event*, *pet source*, *pet lineage*, and *pet profile* stay under *Pet*, not their own KAs — each has no standalone domain meaning outside a store *pet* (independence test).
- *Species* is its own concept block under *Pet* rather than a type property — it carries distinct browsing-filter behavior (gallery facet, tab) and an invariant (every *pet* must have one) that go beyond a simple label (subtype/instance distinction applied).
- *Breed* is a subordinate concept under *Pet* (not under *Species*) because breed is an attribute of a *pet* profile, not of the species grouping itself — a *pet* carries both *species* and *breed* independently.
- *Pet* is its own KA rather than a sub-concept of *Product Catalog* because *pet* explicitly cannot be purchased online — the rule "you cannot buy a pet online" creates a fundamentally different interaction model (scope-fit test).
- **Canonical naming resolved:** `pet profile` (Pet KA) is the store animal's online presentation; `customer pet` (Customer Account KA) is the customer's own pet record. The term `pet profile` in `key-abstractions.md` under Customer Account is superseded by `customer pet`.
- *Pet source* and *pet lineage* were introduced in the CRC pass; provenance and pedigree apply where relevant.
- Increment 6 activates the full pet gallery and appointment booking flow; *species* and *breed* browsing filters are live in this increment.

### References

**Ref — Pets and in-store visits**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 7
Extract: partial

```source
What we're offering is the ability to browse available animals — dogs, cats, birds, fish, small mammals, reptiles — and then register an appointment to come visit them in store. The online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing.
```

**Ref — Admin pet management**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

**Ref — CRC Pet Source provenance**
Source: docs/end-to-end/specification/crc.md
Locator: ### Pet Source / decisions made
Extract: partial

```source
Pet Source
supplier type                      |
supplier name                      |
supplier location                  |
supplier phone                     |
supplier email                     |
intake date                        |
provenance documentation           |
                                   |   invariant: every pet must trace to exactly one source
```

**Ref — CRC Pet Lineage pedigree**
Source: docs/end-to-end/specification/crc.md
Locator: ### Pet Lineage / decisions made
Extract: partial

```source
Pet Lineage
sire                               | Pet
dam                                | Pet
pedigree documentation             |
generation depth                   |
```

**Ref — Increment 6 pet gallery and species filter**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 6
Extract: partial

```source
Outcome: The adoption side goes live. Customers browse the pet gallery, see which store a pet is at and how far away it is, and book an appointment to visit.
Stories: Browse Pets by Species, View Pet Profile, View Pet Store Location and Distance
```

---

## Appointment

*Appointment* is a scheduled visit for a customer to meet a specific *pet* at a specific *store* — the mechanism that enforces the rule that *pet* cannot be purchased sight-unseen. It is **account-gated**: only authenticated *customer account* holders may book. It owns the full booking lifecycle: selecting a *time slot* (also referred to as *availability slot*), optionally adding a visit note, confirming the booking, tracking through *check-in*, recording *visit outcome*, handling *no-show* and *appointment cancellation*, and enabling *appointment rebooking* when the original *pet* has been adopted. The *staff appointments view* surfaces all bookings for a store to support check-in and outcome recording. *Appointment* collaborates with *Pet* (the animal being visited and its adoption status), *Store* (location and available *time slot*), *Customer Account* (booking history and account gate), and *Notification* (*appointment reminder*, *pet adopted notification*, *visit follow-up notification* delivery). Invariant: an *appointment* must always reference exactly one *pet* and one *store*, must always have a confirmed date and *time slot*, must be accessible to store staff, and must only be bookable by a verified *customer account*.

### appointment

- binds a verified *customer account*, a *pet*, and a *store* into a scheduled visit — **account-gated**: guest sessions cannot book
- captures a date, *time slot*, and optional visit note (e.g., "I have two kids under five")
- triggers an *appointment reminder* the day before and surfaces on the *staff appointments view*
- records in the *customer account*'s appointment history (past and upcoming)
- tracks through *check-in*, *visit outcome*, *no-show*, *appointment cancellation*, or *appointment rebooking*
- sends *pet adopted notification* to the customer when its *pet* transitions to adopted before the visit date
- **Invariant:** must reference exactly one *pet* and one *store*; must have a confirmed date and *time slot*; must only be created by a verified *customer account*

### time slot

- is an available date-and-time window for a *pet* visit scoped to a specific *store*'s operating hours
- presents to the customer during the booking flow, filtered by *store* and date
- becomes unavailable to other customers once booked for an *appointment*
- releases back to available when an *appointment* is cancelled before the visit date

### availability slot

- is an alias for *time slot* — both terms appear in source material; *time slot* is the canonical term in this model

### visit outcome

- records the result of a completed *appointment* — for example, adoption agreed, not a match, or follow-up requested
- is recorded by store staff after the customer's visit
- feeds into the customer's *appointment* history and informs any *follow-up action* the store initiates

### check-in

- records a customer's physical arrival at the *store* for their *appointment*
- transitions the *appointment* from scheduled to in-progress
- is triggered by store staff when the customer presents at the desk

### no-show

- marks an *appointment* where the customer did not arrive within the expected window and did not cancel
- is recorded by store staff to release the *time slot* and update the *appointment* history
- may trigger a *notification* to the customer with a rebooking offer

### follow-up action

- is a store-staff-initiated step after an *appointment* — for example, scheduling a second visit, sending care information, or referring to another *store*
- attaches to the *visit outcome* and is tracked per *appointment*
- triggers a *visit follow-up notification* when the staff logs the action with customer-visible content

### appointment cancellation

- is a customer-initiated withdrawal from a booked *appointment* before the visit date
- releases the *time slot* back to available so another customer may book it
- records the cancellation in the *customer account*'s appointment history
- may be prompted by the customer themselves or offered automatically when a *pet adopted notification* is delivered

### appointment rebooking

- is a replacement *appointment* created after the original is cancelled, typically offered to the customer when their booked *pet* has been adopted before the visit date
- links to the cancelled *appointment* for history and context
- follows the same booking flow as a new *appointment* — the customer selects a new *pet*, *store*, and *time slot*
- **Invariant:** must reference a newly selected *pet* and *time slot*; must not re-use the *time slot* released by the prior *appointment cancellation*

### staff appointments view

- is the store-employee surface listing all incoming *appointment* bookings for the *store*, sorted by upcoming date
- shows each *appointment*'s customer name, *pet* name, date, *time slot*, and current status (upcoming, checked-in, visit complete, no-show, cancelled)
- flags *appointment* records where the associated *pet* has been adopted — staff see a "pet adopted" warning on those rows
- supports *check-in*, *visit outcome* recording, and *no-show* marking from within the view

### Decisions made

- *Time slot*, *visit outcome*, *check-in*, *no-show*, *follow-up action*, *appointment cancellation*, *appointment rebooking*, and *staff appointments view* stay under *Appointment*, not their own KAs — each exists only in the context of booking or completing a visit (independence test).
- *Availability slot* is an alias for *time slot* — the canonical term is *time slot*; a stub heading `### availability slot` is present to satisfy the italic-terms-resolve rule; noted in the Terms list.
- Visit note is an attribute of an *appointment*, not a separate term — it has no independent domain meaning.
- *Appointment cancellation* and *appointment rebooking* are full concepts, not simple state flags — each carries distinct behavior (releasing time slots, history recording, linking prior bookings) that passes the active-verb test.
- *Staff appointments view* is a concept, not a boundary term — it is owned by *Appointment* domain behavior, not *admin dashboard* (scope-fit test: the data and rules for what staff see belong here; rendering belongs to Store Operations).
- Confirmation and reminder delivery are behaviors delegated to *Notification*, but *Appointment* owns the trigger.
- Increment 6 activates the full appointment lifecycle including staff workflow, cancellation/rebooking, and all three transactional notification types.

### References

**Ref — Appointment booking system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 9
Extract: partial

```source
When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children."
```

**Ref — Track Visit Outcomes (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: epic "Book Pet Visit" / sub-epic "Track Visit Outcomes"
Extract: partial (acceptance_criteria pending exploration)

```source
{
  "name": "Record Visit Outcome",
  "acceptance_criteria": []
}
```

**Ref — Cancel or Rebook Appointment After Pet Adoption (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Cancel or Rebook Appointment After Pet Adoption" / acceptance_criteria item 4
Extract: partial

```source
4. **WHEN** the customer neither cancels nor rebooks before the appointment date
**THEN** the appointment remains in the system but staff see a "pet adopted" warning on their incoming appointments view
**AND** the appointment is treated as a no-show after the date passes
```

**Ref — Increment 6 appointment lifecycle stories**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 6
Extract: partial

```source
Stories: Confirm Appointment Booking (account-gated), View Upcoming and Past Appointments,
Cancel or Rebook Appointment After Pet Adoption, View Incoming Appointments (store employee),
Check In Customer, Record Visit Outcome, Record No-Show, Set Follow-Up Action
```

---

## Store

*Store* is a physical retail location that anchors the offline dimension of PawPlace — it hosts *pet*, conducts *appointment* visits, and fulfills both *click-and-collect* and *ship-to-home* *order*. It owns its identity and operational details: address, geo-coordinates, operating hours, contact details, and any specializations. The *store locator* is a first-class discovery feature offering map and list views with distance calculation from a customer's shared location or entered postcode. *Store* collaborates with *Pet* (each *pet* is located at exactly one *store*), *Appointment* (*time slot* scoped to a *store*), and *Order* (*pickup fulfillment* and *ship-to-home fulfillment*). Invariant: a *store* must always have a valid address, geo-coordinates, and operating hours; a *click-and-collect* *order* must reference a specific *store* for pickup.

### store

- holds identity and operational details: address, geo-coordinates, operating hours, contact info, and specializations
- hosts *pet* and provides *time slot* for *appointment* booking
- fulfills *click-and-collect* orders when selected as the pickup location
- calculates distance from the customer's shared location or entered postcode
- tailors the browsing experience when set as the customer's preferred store
- **Invariant:** must always have a valid address, geo-coordinates, and operating hours

### store locator

- provides *map view* and *list view* of all *store* without requiring search or filtering in Increment 1
- calculates *distance* from the customer's *shared location* or entered *postcode* and sorts *nearest-first* when location is provided
- shows all stores in default order when no location is provided
- displays each *store*'s *address*, *operating hours*, and *contact details* when selected on either view
- positions each *store* on the *map view* at its *geo-coordinates*
- in later increments supports filtering by specialization and "my store" preference (requires *customer account*)

### map view

- *(property on store locator)* — geographic display of all *store* locations as selectable points at their *geo-coordinates*
- shows *distance* next to each point when the customer has provided location
- is fully accessible without a *customer account* in Increment 1

### list view

- *(property on store locator)* — sequential readable list of all *store* entries with name and *address*
- shows *distance* next to each entry when the customer has provided location
- is fully accessible without a *customer account* in Increment 1

### geo-coordinates

- *(property on store)* — latitude and longitude positioning the *store* on the *map view*
- **Invariant:** every *store* must have valid *geo-coordinates*

### address

- *(property on store)* — street address of the *store* shown in *list view* and the store detail panel

### operating hours

- *(property on store)* — times when the *store* is open to the public; shown in the store detail panel

### contact details

- *(property on store)* — phone, email, or other reachability information; shown in the store detail panel

### distance

- *(computed value)* — proximity from the customer's provided location (*shared location* or *postcode*) to each *store*
- recalculates when the customer changes location input
- sorts *store* results *nearest-first* when present

### postcode

- *(customer input)* — text the customer enters to represent their location for *distance* calculation

### shared location

- *(customer input)* — device-based geolocation the customer opts to share for *distance* calculation

### nearest-first

- *(sort order)* — ranking of *store* results with smallest *distance* first

### click-and-collect

- is one of two *delivery option* choices in Increment 3 — order online and pick up at a customer-selected *pickup store*
- records the chosen *pickup store* on the *order* at checkout; no *shipping address* is required
- saves on shipping costs and brings the customer into the physical *store*
- triggers *pickup fulfillment* — *store employee* prepares items and marks the *order* ready, then confirms handoff when the customer collects
- moves the *order* lifecycle through *confirmed* → *ready for pickup* → *collected* for click-and-collect paths
- **Invariant:** must reference a specific *pickup store* as the collection location

### pickup store

- *(property on click-and-collect)* — the *store* the customer selects at checkout for order collection
- displays on the *order confirmation page* and in the *confirmation email* with *address* and *operating hours*

### pickup fulfillment

- is the store-side workflow for preparing and handing off *click-and-collect* *order*
- surfaces pending *order* in the *click-and-collect queue* on the *admin dashboard*, sorted oldest first
- transitions an *order* from *confirmed* to *ready for pickup* when *store employee* marks items prepared
- transitions an *order* from *ready for pickup* to *collected* when *store employee* confirms customer handoff
- shows *guest email* on the queue so staff can contact the customer when stock issues arise at preparation time
- **Invariant:** preparation and handoff must occur at the *pickup store* recorded on the *order*

### click-and-collect queue

- *(presentation surface on admin dashboard)* — staff view of confirmed click-and-collect *order* pending *pickup fulfillment*
- lists *order* number, *order line item* details, and customer *guest email* or name

### order queue

- *(presentation surface on admin dashboard)* — unified staff view of confirmed *order* across *standard delivery* and *click-and-collect*
- lists *order* number, *order line item* details, delivery type label, and customer *guest email* or name
- routes *store employee* to ship-to-home or click-and-collect fulfillment detail per *delivery option*

### ship-to-home fulfillment

- is the store-side workflow for packing and dispatching *standard delivery* *order*
- surfaces pending ship-to-home *order* in the *order queue* on the *admin dashboard*, sorted oldest first alongside *click-and-collect* *order*
- shows the *shipping address* and items to pack when *store employee* selects a shipping *order*
- transitions an *order* from *confirmed* to *fulfilled* when *store employee* marks items packed and ready for dispatch
- prompts for a *tracking number* at fulfillment time — recommended but not blocking in Increment 3
- triggers *shipping notification* when a *tracking number* is entered at fulfillment or added later
- transitions *order status* from *fulfilled* to *shipped* when dispatch is confirmed with *tracking number*
- **Invariant:** packing and dispatch must reflect the *shipping address* recorded on the *order*

### Decisions made

- *Store locator* stays under *Store*, not its own KA — it is the discovery mechanism for *store* and has no domain meaning independent of *store* data (independence test).
- *Map view*, *list view*, *geo-coordinates*, *address*, *operating hours*, *contact details*, *distance*, *postcode*, *shared location*, and *nearest-first* are properties, inputs, or computed values on *store locator* / *store* — not separate KAs (independence test).
- *Click-and-collect* is placed under *Store* rather than *Order* because the *store* is the fulfillment point; *Order* records *click-and-collect* as a *delivery option* choice in Increment 3.
- *Pickup store*, *pickup fulfillment*, *click-and-collect queue*, and *ship-to-home fulfillment* stay under *Store* — each describes store-side fulfillment mechanics (independence test).
- *Ship-to-home fulfillment* parallels *pickup fulfillment* — distinct packing/dispatch workflow with *tracking number* and *shipping address* dependencies (independence test).
- Increment 3 *click-and-collect* remains valid alongside *standard delivery*; express and same-day shipping deferred per `thin-slicing.md`.

### References

**Ref — Store locator**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: whole

```source
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.
```

**Ref — Click-and-collect fulfillment (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Prepare Click-and-Collect Orders for Pickup" / acceptance_criteria item 2
Extract: partial

```source
2. **WHEN** *Store Staff* marks an order as "prepared" (items gathered and ready for customer)
**THEN** the order status transitions from *Confirmed* to *Ready for Pickup*
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

---

## Customer Account

*Customer Account* is the persistent identity that ties together a person's entire relationship with PawPlace — their *order history*, *wishlist*, *address book* of *saved address*, *saved payment method* (via *Payment*), and *appointment* history (live from Increment 6), *communication preferences*, and *customer pet*. In Increment 5 authenticated customers continue to select *saved payment method* at the *payment method selector* — now spanning *StripeWave*, PayNova, and VaultPay vendor tokens alongside registration, login, logout, password reset, mandatory *email verification*, and reliable *customer session* management across devices live since Increment 4, all alongside *guest checkout*. Authenticated customers persist *shopping cart* across devices, select *saved address* and *saved payment method* at checkout, view *order history*, manage *wishlist*, and *reorder* past purchases. *Customer Account* collaborates with *Order* (*order history*, *reorder*, checkout with saved entities), *Payment* (*saved payment method* selection and multi-vendor token storage), *Product Catalog* (*wishlist* links to *product*), and *Notification* (verification email). Invariant: a *customer account* must always have a unique, verified email before account-only features unlock; *customer session* management must be reliable across devices without frequent arbitrary expiry; *guest checkout* remains available without requiring an account.

### customer account

- registers via email and password, creating an *account verification status* of unverified until *email verification* completes
- authenticates via login and logout; supports password reset with session invalidation on password change
- maintains one or more *customer session* across devices without frequent arbitrary expiry
- aggregates *order history*, *appointment* history, *wishlist*, *address book*, *saved payment method*, and preferred *store*
- retroactively associates prior *guest checkout* *order* placed with the same email when the customer later registers
- drives account-only features — *wishlist*, *saved address*, *saved payment method*, *order history*, *reorder* — only after *email verification* succeeds
- **Invariant:** must always have a unique, verified email before account-only features unlock; *customer session* management must be reliable across devices

### customer session

- is the authenticated context created when a customer logs in successfully
- persists across visits on the same device until logout, inactivity timeout, or password reset
- allows multiple concurrent sessions per *customer account* across different devices
- invalidates on logout for the current device; supports "log out everywhere" to invalidate all sessions
- merges guest *shopping cart* into the account cart when login follows guest browsing
- **Invariant:** unverified accounts must not receive a *customer session* with account-only feature access

### email verification

- is the mandatory confirmation process that transitions *account verification status* to verified on the *customer account*
- sends a *verification link* to the registered email when an account is created or when resend is requested
- queues for retry when email delivery is temporarily unavailable
- blocks login and account-only features until the customer confirms ownership
- **Invariant:** account-only features must not unlock until *email verification* succeeds

### verification link

- *(property on email verification)* — unique, time-limited, one-time-use link in the verification email
- expires after a configured window (for example 24 hours) and offers resend when expired or already used

### account verification status

- *(type property on customer account)* — unverified or verified label gating account-only features
- remains unverified until the customer completes *email verification* via a valid *verification link*
- blocks *customer session* creation with account-only access when unverified

### guest checkout

- allows a customer to complete a purchase without creating a *customer account*
- collects *guest email*, name, and *billing address* for every transaction; collects *shipping address* when *standard delivery* is selected
- remains available alongside logged-in checkout — registration and login are optional paths, not prerequisites
- promotes *customer account* creation after purchase by surfacing the value of *order history*, *saved address*, and *reorder* — prompt is dismissible and does not block the completed *order*
- **Invariant:** guest details must not persist beyond the transaction; only the *order* record retains *guest email* and address snapshots for communications

### guest email

- *(property on guest checkout)* — email address collected during checkout for *confirmation email* and staff outreach on *pickup fulfillment*
- **Invariant:** must be valid before checkout advances to *payment*

### address book

- aggregates all *saved address* on a *customer account* for reuse at checkout and in account settings
- designates one *default address* pre-selected on the shipping step unless the customer chooses another
- accepts new entries from checkout ("save this address") and from account settings management

### saved address

- is a shipping or billing address stored in the *address book* for reuse across future *order*
- allows customers to hold multiple *saved address* and select among them at checkout
- pre-fills the checkout shipping step when selected; supports edit and delete from account settings
- **Invariant:** deleting the *default address* requires selecting a new default when other *saved address* remain

### default address

- *(property on saved address)* — the *saved address* pre-selected on the shipping step at checkout
- is assigned automatically to the first *saved address*; customer may change default in account settings

### wishlist

- is a customer-curated list of *product* the customer is interested in but has not yet purchased
- persists across *customer session* as part of the *customer account*
- links back to the *Product Catalog* for current price and *stock availability*
- requires a logged-in, verified *customer account* — guest customers see a login prompt instead
- **Invariant:** must be owned by exactly one *customer account*; guest sessions do not have *wishlist*

### wishlist item

- is one *product* entry on a *wishlist* with current catalog price and *stock availability* at display time
- adds to *shopping cart* without removing itself from the *wishlist* until explicitly removed
- **Invariant:** must reference exactly one *product* on one *wishlist*

### communication preferences

- governs what marketing *notification* a customer receives — promotional emails, *restock alert*, pet care tips, and event notifications
- offers granular opt-in and opt-out by category
- is stored on the *customer account* but enforced by *Notification* at delivery time
- **Invariant:** marketing *notification* must never be sent without explicit opt-in for the relevant category within *communication preferences*

### customer pet

- is the customer's own pet record held within their *customer account*: name, *breed*, age, and dietary needs
- powers smart behaviors such as reorder reminders when purchase frequency suggests the customer is likely running low on food
- enables personalized recommendations based on the customer's existing animals
- is distinct from *pet* (Pet KA) — a *customer pet* describes an animal the customer already owns; a *pet* is a store animal available for adoption

### Decisions made

- *Customer session*, *email verification*, *verification link*, *address book*, *default address*, and *wishlist item* stay under *Customer Account*, not their own KAs — each has no meaning outside the account context (independence test).
- Increment 4 refreshes registration, login, logout, password reset, *email verification*, *customer session*, *address book*, *saved address*, *wishlist*, and checkout integration with saved entities — *customer pet* CRUD and *communication preferences* UI remain deferred per `thin-slicing.md`.
- Increment 5 extends *saved payment method* association to PayNova wallet tokens and VaultPay identity tokens — lifecycle remains owned by *Payment*; *customer account* stores associations and presents selection at the *payment method selector*.
- Increment 6 activates the account-gate on *appointment* booking — only verified *customer account* holders may book; the appointment history (past and upcoming) surfaces in the account view. No structural change to *Customer Account* KA; account-gate and appointment history are behaviors of the collaboration between *Customer Account* and *Appointment*.
- Increment 3 statements that registration, login, *saved address*, and *saved payment method* are deferred are superseded for Increment 4 scope; *guest checkout* coexists with authenticated checkout.
- **Canonical naming confirmed:** `customer pet` replaces the `pet profile` label used in `key-abstractions.md` for the customer's own pet record. `pet profile` is reserved for the store animal's online presentation under the Pet KA.
- Authentication behaviors (login, logout, password reset) remain on *customer account* and *customer session*, not separate KAs.
- *Saved payment method* lifecycle is owned by *Payment*; *customer account* stores the association and presents selection at checkout.

### References

**Ref — User accounts**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: partial

```source
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.
```

**Ref — Authentication**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 15
Extract: partial

```source
For authentication, we're doing standard username and password authentication — registration, login, logout, password reset, email verification, session management, the works. Nothing exotic, just solid and reliable. If someone's logged in on their phone they shouldn't get randomly kicked out every ten minutes.
```

**Ref — Shopping and guest checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
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

**Ref — Log In (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Log In" / acceptance_criteria item 1
Extract: partial

```source
1. **WHEN** the customer submits valid credentials on the *Login Form*
**THEN** a *Session* is created
**AND** the customer is redirected to their previous page or account dashboard
```

**Ref — Save Delivery Address (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Save Delivery Address" / acceptance_criteria item 1
Extract: partial

```source
1. **WHEN** a logged-in customer completes checkout with a new shipping address
**THEN** the system offers a "save this address for future orders" option
**AND** if accepted, the address is stored in the customer's *Address Book*
```

**Ref — Manage Wishlist (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Manage Wishlist" / acceptance_criteria item 5
Extract: partial

```source
5. **WHEN** a guest customer tries to add to wishlist
**THEN** a prompt to log in or register is shown, explaining that wishlists require an account
```

**Ref — Notification preferences**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

---

## Order

*Order* is the complete purchase lifecycle from the moment a *customer* commits to buying through delivery or pickup, and now through *return* and *refund* completion. In Increment 7 the *return* path activates: from *order history* a *customer* submits a *return request* against eligible items, the system validates *return eligibility* within the *return window*, generates a *return label* and *return QR code*, and tracks *return status* through receipt, inspection, and *refund* processing. *In-store return* provides the same lifecycle through a *store employee* with *manager override* for edge cases. The purchase path begins with the *shopping cart* — session-scoped for guests, account-persistent for logged-in *customer*s — proceeds through *guest checkout* or authenticated checkout (*saved address*, *saved payment method* selection), *payment* via the *payment method selector* (*StripeWave*, *PayNova*, or *VaultPay*), and ends with *order* confirmation, fulfillment, status tracking, *order history*, and potential *return*. *Order* collaborates with *Payment* (each *order* triggers *payment* processing; *return* triggers *refund* routing), *Customer Account* (*order history*, *reorder*, *return* visibility, saved-entity checkout), *Store* (*pickup fulfillment*, *ship-to-home fulfillment*, and *in-store return*), *Product Catalog* (price and *stock availability* at purchase time; *restocking* on *return* inspection pass), and *Notification* (*confirmation email*, *shipping notification*, *return received notification*). Invariant: an *order* must always have at least one *order line item*, a *delivery option*, a *billing address*, a completed *payment*, and either a *shipping address* (*standard delivery*) or a *pickup store* (*click-and-collect*).

### order

- captures the complete purchase: *product* via *order line item*, quantities, *billing address*, *delivery option*, and *payment*
- records *shipping address* when *standard delivery* is selected — from manual entry, *saved address* selection, or *default address* pre-fill for logged-in customers; records *pickup store* when *click-and-collect* is selected
- associates with a *customer account* when the purchaser is logged in; retains *guest email* snapshot for guest *order*
- moves through a click-and-collect lifecycle: placed → confirmed → ready for pickup → collected
- moves through a ship-to-home lifecycle: placed → confirmed → fulfilled → shipped → delivered
- exposes current *order status* on the *order status page* — guest lookup by *order* number and *guest email*, or direct access from *order history* when logged in
- triggers *confirmation email* and displays the *order confirmation page* when *payment confirmation* succeeds
- carries *tracking number* and estimated delivery date once *ship-to-home fulfillment* dispatches the *order*
- provides the source record for *reorder* from *order history*
- provides the entry point for *return* — the "Return" action appears on eligible *order* in *order history* when *return eligibility* is satisfied
- **Invariant:** must have at least one *order line item*, a *delivery option*, a *billing address*, a completed *payment*, and either a *shipping address* or a *pickup store* matching the chosen *delivery option*

### shopping cart

- accumulates *cart item* with quantities that a customer intends to purchase
- persists across devices and *customer session* for logged-in *customer account* customers
- remains session-scoped for guest customers until login merges the guest cart into the account cart
- validates *cart item* quantities against current *stock availability* at render time
- transitions to checkout when the customer commits to buying — *guest checkout* or authenticated checkout with saved entities
- **Invariant:** *cart item* quantity must be at least one; duplicate *product* entries merge by incrementing quantity

### cart item

- is one entry in the *shopping cart* — a specific *product* at a specific quantity
- tracks the quantity chosen by the customer and reflects current *stock availability* at render time
- **Invariant:** quantity must be at least one

### order line item

- records one *product*, its quantity, and its price at the time of purchase within a confirmed *order*
- captures the price snapshot at purchase time so subsequent *product* price changes do not affect historical *order*
- **Invariant:** must capture the price at the moment the *order* is confirmed, not the current catalog price; quantity must be at least one

### billing address

- is the address collected at checkout for payment verification and receipt purposes
- is required on every *order* regardless of *delivery option*
- pre-fills *shipping address* when the customer selects "same as billing" on the shipping step
- may be selected from *saved address* for logged-in customers or entered manually
- is copied onto the confirmed *order*; guest path does not persist beyond the *order* snapshot
- **Invariant:** required fields must be complete before checkout advances to *payment*

### shipping address

- is the delivery destination collected at checkout when *standard delivery* is selected
- collects name, address line 1, address line 2 (optional), city, county or region, postcode, and country
- pre-fills from *billing address* when the customer selects "same as billing"; individual field overrides replace only the changed field
- pre-fills from a selected *saved address* or *default address* for logged-in customers; guest customers use manual entry only
- is skipped entirely when *click-and-collect* is the chosen *delivery option*
- is copied onto the confirmed *order* and shown in the order summary for review
- may be saved to the *address book* when the logged-in customer opts in at checkout
- **Invariant:** required fields must be complete before checkout advances from the shipping step; must not be required for *click-and-collect* *order*

### delivery option

- records the fulfillment method on the *order*
- in Increment 4 offers *standard delivery* and *click-and-collect* — express and same-day shipping deferred to later increments
- determines whether *shipping address* or *pickup store* is required on the *order*
- records shipping cost on the *order* when *standard delivery* is selected

### Standard delivery *is a type of* delivery option

- ships *order* to the customer's *shipping address* with an estimated delivery window and shipping cost
- is the sole ship-to-home option in Increment 4 — express and same-day deferred per `thin-slicing.md`
- confirms the *shipping address* entered or selected in the prior checkout step as the delivery destination
- triggers *ship-to-home fulfillment* after *payment confirmation*
- **Invariant:** must always reference a complete *shipping address* on the *order*

### tracking number

- is the carrier reference *store employee* enters when dispatching a ship-to-home *order*
- is recommended at *ship-to-home fulfillment* time but not blocking — staff may add it later via order detail
- triggers *shipping notification* to the *order* recipient email when entered at fulfillment or added after the fact
- transitions *order status* from *fulfilled* to *shipped* when dispatch is confirmed
- links to the carrier tracking page on the *order status page*
- **Invariant:** must belong to exactly one ship-to-home *order*; duplicate entry replaces the prior value

### order status

- *(property on order)* — current lifecycle state visible to customer on the *order status page* and to staff on the *order queue*
- reflects *confirmed*, *ready for pickup*, or *collected* on click-and-collect paths
- reflects *confirmed*, *fulfilled*, *shipped*, or *delivered* on ship-to-home paths
- updates when *pickup fulfillment*, *ship-to-home fulfillment*, or carrier delivery events occur — no push notification for intermediate changes in Increment 4

### order confirmation page

- *(presentation surface)* — post-purchase view showing *order* number, *order line item* list, total paid, masked *payment* method, and delivery details
- shows *pickup store* *address* with *operating hours* for *click-and-collect* *order*
- shows *shipping address* and shipping cost for *standard delivery* *order*
- displays even when *confirmation email* delivery is queued — the *order* is not blocked by email failure
- prompts guest customers to create a *customer account* for *order history* and *reorder*

### order status page

- *(presentation surface)* — customer-facing view of *order status*, itemized contents, and delivery or tracking details
- is reachable from links in *confirmation email* and *shipping notification*, via guest lookup with *order* number and *guest email*, or from *order history* when logged in
- displays *tracking number* with carrier link and estimated delivery date when *order status* is *shipped* or *delivered*
- indicates that tracking will be available once the *order* ships when *order status* is *confirmed* or *fulfilled*
- **Invariant:** guest lookup must match both *order* number and *guest email* — no order details leak to unrelated emails

### order history

- is the chronicle of all *order* associated with a *customer account*, most recent first
- lists each *order* with number, date, condensed items, total, and current *order status*
- opens full *order* detail including *order line item*, addresses, *delivery option*, masked *payment* method, and *tracking number* when present
- retroactively includes prior guest *order* placed with the same email as the registered account
- provides the entry point for *reorder*
- **Invariant:** must be accessible only to logged-in, verified *customer account* holders

### reorder

- adds all *product* from a selected past *order* into the *shopping cart* with original quantities
- merges with existing *cart item* — duplicate *product* quantities sum
- skips delisted *product* with a clear message while adding available items — partial *reorder* succeeds
- adds *out of stock* *product* with a stock warning and proceed-or-remove choice on the line
- navigates the customer to the *shopping cart* for review before checkout
- **Invariant:** must source *order line item* from an *order* in the customer's *order history*

### return

- reverses part or all of an *order*, initiated by the *customer* from their *order history* (online) or by a *store employee* via *in-store return*
- validates *return eligibility* — checks that the *order* is within the *return window* and items are in acceptable condition before allowing the *customer* to proceed
- captures a *return request* specifying *returned items*, quantities, and *return reason*
- generates a *return label* (PDF) and a *return QR code* on successful submission — both shown on the *return* confirmation page and emailed to the *customer*
- tracks *return status* through lifecycle: initiated → label generated → shipped back → received → inspected → *refund* processing → completed
- triggers *refund* routing through the original *payment vendor* when items are received and inspection passes (or *return* is auto-approved)
- supports partial *return*s — items already returned show as "*return* in progress" and cannot be returned again; remaining eligible items are still returnable
- reflects in the *customer account* under the *order* detail regardless of whether initiated online or in-store
- **Invariant:** must reference exactly one originating *order*; *returned items* must reference *order line item* from that *order*; the *refund* must always route through the *payment vendor* that handled the original transaction

### return request

- is the *customer*-submitted initiation of a *return* specifying which *order line item* to *return*, their quantities, and a *return reason*
- creates the *return* record, links it to the originating *order*, and shows next steps (label generation)
- surfaces the *return status* in the *customer account* under the *order* detail immediately after submission
- **Invariant:** must be made against an *order* that passes *return eligibility*; items already in "*return* in progress" are excluded

### return eligibility

- determines whether an *order* or specific *order line item* qualifies for *return* based on the *return window* and item *category* rules
- hides or disables the "*Return*" action on the *order* with a clear reason when the *order* is outside the *return window* or items are not eligible
- is evaluated per item — some items in an *order* may be eligible while others are not
- **Invariant:** ineligible items must show a clear reason; the "*Return*" action must not appear on an *order* whose *return window* has expired

### return window

- is a configured time period after delivery (or collection for *click-and-collect*) within which a *return* may be initiated
- is checked by *return eligibility* when the *customer* selects "*Return*" on an *order* in *order history*
- varies by *product* *category* or promotional conditions (configuration, not domain logic)

### return reason

- is a *customer*-selected or staff-recorded explanation for *returning items* — e.g. wrong size, damaged in transit, not as described, changed mind
- is captured on the *return request* and stored on the *return* record
- informs inspection policy — some reasons (e.g. damaged in transit) may qualify for auto-approval without physical inspection

### returned items

- is the subset of *order line item* and quantities the *customer* is sending back within a single *return*
- must reference *order line item* from the originating *order* — cannot *return* items not on the *order*
- tracks per-item *return status* separately when items are inspected individually
- **Invariant:** returned quantities cannot exceed original ordered quantities minus any previously returned quantities for the same *order line item*

### return status

- is the lifecycle state of a *return* visible to *customer* and staff: initiated, label generated, shipped back, received, inspected, *refund* processing, completed
- updates when *return label* is generated, carrier scan confirms shipment, warehouse receipt is recorded, inspection completes, and *refund* is processed
- surfaces on the *order* detail within *order history* and on the *order status page*

### return label

- is a printable PDF generated when a *return request* is submitted successfully
- includes *return* *address*, *order* number, *return* reference, and carrier barcode
- is shown on the *return* confirmation page and emailed to the *customer*
- **Invariant:** must encode the same *return* reference as the *return QR code*

### return QR code

- is a mobile-displayable code generated alongside the *return label* for carrier drop-off
- encodes the same *return* reference as the *return label* so either can be used at a drop-off point
- is shown on the *return* confirmation page and emailed to the *customer*

### in-store return

- is a *return* initiated by a *store employee* when a *customer* brings items back to a physical *store*
- uses an *order* lookup by *order* number or *customer* email on the staff dashboard to locate the original *order*
- follows the same *refund* routing invariant as online *return*s — the *refund* routes through the original *payment vendor*
- reflects in the *customer account* under the *order* detail just as online *return*s do
- supports guest *order* *return*s using *order* number and *guest email* — *refund* routing is *order*-level, not account-level
- **Invariant:** must be recorded against the original *order*; must route *refund* through the original *payment vendor*

### manager override

- is a staff escalation action on the *admin dashboard* allowing an *in-store return* to proceed when standard *return eligibility* rules would block it (e.g. outside *return window*, wrong item condition)
- requires explicit manager approval before the *return* proceeds — not available on the online self-service path
- records the approving manager and override reason for audit

### Decisions made

- *Shopping cart*, *cart item*, *order line item*, *billing address*, *shipping address*, *delivery option*, *tracking number*, *order confirmation page*, *order status page*, *order history*, *reorder*, and *return* stay under *Order*, not their own KAs — each exists only in the purchase lifecycle (independence test).
- *Standard delivery* is a subtype of *delivery option* — adds ship-to-home behavior, shipping cost, and *shipping address* dependency (subtype delta rule).
- *Order status* is a property on *order* — lifecycle labels vary by *delivery option* but share one status slot on the *order* (type property pattern).
- Increment 4 refreshes logged-in checkout with *saved address* and *saved payment method* selection, account-persistent *shopping cart*, *order history*, and *reorder*.
- Increment 7 activates the full *return* lifecycle: *return request* submission, *return eligibility* gating, *return label* / *return QR code* generation, *return status* tracking, *in-store return* with *manager override*, and *refund* routing. Supersedes all "deferred to Increment 7" language.
- *Return request*, *return eligibility*, *return window*, *return reason*, *returned items*, *return status*, *return label*, *return QR code*, *in-store return*, and *manager override* stay under *Order*, not their own KAs — each exists only in the *return* lifecycle within the purchase context (independence test).
- *In-store return* is a full concept, not a property of *return* — it carries distinct behavior (staff lookup, *manager override*, guest-*order* support) that passes the active-verb test.
- *Manager override* is a full concept — it carries distinct escalation behavior, audit recording, and conditional availability rules (active-verb test).
- *Return label* and *return QR code* are separate concepts, not a single "label or QR" concept — each has distinct format, generation rules, and usage context (at home vs. at drop-off point).
- Increment 3 guest-only checkout statements are superseded for Increment 4 scope; *guest checkout* coexists with authenticated checkout.
- *Guest checkout* owns the *guest checkout* entry; *Order* owns the confirmed purchase record, *address* snapshots, lifecycle states, *order history*, *reorder*, and *return*.
- *Click-and-collect* and *ship-to-home fulfillment* core behaviors are owned by *Store*; *Order* records addresses, *delivery option*, *tracking number*, and *order status*.

### References

**Ref — Shopping cart persistence**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).
```

**Ref — CRC Cart Item state-carrier**
Source: docs/end-to-end/specification/crc.md
Locator: ### Cart Item / decisions made
Extract: partial

```source
Cart Item
product in cart                     | Product
quantity                            |
                                    |   invariant: must be at least one
unit price at time of adding        |
line price                          |
```

**Ref — CRC *Order Line Item* price snapshot**
Source: docs/end-to-end/specification/crc.md
Locator: ### *Order Line Item* / Product Catalog decisions made
Extract: partial

```source
Order Line Item
ordered product                     | Product
product name snapshot               |
SKU snapshot                        |
unit price snapshot                  |
                                    |   invariant: must capture the price at the moment the order is confirmed, not the current catalog price
quantity                            |
                                    |   invariant: must be at least one
```

**Ref — Checkout delivery options**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
Checkout flow: shipping address, billing address, delivery options (standard, express, maybe same-day for local), and then payment.
```

**Ref — Returns and exchanges**
Source: context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.
```

**Ref — Initiate *Return* from *Order History* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: epic "*Return* Products" / sub-epic "Initiate *Return*" / story "Initiate *Return* from *Order History*"
Extract: partial

```source
1. WHEN the customer selects "Return" on an eligible order in Order History
THEN the system shows which items in the order are Return Eligible
AND the customer selects the items and quantities to return, plus a return reason
```

**Ref — Generate *Return Label* or QR Code (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Generate *Return Label* or QR Code" / acceptance_criteria item 1
Extract: partial

```source
1. WHEN the Return Request is submitted
THEN the system generates a Return Label (PDF) and a Return QR Code
AND both are shown on the return confirmation page and emailed to the customer
```

**Ref — Process In-Store *Return* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Process In-Store *Return*" / acceptance_criteria items 1–4
Extract: partial

```source
1. WHEN a customer brings an item to the store for return
THEN the staff dashboard provides an order lookup by order number or customer email
AND a "Start Return" action is displayed on the matched order
4. WHEN the item is not eligible for return (outside window, wrong condition)
THEN the staff dashboard shows the ineligibility reason
AND a "Manager Override" action is displayed, requiring manager approval before the return proceeds
```

**Ref — View *Order History* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "View *Order History*" / acceptance_criteria item 1
Extract: partial

```source
1. **WHEN** a logged-in customer opens *Order History*
**THEN** all orders associated with the account are listed, most recent first
**AND** each row shows the *Order Summary*: order number, date, items (condensed), total, and current status
```

**Ref — Increment 7 returns and refunds scope**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 7
Extract: partial

```source
Outcome: Customers can initiate a return from their order history, get a printable label or QR code, and watch the refund land back on their original payment method. In-store returns are reflected in the customer's account too.
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.
```

**Ref — Reorder Previous Purchase (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Reorder Previous Purchase" / acceptance_criteria item 1
Extract: partial

```source
1. **WHEN** the customer selects "Reorder" on a past order in *Order History*
**THEN** all products from that order are added to the *Shopping Cart* with their original quantities
**AND** the customer is taken to the cart to review before checkout
```

**Ref — Select Saved *Address* at Checkout (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Select Saved *Address* at Checkout" / acceptance_criteria item 1
Extract: partial

```source
1. **WHEN** a logged-in customer reaches the shipping step during checkout
**THEN** the *Address Selector* shows all *Saved Addresses* from the *Address Book*
**AND** the *Default Address* is pre-selected
```

**Ref — Increment 4 returning customers scope**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 4
Extract: partial

```source
Outcome: Customers can register, log in, save addresses and payment methods, see their order history, manage a wishlist, and one-click reorder.
Slicing notes: Email + password only — no social login. Email verification mandatory.
```

---

## Payment

*Payment* handles the financial transaction for every *order* through a unified *payment vendor* abstraction. In Increment 7 the *refund* lifecycle activates end-to-end: when a *return* is received and inspection passes, *Payment* initiates the *refund* through the original *payment vendor*, tracks *refund status* (processing → completed or requires review), and handles vendor failures via *refund retry*. *StripeWave* (credit and debit card), *PayNova* (*digital wallet*), and *VaultPay* (*buy-now-pay-later*) are all active at checkout via the *payment method selector* and all three vendor *refund* APIs are routable. *Payment* owns vendor integration, *webhook callback* reconciliation, *payment confirmation*, *payment retry* for *transient error* failures, *hard decline* handling without automatic retry, tokenized *saved payment method* lifecycle across vendors, and *refund* routing. *Payment* collaborates with *Order* (each *order* triggers exactly one *payment* flow; each *return* triggers *refund* routing), *Customer Account* (*saved payment method* association and *default payment method* selection), and *Notification* (*refund completed notification*, *refund under review notification* triggers). Invariant: a *payment* must always be associated with exactly one *order*; no *order* is confirmed without successful *payment confirmation*; *saved payment method* stores only vendor tokens, never raw credentials; every *refund* routes through the *payment vendor* that captured the original charge; *refund* amount must match the *returned items* value.

### payment

- is the financial transaction triggered by a confirmed *order*
- in Increment 5 processes through *StripeWave*, *PayNova*, or *VaultPay* selected at the *payment method selector*
- records the processing *payment vendor* and *vendor transaction reference* on successful capture
- handles *webhook callback* reconciliation when the *customer*-facing request times out — for any active vendor
- initiates *payment retry* automatically when a *transient error* occurs within the *retry window*
- surfaces *hard decline* reasons immediately without automatic retry and offers alternative *payment vendor* options
- continues *payment retry* in the background when the *customer* navigates away from checkout
- **Invariant:** must always be associated with exactly one *order*; must not confirm the *order* until *payment confirmation* succeeds

### payment vendor

- is an integrated third-party *payment* processor behind the unified checkout experience
- in Increment 5 exposes *StripeWave*, *PayNova*, and *VaultPay* through the *payment method selector*
- handles *webhook callback*, *payment confirmation*, and vendor-specific approve or decline mechanics invisible to the *customer*
- tokenizes credentials for *saved payment method* storage — raw card numbers and wallet secrets never persist on the *customer account*
- each vendor owns its own decline semantics — PawPlace surfaces the reason and offers alternatives without overriding vendor decisions

### payment method selector

- presents *StripeWave* card entry, *PayNova* *digital wallet*, *VaultPay* *buy-now-pay-later*, and saved methods at the checkout *payment* step
- pre-selects the *default payment method* for logged-in *customer account* holders when one exists
- on decline or retry exhaustion displays alternative vendors and manual entry options without confirming the *order*
- **Invariant:** must always offer at least *StripeWave*; must not confirm the *order* until the selected vendor returns *payment confirmation*

### StripeWave *is a type of* payment vendor

- credit and debit card gateway — primary card processor since Increment 2
- receives card details entered at checkout or a *saved payment method* token and returns *payment confirmation* or decline reason
- participates in *payment retry* for *transient error* failures through the same card authorization path

### PayNova *is a type of* payment vendor

- *digital wallet* integration supporting one-tap mobile wallet authorization
- redirects to or embeds *PayNova* wallet authentication so the *customer* authorises with mobile wallet credentials
- returns *payment confirmation* with *vendor transaction reference* or a decline reason (insufficient balance, wallet locked, etc.)
- offers save-as-*saved payment method* for logged-in *customers* — stores a *PayNova* vendor token, not wallet secrets
- participates in *payment retry* for *transient error* failures through the same *PayNova* session

### VaultPay *is a type of* payment vendor

- *buy-now-pay-later* integration for larger basket values
- redirects to or embeds *VaultPay*'s BNPL flow and performs an *eligibility check* per transaction
- presents an *instalment plan* when *VaultPay* approves; records *vendor transaction reference* and instalment reference on capture
- declines are *VaultPay*'s decision — PawPlace surfaces unavailability and offers *StripeWave* and *PayNova* alternatives
- offers save-as-*saved payment method* for logged-in *customers* — pre-fills *VaultPay* identity but still requires *eligibility check* each transaction
- participates in *payment retry* for *transient error* failures through the same *VaultPay* session

### digital wallet

- is a property of *PayNova* — the mobile wallet *payment* channel distinct from card entry
- authorises *payment* through *PayNova* wallet credentials rather than typed card details

### buy-now-pay-later

- is a property of *VaultPay* — the installment *payment* channel distinct from immediate card or wallet capture
- requires *eligibility check* and *customer* acceptance of an *instalment plan* before *payment confirmation*

### eligibility check

- is performed by *VaultPay* during BNPL checkout to assess credit and transaction eligibility
- must complete before an *instalment plan* is presented — approval is per transaction, not permanent

### instalment plan

- is the *VaultPay*-approved *payment* schedule presented to the *customer* before BNPL capture
- carries installment count, installment amount, and schedule — owned by *VaultPay*; PawPlace records the reference on the *payment*

### payment confirmation

- is the vendor signal that authorization, capture, and settlement succeeded for an *order*
- triggers *order* transition to confirmed and fires *confirmation email*
- **Invariant:** must arrive from the same *payment vendor* that initiated the charge

### vendor transaction reference

- is the vendor-assigned identifier recorded on a completed *payment*
- enables *webhook callback* reconciliation and future *refund* routing to the correct vendor API

### webhook callback

- is the asynchronous *notification* from a *payment vendor* reconciling an in-flight *payment* after timeout or disconnect
- updates *payment* status and either confirms or leaves unpaid the associated *order*
- applies uniformly across *StripeWave*, *PayNova*, and *VaultPay*
- **Invariant:** must reconcile against the pending *payment* for exactly one *order*

### transient error

- is a retryable *payment* failure — vendor timeout, HTTP 5xx, or network interruption
- triggers automatic *payment retry* through the same *payment vendor* within the *retry window*
- displays a "retrying *payment*" indicator without requiring manual *customer* action during automatic retries

### hard decline

- is a non-retryable *payment* failure — insufficient funds, card or wallet blocked, fraud flag, or BNPL eligibility failure
- must not trigger automatic *payment retry* — PawPlace surfaces the decline reason and alternative *payment vendor* options immediately

### payment retry

- re-attempts a failed *payment* through the same *payment vendor* when the failure was a *transient error*
- runs automatically up to a configured maximum attempt count within the *retry window*
- continues in the background when the *customer* navigates away — success confirms the *order* and fires *confirmation email*
- on exhaustion notifies the *customer* and returns the *payment method selector* with all vendor options
- **Invariant:** must never retry a *hard decline*; must always use the same *payment vendor* as the original attempt

### retry window

- is a property of *payment retry* — the configured time and attempt limit governing automatic retries
- exhaustion ends automatic retries and surfaces manual alternatives at the *payment method selector*

### saved payment method

- is a tokenized record of a *payment vendor* credential stored on the *customer account* for reuse at checkout
- in Increment 5 supports *StripeWave* card tokens, *PayNova* wallet tokens, and *VaultPay* identity tokens
- presents at checkout with vendor-appropriate display — last four digits and card type for cards, wallet provider for *PayNova*, BNPL label for *VaultPay*
- may be saved during checkout when the logged-in *customer* opts in ("save this *payment method*")
- supports multiple methods per account with one *default payment method* pre-selected
- **Invariant:** must store only a vendor token — never raw card numbers or wallet secrets on the *customer account*

### default payment method

- *(property on saved payment method)* — the *saved payment method* pre-selected at the *payment method selector* for logged-in *customers*
- is assigned to the first saved method unless the *customer* changes default in account settings

### refund

- reverses a *payment* by routing the transaction back through the original *payment vendor* API when a *return* is received and inspection passes (or the *return* is auto-approved)
- in Increment 7 the full lifecycle activates: *refund* is triggered by *return* completion, routes through the vendor that captured the original charge (*StripeWave* card *refund*s, *PayNova* wallet credits, *VaultPay* *instalment plan* adjustments), and tracks *refund status* visible to the *customer*
- handles vendor failure through *refund retry* — the *refund* is queued for automatic re-attempt; *customer* sees "*refund* processing" rather than "*refund* failed"
- escalates to "requires review" when *refund retry* exhausts — *customer* is guided to contact support; support team has full *return* and *refund* details
- is invisible to the *customer* in terms of vendor mechanics; the *customer* sees only *refund status* and the *payment* method the credit lands on
- **Invariant:** must always route through the *payment vendor* that handled the original transaction; *refund* amount must match the *returned items* value

### refund status

- is the lifecycle state of a *refund* visible to the *customer*: processing, completed, or requires review
- transitions to processing when *return* inspection passes and the *refund* request is sent to the *payment vendor*
- transitions to completed when the *payment vendor* confirms the credit has been issued
- transitions to requires review when *refund retry* exhausts without vendor confirmation — triggers *refund under review notification*
- surfaces on the *order* detail within *order history* and on the *order status page*
- shows a timing expectation note ("*refund*s typically take X business days depending on your *payment* provider") while in processing state
- **Invariant:** must not show "*refund* failed" to the *customer* — processing or requires review are the only non-success states visible

### refund retry

- re-attempts a failed *refund* request through the same *payment vendor* API when the vendor is temporarily unavailable (timeout, API error)
- follows the same resilience pattern as *payment retry* for checkout — automatic, within a configured window
- on exhaustion transitions *refund status* to "requires review" and triggers *refund under review notification*
- **Invariant:** must always use the same *payment vendor* as the original *refund* attempt; must not surface vendor failure to the *customer* as "*refund* failed"

### Decisions made

- *StripeWave*, *PayNova*, and *VaultPay* are all active *payment vendor* subtypes in Increment 5 — Increment 4 sole-vendor deferral superseded for this scope.
- *Payment method selector* is its own concept because it owns multi-vendor presentation and decline fallback UX distinct from any single vendor integration.
- *Transient error* and *hard decline* are separate concepts — automatic retry applies only to the former (independence test).
- *Payment retry* owns retry policy; *retry window* is a property stub on it.
- *Eligibility check* and *instalment plan* stay under *Payment* as *VaultPay*-specific concepts, not a separate KA.
- *Digital wallet* and *buy-now-pay-later* are type-property stubs on their vendor subtypes — same behavior family, different channel label.
- *Refund* routing foundation landed in Increment 5; Increment 7 activates the full *customer*-facing lifecycle with *refund status* tracking and *refund retry*.
- *Refund status* is its own concept, not a property of *refund* — it carries distinct lifecycle rules, *customer*-facing visibility behavior, timing notes, and escalation triggers that pass the active-verb test.
- *Refund retry* is its own concept, not merged into *payment retry* — while the resilience pattern is similar, *refund retry* operates on a different lifecycle event (post-*return* inspection, not checkout) and carries its own exhaustion semantics (escalation to "requires review" vs. returning the *payment method selector*).
- *Vendor transaction reference* is a property-like concept on *payment* because it carries distinct reconciliation identity across vendors.

### References

**Ref — *Payment* vendors and checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
We're integrating with three payment vendors out of the box: StripeWave, PayNova, and VaultPay. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases. The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.
```

**Ref — Process Digital Wallet *Payment* via PayNova (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Process Digital Wallet *Payment* via PayNova"
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

**Ref — Retry Failed *Payment* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Retry Failed *Payment*"
Extract: partial

```source
WHEN a Payment fails due to a Transient Error (timeout, vendor 5xx, network issue)
THEN the system automatically retries the payment through the same Payment Vendor
AND the customer sees a "retrying payment" indicator — no manual action required
```

**Ref — Returns and *refund* routing**
Source: context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.
```

**Ref — Route *Refund* through Original *Payment Vendor* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Route *Refund* through Original *Payment Vendor*" / acceptance_criteria items 1, 5
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

**Ref — Track *Refund Status* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Track *Refund Status*" / acceptance_criteria items 1–4
Extract: partial

```source
1. WHEN the customer views the Order Detail for a returned order
THEN the Refund Status is visible: processing, completed, or requires review
2. WHEN the Refund is completed by the vendor
THEN the Refund Status transitions to Completed
AND the customer receives a "refund completed" notification (email)
```

**Ref — Increment 5 thin slice**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 5
Extract: partial

```source
Outcome: Customers can pay with PayNova (mobile wallet) and VaultPay (buy-now-pay-later) in addition to StripeWave. Failed payments retry automatically across all three.
Slicing notes: Proves the payment vendor abstraction generalises beyond StripeWave. Refund routing is in scope so Increment 7 can build cleanly.
```

**Ref — Increment 7 *refund* routing design rule**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 7
Extract: partial

```source
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since. Online return flow first; in-store return reconciliation second.
```

**Ref — Save *Payment Method* (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Save *Payment Method*" / acceptance_criteria item 1
Extract: partial

```source
WHEN a logged-in customer completes a payment during checkout
THEN the system offers a "save this payment method for future orders" option
AND if accepted, a Token from the payment vendor is stored — never the raw card number
```

---

## Notification

*Notification* is the communication layer that delivers both transactional and marketing messages to *customers*. In Increment 7 the active transactional paths expand to include three *return*/*refund* *notifications*: *return received notification* (when items arrive at warehouse), *refund completed notification* (when vendor confirms credit), and *refund under review notification* (when *refund retry* exhausts). These join the *confirmation email*, *shipping notification*, *appointment reminder*, *pet adopted notification*, and *visit follow-up notification* paths from earlier increments. All transactional *notification* must fire regardless of *communication preferences*; email delivery failure queues for retry without blocking the triggering lifecycle transition. Marketing *notification* remains opt-in via *communication preferences*. *Notification* collaborates with *Order* (confirmation, shipping, and *return* triggers), *Payment* (*refund* completion and escalation triggers), *Appointment* (*appointment reminder*, *pet adopted notification*, and *visit follow-up notification* triggers), *guest email* (recipient on guest *order* and guest *return* paths), *customer account* email (recipient on account paths), *Store* (*pickup store* or dispatch details in messages), and *tracking number* (carrier reference in *shipping notification*). Invariant: transactional *notification* must always fire for the triggering lifecycle event; delivery failure must never block the triggering lifecycle transition.

### notification

- delivers transactional messages (*confirmation email*, *shipping notification*, *appointment reminder*, *pet adopted notification*, *visit follow-up notification*, *return received notification*, *refund completed notification*, *refund under review notification*) triggered by lifecycle events in other concepts
- fires *confirmation email* unconditionally when an *order* is confirmed and *shipping notification* when a *tracking number* is recorded on a ship-to-home *order*
- fires *appointment reminder*, *pet adopted notification*, and *visit follow-up notification* for *appointment* lifecycle events — Increment 6 activation
- fires *return received notification*, *refund completed notification*, and *refund under review notification* for *return* and *refund* lifecycle events — Increment 7 activation
- delivers marketing messages (promotions, personalized recommendations, *restock alert*, event notices) gated by opt-in
- checks *communication preferences* before sending marketing content
- **Invariant:** transactional *notification* must always fire for the triggering lifecycle event; marketing *notification* must never fire without explicit opt-in

### confirmation email

- is a transactional *notification* sent when *payment confirmation* succeeds for an *order*
- includes *order* number, *order line item* list, total paid, masked *payment* method, and delivery details
- shows *pickup store* *address* with *operating hours* for *click-and-collect* *order*
- shows *shipping address* for *standard delivery* *order*
- delivers to the *guest email* collected during *guest checkout* or the registered email on the *customer account* for logged-in *order*
- includes a link to the *order status page* for guest *order* tracking
- queues for retry when the email delivery system is unavailable — the *order confirmation page* still displays
- **Invariant:** must not block *order* confirmation when delivery fails

### shipping notification

- is a transactional *notification* sent when a ship-to-home *order* receives a *tracking number*
- includes *order* number, items shipped, carrier name, *tracking number*, and estimated delivery window
- delivers to the *guest email* or *customer account* email on the *order*
- includes a link to the *order status page* showing carrier tracking details
- fires when *store employee* enters *tracking number* at *ship-to-home fulfillment* or adds it later on *order* detail
- queues for retry when the email delivery system is unavailable — *order status* still transitions to *shipped*
- does not fire when *ship-to-home fulfillment* completes without a *tracking number* — staff may add tracking later to trigger delivery
- **Invariant:** must not block *order status* transition to *shipped* when delivery fails; must not fire without a *tracking number*

### appointment reminder

- is a transactional *notification* sent the day before a scheduled *appointment*
- includes the *pet* name and *pet photo*, *store* name and *address*, the confirmed *time slot*, and a link to the *appointment* in the *customer*'s *appointment* history
- delivers to the *customer account* email of the booking *customer* — *appointment* booking is account-gated so a *guest email* path does not apply
- queues for retry when the email delivery system is unavailable — the *appointment* state is not affected by delivery failure
- **Invariant:** must fire for every *appointment* in upcoming status at the day-before trigger time; must not fire for *appointment cancellation* or *no-show* records

### pet adopted notification

- is a transactional *notification* sent to a *customer* when the *pet* on their upcoming *appointment* transitions to adopted before the visit date
- informs the *customer* that the *pet* has been adopted and offers the option to cancel the *appointment* or rebook with a different *pet*
- delivers to the *customer account* email of the booking *customer*
- queues for retry when the email delivery system is unavailable — the *pet lifecycle event* is not affected by delivery failure
- **Invariant:** must fire for every *customer* with an upcoming *appointment* for the *pet* at the moment the *pet lifecycle event* records an adopted state; must not fire if the *appointment* is already cancelled

### visit follow-up notification

- is a transactional *notification* sent after a completed *appointment* where a *follow-up action* has been logged by *store* staff
- includes the *pet* name, the *visit outcome* summary, and any next-step details the staff entered in the *follow-up action*
- delivers to the *customer account* email of the booking *customer*
- queues for retry when the email delivery system is unavailable — *visit outcome* recording is not blocked
- **Invariant:** must fire only when a *follow-up action* with *customer*-visible content is recorded; must not fire for *appointment* records with no *follow-up action*

### return received notification

- is a transactional *notification* sent when *returned items* are received at the warehouse and processing begins
- includes the *order* number, *returned items* summary, and a note that inspection and *refund* processing are underway
- delivers to the *customer account* email or *guest email* on the *order*
- queues for retry when the email delivery system is unavailable — *return status* still transitions
- **Invariant:** must fire when *return status* transitions to "received"; must not block *return* processing on delivery failure

### refund completed notification

- is a transactional *notification* sent when the *refund* is completed by the *payment vendor*
- includes the refunded amount and the *payment* method the credit was returned to (masked card, wallet, or BNPL adjustment)
- delivers to the *customer account* email or *guest email* on the *order*
- queues for retry when the email delivery system is unavailable — *refund status* still transitions to completed
- **Invariant:** must fire when *refund status* transitions to "completed"; must not fire before vendor confirmation

### refund under review notification

- is a transactional *notification* sent when *refund retry* exhausts and *refund status* transitions to "requires review"
- includes guidance to contact support and a reference to the *return* and *order* details
- delivers to the *customer account* email or *guest email* on the *order*
- queues for retry when the email delivery system is unavailable
- **Invariant:** must fire when *refund status* transitions to "requires review"; must not fire while *refund retry* is still active

### notification preferences

- defines the categories a *customer* can opt into or out of: promotional, *restock alert*, pet care tips, and event *notifications*
- is stored on the *customer account* but enforced by *Notification* at delivery time

### restock alert

- notifies a *customer* when a *product* they have bought before is back in stock or purchase frequency suggests they are likely running low
- is gated by the *customer*'s *communication preferences* — only sent when opt-in for that *category* is active

### Decisions made

- *Confirmation email* and *shipping notification* are distinct transactional *notification* paths — each carries different content rules and trigger conditions (independence test).
- *Appointment reminder*, *pet adopted notification*, and *visit follow-up notification* are each their own concept blocks — each has a distinct trigger event, recipient path, content shape, and invariant condition (independence test; Increment 6 activation).
- *Return received notification*, *refund completed notification*, and *refund under review notification* are each their own concept blocks — each has a distinct trigger event (*return status* received, *refund status* completed, *refund status* requires review), distinct content, and distinct invariant conditions (independence test; Increment 7 activation).
- All three *appointment* *notification* types stay under *Notification*, not *Appointment* — they are message behaviors triggered by *Appointment* lifecycle events; *Appointment* owns the trigger, *Notification* owns the delivery (scope-fit test).
- All three *return*/*refund* *notification* types stay under *Notification*, not *Order* or *Payment* — they are message behaviors triggered by *return* and *refund* lifecycle events; *Order* and *Payment* own the triggers, *Notification* owns the delivery (scope-fit test).
- *Shipping notification* stays under *Notification*, not *Order* — it is a message behavior triggered by *tracking number* entry, not the tracking data itself (scope-fit test).
- *Notification preferences* are placed under *Notification* because the preference logic is owned by the *Notification* domain; *Customer Account* merely *stores* choices — deferred for marketing in Increment 3.
- *Restock alert* stays under *Notification*, not *Product Catalog* — it is a *notification* behavior triggered by stock data, not a catalog concept (scope-fit test).
- *Appointment* *notification* types do not have a *guest email* path — *appointment* booking is account-gated in Increment 6; all *appointment* *notification* recipients are *customer account* email holders.
- *Return*/*refund* *notification* types support both *customer account* email and *guest email* paths — *return*s can be initiated from guest *order* via *in-store return* (*order* number + *guest email* lookup).

### References

**Ref — Email and *notification* system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
We want a proper email and notification system. There's the transactional stuff — order confirmations, shipping updates, appointment reminders.
```

**Ref — Send Shipping Notification with Tracking Number (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Send Shipping Notification with Tracking Number" / acceptance_criteria item 1
Extract: partial

```source
1. **WHEN** *Store Staff* enters a *Tracking Number* and confirms fulfillment
**THEN** the system sends a *Shipping Notification* to the *Guest Email*
**AND** the notification includes: order number, items shipped, carrier name, *Tracking Number*, and estimated delivery window
```

**Ref — Order confirmation and shipping (requirements)**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 19
Extract: whole

```source
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.
```

**Ref — Appointment notifications (requirements)**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
There's the transactional stuff — order confirmations, shipping updates, appointment reminders.
```

**Ref — Increment 6 transactional notification stories**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 6
Extract: partial

```source
Stories: Send Appointment Reminder (transactional), Send Pet Adopted Before Visit Notification (transactional),
Send Visit Follow-Up Notification (transactional)
```

**Ref — Send Return and Refund Status Update (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Send Return and Refund Status Update" / acceptance_criteria items 1–4
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

---

# Boundary Domain

## content

Owned by: Content Management

- includes blog posts and guides ("How to introduce a new cat to your household," "Best food for senior dogs") that build trust, support SEO, and provide material for marketing *notification*
- defines the content surfaces PawPlace depends on; *Content Management* (future module) owns authoring, publishing workflow, and CMS operations
- defers community features (Q&A, forums) to phase two

### Decisions made

- *Content* is a boundary term — PawPlace depends on it for SEO and email marketing, but does not own the authoring or publishing workflow (scope-fit test).

### References

**Ref — Content and blog**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 33
Extract: whole

```source
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.
```

---

## admin dashboard

Owned by: Store Operations

- is the staff-facing surface for managing inventory, viewing incoming *appointment* bookings, updating *pet profile* content, handling *order* fulfillment, and processing *in-store return*
- in Increment 1 exposed only a bare-bones stock-level form — *store employee* selects *store* and *product*, edits *stock level*, and submits
- in Increment 2 adds the *click-and-collect queue* for *pickup fulfillment* — pending *order*, mark prepared, confirm collected
- in Increment 3 adds the *order queue* — unified staff view of confirmed *order* across *standard delivery* and *click-and-collect*, with *ship-to-home fulfillment* and *pickup fulfillment* actions
- in Increment 7 adds *order* lookup for *in-store return* — staff search by *order* number or *customer* email, view *return eligibility*, initiate *return*, and invoke *manager override* when needed
- defines the data surfaces *store* staff need; *Store Operations* (future module) owns the dashboard UI, staff permissions, and fulfillment workflow

### Decisions made

- *Admin dashboard* is a boundary term — PawPlace provides the data (inventory, *appointment*, *pet* lifecycle, *order queue*, *click-and-collect queue*, *in-store return*) but does not own the staff tooling or permission model (scope-fit test).
- Increment 3 adds *order queue* for *ship-to-home* and *click-and-collect* fulfillment without expanding to automated label printing or carrier integration.
- Increment 7 adds *in-store return* lookup and *manager override* — data and rules owned by *Order*; presentation owned by *Store Operations*.

### References

**Ref — Admin dashboard**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

---

## Increment 8: Marketing engine — reviews, alerts, and content

---

## marketing-engine-ubiquitous-language

<!-- migrated from: increments/8-marketing-engine/exploration/domain/ubiquitous-language.md -->

---
state: ubiquitous-language
---

# Module: [Marketing Engine]

_Concept sketch for the customer engagement layer — reviews that build social proof, marketing communications gated by explicit consent, and published content that feeds email campaigns and on-site discovery._

Scope: How customers contribute reviews, how the system sends marketing communications with proper opt-in enforcement, how customers manage their communication preferences, and how content authors publish blog posts and pet care guides. Increment 8 of PawPlace.

**Terms**:
- **Customer Review**
  - **customer review** — a star-rated, optionally-written evaluation of a product authored by a verified customer account
  - **star rating** — the one-to-five numeric score a customer assigns when reviewing a product
  - **review photo** — an optional image attached to a customer review showing the product in use
  - **aggregate star rating** — the computed average of all star ratings on a product, displayed as social proof
- **Marketing Communication**
  - **marketing communication** — any message sent to a customer that is gated by explicit opt-in to a marketing category
  - **marketing email list** — the set of customers who have opted in to receive promotional emails
  - **communication preferences** — the per-customer record of which marketing categories they have opted in to or out of
  - **promotional email** — a marketing communication sent to the marketing email list advertising sales, new products, or seasonal offers
  - **personalized recommendation** — a marketing communication tailored to a customer's purchase history, browsing patterns, or pet data
  - **restock alert** — a marketing communication triggered when a wishlisted product transitions from out-of-stock to in-stock
  - **in-store event notification** — a marketing communication informing opted-in customers about events at their preferred store
  - **unsubscribe** — the act of opting out of a marketing category, effective immediately on execution
  - **marketing category** — a named grouping of marketing communications (promotions, recommendations, restock alerts, events) that a customer can independently opt in to or out of
- **Content**
  - **content** — authored material published to the site for customer education and marketing fodder (boundary — Content Management module)
  - **blog post** — a published article appearing on the blog index with title, summary, date, and author
  - **pet care guide** — a published educational article tagged by pet type or species, cross-linked with product and pet browsing areas

---

_A *customer review* is authored by a *customer account* that has purchased the *product*, attaches a *star rating* and optional *review photo*, and contributes to the *product's* *aggregate star rating*. *Marketing communications* — *promotional emails*, *personalized recommendations*, *restock alerts*, and *in-store event notifications* — are sent only to customers on the *marketing email list* whose *communication preferences* include an active opt-in for the relevant *marketing category*. Customers manage their *communication preferences* and can *unsubscribe* at any time; unsubscribe takes effect immediately and no further messages of that category are delivered. *Content* — *blog posts* and *pet care guides* — is authored and published by a *content author*, providing material for on-site discovery and marketing email campaigns._

---

# Core Domain

## Customer Review

*Customer Review* is the social-proof mechanism that attaches verified customer opinions to products. It enforces that only customers who have purchased a product may review it, aggregates individual scores into a visible *aggregate star rating*, and optionally carries photographic evidence of the product in use. *Customer Review* depends on *customer account* for authorship verification and on *product* for attachment.

### customer review

- is authored by exactly one *customer account* that has purchased the *product* being reviewed, producing a verified evaluation attached to that *product*
- carries exactly one *star rating* and optionally a written text body describing the customer's experience
- may include one or more *review photos* showing the product in use
- contributes its *star rating* to the *product's* *aggregate star rating* — the aggregate is recomputed whenever a *customer review* is created, edited, or deleted
- appears on the *product details page* sorted by newest first, with sort controls for oldest, highest rating, and lowest rating
- **Invariant:** must be authored by exactly one verified *customer account* that has purchased the *product* — guest checkout sessions cannot leave reviews
- **Invariant:** must carry exactly one *star rating* (1–5); written text is optional but star rating is mandatory

### star rating

- is a numeric value between 1 and 5 inclusive assigned by the authoring *customer account* at review submission time
- is the minimum required input for a *customer review* — a review with a *star rating* but no written text is valid
- feeds the *aggregate star rating* computation on the parent *product*
- **Invariant:** must be an integer between 1 and 5 inclusive; no half-stars or zero stars

### review photo

- is an optional image attachment on a *customer review* showing the *product* in real-world use
- is displayed as a thumbnail inline with the review text, expandable to full-size via lightbox
- must pass upload validation — supported image format and within size limits — before attaching to the *customer review*
- **Invariant:** must be a supported image format and within configured size limits; upload failure must not discard the parent review's text or *star rating*

### aggregate star rating

- is a derived value computed from all *star ratings* across all *customer reviews* on a *product*
- is displayed prominently on the *product details page* as a summary of social proof
- is not shown when a *product* has zero *customer reviews* — absence is communicated via a "be the first to review" prompt
- is recomputed whenever a *customer review* is created, edited, or deleted
- **Invariant:** must not be displayed as zero when no reviews exist — show nothing or a prompt instead

### product *(boundary)*

- is the entity a *customer review* attaches to and whose *aggregate star rating* is derived from accumulated reviews
- owns the *product details page* where reviews are displayed

### customer account *(boundary)*

- is the authoring identity that gates review submission — only verified purchasers of the *product* may create a *customer review*

### product details page *(boundary)*

- is the presentation surface where *customer reviews* and the *aggregate star rating* are displayed for a *product*

Owned by: Product Catalog

#### Decisions made

- *Customer Review* is its own KA for this increment scope because it has independent behavior (authorship verification, photo upload, aggregation) and its own invariants — it is not merely a property of *product* (independence test).
- *Star rating* earns its own heading because it has an invariant (integer 1–5) and independent behavior (feeds aggregation, is the minimum viable review input).
- *Review photo* earns its own heading because it has its own validation behavior and invariant (format/size limits, graceful failure isolation).
- *Aggregate star rating* earns its own heading because it has independent computation behavior (recompute trigger), a display invariant (never show zero), and a no-reviews edge case.
- *Product* is boundary — owned by the Product Catalog module; this scope depends on it for review attachment.
- *Customer account* is boundary — owned by the Customer Account module; this scope depends on it for authorship verification.
- *Product details page* is boundary — owned by the Product Catalog module; this scope depends on it as the presentation surface where reviews and aggregate ratings are displayed.
- Photo review is not a subtype of *customer review* — the source shows no distinct moderation, display, or lifecycle behavior for photo reviews vs text-only reviews; the photo is an optional attribute (scope-fit test).

#### References

**Ref — Customer reviews and ratings**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: whole

**Ref — Review stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Submit Written Review with Star Rating, Submit Photo Review, Read Customer Reviews
Extract: acceptance criteria

---

## Marketing Communication

*Marketing Communication* is the consent-gated messaging layer that delivers promotional, personalized, and alert-based communications to customers who have explicitly opted in. It owns the *marketing email list*, enforces *communication preferences* at send time, and supports immediate *unsubscribe*. *Marketing Communication* depends on *customer account* for preference storage and delivery target, on *product* for restock triggers, on *wishlist* for restock targeting, and on *store* for event-location matching.

### marketing communication

- is any message sent to a customer that is classified under a *marketing category* and gated by explicit opt-in in the customer's *communication preferences*
- checks *communication preferences* at send time — not at batch creation time — ensuring real-time respect of opt-out decisions
- is never sent to customers who have not opted in to the relevant *marketing category* — zero exceptions
- routes to the *customer account's* verified email address — guest checkout sessions cannot receive marketing communications
- **Invariant:** must never be sent without explicit opt-in for the relevant *marketing category*; preference check must occur at delivery time, not batch time

### marketing email list

- is the set of *customer accounts* that have opted in to at least one *marketing category* in their *communication preferences*
- is populated when a customer opts in via *communication preferences* or during account registration/checkout (opt-in checkbox must be unchecked by default)
- is depopulated immediately when a customer executes *unsubscribe* for the relevant *marketing category*
- **Invariant:** opt-in must always be affirmative — the checkbox is unchecked by default; no customer is added without an explicit action

### communication preferences

- is the per-customer record of which *marketing categories* have active opt-in status
- is stored on the *customer account* but enforced by the *marketing communication* system at delivery time
- lists all available *marketing categories* with current opt-in/opt-out status when the customer opens the preferences page
- persists changes immediately on toggle — no "save" delay
- defaults to opt-out for any newly added *marketing category* — customers must explicitly opt in
- **Invariant:** new *marketing categories* must default to opt-out; no broadcast without explicit opt-in for that category

### promotional email

- is a *marketing communication* created by an admin and sent to all customers on the *marketing email list* who have opted in to the promotions *marketing category*
- respects real-time opt-out — a customer who opts out after the batch is queued but before delivery is not sent the email
- includes an *unsubscribe* link that immediately opts the customer out of the promotions category on click

### personalized recommendation

- is a *marketing communication* tailored to a specific customer's purchase history, browsing patterns, or *pet profile* data
- is sent only to customers who have opted in to the recommendations *marketing category*
- is not sent when the customer has no purchase history or browsing data — generic suggestions are handled by *promotional email*, not *personalized recommendation*
- excludes *products* that are currently out of stock from the recommendation set
- **Invariant:** must be genuinely personalized — if no data exists to personalize against, do not send; must never recommend an out-of-stock *product*

### restock alert

- is a *marketing communication* triggered when a *product's* *stock availability* transitions from out-of-stock to in-stock
- is sent only to customers who have the *product* on their *wishlist* and have opted in to the restock alerts *marketing category*
- is a best-effort signal — the *product* may go back out of stock before the customer acts
- **Invariant:** must not be sent to customers who have not opted in to restock alerts, even if the *product* is on their *wishlist*

### in-store event notification

- is a *marketing communication* informing opted-in customers about events (adoption days, grooming workshops, training sessions) at a specific *store*
- is sent only to customers whose preferred *store* matches the event location and who have opted in to the events *marketing category*
- is not sent when the customer has not set a preferred *store* — the system does not guess proximity
- **Invariant:** must not be sent when no preferred *store* is set; event is still discoverable on the *store's* detail page for walk-in discovery

### unsubscribe

- is the act of opting out of a *marketing category*, executed either by clicking the unsubscribe link in a *marketing communication* or by toggling off in *communication preferences*
- takes effect immediately — no further *marketing communications* of that category are sent after execution
- produces a confirmation page when executed via email link ("you've been unsubscribed")
- does not affect transactional notifications (order confirmations, shipping updates, appointment reminders)
- **Invariant:** must take effect immediately; must not suppress transactional notifications regardless of how many marketing categories are unsubscribed

### marketing category

- is a named grouping that organizes *marketing communications* into independently-controllable opt-in channels: promotions, recommendations, restock alerts, events
- is the unit of consent — customers opt in or out per *marketing category*, not per individual message
- is extensible — new categories can be added in future increments, always defaulting to opt-out

### notification preferences *(boundary)*

- governs transactional notification settings (order updates, shipping, appointments, returns) — separate from *communication preferences* which govern marketing opt-in

### customer account *(boundary)*

- stores the customer's *communication preferences* and provides the verified email delivery target for *marketing communications*

### wishlist *(boundary)*

- provides the product list used to target *restock alerts* — only wishlisted products trigger the alert

### store *(boundary)*

- provides the preferred-store match used to target *in-store event notifications*

### pet profile *(boundary)*

- provides pet-related data (species, breed, age) that feeds *personalized recommendation* algorithms

### stock availability *(boundary)*

- is the inventory state of a *product* whose transition from out-of-stock to in-stock triggers a *restock alert*

Owned by: Product Catalog

#### Decisions made

- *Marketing Communication* is its own KA for this increment because the consent-gated sending mechanism, preference enforcement, and unsubscribe lifecycle are its own domain — distinct from transactional Notification (independence test).
- *Communication preferences* earns its own heading because it has invariants (default opt-out, immediate persist) and cross-concept enforcement behavior.
- *Unsubscribe* earns its own heading because it has distinct lifecycle behavior (immediate effect, two execution paths, confirmation page) and an invariant (no transactional suppression).
- *Marketing category* earns its own heading because it is the unit of consent and has extensibility behavior (new categories default opt-out).
- *Promotional email*, *personalized recommendation*, *restock alert*, and *in-store event notification* are modeled as concepts rather than subtypes because each has distinct triggering logic, targeting criteria, and invariants — they share the consent gate but diverge on everything else (independence test).
- *Notification preferences* is boundary — it governs transactional notifications and belongs to the existing Notification module; *communication preferences* (marketing opt-in) is this scope's concern (scope-fit test).
- *Wishlist*, *store*, *pet profile*, *stock availability*, and *customer account* are boundary — they are owned by other modules and this scope depends on them for targeting and delivery.

#### References

**Ref — Email marketing and preferences**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

**Ref — Marketing notification stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Opt In to Marketing Email List, Send Promotional Email, Send Personalized Recommendation, Send Restock Alert, Send In-Store Event Notification, Unsubscribe from Marketing Emails, Set Communication Preferences
Extract: acceptance criteria

---

## Content

*Content* is the published material that feeds both on-site customer education and marketing email campaigns. *Content authors* create, draft, and publish *blog posts* and *pet care guides* that surface on index pages and cross-link with product and pet browsing areas. Content provides the substance that *marketing communications* can reference and link to.

### content

- is authored material published to the site for customer education, SEO, and marketing email fodder
- exists in two published forms: *blog post* and *pet care guide*
- transitions through a lifecycle: draft (invisible to customers, editable) → published (visible, URL-accessible)
- is authored by a *content author* through the admin content area
- **Invariant:** draft content must never be visible to customers; published content must always be accessible via its own URL

### blog post

- is a published article appearing on the *blog index* with title, summary, date, and author
- is accessible via its own URL once published
- can be saved as draft (not visible to customers) and later published
- reflects edits immediately on the live page without changing the publish date unless the *content author* explicitly updates it
- **Invariant:** must display title, summary, date, and author on the *blog index*; edits to a published post must not change the publish date unless explicitly requested

### pet care guide

- is a published educational article tagged by pet type or species (e.g. dogs, cats, senior pets, specific breeds)
- appears on the *guide index* with title, summary, pet type/species tag, and date
- is cross-linked with relevant pet and product browsing areas based on its species/type tags
- can be saved as draft (not visible to customers) and later published
- **Invariant:** must carry at least one pet type or species tag; must appear in relevant browsing areas matching its tags

### blog index

- is the navigable listing of all published *blog posts*, providing browsable access to content
- is a property of the content publishing surface — it has no independent behavior beyond listing

### guide index

- is the navigable listing of all published *pet care guides*, providing browsable access to educational content
- is a property of the content publishing surface — it has no independent behavior beyond listing

### content author *(boundary)*

- is the admin role that creates, edits, and publishes *content* — owned by the admin/operations module

#### Decisions made

- *Content* is its own KA for this increment because it has independent lifecycle (draft → published), its own authoring flow, and its own invariants — distinct from both Product Catalog and Marketing Communication (independence test).
- *Blog post* and *pet care guide* are separate concepts rather than subtypes because they have distinct metadata (pet type tags vs author attribution), distinct index pages, and distinct cross-linking behavior — they share the draft/publish lifecycle but diverge on categorization and linking.
- *Blog index* and *guide index* are mentioned as property-level listings with no independent behavior — they do not earn invariant-bearing headings, but are included for term resolution since bullets reference them.
- *Content author* is boundary — the role and its permissions are owned by the admin/operations module; this scope depends on it for content creation.
- The domain sketch places "content" as a boundary concept owned by a future Content Management module. For Increment 8, we model the published surface that PawPlace exposes — the authoring workflow is shallow (create/draft/publish) and the cross-linking behavior with pet browsing areas is specific to this scope.

#### References

**Ref — Content and blog**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 33
Extract: whole

**Ref — Content stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Publish Blog Post, Publish Pet Care Guide
Extract: acceptance criteria

---

# Boundary Domain

## product

Owned by: Product Catalog

- is the entity that *customer reviews* attach to and whose *aggregate star rating* is derived from accumulated *star ratings*
- provides stock-availability transitions that trigger *restock alerts*

#### Decisions made

- *Product* is owned by Product Catalog — this scope depends on it for review attachment and restock triggering (scope-fit test).

#### References

**Ref — Product catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA
Extract: partial

---

## customer account

Owned by: Customer Account

- is the authoring identity that verifies purchase history before permitting *customer review* submission
- stores *communication preferences* and provides the verified email target for *marketing communications*

#### Decisions made

- *Customer account* is owned by Customer Account module — this scope depends on it for authorship verification, preference storage, and delivery routing (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA
Extract: partial

---

## wishlist

Owned by: Customer Account

- provides the product list that determines which customers receive *restock alerts* when a *product* transitions to in-stock

#### Decisions made

- *Wishlist* is owned by Customer Account — this scope depends on it only for restock-alert targeting (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA, wishlist concept
Extract: partial

---

## store

Owned by: Store

- provides the preferred-store value used to match customers to *in-store event notifications*
- hosts events (adoption days, workshops) whose announcements are delivered as *in-store event notifications*

#### Decisions made

- *Store* is owned by the Store module — this scope depends on it only for event-location matching (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA
Extract: partial

---

## pet profile

Owned by: Customer Account

- provides species, breed, and age data that feeds *personalized recommendation* algorithms

#### Decisions made

- *Pet profile* is owned by Customer Account — this scope depends on it only for recommendation personalization data (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA, pet profile concept
Extract: partial

---

## notification preferences

Owned by: Notification

- governs transactional notification channel settings (order updates, shipping, appointments, returns) — distinct from *communication preferences* which govern marketing opt-in

#### Decisions made

- *Notification preferences* is owned by the Notification module — this scope's *communication preferences* governs marketing opt-in only; transactional notification settings remain with the existing Notification module (scope-fit test).

#### References

**Ref — Notification**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Notification KA, notification preferences concept
Extract: partial

---

## content author

Owned by: Store Operations

- is the admin role that creates, edits, and publishes *content* through the admin content area

#### Decisions made

- *Content author* is owned by the Store Operations / admin module — this scope depends on the role for content creation but does not own permissions or admin workflow (scope-fit test).

#### References

**Ref — Admin dashboard**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

---

## Increment 9: Power-ups — search, personalization, admin polish

---

## power-ups-ubiquitous-language

<!-- migrated from: increments/9-power-ups/exploration/domain/ubiquitous-language.md -->

---
state: ubiquitous-language
---

# Module: [Power-ups]

_Concept sketch for the discovery, personalization, and admin polish layer — keyword search and faceted filtering for products, preferred-store personalization for browsing and checkout, customer pet profiles, and a polished inventory dashboard with stock alerts and export for store staff._

Scope: How customers discover products through keyword search and faceted filtering, how a preferred-store preference personalizes browsing and checkout, how customers register their own pets, and how store staff manage inventory through a dashboard with stock alerts and backorder support. Increment 9 of PawPlace.

**Terms**:
- **Product Search**
  - **product search** — a keyword-based discovery mechanism that matches products by name, description, category, or brand and ranks results by relevance
  - **search results** — the ranked list of products produced by a product search, with empty-state guidance when no products match
  - **filter facet** — a named dimension (category, pet type, brand, price range, stock availability) that narrows the product list and shows match counts per value
  - **active filter** — a currently applied filter selection displayed as a removable tag whose removal expands the result set
- **My Store**
  - **my store** — the customer's declared preferred store, saved to their customer account and persisted across sessions and devices
  - **tailored experience** — the set of behaviors that adapt browsing and checkout when a preferred store is set
  - **store specialization filter** — filtering stores on the store locator by their declared area of expertise
  - **product availability filter** — filtering stores on the store locator to show only those with a specific product in stock
- **Inventory Dashboard**
  - **inventory dashboard** — the admin interface listing all products at a store with current stock levels, supporting search, sort, filter, and inline editing
  - **low stock alert** — a visual badge shown on a product row when its stock level falls below the configurable threshold
  - **low stock threshold** — the configurable stock level below which a low stock alert is triggered for a product
  - **stock level** — the numeric quantity of a product at a store, viewed and edited on the inventory dashboard
  - **inventory export** — a CSV download of stock data scoped to the staff member's store
  - **backorder purchase** — the ability for a customer to purchase a product that is currently out of stock, with a backorder expectation

---

_A customer discovers *products* through *product search* by entering a keyword, receiving *search results* ranked by relevance; *filter facets* narrow those results by *category*, pet type, brand, price range, and *stock availability*, each facet displaying match counts that update as *active filters* are combined. The *store locator* gains *store specialization filter* and *product availability filter* dimensions so customers can find the right *store*. A *customer account* can declare a *store* as *my store*, activating the *tailored experience* — *stock availability* defaults to the preferred *store*, the *store locator* highlights it, and *click-and-collect* checkout pre-selects it. Logged-in customers manage *customer pet profiles* for their own pets, providing data that feeds downstream personalization. On the admin side, *store staff* use the *inventory dashboard* to view, search, sort, filter, and edit *stock levels* at their *store*, with *low stock alerts* flagging *products* below the configurable *low stock threshold* and *inventory export* producing a per-store CSV. *Backorder purchase* relaxes the out-of-stock gate so customers can buy *products* that are temporarily unavailable._

---

# Core Domain

## Product Search

*Product Search* is the keyword-based discovery mechanism that lets customers find *products* by name, description, *category*, or brand, producing *search results* ranked by relevance. It works alongside *filter facets* that narrow the result set by *category*, pet type, brand, price range, and *stock availability*, each facet showing match counts that update as filters are combined. *Product Search* depends on *product catalog* for the searchable corpus, on *product* for the entities being matched, and on *category* and *stock availability* as filter dimensions.

### product search

- accepts a keyword and matches it against *product* name, description, *category*, and brand, producing *search results* ranked by relevance
- supports partial and fuzzy matching so that incomplete keywords (e.g. "kitt" for "kitten food") still return relevant *products*
- is accessible globally from any page — the search bar appears in the site header regardless of the customer's current context
- returns a "no results found" message with suggestions (popular *categories*, alternative keywords) when the keyword matches no *products*
- **Invariant:** must always be accessible from every page; must never return results outside the *product catalog*'s published set

### search results

- is the ranked list of *products* produced by a *product search*, ordered by relevance (closest match first)
- respects *active filters* — when *filter facets* are applied, *search results* narrow to the intersection of the keyword match and all active filter selections
- displays a "no results found" message with suggestions when no *products* match the keyword
- updates immediately when the customer applies or removes an *active filter*

### filter facet

- is a named dimension — *category*, pet type, brand, price range, and *stock availability* — that narrows the *product* list when browsing the *product catalog* or viewing *search results*
- shows the count of matching *products* per value within the facet, giving the customer visibility into how many results each selection would produce
- combines conjunctively with other *filter facets* — selecting multiple facets narrows the *product* list to the intersection of all *active filters*
- updates its match counts to reflect the combined state of all *active filters*, so counts remain accurate as the customer adds or removes selections
- displays a "no products match your filters" message with a "clear all filters" action when the combined *active filters* produce zero results
- **Invariant:** facet counts must always reflect the current combined filter state; must never show stale counts after a filter change

### active filter

- is a currently applied *filter facet* selection displayed as a removable chip or tag in the filter area
- expands the *product* list when removed, restoring *products* that were previously excluded by that filter
- triggers a "clear all filters" action when all *active filters* together produce zero *search results*

### product *(boundary)*

- is the entity matched, ranked, and filtered by *product search* and *filter facets*

### category *(boundary)*

- is one of the *filter facet* dimensions used to narrow *products* by product type or pet type

### stock availability *(boundary)*

- is one of the *filter facet* dimensions used to narrow *products* to only those currently in stock

### product catalog *(boundary)*

- is the searchable corpus that *product search* queries and that *filter facets* operate over

#### Decisions made

- *Product Search* is its own KA for this increment because keyword-based discovery with relevance ranking is new behavior distinct from browsing-by-category, which existed in prior increments (independence test).
- *Search results* earns its own heading because it has independent behavior (relevance ranking, empty-state guidance, real-time update on filter change) — it is not merely an output of *product search* but a live, interactive artifact.
- *Filter facet* earns its own heading because it has an invariant (count accuracy after filter change), independent behavior (conjunctive combination, zero-results action), and cross-concept interaction with both *search results* and *product*.
- *Active filter* earns its own heading because it has its own behavior (removal expands results, triggers "clear all") — it is not merely a flag on a *filter facet*.
- Price range is a *filter facet* dimension that uses a min-max range rather than discrete selections, but follows the same narrowing and count-update behavior as other facets — not its own concept (typing call: value type of *filter facet*).
- Pet type and brand are *filter facet* dimension instances — they follow the same behavior as *category* and do not earn separate headings (typing call: instance).
- Search bar is the UI entry point for *product search* — it has no independent domain behavior beyond accepting a keyword, so it is not modeled as a concept. Its global accessibility is described on *product search*.
- *Product*, *category*, *stock availability*, and *product catalog* are boundary — they are owned by Product Catalog; this scope depends on them for matching and filtering (scope-fit test).

#### References

**Ref — Product search and filtering**
Source: context/requirements-chat-with-product-owner.md
Locator: line 3
Extract: partial

**Ref — Search stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Search Products by Keyword, Filter Products
Extract: acceptance criteria

---

## My Store

*My Store* is the customer's declared preferred *store*, persisted on the *customer account* across sessions and devices, that activates a *tailored experience*: *stock availability* defaults to the preferred *store*, the *store locator* highlights it, and *click-and-collect* checkout pre-selects it. Alongside the preference, the *store locator* gains *store specialization filter* and *product availability filter* dimensions so customers can discover the right *store* before setting it. *My Store* depends on *customer account* for persistence, on *store* for the entity being preferred, on *store locator* for filtering and highlighting, and on *click-and-collect* for checkout pre-selection.

### my store

- is a single *store* saved as the customer's preference on their *customer account*, persisting across sessions and devices
- replaces the previous preference when the customer changes their selection — only one *my store* exists per *customer account* at any time, producing an immediate switch of the *tailored experience* to the new *store*
- requires a logged-in *customer account* — guest sessions cannot set *my store* and are prompted to log in or register without navigating away from the current page
- can be set from a store detail page or from account settings
- **Invariant:** only one *my store* per *customer account* at any time; setting a new one replaces the old one immediately
- **Invariant:** when no *my store* is set, no store-specific tailoring is applied — default behavior from previous increments persists

### tailored experience

- is the set of behaviors activated when a *customer account* has a *my store* set
- defaults *stock availability* on *product* pages to the preferred *store*, so the customer sees availability at their local *store* without manual selection
- highlights the preferred *store* in the *store locator*
- pre-selects the preferred *store* in the *click-and-collect* checkout flow, while keeping the full *store* list available for override
- applies no tailoring when no *my store* is set — previous-increment default behavior is preserved

### store specialization filter

- is a filter dimension on the *store locator* that narrows the *store* list to only *stores* with a declared *store specialization* (e.g. reptile section, premium dog food)
- shows only *stores* whose *store specialization* matches the customer's selection
- combines with *product availability filter* — when both are active, only *stores* matching both criteria are shown
- displays a "no stores match your filters" message with a "clear filters" action when the combined filters produce zero results

### product availability filter

- is a filter dimension on the *store locator* that narrows the *store* list to only *stores* where a specific *product* is in stock
- shows only *stores* whose *stock availability* for the selected *product* indicates the item is available
- combines with *store specialization filter* for conjunctive narrowing

### store *(boundary)*

- is the physical location that can be set as *my store* and filtered by *store specialization filter* and *product availability filter*

### store locator *(boundary)*

- is the discovery surface where *store specialization filter* and *product availability filter* operate and where the *tailored experience* highlights the preferred *store*

### customer account *(boundary)*

- stores the *my store* preference and provides the login identity that gates preference-setting

### click-and-collect *(boundary)*

- provides the checkout store-selection step that the *tailored experience* pre-selects with the preferred *store*

### store specialization *(boundary)*

- is a property of *store* — the declared area of expertise (e.g. reptile section, premium dog food) used as a filter dimension by *store specialization filter*

#### Decisions made

- *My Store* is its own KA for this increment because the preference, the tailoring behaviors it activates, and the store filtering dimensions form a coherent cluster with independent invariants and behavior — distinct from the general Store KA which owns identity and operations (independence test).
- *Tailored experience* earns its own heading because it describes three distinct behaviors (stock defaults, locator highlighting, checkout pre-selection) activated by a single trigger (*my store* being set), and has its own no-store-set invariant — it is not merely a side effect of setting *my store*.
- *Store specialization filter* and *product availability filter* earn separate headings because each has independent filtering logic — one operates on a *store* attribute, the other on per-product stock state — though both combine conjunctively on the *store locator*.
- *Store specialization* is a property of *store* — it has no independent behavior outside the filtering dimension it provides to this scope; included as a boundary stub because *store specialization filter* references it (typing call: property).
- *Store*, *store locator*, *customer account*, and *click-and-collect* are boundary — each is owned by another module; this scope depends on them for filtering, persistence, highlighting, and checkout pre-selection (scope-fit test).

#### References

**Ref — Store personalization**
Source: context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: partial

**Ref — Store experience stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Filter Stores by Availability and Specialization, Set My Store Preference, Tailor Experience to Preferred Store
Extract: acceptance criteria

---

## Inventory Dashboard

*Inventory Dashboard* is the admin-facing stock oversight interface that replaces the bare-bones stock editing form from Increment 1, giving *store staff* a consolidated view of all *products* at their *store* with current *stock levels*, search, sort, and filter capabilities. It surfaces *low stock alerts* when a *product*'s *stock level* falls below a configurable *low stock threshold*, supports inline *stock level* editing with immediate persist, and provides *inventory export* for offline analysis. The increment also introduces *backorder purchase*, relaxing the out-of-stock purchase gate. *Inventory Dashboard* depends on *store staff* for the actor identity, on *product* and *stock availability* for the data being managed, and on *store* for location scoping.

### inventory dashboard

- lists all *products* at the *store staff* member's *store* with current *stock levels*, replacing the bare-bones stock editing form from Increment 1
- supports search, sort (by name, *stock level*, *category*), and filter for navigating the product list
- surfaces a *low stock alert* badge on any *product* row whose *stock level* falls below the configured *low stock threshold*
- provides a "low stock only" filter to isolate *products* that need replenishment
- allows inline editing of *stock levels* with immediate persist and real-time customer-facing *stock availability* update — same behavior as Update Product Stock Levels from Increment 1
- preserves all existing stock data during the transition from the prior stock editing form — no data migration loss
- **Invariant:** stock edits must persist immediately and reflect in customer-facing *stock availability*; transition from the prior form must not lose data

### low stock alert

- is a visual badge shown on a *product* row in the *inventory dashboard* when the *product*'s *stock level* falls below the *low stock threshold*
- drives the "low stock only" filter on the *inventory dashboard* so *store staff* can quickly find *products* needing replenishment
- **Invariant:** must appear on every *product* whose *stock level* is below the *low stock threshold*; must disappear when the *stock level* is raised above the threshold

### low stock threshold

- is a configurable *stock level* value below which a *low stock alert* is triggered for a *product*
- determines the boundary between "adequately stocked" and "needs attention" for *store staff*

### stock level

- is the numeric quantity of a *product* at a *store*, viewed and edited on the *inventory dashboard*
- determines the *stock availability* state — a zero *stock level* means the *product* is out of stock for customers
- triggers a *low stock alert* when it falls below the *low stock threshold*
- is edited inline on the *inventory dashboard* with immediate persist
- **Invariant:** must always be a non-negative value; edits must propagate to customer-facing *stock availability* in real time

### inventory export

- produces a CSV download of stock data for the *store staff* member's *store* only
- includes *product* name, *category*, current *stock level*, and last updated timestamp per row
- is scoped to the single *store* — multi-store export is not supported in this increment

### backorder purchase

- allows a customer to purchase a *product* that is currently out of stock, relaxing the previous gate where *stock availability* prevented checkout of unavailable items
- signals to the customer that the *product* is backordered and will ship when restocked

### store staff *(boundary)*

- is the admin actor who uses the *inventory dashboard* to manage *stock levels* at their *store*

### product *(boundary)*

- is the entity whose *stock levels* are viewed, edited, and alerted on in the *inventory dashboard*

### stock availability *(boundary)*

- is the real-time availability state of a *product* that the *inventory dashboard* reflects and that *backorder purchase* relaxes the purchase gate for

### store *(boundary)*

- scopes the *inventory dashboard* and *inventory export* to a single physical location

### category *(boundary)*

- is a sort and filter dimension on the *inventory dashboard* and a column in the *inventory export*

#### Decisions made

- *Inventory Dashboard* is its own KA for this increment because it introduces a substantive admin interface with its own behavior (search, sort, filter, inline editing, export, alerting) and replaces the prior Increment 1 stock form — it is not merely a view of *product catalog* (independence test).
- *Low stock alert* earns its own heading because it has an invariant (must appear/disappear relative to threshold), drives a dedicated filter dimension on the dashboard, and has cross-concept interaction with *low stock threshold* and *stock level*.
- *Low stock threshold* earns its own heading because it is configurable and determines the boundary between "adequately stocked" and "needs attention" — it is not merely a number on a product (typing call: concept, not property).
- *Stock level* earns its own heading because it has its own invariant (non-negative, real-time propagation), is directly edited, and has cross-concept interactions with *low stock alert*, *low stock threshold*, and *stock availability* — it is not merely a field on *product*.
- *Inventory export* earns its own heading because it has scope constraints (single store, specific columns) and its own output format — it is not merely a button on the dashboard.
- *Backorder purchase* earns its own heading because it introduces a behavioral change to the checkout flow, relaxing the *stock availability* gate. Source evidence is limited — the story has no acceptance criteria in the story graph; the concept is modeled from the story name and existing domain knowledge that *stock availability* "gates the order flow, preventing checkout of backordered items."
- Display Low Stock Badge story has no acceptance criteria in the story graph but is functionally described in the View Inventory Dashboard AC #2 — the *low stock alert* badge behavior is sourced from there.
- *Store staff*, *product*, *stock availability*, *store*, and *category* are boundary — they are owned by their respective modules; this scope depends on them for actor identity, data, and location scoping (scope-fit test).

#### References

**Ref — Inventory management**
Source: context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

**Ref — Inventory stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: View Inventory Dashboard, Display Low Stock Badge, Allow Backorder Purchase
Extract: acceptance criteria (View Inventory Dashboard only; Display Low Stock Badge and Allow Backorder Purchase have empty AC in the story graph)

---

# Boundary Domain

## product

Owned by: Product Catalog

- is the entity that *product search* matches by keyword, *filter facets* narrow by dimension, the *inventory dashboard* displays with *stock levels*, and *backorder purchase* allows purchasing when out of stock

#### Decisions made

- *Product* is owned by Product Catalog — this scope depends on it for search matching, filter narrowing, stock management, and backorder gating (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA
Extract: partial

---

## product catalog

Owned by: Product Catalog

- is the searchable, filterable collection that *product search* queries by keyword and that *filter facets* operate over to narrow the *product* list

#### Decisions made

- *Product catalog* is owned by Product Catalog — this scope depends on it as the corpus being searched and filtered (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA
Extract: partial

---

## category

Owned by: Product Catalog

- is one of the *filter facet* dimensions for narrowing *products* by product type or pet type, and a sort and filter dimension on the *inventory dashboard*

#### Decisions made

- *Category* is owned by Product Catalog — this scope depends on it as a filter dimension on both the customer-facing catalog and the admin *inventory dashboard* (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA, category concept
Extract: partial

---

## stock availability

Owned by: Product Catalog

- is the real-time availability state of a *product*, used as a *filter facet* dimension in *product search*, displayed in the *inventory dashboard*, defaulted to the preferred *store* by the *tailored experience*, and whose purchase-blocking gate is relaxed by *backorder purchase*

#### Decisions made

- *Stock availability* is owned by Product Catalog — this scope depends on it as a filter dimension, a dashboard display value, a tailoring default, and the gate that *backorder purchase* modifies (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA, stock availability concept
Extract: partial

---

## store

Owned by: Store

- is the physical location that can be set as *my store*, filtered by *store specialization filter* and *product availability filter*, and scopes the *inventory dashboard* and *inventory export* to a single location

#### Decisions made

- *Store* is owned by the Store module — this scope depends on it for personalization targeting, store filtering, and inventory scoping (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA
Extract: partial

---

## store locator

Owned by: Store

- is the discovery surface where *store specialization filter* and *product availability filter* operate and where the *tailored experience* highlights the preferred *store*

#### Decisions made

- *Store locator* is owned by the Store module — this scope depends on it as the surface for store filtering and my-store highlighting (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA, store locator concept
Extract: partial

---

## store specialization

Owned by: Store

- is a property of *store* — the declared area of expertise (e.g. reptile section, premium dog food) used as a filter dimension by *store specialization filter*

#### Decisions made

- *Store specialization* is a property of *store* — it has no independent behavior outside the filtering dimension it provides; included as boundary because *store specialization filter* references it (scope-fit test; typing call: property).

#### References

**Ref — Store**
Source: context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: partial

---

## customer account

Owned by: Customer Account

- stores the *my store* preference, owns *customer pet profiles*, and provides the login identity that gates preference-setting and pet profile creation

#### Decisions made

- *Customer account* is owned by Customer Account module — this scope depends on it for preference storage, pet profile ownership, and login gating (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA
Extract: partial

---

## customer pet profile

Owned by: Customer Account

- records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)
- is owned by a logged-in *customer account* — guest sessions are prompted to log in before creating a profile
- supports multiple profiles per *customer account*, each listed under "My Pets"
- feeds downstream personalized recommendation algorithms with species, breed, and age data

#### Decisions made

- *Customer pet profile* is owned by Customer Account — the Create Customer Pet story in this increment adds CRUD behavior to an existing Customer Account concept; this scope depends on it for pet data but does not own the concept (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA, pet profile concept
Extract: partial

**Ref — Pet profile stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Create Customer Pet
Extract: acceptance criteria

---

## click-and-collect

Owned by: Store

- provides the checkout store-selection step that the *tailored experience* pre-selects with the preferred *store*

#### Decisions made

- *Click-and-collect* is owned by the Store module — this scope depends on it only for the checkout pre-selection behavior driven by *my store* (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA, click-and-collect concept
Extract: partial

---

## store staff

Owned by: Store Operations

- is the admin actor who uses the *inventory dashboard* to manage *stock levels* at their *store*

#### Decisions made

- *Store staff* is owned by Store Operations — this scope depends on the role for dashboard access but does not own staff permissions or admin workflow (scope-fit test).

#### References

**Ref — Admin dashboard**
Source: context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

---

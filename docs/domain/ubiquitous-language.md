---
state: ubiquitous-language
---

# Module: PawPlace

Concept sketch for PawPlace — an online pet store with e-commerce for pet supplies and in-store adoption visits. Term groupings aligned to `domain-terms.md` (`state: domain-terms`, slot 04 PASS). Supersedes `key-abstractions.md` for canonical vocabulary; that file remains as a domain-sketch baseline (`state: domain-sketch`).

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.

**Terms**:
- **Product Catalog**
  - **product catalog** — browsable, searchable collection of pet supplies and single source of truth for product identity, pricing, categorization, stock, and reviews
  - **product** — pet supply item available for online purchase
  - **product image** — visual asset attached to a product
  - **category** — grouping that organizes products for browsing and filtering
  - **customer review** — star rating with optional text and photo attached to a product
  - **stock availability** — real-time indicator of whether a product is purchasable at a store
- **Pet**
  - **pet** — store animal showcased online for adoption visits, not online purchase
  - **breed** — species and variety classification on a pet
  - **pet photo** — image on a pet profile showing the animal
  - **temperament assessment** — staff note on a pet's behavior and suitability
  - **health record** — medical and care history shared on a pet profile
  - **pet lifecycle event** — recorded state change in a pet's adoption status
  - **pet source** — provenance of a pet (rescued, breeder-supplied, transferred)
  - **pet lineage** — breed parentage for pedigree documentation
  - **pet profile** — online presentation of a store animal for adoption browsing
- **Appointment**
  - **appointment** — scheduled visit for a customer to meet a pet at a store
  - **time slot** — available date-and-time window for a pet visit at a store
  - **visit outcome** — result recorded after a completed appointment
  - **check-in** — recorded customer arrival at the store for an appointment
  - **no-show** — appointment where the customer did not arrive and did not cancel
  - **follow-up action** — staff-initiated step after an appointment concludes
- **Store**
  - **store** — physical retail location hosting pets, appointments, and click-and-collect pickup
  - **store locator** — map and list discovery feature for finding stores by distance and specialization
  - **click-and-collect** — delivery option to order online and pick up at a selected store
- **Customer Account**
  - **customer account** — persistent customer identity tying together history, preferences, and saved data
  - **guest checkout** — purchase path without creating an account
  - **wishlist** — customer-curated list of products not yet purchased
  - **communication preferences** — opt-in and opt-out settings for marketing notification categories
  - **saved address** — shipping or billing address stored for reuse at checkout
  - **customer pet** — customer's own pet record used for recommendations and reorder timing
- **Order**
  - **order** — complete purchase lifecycle from cart through delivery or return
  - **shopping cart** — persistent container of products intended for purchase
  - **cart item** — one product entry with quantity in a shopping cart
  - **order line item** — one product with price snapshot in a confirmed order
  - **delivery option** — shipping method or click-and-collect choice recorded on an order
  - **return** — reversal of part or all of an order initiated from order history
- **Payment**
  - **payment** — financial transaction for an order across integrated payment vendors
  - **payment vendor** — third-party payment processor behind unified checkout
  - **saved payment method** — tokenized payment credential stored on a customer account
  - **refund** — reverse payment routed through the original payment vendor
- **Notification**
  - **notification** — transactional or marketing message delivered to a customer
  - **notification preferences** — category opt-in definitions enforced at delivery time
  - **restock alert** — notification when a previously purchased product is back in stock or likely needs reordering
- **content** *(boundary — owned by Content Management)*
- **admin dashboard** *(boundary — owned by Store Operations)*

Customers browse the *product catalog* and *pet* gallery online, book an *appointment* at a *store* to meet a *pet*, and purchase supplies through *order* and *payment* flows tied to their *customer account*. *Store* anchors offline operations — each *pet* lives at a *store*, *appointment* visits happen there, and *click-and-collect* *order* are fulfilled on site. *Notification* delivers transactional *notification* unconditionally and marketing *notification* only when *communication preferences* allow. A *pet* cannot be purchased online; the only acquisition path is an in-store visit booked through *appointment*. Every *refund* routes through the *payment vendor* that handled the original transaction.

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
- computes from quantity on hand minus reserved quantity
- gates the purchase path — a *product* that is out of stock at all stores must not offer a purchase option
- **Invariant:** must always be current; stale availability that permits checkout of an unavailable *product* is a domain failure

### Decisions made

- *Product image*, *category*, *customer review*, and *stock availability* stay under *Product Catalog*, not their own KAs — each has no meaning outside a *product* or the catalog itself (independence test).
- Filtering and search are behaviors of *Product Catalog*, not separate terms — they describe how the catalog is navigated.
- *Customer review* and *stock availability* are concepts, not properties — each carries distinct rules and interactions beyond a simple data slot.

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

*Pet* is an available animal — dog, cat, bird, fish, small mammal, or reptile — showcased online as a browsable gallery but explicitly not purchasable through the site. It owns the animal's *pet profile*, including *breed*, *pet photo*, *temperament assessment*, and *health record*, and collaborates with *Store* (each *pet* is located at exactly one *store*) and *Appointment* (the call-to-action from a *pet*'s page drives the booking flow). *Pet* has its own lifecycle managed by store staff: available, adoption-in-progress, and adopted. Invariant: a *pet* must always be associated with exactly one *store*; a *pet*'s online presence must always lead to an *appointment* booking path and never to a purchase path.

### pet

- is an available animal (dog, cat, bird, fish, small mammal, reptile) showcased online as a browsable gallery but explicitly not purchasable through the site
- presents a *pet profile* with *breed*, age, *pet photos*, *temperament assessment*, and *health record* details the store is comfortable sharing
- is located at exactly one *store* and shows the customer which *store* and how far away it is
- drives the *appointment* booking call-to-action — never a purchase path
- transitions through lifecycle states managed by store staff via *pet lifecycle events*: available, adoption-in-progress, adopted
- **Invariant:** must always be associated with exactly one *store*; must never expose a purchase path

### breed

- is a classification attribute on a *pet* describing its species and variety (e.g., Golden Retriever, Siamese, Betta)
- informs customer browsing and drives filtering in the *pet* gallery
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

- *Breed*, *pet photo*, *temperament assessment*, *health record*, *pet lifecycle event*, *pet source*, *pet lineage*, and *pet profile* stay under *Pet*, not their own KAs — each has no standalone domain meaning outside a store *pet* (independence test).
- *Pet* is its own KA rather than a sub-concept of *Product Catalog* because *pet* explicitly cannot be purchased online — the rule "you cannot buy a pet online" creates a fundamentally different interaction model (scope-fit test).
- **Canonical naming resolved:** `pet profile` (Pet KA) is the store animal's online presentation; `customer pet` (Customer Account KA) is the customer's own pet record. The term `pet profile` in `key-abstractions.md` under Customer Account is superseded by `customer pet`.
- *Pet source* and *pet lineage* were introduced in the CRC pass; provenance and pedigree apply where relevant.

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
Source: docs/domain/crc.md
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
Source: docs/domain/crc.md
Locator: ### Pet Lineage / decisions made
Extract: partial

```source
Pet Lineage
sire                               | Pet
dam                                | Pet
pedigree documentation             |
generation depth                   |
```

---

## Appointment

*Appointment* is a scheduled visit for a customer to meet a specific *pet* at a specific *store* — the mechanism that enforces the rule that *pet* cannot be purchased sight-unseen. It owns the booking flow (selecting a *time slot*, optionally adding a visit note), generates confirmation and day-before reminder *notification*, and tracks the visit through to a *visit outcome*. *Appointment* collaborates with *Pet* (the animal being visited), *Store* (location and available *time slot*), *Customer Account* (booking history), and *Notification* (confirmation and reminder delivery). Invariant: an *appointment* must always reference exactly one *pet* and one *store*, must always have a date and *time slot*, and must be visible to store staff.

### appointment

- binds a customer, a *pet*, and a *store* into a scheduled visit
- captures a date, *time slot*, and optional visit note (e.g., "I have two kids under five")
- triggers a confirmation *notification* on booking and a reminder *notification* the day before
- appears on the store staff view of incoming bookings
- records in the *customer account*'s *appointment* history (past and upcoming)
- **Invariant:** must reference exactly one *pet* and one *store*; must have a date and *time slot*

### time slot

- is an available date-and-time window for a *pet* visit scoped to a specific *store*'s operating hours
- presents to the customer during the booking flow, filtered by *store* and date
- becomes unavailable to other customers once booked for an *appointment*

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

### Decisions made

- *Time slot*, *visit outcome*, *check-in*, *no-show*, and *follow-up action* stay under *Appointment*, not their own KAs — each exists only in the context of booking or completing a visit (independence test).
- Visit note is an attribute of an *appointment*, not a separate term — it has no independent domain meaning.
- *Visit outcome*, *check-in*, *no-show*, and *follow-up action* are gap terms from the story graph ("Track Visit Outcomes" sub-epic); acceptance criteria deferred to exploration.
- Confirmation and reminder delivery are behaviors delegated to *Notification*, but *Appointment* owns the trigger.

### References

**Ref — Appointment booking system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 9
Extract: partial

```source
When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children."
```

**Ref — Track Visit Outcomes (story-graph)**
Source: docs/story/story-graph.json
Locator: epic "Book Pet Visit" / sub-epic "Track Visit Outcomes"
Extract: partial (acceptance_criteria pending exploration)

```source
{
  "name": "Record Visit Outcome",
  "acceptance_criteria": []
}
```

**Ref — Cancel or Rebook Appointment After Pet Adoption (story-graph)**
Source: docs/story/story-graph.json
Locator: story "Cancel or Rebook Appointment After Pet Adoption" / acceptance_criteria item 4
Extract: partial

```source
4. **WHEN** the customer neither cancels nor rebooks before the appointment date
**THEN** the appointment remains in the system but staff see a "pet adopted" warning on their incoming appointments view
**AND** the appointment is treated as a no-show after the date passes
```

---

## Store

*Store* is a physical retail location that anchors the offline dimension of PawPlace — it hosts *pet*, conducts *appointment* visits, and fulfills *click-and-collect* *order* pickup. It owns its identity and operational details: address, geo-coordinates, operating hours, contact details, and any specializations. The *store locator* is a first-class discovery feature offering map and list views with distance calculation from a customer's shared location or entered postcode. *Store* collaborates with *Pet* (each *pet* is located at exactly one *store*), *Appointment* (*time slot* scoped to a *store*), and *Order* (*click-and-collect* fulfillment). Invariant: a *store* must always have a valid address, geo-coordinates, and operating hours; a *click-and-collect* *order* must reference a specific *store* for pickup.

### store

- holds identity and operational details: address, geo-coordinates, operating hours, contact info, and specializations
- hosts *pet* and provides *time slot* for *appointment* booking
- fulfills *click-and-collect* orders when selected as the pickup location
- calculates distance from the customer's shared location or entered postcode
- tailors the browsing experience when set as the customer's preferred store
- **Invariant:** must always have a valid address, geo-coordinates, and operating hours

### store locator

- provides map view and list view of all *store*, filtered by distance, availability, and specialization
- calculates distance from the customer's shared location or entered postcode
- allows customers to set a preferred *store* ("my store") so the browsing experience tailors itself

### click-and-collect

- is the *delivery option* of ordering online and picking up at a customer-selected *store*
- saves on shipping costs and brings the customer into the physical *store*
- requires store staff to prepare the *order* for collection, with the *order* lifecycle reflecting *click-and-collect* fulfillment steps
- **Invariant:** must reference a specific *store* as the pickup location

### Decisions made

- *Store locator* stays under *Store*, not its own KA — it is the discovery mechanism for *store* and has no domain meaning independent of *store* data (independence test).
- *Click-and-collect* is placed under *Store* rather than *Order* because the *store* is the fulfillment point; *Order* references *click-and-collect* as a *delivery option*.
- "My store" preference is held by *Customer Account* as a stored preference value; the tailoring behavior is owned by *Store*.

### References

**Ref — Store locator**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: whole

```source
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.
```

**Ref — Click-and-collect**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
Speaking of which — click-and-collect should probably be an option. Order online, pick up at your local store. Saves on shipping and gets people in the door.
```

---

## Customer Account

*Customer Account* is the persistent identity that ties together a person's entire relationship with PawPlace — their *order* history, *appointment* history, *wishlist*, *saved address*, *saved payment method* (via *Payment*), *communication preferences*, and their own *customer pet* (for recommendations). Authentication is standard username-and-password: registration, login, logout, password reset, email verification, and reliable cross-device session management. *Customer Account* collaborates with *Order* (history, reorder), *Appointment* (booking history), *Notification* (preference-driven delivery), and *Product Catalog* (*wishlist* links to *product*). Invariant: a *customer account* must always have a verified email; session management must be reliable across devices without frequent expiry.

### customer account

- authenticates via username and password: registration, login, logout, password reset, email verification
- maintains reliable sessions across devices without frequent expiry
- aggregates the customer's full history: *order*, *appointment*, *wishlist*, *saved address*, *saved payment method*, *customer pet*, and preferred *store*
- drives smart behaviours like reorder reminders based on *customer pet* data and purchase frequency
- **Invariant:** must always have a verified email; session management must be reliable across devices

### guest checkout

- allows a customer to complete a purchase without creating a *customer account*
- collects shipping and billing details for the single transaction only — nothing persists
- promotes *customer account* creation by surfacing the value of *order* history, *saved addresses*, and reorder functionality

### wishlist

- is a customer-curated list of *product* they are interested in but have not yet purchased
- persists across sessions as part of the *customer account*
- links back to the *Product Catalog* for current price and *stock availability*

### communication preferences

- governs what marketing *notification* a customer receives — promotional emails, *restock alert*, pet care tips, and event notifications
- offers granular opt-in and opt-out by category
- is stored on the *customer account* but enforced by *Notification* at delivery time
- **Invariant:** marketing *notification* must never be sent without explicit opt-in for the relevant category within *communication preferences*

### saved address

- is a shipping or billing address stored on the *customer account* for reuse across future *order*
- allows customers to hold multiple *saved addresses* and select among them at checkout

### customer pet

- is the customer's own pet record held within their *customer account*: name, *breed*, age, and dietary needs
- powers smart behaviors such as reorder reminders when purchase frequency suggests the customer is likely running low on food
- enables personalized recommendations based on the customer's existing animals
- is distinct from *pet* (Pet KA) — a *customer pet* describes an animal the customer already owns; a *pet* is a store animal available for adoption

### Decisions made

- *Guest checkout*, *wishlist*, *communication preferences*, *saved address*, and *customer pet* stay under *Customer Account*, not their own KAs — each has no behavior outside the account context (independence test).
- **Canonical naming confirmed:** `customer pet` replaces the `pet profile` label used in `key-abstractions.md` for the customer's own pet record. `pet profile` is reserved for the store animal's online presentation under the Pet KA.
- Authentication (login, registration, session management) is a behavior of *Customer Account*, not a separate KA.
- *Saved address* was added in the CRC pass; sourced from guest checkout requirements referencing "saved addresses" as an account benefit.

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

**Ref — Notification preferences**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

---

## Order

*Order* is the complete purchase lifecycle from the moment a customer commits to buying through to delivery and potential *return*. It begins with the *shopping cart* — a persistent container that survives device and session switches for logged-in customers — and moves through checkout (shipping address, billing address, *delivery option* selection) to placement, confirmation, fulfillment, and shipping. The *order* owns *delivery option*, shipping *notification* with tracking numbers, and the *return* flow. *Order* collaborates with *Payment* (each *order* triggers payment processing), *Customer Account* (*order* appears in history, enables reorder), *Store* (*click-and-collect* fulfillment), and *Notification* (confirmation and shipping updates). Invariant: an *order* must always have at least one *product*, a *delivery option*, and a completed *payment*.

### order

- captures the complete purchase: *product* via *order line item*, quantities, shipping address, billing address, *delivery option*, and *payment*
- moves through a lifecycle: placed, confirmed, fulfilled, shipped, delivered
- triggers confirmation and shipping *notification* with tracking numbers
- provides the entry point for *return* and reorders from *customer account* history
- **Invariant:** must have at least one *product*, a *delivery option*, and a completed *payment*

### shopping cart

- accumulates *product* with quantities that a customer intends to purchase
- persists across devices and sessions for logged-in customers; guest carts are session-scoped only
- transitions to the checkout flow when the customer commits to buying
- **Invariant:** must persist across devices for logged-in customers; guest carts do not persist

### cart item

- is one entry in the *shopping cart* — a specific *product* at a specific quantity
- tracks the quantity chosen by the customer and reflects current *stock availability* at render time
- **Invariant:** quantity must be at least one

### order line item

- records one *product*, its quantity, and its price at the time of purchase within a confirmed *order*
- captures the price snapshot at purchase time so subsequent *product* price changes do not affect historical *order*
- **Invariant:** must capture the price at the moment the *order* is confirmed, not the current catalog price; quantity must be at least one

### delivery option

- is a choice of shipping method made at checkout: standard, express, same-day for local customers, or *click-and-collect*
- records on the *order* and determines fulfillment routing

### return

- reverses part or all of an *order*, initiated by the customer from their *order* history
- generates a printable label or QR code and tracks the *refund* status
- supports both online and in-store return flows; both are reflected in the *customer account*
- **Invariant:** the *refund* must always route through the *payment vendor* that handled the original transaction

### Decisions made

- *Shopping cart*, *cart item*, *order line item*, *delivery option*, and *return* stay under *Order*, not their own KAs — each exists only in the purchase lifecycle (independence test).
- *Cart item* and *order line item* were introduced in the CRC pass as state-carriers for many-to-many relationships with their own data.
- *Click-and-collect* is listed as a *delivery option* here; its core domain behavior is owned by *Store*.
- Checkout flow (address entry, option selection) is a behavior of the *Order* lifecycle, not a separate concept.

### References

**Ref — Shopping cart persistence**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).
```

**Ref — CRC Cart Item state-carrier**
Source: docs/domain/crc.md
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

**Ref — CRC Order Line Item price snapshot**
Source: docs/domain/crc.md
Locator: ### Order Line Item / Product Catalog decisions made
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
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.
```

---

## Payment

*Payment* handles the financial transaction for every *order* across three *payment vendor* integrations — StripeWave (credit and debit card processing, primary gateway), PayNova (digital wallet with one-tap mobile payments), and VaultPay (buy-now-pay-later with installments). It owns vendor integration, webhook callbacks, payment confirmations, failed payment retries, *refund* processing, and *saved payment method*. *Payment* collaborates with *Order* (each *order* triggers exactly one *payment* flow; each *refund* routes back through the original *payment vendor*) and *return* (refund processing). Invariant: a *payment* must always be associated with exactly one *order*; *refund* must always route through the *payment vendor* that handled the original transaction.

### payment

- is the financial transaction triggered by a confirmed *order*
- processes through exactly one selected *payment vendor* per *order*
- handles webhook callbacks, payment confirmations, and failed payment retries transparently to the customer
- **Invariant:** must always be associated with exactly one *order*

### payment vendor

- is an integrated third-party payment processor behind the unified checkout experience
- integrates three vendors: StripeWave handles credit and debit card authorization as the primary gateway; PayNova handles digital wallet one-tap mobile payments; VaultPay handles buy-now-pay-later installment plans
- handles webhook callbacks, payment confirmations, and failed payment retries — vendor mechanics are invisible to the customer

### StripeWave

- is an instance of *payment vendor* — primary credit and debit card gateway integration

### PayNova

- is an instance of *payment vendor* — digital wallet one-tap mobile payments integration

### VaultPay

- is an instance of *payment vendor* — buy-now-pay-later installment plans integration

### saved payment method

- is a tokenized record of a *payment vendor* credential stored on the *customer account* for reuse at checkout
- presents to the customer at checkout to reduce friction on repeat purchases
- holds only a token — the actual payment credential is held by the *payment vendor*

### refund

- reverses a *payment* by routing the transaction back through the original *payment vendor*
- is invisible to the customer in terms of vendor mechanics; the customer sees only refund status
- **Invariant:** must always route through the *payment vendor* that handled the original transaction

### Decisions made

- StripeWave, PayNova, and VaultPay are instances of *payment vendor*, not separate KAs — they are specific integrations, not independent domain concepts (independence test).
- *Refund* stays under *Payment*, not its own KA — a *refund* is a reverse payment operation that must route through the original *payment vendor* (independence test).
- *Payment* is its own KA rather than folded into *Order* because it owns a distinct integration surface (three vendors, webhooks, retries) with its own invariants — the vendor-routing rule for *refund* is *Payment*'s responsibility.
- *Saved payment method* stays under *Payment* — it is a payment-domain concept tied to *payment vendor* tokenization.

### References

**Ref — Payment vendors and checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
We're integrating with three payment vendors out of the box: StripeWave, PayNova, and VaultPay. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases. The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.
```

**Ref — Returns and refund routing**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.
```

**Ref — Shopping and guest checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
```

---

## Notification

*Notification* is the communication layer that delivers both transactional and marketing messages to customers. Transactional *notification* — *order* confirmations, shipping updates, *appointment* reminders, and *return* or *refund* status updates — are event-driven and must always fire. Marketing *notification* — promotional emails, *restock alert*, pet care tips, and event notices for in-store activities — are opt-in, gated by each customer's *communication preferences*. *Notification* collaborates with *Customer Account* (where *communication preferences* are stored) and every event-producing KA (*Order*, *Appointment*, *Product Catalog*). Invariant: transactional *notification* must always fire for *order* and *appointment* lifecycle events; marketing *notification* must never fire without explicit opt-in.

### notification

- delivers transactional messages (*order* confirmations, shipping updates, *appointment* reminders, *return* and *refund* status updates) triggered by lifecycle events in other concepts
- delivers marketing messages (promotions, personalized recommendations, *restock alerts*, event notices) gated by opt-in
- checks *communication preferences* before sending marketing content
- **Invariant:** transactional *notification* must always fire for lifecycle events; marketing *notification* must never fire without explicit opt-in

### notification preferences

- defines the categories a customer can opt into or out of: promotional, *restock alert*, pet care tips, and event notifications
- is stored on the *customer account* but enforced by *Notification* at delivery time

### restock alert

- notifies a customer when a *product* they have bought before is back in stock or purchase frequency suggests they are likely running low
- is gated by the customer's *communication preferences* — only sent when opt-in for that category is active

### Decisions made

- *Notification preferences* are placed under *Notification* because the preference logic — what categories exist, what opt-in means — is owned by the *Notification* domain; *Customer Account* merely stores the customer's choices.
- *Restock alert* stays under *Notification*, not *Product Catalog* — it is a *notification* behavior triggered by stock data, not a catalog concept (scope-fit test).
- Transactional vs. marketing is a classification within *notification*, not separate KAs — both are communications with different opt-in rules.
- Personalization ("your dog's birthday") combines data from *Customer Account* (*customer pet*) with *Notification* delivery — *Notification* orchestrates it.

### References

**Ref — Email and notification system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
We want a proper email and notification system. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

**Ref — Content and blog**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 33
Extract: whole

```source
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.
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

- is the staff-facing surface for managing inventory, viewing incoming *appointment* bookings, updating *pet profile* content, and handling *click-and-collect* fulfillment
- defines the data surfaces store staff need; *Store Operations* (future module) owns the dashboard UI, staff permissions, and fulfillment workflow

### Decisions made

- *Admin dashboard* is a boundary term — PawPlace provides the data (inventory, *appointment*, *pet* lifecycle) but does not own the staff tooling or permission model (scope-fit test).

### References

**Ref — Admin dashboard**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

---

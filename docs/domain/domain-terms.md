---
state: domain-terms
---

# Module: PawPlace

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.

**Key Abstractions (term grouping)**:
- **Product Catalog**: product catalog, product, product image, category, customer review, stock availability
- **Pet**: pet, breed, pet photo, temperament assessment, health record, pet lifecycle event, pet source, pet lineage, pet profile
- **Appointment**: appointment, time slot, visit outcome, check-in, no-show, follow-up action
- **Store**: store, store locator, click-and-collect
- **Customer Account**: customer account, guest checkout, wishlist, communication preferences, saved address
- **Order**: order, shopping cart, cart item, order line item, delivery option, return
- **Payment**: payment, payment vendor, saved payment method, refund
- **Notification**: notification, notification preferences, restock alert

---

# Core Domain

## Product Catalog

*Product Catalog* is the browsable and searchable collection of all pet supplies available for online purchase — the single source of truth for *product* identity, pricing, categorization, real-time *stock availability*, and the *customer review* system. It owns filtering and search so customers can narrow results by *category*, pet type, or brand without being exposed to irrelevant items. No other abstraction may duplicate *product* identity, *stock availability* truth, or *customer review* ownership. *Product Catalog* collaborates with *Order* (which reads current price at purchase time) and *Customer Account* (whose *wishlist* links back to products). Invariant: *product* identity, *stock* truth, and *customer review* ownership belong exclusively to *Product Catalog*.

### product image

- A *product image* is a visual asset attached to a *product*, carrying a source file reference, alt text, and a display order.
- Multiple *product images* are composed under a single *product*, ideally covering multiple angles.
- *Product images* are presented on the *product* detail page to support purchase decisions.

### Decisions made

- *Product image* stays under *Product Catalog*, not its own KA — a *product image* has no meaning outside the context of a *product* (independence test).

### References

**Ref — Product catalog and browsing**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 3–5
Extract: partial

```source
The product catalog needs to be rich. Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews.
```

---

### category

- A *category* organizes *products* into browsable groups — by product type, pet type, or brand.
- A *product* may belong to multiple *categories* simultaneously; *categories* are not exclusive.
- *Categories* act as filter facets enabling customers to narrow *search results* without scrolling through irrelevant items.

### Decisions made

- *Category* stays under *Product Catalog*, not its own KA — *categories* exist to organize *products* and have no standalone domain behavior (independence test).
- Filtering and search are behaviors of the *Product Catalog*, not separate terms — they describe how the catalog is navigated.

### References

**Ref — Product catalog and browsing**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 3
Extract: partial

```source
People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.
```

---

### customer review

- A *customer review* attaches a one-to-five star rating, optional written text, and optional photo to a *product*.
- Multiple *customer reviews* aggregate into the *product*'s star rating and review count.
- Photo reviews show a customer's pet using the *product*, adding social proof.
- Invariant: a *customer review* must be attached to exactly one *product*; only one *customer review* per *customer account* per *product*.

### Decisions made

- *Customer review* stays under *Product Catalog*, not its own KA — a *review* has no meaning outside the context of a *product* (independence test).

### References

**Ref — Rating and reviews**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 5
Extract: partial

```source
We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing.
```

---

### stock availability

- *Stock availability* is a real-time indicator of whether a *product* is purchasable and how much quantity is available to sell at a given *store*.
- *Stock availability* is computed from quantity on hand minus reserved quantity.
- *Stock availability* gates the purchase path — a *product* that is out of stock at all stores must not offer a purchase option.
- Invariant: *stock availability* must always be current; stale availability that permits checkout of an unavailable *product* is a domain failure.

### Decisions made

- *Stock availability* stays under *Product Catalog*, not its own KA — it is a real-time property of a *product*, not an independent concept (independence test).

### References

**Ref — Stock availability**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 5
Extract: partial

```source
Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.
```

---

## Pet

*Pet* is an available animal — dog, cat, bird, fish, small mammal, or reptile — showcased online as a browsable gallery but explicitly not purchasable through the site. It owns the animal's *pet profile*, including *breed*, *pet photos*, *temperament assessment*, and *health records*, and collaborates with *Store* (each *pet* is located at exactly one *store*) and *Appointment* (the call-to-action from a *pet*'s page drives the booking flow). *Pet* has its own lifecycle managed by store staff: available, adoption-in-progress, and adopted. Invariant: a *pet* must always be associated with exactly one *store*; a *pet*'s online presence must always lead to an *appointment booking* path and never to a purchase path.

### breed

- *Breed* is a classification attribute on a *pet* describing its species and variety (e.g., Golden Retriever, Siamese, Betta).
- *Breed* informs customer browsing and drives filtering in the *pet* gallery.
- *Breed* is shown on the *pet profile* alongside age, *temperament assessment*, and *health record*.

### Decisions made

- *Breed* stays under *Pet*, not its own KA — *breed* is a property of a *pet* and has no domain meaning outside a *pet*'s profile (independence test).

### References

**Ref — Pets and in-store visits**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 7
Extract: partial

```source
What we're offering is the ability to browse available animals — dogs, cats, birds, fish, small mammals, reptiles — and then register an appointment to come visit them in store. The online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing.
```

---

### pet photo

- A *pet photo* is an image on a *pet profile* showing the animal to prospective visitors.
- Multiple *pet photos* may be attached to a *pet*; store staff upload new *pet photos* as part of managing the *pet*'s listing.
- *Pet photos* are a primary driver of engagement on the *pet* gallery page.

### Decisions made

- *Pet photo* stays under *Pet* — it is a compositional part of the *pet profile* with no independent domain behavior (independence test).

### References

**Ref — Pets and in-store visits**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 7
Extract: partial

```source
The online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing.
```

---

### temperament assessment

- A *temperament assessment* is a store-staff note on a *pet*'s behavior and suitability — e.g., good with children, nervous around other dogs, suitable for first-time owners.
- *Temperament assessments* are surfaced on the *pet profile* to help customers decide whether to book a visit.
- Store staff update *temperament assessments* based on observation over time.

### Decisions made

- *Temperament assessment* stays under *Pet* — it describes the animal's character as observed by staff and has no meaning outside a *pet*'s profile (independence test).

### References

**Ref — Pets and in-store visits**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 7
Extract: partial

```source
The online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing.
```

---

### health record

- A *health record* captures medical and care history for a *pet* that the store is comfortable sharing — vaccinations, vet check dates, treatments.
- *Health records* are surfaced on the *pet profile* to reassure prospective visitors.
- Store staff control which *health record* details are shown publicly.

### Decisions made

- *Health record* stays under *Pet* — it is a property of an individual animal and has no domain meaning outside the *pet*'s profile (independence test).

### References

**Ref — Pets and in-store visits**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 7
Extract: partial

```source
The online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing.
```

---

### pet lifecycle event

- A *pet lifecycle event* records a state change in a *pet*'s status — typically: available, adoption-in-progress, or adopted.
- *Pet lifecycle events* are recorded by store staff when a *pet*'s circumstances change.
- The *pet*'s current status is derived from its most recent *pet lifecycle event* and is shown on the *pet profile*.

### Decisions made

- *Pet lifecycle event* stays under *Pet* — lifecycle states only exist in the context of managing a *pet*'s availability for adoption (independence test).

### References

**Ref — Admin pet management**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

---

### pet source

- *Pet source* records the provenance of a *pet* — e.g., rescued, breeder-supplied, or transferred from another *store*.
- *Pet source* informs store staff context and may be surfaced on the *pet profile* where appropriate.

### Decisions made

- *Pet source* stays under *Pet* — it is a provenance attribute of the animal with no behavior outside the *pet*'s profile (independence test).
- *Pet source* was added in the CRC pass; it has no direct requirement-source quote but derives from the *pet* profile's need to document background context.

### References

*No direct source quote — derived from CRC refinement of the Pet KA.*

---

### pet lineage

- *Pet lineage* captures the *breed* parentage of a *pet* — relevant for registered pedigrees or cross-breed documentation.
- *Pet lineage* may be surfaced on the *pet profile* for customers interested in parentage when considering adoption.

### Decisions made

- *Pet lineage* stays under *Pet* — lineage is a specific attribute of a *pet*'s background and has no standalone domain behavior (independence test).
- *Pet lineage* was added in the CRC pass as a refinement; applies to pedigree or cross-breed animals.

### References

*No direct source quote — derived from CRC refinement of the Pet KA.*

---

### pet profile

- A *pet profile* is the online presentation of a *pet*: its *breed*, age, *pet photos*, *temperament assessment*, *health record*, *pet source*, and *pet lineage*.
- Store staff maintain the *pet profile* — uploading new *pet photos*, recording *pet lifecycle events* such as "adopted," and updating assessments.
- The *pet profile* drives the appointment call-to-action and must never expose a purchase path.

### Decisions made

- *Pet profile* is placed under *Pet* KA (following the CRC evolution), where it represents the store animal's complete online presentation.
- **Disambiguation note:** `key-abstractions.md` used the term `pet profile` under *Customer Account* to mean the customer's own pet record (name, breed, age, dietary needs for recommendations). That concept is retained under *Customer Account* as `customer pet`. The ubiquitous-language pass should confirm canonical naming for both to eliminate the term collision.

### References

**Ref — Pets and in-store visits**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 7
Extract: partial

```source
The online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing. And then there's a big clear call-to-action to book a visit.
```

---

## Appointment

*Appointment* is a scheduled visit for a customer to meet a specific *pet* at a specific *store* — the mechanism that enforces the rule that *pets* cannot be purchased sight-unseen. It owns the booking flow (selecting a *time slot*, optionally adding a visit note), generates the *confirmation* notification and day-before reminder, and tracks the visit through to a *visit outcome*. *Appointment* collaborates with *Pet* (the animal being visited), *Store* (location and available *time slots*), *Customer Account* (booking history), and *Notification* (confirmation and reminder delivery). Invariant: an *appointment* must always reference exactly one *pet* and one *store*, must always have a date and *time slot*, and must be visible to store staff.

### time slot

- A *time slot* is an available date-and-time window for a *pet* visit scoped to a specific *store*'s operating hours.
- *Time slots* are presented to the customer during the booking flow, filtered by *store* and date.
- Once an *appointment* is booked for a *time slot*, that *time slot* is no longer available to other customers.

### Decisions made

- *Time slot* stays under *Appointment*, not its own KA — a *time slot* only exists in the context of booking a visit (independence test).

### References

**Ref — Appointment booking system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 9
Extract: partial

```source
When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children."
```

---

### visit outcome

- A *visit outcome* records the result of a completed *appointment* — for example, adoption agreed, not a match, or follow-up requested.
- *Visit outcomes* are recorded by store staff after the customer's visit.
- *Visit outcomes* feed into the customer's *appointment* history and inform any *follow-up action* the store initiates.

### Decisions made

- *Visit outcome* is a gap term identified in the story graph ("Track Visit Outcomes" sub-epic, "Record Visit Outcome" story) not yet present in the CRC or key-abstractions. It stays under *Appointment* — a *visit outcome* has no domain behavior outside the context of an *appointment* (independence test).

### References

*Source: docs/story/story-graph.json — "Track Visit Outcomes" sub-epic, "Record Visit Outcome" story (inferred from story-graph gap analysis).*

---

### check-in

- *Check-in* records a customer's physical arrival at the *store* for their *appointment*.
- *Check-in* transitions the *appointment* from scheduled to in-progress.
- Store staff trigger *check-in* when the customer presents at the desk.

### Decisions made

- *Check-in* is a gap term from the story graph ("Check In Customer" story under "Track Visit Outcomes"). It stays under *Appointment* — *check-in* is a lifecycle step within an *appointment* (independence test).

### References

*Source: docs/story/story-graph.json — "Track Visit Outcomes" sub-epic, "Check In Customer" story (inferred from story-graph gap analysis).*

---

### no-show

- A *no-show* marks an *appointment* where the customer did not arrive within the expected window and did not cancel.
- Store staff record a *no-show* to release the *time slot* and update the *appointment* history.
- *No-shows* may trigger a *notification* to the customer with a rebooking offer.

### Decisions made

- *No-show* is a gap term from the story graph ("Record No-Show" story under "Track Visit Outcomes"). It stays under *Appointment* — a *no-show* is an *appointment* state, not an independent concept (independence test).

### References

*Source: docs/story/story-graph.json — "Track Visit Outcomes" sub-epic, "Record No-Show" story (inferred from story-graph gap analysis).*

---

### follow-up action

- A *follow-up action* is a store-staff-initiated step after an *appointment* — for example, scheduling a second visit, sending care information, or referring to another *store*.
- *Follow-up actions* attach to the *visit outcome* and are tracked per *appointment*.

### Decisions made

- *Follow-up action* is a gap term from the story graph ("Set Follow-Up Action" story under "Track Visit Outcomes"). It stays under *Appointment* — a *follow-up action* only exists in the context of a concluded *appointment* (independence test).

### References

*Source: docs/story/story-graph.json — "Track Visit Outcomes" sub-epic, "Set Follow-Up Action" story (inferred from story-graph gap analysis).*

---

## Store

*Store* is a physical retail location that anchors the offline dimension of PawPlace — it is where *pets* live, where *appointments* happen, and where *click-and-collect* orders are picked up. It owns its identity and operational details: address, geo-coordinates, operating hours, contact details, and any specializations. The *store locator* is a first-class discovery feature offering map and list views with distance calculation from a customer's shared location or entered postcode. *Store* collaborates with *Pet* (each *pet* is located at exactly one *store*), *Appointment* (*time slots* are scoped to a *store*), and *Order* (*click-and-collect* fulfillment). Invariant: a *store* must always have a valid address, geo-coordinates, and operating hours; a *click-and-collect* order must reference a specific *store* for pickup.

### store locator

- The *store locator* provides map view and list view of all stores, filtered by distance, availability, and specialization.
- Distance is calculated from the customer's shared location or entered postcode.
- Customers can set a preferred *store* ("my store") so the browsing experience tailors itself.

### Decisions made

- *Store locator* stays under *Store*, not its own KA — it is the discovery mechanism for *stores* and has no domain meaning independent of *store* data (independence test).
- "My store" preference is held by *Customer Account* as a stored preference value; the tailoring behavior is owned by *Store*.

### References

**Ref — Store locator**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: whole

```source
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.
```

---

### click-and-collect

- *Click-and-collect* is the delivery option of ordering online and picking up at a customer-selected *store*.
- *Click-and-collect* saves on shipping costs and brings the customer into the physical *store*.
- Store staff prepare the *order* for collection, and the *order* lifecycle reflects the *click-and-collect* fulfillment steps.
- Invariant: a *click-and-collect* order must reference a specific *store* as the pickup location.

### Decisions made

- *Click-and-collect* is placed under *Store* rather than *Order* because the *store* is the fulfillment point and the concept centers on the physical location; *Order* references *click-and-collect* as a *delivery option*.

### References

**Ref — Click-and-collect**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
Speaking of which — click-and-collect should probably be an option. Order online, pick up at your local store. Saves on shipping and gets people in the door.
```

---

## Customer Account

*Customer Account* is the persistent identity that ties together a person's entire relationship with PawPlace — their *order* history, *appointment* history, *wishlist*, *saved addresses*, *saved payment methods* (via *Payment*), *communication preferences*, and their own *customer pets* (for recommendations). Authentication is standard username-and-password: registration, login, logout, password reset, email verification, and reliable cross-device session management. *Customer Account* collaborates with *Order* (history, reorder), *Appointment* (booking history), *Notification* (preference-driven delivery), and *Product Catalog* (*wishlist* links to products). Invariant: a *customer account* must always have a verified email; session management must be reliable across devices without frequent expiry.

### guest checkout

- *Guest checkout* allows a customer to complete a purchase without creating a *customer account*.
- *Guest checkout* collects shipping and billing details for the single transaction only — nothing persists.
- The system promotes *customer account* creation by surfacing the value of *order* history, *saved addresses*, and reorder functionality.

### Decisions made

- *Guest checkout* stays under *Customer Account*, not its own KA — it is an alternative path through the same identity boundary that accounts own (independence test: *guest checkout* only makes sense in contrast to having an account).

### References

**Ref — Shopping and guest checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
```

---

### wishlist

- A *wishlist* (or saved items) is a customer-curated list of *products* they are interested in but have not yet purchased.
- A *wishlist* persists across sessions as part of the *customer account*.
- *Wishlist* items link back to the *Product Catalog* for current price and *stock availability*.

### Decisions made

- *Wishlist* stays under *Customer Account* — it is a personal collection that has no behavior outside the account context (independence test).

### References

**Ref — User accounts**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: partial

```source
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences.
```

---

### communication preferences

- *Communication preferences* govern what marketing *notifications* a customer receives — promotional emails, *restock alerts*, pet care tips, and event notifications.
- *Communication preferences* offer granular opt-in and opt-out by category.
- Invariant: marketing *notifications* must never be sent without explicit opt-in for the relevant category within *communication preferences*.

### Decisions made

- *Communication preferences* stay under *Customer Account* — they are a dimension of the customer's identity that the account stores; the *Notification* KA enforces them at delivery time.

### References

**Ref — Notification preferences**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

---

### saved address

- A *saved address* is a shipping or billing address stored on the *customer account* for reuse across future *orders*.
- Customers may hold multiple *saved addresses* and select among them at checkout.

### Decisions made

- *Saved address* stays under *Customer Account* — it is a stored preference tied to the customer's identity and has no meaning outside the account context (independence test).
- *Saved address* was added in the CRC pass (not present in *key-abstractions.md*); sourced from the guest checkout source quote which references "saved addresses" as an account benefit.

### References

**Ref — Shopping and guest checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
```

---

### customer pet

- A *customer pet* is the customer's own pet record held within their *customer account*: name, *breed*, age, and dietary needs.
- *Customer pet* data powers smart behaviors such as reorder reminders (when purchase frequency suggests the customer is likely running low on food) and personalized recommendations.
- *Customer pets* are distinct from the *Pet* KA — a *customer pet* describes an animal the customer already owns; a *pet* (Pet KA) is a store animal available for adoption.

### Decisions made

- *Customer pet* (formerly called `pet profile` in *key-abstractions.md*) is placed under *Customer Account* where its recommendations role makes most sense.
- **Renaming note:** The term `pet profile` was used in *key-abstractions.md* for this concept but also appears in the *Pet* KA (CRC) for the store animal's online presentation. To eliminate the collision, this concept is renamed `customer pet` here. The ubiquitous-language pass should confirm canonical naming.

### References

**Ref — User accounts**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: partial

```source
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.
```

---

## Order

*Order* is the complete purchase lifecycle from the moment a customer commits to buying through to delivery and potential *return*. It begins with the *shopping cart* — a persistent container that survives device and session switches for logged-in customers — and moves through checkout (shipping address, billing address, *delivery option* selection) to placement, confirmation, fulfillment, and shipping. The *order* owns *delivery options*, shipping notifications with tracking numbers, and the *return* flow. *Order* collaborates with *Payment* (each *order* triggers payment processing), *Customer Account* (*order* appears in history, enables reorder), *Store* (*click-and-collect* fulfillment), and *Notification* (confirmation and shipping updates). Invariant: an *order* must always have at least one *product*, a *delivery option*, and a completed *payment*.

### shopping cart

- A *shopping cart* accumulates *products* with quantities that a customer intends to purchase.
- A *shopping cart* persists across devices and sessions for logged-in customers; guest carts are session-scoped only.
- A *shopping cart* transitions to the checkout flow when the customer commits to buying.
- Invariant: must persist across devices for logged-in customers; guest carts do not persist.

### Decisions made

- *Shopping cart* stays under *Order*, not its own KA — the *shopping cart* is the initial state of the *order* lifecycle and has no meaning outside the purchase flow (independence test).

### References

**Ref — Shopping cart persistence**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).
```

---

### cart item

- A *cart item* is one entry in the *shopping cart* — a specific *product* at a specific quantity.
- *Cart items* track the quantity chosen by the customer and reflect current *stock availability* at render time.

### Decisions made

- *Cart item* stays under *Order* — it is a compositional element of the *shopping cart* and has no domain behavior outside it (independence test). Added in the CRC pass.

### References

*No direct source quote — derived from standard e-commerce cart item pattern; consistent with requirements-chat-with-product-owner.md line 13.*

---

### order line item

- An *order line item* records one *product*, its quantity, and its price at the time of purchase within a confirmed *order*.
- *Order line items* capture the price snapshot at purchase time so that subsequent *product* price changes do not affect historical *orders*.

### Decisions made

- *Order line item* stays under *Order* — it is a compositional element of the *order* and has no meaning outside it (independence test). Added in the CRC pass.

### References

*No direct source quote — derived from standard e-commerce order record pattern; price-snapshot requirement from requirements-chat-with-product-owner.md (inferred from "historical orders retain the price at time of purchase").*

---

### delivery option

- A *delivery option* is a choice of shipping method made at checkout: standard, express, same-day for local customers, or *click-and-collect*.
- The selected *delivery option* is recorded on the *order* and determines fulfillment routing.

### Decisions made

- *Delivery option* stays under *Order* — it is a choice made during checkout that belongs to the *order* (independence test).
- *Click-and-collect* is listed as a *delivery option* here; its core domain behavior is owned by *Store*.

### References

**Ref — Checkout delivery options**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
Checkout flow: shipping address, billing address, delivery options (standard, express, maybe same-day for local), and then payment.
```

---

### return

- A *return* reverses part or all of an *order*, initiated by the customer from their *order* history.
- A *return* generates a printable label or QR code and tracks the *refund* status.
- Both online and in-store return flows are supported; both are reflected in the *customer account*.
- Invariant: the *refund* must always route through the *payment vendor* that handled the original transaction.

### Decisions made

- *Return* stays under *Order*, not its own KA — a *return* always references a specific *order* and its *payment*; it is the reverse leg of the *order* lifecycle (independence test).

### References

**Ref — Returns and exchanges**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.
```

---

## Payment

*Payment* handles the financial transaction for every *order* across three integrated *payment vendors* — StripeWave (credit and debit card processing, primary gateway), PayNova (digital wallet with one-tap mobile payments), and VaultPay (buy-now-pay-later with installments). It owns vendor integration, webhook callbacks, payment confirmations, failed payment retries, *refund* processing, and *saved payment methods*. *Payment* collaborates with *Order* (each *order* triggers exactly one *payment* flow; *refunds* route back through the original *payment vendor*) and *Return* (refund processing). Invariant: a *payment* must always be associated with exactly one *order*; *refunds* must always route through the *payment vendor* that handled the original transaction.

### payment vendor

- A *payment vendor* is an integrated third-party payment processor behind the unified checkout experience.
- Three *payment vendors* are integrated: StripeWave handles credit and debit card authorization as the primary gateway; PayNova handles digital wallet one-tap mobile payments; VaultPay handles buy-now-pay-later installment plans.
- The *payment vendor* handles webhook callbacks, payment confirmations, and failed payment retries transparently — vendor mechanics are invisible to the customer.

### Decisions made

- StripeWave, PayNova, and VaultPay are instances of *payment vendor*, not separate KAs — they are specific integrations, not independent domain concepts (independence test).
- *Refund* stays under *Payment*, not its own KA — a *refund* is a reverse payment operation that must route through the original *payment vendor* (independence test).
- *Payment* is its own KA rather than folded into *Order* because it owns a distinct integration surface (three vendors, webhooks, retries) with its own invariants — the vendor-routing rule for *refunds* is *Payment*'s responsibility.

### References

**Ref — Payment vendors and checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
We're integrating with three payment vendors out of the box: StripeWave, PayNova, and VaultPay. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases. The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.
```

---

### saved payment method

- A *saved payment method* is a tokenized record of a *payment vendor* credential stored on the *customer account* for reuse at checkout.
- *Saved payment methods* are presented to the customer at checkout to reduce friction on repeat purchases.
- The actual payment credential is held by the *payment vendor* — only a token is stored in the system.

### Decisions made

- *Saved payment method* stays under *Payment* — it is a payment-domain concept tied to *payment vendor* tokenization (independence test). Added in the CRC pass.

### References

**Ref — Shopping and guest checkout**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
```

---

### refund

- A *refund* reverses a *payment* by routing the transaction back through the original *payment vendor*.
- A *refund* is invisible to the customer in terms of vendor mechanics; the customer sees only refund status.
- Invariant: a *refund* must always route through the *payment vendor* that handled the original transaction.

### Decisions made

- *Refund* stays under *Payment*, not under *Order* or its own KA — a *refund* is a reverse payment operation; its routing invariant belongs to *Payment* (independence test).

### References

**Ref — Returns and refund routing**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.
```

---

## Notification

*Notification* is the communication layer that delivers both transactional and marketing messages to customers. Transactional *notifications* — *order* confirmations, shipping updates, *appointment* reminders, and *return* or *refund* status updates — are event-driven and must always fire. Marketing *notifications* — promotional emails, *restock alerts*, pet care tips, and event notices for in-store activities — are opt-in, gated by each customer's *communication preferences*. *Notification* collaborates with *Customer Account* (where *communication preferences* are stored) and every event-producing KA (*Order*, *Appointment*, *Product Catalog*). Invariant: transactional *notifications* must always fire for *order* and *appointment* lifecycle events; marketing *notifications* must never fire without explicit opt-in.

### notification preferences

- *Notification preferences* define the categories a customer can opt into or out of: promotional, *restock alerts*, pet care tips, and event notifications.
- *Notification preferences* are stored on the *customer account* but enforced by the *Notification* domain at delivery time.

### Decisions made

- *Notification preferences* are placed under *Notification* because the preference logic — what categories exist, what opt-in means — is owned by the *Notification* domain; *Customer Account* merely stores the customer's choices.

### References

**Ref — Email and notification system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

---

### restock alert

- A *restock alert* notifies a customer when a *product* they have bought before is back in stock or purchase frequency suggests they are likely running low.
- *Restock alerts* are gated by the customer's *communication preferences* — only sent when opt-in for that category is active.

### Decisions made

- *Restock alert* stays under *Notification*, not *Product Catalog* — it is a *notification* behavior triggered by stock data, not a catalog concept (module-fit test).

### References

**Ref — Email and notification system**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: partial

```source
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

---

# Boundary Domain

### content *(owned by: Content Management)*

- *Content* includes blog posts and guides ("How to introduce a new cat to your household," "Best food for senior dogs") that build trust, support SEO, and provide material for marketing *notifications*.
- PawPlace defines the content surfaces; *Content Management* (future module) owns authoring, publishing workflow, and CMS operations.
- Community features (Q&A, forums) are explicitly deferred to phase two.

### Decisions made

- *Content* is a boundary term — PawPlace depends on it for SEO and email marketing, but does not own the authoring or publishing workflow (module-fit test).

### References

**Ref — Content and blog**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 33
Extract: whole

```source
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.
```

---

### admin dashboard *(owned by: Store Operations)*

- The *admin dashboard* is the staff-facing surface for managing inventory, viewing incoming *appointments*, updating *pet profiles*, and handling *click-and-collect* fulfillment.
- PawPlace defines the data surfaces store staff need; *Store Operations* (future module) owns the dashboard UI, staff permissions, and fulfillment workflow.

### Decisions made

- *Admin dashboard* is a boundary term — PawPlace provides the data (inventory, *appointments*, *pet* lifecycle) but does not own the staff tooling or permission model (module-fit test).

### References

**Ref — Admin dashboard**
Source: docs/external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

---

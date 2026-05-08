---
state: domain-sketch
---

# Module: [PawPlace]

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.

**Core terms**:
- product catalog
- product
- category
- customer review
- stock availability
- pet
- appointment
- time slot
- store
- store locator
- click-and-collect
- customer account
- guest checkout
- pet profile
- wishlist
- communication preferences
- saved address
- shopping cart
- order
- delivery option
- return
- payment
- payment vendor
- saved payment method
- refund
- notification
- notification preferences
- restock alert

**Key Abstractions (term grouping)**:
- **Product Catalog**: product catalog, product, category, customer review, stock availability
- **Pet**: pet
- **Appointment**: appointment, time slot
- **Store**: store, store locator, click-and-collect
- **Customer Account**: customer account, guest checkout, pet profile, wishlist, communication preferences, saved address
- **Order**: order, shopping cart, delivery option, return
- **Payment**: payment, payment vendor, saved payment method, refund
- **Notification**: notification, notification preferences, restock alert

---

# Core Domain

## **Product Catalog**

The browsable, searchable collection of pet supplies that customers evaluate, filter, and decide to buy. Single source of truth for product identity, stock truth, and reviews. Cooperates with Order (cart adds), Customer Account (wishlist links), and Notification (restock alerts).

### **product catalog**
- owns the browsable, searchable collection of pet supplies and is the single source of truth for what is available for sale
- provides filtering and search so customers can narrow results by category, pet type, and brand, producing a refined result list
- owns the customer review and rating system so reviews attach social proof directly to products
- **Invariant:** no other abstraction may duplicate product identity, stock truth, or review ownership

### **product**
- carries multiple images, a description, and weight and dimensions where relevant
- belongs to at least one category and may belong to several simultaneously
- exposes real-time stock availability so checkout never surprises the customer with a backorder
- accumulates customer reviews, producing an aggregate star rating
- **Invariant:** must always belong to at least one category; must always expose current stock availability

### **category**
- organizes products into browsable groups by product type, pet type, or brand
- acts as a navigation facet enabling filtering and narrowing of search results
- accepts a product into multiple categories simultaneously when relevant

### **customer review**
- is **authored by exactly one customer account** — anonymous reviews are not allowed (the customer account is the trust anchor for social proof)
- attaches a one-to-five star rating, optional written text, and optional photo to a product
- contributes to the product's aggregate rating
- **Invariant:** must always be attached to exactly one product **and** authored by exactly one customer account; guest checkout sessions cannot leave reviews (only verified customer accounts can)

### **stock availability**
- reflects in real time whether a product can be purchased
- gates the order flow, preventing checkout of backordered items
- **Invariant:** must be current — stale availability that allows checkout of unavailable items is a domain failure

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

- Customer review stays under Product Catalog, not its own KA — a review has no meaning outside the context of a product (independence test).
- Stock availability stays under Product Catalog — it is a property of a product, not an independent concept (independence test).
- Category stays under Product Catalog — categories exist to organize products and have no standalone domain behavior (independence test).
- Filtering and search are behaviors of the catalog, not separate concepts — they are how the catalog is navigated.
- Customer review **authorship** belongs to **Customer Account** — anonymous and guest-checkout reviews are not allowed. Product Catalog *owns* the review system (where reviews live and how they aggregate); Customer Account *authors* each review (who is accountable for it). Two-sided relationship: review is attached to exactly one product **and** authored by exactly one customer account.
- **Aggregate star rating** stays a derived property of `product`, not its own concept — it has no identity outside the product it summarizes. Recompute trigger lives on `product`: review created, edited, or deleted invalidates the cached aggregate.
- **Photo review** stays an attribute of `customer review` (the optional photo bullet), not a subtype — there is no distinct moderation, display, or lifecycle behavior in the source that would distinguish a photo review from a text-only review.

---

## **Pet**

An available animal showcased online as a browsable gallery but explicitly not purchasable through the site. The central rule that distinguishes pet browsing from product shopping. Cooperates with Store (each pet is at one store) and Appointment (the call-to-action drives booking).

### **pet**
- presents a browsable profile with photos, breed info, age, temperament notes, and health history
- is located at exactly one store and surfaces which store and how far it is from the customer
- drives the appointment booking call-to-action — never a purchase path
- transitions through lifecycle states managed by store staff (e.g. available → adopted)
- **Invariant:** must always be associated with exactly one store; must never expose a purchase path

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

### decisions made

- Breed info, temperament, age, and health history are attributes of a pet, not separate concepts — they have no meaning outside a pet's profile (independence test).
- Pet is its own KA rather than a sub-concept of Product Catalog because pets explicitly cannot be purchased — the rule "you cannot buy a pet online" creates a fundamentally different interaction model.
- Pet status ("adopted") is an admin-managed lifecycle state, not a separate concept.
- **Pet adoption mid-appointment:** when store staff transition a pet to `adopted`, **existing pending appointments for that pet are not auto-cancelled** — instead, the system **notifies** the customer that the pet they were going to visit has been adopted and offers to either rebook against a similar pet or cancel. Staff retain the option to cancel manually. Decision recorded so the rule lives in one place; Notification owns the delivery, Pet owns the trigger, Appointment owns the lifecycle update.

---

## **Appointment**

A scheduled visit for a customer to meet a specific pet at a specific store. The bridge between online pet browsing and in-store interaction — the mechanism that enforces the no-purchase-online rule for pets. Cooperates with Pet, Store, Customer Account, and Notification.

### **appointment**
- is **booked by exactly one customer account** — guest checkout sessions cannot book appointments (the visit must attach to a verified identity that owns appointment history)
- binds a customer account, a pet, and a store into a scheduled visit
- captures a date, time slot, and optional visit note
- triggers a confirmation email on booking and a reminder notification the day before, producing two notification events per appointment
- appears on the store staff view of incoming bookings
- records in the customer account's appointment history (past and upcoming)
- **Invariant:** must reference exactly one customer account, exactly one pet, and exactly one store; must always have a date and time slot

### **time slot**
- represents an available date-and-time window scoped to a specific store's operating hours
- is consumed by an appointment — once booked, it is no longer available to other customers
- is presented to the customer during the booking flow filtered by store and date

### references

**Ref — Appointment booking system**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 9
Extract: whole

```source
The appointment system needs to be tied to a specific store location. We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children." They get a confirmation email, a reminder the day before, and the store staff should see it on their end too.
```

### decisions made

- Time slot stays under Appointment, not its own KA — a time slot only exists in the context of booking a visit (independence test).
- Visit note is an attribute of an appointment, not a separate concept — it has no independent meaning.
- Appointment confirmation and reminder are behaviors delegated to Notification, but the appointment owns the trigger.
- **Appointment authorship belongs to Customer Account — guest checkout cannot book.** Visiting an animal is a high-trust interaction; staff need a real customer to follow up with, the appointment has to live in the account's appointment history, and the reminder/confirmation channel needs a verified email. Two-sided relationship: appointment is booked by exactly one customer account; Customer Account aggregates `appointments`. If the team later wants guest appointments (e.g. via phone collection of contact details), revisit this decision.

---

## **Store**

A physical retail location that anchors the offline dimension of PawPlace — where pets live, where appointments happen, where click-and-collect orders are picked up, and where in-store returns are processed. Owns identity, operational details, and locator. Cooperates with Pet, Appointment, Order (click-and-collect, in-store return), and Notification (adoption-cancels-appointment-visit).

### **store**
- holds identity and operational details: address, geo-coordinates, operating hours, and contact info
- may specialise in certain product categories or pet types
- hosts pets and provides time slots for appointment booking
- fulfills click-and-collect orders when selected as the pickup location
- tailors the browsing experience when set as the customer's preferred store
- **Invariant:** must always have a valid address, coordinates, and operating hours

### **store locator**
- provides map view and list view of all stores
- filters stores by availability, specialisation, and distance from the customer
- calculates distance from the customer's shared location or entered postcode, producing a sorted nearest-first result list

### **click-and-collect**
- offers an alternative to shipping: order online, pick up at a local store
- requires the customer to select a specific store at checkout
- triggers store-side fulfillment preparation by staff
- **Invariant:** must reference a specific store for pickup

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

### decisions made

- Store locator stays under Store, not its own KA — it is the discovery mechanism for stores and has no meaning independent of store data (independence test).
- Click-and-collect is placed under Store rather than Order because the store is the fulfillment point and the concept centers on the physical location; Order references click-and-collect as a delivery option.
- **Click-and-collect is two-sided.** Store owns it as a *fulfillment capability* (which physical location prepares the order, who picks it up, when it's ready); Order owns it as a *delivery-option value* the customer picks at checkout. Same concept, two views — both authoritative within their KA.
- "My store" preference is a customer-facing personalization that stores own — Customer Account holds the preference value, but Store owns the tailoring behavior.
- Geo-tagging, map coordinates, operating hours, and contact details are attributes of a store, not separate concepts.
- **In-store walk-in purchase is in scope for a later phase, not the current model.** Today the Store concept covers physical location, pet hosting, time-slot supply for appointments, click-and-collect fulfillment, and acting as a return point for in-store returns. Walk-in buying (browsing shelves, paying at a counter) will require a separate point-of-sale concept and is deferred — flagged here so stories that touch in-store purchase can be deprioritized to a later thin slice.
- **In-store returns are reflected in the customer account.** Store is a collaborator on Return — staff process the in-person counter flow, the system records the return against the original order, and the refund routes through the original payment vendor as usual. Store does not own Return, but the in-store return path means Store appears on Order's `cooperates with` list.

---

## **Customer Account**

The persistent identity that ties a person's entire relationship with PawPlace together — order history, appointment history, wishlist, addresses, payment methods, communication preferences, and the customer's own pet profiles. Cooperates with Order, Appointment, Notification, and Product Catalog.

### **customer account**
- authenticates the customer via username and password: registration, login, logout, password reset, email verification
- maintains reliable sessions across devices without frequent expiry
- aggregates the customer's full history: orders, appointments, wishlist, saved addresses, saved payment methods, pet profiles, preferred store, and authored customer reviews
- drives smart behaviours like reorder reminders based on pet profile data and purchase frequency
- **Invariant:** must always have a verified email; session management must be reliable across devices

### **guest checkout**
- allows a customer to complete a purchase without creating an account
- collects shipping and billing details for the single transaction only — no persistence
- promotes account creation by surfacing the value of order history, saved addresses, and reorder

### **pet profile**
- is **owned by exactly one customer account** — pet profiles do not exist outside of a registered account
- records the customer's own pet: name, breed, age, and dietary needs
- enables personalised recommendations and smart reorder timing based on purchase frequency
- is distinct from the Pet KA — pet profile is the customer's existing pet; Pet is a store animal available for adoption
- **Invariant:** must be owned by exactly one customer account

### **wishlist**
- is **owned by exactly one customer account** — guest sessions do not have wishlists
- holds products the customer is interested in but has not yet purchased
- persists across sessions as part of the customer account
- links back to the product catalog for current price and stock availability
- **Invariant:** must be owned by exactly one customer account

### **communication preferences**
- are **owned by exactly one customer account** — guest sessions cannot opt into marketing
- govern which marketing notifications a customer receives
- offer granular opt-in and opt-out by category: promotional, restock alerts (back-in-stock and reorder), pet care tips, event notifications
- **Invariant:** must be owned by exactly one customer account; marketing notifications must never be sent without explicit opt-in for that category

### **saved address**
- is **owned by exactly one customer account** — guest checkout collects addresses for the single transaction only, never persisting them
- stores a labeled shipping or billing address (e.g. "Home", "Work") for one-tap selection at checkout
- is selectable as either the shipping or billing address on an order
- **Invariant:** must be owned by exactly one customer account; can be soft-deleted but historical orders retain a snapshot of the address used

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

### decisions made

- Guest checkout stays under Customer Account, not its own KA — it is an alternative path through the same identity boundary that accounts own (independence test: guest checkout only makes sense in contrast to having an account).
- Pet profile (customer's own pets) stays under Customer Account, not under Pet — a pet profile describes the customer's existing pet for recommendation purposes, whereas the Pet KA describes animals available for adoption in store. Different domain concepts with the same word.
- Wishlist stays under Customer Account — it is a personal collection that has no behavior outside the account context (independence test).
- Communication preferences stay under Customer Account — they are a dimension of the customer's identity, not an independent concept.
- Authentication (login, registration, session management) is a behavior of Customer Account, not a separate KA.
- **Saved address is its own concept under Customer Account** (extracted, not just an attribute) — it has identity (label, address fields), lifecycle (added, edited, soft-deleted), and selection behavior at checkout. Two-sided with Order: order references the chosen saved address at checkout time and snapshots it so historical orders survive address deletion.
- **Saved payment method is its own concept under Payment KA** (not Customer Account) — although the customer "owns" it from a UX perspective, the concept primarily encapsulates a vendor-token reference, vendor metadata, and the route a future payment will take. Customer Account *aggregates* `saved payment methods`; Payment *owns* the abstraction. Two-sided relationship.
- **Session** is a technical lifecycle behavior of Customer Account, not a separate concept — cross-device persistence is the only domain-relevant property; session expiry, refresh, and invalidation are implementation concerns of authentication.

---

## **Order**

The complete purchase lifecycle from cart commitment through delivery and potential return. Owns shopping cart, checkout, delivery options, shipping notifications, and the return/exchange flow. Cooperates with Payment, Customer Account, Guest Checkout, Store (click-and-collect, in-store return), and Notification.

### **order**
- is **placed by exactly one customer account or one guest checkout session** — orders without either trace are not allowed
- captures the complete purchase: products, quantities, shipping address (snapshotted from a `saved address` or freshly entered), billing address, delivery option, and payment
- moves through a lifecycle: placed → confirmed → fulfilled → shipped → delivered
- triggers confirmation and shipping notifications with tracking numbers, producing one notification per lifecycle transition
- provides the entry point for returns and reorders from account history
- **Invariant:** must reference exactly one placing party (customer account or guest checkout session); must have at least one product, a delivery method, and a completed payment before it is confirmed

### **shopping cart**
- is **owned by exactly one customer account when persistent, or scoped to exactly one guest session when not** — every cart traces to one of the two identity surfaces
- accumulates products the customer intends to purchase, with quantities
- persists across devices and sessions for logged-in customers
- transitions to the checkout flow when the customer commits to buying
- **Invariant:** must reference exactly one owner (customer account or guest session); must persist across devices for logged-in customers; guest carts are session-scoped only

### **delivery option**
- represents a choice of shipping speed: standard, express, or same-day for local customers
- includes click-and-collect as an alternative that involves store pickup rather than shipping
- is selected during checkout and recorded on the order

### **return**
- is **initiated by the customer account or guest checkout session that placed the original order, or by store staff acting on the customer's behalf for in-store returns**
- reverses part or all of an order, initiated from the customer's order history
- generates a return label or QR code for the customer
- routes the refund through the original payment vendor
- supports both online and in-store return flows, with both reflected in the customer's account
- **Invariant:** must reference exactly one originating order; refund must always route through the payment vendor that handled the original transaction; in-store returns require store staff to record them against the original order

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

### decisions made

- Shopping cart stays under Order, not its own KA — the cart is the initial state of the order lifecycle and has no meaning outside the purchase flow (independence test).
- Return stays under Order, not its own KA — a return always references a specific order and its payment; it is the reverse leg of the order lifecycle (independence test).
- Delivery option stays under Order — it is a choice made during checkout that belongs to the order, not an independent concept.
- Checkout flow (address entry, option selection) is a behavior of the Order lifecycle, not a separate concept.
- **Order authorship is two-sided.** Order is *placed by* exactly one customer account or guest checkout session; Customer Account *aggregates* `orders`. The authoring party drives notification routing (account email vs guest checkout email), entitles the order to land in account history (account-only), and gates whether saved payment methods or saved addresses are eligible at checkout (account-only).
- **Cart authorship mirrors order authorship** — cart is owned by an account or session, and that ownership is inherited by the order it becomes at checkout. Guest carts cannot promote to account carts retroactively without a "save my cart" / account-creation step at checkout.
- **Return authorship has three sources.** Online returns are initiated by the placing customer account; guest-order returns are initiated using the order number + email used at guest checkout; in-store returns are initiated by store staff at the counter. All three reflect in the same order's history, and the refund routing rule (original vendor) is invariant across all three paths.

---

## **Payment**

Financial transaction handling for every order across three integrated payment vendors — StripeWave, PayNova, and VaultPay. Owns vendor integration, webhook callbacks, confirmations, retries, refund routing, and saved payment method abstraction. Cooperates with Order (which includes Return) and Customer Account (saved payment methods).

### **payment**
- triggers exactly one payment flow per order, regardless of which vendor handles it
- presents a unified checkout experience to the customer — vendor mechanics are invisible
- handles webhook callbacks, payment confirmations, and failed payment retries across all integrated vendors
- routes refunds back through the vendor that processed the original transaction
- **Invariant:** must be associated with exactly one order; refund must always route through the original vendor

### **payment vendor**
- abstracts a payment processor behind the unified payment interface
- exposes authorize, capture, settle, and refund operations consistently regardless of underlying provider

### **StripeWave** *is a type of* **payment vendor**
- handles credit and debit card authorize-capture-settle as the primary gateway

### **PayNova** *is a type of* **payment vendor**
- handles digital wallet one-tap mobile authorization, popular with younger buyers

### **VaultPay** *is a type of* **payment vendor**
- handles buy-now-pay-later by creating an installment plan for larger purchases

### **refund**
- reverses a payment by routing through the original payment vendor that processed the transaction
- is **authorized automatically by the system on return approval** for online returns within policy; **store staff authorize** in-store refunds at the counter; finance staff retain manual override for exceptions
- is invisible to the customer — they see refund status but not vendor mechanics
- **Invariant:** must always route through the vendor that handled the original transaction; must reference exactly one return; the authorizing party (system, store staff, or finance) is recorded for audit

### **saved payment method**
- is **owned by exactly one customer account** (not exposed to guest checkout) — the customer-facing concept of "my saved card / wallet" that persists across orders
- holds a vendor-token reference, masked display details (last four digits, card brand, wallet provider), and an expiry where applicable
- is selectable at checkout to skip re-entry of card details, routing the resulting payment through the same vendor the token belongs to
- can be added, edited (label only — vendor data is immutable), and soft-deleted; historical orders retain the vendor reference they used so refund routing is preserved
- **Invariant:** must be owned by exactly one customer account; vendor token must remain valid (or be marked expired) for the saved method to be usable; deletion must not break refund routing on past orders

### references

**Ref — Payment vendors and checkout**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial
Part: Sentences describing the three payment vendors and their integration.

```source
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.
```

**Ref — Returns and refund routing**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial
Part: Sentences about refund routing through original payment vendor.

```source
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.
```

### decisions made

- StripeWave, PayNova, and VaultPay are subtypes of payment vendor — each is a specific integration with delta behavior, sharing the unified vendor interface.
- Refund stays under Payment, not its own KA — a refund is a reverse payment operation that must route through the original vendor (independence test: no meaning outside the payment context).
- Webhook, payment confirmation, and retry are operational behaviors of payment processing, not separate concepts.
- Payment is its own KA rather than being folded into Order because it owns a distinct integration surface (three vendors, webhooks, retries) with its own invariants — the vendor-routing rule for refunds is Payment's responsibility, not Order's.
- **Saved payment method lives under Payment, with two-sided ownership.** The customer-facing surface is on Customer Account (the customer manages "my saved cards"), but the *concept* — vendor token, expiry, vendor-routed lifecycle — is a Payment domain concern. Customer Account *aggregates* `saved payment methods`; Payment *owns* the abstraction. Same pattern applies to refund routing: deleting a saved method must not break refund routing on historical orders.
- **Refund authorization has three sources.** System-automatic on return approval (online returns within policy); store staff at the counter (in-store returns); finance staff (manual override for exceptions). All three are audited; refund routing through the original vendor is invariant across all three.

---

## **Notification**

The communication layer that delivers transactional and marketing messages to customers. Transactional notifications are event-driven and mandatory; marketing notifications are opt-in only. Cooperates with Customer Account (preferences), Order, Appointment, and Product Catalog.

### **notification**
- delivers transactional messages (order confirmations, shipping updates, appointment reminders, pet-adopted-before-visit alerts) triggered by lifecycle events in other concepts
- delivers marketing messages (promotions, personalised recommendations, restock alerts, event notices) gated by opt-in
- routes to **the customer account's verified email** for logged-in customers, or to **the email collected at guest checkout** for guest orders — guests cannot opt into marketing notifications, only transactional ones tied to their order
- checks the customer's communication preferences before sending marketing content, producing a send-or-suppress decision
- **Invariant:** transactional notifications must always fire for lifecycle events; marketing notifications must never fire without explicit opt-in; every notification must have a deliverable target (verified account email or guest checkout email)

### **notification preferences**
- defines the categories a customer can opt in to or out of: promotional, restock alerts, pet care tips, event notifications
- is checked at delivery time by the notification system before any marketing send
- is stored on the customer account but enforced by the notification system

### **restock alert**
- monitors products a customer has previously purchased for reordering signals
- fires when purchase frequency suggests the customer is likely running low, producing a single notification event per product
- is gated by the customer's communication preferences — only sent if opt-in is active for restock alerts

### references

**Ref — Email and notification system**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 21
Extract: whole

```source
We want a proper **email and notification system**. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.
```

### decisions made

- Notification preferences could live under Customer Account (where they are stored) or under Notification (where they are enforced). Placed here because the preference logic — what categories exist, what opt-in means — is owned by the notification domain; Customer Account merely stores the customer's choices. Open question for the team to confirm.
- Restock alert stays under Notification, not Product Catalog — it is a notification behavior triggered by stock data, not a catalog concept (module-fit test).
- Personalization ("your dog's birthday") is a behavior that combines data from Customer Account (pet profiles) with Notification delivery — neither KA owns it exclusively. The notification system orchestrates it.
- Transactional vs. marketing is a classification within notifications, not separate KAs — both are communications with different opt-in rules.
- **Restock alert today conflates two source-distinct triggers** — back-in-stock ("a previously-purchased product just came back into stock") and reorder reminder ("your purchase frequency suggests you're running low"). The current concept describes the frequency case but uses the back-in-stock name. **Split deferred to a later phase**: when the team prioritizes either trigger as a real story, split `restock alert` into `back-in-stock alert` (stock-driven, cross-KA with Product Catalog) and `reorder reminder` (frequency-driven, cross-KA with Customer Account pet profile + order history). Until then, the umbrella `restock alert` covers both intents in copy.
- **Notification delivery target is two-sided.** Customer Account *owns* the verified email (account-side); Guest Checkout *captures* the per-transaction email (guest-side); Notification *owns* the routing decision. Marketing is account-only; transactional fires for both account and guest orders.
- **Pet-adopted-before-visit alert is a transactional notification** triggered by Pet (adoption lifecycle change) with appointment context (Appointment), routed to the customer account that booked the appointment. It is not a marketing message and does not check opt-in.

---

# Boundary Domain

### **content** *(owned by: Content Management — future module)*
- supplies the marketing-ready material PawPlace surfaces in emails and on-site SEO pages (blog posts, pet care guides)
- is authored, published, and versioned outside of PawPlace by the future Content Management module
- exposes only the published content surface to PawPlace; community features (Q&A, forums) are deferred to phase two

### **admin dashboard** *(owned by: Store Operations — future module)*
- exposes the data surfaces store staff need: inventory levels, incoming appointments, pet profile edits, click-and-collect fulfillment queue
- is owned by the future Store Operations module, which controls dashboard UI, staff permissions, and fulfillment workflow
- consumes events and data from PawPlace KAs (Order, Appointment, Pet, Product Catalog) but does not own them

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

- Content is a boundary concept — PawPlace describes what it consumes (marketing-ready blog material) but does not own authoring. The future Content Management module owns CMS workflow.
- Admin dashboard is a boundary concept — PawPlace defines the data surfaces store staff need but does not own staff UX, permissions, or workflow. The future Store Operations module owns the dashboard.

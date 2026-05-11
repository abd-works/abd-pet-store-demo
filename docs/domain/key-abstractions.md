---  
state: domain-sketch  
---  

# Module: [PawPlace]  

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.  

**Core terms**:  
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
- shopping cart  
- order  
- delivery option  
- return  
- customer account  
- guest checkout  
- pet profile  
- wishlist  
- communication preferences  
- payment vendor  
- refund  
- notification  
- notification preferences  
- restock alert  

**Key Abstractions (term grouping)**:  
- **Product Catalog**: product catalog, product, category, customer review, stock availability  
- **Pet**: pet  
- **Appointment**: appointment, time slot  
- **Store**: store, store locator, click-and-collect  
- **Customer Account**: customer account, guest checkout, pet profile, wishlist, communication preferences  
- **Order**: shopping cart, order, delivery option, return  
- **Payment**: payment vendor, refund  
- **Notification**: notification, notification preferences, restock alert  

---  

## Domain logic  

- A pet cannot be purchased online; the only path from pet browsing to acquisition is booking an in-store appointment.  
- A product must always belong to at least one category and must always show current stock availability.  
- A shopping cart persists across devices and sessions for logged-in customers; guest carts do not persist.  
- An appointment must reference exactly one pet at exactly one store, with a date and time slot.  
- An order requires at least one product, a delivery method, and a completed payment before it is confirmed.  
- Refunds always route through the payment vendor that handled the original transaction.  
- Marketing notifications require explicit customer opt-in; transactional notifications fire unconditionally on lifecycle events.  
- Each store has a unique address, geo-coordinates, and operating hours; each pet is located at exactly one store.  
- Guest checkout collects details for a single transaction only; account creation is incentivized but never forced.  

---  

# Core Domain  

## **Product Catalog**  

The product catalog is the primary browsable and searchable collection of pet supplies — food, toys, beds, leashes, grooming products, aquarium gear — that customers interact with to find and evaluate what they want to buy. It is the single source of truth for what is available for sale: each product's identity, rich media (multiple-angle images, descriptions, weight, dimensions), categorization (by category, pet type, brand), and real-time stock availability. The catalog owns filtering and search so that a customer can narrow results meaningfully (e.g. finding the right size harness for a specific breed without scrolling through irrelevant items). It also owns the customer review and rating system — five-star ratings, written reviews, and photo reviews — which attach social proof directly to products. No other abstraction duplicates product identity, stock truth, or review ownership. A product must always belong to at least one category and must always expose its current stock availability; a review must always be attached to exactly one product.  

### Ubiquitous Language  

#### **product**  
- A product is a pet supply item (food, toy, bed, leash, grooming product, aquarium gear) available for purchase through the online store.  
- Every product has images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews.  
- Products show stock availability in real time.  

#### References  

**Ref — Product catalog and browsing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: lines 3–5  
Extract: whole  

```source  
So the basic idea is we're building an online pet store — think of it as the go-to place for pet owners and people looking to become pet owners. The core of the site is a shopping experience for pet supplies: food, toys, beds, leashes, grooming products, aquarium gear, the whole lot. People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.  

The product catalog needs to be rich. Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews. We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.  
```  

#### **category**  
- A category is a way to organize products for browsing — by product type, by pet type, by brand.  
- Customers browse by category, pet type, brand, or use filtering and search to narrow results.  

#### References  

**Ref — Product catalog and browsing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 3  
Extract: partial  
Part: Sentences describing browsing and categorization.  

```source  
People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.  
```  

#### **customer review**  
- A customer review is a five-star rating with optional written text and optional photo attached to a product.  
- Photo reviews show the pet actually using the product.  

#### References  

**Ref — Rating and reviews**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 5  
Extract: partial  
Part: Sentences describing the rating and review system.  

```source  
We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing.  
```  

#### **stock availability**  
- Stock availability is a real-time indicator of whether a product is in stock.  
- Nobody wants to go through checkout and find out the item is backordered.  

#### References  

**Ref — Stock availability**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 5  
Extract: partial  
Part: Sentence about real-time stock.  

```source  
Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.  
```  

---  

### Domain Sketch  

#### **product catalog**  
- owns the browsable, searchable collection of pet supplies and is the single source of truth for what is available for sale  
- provides filtering and search so customers can narrow results by category, pet type, and brand  
- owns the customer review and rating system — reviews attach social proof directly to products  
- Invariant: no other abstraction may duplicate product identity, stock truth, or review ownership  

#### **product**  
- carries multiple images, a description, and weight and dimensions where relevant  
- belongs to at least one category and may belong to several simultaneously  
- exposes real-time stock availability so checkout never surprises the customer with a backorder  
- accumulates customer reviews that contribute to an aggregate star rating  
- Invariant: must always belong to at least one category; must always expose current stock availability  

#### **category**  
- organizes products into browsable groups by product type, pet type, or brand  
- acts as a navigation facet enabling filtering and narrowing of search results  
- a product may belong to multiple categories simultaneously  

#### **customer review**  
- attaches a one-to-five star rating, optional written text, and optional photo to a product  
- contributes to the product's aggregate rating  
- Invariant: must always be attached to exactly one product  

#### **stock availability**  
- reflects in real time whether a product can be purchased  
- prevents checkout of backordered items by gating the order flow  
- Invariant: must be current — stale availability that allows checkout of unavailable items is a domain failure  

---  

### Decisions made  

- Customer review stays under Product Catalog, not its own KA — a review has no meaning outside the context of a product (independence test).  
- Stock availability stays under Product Catalog — it is a property of a product, not an independent concept (independence test).  
- Category stays under Product Catalog — categories exist to organize products and have no standalone domain behavior (independence test).  
- Filtering and search are behaviors of the catalog, not separate terms — they are how the catalog is navigated, not independent domain concepts.  

---  

## **Pet**  

A pet is an available animal — dog, cat, bird, fish, small mammal, or reptile — showcased online as a browsable gallery but explicitly not purchasable through the site. This is the central rule that distinguishes pet browsing from product shopping: buying a living creature requires meeting it in person. The pet abstraction owns the animal's profile information: photos, breed, age, temperament notes, and any health history the store is comfortable sharing. It collaborates with Store (each pet is located at a specific store) and Appointment (the call-to-action on a pet's page drives the booking flow). A pet must always be associated with exactly one store location, and its online presence must always lead to an appointment booking path — never a purchase path. Pet status changes (e.g. "adopted") are managed by store staff through the admin side.  

### Ubiquitous Language  

#### **pet**  
- A pet is an available animal (dog, cat, bird, fish, small mammal, reptile) that can be browsed online but cannot be bought online.  
- The online experience for pets is a gallery: photos, breed info, age, temperament notes, health history, and a call-to-action to book a visit.  
- Pet profiles are updated by store staff (new photos, status changes like "adopted").  

#### References  

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

---  

### Domain Sketch  

#### **pet**  
- presents a browsable profile with photos, breed info, age, temperament notes, and health history  
- is located at exactly one store and shows the customer which store and how far away it is  
- drives the appointment booking call-to-action — never a purchase path  
- transitions through lifecycle states managed by store staff: available → adopted  
- Invariant: must always be associated with exactly one store; must never expose a purchase path  

---  

### Decisions made  

- Breed info, temperament, age, and health history are attributes of a pet, not separate terms — they have no meaning outside a pet's profile (independence test).  
- Pet is its own KA rather than a sub-concept of Product Catalog because pets explicitly cannot be purchased — the domain rule "you cannot buy a pet online" creates a fundamentally different interaction model.  
- Pet status ("adopted") is an admin-managed lifecycle state, not a separate concept.  

---  

## **Appointment**  

An appointment is a scheduled visit for a customer to meet a specific pet at a specific store location. It is the bridge between online pet browsing and in-store interaction — the mechanism that enforces the rule that pets cannot be purchased sight-unseen. The appointment owns the booking flow: selecting a date, choosing a time slot, optionally adding a visit note (e.g. "I have two kids under five"), and receiving confirmation. It collaborates with Pet (the animal being visited), Store (the location and its available time slots), Customer Account (the person booking), and Notification (confirmation email, day-before reminder). An appointment must always reference exactly one pet and one store, must always have a date and time slot, and must be visible to store staff on their end. The booking experience must be dead simple on mobile since customers may book on the go.  

### Ubiquitous Language  

#### **appointment**  
- An appointment is a scheduled visit to meet a specific pet at a specific store.  
- The booking flow lets the customer pick a date, pick a time slot, and optionally add a note.  
- Customers receive a confirmation email and a reminder the day before; store staff see the booking on their end.  

#### References  

**Ref — Appointment booking system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: whole  

```source  
The appointment system needs to be tied to a specific store location. We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children." They get a confirmation email, a reminder the day before, and the store staff should see it on their end too.  
```  

#### **time slot**  
- A time slot is an available date-and-time window for a pet visit at a specific store.  
- Time slots are shown to the customer during the booking flow based on store availability.  

#### References  

**Ref — Appointment booking system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: partial  
Part: Sentences about time slots and booking flow.  

```source  
When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children."  
```  

---  

### Domain Sketch  

#### **appointment**  
- binds a customer, a pet, and a store into a scheduled visit  
- captures a date, time slot, and optional visit note  
- triggers a confirmation email on booking and a reminder notification the day before  
- appears on the store staff view of incoming bookings  
- records in the customer's appointment history (past and upcoming)  
- Invariant: must reference exactly one pet and one store; must have a date and time slot  

#### **time slot**  
- represents an available date-and-time window scoped to a specific store's operating hours  
- is consumed by an appointment — once booked, no longer available to other customers  
- is presented to the customer during the booking flow filtered by store and date  

---  

### Decisions made  

- Time slot stays under Appointment, not its own KA — a time slot only exists in the context of booking a visit (independence test).  
- Visit note is an attribute of an appointment, not a separate term — it has no independent meaning.  
- Appointment confirmation and reminder are behaviors delegated to Notification, but the appointment owns the trigger.  

---  

## **Store**  

A store is a physical retail location that anchors the offline dimension of PawPlace — it is where pets live, where appointments happen, and where click-and-collect orders are picked up. The store owns its identity and operational details: address, map coordinates (geo-tag), operating hours, contact details, and any specializations (e.g. a great reptile section, or the place for premium dog food). It collaborates with Pet (each pet is located at one store), Appointment (time slots are scoped to a store), and Order (click-and-collect fulfillment). The store locator is a first-class feature offering map view, list view, distance calculation (from shared location or postcode), and filtering by what is available at each location. Customers can set a "my store" preference so the experience tailors itself. A store must always have a valid address, coordinates, and operating hours. Click-and-collect orders must reference a specific store for pickup.  

### Ubiquitous Language  

#### **store**  
- A store is a physical retail location with an address, map coordinates, operating hours, contact details, and specializations.  
- Each store may specialise — one might have a great reptile section, another might be the place for premium dog food.  
- Customers can set a "my store" preference so the experience tailors itself.  

#### References  

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

#### **store locator**  
- The store locator is a first-class feature offering map view, list view, and filtering by what is available at each location.  
- Distance is calculated from the customer's shared location or entered postcode.  

#### References  

**Ref — Store locator**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 11  
Extract: partial  
Part: Sentences describing the store locator feature.  

```source  
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location.  
```  

#### **click-and-collect**  
- Click-and-collect is the option to order online and pick up at a local store.  
- It saves on shipping and gets people in the door.  

#### References  

**Ref — Click-and-collect**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences about click-and-collect.  

```source  
Speaking of which — click-and-collect should probably be an option. Order online, pick up at your local store. Saves on shipping and gets people in the door.  
```  

---  

### Domain Sketch  

#### **store**  
- holds identity and operational details: address, geo-coordinates, operating hours, and contact info  
- may specialise in certain product categories or pet types  
- hosts pets and provides time slots for appointment booking  
- fulfills click-and-collect orders when selected as the pickup location  
- calculates distance from the customer's shared location or entered postcode  
- tailors the browsing experience when set as the customer's preferred store  

#### **store locator**  
- provides map view and list view of all stores  
- filters stores by availability, specialisation, and distance from the customer  
- uses the customer's shared location or entered postcode to calculate proximity  

#### **click-and-collect**  
- offers an alternative to shipping: order online, pick up at a local store  
- requires the customer to select a specific store at checkout  
- triggers store-side fulfillment preparation by staff  
- Invariant: must reference a specific store for pickup  

---  

### Decisions made  

- Store locator stays under Store, not its own KA — it is the discovery mechanism for stores and has no meaning independent of store data (independence test).  
- Click-and-collect is placed under Store rather than Order because the store is the fulfillment point and the concept centers on the physical location; Order references click-and-collect as a delivery option.  
- "My store" preference is a customer-facing personalization that stores own — Customer Account holds the preference value, but Store owns the tailoring behavior.  
- Geo-tagging, map coordinates, operating hours, and contact details are attributes of a store, not separate terms.  

---  

## **Customer Account**  

A customer account is the persistent identity that ties together a person's entire relationship with PawPlace — their order history, appointment history (past and upcoming), wishlist, saved addresses, saved payment methods, communication preferences, and their own pet profiles (name, breed, age, dietary needs). It is the single source of truth for who a customer is and what they have done. The account collaborates with Order (history, reorder), Appointment (booking history), Notification (preference-driven communications), and Product Catalog (wishlist links to products). Authentication is standard username-and-password: registration, login, logout, password reset, email verification, and session management that does not kick people out every ten minutes. Guest checkout must also work — not everyone wants to create an account to buy cat litter — but the system should make account creation appealing through the value it unlocks. If a customer has a pet profile set up, the system can drive smart behaviors like reminding them to reorder food based on purchase frequency. A customer account must always have a verified email, and session management must be reliable across devices.  

### Ubiquitous Language  

#### **customer account**  
- A customer account tracks order history, appointment history, wishlist, saved addresses, saved payment methods, pet profiles, preferred store, and communication preferences.  
- Authentication is standard: registration, login, logout, password reset, email verification, session management.  
- Sessions must be reliable — someone logged in on their phone should not get randomly kicked out every ten minutes.  

#### References  

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

#### **guest checkout**  
- Guest checkout allows purchasing without creating an account.  
- Not everyone wants to create an account just to buy a bag of cat litter, but the system should make account creation appealing.  

#### References  

**Ref — Shopping and guest checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about guest checkout and account creation appeal.  

```source  
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.  
```  

#### **pet profile**  
- A pet profile is a customer's own pet record: name, breed, age, dietary needs.  
- Useful for recommendations and smart reorder reminders based on purchase frequency.  

#### References  

**Ref — User accounts**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: partial  
Part: Sentences about pet profiles and smart reorder.  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

#### **wishlist**  
- A wishlist (or saved items) is a customer-curated list of products they are interested in but have not yet purchased.  

#### References  

**Ref — User accounts**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: partial  
Part: Mention of wishlist/saved items.  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences.  
```  

#### **communication preferences**  
- Communication preferences let a customer choose what they receive: promotional emails, restock alerts, pet care tips, event notifications.  
- There should be clear preference management.  

#### References  

**Ref — Notification preferences**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: partial  
Part: Sentences about preference management.  

```source  
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

---  

### Domain Sketch  

#### **customer account**  
- authenticates via username and password: registration, login, logout, password reset, email verification  
- maintains reliable sessions across devices without frequent expiry  
- aggregates the customer's full history: orders, appointments, wishlist, addresses, payment methods, pet profiles, and preferred store  
- drives smart behaviours like reorder reminders based on pet profile data and purchase frequency  
- Invariant: must always have a verified email; session management must be reliable across devices  

#### **guest checkout**  
- allows a customer to complete a purchase without creating an account  
- collects shipping and billing details for the single transaction only — no persistence  
- promotes account creation by surfacing the value of order history, saved addresses, and reorder  

#### **pet profile**  
- records the customer's own pet: name, breed, age, and dietary needs  
- enables personalised recommendations and smart reorder timing based on purchase frequency  
- distinct from the Pet KA — pet profile is the customer's existing pet; Pet is a store animal available for adoption  

#### **wishlist**  
- holds products the customer is interested in but has not yet purchased  
- persists across sessions as part of the customer account  
- links back to the product catalog for current price and stock availability  

#### **communication preferences**  
- governs what marketing notifications a customer receives  
- offers granular opt-in and opt-out by category: promotional, restock alerts, pet care tips, event notifications  
- Invariant: marketing notifications must never be sent without explicit opt-in for that category  

---  

### Decisions made  

- Guest checkout stays under Customer Account, not its own KA — it is an alternative path through the same identity boundary that accounts own (independence test: guest checkout only makes sense in contrast to having an account).  
- Pet profile (customer's own pets) stays under Customer Account, not under Pet — a pet profile describes the customer's existing pet for recommendation purposes, whereas the Pet KA describes animals available for adoption in store. Different domain concepts with the same word.  
- Wishlist stays under Customer Account — it is a personal collection that has no behavior outside the account context (independence test).  
- Communication preferences stay under Customer Account — they are a dimension of the customer's identity, not an independent concept.  
- Authentication (login, registration, session management) is a behavior of Customer Account, not a separate KA — it is how accounts are created and accessed.  

---  

## **Order**  

An order is the complete purchase lifecycle from the moment a customer commits to buying through to delivery and potential return. It begins with the shopping cart — a persistent container that survives device and session switches for logged-in customers — and moves through the checkout flow (shipping address, billing address, delivery option selection) to placement, confirmation, fulfillment, and shipping. The order owns delivery options (standard, express, same-day for local), shipping notifications with tracking numbers, and the return/exchange flow. It collaborates with Payment (each order triggers payment processing), Customer Account (order appears in history, enables reorder), Store (click-and-collect fulfillment), and Notification (confirmation emails, shipping updates). An order must always have at least one product, a delivery method, and a completed payment. The shopping cart must persist across devices for logged-in customers. Returns are initiated from order history with a printable label or QR code, and refund status is tracked within the order.  

### Ubiquitous Language  

#### **shopping cart**  
- A shopping cart persists across devices and sessions for logged-in customers.  
- If someone adds items on their phone at lunch and returns on their laptop in the evening, the cart should still be there.  

#### References  

**Ref — Shopping cart persistence**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about shopping cart persistence.  

```source  
For the shopping side, we need all the standard e-commerce functionality. A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).  
```  

#### **order**  
- An order moves through confirmation, fulfillment, shipping notification with tracking number, and potential return.  
- Order confirmation page, confirmation email, and shipping notifications with tracking numbers are part of the order lifecycle.  

#### References  

**Ref — Order confirmation and shipping**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 19  
Extract: whole  

```source  
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.  
```  

#### **delivery option**  
- Delivery options include standard, express, and possibly same-day for local customers.  
- Click-and-collect (order online, pick up at local store) is also a delivery option.  

#### References  

**Ref — Checkout delivery options**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentence listing delivery options.  

```source  
Checkout flow: shipping address, billing address, delivery options (standard, express, maybe same-day for local), and then payment.  
```  

#### **return**  
- A return is initiated from order history: the customer prints a label or gets a QR code and tracks the refund status.  
- Refunds go back through whichever payment vendor handled the original transaction.  
- In-store returns are a different flow but the system should still reflect them in the customer's account.  

#### References  

**Ref — Returns and exchanges**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: whole  

```source  
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.  
```  

---  

### Domain Sketch  

#### **shopping cart**  
- accumulates products the customer intends to purchase with quantities  
- persists across devices and sessions for logged-in customers  
- transitions to the checkout flow when the customer commits to buying  
- Invariant: must persist across devices for logged-in customers; guest carts are session-scoped only  

#### **order**  
- captures the complete purchase: products, quantities, shipping address, billing address, delivery option, and payment  
- moves through a lifecycle: placed → confirmed → fulfilled → shipped → delivered  
- triggers confirmation and shipping notifications with tracking numbers  
- provides the entry point for returns and reorders from account history  
- Invariant: must have at least one product, a delivery method, and a completed payment  

#### **delivery option**  
- represents a choice of shipping speed: standard, express, or same-day for local customers  
- includes click-and-collect as an alternative that involves store pickup rather than shipping  
- is selected during checkout and recorded on the order  

#### **return**  
- reverses part or all of an order initiated from the customer's order history  
- generates a return label or QR code for the customer  
- routes the refund through the original payment vendor  
- supports both online and in-store return flows, with both reflected in the customer's account  
- Invariant: refund must always route through the payment vendor that handled the original transaction  

---  

### Decisions made  

- Shopping cart stays under Order, not its own KA — the cart is the initial state of the order lifecycle and has no meaning outside the purchase flow (independence test).  
- Return stays under Order, not its own KA — a return always references a specific order and its payment; it is the reverse leg of the order lifecycle (independence test).  
- Delivery option stays under Order — it is a choice made during checkout that belongs to the order, not an independent concept.  
- Checkout flow (address entry, option selection) is a behavior of the Order lifecycle, not a separate concept.  

---  

## **Payment**  

Payment processing handles the financial transaction for every order across three integrated payment vendors — StripeWave (credit and debit card processing, primary gateway), PayNova (digital wallet with one-tap mobile payments, popular with younger buyers), and VaultPay (buy-now-pay-later for larger purchases, splitting into installments). The payment abstraction owns vendor integration, webhook callbacks, payment confirmations, failed payment retries, and refund processing. It collaborates with Order (each order triggers exactly one payment flow; refunds route back through the original vendor) and Return (refund processing on returns). The customer picks their preferred method at checkout and the experience must be smooth regardless of which processor handles it. The system must handle all webhook callbacks, confirmations, retries, and refunds across all three vendors without the customer ever needing to think about what is happening behind the scenes. A payment must always be associated with exactly one order, and refunds must always route through the vendor that handled the original transaction.  

### Ubiquitous Language  

#### **payment vendor**  
- Three payment vendors are integrated: StripeWave (credit/debit cards, primary gateway), PayNova (digital wallets, one-tap mobile), and VaultPay (buy-now-pay-later, installments).  
- The customer picks their preferred method at checkout; the experience is smooth regardless of which processor handles it.  
- The system handles webhook callbacks, payment confirmations, failed payment retries, and refund processing across all three.  

#### References  

**Ref — Payment vendors and checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentences describing the three payment vendors and their integration.  

```source  
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.  
```  

#### **refund**  
- Refunds go back through whichever payment vendor handled the original transaction.  
- Refund processing is invisible to the customer.  

#### References  

**Ref — Returns and refund routing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: partial  
Part: Sentences about refund routing through original payment vendor.  

```source  
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.  
```  

---  

### Domain Sketch  

#### **payment vendor**  
- abstracts three payment processors behind a unified checkout experience  
- StripeWave handles credit and debit card authorization-capture-settle as the primary gateway  
- PayNova handles digital wallet one-tap mobile authorization  
- VaultPay handles buy-now-pay-later with installment plan creation for larger purchases  
- processes webhook callbacks, payment confirmations, and retries failed payments across all three vendors  
- the customer selects their preferred method at checkout; vendor mechanics are invisible  

#### **refund**  
- reverses a payment by routing through the original payment vendor that processed the transaction  
- is invisible to the customer — they see refund status but not vendor mechanics  
- Invariant: must always route through the vendor that handled the original transaction  

---  

### Decisions made  

- StripeWave, PayNova, and VaultPay are instances of payment vendor, not separate KAs — they are specific integrations, not independent domain concepts (independence test).  
- Refund stays under Payment, not its own KA — a refund is a reverse payment operation that must route through the original vendor (independence test: no meaning outside the payment context).  
- Webhook, payment confirmation, and retry are operational behaviors of payment processing, not separate domain terms.  
- Payment is its own KA rather than being folded into Order because it owns a distinct integration surface (three vendors, webhooks, retries) with its own invariants — the vendor-routing rule for refunds is Payment's responsibility, not Order's.  

---  

## **Notification**  

The notification system is the communication layer that delivers both transactional and marketing messages to customers. Transactional notifications include order confirmations, shipping updates, appointment reminders (the day before a visit), and return/refund status updates — these are triggered by events in other KAs and must be reliable. Marketing notifications include promotional emails, new product announcements, sales, personalized messages ("your dog's birthday is coming up"), restock alerts for previously purchased products, pet care tips, and event notifications for in-store activities like adoption days or training workshops. The notification abstraction owns delivery mechanics and collaborates with Customer Account (communication preferences determine what a customer receives) and every event-producing KA (Order, Appointment, Product Catalog). Customers must be able to opt in to a marketing email list and manage their preferences with granular control. A transactional notification must always be sent for order and appointment lifecycle events; marketing notifications must never be sent without explicit opt-in.  

### Ubiquitous Language  

#### **notification**  
- Notifications are either transactional (order confirmations, shipping updates, appointment reminders) or marketing (promotions, new products, sales, personalized messages).  
- Transactional notifications are event-driven and mandatory; marketing notifications require opt-in.  

#### References  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: whole  

```source  
We want a proper **email and notification system**. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

#### **notification preferences**  
- Notification preferences let a customer choose what they receive: promotional emails, restock alerts, pet care tips, event notifications.  
- Clear preference management is required.  

#### References  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: partial  
Part: Sentences about preference management.  

```source  
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

#### **restock alert**  
- A restock alert notifies a customer when a product they have bought before is back in stock or likely needs reordering.  

#### References  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: partial  
Part: Mention of restock alerts.  

```source  
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

---  

### Domain Sketch  

#### **notification**  
- delivers transactional messages (order confirmations, shipping updates, appointment reminders) triggered by lifecycle events in other concepts  
- delivers marketing messages (promotions, personalised recommendations, restock alerts, event notices) gated by opt-in  
- Invariant: transactional notifications must always fire for lifecycle events; marketing notifications must never fire without explicit opt-in  

#### **notification preferences**  
- defines the categories a customer can opt in to or out of: promotional, restock alerts, pet care tips, event notifications  
- is checked at delivery time — notification checks preferences before sending marketing content  
- stored on the customer account but enforced by the notification system  

#### **restock alert**  
- monitors products a customer has previously purchased for reordering signals  
- fires when purchase frequency suggests the customer is likely running low  
- gated by the customer's communication preferences — only sent if opt-in is active for restock alerts  

---  

### Decisions made  

- Notification preferences could live under Customer Account (where they are stored) or under Notification (where they are enforced). Placed here because the preference logic — what categories exist, what opt-in means — is owned by the notification domain; Customer Account merely stores the customer's choices. Open question for the team to confirm.  
- Restock alert stays under Notification, not Product Catalog — it is a notification behavior triggered by stock data, not a catalog concept (module-fit test).  
- Personalization ("your dog's birthday") is a behavior that combines data from Customer Account (pet profiles) with Notification delivery — neither KA owns it exclusively. The notification system orchestrates it.  
- Transactional vs. marketing is a classification within notifications, not separate KAs — both are communications with different opt-in rules.  

---  

# Boundary Domain  

### Ubiquitous Language  

#### **content** *(owned by: Content Management — future module)*  
- Content includes blog posts and guides ("How to introduce a new cat to your household," "Best food for senior dogs").  
- Builds trust, helps with SEO, and provides material for marketing emails.  
- Community elements (Q&A, forums) are explicitly phase two.  

#### **admin dashboard** *(owned by: Store Operations — future module)*  
- Store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles, and handle order fulfillment for click-and-collect.  

---  

### Domain Sketch  

#### **content**  
- PawPlace defines the content that feeds marketing emails and builds SEO trust (blog posts, pet care guides)  
- Content Management (future module) owns authoring, publishing workflow, and CMS operations  
- community features (Q&A, forums) are explicitly deferred to phase two  

#### **admin dashboard**  
- PawPlace defines the data surfaces store staff need: inventory levels, incoming appointments, pet profile edits, click-and-collect fulfillment queue  
- Store Operations (future module) owns the dashboard UI, staff permissions, and fulfillment workflow  

---  

### References  

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

---  

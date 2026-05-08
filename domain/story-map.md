# PawPlace — Story Map

Source: external-context/requirements-chat-with-product-owner.md

## Personas

**Pet Owner** — Has one or more pets, buys supplies regularly, values convenience and personalised recommendations. Browses on mobile from the couch.

**Prospective Pet Owner** — Looking to adopt, wants to meet animals in person. Browses the pet gallery, books visits, values breed info and temperament notes.

**Store Employee** — Front-line staff at a physical store location. Handles day-to-day operations: pet profiles, appointments, check-ins, visit outcomes, order fulfillment, stock updates, click-and-collect, and in-store returns.

**Store Owner** — Business-level oversight of a store. Reviews inventory dashboard, monitors order flow, and manages operational decisions that span across employees.

**Admin** — Platform administration. Publishes content (blog posts, pet care guides) and manages system-level configuration. Not a store role.

---

(E) Browse Product Catalog
    (E) Search and Filter Products
        (S) Customer --> Search Products by Keyword
        (S) Customer --> Filter Products (by category, pet type, brand)
        (S) System --> Display Real-Time Stock Availability
        (S) System --> Display Low Stock Badge
    (E) View Product Details
        (S) Customer --> View Product Details
        (S) Customer --> Read Customer Reviews
    (E) Review Products
        (S) Customer --> Submit Written Review with Star Rating
        (S) Customer --> Submit Photo Review

(E) Browse Available Pets
    (E) Explore Pet Gallery
        (S) Customer --> Browse Pets by Species
        (S) Customer --> View Pet Profile
        (S) Customer --> View Pet Store Location and Distance
    (E) Manage Pet Listings
        (S) Store Employee --> Update Pet Profile
        (S) Store Employee --> Mark Pet as Adopted

(E) Book Pet Visit
    (E) Schedule Visit
        (S) Customer --> View Available Time Slots at Store
        (S) Customer --> Select Date and Time Slot
        (S) Customer --> Add Visit Note
        (S) Customer --> Confirm Appointment Booking
    (E) Manage Appointments
        (S) Customer --> View Upcoming and Past Appointments
        (S) Customer --> Cancel or Rebook Appointment After Pet Adoption
        (S) Store Employee --> View Incoming Appointments
    (E) Track Visit Outcomes
        (S) Store Employee --> Check In Customer
        (S) Store Employee --> Record Visit Outcome
        (S) Store Employee --> Record No-Show
        (S) Store Employee --> Set Follow-Up Action

(E) Find Store
    (E) Locate Stores
        (S) Customer --> View Store Map
        (S) Customer --> View Store List
        (S) Customer --> Filter Stores by Availability and Specialization
        (S) Customer --> Calculate Distance to Store
    (E) Personalize Store Experience
        (S) Customer --> Set My Store Preference
        (S) System --> Tailor Experience to Preferred Store

(E) Manage Customer Account
    (E) Register and Authenticate
        (S) Customer --> Register Account
        (S) System --> Send Email Verification
        (S) Customer --> Verify Email Address
        (S) Customer --> Log In
        (S) Customer --> Log Out
        (S) Customer --> Reset Password
        (S) System --> Maintain Session Across Devices
    (E) Manage Profile
        (S) Customer --> Save Delivery Address
        (S) Customer --> Manage Saved Addresses
        (S) Customer --> Save Payment Method
        (S) Customer --> Manage Saved Payment Methods
        (S) Customer --> Create Pet Profile
        (S) Customer --> Update Pet Profile
        (S) Customer --> Set Communication Preferences
    (E) Track Activity
        (S) Customer --> View Order History
        (S) Customer --> View Appointment History
        (S) Customer --> Manage Wishlist
        (S) Customer --> Reorder Previous Purchase

(E) Purchase Products
    (E) Manage Shopping Cart
        (S) Customer --> Add Product to Cart
        (S) Customer --> Update Cart Quantity
        (S) Customer --> Remove Product from Cart
        (S) System --> Persist Cart Across Devices
    (E) Check Out
        (S) Customer --> Enter Shipping Address
        (S) Customer --> Enter Billing Address
        (S) Customer --> Select Saved Address at Checkout
        (S) Customer --> Select Delivery Option (standard, express, same-day)
        (S) Customer --> Select Click-and-Collect Store
        (S) Customer --> Check Out as Guest
        (S) System --> Allow Backorder Purchase
    (E) Process Payment
        (S) Customer --> Select Payment Method
        (S) Customer --> Select Saved Payment Method at Checkout
        (S) System --> Process Card Payment via StripeWave
        (S) System --> Process Digital Wallet Payment via PayNova
        (S) System --> Process Buy-Now-Pay-Later via VaultPay
        (S) System --> Retry Failed Payment
    (E) Fulfill Order
        (S) System --> Confirm Order and Send Confirmation Email
        (S) System --> Send Shipping Notification with Tracking Number
        (S) Store Employee --> Fulfill Click-and-Collect Order
        (S) Customer --> Track Order Status

(E) Return Products
    (E) Initiate Return
        (S) Customer --> Initiate Return from Order History
        (S) System --> Generate Return Label or QR Code
    (E) Process Refund
        (S) System --> Route Refund through Original Payment Vendor
        (S) Customer --> Track Refund Status
        (S) Store Employee --> Process In-Store Return

(E) Manage Notifications
    (E) Send Transactional Notifications
        (S) System --> Send Order Confirmation
        (S) System --> Send Shipping Update with Tracking
        (S) System --> Send Appointment Reminder
        (S) System --> Send Pet Adopted Before Visit Notification
        (S) System --> Send Return and Refund Status Update
        (S) System --> Send Visit Follow-Up Notification
        (S) System --> Send Click-and-Collect Ready Notification
    (E) Send Marketing Notifications
        (S) Customer --> Opt In to Marketing Email List
        (S) System --> Send Promotional Email
        (S) System --> Send Personalized Recommendation
        (S) System --> Send Restock Alert
        (S) System --> Send In-Store Event Notification
    (E) Manage Notification Preferences
        (S) Customer --> Set Notification Preferences (promotional, restock, tips, events)
        (S) Customer --> Unsubscribe from Marketing Emails

(E) Publish Content
    (S) Admin --> Publish Blog Post
    (S) Admin --> Publish Pet Care Guide
    * Gap: Community features (Q&A, forums) — PO explicitly deferred to phase two.

(E) Manage Store Operations
    (E) Manage Inventory
        (S) Store Employee --> Update Product Stock Levels
        (S) Store Owner --> View Inventory Dashboard
    (E) Manage Order Fulfillment
        (S) Store Employee --> View and Process Incoming Orders
        (S) Store Employee --> Prepare Click-and-Collect Orders for Pickup

---

## Consolidation Notes (for AC phase)

### Filter Products (by category, pet type, brand)
Groups three filter dimensions into one parameterized story — same filtering mechanic, different data dimension.
AC must specify per dimension:
- Category: product type hierarchy (food, toys, beds, grooming, aquarium gear)
- Pet type: species-based filter (dog, cat, bird, fish, small mammal, reptile)
- Brand: manufacturer/brand name filter

### Select Delivery Option (standard, express, same-day)
Groups three shipping speeds into one parameterized story — same selection mechanic, different speed and cost.
AC must specify per option:
- Standard: default shipping, normal delivery window
- Express: faster delivery, higher cost
- Same-day: local delivery only, availability constraints

Click-and-collect is a separate story because it involves a fundamentally different flow (store selection, no shipping).

### Process Card Payment via StripeWave / Process Digital Wallet Payment via PayNova / Process Buy-Now-Pay-Later via VaultPay
NOT consolidated — three distinct payment mechanics:
- StripeWave: credit/debit card authorization-capture-settle, primary gateway
- PayNova: digital wallet one-tap mobile authorization, popular with younger buyers
- VaultPay: buy-now-pay-later with installment plan creation, credit assessment for larger purchases
AC must specify per vendor: authorization flow, confirmation handling, webhook callbacks, failure/retry behavior, and refund routing.

### Set Notification Preferences (promotional, restock, tips, events)
Groups four preference categories into one parameterized story — same opt-in/opt-out mechanic, different content type.
AC must specify per category:
- Promotional emails: sales, new product announcements
- Restock alerts: previously purchased product back in stock
- Pet care tips: care guides, health advice
- Event notifications: in-store adoption days, training workshops

### Confirm Appointment Booking — account required
Per the domain decision (`docs/domain-sketch.md` → Appointment → `### decisions made`), appointment booking is **customer-account-only** — guest checkout cannot book a visit. AC must include an account-gate: an unauthenticated visitor selecting "Book Visit" is routed through Register / Log In before reaching `Confirm Appointment Booking`. The visit must attach to a verified account so it can land in appointment history and the confirmation/reminder channel has a verified email.

### Submit Written Review with Star Rating / Submit Photo Review — account required
Per the domain decision (`docs/domain-sketch.md` → Product Catalog → `### decisions made`, `customer review` authorship), reviews are **customer-account-only** — anonymous and guest-checkout reviews are not allowed. AC must include an account-gate: an unauthenticated visitor selecting "Write a review" is routed through Register / Log In before reaching the submit form. Customer Account is the trust anchor for social proof.

### Send Order Confirmation / Send Shipping Update / Send Return and Refund Status Update — routing target
Per the domain decision (`docs/domain-sketch.md` → Notification → `### decisions made`, delivery target is two-sided), transactional notifications route to the **customer account's verified email** for logged-in orders and to the **email collected at guest checkout** for guest orders. AC must specify both routing paths and that guest-order notifications never carry marketing payload.

### Send Pet Adopted Before Visit Notification (transactional)
Per the domain decision (`docs/domain-sketch.md` → Pet → `### decisions made`, adoption mid-appointment), when staff transition a pet to `adopted` while a visit is pending, the system sends a transactional notification to the booking customer offering to **rebook against a similar pet** or **cancel**. The Customer story `Cancel or Rebook Appointment After Pet Adoption` is the customer-side response to this notification — AC must cover both the immediate notification and the customer's two-option response.

### Cancel or Rebook Appointment After Pet Adoption
Two parameterized branches share one story — same trigger (pet adopted out from under a pending appointment), same surface (the notification's CTA links), different outcome paths:
- Cancel: appointment is voided, slot is released, customer sees confirmation in appointment history
- Rebook: customer is taken to the pet gallery for the same store with similar pets pre-filtered; selecting one starts the standard `View Available Time Slots` flow

### Send Restock Alert (back-in-stock vs reorder reminder split — deferred)
The current `Send Restock Alert` story conflates two source-distinct triggers (per `docs/domain-sketch.md` → Notification → `### decisions made`):
- **Back-in-stock alert** — a previously-purchased product just came back into stock (cross-KA with Product Catalog stock data)
- **Reorder reminder** — purchase frequency suggests the customer is running low (cross-KA with Customer Account pet profile + order history)

Until either trigger is prioritized as a real story, AC for this story should cover the **frequency-driven** case only, since that's what the source implies most clearly. When the team prioritizes the stock-driven case, split into two stories (`Send Back-in-Stock Alert`, `Send Reorder Reminder`) and update this map.

### Save Delivery Address / Manage Saved Addresses
Per the domain decision (`docs/domain-sketch.md` → Customer Account → `### decisions made`, saved address is a concept), `Save Delivery Address` covers the initial create from any address-entry surface (profile screen, checkout). `Manage Saved Addresses` covers list / edit label / soft-delete. Both shipping and billing addresses share the same `saved address` concept — AC must specify that a saved address can be selected as either at checkout. Historical orders snapshot the address used so soft-deletion does not break order history.

### Save Payment Method / Manage Saved Payment Methods
Per the domain decision (`docs/domain-sketch.md` → Customer Account → `### decisions made` and Payment → `### decisions made`, saved payment method is two-sided), `Save Payment Method` covers the initial save (vendor-tokenize, store reference + masked details). `Manage Saved Payment Methods` covers label edit and soft-delete. AC must specify that **deletion does not break refund routing on past orders** — historical orders retain their vendor-token reference.

### Select Saved Address at Checkout / Select Saved Payment Method at Checkout
Both stories are account-only (guest checkout has no saved entities). AC must specify the fallback path: if a saved entity is missing or expired, the customer is offered the regular Enter Shipping/Billing Address or Select Payment Method flow. AC must also specify that picking a saved address still snapshots the address onto the order.

---

## Context Gaps

- Click-and-collect confirmation flow — source says "should probably be an option" but does not detail the pickup notification, window, or ID-check process. Awaiting PO decision on exact flow.
- In-store return integration — source says "it's a different flow but the system should still reflect it." Exact integration between POS system and online account not specified.
- Same-day delivery — source says "maybe same-day for local." Geographic eligibility rules and cut-off times not specified. Awaiting PO decision.
- Content publishing workflow — source asks for "space for blog posts or guides" but does not specify authoring workflow, approval process, or CMS requirements.
- ~~Pet visit outcome tracking~~ — **resolved.** CRC modeling surfaced check-in, visit outcome, no-show, and follow-up data. New stories added under `(E) Track Visit Outcomes` in Increment 6.
- **In-store walk-in purchase — deferred.** The current scope covers walk-in store discovery and stock-check (Increment 1) plus click-and-collect pickup, but does **not** include the customer paying at a physical counter. Walk-in point-of-sale is in scope for a later phase and will require POS integration plus a `point-of-sale` concept under Store. Per `docs/domain-sketch.md` → Store → `### decisions made`. Stories not yet drafted.
- **Restock alert trigger split — deferred.** Single story today; will be split into back-in-stock and reorder-reminder when either is prioritized. Per `docs/domain-sketch.md` → Notification → `### decisions made`.
- **Refund authorization sources** — source describes refund routing but does not name the authorizing party. Domain sketch records three (system-automatic on return approval, store staff at counter, finance manual override) but the exact policy thresholds for each are awaiting PO decision.

# Acceptance Criteria


---

## Increment 8

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

﻿# Acceptance criteria — Increment 8: Marketing engine — reviews, alerts, and content

**Increment outcome:** Drives repeat traffic and conversion through *Customer Review* social proof, opt-in marketing emails, *Restock Alert* nudges, personalised recommendations, and a content stream of blog posts and pet care guides. Engagement features only — the buy flow is unchanged.

**Builds on:** Increments 1-7 (full e-commerce spine, accounts, multi-vendor payments, pet visits, returns live).

---

## Story: `Submit Written Review with Star Rating`

**Story type:** user

### Domain terms

- *Customer Review* — a star-rated, optionally-written evaluation of a product authored by a verified *Customer Account*
- *Star Rating* — the one-to-five numeric score a customer assigns when reviewing a product
- *Product* — the item being reviewed (boundary — Product Catalog)
- *Customer Account* — the authoring identity that gates review submission; only verified purchasers may review (boundary — Customer Account)
- *Aggregate Star Rating* — the computed average of all *Star Ratings* on a product, recomputed on each review change

### Acceptance criteria

1. **WHEN** a logged-in customer opens the review form on a *Product Details Page*
   **THEN** the form collects a *Star Rating* (1–5) and an optional written review (free text)
   **AND** the customer must have purchased the *Product* to access the form
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "customer reviews — written reviews with star ratings"; marketing-engine-ubiquitous-language.md — customer review: "authored by exactly one customer account that has purchased the product"

2. **WHEN** the customer submits a valid *Customer Review*
   **THEN** the review is associated with the *Product* and the customer's *Customer Account*
   **AND** the review appears on the *Product Details Page* sorted by newest first
   **AND** the *Product's* *Aggregate Star Rating* is recomputed to include the new *Star Rating*
   **Evidence:** marketing-engine-ubiquitous-language.md — customer review: "contributes its star rating to the product's aggregate star rating"; aggregate star rating: "recomputed whenever a customer review is created, edited, or deleted"

3. **WHEN** the customer has not purchased the *Product*
   **THEN** the review form is hidden or shows "purchase this product to leave a review"
   **BUT** the *Product Details Page* and existing *Customer Reviews* remain viewable
   **Evidence:** marketing-engine-ubiquitous-language.md — customer review invariant: "must be authored by exactly one verified customer account that has purchased the product"

4. **WHEN** a guest (no *Customer Account*) tries to leave a review
   **THEN** a prompt to log in or register is shown
   **BUT** the *Product Details Page* is not navigated away from
   **Evidence:** marketing-engine-ubiquitous-language.md — customer review invariant: "guest checkout sessions cannot leave reviews"

5. **WHEN** the customer submits a review with a *Star Rating* but no written text
   **THEN** the *Customer Review* is accepted — written text is optional but *Star Rating* is mandatory
   **Evidence:** marketing-engine-ubiquitous-language.md — star rating: "is the minimum required input for a customer review"

---

## Story: `Submit Photo Review`

**Story type:** user

### Domain terms

- *Review Photo* — an optional image attached to a *Customer Review* showing the product in use
- *Customer Review* — the parent review to which photos attach
- *Product Details Page* — the surface where photos are displayed alongside the review (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer submits a *Customer Review* (see *Submit Written Review with Star Rating*)
   **THEN** an optional photo upload field allows attaching one or more *Review Photos*
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "photo reviews"

2. **WHEN** the customer attaches *Review Photos*
   **THEN** the images are displayed alongside the review on the *Product Details Page*
   **AND** selecting a thumbnail opens the image at full size in a lightbox
   **Evidence:** marketing-engine-ubiquitous-language.md — review photo: "displayed as a thumbnail inline with the review text, expandable to full-size via lightbox"

3. **WHEN** the customer uploads a file that is not a supported image format or exceeds size limits
   **THEN** the upload shows a validation error describing the issue
   **BUT** the review text and *Star Rating* already entered are not lost
   **Evidence:** marketing-engine-ubiquitous-language.md — review photo invariant: "upload failure must not discard the parent review's text or star rating"

4. **WHEN** the customer submits a review without photos
   **THEN** the review is accepted as a standard written *Customer Review* — photos are optional
   **Evidence:** marketing-engine-ubiquitous-language.md — review photo: "is an optional image attachment"

---

## Story: `Read Customer Reviews`

**Story type:** user

### Domain terms

- *Customer Reviews* — the collection of reviews for a product
- *Aggregate Star Rating* — the computed average of all *Star Ratings* on a product, displayed as social proof
- *Product Details Page* — where reviews and the aggregate are displayed (boundary — Product Catalog)
- *Review Photo* — thumbnails displayed inline with the review text

### Acceptance criteria

1. **WHEN** the customer views a *Product Details Page*
   **THEN** the *Aggregate Star Rating* is displayed prominently near the product name
   **AND** the individual *Customer Reviews* are listed below the product details
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "Other customers should be able to see them and they should factor into some kind of aggregate star rating on the product"

2. **WHEN** a *Product* has no *Customer Reviews* yet
   **THEN** the *Aggregate Star Rating* is not shown — not displayed as zero
   **AND** a "be the first to review" prompt appears
   **Evidence:** marketing-engine-ubiquitous-language.md — aggregate star rating invariant: "must not be displayed as zero when no reviews exist — show nothing or a prompt instead"

3. **WHEN** there are many *Customer Reviews*
   **THEN** the reviews are paginated or lazy-loaded
   **AND** sort controls are provided: newest, oldest, highest rating, lowest rating
   **Evidence:** marketing-engine-ubiquitous-language.md — customer review: "sorted by newest first, with sort controls for oldest, highest rating, and lowest rating"

4. **WHEN** a review includes *Review Photos*
   **THEN** thumbnails are shown inline with the review text
   **AND** selecting a thumbnail opens the image at full size
   **Evidence:** marketing-engine-ubiquitous-language.md — review photo: "displayed as a thumbnail inline with the review text, expandable to full-size via lightbox"

---

## Story: `Set Notification Preferences`

**Story type:** user

### Domain terms

- *Notification Preferences* — the customer's choices about which transactional notifications they receive (boundary — Notification module)
- *Customer Account* — preferences are tied to the logged-in customer (boundary — Customer Account)
- *Transactional Notification* — order confirmations, shipping updates, appointment reminders — distinct from marketing *Communication Preferences*

### Acceptance criteria

1. **WHEN** the customer opens *Notification Preferences* from account settings
   **THEN** the available notification categories are listed (order updates, shipping, appointments, returns)
   **AND** each category shows the current setting (on/off)
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "notification settings"

2. **WHEN** the customer toggles a notification category
   **THEN** the preference is saved immediately
   **AND** future *Transactional Notifications* of that type respect the updated preference
   **Evidence:** inferred — standard preference management; aligned with *Communication Preferences* immediate-toggle pattern

3. **WHEN** the customer disables all transactional notifications
   **THEN** critical notifications (e.g. order confirmation, refund completion) are still sent — they are non-optional
   **AND** a note explains that some notifications cannot be disabled
   **Evidence:** inferred — legal/operational transactional emails cannot be suppressed

4. **WHEN** a guest (no *Customer Account*) attempts to access *Notification Preferences*
   **THEN** a prompt to log in or create an account is shown
   **BUT** transactional notifications for guest orders (sent to the guest email provided at checkout) continue to be delivered
   **Evidence:** marketing-engine-ubiquitous-language.md — notification preferences boundary: "governs transactional notification settings"; customer account boundary required for preference management

---

## Story: `Set Communication Preferences`

**Story type:** user

### Domain terms

- *Communication Preferences* — the per-customer record of which *Marketing Categories* have active opt-in status
- *Marketing Category* — a named grouping of *Marketing Communications* (promotions, recommendations, restock alerts, events) that a customer can independently opt in to or out of
- *Customer Account* — preferences are stored on the customer account (boundary — Customer Account)

### Acceptance criteria

1. **WHEN** the customer opens *Communication Preferences* from account settings
   **THEN** all available *Marketing Categories* are listed (promotions, recommendations, restock alerts, events)
   **AND** each shows the current opt-in/opt-out status
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "people should be able to manage their notification and communication preferences"; marketing-engine-ubiquitous-language.md — communication preferences: "lists all available marketing categories with current opt-in/opt-out status"

2. **WHEN** the customer toggles a *Marketing Category*
   **THEN** the change persists immediately on toggle — no separate "save" action is required
   **AND** no *Marketing Communications* of an opted-out category are sent after the toggle
   **Evidence:** marketing-engine-ubiquitous-language.md — communication preferences: "persists changes immediately on toggle — no 'save' delay"

3. **WHEN** a new *Marketing Category* is added in a future increment
   **THEN** the default is opt-out — the customer must explicitly opt in
   **Evidence:** marketing-engine-ubiquitous-language.md — communication preferences invariant: "new marketing categories must default to opt-out; no broadcast without explicit opt-in for that category"

4. **WHEN** the customer opts out of all *Marketing Categories*
   **THEN** *Transactional Notifications* (order confirmations, shipping updates, appointment reminders) are unaffected
   **Evidence:** marketing-engine-ubiquitous-language.md — unsubscribe invariant: "must not suppress transactional notifications regardless of how many marketing categories are unsubscribed"

5. **WHEN** a guest (no *Customer Account*) attempts to access *Communication Preferences*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** marketing-engine-ubiquitous-language.md — customer account boundary: "stores the customer's communication preferences and provides the verified email delivery target"

---

## Story: `Opt In to Marketing Email List`

**Story type:** user

### Domain terms

- *Marketing Email List* — the set of *Customer Accounts* that have opted in to at least one *Marketing Category*
- *Opt-In* — the explicit, affirmative action to join the *Marketing Email List*
- *Communication Preferences* — where the opt-in is managed

### Acceptance criteria

1. **WHEN** the customer opts in to promotional emails via *Communication Preferences*
   **THEN** the customer is added to the *Marketing Email List*
   **AND** the opt-in is recorded with a timestamp
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "Email marketing with explicit opt-in"

2. **WHEN** the customer opts in during account registration or checkout
   **THEN** the opt-in checkbox is unchecked by default — opt-in must be affirmative
   **AND** if checked, the customer is added to the *Marketing Email List*
   **Evidence:** marketing-engine-ubiquitous-language.md — marketing email list invariant: "opt-in must always be affirmative — the checkbox is unchecked by default; no customer is added without an explicit action"

3. **WHEN** the customer has not opted in
   **THEN** no *Marketing Communications* are sent to them — zero exceptions
   **Evidence:** marketing-engine-ubiquitous-language.md — marketing communication invariant: "must never be sent without explicit opt-in for the relevant marketing category"

4. **WHEN** the customer who is already on the *Marketing Email List* visits *Communication Preferences*
   **THEN** the promotions *Marketing Category* shows as opted-in
   **AND** the customer can toggle it off to *Unsubscribe*
   **Evidence:** marketing-engine-ubiquitous-language.md — communication preferences: "lists all available marketing categories with current opt-in/opt-out status"

---

## Story: `Send Promotional Email`

**Story type:** system

### Domain terms

- *Promotional Email* — a *Marketing Communication* sent to the *Marketing Email List* advertising sales, new products, or seasonal offers
- *Marketing Email List* — the set of opted-in customers
- *Communication Preferences* — the gate for eligibility, checked at delivery time
- *Unsubscribe* — the link in the email that immediately opts the customer out

### Acceptance criteria

1. **WHEN** admin creates and sends a *Promotional Email*
   **THEN** the email is delivered only to customers on the *Marketing Email List* who have opted in to the promotions *Marketing Category*
   **Evidence:** marketing-engine-ubiquitous-language.md — marketing communication invariant: "must never be sent without explicit opt-in for the relevant marketing category"

2. **WHEN** a customer on the list has opted out between batch creation and delivery
   **THEN** the email is not delivered to that customer
   **AND** the opt-out is respected because the system checks *Communication Preferences* at delivery time, not at batch creation time
   **Evidence:** marketing-engine-ubiquitous-language.md — marketing communication: "checks communication preferences at send time — not at batch creation time"

3. **WHEN** the email includes an *Unsubscribe* link
   **THEN** clicking the link immediately opts the customer out of the promotions *Marketing Category*
   **AND** a "you've been unsubscribed" confirmation page is shown
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "easy unsubscribe"; marketing-engine-ubiquitous-language.md — unsubscribe: "produces a confirmation page when executed via email link"

4. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the *Promotional Email* is queued for retry
   **BUT** the email is not silently discarded
   **Evidence:** inferred — consistent with email resilience pattern from transactional notification stories

---

## Story: `Send Personalized Recommendation`

**Story type:** system

### Domain terms

- *Personalized Recommendation* — a *Marketing Communication* tailored to a customer's purchase history, browsing patterns, or *Pet Profile* data
- *Communication Preferences* — the customer must have opted in to the recommendations *Marketing Category*
- *Pet Profile* — provides species, breed, and age data that feeds recommendation algorithms (boundary — Customer Account)
- *Stock Availability* — inventory state that determines whether a *Product* may be recommended (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the system generates a *Personalized Recommendation* for a customer
   **THEN** the recommendation is based on purchase history, browsing patterns, or *Pet Profile* data
   **AND** it is sent only if the customer has opted in to the recommendations *Marketing Category* in *Communication Preferences*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "personalised recommendations"; marketing-engine-ubiquitous-language.md — personalized recommendation: "tailored to a specific customer's purchase history, browsing patterns, or pet profile data"

2. **WHEN** the customer has no purchase history or browsing data
   **THEN** no *Personalized Recommendation* is sent — generic suggestions are handled by *Promotional Email*, not this channel
   **Evidence:** marketing-engine-ubiquitous-language.md — personalized recommendation invariant: "must be genuinely personalized — if no data exists to personalize against, do not send"

3. **WHEN** a recommended *Product* is currently out of stock
   **THEN** it is excluded from the recommendation set
   **BUT** in-stock alternatives in the same category may still be recommended
   **Evidence:** marketing-engine-ubiquitous-language.md — personalized recommendation invariant: "must never recommend an out-of-stock product"

4. **WHEN** the customer has opted out of the recommendations *Marketing Category*
   **THEN** no *Personalized Recommendation* is sent regardless of available data
   **Evidence:** marketing-engine-ubiquitous-language.md — marketing communication invariant: "must never be sent without explicit opt-in for the relevant marketing category"

---

## Story: `Send Restock Alert`

**Story type:** system

### Domain terms

- *Restock Alert* — a *Marketing Communication* triggered when a *Product's* *Stock Availability* transitions from out-of-stock to in-stock
- *Wishlist* — the customer's saved product list that determines targeting (boundary — Customer Account)
- *Communication Preferences* — the customer must have opted in to the restock alerts *Marketing Category*

### Acceptance criteria

1. **WHEN** a *Product's* *Stock Availability* transitions from out-of-stock to in-stock
   **THEN** the system sends a *Restock Alert* to each customer who has the *Product* on their *Wishlist* and has opted in to the restock alerts *Marketing Category*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "restock alerts"; marketing-engine-ubiquitous-language.md — restock alert: "sent only to customers who have the product on their wishlist and have opted in"

2. **WHEN** the customer has not opted in to restock alerts
   **THEN** no alert is sent even if the *Product* is on their *Wishlist*
   **Evidence:** marketing-engine-ubiquitous-language.md — restock alert invariant: "must not be sent to customers who have not opted in to restock alerts, even if the product is on their wishlist"

3. **WHEN** the *Product* goes back out of stock before the customer acts on the alert
   **THEN** the *Product Details Page* shows the updated out-of-stock status — the alert is best-effort, not a guarantee of availability
   **Evidence:** marketing-engine-ubiquitous-language.md — restock alert: "is a best-effort signal — the product may go back out of stock before the customer acts"

4. **WHEN** the *Product* is not on any customer's *Wishlist*
   **THEN** no *Restock Alert* is sent even though the stock transitioned to in-stock
   **Evidence:** marketing-engine-ubiquitous-language.md — restock alert: "sent only to customers who have the product on their wishlist"

---

## Story: `Send In-Store Event Notification`

**Story type:** system

### Domain terms

- *In-Store Event Notification* — a *Marketing Communication* informing opted-in customers about events at their preferred *Store*
- *Store* — the physical location hosting the event (boundary — Store module)
- *Communication Preferences* — the customer must have opted in to the events *Marketing Category*

### Acceptance criteria

1. **WHEN** admin creates an in-store event (adoption day, grooming workshop, training session)
   **THEN** the system sends *In-Store Event Notifications* to customers whose preferred *Store* matches the event location and who have opted in to the events *Marketing Category*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "in-store event notifications"; marketing-engine-ubiquitous-language.md — in-store event notification: "sent only to customers whose preferred store matches the event location"

2. **WHEN** the customer has not set a preferred *Store*
   **THEN** no event notification is sent — the system does not guess proximity
   **BUT** the event is still visible on the *Store's* detail page for walk-in discovery
   **Evidence:** marketing-engine-ubiquitous-language.md — in-store event notification invariant: "must not be sent when no preferred store is set; event is still discoverable on the store's detail page"

3. **WHEN** the customer has opted out of the events *Marketing Category*
   **THEN** no alert is sent
   **Evidence:** marketing-engine-ubiquitous-language.md — marketing communication invariant: "must never be sent without explicit opt-in"

4. **WHEN** the customer has set a preferred *Store* but the event is at a different location
   **THEN** no notification is sent for that event
   **Evidence:** marketing-engine-ubiquitous-language.md — in-store event notification: "sent only to customers whose preferred store matches the event location"

---

## Story: `Unsubscribe from Marketing Emails`

**Story type:** user

### Domain terms

- *Unsubscribe* — the act of opting out of a *Marketing Category*, effective immediately
- *Marketing Category* — the unit of consent being opted out of
- *Marketing Email List* — the set the customer is removed from for that category
- *Communication Preferences* — where the opt-out is reflected

### Acceptance criteria

1. **WHEN** the customer clicks the *Unsubscribe* link in any *Marketing Communication*
   **THEN** the customer is immediately opted out of that *Marketing Category*
   **AND** a "you've been unsubscribed" confirmation page is shown
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "easy unsubscribe"; marketing-engine-ubiquitous-language.md — unsubscribe: "produces a confirmation page when executed via email link"

2. **WHEN** the customer unsubscribes via the *Communication Preferences* page
   **THEN** the change takes effect immediately
   **AND** no further *Marketing Communications* of that *Marketing Category* are sent
   **Evidence:** marketing-engine-ubiquitous-language.md — unsubscribe: "takes effect immediately — no further marketing communications of that category are sent after execution"

3. **WHEN** the customer unsubscribes from all *Marketing Categories*
   **THEN** *Transactional Notifications* (order confirmations, shipping updates, appointment reminders) are unaffected
   **Evidence:** marketing-engine-ubiquitous-language.md — unsubscribe invariant: "must not suppress transactional notifications regardless of how many marketing categories are unsubscribed"

4. **WHEN** the customer clicks an *Unsubscribe* link for a *Marketing Category* they have already unsubscribed from
   **THEN** the confirmation page still shows "you've been unsubscribed" — the action is idempotent
   **BUT** no error or confusing message is displayed
   **Evidence:** inferred — idempotent unsubscribe for graceful repeat clicks

---

## Story: `Send Order Confirmation`

**Story type:** system

### Domain terms

- *Order Confirmation Notification* — the transactional email sent when an order is placed; formalised under notification infrastructure
- *Notification Preferences* — transactional, non-suppressible (boundary — Notification module)

### Acceptance criteria

1. **WHEN** an order is confirmed (payment successful)
   **THEN** the system sends an *Order Confirmation Notification* to the customer
   **AND** the notification includes: order number, items, total, delivery option, and estimated delivery/pickup
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "Order confirmation page, confirmation email"

2. **WHEN** the customer has disabled order-related notifications in *Notification Preferences*
   **THEN** the *Order Confirmation Notification* is still sent — it is a mandatory transactional notification
   **Evidence:** inferred — order confirmation cannot be suppressed

3. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the notification is queued for retry
   **AND** the order status is still updated in the system — email failure does not block order processing
   **Evidence:** inferred — same email resilience pattern

4. **WHEN** the order was placed by a guest (no *Customer Account*)
   **THEN** the *Order Confirmation Notification* is sent to the guest email provided at checkout
   **Evidence:** inferred — guest orders receive transactional notifications via checkout email

---

## Story: `Send Shipping Update with Tracking`

**Story type:** system

### Domain terms

- *Shipping Update Notification* — the transactional email when the order ships or a status change occurs; formalised under notification infrastructure
- *Tracking Number* — the carrier reference included in the notification

### Acceptance criteria

1. **WHEN** the order status changes to *Shipped* and a *Tracking Number* is available
   **THEN** the system sends a *Shipping Update Notification* to the customer
   **AND** the notification includes: order number, *Tracking Number*, carrier link, and estimated delivery date
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers"

2. **WHEN** additional status changes occur (e.g. out for delivery, delivered)
   **THEN** the system sends follow-up notifications if carrier data is available
   **Evidence:** inferred — extended shipping lifecycle notifications

3. **WHEN** the customer has disabled shipping notifications in *Notification Preferences*
   **THEN** the initial shipping notification is still sent — it is a mandatory transactional notification
   **BUT** optional follow-up status updates respect the preference
   **Evidence:** inferred — initial shipping notification is non-suppressible; follow-ups are optional

4. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the notification is queued for retry
   **AND** the shipping status is still updated in the system — email failure does not block fulfilment
   **Evidence:** inferred — same email resilience pattern

---

## Story: `Publish Blog Post`

**Story type:** store employee

### Domain terms

- *Blog Post* — a published article appearing on the *Blog Index* with title, summary, date, and author
- *Content Author* — the admin role that creates, edits, and publishes *Content* (boundary — Store Operations)
- *Blog Index* — the navigable listing of all published *Blog Posts*
- *Content* — authored material published to the site; transitions through draft to published lifecycle

### Acceptance criteria

1. **WHEN** *Content Author* creates and publishes a *Blog Post*
   **THEN** the post appears on the *Blog Index* with title, summary, date, and author
   **AND** the full post is accessible via its own URL
   **Evidence:** requirements-chat-with-product-owner.md — line 27, "Blog posts and pet care guides"; marketing-engine-ubiquitous-language.md — blog post: "accessible via its own URL once published"

2. **WHEN** *Content Author* saves a *Blog Post* as draft
   **THEN** the post is not visible to customers
   **AND** the draft remains editable and publishable from the admin content area
   **Evidence:** marketing-engine-ubiquitous-language.md — content invariant: "draft content must never be visible to customers"

3. **WHEN** a published *Blog Post* is edited
   **THEN** the changes are reflected immediately on the live page
   **AND** the publish date does not change unless the *Content Author* explicitly updates it
   **Evidence:** marketing-engine-ubiquitous-language.md — blog post invariant: "edits to a published post must not change the publish date unless explicitly requested"

4. **WHEN** a customer navigates directly to a published *Blog Post* URL
   **THEN** the full article is displayed with title, author, date, and body content
   **Evidence:** marketing-engine-ubiquitous-language.md — blog post: "accessible via its own URL once published"; content invariant: "published content must always be accessible via its own URL"

---

## Story: `Publish Pet Care Guide`

**Story type:** store employee

### Domain terms

- *Pet Care Guide* — a published educational article tagged by pet type or species, cross-linked with product and pet browsing areas
- *Content Author* — the admin role that creates, edits, and publishes *Content* (boundary — Store Operations)
- *Guide Index* — the navigable listing of all published *Pet Care Guides*
- *Content* — authored material published to the site; transitions through draft to published lifecycle

### Acceptance criteria

1. **WHEN** *Content Author* creates and publishes a *Pet Care Guide*
   **THEN** the guide appears on the *Guide Index* with title, summary, pet type/species tag, and date
   **AND** the full guide is accessible via its own URL
   **Evidence:** requirements-chat-with-product-owner.md — line 27, "educational content about different pet breeds, nutrition advice"; marketing-engine-ubiquitous-language.md — pet care guide: "appears on the guide index with title, summary, pet type/species tag, and date"

2. **WHEN** the guide is tagged with a species or pet type
   **THEN** it appears in relevant pet-related browsing areas (e.g. linked from the pet gallery or product pages for that species)
   **Evidence:** marketing-engine-ubiquitous-language.md — pet care guide: "cross-linked with relevant pet and product browsing areas based on its species/type tags"

3. **WHEN** *Content Author* saves a guide as draft
   **THEN** the guide is not visible to customers
   **AND** the draft remains editable and publishable from the admin content area
   **Evidence:** marketing-engine-ubiquitous-language.md — content invariant: "draft content must never be visible to customers"

4. **WHEN** *Content Author* attempts to publish a guide without any pet type or species tag
   **THEN** the system requires at least one tag before publishing
   **BUT** the draft is not lost — it can be saved and tagged later
   **Evidence:** marketing-engine-ubiquitous-language.md — pet care guide invariant: "must carry at least one pet type or species tag"

---

## Story: `Send Click-and-Collect Ready Notification`

**Story type:** system

### Domain terms

- *Click-and-Collect Ready Notification* — a transactional notification sent when the customer's click-and-collect order is ready for pickup
- *Pickup Store* — the *Store* where the order is waiting
- *Collection Window* — the deadline by which the customer must collect the order

### Acceptance criteria

1. **WHEN** a store employee marks a click-and-collect order as ready for pickup
   **THEN** the system sends a *Click-and-Collect Ready Notification* to the customer's email
   **AND** the notification includes: order number, *Pickup Store* address and operating hours, and the *Collection Window*
   **Evidence:** crc.md — Click-and-Collect, "notify customer when ready | Notification"; requirements-chat-with-product-owner.md — line 29, "click-and-collect should probably be an option"

2. **WHEN** the order was placed by a guest
   **THEN** the notification is sent to the guest email provided at checkout
   **Evidence:** inferred — same transactional routing as order confirmation

3. **WHEN** the *Collection Window* is approaching its deadline and the order has not been collected
   **THEN** the system sends a reminder notification warning that the order will be returned to stock if not collected
   **Evidence:** crc.md — Click-and-Collect, "collection window" property; inferred — uncollected order handling

4. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the notification is queued for retry
   **AND** the order status still transitions to ready for pickup — email failure does not block fulfilment
   **Evidence:** inferred — same email resilience pattern

# Acceptance criteria — Increment 8: Marketing engine — reviews, alerts, and content

**Increment outcome:** Drives repeat traffic and conversion through *Customer Review* social proof, opt-in marketing emails, *Restock Alert* nudges, personalised recommendations, and a content stream of blog posts and pet care guides. Engagement features only — the buy flow is unchanged.

**Builds on:** Increments 1-7 (full e-commerce spine, accounts, multi-vendor payments, pet visits, returns live).

---

## Story: `Submit Written Review with Star Rating`

**Story type:** user

### Domain terms

- *Customer Review* — a written opinion plus a star rating, authored by a *Customer Account*
- *Star Rating* — a 1-to-5 numeric score
- *Product* — the item being reviewed
- *Customer Account* — only verified, logged-in customers can author reviews

### Acceptance criteria

1. **WHEN** a logged-in customer opens the review form on a *Product Details Page*
   **THEN** the form collects a *Star Rating* (1-5) and a written review (free text)
   **AND** the customer must have purchased the product to leave a review
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "customer reviews — written reviews with star ratings"

2. **WHEN** the customer submits a valid review
   **THEN** the *Customer Review* is associated with the *Product* and the customer's *Customer Account*
   **AND** the review is visible on the *Product Details Page* (newest first or by helpfulness)
   **Evidence:** domain-sketch.md — Customer Account KA, `customer review` concept: "authored by a customer account"

3. **WHEN** the customer has not purchased the product
   **THEN** the review form is hidden or shows "purchase this product to leave a review"
   **Evidence:** domain-sketch.md — Product Catalog KA, `customer review` invariant: "must be authored by a verified customer account"

4. **WHEN** a guest customer tries to leave a review
   **THEN** a prompt to log in or register is shown
   **BUT** the product page is not navigated away from
   **Evidence:** domain-sketch.md — Customer Account KA, `customer review` concept: "authored by a customer account" (account required)

5. **WHEN** the customer submits a review with a star rating but no written text
   **THEN** the review is accepted (written text is optional; star rating is required)
   **Evidence:** inferred — star rating is the minimum; written review adds value but is not mandatory

---

## Story: `Submit Photo Review`

**Story type:** user

### Domain terms

- *Photo Review* — a *Customer Review* that includes one or more images
- *Review Photo* — an image attached to the review
- *Product* — the item being reviewed

### Acceptance criteria

1. **WHEN** the customer submits a review (see *Submit Written Review with Star Rating*)
   **THEN** an optional photo upload field allows attaching one or more *Review Photos*
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "photo reviews"

2. **WHEN** the customer attaches *Review Photos*
   **THEN** the images are displayed alongside the review on the *Product Details Page*
   **AND** the photos are viewable in a lightbox or gallery format
   **Evidence:** domain-sketch.md — Product Catalog KA, `photo review` decision: "photos live on the customer review, not as separate concepts"

3. **WHEN** the customer uploads a file that is not a supported image format or exceeds size limits
   **THEN** the upload shows a validation error
   **BUT** the review text and star rating are not lost
   **Evidence:** inferred — standard upload validation

4. **WHEN** the customer submits a review without photos
   **THEN** the review is accepted as a standard written review (photos are optional)
   **Evidence:** inferred — photo is an enhancement, not a requirement

---

## Story: `Read Customer Reviews`

**Story type:** user

### Domain terms

- *Customer Reviews* — the collection of reviews for a product
- *Aggregate Star Rating* — the average of all individual star ratings for a product
- *Product Details Page* — where reviews are displayed

### Acceptance criteria

1. **WHEN** the customer views a *Product Details Page*
   **THEN** the *Aggregate Star Rating* is displayed prominently near the product name
   **AND** the individual *Customer Reviews* are listed below the product details
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "Other customers should be able to see them and they should factor into some kind of aggregate star rating on the product"

2. **WHEN** a product has no reviews yet
   **THEN** the *Aggregate Star Rating* is not shown (not shown as zero)
   **AND** a "be the first to review" prompt appears
   **Evidence:** inferred — no reviews state

3. **WHEN** there are many reviews
   **THEN** the reviews are paginated or lazy-loaded
   **AND** sort controls are provided: newest, oldest, highest rating, lowest rating
   **Evidence:** inferred — standard review list behavior

4. **WHEN** a review includes *Review Photos*
   **THEN** thumbnails are shown inline with the review text
   **AND** selecting a thumbnail opens the image at full size
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "photo reviews"

---

## Story: `Set Notification Preferences`

**Story type:** user

### Domain terms

- *Notification Preferences* — the customer's choices about which transactional notifications they receive and through which channels
- *Customer Account* — preferences are tied to the logged-in customer
- *Transactional Notification* — order confirmations, shipping updates, appointment reminders, etc.

### Acceptance criteria

1. **WHEN** the customer opens *Notification Preferences* from account settings
   **THEN** the available notification categories are listed (order updates, shipping, appointments, returns)
   **AND** each category shows the current setting (on/off, email/SMS if applicable)
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "notification settings"

2. **WHEN** the customer toggles a notification category
   **THEN** the preference is saved immediately
   **AND** future notifications respect the updated preference
   **Evidence:** inferred — standard preference management

3. **WHEN** the customer disables all transactional notifications
   **THEN** critical notifications (e.g. order confirmation, refund completion) are still sent — they are non-optional
   **AND** a note explains that some notifications cannot be disabled
   **Evidence:** inferred — legal/operational transactional emails cannot be suppressed

---

## Story: `Set Communication Preferences`

**Story type:** user

### Domain terms

- *Communication Preferences* — the customer's opt-in/opt-out choices for marketing and promotional content
- *Marketing Category* — promotional emails, personalised recommendations, restock alerts, event notifications
- *Customer Account* — preferences are tied to the logged-in customer

### Acceptance criteria

1. **WHEN** the customer opens *Communication Preferences* from account settings
   **THEN** the available marketing categories are listed (promotions, recommendations, restock alerts, events)
   **AND** each shows the current opt-in/opt-out status
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "people should be able to manage their notification and communication preferences"

2. **WHEN** the customer opts out of a marketing category
   **THEN** the preference is saved immediately
   **AND** no marketing emails of that category are sent to the customer
   **Evidence:** domain-sketch.md — Notification KA, `communication preferences` invariant: "no broadcast without explicit opt-in for that category"

3. **WHEN** a new marketing category is added in a future increment
   **THEN** the default is opt-out (the customer must explicitly opt in)
   **Evidence:** domain-sketch.md — Notification KA, `communication preferences` invariant

---

## Story: `Opt In to Marketing Email List`

**Story type:** user

### Domain terms

- *Marketing Email List* — the set of customers who have opted in to receive promotional emails
- *Opt-In* — the explicit, affirmative action to join the marketing list
- *Communication Preferences* — where the opt-in is managed

### Acceptance criteria

1. **WHEN** the customer opts in to promotional emails via *Communication Preferences*
   **THEN** the customer is added to the *Marketing Email List*
   **AND** the opt-in is recorded with a timestamp
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "Email marketing with explicit opt-in"

2. **WHEN** the customer opts in during account registration or checkout
   **THEN** the opt-in checkbox is unchecked by default (opt-in must be affirmative)
   **AND** if checked, the customer is added to the *Marketing Email List*
   **Evidence:** domain-sketch.md — Notification KA, `communication preferences` invariant: "no broadcast without explicit opt-in"

3. **WHEN** the customer has not opted in
   **THEN** no marketing emails are sent to them — zero exceptions
   **Evidence:** domain-sketch.md — Notification KA invariant

---

## Story: `Send Promotional Email`

**Story type:** system

### Domain terms

- *Promotional Email* — a marketing email about sales, new products, or seasonal offers
- *Marketing Email List* — the set of opted-in customers
- *Communication Preferences* — the gate for eligibility

### Acceptance criteria

1. **WHEN** admin creates and sends a *Promotional Email*
   **THEN** the email is delivered only to customers on the *Marketing Email List* who have opted in to the promotions category
   **Evidence:** domain-sketch.md — Notification KA, `communication preferences` invariant: "no broadcast without explicit opt-in"

2. **WHEN** a customer on the list has since opted out
   **THEN** the email is not delivered to that customer
   **AND** their opt-out is respected even if the email batch was queued before the opt-out
   **Evidence:** inferred — real-time preference check at send time, not at batch creation

3. **WHEN** the email includes an unsubscribe link
   **THEN** clicking the link immediately opts the customer out of the promotions category
   **AND** the customer sees a "you've been unsubscribed" confirmation page
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "easy unsubscribe"

---

## Story: `Send Personalized Recommendation`

**Story type:** system

### Domain terms

- *Personalized Recommendation* — a product suggestion based on the customer's purchase history, browsing, or pet profiles
- *Communication Preferences* — the customer must have opted in to recommendations
- *Customer Account* — the identity used for personalisation

### Acceptance criteria

1. **WHEN** the system generates a *Personalized Recommendation* for a customer
   **THEN** the recommendation is based on purchase history, browsing patterns, or pet-related products
   **AND** it is sent only if the customer has opted in to the recommendations category in *Communication Preferences*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "personalised recommendations"

2. **WHEN** the customer has no purchase history or browsing data
   **THEN** no *Personalized Recommendation* is sent (rather than sending generic suggestions)
   **Evidence:** inferred — recommendations must be personalised; generic blasts are covered by *Send Promotional Email*

3. **WHEN** the recommended product is *Out of Stock*
   **THEN** it is excluded from the recommendation (do not recommend unavailable products)
   **Evidence:** inferred — recommending out-of-stock items damages trust

---

## Story: `Send Restock Alert`

**Story type:** system

### Domain terms

- *Restock Alert* — a notification sent when a previously out-of-stock product is back in stock
- *Communication Preferences* — the customer must have opted in to restock alerts
- *Wishlist* — if the product is on the customer's wishlist, the alert is more relevant

### Acceptance criteria

1. **WHEN** a product's *Stock Availability* transitions from *Out of Stock* to *In Stock*
   **THEN** the system sends a *Restock Alert* to each customer who has opted in to restock alerts and has the product on their *Wishlist*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "restock alerts"

2. **WHEN** the customer has not opted in to restock alerts
   **THEN** no alert is sent even if the product is on their wishlist
   **Evidence:** domain-sketch.md — Notification KA, `communication preferences` invariant

3. **WHEN** the product goes back out of stock before the customer acts on the alert
   **THEN** the product page shows the updated *Out of Stock* status (the alert is best-effort, not a guarantee of availability)
   **Evidence:** inferred — stock changes are real-time; alerts reflect a moment in time

---

## Story: `Send In-Store Event Notification`

**Story type:** system

### Domain terms

- *In-Store Event Notification* — an alert about upcoming events at a customer's preferred or nearby store
- *Communication Preferences* — the customer must have opted in to event notifications
- *Store* — the physical location hosting the event

### Acceptance criteria

1. **WHEN** admin creates an in-store event (adoption day, pet grooming workshop, etc.)
   **THEN** the system sends *In-Store Event Notifications* to opted-in customers whose preferred store matches the event location
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "in-store event notifications"

2. **WHEN** the customer has not set a preferred store
   **THEN** no event notification is sent (the system does not guess proximity)
   **BUT** the event is visible on the store's detail page for walk-in discovery
   **Evidence:** inferred — event notifications are targeted, not broadcast

3. **WHEN** the customer has opted out of event notifications
   **THEN** no alert is sent
   **Evidence:** domain-sketch.md — Notification KA, `communication preferences` invariant

---

## Story: `Unsubscribe from Marketing Emails`

**Story type:** user

### Domain terms

- *Unsubscribe* — the action of opting out of marketing communications
- *Marketing Email List* — the set the customer is removed from
- *Communication Preferences* — where the opt-out is reflected

### Acceptance criteria

1. **WHEN** the customer clicks the unsubscribe link in any marketing email
   **THEN** the customer is immediately opted out of that marketing category
   **AND** a "you've been unsubscribed" confirmation page is shown
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "easy unsubscribe"

2. **WHEN** the customer unsubscribes via the *Communication Preferences* page
   **THEN** the change takes effect immediately
   **AND** no further marketing emails of that category are sent
   **Evidence:** inferred — preference page and email link produce the same effect

3. **WHEN** the customer unsubscribes from all marketing categories
   **THEN** transactional notifications (order confirmations, shipping, appointments) are unaffected
   **Evidence:** inferred — marketing opt-out does not suppress operational emails

---

## Story: `Send Order Confirmation`

**Story type:** system

### Domain terms

- *Order Confirmation Notification* — the transactional email sent when an order is placed (may have already been delivered as part of Increment 2's confirmation email — this story formalises it under the notification infrastructure)
- *Notification Preferences* — transactional, non-suppressible

### Acceptance criteria

1. **WHEN** an order is confirmed (payment successful)
   **THEN** the system sends an *Order Confirmation Notification* to the customer
   **AND** the notification includes: order number, items, total, delivery option, and estimated delivery/pickup
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "Order confirmation page, confirmation email"

2. **WHEN** the customer has disabled order-related notifications in *Notification Preferences*
   **THEN** the *Order Confirmation Notification* is still sent — it is a mandatory transactional notification
   **Evidence:** inferred — order confirmation cannot be suppressed

3. **WHEN** the email delivery system is unavailable
   **THEN** the notification is queued for retry
   **Evidence:** inferred — same resilience pattern

---

## Story: `Send Shipping Update with Tracking`

**Story type:** system

### Domain terms

- *Shipping Update Notification* — the transactional email when the order ships or a status change occurs (may have already been delivered as part of Increment 3 — this story formalises it under the notification infrastructure)
- *Tracking Number* — the carrier reference included in the notification

### Acceptance criteria

1. **WHEN** the order status changes to *Shipped* and a *Tracking Number* is available
   **THEN** the system sends a *Shipping Update Notification* to the customer
   **AND** the notification includes: order number, tracking number, carrier link, and estimated delivery date
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers"

2. **WHEN** additional status changes occur (e.g. *Out for Delivery*, *Delivered*)
   **THEN** the system sends follow-up notifications if carrier data is available
   **Evidence:** inferred — extended shipping lifecycle notifications

3. **WHEN** the customer has disabled shipping notifications in *Notification Preferences*
   **THEN** the initial shipping notification is still sent (mandatory transactional)
   **BUT** optional follow-up status updates respect the preference
   **Evidence:** inferred — initial shipping notification is non-suppressible; follow-ups are optional

---

## Story: `Send Click-and-Collect Ready Notification`

**Story type:** system

### Domain terms

- *Click-and-Collect Ready Notification* — a transactional notification sent when the customer's order is prepared and ready for pickup
- *Pickup Store* — the store where the order is waiting
- *Estimated Ready Time* — the expected preparation time communicated at order confirmation
- *Collection Window* — the deadline by which the customer must collect the order

### Acceptance criteria

1. **WHEN** *Store Employee* marks a click-and-collect order as *Ready for Pickup* (see Increment 2, *Prepare Click-and-Collect Orders for Pickup*)
   **THEN** the system sends a *Click-and-Collect Ready Notification* to the customer's email
   **AND** the notification includes: order number, *Pickup Store* address and operating hours, and the *Collection Window*
   **Evidence:** crc.md — Click-and-Collect, `notify customer when ready | Notification`; requirements-chat-with-product-owner.md — line 29, "click-and-collect should probably be an option"

2. **WHEN** the order was placed by a guest
   **THEN** the notification is sent to the *Guest Email* provided at checkout
   **Evidence:** inferred — same transactional routing as order confirmation

3. **WHEN** the *Collection Window* is approaching its deadline and the order has not been collected
   **THEN** the system sends a reminder notification warning that the order will be returned to stock if not collected
   **Evidence:** crc.md — Click-and-Collect, `collection window` property; inferred — uncollected order handling

4. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the notification is queued for retry
   **AND** the order status still transitions to *Ready for Pickup* (email failure does not block fulfillment)
   **Evidence:** inferred — same email resilience pattern

---

## Story: `Publish Blog Post`

**Story type:** store employee

### Domain terms

- *Blog Post* — an article published on the PawPlace content area
- *Content Author* — the platform admin who writes and publishes
- *Blog Index* — the listing of all published blog posts

### Acceptance criteria

1. **WHEN** *Content Author* creates and publishes a *Blog Post*
   **THEN** the post appears on the *Blog Index* with title, summary, date, and author
   **AND** the full post is accessible via its own URL
   **Evidence:** requirements-chat-with-product-owner.md — line 27, "Blog posts and pet care guides. Maybe some educational content about different pet breeds, nutrition advice"

2. **WHEN** *Content Author* saves a *Blog Post* as draft
   **THEN** the post is not visible to customers
   **AND** the draft remains editable and publishable from the admin content-management area
   **Evidence:** inferred — standard content workflow

3. **WHEN** a published *Blog Post* is edited
   **THEN** the changes are reflected immediately on the live page
   **AND** the publish date does not change unless the author explicitly updates it
   **Evidence:** inferred — content update behavior

---

## Story: `Publish Pet Care Guide`

**Story type:** store employee

### Domain terms

- *Pet Care Guide* — an educational resource about pet breeds, nutrition, health, or care
- *Content Author* — the platform admin who writes and publishes
- *Guide Index* — the listing of all published pet care guides

### Acceptance criteria

1. **WHEN** *Content Author* creates and publishes a *Pet Care Guide*
   **THEN** the guide appears on the *Guide Index* with title, summary, pet type/species tag, and date
   **AND** the full guide is accessible via its own URL
   **Evidence:** requirements-chat-with-product-owner.md — line 27, "educational content about different pet breeds, nutrition advice"

2. **WHEN** the guide is tagged with a species or pet type
   **THEN** it appears in relevant pet-related browsing areas (e.g. linked from the Pet Gallery or product pages for that species)
   **Evidence:** inferred — cross-linking content with pet and product catalog

3. **WHEN** *Content Author* saves a guide as draft
   **THEN** the guide is not visible to customers
   **AND** the draft remains editable and publishable from the admin content-management area
   **Evidence:** inferred — standard content workflow

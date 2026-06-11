# Impact map — PawPlace

> **Reverse-engineered from** [story-map.md](../stories/story-map.md), [information-architecture.md](information-architecture.md), and [thin-slicing.md](../stories/thin-slicing.md).
> **Companion diagram:** [impact-map.drawio](impact-map.drawio) · ASCII source: [impact-map-ascii.md](impact-map-ascii.md) · Regenerate: `python scripts/render_impact_map_drawio.py`

```text
GOAL: Grow PawPlace as a profitable omnichannel pet retail and adoption business
GOAL: Compound store value through incremental omnichannel capabilities stores can use on day one
  METRIC: Online revenue per participating store grows year-over-year (economic)
  METRIC: Foot traffic attributable to digital stock-check journeys rises in pilot stores (strategic)
  METRIC: Adoption appointment-to-visit completion rate improves as the pet gallery goes live (strategic)
  NOTE: I1-I9 below = delivery increments from thin-slicing.md (Walk-in driver through Power-ups).
  ASSUMPTION: Walk-in stock accuracy depends on front-line staff updating stock within the same business day; re-check if pilot stores show digital-vs-shelf mismatch above ten percent. Pet appointments stay deferred until the commerce spine (I1-I4) is live because booking requires a verified customer account.

  ACTOR: Walk-in shoppers (mobile, no account, first visit)
    IMPACT: Finds nearest store and confirms a product is in stock before visiting
      METRIC: Stock-check sessions that end with a store visit (pilot attribution); target measurable lift vs pre-digital baseline
      DELIVERABLE: Store locator — map view
      DELIVERABLE: Store locator — list view
      DELIVERABLE: Location entry (postcode and share location)
    IMPACT: Browses the product catalog and opens product detail without abandoning the journey
      METRIC: Product detail views per catalog session; target majority of catalog sessions reach detail
      DELIVERABLE: Product catalog with category filter
      DELIVERABLE: Product detail page with image gallery and description
    IMPACT: Reads per-store stock availability on the product detail page
      METRIC: Stock availability region viewed per product detail session
      DELIVERABLE: Real-time stock availability by store on product detail page

  ACTOR: Store employees (front-line, inventory and fulfillment)
    IMPACT: Updates per-store stock levels so customer-facing availability stays accurate
      METRIC: Median time from shelf change to digital stock update; target same business day
      DELIVERABLE: Admin dashboard — stock levels form
    IMPACT: Prepares and hands off click-and-collect orders at the counter
      METRIC: Click-and-collect pickup completion rate vs orders placed
      DELIVERABLE: Click-and-collect order preparation workflow
      DELIVERABLE: Click-and-collect ready notification (transactional)
    IMPACT: Processes and ships incoming online orders
      METRIC: Order fulfillment cycle time from payment to ship notification
      DELIVERABLE: Incoming orders queue for store staff
      DELIVERABLE: Shipping notification with tracking number

  ACTOR: Guest online shoppers (click-and-collect, no account)
    IMPACT: Completes purchase online and selects a pickup store without creating an account
      METRIC: Guest click-and-collect checkout completion rate
      DELIVERABLE: Shopping cart (add, update, remove)
      DELIVERABLE: Guest checkout with click-and-collect store selection
      DELIVERABLE: StripeWave card payment
      DELIVERABLE: Order confirmation email

  ACTOR: Guest online shoppers (ship-to-home, standard delivery)
    IMPACT: Completes a shipped order with a delivery address and standard delivery option
      METRIC: Ship-to-home order completion rate among guest checkouts
      DELIVERABLE: Shipping address capture at checkout
      DELIVERABLE: Standard delivery option selection
      DELIVERABLE: Order status tracking for the customer

  ACTOR: Returning registered customers (repeat purchase)
    IMPACT: Registers, verifies email, and maintains session across devices
      METRIC: Registration-to-verified-email rate; cross-device login success rate
      DELIVERABLE: Registration and email verification flow
      DELIVERABLE: Login, logout, and password reset
      DELIVERABLE: Cross-device session management
    IMPACT: Reorders from order history using saved addresses and payment methods
      METRIC: Repeat purchase rate from registered customers; saved-entity use at checkout
      DELIVERABLE: Saved addresses and payment methods management
      DELIVERABLE: Order history and one-click reorder
      DELIVERABLE: Wishlist

  ACTOR: Price-sensitive and premium-basket online shoppers
    IMPACT: Completes payment using a preferred wallet or buy-now-pay-later option
      METRIC: Conversion lift on PayNova and VaultPay segments vs card-only baseline
      DELIVERABLE: PayNova digital wallet payment
      DELIVERABLE: VaultPay buy-now-pay-later payment
      DELIVERABLE: Failed payment retry across all vendors

  ACTOR: Prospective pet owners (adoption visit, verified account)
    IMPACT: Browses available pets and books an in-store visit at a chosen store
      METRIC: Appointment booking completion rate among gallery browsers
      DELIVERABLE: Pet gallery browse by species with store location and distance
      DELIVERABLE: Appointment scheduling with account gate
      DELIVERABLE: Appointment reminder (transactional)
    IMPACT: Cancels or rebooks when a booked pet is adopted before the visit
      METRIC: Rebook or cancel response rate after adoption notification
      DELIVERABLE: Pet adopted before visit notification
      DELIVERABLE: Cancel or rebook appointment flow

  ACTOR: Store employees (appointment and visit operations)
    IMPACT: Checks in visitors and records visit outcomes including no-shows
      METRIC: Visit outcome capture rate; no-show recording accuracy
      DELIVERABLE: Incoming appointments view
      DELIVERABLE: Customer check-in and visit outcome recording
      DELIVERABLE: No-show recording and follow-up action assignment
    IMPACT: Maintains accurate pet listings for the adoption gallery
      METRIC: Pet profile freshness (available vs adopted status accuracy)
      DELIVERABLE: Pet profile update and adopted marking (staff)

  ACTOR: Customers resolving post-purchase issues
    IMPACT: Initiates return online and tracks refund to the original payment method
      METRIC: Return initiation rate; refund settlement time to original vendor
      DELIVERABLE: Return initiation from order history with label or QR code
      DELIVERABLE: Refund routing through original payment vendor
      DELIVERABLE: In-store return processing (staff)

  ACTOR: Engaged repeat visitors (reviews and marketing opt-in)
    IMPACT: Submits product reviews with account-verified authorship
      METRIC: Verified review submission rate per product detail views
      DELIVERABLE: Written review with star rating (account-gated)
      DELIVERABLE: Photo review submission
      DELIVERABLE: Customer reviews on product detail page
    IMPACT: Opts into marketing categories they care about and acts on relevant nudges
      METRIC: Marketing opt-in rate by category; click-through on promotional and restock emails
      DELIVERABLE: Notification and communication preference management
      DELIVERABLE: Promotional email and personalized recommendation sends
      DELIVERABLE: Restock alert and in-store event notifications

  ACTOR: Store owners (operational oversight)
    IMPACT: Monitors inventory and order flow across the store
      METRIC: Inventory dashboard usage frequency; stock exception resolution time
      DELIVERABLE: Inventory dashboard for store owners

  ACTOR: Catalog browsers (deep catalog, returning visitors)
    IMPACT: Finds products via keyword search and multi-dimension filters
      METRIC: Search-to-product-detail conversion rate
      DELIVERABLE: Keyword product search
      DELIVERABLE: Product filters (category, pet type, brand)
      DELIVERABLE: Low stock badge on listings
    IMPACT: Sets a preferred store and receives a tailored experience
      METRIC: Preferred-store set rate among returning visitors; engagement lift on tailored surfaces
      DELIVERABLE: My store preference
      DELIVERABLE: Experience tailored to preferred store
      DELIVERABLE: Customer pet profiles for recommendations
```

| Phase | Feature | Actor / impact |
| --- | --- | --- |
| I1 | Walk-in driver — store locator, catalog, stock availability, staff stock form | Walk-in shoppers / Finds nearest store and confirms a product is in stock before visiting |
| I1 | Walk-in driver — product catalog and detail screens | Walk-in shoppers / Browses the product catalog and opens product detail without abandoning the journey |
| I1 | Walk-in driver — admin dashboard stock levels form | Store employees (front-line, inventory and fulfillment) / Updates per-store stock levels so customer-facing availability stays accurate |
| I2 | Click-and-collect — cart, guest checkout, StripeWave, staff pickup | Guest online shoppers (click-and-collect, no account) / Completes purchase online and selects a pickup store without creating an account |
| I2 | Click-and-collect — staff order preparation and ready notification | Store employees (front-line, inventory and fulfillment) / Prepares and hands off click-and-collect orders at the counter |
| I3 | Ship to home — shipping address, standard delivery, tracking | Guest online shoppers (ship-to-home, standard delivery) / Completes a shipped order with a delivery address and standard delivery option |
| I3 | Ship to home — staff fulfillment and shipping notification | Store employees (front-line, inventory and fulfillment) / Processes and ships incoming online orders |
| I4 | Returning customers — accounts, saved entities, reorder | Returning registered customers (repeat purchase) / Reorders from order history using saved addresses and payment methods |
| I5 | Pay your way — PayNova, VaultPay, payment retry | Price-sensitive and premium-basket online shoppers / Completes payment using a preferred wallet or buy-now-pay-later option |
| I6 | Pet visits — gallery, booking, staff visit operations | Prospective pet owners (adoption visit, verified account) / Browses available pets and books an in-store visit at a chosen store |
| I6 | Pet visits — adoption notification and rebook/cancel | Prospective pet owners (adoption visit, verified account) / Cancels or rebooks when a booked pet is adopted before the visit |
| I7 | Returns and refunds — online and in-store | Customers resolving post-purchase issues / Initiates return online and tracks refund to the original payment method |
| I8 | Marketing engine — reviews, alerts, content | Engaged repeat visitors (reviews and marketing opt-in) / Submits product reviews with account-verified authorship |
| I8 | Marketing engine — opt-in preferences and promotional sends | Engaged repeat visitors (reviews and marketing opt-in) / Opts into marketing categories they care about and acts on relevant nudges |
| I9 | Power-ups — search, filters, store personalization | Catalog browsers (deep catalog, returning visitors) / Finds products via keyword search and multi-dimension filters |
| I9 | Power-ups — inventory dashboard | Store owners (operational oversight) / Monitors inventory and order flow across the store |

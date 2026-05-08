# Acceptance criteria — Increment 2: Click-and-collect

**Increment outcome:** A customer can put products in a *Shopping Cart*, pay online with a card via *StripeWave*, and pick the order up at a chosen *Store*. Guest checkout only — no accounts. Single payment vendor. Store gets online revenue without home-delivery logistics.

**Builds on:** Increment 1 (Store, Product Catalog, Stock Availability, Admin Stock Form are live).

---

## Story: `Add Product to Cart`

**Story type:** user

### Domain terms

- *Shopping Cart* — accumulates products the customer intends to purchase, with quantities
- *Product* — a pet supply item from the *Product Catalog*
- *Product Details Page* — the page from which the customer adds to cart (established in Increment 1)
- *Cart Badge* — visible indicator of cart item count
- *Stock Availability* — whether the product is currently in stock (established in Increment 1)

### Acceptance criteria

1. **WHEN** the customer selects "Add to Cart" on a *Product Details Page*
   **THEN** the *Product* is added to the *Shopping Cart* with quantity 1
   **AND** the *Cart Badge* updates to reflect the new item count
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "A shopping cart that persists"

2. **WHEN** the customer adds a *Product* that is already in the *Shopping Cart*
   **THEN** the quantity for that product increments by 1 (not a duplicate line item)
   **AND** the *Cart Badge* updates accordingly
   **Evidence:** inferred — standard cart behavior; source does not explicitly address duplicate adds

3. **WHEN** the customer attempts to add a *Product* that is *Out of Stock*
   **THEN** the "Add to Cart" action is disabled or shows a clear message that the product is unavailable
   **BUT** the product is not added to the *Shopping Cart*
   **Evidence:** domain-sketch.md — Product Catalog KA, `stock availability` concept: "gates the order flow, preventing checkout of backordered items"

4. **WHEN** the customer adds multiple different *Products* to the *Shopping Cart*
   **THEN** each product appears as its own line item with its own quantity
   **AND** the *Cart Badge* shows the total number of distinct items or total quantity
   **Evidence:** domain-sketch.md — Order KA, `shopping cart` concept: "accumulates products the customer intends to purchase, with quantities"

---

## Story: `Update Cart Quantity`

**Story type:** user

### Domain terms

- *Shopping Cart* — the customer's current collection of intended purchases
- *Cart Line Item* — one product row in the cart, showing product, quantity, and line total
- *Quantity* — the number of units of a product the customer wants

### Acceptance criteria

1. **WHEN** the customer changes the *Quantity* on a *Cart Line Item*
   **THEN** the line total recalculates based on the new quantity
   **AND** the cart total recalculates
   **Evidence:** inferred from domain-sketch.md — Order KA, `shopping cart` concept: "accumulates products the customer intends to purchase, with quantities"

2. **WHEN** the customer sets *Quantity* to zero
   **THEN** the *Cart Line Item* is removed from the *Shopping Cart*
   **AND** the cart total and *Cart Badge* update
   **Evidence:** inferred — zero quantity is equivalent to removal

3. **WHEN** the customer enters a negative number or non-numeric value for *Quantity*
   **THEN** the cart shows a validation error on that line
   **BUT** the previous *Quantity* is not changed
   **Evidence:** inferred — standard form validation

---

## Story: `Remove Product from Cart`

**Story type:** user

### Domain terms

- *Shopping Cart* — the customer's current collection of intended purchases
- *Cart Line Item* — one product row in the cart
- *Remove Action* — explicit deletion of a line item from the cart

### Acceptance criteria

1. **WHEN** the customer selects *Remove Action* on a *Cart Line Item*
   **THEN** that product is removed from the *Shopping Cart*
   **AND** the cart total and *Cart Badge* update immediately
   **Evidence:** inferred from domain-sketch.md — Order KA, `shopping cart` concept

2. **WHEN** the customer removes the last item in the *Shopping Cart*
   **THEN** the cart shows an empty state with guidance to continue shopping
   **BUT** no checkout flow is accessible from an empty cart
   **Evidence:** inferred — empty cart guard

---

## Story: `Select Click-and-Collect Store`

**Story type:** user

### Domain terms

- *Click-and-Collect* — order online, pick up at a local store
- *Pickup Store* — the specific store the customer selects for collection
- *Store Selector* — the UI surface during checkout where the customer picks a store
- *Store* — a physical PawPlace location (established in Increment 1)

### Acceptance criteria

1. **WHEN** the customer reaches the delivery step in checkout
   **THEN** the *Store Selector* shows available stores for *Click-and-Collect*
   **AND** each store shows its address, operating hours, and distance (if customer location is known from Increment 1)
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "click-and-collect should probably be an option. Order online, pick up at your local store"

2. **WHEN** the customer selects a *Pickup Store*
   **THEN** that store is recorded as the fulfillment destination for the order
   **AND** no shipping address is required (pickup replaces delivery)
   **Evidence:** domain-sketch.md — Store KA, `click-and-collect` concept: "requires the customer to select a specific store at checkout"; invariant: "must reference a specific store for pickup"

3. **WHEN** no stores are within a reasonable distance (or customer has no location)
   **THEN** all stores are still listed (the customer may be willing to travel)
   **BUT** a note suggests entering a postcode or sharing location for distance-sorted results
   **Evidence:** inferred — click-and-collect should not be blocked by missing location data; distance sorting is a convenience from Increment 1

---

## Story: `Check Out as Guest`

**Story type:** user

### Domain terms

- *Guest Checkout* — completing a purchase without creating a customer account
- *Guest Email* — the email address collected for this single transaction (order confirmation, shipping updates)
- *Shopping Cart* — the cart transitioning to checkout

### Acceptance criteria

1. **WHEN** the customer proceeds to checkout without being logged in
   **THEN** the system offers *Guest Checkout* as the default path (no account required)
   **AND** the customer is asked for a *Guest Email* for order communications
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter"

2. **WHEN** the customer completes *Guest Checkout*
   **THEN** the order is placed and a confirmation email is sent to the *Guest Email*
   **BUT** no account is created — guest details are not persisted beyond this transaction
   **Evidence:** domain-sketch.md — Customer Account KA, `guest checkout` concept: "collects shipping and billing details for the single transaction only — no persistence"

3. **WHEN** the customer enters an invalid *Guest Email* (missing @, malformed)
   **THEN** the checkout shows a validation error on the email field
   **BUT** the checkout does not proceed until a valid email is provided
   **Evidence:** inferred — email is the only contact surface for guest order communications

4. **WHEN** a guest customer completes checkout
   **THEN** the system prompts account creation by surfacing the value of order history, saved addresses, and reorder
   **BUT** the prompt is dismissible — the order is already placed regardless of the customer's choice
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality"

---

## Story: `Enter Billing Address`

**Story type:** user

### Domain terms

- *Billing Address* — the address associated with the payment method for this order
- *Checkout Flow* — the step-by-step purchase process
- *Address Form* — the input surface for billing details

### Acceptance criteria

1. **WHEN** the customer reaches the billing step in the *Checkout Flow*
   **THEN** the *Address Form* collects: name, address line 1, address line 2 (optional), city, county/state, postcode, and country
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "Checkout flow: shipping address, billing address"

2. **WHEN** the customer submits the *Billing Address* with required fields missing
   **THEN** the form highlights the missing fields with clear validation messages
   **BUT** the checkout does not advance to payment
   **Evidence:** inferred — standard address validation

3. **WHEN** the customer completes the *Billing Address*
   **THEN** the checkout advances to the payment step
   **AND** the entered address is shown in the order summary for review
   **Evidence:** inferred — standard checkout flow; confirmed by domain-sketch.md — Order KA, `order` concept: "captures the complete purchase: products, quantities, shipping address, billing address, delivery option, and payment"

---

## Story: `Select Payment Method`

**Story type:** user

### Domain terms

- *Payment Method Selection* — the checkout step where the customer chooses how to pay
- *StripeWave* — the card payment vendor (the only one available in Increment 2)
- *Credit/Debit Card* — the payment instrument for StripeWave

### Acceptance criteria

1. **WHEN** the customer reaches the payment step in checkout
   **THEN** *StripeWave* (*Credit/Debit Card*) is the available *Payment Method Selection*
   **AND** the customer enters card number, expiry, and CVV
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "StripeWave handles the credit and debit card processing and is our primary gateway"

2. **WHEN** the customer enters valid card details
   **THEN** the checkout advances to the order review/confirmation step
   **Evidence:** inferred — standard card checkout flow

3. **WHEN** the customer enters invalid or incomplete card details
   **THEN** the form shows a validation error identifying the problem (invalid number, expired card, missing CVV)
   **BUT** no payment is attempted until all fields are valid
   **Evidence:** inferred — card validation before submission

---

## Story: `Process Card Payment via StripeWave`

**Story type:** system

### Domain terms

- *StripeWave* — primary card payment gateway
- *Payment* — the financial transaction for this order
- *Authorize-Capture-Settle* — StripeWave's three-phase card processing flow
- *Payment Confirmation* — the system's acknowledgment that payment succeeded
- *Webhook Callback* — StripeWave's asynchronous notification of transaction status

### Acceptance criteria

1. **WHEN** the customer confirms the order
   **THEN** the system initiates *Authorize-Capture-Settle* with *StripeWave* for the order total
   **AND** the customer sees a processing indicator while the payment is in flight
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "StripeWave handles the credit and debit card processing and is our primary gateway"

2. **WHEN** *StripeWave* returns a successful *Payment Confirmation*
   **THEN** the order status transitions to *Confirmed*
   **AND** the system proceeds to send the confirmation email (see *Confirm Order and Send Confirmation Email*)
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "The system should handle all the webhook callbacks, payment confirmations"

3. **WHEN** *StripeWave* declines the card (insufficient funds, card blocked, etc.)
   **THEN** the customer sees a clear error message identifying the decline reason (as much as StripeWave provides)
   **AND** the checkout offers a retry option with fields to enter different card details or switch cards
   **BUT** no order is created and no confirmation email is sent
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "failed payment retries"; domain-sketch.md — Payment KA, `payment` concept: "handles webhook callbacks, payment confirmations, and failed payment retries"

4. **WHEN** the *Webhook Callback* from *StripeWave* arrives after a timeout
   **THEN** the system reconciles the callback against the pending order
   **AND** if payment succeeded, the order transitions to *Confirmed* and the confirmation email fires
   **BUT** if payment failed, the order remains unpaid and the customer is notified to retry
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "webhook callbacks"

5. **WHEN** the connection to *StripeWave* is temporarily unavailable
   **THEN** the customer sees a "payment service temporarily unavailable" message
   **AND** a retry option is displayed after a brief wait
   **BUT** no charge is attempted and no order is confirmed
   **Evidence:** domain-sketch.md — Payment KA, `payment` invariant: "must be associated with exactly one order"

---

## Story: `Confirm Order and Send Confirmation Email`

**Story type:** system

### Domain terms

- *Order Confirmation* — the system event when payment succeeds and the order is finalized
- *Confirmation Email* — the email sent to the customer with order summary and pickup details
- *Order Confirmation Page* — the on-screen acknowledgment shown to the customer
- *Guest Email* — the email address provided during guest checkout (Increment 2 is guest-only)
- *Pickup Store* — the store selected for click-and-collect

### Acceptance criteria

1. **WHEN** *Payment* is confirmed (see *Process Card Payment via StripeWave*)
   **THEN** the system displays the *Order Confirmation Page* with order number, items, total, and *Pickup Store* details
   **AND** the system sends a *Confirmation Email* to the *Guest Email*
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "Order confirmation page, confirmation email"

2. **WHEN** the *Confirmation Email* is sent
   **THEN** it includes: order number, itemized list, total paid, payment method (masked), and *Pickup Store* address with operating hours
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "The usual stuff but done well"; domain-sketch.md — Store KA, `click-and-collect` concept

3. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the *Order Confirmation Page* still displays to the customer (the order is not blocked by email failure)
   **AND** the email is queued for retry
   **BUT** the order is not rolled back due to email failure
   **Evidence:** inferred — email is a side-effect, not a gate on order completion

---

## Story: `Prepare Click-and-Collect Orders for Pickup`

**Story type:** store employee

### Domain terms

- *Click-and-Collect Queue* — the list of confirmed orders awaiting staff preparation at a store
- *Store Employee* — the front-line staff member who prepares orders for pickup
- *Order* — a confirmed purchase with click-and-collect as the delivery option
- *Pickup Store* — the store fulfilling the order

### Acceptance criteria

1. **WHEN** *Store Employee* opens the *Click-and-Collect Queue* for their *Pickup Store*
   **THEN** they see all confirmed *Orders* pending preparation, sorted by order date (oldest first)
   **AND** each order shows the order number, items, quantities, and customer name or guest email
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "handle order fulfilment for click-and-collect if we offer that"

2. **WHEN** *Store Employee* marks an order as "prepared" (items gathered and ready for customer)
   **THEN** the order status transitions from *Confirmed* to *Ready for Pickup*
   **Evidence:** domain-sketch.md — Store KA, `click-and-collect` concept: "triggers store-side fulfillment preparation by staff"

3. **WHEN** an order in the *Click-and-Collect Queue* contains a product that is now *Out of Stock*
   **THEN** the staff member sees a stock warning on that line item
   **AND** the customer's *Guest Email* is displayed so staff may contact them to resolve (substitute, partial fulfillment, or cancel)
   **BUT** the order is not auto-cancelled — staff handle it manually in Increment 2
   **Evidence:** inferred — stock can change between order and fulfillment; no automated resolution in scope yet

---

## Story: `Fulfill Click-and-Collect Order`

**Story type:** store employee

### Domain terms

- *Order Fulfillment* — the act of handing the prepared order to the customer at the store
- *Ready for Pickup* — the order status after staff preparation (see *Prepare Click-and-Collect Orders for Pickup*)
- *Store Employee* — the front-line staff member completing the handoff
- *Collected* — the final order status after the customer picks up

### Acceptance criteria

1. **WHEN** the customer arrives and *Store Employee* confirms the handoff
   **THEN** the staff member marks the order as *Collected*
   **AND** the order status transitions from *Ready for Pickup* to *Collected*
   **Evidence:** domain-sketch.md — Store KA, `click-and-collect` concept: "offers an alternative to shipping: order online, pick up at a local store"

2. **WHEN** the customer does not pick up the order within a reasonable window
   **THEN** the order remains in *Ready for Pickup* status on the staff dashboard
   **AND** the customer's *Guest Email* is shown on the order detail for staff to reach out
   **BUT** the order is not auto-cancelled — staff handle uncollected orders manually in Increment 2
   **Evidence:** inferred — context gap noted in story-map.md: "Click-and-collect confirmation flow — source does not detail the pickup notification, window, or ID-check process"

3. **WHEN** *Store Employee* fulfills the last pending order in the queue
   **THEN** the *Click-and-Collect Queue* shows an empty state (all orders collected)
   **Evidence:** inferred — standard queue behavior

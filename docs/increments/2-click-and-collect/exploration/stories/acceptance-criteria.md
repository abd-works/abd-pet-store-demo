# Acceptance Criteria


---

## Increment 2

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

---
state: acceptance-criteria
increment_scope: Increment 2 — Click-and-collect
exploration_refresh: Run 3 slot 45
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 43)
---

# Acceptance criteria — Increment 2: Click-and-collect  

**Increment outcome:** A customer can put products in a *shopping cart*, pay online with a card via *StripeWave*, and pick the order up at a chosen *pickup store*. *Guest checkout* only — no accounts. Single *payment vendor* (*StripeWave*). Store gets online revenue without home-delivery logistics.  

**Builds on:** Increment 1 (*store*, *product catalog*, *stock availability*, *admin dashboard* stock form are live).  

**UL alignment:** Domain terms and AC prose follow Increment 2 refresh in `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 43): *guest checkout*, *guest email*, *pickup store*, *pickup fulfillment*, *click-and-collect queue*, *confirmation email*, *order confirmation page*, *payment confirmation*, *webhook callback*, session-scoped *shopping cart*, *StripeWave*-only *payment vendor*.  

**Scope guard:** No customer accounts, shipping delivery, PayNova, VaultPay, or *shopping cart* persistence across sessions.  

---  

## Story: Add Product to Cart  

**Story type:** user  

### Domain terms  

- *shopping cart* — session-scoped container of *cart item* quantities a guest customer intends to purchase  
- *cart item* — one *product* entry with quantity in the *shopping cart*  
- *product* — pet supply item from the *product catalog*  
- *product page* — detail surface from which the customer adds to cart (established in Increment 1)  
- *stock availability* — real-time indicator of whether a *product* is purchasable (established in Increment 1)  

### Acceptance criteria  

1. **WHEN** the customer selects "Add to Cart" on a *product page*  
   **THEN** the *product* is added to the *shopping cart* as a *cart item* with quantity 1  
   **AND** the visible item count indicator updates to reflect the new total  
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "A shopping cart that persists"; ubiquitous-language.md — *shopping cart*, *cart item*  

2. **WHEN** the customer adds a *product* that is already in the *shopping cart*  
   **THEN** the *cart item* quantity for that *product* increments by 1 (not a duplicate line)  
   **AND** the visible item count indicator updates accordingly  
   **Evidence:** ubiquitous-language.md — *shopping cart* invariant: duplicate *product* entries merge by incrementing quantity  

3. **WHEN** the customer attempts to add a *product* whose *stock availability* is out of stock  
   **THEN** the "Add to Cart" action is disabled or shows a clear unavailability message  
   **BUT** the *product* is not added to the *shopping cart*  
   **Evidence:** ubiquitous-language.md — *stock availability* gates the purchase path  

4. **WHEN** the customer adds multiple different *products* to the *shopping cart*  
   **THEN** each *product* appears as its own *cart item* with its own quantity  
   **AND** the visible item count indicator shows the total number of units or distinct lines  
   **Evidence:** ubiquitous-language.md — *shopping cart* accumulates *cart item* with quantities  

5. **WHEN** a guest customer's browser session ends before checkout completes  
   **THEN** the *shopping cart* contents are not available in a new session  
   **BUT** in-session cart changes remain until checkout completes or the session ends  
   **Evidence:** ubiquitous-language.md — *shopping cart* in Increment 2 is session-scoped for guest customers; thin-slicing.md — Increment 2, no accounts yet  

---  

## Story: Update Cart Quantity  

**Story type:** user  

### Domain terms  

- *shopping cart* — the customer's current collection of intended purchases  
- *cart item* — one *product* row showing quantity and line total  
- *stock availability* — current purchasability gate for a *product*  

### Acceptance criteria  

1. **WHEN** the customer changes the quantity on a *cart item*  
   **THEN** the line total recalculates based on the new quantity  
   **AND** the cart total recalculates  
   **Evidence:** ubiquitous-language.md — *shopping cart* accumulates *cart item* with quantities  

2. **WHEN** the customer sets quantity to zero on a *cart item*  
   **THEN** the *cart item* is removed from the *shopping cart*  
   **AND** the cart total and visible item count indicator update  
   **Evidence:** ubiquitous-language.md — *cart item* quantity must be at least one; zero is equivalent to removal  

3. **WHEN** the customer enters a negative number or non-numeric value for quantity  
   **THEN** the cart shows a validation error on that line  
   **BUT** the previous quantity is not changed  
   **Evidence:** inferred — standard form validation  

4. **WHEN** the customer enters a quantity greater than current *stock availability* allows  
   **THEN** the cart shows a validation error on that *cart item*  
   **BUT** the previous quantity is not changed  
   **Evidence:** ubiquitous-language.md — *shopping cart* validates *cart item* quantities against current *stock availability* at render time  

---  

## Story: Remove Product from Cart  

**Story type:** user  

### Domain terms  

- *shopping cart* — the customer's current collection of intended purchases  
- *cart item* — one *product* row in the cart  

### Acceptance criteria  

1. **WHEN** the customer selects remove on a *cart item*  
   **THEN** that *product* is removed from the *shopping cart*  
   **AND** the cart total and visible item count indicator update immediately  
   **Evidence:** ubiquitous-language.md — *shopping cart* / *cart item*  

2. **WHEN** the customer removes the last *cart item* in the *shopping cart*  
   **THEN** the cart shows an empty state with guidance to continue shopping  
   **BUT** no checkout flow is accessible from an empty cart  
   **Evidence:** inferred — empty cart guard  

3. **WHEN** the *shopping cart* becomes empty  
   **THEN** a continue-shopping affordance returns the customer to the *product catalog*  
   **Evidence:** inferred — standard empty-cart recovery  

---  

## Story: Select Click-and-Collect Store  

**Story type:** user  

### Domain terms  

- *click-and-collect* — sole *delivery option* in Increment 2: order online and pick up at a selected *pickup store*  
- *pickup store* — customer-selected *store* where the order is collected  
- *store* — physical PawPlace location (established in Increment 1)  
- *delivery option* — fulfillment method recorded on the *order*; fixed to *click-and-collect* in this increment  

### Acceptance criteria  

1. **WHEN** the customer reaches the delivery step in checkout  
   **THEN** *click-and-collect* is the only *delivery option* presented  
   **AND** the store selection list shows available *store* locations with *address*, *operating hours*, and *distance* (when customer location is known from Increment 1)  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "click-and-collect should probably be an option. Order online, pick up at your local store"; ubiquitous-language.md — *click-and-collect* sole *delivery option* in Increment 2  

2. **WHEN** the customer selects a *pickup store*  
   **THEN** that *store* is recorded as the collection location for the *order*  
   **AND** no shipping address is required (*click-and-collect* replaces delivery)  
   **Evidence:** ubiquitous-language.md — *click-and-collect* invariant: must reference a specific *pickup store*  

3. **WHEN** the customer has not provided location data  
   **THEN** all *store* locations are still listed (the customer may be willing to travel)  
   **BUT** a note suggests entering a *postcode* or sharing *shared location* for distance-sorted results  
   **Evidence:** inferred — *click-and-collect* should not be blocked by missing location; Increment 1 *store locator* distance behavior  

4. **WHEN** the customer confirms *click-and-collect* with a *pickup store* selected  
   **THEN** the checkout summary shows the chosen *pickup store* name and *address*  
   **Evidence:** ubiquitous-language.md — *pickup store* displays on *order confirmation page* and in *confirmation email*  

---  

## Story: Check Out as Guest  

**Story type:** user  

### Domain terms  

- *guest checkout* — purchase path without creating a *customer account*  
- *guest email* — contact address collected during *guest checkout* for *confirmation email* and staff outreach  
- *shopping cart* — the cart transitioning to checkout  

### Acceptance criteria  

1. **WHEN** the customer proceeds to checkout without being logged in  
   **THEN** the system offers *guest checkout* as the default path (no account required)  
   **AND** the customer is asked for a *guest email* and name for order communications  
   **BUT** login and registration are not offered before purchase  
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "Guest checkout has to work too"; ubiquitous-language.md — *guest checkout* collects *guest email*, name, and *billing address*; default checkout path in Increment 2  

2. **WHEN** the customer completes *guest checkout*  
   **THEN** the *order* is placed and a *confirmation email* is sent to the *guest email*  
   **BUT** no *customer account* is created — guest details are not persisted beyond this transaction  
   **Evidence:** ubiquitous-language.md — *guest checkout* invariant: guest details must not persist beyond the transaction  

3. **WHEN** the customer enters an invalid *guest email* (missing @, malformed)  
   **THEN** the checkout shows a validation error on the email field  
   **BUT** the checkout does not proceed until a valid *guest email* is provided  
   **Evidence:** ubiquitous-language.md — *guest email* invariant: must be valid before checkout advances to *payment*  

4. **WHEN** a guest customer completes checkout  
   **THEN** the system prompts *customer account* creation by surfacing the value of order history, saved addresses, and reorder  
   **BUT** the prompt is dismissible — the *order* is already placed regardless of the customer's choice  
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality"  

---  

## Story: Enter Billing Address  

**Story type:** user  

### Domain terms  

- *billing address* — address collected at checkout for payment verification and receipt purposes  
- *guest checkout* — single-transaction checkout path that collects *billing address* without persisting it  

### Acceptance criteria  

1. **WHEN** the customer reaches the billing step in checkout  
   **THEN** the address form collects: name, address line 1, address line 2 (optional), city, county/state, postcode, and country  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "Checkout flow: shipping address, billing address"; ubiquitous-language.md — *billing address* required on every Increment 2 *order*  

2. **WHEN** the customer submits the *billing address* with required fields missing  
   **THEN** the form highlights the missing fields with clear validation messages  
   **BUT** the checkout does not advance to *payment*  
   **Evidence:** ubiquitous-language.md — *billing address* invariant: required fields must be complete before checkout advances to *payment*  

3. **WHEN** the customer completes the *billing address*  
   **THEN** the checkout advances to the *payment* step  
   **AND** the entered *billing address* is shown in the order summary for review  
   **Evidence:** ubiquitous-language.md — *billing address* on confirmed *order*; standard checkout flow  

4. **WHEN** the customer completes *guest checkout*  
   **THEN** the *billing address* is copied onto the confirmed *order* only  
   **BUT** the *billing address* is not persisted after *guest checkout* completes  
   **Evidence:** ubiquitous-language.md — *billing address* is not persisted after *guest checkout* completes  

---  

## Story: Select Payment Method  

**Story type:** user  

### Domain terms  

- *StripeWave* — sole active *payment vendor* in Increment 2 (credit and debit card)  
- *payment vendor* — third-party processor behind unified checkout  
- *payment* — financial transaction for the *order*  

### Acceptance criteria  

1. **WHEN** the customer reaches the payment step in checkout  
   **THEN** *StripeWave* (credit/debit card) is the only available *payment vendor*  
   **AND** the customer enters card number, expiry, and CVV  
   **BUT** PayNova, VaultPay, and saved payment methods do not appear  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "StripeWave handles the credit and debit card processing"; ubiquitous-language.md — Increment 2 exposes only *StripeWave*  

2. **WHEN** the customer enters valid card details  
   **THEN** the checkout advances to the order review step  
   **Evidence:** inferred — standard card checkout flow  

3. **WHEN** the customer enters invalid or incomplete card details  
   **THEN** the form shows a validation error identifying the problem (invalid number, expired card, missing CVV)  
   **BUT** no *payment* is attempted until all fields are valid  
   **Evidence:** inferred — card validation before submission  

---  

## Story: Process Card Payment via StripeWave  

**Story type:** system  

### Domain terms  

- *StripeWave* — sole active credit and debit card *payment vendor*  
- *payment* — financial transaction triggered by the confirmed *order*  
- *payment confirmation* — vendor signal that authorization, capture, and settlement succeeded  
- *webhook callback* — asynchronous *StripeWave* notification reconciling an in-flight *payment*  

### Acceptance criteria  

1. **WHEN** the customer confirms the *order*  
   **THEN** the system initiates card processing with *StripeWave* for the order total  
   **AND** the customer sees a processing indicator while the *payment* is in flight  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "StripeWave handles the credit and debit card processing and is our primary gateway"  

2. **WHEN** *StripeWave* returns a successful *payment confirmation*  
   **THEN** the *order* status transitions to confirmed  
   **AND** the system proceeds to send the *confirmation email* (see *Confirm Order and Send Confirmation Email*)  
   **Evidence:** ubiquitous-language.md — *payment confirmation* triggers *order* transition to confirmed and fires *confirmation email*  

3. **WHEN** *StripeWave* declines the card (insufficient funds, card blocked, etc.)  
   **THEN** the customer sees a clear error message identifying the decline reason (as much as *StripeWave* provides)  
   **AND** the checkout offers a retry option with fields to enter different card details  
   **BUT** no *order* is confirmed and no *confirmation email* is sent  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "failed payment retries"; ubiquitous-language.md — *payment* surfaces card-decline reasons and offers retry  

4. **WHEN** the *webhook callback* from *StripeWave* arrives after a timeout  
   **THEN** the system reconciles the callback against the pending *payment*  
   **AND** if *payment confirmation* succeeded, the *order* transitions to confirmed and the *confirmation email* fires  
   **BUT** if *payment* failed, the *order* remains unpaid and the customer is notified to retry  
   **Evidence:** ubiquitous-language.md — *webhook callback* reconciles in-flight *payment* after timeout or disconnect  

5. **WHEN** the connection to *StripeWave* is temporarily unavailable  
   **THEN** the customer sees a "payment service temporarily unavailable" message  
   **AND** a retry option is displayed after a brief wait  
   **BUT** no charge is attempted and no *order* is confirmed  
   **Evidence:** ubiquitous-language.md — *payment* invariant: must not confirm the *order* until *payment confirmation* succeeds  

---  

## Story: Confirm Order and Send Confirmation Email  

**Story type:** system  

### Domain terms  

- *order* — confirmed purchase record after successful *payment*  
- *confirmation email* — transactional *notification* with *order* summary and *pickup store* details  
- *order confirmation page* — post-purchase surface showing *order* number, items, total, and *pickup store* details  
- *guest email* — recipient address collected during *guest checkout*  
- *pickup store* — *store* selected for *click-and-collect* collection  

### Acceptance criteria  

1. **WHEN** *payment confirmation* succeeds (see *Process Card Payment via StripeWave*)  
   **THEN** the system displays the *order confirmation page* with *order* number, *order line item* list, total, and *pickup store* details  
   **AND** the system sends a *confirmation email* to the *guest email*  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "Order confirmation page, confirmation email"; ubiquitous-language.md — *order confirmation page*, *confirmation email*  

2. **WHEN** the *confirmation email* is sent  
   **THEN** it includes: *order* number, *order line item* list, total paid, masked *payment* method, and *pickup store* *address* with *operating hours*  
   **Evidence:** ubiquitous-language.md — *confirmation email* includes pickup details; requirements-chat-with-product-owner.md — line 19  

3. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the *order confirmation page* still displays to the customer (the *order* is not blocked by email failure)  
   **AND** the *confirmation email* is queued for retry  
   **BUT** the *order* is not rolled back due to email failure  
   **Evidence:** ubiquitous-language.md — *confirmation email* invariant: must not block *order* confirmation when delivery fails  

---  

## Story: Prepare Click-and-Collect Orders for Pickup  

**Story type:** store employee  

### Domain terms  

- *click-and-collect queue* — staff view of confirmed *click-and-collect* *order* pending *pickup fulfillment*  
- *store employee* — front-line staff member who prepares orders for pickup  
- *order* — confirmed purchase with *click-and-collect* as *delivery option*  
- *pickup store* — *store* fulfilling the *order*  
- *pickup fulfillment* — store-side preparation workflow for *click-and-collect* *order*  
- *guest email* — contact shown so staff may reach the customer during preparation  

### Acceptance criteria  

1. **WHEN** the *store employee* opens the *click-and-collect queue* for their *pickup store*  
   **THEN** they see all confirmed *order* pending *pickup fulfillment*, sorted oldest first  
   **AND** each *order* shows the *order* number, *order line item* details, and *guest email* or customer name  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "handle order fulfilment for click-and-collect if we offer that"; ubiquitous-language.md — *click-and-collect queue*  

2. **WHEN** the *store employee* marks an *order* as prepared (items gathered and ready for customer)  
   **THEN** the *order* status transitions from confirmed to ready for pickup  
   **Evidence:** ubiquitous-language.md — *pickup fulfillment* transitions *order* from confirmed to ready for pickup  

3. **WHEN** an *order* in the *click-and-collect queue* contains a *product* that is now out of stock at the *pickup store*  
   **THEN** the *store employee* sees a stock warning on that *order line item*  
   **AND** the customer's *guest email* is displayed so staff may contact them to resolve (substitute, partial fulfillment, or cancel)  
   **BUT** the *order* is not auto-cancelled — staff handle it manually in Increment 2  
   **Evidence:** ubiquitous-language.md — *pickup fulfillment* shows *guest email* on the queue for staff outreach  

---  

## Story: Fulfill Click-and-Collect Order  

**Story type:** store employee  

### Domain terms  

- *pickup fulfillment* — store-side preparation and handoff of *click-and-collect* *order*  
- *click-and-collect queue* — staff view of orders awaiting collection  
- *store employee* — front-line staff member completing the handoff  
- *guest email* — contact for outreach on uncollected orders  

### Acceptance criteria  

1. **WHEN** the customer arrives and the *store employee* confirms the handoff  
   **THEN** the *store employee* marks the *order* as collected  
   **AND** the *order* status transitions from ready for pickup to collected  
   **Evidence:** ubiquitous-language.md — *pickup fulfillment* transitions *order* from ready for pickup to collected at the *pickup store*  

2. **WHEN** the customer does not pick up the *order* within a reasonable window  
   **THEN** the *order* remains in ready for pickup status on the staff dashboard  
   **AND** the customer's *guest email* is shown on the *order* detail for staff to reach out  
   **BUT** the *order* is not auto-cancelled — staff handle uncollected orders manually in Increment 2  
   **Evidence:** inferred — context gap: pickup notification, window, and ID-check process not specified in source  

3. **WHEN** the *store employee* fulfills the last pending *order* in the *click-and-collect queue*  
   **THEN** the *click-and-collect queue* shows an empty state (all orders collected)  
   **Evidence:** inferred — standard queue behavior  

---

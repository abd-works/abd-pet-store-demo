# Acceptance criteria

Whole-solution exploration acceptance criteria for PawPlace. Each increment section lists domain terms and WHEN/THEN/AND/BUT behavioral AC.

## Increment 1: Walk-in driver — find the store, see what's in stock

Scope: A customer can find their nearest store, browse the product catalog by category, see real-time stock availability for a product at that store, and walk in to ask for it. Payment-free, account-free. No cart, no checkout, no notifications.  

---  

## Story: View Store Map  

**Story type:** user  

### Domain terms  

- *store* — physical retail location with address, coordinates, and operating hours  
- *store locator* — first-class feature for discovering stores  
- *map view* — geographic display of store locations on a map  
- *geo-coordinates* — latitude/longitude positioning a store on the map  
- *operating hours* — times when the store is open to the public  
- *contact details* — phone, email, or other ways to reach the store  

### Acceptance criteria  

1. **WHEN** the customer opens the *store locator*  
   **THEN** the system displays all stores as selectable points on a *map view*  
   **AND** each point is positioned at the store's *geo-coordinates*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "store locator needs to be a first-class feature. Map view"; line 9, "each store is geo-tagged with its actual address, map coordinates"  

2. **WHEN** the customer selects a store point on the *map view*  
   **THEN** the system displays the store's full address, *operating hours*, and *contact details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "operating hours, and contact details"  

3. **WHEN** multiple stores exist  
   **THEN** the *map view* shows all store locations simultaneously without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *store locator* and *map view* are fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: View Store List  

**Story type:** user  

### Domain terms  

- *store* — physical retail location  
- *store locator* — feature for discovering stores  
- *list view* — sequential display of stores as a readable list  
- *address* — street address of the store  
- *operating hours* — when the store is open  
- *contact details* — phone, email, or other contact info  

### Acceptance criteria  

1. **WHEN** the customer opens the *store locator*  
   **THEN** the system offers a *list view* of all stores as an alternative to the *map view*  
   **AND** each entry shows the store name and *address*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Map view, list view"; domain-sketch.md — Store > store locator, "provides map view and list view of all stores"  

2. **WHEN** the customer selects a store from the *list view*  
   **THEN** the system displays the store's full *address*, *operating hours*, and *contact details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "address, map coordinates, operating hours, and contact details"  

3. **WHEN** the *list view* loads  
   **THEN** all stores appear without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *list view* is fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: Calculate Distance to Store  

**Story type:** user  

### Domain terms  

- *store* — physical retail location  
- *distance* — calculated proximity from customer to a store  
- *postcode* — customer-entered text representing their location  
- *shared location* — device-based geolocation provided by the customer  
- *nearest-first* — sort order ranking closest stores at the top  
- *map view* / *list view* — the two store locator display surfaces  

### Acceptance criteria  

1. **WHEN** the customer provides their location (via *shared location* or entering a *postcode*)  
   **THEN** the system calculates *distance* from the customer to each *store*  
   **AND** stores are sorted *nearest-first*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them (assuming they share location or enter a postcode)"; domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode, producing a sorted nearest-first result list"  

2. **WHEN** the customer has not provided any location  
   **THEN** the *store locator* displays all stores without *distance* information  
   **AND** all stores remain browsable in their default order  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, conditional phrasing "assuming they share location or enter a postcode" implies location provision is optional  

3. **WHEN** *distance* has been calculated  
   **THEN** the distance value appears next to each *store* in both *map view* and *list view*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them"; line 11, "Map view, list view"  

4. **WHEN** the customer changes their location input (new *postcode* or re-shared location)  
   **THEN** the system recalculates *distance* for all stores  
   **AND** the *nearest-first* ordering updates accordingly  
   **Evidence:** domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode" (implies recalculation on input change)  

---  

## Story: View Product Details  

**Story type:** user  

### Domain terms  

- *product* — item available for sale in the pet supplies catalog  
- *product catalog* — the browsable collection of products  
- *category* — grouping of products by type, pet type, or brand  
- *product page* — the detail surface for a single product  
- *product images* — multiple-angle product photographs  
- *description* — textual detail about the product  
- *weight and dimensions* — physical measurements where relevant  

### Acceptance criteria  

1. **WHEN** the customer selects a *product* from the *product catalog*  
   **THEN** the system displays the *product page* with the product name, *description*, and *product images*  
   **AND** *weight and dimensions* are shown where relevant to the product  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant"  

2. **WHEN** the *product* belongs to one or more categories  
   **THEN** the *product page* shows which *category* or categories the product belongs to  
   **Evidence:** domain-sketch.md — Product Catalog > product, "belongs to at least one category and may belong to several simultaneously"  

3. **WHEN** the *product* has multiple *product images*  
   **THEN** the system displays all available images  
   **AND** navigation controls (arrows, thumbnails) are provided to browse between images  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "images (multiple angles ideally)"  

4. **WHEN** the customer navigates the *product catalog*  
   **THEN** products are organized by *category* for browsing  
   **BUT** no keyword search is available in this increment  
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

5. **WHEN** the customer views a *product page*  
   **THEN** no purchase, cart, or review actions are available  
   **Evidence:** thin-slicing.md — Increment 1, "No cart, no checkout, no notifications"; Increment 8 includes reviews  

---  

## Story: Display Real-Time Stock Availability  

**Story type:** system  

### Domain terms  

- *stock availability* — real-time indicator of whether a product can be obtained  
- *product* — item in the catalog  
- *product page* — the detail surface where stock is shown  
- *store* — physical location where stock is held  
- *stock level* — the quantity of a product at a given store  
- *real-time* — always current, never stale  

### Acceptance criteria  

1. **WHEN** the customer views a *product page*  
   **THEN** the system displays current *stock availability* for that *product*  
   **AND** the availability reflects the most recent *stock level* (*real-time*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Products should show stock availability in real time"; domain-sketch.md — Product Catalog > stock availability, "reflects in real time whether a product can be purchased"  

2. **WHEN** the *product* is in stock at one or more stores  
   **THEN** the system indicates which *store* or stores have it available  
   **Evidence:** thin-slicing.md — Increment 1, "see real-time stock availability for a product at that store"; requirements-chat-with-product-owner.md — line 9, "they should see which store that animal is at" (same per-store pattern applied to products)  

3. **WHEN** the *product* is out of stock at all stores  
   **THEN** the system clearly indicates the product is currently unavailable  
   **BUT** no backorder, pre-order, or purchase option is offered  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "nobody wants to go through checkout and find out the item's backordered"; thin-slicing.md — Increment 1, "No cart, no checkout"  

4. **WHEN** *stock level* are updated by staff  
   **THEN** subsequent customer views of the *product page* reflect the updated *stock availability*  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "must be current — stale availability that allows checkout of unavailable items is a domain failure"  

---  

## Story: Update Product Stock Levels  

**Story type:** user  

### Domain terms  

- *store employee* — admin role performing stock updates  
- *stock level* — numeric quantity of a product at a store  
- *product* — item in the catalog  
- *store* — physical location where stock is held  
- *stock availability* — the customer-visible status derived from stock levels  
- *admin dashboard* — bare-bones interface for manual stock entry  

### Acceptance criteria  

1. **WHEN** *store employee* opens the *admin dashboard* for a *product*  
   **THEN** the system displays the current *stock level* for that product at the selected *store*  
   **AND** an editable stock quantity field is displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; thin-slicing.md — Increment 1, "Manual stock updates by staff via a bare-bones admin form"  

2. **WHEN** *store employee* submits an updated stock quantity  
   **THEN** the system saves the new *stock level*  
   **AND** the *stock availability* shown to customers reflects the change  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "reflects in real time"; thin-slicing.md — Increment 1, "Manual stock updates by staff"  

3. **WHEN** *store employee* enters an invalid stock value (negative number or non-numeric input)  
   **THEN** the system rejects the update with a clear error message  
   **BUT** the previous *stock level* remain unchanged  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability invariant, "must be current" (invalid state must not corrupt stock truth); inferred from standard input validation — flagged as assumption  

4. **WHEN** *store employee* updates stock for a *product* at one *store*  
   **THEN** only that store's *stock level* for that product are changed  
   **BUT** other stores' stock for the same product remains unaffected  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "multiple physical stores"; thin-slicing.md — Increment 1, "stock availability for a product at that store" (per-store granularity)

## Increment 2: Click-and-collect — buy online, pick up at the store

---
state: acceptance-criteria
increment_scope: Increment 2 — Click-and-collect
exploration_refresh: Run 3 slot 45
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 43)
---

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

## Increment 3: Ship to home — full standard-delivery e-commerce

---
state: acceptance-criteria
increment_scope: Increment 3 — Ship to home
exploration_refresh: Run 4 slot 71
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 69)
---

**Increment outcome:** A customer can complete the same *guest checkout* purchase journey but have the *order* **shipped** to a *shipping address*. *Standard delivery* only — express and same-day deferred. The store reaches customers outside its catchment.  

**Builds on:** Increment 1 (*store*, *product catalog*, *stock availability*), Increment 2 (*shopping cart*, *guest checkout*, *StripeWave*, *click-and-collect*, *pickup fulfillment*, *confirmation email*, *order confirmation page*).  

**UL alignment:** Domain terms and AC prose follow Increment 3 refresh in `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 69): *shipping address*, *standard delivery*, *delivery option*, *ship-to-home fulfillment*, *order queue*, *tracking number*, *order status*, *order status page*, *shipping notification*, *guest email*.  

**Scope guard:** No customer accounts, login, *saved address*, or express/same-day delivery. *Guest checkout* + *click-and-collect* + *standard delivery* only; *StripeWave*-only *payment vendor*.  

---  

## Story: Enter Shipping Address  

**Story type:** user  

### Domain terms  

- *guest checkout* — purchase path without creating a *customer account*; collects *shipping address* when *standard delivery* is chosen  
- *shipping address* — delivery destination collected at checkout for ship-to-home *order*  
- *billing address* — address collected in the prior checkout step; may pre-fill *shipping address*  
- *standard delivery* — ship-to-home *delivery option* requiring a complete *shipping address*  
- *click-and-collect* — alternative *delivery option* that skips the *shipping address* step  

### Acceptance criteria  

1. **WHEN** the customer reaches the shipping step on a ship-to-home checkout path  
   **THEN** the checkout presents a *shipping address* form  
   **AND** the form collects: name, address line 1, address line 2 (optional), city, county or region, postcode, and country  
   **BUT** the step does not apply to *click-and-collect* *order* — those skip *shipping address* entirely (see *Select Delivery Option*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "Checkout flow: shipping address, billing address, delivery options"; ubiquitous-language.md — *shipping address*  

2. **WHEN** the customer's *shipping address* matches their *billing address*  
   **THEN** a "same as billing" option pre-fills the *shipping address* from the *billing address* entered in the billing step  
   **Evidence:** ubiquitous-language.md — *shipping address* pre-fills from *billing address* when customer selects "same as billing"  

3. **WHEN** the customer overrides an individual field on the pre-filled *shipping address*  
   **THEN** the overridden value replaces the *billing address* value for that field only  
   **AND** the remaining pre-filled fields are unchanged  
   **Evidence:** ubiquitous-language.md — individual field overrides replace only the changed field  

4. **WHEN** the customer submits the *shipping address* with required fields missing  
   **THEN** the form highlights the missing fields with clear validation messages  
   **BUT** the checkout does not advance to *delivery option* selection  
   **Evidence:** ubiquitous-language.md — *shipping address* invariant: required fields must be complete before checkout advances from the shipping step  

5. **WHEN** the customer completes the *shipping address*  
   **THEN** the checkout advances to the *delivery option* selection step  
   **AND** the entered *shipping address* is shown in the order summary for review  
   **Evidence:** ubiquitous-language.md — *shipping address* is copied onto the confirmed *order* and shown in the order summary  

---  

## Story: Select Delivery Option  

**Story type:** user  

### Domain terms  

- *delivery option* — fulfillment method recorded on the *order* — *standard delivery* or *click-and-collect* in Increment 3  
- *standard delivery* — sole ship-to-home option; ships to *shipping address* with estimated window and shipping cost  
- *click-and-collect* — pickup at a selected *pickup store*; no *shipping address* required  
- *shipping address* — delivery destination confirmed when *standard delivery* is selected  
- *pickup store* — customer-selected *store* for *click-and-collect* collection  
- *billing address* — required on every *order* regardless of *delivery option*  

### Acceptance criteria  

1. **WHEN** the customer reaches the delivery selection step  
   **THEN** the available *delivery option* choices are *standard delivery* and *click-and-collect*  
   **AND** *standard delivery* shows an estimated delivery window and shipping cost  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "delivery options (standard, express, maybe same-day for local)"; ubiquitous-language.md — Increment 3 offers *standard delivery* and *click-and-collect*; thin-slicing.md — Increment 3, standard delivery only  

2. **WHEN** the customer selects *standard delivery*  
   **THEN** the *shipping address* entered in the prior step is confirmed as the delivery destination  
   **AND** shipping cost is recorded on the *order*  
   **AND** the checkout advances to *payment*  
   **Evidence:** ubiquitous-language.md — *standard delivery* confirms *shipping address* and triggers *ship-to-home fulfillment* after *payment confirmation*  

3. **WHEN** the customer switches from *standard delivery* to *click-and-collect* (or vice versa) during checkout  
   **THEN** the relevant address steps adjust: *click-and-collect* drops the *shipping address* requirement and shows the *pickup store* selector; *standard delivery* requires the *shipping address* form  
   **BUT** the *billing address* is always required regardless of *delivery option*  
   **Evidence:** ubiquitous-language.md — *delivery option* determines whether *shipping address* or *pickup store* is required; *click-and-collect* invariant  

4. **WHEN** express or same-day *delivery option* variants are not yet available (deferred per thin slicing)  
   **THEN** they do not appear in the selection — the customer sees only *standard delivery* and *click-and-collect*  
   **BUT** the UI is structured to accommodate additional options in future increments without redesign  
   **Evidence:** thin-slicing.md — Increment 3, "Standard delivery only — defer express and same-day"; ubiquitous-language.md — express and same-day deferred  

---  

## Story: View and Process Incoming Orders  

**Story type:** store employee  

### Domain terms  

- *order queue* — unified staff view on the *admin dashboard* of confirmed *order* across *standard delivery* and *click-and-collect*  
- *store employee* — front-line staff processing fulfillment  
- *standard delivery* — ship-to-home *delivery option* whose *order* require *ship-to-home fulfillment*  
- *shipping address* — destination shown when packing a ship-to-home *order*  
- *ship-to-home fulfillment* — store-side packing and dispatch workflow for *standard delivery* *order*  
- *tracking number* — carrier reference entered at fulfillment time  
- *guest email* — customer contact on guest *order* shown on the queue  

### Acceptance criteria  

1. **WHEN** the *store employee* opens the *order queue* on the *admin dashboard*  
   **THEN** they see all confirmed *order* across *standard delivery* and *click-and-collect*  
   **AND** each *order* shows: *order* number, *order line item* details, delivery type label, and customer name or *guest email*  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard... handle order fulfilment"; ubiquitous-language.md — *order queue*  

2. **WHEN** the *store employee* selects a ship-to-home *order* (*standard delivery*) from the *order queue*  
   **THEN** the order detail shows the *shipping address*, *order line item* to pack, and any special notes  
   **AND** a "Mark as Fulfilled" action is displayed on the order detail  
   **Evidence:** ubiquitous-language.md — *ship-to-home fulfillment* shows *shipping address* and items to pack; *order* ship-to-home lifecycle: confirmed → fulfilled → shipped → delivered  

3. **WHEN** the *store employee* marks a ship-to-home *order* as fulfilled through *ship-to-home fulfillment*  
   **THEN** the system prompts for a *tracking number* (manual entry in Increment 3)  
   **AND** entering the *tracking number* triggers the *shipping notification* (see *Send Shipping Notification with Tracking Number*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers"; ubiquitous-language.md — *tracking number* at *ship-to-home fulfillment* time  

4. **WHEN** the *store employee* marks a ship-to-home *order* as fulfilled without entering a *tracking number*  
   **THEN** the system warns that the customer will not receive a *shipping notification*  
   **BUT** the *order* can still be marked fulfilled — the *tracking number* is recommended but not blocking in Increment 3  
   **Evidence:** ubiquitous-language.md — *tracking number* recommended but not blocking; manual label creation per thin-slicing.md Increment 3  

---  

## Story: Send Shipping Notification with Tracking Number  

**Story type:** system  

### Domain terms  

- *shipping notification* — transactional email sent when a ship-to-home *order* receives a *tracking number*  
- *tracking number* — carrier reference entered by *store employee* at *ship-to-home fulfillment*  
- *guest email* — recipient address on the *order* from *guest checkout*  
- *order status* — lifecycle state that transitions from fulfilled to shipped when dispatch is confirmed  
- *order status page* — customer-facing link included in the *shipping notification*  

### Acceptance criteria  

1. **WHEN** the *store employee* enters a *tracking number* and confirms *ship-to-home fulfillment* dispatch  
   **THEN** the system sends a *shipping notification* to the *guest email* on the *order*  
   **AND** the notification includes: *order* number, *order line item* shipped, carrier name, *tracking number*, and estimated delivery window  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers. The usual stuff but done well."; ubiquitous-language.md — *shipping notification*  

2. **WHEN** the *shipping notification* is sent  
   **THEN** the *order status* transitions from fulfilled to shipped  
   **Evidence:** ubiquitous-language.md — *tracking number* transitions *order status* from fulfilled to shipped when dispatch is confirmed  

3. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the *shipping notification* is queued for retry  
   **AND** the *order status* still transitions to shipped (email failure does not block fulfillment)  
   **BUT** the customer may not receive the notification immediately — a retry window applies  
   **Evidence:** ubiquitous-language.md — *shipping notification* invariant: must not block *order status* transition when delivery fails; same resilience pattern as *confirmation email*  

4. **WHEN** the *store employee* did not enter a *tracking number* at fulfillment (see *View and Process Incoming Orders* AC 4)  
   **THEN** no *shipping notification* is sent automatically  
   **AND** the order detail provides an "Add Tracking Number" field so the notification fires when the *store employee* enters a *tracking number* later  
   **Evidence:** ubiquitous-language.md — *shipping notification* does not fire without a *tracking number*; staff may add tracking later  

---  

## Story: Track Order Status  

**Story type:** user  

### Domain terms  

- *order status page* — customer-facing surface showing current *order status* and delivery or tracking details  
- *order status* — lifecycle state visible to customer and staff (confirmed, fulfilled, shipped, delivered on ship-to-home paths)  
- *tracking number* — carrier reference with external carrier link when *order status* is shipped or delivered  
- *guest email* — used with *order* number for guest lookup (no account)  
- *confirmation email* — includes link to *order status page*  
- *shipping notification* — includes link to *order status page* with carrier tracking details  

### Acceptance criteria  

1. **WHEN** a guest customer follows the *order* link in their *confirmation email* or *shipping notification*  
   **THEN** the *order status page* shows the current *order status*, itemized *order line item* contents, and delivery details  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "Order confirmation page, confirmation email, shipping notifications with tracking numbers"; ubiquitous-language.md — *order status page*  

2. **WHEN** the *order* has a *tracking number*  
   **THEN** the *order status page* displays the *tracking number* and links to the carrier's tracking page  
   **AND** the shipment date and estimated delivery date are displayed  
   **Evidence:** ubiquitous-language.md — *order status page* displays *tracking number* with carrier link when *order status* is shipped or delivered  

3. **WHEN** the guest customer enters their *order* number and *guest email* on a lookup page  
   **THEN** the system retrieves and displays the matching *order status page*  
   **BUT** the lookup fails with a clear error if the *guest email* does not match the *order* — no *order* details leak to unrelated emails  
   **Evidence:** ubiquitous-language.md — *order status page* invariant: guest lookup must match both *order* number and *guest email*  

4. **WHEN** the *order* has not yet shipped (*order status* is confirmed or fulfilled)  
   **THEN** the *order status page* shows the current state without a *tracking number*  
   **AND** the page indicates that tracking will be available once the *order* ships  
   **Evidence:** ubiquitous-language.md — *order status page* indicates tracking will be available once the *order* ships when *order status* is confirmed or fulfilled  

5. **WHEN** the *order status* changes (e.g. from shipped to delivered)  
   **THEN** the *order status page* reflects the updated state on the customer's next visit  
   **BUT** no push notification is sent for status changes in Increment 3 — the customer must check the page or wait for the *shipping notification*  
   **Evidence:** ubiquitous-language.md — *order status* updates without push notification for intermediate changes in Increment 3; thin-slicing.md — minimal notification infrastructure in Increment 3

## Increment 4: Returning customers — accounts, history, reorder

---
state: acceptance-criteria
increment_scope: Increment 4 — Returning customers
exploration_refresh: Run 5 slot 95
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 93)
---

**Increment outcome:** Customers can register, log in, save addresses and payment methods, see their *order history*, manage a *wishlist*, and one-click *reorder*. Account creation is prompted during *guest checkout*. Lifts repeat-purchase rate without changing the buy flow.

**Builds on:** Increments 1–3 (*store*, *product catalog*, *shopping cart*, *guest checkout*, *StripeWave*, *click-and-collect*, *standard delivery*, *order* lifecycle, *confirmation email*, *shipping notification*).

**UL alignment:** Domain terms and AC prose follow Increment 4 refresh in `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 93): *customer account*, *customer session*, *email verification*, *verification link*, *account verification status*, *guest checkout*, *address book*, *saved address*, *default address*, *saved payment method*, *default payment method*, *order history*, *reorder*, *wishlist*, *wishlist item*, *shopping cart*, *stock availability*.

**Scope guard:** *Guest checkout* and Increment 1–3 paths remain valid. Account features are additive — registration, login, and saved entities coexist with guest purchase. Email + password only (no social login). *StripeWave* sole active *payment vendor*. *Customer pet* CRUD, *communication preferences* UI, PayNova/VaultPay, express/same-day delivery, and *return* deferred.

---

## Story: Register Account

**Story type:** user

### Domain terms

- *customer account* — persistent identity created via email and password registration
- *account verification status* — unverified until *email verification* completes
- *email verification* — mandatory confirmation process triggered after registration

### Acceptance criteria

1. **WHEN** the customer opens the registration screen
   **THEN** the form collects email address and password (with confirmation)
   **AND** password requirements are shown clearly before submission
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "registration, login, logout, password reset, email verification"; ubiquitous-language.md — *customer account* registers via email and password

2. **WHEN** the customer submits valid registration details
   **THEN** a *customer account* is created with *account verification status* unverified
   **AND** the system triggers *Send Email Verification*
   **AND** the customer sees a "check your email to verify" confirmation screen
   **Evidence:** ubiquitous-language.md — *customer account* creates unverified status until *email verification* completes; thin-slicing.md — Increment 4, *email verification* mandatory

3. **WHEN** the customer submits an email already registered to another *customer account*
   **THEN** the form shows an error stating the email is already in use
   **AND** a "Log In instead" link is displayed
   **BUT** the error does not reveal whether the existing *account verification status* is verified or unverified
   **Evidence:** ubiquitous-language.md — *customer account* invariant: unique verified email before account-only features unlock

4. **WHEN** the customer submits a password that does not meet requirements
   **THEN** the form shows which requirements are unmet
   **BUT** no *customer account* is created until all requirements pass
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "Nothing exotic, just solid and reliable"

---

## Story: Send Email Verification

**Story type:** system

### Domain terms

- *email verification* — confirmation process that sends a *verification link* to the registered email
- *verification link* — unique, time-limited, one-time-use link in the verification email
- *customer account* — the account awaiting verification

### Acceptance criteria

1. **WHEN** a *customer account* is created (registration or guest-to-account conversion)
   **THEN** the system sends *email verification* to the registered email address
   **AND** the email contains a *verification link* that is unique and time-limited
   **Evidence:** ubiquitous-language.md — *email verification* sends *verification link* when account is created or resend is requested

2. **WHEN** the *verification link* expires (for example after 24 hours)
   **THEN** clicking the link shows a clear "link expired" message
   **AND** a "resend verification" action is offered
   **Evidence:** ubiquitous-language.md — *verification link* expires after configured window and offers resend when expired

3. **WHEN** email delivery is temporarily unavailable
   **THEN** the verification email is queued for retry
   **AND** the registration confirmation screen tells the customer to expect the email shortly
   **Evidence:** ubiquitous-language.md — *email verification* queues for retry when delivery unavailable

---

## Story: Verify Email Address

**Story type:** user

### Domain terms

- *verification link* — link from the verification email
- *account verification status* — transitions to verified after successful confirmation
- *customer account* — the account being verified

### Acceptance criteria

1. **WHEN** the customer clicks a valid, non-expired *verification link*
   **THEN** the *customer account* *account verification status* becomes verified
   **AND** the customer is redirected to a "you're verified" confirmation page with a prompt to log in
   **Evidence:** ubiquitous-language.md — *email verification* transitions *account verification status* to verified

2. **WHEN** the customer clicks a *verification link* that has already been used
   **THEN** the system shows an "already verified" message with a login link
   **BUT** the *account verification status* is not modified again
   **Evidence:** ubiquitous-language.md — *verification link* is one-time-use

3. **WHEN** the customer clicks an expired *verification link*
   **THEN** the system shows a "link expired" message with a "resend verification" action
   **Evidence:** ubiquitous-language.md — *verification link* expires and offers resend

---

## Story: Log In

**Story type:** user

### Domain terms

- *customer session* — authenticated context created after successful login
- *customer account* — the identity the customer authenticates into
- *account verification status* — must be verified before *customer session* with account-only access
- *shopping cart* — guest cart merges into account cart on login

### Acceptance criteria

1. **WHEN** the customer submits valid credentials on the login screen
   **THEN** a *customer session* is created
   **AND** the customer is redirected to their previous page or account dashboard
   **Evidence:** ubiquitous-language.md — *customer session* is authenticated context created on successful login

2. **WHEN** the customer submits incorrect credentials
   **THEN** the login screen shows a generic "invalid email or password" error
   **BUT** the error does not specify which field is wrong
   **Evidence:** inferred — credential enumeration prevention; ubiquitous-language.md — authentication on *customer account*

3. **WHEN** the customer attempts to log in with *account verification status* unverified
   **THEN** the system shows a "please verify your email first" message with a "resend verification" option
   **BUT** no *customer session* with account-only feature access is created
   **Evidence:** ubiquitous-language.md — *customer session* invariant: unverified accounts must not receive account-only feature access

4. **WHEN** the customer has an active guest *shopping cart* and then logs in
   **THEN** the guest cart merges into the logged-in *customer account* cart
   **AND** if both carts contain the same *product*, quantities are summed
   **Evidence:** ubiquitous-language.md — *customer session* merges guest *shopping cart* into account cart on login; requirements-chat-with-product-owner.md — line 13, "A shopping cart that persists"

---

## Story: Log Out

**Story type:** user

### Domain terms

- *customer session* — authenticated context terminated on logout
- *customer account* — the logged-in identity

### Acceptance criteria

1. **WHEN** the customer selects "Log Out"
   **THEN** the current *customer session* is invalidated
   **AND** the customer is redirected to the home page in a guest state
   **Evidence:** ubiquitous-language.md — *customer account* authenticates via login and logout

2. **WHEN** the customer logs out on one device
   **THEN** only the *customer session* on that device is invalidated
   **AND** *customer session* on other devices remain active
   **AND** a "Log out everywhere" option invalidates all sessions across devices when selected
   **Evidence:** ubiquitous-language.md — *customer session* allows multiple concurrent sessions; invalidates on logout for current device; supports "log out everywhere"

---

## Story: Reset Password

**Story type:** user

### Domain terms

- *customer account* — the account whose password is being reset
- *customer session* — all sessions invalidated after password change
- password reset — recovery flow when the customer has forgotten their password

### Acceptance criteria

1. **WHEN** the customer requests password reset by entering their email
   **THEN** the system sends a reset link to that email if the *customer account* exists
   **AND** the same "check your email" message is shown regardless of whether the account exists
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "password reset"; ubiquitous-language.md — *customer account* supports password reset

2. **WHEN** the customer clicks a valid, non-expired reset link
   **THEN** they are taken to a "set new password" form
   **AND** the new password must meet the same requirements as registration
   **Evidence:** inferred — standard password reset flow aligned to registration requirements

3. **WHEN** the customer submits a new password
   **THEN** the password is updated and all *customer session* on all devices are invalidated
   **AND** the customer must log in again on each device
   **Evidence:** ubiquitous-language.md — *customer account* supports password reset with session invalidation on password change

4. **WHEN** the reset link has expired or been used
   **THEN** the customer sees a clear "link expired" message with a "Request new reset" action
   **Evidence:** inferred — time-limited, one-time-use reset link

---

## Story: Maintain Session Across Devices

**Story type:** system

### Domain terms

- *customer session* — authenticated context associating a browser or device with a *customer account*
- *shopping cart* — tied to the *customer account*, not the session, when logged in

### Acceptance criteria

1. **WHEN** the customer logs in on a new device
   **THEN** a new *customer session* is created for that device
   **AND** existing *customer session* on other devices remain active
   **Evidence:** ubiquitous-language.md — *customer session* allows multiple concurrent sessions per *customer account*

2. **WHEN** the *customer session* expires from inactivity timeout or max duration
   **THEN** the customer is redirected to the login screen
   **AND** *shopping cart* changes are preserved because the cart is tied to the *customer account*, not the session
   **Evidence:** ubiquitous-language.md — *customer session* persists until logout, inactivity timeout, or password reset; *shopping cart* persists across devices for logged-in customers

3. **WHEN** the customer changes their password via *Reset Password*
   **THEN** all *customer session* on all devices are invalidated
   **AND** the customer must re-authenticate on each device
   **Evidence:** ubiquitous-language.md — *customer session* invalidates on password reset

---

## Story: Save Delivery Address

**Story type:** user

### Domain terms

- *saved address* — shipping or billing address stored in the *address book* for reuse
- *address book* — collection of *saved address* on a *customer account*
- *default address* — first saved address becomes default automatically

### Acceptance criteria

1. **WHEN** a logged-in customer completes checkout with a new shipping address
   **THEN** the system offers a "save this address for future orders" option
   **AND** if accepted, the address is stored in the *address book*
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "saved addresses"; ubiquitous-language.md — *address book* accepts new entries from checkout

2. **WHEN** the customer saves the first *saved address*
   **THEN** that address is automatically assigned as the *default address*
   **Evidence:** ubiquitous-language.md — *default address* is assigned automatically to the first *saved address*

3. **WHEN** the customer already has entries in the *address book*
   **THEN** the new *saved address* is added without replacing existing ones
   **AND** account settings *address book* shows the new entry with a "set as default" option (see *Manage Saved Addresses*)
   **Evidence:** ubiquitous-language.md — *saved address* allows multiple entries; *address book* aggregates all *saved address*

---

## Story: Manage Saved Addresses

**Story type:** user

### Domain terms

- *address book* — list of all *saved address* under the *customer account*
- *saved address* — individual address entry
- *default address* — pre-selected at checkout unless overridden

### Acceptance criteria

1. **WHEN** the customer opens the *address book* from account settings
   **THEN** all *saved address* are listed with full details
   **AND** the *default address* is visually indicated
   **Evidence:** ubiquitous-language.md — *address book* aggregates *saved address*; *default address* pre-selected at checkout

2. **WHEN** the customer edits a *saved address*
   **THEN** the changes are persisted
   **AND** future checkouts using that address reflect the updated details
   **Evidence:** ubiquitous-language.md — *saved address* supports edit from account settings

3. **WHEN** the customer deletes a *saved address*
   **THEN** the address is removed from the *address book*
   **BUT** if the deleted address was the *default address*, the customer is prompted to select a new default (or the most recently added becomes default)
   **Evidence:** ubiquitous-language.md — *saved address* invariant: deleting *default address* requires selecting a new default when other *saved address* remain

4. **WHEN** the customer sets a different *saved address* as *default address*
   **THEN** the previous default is demoted
   **AND** the new default is pre-selected during future checkouts
   **Evidence:** ubiquitous-language.md — *default address* may be changed in account settings

---

## Story: Save Payment Method

**Story type:** user

### Domain terms

- *saved payment method* — tokenized payment credential stored on the *customer account*
- *StripeWave* — sole active *payment vendor* in Increment 4; tokenizes card credentials
- *default payment method* — first saved method becomes default unless changed

### Acceptance criteria

1. **WHEN** a logged-in customer completes payment during checkout
   **THEN** the system offers a "save this payment method for future orders" option
   **AND** if accepted, a vendor token from *StripeWave* is stored — never the raw card number
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "saved payment methods"; ubiquitous-language.md — *saved payment method* stores only vendor tokens

2. **WHEN** the customer saves a payment method
   **THEN** the *customer account* stores last four digits, card type, and expiry for display
   **AND** the vendor token is used in future transactions — no re-entry of full card details
   **Evidence:** ubiquitous-language.md — *StripeWave* tokenizes card credentials; *saved payment method* stores vendor tokens only

3. **WHEN** the customer saves a second *saved payment method*
   **THEN** both are listed in account settings (see *Manage Saved Payment Methods*)
   **AND** the first saved method remains the *default payment method* unless the customer changes it
   **Evidence:** ubiquitous-language.md — *default payment method* pre-selected at checkout

---

## Story: Manage Saved Payment Methods

**Story type:** user

### Domain terms

- *saved payment method* — tokenized payment credential under the *customer account*
- *default payment method* — pre-selected at the payment step for logged-in customers

### Acceptance criteria

1. **WHEN** the customer opens saved payment methods from account settings
   **THEN** all *saved payment method* are shown with last four digits, card type, and expiry
   **AND** the *default payment method* is visually indicated
   **Evidence:** ubiquitous-language.md — *saved payment method* lifecycle on *customer account*

2. **WHEN** the customer removes a *saved payment method*
   **THEN** the vendor token is deleted and the method no longer appears at checkout
   **BUT** if the removed method was the *default payment method*, the customer is prompted to select a new default
   **Evidence:** ubiquitous-language.md — *saved payment method* associated with *customer account*

3. **WHEN** the customer sets a different *saved payment method* as *default payment method*
   **THEN** the previous default is demoted
   **AND** the new default is pre-selected during future checkouts
   **Evidence:** ubiquitous-language.md — *default payment method* pre-selected at payment step

---

## Story: Select Saved Address at Checkout

**Story type:** user

### Domain terms

- *saved address* — entry from the *address book* selectable at checkout
- *default address* — pre-selected on the shipping step
- *guest checkout* — guest path shows manual address entry only, no *address book*

### Acceptance criteria

1. **WHEN** a logged-in customer reaches the shipping step during checkout
   **THEN** all *saved address* from the *address book* are shown for selection
   **AND** the *default address* is pre-selected
   **Evidence:** ubiquitous-language.md — *saved address* pre-fills checkout shipping step when selected; *default address* pre-selected

2. **WHEN** the customer selects a *saved address*
   **THEN** the shipping address fields are auto-filled with that address
   **AND** checkout advances to the next step without manual entry
   **Evidence:** ubiquitous-language.md — *saved address* pre-fills checkout shipping step

3. **WHEN** the customer chooses to use a new address not in the *address book*
   **THEN** a "use a different address" option reveals manual address entry
   **AND** a "save this address" checkbox adds the new address to the *address book* when checked (see *Save Delivery Address*)
   **Evidence:** ubiquitous-language.md — *address book* accepts new entries from checkout

4. **WHEN** a guest customer (not logged in) reaches the shipping step
   **THEN** no *address book* selection is shown — only manual address entry
   **AND** a prompt to log in or register mentions the benefit of *saved address*
   **BUT** *guest checkout* proceeds without requiring an account
   **Evidence:** ubiquitous-language.md — *guest checkout* remains available alongside logged-in checkout; Increment 1–3 shipping paths preserved

---

## Story: Select Saved Payment Method at Checkout

**Story type:** user

### Domain terms

- *saved payment method* — tokenized credential selectable at the payment step
- *default payment method* — pre-selected for logged-in customers
- *StripeWave* — processes payment via stored token or new card entry

### Acceptance criteria

1. **WHEN** a logged-in customer reaches the payment step during checkout
   **THEN** all *saved payment method* are shown for selection
   **AND** the *default payment method* is pre-selected
   **Evidence:** ubiquitous-language.md — *saved payment method* selection at checkout for logged-in *customer account*

2. **WHEN** the customer selects a *saved payment method*
   **THEN** payment proceeds using the stored vendor token — no card re-entry required
   **AND** last four digits and card type are shown for confirmation
   **Evidence:** ubiquitous-language.md — *StripeWave* receives *saved payment method* token and returns *payment confirmation*

3. **WHEN** the customer chooses to use a new payment method not yet saved
   **THEN** a "use a different payment method" option reveals manual card entry
   **AND** a "save this payment method" checkbox stores the new method when checked (see *Save Payment Method*)
   **Evidence:** ubiquitous-language.md — *StripeWave* tokenizes card credentials for *saved payment method* storage

4. **WHEN** a saved vendor token has expired or been revoked
   **THEN** that *saved payment method* is marked expired or removed from the list
   **AND** remaining valid methods and manual entry are displayed as alternatives
   **BUT** the expired token is never silently used for a charge attempt
   **Evidence:** inferred — token lifecycle management; ubiquitous-language.md — *saved payment method* stores vendor tokens only

---

## Story: View Order History

**Story type:** user

### Domain terms

- *order history* — chronicle of past *order* associated with a *customer account*
- *order status* — current lifecycle state shown per *order*
- *guest checkout* — prior guest *order* retroactively linked when email matches

### Acceptance criteria

1. **WHEN** a logged-in customer opens *order history*
   **THEN** all *order* associated with the *customer account* are listed, most recent first
   **AND** each row shows order number, date, items (condensed), total, and current *order status*
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "order history"; ubiquitous-language.md — *order history* lists past *order* most recent first

2. **WHEN** the customer selects an *order* from the list
   **THEN** full order detail opens: all items, quantities, shipping and billing address snapshots, *delivery option*, masked payment method, and *tracking number* (if shipped)
   **Evidence:** ubiquitous-language.md — *order history* shows *order status*, items, total, and date per *order*

3. **WHEN** the customer has no *order* yet
   **THEN** *order history* shows an empty state with a prompt to start shopping
   **Evidence:** inferred — empty state handling

4. **WHEN** a *guest checkout* *order* was placed before the customer registered with the same email
   **THEN** the guest *order* is retroactively associated with the new *customer account*
   **AND** the *order* appears in *order history*
   **Evidence:** ubiquitous-language.md — *customer account* retroactively associates prior *guest checkout* *order* placed with the same email

---

## Story: Manage Wishlist

**Story type:** user

### Domain terms

- *wishlist* — customer-curated list of *product* requiring logged-in verified *customer account*
- *wishlist item* — single *product* entry on the *wishlist*
- *stock availability* — current availability shown per *wishlist item*

### Acceptance criteria

1. **WHEN** a logged-in customer selects "Add to Wishlist" on a product details page
   **THEN** the *product* is added to the *wishlist*
   **AND** the "Add to Wishlist" control changes to a "Remove from Wishlist" state
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "Wishlists — let customers save things for later"; ubiquitous-language.md — *wishlist* persists on *customer account*

2. **WHEN** the customer opens their *wishlist*
   **THEN** all *wishlist item* are shown with product name, image, price, and current *stock availability*
   **Evidence:** ubiquitous-language.md — *wishlist item* shows current catalog price and *stock availability*

3. **WHEN** the customer selects "Add to Cart" from a *wishlist item*
   **THEN** the *product* is added to the *shopping cart*
   **BUT** the *product* remains on the *wishlist* until explicitly removed
   **Evidence:** ubiquitous-language.md — *wishlist item* adds to *shopping cart* without removing itself

4. **WHEN** the customer removes a *wishlist item*
   **THEN** the *product* is removed from the *wishlist*
   **AND** the "Add to Wishlist" control on that product's details page returns to its default state
   **Evidence:** ubiquitous-language.md — *wishlist item* lifecycle on *wishlist*

5. **WHEN** a guest customer tries to add to *wishlist*
   **THEN** a prompt to log in or register is shown, explaining that *wishlist* requires a verified *customer account*
   **BUT** the product page is not navigated away from — the prompt is dismissible and browsing continues
   **Evidence:** ubiquitous-language.md — *wishlist* requires logged-in verified *customer account*; guest customers see login prompt

---

## Story: Reorder Previous Purchase

**Story type:** user

### Domain terms

- *reorder* — action adding all *order line item* from a past *order* into the *shopping cart*
- *order history* — source list for *reorder*
- *stock availability* — delisted or out-of-stock products handled during *reorder*

### Acceptance criteria

1. **WHEN** the customer selects "Reorder" on a past *order* in *order history*
   **THEN** all *product* from that *order* are added to the *shopping cart* with their original quantities
   **AND** the customer is taken to the cart to review before checkout
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "reorder functionality"; ubiquitous-language.md — *reorder* adds all *order line item* with original quantities

2. **WHEN** a *product* from the original *order* is no longer available (delisted)
   **THEN** available *product* are added to the *shopping cart*
   **AND** a clear message lists which *product* could not be added and why
   **BUT** partial *reorder* succeeds — available items are not blocked
   **Evidence:** ubiquitous-language.md — *reorder* skips delisted *product* with clear message; partial *reorder* succeeds

3. **WHEN** a *product* from the original *order* is currently out of stock
   **THEN** the *product* is added to the *shopping cart* with a *stock availability* warning
   **AND** "proceed anyway" and "remove" options are shown on that line item
   **Evidence:** ubiquitous-language.md — *stock availability* at display time; inferred — out-of-stock handling on *reorder*

4. **WHEN** the customer already has items in the *shopping cart* and reorders
   **THEN** reordered *product* merge into the existing cart
   **AND** if both contain the same *product*, quantities are summed
   **Evidence:** ubiquitous-language.md — *customer session* cart merge logic applies to *reorder* additions

## Increment 5: Pay your way — multi-vendor payment with retries

---
state: acceptance-criteria
increment_scope: Increment 5 — Pay your way
exploration_refresh: Run 6 slot 121
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 119)
---

**Increment outcome:** Customers can pay with *PayNova* (*digital wallet*) and *VaultPay* (*buy-now-pay-later*) in addition to *StripeWave*. Failed *payment* retries automatically across all three *payment vendor* options. Lifts conversion among younger buyers and basket-size on premium items.

**Builds on:** Increments 1–4 (*store*, *product catalog*, *shopping cart*, *guest checkout*, *StripeWave*, *click-and-collect*, *standard delivery*, *order* lifecycle, *confirmation email*, *shipping notification*, *customer account*, *saved payment method*, *saved address*).

**UL alignment:** Domain terms and AC prose follow Increment 5 refresh in `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 119): *payment method selector*, *PayNova*, *VaultPay*, *digital wallet*, *buy-now-pay-later*, *eligibility check*, *instalment plan*, *vendor transaction reference*, *transient error*, *hard decline*, *payment retry*, *retry window*, *webhook callback*, *payment confirmation*, *saved payment method*, *refund* routing foundation.

**Scope guard:** *Guest checkout* and Increment 1–4 paths remain valid. *StripeWave* card flow unchanged in behavior — *payment method selector* now presents all three vendors. *Refund* routing rules established here; full *return* customer flow deferred to Increment 7. *Pet*, *Appointment*, express/same-day delivery, and *customer pet* CRUD deferred.

---

## Story: Process Digital Wallet Payment via PayNova

**Story type:** system

### Domain terms

- *payment method selector* — checkout step presenting *StripeWave*, *PayNova*, *VaultPay*, and *saved payment method*
- *PayNova* — *payment vendor* subtype for *digital wallet* mobile payments
- *digital wallet* — PayNova one-tap mobile wallet payment channel
- *payment* — financial transaction for an *order*
- *payment confirmation* — vendor signal that funds are captured or authorised
- *vendor transaction reference* — PayNova reconciliation identifier stored on the *payment*
- *webhook callback* — asynchronous vendor notification reconciling in-flight *payment*
- *saved payment method* — tokenized PayNova wallet reference on the *customer account*
- *hard decline* — non-retryable PayNova failure such as insufficient wallet balance or locked wallet

### Acceptance criteria

1. **WHEN** the customer selects *PayNova* at the *payment method selector*
   **THEN** the checkout redirects to or embeds the PayNova wallet authentication flow
   **AND** the customer authorises the *payment* using mobile wallet credentials
   **AND** *StripeWave* and *VaultPay* remain selectable if the customer cancels the wallet flow
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "PayNova is the digital wallet option"; ubiquitous-language.md — *PayNova* redirects to wallet authentication at *payment method selector*

2. **WHEN** PayNova returns a successful *payment confirmation*
   **THEN** the *order* status transitions to confirmed
   **AND** the *payment* is recorded with vendor = PayNova and the *vendor transaction reference*
   **AND** the system sends the *confirmation email* and displays the order confirmation page
   **Evidence:** ubiquitous-language.md — *payment confirmation* triggers *order* transition to confirmed and fires *confirmation email*; requirements-chat-with-product-owner.md — line 17, "payment confirmations"

3. **WHEN** PayNova returns a *hard decline* (insufficient wallet balance, wallet locked, etc.)
   **THEN** the customer sees a clear error message with the decline reason (as much as PayNova provides)
   **AND** the *payment method selector* displays options to retry with PayNova, switch to *StripeWave*, or switch to *VaultPay*
   **BUT** no *order* is confirmed and no *confirmation email* is sent
   **Evidence:** ubiquitous-language.md — *hard decline* surfaces decline reason and alternative *payment vendor* options; requirements-chat-with-product-owner.md — line 17, "failed payment retries"

4. **WHEN** the *webhook callback* from PayNova arrives after a timeout on an in-flight *payment*
   **THEN** the system reconciles the callback against the pending *payment*
   **AND** if *payment confirmation* succeeded, the *order* transitions to confirmed and the *confirmation email* fires
   **BUT** if the *payment* failed, the *order* remains unpaid and the customer is notified to retry at the *payment method selector*
   **Evidence:** ubiquitous-language.md — *webhook callback* reconciles in-flight *payment* after timeout; applies uniformly across *StripeWave*, *PayNova*, and *VaultPay*

5. **WHEN** a logged-in customer completes a PayNova *payment*
   **THEN** the checkout offers to save PayNova as a *saved payment method* on the *customer account*
   **AND** only a PayNova vendor token is stored — not wallet secrets
   **Evidence:** ubiquitous-language.md — *saved payment method* supports PayNova wallet tokens; *PayNova* offers save-as-*saved payment method* for logged-in customers

---

## Story: Process Buy-Now-Pay-Later via VaultPay

**Story type:** system

### Domain terms

- *payment method selector* — checkout step presenting card, wallet, BNPL, and *saved payment method*
- *VaultPay* — *payment vendor* subtype for *buy-now-pay-later*
- *buy-now-pay-later* — VaultPay installment payment channel distinct from immediate card or wallet capture
- *eligibility check* — VaultPay per-transaction credit and BNPL assessment
- *instalment plan* — VaultPay-approved payment schedule presented before capture
- *payment* — financial transaction for an *order*
- *payment confirmation* — VaultPay approval and instalment reference on capture
- *vendor transaction reference* — VaultPay reconciliation identifier on the *payment*
- *webhook callback* — asynchronous vendor notification reconciling in-flight *payment*
- *saved payment method* — tokenized VaultPay identity on the *customer account*
- *hard decline* — non-retryable BNPL eligibility or credit failure

### Acceptance criteria

1. **WHEN** the customer selects *VaultPay* at the *payment method selector*
   **THEN** the checkout redirects to or embeds VaultPay's BNPL flow
   **AND** VaultPay performs the *eligibility check* and presents the *instalment plan* to the customer
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "VaultPay is our buy-now-pay-later provider"; ubiquitous-language.md — *VaultPay* performs *eligibility check* and presents *instalment plan*

2. **WHEN** the customer accepts the *instalment plan* and VaultPay returns *payment confirmation*
   **THEN** the *order* status transitions to confirmed
   **AND** the *payment* is recorded with vendor = VaultPay and the *vendor transaction reference* plus instalment reference
   **AND** the system sends the *confirmation email* and displays the order confirmation page
   **Evidence:** ubiquitous-language.md — *instalment plan* carries schedule owned by VaultPay; PawPlace records reference on *payment*

3. **WHEN** VaultPay returns a *hard decline* (eligibility failed, credit check failed, etc.)
   **THEN** the customer sees a clear message that *buy-now-pay-later* is not available for this transaction
   **AND** the *payment method selector* displays *StripeWave* and *PayNova* as alternative options
   **BUT** no *order* is confirmed — the decline is VaultPay's decision, not PawPlace's
   **Evidence:** ubiquitous-language.md — VaultPay declines are VaultPay's decision; PawPlace surfaces unavailability and offers *StripeWave* and *PayNova* alternatives

4. **WHEN** the *webhook callback* from VaultPay arrives after a timeout on an in-flight *payment*
   **THEN** the system reconciles the callback against the pending *payment*
   **AND** if *payment confirmation* succeeded, the *order* transitions to confirmed and the *confirmation email* fires
   **BUT** if the *payment* failed, the *order* remains unpaid and the customer is notified to retry
   **Evidence:** ubiquitous-language.md — *webhook callback* applies uniformly across all *payment vendor* subtypes

5. **WHEN** a logged-in customer completes a VaultPay *payment*
   **THEN** the checkout offers to save VaultPay as a *saved payment method* on the *customer account*
   **AND** future VaultPay checkout pre-fills the customer's VaultPay identity but still requires *eligibility check* per transaction
   **Evidence:** ubiquitous-language.md — *VaultPay* offers save-as-*saved payment method*; pre-fills identity but requires *eligibility check* each transaction

---

## Story: Retry Failed Payment

**Story type:** system

### Domain terms

- *payment* — financial transaction that may fail before *payment confirmation*
- *payment vendor* — *StripeWave*, *PayNova*, or *VaultPay* handling the attempt
- *transient error* — retryable failure such as vendor timeout, HTTP 5xx, or network interruption
- *hard decline* — non-retryable failure such as insufficient funds, fraud flag, or BNPL eligibility failure
- *payment retry* — automatic re-attempt through the same *payment vendor* for *transient error*
- *retry window* — configured time and attempt limit governing automatic retries
- *payment method selector* — checkout surface returned after retry exhaustion with all vendor options
- *order* — purchase confirmed only after successful *payment confirmation*
- *confirmation email* — transactional notification fired on confirmed *order*

### Acceptance criteria

1. **WHEN** a *payment* fails due to a *transient error* (timeout, vendor 5xx, network issue)
   **THEN** the system automatically initiates *payment retry* through the same *payment vendor*
   **AND** the customer sees a "retrying payment" indicator — no manual action required during automatic retries
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "failed payment retries"; ubiquitous-language.md — *transient error* triggers automatic *payment retry* within *retry window*

2. **WHEN** the *payment retry* succeeds
   **THEN** the *order* transitions to confirmed as if the first attempt had succeeded
   **AND** the customer sees the order confirmation page and receives the *confirmation email*
   **Evidence:** ubiquitous-language.md — *payment retry* success confirms the *order* and fires *confirmation email*

3. **WHEN** the *payment retry* fails again within the *retry window*
   **THEN** the system retries up to the configured maximum attempt count
   **AND** after the final retry fails, the customer is notified that the *payment* could not be processed
   **AND** the *payment method selector* displays all vendor options and manual card entry
   **Evidence:** ubiquitous-language.md — *payment retry* runs automatically up to configured maximum within *retry window*; exhaustion returns *payment method selector*

4. **WHEN** a *payment* fails due to a *hard decline* (insufficient funds, card blocked, fraud flag, BNPL eligibility failure)
   **THEN** the system does not automatically initiate *payment retry*
   **AND** the customer is immediately shown the decline reason and offered alternative *payment vendor* options at the *payment method selector*
   **Evidence:** ubiquitous-language.md — *hard decline* must not trigger automatic *payment retry*; *payment retry* invariant: must never retry a *hard decline*

5. **WHEN** a *payment retry* is in progress and the customer navigates away from checkout
   **THEN** the *payment retry* continues in the background
   **AND** if it succeeds, the *order* is confirmed and the *confirmation email* fires
   **BUT** if all retries exhaust within the *retry window*, the *order* remains unpaid and the customer is notified via guest email or account notification
   **Evidence:** ubiquitous-language.md — *payment retry* continues in the background when the customer navigates away

## Increment 6: Pet visits — gallery and in-store appointments

**Increment outcome:** The adoption side goes live. Customers browse the *Pet* gallery, see which *Store* a pet is at and how far away it is, and book an *Appointment* to visit. Store staff see incoming bookings. Pet status (available/adopted) is employee-managed. Appointment booking is **customer-account-only** — guest checkout cannot book.  

**Builds on:** Increments 1-5 (full e-commerce spine, accounts, multi-vendor payments live).  

---  

## Story: `Browse Pets by Species`  

**Story type:** user  

### Domain terms  

- *Pet Gallery* — the browsable collection of pets available at PawPlace stores  
- *Species* — the top-level grouping: dogs, cats, reptiles, small mammals, etc.  
- *Pet Card* — the summary view of a pet in the gallery: photo, name, breed, species, and store location  
- *Pet* — an animal available for adoption at a physical store  

### Acceptance criteria  

1. **WHEN** the customer opens the *Pet Gallery*  
   **THEN** pets are grouped or filterable by *Species*  
   **AND** each *Pet Card* shows the pet's photo, name, breed, species, and which *Store* it is at  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Each pet gets a profile page... browse by species, see which store they're at"  

2. **WHEN** the customer selects a *Species* filter  
   **THEN** only pets of that species are shown  
   **AND** the filter is visually active so the customer knows it is applied  
   **Evidence:** inferred — standard filtering behavior  

3. **WHEN** no pets of the selected *Species* are currently available  
   **THEN** the gallery shows a "no pets available in this category right now" message  
   **BUT** the filter remains active and other species options are visible for selection  
   **Evidence:** inferred — empty state for filtered gallery  

---  

## Story: `View Pet Profile`  

**Story type:** user  

### Domain terms  

- *Pet Profile Page* — the detail view of a single pet  
- *Pet* — an animal available for adoption  
- *Pet Status* — available or adopted  
- *Pet Photo Gallery* — multiple photos of the pet  
- *Temperament Notes* — behavioral description (friendly, shy, energetic, etc.)  

### Acceptance criteria  

1. **WHEN** the customer opens a *Pet Profile Page*  
   **THEN** the page shows: *Pet Photo Gallery*, name, species, breed, age (approximate if unknown), *Temperament Notes*, and the *Store* where the pet is located  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Each pet gets a profile page — photo gallery, basic info (breed, age, temperament)"  

2. **WHEN** the pet's *Pet Status* is *Available*  
   **THEN** the profile shows a "Book a Visit" action linking to the appointment flow  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "People can then book an appointment to visit the pet"  

3. **WHEN** the pet's *Pet Status* is *Adopted*  
   **THEN** the profile shows an "Adopted" badge  
   **AND** the "Book a Visit" action is hidden or disabled  
   **BUT** the profile remains viewable (adopted pets are not deleted from the gallery)  
   **Evidence:** domain-sketch.md — Pet KA, `pet` concept: "status progresses from available to adopted"; invariant: "must always have a status (available or adopted)"  

4. **WHEN** the pet has no *Temperament Notes* yet  
   **THEN** the field is omitted from the profile (not shown as blank)  
   **Evidence:** inferred — optional field handling  

---  

## Story: `View Pet Store Location and Distance`  

**Story type:** user  

### Domain terms  

- *Pet Profile Page* — the detail view where the pet's store is shown  
- *Store* — the physical location where the pet is housed  
- *Distance* — the calculated distance from the customer's location to the pet's store (reuses Increment 1's distance logic)  
- *Customer Location* — browser location or entered postcode  

### Acceptance criteria  

1. **WHEN** the customer views a *Pet Profile Page*  
   **THEN** the pet's *Store* is shown with name, address, and operating hours  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "see which store they're at and how far away"  

2. **WHEN** the customer has shared their location or entered a postcode (from Increment 1)  
   **THEN** the *Distance* from *Customer Location* to the pet's *Store* is displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "how far away"  

3. **WHEN** the customer has not shared location  
   **THEN** no *Distance* is shown  
   **AND** a prompt to share location or enter postcode is displayed  
   **Evidence:** inferred — distance requires a reference point (same pattern as Increment 1)  

4. **WHEN** the customer selects the *Store* name or address on the *Pet Profile Page*  
   **THEN** the *Store Detail* page opens (the same store detail from Increment 1)  
   **Evidence:** inferred — store detail is a shared component  

---  

## Story: `View Available Time Slots at Store`  

**Story type:** user  

### Domain terms  

- *Time Slot* — a bookable window for a pet visit at a store  
- *Available Time Slots* — slots not yet booked (open for reservation)  
- *Store* — the physical location offering appointments  
- *Appointment Calendar* — the UI surface showing available dates and times  

### Acceptance criteria  

1. **WHEN** the customer initiates the appointment booking flow from a pet profile  
   **THEN** the *Appointment Calendar* shows *Available Time Slots* at the pet's *Store*  
   **AND** slots are shown for the next N days (configurable by store, e.g. 14 or 30 days)  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "book an appointment to visit the pet in-store. They'd pick a date and time slot"  

2. **WHEN** a *Time Slot* is already booked by another customer  
   **THEN** that slot does not appear in the *Available Time Slots* list  
   **Evidence:** domain-sketch.md — Pet KA, `time slot` concept: "represents a bookable window at a store for a pet visit"  

3. **WHEN** no *Time Slots* are available within the displayed date range  
   **THEN** the *Appointment Calendar* shows a "no slots available — try a later date" message  
   **Evidence:** inferred — empty state for calendar  

---  

## Story: `Select Date and Time Slot`  

**Story type:** user  

### Domain terms  

- *Selected Slot* — the specific time slot the customer picks for their visit  
- *Appointment Calendar* — the booking surface  
- *Time Slot* — a bookable window  

### Acceptance criteria  

1. **WHEN** the customer selects a *Time Slot* from the *Appointment Calendar*  
   **THEN** the *Selected Slot* is highlighted and held temporarily (e.g. 10 minutes) to prevent double-booking during the booking flow  
   **AND** the customer proceeds to the confirmation step  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "pick a date and time slot"  

2. **WHEN** the temporary hold expires before the customer confirms  
   **THEN** the *Selected Slot* is released back to the *Available Time Slots*  
   **AND** the customer is notified that the slot is no longer held and must re-select  
   **Evidence:** inferred — temporary hold to prevent double-booking without permanent reservation  

3. **WHEN** two customers select the same *Time Slot* simultaneously  
   **THEN** only the first to confirm gets the booking  
   **AND** the second customer is notified that the slot is no longer available and must pick another  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` invariant: "must not overlap with another appointment at the same store for the same time slot"  

---  

## Story: `Add Visit Note`  

**Story type:** user  

### Domain terms  

- *Visit Note* — an optional free-text note the customer attaches to the appointment (e.g. "bringing my kids", "interested in adoption paperwork")  
- *Appointment* — the booking being annotated  

### Acceptance criteria  

1. **WHEN** the customer is in the appointment confirmation step  
   **THEN** an optional *Visit Note* field is available  
   **AND** the field accepts up to a character limit (e.g. 500 characters)  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "add a note for the visit"  

2. **WHEN** the customer leaves the *Visit Note* blank  
   **THEN** the appointment proceeds without a note  
   **AND** the staff view shows no note (not "empty" or "N/A")  
   **Evidence:** inferred — optional field handling  

3. **WHEN** the customer submits a *Visit Note* that exceeds the character limit  
   **THEN** the form shows a validation error  
   **BUT** the appointment is not submitted until the note is within limits  
   **Evidence:** inferred — standard text field validation  

---  

## Story: `Confirm Appointment Booking`  

**Story type:** user  

### Domain terms  

- *Appointment Booking* — the confirmed reservation for a pet visit  
- *Customer Account* — required for booking (account-gated per domain decision)  
- *Appointment Confirmation Page* — the on-screen acknowledgment  
- *Appointment Confirmation Email* — sent to the customer's verified email  

### Acceptance criteria  

1. **WHEN** a logged-in customer confirms the appointment  
   **THEN** the *Appointment Booking* is created with: pet, store, date/time, and optional visit note  
   **AND** the customer sees the *Appointment Confirmation Page*  
   **AND** an *Appointment Confirmation Email* is sent to the customer's email  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "book an appointment to visit the pet in-store"  

2. **WHEN** a guest (not logged in) attempts to confirm an appointment  
   **THEN** the system blocks the booking and prompts the customer to log in or register  
   **AND** explains that appointments require a customer account  
   **BUT** the selected slot remains temporarily held so the customer doesn't lose it  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` concept: "booked by exactly one customer account"; thin-slicing.md — Increment 6 slicing notes: "appointment booking is customer-account-only"  

3. **WHEN** the booking is confirmed  
   **THEN** the *Time Slot* transitions from available to booked  
   **AND** the slot is no longer shown to other customers  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` invariant: "must not overlap with another appointment at the same store for the same time slot"  

4. **WHEN** the confirmation email fails to send  
   **THEN** the booking is still created (email is not a gate)  
   **AND** the email is queued for retry  
   **Evidence:** inferred — same email resilience pattern as order confirmation  

---  

## Story: `View Upcoming and Past Appointments`  

**Story type:** user  

### Domain terms  

- *Appointment List* — the customer's view of all their appointments  
- *Upcoming Appointment* — a booking with a future date/time  
- *Past Appointment* — a booking whose date/time has passed  
- *Customer Account* — appointments are tied to the logged-in customer  

### Acceptance criteria  

1. **WHEN** the customer opens their *Appointment List* from the account area  
   **THEN** upcoming appointments are shown first (soonest at top), followed by past appointments  
   **AND** each entry shows: pet name, pet photo, store, date/time, and visit note (if any)  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "view upcoming and past appointments"  

2. **WHEN** the customer has no appointments  
   **THEN** the list shows an empty state with a prompt to browse the *Pet Gallery*  
   **Evidence:** inferred — empty state handling  

3. **WHEN** an upcoming appointment's pet has been marked as *Adopted* (see *Mark Pet as Adopted*)  
   **THEN** the appointment entry shows a "pet adopted" badge  
   **AND** "Cancel" and "Browse other pets" actions are shown on the entry (see *Cancel or Rebook Appointment After Pet Adoption*)  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision  

---  

## Story: `Cancel or Rebook Appointment After Pet Adoption`  

**Story type:** user  

### Domain terms  

- *Appointment Cancellation* — the customer-initiated removal of a booked appointment  
- *Rebook* — scheduling a new appointment (different pet or different date) after cancellation  
- *Pet Adopted Before Visit* — the scenario where the pet was adopted by someone else before the customer's visit  

### Acceptance criteria  

1. **WHEN** the customer receives a *Pet Adopted Before Visit Notification* (see that story)  
   **THEN** the notification includes options to cancel the appointment or browse other available pets to rebook  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision: "notify the customer; let them cancel or rebook"  

2. **WHEN** the customer cancels the appointment  
   **THEN** the *Time Slot* is released back to available  
   **AND** the appointment moves to *Cancelled* status in the *Appointment List*  
   **Evidence:** inferred — cancellation releases the slot  

3. **WHEN** the customer chooses to rebook  
   **THEN** the system navigates to the *Pet Gallery* with available pets displayed for a new booking  
   **AND** the original cancelled appointment remains in the *Past Appointments* section  
   **Evidence:** inferred — rebook is a new booking flow, not a slot swap  

4. **WHEN** the customer neither cancels nor rebooks before the appointment date  
   **THEN** the appointment remains in the system but staff see a "pet adopted" warning on their incoming appointments view  
   **AND** the appointment is treated as a no-show after the date passes  
   **Evidence:** inferred — system does not auto-cancel; staff handle edge case  

---  

## Story: `Update Pet Profile`  

**Story type:** store employee  

### Domain terms  

- *Pet Profile* — the employee-managed data about a pet (photos, breed, age, temperament, status)  
- *Store Employee* — the front-line staff member who maintains pet profiles  
- *Pet Photo Gallery* — the set of photos displayed on the pet's profile page  

### Acceptance criteria  

1. **WHEN** *Store Employee* opens a *Pet Profile* for editing  
   **THEN** all fields are editable: name, species, breed, age, *Temperament Notes*, *Pet Photo Gallery*, and the store the pet is located at  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Each pet gets a profile page — photo gallery, basic info (breed, age, temperament)"  

2. **WHEN** *Store Employee* saves changes to a *Pet Profile*  
   **THEN** the customer-facing *Pet Profile Page* reflects the changes immediately  
   **Evidence:** inferred — admin changes are live on the customer side  

3. **WHEN** *Store Employee* uploads new photos to the *Pet Photo Gallery*  
   **THEN** the photos are added to the gallery  
   **AND** existing photos are not replaced unless explicitly removed  
   **Evidence:** inferred — additive photo management  

4. **WHEN** *Store Employee* changes the store a pet is located at (pet transferred between stores)  
   **THEN** the *Pet Profile Page* shows the new store  
   **AND** any existing appointments for that pet at the old store show a store-change notification to the customer  
   **Evidence:** inferred — pet relocation affects booked appointments  

---  

## Story: `Mark Pet as Adopted`  

**Story type:** store employee  

### Domain terms  

- *Pet Status* — available or adopted  
- *Adopted* — the terminal status for a pet  
- *Store Employee* — the front-line staff member who marks the adoption  
- *Pet* — the animal whose status is changing  

### Acceptance criteria  

1. **WHEN** *Store Employee* marks a pet as *Adopted*  
   **THEN** the *Pet Status* transitions from *Available* to *Adopted*  
   **AND** the "Book a Visit" action is disabled on the *Pet Profile Page*  
   **Evidence:** domain-sketch.md — Pet KA, `pet` concept: "status progresses from available to adopted"  

2. **WHEN** the pet has upcoming appointments at the time of adoption  
   **THEN** the system triggers a *Pet Adopted Before Visit Notification* for each affected customer (see that story)  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision: "if a pet is adopted while a customer has a pending visit appointment, notify"  

3. **WHEN** *Store Employee* attempts to mark an already-adopted pet as adopted again  
   **THEN** the system shows a "pet is already adopted" message  
   **BUT** no status change occurs  
   **Evidence:** inferred — idempotent status transition  

---  

## Story: `View Incoming Appointments`  

**Story type:** store employee  

### Domain terms  

- *Incoming Appointments* — the staff-facing list of booked appointments at their store  
- *Store Employee* — the front-line staff member viewing the schedule  
- *Appointment* — a confirmed booking with pet, customer, date/time, and visit note  

### Acceptance criteria  

1. **WHEN** *Store Employee* opens the *Incoming Appointments* view  
   **THEN** all booked appointments for their *Store* are listed, sorted by date/time (soonest first)  
   **AND** each entry shows: customer name, pet name, date/time, and visit note (if any)  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory, see incoming appointments"  

2. **WHEN** an appointment's pet has been marked *Adopted*  
   **THEN** the entry shows a "pet adopted" warning badge  
   **AND** the notification status ("notified" or "not yet notified") is displayed on the entry  
   **Evidence:** domain-sketch.md — Pet KA, `appointment` concept linked to pet status  

3. **WHEN** there are no upcoming appointments  
   **THEN** the view shows an empty state  
   **Evidence:** inferred — standard empty state  

---  

## Story: `Send Appointment Reminder`  

**Story type:** system  

### Domain terms  

- *Appointment Reminder* — a transactional notification sent before the appointment (e.g. day-before)  
- *Customer Account* — the reminder goes to the customer's verified email  
- *Appointment* — the booking being reminded about  

### Acceptance criteria  

1. **WHEN** an *Appointment* is 24 hours away  
   **THEN** the system sends an *Appointment Reminder* email to the customer  
   **AND** the reminder includes: pet name, store address, date/time, and visit note  
   **Evidence:** requirements-chat-with-product-owner.md — line 7, "Automatic confirmation email and day-before reminder"  

2. **WHEN** the appointment has been cancelled before the reminder trigger time  
   **THEN** no *Appointment Reminder* is sent  
   **Evidence:** inferred — reminders for cancelled appointments are suppressed  

3. **WHEN** the pet has been marked *Adopted* before the reminder trigger time  
   **THEN** the *Appointment Reminder* is suppressed  
   **AND** the *Pet Adopted Before Visit Notification* takes precedence (if not already sent)  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the reminder is queued for retry within a reasonable window before the appointment  
   **Evidence:** inferred — same email resilience pattern  

---  

## Story: `Send Pet Adopted Before Visit Notification`  

**Story type:** system  

### Domain terms  

- *Pet Adopted Before Visit Notification* — a transactional alert sent when a pet is adopted while a customer has a pending appointment to visit it  
- *Customer Account* — the notification goes to the customer's verified email  
- *Appointment* — the booking affected by the adoption  

### Acceptance criteria  

1. **WHEN** a pet is marked as *Adopted* (see *Mark Pet as Adopted*) and there are pending *Appointments* for that pet  
   **THEN** the system sends a *Pet Adopted Before Visit Notification* to each affected customer  
   **AND** the notification includes: pet name, adoption status, and options to cancel or browse other pets  
   **Evidence:** domain-sketch.md — Notification KA, `pet-adopted-before-visit alert` decision: "if a pet is adopted while a customer has a pending visit appointment, notify the customer; let them cancel or rebook"  

2. **WHEN** the notification is sent  
   **THEN** it is recorded against the appointment and the notification status is visible on the staff's *Incoming Appointments* view  
   **Evidence:** inferred — staff visibility into notification status (see *View Incoming Appointments* AC 2)  

3. **WHEN** the pet is adopted but no pending appointments exist  
   **THEN** no notification is sent  
   **Evidence:** inferred — notification is appointment-dependent  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the notification is queued for retry  
   **AND** the appointment still shows the "pet adopted" badge on both customer and staff views  
   **Evidence:** inferred — email failure does not suppress the status badge  

---  

## Story: `Check In Customer`  

**Story type:** store employee  

### Domain terms  

- *Check-In* — staff-recorded confirmation that the customer has arrived at the store for their appointment  
- *Checked-In Time* — the date and time the customer actually arrived  
- *Store Employee* — the front-line staff member recording the check-in  
- *Appointment* — the booking being checked in against  

### Acceptance criteria  

1. **WHEN** *Store Employee* selects "Check In" on an appointment from the *Incoming Appointments* view  
   **THEN** the system records the *Checked-In Time* and the staff member who checked them in  
   **AND** the appointment status transitions from *Confirmed* to *Checked In*  
   **Evidence:** crc.md — Appointment, `checked-in time` and `checked-in by` properties  

2. **WHEN** the customer arrives early or late relative to the *Time Slot*  
   **THEN** check-in is still allowed — the *Checked-In Time* records the actual arrival, not the slot start  
   **Evidence:** inferred — real arrival time matters for visit analytics and staff scheduling  

3. **WHEN** *Store Employee* attempts to check in an appointment that is already checked in  
   **THEN** the system shows "already checked in" with the original *Checked-In Time*  
   **BUT** no duplicate check-in is recorded  
   **Evidence:** inferred — idempotent check-in  

4. **WHEN** *Store Employee* attempts to check in a cancelled appointment  
   **THEN** the system blocks the check-in with a "this appointment was cancelled" message  
   **Evidence:** inferred — cancelled appointments cannot transition forward  

---  

## Story: `Record Visit Outcome`  

**Story type:** store employee  

### Domain terms  

- *Visit Outcome* — what happened during the visit: adopted, interested-returning, not-a-fit, browsing-only  
- *Staff Visit Notes* — free-text observations from the staff member who was present  
- *Appointment* — the booking whose outcome is being recorded  

### Acceptance criteria  

1. **WHEN** *Store Employee* selects "Record Outcome" on a checked-in appointment  
   **THEN** the system presents outcome options: *Adopted*, *Interested — Returning*, *Not a Fit*, *Browsing Only*  
   **AND** a *Staff Visit Notes* field for observations  
   **Evidence:** crc.md — Appointment, `visit outcome` and `staff visit notes` properties  

2. **WHEN** *Store Employee* selects *Adopted* as the outcome  
   **THEN** the appointment is marked as completed with outcome *Adopted*  
   **AND** the pet status transitions to *Adopted* (triggering the same notifications as *Mark Pet as Adopted*)  
   **Evidence:** crc.md — Appointment lifecycle; same adoption flow as the employee-triggered path  

3. **WHEN** *Store Employee* selects *Interested — Returning* as the outcome  
   **THEN** the system prompts for a *Follow-Up Action* (see *Set Follow-Up Action*)  
   **Evidence:** crc.md — Appointment, `follow-up action` property  

4. **WHEN** *Store Employee* records an outcome on an appointment that already has one  
   **THEN** the system shows "outcome already recorded" with the existing data  
   **BUT** an override option is available if the staff member has correction authority  
   **Evidence:** inferred — outcomes should be stable but correctable  

5. **WHEN** *Store Employee* submits the outcome without notes  
   **THEN** the outcome is accepted (notes are optional)  
   **Evidence:** inferred — minimum viable outcome is the category; notes add intelligence  

---  

## Story: `Record No-Show`  

**Story type:** store employee  

### Domain terms  

- *No-Show* — the customer did not arrive for their appointment  
- *No-Show Recorded By* — the staff member who flagged the absence  
- *No-Show Recorded At* — the date and time the no-show was recorded (e.g. 15 minutes after slot end)  
- *Appointment* — the booking being marked as no-show  

### Acceptance criteria  

1. **WHEN** the appointment's *Time Slot* has passed and the customer has not been checked in  
   **THEN** the appointment appears in the *Incoming Appointments* view with a "no check-in" indicator  
   **AND** a "Mark No-Show" action is available  
   **Evidence:** crc.md — Appointment, `no-show recorded by` and `no-show recorded at` properties  

2. **WHEN** *Store Employee* marks the appointment as *No-Show*  
   **THEN** the system records the staff member and the timestamp of the no-show recording  
   **AND** the appointment status transitions to *No-Show*  
   **Evidence:** crc.md — Appointment status lifecycle  

3. **WHEN** a no-show is recorded  
   **THEN** the system triggers a follow-up notification to the customer offering to rebook  
   **Evidence:** crc.md — Appointment, `trigger follow-up notification | Notification`  

4. **WHEN** *Store Employee* attempts to mark a checked-in appointment as no-show  
   **THEN** the system blocks the action with a "customer was already checked in" message  
   **Evidence:** inferred — mutually exclusive states: checked-in and no-show cannot coexist  

---  

## Story: `Set Follow-Up Action`  

**Story type:** store employee  

### Domain terms  

- *Follow-Up Action* — what should happen next: none, schedule-return-visit, hold-pet, send-adoption-paperwork  
- *Follow-Up Date* — when the follow-up should occur  
- *Appointment* — the booking being annotated with a follow-up  

### Acceptance criteria  

1. **WHEN** *Store Employee* sets a *Follow-Up Action* on an appointment (after recording a visit outcome or a no-show)  
   **THEN** the system records the action type and *Follow-Up Date*  
   **AND** the follow-up is visible on the appointment detail for future reference  
   **Evidence:** crc.md — Appointment, `follow-up action` and `follow-up date` properties  

2. **WHEN** the *Follow-Up Action* is *Hold Pet*  
   **THEN** the pet's status remains *Available* but the appointment detail shows a hold note  
   **AND** the *Follow-Up Date* indicates when the hold expires  
   **Evidence:** inferred — hold is a soft reservation, not a status change; prevents over-committing the pet  

3. **WHEN** the *Follow-Up Action* is *Schedule Return Visit*  
   **THEN** a link to the booking flow for the same pet is displayed to the staff member  
   **AND** staff can create the follow-up appointment on behalf of the customer  
   **Evidence:** inferred — staff-assisted rebooking  

4. **WHEN** the *Follow-Up Date* arrives  
   **THEN** the system triggers a *Visit Follow-Up Notification* to the customer  
   **Evidence:** crc.md — Appointment, `trigger follow-up notification | Notification`  

---  

## Story: `Send Visit Follow-Up Notification`  

**Story type:** system  

### Domain terms  

- *Visit Follow-Up Notification* — a transactional notification triggered by a *Follow-Up Action* on an appointment  
- *Follow-Up Date* — the date on which the notification fires  
- *Customer Account* — the notification goes to the customer's verified email  

### Acceptance criteria  

1. **WHEN** the *Follow-Up Date* on an appointment with a *Follow-Up Action* arrives  
   **THEN** the system sends a *Visit Follow-Up Notification* to the customer  
   **AND** the notification references the pet name, store, and the follow-up context (e.g. "We're holding Bella for you — would you like to schedule your return visit?")  
   **Evidence:** crc.md — Appointment, `trigger follow-up notification | Notification`  

2. **WHEN** the appointment's *Follow-Up Action* is *None*  
   **THEN** no follow-up notification is sent  
   **Evidence:** inferred — follow-up is opt-in by staff  

3. **WHEN** the pet has been adopted by someone else before the *Follow-Up Date*  
   **THEN** the follow-up notification is suppressed  
   **AND** the *Pet Adopted Before Visit Notification* takes precedence  
   **Evidence:** inferred — same precedence pattern as appointment reminders  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the notification is queued for retry within a reasonable window  
   **Evidence:** inferred — same email resilience pattern

## Increment 7: Returns and refunds — close the loop

**Increment outcome:** Customers can initiate a *Return* from their *Order History*, get a printable label or QR code, and watch the *Refund* land back on their original payment method. In-store returns are reflected in the customer's account too. The vendor-routing invariant on *Refund* is the design rule that drives this slice.  

**Builds on:** Increments 1-6 (full e-commerce spine, accounts, multi-vendor payments, pet visits live).  

---  

## Story: `Initiate Return from Order History`  

**Story type:** user  

### Domain terms  

- *Return* — a customer-initiated request to send back purchased products  
- *Order History* — the list of past orders (established in Increment 4)  
- *Return Eligibility* — the rules governing which orders/items can be returned (e.g. within 30 days, item condition)  
- *Item Condition* — the state of the returned goods: unopened, opened, or damaged  
- *Return Request* — the submitted request for a return, pending processing  

### Acceptance criteria  

1. **WHEN** the customer selects "Return" on an eligible order in *Order History*  
   **THEN** the system shows which items in the order are *Return Eligible*  
   **AND** the customer selects the items and quantities to return, a return reason, and the *Item Condition* (unopened, opened, damaged)  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "Easy returns — people should be able to initiate a return from their order history"; crc.md — Return, `item condition` property  

2. **WHEN** the customer submits the *Return Request*  
   **THEN** the system creates the return record, links it to the original order, and shows the next steps (label generation)  
   **AND** the return status appears in the customer's account under the order detail  
   **Evidence:** domain-sketch.md — Order KA, `return` concept: "placed by the customer from order history"  

3. **WHEN** the order is outside the return window or items are not eligible  
   **THEN** the "Return" action is hidden or disabled with a clear reason (e.g. "return window expired")  
   **BUT** the order detail is still viewable  
   **Evidence:** inferred — return eligibility gate; specific window rules are a configuration  

4. **WHEN** the customer selects *Item Condition* as *Damaged*  
   **THEN** an additional field for damage description is shown  
   **AND** an optional photo upload is offered for documenting the damage  
   **Evidence:** inferred — damaged items require more detail for processing  

5. **WHEN** the customer has already initiated a return for some items in the order  
   **THEN** those items are shown as "return in progress" and cannot be returned again  
   **BUT** remaining eligible items can still be returned separately  
   **Evidence:** inferred — partial returns supported; no double-return  

---  

## Story: `Generate Return Label or QR Code`  

**Story type:** system  

### Domain terms  

- *Return Label* — a printable shipping label for sending the item back  
- *Return QR Code* — an alternative to the label for drop-off at a carrier location  
- *Return Request* — the approved return that triggers label generation  

### Acceptance criteria  

1. **WHEN** the *Return Request* is submitted  
   **THEN** the system generates a *Return Label* (PDF) and a *Return QR Code*  
   **AND** both are shown on the return confirmation page and emailed to the customer  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "generate a return label, maybe a QR code they can show at a drop-off point"  

2. **WHEN** the customer downloads the *Return Label*  
   **THEN** the label includes: return address, order number, return reference, and carrier barcode  
   **Evidence:** inferred — standard return label contents  

3. **WHEN** the customer chooses the *Return QR Code* option  
   **THEN** the QR code is displayable on a mobile device at a carrier drop-off point  
   **AND** it encodes the same return reference as the label  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "QR code they can show at a drop-off point"  

4. **WHEN** the label/QR generation service is temporarily unavailable  
   **THEN** the return is still recorded  
   **AND** the customer is told to check back or contact support for the label  
   **BUT** the return is not cancelled due to label failure  
   **Evidence:** inferred — label generation is a side-effect, not a gate on return creation  

---  

## Story: `Route Refund through Original Payment Vendor`  

**Story type:** system  

### Domain terms  

- *Refund* — the financial reversal returning money to the customer  
- *Original Payment Vendor* — the vendor (StripeWave, PayNova, or VaultPay) that processed the original payment  
- *Vendor-Routing Invariant* — the rule that a refund must always route through the vendor that took the original payment  
- *Refund Authorization* — the vendor's confirmation that the refund will be processed  

### Acceptance criteria  

1. **WHEN** the returned item is received and inspected (or the return is auto-approved)  
   **THEN** the system initiates a *Refund* through the *Original Payment Vendor* for that order  
   **AND** the refund amount matches the returned items' value  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "Refunds go back through whichever payment vendor was used for the original purchase"  

2. **WHEN** the original payment was via StripeWave  
   **THEN** the refund routes through StripeWave's refund API  
   **AND** the customer sees the credit on their card statement  
   **Evidence:** domain-sketch.md — Payment KA, `refund` concept: "must route through the vendor that processed the original payment"  

3. **WHEN** the original payment was via PayNova (digital wallet)  
   **THEN** the refund routes through PayNova's refund API  
   **Evidence:** domain-sketch.md — Payment KA, `refund` invariant: "must always route through the original payment vendor"  

4. **WHEN** the original payment was via VaultPay (BNPL)  
   **THEN** the refund routes through VaultPay's refund API  
   **AND** the instalment plan is adjusted accordingly by VaultPay  
   **Evidence:** domain-sketch.md — Payment KA, `refund` invariant  

5. **WHEN** the refund request to the vendor fails (vendor downtime, API error)  
   **THEN** the refund is queued for retry  
   **AND** the customer sees "refund processing" status — not "refund failed"  
   **BUT** if retries exhaust, the return status escalates to "refund requires manual review"  
   **Evidence:** inferred — refund resilience; aligns with payment retry pattern from Increment 5  

---  

## Story: `Track Refund Status`  

**Story type:** user  

### Domain terms  

- *Refund Status* — the current state of the refund: processing, completed, or requires review  
- *Order Detail* — the page where the return and refund status are shown  
- *Refund Completion* — the vendor's confirmation that the money has been returned  

### Acceptance criteria  

1. **WHEN** the customer views the *Order Detail* for a returned order  
   **THEN** the *Refund Status* is visible: processing, completed, or requires review  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "track the refund status"  

2. **WHEN** the *Refund* is completed by the vendor  
   **THEN** the *Refund Status* transitions to *Completed*  
   **AND** the customer receives a "refund completed" notification (email)  
   **Evidence:** inferred — refund lifecycle notification  

3. **WHEN** the *Refund Status* is "processing" for an extended period  
   **THEN** the *Order Detail* shows a note: "refunds typically take X business days depending on your payment provider"  
   **Evidence:** inferred — expectation management; refund speed depends on the vendor  

4. **WHEN** the *Refund Status* is "requires review"  
   **THEN** the customer sees a message to contact support  
   **AND** the support team has access to the return and refund details  
   **Evidence:** inferred — manual escalation path  

---  

## Story: `Process In-Store Return`  

**Story type:** store employee  

### Domain terms  

- *In-Store Return* — a return where the customer brings the item back to a physical store  
- *Store Employee* — the front-line staff member processing the in-store return  
- *Return* — the return record created in the system  
- *Refund* — the financial reversal triggered by the in-store return  

### Acceptance criteria  

1. **WHEN** a customer brings an item to the store for return  
   **THEN** the staff dashboard provides an order lookup by order number or customer email  
   **AND** a "Start Return" action is displayed on the matched order  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "If they bring something back to the store, that should be reflected in the customer's account too"  

2. **WHEN** *Store Employee* submits the *In-Store Return*  
   **THEN** the system creates a return record linked to the original order  
   **AND** triggers the *Refund* through the *Original Payment Vendor* (same routing invariant as online returns)  
   **AND** the return appears in the customer's *Order History*  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "reflected in the customer's account"  

3. **WHEN** the original order was placed by a guest (no account)  
   **THEN** the order lookup and return flow work identically using the order number and guest email  
   **AND** the refund routes through the original vendor  
   **BUT** the return is not visible in an "account" because the customer has no account  
   **Evidence:** inferred — guest returns are valid; refund routing is order-level, not account-level  

4. **WHEN** the item is not eligible for return (outside window, wrong condition)  
   **THEN** the staff dashboard shows the ineligibility reason  
   **AND** a "Manager Override" action is displayed, requiring manager approval before the return proceeds  
   **Evidence:** inferred — in-store employees have discretion with approval; online flow does not offer overrides  

---  

## Story: `Send Return and Refund Status Update`  

**Story type:** system  

### Domain terms  

- *Return Status Update* — a transactional notification at key return lifecycle points  
- *Refund Status Update* — a transactional notification when the refund status changes  
- *Customer* — the notification recipient (email for accounts, guest email for guests)  

### Acceptance criteria  

1. **WHEN** the return is received and processing begins  
   **THEN** the system sends a "return received" notification to the customer  
   **Evidence:** inferred — return lifecycle notification  

2. **WHEN** the refund is completed by the vendor  
   **THEN** the system sends a "refund completed" notification with the refunded amount and the payment method it was returned to  
   **Evidence:** requirements-chat-with-product-owner.md — line 21, "track the refund status"; inferred — proactive notification at completion  

3. **WHEN** the refund requires manual review (vendor failure, policy exception)  
   **THEN** the system sends a "refund under review" notification with guidance to contact support if needed  
   **Evidence:** inferred — customer should not be left in the dark  

4. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the notification is queued for retry  
   **AND** the return/refund status is still updated in the system (notification failure does not block processing)  
   **Evidence:** inferred — same email resilience pattern

## Increment 8: Marketing engine — reviews, alerts, and content

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

## Increment 9: Power-ups — search, personalization, admin polish

**Increment outcome:** Keyword *product search* with *filter facets* lifts conversion on a deep catalog; *my store* personalization and *customer pet profiles* tighten loyalty; the *inventory dashboard* replaces the bare-bones stock form from Increment 1 and surfaces *low stock alerts* for proactive replenishment. *Backorder purchase* relaxes the out-of-stock gate. Polish layer over a fully-functional product.

**Builds on:** Increments 1–8 (complete product live: e-commerce, accounts, payments, pets, returns, marketing, content).

---

## Story: `Search Products by Keyword`

**Story type:** user

### Domain terms

- *Product Search* — keyword-based discovery mechanism that matches products by name, description, category, or brand and ranks results by relevance
- *Search Results* — the ranked list of products produced by a *product search*, with empty-state guidance when no products match
- *Search Bar* — the globally accessible UI input for entering search keywords (appears in the site header on every page)
- *Product Catalog* — the searchable corpus that *product search* queries (boundary — Product Catalog)
- *Product* — the entity matched and ranked by *product search* (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer enters a keyword in the *Search Bar* and submits
   **THEN** the *Search Results* show *products* whose name, description, *category*, or brand match the keyword
   **AND** results are ranked by relevance (closest match first)
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "We want good filtering and search"; power-ups-ubiquitous-language.md — *product search*: "matches products by name, description, category, or brand"

2. **WHEN** the keyword matches no *products*
   **THEN** the *Search Results* show a "no results found" message with suggestions (popular *categories*, alternative keywords)
   **BUT** no empty, unlabelled result set is shown
   **Evidence:** power-ups-ubiquitous-language.md — *search results*: "displays a 'no results found' message with suggestions when no products match"

3. **WHEN** the customer enters a partial keyword (e.g. "kitt" for "kitten food")
   **THEN** the *Search Results* return relevant matches via partial or fuzzy matching
   **Evidence:** power-ups-ubiquitous-language.md — *product search*: "supports partial and fuzzy matching so that incomplete keywords still return relevant products"

4. **WHEN** the customer initiates a *product search* from any page (product detail, store locator, blog)
   **THEN** the *Search Bar* is accessible globally in the site header
   **AND** submitting navigates to the *search results* page
   **Evidence:** power-ups-ubiquitous-language.md — *product search* invariant: "must always be accessible from every page"

5. **WHEN** the customer applies *filter facets* to the *search results* (see *Filter Products*)
   **THEN** the *search results* narrow to the intersection of keyword match and all *active filters*
   **AND** results update immediately
   **Evidence:** power-ups-ubiquitous-language.md — *search results*: "respects active filters … narrows to the intersection of the keyword match and all active filter selections"

---

## Story: `Filter Products`

**Story type:** user

### Domain terms

- *Filter Facet* — a named dimension (category, pet type, brand, price range, *stock availability*) that narrows the *product* list and shows match counts per value
- *Active Filter* — a currently applied *filter facet* selection displayed as a removable tag whose removal expands the result set
- *Product Catalog* — the browsable corpus that *filter facets* operate over (boundary — Product Catalog)
- *Search Results* — the keyword-match list that *filter facets* also narrow (see *Search Products by Keyword*)
- *Stock Availability* — a *filter facet* dimension showing only *products* currently in stock (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer is browsing the *Product Catalog* or viewing *Search Results*
   **THEN** *filter facets* are available: *category*, pet type, brand, price range, and *stock availability*
   **AND** each *filter facet* shows the count of matching *products* per value
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search"; power-ups-ubiquitous-language.md — *filter facet*: "shows the count of matching products per value"

2. **WHEN** the customer selects a *filter facet* value
   **THEN** the *product* list updates immediately to show only matching *products*
   **AND** the selection appears as a removable *active filter* chip
   **Evidence:** power-ups-ubiquitous-language.md — *active filter*: "a currently applied filter facet selection displayed as a removable chip or tag"

3. **WHEN** the customer combines multiple *filter facets* (e.g. pet type = "dog" AND *category* = "food")
   **THEN** the results narrow to the intersection of all *active filters*
   **AND** *filter facet* counts update to reflect the combined state of all *active filters*
   **Evidence:** power-ups-ubiquitous-language.md — *filter facet*: "combines conjunctively with other filter facets"; *filter facet* invariant: "facet counts must always reflect the current combined filter state"

4. **WHEN** the customer removes an *active filter*
   **THEN** the *product* list expands to include *products* that were previously excluded by that filter
   **AND** remaining *filter facet* counts recalculate
   **Evidence:** power-ups-ubiquitous-language.md — *active filter*: "expands the product list when removed"

5. **WHEN** all *active filters* together produce zero results
   **THEN** the *product* list shows a "no products match your filters" message with a "clear all filters" action
   **BUT** no stale counts from the previous filter state are shown
   **Evidence:** power-ups-ubiquitous-language.md — *filter facet*: "displays a 'no products match your filters' message with a 'clear all filters' action when the combined active filters produce zero results"; invariant: "must never show stale counts after a filter change"

6. **WHEN** the customer selects a price range *filter facet*
   **THEN** the filter uses a min-max range (not discrete selections)
   **AND** the same narrowing and count-update behavior as other *filter facets* applies
   **Evidence:** power-ups-ubiquitous-language.md — Decisions: "Price range is a filter facet dimension that uses a min-max range rather than discrete selections"

---

## Story: `Filter Stores by Availability and Specialization`

**Story type:** user

### Domain terms

- *Store Specialization Filter* — a filter dimension on the *store locator* that narrows the *store* list to only stores with a declared *store specialization*
- *Product Availability Filter* — a filter dimension on the *store locator* that narrows the *store* list to only stores where a specific *product* is in stock
- *Store Locator* — the discovery surface where both filter dimensions operate (boundary — Store)
- *Store* — the physical location filtered by specialization and availability (boundary — Store)
- *Store Specialization* — a store's declared area of expertise, e.g. reptile section, premium dog food (boundary — Store)
- *Stock Availability* — the per-product, per-store availability state used by *product availability filter* (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer is browsing the *Store Locator*
   **THEN** filter dimensions are available for *store specialization filter* and *product availability filter*
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location. Some stores might specialise"

2. **WHEN** the customer filters by *store specialization* (e.g. "reptile section")
   **THEN** only *stores* with that declared *store specialization* are shown
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "one might have a great reptile section"; power-ups-ubiquitous-language.md — *store specialization filter*: "shows only stores whose store specialization matches the customer's selection"

3. **WHEN** the customer filters by *product availability filter* for a specific *product*
   **THEN** only *stores* where that *product* is in stock are shown
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location"; power-ups-ubiquitous-language.md — *product availability filter*: "shows only stores whose stock availability for the selected product indicates the item is available"

4. **WHEN** both *store specialization filter* and *product availability filter* are active
   **THEN** only *stores* matching both criteria are shown (conjunctive narrowing)
   **Evidence:** power-ups-ubiquitous-language.md — *store specialization filter*: "combines with product availability filter — when both are active, only stores matching both criteria are shown"

5. **WHEN** no *stores* match the combined filters
   **THEN** a "no stores match your filters" message is shown with a "clear filters" action
   **Evidence:** power-ups-ubiquitous-language.md — *store specialization filter*: "displays a 'no stores match your filters' message with a 'clear filters' action when the combined filters produce zero results"

---

## Story: `Set My Store Preference`

**Story type:** user

### Domain terms

- *My Store* — the customer's declared preferred *store*, saved to their *customer account* and persisted across sessions and devices
- *Customer Account* — stores the *my store* preference and provides the login identity that gates preference-setting (boundary — Customer Account)
- *Store* — the physical location that can be set as *my store* (boundary — Store)
- *Tailored Experience* — the set of behaviors activated when *my store* is set (see *Tailor Experience to Preferred Store*)

### Acceptance criteria

1. **WHEN** a logged-in customer selects "Set as My Store" on a store detail page or from account settings
   **THEN** the selected *store* is saved as the customer's *my store*
   **AND** the preference persists across sessions and devices
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Maybe even the ability to set 'my store' as a preference and tailor the experience"; power-ups-ubiquitous-language.md — *my store*: "persisting across sessions and devices"

2. **WHEN** the customer changes their *my store* to a different *store*
   **THEN** the previous preference is replaced immediately
   **AND** the *tailored experience* reflects the new *store* without delay
   **Evidence:** power-ups-ubiquitous-language.md — *my store* invariant: "only one my store per customer account at any time; setting a new one replaces the old one immediately"

3. **WHEN** no *my store* is currently set
   **THEN** the customer can set one from a store detail page or account settings
   **BUT** no store-specific tailoring is applied — default behavior from previous increments persists
   **Evidence:** power-ups-ubiquitous-language.md — *my store* invariant: "when no my store is set, no store-specific tailoring is applied"

4. **WHEN** a guest customer (not logged in) tries to set *my store*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** power-ups-ubiquitous-language.md — *my store*: "requires a logged-in customer account — guest sessions cannot set my store and are prompted to log in or register without navigating away"

---

## Story: `Tailor Experience to Preferred Store`

**Story type:** system

### Domain terms

- *Tailored Experience* — the set of behaviors activated when a *customer account* has a *my store* set
- *My Store* — the customer's preferred *store* (see *Set My Store Preference*)
- *Stock Availability* — defaults to the preferred *store* on product pages when *my store* is set (boundary — Product Catalog)
- *Store Locator* — highlights the preferred *store* when *my store* is set (boundary — Store)
- *Click-and-Collect* — checkout store-selection step that the *tailored experience* pre-selects (boundary — Store)

### Acceptance criteria

1. **WHEN** the customer has a *my store* set and views a product page
   **THEN** *stock availability* on the product page defaults to the preferred *store*
   **AND** the customer sees availability at their local *store* without manual selection
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "tailor the experience"; power-ups-ubiquitous-language.md — *tailored experience*: "defaults stock availability on product pages to the preferred store"

2. **WHEN** the customer has a *my store* set and opens the *store locator*
   **THEN** the preferred *store* is visually highlighted
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "highlights the preferred store in the store locator"

3. **WHEN** the customer has a *my store* set and enters checkout with *click-and-collect*
   **THEN** the preferred *store* is pre-selected in the *click-and-collect* store-selection step
   **AND** the full *store* list remains available for override
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "pre-selects the preferred store in the click-and-collect checkout flow, while keeping the full store list available for override"

4. **WHEN** the customer has no *my store* set
   **THEN** no store-specific tailoring is applied
   **AND** previous-increment default behavior is preserved
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "applies no tailoring when no my store is set — previous-increment default behavior is preserved"

---

## Story: `Create Customer Pet`

**Story type:** user

### Domain terms

- *Customer Pet Profile* — a record of the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)
- *Customer Account* — the owner of the *customer pet profile*; login identity gates profile creation (boundary — Customer Account)

### Acceptance criteria

1. **WHEN** a logged-in customer opens "My Pets" from account settings
   **THEN** a list of their *customer pet profiles* is displayed (or an empty state with "add your first pet")
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "pet profiles for their own pets"

2. **WHEN** the customer creates a new *customer pet profile*
   **THEN** the form collects: name, species, breed (optional), age or date of birth (optional), and photo (optional)
   **AND** the profile is saved to the *customer account*
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "basic pet profile — name, species, breed, age"; power-ups-ubiquitous-language.md — *customer pet profile*: "records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)"

3. **WHEN** the customer has multiple pets
   **THEN** each pet has its own *customer pet profile* entry
   **AND** all are listed under "My Pets"
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "supports multiple profiles per customer account, each listed under 'My Pets'"

4. **WHEN** species and breed data is saved on a *customer pet profile*
   **THEN** the data feeds downstream personalised recommendation algorithms
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "feeds downstream personalized recommendation algorithms with species, breed, and age data"

5. **WHEN** a guest customer (not logged in) tries to create a *customer pet profile*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "guest sessions are prompted to log in before creating a profile"

---

## Story: `View Inventory Dashboard`

**Story type:** store owner

### Domain terms

- *Inventory Dashboard* — the admin interface listing all *products* at a *store* with current *stock levels*, supporting search, sort, filter, and inline editing; replaces the bare-bones stock editing form from Increment 1
- *Store Staff* — the admin actor who uses the *inventory dashboard* to manage *stock levels* at their *store* (boundary — Store Operations)
- *Stock Level* — the numeric quantity of a *product* at a *store*, viewed and edited on the *inventory dashboard*
- *Low Stock Alert* — a visual badge shown on a product row when its *stock level* falls below the *low stock threshold*
- *Low Stock Threshold* — the configurable *stock level* below which a *low stock alert* is triggered
- *Inventory Export* — a CSV download of stock data scoped to the *store staff* member's *store*
- *Stock Availability* — the real-time availability state of a *product* that the *inventory dashboard* reflects (boundary — Product Catalog)
- *Product* — the entity whose *stock levels* are viewed, edited, and alerted on (boundary — Product Catalog)
- *Category* — a sort and filter dimension on the *inventory dashboard* (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** *store staff* opens the *inventory dashboard*
   **THEN** all *products* at their *store* are listed with current *stock levels*
   **AND** the dashboard supports search, sort (by name, *stock level*, *category*), and filter
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; power-ups-ubiquitous-language.md — *inventory dashboard*: "lists all products at a store with current stock levels … supporting search, sort, filter"

2. **WHEN** a *product's* *stock level* falls below the configured *low stock threshold*
   **THEN** a *low stock alert* badge is shown on that *product's* row
   **AND** a "low stock only" filter is available on the *inventory dashboard*
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "drives the 'low stock only' filter on the inventory dashboard"; invariant: "must appear on every product whose stock level is below the low stock threshold"

3. **WHEN** *store staff* edits a *stock level* from the *inventory dashboard*
   **THEN** the same behavior as Update Product Stock Levels (Increment 1) applies: immediate persist, real-time customer-facing *stock availability* update, validation
   **Evidence:** established in Increment 1 — Update Product Stock Levels AC; power-ups-ubiquitous-language.md — *stock level* invariant: "edits must propagate to customer-facing stock availability in real time"

4. **WHEN** *store staff* views the *inventory dashboard* for the first time after Increment 9 deployment
   **THEN** the *inventory dashboard* replaces the bare-bones stock editing form from Increment 1
   **AND** all existing stock data is intact — no data migration loss
   **Evidence:** power-ups-ubiquitous-language.md — *inventory dashboard*: "replaces the bare-bones stock editing form from Increment 1"; invariant: "transition from the prior form must not lose data"

5. **WHEN** *store staff* exports inventory data
   **THEN** the *inventory export* produces a CSV with *product* name, *category*, current *stock level*, and last updated timestamp
   **AND** the export covers the *store staff* member's *store* only
   **Evidence:** power-ups-ubiquitous-language.md — *inventory export*: "produces a CSV download … includes product name, category, current stock level, and last updated timestamp per row"; "is scoped to the single store"

6. **WHEN** *store staff* enters an invalid *stock level* (negative or non-numeric)
   **THEN** the *inventory dashboard* rejects the update with a clear error message
   **BUT** the previous *stock level* remains unchanged
   **Evidence:** power-ups-ubiquitous-language.md — *stock level* invariant: "must always be a non-negative value"

---

## Story: `Display Low Stock Badge`

**Story type:** system

### Domain terms

- *Low Stock Alert* — a visual badge shown on a *product* row when its *stock level* falls below the *low stock threshold*
- *Low Stock Threshold* — the configurable *stock level* below which a *low stock alert* is triggered for a *product*
- *Stock Level* — the numeric quantity of a *product* at a *store*; determines whether the alert fires
- *Stock Availability* — the real-time availability state that the badge reflects (boundary — Product Catalog)
- *Inventory Dashboard* — the admin surface where *low stock alert* badges appear and drive the "low stock only" filter

### Acceptance criteria

1. **WHEN** a *product's* *stock level* falls below its configured *low stock threshold* but remains greater than zero
   **THEN** a *low stock alert* badge is shown on the *product* row in the *inventory dashboard*
   **AND** the badge communicates urgency (e.g. "Low stock" or the current quantity)
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "a visual badge shown on a product row in the inventory dashboard when the product's stock level falls below the low stock threshold"

2. **WHEN** a *product's* *stock level* is at or above its *low stock threshold*
   **THEN** no *low stock alert* badge is shown on that *product's* row
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert* invariant: "must disappear when the stock level is raised above the threshold"

3. **WHEN** *store staff* raises a *product's* *stock level* above the *low stock threshold*
   **THEN** the *low stock alert* badge disappears on the next view
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert* invariant: "must appear on every product whose stock level is below the low stock threshold; must disappear when the stock level is raised above the threshold"

4. **WHEN** *store staff* activates the "low stock only" filter on the *inventory dashboard*
   **THEN** only *products* with *stock levels* below their *low stock threshold* are shown
   **AND** staff can quickly identify *products* needing replenishment
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "drives the 'low stock only' filter on the inventory dashboard so store staff can quickly find products needing replenishment"

5. **WHEN** a *product's* *stock level* reaches zero
   **THEN** the *product* row shows an "out of stock" indicator
   **AND** the *low stock alert* badge is superseded by the out-of-stock state
   **Evidence:** power-ups-ubiquitous-language.md — *stock level*: "a zero stock level means the product is out of stock for customers"

---

## Story: `Allow Backorder Purchase`

**Story type:** system

### Domain terms

- *Backorder Purchase* — the ability for a customer to purchase a *product* that is currently out of stock, with a backorder expectation
- *Stock Availability* — the real-time availability state whose purchase-blocking gate is relaxed by *backorder purchase* (boundary — Product Catalog)
- *Product* — the entity purchased on backorder (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** a *product* is currently out of stock and *backorder purchase* is enabled for that *product*
   **THEN** the product page shows a "Backorder" indicator instead of "Out of Stock"
   **AND** the "Add to Cart" action is available
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase*: "allows a customer to purchase a product that is currently out of stock, relaxing the previous gate"

2. **WHEN** the customer adds a backordered *product* to the cart
   **THEN** the cart line item shows a backorder label
   **AND** the customer is informed that the *product* is backordered and will ship when restocked
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase*: "signals to the customer that the product is backordered and will ship when restocked"

3. **WHEN** the customer proceeds to checkout with a backordered *product*
   **THEN** the order summary shows the backorder status per affected line item
   **AND** the order is accepted and payment is processed normally
   **Evidence:** inferred — backorder relaxes the stock gate at checkout; order flow otherwise unchanged

4. **WHEN** a *product* is out of stock and *backorder purchase* is not enabled
   **THEN** the product shows "Out of Stock"
   **AND** the "Add to Cart" action is disabled (existing behavior from prior increments)
   **BUT** no backorder option is presented
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase* relaxes "the previous gate where stock availability prevented checkout of unavailable items" — gate remains for non-backorder products

5. **WHEN** a previously backordered *product* is restocked (its *stock level* rises above zero)
   **THEN** the backorder indicator is replaced by normal *stock availability* ("In Stock")
   **AND** standard purchase flow resumes
   **Evidence:** inferred — backorder is a temporary state; restocking restores normal behavior

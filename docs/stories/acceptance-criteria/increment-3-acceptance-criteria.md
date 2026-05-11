# Acceptance criteria — Increment 3: Ship to home  

**Increment outcome:** A customer can complete the same purchase journey but have it **shipped** to a delivery address. Standard delivery only. Now the store reaches customers outside its catchment.  

**Builds on:** Increment 1 (Store, Catalog, Stock), Increment 2 (Cart, Guest Checkout, StripeWave, Click-and-Collect, Order Confirmation).  

---  

## Story: `Enter Shipping Address`  

**Story type:** user  

### Domain terms  

- *Shipping Address* — the destination where the order will be delivered  
- *Checkout Flow* — the step-by-step purchase process (billing address step established in Increment 2)  
- *Address Form* — the input surface for shipping details  
- *Billing Address* — already collected in Increment 2; the customer may reuse it  

### Acceptance criteria  

1. **WHEN** the customer selects home delivery during checkout  
   **THEN** the *Checkout Flow* presents the *Address Form* for *Shipping Address*  
   **AND** the form collects: name, address line 1, address line 2 (optional), city, county/state, postcode, and country  
   **BUT** does not apply to *Click-and-Collect* orders — those skip the shipping address step entirely (see *Select Click-and-Collect Store*, Increment 2)  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "Checkout flow: shipping address, billing address, delivery options"  

2. **WHEN** the customer's *Shipping Address* is the same as their *Billing Address*  
   **THEN** a "same as billing" option pre-fills the *Shipping Address* from the *Billing Address* entered in the billing step  
2a. **WHEN** the customer overrides an individual field on the pre-filled *Shipping Address*  
   **THEN** the overridden value replaces the billing value for that field only  
   **AND** the remaining pre-filled fields are unchanged  
   **Evidence:** inferred — standard e-commerce UX; reduces friction for the common case  

3. **WHEN** the customer submits the *Shipping Address* with required fields missing  
   **THEN** the form highlights the missing fields with clear validation messages  
   **BUT** the checkout does not advance to delivery option selection  
   **Evidence:** inferred — standard address validation  

4. **WHEN** the customer completes the *Shipping Address*  
   **THEN** the checkout advances to the *Delivery Option* selection step  
   **AND** the entered address is shown in the order summary for review  
   **Evidence:** domain-sketch.md — Order KA, `order` concept: "captures the complete purchase: products, quantities, shipping address, billing address, delivery option, and payment"  

---  

## Story: `Select Delivery Option`  

**Story type:** user  

### Domain terms  

- *Delivery Option* — a choice of shipping speed for the order  
- *Standard Delivery* — the default shipping speed (Increment 3 scope — express and same-day are deferred)  
- *Click-and-Collect* — the alternative fulfillment path established in Increment 2  

### Acceptance criteria  

1. **WHEN** the customer reaches the delivery selection step  
   **THEN** the available options are *Standard Delivery* and *Click-and-Collect* (from Increment 2)  
   **AND** *Standard Delivery* shows an estimated delivery window and cost  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "delivery options (standard, express, maybe same-day for local)"; story-map.md — Consolidation Notes: "Groups three shipping speeds into one parameterized story — same selection mechanic, different speed and cost"  

2. **WHEN** the customer selects *Standard Delivery*  
   **THEN** the *Shipping Address* entered in the previous step is confirmed as the delivery destination  
   **AND** the checkout advances to payment  
   **Evidence:** domain-sketch.md — Order KA, `delivery option` concept: "is selected during checkout and recorded on the order"  

3. **WHEN** the customer switches from *Standard Delivery* to *Click-and-Collect* (or vice versa) during checkout  
   **THEN** the relevant address steps adjust: *Click-and-Collect* drops the *Shipping Address* requirement and shows the *Store Selector*; *Standard Delivery* requires the *Shipping Address*  
   **BUT** the *Billing Address* is always required regardless of delivery option  
   **Evidence:** domain-sketch.md — Store KA, `click-and-collect` concept: pickup replaces shipping; Order KA, `order` concept: billing address always captured  

4. **WHEN** express or same-day options are not yet available (deferred per thin slicing)  
   **THEN** they do not appear in the selection — the customer sees only *Standard Delivery* and *Click-and-Collect*  
   **BUT** the UI is structured to accommodate additional options in future increments without redesign  
   **Evidence:** story-map.md — Context Gaps: "Same-day delivery — geographic eligibility rules and cut-off times not specified. Awaiting PO decision."  

---  

## Story: `View and Process Incoming Orders`  

**Story type:** store employee  

### Domain terms  

- *Order Queue* — the staff-facing list of all confirmed orders awaiting fulfillment (both shipped and click-and-collect)  
- *Store Employee* — the front-line staff member processing orders  
- *Shipping Order* — an order with *Standard Delivery* as the selected option  
- *Order Status* — the lifecycle state: Confirmed → Fulfilled → Shipped → Delivered  

### Acceptance criteria  

1. **WHEN** *Store Employee* opens the *Order Queue*  
   **THEN** they see all confirmed orders across delivery types (shipped and click-and-collect)  
   **AND** each order shows: order number, items, quantities, delivery type, and customer name or guest email  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory, see incoming appointments... handle order fulfilment"  

2. **WHEN** *Store Employee* selects a *Shipping Order* from the queue  
   **THEN** the order detail shows the *Shipping Address*, items to pack, and any special notes  
   **AND** a "Mark as Fulfilled" action is displayed on the order detail  
   **Evidence:** domain-sketch.md — Order KA, `order` concept: lifecycle "placed → confirmed → fulfilled → shipped → delivered"  

3. **WHEN** *Store Employee* marks a *Shipping Order* as *Fulfilled*  
   **THEN** the system prompts for a tracking number (manual entry in Increment 3)  
   **AND** entering the tracking number triggers the shipping notification (see *Send Shipping Notification with Tracking Number*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers"  

4. **WHEN** *Store Employee* marks a *Shipping Order* as *Fulfilled* without entering a tracking number  
   **THEN** the system warns that the customer will not receive a tracking notification  
   **BUT** the order can still be marked fulfilled — the tracking number is recommended but not blocking in Increment 3  
   **Evidence:** inferred — manual label creation in Increment 3; full automation deferred  

---  

## Story: `Send Shipping Notification with Tracking Number`  

**Story type:** system  

### Domain terms  

- *Shipping Notification* — the email sent to the customer when the order ships  
- *Tracking Number* — the carrier reference entered by staff  
- *Guest Email* — the email collected during guest checkout (Increment 3 is still guest-only)  
- *Order* — the purchase being shipped  

### Acceptance criteria  

1. **WHEN** *Store Employee* enters a *Tracking Number* and confirms fulfillment  
   **THEN** the system sends a *Shipping Notification* to the *Guest Email*  
   **AND** the notification includes: order number, items shipped, carrier name, *Tracking Number*, and estimated delivery window  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers. The usual stuff but done well."  

2. **WHEN** the *Shipping Notification* is sent  
   **THEN** the *Order* status transitions from *Fulfilled* to *Shipped*  
   **Evidence:** domain-sketch.md — Order KA, `order` concept: lifecycle "fulfilled → shipped"  

3. **WHEN** the email delivery system is temporarily unavailable  
   **THEN** the notification is queued for retry  
   **AND** the order status still transitions to *Shipped* (email failure does not block fulfillment)  
   **BUT** the customer may not receive the notification immediately — a retry window applies  
   **Evidence:** inferred — same resilience pattern as Increment 2 confirmation email  

4. **WHEN** staff did not enter a *Tracking Number* (see *View and Process Incoming Orders* AC 4)  
   **THEN** no *Shipping Notification* is sent automatically  
   **AND** the order detail provides an "Add Tracking Number" field so the notification fires when staff enter it later  
   **Evidence:** inferred — manual process in Increment 3  

---  

## Story: `Track Order Status`  

**Story type:** user  

### Domain terms  

- *Order Status Page* — the customer-facing view of an order's current lifecycle state  
- *Order Number* — the unique identifier for the order (shown on confirmation page and email)  
- *Order Lifecycle* — the progression: Placed → Confirmed → Fulfilled → Shipped → Delivered  
- *Tracking Number* — the carrier reference linking to external carrier tracking  
- *Guest Email* — used to look up the order for guest customers (no account yet)  

### Acceptance criteria  

1. **WHEN** a guest customer follows the order link in their *Confirmation Email* or *Shipping Notification*  
   **THEN** the *Order Status Page* shows the current *Order Lifecycle* state, itemized contents, and delivery details  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "Order confirmation page, confirmation email, shipping notifications with tracking numbers"  

2. **WHEN** the order has a *Tracking Number*  
   **THEN** the *Order Status Page* displays the tracking number and links to the carrier's tracking page  
   **AND** the shipment date and estimated delivery date are displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 19, "shipping notifications with tracking numbers"  

3. **WHEN** the guest customer enters their *Order Number* and *Guest Email* on a lookup page  
   **THEN** the system retrieves and displays the matching *Order Status Page*  
   **BUT** the lookup fails with a clear error if the email does not match the order — no order details are leaked to unrelated emails  
   **Evidence:** inferred — guest order lookup requires both identifiers for security; no account-based access until Increment 4  

4. **WHEN** the order has not yet shipped (status is *Confirmed* or *Fulfilled*)  
   **THEN** the *Order Status Page* shows the current state without a tracking number  
   **AND** the page indicates that tracking will be available once the order ships  
   **Evidence:** inferred — order lifecycle states before shipping do not have carrier data  

5. **WHEN** the order status changes (e.g. from *Shipped* to *Delivered*)  
   **THEN** the *Order Status Page* reflects the updated state on the customer's next visit  
   **BUT** no push notification is sent for status changes in Increment 3 — the customer must check the page or wait for the shipping email  
   **Evidence:** inferred — transactional notification infrastructure is minimal in Increment 3; full notification system lands in Increment 8  

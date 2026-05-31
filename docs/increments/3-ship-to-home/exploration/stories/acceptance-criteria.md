# Acceptance Criteria


---

## Increment 3

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

---
state: acceptance-criteria
increment_scope: Increment 3 — Ship to home
exploration_refresh: Run 4 slot 71
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 69)
---

# Acceptance criteria — Increment 3: Ship to home  

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

# Acceptance Criteria


---

## Increment 7

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

# Acceptance criteria — Increment 7: Returns and refunds — close the loop  

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

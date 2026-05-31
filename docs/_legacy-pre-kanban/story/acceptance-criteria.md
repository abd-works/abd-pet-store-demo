# Acceptance criteria — Increment 7: Returns and refunds

Exploration-phase acceptance criteria for the six stories in **Increment 7 — Returns and refunds — close the loop**. Each story lists domain terms (vocabulary sourced from `ubiquitous-language.md`) and behavioral AC in WHEN / THEN / AND / BUT format with source evidence.

---

## Story: Initiate Return from Order History

**Story type:** Customer

### Domain terms

- *Order History* — chronicle of past *Orders* associated with a *Customer Account*
- *Return* — reversal of part or all of an *Order* initiated from *Order History* or in-store
- *Return Eligibility* — gate determining whether an *Order* or item qualifies for *Return* based on the *Return Window* and item condition
- *Return Request* — *Customer*-submitted initiation of a *Return* specifying items, quantities, and *Return Reason*
- *Return Window* — configured time period after delivery within which a *Return* may be initiated
- *Return Reason* — *Customer*-selected explanation for returning items
- *Returned Items* — subset of *Order Line Items* and quantities the *Customer* is sending back
- *Return Status* — lifecycle state of a *Return*: initiated, label generated, shipped back, received, inspected, *Refund* processing, completed
- *Order* — complete purchase lifecycle from cart through delivery or *Return*
- *Order Line Item* — one product with price snapshot in a confirmed *Order*
- *Customer Account* — registered user profile owning *Order History* and account details

### Acceptance criteria

1. **WHEN** the *Customer* selects "Return" on an eligible *Order* in *Order History*
   **THEN** the system shows which *Order Line Items* are *Return Eligible*
   **AND** the *Customer* selects the items and quantities to return, plus a *Return Reason*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "Someone should be able to initiate a return from their order history"

2. **WHEN** the *Customer* submits the *Return Request*
   **THEN** the system creates the *Return* record, links it to the original *Order*, and shows the next steps (label generation)
   **AND** the *Return Status* appears in the *Customer Account* under the *Order* detail
   **Evidence:** ubiquitous-language.md — Order KA, `return request` concept: "creates the return record, links it to the originating order, and shows next steps"

3. **WHEN** the *Order* is outside the *Return Window* or items are not eligible
   **THEN** the "Return" action is hidden or disabled with a clear reason (e.g. "return window expired")
   **BUT** the *Order* detail is still viewable
   **Evidence:** ubiquitous-language.md — Order KA, `return eligibility` invariant: "the Return action must not appear on an order whose return window has expired"

4. **WHEN** the *Customer* has already initiated a *Return* for some items in the *Order*
   **THEN** those *Returned Items* are shown as "return in progress" and cannot be returned again
   **BUT** remaining eligible *Order Line Items* can still be returned separately
   **Evidence:** ubiquitous-language.md — Order KA, `return` concept: "items already returned show as return in progress and cannot be returned again; remaining eligible items are still returnable"

---

## Story: Generate Return Label or QR Code

**Story type:** System

### Domain terms

- *Return Request* — *Customer*-submitted initiation of a *Return* specifying items, quantities, and reason
- *Return Label* — printable PDF with return address, *Order* number, return reference, and carrier barcode
- *Return QR Code* — mobile-displayable code for carrier drop-off encoding the same return reference as the *Return Label*
- *Return* — reversal of part or all of an *Order*
- *Customer* — person who placed the *Order*
- *Order* — complete purchase lifecycle

### Acceptance criteria

1. **WHEN** the *Return Request* is submitted
   **THEN** the system generates a *Return Label* (PDF) and a *Return QR Code*
   **AND** both are shown on the *Return* confirmation page and emailed to the *Customer*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "print a label or get a QR code"

2. **WHEN** the *Customer* downloads the *Return Label*
   **THEN** the label includes: return address, *Order* number, return reference, and carrier barcode
   **Evidence:** ubiquitous-language.md — Order KA, `return label` concept: "includes return address, order number, return reference, and carrier barcode"

3. **WHEN** the *Customer* chooses the *Return QR Code* option
   **THEN** the *Return QR Code* is displayable on a mobile device at a carrier drop-off point
   **AND** it encodes the same return reference as the *Return Label*
   **Evidence:** ubiquitous-language.md — Order KA, `return QR code` invariant: "encodes the same return reference as the return label"

4. **WHEN** the label/QR generation service is temporarily unavailable
   **THEN** the *Return* is still recorded
   **AND** the *Customer* is told to check back or contact support for the label
   **BUT** the *Return* is not cancelled due to label failure
   **Evidence:** inferred — label generation is a side-effect, not a gate on *Return* creation

---

## Story: Route Refund through Original Payment Vendor

**Story type:** System

### Domain terms

- *Refund* — reverse payment routed through the original *Payment Vendor* triggered by a completed *Return*
- *Payment Vendor* — third-party payment processor behind unified checkout
- *Returned Items* — subset of *Order Line Items* the *Customer* sent back
- *Return* — reversal of part or all of an *Order*
- *StripeWave* — credit and debit card gateway; primary card processor
- *PayNova* — digital wallet integration
- *VaultPay* — buy-now-pay-later integration
- *Refund Status* — lifecycle state of a *Refund*: processing, completed, or requires review
- *Refund Retry* — automatic re-attempt of a failed *Refund* through the same vendor API
- *Instalment Plan* — *VaultPay*-approved payment schedule

### Acceptance criteria

1. **WHEN** the *Returned Items* are received and inspected (or the *Return* is auto-approved)
   **THEN** the system initiates a *Refund* through the original *Payment Vendor* for that *Order*
   **AND** the *Refund* amount matches the *Returned Items* value
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "Refunds go back through whichever payment vendor handled the original transaction"

2. **WHEN** the original payment was via *StripeWave*
   **THEN** the *Refund* routes through *StripeWave*'s refund API
   **AND** the *Customer* sees the credit on their card statement
   **Evidence:** ubiquitous-language.md — Payment KA, `refund` concept: "routes through the vendor that captured the original charge (StripeWave card refunds…)"

3. **WHEN** the original payment was via *PayNova* (digital wallet)
   **THEN** the *Refund* routes through *PayNova*'s refund API
   **Evidence:** ubiquitous-language.md — Payment KA, `refund` invariant: "must always route through the payment vendor that handled the original transaction"

4. **WHEN** the original payment was via *VaultPay* (buy-now-pay-later)
   **THEN** the *Refund* routes through *VaultPay*'s refund API
   **AND** the *Instalment Plan* is adjusted accordingly by *VaultPay*
   **Evidence:** ubiquitous-language.md — Payment KA, `refund` concept: "VaultPay instalment plan adjustments"

5. **WHEN** the *Refund* request to the *Payment Vendor* fails (vendor downtime, API error)
   **THEN** the *Refund* is queued for *Refund Retry*
   **AND** the *Customer* sees *Refund Status* "processing" — not "refund failed"
   **BUT** if retries exhaust, the *Refund Status* escalates to "requires review"
   **Evidence:** ubiquitous-language.md — Payment KA, `refund retry` concept: "on exhaustion transitions refund status to requires review"; `refund status` invariant: "must not show refund failed to the customer"

---

## Story: Track Refund Status

**Story type:** Customer

### Domain terms

- *Refund Status* — lifecycle state of a *Refund* visible to the *Customer*: processing, completed, or requires review
- *Refund* — reverse payment routed through the original *Payment Vendor*
- *Order Detail* — expanded view of an *Order* within *Order History*
- *Order History* — chronicle of past *Orders* associated with a *Customer Account*
- *Order Status Page* — *Customer*-facing surface showing current *Order Status* and delivery or tracking details
- *Customer* — person who placed the *Order*
- *Refund Completed Notification* — transactional notification sent when the *Refund* is completed by the vendor
- *Payment* — financial transaction for an *Order*

### Acceptance criteria

1. **WHEN** the *Customer* views the *Order Detail* for a returned *Order*
   **THEN** the *Refund Status* is visible: processing, completed, or requires review
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "track the refund status"

2. **WHEN** the *Refund* is completed by the *Payment Vendor*
   **THEN** the *Refund Status* transitions to "completed"
   **AND** the *Customer* receives a *Refund Completed Notification* (email)
   **Evidence:** ubiquitous-language.md — Payment KA, `refund status` concept: "transitions to completed when the payment vendor confirms the credit has been issued"

3. **WHEN** the *Refund Status* is "processing" for an extended period
   **THEN** the *Order Detail* shows a note: "refunds typically take X business days depending on your payment provider"
   **Evidence:** ubiquitous-language.md — Payment KA, `refund status` concept: "shows a timing expectation note while in processing state"

4. **WHEN** the *Refund Status* is "requires review"
   **THEN** the *Customer* sees a message to contact support
   **AND** the support team has access to the *Return* and *Refund* details
   **Evidence:** ubiquitous-language.md — Payment KA, `refund` concept: "customer is guided to contact support; support team has full return and refund details"

---

## Story: Process In-Store Return

**Story type:** Store Employee

### Domain terms

- *In-Store Return* — *Return* initiated by a *Store Employee* when a *Customer* brings items back to a physical *Store*
- *Store Employee* — staff member at a *Store* who processes the *In-Store Return*
- *Manager Override* — staff escalation allowing an *In-Store Return* to proceed when standard *Return Eligibility* rules would block it
- *Return Eligibility* — gate determining whether an *Order* or item qualifies for *Return*
- *Return* — reversal of part or all of an *Order*
- *Refund* — reverse payment routed through the original *Payment Vendor*
- *Payment Vendor* — third-party payment processor
- *Order* — complete purchase lifecycle
- *Order History* — chronicle of past *Orders*
- *Guest Email* — email snapshot on a guest *Order*
- *Admin Dashboard* — *(boundary)* staff surface for *Order* lookup and *Return* processing

### Acceptance criteria

1. **WHEN** a *Customer* brings an item to the *Store* for *Return*
   **THEN** the *Admin Dashboard* provides an *Order* lookup by order number or *Customer* email
   **AND** a "Start Return" action is displayed on the matched *Order*
   **Evidence:** requirements-chat-with-product-owner.md — line 25, "For in-store returns it's a different flow but the system should still reflect it in their account"

2. **WHEN** *Store Employee* submits the *In-Store Return*
   **THEN** the system creates a *Return* record linked to the original *Order*
   **AND** triggers the *Refund* through the original *Payment Vendor* (same routing invariant as online *Returns*)
   **AND** the *Return* appears in the *Customer*'s *Order History*
   **Evidence:** ubiquitous-language.md — Order KA, `in-store return` concept: "follows the same refund routing invariant as online returns"

3. **WHEN** the original *Order* was placed by a guest (no account)
   **THEN** the *Order* lookup and *Return* flow work identically using the order number and *Guest Email*
   **AND** the *Refund* routes through the original *Payment Vendor*
   **BUT** the *Return* is not visible in an "account" because the *Customer* has no *Customer Account*
   **Evidence:** ubiquitous-language.md — Order KA, `in-store return` concept: "supports guest order returns using order number and guest email — refund routing is order-level, not account-level"

4. **WHEN** the item is not eligible for *Return* (outside *Return Window*, wrong condition)
   **THEN** the *Admin Dashboard* shows the ineligibility reason
   **AND** a *Manager Override* action is displayed, requiring manager approval before the *Return* proceeds
   **Evidence:** ubiquitous-language.md — Order KA, `manager override` concept: "allowing an in-store return to proceed when standard return eligibility rules would block it"

---

## Story: Send Return and Refund Status Update

**Story type:** System

### Domain terms

- *Return Received Notification* — transactional notification sent when *Returned Items* are received and processing begins
- *Refund Completed Notification* — transactional notification sent when the *Refund* is completed by the vendor with amount and payment method details
- *Refund Under Review Notification* — transactional notification sent when a *Refund* requires manual review
- *Notification* — transactional or marketing message delivered to a *Customer*
- *Return Status* — lifecycle state of a *Return*
- *Refund Status* — lifecycle state of a *Refund*
- *Return* — reversal of part or all of an *Order*
- *Refund* — reverse payment through the original *Payment Vendor*
- *Customer* — person who placed the *Order*
- *Payment* — financial transaction for an *Order*

### Acceptance criteria

1. **WHEN** the *Return* is received and processing begins
   **THEN** the system sends a *Return Received Notification* to the *Customer*
   **Evidence:** ubiquitous-language.md — Notification KA, `return received notification` concept: "sent when returned items are received at the warehouse and processing begins"

2. **WHEN** the *Refund* is completed by the *Payment Vendor*
   **THEN** the system sends a *Refund Completed Notification* with the refunded amount and the *Payment* method it was returned to
   **Evidence:** ubiquitous-language.md — Notification KA, `refund completed notification` concept: "includes the refunded amount and the payment method the credit was returned to"

3. **WHEN** the *Refund* requires manual review (*Payment Vendor* failure, policy exception)
   **THEN** the system sends a *Refund Under Review Notification* with guidance to contact support if needed
   **Evidence:** ubiquitous-language.md — Notification KA, `refund under review notification` concept: "includes guidance to contact support"

4. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the *Notification* is queued for retry
   **AND** the *Return Status* / *Refund Status* is still updated in the system (*Notification* failure does not block processing)
   **Evidence:** ubiquitous-language.md — Notification KA, `return received notification` invariant: "must not block return processing on delivery failure"; same pattern for all three notification types

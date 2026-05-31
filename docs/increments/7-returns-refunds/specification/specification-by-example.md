# Specification By Example


---

## Increment 7

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
increment_scope: Increment 7 — Returns and refunds
specification_refresh: Run 8 slot 181
---

# Specification by Example — Increment 7: Returns and refunds — close the loop

**Refresh:** Run 8 slot 181 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 171), `docs/end-to-end/specification/crc.md` (slot 179), `docs/end-to-end/specification/domain.json`, and `docs/end-to-end/exploration/stories/acceptance-criteria.md` (slot 173). Full *return* lifecycle active: *return request*, *return eligibility*, *return window*, *return label*, *return QR code*, *return status*, *in-store return* with *manager override*. *Refund* lifecycle active: *refund status* (processing → completed or requires review), *refund retry*, vendor-specific routing through *StripeWave*, *PayNova*, and *VaultPay*. Three *return*/*refund* *notification* types introduced: *return received notification*, *refund completed notification*, *refund under review notification*.

---

## Story: Initiate Return from Order History

**Story type:** customer

**Sources / context:** ubiquitous-language.md (Order KA — *return*, *return request*, *return eligibility*, *return window*, *return reason*, *returned items*, *return status*), crc.md (Return, Return Request, Return Eligibility, Return Window, Return Reason, Returned Items, Return Status), acceptance-criteria.md (Initiate Return from Order History AC 1–4)

---

### Scenario 1: Eligible items displayed when customer selects return on a delivered order

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And **Order** *ORD-4401* was delivered on *2026-04-14* with **Order Status** *delivered*
  And **Order** *ORD-4401* contains **Order Line Item** *Premium Dog Kibble 10kg* at *£54.99* × *1*
  And **Order** *ORD-4401* contains **Order Line Item** *Squeaky Bone Chew* at *£12.99* × *2*
  And the current date is *2026-05-07* which is within the **Return Window**
When the **Customer** selects "Return" on **Order** *ORD-4401* in **Order History**
Then the system shows which **Order Line Items** are *Return Eligible*
  And the **Customer** can select items and quantities to return
  And a **Return Reason** picker is displayed

### Scenario 2: Return request submitted and return record created

Given a **Customer Account** *sarah.mitchell@pawplace.example* viewing *Return Eligible* items for **Order** *ORD-4401*
  And **Order Line Item** *Premium Dog Kibble 10kg* is *Return Eligible*
When the **Customer** submits a **Return Request** selecting **Order Line Item** *Premium Dog Kibble 10kg* × *1* with **Return Reason** *changed mind*
Then a **Return** *RTN-7001* is created and linked to **Order** *ORD-4401*
  And the **Return Status** is *initiated*
  And the **Return** confirmation page shows next steps for *Return Label* generation
  And the **Return Status** appears in the **Customer Account** under the **Order** detail

### Scenario 3: Return action hidden when order is outside the return window

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4402* in **Order History**
  And **Order** *ORD-4402* was delivered on *2026-02-05*
  And the current date is *2026-05-07* which is outside the **Return Window**
When the **Customer** views **Order** *ORD-4402* in **Order History**
Then the "Return" action is hidden on **Order** *ORD-4402*
  And a reason is displayed: *"return window expired"*
  And the **Order** detail is still viewable

### Scenario 4: Previously returned items shown as in-progress with remaining items still returnable

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And a **Return** already exists for **Order Line Item** *Premium Dog Kibble 10kg* on **Order** *ORD-4401* with **Return Status** *initiated*
  And **Order** *ORD-4401* also contains **Order Line Item** *Squeaky Bone Chew* × *2* with no prior **Return**
  And the current date is *2026-05-07* which is within the **Return Window**
When the **Customer** selects "Return" on **Order** *ORD-4401*
Then **Order Line Item** *Premium Dog Kibble 10kg* shows *"return in progress"* and cannot be selected
  And **Order Line Item** *Squeaky Bone Chew* shows *Return Eligible* and can be selected for a separate **Return**

---

## Story: Generate Return Label or QR Code

**Story type:** system

**Sources / context:** ubiquitous-language.md (Order KA — *return label*, *return QR code*, *return request*), crc.md (Return Label, Return QR Code, Return), acceptance-criteria.md (Generate Return Label or QR Code AC 1–4)

---

### Scenario 1: Return label and QR code generated on return request submission

Given a **Return Request** for **Return** *RTN-7001* has been submitted for **Order** *ORD-4401*
When the system processes the **Return Request**
Then the system generates a **Return Label** as a printable PDF
  And the system generates a **Return QR Code**
  And both are shown on the **Return** confirmation page
  And both are emailed to **Customer Account** *sarah.mitchell@pawplace.example*

### Scenario 2: Return label includes all required return information

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with a **Return Label** generated
When the **Customer** downloads the **Return Label**
Then the **Return Label** includes the return address *PawPlace Returns Centre*
  And the **Return Label** includes the **Order** number *ORD-4401*
  And the **Return Label** includes the return reference *RTN-7001*
  And the **Return Label** includes a carrier barcode

### Scenario 3: QR code displayable on mobile with same return reference as label

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with a **Return QR Code** generated
When the **Customer** selects the **Return QR Code** option
Then the **Return QR Code** is displayable on a mobile device at a carrier drop-off point
  And the **Return QR Code** encodes the same return reference *RTN-7001* as the **Return Label**

### Scenario 4: Return preserved when label generation service is unavailable

Given a **Return Request** for **Return** *RTN-7002* has been submitted for **Order** *ORD-5502*
  And the *Return Label* generation service is temporarily unavailable
When the system attempts to generate the **Return Label** and **Return QR Code**
Then the **Return** *RTN-7002* is still recorded with **Return Status** *initiated*
  And the **Customer** is told to check back or contact support for the label
  And the **Return** is not cancelled due to label generation failure

---

## Story: Route Refund through Original Payment Vendor

**Story type:** system

**Sources / context:** ubiquitous-language.md (Payment KA — *refund*, *refund status*, *refund retry*, *payment vendor*, *StripeWave*, *PayNova*, *VaultPay*, *instalment plan*), crc.md (Refund, Refund Status, Refund Retry, Payment Vendor, StripeWave, PayNova, VaultPay), acceptance-criteria.md (Route Refund through Original Payment Vendor AC 1–5)

---

### Scenario 1: Refund routed through StripeWave for card payment

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with **Returned Items** *Premium Dog Kibble 10kg* valued at *£54.99*
  And **Order** *ORD-4401* was paid via **Payment Vendor** *StripeWave* with **Vendor Transaction Reference** *sw_txn_4401*
  And the **Returned Items** are received and inspection passes
When the system initiates the **Refund**
Then a **Refund** *REF-3001* is created with a **Refund** amount of *£54.99*
  And the **Refund** routes through **StripeWave**'s refund API
  And the **Customer** sees the credit on their card statement

### Scenario 2: Refund routed through PayNova for digital wallet payment

Given a **Return** *RTN-7002* for **Order** *ORD-5502* with **Returned Items** *Ceramic Feeding Bowl* valued at *£24.99*
  And **Order** *ORD-5502* was paid via **Payment Vendor** *PayNova* with **Vendor Transaction Reference** *pn_txn_5502*
  And the **Returned Items** are received and inspection passes
When the system initiates the **Refund**
Then a **Refund** *REF-3002* is created with a **Refund** amount of *£24.99*
  And the **Refund** routes through **PayNova**'s refund API

### Scenario 3: Refund routed through VaultPay with instalment plan adjustment

Given a **Return** *RTN-7003* for **Order** *ORD-6603* with **Returned Items** *Premium Cat Tree Deluxe* valued at *£199.99*
  And **Order** *ORD-6603* was paid via **Payment Vendor** *VaultPay* with **Vendor Transaction Reference** *vp_txn_6603*
  And the **Returned Items** are received and inspection passes
When the system initiates the **Refund**
Then a **Refund** *REF-3003* is created with a **Refund** amount of *£199.99*
  And the **Refund** routes through **VaultPay**'s refund API
  And the **Instalment Plan** is adjusted accordingly by **VaultPay**

### Scenario 4: Refund queued for retry on vendor failure

Given a **Refund** *REF-3001* for **Return** *RTN-7001* routed through **Payment Vendor** *StripeWave*
When the **Refund** request to **StripeWave** fails due to *vendor downtime*
Then the **Refund** is queued for **Refund Retry**
  And the **Customer** sees **Refund Status** *processing* — not *"refund failed"*

### Scenario 5: Refund escalated to requires review after retry exhaustion

Given a **Refund** *REF-3001* for **Return** *RTN-7001* routed through **Payment Vendor** *StripeWave*
  And all **Refund Retry** attempts are exhausted
When the final **Refund Retry** fails
Then the **Refund Status** transitions to *requires review*
  And the **Customer** sees a message to contact support
  And the support team has access to the **Return** and **Refund** details

---

## Story: Track Refund Status

**Story type:** customer

**Sources / context:** ubiquitous-language.md (Payment KA — *refund status*, *refund*; Order KA — *order detail*, *order history*; Notification KA — *refund completed notification*), crc.md (Refund Status, Refund, Refund Completed Notification), acceptance-criteria.md (Track Refund Status AC 1–4)

---

### Scenario 1: Refund status visible as processing on order detail

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And **Order** *ORD-4401* has a **Return** *RTN-7001* with **Refund** *REF-3001*
  And the **Refund Status** is *processing*
When the **Customer** views the **Order Detail** for **Order** *ORD-4401*
Then the **Refund Status** is visible as *processing*

### Scenario 2: Refund completed with notification sent to customer

Given a **Refund** *REF-3002* for **Return** *RTN-7002* on **Order** *ORD-5502* with **Refund Status** *processing*
  And **Refund** *REF-3002* was routed through **Payment Vendor** *PayNova*
When **PayNova** confirms the **Refund** is complete
Then the **Refund Status** transitions to *completed*
  And the **Customer** receives a **Refund Completed Notification** with the refunded amount *£24.99* and the **Payment** method *PayNova digital wallet*

### Scenario 3: Extended processing shows timing expectation note

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And **Order** *ORD-4401* has **Refund** *REF-3001* with **Refund Status** *processing*
When the **Customer** views the **Order Detail** for **Order** *ORD-4401*
Then the **Order Detail** shows a note: *"refunds typically take 5–10 business days depending on your payment provider"*

### Scenario 4: Requires review status shows support guidance

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-6603* in **Order History**
  And **Order** *ORD-6603* has **Refund** *REF-3003* with **Refund Status** *requires review*
When the **Customer** views the **Order Detail** for **Order** *ORD-6603*
Then the **Customer** sees a message to contact support
  And the support team has access to the **Return** and **Refund** details

---

## Story: Process In-Store Return

**Story type:** store employee

**Sources / context:** ubiquitous-language.md (Order KA — *in-store return*, *manager override*, *return eligibility*; boundary *admin dashboard*), crc.md (In-Store Return, Manager Override, Return Eligibility), acceptance-criteria.md (Process In-Store Return AC 1–4)

---

### Scenario 1: In-store return submitted via order lookup on admin dashboard

Given a **Store Employee** at **Store** *PawPlace Camden*
  And a **Customer Account** *sarah.mitchell@pawplace.example* brings **Order Line Item** *Premium Dog Kibble 10kg* to the **Store** for **Return**
  And **Order** *ORD-4401* is within the **Return Window**
  And **Order** *ORD-4401* was paid via **Payment Vendor** *StripeWave*
When the **Store Employee** looks up **Order** *ORD-4401* by order number on the **Admin Dashboard**
  And the **Store Employee** selects "Start Return" and submits the **In-Store Return**
Then a **Return** is created and linked to **Order** *ORD-4401*
  And a **Refund** is triggered through the original **Payment Vendor** *StripeWave*
  And the **Return** appears in the **Customer Account** *sarah.mitchell@pawplace.example* **Order History** under the **Order** detail

### Scenario 2: Guest order return processed using order number and guest email

Given a **Store Employee** at **Store** *PawPlace Camden*
  And a guest **Customer** brings items from **Order** *ORD-7704* to the **Store** for **Return**
  And **Order** *ORD-7704* was placed as a guest order with **Guest Email** *alex.rivera@example.com*
  And **Order** *ORD-7704* was paid via **Payment Vendor** *PayNova*
  And **Order** *ORD-7704* is within the **Return Window**
When the **Store Employee** looks up **Order** *ORD-7704* by order number and **Guest Email** *alex.rivera@example.com* on the **Admin Dashboard**
  And the **Store Employee** submits the **In-Store Return**
Then a **Return** is created and linked to **Order** *ORD-7704*
  And the **Refund** routes through the original **Payment Vendor** *PayNova*
  And the **Return** is not visible in an "account" because the **Customer** has no **Customer Account**

### Scenario 3: Ineligible item flagged with manager override option

Given a **Store Employee** at **Store** *PawPlace Camden*
  And a **Customer** brings **Order Line Item** *Orthopaedic Dog Bed Large* from **Order** *ORD-4402* to the **Store**
  And **Order** *ORD-4402* was delivered on *2026-02-05* and the **Return Window** has expired
When the **Store Employee** looks up **Order** *ORD-4402* on the **Admin Dashboard**
Then the **Admin Dashboard** shows the ineligibility reason: *"return window expired"*
  And a **Manager Override** action is displayed, requiring manager approval before the **Return** proceeds

### Scenario 4: Manager override approves return for ineligible item

Given a **Store Employee** at **Store** *PawPlace Camden*
  And **Order** *ORD-4402* with **Order Line Item** *Orthopaedic Dog Bed Large* has failed **Return Eligibility**
  And the **Admin Dashboard** is showing the **Manager Override** action
  And **Order** *ORD-4402* was paid via **Payment Vendor** *StripeWave*
When a manager approves the **Manager Override** with override reason *"customer goodwill — long-standing customer"*
Then the **In-Store Return** proceeds for **Order** *ORD-4402*
  And a **Return** is created and linked to **Order** *ORD-4402*
  And a **Refund** is triggered through the original **Payment Vendor** *StripeWave*
  And the approving manager and override reason are recorded for audit

---

## Story: Send Return and Refund Status Update

**Story type:** system

**Sources / context:** ubiquitous-language.md (Notification KA — *return received notification*, *refund completed notification*, *refund under review notification*, *notification*), crc.md (Return Received Notification, Refund Completed Notification, Refund Under Review Notification, Notification), acceptance-criteria.md (Send Return and Refund Status Update AC 1–4)

---

### Scenario 1: Return received notification sent when returned items arrive at warehouse

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with **Returned Items** *Premium Dog Kibble 10kg*
  And the **Customer Account** email is *sarah.mitchell@pawplace.example*
When the **Return Status** transitions to *received*
Then the system sends a **Return Received Notification** to the **Customer**
  And the **Return Received Notification** includes the **Order** number *ORD-4401*, the **Returned Items** summary, and a note that inspection and **Refund** processing are underway

### Scenario 2: Refund completed notification sent with amount and payment method

Given a **Refund** *REF-3002* for **Return** *RTN-7002* on **Order** *ORD-5502*
  And the **Refund** was routed through **Payment Vendor** *PayNova*
  And the **Customer Account** email is *sarah.mitchell@pawplace.example*
When the **Refund Status** transitions to *completed*
Then the system sends a **Refund Completed Notification** to the **Customer**
  And the **Refund Completed Notification** includes the refunded amount *£24.99* and the **Payment** method *PayNova digital wallet*

### Scenario 3: Refund under review notification sent with support guidance

Given a **Refund** *REF-3003* for **Return** *RTN-7003* on **Order** *ORD-6603*
  And the **Customer Account** email is *sarah.mitchell@pawplace.example*
  And **Refund Retry** has exhausted all attempts
When the **Refund Status** transitions to *requires review*
Then the system sends a **Refund Under Review Notification** to the **Customer**
  And the **Refund Under Review Notification** includes guidance to contact support and a reference to the **Return** and **Order** details

### Scenario 4: Notification queued when email delivery system is unavailable

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with **Return Status** *received*
  And the email delivery system is temporarily unavailable
When the system attempts to send the **Return Received Notification**
Then the **Notification** is queued for retry
  And the **Return Status** is still updated in the system
  And the **Refund Status** is still updated in the system
  And **Notification** failure does not block *return* or *refund* processing

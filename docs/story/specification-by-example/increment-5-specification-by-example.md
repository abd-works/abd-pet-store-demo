---
state: specification-by-example
increment_scope: Increment 5 — Pay your way
specification_refresh: Run 6 slot 129
---

# Specification by Example — Increment 5: Pay your way — multi-vendor payment with retries

**Refresh:** Run 6 slot 129 — aligned to `docs/domain/ubiquitous-language.md` (slot 119), `docs/domain/crc.md` (slot 127), `docs/domain/domain.json`, and `docs/story/acceptance-criteria/increment-5-acceptance-criteria.md`. *StripeWave*, *PayNova*, and *VaultPay* are all active at the *payment method selector*; *payment retry* applies to *transient error* across all three vendors; *hard decline* never auto-retries. *Guest checkout* and Increments 1–4 paths remain valid. Full *return* customer flow deferred to Increment 7.

---

## Story: `Process Digital Wallet Payment via PayNova`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-5-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_total | order_status | currency |
|---|---|---|---|---|
| 1 | ORD-2001 | 85.00 | pending | GBP |
| 2 | ORD-2002 | 45.00 | pending | GBP |

### Customer Account:

| scenario | email_address | account_verification_status |
|---|---|---|
| 1 | jane.doe@example.com | verified |

---

### Scenario 1: `PayNova selection launches digital wallet authentication`

Given an **Order** with **order number** *ORD-2001* and **order status** *pending*
And the customer reaches the **Payment Method Selector**
When the customer selects **PayNova** at the **Payment Method Selector**
Then checkout redirects to or embeds the **PayNova** **digital wallet** authentication flow
And the customer authorises **Payment** using **mobile wallet credentials**

### Scenario 2: `Customer cancels PayNova wallet and other vendors remain selectable`

Given an **Order** with **order number** *ORD-2001* and **order status** *pending*
And the customer selected **PayNova** at the **Payment Method Selector**
When the customer cancels the **PayNova** wallet authentication flow
Then **StripeWave** and **VaultPay** remain selectable at the **Payment Method Selector**
And the **Order** **order status** remains *pending*

### Scenario 3: `PayNova payment confirmation confirms order and sends confirmation email`

Given an **Order** with **order number** *ORD-2001*, **order total** *£85.00*, and **order status** *pending*
When **PayNova** returns **Payment Confirmation** with **vendor confirmation reference** *pn_txn_7890*
Then a **Payment** is recorded with **processing vendor** *PayNova*, **vendor transaction reference** *pn_txn_7890*, **payment amount** *£85.00*, and **payment status** *captured*
And the **Order** **order status** transitions to *confirmed*
And the system sends a **Confirmation Email** to the customer
And the **Order Confirmation Page** is displayed

### Scenario Outline 1: `PayNova hard decline surfaces reason and alternative vendors`

Given an **Order** with **order number** {order_number} and **order status** *pending*
When **PayNova** returns a **Hard Decline** with **decline reason** {decline_reason}
Then the customer sees a clear error message: {decline_reason}
And the **Payment Method Selector** displays alternatives: *retry PayNova*, *StripeWave*, and *VaultPay*
And the **Order** **order status** remains *pending*
And no **Confirmation Email** is sent

#### Examples:

| scenario | order_number | decline_reason |
|---|---|---|
| 1 | ORD-2001 | insufficient wallet balance |
| 2 | ORD-2001 | wallet locked |

---

### Payment:

| scenario | payment_reference | order_number | processing_vendor | payment_status |
|---|---|---|---|---|
| 1 | pay_pn_pending_001 | ORD-2001 | PayNova | pending |

---

### Scenario 4: `PayNova webhook reconciles successful payment after timeout`

Given a **Payment** with **payment reference** *pay_pn_pending_001* for **Order** *ORD-2001* through **PayNova**
And the initial **PayNova** response timed out before **Payment Confirmation**
When a **Webhook Callback** from **PayNova** arrives with **vendor transaction reference** *pn_txn_7890* and reconciliation status *captured*
Then the system reconciles the **Webhook Callback** against the pending **Payment**
And **Payment** **payment status** transitions to *captured*
And the **Order** **order status** transitions to *confirmed*
And the **Confirmation Email** fires

### Scenario 5: `PayNova webhook failure leaves order unpaid`

Given a **Payment** with **payment reference** *pay_pn_pending_001* for **Order** *ORD-2001* through **PayNova**
And the initial **PayNova** response timed out
When a **Webhook Callback** from **PayNova** arrives with reconciliation status *failed*
Then **Payment** **payment status** transitions to *failed*
And the **Order** **order status** remains *pending*
And the customer is notified to retry at the **Payment Method Selector**

---

### Scenario 6: `Logged-in customer offered PayNova wallet save after successful payment`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
And **Payment** through **PayNova** with **vendor transaction reference** *pn_txn_7890* completed successfully
When checkout completes
Then the system offers to save **PayNova** as a **Saved Payment Method** on the **Customer Account**
And if accepted, a **Saved Payment Method** is created with **vendor-token reference** *tok_pn_wallet_001* and **wallet provider** *PayNova Wallet*
And wallet secrets are not stored on the **Customer Account**

---

## Story: `Process Buy-Now-Pay-Later via VaultPay`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-5-acceptance-criteria.md

---

### Scenario 1: `VaultPay selection performs eligibility check and presents instalment plan`

Given an **Order** with **order number** *ORD-2003*, **order total** *£200.00*, and **order status** *pending*
When the customer selects **VaultPay** at the **Payment Method Selector**
Then checkout redirects to or embeds the **VaultPay** **buy-now-pay-later** flow
And **VaultPay** performs the **Eligibility Check**
And **VaultPay** presents an **Instalment Plan** of *4* payments of *£50.00*

### Scenario 2: `VaultPay instalment acceptance confirms order`

Given an **Order** with **order number** *ORD-2003*, **order total** *£200.00*, and **order status** *pending*
And **VaultPay** presented an **Instalment Plan** of *4* payments of *£50.00*
When the customer accepts the **Instalment Plan**
And **VaultPay** returns **Payment Confirmation** with **vendor confirmation reference** *vp_ref_5001*
Then a **Payment** is recorded with **processing vendor** *VaultPay*, **vendor transaction reference** *vp_ref_5001*, **payment amount** *£200.00*, and **payment status** *captured*
And the **Instalment Plan** reference is stored on the **Payment**
And the **Order** **order status** transitions to *confirmed*
And the system sends a **Confirmation Email**
And the **Order Confirmation Page** is displayed

### Scenario Outline 1: `VaultPay hard decline offers StripeWave and PayNova alternatives`

Given an **Order** with **order number** *ORD-2003* and **order status** *pending*
When **VaultPay** returns a **Hard Decline** with **decline reason** {decline_reason}
Then the customer sees a clear message that **buy-now-pay-later** is not available: {decline_reason}
And the **Payment Method Selector** displays **StripeWave** and **PayNova** as alternatives
And the **Order** **order status** remains *pending*

#### Examples:

| scenario | decline_reason |
|---|---|
| 1 | eligibility failed |
| 2 | credit check failed |

---

### Payment:

| scenario | payment_reference | order_number | processing_vendor | payment_status |
|---|---|---|---|---|
| 1 | pay_vp_pending_001 | ORD-2003 | VaultPay | pending |

---

### Scenario 3: `VaultPay webhook reconciles successful BNPL payment after timeout`

Given a **Payment** with **payment reference** *pay_vp_pending_001* for **Order** *ORD-2003* through **VaultPay**
And the initial **VaultPay** response timed out
When a **Webhook Callback** from **VaultPay** arrives with **vendor transaction reference** *vp_ref_5001* and reconciliation status *captured*
Then the system reconciles the **Webhook Callback** against the pending **Payment**
And **Payment** **payment status** transitions to *captured*
And the **Order** **order status** transitions to *confirmed*
And the **Confirmation Email** fires

### Scenario 4: `VaultPay webhook failure leaves order unpaid`

Given a **Payment** with **payment reference** *pay_vp_pending_001* for **Order** *ORD-2003* through **VaultPay**
And the initial **VaultPay** response timed out
When a **Webhook Callback** from **VaultPay** arrives with reconciliation status *failed*
Then **Payment** **payment status** transitions to *failed*
And the **Order** **order status** remains *pending*
And the customer is notified to retry

---

### Scenario 5: `VaultPay saved identity pre-fills but eligibility check runs each transaction`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
And **Payment** through **VaultPay** with **vendor transaction reference** *vp_ref_5001* completed successfully
When the customer accepts saving **VaultPay** as a **Saved Payment Method**
Then a **Saved Payment Method** is created with **vendor-token reference** *tok_vp_identity_001* and **processing vendor** *VaultPay*
And future **VaultPay** checkout pre-fills the customer's **VaultPay** identity
And the **Eligibility Check** is still performed on the next **VaultPay** transaction

---

## Story: `Retry Failed Payment`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-5-acceptance-criteria.md

---

### Retry Window:

| scenario | maximum_attempt_count | time_limit |
|---|---|---|
| 1 | 3 | 5 minutes |

---

### Scenario 1: `Transient error triggers automatic payment retry with indicator`

Given a **Payment** with **payment reference** *pay_pn_retry_001* for **Order** *ORD-2001* through **PayNova**
And **Payment** **payment status** is *failed* due to a **Transient Error** with **failure type** *network timeout*
When the system evaluates the failure
Then the system automatically initiates **Payment Retry** through the same **PayNova** **processing vendor**
And the customer sees a *retrying payment* indicator at the **Payment Method Selector**
And no manual action is required during automatic retries

### Scenario 2: `Successful payment retry confirms order`

Given a **Payment** with **payment reference** *pay_pn_retry_001* for **Order** *ORD-2001* through **PayNova*
And **Payment Retry** was initiated due to **Transient Error** *vendor 5xx*
When the **Payment Retry** succeeds
Then **Payment** **payment status** transitions to *captured*
And the **Order** **order status** transitions to *confirmed*
And the customer sees the **Order Confirmation Page**
And the **Confirmation Email** fires

### Scenario Outline 1: `Retry exhaustion returns customer to payment method selector`

Given a **Payment** with **payment reference** {payment_reference} for **Order** {order_number} through {processing_vendor}
And **Payment** **payment status** is *failed* due to **Transient Error** {failure_type}
And **Payment Retry** **attempt count** has reached **Retry Window** **maximum attempt count** *3*
When the final **Payment Retry** also fails
Then the customer is notified that **Payment** could not be processed
And the **Payment Method Selector** displays **StripeWave**, **PayNova**, **VaultPay**, and manual card entry
And only one charge attempt occurs per **Payment Retry** cycle

#### Examples:

| scenario | payment_reference | order_number | processing_vendor | failure_type |
|---|---|---|---|---|
| 1 | pay_pn_retry_002 | ORD-2001 | PayNova | network timeout |
| 2 | pay_vp_retry_001 | ORD-2003 | VaultPay | vendor 5xx |
| 3 | pay_sw_retry_001 | ORD-2004 | StripeWave | network timeout |

---

### Scenario Outline 2: `Hard decline never triggers automatic payment retry`

Given a **Payment** with **payment reference** {payment_reference} for **Order** {order_number} through {processing_vendor}
And **Payment** **payment status** is *failed* due to **Hard Decline** with **decline reason** {decline_reason}
When the system evaluates whether to retry
Then the system does not initiate **Payment Retry**
And the customer is immediately shown **Hard Decline** **decline reason** {decline_reason}
And the **Payment Method Selector** displays alternative **Payment Vendor** options

#### Examples:

| scenario | payment_reference | order_number | processing_vendor | decline_reason |
|---|---|---|---|---|
| 1 | pay_sw_decline_001 | ORD-2004 | StripeWave | insufficient funds |
| 2 | pay_sw_decline_002 | ORD-2004 | StripeWave | card blocked |
| 3 | pay_sw_decline_003 | ORD-2004 | StripeWave | fraud flag |
| 4 | pay_vp_decline_001 | ORD-2003 | VaultPay | BNPL eligibility failure |

---

### Scenario 3: `Background payment retry confirms order after customer navigates away`

Given a **Payment** with **payment reference** *pay_pn_retry_003* for **Order** *ORD-2001* is in **Payment Retry** due to **Transient Error**
And the customer navigates away from checkout
When the **Payment Retry** completes successfully
Then **Payment Retry** **background continuation flag** is *true*
And the **Order** **order status** transitions to *confirmed*
And the **Confirmation Email** fires
And the customer is notified via **Notification** with **notification channel** *email*

### Scenario 4: `Background payment retry exhaustion leaves order unpaid`

Given a **Payment** with **payment reference** *pay_vp_retry_002* for **Order** *ORD-2003* is in **Payment Retry** due to **Transient Error**
And the customer navigates away from checkout
When all **Payment Retry** attempts exhaust within the **Retry Window**
Then the **Order** **order status** remains *pending*
And the customer is notified via **Notification** that **Payment** could not be processed

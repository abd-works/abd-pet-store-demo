# Acceptance criteria — Increment 5: Pay your way — multi-vendor payment with retries  

**Increment outcome:** Customers can pay with *PayNova* (mobile wallet) and *VaultPay* (buy-now-pay-later) in addition to *StripeWave*. Failed payments retry automatically across all three. Lifts conversion among younger buyers and basket-size on premium items.  

**Builds on:** Increments 1-4 (full e-commerce spine, accounts, saved payment methods, StripeWave integration live).  

---  

## Story: `Process Digital Wallet Payment via PayNova`  

**Story type:** system  

### Domain terms  

- *PayNova* — the digital/mobile wallet payment vendor  
- *Digital Wallet* — the customer's mobile payment instrument  
- *Payment Vendor* — the abstraction shared by StripeWave, PayNova, and VaultPay  
- *Authorize-Capture-Settle* — the payment processing flow (same phases as StripeWave)  
- *Webhook Callback* — PayNova's asynchronous notification of transaction status  

### Acceptance criteria  

1. **WHEN** the customer selects *PayNova* (*Digital Wallet*) at the payment step  
   **THEN** the system redirects to or embeds the PayNova wallet authentication flow  
   **AND** the customer authorises the payment using their mobile wallet credentials  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "PayNova covers digital wallets and mobile payments"  

2. **WHEN** PayNova returns a successful payment confirmation  
   **THEN** the order status transitions to *Confirmed*  
   **AND** the *Payment* is recorded with vendor = PayNova and the vendor's transaction reference  
   **AND** the system proceeds to send the order confirmation (email, page)  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "The system should handle all the webhook callbacks, payment confirmations"  

3. **WHEN** PayNova declines the payment (insufficient balance, wallet locked, etc.)  
   **THEN** the customer sees a clear error message with the decline reason (as much as PayNova provides)  
   **AND** the payment step displays options to retry with PayNova, switch to StripeWave, or switch to VaultPay  
   **BUT** no order is created and no confirmation is sent  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "failed payment retries"; domain-sketch.md — Payment KA, `payment` concept: "handles webhook callbacks, payment confirmations, and failed payment retries"  

4. **WHEN** the PayNova *Webhook Callback* arrives after a timeout  
   **THEN** the system reconciles the callback against the pending order (same pattern as StripeWave in Increment 2)  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "webhook callbacks"  

5. **WHEN** a logged-in customer completes a PayNova payment  
   **THEN** the system offers to save PayNova as a *Saved Payment Method* under the customer account (same save-payment flow as Increment 4, vendor = PayNova)  
   **Evidence:** domain-sketch.md — Payment KA, `saved payment method` concept: "tokenised reference stored under the customer account"  

---  

## Story: `Process Buy-Now-Pay-Later via VaultPay`  

**Story type:** system  

### Domain terms  

- *VaultPay* — the buy-now-pay-later (BNPL) payment vendor  
- *Instalment Plan* — VaultPay's payment schedule (e.g. 4 fortnightly payments)  
- *Payment Vendor* — the abstraction shared by StripeWave, PayNova, and VaultPay  
- *Webhook Callback* — VaultPay's asynchronous notification of transaction status  
- *Eligibility Check* — VaultPay's pre-qualification step (assessed by VaultPay, not PawPlace)  

### Acceptance criteria  

1. **WHEN** the customer selects *VaultPay* (*Buy-Now-Pay-Later*) at the payment step  
   **THEN** the system redirects to or embeds VaultPay's BNPL flow  
   **AND** VaultPay performs the *Eligibility Check* and presents the *Instalment Plan* to the customer  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "VaultPay handles buy-now-pay-later, which is massive for bigger purchases"  

2. **WHEN** the customer accepts the *Instalment Plan* and VaultPay approves  
   **THEN** the order status transitions to *Confirmed*  
   **AND** the *Payment* is recorded with vendor = VaultPay and the instalment reference  
   **AND** the system proceeds to send the order confirmation  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "payment confirmations"  

3. **WHEN** VaultPay declines the BNPL application (eligibility failed, credit check failed, etc.)  
   **THEN** the customer sees a clear message that BNPL is not available for this transaction  
   **AND** the payment step displays StripeWave and PayNova as alternative options  
   **BUT** no order is created — the decline is VaultPay's decision, not PawPlace's  
   **Evidence:** domain-sketch.md — Payment KA, `payment vendor` concept: "each vendor handles its own approve/decline"  

4. **WHEN** the VaultPay *Webhook Callback* arrives after a timeout  
   **THEN** the system reconciles the callback against the pending order (same pattern as StripeWave/PayNova)  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "webhook callbacks"  

5. **WHEN** a logged-in customer completes a VaultPay payment  
   **THEN** the system offers to save VaultPay as a *Saved Payment Method*  
   **AND** future VaultPay usage pre-fills the customer's VaultPay identity — they still go through the eligibility check per transaction  
   **Evidence:** inferred — BNPL eligibility is per-transaction; saving the method saves identity, not approval  

---  

## Story: `Retry Failed Payment`  

**Story type:** system  

### Domain terms  

- *Payment Retry* — an automatic re-attempt of a failed payment after a transient error  
- *Retry Window* — the time period during which retries are attempted (e.g. minutes, not days)  
- *Payment Vendor* — StripeWave, PayNova, or VaultPay — the retry routes through the same vendor  
- *Transient Error* — a temporary failure (network timeout, vendor downtime) distinct from a hard decline  
- *Hard Decline* — a definitive refusal (insufficient funds, blocked card) that should not be retried  

### Acceptance criteria  

1. **WHEN** a *Payment* fails due to a *Transient Error* (timeout, vendor 5xx, network issue)  
   **THEN** the system automatically retries the payment through the same *Payment Vendor*  
   **AND** the customer sees a "retrying payment" indicator — no manual action required  
   **Evidence:** requirements-chat-with-product-owner.md — line 17, "failed payment retries"  

2. **WHEN** the *Payment Retry* succeeds  
   **THEN** the order transitions to *Confirmed* as if the first attempt had succeeded  
   **AND** the customer sees the *Order Confirmation Page* and receives the confirmation email  
   **Evidence:** domain-sketch.md — Payment KA, `payment` concept: "handles webhook callbacks, payment confirmations, and failed payment retries"  

3. **WHEN** the *Payment Retry* fails again within the *Retry Window*  
   **THEN** the system retries up to a maximum retry count (e.g. 3 attempts)  
   **AND** after the final retry fails, the customer is notified that payment could not be processed  
   **AND** the payment step displays alternative payment methods and a manual card entry form  
   **Evidence:** inferred — retry exhaustion; number of retries is a configuration, not a domain invariant  

4. **WHEN** a *Payment* fails due to a *Hard Decline* (insufficient funds, card blocked, fraud flag)  
   **THEN** the system does **not** automatically retry  
   **AND** the customer is immediately shown the decline reason and offered alternatives (different card, different vendor)  
   **Evidence:** inferred — retrying a hard decline wastes time and may trigger vendor fraud flags  

5. **WHEN** a *Payment Retry* is in progress and the customer navigates away  
   **THEN** the retry continues in the background  
   **AND** if it succeeds, the order is confirmed and the confirmation email fires  
   **BUT** if all retries exhaust, the order remains unpaid and the customer is notified (via guest email or account notification)  
   **Evidence:** inferred — retry should not depend on the customer keeping the page open  

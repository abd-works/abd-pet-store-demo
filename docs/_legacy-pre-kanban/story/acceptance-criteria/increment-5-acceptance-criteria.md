---
state: acceptance-criteria
increment_scope: Increment 5 — Pay your way
exploration_refresh: Run 6 slot 121
ul_source: docs/end-to-end/exploration/domain/ubiquitous-language.md (slot 119)
---

# Acceptance criteria — Increment 5: Pay your way — multi-vendor payment with retries

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

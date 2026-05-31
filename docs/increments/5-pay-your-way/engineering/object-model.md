# Object Model


---

## increment-5-walkthrough

<!-- migrated from: increments/5-pay-your-way/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 5 — Pay your way
specification_refresh: Run 6 slot 131
prior_model: crc.md
---

# Module: PawPlace

Walk Increment 5 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). *StripeWave*, *PayNova*, and *VaultPay* are all active at the *payment method selector*; *payment retry* applies to *transient error* across all three vendors; *hard decline* never auto-retries. *Guest checkout* and Increments 1–4 paths remain valid. Full *return* customer flow deferred to Increment 7.

## Scope

**Increment:** Pay your way — multi-vendor payment with retries

**Stories:**

- Process Digital Wallet Payment via PayNova
- Process Buy-Now-Pay-Later via VaultPay
- Retry Failed Payment

**Source graph:** `docs/end-to-end/discovery/stories/story-graph.json` (Increment 5 thin slice)

---

# Core Domain

## **Payment**

Multi-vendor checkout, webhook reconciliation, transient-error retry policy, hard-decline handling, and saved payment method opt-in across *StripeWave*, *PayNova*, and *VaultPay*.

### **Process Digital Wallet Payment via PayNova — selection, cancel, confirm, decline, webhook, save**

**Purpose:** Validate *PayNova* *digital wallet* authentication, cancel path preserving vendor alternatives, successful capture, *hard decline* surfacing, *webhook callback* reconciliation after timeout, and logged-in *saved payment method* opt-in.
**Concepts traced:** Payment Method Selector, PayNova, Digital Wallet, Payment, Payment Confirmation, Vendor Transaction Reference, Hard Decline, Webhook Callback, Order, Confirmation Email, Saved Payment Method, Customer Account

#### Walk 1 — Covers: PayNova selection launches digital wallet authentication

```
order: Order = Order.byNumber("ORD-2001")
assert order.orderStatus == "pending"
assert order.orderTotal == 85.00
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
// Payment Method Selector.present PayNova digital wallet → PayNova, Digital Wallet
selector.presentPayNovaDigitalWallet()
// PayNova.redirect or embed wallet auth → Digital Wallet
authFlow: DigitalWallet = PayNova.redirectOrEmbedWalletAuth(order)
assert authFlow.channel == "mobile wallet credentials"
// Payment Method Selector.route charge to selected vendor → Payment, PayNova
payment: Payment = Payment.processThroughSelectedVendor(
    order: order,
    vendor: PayNova,
    selector: selector
)
assert payment.processingVendor is PayNova
assert payment.paymentStatus == "pending"
return payment
```

#### Walk 2 — Covers: customer cancels PayNova wallet and other vendors remain selectable

```
order: Order = Order.byNumber("ORD-2001")
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
selector.presentPayNovaDigitalWallet()
authFlow: DigitalWallet = PayNova.redirectOrEmbedWalletAuth(order)
// customer cancels before authorisation — no Payment Confirmation
authFlow.cancel()
assert selector.presentStripeWaveCardEntry() == available
assert selector.presentVaultPayBuyNowPayLater() == available
assert order.orderStatus == "pending"
// invariant: must not confirm order until selected vendor returns payment confirmation
assert PaymentConfirmation.forOrder(order) == null
return selector
```

#### Walk 3 — Covers: PayNova payment confirmation confirms order and sends confirmation email

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.byReference("pay_pn_pending_001")
assert payment.processingVendor is PayNova
confirmation: PaymentConfirmation = PayNova.returnPaymentConfirmation(
    vendorConfirmationReference: "pn_txn_7890"
)
// Payment Confirmation.confirm associated order → Order, Stock Availability
PaymentConfirmation.confirmAssociatedOrder(confirmation, order)
assert payment.paymentStatus == "captured"
assert payment.vendorTransactionReference.vendorAssignedIdentifier == "pn_txn_7890"
assert order.orderStatus == "confirmed"
// Payment Confirmation.trigger confirmation email → Notification, Confirmation Email
email: ConfirmationEmail = PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
assert email.recipient == order.placingParty
return order
```

#### Walk 4 — Covers: PayNova hard decline surfaces reason and alternative vendors

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.processThroughSelectedVendor(order, vendor: PayNova)
decline: HardDecline = PayNova.returnHardDecline(declineReason: "insufficient wallet balance")
// Payment.surface hard decline immediately → Hard Decline, Payment Method Selector
Payment.surfaceHardDeclineImmediately(payment, decline)
// Hard Decline.surface immediately at selector → Payment Method Selector, PayNova
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
// Payment Method Selector.display alternatives on decline
alternatives: VendorOption[] = PaymentMethodSelector.displayAlternativesOnDecline(
    decline, vendors: [PayNova, StripeWave, VaultPay]
)
assert alternatives.contains(retry: PayNova)
assert alternatives.contains(StripeWave)
assert alternatives.contains(VaultPay)
assert order.orderStatus == "pending"
// invariant: must not trigger automatic payment retry for hard decline
assert PaymentRetry.forPayment(payment) == null
return selector
```

#### Walk 5 — Covers: PayNova webhook reconciles successful payment after timeout

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.byReference("pay_pn_pending_001")
assert payment.paymentStatus == "pending"
// initial PayNova response timed out — Transient Error classified but webhook arrives
callback: WebhookCallback = PayNova.sendWebhookCallback(
    vendorTransactionReference: "pn_txn_7890",
    reconciliationStatus: "captured"
)
// Payment.reconcile via webhook callback → Webhook Callback
Payment.reconcileViaWebhookCallback(payment, callback)
// Webhook Callback.reconcile pending payment → Payment
WebhookCallback.reconcilePendingPayment(callback, payment)
// Webhook Callback.update order on success → Order, Payment Confirmation
WebhookCallback.updateOrderOnSuccess(callback, order)
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
PaymentConfirmation.triggerConfirmationEmail(
    PaymentConfirmation.fromWebhook(callback), order
)
return payment
```

#### Walk 6 — Covers: PayNova webhook failure leaves order unpaid

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.byReference("pay_pn_pending_001")
callback: WebhookCallback = PayNova.sendWebhookCallback(reconciliationStatus: "failed")
Payment.reconcileViaWebhookCallback(payment, callback)
assert payment.paymentStatus == "failed"
assert order.orderStatus == "pending"
// customer notified to retry at payment method selector
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
assert selector.presentStripeWaveCardEntry() == available
assert selector.presentPayNovaDigitalWallet() == available
return payment
```

#### Walk 7 — Covers: logged-in customer offered PayNova wallet save after successful payment

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
payment: Payment = Payment.byVendorReference("pn_txn_7890")
assert payment.processingVendor is PayNova
assert payment.paymentStatus == "captured"
// PayNova.save PayNova wallet token → Saved Payment Method, Customer Account
saved: SavedPaymentMethod = PayNova.savePayNovaWalletToken(
    account: account,
    vendorTokenReference: "tok_pn_wallet_001",
    walletProvider: "PayNova Wallet"
)
// Saved Payment Method.save during checkout on opt-in → Customer Account, PayNova
SavedPaymentMethod.saveDuringCheckoutOnOptIn(account, vendor: PayNova, saved)
assert saved.vendorTokenReference == "tok_pn_wallet_001"
assert saved.processingVendor is PayNova
// invariant: stores only vendor token — never wallet secrets
assert saved.storesWalletSecrets == false
return saved
```

### **Process Buy-Now-Pay-Later via VaultPay — eligibility, instalment, decline, webhook, saved identity**

**Purpose:** Validate *VaultPay* *buy-now-pay-later* flow with *eligibility check* and *instalment plan*, capture, *hard decline*, webhook reconciliation, and per-transaction eligibility on saved identity.
**Concepts traced:** Payment Method Selector, VaultPay, Buy-now-pay-later, Eligibility Check, Instalment Plan, Payment, Payment Confirmation, Hard Decline, Webhook Callback, Order, Saved Payment Method, Customer Account

#### Walk 1 — Covers: VaultPay selection performs eligibility check and presents instalment plan

```
order: Order = Order.byNumber("ORD-2003")
assert order.orderTotal == 200.00
assert order.orderStatus == "pending"
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
// Payment Method Selector.present VaultPay buy-now-pay-later → VaultPay, Buy-now-pay-later
selector.presentVaultPayBuyNowPayLater()
bnplFlow: BuyNowPayLater = VaultPay.redirectOrEmbedBnplFlow(order)
// VaultPay.perform eligibility check → Eligibility Check
check: EligibilityCheck = VaultPay.performEligibilityCheck(order)
assert check.transactionEligibility == "approved"
// VaultPay.present instalment plan → Instalment Plan
plan: InstalmentPlan = VaultPay.presentInstalmentPlan(
    installmentCount: 4,
    installmentAmount: 50.00
)
assert plan.installmentSchedule == "4 × £50.00"
return plan
```

#### Walk 2 — Covers: VaultPay instalment acceptance confirms order

```
order: Order = Order.byNumber("ORD-2003")
plan: InstalmentPlan = InstalmentPlan.accepted(count: 4, amount: 50.00)
confirmation: PaymentConfirmation = VaultPay.returnPaymentConfirmation(
    vendorConfirmationReference: "vp_ref_5001",
    instalmentPlan: plan
)
payment: Payment = Payment.byOrder(order)
payment.instalmentPlanReference = plan
// Payment Confirmation.confirm associated order
PaymentConfirmation.confirmAssociatedOrder(confirmation, order)
assert payment.processingVendor is VaultPay
assert payment.vendorTransactionReference.vendorAssignedIdentifier == "vp_ref_5001"
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
return order
```

#### Walk 3 — Covers: VaultPay hard decline offers StripeWave and PayNova alternatives

```
order: Order = Order.byNumber("ORD-2003")
decline: HardDecline = VaultPay.returnHardDecline(declineReason: "eligibility failed")
// invariant: declines are VaultPay decision — PawPlace surfaces unavailability
Payment.surfaceHardDeclineImmediately(Payment.forOrder(order), decline)
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
alternatives: VendorOption[] = PaymentMethodSelector.displayAlternativesOnDecline(
    decline, vendors: [StripeWave, PayNova]
)
assert alternatives.contains(StripeWave)
assert alternatives.contains(PayNova)
assert order.orderStatus == "pending"
assert PaymentRetry.forOrder(order) == null
return selector
```

#### Walk 4 — Covers: VaultPay webhook reconciles successful BNPL payment after timeout

```
order: Order = Order.byNumber("ORD-2003")
payment: Payment = Payment.byReference("pay_vp_pending_001")
callback: WebhookCallback = VaultPay.sendWebhookCallback(
    vendorTransactionReference: "vp_ref_5001",
    reconciliationStatus: "captured"
)
Payment.reconcileViaWebhookCallback(payment, callback)
WebhookCallback.reconcilePendingPayment(callback, payment)
WebhookCallback.updateOrderOnSuccess(callback, order)
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
return payment
```

#### Walk 5 — Covers: VaultPay webhook failure leaves order unpaid

```
order: Order = Order.byNumber("ORD-2003")
payment: Payment = Payment.byReference("pay_vp_pending_001")
callback: WebhookCallback = VaultPay.sendWebhookCallback(reconciliationStatus: "failed")
Payment.reconcileViaWebhookCallback(payment, callback)
assert payment.paymentStatus == "failed"
assert order.orderStatus == "pending"
return payment
```

#### Walk 6 — Covers: VaultPay saved identity pre-fills but eligibility check runs each transaction

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
// VaultPay.save VaultPay identity token → Saved Payment Method, Customer Account
saved: SavedPaymentMethod = VaultPay.saveVaultPayIdentityToken(
    account: account,
    vendorTokenReference: "tok_vp_identity_001"
)
SavedPaymentMethod.saveDuringCheckoutOnOptIn(account, vendor: VaultPay, saved)
// future checkout pre-fills VaultPay identity
order: Order = Order.byNumber("ORD-2003")
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
selector.preSelectSavedPaymentMethod(saved)
// invariant: pre-fills identity but still requires eligibility check each transaction
check: EligibilityCheck = VaultPay.performEligibilityCheck(order)
assert check.transactionEligibility == "approved"
return check
```

### **Retry Failed Payment — transient retry, success, exhaustion, hard-decline block, background**

**Purpose:** Validate automatic *payment retry* on *transient error* within *retry window*, successful retry confirmation, exhaustion fallback, *hard decline* never retried, and background continuation when customer navigates away.
**Concepts traced:** Payment, Payment Retry, Transient Error, Retry Window, Hard Decline, Payment Method Selector, PayNova, VaultPay, StripeWave, Order, Payment Confirmation, Confirmation Email, Notification

#### Walk 1 — Covers: transient error triggers automatic payment retry with indicator

```
payment: Payment = Payment.byReference("pay_pn_retry_001")
order: Order = Order.byNumber("ORD-2001")
error: TransientError = TransientError.classify(
    failureType: "network timeout",
    vendor: PayNova
)
assert error.retryableFailureClassification == true
// Transient Error.trigger automatic payment retry → Payment Retry, Payment Vendor, Retry Window
retry: PaymentRetry = TransientError.triggerAutomaticPaymentRetry(error, payment)
// Payment.initiate payment retry on transient error → Payment Retry, Transient Error, Payment Vendor
Payment.initiatePaymentRetryOnTransientError(payment, error)
// Payment Retry.re-attempt through same vendor → Payment, PayNova, Transient Error
PaymentRetry.reAttemptThroughSameVendor(retry, vendor: PayNova)
// Transient Error.display retrying payment indicator → Payment Method Selector
selector: PaymentMethodSelector = TransientError.displayRetryingPaymentIndicator()
assert selector.showsRetryingIndicator == true
assert retry.attemptCount == 1
return retry
```

#### Walk 2 — Covers: successful payment retry confirms order

```
payment: Payment = Payment.byReference("pay_pn_retry_001")
order: Order = Order.byNumber("ORD-2001")
retry: PaymentRetry = PaymentRetry.inProgress(payment, vendor: PayNova)
// Payment Retry.confirm order on success → Order, Payment Confirmation, Confirmation Email
confirmation: PaymentConfirmation = PaymentRetry.confirmOrderOnSuccess(retry, payment)
PaymentConfirmation.confirmAssociatedOrder(confirmation, order)
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
return order
```

#### Walk 3 — Covers: retry exhaustion returns customer to payment method selector

```
window: RetryWindow = RetryWindow.configured(maximumAttemptCount: 3, timeLimit: "5 minutes")
payment: Payment = Payment.byReference("pay_vp_retry_001")
order: Order = Order.byNumber("ORD-2003")
retry: PaymentRetry = PaymentRetry.exhausted(payment, attemptCount: 3, window: window)
// Payment Retry.run within retry window → Retry Window
assert PaymentRetry.runWithinRetryWindow(retry, window) == exhausted
// Payment Retry.notify on exhaustion → Payment Method Selector, Notification
PaymentRetry.notifyOnExhaustion(retry)
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
alternatives: VendorOption[] = PaymentMethodSelector.displayAlternativesOnDecline(
    retryExhaustion: true,
    vendors: [StripeWave, PayNova, VaultPay]
)
assert alternatives.includesManualCardEntry == true
assert order.orderStatus == "pending"
// invariant: only one charge attempt occurs per payment retry cycle
assert retry.singleChargePerCycle == true
return selector
```

#### Walk 4 — Covers: hard decline never triggers automatic payment retry (StripeWave insufficient funds)

```
payment: Payment = Payment.byReference("pay_sw_decline_001")
order: Order = Order.byNumber("ORD-2004")
decline: HardDecline = HardDecline.classify(
    declineReason: "insufficient funds",
    vendor: StripeWave
)
assert decline.nonRetryableFailureClassification == true
// invariant: must not trigger automatic payment retry
assert TransientError.triggerAutomaticPaymentRetry(decline, payment) == blocked
assert Payment.initiatePaymentRetryOnTransientError(payment, decline) == null
Payment.surfaceHardDeclineImmediately(payment, decline)
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
assert selector.displaysAlternativeVendors == true
return selector
```

#### Walk 5 — Covers: hard decline never triggers automatic payment retry (VaultPay BNPL eligibility failure)

```
payment: Payment = Payment.byReference("pay_vp_decline_001")
decline: HardDecline = HardDecline.classify(
    declineReason: "BNPL eligibility failure",
    vendor: VaultPay
)
assert PaymentRetry.forPayment(payment) == null
Payment.surfaceHardDeclineImmediately(payment, decline)
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
assert selector.displaysAlternativeVendors == true
return selector
```

#### Walk 6 — Covers: background payment retry confirms order after customer navigates away

```
payment: Payment = Payment.byReference("pay_pn_retry_003")
order: Order = Order.byNumber("ORD-2001")
retry: PaymentRetry = PaymentRetry.inProgress(payment, vendor: PayNova)
retry.backgroundContinuationFlag = true
// Payment.continue payment retry in background → Payment Retry, Order, Confirmation Email
Payment.continuePaymentRetryInBackground(retry, payment, order)
// customer navigated away — retry completes asynchronously
confirmation: PaymentConfirmation = PaymentRetry.confirmOrderOnSuccess(retry, payment)
assert retry.backgroundContinuationFlag == true
assert order.orderStatus == "confirmed"
email: ConfirmationEmail = PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
notification: Notification = Notification.deliverTransactionalMessage(email, order)
assert notification.notificationChannel == "email"
return order
```

#### Walk 7 — Covers: background payment retry exhaustion leaves order unpaid

```
payment: Payment = Payment.byReference("pay_vp_retry_002")
order: Order = Order.byNumber("ORD-2003")
window: RetryWindow = RetryWindow.configured(maximumAttemptCount: 3, timeLimit: "5 minutes")
retry: PaymentRetry = PaymentRetry.exhausted(payment, attemptCount: 3, window: window)
retry.backgroundContinuationFlag = true
Payment.continuePaymentRetryInBackground(retry, payment, order)
PaymentRetry.notifyOnExhaustion(retry)
assert order.orderStatus == "pending"
notification: Notification = Notification.deliverTransactionalMessage(
    event: "payment could not be processed",
    recipient: order.placingParty
)
return notification
```

### references

**Ref — Payment vendors and checkout**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.
```

**Ref — Process Digital Wallet Payment via PayNova (spec-by-example)**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Process Digital Wallet Payment via PayNova
Extract: partial

```source
WHEN the customer selects PayNova (Digital Wallet) at the payment step
THEN the system redirects to or embeds the PayNova wallet authentication flow
AND the customer authorises the payment using their mobile wallet credentials
```

**Ref — Process Buy-Now-Pay-Later via VaultPay (spec-by-example)**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Process Buy-Now-Pay-Later via VaultPay
Extract: partial

```source
WHEN the customer selects VaultPay (Buy-Now-Pay-Later) at the payment step
THEN the system redirects to or embeds VaultPay's BNPL flow
AND VaultPay performs the Eligibility Check and presents the Instalment Plan to the customer
```

**Ref — Retry Failed Payment (spec-by-example)**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Retry Failed Payment
Extract: partial

```source
WHEN a Payment fails due to a Transient Error (timeout, vendor 5xx, network issue)
THEN the system automatically retries the payment through the same Payment Vendor
AND the customer sees a "retrying payment" indicator — no manual action required
```

### decisions made

- Increment 4 *StripeWave*-only walks in `increment-4-walkthrough.md` remain valid for Increments 1–4 scope; Increment 5 walks supersede sole-vendor constraint for payment-method-selector scenarios only.
- *Order confirmation page* and *retrying payment* UI indicator remain presentation surfaces — walks assert outcomes via domain collaborators (`PaymentMethodSelector`, `Notification`) without inventing page-level CRC classes.
- *Refund* routing foundation modeled in CRC but not walked here — full *return* customer flow deferred to Increment 7.
- GAP: none — all walk steps trace to CRC class responsibilities in `docs/end-to-end/specification/crc.md` slot 127 refresh.

---

# Boundary Domain

Increment 5 adds no new admin or cross-module flows beyond existing order/payment integration. *Guest checkout* and authenticated checkout both route through *payment method selector* unchanged from Increment 4 except for multi-vendor activation.

### references

**Ref — Increment 5 thin slice**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 5
Extract: partial

```source
Outcome: Customers can pay with PayNova (mobile wallet) and VaultPay (buy-now-pay-later) in addition to StripeWave. Failed payments retry automatically across all three.
```

### decisions made

- No separate boundary scenarios required — payment vendor integration is customer-facing checkout only in this increment.

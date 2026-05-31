---
state: walkthrough
increment: 7
---

# Increment 7 — Walkthrough: Returns and refunds

## Scope

**Epic:** `Returns and refunds`

**Stories:**
- Initiate Return from Order History
- Generate Return Label or QR Code
- Route Refund through Original Payment Vendor
- Track Refund Status
- Process In-Store Return
- Send Return and Refund Status Update

---

# Core Domain

## **Order**

Return initiation scenarios walk `Order`, `Order History`, `Return`, `Return Request`, `Return Eligibility`, `Return Window`, `Return Reason`, `Returned Items`, `Return Status`, `Return Label`, and `Return QR Code`. The central CRC invariant governing all return initiation: the "Return" action appears on eligible orders in order history when return eligibility is satisfied; items already in "return in progress" cannot be selected again.

### **Initiate return on delivered order within return window — happy path**

**Purpose:** Validate that `Return Eligibility` evaluates per item against `Return Window`, surfaces eligible items, and that `Return Request` creates a `Return` linked to the originating `Order`.
**Concepts traced:** Order, Order History, Return Eligibility, Return Window, Order Line Item, Return Request, Return, Return Reason, Returned Items, Return Status

#### Walk 1 — Covers: customer selects return on delivered order ORD-4401, eligible items shown

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.associatedOrders.find(orderNumber: "ORD-4401")
    // Order.order status = "delivered"; Order.order date = 2026-04-14
eligibility: ReturnEligibility = order.provideEntryPointForReturns()
    // Return Eligibility.return window check — CRC invariant: period starts from delivery date
    window: ReturnWindow = new ReturnWindow(deliveryDateAnchor: 2026-04-14)
    window.evaluateCurrentDate(currentDate: 2026-05-07)
        // 23 days since delivery — within configured period
        return eligible: true
    // Return Eligibility.evaluate per item — CRC invariant: evaluated per item
    item1: OrderLineItem = OrderLineItem("Premium Dog Kibble 10kg", unitPrice: £54.99, quantity: 1)
    item2: OrderLineItem = OrderLineItem("Squeaky Bone Chew", unitPrice: £12.99, quantity: 2)
    eligibility.eligibleItems = [item1, item2]
    return eligibility
// Order History surfaces eligible items with Return Reason picker
```

#### Walk 2 — Covers: return request submitted, Return record created

```
returnRequest: ReturnRequest = new ReturnRequest(
    selectedOrderLineItems: [OrderLineItem("Premium Dog Kibble 10kg")],
    quantitiesToReturn: 1,
    returnReason: ReturnReason(reasonCategory: "changed mind")
)
    // Return Request.create return record — CRC invariant: must be made against order that passes return eligibility
    returnRequest.createReturnRecord(order: Order("ORD-4401"))
        rtn: Return = new Return(originatingOrder: Order("ORD-4401"))
        rtn.returnDate = 2026-05-07
        rtn.initiatingParty = CustomerAccount("sarah.mitchell@pawplace.example")
        rtn.returnedItems = ReturnedItems(orderLineItemReference: OrderLineItem("Premium Dog Kibble 10kg"), returnedQuantity: 1)
        rtn.returnStatus = ReturnStatus(lifecycleState: "initiated")
            // Return Status.surface on order detail — CRC invariant: visible under order detail
        // Return Request.surface return status immediately — CRC: appears in Customer Account under Order detail
        return rtn  // RTN-7001
return
```

### **Return action hidden when outside return window — failure path**

**Purpose:** Validate that `Return Eligibility` hides the return action when the `Return Window` has expired, and surfaces the ineligibility reason.
**Concepts traced:** Order, Order History, Return Eligibility, Return Window

#### Walk 1 — Covers: order ORD-4402 delivered 2026-02-05, current date 2026-05-07 — window expired

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.associatedOrders.find(orderNumber: "ORD-4402")
    // Order.order status = "delivered"; delivered 2026-02-05
eligibility: ReturnEligibility = new ReturnEligibility(order: Order("ORD-4402"))
    window: ReturnWindow = new ReturnWindow(deliveryDateAnchor: 2026-02-05)
    window.evaluateCurrentDate(currentDate: 2026-05-07)
        // 91 days since delivery — outside configured period
        return eligible: false
    // Return Eligibility.hide or disable return action — CRC invariant: "Return" action must not appear on order whose return window has expired
    eligibility.ineligibilityReason = "return window expired"
    return eligibility
// "Return" action hidden on ORD-4402; reason displayed: "return window expired"
```

### **Partial return — previously returned items excluded, remaining items returnable**

**Purpose:** Validate that `Return` supports partial returns — items already in "return in progress" cannot be selected again; remaining eligible items are still returnable.
**Concepts traced:** Order, Return, Return Eligibility, Returned Items, Order Line Item, Return Status

#### Walk 1 — Covers: ORD-4401 with existing return on Premium Dog Kibble, Squeaky Bone Chew still returnable

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.associatedOrders.find(orderNumber: "ORD-4401")
existingReturn: Return = order.returns.find(returnedItems: OrderLineItem("Premium Dog Kibble 10kg"))
    existingReturn.returnStatus.lifecycleState = "initiated"
eligibility: ReturnEligibility = order.provideEntryPointForReturns()
    // Return.support partial returns — CRC invariant: items already in "return in progress" cannot be returned again
    item1: OrderLineItem = OrderLineItem("Premium Dog Kibble 10kg")
        item1.returnInProgress = true  // shows "return in progress", cannot be selected
    item2: OrderLineItem = OrderLineItem("Squeaky Bone Chew", quantity: 2)
        item2.returnInProgress = false  // shows "Return Eligible", can be selected
    eligibility.eligibleItems = [item2]
    return eligibility
// item1 disabled: "return in progress"; item2 selectable for separate Return
```

### **Return label and QR code generation — happy path**

**Purpose:** Validate that `Return Label` and `Return QR Code` are generated on return request submission, both encoding the same return reference.
**Concepts traced:** Return, Return Request, Return Label, Return QR Code

#### Walk 1 — Covers: RTN-7001 return label and QR code generated after submission

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
    // Return.return label — CRC invariant: both generated on successful return request submission
    label: ReturnLabel = new ReturnLabel()
        label.returnAddress = "PawPlace Returns Centre"
        label.orderNumber = "ORD-4401"
        label.returnReference = "RTN-7001"
        label.carrierBarcode = generated
        // Return Label — CRC invariant: printable PDF generated when return request is submitted successfully
    qrCode: ReturnQRCode = new ReturnQRCode()
        qrCode.returnReference = "RTN-7001"
        // Return QR Code — CRC invariant: mobile-displayable code generated alongside return label
        // Return QR Code — CRC invariant: encodes the same return reference as the return label
    rtn.returnLabel = label
    rtn.returnQRCode = qrCode
    // Both shown on Return confirmation page
    // Both emailed to CustomerAccount("sarah.mitchell@pawplace.example")
return
```

#### Walk 2 — Covers: label generation service unavailable — return preserved (failure path)

```
rtn: Return = Return("RTN-7002", originatingOrder: Order("ORD-5502"))
    // Attempt label generation
    label: ReturnLabel = attemptGenerate()
        // service unavailable — generation fails
        raise ServiceUnavailable("Return Label generation service temporarily unavailable")
    // Return is still recorded — CRC: return request creates the return record
    rtn.returnStatus = ReturnStatus(lifecycleState: "initiated")
    // Return not cancelled due to label generation failure
    // Customer told to check back or contact support for the label
return
```

### references

**Ref — Returns and exchanges**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.
```

**Ref — Initiate Return from Order History (story-graph)**
Source: docs/end-to-end/discovery/story-graph.json
Locator: story "Initiate Return from Order History"
Extract: partial

```source
1. WHEN the customer selects "Return" on an eligible order in Order History
THEN the system shows which items in the order are Return Eligible
AND the customer selects the items and quantities to return, plus a return reason
```

**Ref — Generate Return Label or QR Code (story-graph)**
Source: docs/end-to-end/discovery/story-graph.json
Locator: story "Generate Return Label or QR Code"
Extract: partial

```source
WHEN the Return Request is submitted
THEN the system generates a Return Label (PDF) and a Return QR Code
AND both are shown on the return confirmation page and emailed to the customer
```

### decisions made

- Return Eligibility evaluates per item with Return Window anchored on delivery date — consistent with CRC invariant. Category-specific variation deferred to configuration.
- Return Label and Return QR Code are separate classes, each generated independently but sharing the same return reference. Label is printable PDF; QR is mobile-displayable.
- Partial return is a cooperation pattern: existing Return blocks re-selection, while remaining items are evaluated independently by Return Eligibility.
- Label generation failure does not cancel the Return — the Return record and Return Status persist independently of label availability.

---

## **Payment**

Refund routing scenarios walk `Refund`, `Refund Status`, `Refund Retry`, `Payment`, `Payment Vendor`, `StripeWave`, `PayNova`, `VaultPay`, and `Instalment Plan`. The central CRC invariant: refund must always route through the payment vendor that handled the original transaction; customer sees only refund status — never vendor mechanics.

### **Refund routed through StripeWave for card payment — happy path**

**Purpose:** Validate that `Refund` routes through the original `Payment Vendor` (`StripeWave`) using the `Vendor Transaction Reference`, and creates a `Refund Status` in processing state.
**Concepts traced:** Return, Refund, Payment, Payment Vendor, StripeWave, Vendor Transaction Reference, Refund Status, Returned Items

#### Walk 1 — Covers: RTN-7001 refund of £54.99 routed through StripeWave

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
    returnedItems: ReturnedItems = rtn.returnedItems
        // Returned Items received, inspection passes
        returnedItems.triggerRestockingOnInspectionPass()
    // Return.route refund through original vendor — CRC invariant: refund must always route through the payment vendor that handled the original transaction
    payment: Payment = Order("ORD-4401").completedPayment
        vendorRef: VendorTransactionReference = payment.vendorTransactionReference  // "sw_txn_4401"
        originalVendor: PaymentVendor = payment.processingVendor  // StripeWave
    refund: Refund = new Refund(originatingReturn: Return("RTN-7001"))
        refund.refundReference = "REF-3001"
        refund.refundAmount = £54.99
            // Refund.refund amount — CRC invariant: must match the returned items value
        refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: "sw_txn_4401")
            // Refund.vendor refund API route — CRC invariant: StripeWave card refunds routable
            StripeWave.processRefund(refund: Refund("REF-3001"), vendorRef: "sw_txn_4401")
        refund.refundStatus = RefundStatus(lifecycleState: "processing")
            // Refund Status.transition to processing — CRC invariant: transitions when return inspection passes and refund request is sent to payment vendor
    return refund
```

### **Refund routed through PayNova for digital wallet payment**

**Purpose:** Validate that the vendor-routing abstraction works for `PayNova` wallet credits in addition to StripeWave card refunds.
**Concepts traced:** Return, Refund, Payment, Payment Vendor, PayNova, Refund Status

#### Walk 1 — Covers: RTN-7002 refund of £24.99 routed through PayNova

```
rtn: Return = Return("RTN-7002", originatingOrder: Order("ORD-5502"))
    // Returned Items received and inspection passes
payment: Payment = Order("ORD-5502").completedPayment
    vendorRef: VendorTransactionReference = payment.vendorTransactionReference  // "pn_txn_5502"
    originalVendor: PaymentVendor = payment.processingVendor  // PayNova
refund: Refund = new Refund(originatingReturn: Return("RTN-7002"))
    refund.refundReference = "REF-3002"
    refund.refundAmount = £24.99
    refund.routeThroughOriginalVendor(vendor: PayNova, vendorRef: "pn_txn_5502")
        // Payment Vendor.process refund — CRC invariant: PayNova wallet credits routable
        PayNova.processRefund(refund: Refund("REF-3002"), vendorRef: "pn_txn_5502")
    refund.refundStatus = RefundStatus(lifecycleState: "processing")
return refund
```

### **Refund routed through VaultPay with instalment plan adjustment**

**Purpose:** Validate that `VaultPay` refunds adjust the `Instalment Plan` and route through the vendor's BNPL-specific refund API.
**Concepts traced:** Return, Refund, Payment, Payment Vendor, VaultPay, Instalment Plan, Refund Status

#### Walk 1 — Covers: RTN-7003 refund of £199.99 routed through VaultPay with instalment plan adjustment

```
rtn: Return = Return("RTN-7003", originatingOrder: Order("ORD-6603"))
    // Returned Items received and inspection passes
payment: Payment = Order("ORD-6603").completedPayment
    vendorRef: VendorTransactionReference = payment.vendorTransactionReference  // "vp_txn_6603"
    originalVendor: PaymentVendor = payment.processingVendor  // VaultPay
refund: Refund = new Refund(originatingReturn: Return("RTN-7003"))
    refund.refundReference = "REF-3003"
    refund.refundAmount = £199.99
    refund.routeThroughOriginalVendor(vendor: VaultPay, vendorRef: "vp_txn_6603")
        // Refund.vendor refund API route — CRC invariant: VaultPay instalment plan adjustments routable
        VaultPay.processRefund(refund: Refund("REF-3003"), vendorRef: "vp_txn_6603")
            // Instalment Plan adjusted by VaultPay
            instalmentPlan: InstalmentPlan = VaultPay.adjustInstalmentPlan(refundAmount: £199.99)
    refund.refundStatus = RefundStatus(lifecycleState: "processing")
return refund
```

### **Refund queued for retry on vendor failure — failure path**

**Purpose:** Validate that `Refund Retry` queues the refund when the vendor is unavailable, and that the customer sees "processing" — never "refund failed".
**Concepts traced:** Refund, Refund Retry, Payment Vendor, StripeWave, Refund Status

#### Walk 1 — Covers: REF-3001 StripeWave vendor downtime — retry queued

```
refund: Refund = Refund("REF-3001", originatingReturn: Return("RTN-7001"))
    refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: "sw_txn_4401")
        // StripeWave.processRefund fails — vendor downtime
        raise VendorUnavailable("StripeWave vendor downtime")
    // Refund.handle vendor failure — CRC invariant: vendor failure queued for automatic re-attempt; customer sees "refund processing" — never "refund failed"
    refundRetry: RefundRetry = new RefundRetry(refund: Refund("REF-3001"))
        refundRetry.attemptCount = 1
        refundRetry.retryStatus = "queued"
        // Refund Retry — CRC invariant: automatic retry when vendor is temporarily unavailable
        // Refund Retry — CRC invariant: must always use the same payment vendor as the original refund attempt
    refund.refundStatus = RefundStatus(lifecycleState: "processing")
        // Refund Status — CRC invariant: must not show "refund failed" to the customer
return
```

### **Refund escalated to requires review after retry exhaustion — failure path**

**Purpose:** Validate that `Refund Status` transitions to "requires review" when all `Refund Retry` attempts are exhausted, triggering the `Refund Under Review Notification`.
**Concepts traced:** Refund, Refund Retry, Refund Status, Refund Under Review Notification

#### Walk 1 — Covers: REF-3001 all retry attempts exhausted — escalation

```
refund: Refund = Refund("REF-3001", originatingReturn: Return("RTN-7001"))
refundRetry: RefundRetry = RefundRetry(refund: Refund("REF-3001"))
    refundRetry.attemptCount = maxAttempts
    // Final retry attempt fails
    refundRetry.reAttemptThroughSameVendor(vendor: StripeWave)
        raise VendorUnavailable("StripeWave still unavailable")
    // Refund Retry.transition refund status on exhaustion — CRC invariant: on exhaustion transitions refund status to "requires review"
    refundRetry.transitionRefundStatusOnExhaustion()
        refund.refundStatus = RefundStatus(lifecycleState: "requires review")
            // Refund Status.transition to requires review — CRC invariant: triggers refund under review notification
    // Refund.escalate on retry exhaustion — CRC invariant: transitions refund status to "requires review" and triggers refund under review notification
    refund.escalateOnRetryExhaustion()
        notification: RefundUnderReviewNotification = new RefundUnderReviewNotification(
            returnAndOrderReference: Return("RTN-7001"), Order("ORD-4401"),
            supportGuidance: "contact support",
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
        Notification.deliverTransactionalMessage(notification)
return
```

### references

**Ref — Refund routing through original vendor**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.
```

**Ref — Route Refund through Original Payment Vendor (story-graph)**
Source: docs/end-to-end/discovery/story-graph.json
Locator: story "Route Refund through Original Payment Vendor"
Extract: partial

```source
1. WHEN the returned item is received and inspected (or the return is auto-approved)
THEN the system initiates a Refund through the Original Payment Vendor for that order
AND the refund amount matches the returned items' value
5. WHEN the refund request to the vendor fails (vendor downtime, API error)
THEN the refund is queued for retry
AND the customer sees "refund processing" status — not "refund failed"
BUT if retries exhaust, the return status escalates to "refund requires manual review"
```

**Ref — Increment 7 refund routing design rule**
Source: docs/end-to-end/discovery/thin-slicing.md
Locator: Increment 7
Extract: partial

```source
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.
```

### decisions made

- Refund routing generalises across all three vendors (StripeWave, PayNova, VaultPay) — each vendor's `processRefund` receives the original `Vendor Transaction Reference`. VaultPay additionally adjusts `Instalment Plan`.
- Refund Retry parallels Payment Retry in pattern but operates on a different lifecycle event (post-return inspection, not checkout) and escalates to "requires review" rather than returning to payment method selector.
- Customer never sees "refund failed" — Refund Status shows "processing" during retry and "requires review" on exhaustion. This is a hard CRC invariant.
- Refund amount must match returned items value — no partial refund calculations beyond what was returned.

---

## **Notification**

Return and refund notification scenarios walk `Notification`, `Return Received Notification`, `Refund Completed Notification`, and `Refund Under Review Notification`. The central CRC invariant: notification failure must not block return processing or refund status transitions; all three support both customer account email and guest email recipient paths.

### **Return received notification sent on warehouse receipt — happy path**

**Purpose:** Validate that `Return Received Notification` fires when `Return Status` transitions to "received" and includes the correct content.
**Concepts traced:** Return, Return Status, Return Received Notification, Notification, Returned Items, Customer Account

#### Walk 1 — Covers: RTN-7001 return status transitions to received, notification sent

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
returnStatus: ReturnStatus = rtn.returnStatus
    // Return Status.update on warehouse receipt — CRC invariant: triggers return received notification when transitioning to "received"
    returnStatus.updateOnWarehouseReceipt()
        returnStatus.lifecycleState = "received"
        // Return Received Notification — CRC invariant: fires when return status transitions to "received"
        notification: ReturnReceivedNotification = new ReturnReceivedNotification(
            originatingOrder: Order("ORD-4401"),
            returnedItemsSummary: ReturnedItems("Premium Dog Kibble 10kg"),
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
            // Return Received Notification — CRC invariant: includes order number, returned items summary, and note that inspection and refund processing are underway
        Notification.deliverTransactionalMessage(notification)
return
```

### **Refund completed notification sent with amount and payment method**

**Purpose:** Validate that `Refund Completed Notification` fires when `Refund Status` transitions to "completed" with the refunded amount and masked payment method.
**Concepts traced:** Refund, Refund Status, Refund Completed Notification, Notification, Payment Vendor, PayNova

#### Walk 1 — Covers: REF-3002 refund completed by PayNova, notification sent

```
refund: Refund = Refund("REF-3002", originatingReturn: Return("RTN-7002"))
refundStatus: RefundStatus = refund.refundStatus
    // PayNova confirms refund is complete
    // Refund Status.transition to completed — CRC invariant: transitions when payment vendor confirms credit has been issued
    refundStatus.transitionToCompleted(vendorConfirmation: PayNova)
        refundStatus.lifecycleState = "completed"
        // Refund Status.transition to completed — CRC invariant: triggers refund completed notification
        notification: RefundCompletedNotification = new RefundCompletedNotification(
            refundedAmount: £24.99,
            paymentMethodReturnedTo: "PayNova digital wallet",
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
            // Refund Completed Notification — CRC invariant: includes refunded amount and the payment method the credit was returned to
        Notification.deliverTransactionalMessage(notification)
return
```

### **Notification queued when email delivery system unavailable — failure path**

**Purpose:** Validate that notification delivery failure does not block return processing or refund status transitions — the notification is queued for retry.
**Concepts traced:** Return, Return Status, Return Received Notification, Notification

#### Walk 1 — Covers: return received notification fails to send — queued for retry, return status still updated

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
returnStatus: ReturnStatus = rtn.returnStatus
    returnStatus.updateOnWarehouseReceipt()
        returnStatus.lifecycleState = "received"
        notification: ReturnReceivedNotification = new ReturnReceivedNotification(
            originatingOrder: Order("ORD-4401"),
            returnedItemsSummary: ReturnedItems("Premium Dog Kibble 10kg"),
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
        Notification.deliverTransactionalMessage(notification)
            // Email delivery system temporarily unavailable
            raise DeliveryFailure("email delivery system unavailable")
        // Notification.queue failed delivery for retry — CRC invariant: email delivery failure must not block return processing or refund status transition
        Notification.queueFailedDeliveryForRetry(notification)
    // Return Status is still updated — "received"
    // Refund Status is still updated independently
    // Notification failure does not block return or refund processing
return
```

### references

**Ref — Send Return and Refund Status Update (story-graph)**
Source: docs/end-to-end/discovery/story-graph.json
Locator: story "Send Return and Refund Status Update"
Extract: partial

```source
1. WHEN the return is received and processing begins
THEN the system sends a "return received" notification to the customer
2. WHEN the refund is completed by the vendor
THEN the system sends a "refund completed" notification with the refunded amount and the payment method it was returned to
3. WHEN the refund requires manual review (vendor failure, policy exception)
THEN the system sends a "refund under review" notification with guidance to contact support if needed
4. WHEN the email delivery system is temporarily unavailable
THEN the notification is queued for retry
AND the return/refund status is still updated in the system (notification failure does not block processing)
```

**Ref — Increment 7 return notification stories**
Source: docs/end-to-end/discovery/thin-slicing.md
Locator: Increment 7
Extract: partial

```source
Stories: Send Return and Refund Status Update (transactional)
```

### decisions made

- All three notification types follow the same retry-on-failure pattern: delivery failure queued for retry, must not block processing.
- Return Received Notification fires on `Return Status` transition to "received" — not on return request submission. There is a distinction between "return initiated" and "return received at warehouse".
- Refund Completed Notification fires only after vendor confirmation — CRC invariant explicitly states "must not fire before vendor confirmation".
- All three support both customer account email and guest email paths — returns can be initiated from guest orders via in-store return.

---

## **Order** (Track Refund Status)

Refund status visibility scenarios walk `Refund Status`, `Order`, `Order History`, and `Refund Completed Notification`. Customer-facing refund status is always "processing", "completed", or "requires review" — never "refund failed".

### **Refund status visible as processing on order detail — happy path**

**Purpose:** Validate that `Refund Status` surfaces on order detail when the customer views an order with an active refund.
**Concepts traced:** Order, Order History, Refund, Refund Status

#### Walk 1 — Covers: customer views ORD-4401 order detail, refund REF-3001 in processing state

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.openFullOrderDetail(orderNumber: "ORD-4401")
    rtn: Return = order.returns.find(returnReference: "RTN-7001")
    refund: Refund = Refund("REF-3001", originatingReturn: rtn)
    refundStatus: RefundStatus = refund.refundStatus
        // Refund Status.surface on order detail — CRC invariant: visible on order detail
        refundStatus.lifecycleState = "processing"
        // Refund Status.timing expectation note — CRC invariant: shows "refunds typically take 5–10 business days depending on your payment provider"
        refundStatus.timingExpectationNote = "refunds typically take 5–10 business days depending on your payment provider"
    return orderDetail  // shows Refund Status: "processing" with timing note
```

### **Requires review status shows support guidance — edge path**

**Purpose:** Validate that when `Refund Status` is "requires review", the customer sees support guidance and the support team has access to return and refund details.
**Concepts traced:** Order, Order History, Refund, Refund Status

#### Walk 1 — Covers: customer views ORD-6603, refund REF-3003 in requires review state

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.openFullOrderDetail(orderNumber: "ORD-6603")
    rtn: Return = order.returns.find(returnReference: "RTN-7003")
    refund: Refund = Refund("REF-3003", originatingReturn: rtn)
    refundStatus: RefundStatus = refund.refundStatus
        refundStatus.lifecycleState = "requires review"
        // Refund Status — CRC invariant: must not show "refund failed" to the customer
        // Customer sees message to contact support
        // Support team has access to Return and Refund details
    return orderDetail  // shows Refund Status: "requires review" with support guidance
```

### references

**Ref — Track Refund Status (story-graph)**
Source: docs/end-to-end/discovery/story-graph.json
Locator: story "Track Refund Status"
Extract: partial

```source
1. WHEN the customer views the Order Detail for a returned order
THEN the Refund Status is visible: processing, completed, or requires review
2. WHEN the Refund is completed by the vendor
THEN the Refund Status transitions to Completed
AND the customer receives a "refund completed" notification (email)
```

### decisions made

- Refund Status surfaces on order detail for any non-zero refund — processing, completed, or requires review. No other states are customer-visible.
- Timing expectation note shown only while in "processing" state — not after completion or escalation.
- "Requires review" is the escalation terminal state; no further automation — support team handles manually.

---

## **Order** (In-Store Return)

In-store return scenarios walk `In-Store Return`, `Manager Override`, `Admin Dashboard`, `Return Eligibility`, `Return`, and `Refund`. The central CRC invariants: in-store return must route refund through the original payment vendor; guest order returns use order number and guest email; manager override requires explicit approval and is recorded for audit.

### **In-store return submitted via order lookup — happy path**

**Purpose:** Validate that `In-Store Return` looks up the order on `Admin Dashboard`, creates a `Return`, and triggers a `Refund` through the original vendor.
**Concepts traced:** In-Store Return, Admin Dashboard, Order, Return, Refund, Payment Vendor, StripeWave, Customer Account

#### Walk 1 — Covers: store employee at PawPlace Camden processes return for ORD-4401

```
adminDashboard: AdminDashboard = AdminDashboard()
    // Admin Dashboard.in-store return lookup — CRC invariant: staff search by order number or customer email
    order: Order = adminDashboard.inStoreReturnLookup(orderNumber: "ORD-4401")
        // Order found; Return Window check — within window
        eligibility: ReturnEligibility = order.provideEntryPointForReturns()
            eligibility.evaluatePerItem(item: OrderLineItem("Premium Dog Kibble 10kg"))
            return eligible: true
inStoreReturn: InStoreReturn = new InStoreReturn(
    orderLookupByOrderNumber: Order("ORD-4401"),
    storeEmployeeInitiator: Store("PawPlace Camden")
)
    // In-Store Return.follow same refund routing invariant — CRC invariant: must route refund through the original payment vendor
    rtn: Return = new Return(originatingOrder: Order("ORD-4401"))
        rtn.initiatingParty = InStoreReturn
        rtn.returnStatus = ReturnStatus(lifecycleState: "initiated")
    refund: Refund = new Refund(originatingReturn: rtn)
        payment: Payment = Order("ORD-4401").completedPayment
        refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: payment.vendorTransactionReference)
    // In-Store Return.reflect in customer account — CRC invariant: reflects in customer account under order detail
    CustomerAccount("sarah.mitchell@pawplace.example").orderHistory.reflectReturn(rtn)
return
```

### **Guest order return processed using order number and guest email**

**Purpose:** Validate that `In-Store Return` supports guest order returns using order number and guest email — no customer account required.
**Concepts traced:** In-Store Return, Admin Dashboard, Order, Guest Checkout, Return, Refund, Payment Vendor, PayNova

#### Walk 1 — Covers: guest order ORD-7704 returned at store using order number and guest email

```
adminDashboard: AdminDashboard = AdminDashboard()
    // Admin Dashboard.in-store return lookup — CRC invariant: staff search by order number or customer email
    order: Order = adminDashboard.inStoreReturnLookup(
        orderNumber: "ORD-7704",
        customerEmail: "alex.rivera@example.com"
    )
        // Order ORD-7704 placed as guest order — guest email snapshot matches
inStoreReturn: InStoreReturn = new InStoreReturn(
    orderLookupByOrderNumber: Order("ORD-7704"),
    orderLookupByCustomerEmail: "alex.rivera@example.com",
    storeEmployeeInitiator: Store("PawPlace Camden")
)
    // In-Store Return.support guest order returns — CRC invariant: guest order returns use order number and guest email — refund routing is order-level, not account-level
    rtn: Return = new Return(originatingOrder: Order("ORD-7704"))
        rtn.initiatingParty = InStoreReturn
    refund: Refund = new Refund(originatingReturn: rtn)
        payment: Payment = Order("ORD-7704").completedPayment
        refund.routeThroughOriginalVendor(vendor: PayNova, vendorRef: payment.vendorTransactionReference)
    // No customer account to reflect in — guest order
    // Return not visible in "account" because customer has no Customer Account
return
```

### **Ineligible item flagged with manager override option — failure path**

**Purpose:** Validate that when `Return Eligibility` fails, the `Admin Dashboard` shows the ineligibility reason and offers a `Manager Override` action.
**Concepts traced:** In-Store Return, Admin Dashboard, Return Eligibility, Manager Override, Order

#### Walk 1 — Covers: ORD-4402 outside return window — manager override option shown

```
adminDashboard: AdminDashboard = AdminDashboard()
    order: Order = adminDashboard.inStoreReturnLookup(orderNumber: "ORD-4402")
    eligibility: ReturnEligibility = new ReturnEligibility(order: Order("ORD-4402"))
        window: ReturnWindow = new ReturnWindow(deliveryDateAnchor: 2026-02-05)
        window.evaluateCurrentDate(currentDate: 2026-05-07)
            return eligible: false
        eligibility.ineligibilityReason = "return window expired"
    // Admin Dashboard shows ineligibility reason: "return window expired"
    // Manager Override — CRC invariant: escalation when standard return eligibility rules would block the return
    // Manager Override action displayed, requiring manager approval
return  // awaiting manager decision
```

#### Walk 2 — Covers: manager approves override — return proceeds (cooperation path)

```
managerOverride: ManagerOverride = new ManagerOverride(
    approvingManager: "store-manager-camden",
    overrideReason: "customer goodwill — long-standing customer",
    approvalTimestamp: 2026-05-07T14:32:00Z
)
    // Manager Override.allow in-store return to proceed — CRC invariant: requires explicit manager approval
    managerOverride.allowInStoreReturnToProceed()
        inStoreReturn: InStoreReturn = new InStoreReturn(
            orderLookupByOrderNumber: Order("ORD-4402"),
            storeEmployeeInitiator: Store("PawPlace Camden")
        )
        rtn: Return = new Return(originatingOrder: Order("ORD-4402"))
            rtn.initiatingParty = InStoreReturn
        refund: Refund = new Refund(originatingReturn: rtn)
            payment: Payment = Order("ORD-4402").completedPayment
            refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: payment.vendorTransactionReference)
    // Manager Override.record for audit — CRC invariant: approving manager and override reason recorded for audit trail
    managerOverride.recordForAudit()
        // Recorded: manager "store-manager-camden", reason "customer goodwill — long-standing customer"
return
```

### references

**Ref — Process In-Store Return (story-graph)**
Source: docs/end-to-end/discovery/story-graph.json
Locator: story "Process In-Store Return"
Extract: partial

```source
1. WHEN a customer brings an item to the store for return
THEN the staff dashboard provides an order lookup by order number or customer email
AND a "Start Return" action is displayed on the matched order
4. WHEN the item is not eligible for return (outside window, wrong condition)
THEN the staff dashboard shows the ineligibility reason
AND a "Manager Override" action is displayed, requiring manager approval before the return proceeds
```

**Ref — Returns reflected in account**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
For in-store returns it's a different flow but the system should still reflect it in their account.
```

### decisions made

- In-Store Return is a full class, not a property of Return — it carries distinct behavior: staff order lookup, manager override, guest-order support.
- Manager Override is a full class with audit recording — approving manager, override reason, and timestamp recorded. Not available on online self-service path.
- Guest order returns use order number and guest email — refund routing is order-level (based on the Payment recorded on the Order), not account-level.
- Admin Dashboard owns in-store return lookup presentation; data and eligibility rules owned by Order KA.

---

# Boundary Domain

### **Admin Dashboard in-store return lookup — boundary coordination**

**Purpose:** Validate that the boundary `Admin Dashboard` coordinates the in-store return workflow by consuming data from core domain classes (Order, Return Eligibility, Manager Override) without owning any domain rules.
**Concepts traced:** Admin Dashboard (boundary), Order, In-Store Return, Return Eligibility, Manager Override

#### Walk 1 — Covers: staff search and return initiation via Admin Dashboard

```
adminDashboard: AdminDashboard = AdminDashboard()
    // Admin Dashboard.in-store return lookup — CRC invariant: data and rules owned by Order; presentation owned by Store Operations
    searchResult: Order = adminDashboard.inStoreReturnLookup(orderNumber: "ORD-4401")
        // Delegates eligibility check to core domain
        eligibility: ReturnEligibility = Order("ORD-4401").provideEntryPointForReturns()
    // Admin Dashboard surfaces eligibility result — does not compute it
    // "Start Return" or "Manager Override" action displayed based on eligibility
    // Actual return creation delegated to In-Store Return (core domain)
return
```

### references

**Ref — Admin dashboard**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

### decisions made

- Admin Dashboard is a boundary surface — it presents in-store return workflow but delegates all domain logic (eligibility, return creation, refund routing, manager override) to core domain classes.
- The "in-store return lookup" responsibility on Admin Dashboard is explicitly marked in CRC as "data and rules owned by Order; presentation owned by Store Operations".

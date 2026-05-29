---
state: walkthrough
increment_scope: Increment 3 — Ship to home
specification_refresh: Run 4 slot 77
prior_model: crc.md
---

# Module: PawPlace

Scope: Walk Increment 3 scenarios through `docs/domain/crc.md` (object model refresh deferred to Engineering). Traces five stories: *Enter Shipping Address*, *Select Delivery Option*, *View and Process Incoming Orders*, *Send Shipping Notification with Tracking Number*, *Track Order Status*. *Guest checkout* only — no *customer account*, login, or *saved address*.

---

# Core Domain

## **Customer Account**

Guest-only checkout path in Increment 3 — *shipping address* collected when *standard delivery* selected; *billing address* pre-fills shipping; neither address persisted beyond order snapshots.

### **Enter Shipping Address — form, pre-fill, validation, and advance**

**Purpose:** Validate *collect shipping address* on ship-to-home path, *pre-fill from billing address*, field overrides, required-field gating, and advance to *delivery option* selection.
**Concepts traced:** Guest Checkout, Billing Address, Shipping Address, Delivery Option

#### Walk 1 — Covers: shipping address form on ship-to-home checkout path

```
guest: GuestCheckout = GuestCheckout.current()
billing: BillingAddress = BillingAddress.complete(
    billingName: "Sarah Jones",
    addressLineOne: "10 Elm Avenue",
    city: "London",
    postcode: "SW1A 2AA"
)
guest.collectBillingAddress(billing)
// invariant: shipping address required when standard delivery path — not yet selected
shipping: ShippingAddress = guest.collectShippingAddress()
assert shipping.requiredFields == [recipientName, addressLineOne, city, postcode, country]
assert shipping.addressLineTwo.isOptional()
return shipping
```

#### Walk 2 — Covers: click-and-collect skips shipping address step

```
guest: GuestCheckout = GuestCheckout.current()
billing: BillingAddress = BillingAddress.complete(
    addressLineOne: "10 Elm Avenue",
    city: "London",
    postcode: "SW1A 2AA"
)
guest.collectBillingAddress(billing)
deliveryOption: DeliveryOption = DeliveryOption.clickAndCollect()
assert deliveryOption.deliveryMethodName == "Click-and-Collect"
// Guest Checkout.collect shipping address — invariant: skipped when click-and-collect selected
assert guest.collectShippingAddress() == skipped
// checkout proceeds to Pickup Store selection (Click-and-Collect collaborator)
return deliveryOption
```

#### Walk 3 — Covers: same as billing pre-fills shipping address

```
billing: BillingAddress = BillingAddress.complete(
    billingName: "Sarah Jones",
    addressLineOne: "10 Elm Avenue",
    addressLineTwo: "Flat 3",
    city: "London",
    countyOrRegion: "Greater London",
    postcode: "SW1A 2AA",
    country: "United Kingdom"
)
shipping: ShippingAddress = ShippingAddress.preFillFromBillingAddress(billing)
// Billing Address.pre-fill shipping address
assert shipping.recipientName == "Sarah Jones"
assert shipping.addressLineOne == "10 Elm Avenue"
assert shipping.addressLineTwo == "Flat 3"
assert shipping.city == "London"
assert shipping.countyOrRegion == "Greater London"
assert shipping.postcode == "SW1A 2AA"
assert shipping.country == "United Kingdom"
return shipping
```

#### Walk 4 — Covers: override single field on pre-filled shipping address

```
shipping: ShippingAddress = ShippingAddress.preFilledFromBilling()  // city London
shipping.city = "Edinburgh"
// invariant: individual field overrides replace only the changed field
assert shipping.city == "Edinburgh"
assert shipping.addressLineOne == "10 Elm Avenue"
assert shipping.postcode == "SW1A 2AA"
return shipping
```

#### Walk 5 — Covers: missing required fields blocked on shipping step

```
shipping: ShippingAddress = ShippingAddress.empty()
shipping.recipientName = ""
shipping.addressLineOne = ""
shipping.postcode = ""
assert shipping.requiredFieldsComplete() == false
// invariant: required fields must be complete before checkout advances from shipping step
assert GuestCheckout.current().advanceFromShippingStep() == blocked
return shipping
```

#### Walk 6 — Covers: complete shipping address advances to delivery option selection

```
shipping: ShippingAddress = ShippingAddress.collect(
    recipientName: "Sarah Jones",
    addressLineOne: "28 Oak Lane",
    city: "Edinburgh",
    countyOrRegion: "Midlothian",
    postcode: "EH1 3DG",
    country: "United Kingdom"
)
assert shipping.requiredFieldsComplete()
guest: GuestCheckout = GuestCheckout.current()
guest.collectShippingAddress(shipping)
// checkout advances to Delivery Option selection step
assert guest.currentStep == deliveryOptionSelection
return shipping
```

### references

**Ref — Enter Shipping Address**
Source: docs/story/specification-by-example/increment-3-specification-by-example.md
Locator: Story Enter Shipping Address / Scenario 6
Extract: partial

```source
Given the customer enters **Shipping Address** with **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **county or region** *Midlothian*, **postcode** *EH1 3DG*, **country** *United Kingdom*
When the customer submits the **Shipping Address**
Then checkout advances to the **Delivery Option** selection step
```

### decisions made

- Field-level validation messages (*Recipient name is required*, etc.) are presentation concerns — CRC owns `required fields complete` invariant on *Shipping Address*.
- *Order summary* display of shipping address is presentation — walk documents advance to *Delivery Option* via *Guest Checkout*.
- No *Customer Account* or *Saved Address* walks — Increment 3 guest-only invariant; account persistence deferred to Increment 4.

---

## **Order**

*Delivery option* selection for *standard delivery* and *click-and-collect*; shipping cost on *order*; guest *order status* lookup and lifecycle for ship-to-home.

### **Select Delivery Option — standard delivery and click-and-collect switching**

**Purpose:** Validate both *delivery option* variants offered, *shipping cost* recording, shipping vs pickup requirements, and mutual switching at checkout.
**Concepts traced:** Delivery Option, Standard Delivery, Click-and-Collect, Shipping Address, Order, Guest Checkout

#### Walk 1 — Covers: standard delivery and click-and-collect options shown

```
options: DeliveryOption[] = DeliveryOption.availableAtCheckout()
standard: StandardDelivery = options.byName("Standard Delivery")
clickCollect: ClickAndCollect = options.byName("Click-and-Collect")
assert standard.estimatedDeliveryWindow == "3–5 business days"
assert standard.shippingCost == 4.99
assert clickCollect.shippingCost == 0.00
// invariant: express and same-day deferred
assert DeliveryOption.expressAvailable() == false
assert DeliveryOption.sameDayAvailable() == false
return options
```

#### Walk 2 — Covers: standard delivery confirms shipping address and advances to payment

```
shipping: ShippingAddress = ShippingAddress.current()  // 28 Oak Lane, Edinburgh EH1 3DG
standard: StandardDelivery = StandardDelivery.select()
standard.confirmShippingAddressDestination(shipping, order: Order.pending())
// Standard Delivery.confirm shipping address destination → Order snapshot
order: Order = Order.pendingReview()
order.shippingCost = standard.shippingCost  // £4.99
assert order.shippingAddressLineOne == "28 Oak Lane"
assert order.shippingCity == "Edinburgh"
assert order.shippingPostcode == "EH1 3DG"
// checkout advances to Payment
return order
```

#### Walk 3 — Covers: switch from standard delivery to click-and-collect drops shipping requirement

```
guest: GuestCheckout = GuestCheckout.current()
// had Standard Delivery + Shipping Address 28 Oak Lane, Edinburgh
deliveryOption: DeliveryOption = DeliveryOption.switchTo("Click-and-Collect")
assert deliveryOption is ClickAndCollect
// invariant: shipping address requirement dropped; billing address remains required
assert guest.collectShippingAddress() == not_required
assert GuestCheckout.current().billingAddress.requiredFieldsComplete()
// Pickup Store selector displayed
return deliveryOption
```

#### Walk 4 — Covers: switch from click-and-collect to standard delivery prompts shipping address

```
guest: GuestCheckout = GuestCheckout.current()
clickCollect: ClickAndCollect = ClickAndCollect.withPickupStore(Store.byCode("STR-001"))
DeliveryOption.switchTo("Standard Delivery")
// invariant: shipping address form presented; pickup store selector dismissed
shipping: ShippingAddress = guest.collectShippingAddress()
assert shipping != null
assert clickCollect.selectedPickupStore == null
assert guest.billingAddress.unchanged()
return shipping
```

### **Track Order Status — status page content and guest lookup**

**Purpose:** Validate *expose guest order lookup*, ship-to-home lifecycle states on *order*, and status-appropriate tracking display without push notifications.
**Concepts traced:** Order, Tracking Number, Guest Checkout, Shipping Notification, Confirmation Email

#### Walk 1 — Covers: shipped order status page shows tracking and delivery estimate

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == shipped
tracking: TrackingNumber = order.trackingNumber
assert tracking.carrierReference == "RM-1Z999AA10123456784"
assert tracking.carrierName == "Royal Mail"
assert order.estimatedDeliveryDate == 2025-05-12
assert tracking.shipmentDate == 2025-05-07
// Order Status Page (presentation) — tracking link via Tracking Number.link to carrier tracking page
for each line in order.orderLineItems:
    assert line.productNameSnapshot in ["Premium Dog Harness", "Large Dog Bed"]
return order
```

#### Walk 2 — Covers: confirmed click-and-collect order — tracking placeholder

```
order: Order = Order.byNumber("ORD-3002")
assert order.orderStatus == confirmed
assert order.deliveryOption.deliveryMethodName == "Click-and-Collect"
assert order.trackingNumber == null
// presentation: "Tracking will be available once your order ships" / "Order being prepared"
return order
```

#### Walk 3 — Covers: delivered order status on next page visit

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == delivered
tracking: TrackingNumber = order.trackingNumber
assert tracking.carrierReference == "RM-1Z999AA10123456784"
// invariant: no push notification on status change — guest sees update on next Order Status Page visit
assert Notification.pushSentFor(order) == false
return order
```

#### Walk 4 — Covers: guest order lookup — matching order number and guest email

```
order: Order = Order.byNumber("ORD-3001")
assert order.guestEmailSnapshot == "sarah.jones@example.com"
result: LookupResult = order.exposeGuestOrderLookup(
    orderNumber: "ORD-3001",
    enteredEmail: "sarah.jones@example.com"
)
assert result.success == true
// invariant: no order details leak to unrelated emails
denied: LookupResult = order.exposeGuestOrderLookup(
    orderNumber: "ORD-3001",
    enteredEmail: "wrong@example.com"
)
assert denied.success == false
return result
```

#### Walk 5 — Covers: status change reflected on next visit without push notification

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == shipped
order.orderStatus = delivered
// guest's next visit to Order Status Page shows Delivered — no push notification
assert Notification.pushSentFor(order) == false
return order
```

### references

**Ref — Select Delivery Option**
Source: docs/story/specification-by-example/increment-3-specification-by-example.md
Locator: Story Select Delivery Option / Scenario 2
Extract: partial

```source
Given the customer selects **Standard Delivery** as the **Delivery Option**
And **Shipping Address** is **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **postcode** *EH1 3DG*
When the customer confirms the **Delivery Option**
Then **Shipping Address** is confirmed as the delivery destination for the **Order**
And **shipping cost** *£4.99* is recorded on the **Order**
```

**Ref — Track Order Status lookup**
Source: docs/story/specification-by-example/increment-3-specification-by-example.md
Locator: Story Track Order Status / Scenario Outline 2
Extract: partial

```source
Given **Order** {order_number} was placed with **Guest Email** {actual_guest_email}
When a guest enters **order number** {order_number} and email {entered_email} on the order lookup page
Then the system shows {expected_result}
```

### decisions made

- *Delivery Option* switching at checkout is orchestrated through *Guest Checkout* — CRC defines invariants on *Shipping Address* requirement and *Click-and-Collect* vs *Standard Delivery* collaborators; no explicit `switchTo()` on CRC — walk documents expected collaboration path.
- *Order Status Page* has no CRC block — presentation surface composing *Order*, *Tracking Number*, and *Order Line Item* per Increment 2 precedent.
- Carrier tracking link delegates to *Tracking Number.link to carrier tracking page* — URL construction is presentation.

---

## **Store**

Ship-to-home fulfillment at the stocking *store*; unified *order queue* with click-and-collect; manual *tracking number* entry at dispatch.

### **View and Process Incoming Orders — queue, detail, fulfillment with and without tracking**

**Purpose:** Validate *ship-to-home fulfillment* packing/dispatch, *prompt for tracking number*, and unified staff queue across delivery types.
**Concepts traced:** Ship-to-Home Fulfillment, Order, Order Line Item, Shipping Address, Tracking Number, Admin Dashboard, Click-and-Collect, Guest Checkout

#### Walk 1 — Covers: order queue shows all delivery types on admin dashboard

```
dashboard: AdminDashboard = AdminDashboard.openOrderQueue()
order1: Order = Order.byNumber("ORD-3001")  // Standard Delivery
order2: Order = Order.byNumber("ORD-3002")  // Click-and-Collect
queue: Order[] = dashboard.orderQueue
assert queue.contains(order1)
assert queue.contains(order2)
assert order1.deliveryOption.deliveryMethodName == "Standard Delivery"
assert order2.deliveryOption.deliveryMethodName == "Click-and-Collect"
// Ship-to-Home Fulfillment.display guest contact on queue
ShipToHomeFulfillment.displayGuestContactOnQueue(order1.placingParty)
return queue
```

#### Walk 2 — Covers: ship-to-home order detail shows shipping address and items to pack

```
order: Order = Order.byNumber("ORD-3001")
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
assert fulfillment.shippingAddressToPackAgainst.addressLineOne == "28 Oak Lane"
assert fulfillment.shippingAddressToPackAgainst.city == "Edinburgh"
assert fulfillment.shippingAddressToPackAgainst.postcode == "EH1 3DG"
items: OrderLineItem[] = fulfillment.orderLineItemsToPack
assert items.bySku("PET-HAR-001").quantity == 1  // Premium Dog Harness
assert items.bySku("PET-BED-015").quantity == 1  // Large Dog Bed
assert order.orderStatus == confirmed
return fulfillment
```

#### Walk 3 — Covers: fulfillment with tracking number triggers shipping notification

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == confirmed
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
fulfillment.markOrderFulfilled()
// invariant: transitions confirmed → fulfilled
assert order.orderStatus == fulfilled
tracking: TrackingNumber = fulfillment.promptForTrackingNumber()
tracking.carrierReference = "RM-1Z999AA10123456784"
tracking.carrierName = "Royal Mail"
tracking.shipmentDate = 2025-05-07
fulfillment.triggerShippingNotification(tracking)
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return tracking
```

#### Walk 4 — Covers: fulfillment without tracking — warning, still fulfilled, add later

```
order: Order = Order.byNumber("ORD-3001")
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
fulfillment.markOrderFulfilled()
assert order.orderStatus == fulfilled
// invariant: tracking number recommended but not blocking
tracking: TrackingNumber = fulfillment.promptForTrackingNumber()
assert tracking == skipped
// presentation warning: "Customer will not receive a shipping notification"
assert ShippingNotification.sentFor(order) == false
// order detail retains Add Tracking Number for later entry
return fulfillment
```

### references

**Ref — Ship-to-home fulfillment**
Source: docs/domain/crc.md
Locator: Core Domain / Store / Ship-to-Home Fulfillment
Extract: partial

```source
mark order fulfilled                | Order
                                    |   invariant: transitions order from confirmed to fulfilled
prompt for tracking number          | Tracking Number
                                    |   invariant: tracking number recommended but not blocking in Increment 3
trigger shipping notification       | Shipping Notification, Notification
```

**Ref — View and Process Incoming Orders**
Source: docs/story/specification-by-example/increment-3-specification-by-example.md
Locator: Story View and Process Incoming Orders / Scenario 3
Extract: partial

```source
When **Store Employee** marks **Order** *ORD-3001* as fulfilled through **Ship-to-Home Fulfillment**
Then the system prompts for a **Tracking Number**
When **Store Employee** enters **Tracking Number** with **carrier reference** *RM-1Z999AA10123456784* and **carrier name** *Royal Mail*
Then **Order** *ORD-3001* transitions **order status** to *fulfilled*
```

### decisions made

- *Mark as Fulfilled* action on order detail is presentation entry to *Ship-to-Home Fulfillment.mark order fulfilled*.
- Queue delivery type labels (*Ship — ORD-3001*, *Collect — ORD-3002*) are presentation — CRC *order queue* shows delivery type via *Order.delivery option*.
- Click-and-collect orders on unified queue delegate to *Pickup Fulfillment* for fulfillment detail — not walked in depth here; Increment 2 walkthrough covers pickup handoff.

---

## **Notification**

Transactional *shipping notification* when *tracking number* recorded; retry queue must not block *order status* transition to *shipped*.

### **Send Shipping Notification with Tracking Number**

**Purpose:** Validate *deliver when tracking number recorded*, content requirements, no auto-send without tracking, and late tracking entry path.
**Concepts traced:** Shipping Notification, Tracking Number, Ship-to-Home Fulfillment, Order, Guest Checkout, Notification

#### Walk 1 — Covers: shipping notification sent with tracking and delivery details

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == fulfilled
guest: GuestCheckout = order.placingParty
tracking: TrackingNumber = TrackingNumber.create(
    carrierReference: "RM-1Z999AA10123456784",
    carrierName: "Royal Mail",
    shipmentDate: 2025-05-07,
    originatingOrder: order
)
assert order.estimatedDeliveryDate == 2025-05-12
notification: ShippingNotification = ShippingNotification.create(
    originatingOrder: order,
    recipientGuestEmail: guest.guestEmail  // sarah.jones@example.com
)
notification.trackingNumber = tracking
notification.carrierName = tracking.carrierName
notification.estimatedDeliveryWindow = "3–5 business days"
ShipToHomeFulfillment.confirmDispatch(tracking)
tracking.triggerShippingNotification(notification)
notification.deliverWhenTrackingNumberRecorded()
assert notification.notificationSubject == "Your PawPlace order ORD-3001 has shipped"
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return notification
```

#### Walk 2 — Covers: email unavailable queues notification — order still shipped

```
order: Order = Order.byNumber("ORD-3001")
tracking: TrackingNumber = TrackingNumber.forOrder(order)
notification: ShippingNotification = ShippingNotification.forDispatch(order, tracking)
result: DeliveryResult = notification.deliverWhenTrackingNumberRecorded()
assert result.failed == true
notification.queueForRetryOnFailure(Notification)
assert notification.deliveryStatus == queued
// invariant: email delivery failure must not block order status transition to shipped
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return notification
```

#### Walk 3 — Covers: no tracking at fulfillment — no automatic shipping notification

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == fulfilled
assert order.trackingNumber == null
// invariant: Shipping Notification does not fire without tracking number
assert ShippingNotification.deliverWhenTrackingNumberRecorded() == not_triggered
assert order.orderStatus == fulfilled  // remains fulfilled until tracking added
return order
```

#### Walk 4 — Covers: late tracking number entry triggers shipping notification

```
order: Order = Order.byNumber("ORD-3003")
assert order.orderStatus == fulfilled
assert order.trackingNumber == null
tracking: TrackingNumber = TrackingNumber.addToOrder(
    order: order,
    carrierReference: "RM-2Z888BB20234567895",
    carrierName: "Royal Mail"
)
// invariant: staff may add tracking later via order detail
tracking.triggerShippingNotification(ShippingNotification.forOrder(order))
notification: ShippingNotification = ShippingNotification.forOrder(order)
notification.deliverWhenTrackingNumberRecorded()
assert notification.recipientGuestEmail == "alex.white@example.com"
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return notification
```

### references

**Ref — Shipping notifications**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 19
Extract: whole

```source
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.
```

**Ref — Send Shipping Notification**
Source: docs/story/specification-by-example/increment-3-specification-by-example.md
Locator: Story Send Shipping Notification / Scenario 1
Extract: partial

```source
When **Ship-to-Home Fulfillment** dispatch is confirmed
Then the system sends a **Shipping Notification** to *sarah.jones@example.com*
And the **Shipping Notification** includes **order number** *ORD-3001*, **Order Line Item** items shipped, **carrier name** *Royal Mail*, **Tracking Number** *RM-1Z999AA10123456784*, and **estimated delivery window** *3–5 business days*
```

### decisions made

- *Ship-to-Home Fulfillment.confirmDispatch* is walk shorthand for dispatch confirmation after *mark order fulfilled* + tracking entry — no separate CRC operation; collaborates via *trigger shipping notification* and *transition order status to shipped*.
- *Confirmation Email* extended with *shipping address snapshot* and *order status page link* for standard delivery — not re-walked here; Increment 2 walkthrough covers confirmation path.
- Marketing notifications and *Communication Preferences* remain deferred — no walks in Increment 3.

---

# Boundary Domain

## **Admin Dashboard**

Store employee operations surface — unified *order queue* routing to ship-to-home or click-and-collect fulfillment detail.

### **Order Queue — unified staff view across delivery types**

**Purpose:** Validate boundary entry for unified queue display and routing to fulfillment workflows.
**Concepts traced:** Admin Dashboard, Order, Ship-to-Home Fulfillment, Pickup Fulfillment, Guest Checkout

#### Walk 1 — Covers: employee opens unified order queue

```
dashboard: AdminDashboard = AdminDashboard.openOrderQueue()
queue: Order[] = dashboard.orderQueue
// invariant: confirmed orders across standard delivery and click-and-collect;
// shows order number, line items, delivery type label, guest email
for each order in queue:
    assert order.orderStatus == confirmed
    if order.deliveryOption is StandardDelivery:
        ShipToHomeFulfillment.surfaceOnOrderQueue(order)
    else:
        PickupFulfillment.surfaceOnOrderQueue(order)
    ShipToHomeFulfillment.displayGuestContactOnQueue(order.placingParty)
return dashboard
```

#### Walk 2 — Covers: route to ship-to-home fulfillment detail from queue

```
dashboard: AdminDashboard = AdminDashboard.openOrderQueue()
order: Order = dashboard.orderQueue.byNumber("ORD-3001")
assert order.deliveryOption.deliveryMethodName == "Standard Delivery"
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
assert fulfillment.shippingAddressToPackAgainst.postcode == "EH1 3DG"
return fulfillment
```

### references

**Ref — Admin dashboard order queue**
Source: docs/domain/crc.md
Locator: Boundary Domain / Admin Dashboard
Extract: partial

```source
order queue                         | Order, Ship-to-Home Fulfillment, Pickup Fulfillment
                                    |   invariant: Increment 3 — unified staff view of confirmed orders across standard delivery and click-and-collect; shows order number, line items, delivery type label, guest email; routes to ship-to-home or click-and-collect fulfillment detail
```

### decisions made

- Admin Dashboard does not own domain data — all mutations delegate to *Ship-to-Home Fulfillment*, *Pickup Fulfillment*, and *Order* in core domain.
- Manual tracking entry and label creation only — no automated carrier integration in Increment 3.
- Stock level edit form (Increment 1) and click-and-collect fulfillment queue (Increment 2) share Admin Dashboard boundary but are out of scope for this Increment 3 walkthrough file.

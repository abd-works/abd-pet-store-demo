---
state: walkthrough
increment_scope: Increment 2 — Click-and-collect
specification_refresh: Run 3 slot 55
prior_model: crc.md
---

# Module: PawPlace

Scope: Walk Increment 2 scenarios through `docs/domain/crc.md` (object model refresh deferred to Engineering). Traces eleven stories: *Add Product to Cart*, *Update Cart Quantity*, *Remove Product from Cart*, *Select Click-and-Collect Store*, *Check Out as Guest*, *Enter Billing Address*, *Select Payment Method*, *Process Card Payment via StripeWave*, *Confirm Order and Send Confirmation Email*, *Prepare Click-and-Collect Orders for Pickup*, *Fulfill Click-and-Collect Order*.

---

# Core Domain

## **Order**

Cart lifecycle from add through checkout transition. *Shopping Cart* is session-scoped and owned by *Guest Checkout* in Increment 2.

### **Add Product to Cart — merge duplicate and gate out-of-stock**

**Purpose:** Validate *merge duplicate product entries*, *validate quantities against stock*, and *gate order flow* on *stock availability*.
**Concepts traced:** Shopping Cart, Cart Item, Product, Stock Availability

#### Walk 1 — Covers: happy path — first add and quantity merge (PET-HAR-001)

```
catalog: ProductCatalog = ProductCatalog.findProduct(sku: "PET-HAR-001")
product: Product = catalog.product
availability: StockAvailability = product.stockAvailability.at(stockingStore: any)
assert availability.availableToSellQuantity == 22
cart: ShoppingCart = ShoppingCart.forGuestSession()
cartItem: CartItem = CartItem.add(
    product: product,
    quantity: 1,
    unitPriceAtTimeOfAdding: product.price  // £34.99
)
cart.mergeDuplicateProductEntries(cartItem)
cart.validateQuantitiesAgainstStock(availability, cartItem)
assert cartItem.linePrice == 34.99
assert cart.cartSubtotal == 34.99
return cart
```

#### Walk 2 — Covers: out-of-stock — gate order flow blocks add (PET-FLT-099)

```
product: Product = ProductCatalog.findProduct(sku: "PET-FLT-099")
availability: StockAvailability = product.stockAvailability.first()
assert availability.availableToSellQuantity == 0
assert availability.backorderEnabled == false
// Stock Availability.gate order flow — purchasability false
assert availability.gateOrderFlow() == blocked
// Product Page (presentation) disables add action — no Cart Item created
return availability
```

#### Walk 3 — Covers: multiple products as separate line items

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
harness: CartItem = cart.addProduct(sku: "PET-HAR-001", quantity: 1)
treats: CartItem = cart.addProduct(sku: "PET-TRT-042", quantity: 1)
assert cart.cartItems.count == 2
assert cart.cartSubtotal == 39.98
return cart
```

### **Update Cart Quantity — recalculate and reject over-stock**

**Purpose:** Validate *cart item* quantity changes, *line price* recalculation, and *validate quantities against stock*.
**Concepts traced:** Shopping Cart, Cart Item, Stock Availability

#### Walk 1 — Covers: quantity increase recalculates subtotal

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
item: CartItem = cart.cartItems.bySku("PET-HAR-001")  // qty 2, line £69.98
item.quantity = 3
item.linePrice = item.unitPriceAtTimeOfAdding * item.quantity  // £104.97
cart.validateQuantitiesAgainstStock(
    availability: StockAvailability.forProduct("PET-HAR-001"),
    cartItem: item
)
assert cart.cartSubtotal == 104.97
return cart
```

#### Walk 2 — Covers: quantity exceeds available-to-sell — rejected

```
item: CartItem = cart.cartItems.bySku("PET-HAR-001")  // qty 2
availability: StockAvailability = StockAvailability.forProduct("PET-HAR-001")
assert availability.availableToSellQuantity == 22
// Shopping Cart.validate quantities against stock — invariant: qty must not exceed available-to-sell
result: ValidationResult = cart.validateQuantitiesAgainstStock(availability, item, proposedQty: 25)
assert result.rejected == true
assert item.quantity == 2  // unchanged
return result
```

#### Walk 3 — Covers: quantity zero removes item (invariant: zero equivalent to removal)

```
item: CartItem = cart.cartItems.bySku("PET-TRT-042")
item.quantity = 0
cart.removeCartItem(item)
assert cart.cartSubtotal == 0.00
return cart
```

### **Remove Product from Cart — line removal and empty cart**

**Purpose:** Validate *cart item* removal and *cart subtotal* recalculation.
**Concepts traced:** Shopping Cart, Cart Item

#### Walk 1 — Covers: remove one of two items

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
// PET-HAR-001 qty 1 £34.99 + PET-TRT-042 qty 2 £9.98 → subtotal £44.97
cart.removeCartItem(cart.cartItems.bySku("PET-HAR-001"))
assert cart.cartSubtotal == 9.98
assert cart.cartItems.count == 1
return cart
```

#### Walk 2 — Covers: last item removed — checkout inaccessible

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
cart.removeCartItem(cart.cartItems.only())
assert cart.cartItems.isEmpty()
// invariant: transition to checkout requires at least one cart item
assert cart.transitionToCheckout() == blocked
return cart
```

### **Session-scoped cart — no cross-session persistence**

**Purpose:** Validate *shopping cart* session scope for *guest checkout* owning party.
**Concepts traced:** Shopping Cart, Guest Checkout

#### Walk 1 — Covers: browser session end clears cart

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
cart.addProduct(sku: "PET-HAR-001", quantity: 1)
session.end()
newCart: ShoppingCart = ShoppingCart.forGuestSession()
assert newCart.cartItems.isEmpty()
// invariant: Increment 2 — session-scoped guest cart only; customer account persistence deferred
return newCart
```

### references

**Ref — Shopping cart and checkout**
Source: docs/story/specification-by-example/increment-2-specification-by-example.md
Locator: Add Product to Cart / Update Cart Quantity / Remove Product from Cart stories
Extract: partial

```source
Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *{sku}*, **quantity** *{initial_qty}*
When the customer changes **quantity** on **Cart Item** *{sku}* to *{new_qty}*
Then **Cart Item** *{sku}* has **quantity** *{new_qty}* and **line price** *{expected_line_price}*
```

### decisions made

- *Product Page* and visible item count indicator have no CRC block — walks treat them as presentation surfaces composing Product, Stock Availability, and Shopping Cart.
- Cart Item line price recalculation is derived from quantity × unit price at time of adding — no separate CRC operation; walk applies invariant from Cart Item properties.
- Session scope enforced at Shopping Cart owning party (Guest Checkout) — no explicit `endSession()` on CRC; walk documents expected behavior under Increment 2 invariant.

---

## **Store**

Click-and-collect as sole *delivery option*; pickup store selection and fulfillment handoff at the stocking *store*.

### **Select Click-and-Collect Store — sole delivery option, no shipping address**

**Purpose:** Validate *click-and-collect* as sole *delivery option* and pickup store recording on *order*.
**Concepts traced:** Store Locator, Store, Click-and-Collect, Delivery Option, Order

#### Walk 1 — Covers: click-and-collect only at checkout

```
locator: StoreLocator = StoreLocator.loadActiveStores()
stores: Store[] = locator.listView  // STR-001 Camden, STR-002 Bristol
deliveryOption: DeliveryOption = DeliveryOption.clickAndCollectOnly()
assert deliveryOption.deliveryMethodName == "click-and-collect"
// invariant: Increment 2 — shipping methods deferred
clickCollect: ClickAndCollect = ClickAndCollect.create(
    selectedPickupStore: Store.byCode("STR-001")
)
assert clickCollect.selectedPickupStore.storeName == "PawPlace Camden"
assert Order.requiresShippingAddress == false
return clickCollect
```

#### Walk 2 — Covers: pickup store recorded on order path

```
store: Store = Store.byCode("STR-001")
clickCollect: ClickAndCollect = ClickAndCollect.create(selectedPickupStore: store)
clickCollect.selectedPickupStore = store
// Order will snapshot pickup store name, address, operating hours at confirm time
assert clickCollect.pickupStatus == pending
return clickCollect
```

#### Walk 3 — Covers: no location — stores listed without distance sort

```
locator: StoreLocator = StoreLocator.loadActiveStores()
// no sharedLocationInput, no postcodeInput
stores: Store[] = locator.listView.storesInDefaultOrder()
assert stores.count == 2
assert locator.sortNearestFirst() == not_applicable
return stores
```

### **Prepare Click-and-Collect Orders — queue sort and mark prepared**

**Purpose:** Validate *pickup fulfillment* preparation and *click-and-collect* queue ordering on *admin dashboard*.
**Concepts traced:** Pickup Fulfillment, Order, Admin Dashboard, Guest Checkout, Stock Availability

#### Walk 1 — Covers: queue sorted oldest first

```
dashboard: AdminDashboard = AdminDashboard.openClickAndCollectQueue(store: "STR-001")
order1: Order = Order.byNumber("ORD-2001")  // date 2025-05-06, status confirmed
order2: Order = Order.byNumber("ORD-2002")  // date 2025-05-07, status confirmed
queue: Order[] = dashboard.clickAndCollectFulfillmentQueue
assert queue[0].orderNumber == "ORD-2001"
assert queue[1].orderNumber == "ORD-2002"
// Pickup Fulfillment.display guest contact on queue
assert queue[0].guestEmailSnapshot == "sarah.jones@example.com"
return queue
```

#### Walk 2 — Covers: mark prepared → ready for pickup

```
fulfillment: PickupFulfillment = PickupFulfillment.forOrder("ORD-2001")
assert fulfillment.preparationStatus == pending
fulfillment.markOrderReadyForPickup()
// Pickup Fulfillment → Order: transitions confirmed → ready for pickup
assert fulfillment.preparationStatus == ready_for_pickup
assert Order.byNumber("ORD-2001").orderStatus == ready_for_pickup
return fulfillment
```

#### Walk 3 — Covers: stock warning at pickup store — order remains confirmed

```
order: Order = Order.byNumber("ORD-2002")
line: OrderLineItem = order.orderLineItems.bySku("PET-FLT-099")
availability: StockAvailability = StockAvailability.at(store: "STR-001", product: "PET-FLT-099")
assert availability.availableToSellQuantity == 0
// presentation warning on queue — employee resolves manually
assert order.orderStatus == confirmed
assert order.guestEmailSnapshot == "tom.brown@example.com"
return order
```

### **Fulfill Click-and-Collect Order — customer handoff and collected status**

**Purpose:** Validate *confirm customer handoff* and order lifecycle terminus *collected*.
**Concepts traced:** Pickup Fulfillment, Order, Click-and-Collect

#### Walk 1 — Covers: happy path — handoff at pickup store

```
fulfillment: PickupFulfillment = PickupFulfillment.forOrder("ORD-2001")
assert fulfillment.pickupStatus == ready_for_pickup
fulfillment.confirmCustomerHandoff()
// invariant: transitions ready for pickup → collected
assert fulfillment.pickupStatus == collected
assert Order.byNumber("ORD-2001").orderStatus == collected
return fulfillment
```

#### Walk 2 — Covers: uncollected after collection window — no auto-cancel

```
order: Order = Order.byNumber("ORD-2001")
assert order.orderStatus == ready_for_pickup
// collection window elapsed — staff outreach via guest email
assert order.guestEmailSnapshot == "sarah.jones@example.com"
assert order.orderStatus == ready_for_pickup  // not auto-cancelled
return order
```

### references

**Ref — Click-and-collect fulfillment**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

### decisions made

- *Click-and-Collect Queue* is a presentation surface on Admin Dashboard — walk enters through `clickAndCollectFulfillmentQueue` responsibility.
- Collection window enforcement is not modeled on Click-and-Collect CRC block — walk documents staff-outreach placeholder; open question from AC (notification window unspecified).
- Distance sort delegates to Store Locator responsibilities unchanged from Increment 1.

---

## **Customer Account**

Guest-only checkout path in Increment 2 — no *customer account* persistence; *billing address* snapshotted to *order* only.

### **Check Out as Guest — default path without account**

**Purpose:** Validate *complete purchase without account* and *guest email* invariant before payment.
**Concepts traced:** Guest Checkout, Shopping Cart, Order, Customer Account

#### Walk 1 — Covers: guest checkout as default — no login offered

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
assert cart.owningParty is GuestCheckout
assert cart.cartItems.isNotEmpty()
guest: GuestCheckout = GuestCheckout.start(cart)
// invariant: default checkout path — no login or registration before purchase
assert CustomerAccount.loginOffered == false
return guest
```

#### Walk 2 — Covers: valid guest details advance checkout

```
guest: GuestCheckout = GuestCheckout.current()
guest.guestEmail = "sarah.jones@example.com"
guest.guestFirstName = "Sarah"
guest.guestLastName = "Jones"
assert guest.guestEmail.isValid()
guest.collectBillingAddress()  // delegates to Billing Address
return guest
```

#### Walk 3 — Covers: invalid guest email blocked

```
guest: GuestCheckout = GuestCheckout.current()
guest.guestEmail = "not-an-email"
assert guest.guestEmail.isValid() == false
// invariant: guest email must be valid before checkout advances to payment
assert guest.advanceToPayment() == blocked
return guest
```

#### Walk 4 — Covers: account creation prompt after order — dismissible, non-blocking

```
order: Order = Order.confirmed("ORD-2001")
// Guest Checkout.promote account creation — deferred to Increment 4
prompt: AccountCreationPrompt = GuestCheckout.promoteAccountCreation(order)
assert prompt.dismissible == true
assert order.orderStatus == confirmed  // regardless of prompt choice
return prompt
```

### **Enter Billing Address — required fields, copy to order only**

**Purpose:** Validate *billing address* collection, validation, and *copy to confirmed order* without persistence.
**Concepts traced:** Guest Checkout, Billing Address, Order

#### Walk 1 — Covers: complete billing address advances to payment

```
billing: BillingAddress = BillingAddress.collect(
    billingName: "Sarah Jones",
    addressLineOne: "10 Elm Avenue",
    addressLineTwo: "Flat 3",
    city: "London",
    countyOrRegion: "Greater London",
    postcode: "SW1A 2AA",
    country: "United Kingdom"
)
assert billing.requiredFieldsComplete()
guest: GuestCheckout = GuestCheckout.current()
guest.collectBillingAddress(billing)
// checkout advances to Payment step
return billing
```

#### Walk 2 — Covers: missing required fields — blocked

```
billing: BillingAddress = BillingAddress.empty()
billing.addressLineOne = ""
billing.postcode = ""
assert billing.requiredFieldsComplete() == false
assert GuestCheckout.current().advanceToPayment() == blocked
return billing
```

#### Walk 3 — Covers: billing snapshotted on order, not persisted after guest checkout

```
billing: BillingAddress = BillingAddress.complete()  // 10 Elm Avenue, Flat 3, London SW1A 2AA
order: Order = Order.placeFromGuestCheckout(guestCheckout, billing)
billing.copyToConfirmedOrder(order)
assert order.billingAddressLineOne == "10 Elm Avenue"
assert order.billingPostcode == "SW1A 2AA"
GuestCheckout.complete()
// invariant: billing address not persisted after guest checkout completes
assert BillingAddress.persistedForGuest() == false
return order
```

### references

**Ref — Guest checkout**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
```

### decisions made

- *Order Confirmation Page* has no CRC block — presentation surface after Guest Checkout.completePurchaseWithoutAccount.
- Billing Address validation of individual fields is presentation concern — CRC owns `required fields complete` invariant and `copy to confirmed order`.
- Guest phone captured on Guest Checkout but not walked in billing scenarios — available for staff queue display via Pickup Fulfillment collaborator.

---

## **Payment**

*StripeWave* sole active *payment vendor* in Increment 2; authorize-capture-settle with webhook reconciliation.

### **Select Payment Method — StripeWave only**

**Purpose:** Validate *StripeWave* as sole active vendor; *saved payment method* and alternate vendors deferred.
**Concepts traced:** Payment, StripeWave, Payment Vendor, Order

#### Walk 1 — Covers: StripeWave card entry only at checkout

```
vendors: PaymentVendor[] = PaymentVendor.active()
assert vendors.count == 1
assert vendors[0] is StripeWave
order: Order = Order.pendingReview(orderTotal: 44.97)
payment: Payment = Payment.create(
    associatedOrder: order,
    paymentAmount: order.orderTotal,
    processingVendor: StripeWave
)
assert SavedPaymentMethod.availableToGuest() == false
return payment
```

### **Process Card Payment — success, decline, webhook, unavailable**

**Purpose:** Validate *initiate authorize-capture-settle*, *await payment confirmation*, *reconcile via webhook callback*, and order gating.
**Concepts traced:** Payment, StripeWave, Payment Confirmation, Webhook Callback, Order, Stock Availability

#### Walk 1 — Covers: successful payment confirms order and reserves stock

```
order: Order = Order.pendingPayment(orderNumber: "ORD-2001", orderTotal: 44.97)
payment: Payment = Payment.create(associatedOrder: order, paymentAmount: 44.97, processingVendor: StripeWave)
payment.initiateAuthorizeCaptureSettle(StripeWave)
confirmation: PaymentConfirmation = StripeWave.returnPaymentConfirmation(payment)
payment.awaitPaymentConfirmation(confirmation)
confirmation.confirmAssociatedOrder(order, StockAvailability)
// Payment Confirmation → Order + Stock Availability: order confirmed, inventory reserved at pickup store
assert payment.paymentStatus == settled
assert order.orderStatus == confirmed
for each line in order.orderLineItems:
    availability: StockAvailability = StockAvailability.at(pickupStore: order.pickupStore, product: line.skuSnapshot)
    availability.reserveQuantityOnOrderConfirm(order)
return order
```

#### Walk 2 — Covers: card declined — no order confirmed, no email

```
order: Order = Order.pendingPayment(orderTotal: 89.99)
payment: Payment = Payment.create(associatedOrder: order, paymentAmount: 89.99, processingVendor: StripeWave)
result: PaymentResult = StripeWave.processCard(payment)
assert result.declined == true
payment.paymentStatus = failed
// invariant: must not confirm order until payment confirmation succeeds
assert order.orderStatus != confirmed
assert ConfirmationEmail.sentFor(order) == false
payment.retryFailedCardPayments(StripeWave)  // surface decline, no duplicate charge
return payment
```

#### Walk 3 — Covers: webhook reconciles after timeout

```
payment: Payment = Payment.byReference("PAY-20250507-003")
assert payment.paymentStatus == pending
callback: WebhookCallback = StripeWave.sendWebhookCallback(payment)
callback.reconcilePendingPayment(payment)
callback.updateOrderOnSuccess(order: payment.associatedOrder, confirmation: callback.paymentConfirmation)
assert payment.paymentStatus == settled
assert payment.associatedOrder.orderStatus == confirmed
return payment
```

#### Walk 4 — Covers: webhook failure — order remains unpaid

```
payment: Payment = Payment.byReference("PAY-20250507-003")
callback: WebhookCallback = StripeWave.sendWebhookCallback(payment, success: false)
callback.reconcilePendingPayment(payment)
assert payment.paymentStatus == failed
assert payment.associatedOrder.orderStatus != confirmed
return payment
```

#### Walk 5 — Covers: StripeWave unavailable — no charge attempted

```
payment: Payment = Payment.create(associatedOrder: order, paymentAmount: 34.99, processingVendor: StripeWave)
result: PaymentResult = StripeWave.processCard(payment)
assert result.connectionUnavailable == true
assert payment.paymentStatus == pending  // no charge attempted
assert order.orderStatus != confirmed
return payment
```

### references

**Ref — Payment vendors**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases
```

### decisions made

- Card number/expiry/CVV validation is presentation-layer before Payment creation — CRC owns vendor processing and confirmation gating.
- *Processing indicator* during payment in flight is presentation — walk notes Payment.awaitPaymentConfirmation as the domain wait point.
- PayNova and VaultPay classes exist in CRC but are inactive in Increment 2 — walks assert they are not exposed.

---

## **Notification**

Transactional *confirmation email* on order confirm; delivery failure must not block confirmation.

### **Confirm Order and Send Confirmation Email**

**Purpose:** Validate *trigger confirmation notification*, *confirmation email* content, and retry queue on delivery failure.
**Concepts traced:** Order, Confirmation Email, Payment Confirmation, Guest Checkout, Notification

#### Walk 1 — Covers: confirmation page and email on payment success

```
order: Order = Order.byNumber("ORD-2001")  // status confirmed
guest: GuestCheckout = order.placingParty
email: ConfirmationEmail = ConfirmationEmail.create(
    originatingOrder: order,
    recipientGuestEmail: guest.guestEmail  // sarah.jones@example.com
)
email.pickupStoreAddress = order.pickupStoreAddressSnapshot
email.pickupStoreOperatingHours = order.pickupStoreOperatingHoursSnapshot
email.maskedPaymentMethodDisplay = Payment.byOrder(order).maskedDisplay()
PaymentConfirmation.triggerConfirmationEmail(email)
email.deliverOnPaymentConfirmation()
assert email.notificationSubject == "Your PawPlace Order ORD-2001 is confirmed"
// Order Confirmation Page (presentation) displays order number, line items, total, pickup store
return email
```

#### Walk 2 — Covers: email queued on delivery failure — order stays confirmed

```
email: ConfirmationEmail = ConfirmationEmail.forOrder("ORD-2001")
deliveryResult: DeliveryResult = email.deliverOnPaymentConfirmation()
assert deliveryResult.failed == true
email.queueForRetryOnFailure(Notification)
assert email.deliveryStatus == queued
// invariant: email delivery failure must not block order confirmation
assert Order.byNumber("ORD-2001").orderStatus == confirmed
return email
```

### references

**Ref — Order confirmation**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 19
Extract: whole

```source
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.
```

### decisions made

- Order.triggerConfirmationNotification collaborates with Notification and Confirmation Email — walk uses PaymentConfirmation as the trigger path per Increment 2 CRC refresh.
- Masked payment method display on Confirmation Email collaborates with Payment — no separate CRC operation on Payment for masking; walk references Payment state.
- Pickup-ready customer notification (when staff marks prepared) remains open — AC defers notification window; not walked in Increment 2.

---

# Boundary Domain

## **Admin Dashboard**

Store employee operations surface — *click-and-collect fulfillment queue* and handoff confirmation.

### **Click-and-Collect Queue — employee fulfillment cycle**

**Purpose:** Validate boundary entry for queue display, preparation, and empty-queue completion state.
**Concepts traced:** Admin Dashboard, Pickup Fulfillment, Order, Guest Checkout

#### Walk 1 — Covers: employee opens queue at pickup store

```
dashboard: AdminDashboard = AdminDashboard.openClickAndCollectQueue(store: "STR-001")
queue: Order[] = dashboard.clickAndCollectFulfillmentQueue
// invariant: pending orders sorted oldest first; shows order number, line items, guest email
for each order in queue:
    PickupFulfillment.displayGuestContactOnQueue(order.placingParty)
return dashboard
```

#### Walk 2 — Covers: all orders fulfilled — empty queue state

```
dashboard: AdminDashboard = AdminDashboard.openClickAndCollectQueue(store: "STR-001")
lastOrder: Order = queue.lastPending()
PickupFulfillment.forOrder(lastOrder).confirmCustomerHandoff()
assert dashboard.clickAndCollectFulfillmentQueue.isEmpty()
return dashboard
```

### references

**Ref — Admin dashboard click-and-collect**
Source: docs/domain/crc.md
Locator: Boundary Domain / Admin Dashboard
Extract: partial

```source
click-and-collect fulfillment queue | Click-and-Collect, Order, Pickup Fulfillment
                                    |   invariant: Increment 2 — lists confirmed click-and-collect orders pending pickup fulfillment, sorted oldest first; shows order number, line items, guest email
```

### decisions made

- Admin Dashboard does not own domain data — all mutations delegate to Pickup Fulfillment and Order in core domain.
- Stock level edit form (Increment 1) shares Admin Dashboard boundary but is out of scope for this Increment 2 walkthrough file.

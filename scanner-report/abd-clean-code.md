# Scanner Report — abd-clean-code

**Workspace:** c:\dev\abd-pet-store-demo
**Date:** 2026-05-24 23:11:50

---

## Scanner Execution Status

### 🟨 Overall Status: NEEDS ATTENTION

| Status | Count | Description |
|--------|-------|-------------|
| 🟩 Executed Successfully | 17 | Scanners ran without errors |
| 🟩 Clean Rules | 6 | No violations found |
| 🟥 Rules with Errors | 11 | Found 108 error violation(s) |

**Total Rules:** 17
- **Rules with Scanners:** 17
  - 🟩 **Executed Successfully:** 17

---

### Scanner Results

| Status | Rule | Violations |
|--------|------|------------|
| 🟥 ERRORS | Function Size Scanner | 38 |
| 🟥 ERRORS | Swallowed Exceptions Scanner | 19 |
| 🟥 ERRORS | Explicit Dependencies Scanner | 13 |
| 🟥 ERRORS | Domain Language Code Scanner | 8 |
| 🟥 ERRORS | Exception Handling Scanner | 7 |
| 🟥 ERRORS | Intention Revealing Names Scanner | 6 |
| 🟥 ERRORS | Separate Concerns Scanner | 6 |
| 🟥 ERRORS | Single Responsibility Scanner | 5 |
| 🟥 ERRORS | Duplication Scanner | 2 |
| 🟥 ERRORS | Function Single Responsibility Scanner | 2 |
| 🟥 ERRORS | Meaningful Context Scanner | 2 |
| 🟩 CLEAN | Abstraction Levels Scanner | 0 |
| 🟩 CLEAN | Clear Parameters Scanner | 0 |
| 🟩 CLEAN | Consistent Naming Scanner | 0 |
| 🟩 CLEAN | Property Encapsulation Code Scanner | 0 |
| 🟩 CLEAN | Simplify Control Flow Scanner | 0 |
| 🟩 CLEAN | Useless Comments Scanner | 0 |

---

## Violations

### 🟥 Function Size Scanner — 38 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\App.tsx` | Function 'ProductPageContent' is ~24 lines (max 20). Extract helpers. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\app-client\src\App.tsx` | Function 'App' is ~31 lines (max 20). Extract helpers. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\app-client\src\components\CheckoutProgressTabs.tsx` | Function 'CheckoutProgressTabs' is ~23 lines (max 20). Extract helpers. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\app-client\src\components\StripeWaveFields.tsx` | Function 'StripeWaveFields' is ~43 lines (max 20). Extract helpers. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\app-client\src\context\CartContext.tsx` | Function 'CartProvider' is ~38 lines (max 20). Extract helpers. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\app-client\src\context\CheckoutContext.tsx` | Function 'CheckoutProvider' is ~34 lines (max 20). Extract helpers. | error |
| 7 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\CartItemList.tsx` | Function 'CartItemList' is ~71 lines (max 20). Extract helpers. | error |
| 8 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ClickAndCollectOrderDetailPage.tsx` | Function 'ClickAndCollectOrderDetailPage' is ~78 lines (max 20). Extract helpers. | error |
| 9 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ClickAndCollectQueuePage.tsx` | Function 'ClickAndCollectQueuePage' is ~62 lines (max 20). Extract helpers. | error |
| 10 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\DeliveryOptionPage.tsx` | Function 'DeliveryOptionPage' is ~403 lines (max 20). Extract helpers. | error |
| 11 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\DeliveryOptionPage.tsx` | Function 'handleShareLocation' is ~25 lines (max 20). Extract helpers. | error |
| 12 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\DeliveryOptionPage.tsx` | Function 'handleContinue' is ~95 lines (max 20). Extract helpers. | error |
| 13 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\GuestBillingPage.tsx` | Function 'GuestBillingPage' is ~279 lines (max 20). Extract helpers. | error |
| 14 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\GuestBillingPage.tsx` | Function 'validate' is ~29 lines (max 20). Extract helpers. | error |
| 15 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\GuestBillingPage.tsx` | Function 'handleContinue' is ~63 lines (max 20). Extract helpers. | error |
| 16 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderConfirmationPage.tsx` | Function 'OrderConfirmationPage' is ~167 lines (max 20). Extract helpers. | error |
| 17 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderLookupPage.tsx` | Function 'OrderLookupPage' is ~111 lines (max 20). Extract helpers. | error |
| 18 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderLookupPage.tsx` | Function 'handleLookup' is ~23 lines (max 20). Extract helpers. | error |
| 19 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderQueuePage.tsx` | Function 'OrderQueuePage' is ~149 lines (max 20). Extract helpers. | error |
| 20 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderStatusPage.tsx` | Function 'OrderStatusPage' is ~213 lines (max 20). Extract helpers. | error |
| 21 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PaymentPage.tsx` | Function 'PaymentPage' is ~223 lines (max 20). Extract helpers. | error |
| 22 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PaymentPage.tsx` | Function 'handleConfirm' is ~49 lines (max 20). Extract helpers. | error |
| 23 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PickupStoreSelectionPage.tsx` | Function 'PickupStoreSelectionPage' is ~275 lines (max 20). Extract helpers. | error |
| 24 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PickupStoreSelectionPage.tsx` | Function 'handleShareLocation' is ~25 lines (max 20). Extract helpers. | error |
| 25 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PickupStoreSelectionPage.tsx` | Function 'handleContinue' is ~77 lines (max 20). Extract helpers. | error |
| 26 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ShipToHomeOrderDetailPage.tsx` | Function 'ShipToHomeOrderDetailPage' is ~247 lines (max 20). Extract helpers. | error |
| 27 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ShipToHomeOrderDetailPage.tsx` | Function 'handleMarkFulfilled' is ~29 lines (max 20). Extract helpers. | error |
| 28 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ShipToHomeOrderDetailPage.tsx` | Function 'handleAddTracking' is ~27 lines (max 20). Extract helpers. | error |
| 29 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ShippingAddressPage.tsx` | Function 'ShippingAddressPage' is ~181 lines (max 20). Extract helpers. | error |
| 30 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\ShoppingCartPage.tsx` | Function 'ShoppingCartPage' is ~127 lines (max 20). Extract helpers. | error |
| 31 | `C:\dev\abd-pet-store-demo\packages\app-server\index.ts` | Function 'createApp' is ~30 lines (max 20). Extract helpers. | error |
| 32 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Function 'handleOrderError' is ~33 lines (max 20). Extract helpers. | error |
| 33 | `C:\dev\abd-pet-store-demo\packages\order\server\order.mapper.ts` | Function 'toOrderDto' is ~31 lines (max 20). Extract helpers. | error |
| 34 | `C:\dev\abd-pet-store-demo\packages\order\server\order.mapper.ts` | Function 'toOrderStatusDto' is ~24 lines (max 20). Extract helpers. | error |
| 35 | `C:\dev\abd-pet-store-demo\packages\order\server\order.routes.ts` | Function 'createOrderRouter' is ~25 lines (max 20). Extract helpers. | error |
| 36 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Function 'orderStatusLabel' is ~51 lines (max 20). Extract helpers. | error |
| 37 | `C:\dev\abd-pet-store-demo\packages\product-catalog\client\AddToCartButton.tsx` | Function 'AddToCartButton' is ~53 lines (max 20). Extract helpers. | error |
| 38 | `C:\dev\abd-pet-store-demo\packages\product-catalog\client\useProductInStock.ts` | Function 'useProductInStock' is ~24 lines (max 20). Extract helpers. | error |

### 🟥 Swallowed Exceptions Scanner — 19 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\checkout\checkoutDraft.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\DeliveryOptionPage.tsx` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\GuestBillingPage.tsx` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderLookupPage.tsx` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PaymentPage.tsx` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PickupStoreSelectionPage.tsx` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 7 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 8 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 9 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 10 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 11 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 12 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 13 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 14 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 15 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 16 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 17 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 18 | `C:\dev\abd-pet-store-demo\packages\payment\server\payment.controller.ts` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |
| 19 | `C:\dev\abd-pet-store-demo\packages\product-catalog\client\AddToCartButton.tsx` | Empty catch block swallows exception silently. Log, re-throw, or handle the error. | error |

### 🟥 Explicit Dependencies Scanner — 13 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\cart\shared\ShoppingCart.ts` | Hidden dependency 'new CartItem()' constructed inside constructor of 'ShoppingCart'. Inject via constructor parameter instead. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\order\shared\BillingAddress.ts` | Hidden dependency 'new BillingAddress()' constructed inside constructor of 'BillingAddress'. Inject via constructor parameter instead. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\order\shared\GuestCheckout.ts` | Hidden dependency 'new GuestCheckout()' constructed inside constructor of 'GuestCheckout'. Inject via constructor parameter instead. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Hidden dependency 'new Order()' constructed inside constructor of 'Order'. Inject via constructor parameter instead. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Hidden dependency 'new Order()' constructed inside constructor of 'Order'. Inject via constructor parameter instead. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Hidden dependency 'new WrongDeliveryOptionError()' constructed inside constructor of 'Order'. Inject via constructor parameter instead. | error |
| 7 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Hidden dependency 'new WrongDeliveryOptionError()' constructed inside constructor of 'Order'. Inject via constructor parameter instead. | error |
| 8 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Hidden dependency 'new WrongDeliveryOptionError()' constructed inside constructor of 'Order'. Inject via constructor parameter instead. | error |
| 9 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Hidden dependency 'new WrongDeliveryOptionError()' constructed inside constructor of 'Order'. Inject via constructor parameter instead. | error |
| 10 | `C:\dev\abd-pet-store-demo\packages\order\shared\OrderLineItem.ts` | Hidden dependency 'new OrderLineItem()' constructed inside constructor of 'OrderLineItem'. Inject via constructor parameter instead. | error |
| 11 | `C:\dev\abd-pet-store-demo\packages\order\shared\OrderLineItem.ts` | Hidden dependency 'new OrderLineItem()' constructed inside constructor of 'OrderLineItem'. Inject via constructor parameter instead. | error |
| 12 | `C:\dev\abd-pet-store-demo\packages\order\shared\TrackingNumber.ts` | Hidden dependency 'new InvalidTrackingNumberError()' constructed inside constructor of 'TrackingNumber'. Inject via constructor parameter instead. | error |
| 13 | `C:\dev\abd-pet-store-demo\packages\order\shared\TrackingNumber.ts` | Hidden dependency 'new TrackingNumber()' constructed inside constructor of 'TrackingNumber'. Inject via constructor parameter instead. | error |

### 🟥 Domain Language Code Scanner — 8 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.controller.ts` | Class 'CartController' uses generic suffix 'Controller'. Use a domain entity name instead. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.service.ts` | Class 'CartService' uses generic suffix 'Service'. Use a domain entity name instead. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\order\server\order.controller.ts` | Class 'OrderController' uses generic suffix 'Controller'. Use a domain entity name instead. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\order\server\order.notification-service.ts` | Class 'NotificationService' uses generic suffix 'Service'. Use a domain entity name instead. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\order\server\order.service.ts` | Class 'OrderService' uses generic suffix 'Service'. Use a domain entity name instead. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\payment\server\payment.controller.ts` | Class 'PaymentController' uses generic suffix 'Controller'. Use a domain entity name instead. | error |
| 7 | `C:\dev\abd-pet-store-demo\packages\payment\server\payment.controller.ts` | Class 'WebhookController' uses generic suffix 'Controller'. Use a domain entity name instead. | error |
| 8 | `C:\dev\abd-pet-store-demo\packages\payment\server\payment.service.ts` | Class 'PaymentService' uses generic suffix 'Service'. Use a domain entity name instead. | error |

### 🟥 Exception Handling Scanner — 7 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\checkout\checkoutDraft.ts` | Catch block has no error parameter. Capture the error to log or wrap it. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\DeliveryOptionPage.tsx` | Try block spans ~29 lines (max 25). Narrow the try to the risky operation only. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\GuestBillingPage.tsx` | Try block spans ~27 lines (max 25). Narrow the try to the risky operation only. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\OrderLookupPage.tsx` | Catch block has no error parameter. Capture the error to log or wrap it. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PaymentPage.tsx` | Try block spans ~37 lines (max 25). Narrow the try to the risky operation only. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PickupStoreSelectionPage.tsx` | Try block spans ~35 lines (max 25). Narrow the try to the risky operation only. | error |
| 7 | `C:\dev\abd-pet-store-demo\packages\payment\server\payment.controller.ts` | Try block spans ~35 lines (max 25). Narrow the try to the risky operation only. | error |

### 🟥 Intention Revealing Names Scanner — 6 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\context\CartContext.tsx` | Generic name 'value' reveals no intent. Name it after what it represents in the domain. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\app-client\src\context\CheckoutContext.tsx` | Generic name 'value' reveals no intent. Name it after what it represents in the domain. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.service.ts` | Generic name 'item' reveals no intent. Name it after what it represents in the domain. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\cart\shared\ShoppingCart.ts` | Generic name 'item' reveals no intent. Name it after what it represents in the domain. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\cart\shared\ShoppingCart.ts` | Generic name 'value' reveals no intent. Name it after what it represents in the domain. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Generic name 'item' reveals no intent. Name it after what it represents in the domain. | error |

### 🟥 Separate Concerns Scanner — 6 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\cart\client\cart.api.ts` | Function 'readCart' mixes I/O (fetch/fs) with pure computation. Extract I/O into its own function. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\order\client\order.api.ts` | Function 'readOrder' mixes I/O (fetch/fs) with pure computation. Extract I/O into its own function. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\order\client\order.api.ts` | Function 'readOrderStatus' mixes I/O (fetch/fs) with pure computation. Extract I/O into its own function. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\order\client\order.api.ts` | Function 'fetchOrderQueue' mixes I/O (fetch/fs) with pure computation. Extract I/O into its own function. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\payment\client\payment.api.ts` | Function 'payOrder' mixes I/O (fetch/fs) with pure computation. Extract I/O into its own function. | error |
| 6 | `C:\dev\abd-pet-store-demo\packages\shared\api-fetch.ts` | Function 'apiFetch' mixes I/O (fetch/fs) with pure computation. Extract I/O into its own function. | error |

### 🟥 Single Responsibility Scanner — 5 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\cart\server\cart.service.ts` | Class 'CartService' has 14 methods (max 10). Split responsibilities. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\cart\shared\ShoppingCart.ts` | Class 'ShoppingCart' has 17 methods (max 10). Split responsibilities. | error |
| 3 | `C:\dev\abd-pet-store-demo\packages\order\server\order.service.ts` | Class 'OrderService' has 20 methods (max 10). Split responsibilities. | error |
| 4 | `C:\dev\abd-pet-store-demo\packages\order\shared\Order.ts` | Class 'Order' has 27 methods (max 10). Split responsibilities. | error |
| 5 | `C:\dev\abd-pet-store-demo\packages\payment\shared\Payment.ts` | Class 'Payment' has 12 methods (max 10). Split responsibilities. | error |

### 🟥 Duplication Scanner — 2 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\components\Increment1Nav.tsx` | Function 'linkStyle' appears to duplicate 'linkStyle' (C:\dev\abd-pet-store-demo\packages\app-client\src\components\CustomerNav.tsx:16). Extract a shared helper. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PickupStoreSelectionPage.tsx` | Function 'handleShareLocation' appears to duplicate 'handleShareLocation' (C:\dev\abd-pet-store-demo\packages\app-client\src\pages\DeliveryOptionPage.tsx:97). Extract a shared helper. | error |

### 🟥 Function Single Responsibility Scanner — 2 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\checkout\checkoutDraft.ts` | Function 'loadCheckoutDraft' mixes side-effects (sessionStorage.) with return computation. Separate into a pure function and a side-effectful caller. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\shared\api-fetch.ts` | Function 'apiFetch' mixes side-effects (fetch() with return computation. Separate into a pure function and a side-effectful caller. | error |

### 🟥 Meaningful Context Scanner — 2 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `C:\dev\abd-pet-store-demo\packages\app-client\src\pages\PaymentPage.tsx` | Magic number 503 used inline. Extract to a named constant. | error |
| 2 | `C:\dev\abd-pet-store-demo\packages\app-server\session.ts` | Magic number 1000 used inline. Extract to a named constant. | error |

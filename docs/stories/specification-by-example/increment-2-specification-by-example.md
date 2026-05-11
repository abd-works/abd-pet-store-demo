# Specification by Example — Increment 2: Click-and-collect  

---  

## Story: `Add Product to Cart`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Product:  

| scenario | product_name | sku | price | brand | expected_availability |  
|---|---|---|---|---|---|  
| 1 | Premium Dog Harness | PET-HAR-001 | £34.99 | WalkRight | In stock |  
| 2 | Salmon Cat Treats | PET-TRT-042 | £4.99 | PurrDelight | In stock |  
| 3 | Exotic Fish Filter | PET-FLT-099 | £89.99 | AquaPure | Out of stock |  

### StockAvailability:  

| scenario | product_sku | available_to_sell_quantity | backorder_enabled | expected_add_to_cart_state |  
|---|---|---|---|---|  
| 1 | PET-HAR-001 | 22 | false | enabled |  
| 2 | PET-TRT-042 | 48 | false | enabled |  
| 3 | PET-FLT-099 | 0 | false | disabled |  

---  

### Scenario Outline 1: `Product added to cart updates quantity and badge`  

Given the **ProductCatalog** contains **Product** {product_name} with **sku** {sku} and **price** {price}  
And **StockAvailability** for **Product** {sku} has **availableToSellQuantity** {stock}  
And the **ShoppingCart** contains {initial_items} item(s) of **Product** {sku}  
When the customer selects "Add to Cart" on the product page for **Product** {product_name}  
Then **ShoppingCart** contains a **CartItem** with **productInCart** {sku}, **quantity** {expected_quantity}, **unitPriceAtTimeOfAdding** {price}  
And **CartItem** has **linePrice** {expected_line_price}  
And the cart badge shows {expected_badge_count}  

#### Examples:  

| scenario | product_name | sku | price | stock | initial_items | expected_quantity | expected_line_price | expected_badge_count |  
|---|---|---|---|---|---|---|---|---|  
| 1 | Premium Dog Harness | PET-HAR-001 | £34.99 | 22 | 0 | 1 | £34.99 | 1 |  
| 2 | Premium Dog Harness | PET-HAR-001 | £34.99 | 22 | 1 | 2 | £69.98 | 2 |  

### Scenario 2: `Out-of-stock product displays availability indicator`  

Given the **ProductCatalog** contains **Product** *Exotic Fish Filter* with **sku** *PET-FLT-099*  
And **StockAvailability** for **Product** *PET-FLT-099* has **availableToSellQuantity** *0* and **backorderEnabled** *false*  
When the customer views the product page for **Product** *Exotic Fish Filter*  
Then the "Add to Cart" button is *disabled*  
And the product page displays availability label *Out of stock — check back soon*  

### Scenario 3: `Multiple products appear as separate line items`  

Given the **ShoppingCart** contains a **CartItem** with **productInCart** *PET-HAR-001*, **quantity** *1*, **linePrice** *£34.99*  
When the customer adds **Product** *Salmon Cat Treats* (*PET-TRT-042*) at **price** *£4.99* to the **ShoppingCart**  
Then **ShoppingCart** contains *2* **CartItem** entries  
And **CartItem** for *PET-HAR-001* has **quantity** *1* and **linePrice** *£34.99*  
And **CartItem** for *PET-TRT-042* has **quantity** *1* and **linePrice** *£4.99*  
And **ShoppingCart** has **cartSubtotal** *£39.98*  
And the cart badge shows *2*  

---  

## Story: `Update Cart Quantity`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### CartItem:  

| scenario | product_sku | product_name | unit_price_at_time_of_adding | quantity | expected_line_price |  
|---|---|---|---|---|---|  
| 1 | PET-HAR-001 | Premium Dog Harness | £34.99 | 2 | £69.98 |  
| 2 | PET-TRT-042 | Salmon Cat Treats | £4.99 | 1 | £4.99 |  

---  

### Scenario Outline 1: `Quantity change recalculates line price and subtotal`  

Given the **ShoppingCart** contains a **CartItem** with **productInCart** {sku}, **quantity** {initial_qty}, **unitPriceAtTimeOfAdding** {unit_price}  
And **ShoppingCart** has **cartSubtotal** {initial_subtotal}  
When the customer changes **quantity** on **CartItem** {sku} to {new_qty}  
Then **CartItem** {sku} has **quantity** {new_qty} and **linePrice** {expected_line_price}  
And **ShoppingCart** has **cartSubtotal** {expected_subtotal}  
And the cart badge shows {expected_badge_count}  

#### Examples:  

| scenario | sku | unit_price | initial_qty | initial_subtotal | new_qty | expected_line_price | expected_subtotal | expected_badge_count |  
|---|---|---|---|---|---|---|---|---|  
| 1 | PET-HAR-001 | £34.99 | 2 | £69.98 | 3 | £104.97 | £104.97 | 3 |  
| 2 | PET-HAR-001 | £34.99 | 2 | £69.98 | 1 | £34.99 | £34.99 | 1 |  

### Scenario 2: `Quantity set to zero removes item from cart`  

Given the **ShoppingCart** contains a **CartItem** with **productInCart** *PET-TRT-042*, **quantity** *1*, **unitPriceAtTimeOfAdding** *£4.99*  
And **ShoppingCart** has **cartSubtotal** *£4.99*  
When the customer sets **quantity** on **CartItem** *PET-TRT-042* to *0*  
Then **CartItem** *PET-TRT-042* is removed from the **ShoppingCart**  
And **ShoppingCart** has **cartSubtotal** *£0.00*  
And the cart badge shows *0*  

### Scenario 3: `Invalid quantity shows validation feedback`  

Given the **ShoppingCart** contains a **CartItem** with **productInCart** *PET-HAR-001* and **quantity** *2*  
When the customer enters **quantity** *-1* on **CartItem** *PET-HAR-001*  
Then the cart displays validation message *Quantity must be zero or more* on that line  
And **CartItem** *PET-HAR-001* retains **quantity** *2*  

---  

## Story: `Remove Product from Cart`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Scenario 1: `Item removed and totals update`  

Given the **ShoppingCart** contains **CartItem** with **productInCart** *PET-HAR-001*, **quantity** *1*, **linePrice** *£34.99*  
And the **ShoppingCart** contains **CartItem** with **productInCart** *PET-TRT-042*, **quantity** *2*, **linePrice** *£9.98*  
And **ShoppingCart** has **cartSubtotal** *£44.97*  
When the customer selects remove on **CartItem** *PET-HAR-001*  
Then **CartItem** *PET-HAR-001* is removed from the **ShoppingCart**  
And **ShoppingCart** has **cartSubtotal** *£9.98*  
And the cart badge shows *2*  

### Scenario 2: `Last item removed shows continue-shopping guidance`  

Given the **ShoppingCart** contains only **CartItem** with **productInCart** *PET-TRT-042* and **quantity** *1*  
When the customer selects remove on **CartItem** *PET-TRT-042*  
Then the **ShoppingCart** displays heading *Your cart is empty*  
And a *Continue shopping* link is displayed  
And the checkout button is *hidden*  

---  

## Story: `Select Click-and-Collect Store`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | address_line_one | city | postcode | expected_display_line |  
|---|---|---|---|---|---|---|  
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 42 High Street, London NW1 8QP |  
| 2 | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 15 Harbour Road, Bristol BS1 4DJ |  

### ClickAndCollect:  

| scenario | originating_order | selected_pickup_store | expected_pickup_status |  
|---|---|---|---|  
| 1 | ORD-2001 | STR-001 | pending |  

---  

### Scenario 1: `Available stores shown at delivery step`  

Given the **StoreLocator** contains **Store** *PawPlace Camden* (*STR-001*) and **Store** *PawPlace Bristol* (*STR-002*)  
And the customer has reached the delivery step in checkout  
When the customer views the *Store Selector* for **ClickAndCollect**  
Then the selector displays *2* stores  
And **Store** *STR-001* shows *42 High Street*, *London*, *NW1 8QP*, and operating hours  
And **Store** *STR-002* shows *15 Harbour Road*, *Bristol*, *BS1 4DJ*, and operating hours  
And if customer location is known, distance from **StoreLocator.calculateDistanceFromCustomer** is displayed  

### Scenario 2: `Pickup store recorded without shipping address`  

Given the customer selects **Store** *PawPlace Camden* (*STR-001*) from the *Store Selector*  
When the customer confirms **ClickAndCollect** at **selectedPickupStore** *STR-001*  
Then **ClickAndCollect** records **selectedPickupStore** as **Store** *STR-001*  
And the checkout displays confirmation label *Collecting from PawPlace Camden*  
And the shipping address form is not presented  

### Scenario 3: `Stores listed with location entry prompt`  

Given the customer has not provided location data  
And the **StoreLocator** contains *2* active **Store** entries  
When the customer views the *Store Selector* for **ClickAndCollect**  
Then *2* stores are listed in alphabetical order  
And each store shows name, address, and operating hours  
And the selector displays prompt *Enter a postcode or share location for distance-sorted results*  

---  

## Story: `Check Out as Guest`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### GuestCheckout:  

| scenario | guest_email | guest_first_name | guest_last_name | expected_validation |  
|---|---|---|---|---|  
| 1 | sarah.jones@example.com | Sarah | Jones | valid |  
| 2 | not-an-email | Tom | Brown | invalid |  

---  

### Scenario 1: `Guest checkout offered as default`  

Given the customer has items in the **ShoppingCart**  
And the customer is not logged in  
When the customer proceeds to checkout  
Then the system offers *Guest Checkout* as the default path  
And the system collects **guestEmail**, **guestFirstName**, and **guestLastName**  

### Scenario 2: `Order placed with guest details`  

Given the customer provides **GuestCheckout** with **guestEmail** *sarah.jones@example.com*, **guestFirstName** *Sarah*, **guestLastName** *Jones*  
When the customer completes **GuestCheckout**  
Then an **Order** is placed via **GuestCheckout.completePurchaseWithoutAccount**  
And a confirmation email is sent to *sarah.jones@example.com*  
And guest details are retained only for this transaction  

### Scenario 3: `Email validation shows inline error`  

Given the customer enters **guestEmail** *not-an-email*  
When the customer attempts to proceed from the email step  
Then the email field shows validation message *Please enter a valid email address*  
And the checkout remains on the current step until a valid email is provided  

### Scenario 4: `Account creation prompted after guest checkout`  

Given the customer has completed **GuestCheckout** with **guestEmail** *sarah.jones@example.com*  
When the order confirmation page is displayed  
Then the system calls **GuestCheckout.promoteAccountCreation**  
And displays prompt *Create an account for order history, saved addresses, and reorder*  
And the prompt is dismissible — the **Order** is already placed regardless  

---  

## Story: `Enter Billing Address`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### SavedAddress (billing):  

| scenario | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |  
|---|---|---|---|---|---|---|---|  
| 1 | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |  
| 2 | — | — | London | — | — | United Kingdom | invalid — missing addressLineOne and postcode |  

---  

### Scenario 1: `Billing address form collects full details`  

Given the customer has reached the billing step in the *Checkout Flow*  
When the billing address form is presented  
Then the form collects: **addressLineOne**, **addressLineTwo** (optional), **city**, **countyOrRegion**, **postcode**, and **country**  
And required fields are marked: **addressLineOne**, **city**, **postcode**, **country**  

### Scenario 2: `Complete billing address advances to payment`  

Given the customer enters **addressLineOne** *10 Elm Avenue*, **addressLineTwo** *Flat 3*, **city** *London*, **countyOrRegion** *Greater London*, **postcode** *SW1A 2AA*, **country** *United Kingdom*  
When the customer submits the billing address  
Then the checkout advances to the payment step  
And the order summary shows billing address *10 Elm Avenue, Flat 3, London, Greater London, SW1A 2AA*  

### Scenario 3: `Missing required fields show validation messages`  

Given the customer leaves **addressLineOne** blank and **postcode** blank  
When the customer submits the billing address form  
Then the form shows validation message *Address line 1 is required* on **addressLineOne**  
And the form shows validation message *Postcode is required* on **postcode**  
And the checkout remains on the billing step  

---  

## Story: `Select Payment Method`  

**Story type:** user  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Scenario 1: `StripeWave card entry presented`  

Given the customer has reached the payment step in checkout  
And **PaymentVendor** *StripeWave* is the only active vendor with **supportedPaymentTypes** containing *credit and debit card*  
When the payment method selection is displayed  
Then *StripeWave (Credit/Debit Card)* is the available option  
And the form collects: card number, expiry month/year, and CVV  

### Scenario Outline 2: `Card details validated before payment`  

Given the customer enters card number {card_number}, expiry {expiry}, CVV {cvv}  
When the card details are validated client-side  
Then the validation result is {expected_result}  
And the checkout {expected_action}  

#### Examples:  

| scenario | card_number | expiry | cvv | expected_result | expected_action |  
|---|---|---|---|---|---|  
| 1 | 4242 4242 4242 4242 | 12/27 | 123 | valid | advances to order review |  
| 2 | 4242 4242 4242 4242 | 01/22 | 123 | invalid — card expired | shows error: Card expiry date is in the past |  

---  

## Story: `Process Card Payment via StripeWave`  

**Story type:** system  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Payment:  

| scenario | payment_reference | payment_amount | currency | expected_final_status | processing_vendor |  
|---|---|---|---|---|---|  
| 1 | PAY-20250507-001 | £44.97 | GBP | settled | StripeWave |  
| 2 | PAY-20250507-002 | £89.99 | GBP | failed | StripeWave |  
| 3 | PAY-20250507-003 | £34.99 | GBP | settled (via webhook) | StripeWave |  

### Order:  

| scenario | order_number | order_total | expected_order_status |  
|---|---|---|---|  
| 1 | ORD-2001 | £44.97 | confirmed |  
| 2 | — | £89.99 | not created |  
| 3 | ORD-2002 | £34.99 | confirmed |  

---  

### Scenario 1: `Successful authorize-capture-settle confirms order`  

Given the customer has confirmed an **Order** with **orderTotal** *£44.97*  
And **PaymentVendor** *StripeWave* is the **processingVendor**  
When **Payment.authorize** is called on **Payment** *PAY-20250507-001*  
And **StripeWave** returns success  
Then **Payment** transitions **paymentStatus** to *authorized*  
When **Payment.capture** is called  
Then **Payment** transitions **paymentStatus** to *captured*  
When **Payment.settle** is called  
Then **Payment** transitions **paymentStatus** to *settled*  
And **Order.confirm** is called with the completed **Payment**  
And **Order** *ORD-2001* transitions **orderStatus** to *confirmed*  

### Scenario 2: `Card declined shows decline reason and retry`  

Given the customer has confirmed an **Order** with **orderTotal** *£89.99*  
And **PaymentVendor** *StripeWave* is the **processingVendor**  
When **Payment.authorize** is called and **StripeWave** declines the card  
Then the customer sees error message *Your card was declined — please check your details or try another card*  
And the checkout displays a *Try another card* button  
And **Payment** *PAY-20250507-002* has **paymentStatus** *failed*  

### Scenario 3: `Webhook callback reconciles after timeout`  

Given the customer's **Payment** *PAY-20250507-003* timed out during authorize  
And **paymentStatus** is *pending*  
When **Payment.handleWebhookCallback** receives a success payload from **StripeWave**  
Then **Payment** updates **paymentStatus** to *settled*  
And **Order** *ORD-2002* transitions **orderStatus** to *confirmed*  
And the confirmation email is sent to the customer  

### Scenario 4: `Webhook failure notifies customer to retry`  

Given the customer's **Payment** *PAY-20250507-003* timed out during authorize  
And **paymentStatus** is *pending*  
When **Payment.handleWebhookCallback** receives a failure payload from **StripeWave**  
Then **Payment** updates **paymentStatus** to *failed*  
And the customer receives notification *Your payment could not be processed — please try again*  
And the order page displays a *Retry payment* link  

### Scenario 5: `Payment service unavailable shows retry option`  

Given the customer has confirmed an **Order** with **orderTotal** *£34.99*  
When **Payment.authorize** is called and the connection to **StripeWave** is unavailable  
Then the customer sees message *Payment service temporarily unavailable — please try again shortly*  
And a *Retry* button is displayed after a brief wait  
And no charge is attempted  

---  

## Story: `Confirm Order and Send Confirmation Email`  

**Story type:** system  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Order:  

| scenario | order_number | order_total | pickup_store_name | pickup_store_address | expected_confirmation_display |  
|---|---|---|---|---|---|  
| 1 | ORD-2001 | £44.97 | PawPlace Camden | 42 High Street, London NW1 8QP | Order confirmed — collect from PawPlace Camden |  

### Notification:  

| scenario | notification_channel | notification_subject | recipient_email | expected_delivery_status |  
|---|---|---|---|---|  
| 1 | email | Your PawPlace Order ORD-2001 is confirmed | sarah.jones@example.com | sent |  
| 2 | email | Your PawPlace Order ORD-2001 is confirmed | sarah.jones@example.com | queued |  

---  

### Scenario 1: `Confirmation page and email sent on payment success`  

Given **Payment** for **Order** *ORD-2001* has **paymentStatus** *settled*  
And **ClickAndCollect** for **Order** *ORD-2001* has **selectedPickupStore** *PawPlace Camden* at *42 High Street, London NW1 8QP*  
And **GuestCheckout** has **guestEmail** *sarah.jones@example.com*  
When **Order.confirm** is called with the completed **Payment**  
Then the *Order Confirmation Page* displays **orderNumber** *ORD-2001*, items, **orderTotal** *£44.97*, and **ClickAndCollect** store details  
And **Notification.createTransactional** fires with type *order-confirmation*, recipient *sarah.jones@example.com*  
And the **Notification** includes: **orderNumber** *ORD-2001*, itemized list, total paid *£44.97*, masked payment method, pickup **Store** address *42 High Street, London NW1 8QP* and operating hours  

### Scenario 2: `Email queued, confirmation page still displayed`  

Given **Payment** for **Order** *ORD-2001* has **paymentStatus** *settled*  
When **Order.confirm** is called with the completed **Payment**  
And the email delivery system is temporarily unavailable  
Then the *Order Confirmation Page* displays to the customer with **orderNumber** *ORD-2001*  
And the **Notification** is queued with **deliveryStatus** *queued* for retry  
And **Order** *ORD-2001* remains *confirmed*  

---  

## Story: `Prepare Click-and-Collect Orders for Pickup`  

**Story type:** store employee  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Order:  

| scenario | order_number | order_date | order_status | guest_email | pickup_store_code | expected_queue_position |  
|---|---|---|---|---|---|---|  
| 1 | ORD-2001 | 2025-05-06 | confirmed | sarah.jones@example.com | STR-001 | 1 |  
| 2 | ORD-2002 | 2025-05-07 | confirmed | tom.brown@example.com | STR-001 | 2 |  

### OrderLineItem:  

| scenario | order_number | product_name_snapshot | sku_snapshot | quantity | unit_price_snapshot | expected_line_total |  
|---|---|---|---|---|---|---|  
| 1 | ORD-2001 | Premium Dog Harness | PET-HAR-001 | 1 | £34.99 | £34.99 |  
| 2 | ORD-2001 | Salmon Cat Treats | PET-TRT-042 | 2 | £4.99 | £9.98 |  
| 3 | ORD-2002 | Exotic Fish Filter | PET-FLT-099 | 1 | £89.99 | £89.99 |  

### StockAvailability:  

| scenario | product_sku | store_code | available_to_sell_quantity | expected_stock_indicator |  
|---|---|---|---|---|  
| 1 | PET-HAR-001 | STR-001 | 22 | in stock |  
| 2 | PET-FLT-099 | STR-001 | 0 | out of stock — warn employee |  

---  

### Scenario 1: `Queue shows confirmed orders sorted by date`  

Given the *Store Employee* is at **Store** *PawPlace Camden* (*STR-001*)  
And the **ClickAndCollect** queue contains **Order** *ORD-2001* (date *2025-05-06*) and **Order** *ORD-2002* (date *2025-05-07*)  
When the *Store Employee* opens the *Click-and-Collect Queue*  
Then orders are sorted oldest first: *ORD-2001* at position *1*, *ORD-2002* at position *2*  
And each order shows **orderNumber**, **OrderLineItem** details (product name, quantity), and **guestEmail**  

### Scenario 2: `Order marked prepared transitions to ready for pickup`  

Given the *Store Employee* views **Order** *ORD-2001* in the *Click-and-Collect Queue*  
And **Order** *ORD-2001* has **orderStatus** *confirmed*  
When the *Store Employee* marks **Order** *ORD-2001* as "prepared"  
Then **ClickAndCollect** for **Order** *ORD-2001* updates **pickupStatus** to *ready*  
And **Order** *ORD-2001* transitions **orderStatus** to *Ready for Pickup*  

### Scenario 3: `Stock warning shown with contact details`  

Given **Order** *ORD-2002* contains **OrderLineItem** *Exotic Fish Filter* (*PET-FLT-099*) with **quantity** *1*  
And **StockAvailability** for **Product** *PET-FLT-099* at **Store** *STR-001* has **availableToSellQuantity** *0*  
When the *Store Employee* views **Order** *ORD-2002* in the *Click-and-Collect Queue*  
Then a stock warning *Out of stock at this store* appears on the line item for *Exotic Fish Filter*  
And the customer's **guestEmail** *tom.brown@example.com* is displayed for manual contact  
And the **Order** remains in *confirmed* status for employee resolution  

---  

## Story: `Fulfill Click-and-Collect Order`  

**Story type:** store employee  

**Sources / context:** object-model.md, increment-2-acceptance-criteria.md  

---  

### Scenario 1: `Customer collects order, status transitions to collected`  

Given **Order** *ORD-2001* has **orderStatus** *Ready for Pickup*  
And **ClickAndCollect** for **Order** *ORD-2001* has **pickupStatus** *ready*  
And the customer arrives at **Store** *PawPlace Camden*  
When the *Store Employee* confirms the handoff for **Order** *ORD-2001*  
Then **Order** *ORD-2001* transitions **orderStatus** to *Collected*  
And **ClickAndCollect** updates **pickupStatus** to *collected*  

### Scenario 2: `Uncollected order shows contact details for outreach`  

Given **Order** *ORD-2001* has **orderStatus** *Ready for Pickup*  
And the collection window has passed without customer arrival  
When the *Store Employee* views **Order** *ORD-2001* on the staff dashboard  
Then **Order** *ORD-2001* displays **orderStatus** *Ready for Pickup*  
And the customer's **guestEmail** *sarah.jones@example.com* is shown for outreach  
And the dashboard displays prompt *Contact customer — collection window elapsed*  

### Scenario 3: `All orders fulfilled shows completion state`  

Given **Order** *ORD-2001* is the last pending order in the *Click-and-Collect Queue*  
When the *Store Employee* marks **Order** *ORD-2001* as *Collected*  
Then the *Click-and-Collect Queue* shows heading *All orders fulfilled*  
And the queue displays *No pending orders — check back later*  

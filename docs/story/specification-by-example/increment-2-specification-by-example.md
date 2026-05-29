---
state: specification-by-example
increment_scope: Increment 2 — Click-and-collect
specification_refresh: Run 3 slot 53
---

# Specification by Example — Increment 2: Click-and-collect

**Refresh:** Run 3 slot 53 — aligned to `docs/domain/ubiquitous-language.md`, `docs/domain/crc.md`, `docs/domain/domain.json`, and `docs/story/acceptance-criteria/increment-2-acceptance-criteria.md`. Guest checkout only; session-scoped *shopping cart*; *StripeWave* sole *payment vendor*; *click-and-collect* sole *delivery option*.

---

## Story: `Add Product to Cart`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Product:

| scenario | product_name | sku | price | brand | expected_availability |
|---|---|---|---|---|---|
| 1 | Premium Dog Harness | PET-HAR-001 | £34.99 | WalkRight | In stock |
| 2 | Salmon Cat Treats | PET-TRT-042 | £4.99 | PurrDelight | In stock |
| 3 | Exotic Fish Filter | PET-FLT-099 | £89.99 | AquaPure | Out of stock |

### Stock Availability:

| scenario | product_sku | available_to_sell_quantity | backorder_enabled | expected_add_to_cart_state |
|---|---|---|---|---|
| 1 | PET-HAR-001 | 22 | false | enabled |
| 2 | PET-TRT-042 | 48 | false | enabled |
| 3 | PET-FLT-099 | 0 | false | disabled |

---

### Scenario Outline 1: `Product added to cart updates quantity and badge`

Given the **Product Catalog** contains **Product** *{product_name}* with **sku** *{sku}* and **price** *{price}*
And **Stock Availability** for **Product** *{sku}* has **available to sell quantity** *{stock}*
And the **Shopping Cart** contains *{initial_items}* **Cart Item**(s) for **Product** *{sku}*
When the customer selects *Add to Cart* on the **Product Page** for **Product** *{product_name}*
Then the **Shopping Cart** contains a **Cart Item** with **product in cart** *{sku}*, **quantity** *{expected_quantity}*, **unit price at time of adding** *{price}*
And the **Cart Item** has **line price** *{expected_line_price}*
And the visible item count indicator shows *{expected_badge_count}*

#### Examples:

| scenario | product_name | sku | price | stock | initial_items | expected_quantity | expected_line_price | expected_badge_count |
|---|---|---|---|---|---|---|---|---|
| 1 | Premium Dog Harness | PET-HAR-001 | £34.99 | 22 | 0 | 1 | £34.99 | 1 |
| 2 | Premium Dog Harness | PET-HAR-001 | £34.99 | 22 | 1 | 2 | £69.98 | 2 |

### Scenario 2: `Out-of-stock product cannot be added`

Given the **Product Catalog** contains **Product** *Exotic Fish Filter* with **sku** *PET-FLT-099*
And **Stock Availability** for **Product** *PET-FLT-099* has **available to sell quantity** *0* and backorder is *disabled*
When the customer views the **Product Page** for **Product** *Exotic Fish Filter*
Then the *Add to Cart* action is *disabled*
And the **Product Page** displays availability label *Out of stock — check back soon*
And **Product** *PET-FLT-099* is not added to the **Shopping Cart**

### Scenario 3: `Multiple products appear as separate line items`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-HAR-001*, **quantity** *1*, **line price** *£34.99*
When the customer adds **Product** *Salmon Cat Treats* (*PET-TRT-042*) at **price** *£4.99* to the **Shopping Cart**
Then the **Shopping Cart** contains *2* **Cart Item** entries
And the **Cart Item** for *PET-HAR-001* has **quantity** *1* and **line price** *£34.99*
And the **Cart Item** for *PET-TRT-042* has **quantity** *1* and **line price** *£4.99*
And the **Shopping Cart** has **cart subtotal** *£39.98*
And the visible item count indicator shows *2*

### Scenario 4: `Session-scoped cart does not survive browser session end`

Given a guest customer has **Shopping Cart** with **Cart Item** *PET-HAR-001* **quantity** *1* in the current browser session
When the browser session ends before checkout completes
Then the **Shopping Cart** contents are not available in a new session
And a new session starts with an empty **Shopping Cart**

---

## Story: `Update Cart Quantity`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Cart Item:

| scenario | product_sku | product_name | unit_price_at_time_of_adding | quantity | expected_line_price |
|---|---|---|---|---|---|
| 1 | PET-HAR-001 | Premium Dog Harness | £34.99 | 2 | £69.98 |
| 2 | PET-TRT-042 | Salmon Cat Treats | £4.99 | 1 | £4.99 |

---

### Scenario Outline 1: `Quantity change recalculates line price and subtotal`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *{sku}*, **quantity** *{initial_qty}*, **unit price at time of adding** *{unit_price}*
And the **Shopping Cart** has **cart subtotal** *{initial_subtotal}*
When the customer changes **quantity** on **Cart Item** *{sku}* to *{new_qty}*
Then **Cart Item** *{sku}* has **quantity** *{new_qty}* and **line price** *{expected_line_price}*
And the **Shopping Cart** has **cart subtotal** *{expected_subtotal}*
And the visible item count indicator shows *{expected_badge_count}*

#### Examples:

| scenario | sku | unit_price | initial_qty | initial_subtotal | new_qty | expected_line_price | expected_subtotal | expected_badge_count |
|---|---|---|---|---|---|---|---|---|
| 1 | PET-HAR-001 | £34.99 | 2 | £69.98 | 3 | £104.97 | £104.97 | 3 |
| 2 | PET-HAR-001 | £34.99 | 2 | £69.98 | 1 | £34.99 | £34.99 | 1 |

### Scenario 2: `Quantity set to zero removes item from cart`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-TRT-042*, **quantity** *1*, **unit price at time of adding** *£4.99*
And the **Shopping Cart** has **cart subtotal** *£4.99*
When the customer sets **quantity** on **Cart Item** *PET-TRT-042* to *0*
Then **Cart Item** *PET-TRT-042* is removed from the **Shopping Cart**
And the **Shopping Cart** has **cart subtotal** *£0.00*
And the visible item count indicator shows *0*

### Scenario 3: `Invalid quantity shows validation feedback`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-HAR-001* and **quantity** *2*
When the customer enters **quantity** *-1* on **Cart Item** *PET-HAR-001*
Then the **Shopping Cart** displays validation message *Quantity must be zero or more* on that line
And **Cart Item** *PET-HAR-001* retains **quantity** *2*
And the **Shopping Cart** **cart subtotal** remains *£69.98*

### Scenario 4: `Quantity exceeding stock availability is rejected`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-HAR-001* and **quantity** *2*
And **Stock Availability** for **Product** *PET-HAR-001* has **available to sell quantity** *22*
When the customer enters **quantity** *25* on **Cart Item** *PET-HAR-001*
Then the **Shopping Cart** displays validation message *Only 22 available* on that **Cart Item**
And **Cart Item** *PET-HAR-001* retains **quantity** *2*
And the **Shopping Cart** **cart subtotal** remains *£69.98*

---

## Story: `Remove Product from Cart`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Scenario 1: `Item removed and totals update`

Given the **Shopping Cart** contains **Cart Item** with **product in cart** *PET-HAR-001*, **quantity** *1*, **line price** *£34.99*
And the **Shopping Cart** contains **Cart Item** with **product in cart** *PET-TRT-042*, **quantity** *2*, **line price** *£9.98*
And the **Shopping Cart** has **cart subtotal** *£44.97*
When the customer selects remove on **Cart Item** *PET-HAR-001*
Then **Cart Item** *PET-HAR-001* is removed from the **Shopping Cart**
And the **Shopping Cart** has **cart subtotal** *£9.98*
And the visible item count indicator shows *2*

### Scenario 2: `Last item removed shows continue-shopping guidance`

Given the **Shopping Cart** contains only **Cart Item** with **product in cart** *PET-TRT-042* and **quantity** *1*
When the customer selects remove on **Cart Item** *PET-TRT-042*
Then the **Shopping Cart** displays heading *Your cart is empty*
And a *Continue shopping* affordance returns the customer to the **Product Catalog**
And checkout is not accessible from the empty **Shopping Cart**

---

## Story: `Select Click-and-Collect Store`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Store:

| scenario | store_name | store_code | address_line_one | city | postcode | expected_display_line |
|---|---|---|---|---|---|---|
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 42 High Street, London NW1 8QP |
| 2 | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 15 Harbour Road, Bristol BS1 4DJ |

---

### Scenario 1: `Click-and-collect is the only delivery option at checkout`

Given the **Store Locator** contains **Store** *PawPlace Camden* (*STR-001*) and **Store** *PawPlace Bristol* (*STR-002*)
And the customer has reached the delivery step in checkout
When the customer views the store selection for **Click-and-Collect**
Then *click-and-collect* is the only **Delivery Option** presented
And the list shows *2* **Store** locations with **address**, **operating hours**, and **distance** when customer location is known
And **Store** *STR-001* shows *42 High Street*, *London*, *NW1 8QP*, and **operating hours**
And **Store** *STR-002* shows *15 Harbour Road*, *Bristol*, *BS1 4DJ*, and **operating hours**

### Scenario 2: `Pickup store recorded without shipping address`

Given the customer selects **Store** *PawPlace Camden* (*STR-001*) as **Pickup Store**
When the customer confirms **Click-and-Collect** at **Pickup Store** *STR-001*
Then **Pickup Store** *PawPlace Camden* is recorded as the collection location for the **Order**
And the checkout displays confirmation label *Collecting from PawPlace Camden*
And no shipping address is required

### Scenario 3: `Stores listed with location entry prompt when distance unknown`

Given the customer has not provided **Postcode** or **Shared Location**
And the **Store Locator** contains *2* active **Store** entries
When the customer views the store selection for **Click-and-Collect**
Then *2* **Store** locations are listed
And each **Store** shows name, **address**, and **operating hours**
And the selector displays prompt *Enter a postcode or share location for distance-sorted results*

### Scenario 4: `Checkout summary shows chosen pickup store`

Given the customer has selected **Pickup Store** *PawPlace Camden* (*STR-001*) at *42 High Street, London NW1 8QP*
When the customer confirms **Click-and-Collect** and advances in checkout
Then the checkout summary shows **Pickup Store** name *PawPlace Camden*
And the checkout summary shows **address** *42 High Street, London NW1 8QP*

---

## Story: `Check Out as Guest`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Guest Checkout:

| scenario | guest_email | guest_first_name | guest_last_name | expected_validation |
|---|---|---|---|---|
| 1 | sarah.jones@example.com | Sarah | Jones | valid |
| 2 | not-an-email | Tom | Brown | invalid |

---

### Scenario 1: `Guest checkout offered as default without account path`

Given the customer has items in the **Shopping Cart**
And the customer is not logged in
When the customer proceeds to checkout
Then the system offers **Guest Checkout** as the default path
And the system collects **Guest Email**, guest first name, and guest last name
And login and **Customer Account** registration are not offered before purchase

### Scenario 2: `Order placed with guest details and confirmation email`

Given the customer provides **Guest Checkout** with **Guest Email** *sarah.jones@example.com*, guest first name *Sarah*, guest last name *Jones*
When the customer completes **Guest Checkout**
Then an **Order** is placed
And a **Confirmation Email** is sent to *sarah.jones@example.com*
And guest details are retained only for this transaction
And no **Customer Account** is created

### Scenario 3: `Invalid guest email shows inline error`

Given the customer enters **Guest Email** *not-an-email*
When the customer attempts to proceed from the email step
Then the email field shows validation message *Please enter a valid email address*
And checkout remains on the current step until a valid **Guest Email** is provided

### Scenario 4: `Account creation prompted after guest checkout`

Given the customer has completed **Guest Checkout** with **Guest Email** *sarah.jones@example.com*
When the **Order Confirmation Page** is displayed
Then the system prompts **Customer Account** creation with message *Create an account for order history, saved addresses, and reorder*
And the prompt is dismissible
And the **Order** is already placed regardless of the customer's choice

---

## Story: `Enter Billing Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Billing Address:

| scenario | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |
|---|---|---|---|---|---|---|---|
| 1 | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |
| 2 | — | — | London | — | — | United Kingdom | invalid — missing address line 1 and postcode |

---

### Scenario 1: `Billing address form collects full details`

Given the customer has reached the billing step in checkout
When the **Billing Address** form is presented
Then the form collects: name, **address line 1**, **address line 2** (optional), **city**, county/state, **postcode**, and **country**
And required fields are marked: **address line 1**, **city**, **postcode**, **country**

### Scenario 2: `Complete billing address advances to payment`

Given the customer enters **Billing Address** with **address line 1** *10 Elm Avenue*, **address line 2** *Flat 3*, **city** *London*, county *Greater London*, **postcode** *SW1A 2AA*, **country** *United Kingdom*
When the customer submits the **Billing Address**
Then checkout advances to the **Payment** step
And the order summary shows **Billing Address** *10 Elm Avenue, Flat 3, London, Greater London, SW1A 2AA*

### Scenario 3: `Missing required fields show validation messages`

Given the customer leaves **address line 1** blank and **postcode** blank
When the customer submits the **Billing Address** form
Then the form shows validation message *Address line 1 is required* on **address line 1**
And the form shows validation message *Postcode is required* on **postcode**
And checkout remains on the billing step

### Scenario 4: `Billing address copied to order only for guest checkout`

Given the customer completes **Guest Checkout** with **Billing Address** *10 Elm Avenue, Flat 3, London, Greater London, SW1A 2AA*
When the **Order** is confirmed
Then the **Billing Address** is copied onto the confirmed **Order**
And the **Billing Address** is not persisted after **Guest Checkout** completes

---

## Story: `Select Payment Method`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Scenario 1: `StripeWave card entry is the only payment vendor`

Given the customer has reached the **Payment** step in checkout
And **StripeWave** is the only active **Payment Vendor** supporting credit and debit card
When the payment method selection is displayed
Then *StripeWave (Credit/Debit Card)* is the available **Payment Vendor**
And the form collects: card number, expiry month/year, and CVV
And *PayNova*, *VaultPay*, and **Saved Payment Method** do not appear

### Scenario Outline 2: `Card details validated before payment attempt`

Given the customer enters card number *{card_number}*, expiry *{expiry}*, CVV *{cvv}*
When the card details are validated
Then the validation result is *{expected_result}*
And checkout *{expected_action}*

#### Examples:

| scenario | card_number | expiry | cvv | expected_result | expected_action |
|---|---|---|---|---|---|
| 1 | 4242 4242 4242 4242 | 12/27 | 123 | valid | advances to order review |
| 2 | 4242 4242 4242 4242 | 01/22 | 123 | invalid — card expired | shows error: Card expiry date is in the past |
| 3 | 4242 4242 4242 4242 | 12/27 | — | invalid — missing CVV | shows error: CVV is required |

---

## Story: `Process Card Payment via StripeWave`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

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

### Scenario 1: `Successful payment confirms order`

Given the customer has confirmed an **Order** with **order total** *£44.97*
And **StripeWave** is the **Payment Vendor**
When the customer confirms the **Order**
Then the system initiates card processing with **StripeWave** for **order total** *£44.97*
And the customer sees a processing indicator while the **Payment** is in flight
When **StripeWave** returns successful **Payment Confirmation**
Then **Payment** *PAY-20250507-001* has **payment status** *settled*
And **Order** *ORD-2001* transitions **order status** to *confirmed*

### Scenario 2: `Card declined shows decline reason and retry`

Given the customer has confirmed an **Order** with **order total** *£89.99*
And **StripeWave** is the **Payment Vendor**
When the system processes card payment with **StripeWave**
And **StripeWave** declines the card
Then the customer sees error message *Your card was declined — please check your details or try another card*
And checkout displays a *Try another card* retry option
And **Payment** *PAY-20250507-002* has **payment status** *failed*
And no **Order** is confirmed
And no **Confirmation Email** is sent

### Scenario 3: `Webhook callback reconciles after timeout`

Given the customer's **Payment** *PAY-20250507-003* timed out during processing
And **Payment** **payment status** is *pending*
When a **Webhook Callback** from **StripeWave** arrives with successful **Payment Confirmation**
Then the system reconciles the **Webhook Callback** against the pending **Payment**
And **Payment** *PAY-20250507-003* updates **payment status** to *settled*
And **Order** *ORD-2002* transitions **order status** to *confirmed*
And the **Confirmation Email** is sent to the customer

### Scenario 4: `Webhook failure notifies customer to retry`

Given the customer's **Payment** *PAY-20250507-003* timed out during processing
And **Payment** **payment status** is *pending*
When a **Webhook Callback** from **StripeWave** arrives with failed **Payment Confirmation**
Then **Payment** updates **payment status** to *failed*
And the customer receives notification *Your payment could not be processed — please try again*
And the **Order** remains unpaid

### Scenario 5: `Payment service unavailable shows retry option`

Given the customer has confirmed an **Order** with **order total** *£34.99*
When the system attempts card processing with **StripeWave**
And the connection to **StripeWave** is temporarily unavailable
Then the customer sees message *Payment service temporarily unavailable — please try again shortly*
And a *Retry* option is displayed after a brief wait
And no charge is attempted
And no **Order** is confirmed

---

## Story: `Confirm Order and Send Confirmation Email`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_total | pickup_store_name | pickup_store_address | expected_confirmation_display |
|---|---|---|---|---|---|
| 1 | ORD-2001 | £44.97 | PawPlace Camden | 42 High Street, London NW1 8QP | Order confirmed — collect from PawPlace Camden |

### Confirmation Email:

| scenario | notification_subject | recipient_guest_email | expected_delivery_status |
|---|---|---|---|
| 1 | Your PawPlace Order ORD-2001 is confirmed | sarah.jones@example.com | sent |
| 2 | Your PawPlace Order ORD-2001 is confirmed | sarah.jones@example.com | queued |

---

### Scenario 1: `Confirmation page and email sent on payment success`

Given **Payment Confirmation** succeeded for **Order** *ORD-2001*
And **Order** *ORD-2001* has **Pickup Store** *PawPlace Camden* at *42 High Street, London NW1 8QP*
And **Guest Checkout** has **Guest Email** *sarah.jones@example.com*
When the **Order** is confirmed
Then the **Order Confirmation Page** displays **order number** *ORD-2001*, **Order Line Item** list, **order total** *£44.97*, and **Pickup Store** details
And the system sends a **Confirmation Email** to *sarah.jones@example.com*
And the **Confirmation Email** includes: **order number** *ORD-2001*, **Order Line Item** list, total paid *£44.97*, masked **Payment** method, and **Pickup Store** **address** *42 High Street, London NW1 8QP* with **operating hours**

### Scenario 2: `Email queued, confirmation page still displayed`

Given **Payment Confirmation** succeeded for **Order** *ORD-2001*
When the **Order** is confirmed
And the email delivery system is temporarily unavailable
Then the **Order Confirmation Page** displays to the customer with **order number** *ORD-2001*
And the **Confirmation Email** is queued for retry with **delivery status** *queued*
And **Order** *ORD-2001* remains *confirmed*

---

## Story: `Prepare Click-and-Collect Orders for Pickup`

**Story type:** store employee

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | guest_email | pickup_store_code | expected_queue_position |
|---|---|---|---|---|---|---|
| 1 | ORD-2001 | 2025-05-06 | confirmed | sarah.jones@example.com | STR-001 | 1 |
| 2 | ORD-2002 | 2025-05-07 | confirmed | tom.brown@example.com | STR-001 | 2 |

### Order Line Item:

| scenario | order_number | product_name_snapshot | sku_snapshot | quantity | unit_price_snapshot | expected_line_total |
|---|---|---|---|---|---|---|
| 1 | ORD-2001 | Premium Dog Harness | PET-HAR-001 | 1 | £34.99 | £34.99 |
| 2 | ORD-2001 | Salmon Cat Treats | PET-TRT-042 | 2 | £4.99 | £9.98 |
| 3 | ORD-2002 | Exotic Fish Filter | PET-FLT-099 | 1 | £89.99 | £89.99 |

### Stock Availability:

| scenario | product_sku | store_code | available_to_sell_quantity | expected_stock_indicator |
|---|---|---|---|---|
| 1 | PET-HAR-001 | STR-001 | 22 | in stock |
| 2 | PET-FLT-099 | STR-001 | 0 | out of stock — warn employee |

---

### Scenario 1: `Click-and-collect queue shows confirmed orders sorted oldest first`

Given **Store Employee** is at **Store** *PawPlace Camden* (*STR-001*)
And the **Click-and-Collect Queue** contains **Order** *ORD-2001* (date *2025-05-06*) and **Order** *ORD-2002* (date *2025-05-07*)
When **Store Employee** opens the **Click-and-Collect Queue** on the **Admin Dashboard**
Then **Order** entries are sorted oldest first: *ORD-2001* at position *1*, *ORD-2002* at position *2*
And each **Order** shows **order number**, **Order Line Item** details (product name, quantity), and **Guest Email** or customer name

### Scenario 2: `Order marked prepared transitions to ready for pickup`

Given **Store Employee** views **Order** *ORD-2001* in the **Click-and-Collect Queue**
And **Order** *ORD-2001* has **order status** *confirmed*
When **Store Employee** marks **Order** *ORD-2001* as prepared through **Pickup Fulfillment**
Then **Pickup Fulfillment** updates **pickup status** to *ready for pickup*
And **Order** *ORD-2001* transitions **order status** to *ready for pickup*

### Scenario 3: `Stock warning shown with guest email for staff outreach`

Given **Order** *ORD-2002* contains **Order Line Item** *Exotic Fish Filter* (*PET-FLT-099*) with **quantity** *1*
And **Stock Availability** for **Product** *PET-FLT-099* at **Store** *STR-001* has **available to sell quantity** *0*
When **Store Employee** views **Order** *ORD-2002* in the **Click-and-Collect Queue**
Then a stock warning *Out of stock at this store* appears on the **Order Line Item** for *Exotic Fish Filter*
And **Guest Email** *tom.brown@example.com* is displayed for manual contact
And **Order** *ORD-2002* remains *confirmed* for employee resolution

---

## Story: `Fulfill Click-and-Collect Order`

**Story type:** store employee

**Sources / context:** ubiquitous-language.md, crc.md, increment-2-acceptance-criteria.md

---

### Scenario 1: `Customer collects order, status transitions to collected`

Given **Order** *ORD-2001* has **order status** *ready for pickup*
And **Pickup Fulfillment** for **Order** *ORD-2001* has **pickup status** *ready for pickup*
And the customer arrives at **Pickup Store** *PawPlace Camden*
When **Store Employee** confirms the handoff through **Pickup Fulfillment**
Then **Order** *ORD-2001* transitions **order status** to *collected*
And **Pickup Fulfillment** updates **pickup status** to *collected*

### Scenario 2: `Uncollected order shows guest email for staff outreach`

Given **Order** *ORD-2001* has **order status** *ready for pickup*
And the collection window has passed without customer arrival
When **Store Employee** views **Order** *ORD-2001* on the **Admin Dashboard**
Then **Order** *ORD-2001* displays **order status** *ready for pickup*
And **Guest Email** *sarah.jones@example.com* is shown for outreach
And the dashboard displays prompt *Contact customer — collection window elapsed*
And **Order** *ORD-2001* is not auto-cancelled

### Scenario 3: `All orders fulfilled shows completion state`

Given **Order** *ORD-2001* is the last pending **Order** in the **Click-and-Collect Queue**
When **Store Employee** marks **Order** *ORD-2001* as *collected*
Then the **Click-and-Collect Queue** shows heading *All orders fulfilled*
And the queue displays *No pending orders — check back later*

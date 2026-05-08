# Specification by Example — Increment 3: Ship to home

---

## Story: `Enter Shipping Address`

**Story type:** user

**Sources / context:** object-model.md, increment-3-acceptance-criteria.md

---

### SavedAddress (shipping):

| scenario | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |
|---|---|---|---|---|---|---|---|
| 1 | 28 Oak Lane | — | Edinburgh | Midlothian | EH1 3DG | United Kingdom | valid |
| 2 | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |
| 3 | — | — | Bristol | — | — | United Kingdom | invalid — missing addressLineOne and postcode |

### SavedAddress (billing, from Increment 2):

| scenario | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |
|---|---|---|---|---|---|---|---|
| 1 | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |

---

### Scenario 1: `Shipping address form presented for home delivery`

Given the customer has selected *home delivery* during checkout
And the customer has completed the billing step with **addressLineOne** *10 Elm Avenue*, **city** *London*, **postcode** *SW1A 2AA*
When the checkout presents the *Shipping Address* step
Then the form collects: **addressLineOne**, **addressLineTwo** (optional), **city**, **countyOrRegion**, **postcode**, and **country**
And required fields are marked: **addressLineOne**, **city**, **postcode**, **country**

### Scenario 2: `Same-as-billing pre-fills shipping address`

Given the customer's **billingAddress** is **addressLineOne** *10 Elm Avenue*, **addressLineTwo** *Flat 3*, **city** *London*, **countyOrRegion** *Greater London*, **postcode** *SW1A 2AA*, **country** *United Kingdom*
When the customer selects "same as billing"
Then the *Shipping Address* form pre-fills **addressLineOne** with *10 Elm Avenue*
And **addressLineTwo** with *Flat 3*
And **city** with *London*
And **countyOrRegion** with *Greater London*
And **postcode** with *SW1A 2AA*
And **country** with *United Kingdom*

### Scenario 3: `Override single field on pre-filled address`

Given the *Shipping Address* is pre-filled from **billingAddress** with **city** *London*
When the customer overrides **city** to *Edinburgh*
Then **city** shows *Edinburgh*
And **addressLineOne** remains *10 Elm Avenue*
And **postcode** remains *SW1A 2AA*

### Scenario 4: `Missing required fields show validation messages`

Given the customer leaves **addressLineOne** blank and **postcode** blank on the *Shipping Address* form
When the customer submits the shipping address
Then the form shows validation message *Address line 1 is required* on **addressLineOne**
And the form shows validation message *Postcode is required* on **postcode**
And the checkout remains on the shipping step

### Scenario 5: `Complete shipping address advances to delivery option`

Given the customer enters **addressLineOne** *28 Oak Lane*, **city** *Edinburgh*, **countyOrRegion** *Midlothian*, **postcode** *EH1 3DG*, **country** *United Kingdom*
When the customer submits the shipping address
Then the checkout advances to the **DeliveryOption** selection step
And the order summary shows shipping address *28 Oak Lane, Edinburgh, Midlothian, EH1 3DG*

---

## Story: `Select Delivery Option`

**Story type:** user

**Sources / context:** object-model.md, increment-3-acceptance-criteria.md

---

### DeliveryOption:

| scenario | delivery_method_name | estimated_delivery_days | shipping_cost | expected_display_label |
|---|---|---|---|---|
| 1 | Standard Delivery | 3–5 | £4.99 | Standard Delivery (3–5 days) — £4.99 |
| 2 | Click-and-Collect | — | £0.00 | Click-and-Collect — Free |

---

### Scenario 1: `Available delivery options shown`

Given the customer has completed the *Shipping Address* step
When the customer reaches the delivery selection step
Then **DeliveryOption** *Standard Delivery* is shown with estimated *3–5 days* and **shippingCost** *£4.99*
And **ClickAndCollect** is shown with **shippingCost** *£0.00*

### Scenario 2: `Standard delivery confirms shipping address`

Given the customer selects **DeliveryOption** *Standard Delivery*
And the *Shipping Address* is **addressLineOne** *28 Oak Lane*, **city** *Edinburgh*, **postcode** *EH1 3DG*
When the customer confirms the delivery option
Then the *Shipping Address* is confirmed as the delivery destination
And the checkout advances to payment
And the order summary shows **shippingCost** *£4.99*

### Scenario 3: `Switching from standard to click-and-collect adjusts checkout`

Given the customer has selected **DeliveryOption** *Standard Delivery* and entered a *Shipping Address*
When the customer switches to **ClickAndCollect**
Then the *Store Selector* is displayed for **ClickAndCollect.selectedPickupStore** selection
And the *Shipping Address* requirement is dropped
And the **billingAddress** is still required

### Scenario 4: `Switching from click-and-collect to standard prompts shipping address`

Given the customer has selected **ClickAndCollect** and chosen **Store** *PawPlace Camden*
When the customer switches to **DeliveryOption** *Standard Delivery*
Then the *Shipping Address* form is presented
And the *Store Selector* is dismissed
And the **billingAddress** remains unchanged

---

## Story: `View and Process Incoming Orders`

**Story type:** store employee

**Sources / context:** object-model.md, increment-3-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | delivery_type | guest_email | shipping_address | expected_queue_label |
|---|---|---|---|---|---|---|---|
| 1 | ORD-3001 | 2025-05-07 | confirmed | Standard Delivery | sarah.jones@example.com | 28 Oak Lane, Edinburgh EH1 3DG | Ship — ORD-3001 |
| 2 | ORD-3002 | 2025-05-07 | confirmed | Click-and-Collect | tom.brown@example.com | — | Collect — ORD-3002 |

### OrderLineItem:

| scenario | order_number | product_name_snapshot | sku_snapshot | quantity | expected_pick_label |
|---|---|---|---|---|---|
| 1 | ORD-3001 | Premium Dog Harness | PET-HAR-001 | 1 | PET-HAR-001 × 1 |
| 2 | ORD-3001 | Large Dog Bed | PET-BED-015 | 1 | PET-BED-015 × 1 |
| 3 | ORD-3002 | Salmon Cat Treats | PET-TRT-042 | 3 | PET-TRT-042 × 3 |

---

### Scenario 1: `Order queue shows all delivery types`

Given the *Store Employee* opens the *Order Queue*
And the queue contains **Order** *ORD-3001* (delivery type *Standard Delivery*) and **Order** *ORD-3002* (delivery type *Click-and-Collect*)
When the *Store Employee* views the *Order Queue*
Then each order shows: **orderNumber**, **OrderLineItem** details, delivery type label, and **guestEmail**
And **Order** *ORD-3001* shows delivery label *Standard Delivery*
And **Order** *ORD-3002* shows delivery label *Click-and-Collect*

### Scenario 2: `Shipping order detail shows address and items`

Given the *Store Employee* selects **Order** *ORD-3001* with delivery type *Standard Delivery*
When the order detail is displayed
Then the *Shipping Address* shows *28 Oak Lane, Edinburgh EH1 3DG*
And the items to pack are listed: *Premium Dog Harness* (qty *1*), *Large Dog Bed* (qty *1*)
And a *Mark as Fulfilled* action is displayed

### Scenario 3: `Mark fulfilled with tracking number`

Given the *Store Employee* views **Order** *ORD-3001* with **orderStatus** *confirmed*
When the *Store Employee* marks **Order** *ORD-3001* as *Fulfilled*
Then the system prompts for a **trackingNumber**
When the *Store Employee* enters **trackingNumber** *RM-1Z999AA10123456784*
Then **Order** *ORD-3001* transitions **orderStatus** to *Fulfilled*
And the shipping notification is triggered (see *Send Shipping Notification with Tracking Number*)

### Scenario 4: `Fulfilled without tracking number shows tracking prompt`

Given the *Store Employee* views **Order** *ORD-3001* with **orderStatus** *confirmed*
When the *Store Employee* marks **Order** *ORD-3001* as *Fulfilled* without entering a **trackingNumber**
Then the system displays warning *Customer will not receive a tracking notification*
And the **Order** can still be marked *Fulfilled*
And the order detail shows an *Add Tracking Number* field for later entry

---

## Story: `Send Shipping Notification with Tracking Number`

**Story type:** system

**Sources / context:** object-model.md, increment-3-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_status | tracking_number | estimated_delivery_date | guest_email | expected_final_status |
|---|---|---|---|---|---|---|
| 1 | ORD-3001 | Fulfilled | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | Shipped |
| 2 | ORD-3003 | Fulfilled | — → RM-2Z888BB20234567895 | 2025-05-14 | alex.white@example.com | Shipped |

### Notification:

| scenario | notification_channel | notification_subject | expected_delivery_status |
|---|---|---|---|
| 1 | email | Your PawPlace order ORD-3001 has shipped | sent |
| 2 | email | Your PawPlace order ORD-3001 has shipped | queued |

---

### Scenario 1: `Shipping notification sent with tracking details`

Given **Order** *ORD-3001* has **orderStatus** *Fulfilled*
And the *Store Employee* has entered **trackingNumber** *RM-1Z999AA10123456784*
And **Order** *ORD-3001* has **estimatedDeliveryDate** *2025-05-12*
When the fulfillment is confirmed
Then **Notification.createTransactional** fires with type *shipping-update* to **guestEmail** *sarah.jones@example.com*
And the notification includes: **orderNumber** *ORD-3001*, items shipped, carrier name, **trackingNumber** *RM-1Z999AA10123456784*, and **estimatedDeliveryDate** *2025-05-12*
And **Order** *ORD-3001* transitions **orderStatus** from *Fulfilled* to *Shipped*

### Scenario 2: `Email unavailable queues notification without blocking fulfillment`

Given **Order** *ORD-3001* has **orderStatus** *Fulfilled*
And the *Store Employee* enters **trackingNumber** *RM-1Z999AA10123456784*
When the email delivery system is temporarily unavailable
Then the **Notification** is queued with **deliveryStatus** *queued* for retry
And **Order** *ORD-3001* still transitions **orderStatus** to *Shipped*

### Scenario 3: `Order fulfilled without tracking shows add-tracking entry point`

Given **Order** *ORD-3001* was marked *Fulfilled* without a **trackingNumber**
When the fulfillment completes
Then the order detail displays an *Add Tracking Number* field
And **Order** *ORD-3001* has **orderStatus** *Fulfilled*

### Scenario 4: `Late tracking number triggers shipping notification`

Given **Order** *ORD-3003* has **orderStatus** *Fulfilled* and no **trackingNumber**
When the *Store Employee* adds **trackingNumber** *RM-2Z888BB20234567895*
Then **Notification.createTransactional** fires with type *shipping-update* to **guestEmail** *alex.white@example.com*
And **Order** *ORD-3003* transitions **orderStatus** to *Shipped*

---

## Story: `Track Order Status`

**Story type:** user

**Sources / context:** object-model.md, increment-3-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_status | tracking_number | estimated_delivery_date | guest_email | expected_status_label |
|---|---|---|---|---|---|---|
| 1 | ORD-3001 | Shipped | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | Shipped |
| 2 | ORD-3002 | Confirmed | — | — | tom.brown@example.com | Confirmed |
| 3 | ORD-3001 | Delivered | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | Delivered |

---

### Scenario Outline 1: `Order status page displays status-appropriate content`

Given **Order** {order_number} has **orderStatus** {status} with **trackingNumber** {tracking} and **estimatedDeliveryDate** {delivery_date}
And the customer received a notification with a link
When the guest customer views the *Order Status Page* for **Order** {order_number}
Then the page shows **orderStatus** {expected_status_label}
And the tracking section shows {expected_tracking_display}
And the delivery section shows {expected_delivery_display}

#### Examples:

| scenario | order_number | status | tracking | delivery_date | expected_status_label | expected_tracking_display | expected_delivery_display |
|---|---|---|---|---|---|---|---|
| 1 | ORD-3001 | Shipped | RM-1Z999AA10123456784 | 2025-05-12 | Shipped | RM-1Z999AA10123456784 (carrier link) | Estimated delivery: 2025-05-12 |
| 2 | ORD-3002 | Confirmed | — | — | Confirmed | Tracking available once order ships | Order being prepared |
| 3 | ORD-3001 | Delivered | RM-1Z999AA10123456784 | 2025-05-12 | Delivered | RM-1Z999AA10123456784 (carrier link) | Delivered on 2025-05-12 |

### Scenario Outline 2: `Order lookup by number and email`

Given **Order** {order_number} was placed by **guestEmail** {actual_email}
When someone enters **orderNumber** {order_number} and email {entered_email} on the lookup page
Then the system shows {expected_result}
And the page displays {expected_content}

#### Examples:

| scenario | order_number | actual_email | entered_email | expected_result | expected_content |
|---|---|---|---|---|---|
| 4 | ORD-3001 | sarah.jones@example.com | sarah.jones@example.com | success | Order Status Page for ORD-3001 |
| 5 | ORD-3001 | sarah.jones@example.com | wrong@example.com | access denied | We couldn't find an order matching those details |

### Scenario 3: `Status change reflected on next page visit`

Given **Order** *ORD-3001* previously showed **orderStatus** *Shipped*
When **Order** *ORD-3001* transitions **orderStatus** to *Delivered*
Then the customer's next visit to the *Order Status Page* shows **orderStatus** *Delivered*

---
state: specification-by-example
increment_scope: Increment 3 — Ship to home
specification_refresh: Run 4 slot 77
---

# Specification by Example — Increment 3: Ship to home

**Refresh:** Run 4 slot 77 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/specification/crc.md`, `docs/end-to-end/specification/domain.json`, and `docs/story/acceptance-criteria/increment-3-acceptance-criteria.md`. *Guest checkout* only; no *customer account*, login, or *saved address*; *StripeWave* sole *payment vendor*; *standard delivery* and *click-and-collect* only — express and same-day deferred.

---

## Story: `Enter Shipping Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-3-acceptance-criteria.md

---

### Billing Address:

| scenario | billing_name | address_line_one | address_line_two | city | county_or_region | postcode | country |
|---|---|---|---|---|---|---|---|
| 1 | Sarah Jones | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom |

### Shipping Address:

| scenario | recipient_name | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |
|---|---|---|---|---|---|---|---|---|
| 1 | Sarah Jones | 28 Oak Lane | — | Edinburgh | Midlothian | EH1 3DG | United Kingdom | valid |
| 2 | Sarah Jones | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |
| 3 | — | — | — | Bristol | — | — | United Kingdom | invalid — missing recipient name, address line 1, and postcode |

---

### Scenario 1: `Shipping address form presented on ship-to-home checkout path`

Given the customer is on a ship-to-home checkout path in **Guest Checkout**
And the customer has completed **Billing Address** with **billing name** *Sarah Jones*, **address line one** *10 Elm Avenue*, **city** *London*, **postcode** *SW1A 2AA*
When the checkout presents the **Shipping Address** step
Then the form collects: **recipient name**, **address line one**, **address line two** (optional), **city**, **county or region**, **postcode**, and **country**
And required fields are marked: **recipient name**, **address line one**, **city**, **postcode**, **country**

### Scenario 2: `Click-and-collect checkout skips shipping address step`

Given the customer has selected **Click-and-Collect** as the **Delivery Option** during checkout
And the customer has completed **Billing Address** with **address line one** *10 Elm Avenue*, **city** *London*, **postcode** *SW1A 2AA*
When the customer advances from the billing step
Then the checkout does not present the **Shipping Address** step
And the customer proceeds to **Pickup Store** selection instead

### Scenario 3: `Same as billing pre-fills shipping address`

Given **Billing Address** has **billing name** *Sarah Jones*, **address line one** *10 Elm Avenue*, **address line two** *Flat 3*, **city** *London*, **county or region** *Greater London*, **postcode** *SW1A 2AA*, **country** *United Kingdom*
When the customer selects *same as billing* on the **Shipping Address** step
Then **Shipping Address** pre-fills **recipient name** with *Sarah Jones*
And **address line one** with *10 Elm Avenue*
And **address line two** with *Flat 3*
And **city** with *London*
And **county or region** with *Greater London*
And **postcode** with *SW1A 2AA*
And **country** with *United Kingdom*

### Scenario 4: `Override single field on pre-filled shipping address`

Given **Shipping Address** is pre-filled from **Billing Address** with **city** *London*
When the customer overrides **city** to *Edinburgh*
Then **Shipping Address** shows **city** *Edinburgh*
And **address line one** remains *10 Elm Avenue*
And **postcode** remains *SW1A 2AA*

### Scenario 5: `Missing required fields show validation messages`

Given the customer leaves **recipient name** blank, **address line one** blank, and **postcode** blank on the **Shipping Address** form
When the customer submits the **Shipping Address**
Then the form shows validation message *Recipient name is required* on **recipient name**
And the form shows validation message *Address line 1 is required* on **address line one**
And the form shows validation message *Postcode is required* on **postcode**
And checkout remains on the **Shipping Address** step

### Scenario 6: `Complete shipping address advances to delivery option selection`

Given the customer enters **Shipping Address** with **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **county or region** *Midlothian*, **postcode** *EH1 3DG*, **country** *United Kingdom*
When the customer submits the **Shipping Address**
Then checkout advances to the **Delivery Option** selection step
And the order summary shows **Shipping Address** *28 Oak Lane, Edinburgh, Midlothian, EH1 3DG*

---

## Story: `Select Delivery Option`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-3-acceptance-criteria.md

---

### Delivery Option:

| scenario | delivery_method_name | estimated_delivery_window | shipping_cost | expected_display_label |
|---|---|---|---|---|
| 1 | Standard Delivery | 3–5 business days | £4.99 | Standard Delivery (3–5 business days) — £4.99 |
| 2 | Click-and-Collect | — | £0.00 | Click-and-Collect — Free |

### Store:

| scenario | store_name | store_code | address_line_one | city | postcode |
|---|---|---|---|---|---|
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP |

---

### Scenario 1: `Standard delivery and click-and-collect options shown`

Given the customer has completed the **Shipping Address** step
When the customer reaches the **Delivery Option** selection step
Then **Standard Delivery** is shown with **estimated delivery window** *3–5 business days* and **shipping cost** *£4.99*
And **Click-and-Collect** is shown with **shipping cost** *£0.00*
And express and same-day **Delivery Option** variants are not listed

### Scenario 2: `Standard delivery confirms shipping address and advances to payment`

Given the customer selects **Standard Delivery** as the **Delivery Option**
And **Shipping Address** is **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **postcode** *EH1 3DG*
When the customer confirms the **Delivery Option**
Then **Shipping Address** is confirmed as the delivery destination for the **Order**
And **shipping cost** *£4.99* is recorded on the **Order**
And checkout advances to **Payment**

### Scenario 3: `Switch from standard delivery to click-and-collect drops shipping requirement`

Given the customer has selected **Standard Delivery** and entered **Shipping Address** *28 Oak Lane, Edinburgh EH1 3DG*
When the customer switches to **Click-and-Collect**
Then the **Pickup Store** selector is displayed for **Pickup Store** selection
And the **Shipping Address** requirement is dropped
And **Billing Address** remains required

### Scenario 4: `Switch from click-and-collect to standard delivery prompts shipping address`

Given the customer has selected **Click-and-Collect** and chosen **Pickup Store** *PawPlace Camden* (*STR-001*)
When the customer switches to **Standard Delivery**
Then the **Shipping Address** form is presented
And the **Pickup Store** selector is dismissed
And **Billing Address** remains unchanged

---

## Story: `View and Process Incoming Orders`

**Story type:** store employee

**Sources / context:** ubiquitous-language.md, crc.md, increment-3-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | delivery_method_name | guest_email_snapshot | shipping_address_line_one | shipping_city | shipping_postcode | expected_queue_label |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ORD-3001 | 2025-05-07 | confirmed | Standard Delivery | sarah.jones@example.com | 28 Oak Lane | Edinburgh | EH1 3DG | Ship — ORD-3001 |
| 2 | ORD-3002 | 2025-05-07 | confirmed | Click-and-Collect | tom.brown@example.com | — | — | — | Collect — ORD-3002 |

### Order Line Item:

| scenario | order_number | product_name_snapshot | sku_snapshot | quantity |
|---|---|---|---|---|
| 1 | ORD-3001 | Premium Dog Harness | PET-HAR-001 | 1 |
| 2 | ORD-3001 | Large Dog Bed | PET-BED-015 | 1 |
| 3 | ORD-3002 | Salmon Cat Treats | PET-TRT-042 | 3 |

---

### Scenario 1: `Order queue shows all delivery types on admin dashboard`

Given **Store Employee** opens the **Order Queue** on the **Admin Dashboard**
And the **Order Queue** contains **Order** *ORD-3001* with **Delivery Option** *Standard Delivery* and **Order** *ORD-3002* with **Delivery Option** *Click-and-Collect*
When **Store Employee** views the **Order Queue**
Then each **Order** shows **order number**, **Order Line Item** details, delivery type label, and **Guest Email** or customer name
And **Order** *ORD-3001* shows delivery label *Standard Delivery*
And **Order** *ORD-3002* shows delivery label *Click-and-Collect*

### Scenario 2: `Ship-to-home order detail shows shipping address and items to pack`

Given **Store Employee** selects **Order** *ORD-3001* with **Delivery Option** *Standard Delivery* from the **Order Queue**
When the order detail is displayed
Then **Shipping Address** shows *28 Oak Lane, Edinburgh EH1 3DG*
And **Order Line Item** entries to pack are listed: *Premium Dog Harness* (qty *1*), *Large Dog Bed* (qty *1*)
And a *Mark as Fulfilled* action is displayed for **Ship-to-Home Fulfillment**

### Scenario 3: `Fulfillment with tracking number triggers shipping notification`

Given **Store Employee** views **Order** *ORD-3001* with **order status** *confirmed*
When **Store Employee** marks **Order** *ORD-3001* as fulfilled through **Ship-to-Home Fulfillment**
Then the system prompts for a **Tracking Number**
When **Store Employee** enters **Tracking Number** with **carrier reference** *RM-1Z999AA10123456784* and **carrier name** *Royal Mail*
Then **Order** *ORD-3001* transitions **order status** to *fulfilled*
And the **Shipping Notification** is triggered (see *Send Shipping Notification with Tracking Number*)

### Scenario 4: `Fulfillment without tracking number shows warning and allows completion`

Given **Store Employee** views **Order** *ORD-3001* with **order status** *confirmed*
When **Store Employee** marks **Order** *ORD-3001* as fulfilled through **Ship-to-Home Fulfillment** without entering a **Tracking Number**
Then the system displays warning *Customer will not receive a shipping notification*
And **Order** *ORD-3001* can still be marked *fulfilled*
And the order detail shows an *Add Tracking Number* field for later entry

---

## Story: `Send Shipping Notification with Tracking Number`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-3-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_status | guest_email_snapshot | estimated_delivery_date |
|---|---|---|---|---|
| 1 | ORD-3001 | fulfilled | sarah.jones@example.com | 2025-05-12 |
| 2 | ORD-3003 | fulfilled | alex.white@example.com | 2025-05-14 |

### Tracking Number:

| scenario | order_number | carrier_reference | carrier_name | shipment_date |
|---|---|---|---|---|
| 1 | ORD-3001 | RM-1Z999AA10123456784 | Royal Mail | 2025-05-07 |
| 2 | ORD-3003 | RM-2Z888BB20234567895 | Royal Mail | 2025-05-09 |

### Shipping Notification:

| scenario | order_number | notification_subject | recipient_guest_email | expected_delivery_status |
|---|---|---|---|---|
| 1 | ORD-3001 | Your PawPlace order ORD-3001 has shipped | sarah.jones@example.com | sent |
| 2 | ORD-3001 | Your PawPlace order ORD-3001 has shipped | sarah.jones@example.com | queued |

---

### Scenario 1: `Shipping notification sent with tracking and delivery details`

Given **Order** *ORD-3001* has **order status** *fulfilled*
And **Guest Checkout** on **Order** *ORD-3001* has **Guest Email** *sarah.jones@example.com*
And **Store Employee** enters **Tracking Number** with **carrier reference** *RM-1Z999AA10123456784* and **carrier name** *Royal Mail*
And **Order** *ORD-3001* has **estimated delivery date** *2025-05-12*
When **Ship-to-Home Fulfillment** dispatch is confirmed
Then the system sends a **Shipping Notification** to *sarah.jones@example.com*
And the **Shipping Notification** includes **order number** *ORD-3001*, **Order Line Item** items shipped, **carrier name** *Royal Mail*, **Tracking Number** *RM-1Z999AA10123456784*, and **estimated delivery window** *3–5 business days*
And **Order** *ORD-3001* transitions **order status** from *fulfilled* to *shipped*

### Scenario 2: `Email unavailable queues notification without blocking status transition`

Given **Order** *ORD-3001* has **order status** *fulfilled*
And **Store Employee** enters **Tracking Number** *RM-1Z999AA10123456784*
When **Ship-to-Home Fulfillment** dispatch is confirmed
And the email delivery system is temporarily unavailable
Then the **Shipping Notification** is queued with **delivery status** *queued* for retry
And **Order** *ORD-3001* still transitions **order status** to *shipped*

### Scenario 3: `No tracking at fulfillment means no automatic shipping notification`

Given **Order** *ORD-3001* was marked *fulfilled* through **Ship-to-Home Fulfillment** without a **Tracking Number**
When fulfillment completes
Then no **Shipping Notification** is sent automatically
And **Order** *ORD-3001* has **order status** *fulfilled*
And the order detail displays an *Add Tracking Number* field

### Scenario 4: `Late tracking number entry triggers shipping notification`

Given **Order** *ORD-3003* has **order status** *fulfilled* and no **Tracking Number**
When **Store Employee** adds **Tracking Number** with **carrier reference** *RM-2Z888BB20234567895* and **carrier name** *Royal Mail*
Then the system sends a **Shipping Notification** to **Guest Email** *alex.white@example.com*
And **Order** *ORD-3003* transitions **order status** to *shipped*

---

## Story: `Track Order Status`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-3-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_status | tracking_number | estimated_delivery_date | guest_email_snapshot | shipment_date |
|---|---|---|---|---|---|---|
| 1 | ORD-3001 | shipped | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | 2025-05-07 |
| 2 | ORD-3002 | confirmed | — | — | tom.brown@example.com | — |
| 3 | ORD-3001 | delivered | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | 2025-05-07 |

---

### Scenario Outline 1: `Order status page displays status-appropriate content`

Given **Order** {order_number} has **order status** {order_status}
And **Order** {order_number} has **Tracking Number** {tracking_number} and **estimated delivery date** {estimated_delivery_date}
And the guest customer received a **Confirmation Email** or **Shipping Notification** with an **Order Status Page** link
When the guest customer opens the **Order Status Page** for **Order** {order_number}
Then the page shows **order status** {expected_status_label}
And the page lists **Order Line Item** contents for the **Order**
And the tracking section shows {expected_tracking_display}
And the delivery section shows {expected_delivery_display}

#### Examples:

| scenario | order_number | order_status | tracking_number | estimated_delivery_date | expected_status_label | expected_tracking_display | expected_delivery_display |
|---|---|---|---|---|---|---|---|
| 1 | ORD-3001 | shipped | RM-1Z999AA10123456784 | 2025-05-12 | Shipped | RM-1Z999AA10123456784 (Royal Mail carrier link) | Shipment date: 2025-05-07 — Estimated delivery: 2025-05-12 |
| 2 | ORD-3002 | confirmed | — | — | Confirmed | Tracking will be available once your order ships | Order being prepared |
| 3 | ORD-3001 | delivered | RM-1Z999AA10123456784 | 2025-05-12 | Delivered | RM-1Z999AA10123456784 (Royal Mail carrier link) | Delivered on 2025-05-12 |

### Scenario Outline 2: `Guest order lookup requires matching order number and guest email`

Given **Order** {order_number} was placed with **Guest Email** {actual_guest_email}
When a guest enters **order number** {order_number} and email {entered_email} on the order lookup page
Then the system shows {expected_result}
And the page displays {expected_content}

#### Examples:

| scenario | order_number | actual_guest_email | entered_email | expected_result | expected_content |
|---|---|---|---|---|---|
| 1 | ORD-3001 | sarah.jones@example.com | sarah.jones@example.com | success | **Order Status Page** for **Order** *ORD-3001* |
| 2 | ORD-3001 | sarah.jones@example.com | wrong@example.com | access denied | *We couldn't find an order matching those details* |

### Scenario 3: `Status change reflected on next page visit without push notification`

Given the guest customer previously viewed the **Order Status Page** for **Order** *ORD-3001* with **order status** *shipped*
When **Order** *ORD-3001* transitions **order status** to *delivered*
Then the guest customer's next visit to the **Order Status Page** shows **order status** *Delivered*
And no push notification is sent for the status change

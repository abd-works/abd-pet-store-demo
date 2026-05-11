# Specification by Example (Scenario Outline) — Increment 7: Returns and refunds — close the loop  

---  

## Story: `Initiate Return from Order History`  

### CustomerAccount (Given — above scenarios):  
| customer_email                 | first_name | last_name |  
|--------------------------------|------------|-----------|  
| sarah.mitchell@pawplace.example | Sarah      | Mitchell  |  

### Order (Given — above scenarios):  
| order_number | customer_email                 | order_date | order_status |  
|--------------|--------------------------------|------------|--------------|  
| ORD-4401     | sarah.mitchell@pawplace.example | 2026-04-10 | delivered    |  
| ORD-4402     | sarah.mitchell@pawplace.example | 2026-02-01 | delivered    |  
| ORD-4403     | sarah.mitchell@pawplace.example | 2026-04-25 | delivered    |  

### OrderLineItem (Given — above scenarios):  
| order_number | sku_snapshot | product_name_snapshot     | unit_price_snapshot | quantity |  
|--------------|--------------|---------------------------|---------------------|----------|  
| ORD-4401     | SKU-FOOD-501 | Premium Dog Kibble 10kg   | 54.99               | 1        |  
| ORD-4401     | SKU-TOY-220  | Squeaky Bone Chew         | 12.99               | 2        |  
| ORD-4402     | SKU-BED-100  | Orthopaedic Dog Bed Large | 89.99               | 1        |  
| ORD-4403     | SKU-LEAD-050 | Reflective Harness Medium | 34.99               | 1        |  

Background:  
  Given a **CustomerAccount** *{customer_email}* *{first_name}* *{last_name}*  
  And that **CustomerAccount** has **Order** *{order_number}* placed on *{order_date}* with *{order_status}*  
  And **Order** *{order_number}* contains **OrderLineItem** *{sku_snapshot}* *{product_name_snapshot}* at *{unit_price_snapshot}* × *{quantity}*  

---  

### Scenario Outline: Eligible items displayed for return selection  

Given the current date is *{current_date}*  
When **CustomerAccount** *{customer_email}* selects "Return" on **Order** *{order_number}*  
Then the system shows **OrderLineItem** entries with *Return Eligible* status *{return_eligibility}*  
  And the status label reads *{expected_status_label}*  
  And the available action reads *{expected_action_description}*  

### Return eligibility (Then — below scenario):  
| scenario | order_number | customer_email                 | current_date | return_eligibility     | expected_status_label      | expected_action_description                                  |  
|----------|--------------|--------------------------------|--------------|------------------------|----------------------------|--------------------------------------------------------------|  
| 1        | ORD-4401     | sarah.mitchell@pawplace.example | 2026-05-07   | eligible               | Eligible for return        | Select items, quantities, reason, and item condition         |  
| 2        | ORD-4402     | sarah.mitchell@pawplace.example | 2026-05-07   | return window expired  | Return window expired      | Return action disabled — 30-day window closed on 2026-03-03 |  
| 3        | ORD-4403     | sarah.mitchell@pawplace.example | 2026-05-07   | eligible               | Eligible for return        | Select items, quantities, reason, and item condition         |  

---  

### Scenario Outline: Return request created and linked to order  

Given **CustomerAccount** *{customer_email}* has **Order** *{order_number}* within the return window  
  And **Order** *{order_number}* contains **OrderLineItem** *{sku_snapshot}* *{product_name_snapshot}*  
When **CustomerAccount** *{customer_email}* submits a **Return** selecting **OrderLineItem** *{sku_snapshot}* with *returnReason* *{returnReason}* and *itemCondition* *{itemCondition}*  
Then a **Return** is created with *returnStatus* *{expected_return_status}* linked to **Order** *{order_number}*  
  And the **Return** *returnLabelOrQrCode* generation is triggered  
  And the return confirmation reads *{expected_confirmation_message}*  

### Return creation (Then — below scenario):  
| scenario | customer_email                 | order_number | sku_snapshot | product_name_snapshot   | returnReason  | itemCondition | expected_return_status | expected_confirmation_message                                              |  
|----------|--------------------------------|--------------|--------------|-------------------------|---------------|---------------|------------------------|----------------------------------------------------------------------------|  
| 1        | sarah.mitchell@pawplace.example | ORD-4401     | SKU-FOOD-501 | Premium Dog Kibble 10kg | Changed mind  | unopened      | initiated              | Return initiated for Premium Dog Kibble 10kg — label being generated       |  

---  

### Scenario Outline: Damage description captured for damaged item condition  

Given **CustomerAccount** *{customer_email}* has **Order** *{order_number}* within the return window  
When **CustomerAccount** *{customer_email}* selects *itemCondition* *{itemCondition}* for **OrderLineItem** *{sku_snapshot}* *{product_name_snapshot}*  
Then the form shows *{expected_additional_field}*  
  And the form offers *{expected_optional_upload}*  

### Damage capture (Then — below scenario):  
| scenario | customer_email                 | order_number | sku_snapshot | product_name_snapshot | itemCondition | expected_additional_field              | expected_optional_upload                    |  
|----------|--------------------------------|--------------|--------------|----------------------|---------------|---------------------------------------|---------------------------------------------|  
| 1        | sarah.mitchell@pawplace.example | ORD-4401     | SKU-TOY-220  | Squeaky Bone Chew    | damaged       | Describe the damage (free-text field) | Upload photos of the damage (optional)      |  

---  

### Scenario Outline: Previously returned items shown as in-progress — remaining items selectable  

Given **CustomerAccount** *{customer_email}* has **Order** *{order_number}* within the return window  
  And a **Return** already exists for **OrderLineItem** *{returned_sku}* *{returned_product}* on **Order** *{order_number}* with *returnStatus* *{existing_return_status}*  
When **CustomerAccount** *{customer_email}* selects "Return" on **Order** *{order_number}*  
Then **OrderLineItem** *{returned_sku}* shows status *{expected_returned_item_label}*  
  And **OrderLineItem** *{selectable_sku}* *{selectable_product}* shows status *{expected_selectable_label}*  

### Previously returned items (Then — below scenario):  
| scenario | customer_email                 | order_number | returned_sku | returned_product          | existing_return_status | selectable_sku | selectable_product | expected_returned_item_label | expected_selectable_label |  
|----------|--------------------------------|--------------|--------------|---------------------------|------------------------|----------------|--------------------|------------------------------|---------------------------|  
| 1        | sarah.mitchell@pawplace.example | ORD-4403     | SKU-LEAD-050 | Reflective Harness Medium | initiated              | SKU-TOY-220    | Squeaky Bone Chew  | Return in progress           | Available for return      |  

---  

## Story: `Generate Return Label or QR Code`  

### Return (Given — above scenarios):  
| return_id | order_number | return_reason | item_condition | return_status |  
|-----------|--------------|---------------|----------------|---------------|  
| RTN-7001  | ORD-4401     | Changed mind  | unopened       | initiated     |  

---  

### Scenario Outline: Return label and QR code generated on submission  

Given a **Return** *{return_id}* for **Order** *{order_number}* with *returnStatus* *{return_status}*  
When the **Return** *{return_id}* submission is processed  
Then the system generates a *{expected_label_format}* and a *{expected_code_format}*  
  And the return confirmation page shows *{expected_page_content}*  
  And an email is sent to **CustomerAccount** *{customer_email}* with *{expected_email_attachments}*  

### Label generation (Then — below scenario):  
| scenario | return_id | order_number | return_status | customer_email                 | expected_label_format | expected_code_format | expected_page_content                    | expected_email_attachments          |  
|----------|-----------|--------------|---------------|--------------------------------|-----------------------|----------------------|------------------------------------------|-------------------------------------|  
| 1        | RTN-7001  | ORD-4401     | initiated     | sarah.mitchell@pawplace.example | PDF return label      | QR code              | Download label or show QR at drop-off    | PDF label attachment, QR code image |  

---  

### Scenario Outline: Return label includes required return information  

Given a **Return** *{return_id}* for **Order** *{order_number}* has been submitted  
When **CustomerAccount** *{customer_email}* downloads the *Return Label*  
Then the label includes return address *{expected_return_address_present}*  
  And the label includes **Order** *orderNumber* *{order_number}*  
  And the label includes **Return** *return_id* *{return_id}*  
  And the label includes *{expected_barcode_type}*  

### Label content (Then — below scenario):  
| scenario | return_id | order_number | customer_email                 | expected_return_address_present | expected_barcode_type |  
|----------|-----------|--------------|--------------------------------|---------------------------------|-----------------------|  
| 1        | RTN-7001  | ORD-4401     | sarah.mitchell@pawplace.example | PawPlace Returns Centre         | carrier barcode       |  

---  

### Scenario Outline: QR code displayable on mobile at carrier drop-off  

Given a **Return** *{return_id}* for **Order** *{order_number}* has been submitted  
When **CustomerAccount** *{customer_email}* selects the *Return QR Code* option  
Then the *QR code* is displayable on *{expected_device}* at a carrier drop-off point  
  And the *QR code* encodes **Return** *return_id* *{return_id}*  
  And the display mode is *{expected_display_mode}*  

### QR code display (Then — below scenario):  
| scenario | return_id | order_number | customer_email                 | expected_device | expected_display_mode         |  
|----------|-----------|--------------|--------------------------------|-----------------|-------------------------------|  
| 1        | RTN-7001  | ORD-4401     | sarah.mitchell@pawplace.example | mobile device   | full-screen scannable barcode |  

---  

### Scenario Outline: Return recorded despite label generation failure  

Given a **Return** *{return_id}* for **Order** *{order_number}* has been submitted  
  And the label generation service is *{service_status}*  
When the system attempts to generate the *returnLabelOrQrCode*  
Then the **Return** *{return_id}* status is *{expected_return_status}*  
  And the customer sees *{expected_customer_message}*  
  And the return is *{expected_return_disposition}*  

### Label failure (Then — below scenario):  
| scenario | return_id | order_number | service_status          | expected_return_status | expected_customer_message                                  | expected_return_disposition |  
|----------|-----------|--------------|-------------------------|------------------------|------------------------------------------------------------|-----------------------------|  
| 1        | RTN-7001  | ORD-4401     | temporarily unavailable | initiated              | Label unavailable — check back shortly or contact support  | preserved, not cancelled    |  

---  

## Story: `Route Refund through Original Payment Vendor`  

### Order with Payment and PaymentVendor (Given — above scenarios):  
| order_number | payment_reference | vendor_name | vendor_code |  
|--------------|-------------------|-------------|-------------|  
| ORD-4401     | PAY-9901          | StripeWave  | STRIPEWAVE  |  
| ORD-5502     | PAY-9902          | PayNova     | PAYNOVA     |  
| ORD-6603     | PAY-9903          | VaultPay    | VAULTPAY    |  

### Return (Given — above scenarios):  
| return_id | order_number | return_status |  
|-----------|--------------|---------------|  
| RTN-7001  | ORD-4401     | processing    |  
| RTN-7002  | ORD-5502     | processing    |  
| RTN-7003  | ORD-6603     | processing    |  

### OrderLineItem with Return (Given — above scenarios):  
| return_id | sku_snapshot | product_name_snapshot   | unit_price_snapshot | quantity |  
|-----------|--------------|-------------------------|---------------------|----------|  
| RTN-7001  | SKU-FOOD-501 | Premium Dog Kibble 10kg | 54.99               | 1        |  
| RTN-7002  | SKU-BOWL-310 | Ceramic Feeding Bowl    | 24.99               | 1        |  
| RTN-7003  | SKU-TREE-800 | Premium Cat Tree Deluxe | 199.99              | 1        |  

---  

### Scenario Outline: Refund routed through original payment vendor  

Given a **Return** *{return_id}* for **Order** *{order_number}* with *returnStatus* *{return_status}*  
  And **Order** *{order_number}* was paid via **Payment** *{payment_reference}* processed by **PaymentVendor** *{vendor_name}* *{vendor_code}*  
  And the returned **OrderLineItem** *{sku_snapshot}* has *unitPriceSnapshot* *{unit_price_snapshot}*  
When the **Return** *{return_id}* is received and inspected  
Then a **Refund** *{expected_refund_reference}* is created with *refundAmount* *{expected_refund_amount}*  
  And the **Refund** is routed through **PaymentVendor** *{vendor_code}*  
  And the customer outcome is *{expected_customer_outcome}*  

### Refund routing (Then — below scenario):  
| scenario | return_id | order_number | return_status | payment_reference | vendor_name | vendor_code | sku_snapshot | unit_price_snapshot | expected_refund_reference | expected_refund_amount | expected_customer_outcome                                     |  
|----------|-----------|--------------|---------------|-------------------|-------------|-------------|--------------|---------------------|---------------------------|------------------------|---------------------------------------------------------------|  
| 1        | RTN-7001  | ORD-4401     | processing    | PAY-9901          | StripeWave  | STRIPEWAVE  | SKU-FOOD-501 | 54.99               | REF-3001                  | 54.99                  | £54.99 credit on card statement via StripeWave                |  
| 2        | RTN-7002  | ORD-5502     | processing    | PAY-9902          | PayNova     | PAYNOVA     | SKU-BOWL-310 | 24.99               | REF-3002                  | 24.99                  | £24.99 credit in digital wallet via PayNova                   |  
| 3        | RTN-7003  | ORD-6603     | processing    | PAY-9903          | VaultPay    | VAULTPAY    | SKU-TREE-800 | 199.99              | REF-3003                  | 199.99                 | VaultPay adjusts the instalment plan, reducing by £199.99     |  

---  

### Scenario Outline: Refund queued for retry on vendor failure  

Given a **Return** *{return_id}* for **Order** *{order_number}* with *returnStatus* *{return_status}*  
  And **Order** *{order_number}* was paid via **Payment** *{payment_reference}* processed by **PaymentVendor** *{vendor_name}*  
When the **Refund** request to **PaymentVendor** *{vendor_name}* fails due to *{failure_reason}*  
Then the **Refund** is *{expected_refund_disposition}*  
  And the customer sees **Refund** *refundStatus* *{expected_customer_refund_status}*  

### Vendor failure retry (Then — below scenario):  
| scenario | return_id | order_number | return_status | payment_reference | vendor_name | failure_reason   | expected_refund_disposition | expected_customer_refund_status |  
|----------|-----------|--------------|---------------|-------------------|-------------|------------------|-----------------------------|-------------------------------|  
| 1        | RTN-7001  | ORD-4401     | processing    | PAY-9901          | StripeWave  | vendor downtime  | queued for retry            | processing                    |  

---  

### Scenario Outline: Refund escalated after retry exhaustion  

Given a **Refund** *{refund_reference}* for **Return** *{return_id}* routed through **PaymentVendor** *{vendor_name}*  
  And *{retry_status}*  
When the final retry fails  
Then the **Return** *returnStatus* transitions to *{expected_return_status}*  
  And the **Refund** *refundStatus* transitions to *{expected_refund_status}*  
  And the operations dashboard shows *{expected_dashboard_entry}*  

### Retry exhaustion (Then — below scenario):  
| scenario | refund_reference | return_id | vendor_name | retry_status                     | expected_return_status            | expected_refund_status | expected_dashboard_entry                               |  
|----------|------------------|-----------|-------------|----------------------------------|-----------------------------------|------------------------|--------------------------------------------------------|  
| 1        | REF-3001         | RTN-7001  | StripeWave  | all retry attempts exhausted     | refund requires manual review     | requires review        | REF-3001 via StripeWave — manual review required       |  

---  

## Story: `Track Refund Status`  

### Order with Return and Refund (Given — above scenarios):  
| order_number | return_id | refund_reference | refund_status   |  
|--------------|-----------|------------------|-----------------|  
| ORD-4401     | RTN-7001  | REF-3001         | processing      |  
| ORD-5502     | RTN-7002  | REF-3002         | completed       |  
| ORD-6603     | RTN-7003  | REF-3003         | requires review |  

---  

### Scenario Outline: Refund status visible on order detail  

Given **CustomerAccount** *{customer_email}* has **Order** *{order_number}* with **Return** *{return_id}*  
  And **Refund** *{refund_reference}* has *refundStatus* *{refund_status}*  
When **CustomerAccount** *{customer_email}* views the **Order** detail for *{order_number}*  
Then the refund status badge reads *{expected_status_badge}*  
  And the guidance message reads *{expected_guidance_message}*  

### Refund status guidance (Then — below scenario):  
| scenario | order_number | return_id | refund_reference | refund_status   | customer_email                 | expected_status_badge | expected_guidance_message                                                          |  
|----------|--------------|-----------|------------------|-----------------|--------------------------------|-----------------------|------------------------------------------------------------------------------------|  
| 1        | ORD-4401     | RTN-7001  | REF-3001         | processing      | sarah.mitchell@pawplace.example | Processing            | Refunds typically take 5–10 business days depending on your payment provider       |  
| 2        | ORD-5502     | RTN-7002  | REF-3002         | completed       | sarah.mitchell@pawplace.example | Completed             | £24.99 refunded to PayNova digital wallet                                          |  
| 3        | ORD-6603     | RTN-7003  | REF-3003         | requires review | sarah.mitchell@pawplace.example | Under review          | Please contact support — your return and refund details are ready for the team     |  

---  

### Scenario Outline: Refund completion notification sent  

Given **Refund** *{refund_reference}* for **Return** *{return_id}* on **Order** *{order_number}* with *refundStatus* *{refund_status_before}*  
  And **Refund** *{refund_reference}* is routed through **PaymentVendor** *{vendor_name}*  
When **PaymentVendor** *{vendor_name}* confirms the **Refund** is complete  
Then the **Refund** *refundStatus* transitions to *{expected_refund_status}*  
  And a **Notification** is sent to **CustomerAccount** *{customer_email}* with *type* *{expected_notification_type}*  
  And the notification body reads *{expected_notification_body}*  

### Refund completion notification (Then — below scenario):  
| scenario | refund_reference | return_id | order_number | refund_status_before | vendor_name | customer_email                 | expected_refund_status | expected_notification_type | expected_notification_body                           |  
|----------|------------------|-----------|--------------|----------------------|-------------|--------------------------------|------------------------|----------------------------|------------------------------------------------------|  
| 1        | REF-3002         | RTN-7002  | ORD-5502     | processing           | PayNova     | sarah.mitchell@pawplace.example | completed              | refund-completed           | Your £24.99 refund has been completed via PayNova    |  

---  

## Story: `Process In-Store Return`  

### Store (Given — above scenarios):  
| store_name      | store_code |  
|-----------------|------------|  
| PawPlace Camden | STORE-CAM  |  

### CustomerAccount (Given — above scenarios):  
| customer_email                 | first_name | last_name |  
|--------------------------------|------------|-----------|  
| sarah.mitchell@pawplace.example | Sarah      | Mitchell  |  

### GuestCheckout (Given — above scenarios):  
| guest_email             | guest_first_name | guest_last_name |  
|-------------------------|------------------|-----------------|  
| guest.buyer@example.com | Alex             | Rivera          |  

### Order (Given — above scenarios):  
| order_number | placing_party                  | order_date | payment_reference | vendor_code |  
|--------------|--------------------------------|------------|-------------------|-------------|  
| ORD-4401     | sarah.mitchell@pawplace.example | 2026-04-10 | PAY-9901          | STRIPEWAVE  |  
| ORD-7704     | guest.buyer@example.com        | 2026-04-20 | PAY-9904          | PAYNOVA     |  
| ORD-4402     | sarah.mitchell@pawplace.example | 2026-02-01 | PAY-9905          | STRIPEWAVE  |  

---  

### Scenario Outline: In-store return created via order lookup  

Given a **Store** *{store_name}* *{store_code}* staff dashboard  
  And **CustomerAccount** *{customer_email}* brings **OrderLineItem** *{sku_snapshot}* *{product_name_snapshot}* to the store  
When the store employee looks up **Order** *{order_number}* by *{lookup_method}*  
  And submits the in-store **Return** against **Order** *{order_number}*  
Then a **Return** is created linked to **Order** *{order_number}* via *processInStoreReturn* at **Store** *{store_code}*  
  And a **Refund** is routed through **PaymentVendor** *{vendor_code}*  
  And the return appears in **CustomerAccount** *{customer_email}* order history with status *{expected_return_status}*  
  And the staff dashboard confirmation reads *{expected_staff_confirmation}*  

### In-store return (Then — below scenario):  
| scenario | store_name      | store_code | customer_email                 | sku_snapshot | product_name_snapshot   | order_number | lookup_method                | vendor_code | expected_return_status | expected_staff_confirmation                                  |  
|----------|-----------------|------------|--------------------------------|--------------|-------------------------|--------------|------------------------------|-------------|------------------------|--------------------------------------------------------------|  
| 1        | PawPlace Camden | STORE-CAM  | sarah.mitchell@pawplace.example | SKU-FOOD-501 | Premium Dog Kibble 10kg | ORD-4401     | order number or customer email | STRIPEWAVE  | initiated              | Return created for ORD-4401 — refund via StripeWave          |  

---  

### Scenario Outline: Guest order return processed — return visible on receipt only  

Given a **Store** *{store_name}* *{store_code}* staff dashboard  
  And a **GuestCheckout** *{guest_email}* *{guest_first_name}* *{guest_last_name}* has **Order** *{order_number}*  
When the store employee looks up **Order** *{order_number}* by *{lookup_method}*  
  And submits the in-store **Return** against **Order** *{order_number}*  
Then a **Return** is created linked to **Order** *{order_number}*  
  And the **Refund** routes through **PaymentVendor** *{vendor_code}*  
  And the guest receives *{expected_guest_receipt}*  
  And the return visibility is *{expected_visibility}*  

### Guest return (Then — below scenario):  
| scenario | store_name      | store_code | guest_email             | guest_first_name | guest_last_name | order_number | lookup_method              | vendor_code | expected_guest_receipt                          | expected_visibility                              |  
|----------|-----------------|------------|-------------------------|------------------|-----------------|--------------|----------------------------|-------------|-------------------------------------------------|--------------------------------------------------|  
| 1        | PawPlace Camden | STORE-CAM  | guest.buyer@example.com | Alex             | Rivera          | ORD-7704     | order number and guest email | PAYNOVA     | Printed return receipt with refund confirmation | Receipt only — no account to display return in   |  

---  

### Scenario Outline: Ineligible item flagged with manager override option  

Given a **Store** *{store_name}* *{store_code}* staff dashboard  
  And **Order** *{order_number}* placed on *{order_date}* is outside the return window  
When the store employee looks up **Order** *{order_number}*  
Then **OrderLineItem** *{sku_snapshot}* *{product_name_snapshot}* shows status *{expected_eligibility_label}*  
  And the reason reads *{expected_reason}*  
  And the available override action reads *{expected_override_action}*  

### Ineligible item (Then — below scenario):  
| scenario | store_name      | store_code | order_number | order_date | sku_snapshot | product_name_snapshot     | expected_eligibility_label | expected_reason                           | expected_override_action                              |  
|----------|-----------------|------------|--------------|------------|--------------|---------------------------|----------------------------|-------------------------------------------|-------------------------------------------------------|  
| 1        | PawPlace Camden | STORE-CAM  | ORD-4402     | 2026-02-01 | SKU-BED-100  | Orthopaedic Dog Bed Large | Ineligible                 | Return window expired on 2026-03-03      | Manager Override — requires manager approval to proceed |  

---  

## Story: `Send Return and Refund Status Update`  

### Return (Given — above scenarios):  
| return_id | order_number | customer_email                 | return_status   |  
|-----------|--------------|--------------------------------|-----------------|  
| RTN-7001  | ORD-4401     | sarah.mitchell@pawplace.example | received        |  
| RTN-7002  | ORD-5502     | sarah.mitchell@pawplace.example | completed       |  
| RTN-7003  | ORD-6603     | sarah.mitchell@pawplace.example | requires review |  

### Refund (Given — above scenarios):  
| refund_reference | return_id | refund_amount | refund_status   |  
|------------------|-----------|---------------|-----------------|  
| REF-3001         | RTN-7001  | 54.99         | processing      |  
| REF-3002         | RTN-7002  | 24.99         | completed       |  
| REF-3003         | RTN-7003  | 199.99        | requires review |  

---  

### Scenario Outline: Lifecycle notification sent at return and refund transitions  

Given a **Return** *{return_id}* for **Order** *{order_number}* with *returnStatus* *{return_status}*  
  And **Refund** *{refund_reference}* with *refundStatus* *{refund_status}* and *refundAmount* *{refund_amount}*  
When the **Return** or **Refund** status changes to *{trigger_status}*  
Then a **Notification** is sent to **CustomerAccount** *{customer_email}* with *type* *{expected_notification_type}*  
  And the notification body reads *{expected_notification_body}*  

### Lifecycle notifications (Then — below scenario):  
| scenario | return_id | order_number | refund_reference | refund_amount | customer_email                 | trigger_status         | expected_notification_type | expected_notification_body                                                 |  
|----------|-----------|--------------|------------------|---------------|--------------------------------|------------------------|----------------------------|----------------------------------------------------------------------------|  
| 1        | RTN-7001  | ORD-4401     | REF-3001         | 54.99         | sarah.mitchell@pawplace.example | return received        | return-received            | We've received your return for ORD-4401 — refund processing will begin shortly |  
| 2        | RTN-7002  | ORD-5502     | REF-3002         | 24.99         | sarah.mitchell@pawplace.example | refund completed       | refund-completed           | Your £24.99 refund for ORD-5502 has been completed via your original payment method |  
| 3        | RTN-7003  | ORD-6603     | REF-3003         | 199.99        | sarah.mitchell@pawplace.example | refund requires review | refund-under-review        | Your refund of £199.99 for ORD-6603 is under review — contact support if you need an update |  

---  

### Scenario Outline: Notification queued on email delivery failure  

Given a **Return** *{return_id}* for **Order** *{order_number}* transitions to *returnStatus* *{return_status}*  
  And the email delivery system is *{email_system_status}*  
When the system attempts to send the *{notification_type}* **Notification**  
Then the **Notification** delivery status is *{expected_delivery_status}*  
  And the **Return** *returnStatus* update is *{expected_return_processing}*  

### Email delivery failure (Then — below scenario):  
| scenario | return_id | order_number | return_status | email_system_status     | notification_type | expected_delivery_status | expected_return_processing                               |  
|----------|-----------|--------------|---------------|-------------------------|-------------------|--------------------------|----------------------------------------------------------|  
| 1        | RTN-7001  | ORD-4401     | received      | temporarily unavailable | return-received   | queued for retry         | persisted — notification failure does not block processing |  

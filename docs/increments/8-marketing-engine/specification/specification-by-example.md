# Specification By Example


---

## Increment 8

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification by example (Scenario Outline) — Increment 8: Marketing engine — reviews, alerts, and content  

---  

## Story: `Submit Written Review with Star Rating`  

**CustomerAccount:**  
| customer_email | first_name | last_name |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | Nguyen |  
| guest@example.com | — | — |  

**Product:**  
| sku | name | brand |  
| --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | NutriPaws |  
| SKU-TOY-220 | Squeaky Bone Chew | PlayPet |  

**Order:** with **CustomerAccount** and **OrderLineItem**  
| order_number | customer_email | sku_snapshot |  
| --- | --- | --- |  
| ORD-8801 | tom.nguyen@pawplace.example | SKU-FOOD-501 |  

### Scenario Outline: Review submitted with valid star rating  

Given a **CustomerAccount** *{customer_email}* is logged in  
And **CustomerAccount** *{customer_email}* has purchased **Product** *{sku}* *{name}* (via **Order** *{order_number}*)  
When **CustomerAccount** *{customer_email}* submits a **CustomerReview** on **Product** *{sku}* with *starRating* *{star_rating}* and *writtenText* *{written_text}*  
Then the **CustomerReview** is associated with **Product** *{sku}* and **CustomerAccount** *{customer_email}* as *authoringAccount*  
And the **CustomerReview** is visible on the *Product Details Page* for **Product** *{sku}* showing *{expected_display_content}*  
And the review status is *{expected_review_status}*  

**CustomerReview (Then):**  
| scenario | customer_email | sku | name | order_number | star_rating | written_text | expected_display_content | expected_review_status |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | SKU-FOOD-501 | Premium Dog Kibble 10kg | ORD-8801 | 5 | My dog loves this kibble | 5 stars with "My dog loves this kibble" by Tom N. | accepted — text and rating stored |  
| 2 | tom.nguyen@pawplace.example | SKU-FOOD-501 | Premium Dog Kibble 10kg | ORD-8801 | 3 | | 3 stars with no written text shown, by Tom N. | accepted — rating only (written text optional) |  

---  

### Scenario: Review blocked for non-purchaser shows purchase prompt  

Given a **CustomerAccount** *tom.nguyen@pawplace.example* is logged in  
And **CustomerAccount** *tom.nguyen@pawplace.example* has not purchased **Product** *SKU-TOY-220* *Squeaky Bone Chew*  
When **CustomerAccount** *tom.nguyen@pawplace.example* opens the review area on **Product** *SKU-TOY-220*  
Then the *Product Details Page* displays a *"Purchase this product to leave a review"* message where the review form would appear  
And the review submission controls are replaced by the purchase prompt  

---  

### Scenario: Guest prompted to log in before reviewing  

Given a guest visitor (no **CustomerAccount** session)  
When the guest attempts to leave a **CustomerReview** on **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg*  
Then a prompt to log in or register is shown on the *Product Details Page*  
And the *Product Details Page* remains in view — no navigation away  

---  

## Story: `Submit Photo Review`  

**CustomerReview:** with **Product** and **CustomerAccount**  
| review_id | customer_email | sku | star_rating |  
| --- | --- | --- | --- |  
| REV-101 | tom.nguyen@pawplace.example | SKU-FOOD-501 | 5 |  

### Scenario: Photo attached to review and displayed on product page  

Given **CustomerAccount** *tom.nguyen@pawplace.example* is submitting a **CustomerReview** *REV-101* on **Product** *SKU-FOOD-501*  
When **CustomerAccount** *tom.nguyen@pawplace.example* attaches a *photoAttachment* image to **CustomerReview** *REV-101*  
Then the *photoAttachment* is stored on the **CustomerReview**  
And the image is displayed alongside the review text on the *Product Details Page*  
And selecting the image opens it in a lightbox or gallery at full size  

---  

### Scenario Outline: Photo upload validation preserves review content  

Given **CustomerAccount** *{customer_email}* is submitting a **CustomerReview** with *starRating* *{star_rating}* and *writtenText* *{written_text}*  
When **CustomerAccount** *{customer_email}* uploads a file with *{upload_condition}*  
Then *{expected_upload_result}*  
And the *starRating* *{star_rating}* and *writtenText* *{written_text}* are preserved in the form  

**Photo upload validation (Then):**  
| scenario | customer_email | star_rating | written_text | upload_condition | expected_upload_result |  
| --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | 4 | Great product | unsupported image format (.bmp) | validation error: "Supported formats: JPEG, PNG, WebP" |  
| 2 | tom.nguyen@pawplace.example | 4 | Great product | file exceeds 5 MB size limit | validation error: "Image must be under 5 MB" |  

---  

### Scenario: Review accepted without photos  

Given **CustomerAccount** *tom.nguyen@pawplace.example* is submitting a **CustomerReview** on **Product** *SKU-FOOD-501*  
When **CustomerAccount** *tom.nguyen@pawplace.example* submits the review with *starRating* *5* and *writtenText* *"Excellent quality"* and no *photoAttachment*  
Then the **CustomerReview** is accepted as a standard written review (*photoAttachment* is optional)  
And the review displays on the *Product Details Page* with the 5-star rating and text, with no image placeholder  

---  

## Story: `Read Customer Reviews`  

**Product:**  
| sku | name | aggregate_star_rating | review_count |  
| --- | --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | 4.3 | 27 |  
| SKU-TOY-220 | Squeaky Bone Chew | — | 0 |  

### Scenario Outline: Product page review display based on review count  

Given **Product** *{sku}* *{name}* has *reviewCount* *{review_count}* and *aggregateStarRating* *{aggregate_star_rating}*  
When a customer views the *Product Details Page* for **Product** *{sku}*  
Then *{expected_rating_display}*  
And *{expected_review_section}*  
And *{expected_call_to_action}*  

**Review display (Then):**  
| scenario | sku | name | review_count | aggregate_star_rating | expected_rating_display | expected_review_section | expected_call_to_action |  
| --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | SKU-FOOD-501 | Premium Dog Kibble 10kg | 27 | 4.3 | aggregateStarRating 4.3 displayed prominently near product name | 27 CustomerReview entries listed with sort controls: newest, oldest, highest rating, lowest rating | sort controls visible |  
| 2 | SKU-TOY-220 | Squeaky Bone Chew | 0 | — | reviews section shows a placeholder — no numeric aggregate rendered | no review entries listed | "Be the first to review" prompt appears |  

---  

### Scenario: Photo review thumbnails displayed inline  

Given **Product** *SKU-FOOD-501* has a **CustomerReview** with a *photoAttachment*  
When a customer views the **CustomerReview** list on the *Product Details Page*  
Then thumbnails are shown inline with the review text  
And selecting a thumbnail opens the image at full size in a lightbox  

---  

## Story: `Set Notification Preferences`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario Outline: Notification preference toggled and saved  

Given **CustomerAccount** *{customer_email}* opens *Notification Preferences* from account settings  
And the notification category *{notification_category}* currently shows *{current_setting}*  
When **CustomerAccount** *{customer_email}* toggles *{notification_category}* to *{new_setting}*  
Then the preference page confirms *{expected_confirmation_display}*  
And future **Notification** messages for *{notification_category}* follow *{expected_delivery_behavior}*  

**CommunicationPreferences (When/Then):**  
| scenario | customer_email | notification_category | current_setting | new_setting | expected_confirmation_display | expected_delivery_behavior |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | order updates | on | off | toggle shows "off"; saved indicator appears | optional order-update notifications suppressed |  
| 2 | tom.nguyen@pawplace.example | shipping | on | off | toggle shows "off"; saved indicator appears | optional shipping follow-up notifications suppressed |  
| 3 | tom.nguyen@pawplace.example | appointments | off | on | toggle shows "on"; saved indicator appears | appointment reminders delivered to customer |  

---  

### Scenario: Critical transactional notifications remain active regardless of preferences  

Given **CustomerAccount** *tom.nguyen@pawplace.example* disables all notification categories in *Notification Preferences*  
When an **Order** is confirmed for **CustomerAccount** *tom.nguyen@pawplace.example*  
Then the *order confirmation* **Notification** is still sent — it is a mandatory transactional notification  
And the preference page displays a note: *"Some notifications cannot be disabled"*  

---  

## Story: `Set Communication Preferences`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario Outline: Marketing category opt-in and opt-out saved  

Given **CustomerAccount** *{customer_email}* opens **CommunicationPreferences** from account settings  
And the marketing category *{marketing_category}* currently shows *{current_opt_status}*  
When **CustomerAccount** *{customer_email}* sets *{marketing_category}* to *{new_opt_status}*  
Then the **CommunicationPreferences** page displays *{marketing_category}* as *{expected_preference_label}*  
And the preference is saved immediately with *{expected_delivery_outcome}*  

**CommunicationPreferences (When/Then):**  
| scenario | customer_email | marketing_category | current_opt_status | new_opt_status | expected_preference_label | expected_delivery_outcome |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | promotionalOptIn | opted out | opted in | "Opted in" | promotional emails delivered to customer on next campaign |  
| 2 | tom.nguyen@pawplace.example | restockAlertsOptIn | opted in | opted out | "Opted out" | account removed from restock alert distribution; preference saved as opted out |  
| 3 | tom.nguyen@pawplace.example | eventNotificationsOptIn | opted out | opted in | "Opted in" | in-store event notifications delivered to customer for preferred store |  

---  

### Scenario: New marketing category defaults to opt-out  

Given a new marketing category *petCareTipsOptIn* is added to **CommunicationPreferences**  
When **CustomerAccount** *tom.nguyen@pawplace.example* views **CommunicationPreferences**  
Then *petCareTipsOptIn* displays as *"Opted out"* by default  
And the customer must explicitly toggle to opt in before receiving content for that category  

---  

## Story: `Opt In to Marketing Email List`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario: Customer opts in via communication preferences  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **CommunicationPreferences** with *promotionalOptIn* *false*  
When **CustomerAccount** *tom.nguyen@pawplace.example* sets *promotionalOptIn* to *true* via **CommunicationPreferences**  
Then **CustomerAccount** *tom.nguyen@pawplace.example* is added to the *Marketing Email List*  
And the opt-in is recorded with *lastUpdatedDate* *2026-05-07*  
And the preference page shows *promotionalOptIn* as *"Opted in"*  

---  

### Scenario: Opt-in checkbox unchecked by default at registration  

Given a new visitor is registering a **CustomerAccount**  
When the registration form is displayed  
Then the *promotionalOptIn* checkbox is unchecked by default  
And a label explains *"Tick to receive promotional emails and offers"*  
And the visitor must affirmatively check it to join the *Marketing Email List*  

---  

### Scenario: Opted-out account skipped during promotional batch  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **CommunicationPreferences** with *promotionalOptIn* *false*  
When the system prepares a promotional **Notification** batch  
Then the system evaluates **CustomerAccount** *tom.nguyen@pawplace.example*, finds *promotionalOptIn* = *false*, and skips the account  
And the batch log records *skipped: tom.nguyen@pawplace.example — promotionalOptIn=false*  

---  

## Story: `Send Promotional Email`  

**CustomerAccount:** with **CommunicationPreferences**  
| customer_email | first_name | promotional_opt_in |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true |  
| maria.chen@pawplace.example | Maria | true |  
| opted.out@pawplace.example | Jamie | false |  

### Scenario Outline: Promotional email delivery based on opt-in status  

Given **CustomerAccount** *{customer_email}* has **CommunicationPreferences** *promotionalOptIn* *{promotional_opt_in}*  
When admin creates and sends a promotional **Notification** *{campaign_subject}*  
Then *{expected_delivery_action}* for **CustomerAccount** *{customer_email}*  
And the delivery log records *{expected_log_entry}*  

**Promotional email delivery (Then):**  
| scenario | customer_email | promotional_opt_in | campaign_subject | expected_delivery_action | expected_log_entry |  
| --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | true | Spring Sale — 20% off all toys | Notification delivered to tom.nguyen@pawplace.example | delivered: promotionalOptIn=true |  
| 2 | opted.out@pawplace.example | false | Spring Sale — 20% off all toys | account skipped — promotionalOptIn=false | skipped: opted.out@pawplace.example — promotionalOptIn=false |  

---  

### Scenario: Recently opted-out customer re-checked at send time  

Given **CustomerAccount** *maria.chen@pawplace.example* had *promotionalOptIn* *true* when the email batch was queued  
And **CustomerAccount** *maria.chen@pawplace.example* sets *promotionalOptIn* to *false* before the batch is sent  
When the system sends the queued promotional **Notification** batch  
Then the system re-checks **CommunicationPreferences** at send time and finds *promotionalOptIn* = *false*  
And **CustomerAccount** *maria.chen@pawplace.example* is skipped with batch log entry *"skipped: preference changed to opted-out before send"*  

---  

### Scenario: Unsubscribe link immediately opts out of promotions  

Given **CustomerAccount** *tom.nguyen@pawplace.example* receives a promotional **Notification** email  
When **CustomerAccount** *tom.nguyen@pawplace.example* clicks the unsubscribe link in the email  
Then **CommunicationPreferences** *promotionalOptIn* is set to *false* immediately  
And a *"You've been unsubscribed from promotional emails"* confirmation page is shown  

---  

## Story: `Send Personalized Recommendation`  

**CustomerAccount:** with **CommunicationPreferences** and **Order** history  
| customer_email | first_name | promotional_opt_in | has_purchase_history |  
| --- | --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true | yes |  
| new.user@pawplace.example | Pat | true | no |  

**Product:**  
| sku | name | available_to_sell_quantity |  
| --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | 15 |  
| SKU-TREAT-400 | Dental Chew Sticks | 0 |  

### Scenario Outline: Recommendation type determined by purchase history  

Given **CustomerAccount** *{customer_email}* has **CommunicationPreferences** with *promotionalOptIn* *{promotional_opt_in}*  
And **CustomerAccount** *{customer_email}* has *{purchase_history_status}*  
When the system generates recommendations for **CustomerAccount** *{customer_email}*  
Then *{expected_recommendation_action}*  
And *{expected_recommendation_content}*  

**Personalized Recommendation (Then):**  
| scenario | customer_email | promotional_opt_in | purchase_history_status | expected_recommendation_action | expected_recommendation_content |  
| --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | true | prior Order history including SKU-FOOD-501 | Personalized Recommendation Notification sent to tom.nguyen@pawplace.example | products related to dog food purchase history; only in-stock items included |  
| 2 | new.user@pawplace.example | true | no Order history | account queued for popular-products fallback | top-selling products across categories sent as a "Staff Picks" email |  

---  

### Scenario: Recommendation contains only in-stock products  

Given **Product** *SKU-TREAT-400* *Dental Chew Sticks* has **StockAvailability** *availableToSellQuantity* *0*  
And **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* has **StockAvailability** *availableToSellQuantity* *15*  
And **CustomerAccount** *tom.nguyen@pawplace.example* has purchase history including both **Product** *SKU-TREAT-400* and **Product** *SKU-FOOD-501*  
When the system generates a *Personalized Recommendation* for **CustomerAccount** *tom.nguyen@pawplace.example*  
Then the recommendation includes **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* (*availableToSellQuantity* *15*)  
And the recommendation lists only products with *availableToSellQuantity* > *0*  

---  

## Story: `Send Restock Alert`  

**CustomerAccount:** with **CommunicationPreferences** and **Wishlist**  
| customer_email | first_name | restock_alerts_opt_in |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true |  
| opted.out@pawplace.example | Jamie | false |  

**Product:** with **StockAvailability**  
| sku | name | available_to_sell_quantity |  
| --- | --- | --- |  
| SKU-TREAT-400 | Dental Chew Sticks | 0 |  

**Wishlist:** with **CustomerAccount** and **Product**  
| customer_email | sku |  
| --- | --- |  
| tom.nguyen@pawplace.example | SKU-TREAT-400 |  
| opted.out@pawplace.example | SKU-TREAT-400 |  

### Scenario Outline: Restock alert behavior based on opt-in status  

Given **Product** *{sku}* *{name}* has **StockAvailability** *availableToSellQuantity* *0*  
And **CustomerAccount** *{customer_email}* has **Product** *{sku}* on their **Wishlist**  
And **CustomerAccount** *{customer_email}* has **CommunicationPreferences** *restockAlertsOptIn* *{restock_alerts_opt_in}*  
When **Product** *{sku}* **StockAvailability** transitions from *Out of Stock* to *In Stock*  
Then *{expected_notification_action}*  
And *{expected_wishlist_update}*  

**Restock alert (Then):**  
| scenario | customer_email | sku | name | restock_alerts_opt_in | expected_notification_action | expected_wishlist_update |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | SKU-TREAT-400 | Dental Chew Sticks | true | RestockAlert Notification sent to tom.nguyen@pawplace.example | Wishlist shows "Back in Stock" label on SKU-TREAT-400 |  
| 2 | opted.out@pawplace.example | SKU-TREAT-400 | Dental Chew Sticks | false | system logs restock event; account skipped with reason restockAlertsOptIn=false | Wishlist shows "Back in Stock" label on next visit |  

---  

### Scenario: Stock reverts before customer acts on alert  

Given a **RestockAlert** **Notification** was sent to **CustomerAccount** *tom.nguyen@pawplace.example* for **Product** *SKU-TREAT-400*  
And **Product** *SKU-TREAT-400* goes back to **StockAvailability** *availableToSellQuantity* *0* before the customer acts  
When **CustomerAccount** *tom.nguyen@pawplace.example* visits the *Product Details Page* for **Product** *SKU-TREAT-400*  
Then the page shows the updated *Out of Stock* status (the alert is best-effort, not a guarantee of availability)  

---  

## Story: `Send In-Store Event Notification`  

**CustomerAccount:** with **CommunicationPreferences** and preferred **Store**  
| customer_email | first_name | event_notifications_opt_in | preferred_store_code |  
| --- | --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true | STORE-CAM |  
| maria.chen@pawplace.example | Maria | true | — |  
| opted.out@pawplace.example | Jamie | false | STORE-CAM |  

**Store:**  
| store_code | store_name |  
| --- | --- |  
| STORE-CAM | PawPlace Camden |  

### Scenario Outline: Event notification delivery based on preferred store and opt-in  

Given **Store** *{store_name}* *{store_code}* hosts an in-store event *{event_name}*  
And **CustomerAccount** *{customer_email}* has *preferredStore* *{preferred_store_code}* and **CommunicationPreferences** *eventNotificationsOptIn* *{event_notifications_opt_in}*  
When admin creates the in-store event  
Then *{expected_notification_action}*  
And *{expected_event_discovery}*  

**Event notification delivery (Then):**  
| scenario | customer_email | store_code | store_name | event_name | preferred_store_code | event_notifications_opt_in | expected_notification_action | expected_event_discovery |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | STORE-CAM | PawPlace Camden | Adoption Day — Saturday 17 May | STORE-CAM | true | Notification sent to tom.nguyen@pawplace.example about event at PawPlace Camden | event also listed on Store detail page |  
| 2 | maria.chen@pawplace.example | STORE-CAM | PawPlace Camden | Adoption Day — Saturday 17 May | — | true | system skips — no preferred store matches event store | event discoverable on PawPlace Camden detail page for walk-in visitors |  
| 3 | opted.out@pawplace.example | STORE-CAM | PawPlace Camden | Adoption Day — Saturday 17 May | STORE-CAM | false | system skips — eventNotificationsOptIn=false | event discoverable on PawPlace Camden detail page for walk-in visitors |  

---  

## Story: `Unsubscribe from Marketing Emails`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario: Unsubscribed via email link  

Given **CustomerAccount** *tom.nguyen@pawplace.example* receives a promotional **Notification** email  
When **CustomerAccount** *tom.nguyen@pawplace.example* clicks the unsubscribe link for *promotionalOptIn*  
Then **CommunicationPreferences** *promotionalOptIn* is set to *false* immediately  
And a *"You've been unsubscribed"* confirmation page is shown  

---  

### Scenario: Unsubscribed via communication preferences page  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **CommunicationPreferences** *promotionalOptIn* *true*  
When **CustomerAccount** *tom.nguyen@pawplace.example* sets *promotionalOptIn* to *false* via the **CommunicationPreferences** page  
Then the change takes effect immediately and the preference page displays *promotionalOptIn* as *"Opted out"*  
And the account is removed from the promotional distribution list  

---  

### Scenario: Full marketing unsubscribe leaves transactional intact  

Given **CustomerAccount** *tom.nguyen@pawplace.example* opts out of all marketing categories in **CommunicationPreferences**: *promotionalOptIn*, *restockAlertsOptIn*, *petCareTipsOptIn*, *eventNotificationsOptIn*  
When **CustomerAccount** *tom.nguyen@pawplace.example* places an **Order**  
Then the *order confirmation* **Notification** is still sent (transactional, non-suppressible)  
And the *shipping update* **Notification** is still sent (transactional, non-suppressible)  

---  

## Story: `Send Order Confirmation`  

**Order:** with **CustomerAccount** and **DeliveryOption**  
| order_number | customer_email | order_date | order_total | delivery_method_name |  
| --- | --- | --- | --- | --- |  
| ORD-9901 | tom.nguyen@pawplace.example | 2026-05-07 | 67.98 | Standard Delivery |  

**Payment:** with **Order**  
| payment_reference | order_number | payment_status |  
| --- | --- | --- |  
| PAY-5501 | ORD-9901 | captured |  

### Scenario: Order confirmation notification sent with order details  

Given **Order** *ORD-9901* for **CustomerAccount** *tom.nguyen@pawplace.example* with *orderTotal* *£67.98*  
And **Payment** *PAY-5501* for **Order** *ORD-9901* has *paymentStatus* *captured*  
When **Order** *ORD-9901* is confirmed  
Then a **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with *type* *order-confirmation*  
And the **Notification** *notificationBody* includes *orderNumber* *ORD-9901*, *orderLineItems*, *orderTotal* *£67.98*, *deliveryMethodName* *Standard Delivery*, and *estimatedDeliveryDate*  

---  

### Scenario: Order confirmation sent regardless of disabled notification preference  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has disabled order-related notifications in *Notification Preferences*  
When **Order** *ORD-9901* is confirmed  
Then the *order-confirmation* **Notification** is still sent — it is a mandatory transactional notification  
And the **Notification** *notificationBody* includes the full order summary  

---  

### Scenario: Notification queued on email system failure  

Given **Order** *ORD-9901* is confirmed  
And the email delivery system is unavailable  
When the system attempts to send the *order-confirmation* **Notification**  
Then the **Notification** is queued for retry with *deliveryStatus* *queued*  
And the system retries delivery according to the retry schedule  

---  

## Story: `Send Shipping Update with Tracking`  

**Order:** with tracking  
| order_number | customer_email | tracking_number | estimated_delivery_date |  
| --- | --- | --- | --- |  
| ORD-9901 | tom.nguyen@pawplace.example | TRK-UK-88431 | 2026-05-12 |  

### Scenario: Shipping notification sent with tracking number  

Given **Order** *ORD-9901* for **CustomerAccount** *tom.nguyen@pawplace.example*  
When **Order** *ORD-9901* *orderStatus* changes to *shipped* with *trackingNumber* *TRK-UK-88431* and *estimatedDeliveryDate* *2026-05-12*  
Then a **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with *type* *shipping-update*  
And the **Notification** includes *orderNumber* *ORD-9901*, *trackingNumber* *TRK-UK-88431*, carrier link, and *estimatedDeliveryDate* *2026-05-12*  

---  

### Scenario: Follow-up shipping milestone recorded on tracking page  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has disabled optional shipping follow-ups in *Notification Preferences*  
When **Order** *ORD-9901* status updates to *Out for Delivery*  
Then the **Order** *ORD-9901* tracking page records the *Out for Delivery* milestone  
And the updated status is accessible to **CustomerAccount** *tom.nguyen@pawplace.example* via the order tracking link  

---  

### Scenario: Initial shipping notification is non-suppressible  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has disabled shipping notifications in *Notification Preferences*  
When **Order** *ORD-9901* *orderStatus* changes to *shipped*  
Then the initial *shipping-update* **Notification** is still sent (mandatory transactional)  
And the **Notification** includes *trackingNumber* and *estimatedDeliveryDate*  

---  

## Story: `Send Click-and-Collect Ready Notification`  

**ClickAndCollect:** with **Order** and **Store**  
| order_number | customer_email | store_code | store_name | collection_window |  
| --- | --- | --- | --- | --- |  
| ORD-9902 | tom.nguyen@pawplace.example | STORE-CAM | PawPlace Camden | 2026-05-14 |  

### Scenario: Ready notification sent with store details and collection window  

Given **Order** *ORD-9902* for **CustomerAccount** *tom.nguyen@pawplace.example* has a **ClickAndCollect** at **Store** *PawPlace Camden* *STORE-CAM*  
When the store employee marks **ClickAndCollect** *pickupStatus* as *ready*  
Then a **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with *type* *click-and-collect-ready*  
And the **Notification** includes *orderNumber* *ORD-9902*, **Store** *storeName* *PawPlace Camden*, store address, operating hours, and *collectionWindow* *2026-05-14*  

---  

### Scenario: Guest click-and-collect notification sent to guest email  

Given **Order** *ORD-9903* placed by **GuestCheckout** *guest.buyer@example.com* has a **ClickAndCollect** at **Store** *PawPlace Camden*  
When the store employee marks **ClickAndCollect** *pickupStatus* as *ready*  
Then the **Notification** is sent to *guestEmail* *guest.buyer@example.com*  
And the **Notification** includes *orderNumber* *ORD-9903*, **Store** *storeName* *PawPlace Camden*, and *collectionWindow*  

---  

### Scenario: Collection window reminder sent before deadline  

Given **ClickAndCollect** for **Order** *ORD-9902* has *collectionWindow* *2026-05-14*  
And the current date is *2026-05-13* and the order has not been collected  
When the *collectionWindow* deadline approaches  
Then a reminder **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with the collection deadline and a warning that uncollected orders will be returned to stock  

---  

### Scenario: Notification queued on email failure without blocking fulfillment  

Given **ClickAndCollect** for **Order** *ORD-9902* is marked as *ready*  
And the email delivery system is temporarily unavailable  
When the system attempts to send the *click-and-collect-ready* **Notification**  
Then the **Notification** is queued for retry with *deliveryStatus* *queued*  
And the **ClickAndCollect** *pickupStatus* still transitions to *ready* (email failure does not block fulfillment)  

---  

## Story: `Publish Blog Post`  

**Content:**  
| content_title | content_author | publication_date | content_body |  
| --- | --- | --- | --- |  
| How to Introduce a New Cat to Your Household | Dr. Sarah Vet | 2026-05-07 | Full article text... |  
| Best Food for Senior Dogs | PawPlace Editorial | — | Draft article text... |  

### Scenario Outline: Blog post visibility based on publication status  

Given a *Content Author* creates a **Content** with *contentTitle* *{content_title}*, *contentAuthor* *{content_author}*, and *contentBody*  
When the *Content Author* sets the **Content** to *{publication_status}*  
Then *{expected_blog_index_display}*  
And *{expected_customer_url_access}*  
And *{expected_admin_area_state}*  

**Content visibility (Then):**  
| scenario | content_title | content_author | publication_date | publication_status | expected_blog_index_display | expected_customer_url_access | expected_admin_area_state |  
| --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | How to Introduce a New Cat to Your Household | Dr. Sarah Vet | 2026-05-07 | published | listed on Blog Index with title, summary, date 2026-05-07, and author | full content accessible via its own URL | marked as "Published" in admin |  
| 2 | Best Food for Senior Dogs | PawPlace Editorial | — | draft | not listed on Blog Index | content URL returns 404 for customers | listed as "Draft" in admin — editable and publishable |  

---  

### Scenario: Edited blog post updated immediately  

Given a published **Content** *"How to Introduce a New Cat to Your Household"* with *publicationDate* *2026-05-07*  
When the *Content Author* edits the **Content** *contentBody*  
Then the changes are reflected immediately on the live page  
And the *publicationDate* remains *2026-05-07* unless the author explicitly updates it  

---  

## Story: `Publish Pet Care Guide`  

**Content:**  
| content_title | content_author | species_tag |  
| --- | --- | --- |  
| Nutrition Guide for Golden Retrievers | PawPlace Editorial | dog |  
| Reptile Habitat Setup | PawPlace Editorial | reptile |  

### Scenario Outline: Pet care guide visibility based on publication status  

Given a *Content Author* creates a **Content** guide with *contentTitle* *{content_title}*, tagged with *species* *{species_tag}*  
When the *Content Author* sets the guide to *{publication_status}*  
Then *{expected_guide_index_display}*  
And *{expected_customer_access}*  
And *{expected_admin_area_state}*  

**Guide visibility (Then):**  
| scenario | content_title | species_tag | publication_status | expected_guide_index_display | expected_customer_access | expected_admin_area_state |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | Nutrition Guide for Golden Retrievers | dog | published | listed on Guide Index with title, summary, species tag "dog", and publicationDate | full guide accessible via its own URL | marked as "Published" in admin |  
| 2 | Reptile Habitat Setup | reptile | draft | not listed on Guide Index | guide URL returns 404 for customers | listed as "Draft" in admin — editable and publishable |  

---  

### Scenario: Published guide linked from pet browsing areas  

Given a published **Content** guide *"Nutrition Guide for Golden Retrievers"* tagged with *species* *dog*  
When a customer browses the *Pet Gallery* or **Product** pages for *dog* products  
Then the guide is linked from relevant pet-related browsing areas  
And the link shows the guide title and species tag  


---

## increment-8-sprint-1-reviews-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 1 — Customer reviews
stories:
  - Submit Written Review with Star Rating
  - Submit Photo Review
  - Read Customer Reviews
---

# Specification by Example — Increment 8 Sprint 1: Customer reviews

**Sources / context:** `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-reviews-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 1 review stories only)

---

## Story: Submit Written Review with Star Rating

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Customer Review, Star Rating, Aggregate Star Rating), marketing-engine-ubiquitous-language.md (Customer Review KA), acceptance-criteria.md (Submit Written Review with Star Rating AC 1–5)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has purchased **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* via **Order** *ORD-8801*

---

### Scenario 1: Verified purchaser sees review form on product details page

Given the **Product Details Page** for **Product** *SKU-FOOD-501* is displayed
When **Customer Account** *tom.nguyen@pawplace.example* opens the review submission area on the **Product Details Page**
Then the form collects a **Star Rating** *(1–5)* and optional written text for a **Customer Review**
  And **Customer Account** *tom.nguyen@pawplace.example* is *verified as purchaser* of **Product** *SKU-FOOD-501*

### Scenario 2: Valid customer review published and aggregate star rating recomputed

When **Customer Account** *tom.nguyen@pawplace.example* submits a **Customer Review** on **Product** *SKU-FOOD-501* with **Star Rating** *5* and written text *"My dog loves this kibble"*
Then the **Customer Review** is associated with **Product** *SKU-FOOD-501* and **Customer Account** *tom.nguyen@pawplace.example*
  And the **Customer Review** appears on the **Product Details Page** sorted *newest first*
  And **Product** *SKU-FOOD-501* **Aggregate Star Rating** is recomputed to include **Star Rating** *5*

### Scenario 3: Star-rating-only customer review accepted

When **Customer Account** *tom.nguyen@pawplace.example* submits a **Customer Review** on **Product** *SKU-FOOD-501* with **Star Rating** *3* and no written text
Then the **Customer Review** is *accepted*
  And the **Product Details Page** shows **Star Rating** *3* with no written text body

### Scenario 4: Non-purchaser sees purchase prompt while reviews remain viewable

Given a **Customer Account** *tom.nguyen@pawplace.example* is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has *not purchased* **Product** *SKU-TOY-220* *Squeaky Bone Chew*
When **Customer Account** *tom.nguyen@pawplace.example* opens the review area on the **Product Details Page** for **Product** *SKU-TOY-220*
Then the **Product Details Page** shows *"Purchase this product to leave a review"* where the review form would appear
  And existing **Customer Reviews** on **Product** *SKU-TOY-220* remain *viewable*

### Scenario 5: Guest prompted to sign in without leaving product details page

Given no **Customer Account** session exists (*guest*)
When the guest attempts to leave a **Customer Review** on **Product** *SKU-FOOD-501* from the **Product Details Page**
Then the **Product Details Page** prompts to *log in or register*
  And the **Product Details Page** remains in view — no navigation away

---

## Story: Submit Photo Review

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Review Photo, Customer Review), marketing-engine-ubiquitous-language.md (review photo), acceptance-criteria.md (Submit Photo Review AC 1–4)

---

### Scenario 1: Review photos displayed inline with lightbox expansion

Given **Customer Account** *tom.nguyen@pawplace.example* is submitting a **Customer Review** on **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* attaches **Review Photo** *dog-kibble-bowl.jpg* to the **Customer Review**
  And submits the **Customer Review** with **Star Rating** *5* and written text *"Great quality"*
Then **Review Photo** *dog-kibble-bowl.jpg* is stored on the **Customer Review**
  And the **Product Details Page** displays the **Review Photo** as an inline thumbnail alongside the review text
When a customer selects the thumbnail on the **Product Details Page**
Then the **Product Details Page** opens **Review Photo** at *full size in a lightbox*

### Scenario 2: Unsupported image format rejected without losing review draft

Given **Customer Account** *tom.nguyen@pawplace.example* has entered **Star Rating** *4* and written text *"Great product"* on a **Customer Review** draft for **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* uploads file *photo.bmp* as a **Review Photo**
Then the upload shows a validation error *"Supported formats: JPEG, PNG, WebP"*
  And **Star Rating** *4* and written text *"Great product"* remain in the form

### Scenario 3: Oversized image rejected without losing review draft

Given **Customer Account** *tom.nguyen@pawplace.example* has entered **Star Rating** *4* and written text *"Great product"* on a **Customer Review** draft for **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* uploads file *large-photo.jpg* exceeding the *5 MB* size limit as a **Review Photo**
Then the upload shows a validation error *"Image must be under 5 MB"*
  And **Star Rating** *4* and written text *"Great product"* remain in the form

### Scenario 4: Customer review accepted without review photos

Given **Customer Account** *tom.nguyen@pawplace.example* is submitting a **Customer Review** on **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* submits the **Customer Review** with **Star Rating** *5* and written text *"Excellent quality"* and no **Review Photo**
Then the **Customer Review** is *accepted* as a standard written review — **Review Photo** is *optional*
  And the **Product Details Page** shows the **Star Rating** and written text with no image placeholder

---

## Story: Read Customer Reviews

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Product Reviews, Aggregate Star Rating, Product Details Page), marketing-engine-ubiquitous-language.md (aggregate star rating, product reviews), acceptance-criteria.md (Read Customer Reviews AC 1–4)

---

### Scenario 1: Product with reviews shows aggregate star rating and review listing

Given **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* has **Product Reviews** with *27* **Customer Reviews** and **Aggregate Star Rating** *4.3*
When a customer views the **Product Details Page** for **Product** *SKU-FOOD-501*
Then **Aggregate Star Rating** *4.3* is displayed prominently near the product name
  And **Product Reviews** lists individual **Customer Reviews** below the product details
  And sort controls offer *newest*, *oldest*, *highest rating*, and *lowest rating*

### Scenario 2: Product with no reviews suppresses zero aggregate star rating

Given **Product** *SKU-TOY-220* *Squeaky Bone Chew* has **Product Reviews** with *zero* **Customer Reviews**
When a customer views the **Product Details Page** for **Product** *SKU-TOY-220*
Then **Aggregate Star Rating** is *not displayed*
  And the **Product Details Page** shows *"Be the first to review"*

### Scenario 3: Many customer reviews paginated with default newest-first sort

Given **Product** *SKU-FOOD-501* has more than one page of **Customer Reviews** in **Product Reviews**
When a customer views **Product Reviews** on the **Product Details Page** for **Product** *SKU-FOOD-501*
Then **Product Reviews** are *paginated or lazy-loaded*
  And the default listing order is *newest first*
When the customer selects sort *highest rating* on **Product Reviews**
Then **Product Reviews** reorders **Customer Reviews** by **Star Rating** *descending*

### Scenario 4: Review photo thumbnails shown inline on read path

Given a **Customer Review** on **Product** *SKU-FOOD-501* includes **Review Photo** *dog-kibble-bowl.jpg*
When a customer views **Product Reviews** on the **Product Details Page**
Then **Review Photo** thumbnails appear inline with the review text
When the customer selects a thumbnail
Then the **Product Details Page** opens **Review Photo** at *full size in a lightbox*


---

## increment-8-sprint-2-preferences-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
stories:
  - Set Notification Preferences
  - Set Communication Preferences
  - Opt In to Marketing Email List
---

# Specification by Example — Increment 8 Sprint 2: Notification and communication preferences

**Sources / context:** `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-preferences-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 2 preference stories only)

---

## Story: Set Notification Preferences

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Notification Preferences, Transactional Notification, Account Settings), acceptance-criteria.md (Set Notification Preferences AC 1–4)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has **Notification Preferences** with order updates *on*, shipping *on*, appointments *on*, returns *off*

---

### Scenario 1: Account settings lists transactional notification categories with current on/off settings

When **Customer Account** *tom.nguyen@pawplace.example* opens **Notification Preferences** from **Account Settings**
Then **Account Settings** lists **Transactional Notification** categories *order updates*, *shipping*, *appointments*, and *returns*
  And each category shows the current setting from **Notification Preferences** (*on* or *off*)

### Scenario 2: Category toggle persists immediately and gates future transactional sends

When **Customer Account** *tom.nguyen@pawplace.example* toggles **Notification Preferences** *shipping* from *on* to *off*
Then **Notification Preferences** for **Customer Account** *tom.nguyen@pawplace.example* saves *shipping* as *off* immediately — no separate save action
  And a subsequent **Transactional Notification** of category *shipping* is *not delivered* to **Customer Account** *tom.nguyen@pawplace.example*
  And a subsequent **Transactional Notification** of category *order updates* still respects the *on* setting

### Scenario 3: Disabling all optional categories still sends critical confirmations

Given **Customer Account** *tom.nguyen@pawplace.example* has **Notification Preferences** with order updates *off*, shipping *off*, appointments *off*, and returns *off*
When **Customer Account** *tom.nguyen@pawplace.example* completes payment on **Order** *ORD-8802* with total *$42.50*
Then a **Transactional Notification** *order confirmation* is sent to **Customer Account** *tom.nguyen@pawplace.example* — *non-optional*
  And **Account Settings** on **Notification Preferences** shows a note that *order confirmation* and *refund completion* cannot be disabled

### Scenario 4: Guest prompted to sign in while guest checkout notifications continue

Given no **Customer Account** session exists (*guest*)
  And guest checkout used email *guest.buyer@example.com* on **Order** *ORD-8803*
When the guest attempts to open **Notification Preferences** from **Account Settings**
Then **Account Settings** prompts to *log in or create an account*
  And **Transactional Notification** for **Order** *ORD-8803* is still delivered to *guest.buyer@example.com*

---

## Story: Set Communication Preferences

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Communication Preferences, Marketing Category, Marketing Communication, Unsubscribe), acceptance-criteria.md (Set Communication Preferences AC 1–5)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *promotions* *opted-out*, *recommendations* *opted-out*, *restock alerts* *opted-in*, and *events* *opted-out*

---

### Scenario 1: Communication preferences lists marketing categories with opt-in status

When **Customer Account** *tom.nguyen@pawplace.example* opens **Communication Preferences** from **Account Settings**
Then **Account Settings** lists **Marketing Category** *promotions*, *recommendations*, *restock alerts*, and *events*
  And each **Marketing Category** shows the current opt-in/opt-out status from **Communication Preferences**

### Scenario 2: Marketing category opt-out persists immediately and blocks category sends

When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *restock alerts* from *opted-in* to *opted-out* on **Communication Preferences**
Then **Communication Preferences** persists *restock alerts* as *opted-out* immediately — no separate save action
  And **Marketing Communication** for **Marketing Category** *restock alerts* is *not sent* to **Customer Account** *tom.nguyen@pawplace.example* after the toggle

### Scenario 3: New marketing category defaults to opt-out for existing customers

Given the catalog adds **Marketing Category** *loyalty rewards* after go-live
When **Customer Account** *tom.nguyen@pawplace.example* opens **Communication Preferences**
Then **Marketing Category** *loyalty rewards* appears with status *opted-out*
  And no **Marketing Communication** for **Marketing Category** *loyalty rewards* is sent until **Customer Account** *tom.nguyen@pawplace.example* explicitly opts in

### Scenario 4: Opting out of all marketing categories leaves transactional notifications intact

Given **Customer Account** *tom.nguyen@pawplace.example* opts out of **Marketing Category** *promotions*, *recommendations*, *restock alerts*, and *events* on **Communication Preferences**
When **Marketing Communication** eligibility is evaluated for **Customer Account** *tom.nguyen@pawplace.example*
Then no **Marketing Communication** is sent for any **Marketing Category**
  And **Transactional Notification** *order confirmation* for **Order** *ORD-8801* is still delivered per **Notification Preferences**

### Scenario 5: Guest prompted without leaving the current page

Given no **Customer Account** session exists (*guest*)
  And the guest is viewing **Account Settings** on route */account/communication*
When the guest attempts to open **Communication Preferences**
Then **Account Settings** prompts to *log in or register*
  And the browser remains on */account/communication* — no navigation away

---

## Story: Opt In to Marketing Email List

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Marketing Email List, Opt In, Communication Preferences), acceptance-criteria.md (Opt In to Marketing Email List AC 1–4)

---

### Scenario 1: Opting in via communication preferences adds customer to marketing email list with timestamp

Given **Customer Account** *tom.nguyen@pawplace.example* is *not* on the **Marketing Email List**
  And **Communication Preferences** has **Marketing Category** *promotions* *opted-out*
When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *promotions* to *opted-in* on **Communication Preferences**
Then **Customer Account** *tom.nguyen@pawplace.example* is added to the **Marketing Email List**
  And **Marketing Email List** records an **Opt In** timestamp *2026-05-30T14:22:00Z* for **Marketing Category** *promotions*

### Scenario 2: Registration promotional checkbox is unchecked by default

Given a new **Customer Account** registration form is displayed
When the registrant views the promotional email checkbox
Then the checkbox is *unchecked* by default
When the registrant completes registration *without* checking the promotional email checkbox
Then **Customer Account** *new.customer@pawplace.example* is *not* on the **Marketing Email List**

### Scenario 3: Affirmative checkout opt-in adds customer to marketing email list

Given **Customer Account** *tom.nguyen@pawplace.example* is completing checkout
  And the promotional email checkbox is *unchecked* by default
When **Customer Account** *tom.nguyen@pawplace.example* checks the promotional email checkbox and completes checkout
Then **Customer Account** *tom.nguyen@pawplace.example* is added to the **Marketing Email List**
  And **Marketing Email List** records an **Opt In** timestamp for the checkout path

### Scenario 4: No marketing communications without explicit category opt-in

Given **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with every **Marketing Category** *opted-out*
  And **Customer Account** *sam.lee@pawplace.example* is *not* on the **Marketing Email List**
When **Marketing Communication** send eligibility is evaluated for **Customer Account** *sam.lee@pawplace.example*
Then **Marketing Communication** is *not sent* — zero exceptions

### Scenario 5: Existing list member can unsubscribe via promotions toggle

Given **Customer Account** *tom.nguyen@pawplace.example* is on the **Marketing Email List** with **Marketing Category** *promotions* *opted-in*
When **Customer Account** *tom.nguyen@pawplace.example* opens **Communication Preferences**
Then **Marketing Category** *promotions* shows as *opted-in*
When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *promotions* to *opted-out*
Then **Unsubscribe** for **Marketing Category** *promotions* takes effect immediately
  And **Customer Account** *tom.nguyen@pawplace.example* is removed from the **Marketing Email List** when no **Marketing Category** remains *opted-in*


---

## increment-8-sprint-3-campaigns-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
stories:
  - Send Promotional Email
  - Send Personalized Recommendation
  - Send Restock Alert
  - Send In-Store Event Notification
---

# Specification by Example — Increment 8 Sprint 3: Marketing campaigns and alerts

**Sources / context:** `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-campaigns-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 3 campaign stories only)

---

## Story: Send Promotional Email

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Promotional Email, Marketing Email List, Communication Preferences, Unsubscribe), acceptance-criteria.md (Send Promotional Email AC 1–4)

---

## Background

Given admin *marketing.admin@pawplace.example* is authenticated
  And **Marketing Email List** includes **Customer Account** *tom.nguyen@pawplace.example* with **Marketing Category** *promotions* *opted-in*
  And **Marketing Email List** includes **Customer Account** *sam.lee@pawplace.example* with **Marketing Category** *promotions* *opted-in*

---

### Scenario 1: Promotional email delivered only to opted-in marketing email list members

When admin creates and sends **Promotional Email** *Summer Sale 20% Off* targeting **Marketing Category** *promotions*
Then **Promotional Email** *Summer Sale 20% Off* is delivered to **Customer Account** *tom.nguyen@pawplace.example*
  And **Promotional Email** *Summer Sale 20% Off* is delivered to **Customer Account** *sam.lee@pawplace.example*
  And **Promotional Email** *Summer Sale 20% Off* includes an **Unsubscribe** link

### Scenario 2: Realtime opt-out between batch creation and delivery blocks send

Given **Promotional Email** *Summer Sale 20% Off* batch was created at *2026-05-30T10:00:00Z*
  And **Customer Account** *sam.lee@pawplace.example* had **Marketing Category** *promotions* *opted-in* at batch creation
When **Customer Account** *sam.lee@pawplace.example* toggles **Marketing Category** *promotions* to *opted-out* on **Communication Preferences** at *2026-05-30T10:30:00Z*
  And the system delivers **Promotional Email** *Summer Sale 20% Off* at *2026-05-30T11:00:00Z*
Then **Promotional Email** *Summer Sale 20% Off* is *not delivered* to **Customer Account** *sam.lee@pawplace.example*
  And **Communication Preferences** were checked at *delivery time* — not at batch creation time

### Scenario 3: Unsubscribe link opts out promotions category and shows confirmation

Given **Customer Account** *tom.nguyen@pawplace.example* received **Promotional Email** *Summer Sale 20% Off* with **Marketing Category** *promotions* *opted-in*
When **Customer Account** *tom.nguyen@pawplace.example* clicks the **Unsubscribe** link in **Promotional Email** *Summer Sale 20% Off*
Then **Unsubscribe** opts **Customer Account** *tom.nguyen@pawplace.example* out of **Marketing Category** *promotions* immediately
  And a confirmation page shows *you've been unsubscribed*

### Scenario 4: Delivery failure queues promotional email for retry

Given **Customer Account** *tom.nguyen@pawplace.example* is eligible for **Promotional Email** *Summer Sale 20% Off*
  And the email delivery provider is *temporarily unavailable*
When the system attempts to send **Promotional Email** *Summer Sale 20% Off* to **Customer Account** *tom.nguyen@pawplace.example*
Then **Promotional Email** *Summer Sale 20% Off* is *queued for retry*
  And the message is *not silently discarded*

### Scenario 5: Guest checkout sessions cannot receive promotional email

Given no **Customer Account** exists for guest checkout email *guest.buyer@example.com*
When admin sends **Promotional Email** *Summer Sale 20% Off*
Then **Promotional Email** *Summer Sale 20% Off* is *not delivered* to *guest.buyer@example.com*

---

## Story: Send Personalized Recommendation

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Personalized Recommendation, Purchase History, Browsing History, Pet Profile, Stock Availability), acceptance-criteria.md (Send Personalized Recommendation AC 1–4)

---

## Examples

### Customer Account:

| scenario   | customer_email              | recommendations_opt_in |
|------------|-----------------------------|------------------------|
| Scenario 1 | tom.nguyen@pawplace.example | opted-in               |
| Scenario 4 | jane.wong@pawplace.example  | opted-out              |

### Personalized Recommendation:

| scenario   | personalization_source | recommended_product_sku | recommended_product_name      |
|------------|------------------------|-------------------------|-------------------------------|
| Scenario 1 | purchase history       | SKU-FOOD-502            | Grain-Free Puppy Kibble 5kg   |
| Scenario 2 | browsing history       | SKU-TOY-220             | Squeaky Bone Chew             |
| Scenario 3 | pet profile            | SKU-GROOM-110           | Hypoallergenic Dog Shampoo    |

---

## Background

Given **Customer Account** {customer_email} has **Communication Preferences** with **Marketing Category** *recommendations* {recommendations_opt_in}

---

## Scenarios

### Scenario Outline 1: Personalized recommendation sent from eligible personalization source

### Steps

Given **Customer Account** {customer_email} has {personalization_source} data for **Product** recommendations
  And **Product** {recommended_product_sku} *{recommended_product_name}* has **Stock Availability** *in-stock*
When the system generates **Personalized Recommendation** for **Customer Account** {customer_email}
Then **Personalized Recommendation** includes **Product** {recommended_product_sku} *{recommended_product_name}*
  And **Personalized Recommendation** is delivered to **Customer Account** {customer_email}

---

### Scenario 2: No personalized recommendation when customer lacks personalization data

Given **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with **Marketing Category** *recommendations* *opted-in*
  And **Customer Account** *sam.lee@pawplace.example* has no **Purchase History**, **Browsing History**, or **Pet Profile** data
When the system evaluates **Personalized Recommendation** eligibility for **Customer Account** *sam.lee@pawplace.example*
Then no **Personalized Recommendation** is sent
  And generic suggestions remain the responsibility of **Promotional Email** — not this channel

### Scenario 3: Out-of-stock product excluded from recommendation set

Given **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *recommendations* *opted-in*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Purchase History** including **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg*
  And **Product** *SKU-FOOD-501* has **Stock Availability** *out-of-stock*
  And **Product** *SKU-FOOD-502* *Grain-Free Puppy Kibble 5kg* in the same category has **Stock Availability** *in-stock*
When the system generates **Personalized Recommendation** for **Customer Account** *tom.nguyen@pawplace.example*
Then **Personalized Recommendation** excludes **Product** *SKU-FOOD-501*
  And **Personalized Recommendation** may include **Product** *SKU-FOOD-502* *Grain-Free Puppy Kibble 5kg*

### Scenario Outline 2: Recommendations category opt-out blocks send regardless of data

### Steps

Given **Customer Account** {customer_email} has **Purchase History** and **Browsing History** data
When the system evaluates **Personalized Recommendation** eligibility for **Customer Account** {customer_email}
Then no **Personalized Recommendation** is sent

---

## Story: Send Restock Alert

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Restock Alert, Wishlist, Stock Availability, Product Details Page), acceptance-criteria.md (Send Restock Alert AC 1–4)

---

## Background

Given **Product** *SKU-TOY-220* *Squeaky Bone Chew* has **Stock Availability** *out-of-stock*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Product** *SKU-TOY-220* on **Wishlist**
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *restock alerts* *opted-in*

---

### Scenario 1: Restock alert sent when stock transitions to in-stock for wishlisted opted-in customer

When **Stock Availability** for **Product** *SKU-TOY-220* transitions from *out-of-stock* to *in-stock*
Then **Restock Alert** is sent to **Customer Account** *tom.nguyen@pawplace.example*
  And **Restock Alert** references **Product** *SKU-TOY-220* *Squeaky Bone Chew*

### Scenario 2: Restock alert suppressed when restock category opted out

Given **Customer Account** *sam.lee@pawplace.example* has **Product** *SKU-TOY-220* on **Wishlist**
  And **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with **Marketing Category** *restock alerts* *opted-out*
When **Stock Availability** for **Product** *SKU-TOY-220* transitions from *out-of-stock* to *in-stock*
Then no **Restock Alert** is sent to **Customer Account** *sam.lee@pawplace.example*

### Scenario 3: Product details page reflects best-effort availability after restock alert

Given **Restock Alert** was sent to **Customer Account** *tom.nguyen@pawplace.example* for **Product** *SKU-TOY-220*
When **Stock Availability** for **Product** *SKU-TOY-220* transitions back to *out-of-stock* before **Customer Account** *tom.nguyen@pawplace.example* purchases
  And **Customer Account** *tom.nguyen@pawplace.example* opens the **Product Details Page** for **Product** *SKU-TOY-220*
Then the **Product Details Page** shows **Stock Availability** *out-of-stock*
  And the prior **Restock Alert** remains a *best-effort signal* — not a guarantee of availability

### Scenario 4: No restock alert when product is not wishlisted

Given no **Customer Account** has **Product** *SKU-GROOM-110* on **Wishlist**
When **Stock Availability** for **Product** *SKU-GROOM-110* transitions from *out-of-stock* to *in-stock*
Then no **Restock Alert** is sent

---

## Story: Send In-Store Event Notification

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (In-Store Event, In-Store Event Notification, Store, Store Details Page), acceptance-criteria.md (Send In-Store Event Notification AC 1–4)

---

## Background

Given admin *marketing.admin@pawplace.example* is authenticated
  And **Store** *STR-001* *PawPlace Downtown* hosts **In-Store Event** *EVT-2026-0615* *Adoption Day* on *2026-06-15*

---

### Scenario 1: Event notification sent when preferred store matches event location

Given **Customer Account** *tom.nguyen@pawplace.example* has preferred **Store** *STR-001* *PawPlace Downtown*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-in*
When admin publishes **In-Store Event** *EVT-2026-0615* at **Store** *STR-001*
Then **In-Store Event Notification** for **In-Store Event** *EVT-2026-0615* is sent to **Customer Account** *tom.nguyen@pawplace.example*

### Scenario 2: No notification when preferred store not set but event remains discoverable

Given **Customer Account** *sam.lee@pawplace.example* has no preferred **Store** set
  And **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-in*
When admin publishes **In-Store Event** *EVT-2026-0615* at **Store** *STR-001*
Then no **In-Store Event Notification** is sent to **Customer Account** *sam.lee@pawplace.example*
  And **In-Store Event** *EVT-2026-0615* appears on **Store Details Page** for **Store** *STR-001* for walk-in discovery

### Scenario 3: Events category opt-out suppresses notification

Given **Customer Account** *jane.wong@pawplace.example* has preferred **Store** *STR-001* *PawPlace Downtown*
  And **Customer Account** *jane.wong@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-out*
When admin publishes **In-Store Event** *EVT-2026-0615* at **Store** *STR-001*
Then no **In-Store Event Notification** is sent to **Customer Account** *jane.wong@pawplace.example*

### Scenario 4: No notification when event location differs from preferred store

Given **Customer Account** *tom.nguyen@pawplace.example* has preferred **Store** *STR-001* *PawPlace Downtown*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-in*
When admin publishes **In-Store Event** *EVT-2026-0622* *Grooming Workshop* at **Store** *STR-002* *PawPlace Westside*
Then no **In-Store Event Notification** for **In-Store Event** *EVT-2026-0622* is sent to **Customer Account** *tom.nguyen@pawplace.example*
  And **In-Store Event** *EVT-2026-0622* appears on **Store Details Page** for **Store** *STR-002*


---

## increment-8-sprint-4-content-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
stories:
  - Publish Blog Post
  - Publish Pet Care Guide
  - Unsubscribe from Marketing Emails
---

# Specification by Example — Increment 8 Sprint 4: Content publishing and unsubscribe

**Sources / context:** `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-content-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Publish Blog Post, Publish Pet Care Guide, Unsubscribe from Marketing Emails)

---

## Story: Publish Blog Post

**Story type:** store employee

**Sources / context:** marketing-engine-content-crc.md (Content, Blog Post, Blog Index, Content Author, Admin Content Area), acceptance-criteria.md (Publish Blog Post AC 1–4)

---

## Background

Given **Content Author** *jamie.wells@pawplace.example* (*Jamie Wells*) is authenticated in **Admin Content Area**
  And **Blog Index** lists no draft **Blog Post** entries visible to customers

---

### Scenario 1: Published blog post appears on blog index with metadata and own URL

When **Content Author** *Jamie Wells* creates and publishes **Blog Post** *Spring Pet Safety Tips* with **Content** summary *Keep pets safe during spring outings* and body *Check fences, watch for toxic plants…*
Then **Blog Post** *Spring Pet Safety Tips* appears on **Blog Index** with title *Spring Pet Safety Tips*, summary *Keep pets safe during spring outings*, publish date *2026-05-28*, and author *Jamie Wells*
  And the full **Blog Post** is accessible at URL */blog/spring-pet-safety-tips*

### Scenario 2: Draft blog post hidden from customers but editable in admin

When **Content Author** *Jamie Wells* saves **Blog Post** *Holiday Hours Update* as **Content** lifecycle status *draft* in **Admin Content Area**
Then **Blog Post** *Holiday Hours Update* is *not visible* on **Blog Index** to customers
  And **Blog Post** *Holiday Hours Update* remains editable and publishable from **Admin Content Area**

### Scenario 3: Published blog post edits reflect live without changing publish date

Given **Blog Post** *Spring Pet Safety Tips* is published with publish date *2026-05-28*
When **Content Author** *Jamie Wells* edits **Content** body to *Check fences, watch for toxic plants, and refresh water bowls daily*
Then the live **Blog Post** detail page at */blog/spring-pet-safety-tips* shows the updated body immediately
  And **Blog Post** *Spring Pet Safety Tips* publish date remains *2026-05-28* — unchanged unless **Content Author** explicitly updates it

### Scenario 4: Direct URL displays full published article

Given **Blog Post** *Spring Pet Safety Tips* is published with author *Jamie Wells*, publish date *2026-05-28*, and body *Check fences, watch for toxic plants…*
When a customer navigates directly to */blog/spring-pet-safety-tips*
Then the full **Blog Post** displays title *Spring Pet Safety Tips*, author *Jamie Wells*, date *2026-05-28*, and body content

---

## Story: Publish Pet Care Guide

**Story type:** store employee

**Sources / context:** marketing-engine-content-crc.md (Pet Care Guide, Guide Index, Pet Browsing Area, Product Browsing Area), acceptance-criteria.md (Publish Pet Care Guide AC 1–4)

---

## Background

Given **Content Author** *jamie.wells@pawplace.example* (*Jamie Wells*) is authenticated in **Admin Content Area**

---

### Scenario 1: Published guide appears on guide index with tag and own URL

When **Content Author** *Jamie Wells* creates and publishes **Pet Care Guide** *How to Introduce a New Cat to Your Household* with **Content** summary *Gradual room-by-room introduction* and pet type tag *cats*
Then **Pet Care Guide** *How to Introduce a New Cat to Your Household* appears on **Guide Index** with title, summary *Gradual room-by-room introduction*, pet type tag *cats*, and publish date *2026-05-29*
  And the full **Pet Care Guide** is accessible at URL */guides/introduce-new-cat*

### Scenario 2: Species tag cross-links guide from pet and product browsing areas

Given **Pet Care Guide** *How to Introduce a New Cat to Your Household* is published with pet type tag *cats*
When a customer browses **Pet Browsing Area** filtered to species *cats*
Then **Pet Care Guide** *How to Introduce a New Cat to Your Household* is linked from **Pet Browsing Area**
  And **Pet Care Guide** *How to Introduce a New Cat to Your Household* is linked from **Product Browsing Area** for cat products

### Scenario 3: Draft guide hidden from customers but editable in admin

When **Content Author** *Jamie Wells* saves **Pet Care Guide** *Best Food for Senior Dogs* as **Content** lifecycle status *draft*
Then **Pet Care Guide** *Best Food for Senior Dogs* is *not visible* on **Guide Index** to customers
  And **Pet Care Guide** *Best Food for Senior Dogs* remains editable and publishable from **Admin Content Area**

### Scenario 4: Publish blocked without species tag but draft preserved

Given **Pet Care Guide** *Best Food for Senior Dogs* has **Content** title and body but no pet type or species tag
When **Content Author** *Jamie Wells* attempts to publish **Pet Care Guide** *Best Food for Senior Dogs*
Then the system requires at least one pet type or species tag before publishing
  And **Pet Care Guide** *Best Food for Senior Dogs* remains saved as **Content** lifecycle status *draft* in **Admin Content Area** — not discarded

---

## Story: Unsubscribe from Marketing Emails

**Story type:** user

**Sources / context:** marketing-engine-content-crc.md (Unsubscribe, Unsubscribe Token, Marketing Communication, Communication Preferences, Marketing Category, Transactional Notification), acceptance-criteria.md (Unsubscribe from Marketing Emails AC 1–4)

---

## Background

Given **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) has **Communication Preferences** with **Marketing Category** *promotions* *opted-in* and *restock alerts* *opted-in*
  And **Customer Account** *tom.nguyen@pawplace.example* is on **Marketing Email List** for both categories

---

### Scenario 1: Email unsubscribe link opts out category immediately with confirmation page

Given **Customer Account** *tom.nguyen@pawplace.example* received **Marketing Communication** *Summer Sale 20% Off* for **Marketing Category** *promotions*
  And the message includes an **Unsubscribe** link backed by **Unsubscribe Token** encoding account *tom.nguyen@pawplace.example* and category *promotions*
When **Customer Account** *tom.nguyen@pawplace.example* clicks the **Unsubscribe** link in **Marketing Communication** *Summer Sale 20% Off*
Then **Unsubscribe** opts **Customer Account** *tom.nguyen@pawplace.example* out of **Marketing Category** *promotions* immediately
  And **Unsubscribe Confirmation Page** shows *you've been unsubscribed*

### Scenario 2: Preferences-page unsubscribe blocks future category sends immediately

When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *restock alerts* to *opted-out* on **Communication Preferences**
Then **Communication Preferences** persists *restock alerts* as *opted-out* immediately
  And no further **Marketing Communication** for **Marketing Category** *restock alerts* is sent to **Customer Account** *tom.nguyen@pawplace.example*

### Scenario 3: Unsubscribing all marketing categories leaves transactional notifications intact

Given **Customer Account** *tom.nguyen@pawplace.example* opts out of **Marketing Category** *promotions*, *recommendations*, *restock alerts*, and *events* via **Communication Preferences** or **Unsubscribe** links
When **Transactional Notification** *order confirmation* for **Order** *ORD-8801* is evaluated for **Customer Account** *tom.nguyen@pawplace.example*
Then **Transactional Notification** *order confirmation* is *delivered* per **Notification Preferences**
  And **Notification Preferences** transactional settings are *unchanged* by marketing **Unsubscribe**

### Scenario 4: Repeat unsubscribe link is idempotent with same confirmation

Given **Customer Account** *tom.nguyen@pawplace.example* already opted out of **Marketing Category** *promotions*
  And **Unsubscribe Token** for category *promotions* is still valid in a prior **Marketing Communication**
When **Customer Account** *tom.nguyen@pawplace.example* clicks the **Unsubscribe** link again
Then **Unsubscribe Confirmation Page** still shows *you've been unsubscribed*
  And no error or confusing message is displayed

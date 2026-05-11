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

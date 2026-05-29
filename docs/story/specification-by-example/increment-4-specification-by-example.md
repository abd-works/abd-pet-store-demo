---
state: specification-by-example
increment_scope: Increment 4 — Returning customers
specification_refresh: Run 5 slot 103
---

# Specification by Example — Increment 4: Returning customers — accounts, history, reorder

**Refresh:** Run 5 slot 103 — aligned to `docs/domain/ubiquitous-language.md`, `docs/domain/crc.md`, `docs/domain/domain.json`, and `docs/story/acceptance-criteria/increment-4-acceptance-criteria.md`. *Guest checkout* coexists with authenticated checkout; *StripeWave* sole active *payment vendor*; mandatory *email verification* gates account-only features; PayNova, VaultPay, *customer pet* CRUD, *communication preferences* UI, express/same-day delivery, and *return* deferred.

---

## Story: `Register Account`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Scenario 1: `Registration form collects email and password with requirements visible`

When the customer opens the registration screen
Then the form collects **email address** and **password** (with confirmation)
And password requirements are shown clearly before submission: *minimum 8 characters*, *at least one uppercase letter*, *at least one digit*, *at least one special character*

### Scenario 2: `Valid registration creates unverified customer account and triggers email verification`

Given no **Customer Account** exists for **email address** *jane.doe@example.com*
When the customer submits **email address** *jane.doe@example.com* and password *Str0ngP@ss!* with matching confirmation
Then a **Customer Account** is created for *Jane Doe* with **account verification status** *unverified*
And the system triggers **Email Verification** to *jane.doe@example.com*
And the customer sees confirmation screen *check your email to verify*

### Scenario 3: `Duplicate email rejected without revealing verification status`

Given a **Customer Account** exists with **email address** *existing@example.com* and **account verification status** *verified*
When the customer submits **email address** *existing@example.com* on the registration form
Then the form shows error *This email is already in use*
And a *Log In instead* link is displayed
And the error does not reveal whether the existing **account verification status** is *verified* or *unverified*

### Scenario Outline 1: `Password failing requirements blocks account creation`

Given the registration form is open
When the customer submits **email address** *new.user@example.com* with password {attempted_password}
Then the form shows which requirements are unmet: {unmet_requirement}
And no **Customer Account** is created

#### Examples:

| scenario | attempted_password | unmet_requirement |
|---|---|---|
| 1 | short | minimum 8 characters |
| 2 | nouppercase1! | at least one uppercase letter |
| 3 | NoDigits! | at least one digit |

---

## Story: `Send Email Verification`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Customer Account:

| scenario | email_address | account_verification_status |
|---|---|---|
| 1 | jane.doe@example.com | unverified |

### Verification Link:

| scenario | email_address | unique_link_token | expiry_time | one_time_use_flag |
|---|---|---|---|---|
| 1 | jane.doe@example.com | vlink-abc123 | 2025-05-25T12:00:00Z | true |

---

### Scenario 1: `Verification email sent with unique time-limited link on account creation`

Given a **Customer Account** was just created with **email address** *jane.doe@example.com* and **account verification status** *unverified*
When the system processes **Email Verification**
Then a **Notification** is sent to *jane.doe@example.com* with **notification channel** *email*
And the **Notification** body contains a **Verification Link** that is unique and time-limited

### Scenario 2: `Expired verification link shows message and resend action`

Given a **Customer Account** with **email address** *jane.doe@example.com*
And a **Verification Link** with **expiry time** *2025-05-23T12:00:00Z* was issued more than 24 hours ago
When the customer clicks the expired **Verification Link**
Then the system shows message *This verification link has expired*
And a *resend verification* action is offered

### Scenario 3: `Email delivery unavailable queues verification for retry`

Given a **Customer Account** with **email address** *jane.doe@example.com* triggers **Email Verification**
And the email delivery system is temporarily unavailable
When the system attempts to send the verification email
Then the **Notification** is queued with **delivery status** *queued* for retry
And the registration confirmation screen tells the customer *expect the email shortly*

---

## Story: `Verify Email Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Scenario 1: `Valid verification link transitions account to verified`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *unverified*
And a valid, non-expired **Verification Link** for that **Customer Account**
When the customer clicks the **Verification Link**
Then the **Customer Account** **account verification status** becomes *verified*
And the customer is redirected to confirmation page *you're verified* with prompt *log in to your account*

### Scenario 2: `Already-used verification link is idempotent`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *verified*
And the **Verification Link** has **one-time use flag** *used*
When the customer clicks the used **Verification Link**
Then the system shows message *already verified* with a *login* link
And the **Customer Account** **account verification status** remains *verified*

### Scenario 3: `Expired verification link offers resend`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *unverified*
And the **Verification Link** has expired
When the customer clicks the expired **Verification Link**
Then the system shows message *link expired*
And a *resend verification* action is displayed

---

## Story: `Log In`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Customer Account:

| scenario | email_address | account_verification_status |
|---|---|---|
| 1 | jane.doe@example.com | verified |
| 2 | tom.reed@example.com | unverified |

### Product:

| scenario | sku | product_name |
|---|---|---|
| 1 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg |
| 2 | SKU-CAT-TOY-05 | Feather Wand Cat Toy |

---

### Scenario 1: `Valid credentials create customer session and redirect`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *verified*
When the customer submits valid credentials on the login screen
Then a **Customer Session** is created for that **Customer Account**
And the customer is redirected to the account dashboard

### Scenario 2: `Invalid credentials show generic error`

Given a **Customer Account** with **email address** *jane.doe@example.com*
When the customer submits **email address** *jane.doe@example.com* and an incorrect password
Then the login screen shows error *invalid email or password*
And the error does not specify which field is wrong

### Scenario 3: `Unverified account blocked from customer session with account-only access`

Given a **Customer Account** with **email address** *tom.reed@example.com* and **account verification status** *unverified*
When the customer submits valid credentials for that **Customer Account**
Then the system shows message *please verify your email first*
And a *resend verification* option is offered
And no **Customer Session** with account-only feature access is created

### Scenario 4: `Guest shopping cart merges into account cart on login`

Given a **Customer Account** with **email address** *jane.doe@example.com* has a **Shopping Cart** containing **Product** *SKU-CAT-TOY-05* with quantity *1*
And a guest **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *2*
When the customer logs into the **Customer Account**
Then the guest **Shopping Cart** merges into the account **Shopping Cart**
And **Product** *SKU-DOG-FOOD-01* has quantity *2* in the merged **Shopping Cart**
And **Product** *SKU-CAT-TOY-05* has quantity *1* in the merged **Shopping Cart**

### Scenario 5: `Merge sums quantities when both carts contain same product`

Given a **Customer Account** **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *1*
And a guest **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *2*
When the customer logs into the **Customer Account**
Then **Product** *SKU-DOG-FOOD-01* has quantity *3* in the merged **Shopping Cart**

---

## Story: `Log Out`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Scenario 1: `Logout invalidates current customer session only`

Given a **Customer Account** with **email address** *jane.doe@example.com* has an active **Customer Session** on device *mobile phone*
And an active **Customer Session** on device *laptop*
When the customer selects *Log Out* on device *mobile phone*
Then the **Customer Session** on device *mobile phone* is invalidated
And the customer is redirected to the home page in a guest state
And the **Customer Session** on device *laptop* remains active

### Scenario 2: `Log out everywhere invalidates all customer sessions`

Given a **Customer Account** with active **Customer Session** on devices *mobile phone* and *laptop*
When the customer selects *Log out everywhere*
Then all **Customer Session** for that **Customer Account** are invalidated
And the customer must re-authenticate on every device

---

## Story: `Reset Password`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Scenario Outline 1: `Reset request shows same confirmation regardless of account existence`

When the customer requests password reset for **email address** {email_address}
Then the customer sees confirmation message *check your email*
And a password reset link is sent only when a **Customer Account** exists for {email_address} ({reset_link_sent})

#### Examples:

| scenario | email_address | reset_link_sent |
|---|---|---|
| 1 | jane.doe@example.com | true |
| 2 | unknown@example.com | false |

### Scenario 2: `Valid reset link opens set-new-password form`

Given a **Customer Account** with **email address** *jane.doe@example.com*
And a valid, non-expired password reset **Verification Link**
When the customer clicks the reset link
Then the customer is taken to a *set new password* form
And the new password must meet the same requirements as registration

### Scenario 3: `Password update invalidates all customer sessions`

Given a **Customer Account** with **email address** *jane.doe@example.com* has active **Customer Session** on devices *mobile phone* and *laptop*
When the customer submits new password *NewStr0ngP@ss!* through the reset form
Then the **Customer Account** password is updated
And all **Customer Session** on all devices are invalidated
And the customer must log in again on each device

### Scenario Outline 2: `Expired or used reset link rejected`

Given a password reset **Verification Link** for **Customer Account** *jane.doe@example.com* with status {link_status}
When the customer clicks the reset link
Then the system shows message {expected_message}
And a {expected_action} action is offered
And the **Customer Account** password remains unchanged

#### Examples:

| scenario | link_status | expected_message | expected_action |
|---|---|---|---|
| 1 | expired | link expired | Request new reset |
| 2 | used | link already used | Request new reset |

---

## Story: `Maintain Session Across Devices`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Scenario 1: `Login on new device creates additional customer session`

Given a **Customer Account** with **email address** *jane.doe@example.com* has an active **Customer Session** on device *laptop*
When the customer logs in on device *tablet*
Then a new **Customer Session** is created for device *tablet*
And the **Customer Session** on device *laptop* remains active

### Scenario Outline 1: `Session expiry redirects to login but preserves shopping cart`

Given a **Customer Account** with **email address** *jane.doe@example.com* has a **Shopping Cart** containing *3* **Cart Item** entries
And the **Customer Session** **session token** has expired due to {expiry_reason}
When the session is evaluated
Then the customer is redirected to the login screen
And the **Shopping Cart** tied to the **Customer Account** retains all *3* **Cart Item** entries

#### Examples:

| scenario | expiry_reason |
|---|---|
| 1 | inactivity timeout |
| 2 | max session duration |

### Scenario 2: `Password reset invalidates all customer sessions`

Given a **Customer Account** has active **Customer Session** on devices *laptop* and *tablet*
When the customer changes password through **Reset Password**
Then all **Customer Session** on all devices are invalidated
And the customer must re-authenticate on each device

---

## Story: `Save Delivery Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Saved Address:

| scenario | address_label | address_line_one | city | postcode | country | default_shipping_flag |
|---|---|---|---|---|---|---|
| 1 | Home | 42 Oak Lane | Bristol | BS1 4QT | United Kingdom | true |
| 2 | Work | 10 High Street | London | E1 6AN | United Kingdom | false |

---

### Scenario 1: `Checkout offers save address option for logged-in customer`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* is completing checkout
And the customer enters **Shipping Address** with **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*, **country** *United Kingdom*
When the customer accepts *save this address for future orders*
Then a **Saved Address** is stored in the **Address Book** for that **Customer Account**
And the **Saved Address** has **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*

### Scenario 2: `First saved address becomes default address automatically`

Given a **Customer Account** with **email address** *jane.doe@example.com* has no **Saved Address** entries in the **Address Book**
When the customer saves **Shipping Address** with **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*
Then the **Saved Address** is created with **default shipping flag** *true*
And that **Saved Address** is the **Default Address** for future checkouts

### Scenario 3: `Additional saved address does not replace existing entries`

Given a **Customer Account** **Address Book** already contains **Saved Address** *Home* at *42 Oak Lane, Bristol BS1 4QT* with **default shipping flag** *true*
When the customer saves a new **Saved Address** with **address line one** *10 High Street*, **city** *London*, **postcode** *E1 6AN*
Then the **Address Book** contains both **Saved Address** entries
And the new **Saved Address** has **default shipping flag** *false*
And account settings **Address Book** shows the new entry with a *set as default* option

---

## Story: `Manage Saved Addresses`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Saved Address:

| scenario | address_label | address_line_one | city | postcode | country | default_shipping_flag |
|---|---|---|---|---|---|---|
| 1 | Home | 42 Oak Lane | Bristol | BS1 4QT | United Kingdom | true |
| 2 | Work | 10 High Street | London | E1 6AN | United Kingdom | false |

---

### Scenario 1: `Address book lists all saved addresses with default indicated`

Given a **Customer Account** with **email address** *jane.doe@example.com* has **Address Book** containing two **Saved Address** entries
When the customer opens the **Address Book** from account settings
Then all **Saved Address** entries are listed with full details
And the **Saved Address** *Home* at *42 Oak Lane* is visually indicated as the **Default Address**

### Scenario 2: `Edited saved address persists for future checkouts`

Given a **Saved Address** with **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*
When the customer edits **city** to *Bath* and saves the **Saved Address**
Then the **Saved Address** shows **city** *Bath*
And future checkouts using that **Saved Address** reflect **city** *Bath*

### Scenario 3: `Deleting default saved address prompts new default selection`

Given a **Customer Account** **Address Book** has **Saved Address** *Home* as **Default Address**
And **Saved Address** *Work* at *10 High Street, London E1 6AN* also exists
When the customer deletes **Saved Address** *Home*
Then **Saved Address** *Home* is removed from the **Address Book**
And the customer is prompted to select a new **Default Address**
And **Saved Address** *Work* is offered as the new **Default Address**

### Scenario 4: `Setting new default address demotes previous default`

Given **Saved Address** *Home* has **default shipping flag** *true*
And **Saved Address** *Work* has **default shipping flag** *false*
When the customer sets **Saved Address** *Work* as **Default Address**
Then **Saved Address** *Work* has **default shipping flag** *true*
And **Saved Address** *Home* has **default shipping flag** *false*
And future checkouts pre-select **Saved Address** *Work*

---

## Story: `Save Payment Method`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Saved Payment Method:

| scenario | vendor_token_reference | last_four_digits | card_brand | expiry_month | expiry_year | default_payment_method_flag |
|---|---|---|---|---|---|---|
| 1 | tok_sw_4242 | 4242 | Visa | 12 | 2027 | true |

---

### Scenario 1: `Checkout offers save payment method via StripeWave token`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* completes **Payment** through **StripeWave**
When the customer accepts *save this payment method for future orders*
Then a **Saved Payment Method** is created with **vendor-token reference** *tok_sw_4242*
And raw card numbers are not stored on the **Customer Account**

### Scenario 2: `Saved payment method stores display metadata only`

Given the customer saves a payment method during checkout via **StripeWave**
When the **Saved Payment Method** is persisted
Then the **Customer Account** stores **last four digits** *4242*, **card brand** *Visa*, **expiry month** *12*, and **expiry year** *2027* for display
And future **Payment** uses the **vendor-token reference** without re-entering full card details

### Scenario 3: `Second saved payment method retains first as default`

Given a **Customer Account** already has **Saved Payment Method** ending *4242* as **Default Payment Method**
When the customer saves a second **Saved Payment Method** ending *5555* via **StripeWave**
Then both **Saved Payment Method** entries appear in account settings
And the first **Saved Payment Method** ending *4242* remains the **Default Payment Method**

---

## Story: `Manage Saved Payment Methods`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Saved Payment Method:

| scenario | vendor_token_reference | last_four_digits | card_brand | expiry_month | expiry_year | default_payment_method_flag |
|---|---|---|---|---|---|---|
| 1 | tok_sw_4242 | 4242 | Visa | 12 | 2027 | true |
| 2 | tok_sw_5555 | 5555 | Mastercard | 06 | 2028 | false |

---

### Scenario 1: `Saved payment methods listed with default indicated`

Given a **Customer Account** with two **Saved Payment Method** entries
When the customer opens saved payment methods from account settings
Then all **Saved Payment Method** entries show **last four digits**, **card brand**, and expiry
And **Saved Payment Method** ending *4242* is visually indicated as the **Default Payment Method**

### Scenario 2: `Removing default payment method prompts new default`

Given **Saved Payment Method** ending *4242* is the **Default Payment Method**
And **Saved Payment Method** ending *5555* also exists
When the customer removes **Saved Payment Method** ending *4242*
Then the **vendor-token reference** for that method is deleted
And the method no longer appears at checkout
And the customer is prompted to select a new **Default Payment Method**
And **Saved Payment Method** ending *5555* is offered as the new default

### Scenario 3: `Setting new default payment method demotes previous default`

Given **Saved Payment Method** ending *4242* has **default payment method flag** *true*
When the customer sets **Saved Payment Method** ending *5555* as **Default Payment Method**
Then **Saved Payment Method** ending *5555* has **default payment method flag** *true*
And **Saved Payment Method** ending *4242* has **default payment method flag** *false*
And future checkouts pre-select **Saved Payment Method** ending *5555*

---

## Story: `Select Saved Address at Checkout`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

Background:
  Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
  And the **Shopping Cart** for that **Customer Account** has items ready for checkout

### Saved Address:

| scenario | address_label | address_line_one | city | postcode | default_shipping_flag |
|---|---|---|---|---|---|
| 1 | Home | 42 Oak Lane | Bristol | BS1 4QT | true |
| 2 | Work | 10 High Street | London | E1 6AN | false |

---

### Scenario 1: `Saved addresses shown with default pre-selected at shipping step`

When the customer reaches the shipping step during checkout
Then all **Saved Address** entries from the **Address Book** are shown for selection
And **Saved Address** *Home* with **default shipping flag** *true* is pre-selected

### Scenario 2: `Selecting saved address auto-fills shipping fields and advances checkout`

When the customer selects **Saved Address** *Work* with **address line one** *10 High Street*, **city** *London*, **postcode** *E1 6AN*
Then the **Shipping Address** fields are auto-filled with *10 High Street, London, E1 6AN*
And checkout advances to the next step without manual entry

### Scenario 3: `Use different address reveals manual entry and save option`

When the customer chooses *use a different address*
Then manual **Shipping Address** entry fields are displayed
And a *save this address* checkbox is available to add the new address to the **Address Book** when checked

### Scenario 4: `Guest checkout shows manual address entry only`

Given a guest customer with a **Shopping Cart** is not logged in
When the guest reaches the shipping step during **Guest Checkout**
Then no **Address Book** selection is shown — only manual **Shipping Address** entry
And a prompt *log in or create an account to save addresses* is displayed
And **Guest Checkout** proceeds without requiring a **Customer Account**

---

## Story: `Select Saved Payment Method at Checkout`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

Background:
  Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
  And the **Shopping Cart** for that **Customer Account** has items ready for checkout

### Saved Payment Method:

| scenario | vendor_token_reference | last_four_digits | card_brand | expiry_month | expiry_year | default_payment_method_flag |
|---|---|---|---|---|---|---|
| 1 | tok_sw_4242 | 4242 | Visa | 12 | 2027 | true |
| 2 | tok_sw_5555 | 5555 | Mastercard | 06 | 2028 | false |

---

### Scenario 1: `Saved payment methods shown with default pre-selected`

When the customer reaches the payment step during checkout
Then all **Saved Payment Method** entries are shown for selection
And **Saved Payment Method** ending *4242* is pre-selected as the **Default Payment Method**

### Scenario 2: `Selecting saved payment method charges via vendor token`

When the customer selects **Saved Payment Method** with **vendor-token reference** *tok_sw_4242*
Then **Payment** proceeds through **StripeWave** using the stored token — no card re-entry required
And the customer sees confirmation **last four digits** *4242* and **card brand** *Visa*

### Scenario 3: `Use different payment method reveals manual entry and save option`

When the customer chooses *use a different payment method*
Then manual card entry for **StripeWave** is displayed
And a *save this payment method* checkbox stores a new **Saved Payment Method** when checked

### Scenario 4: `Expired vendor token marked and not silently charged`

Given **Saved Payment Method** with **vendor-token reference** *tok_sw_expired* has **expiry month** *01* and **expiry year** *2024*
When the customer reaches the payment step
Then that **Saved Payment Method** is marked *expired*
And remaining valid **Saved Payment Method** entries and manual card entry are displayed as alternatives
And the expired token is not used for a **Payment** charge attempt

---

## Story: `View Order History`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | order_total | guest_email_snapshot |
|---|---|---|---|---|---|
| 1 | ORD-1001 | 2025-01-15 | delivered | £45.99 | — |
| 2 | ORD-1002 | 2025-03-20 | shipped | £82.50 | — |
| 3 | ORD-0999 | 2025-02-10 | delivered | £34.99 | sarah.jones@example.com |

### Order Line Item:

| scenario | order_number | sku_snapshot | product_name_snapshot | quantity | unit_price_snapshot |
|---|---|---|---|---|---|
| 1 | ORD-1001 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg | 1 | £29.99 |
| 2 | ORD-1001 | SKU-LEASH-03 | Leather Retractable Lead | 1 | £16.00 |
| 3 | ORD-1002 | SKU-CAT-TOY-05 | Feather Wand Cat Toy | 3 | £7.50 |

---

### Scenario 1: `Order history lists orders most recent first`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* has **Order** *ORD-1001* and **Order** *ORD-1002*
When the customer opens **Order History**
Then **Order** *ORD-1002* appears before **Order** *ORD-1001*
And each row shows **order number**, **order date**, condensed **Order Line Item** items, **order total**, and **order status**

### Scenario 2: `Order detail shows full snapshot including tracking`

Given **Order** *ORD-1002* has **order status** *shipped*
When the customer selects **Order** *ORD-1002* from **Order History**
Then full order detail opens with all **Order Line Item** entries, **Shipping Address** snapshot, **Billing Address** snapshot, **Delivery Option**, masked **Saved Payment Method**, and **Tracking Number** *RM-1Z999AA10123456784*

### Scenario 3: `Empty order history shows start shopping prompt`

Given a logged-in **Customer Account** with **email address** *new.customer@example.com* has no **Order** entries
When the customer opens **Order History**
Then an empty state shows prompt *start shopping*

### Scenario 4: `Guest order retroactively associated when email matches new account`

Given a **Guest Checkout** **Order** *ORD-0999* was placed with **Guest Email** *sarah.jones@example.com*
When a **Customer Account** is created with **email address** *sarah.jones@example.com*
Then **Order** *ORD-0999* is retroactively associated with that **Customer Account**
And **Order** *ORD-0999* appears in **Order History**

---

## Story: `Manage Wishlist`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Product:

| scenario | sku | product_name |
|---|---|---|
| 1 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg |
| 2 | SKU-CAT-TOY-05 | Feather Wand Cat Toy |

### Stock Availability:

| scenario | sku | available_to_sell_quantity |
|---|---|---|
| 1 | SKU-DOG-FOOD-01 | 15 |
| 2 | SKU-CAT-TOY-05 | 0 |

---

### Scenario 1: `Add to wishlist from product details page`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* and verified **account verification status**
And **Product** *SKU-DOG-FOOD-01* is not on the **Wishlist**
When the customer selects *Add to Wishlist* on the **Product** details page
Then **Product** *SKU-DOG-FOOD-01* is added to the **Wishlist** as a **Wishlist Item**
And the control changes to *Remove from Wishlist*

### Scenario 2: `Wishlist shows product details and stock availability`

Given the **Wishlist** contains **Wishlist Item** for **Product** *SKU-DOG-FOOD-01* and **Product** *SKU-CAT-TOY-05*
And **Stock Availability** for *SKU-DOG-FOOD-01* has **available to sell quantity** *15*
And **Stock Availability** for *SKU-CAT-TOY-05* has **available to sell quantity** *0*
When the customer opens the **Wishlist**
Then **Wishlist Item** for *SKU-DOG-FOOD-01* shows product name, image, price, and *In Stock*
And **Wishlist Item** for *SKU-CAT-TOY-05* shows *Out of Stock*

### Scenario 3: `Add to cart from wishlist leaves item on wishlist`

Given the **Wishlist** contains **Wishlist Item** for **Product** *SKU-DOG-FOOD-01*
When the customer selects *Add to Cart* from the **Wishlist Item**
Then **Product** *SKU-DOG-FOOD-01* is added to the **Shopping Cart**
And **Product** *SKU-DOG-FOOD-01* remains on the **Wishlist**

### Scenario 4: `Remove wishlist item resets product page control`

Given the **Wishlist** contains **Wishlist Item** for **Product** *SKU-DOG-FOOD-01*
When the customer removes the **Wishlist Item**
Then **Product** *SKU-DOG-FOOD-01* is removed from the **Wishlist**
And the *Add to Wishlist* control on the **Product** details page returns to its default state

### Scenario 5: `Guest add to wishlist shows dismissible login prompt`

Given a guest customer is viewing **Product** *SKU-DOG-FOOD-01*
When the guest selects *Add to Wishlist*
Then a prompt *log in or register* explains that **Wishlist** requires a verified **Customer Account**
And the customer remains on the **Product** details page
And the prompt is dismissible so browsing continues

---

## Story: `Reorder Previous Purchase`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, increment-4-acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date |
|---|---|---|
| 1 | ORD-1001 | 2025-01-15 |

### Order Line Item:

| scenario | order_number | sku_snapshot | product_name_snapshot | quantity |
|---|---|---|---|---|
| 1 | ORD-1001 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg | 2 |
| 2 | ORD-1001 | SKU-LEASH-03 | Leather Retractable Lead | 1 |

### Stock Availability:

| scenario | sku_snapshot | available_to_sell_quantity | product_active |
|---|---|---|---|
| 1 | SKU-DOG-FOOD-01 | 10 | true |
| 2 | SKU-LEASH-03 | 0 | true |
| 3 | SKU-DISCONTINUED | 0 | false |

---

### Scenario 1: `Reorder adds all order line items to shopping cart`

Given a logged-in **Customer Account** has **Order** *ORD-1001* in **Order History**
And all **Order Line Item** **Product** entries are active and in stock
When the customer selects *Reorder* on **Order** *ORD-1001*
Then **Reorder** adds **Product** *SKU-DOG-FOOD-01* with quantity *2* and **Product** *SKU-LEASH-03* with quantity *1* to the **Shopping Cart**
And the customer is taken to the **Shopping Cart** to review before checkout

### Scenario 2: `Reorder skips delisted product with partial success`

Given **Order** *ORD-1001* contains **Order Line Item** for **Product** *SKU-DISCONTINUED*
And **Product** *SKU-DISCONTINUED* is no longer active in the **Product Catalog**
When the customer selects *Reorder* on **Order** *ORD-1001*
Then available **Product** entries are added to the **Shopping Cart**
And a clear message lists *SKU-DISCONTINUED* as unavailable because *product delisted*
And partial **Reorder** succeeds — available items are not blocked

### Scenario 3: `Reorder adds out-of-stock product with warning and options`

Given **Order** *ORD-1001* contains **Order Line Item** for **Product** *SKU-LEASH-03*
And **Stock Availability** for *SKU-LEASH-03* has **available to sell quantity** *0*
When the customer selects *Reorder* on **Order** *ORD-1001*
Then **Product** *SKU-LEASH-03* is added to the **Shopping Cart** with a **Stock Availability** warning
And *proceed anyway* and *remove* options are shown on that **Cart Item**

### Scenario 4: `Reorder merges quantities into existing shopping cart`

Given a **Customer Account** **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *1*
And **Order** *ORD-1001* contains **Order Line Item** for **Product** *SKU-DOG-FOOD-01* with quantity *2*
When the customer selects *Reorder* on **Order** *ORD-1001*
Then **Product** *SKU-DOG-FOOD-01* in the **Shopping Cart** has quantity *3*

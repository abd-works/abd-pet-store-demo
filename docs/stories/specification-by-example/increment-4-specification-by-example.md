# Specification by Example — Increment 4: Returning customers — accounts, history, reorder  

**Template:** Scenario Outline (parameterized with Examples tables)  

---  

## Story: `Register Account`  

### CustomerAccount (Given — above scenarios):  
| customer_account_id | emailAddress          | passwordHash | accountStatus |  
|---------------------|-----------------------|--------------|---------------|  
| CUST-001            | jane@example.com      | hashed_valid | Unverified    |  
| CUST-002            | existing@example.com  | hashed_valid | Verified      |  

---  

### Scenario Outline: Account created with unverified status  

Given the **Registration Form** is open  
When the customer submits **emailAddress** *{emailAddress}* and a valid password *{passwordHash}*  
Then a **CustomerAccount** *{customer_account_id}* is created with **accountStatus** *{accountStatus}*  
  And the system triggers *Send Email Verification* to *{emailAddress}*  
  And the customer sees a *{expected_confirmation}* confirmation screen  

### CustomerAccount (Then — below scenario):  
| scenario | customer_account_id | emailAddress     | passwordHash | accountStatus | expected_confirmation        |  
|----------|---------------------|------------------|--------------|---------------|------------------------------|  
| 1        | CUST-001            | jane@example.com | hashed_valid | Unverified    | check your email to verify   |  

---  

### Scenario Outline: Registration rejected for duplicate email  

Given a **CustomerAccount** *{existing_account_id}* exists with **emailAddress** *{emailAddress}*  
When the customer submits **emailAddress** *{emailAddress}* on the **Registration Form**  
Then the form shows an error: *{expected_error}*  
  And a *{expected_link}* link is offered (*{login_link_offered}*)  
  And the error message is generic regardless of **accountStatus** (*{error_is_generic}*)  

### CustomerAccount (Given — above / Then — below):  
| scenario | existing_account_id | emailAddress         | accountStatus | expected_error       | expected_link  | login_link_offered | error_is_generic |  
|----------|---------------------|----------------------|---------------|----------------------|----------------|--------------------|------------------|  
| 1        | CUST-002            | existing@example.com | Verified      | email already in use | Log In instead | true               | true             |  

---  

### Scenario Outline: Registration rejected for invalid password  

Given the **Registration Form** is open  
When the customer submits **emailAddress** *{emailAddress}* with password *{attempted_password}*  
Then the form shows which password requirements are unmet: *{unmet_requirement}*  
  And the **Registration Form** remains displayed for correction (*{form_preserved}*)  

### Registration attempt (When — below / Then — below):  
| scenario | emailAddress    | attempted_password | unmet_requirement             | form_preserved |  
|----------|-----------------|--------------------|------------------------------ |----------------|  
| 1        | new@example.com | short              | minimum 8 characters          | true           |  
| 2        | new@example.com | nouppercase1       | at least one uppercase letter | true           |  
| 3        | new@example.com | NoDigits!          | at least one digit            | true           |  

---  

## Story: `Send Email Verification`  

### Scenario Outline: Verification email sent on account creation  

Given a **CustomerAccount** *{customer_account_id}* has just been created with **emailAddress** *{emailAddress}*  
When the system processes the *Send Email Verification* trigger  
Then a **Notification** is sent to *{emailAddress}* with **notificationChannel** *{notification_channel}*  
  And the notification contains a unique, time-limited *Verification Link* (*{verification_link_included}*)  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | emailAddress     | accountStatus | notification_channel | verification_link_included |  
|----------|---------------------|------------------|---------------|----------------------|----------------------------|  
| 1        | CUST-001            | jane@example.com | Unverified    | email                | true                       |  

---  

### Scenario Outline: Verification link expired  

Given a **CustomerAccount** *{customer_account_id}* with **emailAddress** *{emailAddress}*  
  And a *Verification Link* issued *{hours_since_issued}* hours ago  
When the customer clicks the expired *Verification Link*  
Then the system shows a *{expected_message}* message  
  And offers a *{expected_action}* action (*{resend_offered}*)  

### Verification attempt (When — below / Then — below):  
| scenario | customer_account_id | emailAddress     | hours_since_issued | expected_message | expected_action     | resend_offered |  
|----------|---------------------|------------------|--------------------|------------------|---------------------|----------------|  
| 1        | CUST-001            | jane@example.com | 25                 | link expired     | resend verification | true           |  

---  

### Scenario Outline: Email delivery system unavailable — queued for retry  

Given a **CustomerAccount** *{customer_account_id}* triggers *Send Email Verification*  
  And the email delivery system is temporarily unavailable  
When the system attempts to send the verification email  
Then the verification email is queued for retry (*{email_queued}*)  
  And the registration confirmation screen tells the customer *{expected_confirmation}* (*{confirmation_shown}*)  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | emailAddress     | email_queued | expected_confirmation    | confirmation_shown |  
|----------|---------------------|------------------|--------------|--------------------------|---------------------|  
| 1        | CUST-001            | jane@example.com | true         | expect the email shortly | true                |  

---  

## Story: `Verify Email Address`  

### Scenario Outline: Email successfully verified  

Given a **CustomerAccount** *{customer_account_id}* with **accountStatus** *{initial_status}*  
  And a valid, non-expired *Verification Link* for *{customer_account_id}*  
When the customer clicks the *Verification Link*  
Then the **CustomerAccount** *{customer_account_id}* transitions to **accountStatus** *{final_status}*  
  And the customer is redirected to a *{expected_page}* confirmation page with a *{expected_prompt}*  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | emailAddress     | initial_status | final_status | expected_page   | expected_prompt |  
|----------|---------------------|------------------|----------------|--------------|-----------------|-----------------|  
| 1        | CUST-001            | jane@example.com | Unverified     | Verified     | you're verified | login prompt    |  

---  

### Scenario Outline: Already-used verification link handled idempotently  

Given a **CustomerAccount** *{customer_account_id}* with **accountStatus** *{accountStatus}*  
  And the *Verification Link* has already been used  
When the customer clicks the used *Verification Link*  
Then the system shows *{expected_message}* with a *{expected_link}*  
  And the **CustomerAccount** retains **accountStatus** *{accountStatus}* (*{account_unchanged}*)  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | emailAddress     | accountStatus | expected_message | expected_link | account_unchanged |  
|----------|---------------------|------------------|---------------|------------------|---------------|-------------------|  
| 1        | CUST-001            | jane@example.com | Verified      | already verified | login link    | true              |  

---  

### Scenario Outline: Expired verification link prompts resend  

Given a **CustomerAccount** *{customer_account_id}* with **accountStatus** *{accountStatus}*  
  And the *Verification Link* has expired  
When the customer clicks the expired *Verification Link*  
Then the system shows a *{expected_message}* message with a *{expected_action}* action  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | emailAddress     | accountStatus | expected_message | expected_action     |  
|----------|---------------------|------------------|---------------|------------------|---------------------|  
| 1        | CUST-001            | jane@example.com | Unverified    | link expired     | resend verification |  

---  

## Story: `Log In`  

### CustomerAccount (Given — above scenarios):  
| customer_account_id | emailAddress         | username     | passwordHash | accountStatus |  
|---------------------|----------------------|--------------|--------------|---------------|  
| CUST-001            | jane@example.com     | janedoe      | hashed_pw1   | Verified      |  
| CUST-002            | unverified@test.com  | unverified1  | hashed_pw2   | Unverified    |  

---  

### Scenario Outline: Session created on valid login  

Given a **CustomerAccount** *{customer_account_id}* with **accountStatus** *{accountStatus}*  
  And **username** *{username}* and **passwordHash** matching *{password_input}*  
When the customer submits *{username}* and *{password_input}* on the *Login Form*  
Then a *Session* is created for **CustomerAccount** *{customer_account_id}* (*{session_created}*)  
  And the customer is redirected to *{expected_redirect}*  

### Login attempt (When — below / Then — below):  
| scenario | customer_account_id | username | password_input | accountStatus | session_created | expected_redirect |  
|----------|---------------------|----------|----------------|---------------|-----------------|-------------------|  
| 1        | CUST-001            | janedoe  | correct_pw     | Verified      | true            | account dashboard |  

---  

### Scenario Outline: Login rejected for invalid credentials  

Given a **CustomerAccount** *{customer_account_id}* with **username** *{username}*  
When the customer submits *{username}* and an incorrect password *{password_input}*  
Then the *Login Form* shows error *{expected_error}*  
  And both email and password fields remain editable for correction (*{fields_editable}*)  

### Login attempt (When — below / Then — below):  
| scenario | customer_account_id | username | password_input | expected_error            | fields_editable |  
|----------|---------------------|----------|----------------|---------------------------|-----------------|  
| 1        | CUST-001            | janedoe  | wrong_pw       | invalid email or password | true            |  

---  

### Scenario Outline: Login blocked for unverified account  

Given a **CustomerAccount** *{customer_account_id}* with **accountStatus** *{accountStatus}*  
When the customer submits valid credentials for *{customer_account_id}*  
Then the system shows a *{expected_message}* message  
  And a *{expected_action}* option is offered (*{action_offered}*)  
  And the customer remains on the *Login Form* (*{stays_on_form}*)  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | accountStatus | expected_message               | expected_action     | action_offered | stays_on_form |  
|----------|---------------------|---------------|--------------------------------|---------------------|----------------|---------------|  
| 1        | CUST-002            | Unverified    | please verify your email first | resend verification | true           | true          |  

---  

### Scenario Outline: Guest cart merged on login  

Given a **CustomerAccount** *{customer_account_id}* with an existing **ShoppingCart** containing **Product** *{existing_product_sku}* quantity *{existing_qty}*  
  And the guest session has a **ShoppingCart** containing **Product** *{guest_product_sku}* quantity *{guest_qty}*  
When the customer logs into **CustomerAccount** *{customer_account_id}*  
Then the guest cart is merged into the customer's **ShoppingCart**  
  And **Product** *{merged_product_sku}* has quantity *{merged_qty}*  

### ShoppingCart merge (Given — above / Then — below):  
| scenario | customer_account_id | existing_product_sku | existing_qty | guest_product_sku | guest_qty | merged_product_sku | merged_qty |  
|----------|---------------------|----------------------|--------------|-------------------|-----------|--------------------|------------|  
| 1        | CUST-001            | SKU-DOG-FOOD-01      | 1            | SKU-DOG-FOOD-01   | 2         | SKU-DOG-FOOD-01    | 3          |  
| 2        | CUST-001            | SKU-CAT-TOY-05       | 1            | SKU-LEASH-03      | 1         | SKU-CAT-TOY-05     | 1          |  

---  

## Story: `Log Out`  

### Scenario Outline: Session invalidated on logout  

Given a **CustomerAccount** *{customer_account_id}* with an active *Session* on device *{device}*  
When the customer selects *{logout_action}* on device *{device}*  
Then the *Session* on *{device}* is invalidated (*{session_status_after}*)  
  And the customer is redirected to the *{expected_redirect}* in a guest state  
  And sessions on other devices remain active (*{other_sessions_active}*)  

### Session (Given — above / Then — below):  
| scenario | customer_account_id | device       | logout_action | session_status_after | expected_redirect | other_sessions_active |  
|----------|---------------------|--------------|---------------|----------------------|-------------------|-----------------------|  
| 1        | CUST-001            | mobile-phone | Log Out       | invalidated          | home page         | true                  |  

---  

### Scenario Outline: Log out everywhere invalidates all sessions  

Given a **CustomerAccount** *{customer_account_id}* with active sessions on devices *{device_1}* and *{device_2}*  
When the customer selects *{logout_action}*  
Then all sessions for **CustomerAccount** *{customer_account_id}* are invalidated (*{all_sessions_invalidated}*)  
  And the customer must re-authenticate on every device (*{reauth_required}*)  

### Session (Given — above / Then — below):  
| scenario | customer_account_id | device_1     | device_2 | logout_action      | all_sessions_invalidated | reauth_required |  
|----------|---------------------|--------------|----------|--------------------|--------------------------|-----------------|  
| 1        | CUST-001            | mobile-phone | laptop   | Log out everywhere | true                     | true            |  

---  

## Story: `Reset Password`  

### Scenario Outline: Reset link sent regardless of account existence  

Given the customer requests a password reset for **emailAddress** *{emailAddress}*  
When the system processes the password reset request  
Then the customer sees the confirmation message *{expected_message}*  
  And a *Reset Link* is sent only if a **CustomerAccount** exists (*{reset_link_sent}*)  

### Reset request (When — below / Then — below):  
| scenario | emailAddress        | account_exists | expected_message | reset_link_sent |  
|----------|---------------------|----------------|------------------|-----------------|  
| 1        | jane@example.com    | true           | check your email | true            |  
| 2        | unknown@example.com | false          | check your email | false           |  

---  

### Scenario Outline: Password successfully reset  

Given a **CustomerAccount** *{customer_account_id}* with a valid, non-expired *Reset Link*  
When the customer submits a new password *{new_password}* meeting all requirements  
Then the **passwordHash** on *{customer_account_id}* is updated (*{password_updated}*)  
  And all existing *Sessions* are invalidated (*{sessions_invalidated}*)  
  And the customer is redirected to the *{expected_redirect}* to re-login  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | new_password | password_updated | sessions_invalidated | expected_redirect |  
|----------|---------------------|--------------|------------------|----------------------|-------------------|  
| 1        | CUST-001            | NewStr0ngPw! | true             | true                 | Login Form        |  

---  

### Scenario Outline: Expired or used reset link rejected  

Given a *Reset Link* for **CustomerAccount** *{customer_account_id}* with status *{link_status}*  
When the customer clicks the *Reset Link*  
Then the system shows a *{expected_message}* message with a *{expected_action}* action  
  And the **passwordHash** remains unchanged (*{password_unchanged}*)  

### Reset Link (Given — above / Then — below):  
| scenario | customer_account_id | link_status | expected_message  | expected_action   | password_unchanged |  
|----------|---------------------|-------------|-------------------|-------------------|--------------------|  
| 1        | CUST-001            | expired     | link expired      | request new reset | true               |  
| 2        | CUST-001            | used        | link already used | request new reset | true               |  

---  

## Story: `Maintain Session Across Devices`  

### Scenario Outline: New session created on additional device  

Given a **CustomerAccount** *{customer_account_id}* with an active *Session* on *{existing_device}*  
When the customer logs in on *{new_device}*  
Then a new *Session* is created for *{new_device}* (*{new_session_created}*)  
  And the *Session* on *{existing_device}* remains active (*{existing_session_active}*)  

### Session (Given — above / Then — below):  
| scenario | customer_account_id | existing_device | new_device | new_session_created | existing_session_active |  
|----------|---------------------|-----------------|------------|---------------------|-------------------------|  
| 1        | CUST-001            | laptop          | mobile     | true                | true                    |  

---  

### Scenario Outline: Session token expiry preserves cart  

Given a **CustomerAccount** *{customer_account_id}* with **ShoppingCart** containing *{cart_items_count}* items  
  And the *Session Token* has expired due to *{expiry_reason}*  
When the session is evaluated  
Then the customer is redirected to the *{expected_redirect}* (*{redirect_shown}*)  
  And the **ShoppingCart** retains all *{cart_items_count}* items (*{cart_preserved}*)  

### Session expiry (Given — above / Then — below):  
| scenario | customer_account_id | cart_items_count | expiry_reason        | expected_redirect | redirect_shown | cart_preserved |  
|----------|---------------------|------------------|----------------------|-------------------|----------------|----------------|  
| 1        | CUST-001            | 3                | inactivity timeout   | Login Form        | true           | true           |  
| 2        | CUST-001            | 5                | max session duration | Login Form        | true           | true           |  

---  

## Story: `Save Delivery Address`  

### Scenario Outline: Address saved from checkout  

Given a **CustomerAccount** *{customer_account_id}* is logged in during checkout  
  And the customer enters a new shipping address with **addressLineOne** *{addressLineOne}*, **city** *{city}*, **postcode** *{postcode}*, **country** *{country}*  
When the customer accepts *{save_prompt}*  
Then a **SavedAddress** is stored in the customer's address book  
  And **defaultShippingFlag** is *{default_flag}*  

### SavedAddress (Then — below scenario):  
| scenario | customer_account_id | addressLineOne | city    | postcode | country | save_prompt                         | default_flag |  
|----------|---------------------|----------------|---------|----------|---------|-------------------------------------|--------------|  
| 1        | CUST-001            | 42 Oak Lane    | Bristol | BS1 4QT  | UK      | save this address for future orders | true         |  
| 2        | CUST-001            | 10 High Street | London  | E1 6AN   | UK      | save this address for future orders | false        |  

---  

### Scenario Outline: First address becomes default automatically  

Given a **CustomerAccount** *{customer_account_id}* has no **SavedAddress** entries  
When the customer saves address **addressLineOne** *{addressLineOne}*, **city** *{city}*, **postcode** *{postcode}*  
Then the **SavedAddress** is created with **defaultShippingFlag** *{expected_default_flag}*  

### SavedAddress (Then — below scenario):  
| scenario | customer_account_id | addressLineOne | city    | postcode | expected_default_flag |  
|----------|---------------------|----------------|---------|----------|-----------------------|  
| 1        | CUST-001            | 42 Oak Lane    | Bristol | BS1 4QT  | true                  |  

---  

## Story: `Manage Saved Addresses`  

### SavedAddress (Given — above scenarios):  
| saved_address_id | customer_account_id | addressLineOne | city    | postcode | country | defaultShippingFlag |  
|------------------|---------------------|----------------|---------|----------|---------|---------------------|  
| ADDR-001         | CUST-001            | 42 Oak Lane    | Bristol | BS1 4QT  | UK      | true                |  
| ADDR-002         | CUST-001            | 10 High Street | London  | E1 6AN   | UK      | false               |  

---  

### Scenario Outline: Address book lists all saved addresses  

Given a **CustomerAccount** *{customer_account_id}* with **SavedAddress** entries *{saved_address_id_list}*  
When the customer opens the *Address Book* from account settings  
Then all **SavedAddress** entries are listed with full details (*{addresses_displayed}*)  
  And the address *{default_address_id}* is visually indicated as the default (*{default_indicated}*)  

### Address Book display (Then — below scenario):  
| scenario | customer_account_id | saved_address_id_list | default_address_id | addresses_displayed | default_indicated |  
|----------|---------------------|-----------------------|--------------------|---------------------|-------------------|  
| 1        | CUST-001            | ADDR-001, ADDR-002    | ADDR-001           | 2                   | true              |  

---  

### Scenario Outline: Deleted default address prompts new default selection  

Given a **CustomerAccount** *{customer_account_id}* with **SavedAddress** *{deleted_address_id}* as the default  
  And another **SavedAddress** *{remaining_address_id}* exists  
When the customer deletes **SavedAddress** *{deleted_address_id}*  
Then *{deleted_address_id}* is removed from the *Address Book*  
  And *{remaining_address_id}* becomes the new default (*{new_default}*)  

### SavedAddress deletion (Given — above / Then — below):  
| scenario | customer_account_id | deleted_address_id | remaining_address_id | new_default |  
|----------|---------------------|--------------------|----------------------|-------------|  
| 1        | CUST-001            | ADDR-001           | ADDR-002             | ADDR-002    |  

---  

## Story: `Save Payment Method`  

### Scenario Outline: Payment method saved as token after checkout  

Given a **CustomerAccount** *{customer_account_id}* completes payment via **PaymentVendor** *{vendorName}*  
When the customer accepts *{save_prompt}*  
Then a **SavedPaymentMethod** is created with **vendorTokenReference** *{vendorTokenReference}*  
  And **lastFourDigits** *{lastFourDigits}*, **cardBrand** *{cardBrand}*, **expiryMonth** *{expiryMonth}*, **expiryYear** *{expiryYear}* are stored for display  
  And payment details are stored as token references only (*{storage_method}*)  

### SavedPaymentMethod (Then — below scenario):  
| scenario | customer_account_id | vendorName | save_prompt                              | vendorTokenReference | lastFourDigits | cardBrand | expiryMonth | expiryYear | storage_method |  
|----------|---------------------|------------|------------------------------------------|----------------------|----------------|-----------|-------------|------------|----------------|  
| 1        | CUST-001            | StripeWave | save this payment method for future orders | tok_sw_abc123      | 4242           | Visa      | 12          | 2027       | tokenized      |  
| 2        | CUST-001            | PayNova    | save this payment method for future orders | tok_pn_def456      | 8888           | Wallet    | 06          | 2028       | tokenized      |  

---  

### Scenario Outline: First saved method becomes default  

Given a **CustomerAccount** *{customer_account_id}* has no **SavedPaymentMethod** entries  
When the customer saves a payment method with **vendorTokenReference** *{vendorTokenReference}*  
Then the **SavedPaymentMethod** is created as the default payment method (*{is_default}*)  

### SavedPaymentMethod (Then — below scenario):  
| scenario | customer_account_id | vendorTokenReference | is_default |  
|----------|---------------------|----------------------|------------|  
| 1        | CUST-001            | tok_sw_abc123        | true       |  

---  

## Story: `Manage Saved Payment Methods`  

### SavedPaymentMethod (Given — above scenarios):  
| saved_payment_id | customer_account_id | vendorTokenReference | lastFourDigits | cardBrand | expiryMonth | expiryYear | is_default |  
|------------------|---------------------|----------------------|----------------|-----------|-------------|------------|------------|  
| PAY-001          | CUST-001            | tok_sw_abc123        | 4242           | Visa      | 12          | 2027       | true       |  
| PAY-002          | CUST-001            | tok_pn_def456        | 8888           | Wallet    | 06          | 2028       | false      |  

---  

### Scenario Outline: Payment methods listed with default indicated  

Given a **CustomerAccount** *{customer_account_id}* with **SavedPaymentMethod** entries *{saved_payment_id_list}*  
When the customer opens the *Payment Methods List* from account settings  
Then all saved methods are shown with **lastFourDigits**, **cardBrand**, and expiry (*{methods_displayed}*)  
  And the **SavedPaymentMethod** *{default_payment_id}* is visually indicated as default (*{default_indicated}*)  

### Payment methods display (Then — below scenario):  
| scenario | customer_account_id | saved_payment_id_list | default_payment_id | methods_displayed | default_indicated |  
|----------|---------------------|-----------------------|--------------------|-------------------|-------------------|  
| 1        | CUST-001            | PAY-001, PAY-002      | PAY-001            | 2                 | true              |  

---  

### Scenario Outline: Removed default payment method prompts new default  

Given a **CustomerAccount** *{customer_account_id}* with default **SavedPaymentMethod** *{removed_payment_id}*  
  And another **SavedPaymentMethod** *{remaining_payment_id}* exists  
When the customer removes **SavedPaymentMethod** *{removed_payment_id}*  
Then *{removed_payment_id}* is removed and the customer is prompted to select a new default (*{prompted_for_new_default}*)  
  And *{remaining_payment_id}* is offered as the new default  

### SavedPaymentMethod removal (Given — above / Then — below):  
| scenario | customer_account_id | removed_payment_id | remaining_payment_id | prompted_for_new_default |  
|----------|---------------------|--------------------|----------------------|--------------------------|  
| 1        | CUST-001            | PAY-001            | PAY-002              | true                     |  

---  

## Story: `Select Saved Address at Checkout`  

Background:  
  Given a **CustomerAccount** *{customer_account_id}* is logged in  
  And the **ShoppingCart** for *{customer_account_id}* has items ready for checkout  

### CustomerAccount (Given — above scenarios):  
| customer_account_id | emailAddress     |  
|---------------------|------------------|  
| CUST-001            | jane@example.com |  

### SavedAddress (Given — above scenarios):  
| saved_address_id | customer_account_id | addressLineOne | city    | postcode | defaultShippingFlag |  
|------------------|---------------------|----------------|---------|----------|---------------------|  
| ADDR-001         | CUST-001            | 42 Oak Lane    | Bristol | BS1 4QT  | true                |  
| ADDR-002         | CUST-001            | 10 High Street | London  | E1 6AN   | false               |  

---  

### Scenario Outline: Default address pre-selected at checkout  

When the customer reaches the shipping step during checkout  
Then the *Address Selector* shows all **SavedAddress** entries from the *Address Book* (*{addresses_shown}*)  
  And **SavedAddress** *{default_address_id}* with **defaultShippingFlag** *{expected_default_flag}* is pre-selected  

### Address selection (Then — below scenario):  
| scenario | customer_account_id | default_address_id | expected_default_flag | addresses_shown |  
|----------|---------------------|--------------------|-----------------------|-----------------|  
| 1        | CUST-001            | ADDR-001           | true                  | 2               |  

---  

### Scenario Outline: Saved address auto-fills shipping fields  

When the customer selects **SavedAddress** *{saved_address_id}*  
Then the shipping address fields are auto-filled with **addressLineOne** *{addressLineOne}*, **city** *{city}*, **postcode** *{postcode}*  
  And checkout advances to the next step (*{auto_advanced}*)  

### SavedAddress (When — below / Then — below):  
| scenario | saved_address_id | addressLineOne | city    | postcode | auto_advanced |  
|----------|------------------|----------------|---------|----------|---------------|  
| 1        | ADDR-001         | 42 Oak Lane    | Bristol | BS1 4QT  | true          |  
| 2        | ADDR-002         | 10 High Street | London  | E1 6AN   | true          |  

---  

### Scenario Outline: Guest customer sees manual address form at checkout  

Given a guest customer (not logged in) with a **ShoppingCart**  
When the guest reaches the shipping step  
Then the manual *Address Form* is displayed (*{address_form_shown}*)  
  And a prompt to *{expected_prompt}* is displayed (*{login_prompt_shown}*)  

### Guest checkout (Then — below scenario):  
| scenario | address_form_shown | expected_prompt             | login_prompt_shown |  
|----------|--------------------|-----------------------------|---------------------|  
| 1        | true               | log in or create an account | true                |  

---  

## Story: `Select Saved Payment Method at Checkout`  

Background:  
  Given a **CustomerAccount** *{customer_account_id}* is logged in  
  And the **ShoppingCart** for *{customer_account_id}* has items ready for checkout  

### SavedPaymentMethod (Given — above scenarios):  
| saved_payment_id | customer_account_id | vendorTokenReference | lastFourDigits | cardBrand | expiryMonth | expiryYear | is_default |  
|------------------|---------------------|----------------------|----------------|-----------|-------------|------------|------------|  
| PAY-001          | CUST-001            | tok_sw_abc123        | 4242           | Visa      | 12          | 2027       | true       |  
| PAY-002          | CUST-001            | tok_pn_def456        | 8888           | Wallet    | 06          | 2028       | false      |  

---  

### Scenario Outline: Default payment method pre-selected at checkout  

When the customer reaches the payment step during checkout  
Then the *Payment Selector* shows all **SavedPaymentMethod** entries (*{methods_shown}*)  
  And **SavedPaymentMethod** *{default_payment_id}* is pre-selected (*{pre_selected}*)  

### Payment selection (Then — below scenario):  
| scenario | customer_account_id | default_payment_id | methods_shown | pre_selected |  
|----------|---------------------|--------------------|---------------|--------------|  
| 1        | CUST-001            | PAY-001            | 2             | true         |  

---  

### Scenario Outline: Saved payment proceeds without card re-entry  

When the customer selects **SavedPaymentMethod** *{saved_payment_id}*  
Then the payment proceeds using **vendorTokenReference** *{vendorTokenReference}*  
  And the customer is shown **lastFourDigits** *{lastFourDigits}* and **cardBrand** *{cardBrand}* for confirmation (*{confirmation_displayed}*)  

### SavedPaymentMethod (When — below / Then — below):  
| scenario | saved_payment_id | vendorTokenReference | lastFourDigits | cardBrand | confirmation_displayed |  
|----------|------------------|----------------------|----------------|-----------|------------------------|  
| 1        | PAY-001          | tok_sw_abc123        | 4242           | Visa      | true                   |  

---  

### Scenario Outline: Expired token marked and alternatives shown  

Given a **SavedPaymentMethod** *{saved_payment_id}* with **expiryMonth** *{expiryMonth}* / **expiryYear** *{expiryYear}* that has expired  
When the customer reaches the payment step  
Then **SavedPaymentMethod** *{saved_payment_id}* is marked as *{expected_label}*  
  And remaining valid methods and the manual entry form are displayed as alternatives (*{alternatives_shown}*)  
  And the payment step requires the customer to select a valid method before proceeding (*{valid_method_required}*)  

### SavedPaymentMethod (Given — above / Then — below):  
| scenario | saved_payment_id | expiryMonth | expiryYear | expected_label | alternatives_shown | valid_method_required |  
|----------|------------------|-------------|------------|----------------|--------------------|-----------------------|  
| 1        | PAY-001          | 01          | 2024       | expired        | true               | true                  |  

---  

## Story: `View Order History`  

### Order (Given — above scenarios):  
| orderNumber | customer_account_id | orderDate  | orderStatus | orderTotal |  
|-------------|---------------------|------------|-------------|------------|  
| ORD-1001    | CUST-001            | 2025-01-15 | Delivered   | £45.99     |  
| ORD-1002    | CUST-001            | 2025-03-20 | Shipped     | £82.50     |  

### OrderLineItem (Given — above scenarios):  
| orderNumber | skuSnapshot     | productNameSnapshot     | quantity | unitPriceSnapshot |  
|-------------|-----------------|-------------------------|----------|-------------------|  
| ORD-1001    | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg  | 1        | £29.99            |  
| ORD-1001    | SKU-LEASH-03    | Leather Retractable Lead| 1        | £16.00            |  
| ORD-1002    | SKU-CAT-TOY-05  | Feather Wand Cat Toy    | 3        | £7.50             |  
| ORD-1002    | SKU-BED-02      | Orthopaedic Dog Bed     | 1        | £60.00            |  

---  

### Scenario Outline: Order history listed most recent first  

Given a **CustomerAccount** *{customer_account_id}* with **Order** entries *{order_numbers}*  
When the customer opens *Order History*  
Then all orders are listed most recent first (*{first_displayed}*)  
  And each row shows **orderNumber** *{orderNumber}*, **orderDate** *{orderDate}*, items (condensed), **orderTotal** *{orderTotal}*, and **orderStatus** *{orderStatus}*  

### Order History display (Then — below scenario):  
| scenario | customer_account_id | order_numbers      | first_displayed | orderNumber | orderDate  | orderTotal | orderStatus |  
|----------|---------------------|--------------------|-----------------|-------------|------------|------------|-------------|  
| 1        | CUST-001            | ORD-1001, ORD-1002 | ORD-1002        | ORD-1002    | 2025-03-20 | £82.50     | Shipped     |  

---  

### Scenario Outline: Empty order history shows prompt  

Given a **CustomerAccount** *{customer_account_id}* with *{order_count}* **Order** entries  
When the customer opens *Order History*  
Then a *{expected_prompt}* prompt is shown (*{prompt_shown}*)  

### CustomerAccount (Given — above / Then — below):  
| scenario | customer_account_id | order_count | expected_prompt | prompt_shown |  
|----------|---------------------|-------------|-----------------|--------------|  
| 1        | CUST-003            | 0           | start shopping  | true         |  

---  

### Scenario Outline: Guest order associated retroactively on account creation  

Given a guest **Order** *{orderNumber}* placed with **emailAddress** *{emailAddress}*  
  And a **CustomerAccount** *{customer_account_id}* is later created with the same **emailAddress** *{emailAddress}*  
When the system associates orders by email  
Then **Order** *{orderNumber}* appears in *{customer_account_id}*'s *Order History* (*{associated}*)  

### Order association (Given — above / Then — below):  
| scenario | orderNumber | emailAddress     | customer_account_id | associated |  
|----------|-------------|------------------|---------------------|------------|  
| 1        | ORD-0999    | jane@example.com | CUST-001            | true       |  

---  

## Story: `Manage Wishlist`  

### Product (Given — above scenarios):  
| sku             | name                    | price  |  
|-----------------|-------------------------|--------|  
| SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg  | £29.99 |  
| SKU-CAT-TOY-05  | Feather Wand Cat Toy    | £7.50  |  

### Wishlist (Given — above scenarios):  
| customer_account_id | wishlist_id |  
|---------------------|-------------|  
| CUST-001            | WISH-001    |  

---  

### Scenario Outline: Product added to wishlist from product page  

Given a **CustomerAccount** *{customer_account_id}* with **Wishlist** *{wishlist_id}*  
  And **Product** *{sku}* is not currently on the **Wishlist**  
When the customer selects *{add_action}* on the **Product** *{sku}* details page  
Then **Product** *{sku}* is added to **Wishlist** *{wishlist_id}* (*{added}*)  
  And the button changes to *{expected_button_state}*  

### Wishlist addition (Then — below scenario):  
| scenario | customer_account_id | wishlist_id | sku             | add_action      | added | expected_button_state |  
|----------|---------------------|-------------|-----------------|-----------------|-------|-----------------------|  
| 1        | CUST-001            | WISH-001    | SKU-DOG-FOOD-01 | Add to Wishlist | true  | Remove from Wishlist  |  

---  

### Scenario Outline: Wishlist shows live stock availability  

Given a **Wishlist** *{wishlist_id}* contains **Product** *{sku}*  
  And **StockAvailability** for *{sku}* has **availableToSellQuantity** *{available_qty}*  
When the customer opens their **Wishlist**  
Then **Product** *{sku}* is shown with name, image, price, and current stock: *{stock_display}*  

### StockAvailability (Given — above / Then — below):  
| scenario | wishlist_id | sku             | available_qty | stock_display |  
|----------|-------------|-----------------|---------------|---------------|  
| 1        | WISH-001    | SKU-DOG-FOOD-01 | 15            | In Stock      |  
| 2        | WISH-001    | SKU-CAT-TOY-05  | 0             | Out of Stock  |  

---  

### Scenario Outline: Add to cart from wishlist — item remains on wishlist  

Given a **Wishlist** *{wishlist_id}* contains **Product** *{sku}*  
When the customer selects *{cart_action}* from the **Wishlist** item  
Then **Product** *{sku}* is added to the **ShoppingCart** (*{in_cart}*)  
  And **Product** *{sku}* remains on **Wishlist** *{wishlist_id}* (*{still_on_wishlist}*)  

### Wishlist to cart (Then — below scenario):  
| scenario | wishlist_id | sku             | cart_action | in_cart | still_on_wishlist |  
|----------|-------------|-----------------|-------------|---------|-------------------|  
| 1        | WISH-001    | SKU-DOG-FOOD-01 | Add to Cart | true    | true              |  

---  

### Scenario Outline: Guest user prompted to log in for wishlist  

Given a guest customer (not logged in) is viewing **Product** *{sku}*  
When the guest selects *{add_action}*  
Then a *{expected_prompt}* prompt is shown, explaining wishlists require an account (*{prompt_shown}*)  
  And the customer remains on the **Product** *{sku}* details page (*{stays_on_page}*)  

### Guest wishlist attempt (Then — below scenario):  
| scenario | sku             | add_action      | expected_prompt    | prompt_shown | stays_on_page |  
|----------|-----------------|-----------------|--------------------| -------------|---------------|  
| 1        | SKU-DOG-FOOD-01 | Add to Wishlist | log in or register | true         | true          |  

---  

## Story: `Reorder Previous Purchase`  

### Order (Given — above scenarios):  
| orderNumber | customer_account_id | orderDate  |  
|-------------|---------------------|------------|  
| ORD-1001    | CUST-001            | 2025-01-15 |  

### OrderLineItem (Given — above scenarios):  
| orderNumber | sku             | productNameSnapshot      | quantity |  
|-------------|-----------------|--------------------------|----------|  
| ORD-1001    | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg   | 2        |  
| ORD-1001    | SKU-LEASH-03    | Leather Retractable Lead | 1        |  

### StockAvailability (Given — above scenarios):  
| sku             | availableToSellQuantity | product_active |  
|-----------------|-------------------------|----------------|  
| SKU-DOG-FOOD-01 | 10                      | true           |  
| SKU-LEASH-03    | 0                       | true           |  

---  

### Scenario Outline: Reorder adds all products to cart  

Given a **CustomerAccount** *{customer_account_id}* with **Order** *{orderNumber}* in *Order History*  
  And all **OrderLineItem** products are active and in stock  
When the customer selects *{reorder_action}* on **Order** *{orderNumber}*  
Then all **Product** items from *{orderNumber}* are added to the **ShoppingCart** with their original quantities  
  And the customer is taken to the cart to review before checkout (*{redirected_to_cart}*)  

### Reorder result (Then — below scenario):  
| scenario | customer_account_id | orderNumber | sku             | reorder_action | quantity_in_cart | redirected_to_cart |  
|----------|---------------------|-------------|-----------------|----------------|------------------|--------------------|  
| 1        | CUST-001            | ORD-1001    | SKU-DOG-FOOD-01 | Reorder        | 2                | true               |  
| 2        | CUST-001            | ORD-1001    | SKU-LEASH-03    | Reorder        | 1                | true               |  

---  

### Scenario Outline: Reorder with delisted product — partial success  

Given **Order** *{orderNumber}* contains **OrderLineItem** with **Product** *{delisted_sku}*  
  And **Product** *{delisted_sku}* has been delisted (no longer active)  
When the customer selects *{reorder_action}* on **Order** *{orderNumber}*  
Then available products are added to the **ShoppingCart** (*{partial_reorder}*)  
  And a clear message lists *{delisted_sku}* as unavailable: *{reason}*  

### Delisted product (Given — above / Then — below):  
| scenario | orderNumber | delisted_sku | reorder_action | reason           | partial_reorder |  
|----------|-------------|--------------|----------------|------------------|-----------------|  
| 1        | ORD-1001    | SKU-LEASH-03 | Reorder        | product delisted | true            |  

---  

### Scenario Outline: Reorder with out-of-stock product — stock warning shown  

Given **Order** *{orderNumber}* contains **OrderLineItem** with **Product** *{oos_sku}*  
  And **StockAvailability** for *{oos_sku}* has **availableToSellQuantity** *{available_qty}*  
When the customer selects *{reorder_action}* on **Order** *{orderNumber}*  
Then **Product** *{oos_sku}* is added to the cart (*{added_to_cart}*) with a stock warning (*{warning_shown}*)  
  And a *{expected_proceed_option}* option and a *{expected_remove_option}* option are shown (*{options_shown}*)  

### StockAvailability (Given — above / Then — below):  
| scenario | orderNumber | oos_sku      | available_qty | reorder_action | added_to_cart | warning_shown | expected_proceed_option | expected_remove_option | options_shown |  
|----------|-------------|--------------|---------------|----------------|---------------|---------------|-------------------------|------------------------|---------------|  
| 1        | ORD-1001    | SKU-LEASH-03 | 0             | Reorder        | true          | true          | proceed anyway          | remove                 | true          |  

---  

### Scenario Outline: Reorder merges into existing cart  

Given a **CustomerAccount** *{customer_account_id}* with existing **ShoppingCart** containing **Product** *{existing_sku}* quantity *{existing_qty}*  
  And **Order** *{orderNumber}* contains **Product** *{existing_sku}* with quantity *{reorder_qty}*  
When the customer selects *{reorder_action}* on **Order** *{orderNumber}*  
Then **Product** *{existing_sku}* in the **ShoppingCart** has quantity *{merged_qty}*  

### Cart merge on reorder (Given — above / Then — below):  
| scenario | customer_account_id | orderNumber | existing_sku    | existing_qty | reorder_qty | reorder_action | merged_qty |  
|----------|---------------------|-------------|-----------------|--------------|-------------|----------------|------------|  
| 1        | CUST-001            | ORD-1001    | SKU-DOG-FOOD-01 | 1            | 2           | Reorder        | 3          |  

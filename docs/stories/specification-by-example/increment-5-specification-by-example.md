# Specification by Example — Increment 5: Pay your way — multi-vendor payment with retries  

**Template:** Scenario Outline (parameterized with Examples tables)  

---  

## Story: `Process Digital Wallet Payment via PayNova`  

### PaymentVendor (Given — above scenarios):  
| vendorCode | vendorName | supportedPaymentTypes   |  
|------------|------------|-------------------------|  
| VNDR-PN    | PayNova    | digital_wallet          |  
| VNDR-SW    | StripeWave | credit_card, debit_card |  
| VNDR-VP    | VaultPay   | buy_now_pay_later       |  

### Order (Given — above scenarios):  
| orderNumber | customer_account_id | orderTotal | orderStatus |  
|-------------|---------------------|------------|-------------|  
| ORD-2001    | CUST-001            | £85.00     | pending     |  

### CustomerAccount (Given — above scenarios):  
| customer_account_id | emailAddress     |  
|---------------------|------------------|  
| CUST-001            | jane@example.com |  

---  

### Scenario Outline: PayNova payment confirmed and order transitions  

Given an **Order** *{orderNumber}* with **orderTotal** *{orderTotal}* and **orderStatus** *{initial_status}*  
  And **PaymentVendor** *{vendorCode}* (*{vendorName}*) is available  
When the customer selects *{vendorName}* at the payment step  
  And *{vendorName}* returns a successful payment confirmation with reference *{paymentReference}*  
Then a **Payment** is created with **paymentReference** *{paymentReference}*, **processingVendor** *{vendorCode}*, **paymentAmount** *{orderTotal}*, **paymentStatus** *{expected_paymentStatus}*  
  And the **Order** *{orderNumber}* transitions to **orderStatus** *{expected_orderStatus}*  
  And the system sends an order confirmation **Notification** to **CustomerAccount** *{customer_account_id}* (*{notification_sent}*)  

### Payment (Then — below scenario):  
| scenario | orderNumber | paymentReference | vendorCode | vendorName | orderTotal | initial_status | expected_paymentStatus | expected_orderStatus | customer_account_id | notification_sent |  
|----------|-------------|------------------|------------|------------|------------|----------------|------------------------|----------------------|---------------------|-------------------|  
| 1        | ORD-2001    | pn_txn_7890      | VNDR-PN    | PayNova    | £85.00     | pending        | captured               | Confirmed            | CUST-001            | true              |  

---  

### Scenario Outline: PayNova declines payment — customer sees alternatives  

Given an **Order** *{orderNumber}* with **orderTotal** *{orderTotal}* and **orderStatus** *{initial_status}*  
When the customer selects *{vendorName}* at the payment step  
  And *{vendorName}* declines the payment with reason *{decline_reason}*  
Then the customer sees a clear error message: *{decline_reason}*  
  And the payment step displays alternative vendor options (*{expected_alternatives}*)  
  And the **Order** *{orderNumber}* retains **orderStatus** *{expected_orderStatus}*  

### PayNova decline (When — below / Then — below):  
| scenario | orderNumber | orderTotal | vendorName | initial_status | decline_reason       | expected_alternatives                 | expected_orderStatus |  
|----------|-------------|------------|------------|----------------|----------------------|---------------------------------------|----------------------|  
| 1        | ORD-2001    | £85.00     | PayNova    | pending        | insufficient balance | retry PayNova, StripeWave, VaultPay   | pending              |  
| 2        | ORD-2001    | £85.00     | PayNova    | pending        | wallet locked        | retry PayNova, StripeWave, VaultPay   | pending              |  

---  

### Scenario Outline: PayNova webhook reconciled after timeout  

Given an **Order** *{orderNumber}* with a pending **Payment** through **PaymentVendor** *{vendorCode}*  
  And the initial *{vendorName}* response timed out  
When a **Payment** webhook callback arrives with reference *{paymentReference}* and status *{webhook_status}*  
Then the system reconciles **Payment** *{paymentReference}* against **Order** *{orderNumber}*  
  And **Payment** **paymentStatus** transitions to *{final_payment_status}*  
  And **Order** **orderStatus** transitions to *{final_order_status}*  

### Webhook reconciliation (When — below / Then — below):  
| scenario | orderNumber | vendorCode | vendorName | paymentReference | webhook_status | final_payment_status | final_order_status |  
|----------|-------------|------------|------------|------------------|----------------|----------------------|--------------------|  
| 1        | ORD-2001    | VNDR-PN    | PayNova    | pn_txn_7890      | captured       | captured             | Confirmed          |  
| 2        | ORD-2001    | VNDR-PN    | PayNova    | pn_txn_7891      | failed         | failed               | pending            |  

---  

### Scenario Outline: PayNova payment method offered for saving  

Given a **CustomerAccount** *{customer_account_id}* is logged in  
  And a **Payment** with **processingVendor** *{vendorName}* and **paymentReference** *{paymentReference}* is completed  
When the payment succeeds  
Then the system offers to save *{vendorName}* as a **SavedPaymentMethod** under **CustomerAccount** *{customer_account_id}* (*{save_offered}*)  
  And if accepted, a **SavedPaymentMethod** is created with **vendorTokenReference** *{vendorTokenReference}* and **walletProvider** *{walletProvider}*  

### SavedPaymentMethod (Then — below scenario):  
| scenario | customer_account_id | vendorName | paymentReference | vendorTokenReference | walletProvider | save_offered |  
|----------|---------------------|------------|------------------|----------------------|----------------|--------------|  
| 1        | CUST-001            | PayNova    | pn_txn_7890      | tok_pn_wallet_001    | PayNova Wallet | true         |  

---  

## Story: `Process Buy-Now-Pay-Later via VaultPay`  

### Scenario Outline: VaultPay BNPL approved and order confirmed  

Given an **Order** *{orderNumber}* with **orderTotal** *{orderTotal}* and **orderStatus** *{initial_status}*  
  And **PaymentVendor** *{vendorCode}* (*{vendorName}*) is available  
When the customer selects *{vendorName}* at the payment step  
  And *{vendorName}* performs the *Eligibility Check* and the customer accepts the **Instalment Plan** of *{installmentCount}* payments of *{installmentAmount}*  
  And *{vendorName}* approves with reference *{paymentReference}*  
Then a **Payment** is created with **paymentReference** *{paymentReference}*, **processingVendor** *{vendorCode}*, **paymentAmount** *{orderTotal}*, **paymentStatus** *{expected_paymentStatus}*  
  And the **Order** *{orderNumber}* transitions to **orderStatus** *{expected_orderStatus}*  
  And the system sends an order confirmation **Notification** (*{notification_sent}*)  

### VaultPay (Given — above / Then — below):  
| scenario | orderNumber | vendorCode | vendorName | orderTotal | initial_status | paymentReference | installmentCount | installmentAmount | expected_paymentStatus | expected_orderStatus | notification_sent |  
|----------|-------------|------------|------------|------------|----------------|------------------|------------------|-------------------|------------------------|----------------------|-------------------|  
| 1        | ORD-2001    | VNDR-VP    | VaultPay   | £200.00    | pending        | vp_ref_5001      | 4                | £50.00            | captured               | Confirmed            | true              |  
| 2        | ORD-2002    | VNDR-VP    | VaultPay   | £120.00    | pending        | vp_ref_5002      | 3                | £40.00            | captured               | Confirmed            | true              |  

---  

### Scenario Outline: VaultPay eligibility declined — customer sees alternatives  

Given an **Order** *{orderNumber}* with **orderTotal** *{orderTotal}* and **orderStatus** *{initial_status}*  
When the customer selects *{vendorName}* at the payment step  
  And *{vendorName}* declines the BNPL application with reason *{decline_reason}*  
Then the customer sees a clear message that BNPL is not available for this transaction: *{decline_reason}*  
  And the payment step displays alternative vendor options (*{expected_alternatives}*)  
  And the **Order** *{orderNumber}* retains **orderStatus** *{expected_orderStatus}*  

### VaultPay decline (When — below / Then — below):  
| scenario | orderNumber | orderTotal | vendorName | initial_status | decline_reason      | expected_alternatives | expected_orderStatus |  
|----------|-------------|------------|------------|----------------|---------------------|-----------------------|----------------------|  
| 1        | ORD-2001    | £200.00    | VaultPay   | pending        | eligibility failed  | StripeWave, PayNova   | pending              |  
| 2        | ORD-2001    | £200.00    | VaultPay   | pending        | credit check failed | StripeWave, PayNova   | pending              |  

---  

### Scenario Outline: VaultPay webhook reconciled after timeout  

Given an **Order** *{orderNumber}* with a pending **Payment** through **PaymentVendor** *{vendorCode}*  
  And the initial *{vendorName}* response timed out  
When a **Payment** webhook callback arrives with reference *{paymentReference}* and status *{webhook_status}*  
Then the system reconciles **Payment** *{paymentReference}* against **Order** *{orderNumber}*  
  And **Payment** **paymentStatus** transitions to *{final_payment_status}*  
  And **Order** **orderStatus** transitions to *{final_order_status}*  

### Webhook reconciliation (When — below / Then — below):  
| scenario | orderNumber | vendorCode | vendorName | paymentReference | webhook_status | final_payment_status | final_order_status |  
|----------|-------------|------------|------------|------------------|----------------|----------------------|--------------------|  
| 1        | ORD-2001    | VNDR-VP    | VaultPay   | vp_ref_5001      | captured       | captured             | Confirmed          |  
| 2        | ORD-2001    | VNDR-VP    | VaultPay   | vp_ref_5002      | failed         | failed               | pending            |  

---  

### Scenario Outline: VaultPay saved but eligibility check still per-transaction  

Given a **CustomerAccount** *{customer_account_id}* with a completed **Payment** via *{vendorName}*  
When the system offers to save *{vendorName}* as a **SavedPaymentMethod**  
  And the customer accepts  
Then a **SavedPaymentMethod** is created with **vendorTokenReference** *{vendorTokenReference}*  
  And future *{vendorName}* usage pre-fills the customer's identity (*{identity_prefilled}*)  
  And the *Eligibility Check* is still performed per transaction (*{eligibility_per_transaction}*)  

### SavedPaymentMethod (Then — below scenario):  
| scenario | customer_account_id | vendorName | vendorTokenReference | identity_prefilled | eligibility_per_transaction |  
|----------|---------------------|------------|----------------------|--------------------|-----------------------------|  
| 1        | CUST-001            | VaultPay   | tok_vp_identity_001  | true               | true                        |  

---  

## Story: `Retry Failed Payment`  

### Payment (Given — above scenarios):  
| paymentReference | orderNumber | paymentAmount | processingVendor | paymentStatus |  
|------------------|-------------|---------------|------------------|---------------|  
| pay_ref_3001     | ORD-2001    | £85.00        | VNDR-PN          | failed        |  
| pay_ref_3002     | ORD-2002    | £200.00       | VNDR-VP          | failed        |  
| pay_ref_3003     | ORD-2003    | £45.00        | VNDR-SW          | failed        |  

---  

### Scenario Outline: Transient error triggers automatic retry — retry succeeds  

Given a **Payment** *{paymentReference}* for **Order** *{orderNumber}* with **paymentStatus** *{initial_paymentStatus}*  
  And the failure reason is a *Transient Error*: *{error_type}*  
  And **processingVendor** is *{processingVendor}*  
When the system automatically retries the payment through *{processingVendor}*  
  And the retry succeeds  
Then **Payment** *{paymentReference}* transitions to **paymentStatus** *{final_paymentStatus}*  
  And **Order** *{orderNumber}* transitions to **orderStatus** *{final_orderStatus}*  
  And the customer sees the *Order Confirmation Page* and receives the confirmation email (*{confirmation_sent}*)  

### Retry success (Given — above / Then — below):  
| scenario | paymentReference | orderNumber | processingVendor | initial_paymentStatus | error_type      | final_paymentStatus | final_orderStatus | confirmation_sent |  
|----------|------------------|-------------|------------------|-----------------------|-----------------|---------------------|-------------------|-------------------|  
| 1        | pay_ref_3001     | ORD-2001    | VNDR-PN          | failed                | network timeout | captured            | Confirmed         | true              |  
| 2        | pay_ref_3003     | ORD-2003    | VNDR-SW          | failed                | vendor 5xx      | captured            | Confirmed         | true              |  

---  

### Scenario Outline: All retries exhausted — customer notified with alternatives  

Given a **Payment** *{paymentReference}* for **Order** *{orderNumber}* with **paymentStatus** *{initial_paymentStatus}*  
  And the failure reason is a *Transient Error*: *{error_type}*  
  And *{retry_attempts}* retries have been attempted within the *Retry Window*  
When the final retry also fails  
Then the customer is notified that payment could not be processed (*{customer_notified}*)  
  And the payment step displays alternative options (*{expected_alternatives}*)  
  And the system ensures only one charge attempt per retry (*{duplicate_prevented}*)  

### Retry exhaustion (Given — above / Then — below):  
| scenario | paymentReference | orderNumber | initial_paymentStatus | error_type      | retry_attempts | max_retries | customer_notified | expected_alternatives               | duplicate_prevented |  
|----------|------------------|-------------|-----------------------|-----------------|----------------|-------------|-------------------|------------------------------------|---------------------|  
| 1        | pay_ref_3001     | ORD-2001    | failed                | network timeout | 3              | 3           | true              | other vendors and manual card entry | true                |  
| 2        | pay_ref_3002     | ORD-2002    | failed                | vendor 5xx      | 3              | 3           | true              | other vendors and manual card entry | true                |  

---  

### Scenario Outline: Hard decline — customer sees decline reason immediately  

Given a **Payment** *{paymentReference}* for **Order** *{orderNumber}* with **paymentStatus** *{initial_paymentStatus}*  
  And the failure reason is a *Hard Decline*: *{decline_reason}*  
When the system evaluates whether to retry  
Then the customer is immediately shown the decline reason: *{decline_reason}* (*{immediate_display}*)  
  And alternatives are offered: *{expected_alternatives}* (*{alternatives_shown}*)  

### Hard decline (Given — above / Then — below):  
| scenario | paymentReference | orderNumber | initial_paymentStatus | decline_reason     | immediate_display | expected_alternatives          | alternatives_shown |  
|----------|------------------|-------------|-----------------------|--------------------|-------------------|--------------------------------|--------------------|  
| 1        | pay_ref_3001     | ORD-2001    | failed                | insufficient funds | true              | different card or other vendor  | true               |  
| 2        | pay_ref_3003     | ORD-2003    | failed                | card blocked       | true              | different card or other vendor  | true               |  
| 3        | pay_ref_3003     | ORD-2003    | failed                | fraud flag         | true              | different card or other vendor  | true               |  

---  

### Scenario Outline: Retry continues in background after customer navigates away  

Given a **Payment** *{paymentReference}* for **Order** *{orderNumber}* is in retry due to *Transient Error*  
  And the customer navigates away from the checkout page  
When the retry completes with outcome *{retry_outcome}*  
Then **Order** *{orderNumber}* transitions to **orderStatus** *{expected_orderStatus}*  
  And the customer is notified via *{notification_channel}*: *{expected_notification}*  

### Background retry (Given — above / Then — below):  
| scenario | paymentReference | orderNumber | retry_outcome | expected_orderStatus | notification_channel | expected_notification           |  
|----------|------------------|-------------|---------------|----------------------|----------------------|---------------------------------|  
| 1        | pay_ref_3001     | ORD-2001    | success       | Confirmed            | email                | order confirmed                 |  
| 2        | pay_ref_3002     | ORD-2002    | exhausted     | pending              | email                | payment could not be processed  |  

---  

### Scenario Outline: Retrying payment indicator shown to customer  

Given a **Payment** *{paymentReference}* for **Order** *{orderNumber}* has failed due to *Transient Error*  
When the system initiates automatic retry  
Then the customer sees a *{expected_indicator}* indicator (*{indicator_shown}*)  
  And the customer can continue browsing during retry (*{browsing_uninterrupted}*)  

### Retry indicator (Then — below scenario):  
| scenario | paymentReference | orderNumber | expected_indicator | indicator_shown | browsing_uninterrupted |  
|----------|------------------|-------------|--------------------|-----------------|------------------------|  
| 1        | pay_ref_3001     | ORD-2001    | retrying payment   | true            | true                   |  

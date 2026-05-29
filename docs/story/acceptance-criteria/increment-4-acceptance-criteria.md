---
state: acceptance-criteria
increment_scope: Increment 4 — Returning customers
exploration_refresh: Run 5 slot 95
ul_source: docs/domain/ubiquitous-language.md (slot 93)
---

# Acceptance criteria — Increment 4: Returning customers — accounts, history, reorder

**Increment outcome:** Customers can register, log in, save addresses and payment methods, see their *order history*, manage a *wishlist*, and one-click *reorder*. Account creation is prompted during *guest checkout*. Lifts repeat-purchase rate without changing the buy flow.

**Builds on:** Increments 1–3 (*store*, *product catalog*, *shopping cart*, *guest checkout*, *StripeWave*, *click-and-collect*, *standard delivery*, *order* lifecycle, *confirmation email*, *shipping notification*).

**UL alignment:** Domain terms and AC prose follow Increment 4 refresh in `docs/domain/ubiquitous-language.md` (slot 93): *customer account*, *customer session*, *email verification*, *verification link*, *account verification status*, *guest checkout*, *address book*, *saved address*, *default address*, *saved payment method*, *default payment method*, *order history*, *reorder*, *wishlist*, *wishlist item*, *shopping cart*, *stock availability*.

**Scope guard:** *Guest checkout* and Increment 1–3 paths remain valid. Account features are additive — registration, login, and saved entities coexist with guest purchase. Email + password only (no social login). *StripeWave* sole active *payment vendor*. *Customer pet* CRUD, *communication preferences* UI, PayNova/VaultPay, express/same-day delivery, and *return* deferred.

---

## Story: Register Account

**Story type:** user

### Domain terms

- *customer account* — persistent identity created via email and password registration
- *account verification status* — unverified until *email verification* completes
- *email verification* — mandatory confirmation process triggered after registration

### Acceptance criteria

1. **WHEN** the customer opens the registration screen
   **THEN** the form collects email address and password (with confirmation)
   **AND** password requirements are shown clearly before submission
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "registration, login, logout, password reset, email verification"; ubiquitous-language.md — *customer account* registers via email and password

2. **WHEN** the customer submits valid registration details
   **THEN** a *customer account* is created with *account verification status* unverified
   **AND** the system triggers *Send Email Verification*
   **AND** the customer sees a "check your email to verify" confirmation screen
   **Evidence:** ubiquitous-language.md — *customer account* creates unverified status until *email verification* completes; thin-slicing.md — Increment 4, *email verification* mandatory

3. **WHEN** the customer submits an email already registered to another *customer account*
   **THEN** the form shows an error stating the email is already in use
   **AND** a "Log In instead" link is displayed
   **BUT** the error does not reveal whether the existing *account verification status* is verified or unverified
   **Evidence:** ubiquitous-language.md — *customer account* invariant: unique verified email before account-only features unlock

4. **WHEN** the customer submits a password that does not meet requirements
   **THEN** the form shows which requirements are unmet
   **BUT** no *customer account* is created until all requirements pass
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "Nothing exotic, just solid and reliable"

---

## Story: Send Email Verification

**Story type:** system

### Domain terms

- *email verification* — confirmation process that sends a *verification link* to the registered email
- *verification link* — unique, time-limited, one-time-use link in the verification email
- *customer account* — the account awaiting verification

### Acceptance criteria

1. **WHEN** a *customer account* is created (registration or guest-to-account conversion)
   **THEN** the system sends *email verification* to the registered email address
   **AND** the email contains a *verification link* that is unique and time-limited
   **Evidence:** ubiquitous-language.md — *email verification* sends *verification link* when account is created or resend is requested

2. **WHEN** the *verification link* expires (for example after 24 hours)
   **THEN** clicking the link shows a clear "link expired" message
   **AND** a "resend verification" action is offered
   **Evidence:** ubiquitous-language.md — *verification link* expires after configured window and offers resend when expired

3. **WHEN** email delivery is temporarily unavailable
   **THEN** the verification email is queued for retry
   **AND** the registration confirmation screen tells the customer to expect the email shortly
   **Evidence:** ubiquitous-language.md — *email verification* queues for retry when delivery unavailable

---

## Story: Verify Email Address

**Story type:** user

### Domain terms

- *verification link* — link from the verification email
- *account verification status* — transitions to verified after successful confirmation
- *customer account* — the account being verified

### Acceptance criteria

1. **WHEN** the customer clicks a valid, non-expired *verification link*
   **THEN** the *customer account* *account verification status* becomes verified
   **AND** the customer is redirected to a "you're verified" confirmation page with a prompt to log in
   **Evidence:** ubiquitous-language.md — *email verification* transitions *account verification status* to verified

2. **WHEN** the customer clicks a *verification link* that has already been used
   **THEN** the system shows an "already verified" message with a login link
   **BUT** the *account verification status* is not modified again
   **Evidence:** ubiquitous-language.md — *verification link* is one-time-use

3. **WHEN** the customer clicks an expired *verification link*
   **THEN** the system shows a "link expired" message with a "resend verification" action
   **Evidence:** ubiquitous-language.md — *verification link* expires and offers resend

---

## Story: Log In

**Story type:** user

### Domain terms

- *customer session* — authenticated context created after successful login
- *customer account* — the identity the customer authenticates into
- *account verification status* — must be verified before *customer session* with account-only access
- *shopping cart* — guest cart merges into account cart on login

### Acceptance criteria

1. **WHEN** the customer submits valid credentials on the login screen
   **THEN** a *customer session* is created
   **AND** the customer is redirected to their previous page or account dashboard
   **Evidence:** ubiquitous-language.md — *customer session* is authenticated context created on successful login

2. **WHEN** the customer submits incorrect credentials
   **THEN** the login screen shows a generic "invalid email or password" error
   **BUT** the error does not specify which field is wrong
   **Evidence:** inferred — credential enumeration prevention; ubiquitous-language.md — authentication on *customer account*

3. **WHEN** the customer attempts to log in with *account verification status* unverified
   **THEN** the system shows a "please verify your email first" message with a "resend verification" option
   **BUT** no *customer session* with account-only feature access is created
   **Evidence:** ubiquitous-language.md — *customer session* invariant: unverified accounts must not receive account-only feature access

4. **WHEN** the customer has an active guest *shopping cart* and then logs in
   **THEN** the guest cart merges into the logged-in *customer account* cart
   **AND** if both carts contain the same *product*, quantities are summed
   **Evidence:** ubiquitous-language.md — *customer session* merges guest *shopping cart* into account cart on login; requirements-chat-with-product-owner.md — line 13, "A shopping cart that persists"

---

## Story: Log Out

**Story type:** user

### Domain terms

- *customer session* — authenticated context terminated on logout
- *customer account* — the logged-in identity

### Acceptance criteria

1. **WHEN** the customer selects "Log Out"
   **THEN** the current *customer session* is invalidated
   **AND** the customer is redirected to the home page in a guest state
   **Evidence:** ubiquitous-language.md — *customer account* authenticates via login and logout

2. **WHEN** the customer logs out on one device
   **THEN** only the *customer session* on that device is invalidated
   **AND** *customer session* on other devices remain active
   **AND** a "Log out everywhere" option invalidates all sessions across devices when selected
   **Evidence:** ubiquitous-language.md — *customer session* allows multiple concurrent sessions; invalidates on logout for current device; supports "log out everywhere"

---

## Story: Reset Password

**Story type:** user

### Domain terms

- *customer account* — the account whose password is being reset
- *customer session* — all sessions invalidated after password change
- password reset — recovery flow when the customer has forgotten their password

### Acceptance criteria

1. **WHEN** the customer requests password reset by entering their email
   **THEN** the system sends a reset link to that email if the *customer account* exists
   **AND** the same "check your email" message is shown regardless of whether the account exists
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "password reset"; ubiquitous-language.md — *customer account* supports password reset

2. **WHEN** the customer clicks a valid, non-expired reset link
   **THEN** they are taken to a "set new password" form
   **AND** the new password must meet the same requirements as registration
   **Evidence:** inferred — standard password reset flow aligned to registration requirements

3. **WHEN** the customer submits a new password
   **THEN** the password is updated and all *customer session* on all devices are invalidated
   **AND** the customer must log in again on each device
   **Evidence:** ubiquitous-language.md — *customer account* supports password reset with session invalidation on password change

4. **WHEN** the reset link has expired or been used
   **THEN** the customer sees a clear "link expired" message with a "Request new reset" action
   **Evidence:** inferred — time-limited, one-time-use reset link

---

## Story: Maintain Session Across Devices

**Story type:** system

### Domain terms

- *customer session* — authenticated context associating a browser or device with a *customer account*
- *shopping cart* — tied to the *customer account*, not the session, when logged in

### Acceptance criteria

1. **WHEN** the customer logs in on a new device
   **THEN** a new *customer session* is created for that device
   **AND** existing *customer session* on other devices remain active
   **Evidence:** ubiquitous-language.md — *customer session* allows multiple concurrent sessions per *customer account*

2. **WHEN** the *customer session* expires from inactivity timeout or max duration
   **THEN** the customer is redirected to the login screen
   **AND** *shopping cart* changes are preserved because the cart is tied to the *customer account*, not the session
   **Evidence:** ubiquitous-language.md — *customer session* persists until logout, inactivity timeout, or password reset; *shopping cart* persists across devices for logged-in customers

3. **WHEN** the customer changes their password via *Reset Password*
   **THEN** all *customer session* on all devices are invalidated
   **AND** the customer must re-authenticate on each device
   **Evidence:** ubiquitous-language.md — *customer session* invalidates on password reset

---

## Story: Save Delivery Address

**Story type:** user

### Domain terms

- *saved address* — shipping or billing address stored in the *address book* for reuse
- *address book* — collection of *saved address* on a *customer account*
- *default address* — first saved address becomes default automatically

### Acceptance criteria

1. **WHEN** a logged-in customer completes checkout with a new shipping address
   **THEN** the system offers a "save this address for future orders" option
   **AND** if accepted, the address is stored in the *address book*
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "saved addresses"; ubiquitous-language.md — *address book* accepts new entries from checkout

2. **WHEN** the customer saves the first *saved address*
   **THEN** that address is automatically assigned as the *default address*
   **Evidence:** ubiquitous-language.md — *default address* is assigned automatically to the first *saved address*

3. **WHEN** the customer already has entries in the *address book*
   **THEN** the new *saved address* is added without replacing existing ones
   **AND** account settings *address book* shows the new entry with a "set as default" option (see *Manage Saved Addresses*)
   **Evidence:** ubiquitous-language.md — *saved address* allows multiple entries; *address book* aggregates all *saved address*

---

## Story: Manage Saved Addresses

**Story type:** user

### Domain terms

- *address book* — list of all *saved address* under the *customer account*
- *saved address* — individual address entry
- *default address* — pre-selected at checkout unless overridden

### Acceptance criteria

1. **WHEN** the customer opens the *address book* from account settings
   **THEN** all *saved address* are listed with full details
   **AND** the *default address* is visually indicated
   **Evidence:** ubiquitous-language.md — *address book* aggregates *saved address*; *default address* pre-selected at checkout

2. **WHEN** the customer edits a *saved address*
   **THEN** the changes are persisted
   **AND** future checkouts using that address reflect the updated details
   **Evidence:** ubiquitous-language.md — *saved address* supports edit from account settings

3. **WHEN** the customer deletes a *saved address*
   **THEN** the address is removed from the *address book*
   **BUT** if the deleted address was the *default address*, the customer is prompted to select a new default (or the most recently added becomes default)
   **Evidence:** ubiquitous-language.md — *saved address* invariant: deleting *default address* requires selecting a new default when other *saved address* remain

4. **WHEN** the customer sets a different *saved address* as *default address*
   **THEN** the previous default is demoted
   **AND** the new default is pre-selected during future checkouts
   **Evidence:** ubiquitous-language.md — *default address* may be changed in account settings

---

## Story: Save Payment Method

**Story type:** user

### Domain terms

- *saved payment method* — tokenized payment credential stored on the *customer account*
- *StripeWave* — sole active *payment vendor* in Increment 4; tokenizes card credentials
- *default payment method* — first saved method becomes default unless changed

### Acceptance criteria

1. **WHEN** a logged-in customer completes payment during checkout
   **THEN** the system offers a "save this payment method for future orders" option
   **AND** if accepted, a vendor token from *StripeWave* is stored — never the raw card number
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "saved payment methods"; ubiquitous-language.md — *saved payment method* stores only vendor tokens

2. **WHEN** the customer saves a payment method
   **THEN** the *customer account* stores last four digits, card type, and expiry for display
   **AND** the vendor token is used in future transactions — no re-entry of full card details
   **Evidence:** ubiquitous-language.md — *StripeWave* tokenizes card credentials; *saved payment method* stores vendor tokens only

3. **WHEN** the customer saves a second *saved payment method*
   **THEN** both are listed in account settings (see *Manage Saved Payment Methods*)
   **AND** the first saved method remains the *default payment method* unless the customer changes it
   **Evidence:** ubiquitous-language.md — *default payment method* pre-selected at checkout

---

## Story: Manage Saved Payment Methods

**Story type:** user

### Domain terms

- *saved payment method* — tokenized payment credential under the *customer account*
- *default payment method* — pre-selected at the payment step for logged-in customers

### Acceptance criteria

1. **WHEN** the customer opens saved payment methods from account settings
   **THEN** all *saved payment method* are shown with last four digits, card type, and expiry
   **AND** the *default payment method* is visually indicated
   **Evidence:** ubiquitous-language.md — *saved payment method* lifecycle on *customer account*

2. **WHEN** the customer removes a *saved payment method*
   **THEN** the vendor token is deleted and the method no longer appears at checkout
   **BUT** if the removed method was the *default payment method*, the customer is prompted to select a new default
   **Evidence:** ubiquitous-language.md — *saved payment method* associated with *customer account*

3. **WHEN** the customer sets a different *saved payment method* as *default payment method*
   **THEN** the previous default is demoted
   **AND** the new default is pre-selected during future checkouts
   **Evidence:** ubiquitous-language.md — *default payment method* pre-selected at payment step

---

## Story: Select Saved Address at Checkout

**Story type:** user

### Domain terms

- *saved address* — entry from the *address book* selectable at checkout
- *default address* — pre-selected on the shipping step
- *guest checkout* — guest path shows manual address entry only, no *address book*

### Acceptance criteria

1. **WHEN** a logged-in customer reaches the shipping step during checkout
   **THEN** all *saved address* from the *address book* are shown for selection
   **AND** the *default address* is pre-selected
   **Evidence:** ubiquitous-language.md — *saved address* pre-fills checkout shipping step when selected; *default address* pre-selected

2. **WHEN** the customer selects a *saved address*
   **THEN** the shipping address fields are auto-filled with that address
   **AND** checkout advances to the next step without manual entry
   **Evidence:** ubiquitous-language.md — *saved address* pre-fills checkout shipping step

3. **WHEN** the customer chooses to use a new address not in the *address book*
   **THEN** a "use a different address" option reveals manual address entry
   **AND** a "save this address" checkbox adds the new address to the *address book* when checked (see *Save Delivery Address*)
   **Evidence:** ubiquitous-language.md — *address book* accepts new entries from checkout

4. **WHEN** a guest customer (not logged in) reaches the shipping step
   **THEN** no *address book* selection is shown — only manual address entry
   **AND** a prompt to log in or register mentions the benefit of *saved address*
   **BUT** *guest checkout* proceeds without requiring an account
   **Evidence:** ubiquitous-language.md — *guest checkout* remains available alongside logged-in checkout; Increment 1–3 shipping paths preserved

---

## Story: Select Saved Payment Method at Checkout

**Story type:** user

### Domain terms

- *saved payment method* — tokenized credential selectable at the payment step
- *default payment method* — pre-selected for logged-in customers
- *StripeWave* — processes payment via stored token or new card entry

### Acceptance criteria

1. **WHEN** a logged-in customer reaches the payment step during checkout
   **THEN** all *saved payment method* are shown for selection
   **AND** the *default payment method* is pre-selected
   **Evidence:** ubiquitous-language.md — *saved payment method* selection at checkout for logged-in *customer account*

2. **WHEN** the customer selects a *saved payment method*
   **THEN** payment proceeds using the stored vendor token — no card re-entry required
   **AND** last four digits and card type are shown for confirmation
   **Evidence:** ubiquitous-language.md — *StripeWave* receives *saved payment method* token and returns *payment confirmation*

3. **WHEN** the customer chooses to use a new payment method not yet saved
   **THEN** a "use a different payment method" option reveals manual card entry
   **AND** a "save this payment method" checkbox stores the new method when checked (see *Save Payment Method*)
   **Evidence:** ubiquitous-language.md — *StripeWave* tokenizes card credentials for *saved payment method* storage

4. **WHEN** a saved vendor token has expired or been revoked
   **THEN** that *saved payment method* is marked expired or removed from the list
   **AND** remaining valid methods and manual entry are displayed as alternatives
   **BUT** the expired token is never silently used for a charge attempt
   **Evidence:** inferred — token lifecycle management; ubiquitous-language.md — *saved payment method* stores vendor tokens only

---

## Story: View Order History

**Story type:** user

### Domain terms

- *order history* — chronicle of past *order* associated with a *customer account*
- *order status* — current lifecycle state shown per *order*
- *guest checkout* — prior guest *order* retroactively linked when email matches

### Acceptance criteria

1. **WHEN** a logged-in customer opens *order history*
   **THEN** all *order* associated with the *customer account* are listed, most recent first
   **AND** each row shows order number, date, items (condensed), total, and current *order status*
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "order history"; ubiquitous-language.md — *order history* lists past *order* most recent first

2. **WHEN** the customer selects an *order* from the list
   **THEN** full order detail opens: all items, quantities, shipping and billing address snapshots, *delivery option*, masked payment method, and *tracking number* (if shipped)
   **Evidence:** ubiquitous-language.md — *order history* shows *order status*, items, total, and date per *order*

3. **WHEN** the customer has no *order* yet
   **THEN** *order history* shows an empty state with a prompt to start shopping
   **Evidence:** inferred — empty state handling

4. **WHEN** a *guest checkout* *order* was placed before the customer registered with the same email
   **THEN** the guest *order* is retroactively associated with the new *customer account*
   **AND** the *order* appears in *order history*
   **Evidence:** ubiquitous-language.md — *customer account* retroactively associates prior *guest checkout* *order* placed with the same email

---

## Story: Manage Wishlist

**Story type:** user

### Domain terms

- *wishlist* — customer-curated list of *product* requiring logged-in verified *customer account*
- *wishlist item* — single *product* entry on the *wishlist*
- *stock availability* — current availability shown per *wishlist item*

### Acceptance criteria

1. **WHEN** a logged-in customer selects "Add to Wishlist" on a product details page
   **THEN** the *product* is added to the *wishlist*
   **AND** the "Add to Wishlist" control changes to a "Remove from Wishlist" state
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "Wishlists — let customers save things for later"; ubiquitous-language.md — *wishlist* persists on *customer account*

2. **WHEN** the customer opens their *wishlist*
   **THEN** all *wishlist item* are shown with product name, image, price, and current *stock availability*
   **Evidence:** ubiquitous-language.md — *wishlist item* shows current catalog price and *stock availability*

3. **WHEN** the customer selects "Add to Cart" from a *wishlist item*
   **THEN** the *product* is added to the *shopping cart*
   **BUT** the *product* remains on the *wishlist* until explicitly removed
   **Evidence:** ubiquitous-language.md — *wishlist item* adds to *shopping cart* without removing itself

4. **WHEN** the customer removes a *wishlist item*
   **THEN** the *product* is removed from the *wishlist*
   **AND** the "Add to Wishlist" control on that product's details page returns to its default state
   **Evidence:** ubiquitous-language.md — *wishlist item* lifecycle on *wishlist*

5. **WHEN** a guest customer tries to add to *wishlist*
   **THEN** a prompt to log in or register is shown, explaining that *wishlist* requires a verified *customer account*
   **BUT** the product page is not navigated away from — the prompt is dismissible and browsing continues
   **Evidence:** ubiquitous-language.md — *wishlist* requires logged-in verified *customer account*; guest customers see login prompt

---

## Story: Reorder Previous Purchase

**Story type:** user

### Domain terms

- *reorder* — action adding all *order line item* from a past *order* into the *shopping cart*
- *order history* — source list for *reorder*
- *stock availability* — delisted or out-of-stock products handled during *reorder*

### Acceptance criteria

1. **WHEN** the customer selects "Reorder" on a past *order* in *order history*
   **THEN** all *product* from that *order* are added to the *shopping cart* with their original quantities
   **AND** the customer is taken to the cart to review before checkout
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "reorder functionality"; ubiquitous-language.md — *reorder* adds all *order line item* with original quantities

2. **WHEN** a *product* from the original *order* is no longer available (delisted)
   **THEN** available *product* are added to the *shopping cart*
   **AND** a clear message lists which *product* could not be added and why
   **BUT** partial *reorder* succeeds — available items are not blocked
   **Evidence:** ubiquitous-language.md — *reorder* skips delisted *product* with clear message; partial *reorder* succeeds

3. **WHEN** a *product* from the original *order* is currently out of stock
   **THEN** the *product* is added to the *shopping cart* with a *stock availability* warning
   **AND** "proceed anyway" and "remove" options are shown on that line item
   **Evidence:** ubiquitous-language.md — *stock availability* at display time; inferred — out-of-stock handling on *reorder*

4. **WHEN** the customer already has items in the *shopping cart* and reorders
   **THEN** reordered *product* merge into the existing cart
   **AND** if both contain the same *product*, quantities are summed
   **Evidence:** ubiquitous-language.md — *customer session* cart merge logic applies to *reorder* additions

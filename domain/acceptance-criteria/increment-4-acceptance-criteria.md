# Acceptance criteria — Increment 4: Returning customers — accounts, history, reorder

**Increment outcome:** Customers can register, log in, save addresses and payment methods, see their *Order History*, manage a *Wishlist*, and one-click reorder. Account creation is prompted during guest checkout. Lifts repeat-purchase rate without changing the buy flow.

**Builds on:** Increments 1-3 (Store, Catalog, Cart, Guest Checkout, StripeWave, Click-and-Collect, Shipping, Order Lifecycle).

---

## Story: `Register Account`

**Story type:** user

### Domain terms

- *Customer Account* — a persistent identity with email, verified status, and session
- *Registration Form* — the UI collecting email and password for account creation
- *Email Verification* — the step that activates the account (see *Send Email Verification*)

### Acceptance criteria

1. **WHEN** the customer opens the *Registration Form*
   **THEN** the form collects: email address and password (with confirmation)
   **AND** the form shows password requirements clearly before submission
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "Account creation — email verification, password reset, the basics done really well"

2. **WHEN** the customer submits a valid *Registration Form*
   **THEN** a *Customer Account* is created with status *Unverified*
   **AND** the system triggers *Send Email Verification*
   **AND** the customer sees a "check your email to verify" confirmation screen
   **Evidence:** domain-sketch.md — Customer Account KA, `customer account` concept: "is created by the customer via registration"

3. **WHEN** the customer submits an email that is already registered
   **THEN** the form shows an error stating the email is already in use
   **AND** offers a "Log In instead" link
   **BUT** does not reveal whether the existing account is verified or not (information leakage prevention)
   **Evidence:** domain-sketch.md — Customer Account KA, `customer account` invariant: "must have a unique, verified email address"

4. **WHEN** the customer submits a password that does not meet requirements
   **THEN** the form shows which requirements are unmet
   **BUT** the account is not created until all requirements pass
   **Evidence:** inferred — standard registration security; requirements-chat-with-product-owner.md — line 13, "the basics done really well"

---

## Story: `Send Email Verification`

**Story type:** system

### Domain terms

- *Email Verification* — a one-time-use link sent to confirm the customer owns the email address
- *Verification Link* — the URL the customer clicks to verify
- *Customer Account* — the account awaiting verification

### Acceptance criteria

1. **WHEN** a *Customer Account* is created (registration or guest-to-account conversion)
   **THEN** the system sends an *Email Verification* to the registered email address
   **AND** the email contains a *Verification Link* that is unique and time-limited
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "email verification"

2. **WHEN** the *Verification Link* expires (e.g. after 24 hours)
   **THEN** clicking the link shows a clear "link expired" message
   **AND** offers a "resend verification" action
   **Evidence:** domain-sketch.md — Customer Account KA, `email verification` concept: "grants access to account features only after the customer confirms"

3. **WHEN** the email delivery system is temporarily unavailable
   **THEN** the verification email is queued for retry
   **AND** the registration confirmation screen tells the customer to expect the email shortly
   **Evidence:** inferred — email resilience pattern from Increments 2-3

---

## Story: `Verify Email Address`

**Story type:** user

### Domain terms

- *Verification Link* — the unique link from the verification email
- *Verified Status* — the account state after successful verification
- *Customer Account* — the account being verified

### Acceptance criteria

1. **WHEN** the customer clicks a valid, non-expired *Verification Link*
   **THEN** the *Customer Account* transitions to *Verified Status*
   **AND** the customer is redirected to a "you're verified" confirmation page with a prompt to log in
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "email verification"

2. **WHEN** the customer clicks a *Verification Link* that has already been used
   **THEN** the system shows a "already verified" message with a login link
   **BUT** the account is not re-verified or modified
   **Evidence:** inferred — idempotent verification; link is one-time-use

3. **WHEN** the customer clicks an expired *Verification Link*
   **THEN** the system shows a "link expired" message with a "resend verification" action
   **Evidence:** domain-sketch.md — Customer Account KA, `email verification` concept

---

## Story: `Log In`

**Story type:** user

### Domain terms

- *Login Form* — the UI collecting email and password
- *Session* — the authenticated context created after successful login
- *Customer Account* — the identity the customer is logging into
- *Verified Status* — only verified accounts can log in

### Acceptance criteria

1. **WHEN** the customer submits valid credentials on the *Login Form*
   **THEN** a *Session* is created
   **AND** the customer is redirected to their previous page or account dashboard
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "the basics done really well"

2. **WHEN** the customer submits incorrect credentials
   **THEN** the *Login Form* shows a generic "invalid email or password" error
   **BUT** does not specify which field is wrong (credential enumeration prevention)
   **Evidence:** inferred — standard authentication security

3. **WHEN** the customer attempts to log in to an *Unverified* account
   **THEN** the system shows a "please verify your email first" message with a "resend verification" option
   **BUT** no *Session* is created
   **Evidence:** domain-sketch.md — Customer Account KA, `email verification` concept: "grants access to account features only after the customer confirms"

4. **WHEN** the customer has an active *Shopping Cart* from guest browsing and then logs in
   **THEN** the guest cart is merged into the logged-in customer's cart
   **AND** if both carts contain the same product, quantities are summed
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "A shopping cart that persists"

---

## Story: `Log Out`

**Story type:** user

### Domain terms

- *Session* — the authenticated context to be terminated
- *Customer Account* — the logged-in identity

### Acceptance criteria

1. **WHEN** the customer selects "Log Out"
   **THEN** the *Session* is invalidated
   **AND** the customer is redirected to the home page in a guest state
   **Evidence:** inferred — standard logout behavior

2. **WHEN** the customer logs out on one device
   **THEN** only the *Session* on that device is invalidated (other device sessions remain active)
   **AND** a "Log out everywhere" option is shown that invalidates all sessions across devices when selected
   **Evidence:** domain-sketch.md — Customer Account KA, `session` invariant: "must be reliably maintained across devices"

---

## Story: `Reset Password`

**Story type:** user

### Domain terms

- *Password Reset* — the flow for recovering access when the customer has forgotten their password
- *Reset Link* — a unique, time-limited URL sent to the customer's verified email
- *Customer Account* — the account whose password is being reset

### Acceptance criteria

1. **WHEN** the customer requests a password reset by entering their email
   **THEN** the system sends a *Reset Link* to that email (if the account exists)
   **AND** the same "check your email" message is shown regardless of whether the account exists (information leakage prevention)
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "password reset, the basics done really well"

2. **WHEN** the customer clicks a valid, non-expired *Reset Link*
   **THEN** they are taken to a "set new password" form
   **AND** the new password must meet the same requirements as registration
   **Evidence:** inferred — standard password reset flow

3. **WHEN** the customer submits a new password
   **THEN** the password is updated and all existing *Sessions* are invalidated (the customer must re-login)
   **Evidence:** inferred — password change invalidates sessions for security

4. **WHEN** the *Reset Link* has expired or been used
   **THEN** the customer sees a clear "link expired" message with a "Request new reset" action
   **Evidence:** inferred — time-limited, one-time-use link

---

## Story: `Maintain Session Across Devices`

**Story type:** system

### Domain terms

- *Session* — the authenticated context associating a browser or device with a *Customer Account*
- *Cross-Device Persistence* — the ability to stay logged in across multiple devices simultaneously
- *Session Token* — the secure credential that identifies an active session

### Acceptance criteria

1. **WHEN** the customer logs in on a new device
   **THEN** a new *Session* is created for that device
   **AND** existing sessions on other devices remain active
   **Evidence:** domain-sketch.md — Customer Account KA, `session` concept: "authenticated context that keeps the customer logged in across visits"

2. **WHEN** the customer's *Session Token* expires (inactivity timeout or max duration)
   **THEN** the customer is redirected to the *Login Form*
   **AND** any unsaved cart changes are preserved (the cart is tied to the account, not the session)
   **Evidence:** domain-sketch.md — Customer Account KA, `session` invariant: "must be reliably maintained across devices"

3. **WHEN** the customer changes their password (via *Reset Password*)
   **THEN** all *Sessions* on all devices are invalidated
   **AND** the customer must re-authenticate on each device
   **Evidence:** inferred — standard security practice

---

## Story: `Save Delivery Address`

**Story type:** user

### Domain terms

- *Saved Address* — a delivery address persisted to the *Customer Account* for reuse across orders
- *Address Book* — the collection of all saved addresses for a customer
- *Checkout Flow* — during checkout, a logged-in customer can save the address they just entered

### Acceptance criteria

1. **WHEN** a logged-in customer completes checkout with a new shipping address
   **THEN** the system offers a "save this address for future orders" option
   **AND** if accepted, the address is stored in the customer's *Address Book*
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "saved addresses"; domain-sketch.md — Customer Account KA, `saved address` concept

2. **WHEN** the customer saves the first address
   **THEN** that address is automatically marked as the default delivery address
   **Evidence:** inferred — first saved address becomes the default

3. **WHEN** the customer already has addresses in their *Address Book*
   **THEN** the new address is added without replacing existing ones
   **AND** the account settings *Address Book* shows the new entry with a "set as default" option (see *Manage Saved Addresses*)
   **Evidence:** domain-sketch.md — Customer Account KA, `saved address` concept: "aggregated by the customer account's address book"

---

## Story: `Manage Saved Addresses`

**Story type:** user

### Domain terms

- *Address Book* — the list of all saved addresses under the customer account
- *Saved Address* — an individual address entry
- *Default Address* — the address pre-selected during checkout

### Acceptance criteria

1. **WHEN** the customer opens the *Address Book* from their account settings
   **THEN** all *Saved Addresses* are listed with full details
   **AND** the *Default Address* is visually indicated
   **Evidence:** domain-sketch.md — Customer Account KA, `saved address` concept

2. **WHEN** the customer edits a *Saved Address*
   **THEN** the changes are persisted
   **AND** future checkouts using that address reflect the updated details
   **Evidence:** inferred — address management lifecycle

3. **WHEN** the customer deletes a *Saved Address*
   **THEN** the address is removed from the *Address Book*
   **BUT** if the deleted address was the *Default Address*, the customer is prompted to select a new default (or the most recently added becomes default)
   **Evidence:** inferred — default address must always exist if any addresses are saved

4. **WHEN** the customer sets a different address as *Default Address*
   **THEN** the previous default is demoted
   **AND** the new default is pre-selected during future checkouts
   **Evidence:** inferred — single default address per account

---

## Story: `Save Payment Method`

**Story type:** user

### Domain terms

- *Saved Payment Method* — a tokenized payment reference persisted to the customer account for reuse
- *Payment Method* — the vendor-specific instrument (card, wallet, BNPL)
- *Token* — the vendor-provided reference that replaces raw card details (PCI compliance)

### Acceptance criteria

1. **WHEN** a logged-in customer completes a payment during checkout
   **THEN** the system offers a "save this payment method for future orders" option
   **AND** if accepted, a *Token* from the payment vendor is stored — never the raw card number
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "saved payment methods"; domain-sketch.md — Payment KA, `saved payment method` concept

2. **WHEN** the customer saves a payment method
   **THEN** the account stores: last four digits, card type (or vendor label), and the expiry date for display
   **AND** the *Token* is what is used in future transactions — no re-entry of full card details
   **Evidence:** domain-sketch.md — Payment KA, `saved payment method` concept: "tokenised reference stored under the customer account"

3. **WHEN** the customer saves a second payment method
   **THEN** both are listed in the account settings (see *Manage Saved Payment Methods*)
   **AND** the first saved method remains the default unless the customer changes it
   **Evidence:** inferred — multiple saved payment methods supported

---

## Story: `Manage Saved Payment Methods`

**Story type:** user

### Domain terms

- *Payment Methods List* — the collection of saved payment instruments under the account
- *Saved Payment Method* — a tokenized reference (see *Save Payment Method*)
- *Default Payment Method* — the method pre-selected during checkout

### Acceptance criteria

1. **WHEN** the customer opens the *Payment Methods List* from account settings
   **THEN** all saved methods are shown with: last four digits, card type or vendor, and expiry
   **AND** the *Default Payment Method* is visually indicated
   **Evidence:** domain-sketch.md — Payment KA, `saved payment method` concept

2. **WHEN** the customer removes a *Saved Payment Method*
   **THEN** the *Token* is deleted and the method no longer appears at checkout
   **BUT** if the removed method was the *Default Payment Method*, the customer is prompted to select a new default
   **Evidence:** inferred — payment method lifecycle management

3. **WHEN** the customer sets a different method as *Default Payment Method*
   **THEN** the previous default is demoted
   **AND** the new default is pre-selected during future checkouts
   **Evidence:** inferred — single default per account

---

## Story: `Select Saved Address at Checkout`

**Story type:** user

### Domain terms

- *Saved Address* — a delivery address from the customer's *Address Book* (established in Increment 4)
- *Address Selector* — the checkout UI that shows saved addresses for logged-in customers
- *Default Address* — the pre-selected address from the *Address Book*

### Acceptance criteria

1. **WHEN** a logged-in customer reaches the shipping step during checkout
   **THEN** the *Address Selector* shows all *Saved Addresses* from the *Address Book*
   **AND** the *Default Address* is pre-selected
   **Evidence:** domain-sketch.md — Customer Account KA, `saved address` concept: "pre-fills the checkout shipping address step"

2. **WHEN** the customer selects a *Saved Address*
   **THEN** the shipping address fields are auto-filled with that address
   **AND** the checkout advances to the next step without manual entry
   **Evidence:** inferred — convenience of saved addresses

3. **WHEN** the customer wants to use a new address not in the *Address Book*
   **THEN** a "use a different address" option reveals the manual *Address Form*
   **AND** a "save this address" checkbox is shown so the new address is added to the *Address Book* when checked (see *Save Delivery Address*)
   **Evidence:** inferred — saved addresses do not block manual entry

4. **WHEN** a guest customer (not logged in) reaches the shipping step
   **THEN** no *Address Selector* is shown — only the manual *Address Form*
   **AND** a prompt to log in or create an account mentions the benefit of saved addresses
   **Evidence:** domain-sketch.md — Customer Account KA, `guest checkout` concept: "collects shipping and billing details for the single transaction only"

---

## Story: `Select Saved Payment Method at Checkout`

**Story type:** user

### Domain terms

- *Saved Payment Method* — a tokenized payment reference from the customer's account
- *Payment Selector* — the checkout UI showing saved payment methods for logged-in customers
- *Default Payment Method* — the pre-selected method from account settings

### Acceptance criteria

1. **WHEN** a logged-in customer reaches the payment step during checkout
   **THEN** the *Payment Selector* shows all *Saved Payment Methods*
   **AND** the *Default Payment Method* is pre-selected
   **Evidence:** domain-sketch.md — Payment KA, `saved payment method` concept

2. **WHEN** the customer selects a *Saved Payment Method*
   **THEN** the payment proceeds using the stored *Token* — no card re-entry required
   **AND** the customer is shown the last four digits and card type for confirmation
   **Evidence:** inferred — tokenized payment flow

3. **WHEN** the customer wants to use a new payment method not yet saved
   **THEN** a "use a different payment method" option reveals the manual card entry form
   **AND** a "save this payment method" checkbox is shown so the new method is stored when checked (see *Save Payment Method*)
   **Evidence:** inferred — saved methods do not block manual entry

4. **WHEN** a saved payment method's token has expired or been revoked by the vendor
   **THEN** the *Payment Selector* marks that method as "expired" or removes it
   **AND** the remaining valid methods and the manual entry form are displayed as alternatives
   **BUT** the expired token is never silently used for a charge attempt
   **Evidence:** inferred — token lifecycle management

---

## Story: `View Order History`

**Story type:** user

### Domain terms

- *Order History* — the chronological list of all orders placed by the customer
- *Order Summary* — the condensed view per order: order number, date, items, total, and status
- *Customer Account* — only logged-in customers can see order history

### Acceptance criteria

1. **WHEN** a logged-in customer opens *Order History*
   **THEN** all orders associated with the account are listed, most recent first
   **AND** each row shows the *Order Summary*: order number, date, items (condensed), total, and current status
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "order history"

2. **WHEN** the customer selects an order from the list
   **THEN** the full order detail opens: all items, quantities, shipping/billing address, delivery option, payment method (masked), and tracking number (if shipped)
   **Evidence:** inferred — drill-down from history list to order detail

3. **WHEN** the customer has no orders yet
   **THEN** the *Order History* shows an empty state with a prompt to start shopping
   **Evidence:** inferred — empty state handling

4. **WHEN** a guest customer's order was placed before they created an account (same email)
   **THEN** the guest order is retroactively associated with the new account and appears in *Order History*
   **Evidence:** domain-sketch.md — Customer Account KA, `customer account` concept: "aggregates authored customer reviews, order history, wishlist, pet profiles, communication preferences, and session"

---

## Story: `Manage Wishlist`

**Story type:** user

### Domain terms

- *Wishlist* — a collection of products the customer intends to buy later
- *Wishlist Item* — a single product saved to the wishlist
- *Product Details Page* — the page with the "add to wishlist" action

### Acceptance criteria

1. **WHEN** a logged-in customer selects "Add to Wishlist" on a *Product Details Page*
   **THEN** the product is added to the customer's *Wishlist*
   **AND** the "Add to Wishlist" button changes to a "Remove from Wishlist" state
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "Wishlists — let customers save things for later"

2. **WHEN** the customer opens their *Wishlist*
   **THEN** all saved *Wishlist Items* are shown with: product name, image, price, and current *Stock Availability*
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "Wishlists — let customers save things for later"

3. **WHEN** the customer selects "Add to Cart" from a *Wishlist Item*
   **THEN** the product is added to the *Shopping Cart* (same behavior as adding from the Product Details Page)
   **BUT** the product remains on the *Wishlist* until explicitly removed
   **Evidence:** inferred — wishlist is a save-for-later list, not a one-time queue

4. **WHEN** the customer removes a *Wishlist Item*
   **THEN** the product is removed from the *Wishlist*
   **AND** the "Add to Wishlist" button on that product's *Product Details Page* returns to its default state
   **Evidence:** inferred — wishlist item lifecycle

5. **WHEN** a guest customer tries to add to wishlist
   **THEN** a prompt to log in or register is shown, explaining that wishlists require an account
   **BUT** the product page is not navigated away from — the prompt is dismissible and browsing continues
   **Evidence:** domain-sketch.md — Customer Account KA, `wishlist` concept: "is owned exclusively by the logged-in customer account"

---

## Story: `Reorder Previous Purchase`

**Story type:** user

### Domain terms

- *Reorder* — a one-action recreation of a previous order's items in the cart
- *Order History* — the source of the previous order (established in Increment 4)
- *Shopping Cart* — the destination for reordered items

### Acceptance criteria

1. **WHEN** the customer selects "Reorder" on a past order in *Order History*
   **THEN** all products from that order are added to the *Shopping Cart* with their original quantities
   **AND** the customer is taken to the cart to review before checkout
   **Evidence:** requirements-chat-with-product-owner.md — line 13, "reorder functionality — that's really important for pet owners. They buy the same food, the same litter, the same treats"

2. **WHEN** a product from the original order is no longer available (delisted)
   **THEN** the available products are added to the cart
   **AND** a clear message lists which products could not be added and why
   **BUT** the reorder is not blocked — partial reorder succeeds
   **Evidence:** inferred — product lifecycle can outlast order history

3. **WHEN** a product from the original order is currently *Out of Stock*
   **THEN** the product is added to the cart with a stock warning
   **AND** a "proceed anyway" option and a "remove" option are shown on that line item
   **Evidence:** domain-sketch.md — Product Catalog KA, `stock availability` concept

4. **WHEN** the customer already has items in their *Shopping Cart* and reorders
   **THEN** the reordered products are merged into the existing cart
   **AND** if both contain the same product, quantities are summed
   **Evidence:** inferred — same merge logic as login cart merge

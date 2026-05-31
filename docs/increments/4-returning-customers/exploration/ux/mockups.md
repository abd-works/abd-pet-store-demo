# Mockups

# Lo-fi — Increment 4: Returning customers

> **Companion to** `docs/increments/4-returning-customers/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 4 — Returning customers (22 screens, 16 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 2–3 checkout patterns; Increment 4 account screens AC-derived) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| State file | `docs/increments/4-returning-customers/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/4-returning-customers/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-24 |

## Description

Lo-fi wireframes for returning-customer capabilities: *customer account* registration and login with mandatory *email verification*, password reset, account settings (*address book*, *saved payment method*), *order history* with *reorder*, *wishlist*, and logged-in checkout with *saved address* / *saved payment method* selection. **Guest checkout paths from Increments 2–3 are preserved** — manual shipping address entry with optional login/register prompt; no account required to complete purchase.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1–3 lo-fi patterns, `interface-design.md` checkout branching, and standard e-commerce account conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 2–3 | checkout progress | nav-tabs | Dynamic spine: cart → billing → shipping → delivery option → payment |
| Inc 2 | guest checkout | split-screen form | Manual address entry; validation feedback regions |
| Inc 3 | shipping address step | split-screen form | Guest-only manual entry baseline preserved |
| AC | register / log in | form | Email + password only; no social login |
| AC | address book | sidebar list | Default indicator column; edit/delete/set default actions |
| AC | saved payment methods | sidebar list | Last four digits, card type, expiry; expired token dimmed |
| AC | wishlist | sidebar list + modal | Guest prompt dismissible; product remains on page |
| AC | checkout saved entities | listbox + form | Saved selection pre-selects default; alternate path reveals manual entry + save checkbox |

**Design principles applied:** Extend Increment 2–3 header chrome with log in/register (guest) or account/wishlist (logged in); listbox for saved address/payment selection; form for registration, login, and manual entry; explicit validation feedback regions per AC.

---

## Screens

### register account

**Layout:** form  
**AC stories:** Register Account

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — guest | header | toolbar | find stores · shop supplies · shopping cart · log in · register (primary) | Guest chrome; no account menu |
| registration form | body | form | email address · password · confirm password · password requirements · create account (primary) | Password requirements visible before submit |
| registration validation feedback | body | form | email already in use error · password requirements unmet error · log in instead | Duplicate email does not reveal verification status |

### registration confirmation

**Layout:** stack  
**AC stories:** Register Account · Send Email Verification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| email verification pending | body | form | check your email to verify · expect verification email shortly · resend verification | Shown after successful registration; email queued for retry when delivery unavailable |

### log in

**Layout:** form  
**AC stories:** Log In · Maintain Session Across Devices (cart merge)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| login form | body | form | email address · password · log in (primary) · forgot password | Redirect to previous page or account dashboard on success |
| login validation feedback | body | form | invalid email or password error · please verify your email first · resend verification | Generic credential error; unverified blocks account-only session |

### verify email — success

**Layout:** stack  
**AC stories:** Verify Email Address

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| verification success | body | form | you're verified — log in to continue · log in (primary) | Valid link transitions account verification status to verified |

### verify email — link expired

**Layout:** stack  
**AC stories:** Verify Email Address · Send Email Verification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| verification expired | body | form | link expired message · already verified message · resend verification (primary) · log in | Covers expired and already-used link states |

### reset password — request

**Layout:** form  
**AC stories:** Reset Password

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| reset request form | body | form | email address · send reset link (primary) | Same confirmation message whether account exists |
| reset request confirmation | body | form | check your email (same message regardless) | Enumeration-safe messaging |

### reset password — set new password

**Layout:** form  
**AC stories:** Reset Password · Maintain Session Across Devices

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| set new password form | body | form | new password · confirm password · password requirements · link expired — request new reset · set new password (primary) | Password change invalidates all customer sessions |

### account dashboard

**Layout:** sidebar  
**AC stories:** Log Out · Maintain Session Across Devices

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · wishlist · account (primary) | Logged-in chrome |
| account settings nav | panel | nav-tabs | overview (active) · address book · saved payment methods · order history | Settings hub |
| account overview | body | form | customer account email · account verification status · log out · log out everywhere | Current device logout vs invalidate all sessions |

### address book

**Layout:** sidebar  
**AC stories:** Manage Saved Addresses · Save Delivery Address

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| saved address list | body | list | label · address summary · default address indicator · edit · delete · set as default address (primary) | Default visually indicated; first saved address auto-default |
| delete default address prompt | body | form | select new default address prompt | Shown when deleting default with other saved address remain |

### edit saved address

**Layout:** form  
**AC stories:** Manage Saved Addresses

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| saved address form | body | form | recipient name · address line 1 · address line 2 (optional) · city · postcode · country · cancel · save saved address (primary) | Changes persist to future checkouts |

### saved payment methods

**Layout:** sidebar  
**AC stories:** Manage Saved Payment Methods · Save Payment Method

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| saved payment method list | body | list | last four digits · card type · expiry · default payment method indicator · remove · set as default payment method (primary) | Vendor token only — no raw card stored |
| expired token state | body | form | expired saved payment method removed | Expired/revoked tokens not silently used |

### order history

**Layout:** sidebar  
**AC stories:** View Order History · Reorder Previous Purchase

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| order history list | body | list | order number · date · items condensed · total · order status · select order · reorder (primary) | Most recent first; guest orders retroactively linked |
| order history empty state | body | form | no orders yet — start shopping · shop supplies (primary) | Empty state when no orders |

### order history detail

**Layout:** stack  
**AC stories:** View Order History · Reorder Previous Purchase

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| order detail | body | form | order number · order status · order line item list · shipping address snapshot · billing address snapshot · delivery option · masked payment method · tracking number · back to order history · reorder (primary) | Full detail on select; reorder navigates to cart |

### product page — wishlist

**Layout:** stack  
**AC stories:** Manage Wishlist

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| product header | body | form | product name · price · stock availability · add to cart (primary) · add to wishlist · remove from wishlist | Toggle state after add; requires verified customer account |

### wishlist — guest prompt

**Layout:** modal  
**AC stories:** Manage Wishlist

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| guest wishlist prompt | body | form | wishlist requires verified customer account · log in · register · dismiss (primary) | Dismissible; product page stays visible underneath |

### wishlist page

**Layout:** sidebar  
**AC stories:** Manage Wishlist

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| wishlist item list | body | list | product name · price · stock availability · add to cart (primary) · remove from wishlist | Add to cart does not remove from wishlist |

### guest checkout — shipping address

**Layout:** split-screen  
**AC stories:** Select Saved Address at Checkout (guest path) · Enter Shipping Address (Inc 3 preserved)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| shipping address | left | form | recipient name · address line 1 · city · postcode · country | Manual entry only — no address book |
| guest account prompt | left | form | log in or register for saved address benefit · log in · register | Prompt only; guest checkout proceeds without account |
| order summary | right | form | shipping address preview · cart total · back · continue to delivery option (primary) | Increment 3 guest path unchanged |

### logged-in checkout — saved address

**Layout:** split-screen  
**AC stories:** Select Saved Address at Checkout · Save Delivery Address

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| saved address selection | left | listbox | home — default address (selected) · office — saved address · use a different address | Default address pre-selected |
| selected saved address preview | left | form | auto-filled shipping address fields | Auto-fill on selection; advance without manual entry |
| order summary | right | form | selected saved address preview · cart total · continue to delivery option (primary) | |

### logged-in checkout — new address

**Layout:** split-screen  
**AC stories:** Select Saved Address at Checkout · Save Delivery Address

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| manual shipping address | left | form | recipient name · address line 1 · city · postcode · country · save this address for future orders (checkbox) | Revealed via use a different address; first saved becomes default address |

### logged-in checkout — saved payment method

**Layout:** split-screen  
**AC stories:** Select Saved Payment Method at Checkout · Save Payment Method

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| saved payment method selection | left | listbox | Visa •••• 4242 — default payment method (selected) · Mastercard •••• 8210 · use a different payment method · expired saved payment method (dimmed) | Token payment — no card re-entry |
| payment confirmation | left | form | last four digits and card type confirmation | |
| order review summary | right | form | order line item list · shipping address · order total · confirm order (primary) | StripeWave sole payment vendor |

### logged-in checkout — new payment method

**Layout:** split-screen  
**AC stories:** Select Saved Payment Method at Checkout · Save Payment Method

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| StripeWave card entry | left | form | StripeWave (sole payment vendor) · card number · expiry · CVV · save this payment method for future orders (checkbox) | Manual entry when use a different payment method selected |

### shopping cart — after reorder

**Layout:** sidebar  
**AC stories:** Reorder Previous Purchase · Log In (cart merge)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| reorder feedback | body | form | partial reorder — product could not be added · stock availability warning on line item · proceed anyway · remove line item | Partial reorder succeeds; delisted products listed |
| cart item list | body | list | product name · quantity · line total · remove | Reordered products merge with existing cart quantities |
| cart summary | panel | form | cart total · continue shopping · proceed to checkout (primary) | Review before checkout |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| email address · password · confirm password · password requirements | Register Account | AC 1 — form collects email and password with requirements shown |
| create account | Register Account | AC 2 — creates customer account unverified; triggers Send Email Verification |
| check your email to verify | Register Account | AC 2 — confirmation screen after registration |
| email already in use error · log in instead | Register Account | AC 3 — duplicate email error without revealing verification status |
| password requirements unmet error | Register Account | AC 4 — shows unmet requirements; no account created |
| resend verification | Send Email Verification | AC 2 — offered when link expired |
| expect verification email shortly | Send Email Verification | AC 3 — queued retry messaging |
| log in | Log In | AC 1 — creates customer session; redirect to dashboard or previous page |
| invalid email or password error | Log In | AC 2 — generic credential error |
| please verify your email first | Log In | AC 3 — unverified blocks account-only session |
| guest cart merge on login | Log In | AC 4 — guest shopping cart merges with account cart |
| log out · log out everywhere | Log Out | AC 1–2 — current device vs all sessions |
| send reset link · check your email | Reset Password | AC 1 — enumeration-safe reset request |
| set new password | Reset Password | AC 2–3 — new password meets requirements; invalidates all sessions |
| link expired — request new reset | Reset Password | AC 4 — expired or used reset link |
| you're verified — log in to continue | Verify Email Address | AC 1 — valid link verifies account |
| already verified message | Verify Email Address | AC 2 — one-time link already used |
| link expired message | Verify Email Address | AC 3 — expired verification link |
| saved address list · default address indicator | Manage Saved Addresses | AC 1 — all saved address listed; default indicated |
| edit saved address · save saved address | Manage Saved Addresses | AC 2 — edits persist to future checkouts |
| delete saved address · select new default address prompt | Manage Saved Addresses | AC 3–4 — delete and change default |
| saved payment method list · default payment method indicator | Manage Saved Payment Methods | AC 1 — last four digits, card type, expiry shown |
| remove saved payment method | Manage Saved Payment Methods | AC 2 — token deleted; prompt new default if needed |
| set as default payment method | Manage Saved Payment Methods | AC 3 — new default pre-selected at checkout |
| save this address for future orders | Save Delivery Address | AC 1 — offered after checkout with new address |
| first saved address as default | Save Delivery Address | AC 2 — automatic default assignment |
| save this payment method for future orders | Save Payment Method | AC 1 — StripeWave token stored on accept |
| last four digits and card type confirmation | Save Payment Method | AC 2 — display metadata without raw card |
| saved address selection · default pre-selected | Select Saved Address at Checkout | AC 1 — address book shown; default pre-selected |
| auto-filled shipping address fields | Select Saved Address at Checkout | AC 2 — selection auto-fills and advances |
| use a different address · save this address checkbox | Select Saved Address at Checkout | AC 3 — manual entry with optional save |
| guest manual shipping only · log in or register prompt | Select Saved Address at Checkout | AC 4 — guest checkout preserved; no address book |
| saved payment method selection · default pre-selected | Select Saved Payment Method at Checkout | AC 1 — all methods shown; default pre-selected |
| confirm order with stored token | Select Saved Payment Method at Checkout | AC 2 — payment via vendor token |
| use a different payment method · save checkbox | Select Saved Payment Method at Checkout | AC 3 — manual StripeWave entry with optional save |
| expired saved payment method dimmed | Select Saved Payment Method at Checkout | AC 4 — expired token not silently charged |
| order history list · order status | View Order History | AC 1 — orders most recent first with status |
| order detail fields · tracking number | View Order History | AC 2 — full detail on select |
| order history empty state | View Order History | AC 3 — empty state prompt |
| add to wishlist · remove from wishlist | Manage Wishlist | AC 1 · AC 4 — toggle and remove states |
| wishlist item list · stock availability | Manage Wishlist | AC 2 — items with price and availability |
| add to cart from wishlist | Manage Wishlist | AC 3 — adds without removing from wishlist |
| guest wishlist prompt · dismiss | Manage Wishlist | AC 5 — login prompt; dismissible |
| reorder | Reorder Previous Purchase | AC 1 — all products added; navigate to cart |
| partial reorder message | Reorder Previous Purchase | AC 2 — delisted products skipped with message |
| stock availability warning · proceed anyway · remove | Reorder Previous Purchase | AC 3 — out-of-stock warning on line |
| cart merge on reorder | Reorder Previous Purchase | AC 4 — quantities summed with existing cart |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| register account | Register Account | customer account · account verification status · email verification |
| registration confirmation | Register Account · Send Email Verification | customer account · email verification · verification link |
| log in | Log In | customer session · customer account · shopping cart |
| verify email — success | Verify Email Address | verification link · account verification status · customer account |
| verify email — link expired | Verify Email Address · Send Email Verification | verification link · email verification |
| reset password — request | Reset Password | customer account |
| reset password — set new password | Reset Password · Maintain Session Across Devices | customer account · customer session |
| account dashboard | Log Out · Maintain Session Across Devices | customer account · customer session · account verification status |
| address book | Manage Saved Addresses · Save Delivery Address | address book · saved address · default address |
| edit saved address | Manage Saved Addresses | saved address · address book |
| saved payment methods | Manage Saved Payment Methods · Save Payment Method | saved payment method · default payment method · StripeWave |
| order history | View Order History · Reorder Previous Purchase | order history · order · order status · reorder |
| order history detail | View Order History · Reorder Previous Purchase | order · order line item · delivery option · tracking number |
| product page — wishlist | Manage Wishlist | wishlist · wishlist item · product · stock availability · shopping cart |
| wishlist — guest prompt | Manage Wishlist | wishlist · customer account |
| wishlist page | Manage Wishlist | wishlist · wishlist item · product · stock availability · shopping cart |
| guest checkout — shipping address | Select Saved Address at Checkout | guest checkout · shipping address · saved address |
| logged-in checkout — saved address | Select Saved Address at Checkout · Save Delivery Address | saved address · address book · default address |
| logged-in checkout — new address | Select Saved Address at Checkout · Save Delivery Address | saved address · address book · default address |
| logged-in checkout — saved payment method | Select Saved Payment Method at Checkout · Save Payment Method | saved payment method · default payment method · StripeWave |
| logged-in checkout — new payment method | Select Saved Payment Method at Checkout · Save Payment Method | saved payment method · StripeWave |
| shopping cart — after reorder | Reorder Previous Purchase · Log In | shopping cart · reorder · stock availability · product |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Social login | Increment 4 scope guard — email + password only |
| PayNova / VaultPay | StripeWave sole active payment vendor |
| Customer pet CRUD | Deferred per thin-slicing / UL scope |
| Communication preferences UI | Deferred per Increment 4 scope |
| Express / same-day delivery | Deferred per Increment 3 scope guard |
| Return flow | Deferred to Increment 7 |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout manual shipping | Select Saved Address at Checkout AC 4 — guest path unchanged |
| Increment 2 click-and-collect checkout | Builds on Increments 1–3; C&C path uses billing → pickup store → payment (no shipping) |
| StripeWave-only payment | Increment 4 scope guard |

---

## CLI

```powershell
node "c:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/4-returning-customers/exploration/ux/mockups-state.json" --out "docs/increments/4-returning-customers/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | 22 Increment 4 screens (auth, account settings, wishlist, checkout saved entities, guest preserve); state JSON + drawio generated. |

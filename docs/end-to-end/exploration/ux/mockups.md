# Mockups

Whole-solution lo-fi wireframe specs. Screen `.drawio` companions live in this folder.

## Increment 1: Walk-in driver — find the store, see what's in stock

> **Companion to** `docs/increments/1-walk-in-driver/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — Walk-in driver (5 screens, 6 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| State file | `docs/increments/1-walk-in-driver/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/1-walk-in-driver/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-24 |

## Description

Lo-fi wireframes for the payment-free, account-free Increment 1 customer path (store locator, product catalog, product detail page) and the bare-bones staff *admin dashboard* stock form. Interaction decisions lock control types, primary actions, and conditional states (location optional, distance when provided, per-store stock rows). No cart, checkout, login, or search UI.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow `information-architecture.md` and production e-commerce conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| IA | store locator | split-screen + nav-tabs | map/list tabs; location entry left; store detail right |
| IA | product catalog | sidebar listbox + list grid | category filter; product rows |
| IA | product detail page | stack | breadcrumb; image listbox; stock list |
| IA | admin dashboard | form | store/product dropdowns; stock level text; validation feedback |

**Design principles applied:** listbox for category filter; list for tabular store/product/stock rows; form for location entry and staff stock update; no cart or account chrome.

---

## Screens

### store locator — map view

**Layout:** split-screen  
**AC stories:** View Store Map · Calculate Distance to Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores (primary) · shop supplies | Persistent Increment 1 paths only |
| store locator tab bar | header | nav-tabs | map view (active) · list view | Inactive list view tab greyed |
| location entry | left | form | postcode (text) · distance (read-only when set) · share location · clear location | Distance blank until postcode or shared location |
| map view | left | list | store name · distance columns · select store point | All stores shown without search filter |
| store detail panel | right | form | address · operating hours · contact details · distance · close panel | Populated when store point selected |

**Conditional states:**
- No location: distance column empty; stores in default order
- Location provided: distance populated; nearest-first sort

### store locator — list view

**Layout:** split-screen  
**AC stories:** View Store List · Calculate Distance to Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies | Same as map view |
| store locator tab bar | header | nav-tabs | map view · list view (active) | Sibling screen |
| location entry | left | form | postcode · share location · clear location | Same as map view |
| list view | left | list | store name · address · distance · select store row | All stores without search |
| store detail panel | right | form | address · operating hours · contact details · distance | Same panel as map view |

### product catalog

**Layout:** sidebar  
**AC stories:** View Product Details (browse prerequisite)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies (primary) | Landing path from store locator |
| category filter | panel | listbox | category names | Category-only browse — no keyword search |
| product grid | body | list | product name · category · thumbnail · select product | Opens product detail page |

### product detail page

**Layout:** stack  
**AC stories:** View Product Details · Display Real-Time Stock Availability

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies | No purchase/cart/review actions |
| breadcrumb | header | toolbar | product catalog · product name (current) | Back to catalog |
| product header | body | form | product name · category (read-only) | |
| image gallery | body | listbox | product image thumbnails | previous image · next image on description row |
| description | body | form | description · weight · dimensions | Read-only product facts |
| stock availability by store | body | list | store name · stock availability · distance · select store link | Real-time on load; links to store locator |

### admin dashboard — stock levels

**Layout:** form  
**AC stories:** Update Product Stock Levels

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header band | Minimal staff chrome |
| stock levels form | body | form | store (dropdown) · product (dropdown) · stock level (text) · validation feedback · save (primary) · cancel | Per-store update only; invalid input shows feedback without corrupting prior stock level |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| map view store points | View Store Map | AC 1 — all stores on map at geo-coordinates |
| store detail panel fields | View Store Map | AC 2 — address, operating hours, contact details on select |
| list view tab | View Store List | AC 1 — list alternative to map |
| list view rows | View Store List | AC 1–2 — name, address; detail on select |
| postcode / share location | Calculate Distance to Store | AC 1 — distance calculated and nearest-first |
| clear location | Calculate Distance to Store | AC 2 — browse without distance |
| category filter | View Product Details | AC 4 — browse by category, no keyword search |
| select product | View Product Details | AC 1 — product page with images, description, weight/dimensions |
| image gallery controls | View Product Details | AC 3 — navigate multiple product images |
| stock availability by store | Display Real-Time Stock Availability | AC 1–3 — per-store availability on product page load |
| store / product / stock level | Update Product Stock Levels | AC 1–4 — staff form, validation, per-store granularity |

---

## Per-screen annotations (drawio companion)

Story and domain term lists for each screen match `information-architecture.md`:

| Screen | Stories | Domain terms |
| --- | --- | --- |
| store locator — map view | View Store Map · Calculate Distance to Store | store · store locator · distance |
| store locator — list view | View Store List · Calculate Distance to Store | store · address · distance |
| product catalog | *(browse enables View Product Details)* | product catalog · category · product |
| product detail page | View Product Details · Display Real-Time Stock Availability | product · product image · category · stock availability · store |
| admin dashboard — stock levels | Update Product Stock Levels | store · product · stock availability |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/1-walk-in-driver/exploration/ux/mockups-state.json" --out "docs/increments/1-walk-in-driver/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Five Increment 1 screens from IA; state JSON + drawio generated. |

## Increment 2: Click-and-collect — buy online, pick up at the store

> **Companion to** `docs/increments/2-click-and-collect/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 2 — Click-and-collect (8 screens, 11 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 2 checkout/staff screens derived from AC) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| State file | `docs/increments/2-click-and-collect/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/2-click-and-collect/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-24 |

## Description

Lo-fi wireframes for the guest *click-and-collect* purchase path: extend Increment 1 *product page* with *add to cart*, session-scoped *shopping cart*, checkout (*pickup store* selection, *guest checkout* / *billing address*, *StripeWave* *payment*), *order confirmation page*, and staff *click-and-collect queue* / *pickup fulfillment*. No customer accounts, shipping address UI, PayNova, or VaultPay.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1 patterns (`docs/increments/1-walk-in-driver/exploration/ux/mockups.md`), `information-architecture.md`, and standard e-commerce checkout conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 1 | product detail page | stack + listbox + list | Extended with purchase actions and cart indicator |
| AC | shopping cart | sidebar list + summary panel | Quantity edit, remove, validation, empty-state guard |
| AC | click-and-collect store selection | split-screen | Sole *delivery option*; store list with distance; no shipping address |
| AC | guest checkout — billing address | split-screen form | *guest email* + *billing address*; no login/register |
| AC | payment — StripeWave | split-screen form | Card fields only; processing/decline/unavailable feedback |
| AC | order confirmation page | stack | Order summary + dismissible account prompt |
| AC | click-and-collect queue | sidebar list | Staff queue oldest-first; stock warnings |
| AC | click-and-collect order detail | form + list | *mark prepared* / *mark collected* actions |

**Design principles applied:** Extend Increment 1 chrome (header nav, breadcrumb, staff header); checkout progress tabs across customer screens; list for tabular cart/queue rows; form for address and card entry; explicit labelled validation feedback regions per AC.

---

## Screens

### product page — add to cart

**Layout:** stack  
**AC stories:** Add Product to Cart · Display Real-Time Stock Availability (Increment 1)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | Cart indicator reflects visible item count |
| breadcrumb | header | toolbar | product catalog · product name (current) | Same as Increment 1 |
| product header | body | form | product name · category (read-only) | |
| image gallery | body | listbox | product image thumbnails | Same as Increment 1 |
| description | body | form | description · weight · dimensions | Same as Increment 1 |
| stock availability by store | body | list | store name · stock availability · distance | Gates add-to-cart when out of stock |
| purchase actions | body | form | unavailability message · add to cart (primary) | Disabled or message when out of stock; merges duplicate *cart item* |

**Conditional states:**
- In stock: add to cart enabled
- Out of stock: add to cart disabled; unavailability message shown

### shopping cart

**Layout:** sidebar  
**AC stories:** Add Product to Cart · Update Cart Quantity · Remove Product from Cart

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | |
| checkout progress | header | nav-tabs | shopping cart (active) · pickup store · billing address · payment | Linear checkout spine |
| cart item list | body | list | product name · quantity · line total · remove | Quantity text input; line total recalculates |
| cart validation feedback | body | form | validation error on cart item | Stock/invalid quantity errors; prior quantity unchanged |
| cart summary | panel | form | cart total · visible item count indicator · continue shopping · proceed to checkout (primary) | Checkout disabled when empty |

**Conditional states:**
- Empty cart: empty-state message; continue shopping only; no proceed to checkout
- Last item removed: same empty state

### click-and-collect store selection

**Layout:** split-screen  
**AC stories:** Select Click-and-Collect Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | |
| checkout progress | header | nav-tabs | shopping cart · pickup store (active) · billing address · payment | |
| delivery option | left | form | click-and-collect (sole delivery option) | Only option shown; no shipping |
| location entry | left | form | postcode · distance note · share location · clear location | Optional; all stores listed without location |
| pickup store list | left | list | store name · address · operating hours · distance · select pickup store | Distance-sorted when location known |
| checkout summary | right | form | pickup store name · pickup store address · cart total · back · continue to billing address (primary) | Summary updates on store select |

### guest checkout — billing address

**Layout:** split-screen  
**AC stories:** Check Out as Guest · Enter Billing Address

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | No login · no registration links |
| checkout progress | header | nav-tabs | shopping cart · pickup store · billing address (active) · payment | |
| guest contact | left | form | guest email · name | Default guest path; email validated before payment |
| billing address | left | form | name · address line 1 · address line 2 (optional) · city · county/state · postcode · country | Required fields per AC |
| billing validation feedback | left | form | validation error on guest email · validation error on billing address | Blocks advance to payment |
| order summary | right | form | pickup store · billing address preview · cart total · back · continue to payment (primary) | Billing shown in summary after entry |

### payment — StripeWave

**Layout:** split-screen  
**AC stories:** Select Payment Method · Process Card Payment via StripeWave

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | |
| checkout progress | header | nav-tabs | shopping cart · pickup store · billing address · payment (active) | |
| payment vendor | left | form | StripeWave (sole payment vendor) | PayNova and VaultPay not shown |
| card details | left | form | card number · expiry · CVV | Card validation before confirm |
| payment validation feedback | left | form | validation error · decline message · service unavailable · processing indicator · retry payment | Processing while in flight; retry on decline/unavailable |
| order review summary | right | form | order line item list · pickup store details · billing address · order total · back · confirm order (primary) | Triggers StripeWave on confirm |

### order confirmation page

**Layout:** stack  
**AC stories:** Confirm Order and Send Confirmation Email · Check Out as Guest (account prompt)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies (primary) | Post-purchase; cart cleared |
| order confirmation | body | form | order number · order line item list · total paid · masked payment method · pickup store address · operating hours · confirmation email sent to guest email · continue shopping (primary) | Shown even if email queued for retry |
| customer account prompt | body | form | create customer account value prop · create account · dismiss (primary) | Dismissible; order already placed |

### click-and-collect queue

**Layout:** sidebar  
**AC stories:** Prepare Click-and-Collect Orders for Pickup · Fulfill Click-and-Collect Order

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header band | Minimal staff chrome (Increment 1 pattern) |
| pickup store selector | panel | form | pickup store (dropdown) | Filters queue to employee's store |
| click-and-collect queue | body | list | order number · order line item summary · guest email · status · stock warning · select order | Oldest first; stock warning on line |
| queue empty state | body | form | all orders collected | When no pending orders |

### click-and-collect order detail

**Layout:** form  
**AC stories:** Prepare Click-and-Collect Orders for Pickup · Fulfill Click-and-Collect Order

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header band | |
| order detail | body | form | order number · status · guest email · pickup store | guest email for staff outreach |
| order line item list | body | list | product name · quantity · stock warning | Per-line stock warnings |
| pickup fulfillment actions | body | button-bar | back to click-and-collect queue · mark prepared (primary) · mark collected | prepared: confirmed → ready for pickup; collected: ready → collected |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| add to cart | Add Product to Cart | AC 1 — product added as cart item qty 1; count updates |
| add to cart (duplicate merge) | Add Product to Cart | AC 2 — quantity increments, no duplicate line |
| unavailability message / disabled add to cart | Add Product to Cart | AC 3 — out of stock blocked |
| shopping cart (count) | Add Product to Cart | AC 1, 4 — visible item count indicator |
| quantity on cart item | Update Cart Quantity | AC 1 — line total and cart total recalculate |
| remove cart item | Remove Product from Cart | AC 1 — item removed; totals update |
| empty cart state / continue shopping | Remove Product from Cart | AC 2, 3 — empty guidance; no checkout |
| proceed to checkout | Check Out as Guest | AC 1 — guest checkout default without login |
| click-and-collect (sole delivery option) | Select Click-and-Collect Store | AC 1 — only delivery option; store list with address, hours, distance |
| select pickup store | Select Click-and-Collect Store | AC 2 — pickup store recorded; no shipping address |
| postcode / share location | Select Click-and-Collect Store | AC 3 — optional distance sort |
| pickup store in checkout summary | Select Click-and-Collect Store | AC 4 — summary shows chosen store |
| guest email · name | Check Out as Guest | AC 1 — guest contact collected; no login/register |
| validation error on guest email | Check Out as Guest | AC 3 — invalid email blocked |
| billing address fields | Enter Billing Address | AC 1 — required address fields collected |
| validation error on billing address | Enter Billing Address | AC 2 — missing fields highlighted; no advance to payment |
| billing address preview | Enter Billing Address | AC 3 — shown in order summary |
| StripeWave (sole payment vendor) | Select Payment Method | AC 1 — only StripeWave; card number, expiry, CVV |
| validation error on card details | Select Payment Method | AC 3 — invalid card blocked before payment |
| confirm order | Process Card Payment via StripeWave | AC 1 — initiates StripeWave; processing indicator |
| payment decline message · retry payment | Process Card Payment via StripeWave | AC 3 — decline reason; retry offered |
| payment service temporarily unavailable | Process Card Payment via StripeWave | AC 5 — unavailable message; retry after wait |
| order number · order line item list · total · pickup store | Confirm Order and Send Confirmation Email | AC 1 — order confirmation page content |
| confirmation email sent to guest email | Confirm Order and Send Confirmation Email | AC 1, 2 — email with pickup details |
| customer account prompt · dismiss | Check Out as Guest | AC 4 — post-order dismissible account creation |
| click-and-collect queue list | Prepare Click-and-Collect Orders for Pickup | AC 1 — confirmed orders oldest first with guest email |
| stock warning on queue row | Prepare Click-and-Collect Orders for Pickup | AC 3 — out-of-stock warning; guest email for outreach |
| mark prepared | Prepare Click-and-Collect Orders for Pickup | AC 2 — confirmed → ready for pickup |
| mark collected | Fulfill Click-and-Collect Order | AC 1 — ready for pickup → collected |
| queue empty state | Fulfill Click-and-Collect Order | AC 3 — all orders collected |

---

## Per-screen annotations (drawio companion)

Story and domain term lists for each screen:

| Screen | Stories | Domain terms |
| --- | --- | --- |
| product page — add to cart | Add Product to Cart | shopping cart · cart item · product · product page · stock availability |
| shopping cart | Add Product to Cart · Update Cart Quantity · Remove Product from Cart | shopping cart · cart item · product · stock availability |
| click-and-collect store selection | Select Click-and-Collect Store | click-and-collect · pickup store · store · delivery option |
| guest checkout — billing address | Check Out as Guest · Enter Billing Address | guest checkout · guest email · billing address |
| payment — StripeWave | Select Payment Method · Process Card Payment via StripeWave | StripeWave · payment vendor · payment · payment confirmation |
| order confirmation page | Confirm Order and Send Confirmation Email · Check Out as Guest | order confirmation page · order · order line item · pickup store · confirmation email · guest email |
| click-and-collect queue | Prepare Click-and-Collect Orders for Pickup · Fulfill Click-and-Collect Order | click-and-collect queue · pickup fulfillment · store employee · order · guest email |
| click-and-collect order detail | Prepare Click-and-Collect Orders for Pickup · Fulfill Click-and-Collect Order | pickup fulfillment · order · order line item · guest email · pickup store |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Login / registration before purchase | Check Out as Guest AC 1 — guest checkout default only |
| Shipping address UI | click-and-collect sole delivery option |
| PayNova / VaultPay | Select Payment Method AC 1 — StripeWave only |
| Saved payment methods | Increment 2 scope guard |
| Cross-session cart persistence | Add Product to Cart AC 5 — session-scoped |

---

## CLI

```powershell
node "c:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/2-click-and-collect/exploration/ux/mockups-state.json" --out "docs/increments/2-click-and-collect/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Eight Increment 2 screens (customer checkout + staff fulfillment); state JSON + drawio generated. |

## Increment 4: Returning customers — accounts, history, reorder

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

## Increment 5: Pay your way — multi-vendor payment with retries

> **Companion to** `docs/increments/5-pay-your-way/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 5 — Pay your way (13 screens, 3 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 2–4 checkout patterns; Increment 5 payment screens AC-derived) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 119) |
| State file | `docs/increments/5-pay-your-way/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/5-pay-your-way/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-25 |

## Description

Lo-fi wireframes extending checkout *payment method selector* to present *StripeWave*, *PayNova* (*digital wallet*), and *VaultPay* (*buy-now-pay-later*) alongside *saved payment method* tokens for logged-in customers. Covers PayNova wallet authentication, VaultPay *eligibility check* and *instalment plan*, *hard decline* alternative-vendor paths, automatic *payment retry* for *transient error*, retry exhaustion, and save-as-*saved payment method* offers. **Guest checkout and Increment 1–4 paths are preserved** — *StripeWave* card behaviour unchanged; selector now shows all three vendors.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 2–4 lo-fi patterns and standard multi-vendor checkout conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 2–4 | checkout progress | nav-tabs | Dynamic spine ending at payment (active) |
| Inc 2 | StripeWave payment | split-screen form | Card fields + validation feedback — behaviour preserved |
| Inc 4 | saved payment method selection | listbox | Default pre-selected; expired token dimmed |
| AC | payment method selector | listbox | Radio-style vendor tiles: StripeWave · PayNova · VaultPay · saved tokens |
| AC | PayNova flow | form + chrome | Redirect/embed wallet authentication; cancel returns to selector |
| AC | VaultPay flow | form | BNPL redirect; *instalment plan* summary before accept |
| AC | hard decline | form | Decline reason + switch-vendor actions — no auto-retry |
| AC | payment retry | form | "retrying payment" indicator; background continuation on navigate-away |
| AC | retry exhaustion | form | Failure message + full *payment method selector* with manual card entry |

**Design principles applied:** Extend Increment 4 payment step with multi-vendor *payment method selector* listbox; preserve split-screen order review; explicit feedback regions for decline, retry, and unavailable states; logged-in paths extend saved-method listbox with PayNova/VaultPay token rows.

---

## Screens

### guest checkout — payment method selector

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — guest | header | toolbar | find stores · shop supplies · shopping cart · log in · register | Guest chrome preserved from Increments 2–4 |
| checkout progress | header | nav-tabs | shopping cart · billing address · shipping address · delivery option · payment (active) | Dynamic spine per fulfillment path |
| payment method selector | left | listbox | StripeWave — card (selected) · PayNova — digital wallet · VaultPay — buy-now-pay-later | All three vendors visible; StripeWave default selection |
| payment method hint | left | form | StripeWave and PayNova and VaultPay remain selectable after cancel | Vendor-switch affordance per PayNova AC 1 |
| order review summary | right | form | order line item list · shipping address · delivery option · order total · back · continue with selected payment method (primary) | Advances to vendor-specific sub-flow |

### guest checkout — StripeWave card entry

**Layout:** split-screen  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| checkout progress | header | nav-tabs | … · payment (active) | |
| payment method selector summary | left | form | StripeWave — card (selected) · change payment method | Selected vendor shown; link back to selector |
| StripeWave card details | left | form | card number · expiry · CVV | Card validation before confirm — behaviour unchanged from Increment 2–4 |
| payment validation feedback | left | form | validation error on card details · payment decline message · processing indicator | Transient failure triggers automatic *payment retry* |
| order review summary | right | form | order line item list · order total · confirm order (primary) | Initiates StripeWave *payment* |

### guest checkout — PayNova wallet flow

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| checkout progress | header | nav-tabs | … · payment (active) | |
| PayNova wallet authentication | left | form | PayNova — digital wallet · redirecting to PayNova wallet authentication · authorise payment with mobile wallet credentials | Redirect or embed PayNova flow |
| PayNova cancel affordance | left | form | cancel PayNova wallet flow · return to payment method selector | *StripeWave* and *VaultPay* remain selectable on cancel |
| order review summary | right | form | order line item list · order total · awaiting PayNova authorisation | Order not confirmed until *payment confirmation* |

### guest checkout — PayNova hard decline

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| PayNova decline feedback | left | form | hard decline reason from PayNova · insufficient wallet balance example · wallet locked example | Decline reason as much as PayNova provides |
| alternative payment vendors | left | button-bar | retry with PayNova · switch to StripeWave (primary) · switch to VaultPay | No *order* confirmed; no *confirmation email* |
| order review summary | right | form | order total · order remains unpaid | *Hard decline* — no automatic *payment retry* |

### guest checkout — VaultPay BNPL flow

**Layout:** split-screen  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| VaultPay BNPL redirect | left | form | VaultPay — buy-now-pay-later · redirecting to VaultPay BNPL flow | Redirect or embed VaultPay |
| eligibility check status | left | form | VaultPay eligibility check in progress | Per-transaction *eligibility check* |
| instalment plan summary | left | form | instalment plan schedule · accept instalment plan (primary) · decline instalment plan | Customer must accept *instalment plan* before capture |
| order review summary | right | form | order line item list · order total · awaiting VaultPay approval | |

### guest checkout — VaultPay hard decline

**Layout:** split-screen  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| VaultPay decline feedback | left | form | buy-now-pay-later not available for this transaction · eligibility failed · credit check failed | VaultPay decision — not PawPlace's |
| alternative payment vendors | left | button-bar | switch to StripeWave (primary) · switch to PayNova | No *order* confirmed |
| order review summary | right | form | order total · order remains unpaid | *Hard decline* — no automatic *payment retry* |

### guest checkout — payment retry in progress

**Layout:** split-screen  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| payment retry indicator | left | form | retrying payment · automatic payment retry in progress · attempt count within retry window | Shown on *transient error* — no manual action during auto-retries |
| same vendor note | left | form | retrying through same payment vendor | Same-vendor *payment retry* invariant |
| order review summary | right | form | order total · payment not yet confirmed | Customer may navigate away — retry continues in background |

### guest checkout — payment retry exhausted

**Layout:** split-screen  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| retry exhaustion feedback | left | form | payment could not be processed · retry window exhausted | After final failed attempt within *retry window* |
| payment method selector | left | listbox | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later · manual card entry | Full selector restored with all vendor options |
| order review summary | right | form | order total · order remains unpaid | |

### order confirmation — multi-vendor payment

**Layout:** stack  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| order confirmation | body | form | order number · order line item list · total paid · masked payment method · payment vendor label · confirmation email sent | Shown after successful *payment confirmation* from any vendor |
| vendor-specific payment detail | body | form | PayNova vendor transaction reference · VaultPay instalment reference · StripeWave last four digits | Vendor-appropriate masked detail |

### logged-in checkout — payment method selector

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · wishlist · account | Logged-in chrome from Increment 4 |
| checkout progress | header | nav-tabs | … · payment (active) | |
| saved payment method selection | left | listbox | Visa •••• 4242 — StripeWave default (selected) · PayNova wallet — saved payment method · VaultPay — saved payment method · use a different payment method | Multi-vendor *saved payment method* tokens |
| payment method selector | left | listbox | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later | Shown when use a different payment method selected |
| expired saved payment method | left | form | expired saved payment method (dimmed) | Expired tokens not silently charged |
| order review summary | right | form | order total · confirm order (primary) | |

### logged-in checkout — save PayNova saved payment method

**Layout:** modal  
**AC stories:** Process Digital Wallet Payment via PayNova

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| save PayNova prompt | body | form | save PayNova as saved payment method for future orders · save PayNova wallet (primary) · not now | Offered after successful PayNova *payment* for logged-in customer |
| token storage note | body | form | only PayNova vendor token stored — not wallet secrets | Token-only storage invariant |

### logged-in checkout — save VaultPay saved payment method

**Layout:** modal  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| save VaultPay prompt | body | form | save VaultPay as saved payment method for future orders · save VaultPay identity (primary) · not now | Offered after successful VaultPay *payment* |
| eligibility reminder | body | form | future VaultPay checkout pre-fills identity but requires eligibility check per transaction | Per-transaction *eligibility check* invariant |

### account notification — background payment retry outcome

**Layout:** stack  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| background retry success | body | form | payment retry succeeded — order confirmed · view order confirmation | *Payment retry* continued after navigate-away |
| background retry failure | body | form | payment could not be processed — retry window exhausted · return to payment method selector (primary) | Guest email or account notification on exhaustion |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| payment method selector — StripeWave · PayNova · VaultPay | Process Digital Wallet Payment via PayNova | AC 1 — customer selects PayNova at selector |
| PayNova wallet authentication · authorise payment | Process Digital Wallet Payment via PayNova | AC 1 — redirect/embed wallet flow; mobile wallet credentials |
| cancel PayNova wallet flow · return to payment method selector | Process Digital Wallet Payment via PayNova | AC 1 — StripeWave and VaultPay remain selectable on cancel |
| order confirmation after PayNova payment confirmation | Process Digital Wallet Payment via PayNova | AC 2 — order confirmed; vendor transaction reference; confirmation email |
| hard decline reason · retry PayNova · switch StripeWave · switch VaultPay | Process Digital Wallet Payment via PayNova | AC 3 — hard decline surfaces reason and alternatives; no order confirmed |
| webhook callback reconciliation note | Process Digital Wallet Payment via PayNova | AC 4 — system reconciles in-flight payment (no customer screen — noted in spec) |
| save PayNova as saved payment method | Process Digital Wallet Payment via PayNova | AC 5 — token-only save for logged-in customer |
| VaultPay BNPL redirect · eligibility check | Process Buy-Now-Pay-Later via VaultPay | AC 1 — VaultPay performs eligibility check |
| instalment plan summary · accept instalment plan | Process Buy-Now-Pay-Later via VaultPay | AC 1–2 — plan presented and accepted before capture |
| order confirmation after VaultPay payment confirmation | Process Buy-Now-Pay-Later via VaultPay | AC 2 — order confirmed with instalment reference |
| buy-now-pay-later not available · switch StripeWave · switch PayNova | Process Buy-Now-Pay-Later via VaultPay | AC 3 — hard decline; VaultPay decision |
| save VaultPay as saved payment method · eligibility check per transaction | Process Buy-Now-Pay-Later via VaultPay | AC 5 — token save; pre-fill with per-transaction eligibility |
| retrying payment indicator | Retry Failed Payment | AC 1 — automatic retry on transient error; no manual action |
| payment retry through same payment vendor | Retry Failed Payment | AC 1 — same-vendor retry invariant |
| order confirmation after retry success | Retry Failed Payment | AC 2 — order confirmed as if first attempt succeeded |
| retry window exhausted · payment method selector restored | Retry Failed Payment | AC 3 — exhaustion returns full selector |
| hard decline — no automatic payment retry | Retry Failed Payment | AC 4 — immediate decline reason and alternative vendors |
| background payment retry · account notification | Retry Failed Payment | AC 5 — retry continues on navigate-away; notify on success or exhaustion |
| StripeWave card entry unchanged | Retry Failed Payment | Scope guard — StripeWave behaviour preserved |
| saved payment method listbox — multi-vendor tokens | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay | AC 5 both stories — logged-in save flows |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| guest checkout — payment method selector | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | payment method selector · StripeWave · PayNova · VaultPay · payment vendor · payment |
| guest checkout — StripeWave card entry | Retry Failed Payment | StripeWave · payment · transient error · payment retry |
| guest checkout — PayNova wallet flow | Process Digital Wallet Payment via PayNova | PayNova · digital wallet · payment method selector · payment confirmation |
| guest checkout — PayNova hard decline | Process Digital Wallet Payment via PayNova · Retry Failed Payment | hard decline · payment method selector · PayNova · StripeWave · VaultPay |
| guest checkout — VaultPay BNPL flow | Process Buy-Now-Pay-Later via VaultPay | VaultPay · buy-now-pay-later · eligibility check · instalment plan · payment confirmation |
| guest checkout — VaultPay hard decline | Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | hard decline · buy-now-pay-later · payment method selector |
| guest checkout — payment retry in progress | Retry Failed Payment | payment retry · transient error · retry window · payment vendor |
| guest checkout — payment retry exhausted | Retry Failed Payment | payment retry · retry window · payment method selector |
| order confirmation — multi-vendor payment | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | order · payment confirmation · confirmation email · vendor transaction reference · instalment plan |
| logged-in checkout — payment method selector | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay | saved payment method · default payment method · payment method selector · PayNova · VaultPay · StripeWave |
| logged-in checkout — save PayNova saved payment method | Process Digital Wallet Payment via PayNova | saved payment method · PayNova · digital wallet · customer account |
| logged-in checkout — save VaultPay saved payment method | Process Buy-Now-Pay-Later via VaultPay | saved payment method · VaultPay · eligibility check · customer account |
| account notification — background payment retry outcome | Retry Failed Payment | payment retry · order · confirmation email · payment method selector |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Full *return* customer flow | Deferred to Increment 7 — *refund* routing foundation only in UL |
| *Pet* · *appointment* UI | Deferred to Increment 6 |
| Express / same-day delivery | Deferred per Increment 3 scope guard |
| Social login | Increment 4 scope guard preserved |
| Admin payment reconciliation UI | System/back-office — webhook AC is system story |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout paths (Increments 2–3) | Scope guard — guest paths remain valid |
| *StripeWave* card flow behaviour | Unchanged — selector adds vendors without altering card UX |
| Logged-in saved address / saved payment patterns | Increment 4 patterns extended with PayNova/VaultPay tokens |
| Increment 4 sole-vendor deferral superseded | All three vendors active at *payment method selector* |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/5-pay-your-way/exploration/ux/mockups-state.json" --out "docs/increments/5-pay-your-way/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-25 | initial | 13 Increment 5 screens (multi-vendor selector, PayNova wallet, VaultPay BNPL, retry states, logged-in save flows); state JSON + drawio generated. |

## Increment 6: Pet visits — gallery and in-store appointments

> **Companion to** `docs/increments/6-pet-visits/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 6 — Pet visits (13 screens: gallery, profiles, booking flow, account appointments, staff board + actions, notification preview) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 6 screens AC-derived — no Design/ images) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (Run 7 exploration, slot 145–146 cycle) |
| State file | `docs/increments/6-pet-visits/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/6-pet-visits/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-26 |

## Description

Lo-fi wireframes for the adoption side of PawPlace going live in Increment 6. Customers browse the *Pet Gallery* (species filter), open a *Pet Profile Page* (available or adopted state), and book an *Appointment* to visit a pet at a *Store*. Booking is **customer-account-only** — guest users see an auth gate that holds the *Selected Slot*. Staff access the *Incoming Appointments* board, *Check-In* arriving customers, record a *Visit Outcome* (including the adopted path), set *Follow-Up Actions*, and manage *Pet Profiles* (including *Mark Pet as Adopted*). System transactional notifications are shown as a preview screen. Builds on Increments 1–5 navigation chrome and account patterns.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1–5 lo-fi patterns and standard appointment booking UX conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 1 | species/category filter | listbox | Sidebar selection; active item highlighted; all-option at top |
| Inc 1 | store list | list | Rows with photo · name · fields · action |
| Inc 4 | account nav | nav-tabs | Account area tabs — Profile · Orders · Appointments active |
| AC | pet gallery | list + listbox | Species filter sidebar + pet card rows (photo, name, breed, species, store) |
| AC | pet profile | stack form | Photo gallery thumbnails + info fields + store section + CTA |
| AC | appointment booking | form | Calendar slot picker → visit note textarea → confirm button |
| AC | guest auth gate | modal | "Appointments require a customer account" — sign-in primary + hold notice |
| AC | staff incoming appointments | list | Sorted by date/time; check-in / outcome / no-show actions per row |
| AC | staff record outcome | form | Outcome listbox (4 options) + staff visit notes textarea |
| AC | staff set follow-up | form | Follow-up action listbox + date picker |
| AC | staff pet profile editor | form | All pet fields editable; mark adopted action; photo upload list |
| AC | notification preview | stack | Email content preview with pet · store · date/time · note fields |

**Design principles applied:** Extend Increment 1–4 chrome (navigation, tabs, list patterns); use species filter listbox matching category filter pattern; appointment booking mirrors standard date/time picker + confirmation flow; staff board extends admin dashboard list pattern with per-row inline actions; account appointments tab is a new tab in the account area established in Increment 4.

---

## Screens

### pet gallery

**Layout:** sidebar  
**AC stories:** Browse Pets by Species

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Pets added to primary nav in Increment 6; logged-in chrome from Increment 4 |
| breadcrumb | header | chrome | breadcrumb | Home › Pets |
| species filter | panel | listbox | All (selected) · Dogs · Cats · Reptiles · Small Mammals | Filter is a sidebar listbox; active item highlighted; "All" is default |
| pet gallery grid | body | list | pet photo · pet name · breed · species · store name | Each row is a *Pet Card*; action: select pet card |
| gallery empty state | body | form | No pets available in this category right now · species filter remains active | Shown when filtered species has no available pets; other species remain visible |

---

### pet profile page — available

**Layout:** stack  
**AC stories:** View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail (selected) | Photo gallery thumbnails; selected photo displayed large above; action: select thumbnail |
| pet info | body | form | name · species · breed · age · temperament notes (optional) | *Temperament Notes* field omitted when empty (not shown as blank) |
| store location | body | form | store name · store address · operating hours · distance from customer location | Distance shown when customer location available; prompt to share location when absent |
| pet status | body | form | Available badge | *Pet Status* displayed as Available badge |
| book a visit CTA | body | button-bar | Book a Visit (primary) | Links to appointment booking flow; visible only when *Pet Status* is *Available* |

---

### pet profile page — adopted

**Layout:** stack  
**AC stories:** View Pet Profile (adopted state)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail | Adopted pets remain viewable — not deleted from gallery |
| pet info | body | form | name · species · breed · age · temperament notes | Same fields; profile remains viewable |
| store location | body | form | store name · store address · operating hours | Distance section preserved |
| pet status — adopted | body | form | Adopted badge | *Pet Status* displayed as Adopted badge instead of Available |
| book a visit — disabled | body | form | Book a Visit (disabled) | Button hidden or disabled; no appointment booking when *Pet Status* is *Adopted* |

---

### book appointment — guest auth gate

**Layout:** modal  
**AC stories:** Confirm Appointment Booking (guest block)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| auth gate prompt | body | form | Appointments require a customer account · Sign In (primary) · Register | Guest cannot confirm; slot held temporarily while customer authenticates |
| slot hold notice | body | form | Your selected slot is held for 10 minutes | Temporary hold preserved during auth so customer doesn't lose the slot |

---

### book appointment — select time slot

**Layout:** form  
**AC stories:** View Available Time Slots at Store · Select Date and Time Slot

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | pet name · store name · store address | Context carried forward from pet profile; read-only |
| appointment calendar | body | listbox | date header (next 14 days) · 10:00 AM · 11:00 AM (selected) · 12:00 PM · 2:00 PM · 3:00 PM | *Available Time Slots* list; already-booked slots absent; selected slot highlighted; 10-min hold on selection |
| no slots available notice | body | form | No slots available — try a later date | Shown when all slots in date range are booked |
| slot hold notice | body | form | Slot held for 10 minutes — complete booking to confirm | Shown after selection to indicate temporary hold |
| slot released notice | body | form | Your selected slot is no longer held — please select a new time | Shown when temporary hold expires before customer confirms; AC Select Date and Time Slot AC 2 |
| continue | body | button-bar | Continue (primary) · Back to pet profile | Proceeds to visit note + confirm step |

---

### appointment confirmation — review and note

**Layout:** form  
**AC stories:** Add Visit Note · Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment summary | body | form | pet name · store name · date · time slot | Read-only booking summary before confirm |
| visit note | body | form | Visit Note (optional textarea — up to 500 characters) · character count remaining | Optional field; blank note omitted from staff view (not "empty") |
| visit note validation | body | form | validation error: visit note exceeds 500 characters | Shown when note exceeds character limit; booking not submitted until within limits |
| confirm booking | body | button-bar | Confirm Booking (primary) · Back to slot selection | Confirms the *Appointment Booking*; transitions *Time Slot* from available to booked |

---

### appointment booking confirmed

**Layout:** stack  
**AC stories:** Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| confirmation header | body | form | Appointment confirmed! · booking reference | Confirmation page shown after successful booking |
| booking details | body | form | pet name · store name · date/time · visit note (if provided) · Appointment Confirmation Email sent to customer email | Full booking summary; email notice matches AC |
| post-confirmation actions | body | button-bar | View My Appointments (primary) · Browse More Pets | Navigate to appointment list or back to gallery |

---

### customer account — appointments

**Layout:** stack  
**AC stories:** View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| account nav | header | nav-tabs | Profile · Orders · Appointments (active) · Wishlist · Saved Payments | Account area tab from Increment 4; Appointments tab added in Increment 6 |
| upcoming appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · status badge · Cancel | Upcoming *Appointments* sorted soonest first; "pet adopted" badge + Cancel + Browse other pets when pet is *Adopted* |
| past appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · outcome | *Past Appointments* below upcoming; cancelled appointments shown with *Cancelled* status |
| appointments empty state | body | form | No appointments yet — Browse the Pet Gallery | Shown when no appointments exist; prompt links to *Pet Gallery* |

---

### staff — incoming appointments

**Layout:** stack  
**AC stories:** View Incoming Appointments · Check In Customer · Record No-Show

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome; minimal nav |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments (active) · Pet Profiles | *Incoming Appointments* tab active; staff-area navigation |
| appointments list | body | list | customer name · pet name · date/time · visit note (if any) · status · Check In · Record Outcome · Mark No-Show | All booked *Appointments* for this *Store*; sorted by date/time soonest first; "pet adopted" warning badge + notification status when applicable; "no check-in" indicator on past-due unvisited rows |
| already checked in | body | form | already checked in — checked in at [original Checked-In Time] | Conditional inline alert; shown when Check In is triggered but customer already checked in (Check In Customer AC 3) |
| cancelled appointment block | body | form | this appointment was cancelled — no further action available | Conditional inline alert; shown when Check In is triggered on a cancelled appointment (Check In Customer AC 4) |
| customer already checked in | body | form | customer was already checked in — no-show cannot be recorded | Conditional inline alert; shown when Mark No-Show is triggered but customer was already checked in (Record No-Show AC 4) |
| appointments empty state | body | form | No upcoming appointments | Standard empty state |

---

### staff — record outcome

**Layout:** form  
**AC stories:** Record Visit Outcome · Set Follow-Up Action

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time | Read-only; identifies the appointment being recorded |
| outcome selector | body | listbox | Adopted (selected) · Interested — Returning · Not a Fit · Browsing Only | Four *Visit Outcome* options; selecting *Adopted* triggers pet status transition; *Interested — Returning* prompts follow-up |
| staff visit notes | body | form | Staff Visit Notes (optional textarea) | *Staff Visit Notes* free-text; optional (notes-less outcome accepted) |
| outcome already recorded notice | body | form | Outcome already recorded: [existing outcome] · Override | Shown when outcome exists; override available to correction-authority staff |
| submit | body | button-bar | Record Outcome (primary) · Cancel | Saves *Visit Outcome* + *Staff Visit Notes*; *Adopted* path also transitions *Pet Status* |

---

### staff — set follow-up action

**Layout:** form  
**AC stories:** Set Follow-Up Action · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time · outcome recorded | Context from prior outcome or no-show step |
| follow-up action | body | listbox | None · Schedule Return Visit · Hold Pet · Send Adoption Paperwork | *Follow-Up Action* options; *Hold Pet* shows hold-expiry date field; *Schedule Return Visit* shows booking-flow link |
| follow-up date | body | form | Follow-Up Date (date picker) | When the follow-up notification fires; required if action is not None |
| schedule return visit link | body | form | Book new appointment for [customer name] with [pet name] | Shown only when *Schedule Return Visit* selected; staff-assisted rebooking link |
| hold expiry | body | form | Hold expires: [date] | Shown only when *Hold Pet* selected; pet remains *Available* with hold note |
| submit | body | button-bar | Set Follow-Up (primary) · Skip | Saves *Follow-Up Action* + *Follow-Up Date*; Skip omits follow-up (None) |

---

### staff — pet profile editor

**Layout:** form  
**AC stories:** Update Pet Profile · Mark Pet as Adopted

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Shared staff chrome |
| pet info form | body | form | name · species · breed · age · temperament notes · store (dropdown) | All *Pet Profile* fields editable; store dropdown for pet relocation |
| pet photo gallery — manage | body | list | photo thumbnail · alt text · remove | Existing photos listed; Upload Photo button adds to gallery additively; Remove deletes individual photo |
| pet status — mark adopted | body | form | Status: Available (dropdown — Available / Adopted) | Changing to *Adopted* triggers *Mark Pet as Adopted* flow + notifications to affected customers |
| already adopted notice | body | form | This pet is already adopted | Shown when attempting to re-mark an already-adopted pet |
| save / cancel | body | button-bar | Save Changes (primary) · Cancel | Saves profile; customer-facing *Pet Profile Page* reflects changes immediately |

---

### notification preview — appointment reminder

**Layout:** stack  
**AC stories:** Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | body | nav-tabs | Appointment Reminder (active) · Pet Adopted Before Visit · Visit Follow-Up | Preview selector for three transactional notification types |
| appointment reminder preview | body | form | Subject: Your appointment with [pet name] is tomorrow · pet name · store address · date/time · visit note | *Appointment Reminder* sent 24 hours before appointment; suppressed if cancelled or pet adopted |
| pet adopted before visit preview | body | form | Subject: [pet name] has been adopted · pet name · adoption status · Cancel Appointment (primary) · Browse Other Pets | *Pet Adopted Before Visit Notification* sent when staff marks pet adopted; includes cancel/rebook options |
| visit follow-up preview | body | form | Subject: Follow-up on your visit with [pet name] · pet name · store · follow-up context | *Visit Follow-Up Notification* triggered on *Follow-Up Date*; suppressed if pet adopted before date |
| resilience note | body | form | Email queued for retry when delivery system unavailable | Same email resilience pattern as order confirmation (Increments 2–5) |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| species filter listbox — All · Dogs · Cats · Reptiles · Small Mammals | Browse Pets by Species | AC 1–2 — filter by species; active filter visible |
| pet gallery grid rows — photo · name · breed · species · store | Browse Pets by Species | AC 1 — Pet Card fields |
| gallery empty state message | Browse Pets by Species | AC 3 — no pets in category; filter remains active |
| pet photo gallery thumbnails | View Pet Profile | AC 1 — Pet Photo Gallery |
| pet info fields: name · species · breed · age · temperament notes | View Pet Profile | AC 1 — profile fields; temperament notes omitted when empty per AC 4 |
| pet status: Available badge / Adopted badge | View Pet Profile | AC 2–3 — Book a Visit shown when Available; Adopted badge shown when Adopted |
| Book a Visit CTA (primary) / disabled | View Pet Profile | AC 2–3 — CTA present when Available; hidden/disabled when Adopted |
| store name · address · operating hours · distance | View Pet Store Location and Distance | AC 1–2 — store info + distance when location available |
| distance prompt — share location / enter postcode | View Pet Store Location and Distance | AC 3 — no distance without reference point |
| store name link → Store Detail page | View Pet Store Location and Distance | AC 4 — opens Increment 1 Store Detail |
| appointment calendar — available time slots listbox | View Available Time Slots at Store | AC 1 — Available Time Slots at store for next N days |
| already-booked slots absent from listbox | View Available Time Slots at Store | AC 2 — booked slots not shown |
| no slots available notice | View Available Time Slots at Store | AC 3 — empty calendar message |
| selected slot highlighted + slot hold notice | Select Date and Time Slot | AC 1 — slot held 10 minutes on selection |
| slot released notice (hold expired) | Select Date and Time Slot | AC 2 — hold expires; customer must re-select |
| double-booking block (AC 3) | Select Date and Time Slot | AC 3 — system-level; no customer screen; noted in spec |
| visit note textarea (optional, 500-char limit) | Add Visit Note | AC 1 — optional field with character limit |
| blank note proceeds without note field | Add Visit Note | AC 2 — blank note omitted from staff view |
| visit note validation error (over limit) | Add Visit Note | AC 3 — validation error; booking not submitted |
| guest auth gate modal — sign in / register | Confirm Appointment Booking | AC 2 — guest blocked; slot held during auth |
| Confirm Booking (primary) — creates Appointment Booking | Confirm Appointment Booking | AC 1 — booking created with pet · store · date/time · note |
| appointment confirmation page + email sent notice | Confirm Appointment Booking | AC 1 — confirmation page + email |
| slot transitions to booked (hidden from gallery) | Confirm Appointment Booking | AC 3 — slot no longer shown to other customers |
| email delivery failure (queued for retry) | Confirm Appointment Booking | AC 4 — booking not gated on email; retry queued |
| upcoming appointments list (soonest first) | View Upcoming and Past Appointments | AC 1 — sorted; pet · store · date/time · note fields |
| past appointments list | View Upcoming and Past Appointments | AC 1 — past entries below upcoming |
| "pet adopted" badge on appointment entry | View Upcoming and Past Appointments | AC 3 — adopted badge + Cancel + Browse other pets |
| appointments empty state → Browse Pet Gallery | View Upcoming and Past Appointments | AC 2 — empty state with browse prompt |
| Cancel appointment action | Cancel or Rebook Appointment After Pet Adoption | AC 2 — cancellation releases slot; moves to Cancelled in list |
| Browse other pets / Rebook | Cancel or Rebook Appointment After Pet Adoption | AC 3 — navigates to Pet Gallery for new booking |
| "pet adopted" warning + no-action rows remain | Cancel or Rebook Appointment After Pet Adoption | AC 4 — neither cancelled nor rebooked; staff see warning |
| staff appointments list — customer · pet · date/time · note · status | View Incoming Appointments | AC 1 — all store appointments sorted by date/time |
| "pet adopted" badge + notification status on staff row | View Incoming Appointments | AC 2 — adoption warning visible on staff board |
| Check In action → checked-in time recorded | Check In Customer | AC 1 — records checked-in time + staff member |
| early/late check-in allowed (actual arrival time) | Check In Customer | AC 2 — checked-in time ≠ slot start |
| "already checked in" message + original time | Check In Customer | AC 3 — idempotent check-in |
| "appointment was cancelled" block on check-in | Check In Customer | AC 4 — cancelled appointments cannot transition forward |
| Mark No-Show action → no-show recorded | Record No-Show | AC 2 — records staff member + timestamp |
| "no check-in" indicator on past-due rows | Record No-Show | AC 1 — Mark No-Show action available on overdue appointments |
| follow-up notification triggered on no-show | Record No-Show | AC 3 — system notification; no separate customer screen |
| "customer was already checked in" block | Record No-Show | AC 4 — mutually exclusive states |
| outcome selector: 4 options listbox | Record Visit Outcome | AC 1 — Adopted · Interested — Returning · Not a Fit · Browsing Only |
| Adopted outcome → pet status transitions | Record Visit Outcome | AC 2 — same adoption path as Mark Pet as Adopted |
| Interested — Returning prompts follow-up | Record Visit Outcome | AC 3 — prompts Set Follow-Up Action step |
| staff visit notes textarea (optional) | Record Visit Outcome | AC 5 — notes optional |
| outcome already recorded + override | Record Visit Outcome | AC 4 — existing outcome shown; override for correction authority |
| follow-up action listbox (None · Schedule · Hold · Paperwork) | Set Follow-Up Action | AC 1 — action type + follow-up date saved |
| Hold Pet → hold expiry date | Set Follow-Up Action | AC 2 — pet remains Available; hold note displayed |
| Schedule Return Visit → booking link | Set Follow-Up Action | AC 3 — staff-assisted rebooking |
| follow-up notification triggered on Follow-Up Date | Set Follow-Up Action | AC 4 — Visit Follow-Up Notification fires on date |
| pet info fields + store dropdown editable | Update Pet Profile | AC 1 — all fields editable including store location |
| save changes → immediate customer-facing update | Update Pet Profile | AC 2 — profile page reflects changes immediately |
| photo gallery management — upload additively | Update Pet Profile | AC 3 — additive upload; existing photos not replaced unless removed |
| store transfer → store-change notification | Update Pet Profile | AC 4 — relocation triggers notification to affected customers |
| pet status dropdown → Mark as Adopted | Mark Pet as Adopted | AC 1 — status transitions Available → Adopted; Book a Visit disabled |
| notification triggered for pending appointments | Mark Pet as Adopted | AC 2 — Pet Adopted Before Visit Notification sent to affected customers |
| already adopted notice | Mark Pet as Adopted | AC 3 — idempotent; no change if already adopted |
| appointment reminder preview (24h before) | Send Appointment Reminder | AC 1 — pet · store · date/time · note in reminder |
| reminder suppressed if cancelled | Send Appointment Reminder | AC 2 — no reminder for cancelled appointments |
| reminder suppressed if pet adopted | Send Appointment Reminder | AC 3 — adopted notification takes precedence |
| email queued for retry | Send Appointment Reminder | AC 4 — email resilience pattern |
| pet adopted before visit notification — cancel/rebook options | Send Pet Adopted Before Visit Notification | AC 1 — notification includes cancel + browse options |
| notification status on staff view | Send Pet Adopted Before Visit Notification | AC 2 — staff sees "notified" / "not yet notified" |
| no notification when no pending appointments | Send Pet Adopted Before Visit Notification | AC 3 — appointment-dependent |
| email retry when delivery unavailable | Send Pet Adopted Before Visit Notification | AC 4 — badge shown regardless of email failure |
| visit follow-up notification preview | Send Visit Follow-Up Notification | AC 1 — fires on Follow-Up Date with pet · store · follow-up context |
| no follow-up when action is None | Send Visit Follow-Up Notification | AC 2 — follow-up is opt-in by staff |
| follow-up suppressed if pet adopted | Send Visit Follow-Up Notification | AC 3 — adopted notification takes precedence |
| follow-up email retry | Send Visit Follow-Up Notification | AC 4 — same resilience pattern |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| pet gallery | Browse Pets by Species | Pet Gallery · Species · Pet Card · Pet · Store |
| pet profile page — available | View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store | Pet Profile Page · Pet · Pet Status · Pet Photo Gallery · Temperament Notes · Store · Distance · Customer Location · Time Slot · Available Time Slots · Appointment Calendar |
| pet profile page — adopted | View Pet Profile (adopted state) | Pet Profile Page · Pet · Pet Status · Adopted |
| book appointment — guest auth gate | Confirm Appointment Booking | Customer Account · Selected Slot · Appointment Booking |
| book appointment — select time slot | View Available Time Slots at Store · Select Date and Time Slot | Time Slot · Available Time Slots · Appointment Calendar · Selected Slot |
| appointment confirmation — review and note | Add Visit Note · Confirm Appointment Booking | Visit Note · Appointment · Appointment Booking |
| appointment booking confirmed | Confirm Appointment Booking | Appointment Booking · Appointment Confirmation Page · Appointment Confirmation Email · Customer Account |
| customer account — appointments | View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption | Appointment List · Upcoming Appointment · Past Appointment · Customer Account · Appointment Cancellation · Rebook · Pet Adopted Before Visit |
| staff — incoming appointments | View Incoming Appointments · Check In Customer · Record No-Show | Incoming Appointments · Store Employee · Appointment · Check-In · Checked-In Time · No-Show · No-Show Recorded By · No-Show Recorded At |
| staff — record outcome | Record Visit Outcome · Set Follow-Up Action | Visit Outcome · Staff Visit Notes · Appointment · Follow-Up Action · Follow-Up Date |
| staff — set follow-up action | Set Follow-Up Action · Send Visit Follow-Up Notification | Follow-Up Action · Follow-Up Date · Visit Follow-Up Notification |
| staff — pet profile editor | Update Pet Profile · Mark Pet as Adopted | Pet Profile · Store Employee · Pet Photo Gallery · Pet Status · Adopted · Pet |
| notification preview — appointment reminder | Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification | Appointment Reminder · Pet Adopted Before Visit Notification · Visit Follow-Up Notification · Customer Account · Appointment |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Full returns / refunds UI | Deferred to Increment 7 |
| *Product* / checkout / payment UI | Increments 1–5 — preserved, not reproduced here |
| Online pet adoption paperwork form | Physical process — staff handles offline (noted via Follow-Up Action) |
| Admin notification settings | Back-office scope; notification content is configurable but not a customer screen |
| Pet availability calendar per store | Out of scope for Increment 6 |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout paths (Increments 2–3) | Guest shopping unchanged; appointment booking adds account gate separately |
| Account nav chrome (Increment 4) | Appointments tab added alongside Profile · Orders · Wishlist · Saved Payments |
| Store detail (Increment 1) | Reused from pet profile's store link |
| Distance / location entry (Increment 1) | Reused on pet profile to show distance to pet's store |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/6-pet-visits/exploration/ux/mockups-state.json" --out "docs/increments/6-pet-visits/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-26 | initial | 13 Increment 6 screens (pet gallery, profile states, booking flow, customer account, staff board + actions, pet profile editor, notification preview); state JSON + drawio generated. |
| 2026-05-26 | rework (slot 149-rework) | F1: added slot released notice region to select time slot screen. F3: Browse other pets action added to upcoming appointments. F4: label corrected to distance from customer location. F2: 3 conditional inline alert regions added to staff — incoming appointments (already checked in, cancelled appointment block, customer already checked in). State JSON + drawio regenerated. |
| 2026-05-26 | rework (slot 150-rework2) | B1: inserted \slot released notice\ row between \slot hold notice\ and \continue\ in book appointment — select time slot screen table. lo-fi.md only; state.json unchanged. |

## Increment 7: Returns and refunds — close the loop

> **Companion to** `docs/increments/7-returns-refunds/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 7 — Returns and refunds (7 screens, 6 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; extends Increment 4 order history and account patterns) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 171/172) |
| State file | `docs/increments/7-returns-refunds/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/7-returns-refunds/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-27 |

## Description

Lo-fi wireframes extending the customer account *order history* with a full *return* flow: selecting eligible items, specifying *return reason* and *item condition*, submitting a *return request*, receiving a *return label* (PDF) and *return QR code*, and tracking *return status* and *refund status* through completion. Staff screens provide *in-store return* processing with order lookup, *return eligibility* gating, and *manager override* for edge cases. Notification previews cover *return received notification*, *refund completed notification*, and *refund under review notification*. The vendor-routing invariant on *refund* — always through the original *payment vendor* — is the design rule that drives the refund path. **Increment 1–6 paths are preserved** — *order history* and account navigation extend; staff dashboard gains a "Returns" tab.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 4–6 lo-fi patterns and standard return/refund UX conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 4 | order history list | list | Order rows with actions — Return button added on eligible orders |
| Inc 4 | account nav tabs | nav-tabs | Profile · Orders (active) · Appointments · Wishlist · Saved Payments |
| AC | eligible items selector | list | Checkbox per item, quantity to return, eligibility indicator |
| AC | return reason + item condition | form (dropdown) | Dropdown selectors; damaged triggers additional fields |
| AC | return label + QR code | form | PDF download button + QR display placeholder |
| AC | return status timeline | listbox | Lifecycle states: initiated → label generated → shipped → received → inspected → refund processing → completed |
| AC | refund status states | form | Processing / completed / requires review with conditional feedback |
| AC | staff order lookup | form | Order number or customer email search |
| AC | in-store return | form + list | Items selector with manager override for ineligible items |
| AC | notification previews | nav-tabs + form | Tabs for 3 notification types with email resilience note |

**Design principles applied:** Extend Increment 4 order history with return initiation; return flow follows checkout-like linear progression (select → confirm → track); staff screens mirror Increment 6 staff dashboard tab pattern; refund tracking surfaces vendor-agnostic status visible to customer; conditional states for ineligibility, damaged items, partial returns, and refund escalation.

---

## Screens

### customer account — order history with return

**Layout:** stack
**AC stories:** Initiate Return from Order History

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Logged-in chrome from Increment 4 |
| account nav | header | nav-tabs | Profile · Orders (active) · Appointments · Wishlist · Saved Payments | Orders tab active |
| order list | body | list | order number · date · items (condensed) · total · order status · actions: Return · Reorder · View Detail | Return button on eligible orders only |
| return eligible indicator | body | form | Return button visible on eligible orders within return window | Visual cue for returnable orders |
| return ineligible state | body | form | Return action hidden or disabled · Reason: return window expired / items not eligible | AC 3 — clear reason shown |
| partial return in progress | body | form | return in progress badge on orders with active returns | AC 5 — previously returned items flagged |

### initiate return — select items

**Layout:** form
**AC stories:** Initiate Return from Order History

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| breadcrumb | header | toolbar | Account · Orders · Order #[number] · Return (current) | Breadcrumb trail for navigation |
| order context | body | form | order number · order date · payment method (masked) | Order reference for return |
| eligible items selector | body | list | select · product name · quantity ordered · quantity to return · return eligible | Checkbox per item; customer selects items and quantities |
| items already in return | body | form | return in progress — cannot be returned again | AC 5 — items with active return shown as non-selectable |
| return reason | body | form | return reason (dropdown) | AC 1 — customer selects reason |
| item condition | body | form | item condition (dropdown: unopened / opened / damaged) | AC 1 — condition selection |
| damaged item detail | body | form | damage description (textarea) · upload photo of damage (optional) | AC 4 — additional fields for damaged condition |
| submit return request | body | button-bar | Submit Return Request (primary) · Back to Order Detail | Submits return request; creates return record |

### return confirmation — label and QR code

**Layout:** stack
**AC stories:** Generate Return Label or QR Code

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| return submitted header | body | form | Return request submitted! · return reference · order number | Confirmation with return reference |
| returned items summary | body | list | product name · quantity · return reason · item condition | Summary of what was returned |
| return label download | body | form | return label (PDF) — includes return address, order number, return reference, carrier barcode | AC 2 — printable label with full details |
| return QR code display | body | form | [QR code placeholder — displayable on mobile at carrier drop-off point] · same return reference as label | AC 3 — mobile QR at drop-off; same reference as label |
| email confirmation note | body | form | Return label and QR code emailed to your registered email | AC 1 — both emailed to customer |
| label unavailable fallback | body | form | return recorded — label generation temporarily unavailable · check back shortly or contact support for your return label | AC 4 — return not cancelled; label available later |
| post-submission actions | body | button-bar | View Return Status (primary) · Back to Order History | Navigate to tracking or back to orders |

### order detail — return and refund tracking

**Layout:** stack
**AC stories:** Track Refund Status · Route Refund through Original Payment Vendor · Initiate Return from Order History

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| breadcrumb | header | toolbar | Account · Orders · Order #[number] (current) | |
| order summary | body | form | order number · order date · order status · payment method (masked) | Order context for tracking |
| return status timeline | body | listbox | Initiated · Label Generated · Shipped Back · Received (selected) · Inspected · Refund Processing · Completed | Lifecycle progress indicator; selected = current state |
| refund status — processing | body | form | refund status: processing · refund amount · refunds typically take X business days depending on your payment provider | AC 1 + AC 3 — status with timing expectation |
| refund status — completed | body | form | refund status: completed · refunded amount · credit returned to [masked payment method] · refund completed notification sent | AC 2 — vendor confirmation; notification sent |
| refund status — requires review | body | form | refund status: requires review · Please contact support for assistance with your refund | AC 4 — escalation with support guidance |
| returned items detail | body | list | product name · quantity returned · return reason · item condition | Items in this return |
| remaining eligible items | body | form | remaining eligible items can still be returned separately · Return More Items | AC 5 — partial return affordance |

### staff — order lookup for return

**Layout:** stack
**AC stories:** Process In-Store Return

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns (active) | Returns tab extends staff dashboard |
| order lookup | body | form | order number (text) · or customer email (text) · Look Up Order (primary) | AC 1 — lookup by order number or customer email |
| matched order result | body | list | order number · date · customer name · email · items (condensed) · total · order status · Start Return | AC 1 — matched order with Start Return action |
| no match found | body | form | No order found — verify the order number or customer email | Empty state for failed lookup |
| guest order note | body | form | Guest orders: lookup by order number and guest email — refund routes through original vendor | AC 3 — guest returns supported |

### staff — process in-store return

**Layout:** form
**AC stories:** Process In-Store Return

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | |
| order context | body | form | order number · customer name or guest email · order date | In-store return context |
| return items selector | body | list | select · product name · quantity ordered · quantity to return · return eligible | Same item selection as customer flow |
| return reason | body | form | return reason (dropdown) · item condition (dropdown) | Staff records reason and condition |
| ineligible item — reason and override | body | form | ineligibility reason: return window expired / wrong condition · Manager Override (primary) | AC 4 — ineligibility with override affordance |
| manager override confirmation | body | form | manager approval required before return proceeds · approving manager · override reason (textarea) | AC 4 — manager approval gate |
| submit in-store return | body | button-bar | Record In-Store Return (primary) · Cancel | |
| return recorded confirmation | body | form | In-store return recorded — linked to original order · Refund triggered through original payment vendor · Return visible in customer order history | AC 2 — confirmation with refund routing + customer visibility |

### notification preview — return and refund updates

**Layout:** stack
**AC stories:** Send Return and Refund Status Update

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Return Received (active) · Refund Completed · Refund Under Review | Three lifecycle notification types |
| return received preview | body | form | Subject: We've received your return for order #[number] · order number · returned items summary · Inspection and refund processing are underway | AC 1 — return received notification |
| refund completed preview | body | form | Subject: Your refund for order #[number] is complete · refunded amount · credit returned to [masked payment method] | AC 2 — refund completed with amount and payment method |
| refund under review preview | body | form | Subject: Update on your refund for order #[number] · Your refund requires additional review · Please contact support if you need assistance · return and order reference included | AC 3 — escalation notification with support guidance |
| resilience note | body | form | Email queued for retry when delivery system unavailable — return/refund status still updated | AC 4 — notification failure does not block processing |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| Return button on eligible order in order history | Initiate Return from Order History | AC 1 — customer selects Return on eligible order |
| eligible items selector with quantities, return reason, item condition | Initiate Return from Order History | AC 1 — select items, quantities, return reason, item condition |
| return request submission → return record + next steps | Initiate Return from Order History | AC 2 — system creates return record, shows next steps |
| Return action hidden/disabled with reason | Initiate Return from Order History | AC 3 — outside return window or items not eligible |
| damaged item detail: description + photo upload | Initiate Return from Order History | AC 4 — additional fields for damaged condition |
| items "return in progress" non-selectable; remaining items returnable | Initiate Return from Order History | AC 5 — partial returns; no double-return |
| return label PDF download | Generate Return Label or QR Code | AC 1 — label PDF shown on confirmation page + emailed |
| return label contents: return address, order number, return reference, carrier barcode | Generate Return Label or QR Code | AC 2 — label includes required details |
| return QR code displayable on mobile, same reference as label | Generate Return Label or QR Code | AC 3 — QR code at carrier drop-off |
| label unavailable fallback: return recorded, check back later | Generate Return Label or QR Code | AC 4 — label failure does not cancel return |
| refund status: processing / completed / requires review | Track Refund Status | AC 1 — refund status visible on order detail |
| refund completed state with notification | Track Refund Status | AC 2 — status transitions to completed |
| timing expectation note while processing | Track Refund Status | AC 3 — refunds typically take X business days |
| requires review with contact support | Track Refund Status | AC 4 — customer guided to support |
| staff order lookup by order number or customer email | Process In-Store Return | AC 1 — order lookup on staff dashboard |
| Start Return action on matched order | Process In-Store Return | AC 1 — Start Return displayed |
| in-store return creates record + triggers refund + appears in customer account | Process In-Store Return | AC 2 — return recorded, refund routed, visible in account |
| guest order lookup by order number and guest email | Process In-Store Return | AC 3 — guest returns supported |
| ineligibility reason + Manager Override action | Process In-Store Return | AC 4 — ineligibility with manager approval |
| return received notification | Send Return and Refund Status Update | AC 1 — notification when return received |
| refund completed notification with amount and payment method | Send Return and Refund Status Update | AC 2 — notification with refund details |
| refund under review notification with support guidance | Send Return and Refund Status Update | AC 3 — escalation notification |
| email resilience — queued for retry, processing not blocked | Send Return and Refund Status Update | AC 4 — notification failure does not block return/refund |
| return status timeline (initiated through completed) | Track Refund Status + Route Refund | Return lifecycle progress visible to customer |
| vendor-agnostic refund display (StripeWave / PayNova / VaultPay) | Route Refund through Original Payment Vendor | AC 2–4 — customer sees refund status, not vendor mechanics |
| refund retry resilience ("processing" not "failed") | Route Refund through Original Payment Vendor | AC 5 — refund retry queued; customer never sees "refund failed" |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| customer account — order history with return | Initiate Return from Order History | order history · order · order status · return · return eligibility · return window |
| initiate return — select items | Initiate Return from Order History | return · return request · returned items · return reason · item condition · return eligibility · order line item · return status |
| return confirmation — label and QR code | Generate Return Label or QR Code | return label · return QR code · return request · return status |
| order detail — return and refund tracking | Track Refund Status · Route Refund through Original Payment Vendor · Initiate Return from Order History | return status · refund status · refund · refund retry · order history · order status page |
| staff — order lookup for return | Process In-Store Return | in-store return · store employee · order · order history · guest email |
| staff — process in-store return | Process In-Store Return | in-store return · store employee · return · refund · return eligibility · manager override |
| notification preview — return and refund updates | Send Return and Refund Status Update | return received notification · refund completed notification · refund under review notification · return status · refund status |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Admin refund reconciliation UI | System/back-office — webhook-level operations not customer-facing |
| Automatic vs manual inspection workflow | Back-office; AC says "received and inspected" without specifying inspection UI |
| Carrier integration configuration | Infrastructure concern — label generation is a system story |
| Restocking UI after return inspection | Product Catalog inventory update is asynchronous and back-office |

| Preserved from prior increments | Rationale |
| --- | --- |
| Order history (Increment 4) | Extended with Return action — existing order list patterns preserved |
| Account navigation tabs (Increment 4) | Orders tab now shows return-eligible orders |
| Staff dashboard tabs (Increment 6) | Returns tab added alongside Stock Levels, Appointments, Pet Profiles |
| Multi-vendor payment patterns (Increment 5) | Refund routes through original vendor; customer sees masked payment method |
| Notification resilience (Increment 6) | Same email queue-for-retry pattern applied to return/refund notifications |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/7-returns-refunds/exploration/ux/mockups-state.json" --out "docs/increments/7-returns-refunds/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-27 | initial | 7 Increment 7 screens (order history return, item selection, label/QR confirmation, return/refund tracking, staff order lookup, staff in-store return, notification previews); state JSON + drawio generated. |

## Increment 8: Marketing engine — reviews, alerts, and content

> **Companion to** `docs/increments/8-marketing-engine/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 — Marketing engine (11 screens, 16 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; extends Increment 4 account patterns, Increment 6 staff dashboard) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| State file | `docs/increments/8-marketing-engine/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/8-marketing-engine/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-30 |

## Description

Lo-fi wireframes for the Marketing Engine increment — customer reviews with star ratings and photo uploads on the product detail page, communication preferences for marketing opt-in/opt-out per category, notification preferences for transactional settings, blog and pet care guide browsing with content publishing from the admin area, email unsubscribe confirmation, and notification previews for all marketing and transactional email types. The product detail page extends from Increment 1 with a reviews section; account navigation extends from Increment 4 with Communication and Notifications tabs; the staff dashboard extends from Increments 6–7 with a Content tab. New screens include blog index, blog post detail, pet care guide index, pet care guide detail, and unsubscribe confirmation. **Consent-gated marketing** — all marketing communication types enforce opt-in at delivery time, not batch time; unsubscribe takes effect immediately.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1–7 lo-fi patterns and standard e-commerce/marketing UX conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 1 | product detail page | stack | Product header, image gallery, description — extended with reviews |
| Inc 4 | account nav tabs | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments — add Communication · Notifications |
| Inc 6–7 | staff nav tabs | nav-tabs | Stock Levels · Appointments · Pet Profiles · Returns — add Content |
| AC | review submission form | form | Star rating (radio 1–5), optional text, optional photo upload |
| AC | review sort controls | nav-tabs | Newest (default), Oldest, Highest Rating, Lowest Rating |
| AC | customer reviews list | list | Star rating, review text, review photos (thumbnails), author, date |
| AC | communication preferences | form (checkbox) | Per-category toggles, immediate persist, default opt-out |
| AC | notification preferences | form (checkbox) | Per-category toggles, critical notifications non-optional |
| AC | blog post listing | list | Title, summary, date, author — with Read Post action |
| AC | pet care guide listing | list | Title, summary, pet type/species tag, date — with pet type filter tabs |
| AC | content editor | form | Title, summary, body, author/tags; Save as Draft / Publish actions |
| AC | notification previews (marketing) | nav-tabs + form | 4 tabs: Promotional, Personalized Recommendation, Restock Alert, In-Store Event |
| AC | notification previews (transactional) | nav-tabs + form | 3 tabs: Order Confirmation, Shipping Update, Click-and-Collect Ready |

**Design principles applied:** Product detail page extends with reviews below product info; account nav gains two preference tabs; communication preferences use immediate-toggle checkboxes (no save button); blog/guide browsing follows standard content index patterns; staff content editor mirrors draft/publish lifecycle; notification previews use tabbed email mockup pattern from Increment 7.

---

## Screens

### product detail page — reviews and ratings

**Layout:** stack
**AC stories:** Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Logged-in chrome from Increment 4 |
| breadcrumb | header | toolbar | Product Catalog · Category · Product Name (current) | Back navigation to catalog |
| product header with aggregate star rating | body | form | product name · aggregate star rating (★★★★☆ 4.2 · 47 reviews) | Aggregate displayed prominently near product name |
| no reviews state | body | form | aggregate star rating not shown — not displayed as zero · "Be the first to review this product!" | Conditional: product has no customer reviews |
| review sort controls | body | nav-tabs | Newest (active) · Oldest · Highest Rating · Lowest Rating | Default sort: newest first |
| customer reviews list | body | list | star rating · review text · review photo · author · date · Load More Reviews | Paginated/lazy-loaded reviews; photo thumbnails inline |
| review photo lightbox | body | form | [full-size review photo — lightbox overlay] · close lightbox | Conditional: selecting thumbnail opens full-size |
| review submission form — verified purchaser | body | form | star rating (1–5, radio) · written review (optional, textarea) · upload review photos (optional) · Submit Review (primary) | Star rating mandatory, text and photos optional |
| photo upload validation error | body | form | validation error: file format not supported or exceeds size limit · review text and star rating preserved | Conditional: unsupported format or size exceeded |
| non-purchaser state | body | form | "Purchase this product to leave a review" | Conditional: customer has not purchased product; form hidden |
| guest prompt state | body | form | "Log in or register to leave a review" · Log In · Register | Conditional: guest with no customer account; page not navigated away from |

**Conditional states:**
- No reviews: aggregate star rating hidden, "be the first to review" prompt shown
- Non-purchaser: review form hidden, purchase prompt shown instead
- Guest: review form replaced by login/register prompt
- Photo upload error: validation message shown, review text and star rating preserved
- Lightbox: full-size image overlay on thumbnail click

---

### blog index

**Layout:** stack
**AC stories:** Publish Blog Post (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | Content navigation added to primary nav |
| blog index header | body | form | PawPlace Blog | Page heading |
| blog post listing | body | list | title · summary · date · author · Read Post | Published posts only — drafts not visible to customers |

---

### blog post detail

**Layout:** stack
**AC stories:** Publish Blog Post (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Blog · Post Title (current) | Back to blog index |
| blog post content | body | form | title · author · date · body content (textarea) | Full article accessible via its own URL |

---

### pet care guide index

**Layout:** stack
**AC stories:** Publish Pet Care Guide (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| guide index header | body | form | Pet Care Guides | Page heading |
| pet type filter | body | nav-tabs | All (active) · Dogs · Cats · Senior Pets · Small Animals | Filter by pet type/species tag |
| pet care guide listing | body | list | title · summary · pet type/species tag · date · Read Guide | Cross-linked with pet browsing areas based on tags |

---

### pet care guide detail

**Layout:** stack
**AC stories:** Publish Pet Care Guide (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Pet Care Guides · Guide Title (current) | Back to guide index |
| pet care guide content | body | form | title · author · date · pet type/species tag (badge) · body content (textarea) | Full guide accessible via its own URL; tagged by pet type or species per UL definition |

---

### customer account — communication preferences

**Layout:** stack
**AC stories:** Set Communication Preferences · Opt In to Marketing Email List · Unsubscribe from Marketing Emails

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| account nav | header | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments · Communication (active) · Notifications | Communication tab active |
| communication preferences header | body | form | Marketing Communication Preferences · "Changes take effect immediately" | No save button — immediate persist on toggle |
| marketing category toggles | body | list | marketing category · description · opt-in status | Overview of all 4 categories |
| promotions toggle | body | form | Promotions — sales, new products, seasonal offers (checkbox) | Unchecked by default for new opt-in |
| recommendations toggle | body | form | Recommendations — personalized product suggestions (checkbox) | |
| restock alerts toggle | body | form | Restock Alerts — wishlisted products back in stock (checkbox) | |
| events toggle | body | form | Events — in-store event notifications at preferred store (checkbox) | |
| transactional note | body | form | Transactional notifications not affected by these settings | Clear separation from notification preferences |
| guest access state | body | form | "Log in or register to manage communication preferences" · Log In · Register | Conditional: guest; page not navigated away from |

**Conditional states:**
- Guest: login/register prompt replaces toggle interface
- New marketing category: defaults to opt-out (unchecked)
- All categories opted out: transactional note still visible, confirming those are unaffected

---

### customer account — notification preferences

**Layout:** stack
**AC stories:** Set Notification Preferences

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| account nav | header | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments · Communication · Notifications (active) | Notifications tab active |
| notification preferences header | body | form | Notification Preferences · "Changes take effect immediately" | Same immediate-toggle pattern as communication preferences |
| order updates toggle | body | form | Order Updates (checkbox) | |
| shipping notifications toggle | body | form | Shipping Notifications (checkbox) | |
| appointment reminders toggle | body | form | Appointment Reminders (checkbox) | |
| return updates toggle | body | form | Return Updates (checkbox) | |
| critical notifications note | body | form | "Some notifications cannot be disabled (e.g. order confirmation, refund completion)" | Non-suppressible transactional notifications called out |
| guest access state | body | form | "Log in or create an account" · guest order notifications continue via checkout email · Log In · Create Account | Conditional: guest |

**Conditional states:**
- Guest: login prompt with note about guest order notifications
- All disabled: critical notifications note remains; order confirmation and refund completion still sent

---

### unsubscribe confirmation

**Layout:** stack
**AC stories:** Unsubscribe from Marketing Emails

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · account | Minimal nav on confirmation page |
| unsubscribe confirmation | body | form | "You've been unsubscribed" · category name · re-subscribe note · Manage Communication Preferences · Continue Shopping (primary) | Confirmation page after email unsubscribe link click |
| already unsubscribed state | body | form | "You've been unsubscribed" · already unsubscribed note | Conditional: idempotent — no error on repeat click |

**Conditional states:**
- Already unsubscribed: same confirmation message, no error — idempotent

---

### admin — content editor

**Layout:** form
**AC stories:** Publish Blog Post · Publish Pet Care Guide

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns · Content (active) | Content tab extends staff dashboard |
| content type selector | body | nav-tabs | Blog Posts (active) · Pet Care Guides | Toggle between content types |
| content list | body | list | title · status (draft/published) · date · author · Edit · Publish · New Post (primary) | Draft entries visible to staff only |
| blog post editor | body | form | title (text) · summary (textarea) · body content (textarea) · author (text) · Save as Draft · Publish (primary) | Draft → published lifecycle |
| pet care guide editor | body | form | title (text) · summary (textarea) · body content (textarea) · pet type/species tag (dropdown) · Save as Draft · Publish (primary) | Conditional: Pet Care Guides tab; requires at least one tag |
| tag required validation | body | form | "At least one pet type or species tag is required before publishing" | Conditional: attempt to publish guide without tag; draft not lost |
| publish date note | body | form | "Publish date will not change unless you update it explicitly" · update publish date (checkbox) | Conditional: editing a published post |

**Conditional states:**
- Pet Care Guides tab: guide editor shown with tag dropdown instead of blog editor
- Tag missing: validation error, draft preserved
- Editing published post: publish date preservation note with explicit checkbox

---

### notification preview — marketing communications

**Layout:** stack
**AC stories:** Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Promotional Email (active) · Personalized Recommendation · Restock Alert · In-Store Event | 4 marketing email types tabbed |
| promotional email preview | body | form | Subject line · promotional content · unsubscribe link | Unsubscribe immediately opts out of promotions category |
| real-time opt-out note | body | form | "communication preferences checked at delivery time, not batch creation time" | Key invariant surfaced |
| personalized recommendation preview | body | form | Subject line · recommendation basis · in-stock only · not sent without data · unsubscribe | Conditional: Personalized Recommendation tab |
| restock alert preview | body | form | Subject line · wishlist match · best-effort signal · opt-in + wishlist required · unsubscribe | Conditional: Restock Alert tab |
| in-store event preview | body | form | Subject line · event details · store match · preferred store required · walk-in discoverable · unsubscribe | Conditional: In-Store Event tab |
| delivery resilience note | body | form | "Email queued for retry — not silently discarded" | Same resilience pattern as prior increments |

---

### notification preview — transactional updates

**Layout:** stack
**AC stories:** Send Order Confirmation · Send Shipping Update with Tracking · Send Click-and-Collect Ready Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Order Confirmation (active) · Shipping Update · Click-and-Collect Ready | 3 transactional notification types |
| order confirmation preview | body | form | Subject line · order details · mandatory notification · guest routing | Cannot be suppressed; guest email from checkout |
| shipping update preview | body | form | Subject line · tracking details · initial mandatory, follow-ups respect preferences | Conditional: Shipping Update tab |
| click-and-collect ready preview | body | form | Subject line · pickup details · collection window reminder · guest routing | Conditional: Click-and-Collect Ready tab |
| resilience note | body | form | "Email queued for retry — order/shipping status still updated" | Notification failure does not block processing |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| aggregate star rating display near product name | Read Customer Reviews | AC 1 — aggregate star rating displayed prominently, individual reviews listed below |
| aggregate star rating hidden, "be the first to review" prompt | Read Customer Reviews | AC 2 — not displayed as zero when no reviews; prompt appears |
| review sort controls (newest, oldest, highest, lowest) | Read Customer Reviews | AC 3 — paginated/lazy-loaded with sort controls |
| review photo thumbnails inline, lightbox on select | Read Customer Reviews | AC 4 — thumbnails inline, full size on select |
| review form with star rating (1–5) and optional text | Submit Written Review with Star Rating | AC 1 — form collects star rating and optional written review; purchasers only |
| Submit Review → review appears, aggregate recomputed | Submit Written Review with Star Rating | AC 2 — review associated, appears newest first, aggregate recomputed |
| review form hidden, "purchase this product to leave a review" | Submit Written Review with Star Rating | AC 3 — non-purchaser cannot submit; existing reviews viewable |
| guest prompt: log in or register | Submit Written Review with Star Rating | AC 4 — guest prompted to log in; page not navigated away from |
| star-rating-only review accepted (no text) | Submit Written Review with Star Rating | AC 5 — star rating mandatory, text optional |
| photo upload field on review form | Submit Photo Review | AC 1 — optional photo upload field on review submission |
| review photos displayed alongside review, lightbox at full size | Submit Photo Review | AC 2 — images displayed alongside review, lightbox |
| photo upload validation error, review text and star rating preserved | Submit Photo Review | AC 3 — validation error; text and star rating not lost |
| review accepted without photos | Submit Photo Review | AC 4 — photos optional |
| communication preferences: 4 marketing category toggles | Set Communication Preferences | AC 1 — all marketing categories listed with current status |
| immediate toggle persist, no save action | Set Communication Preferences | AC 2 — persists immediately on toggle |
| new marketing category defaults to opt-out | Set Communication Preferences | AC 3 — new categories default opt-out |
| transactional notifications unaffected by marketing opt-out | Set Communication Preferences | AC 4 — transactional notifications unaffected |
| guest communication preferences prompt | Set Communication Preferences | AC 5 — guest prompted to log in or register |
| opt-in to promotions via communication preferences | Opt In to Marketing Email List | AC 1 — opt-in adds to marketing email list with timestamp |
| opt-in checkbox unchecked by default | Opt In to Marketing Email List | AC 2 — opt-in must be affirmative; unchecked by default |
| no marketing communications without opt-in | Opt In to Marketing Email List | AC 3 — zero exceptions |
| opted-in customer sees promotions as active | Opt In to Marketing Email List | AC 4 — shows as opted-in; toggle off to unsubscribe |
| email unsubscribe link → immediate opt-out, confirmation page | Unsubscribe from Marketing Emails | AC 1 — immediately opted out; confirmation page shown |
| communication preferences page unsubscribe → immediate effect | Unsubscribe from Marketing Emails | AC 2 — change takes effect immediately |
| unsubscribe all → transactional notifications unaffected | Unsubscribe from Marketing Emails | AC 3 — transactional unaffected |
| repeat unsubscribe → same confirmation, no error (idempotent) | Unsubscribe from Marketing Emails | AC 4 — idempotent; no confusing message |
| notification preference categories with toggles | Set Notification Preferences | AC 1 — categories listed with current setting |
| notification toggle immediate persist | Set Notification Preferences | AC 2 — preference saved immediately |
| critical notifications non-suppressible with note | Set Notification Preferences | AC 3 — critical notifications still sent; note explains |
| guest notification preferences prompt | Set Notification Preferences | AC 4 — guest prompted; guest order notifications continue |
| promotional email to opted-in customers only | Send Promotional Email | AC 1 — delivered only to opted-in promotions category |
| real-time opt-out respected (delivery-time check) | Send Promotional Email | AC 2 — opt-out between batch and delivery respected |
| unsubscribe link in email → immediate opt-out + confirmation | Send Promotional Email | AC 3 — unsubscribe link; confirmation page |
| promotional email queued for retry if unavailable | Send Promotional Email | AC 4 — queued, not discarded |
| personalized recommendation based on history/profile, opted-in only | Send Personalized Recommendation | AC 1 — based on purchase, browsing, pet profile; opt-in required |
| no recommendation without personalization data | Send Personalized Recommendation | AC 2 — not sent without data |
| out-of-stock products excluded from recommendations | Send Personalized Recommendation | AC 3 — excluded |
| no recommendation without opt-in | Send Personalized Recommendation | AC 4 — not sent regardless of data |
| restock alert to wishlisted + opted-in customers | Send Restock Alert | AC 1 — wishlist + opt-in required |
| no alert without restock alerts opt-in | Send Restock Alert | AC 2 — not sent even if on wishlist |
| best-effort signal, product may go back out of stock | Send Restock Alert | AC 3 — best effort |
| no alert if product not on any wishlist | Send Restock Alert | AC 4 — not sent |
| in-store event to preferred-store + events opt-in customers | Send In-Store Event Notification | AC 1 — preferred store match + opt-in |
| no event notification without preferred store | Send In-Store Event Notification | AC 2 — not sent; event discoverable on store page |
| no event notification without events opt-in | Send In-Store Event Notification | AC 3 — not sent |
| no event notification for non-matching store | Send In-Store Event Notification | AC 4 — not sent |
| blog post listing: title, summary, date, author | Publish Blog Post | AC 1 — appears on blog index with required fields; accessible via URL |
| draft blog post not visible to customers | Publish Blog Post | AC 2 — draft not visible; editable from admin |
| published post edit preserves publish date unless explicit update | Publish Blog Post | AC 3 — publish date unchanged unless author updates |
| direct URL access to published blog post | Publish Blog Post | AC 4 — full article at own URL |
| pet care guide listing: title, summary, pet type tag, date | Publish Pet Care Guide | AC 1 — appears on guide index; accessible via URL |
| pet care guide detail: pet type/species tag displayed | Publish Pet Care Guide | AC 1 — published article tagged by pet type or species; accessible via own URL |
| guide appears in pet browsing areas matching tags | Publish Pet Care Guide | AC 2 — cross-linked with pet/product browsing areas |
| draft guide not visible to customers | Publish Pet Care Guide | AC 3 — draft not visible; editable from admin |
| tag required before publishing (validation) | Publish Pet Care Guide | AC 4 — at least one tag required; draft not lost |
| order confirmation: order number, items, total, delivery option, estimated delivery/pickup | Send Order Confirmation | AC 1 — sends notification with order details on payment success |
| order confirmation mandatory — cannot be suppressed by notification preferences | Send Order Confirmation | AC 2 — mandatory transactional notification |
| order confirmation queued for retry if delivery unavailable | Send Order Confirmation | AC 3 — email failure does not block order processing |
| order confirmation sent to guest email provided at checkout | Send Order Confirmation | AC 4 — guest order routing |
| shipping update: order number, tracking number, carrier link, estimated delivery | Send Shipping Update with Tracking | AC 1 — notification sent when order status changes to shipped |
| follow-up shipping notifications if carrier data available | Send Shipping Update with Tracking | AC 2 — additional status changes (out for delivery, delivered) |
| initial shipping notification mandatory, follow-ups respect preferences | Send Shipping Update with Tracking | AC 3 — initial non-suppressible, follow-ups optional |
| shipping notification queued for retry if delivery unavailable | Send Shipping Update with Tracking | AC 4 — email failure does not block fulfilment |
| click-and-collect ready: order number, pickup store address, hours, collection window | Send Click-and-Collect Ready Notification | AC 1 — notification sent when order marked ready for pickup |
| click-and-collect ready sent to guest email provided at checkout | Send Click-and-Collect Ready Notification | AC 2 — guest order routing |
| collection window reminder when deadline approaching and order not collected | Send Click-and-Collect Ready Notification | AC 3 — reminder notification for uncollected orders |
| click-and-collect notification queued for retry if delivery unavailable | Send Click-and-Collect Ready Notification | AC 4 — email failure does not block fulfilment |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| product detail page — reviews and ratings | Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews | customer review · star rating · review photo · aggregate star rating · product · customer account · product details page |
| blog index | Publish Blog Post | blog post · blog index · content |
| blog post detail | Publish Blog Post | blog post · content · content author |
| pet care guide index | Publish Pet Care Guide | pet care guide · guide index · content |
| pet care guide detail | Publish Pet Care Guide | pet care guide · pet type/species tag · content · content author |
| customer account — communication preferences | Set Communication Preferences · Opt In to Marketing Email List · Unsubscribe from Marketing Emails | communication preferences · marketing category · marketing email list · marketing communication · unsubscribe · promotional email · personalized recommendation · restock alert · in-store event notification |
| customer account — notification preferences | Set Notification Preferences | notification preferences · customer account |
| unsubscribe confirmation | Unsubscribe from Marketing Emails | unsubscribe · marketing category · communication preferences |
| admin — content editor | Publish Blog Post · Publish Pet Care Guide | content · blog post · pet care guide · content author · blog index · guide index |
| notification preview — marketing communications | Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification | promotional email · personalized recommendation · restock alert · in-store event notification · marketing communication · communication preferences · marketing category · unsubscribe · marketing email list |
| notification preview — transactional updates | Send Order Confirmation · Send Shipping Update with Tracking · Send Click-and-Collect Ready Notification | notification preferences · customer account |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Admin marketing email compose/send UI | System story — batch creation and delivery are back-end operations; notification preview shows email format |
| Review moderation workflow | No AC mention of admin moderation; reviews appear immediately |
| Content scheduling/calendar | Lifecycle is draft → publish; no scheduling AC exist |
| Email template builder | System concern — email format is shown in notification previews |
| Recommendation algorithm configuration | Back-end personalization engine; customer sees result in email |
| Event creation admin UI | In-Store Event Notification is triggered by admin event creation, but no admin event screen AC exist for this increment |

| Preserved from prior increments | Rationale |
| --- | --- |
| Product detail page (Increment 1) | Extended with reviews section below product info |
| Account navigation tabs (Increment 4) | Communication and Notifications tabs added |
| Staff dashboard tabs (Increments 6–7) | Content tab added alongside Stock Levels, Appointments, Pet Profiles, Returns |
| Notification resilience pattern (Increment 6–7) | Same email queue-for-retry applied to marketing and transactional notifications |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/8-marketing-engine/exploration/ux/mockups-state.json" --out "docs/increments/8-marketing-engine/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-30 | initial | 10 Increment 8 screens (product reviews, blog index, blog detail, pet care guide index, communication preferences, notification preferences, unsubscribe confirmation, admin content editor, marketing notification previews, transactional notification previews); state JSON + drawio generated. |
| 2026-05-30 | rework | Added pet care guide detail screen (with pet type/species tag) — guide index "Read Guide" now navigates here instead of blog post detail. Added story/domain-term annotation boxes to drawio. Screen count now 11. |

## Increment 9: Power-ups — search, personalization, admin polish

**Scope:** Product search with filter facets, store locator filtering, my store preference, customer pet profiles, inventory dashboard with low stock alerts and export, backorder purchase.

**Source IA:** N/A (no initial-ia.md for this increment — screens derived from UL and AC directly)
**UL:** `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md`
**AC:** `docs/end-to-end/exploration/stories/acceptance-criteria.md`

---

## Screen 1: Product Search Results

**Layout:** sidebar (filter panel left, results body right)
**State file:** `product-search-results-state.json`
**Drawio:** `product-search-results.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Site header with search bar | header | toolbar | AC Search-1: search bar accessible globally; AC Search-4: accessible from any page |
| Filter facets panel | panel | form | AC Filter-1: filter facets available (category, pet type, brand, price range, stock availability) |
| Facet match counts | panel | listbox | AC Filter-1: each facet shows the count of matching products |
| Active filters | body | toolbar (chips) | AC Filter-2: active filters shown as removable chips; AC Filter-4: removal expands list |
| Search results list | body | list | AC Search-1: results ranked by relevance; AC Filter-3: intersection of active filters |
| No results message (empty state) | body | chrome | AC Search-2: "no results found" with suggestions |

### In-scope stories

- Search Products by Keyword
- Filter Products

### Domain terms (verbatim)

- **product search** — a keyword-based discovery mechanism that matches products by name, description, category, or brand and ranks results by relevance
- **search results** — the ranked list of products produced by a product search, with empty-state guidance when no products match
- **filter facet** — a named dimension (category, pet type, brand, price range, stock availability) that narrows the product list and shows match counts per value
- **active filter** — a currently applied filter selection displayed as a removable tag whose removal expands the result set

### Acceptance criteria (verbatim)

**Search Products by Keyword:**

1. **WHEN** the customer enters a keyword in the *Search Bar* and submits
   **THEN** the *Search Results* show *products* whose name, description, *category*, or brand match the keyword
   **AND** results are ranked by relevance (closest match first)
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "We want good filtering and search"; power-ups-ubiquitous-language.md — *product search*: "matches products by name, description, category, or brand"

2. **WHEN** the keyword matches no *products*
   **THEN** the *Search Results* show a "no results found" message with suggestions (popular *categories*, alternative keywords)
   **BUT** no empty, unlabelled result set is shown
   **Evidence:** power-ups-ubiquitous-language.md — *search results*: "displays a 'no results found' message with suggestions when no products match"

3. **WHEN** the customer enters a partial keyword (e.g. "kitt" for "kitten food")
   **THEN** the *Search Results* return relevant matches via partial or fuzzy matching
   **Evidence:** power-ups-ubiquitous-language.md — *product search*: "supports partial and fuzzy matching so that incomplete keywords still return relevant products"

4. **WHEN** the customer initiates a *product search* from any page (product detail, store locator, blog)
   **THEN** the *Search Bar* is accessible globally in the site header
   **AND** submitting navigates to the *search results* page
   **Evidence:** power-ups-ubiquitous-language.md — *product search* invariant: "must always be accessible from every page"

5. **WHEN** the customer applies *filter facets* to the *search results* (see *Filter Products*)
   **THEN** the *search results* narrow to the intersection of keyword match and all *active filters*
   **AND** results update immediately
   **Evidence:** power-ups-ubiquitous-language.md — *search results*: "respects active filters … narrows to the intersection of the keyword match and all active filter selections"

**Filter Products:**

1. **WHEN** the customer is browsing the *Product Catalog* or viewing *Search Results*
   **THEN** *filter facets* are available: *category*, pet type, brand, price range, and *stock availability*
   **AND** each *filter facet* shows the count of matching *products* per value
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search"; power-ups-ubiquitous-language.md — *filter facet*: "shows the count of matching products per value"

2. **WHEN** the customer selects a *filter facet* value
   **THEN** the *product* list updates immediately to show only matching *products*
   **AND** the selection appears as a removable *active filter* chip
   **Evidence:** power-ups-ubiquitous-language.md — *active filter*: "a currently applied filter facet selection displayed as a removable chip or tag"

3. **WHEN** the customer combines multiple *filter facets* (e.g. pet type = "dog" AND *category* = "food")
   **THEN** the results narrow to the intersection of all *active filters*
   **AND** *filter facet* counts update to reflect the combined state of all *active filters*
   **Evidence:** power-ups-ubiquitous-language.md — *filter facet*: "combines conjunctively with other filter facets"; *filter facet* invariant: "facet counts must always reflect the current combined filter state"

4. **WHEN** the customer removes an *active filter*
   **THEN** the *product* list expands to include *products* that were previously excluded by that filter
   **AND** remaining *filter facet* counts recalculate
   **Evidence:** power-ups-ubiquitous-language.md — *active filter*: "expands the product list when removed"

5. **WHEN** all *active filters* together produce zero results
   **THEN** the *product* list shows a "no products match your filters" message with a "clear all filters" action
   **BUT** no stale counts from the previous filter state are shown
   **Evidence:** power-ups-ubiquitous-language.md — *filter facet*: "displays a 'no products match your filters' message with a 'clear all filters' action when the combined active filters produce zero results"; invariant: "must never show stale counts after a filter change"

6. **WHEN** the customer selects a price range *filter facet*
   **THEN** the filter uses a min-max range (not discrete selections)
   **AND** the same narrowing and count-update behavior as other *filter facets* applies
   **Evidence:** power-ups-ubiquitous-language.md — Decisions: "Price range is a filter facet dimension that uses a min-max range rather than discrete selections"

---

## Screen 2: Store Locator with Filters

**Layout:** sidebar (filter panel left, store list body right)
**State file:** `store-locator-filters-state.json`
**Drawio:** `store-locator-filters.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Store filter panel | panel | form | AC StoreFilter-1: filter dimensions available for specialization and product availability |
| Store results list | body | list | AC StoreFilter-2,3: only matching stores shown |
| My store highlight | body | chrome | AC Tailor-2: preferred store visually highlighted |
| No stores message (empty state) | body | chrome + button-bar | AC StoreFilter-5: "no stores match" with clear action |

### In-scope stories

- Filter Stores by Availability and Specialization
- Set My Store Preference (partial — the "Set as My Store" button in results)
- Tailor Experience to Preferred Store (partial — highlight in locator)

### Domain terms (verbatim)

- **store specialization filter** — a filter dimension on the *store locator* that narrows the *store* list to only stores with a declared *store specialization*
- **product availability filter** — a filter dimension on the *store locator* that narrows the *store* list to only stores where a specific *product* is in stock
- **my store** — the customer's declared preferred store, saved to their customer account and persisted across sessions and devices
- **tailored experience** — the set of behaviors that adapt browsing and checkout when a preferred store is set

### Acceptance criteria (verbatim)

**Filter Stores by Availability and Specialization:**

1. **WHEN** the customer is browsing the *Store Locator*
   **THEN** filter dimensions are available for *store specialization filter* and *product availability filter*
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location. Some stores might specialise"

2. **WHEN** the customer filters by *store specialization* (e.g. "reptile section")
   **THEN** only *stores* with that declared *store specialization* are shown
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "one might have a great reptile section"; power-ups-ubiquitous-language.md — *store specialization filter*: "shows only stores whose store specialization matches the customer's selection"

3. **WHEN** the customer filters by *product availability filter* for a specific *product*
   **THEN** only *stores* where that *product* is in stock are shown
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location"; power-ups-ubiquitous-language.md — *product availability filter*: "shows only stores whose stock availability for the selected product indicates the item is available"

4. **WHEN** both *store specialization filter* and *product availability filter* are active
   **THEN** only *stores* matching both criteria are shown (conjunctive narrowing)
   **Evidence:** power-ups-ubiquitous-language.md — *store specialization filter*: "combines with product availability filter — when both are active, only stores matching both criteria are shown"

5. **WHEN** no *stores* match the combined filters
   **THEN** a "no stores match your filters" message is shown with a "clear filters" action
   **Evidence:** power-ups-ubiquitous-language.md — *store specialization filter*: "displays a 'no stores match your filters' message with a 'clear filters' action when the combined filters produce zero results"

---

## Screen 3: My Store Preferences

**Layout:** form (store detail) + form (account settings) + modal (guest prompt)
**State file:** `my-store-preferences-state.json`
**Drawio:** `my-store-preferences.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Store detail header | body | chrome | Context for "Set as My Store" action |
| Set My Store action | body | button-bar | AC MyStore-1: "Set as My Store" on store detail page |
| Current preference indicator | body | chrome | AC MyStore-3: when set, shows current preference |
| Account settings — preference form | body | form | AC MyStore-1: also settable from account settings |
| Guest login prompt | body (modal) | chrome + button-bar | AC MyStore-4: prompt to log in without navigating away |

### In-scope stories

- Set My Store Preference
- Tailor Experience to Preferred Store

### Domain terms (verbatim)

- **my store** — the customer's declared preferred store, saved to their customer account and persisted across sessions and devices
- **tailored experience** — the set of behaviors that adapt browsing and checkout when a preferred store is set

### Acceptance criteria (verbatim)

**Set My Store Preference:**

1. **WHEN** a logged-in customer selects "Set as My Store" on a store detail page or from account settings
   **THEN** the selected *store* is saved as the customer's *my store*
   **AND** the preference persists across sessions and devices
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Maybe even the ability to set 'my store' as a preference and tailor the experience"; power-ups-ubiquitous-language.md — *my store*: "persisting across sessions and devices"

2. **WHEN** the customer changes their *my store* to a different *store*
   **THEN** the previous preference is replaced immediately
   **AND** the *tailored experience* reflects the new *store* without delay
   **Evidence:** power-ups-ubiquitous-language.md — *my store* invariant: "only one my store per customer account at any time; setting a new one replaces the old one immediately"

3. **WHEN** no *my store* is currently set
   **THEN** the customer can set one from a store detail page or account settings
   **BUT** no store-specific tailoring is applied — default behavior from previous increments persists
   **Evidence:** power-ups-ubiquitous-language.md — *my store* invariant: "when no my store is set, no store-specific tailoring is applied"

4. **WHEN** a guest customer (not logged in) tries to set *my store*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** power-ups-ubiquitous-language.md — *my store*: "requires a logged-in customer account — guest sessions cannot set my store and are prompted to log in or register without navigating away"

**Tailor Experience to Preferred Store:**

1. **WHEN** the customer has a *my store* set and views a product page
   **THEN** *stock availability* on the product page defaults to the preferred *store*
   **AND** the customer sees availability at their local *store* without manual selection
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "tailor the experience"; power-ups-ubiquitous-language.md — *tailored experience*: "defaults stock availability on product pages to the preferred store"

2. **WHEN** the customer has a *my store* set and opens the *store locator*
   **THEN** the preferred *store* is visually highlighted
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "highlights the preferred store in the store locator"

3. **WHEN** the customer has a *my store* set and enters checkout with *click-and-collect*
   **THEN** the preferred *store* is pre-selected in the *click-and-collect* store-selection step
   **AND** the full *store* list remains available for override
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "pre-selects the preferred store in the click-and-collect checkout flow, while keeping the full store list available for override"

4. **WHEN** the customer has no *my store* set
   **THEN** no store-specific tailoring is applied
   **AND** previous-increment default behavior is preserved
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "applies no tailoring when no my store is set — previous-increment default behavior is preserved"

---

## Screen 4: Customer Pet Profiles (My Pets)

**Layout:** form (list) → form (create/edit) + modal (guest prompt)
**State file:** `customer-pet-profiles-state.json`
**Drawio:** `customer-pet-profiles.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| My Pets header | body | chrome | Context header |
| Pet profiles list | body | list | AC Pet-1: list of customer pet profiles; AC Pet-3: multiple pets listed |
| Empty state | body | chrome | AC Pet-1: empty state "add your first pet" |
| Pet profile form | body | form | AC Pet-2: form collects name, species, breed, age/DOB, photo |
| Guest login prompt | body (modal) | chrome + button-bar | AC Pet-5: prompt to log in without navigating away |

### In-scope stories

- Create Customer Pet

### Domain terms (verbatim)

- **customer pet profile** — a record of the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)

### Acceptance criteria (verbatim)

**Create Customer Pet:**

1. **WHEN** a logged-in customer opens "My Pets" from account settings
   **THEN** a list of their *customer pet profiles* is displayed (or an empty state with "add your first pet")
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "pet profiles for their own pets"

2. **WHEN** the customer creates a new *customer pet profile*
   **THEN** the form collects: name, species, breed (optional), age or date of birth (optional), and photo (optional)
   **AND** the profile is saved to the *customer account*
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "basic pet profile — name, species, breed, age"; power-ups-ubiquitous-language.md — *customer pet profile*: "records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)"

3. **WHEN** the customer has multiple pets
   **THEN** each pet has its own *customer pet profile* entry
   **AND** all are listed under "My Pets"
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "supports multiple profiles per customer account, each listed under 'My Pets'"

4. **WHEN** species and breed data is saved on a *customer pet profile*
   **THEN** the data feeds downstream personalised recommendation algorithms
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "feeds downstream personalized recommendation algorithms with species, breed, and age data"

5. **WHEN** a guest customer (not logged in) tries to create a *customer pet profile*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "guest sessions are prompted to log in before creating a profile"

---

## Screen 5: Inventory Dashboard (Admin)

**Layout:** stack (full-width table with header toolbar)
**State file:** `inventory-dashboard-state.json`
**Drawio:** `inventory-dashboard.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Dashboard header with export | body | toolbar | AC Inv-5: export CSV; context for store scoping |
| Search and filter bar | body | filter-bar | AC Inv-1: supports search |
| Sort and filter controls | body | toolbar | AC Inv-1: sort by name, stock level, category; AC Inv-2: "low stock only" filter |
| Product stock table | body | list | AC Inv-1: all products listed with stock levels; AC Inv-2: low stock alert badge |
| Inline stock edit | body | form | AC Inv-3: inline editing with immediate persist |
| Validation error state | body | chrome | AC Inv-6: rejects invalid stock level with clear error |
| Low stock threshold config (modal) | body | form (modal) | UL: low stock threshold is configurable |

### In-scope stories

- View Inventory Dashboard
- Display Low Stock Badge

### Domain terms (verbatim)

- **inventory dashboard** — the admin interface listing all products at a store with current stock levels, supporting search, sort, filter, and inline editing
- **low stock alert** — a visual badge shown on a product row when its stock level falls below the configurable threshold
- **low stock threshold** — the configurable stock level below which a low stock alert is triggered for a product
- **stock level** — the numeric quantity of a product at a store, viewed and edited on the inventory dashboard
- **inventory export** — a CSV download of stock data scoped to the staff member's store

### Acceptance criteria (verbatim)

**View Inventory Dashboard:**

1. **WHEN** *store staff* opens the *inventory dashboard*
   **THEN** all *products* at their *store* are listed with current *stock levels*
   **AND** the dashboard supports search, sort (by name, *stock level*, *category*), and filter
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; power-ups-ubiquitous-language.md — *inventory dashboard*: "lists all products at a store with current stock levels … supporting search, sort, filter"

2. **WHEN** a *product's* *stock level* falls below the configured *low stock threshold*
   **THEN** a *low stock alert* badge is shown on that *product's* row
   **AND** a "low stock only" filter is available on the *inventory dashboard*
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "drives the 'low stock only' filter on the inventory dashboard"; invariant: "must appear on every product whose stock level is below the low stock threshold"

3. **WHEN** *store staff* edits a *stock level* from the *inventory dashboard*
   **THEN** the same behavior as Update Product Stock Levels (Increment 1) applies: immediate persist, real-time customer-facing *stock availability* update, validation
   **Evidence:** established in Increment 1 — Update Product Stock Levels AC; power-ups-ubiquitous-language.md — *stock level* invariant: "edits must propagate to customer-facing stock availability in real time"

4. **WHEN** *store staff* views the *inventory dashboard* for the first time after Increment 9 deployment
   **THEN** the *inventory dashboard* replaces the bare-bones stock editing form from Increment 1
   **AND** all existing stock data is intact — no data migration loss
   **Evidence:** power-ups-ubiquitous-language.md — *inventory dashboard*: "replaces the bare-bones stock editing form from Increment 1"; invariant: "transition from the prior form must not lose data"

5. **WHEN** *store staff* exports inventory data
   **THEN** the *inventory export* produces a CSV with *product* name, *category*, current *stock level*, and last updated timestamp
   **AND** the export covers the *store staff* member's *store* only
   **Evidence:** power-ups-ubiquitous-language.md — *inventory export*: "produces a CSV download … includes product name, category, current stock level, and last updated timestamp per row"; "is scoped to the single store"

6. **WHEN** *store staff* enters an invalid *stock level* (negative or non-numeric)
   **THEN** the *inventory dashboard* rejects the update with a clear error message
   **BUT** the previous *stock level* remains unchanged
   **Evidence:** power-ups-ubiquitous-language.md — *stock level* invariant: "must always be a non-negative value"

**Display Low Stock Badge:**

1. **WHEN** a *product's* *stock level* falls below its configured *low stock threshold* but remains greater than zero
   **THEN** a *low stock alert* badge is shown on the *product* row in the *inventory dashboard*
   **AND** the badge communicates urgency (e.g. "Low stock" or the current quantity)
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "a visual badge shown on a product row in the inventory dashboard when the product's stock level falls below the low stock threshold"

2. **WHEN** a *product's* *stock level* is at or above its *low stock threshold*
   **THEN** no *low stock alert* badge is shown on that *product's* row
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert* invariant: "must disappear when the stock level is raised above the threshold"

3. **WHEN** *store staff* raises a *product's* *stock level* above the *low stock threshold*
   **THEN** the *low stock alert* badge disappears on the next view
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert* invariant: "must appear on every product whose stock level is below the low stock threshold; must disappear when the stock level is raised above the threshold"

4. **WHEN** *store staff* activates the "low stock only" filter on the *inventory dashboard*
   **THEN** only *products* with *stock levels* below their *low stock threshold* are shown
   **AND** staff can quickly identify *products* needing replenishment
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "drives the 'low stock only' filter on the inventory dashboard so store staff can quickly find products needing replenishment"

5. **WHEN** a *product's* *stock level* reaches zero
   **THEN** the *product* row shows an "out of stock" indicator
   **AND** the *low stock alert* badge is superseded by the out-of-stock state
   **Evidence:** power-ups-ubiquitous-language.md — *stock level*: "a zero stock level means the product is out of stock for customers"

---

## Screen 6: Backorder Product Page

**Layout:** form (product detail) + form (cart with backorder label)
**State file:** `backorder-product-page-state.json`
**Drawio:** `backorder-product-page.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Product header | body | chrome | Product identification |
| Stock status — backorder | body | chrome | AC Backorder-1: "Backorder" indicator instead of "Out of Stock" |
| Add to Cart (Backorder) | body | button-bar | AC Backorder-1: "Add to Cart" action available |
| Stock status — out of stock (no backorder) | body | chrome | AC Backorder-4: shows "Out of Stock", cart disabled |
| Cart with backorder label | body | list | AC Backorder-2: cart line item shows backorder label |

### In-scope stories

- Allow Backorder Purchase

### Domain terms (verbatim)

- **backorder purchase** — the ability for a customer to purchase a product that is currently out of stock, with a backorder expectation

### Acceptance criteria (verbatim)

**Allow Backorder Purchase:**

1. **WHEN** a *product* is currently out of stock and *backorder purchase* is enabled for that *product*
   **THEN** the product page shows a "Backorder" indicator instead of "Out of Stock"
   **AND** the "Add to Cart" action is available
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase*: "allows a customer to purchase a product that is currently out of stock, relaxing the previous gate"

2. **WHEN** the customer adds a backordered *product* to the cart
   **THEN** the cart line item shows a backorder label
   **AND** the customer is informed that the *product* is backordered and will ship when restocked
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase*: "signals to the customer that the product is backordered and will ship when restocked"

3. **WHEN** the customer proceeds to checkout with a backordered *product*
   **THEN** the order summary shows the backorder status per affected line item
   **AND** the order is accepted and payment is processed normally
   **Evidence:** inferred — backorder relaxes the stock gate at checkout; order flow otherwise unchanged

4. **WHEN** a *product* is out of stock and *backorder purchase* is not enabled
   **THEN** the product shows "Out of Stock"
   **AND** the "Add to Cart" action is disabled (existing behavior from prior increments)
   **BUT** no backorder option is presented
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase* relaxes "the previous gate where stock availability prevented checkout of unavailable items" — gate remains for non-backorder products

5. **WHEN** a previously backordered *product* is restocked (its *stock level* rises above zero)
   **THEN** the backorder indicator is replaced by normal *stock availability* ("In Stock")
   **AND** standard purchase flow resumes
   **Evidence:** inferred — backorder is a temporary state; restocking restores normal behavior

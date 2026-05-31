# Interface design — Increment 4 (Returning customers)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-4-returning-customers.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–3 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 4 — Returning customers (22 screens, 16 stories) |
| Lo-fi reference | `docs/ux/lo-fi/increment-4-returning-customers.md` |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-4-acceptance-criteria.md` |
| Specification by example | `docs/story/specification-by-example/increment-4-specification-by-example.md` |
| Scenario walkthrough | `docs/domain/increment-4-walkthrough.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Initial IA | `docs/end-to-end/discovery/information-architecture.md` (Increment 1 base; Increment 2–3 checkout patterns; Increment 4 account screens AC-derived per lo-fi) |
| Prior interface specs | `docs/ux/increment-2-interface-design.md`, `docs/ux/increment-3-interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/customer-account/`, `packages/cart/` (extend), `packages/order/` (extend), `packages/payment/` (extend), `packages/app-client/src/pages/` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-25 (Specification slot 109) |

## Description

Returning-customer capabilities on PawPlace: *customer account* registration and login with mandatory *email verification*, password reset, account settings (*address book*, *saved payment method*), *order history* with *reorder*, *wishlist*, and logged-in checkout with *saved address* / *saved payment method* selection. Labels use ubiquitous-language terms verbatim. **Guest checkout paths from Increments 2–3 are preserved** — manual shipping address entry with optional login/register prompt; no account required to complete purchase. *StripeWave* is the sole active *payment vendor*. *Email verification* gates account-only features (*wishlist*, saved entities, logged-in checkout shortcuts).

---

## Host project conventions

Same baseline as Increments 2–3; additions for account module and session-aware chrome.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; account and auth pages in `packages/app-client/src/pages/account/` and `pages/auth/`; checkout extensions in existing checkout pages
- **State management:** React component state + `CartContext`; `CustomerSessionContext` (or equivalent) for authenticated chrome and route guards; checkout wizard step state with guest vs logged-in branching
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions; extend Increment 1–3 customer chrome
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests where host adds it; manual keyboard pass per new screen
- **Performance budget:** no explicit bundle cap — do not regress Increment 3 baseline; lazy-load StripeWave widget on payment step only; account list screens paginate or virtualize when >50 rows (future)

---

## Customer chrome evolution

| State | Primary navigation (toolbar) | Notes |
| --- | --- | --- |
| **Guest** | find stores · shop supplies · shopping cart (count) · log in · register (primary) | No account menu; wishlist affordance on product page triggers guest prompt |
| **Logged in (verified)** | find stores · shop supplies · shopping cart (count) · wishlist · account (primary) | Account dropdown or `/account` hub; wishlist link to `/wishlist` |
| **Logged in (unverified)** | Same as guest for account-only features | Protected routes redirect with *please verify your email first*; resend offered |

**Account settings nav (sidebar layout screens):** overview (active) · address book · saved payment methods · order history

**Email verification gate:** *wishlist*, *address book*, *saved payment method*, *order history*, saved-entity checkout selection, and *reorder* require *account verification status* verified. Registration and login succeed for unverified accounts but account-only surfaces block until verification completes.

---

## Checkout flow extension (guest preserved, logged-in saved entities)

Increment 3 dual paths remain unchanged for **guest** customers. **Logged-in verified** customers gain saved-entity selection on shipping and payment steps.

| Path | Actor | Shipping step | Payment step |
| --- | --- | --- | --- |
| **Guest — standard delivery** | guest | Manual *shipping address* only; optional *log in or register for saved address benefit* prompt | Manual *StripeWave* card entry (Increment 2–3) |
| **Guest — click-and-collect** | guest | Skipped (Increment 3) | Manual *StripeWave* |
| **Logged in — standard delivery** | verified *customer account* | *saved address* listbox with *default address* pre-selected; *use a different address* reveals manual entry + *save this address for future orders* | *saved payment method* listbox with *default payment method* pre-selected; *use a different payment method* reveals StripeWave entry + *save this payment method for future orders* |
| **Logged in — click-and-collect** | verified *customer account* | Skipped | Saved payment selection as above |

**Checkout progress tabs (labels — verbatim UL):** unchanged from Increment 3 — dynamic spine per delivery path; inactive steps greyed.

---

## Screens (carried from lo-fi)

| Screen | Layout | Route (planned) | Stories | Change |
| --- | --- | --- | --- | --- |
| register account | form | `/register` | Register Account | **New** |
| registration confirmation | stack | `/register/confirmation` | Register Account · Send Email Verification | **New** |
| log in | form | `/login` | Log In · Maintain Session Across Devices | **New** |
| verify email — success | stack | `/verify-email/success` | Verify Email Address | **New** |
| verify email — link expired | stack | `/verify-email/expired` | Verify Email Address · Send Email Verification | **New** |
| reset password — request | form | `/reset-password` | Reset Password | **New** |
| reset password — set new password | form | `/reset-password/set` | Reset Password · Maintain Session Across Devices | **New** |
| account dashboard | sidebar | `/account` | Log Out · Maintain Session Across Devices | **New** |
| address book | sidebar | `/account/addresses` | Manage Saved Addresses · Save Delivery Address | **New** |
| edit saved address | form | `/account/addresses/:id/edit` | Manage Saved Addresses | **New** |
| saved payment methods | sidebar | `/account/payment-methods` | Manage Saved Payment Methods · Save Payment Method | **New** |
| order history | sidebar | `/account/orders` | View Order History · Reorder Previous Purchase | **New** |
| order history detail | stack | `/account/orders/:orderNumber` | View Order History · Reorder Previous Purchase | **New** |
| product page — wishlist | stack | `/products/:sku` (extend) | Manage Wishlist | **Extend** Inc 1/2 product page |
| wishlist — guest prompt | modal | (overlay on product page) | Manage Wishlist | **New** |
| wishlist page | sidebar | `/wishlist` | Manage Wishlist | **New** |
| guest checkout — shipping address | split-screen | `/checkout/shipping` | Select Saved Address at Checkout · Enter Shipping Address (Inc 3) | **Extend** — guest path preserved |
| logged-in checkout — saved address | split-screen | `/checkout/shipping` | Select Saved Address at Checkout · Save Delivery Address | **Extend** — logged-in branch |
| logged-in checkout — new address | split-screen | `/checkout/shipping` | Select Saved Address at Checkout · Save Delivery Address | **Extend** — state within shipping step |
| logged-in checkout — saved payment method | split-screen | `/checkout/payment` | Select Saved Payment Method at Checkout · Save Payment Method | **Extend** — logged-in branch |
| logged-in checkout — new payment method | split-screen | `/checkout/payment` | Select Saved Payment Method at Checkout · Save Payment Method | **Extend** — state within payment step |
| shopping cart — after reorder | sidebar | `/cart` | Reorder Previous Purchase · Log In | **Extend** — partial reorder feedback |

Affordances, control types, conditional states, and scope guard: see lo-fi § Screens, § Affordance trace, and § Scope guard.

---

## Screen specs (from lo-fi — regions verbatim)

### register account

**Layout:** form  
**AC stories:** Register Account

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — guest | header | toolbar | find stores · shop supplies · shopping cart · log in · register (primary) | Guest chrome |
| registration form | body | form | email address · password · confirm password · password requirements · create account (primary) | Requirements visible before submit: minimum 8 characters · at least one uppercase letter · at least one digit · at least one special character |
| registration validation feedback | body | form | email already in use error · password requirements unmet error · log in instead | Duplicate email does not reveal *account verification status* |

---

### registration confirmation

**Layout:** stack  
**AC stories:** Register Account · Send Email Verification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| email verification pending | body | form | check your email to verify · expect verification email shortly · resend verification | Shown after successful registration; queued retry messaging when delivery unavailable |

---

### log in

**Layout:** form  
**AC stories:** Log In · Maintain Session Across Devices

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| login form | body | form | email address · password · log in (primary) · forgot password | Redirect to previous page or account dashboard on success |
| login validation feedback | body | form | invalid email or password error · please verify your email first · resend verification | Generic credential error; unverified blocks *customer session* with account-only access |

**Session middleware (Maintain Session Across Devices):** expired *customer session* on protected route redirects to `/login` with return URL; *shopping cart* tied to *customer account* preserved.

---

### verify email — success / link expired

**Layout:** stack  
**Routes:** `/verify-email/success` · `/verify-email/expired`  
**AC stories:** Verify Email Address · Send Email Verification

| Screen | Controls | Interaction decisions |
| --- | --- | --- |
| success | you're verified — log in to continue · log in (primary) | Valid *verification link* transitions *account verification status* to verified |
| link expired | link expired message · already verified message · resend verification (primary) · log in | Covers expired and already-used link states |

---

### reset password — request / set new password

**Layout:** form  
**Routes:** `/reset-password` · `/reset-password/set`  
**AC stories:** Reset Password · Maintain Session Across Devices

| Screen | Controls | Interaction decisions |
| --- | --- | --- |
| request | email address · send reset link (primary) · check your email (same message regardless) | Enumeration-safe — same confirmation whether account exists |
| set new password | new password · confirm password · password requirements · link expired — request new reset · set new password (primary) | Password change invalidates all *customer session* on all devices |

---

### account dashboard

**Layout:** sidebar  
**AC stories:** Log Out · Maintain Session Across Devices

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| primary navigation — logged in | find stores · shop supplies · shopping cart · wishlist · account (primary) | Logged-in chrome |
| account settings nav | overview (active) · address book · saved payment methods · order history | Settings hub |
| account overview | customer account email · account verification status · log out · log out everywhere | Current device logout vs invalidate all sessions |

---

### address book / edit saved address

**Layout:** sidebar / form  
**Routes:** `/account/addresses` · `/account/addresses/:id/edit`  
**AC stories:** Manage Saved Addresses · Save Delivery Address

| Screen | Key controls | Interaction decisions |
| --- | --- | --- |
| address book | saved address list · default address indicator · edit · delete · set as default address (primary) | First saved address auto-default; delete default prompts *select new default address* |
| edit saved address | recipient name · address line 1 · address line 2 (optional) · city · postcode · country · cancel · save saved address (primary) | Edits persist to future checkouts |

---

### saved payment methods

**Layout:** sidebar  
**Route:** `/account/payment-methods`  
**AC stories:** Manage Saved Payment Methods · Save Payment Method

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| saved payment method list | last four digits · card type · expiry · default payment method indicator · remove · set as default payment method (primary) | Vendor token only — no raw card stored |
| expired token state | expired saved payment method removed | Expired/revoked tokens not silently used |

---

### order history / order history detail

**Layout:** sidebar / stack  
**Routes:** `/account/orders` · `/account/orders/:orderNumber`  
**AC stories:** View Order History · Reorder Previous Purchase

| Screen | Key controls | Interaction decisions |
| --- | --- | --- |
| order history list | order number · date · items condensed · total · order status · select order · reorder (primary) | Most recent first; guest orders retroactively linked when email matches |
| order history empty state | no orders yet — start shopping · shop supplies (primary) | Empty state when no *order* |
| order detail | order number · order status · order line item list · shipping address snapshot · billing address snapshot · delivery option · masked payment method · tracking number · back to order history · reorder (primary) | Full detail on select; *reorder* navigates to cart |

---

### product page — wishlist / wishlist page / guest prompt

**Routes:** `/products/:sku` (extend) · `/wishlist` · modal overlay  
**AC stories:** Manage Wishlist

| Surface | Key controls | Interaction decisions |
| --- | --- | --- |
| product page | add to cart (primary) · add to wishlist · remove from wishlist | Toggle after add; requires verified *customer account* |
| guest prompt (modal) | wishlist requires verified customer account · log in · register · dismiss (primary) | Dismissible; product page stays visible |
| wishlist page | product name · price · stock availability · add to cart (primary) · remove from wishlist | Add to cart does not remove from *wishlist* |

---

### guest checkout — shipping address (Increment 3 preserved)

**Layout:** split-screen  
**Route:** `/checkout/shipping` (guest branch)  
**AC stories:** Select Saved Address at Checkout (AC 4) · Enter Shipping Address (Inc 3)

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| shipping address | recipient name · address line 1 · city · postcode · country | Manual entry only — no *address book* |
| guest account prompt | log in or register for saved address benefit · log in · register | Prompt only; *guest checkout* proceeds without account |
| order summary | shipping address preview · cart total · back · continue to delivery option (primary) | Increment 3 guest path unchanged |

---

### logged-in checkout — saved address / new address

**Layout:** split-screen  
**Route:** `/checkout/shipping` (logged-in branch)  
**AC stories:** Select Saved Address at Checkout · Save Delivery Address

| State | Controls | Interaction decisions |
| --- | --- | --- |
| saved selection | saved address selection (listbox) · home — default address (selected) · office — saved address · use a different address · selected saved address preview · continue to delivery option (primary) | *default address* pre-selected; selection auto-fills fields |
| new address | manual shipping address fields · save this address for future orders (checkbox) | Revealed via *use a different address*; first saved becomes *default address* |

---

### logged-in checkout — saved payment method / new payment method

**Layout:** split-screen  
**Route:** `/checkout/payment` (logged-in branch)  
**AC stories:** Select Saved Payment Method at Checkout · Save Payment Method

| State | Controls | Interaction decisions |
| --- | --- | --- |
| saved selection | saved payment method selection (listbox) · Visa •••• 4242 — default payment method (selected) · expired saved payment method (dimmed) · use a different payment method · last four digits and card type confirmation · confirm order (primary) | Token payment — no card re-entry; expired token not chargeable |
| new payment | StripeWave (sole payment vendor) · card number · expiry · CVV · save this payment method for future orders (checkbox) | Manual entry when *use a different payment method* selected |

---

### shopping cart — after reorder

**Layout:** sidebar  
**Route:** `/cart` (extend)  
**AC stories:** Reorder Previous Purchase · Log In

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| reorder feedback | partial reorder — product could not be added · stock availability warning on line item · proceed anyway · remove line item | Partial *reorder* succeeds; delisted products listed |
| cart item list | product name · quantity · line total · remove | Reordered products merge with existing cart quantities |

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Auth (register, login, verify, reset) | `RegisterPage.tsx`, `LoginPage.tsx`, `VerifyEmailPage.tsx`, `ResetPasswordPage.tsx` | `packages/customer-account/server/` |
| Customer session + route guards | `CustomerSessionContext.tsx`, `RequireVerifiedAccount.tsx` | session middleware |
| Account dashboard + settings | `AccountDashboardPage.tsx`, `AddressBookPage.tsx`, `SavedPaymentMethodsPage.tsx`, `OrderHistoryPage.tsx` | customer-account REST |
| Wishlist | `WishlistPage.tsx`, `WishlistButton.tsx`, `GuestWishlistPrompt.tsx` | wishlist API |
| Checkout saved entities | `ShippingAddressPage.tsx` (extend), `PaymentPage.tsx` (extend) | address book + saved payment method APIs |
| Cart reorder feedback | `ShoppingCartPage.tsx` (extend), `ReorderFeedbackBanner.tsx` | reorder service |
| Email verification (system) | (no customer UI beyond confirmation/resend) | `packages/notification/server/` |

---

## AC → behaviour → test mapping

One row per Increment 4 AC clause. Test names trace to story title and clause number. Status **pending (Engineering)** until implementation pass.

### Register Account

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Register Account | 1 | Registration form collects email address and password with confirmation; password requirements shown before submit | `Register Account — AC 1: form collects credentials with requirements visible` | pending (Engineering) |
| Register Account | 2 | Valid submit creates unverified *customer account*, triggers *email verification*, shows *check your email to verify* | `Register Account — AC 2: creates unverified account and confirmation` | pending (Engineering) |
| Register Account | 3 | Duplicate email shows *This email is already in use* and *Log In instead* without revealing verification status | `Register Account — AC 3: duplicate email enumeration-safe error` | pending (Engineering) |
| Register Account | 4 | Unmet password requirements listed; no account created | `Register Account — AC 4: password requirements block creation` | pending (Engineering) |

### Send Email Verification

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Email Verification | 1 | On account creation, verification email sent with unique time-limited *verification link* | `Send Email Verification — AC 1: email with unique link sent` | pending (Engineering) |
| Send Email Verification | 2 | Expired link click shows *link expired* and *resend verification* | `Send Email Verification — AC 2: expired link resend offered` | pending (Engineering) |
| Send Email Verification | 3 | Delivery failure queues notification; confirmation shows *expect the email shortly* | `Send Email Verification — AC 3: queued retry messaging on confirmation` | pending (Engineering) |

### Verify Email Address

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Verify Email Address | 1 | Valid link sets *account verification status* verified; redirect to *you're verified* with log in prompt | `Verify Email Address — AC 1: valid link verifies account` | pending (Engineering) |
| Verify Email Address | 2 | Already-used link shows *already verified* with login link; status unchanged | `Verify Email Address — AC 2: used link idempotent message` | pending (Engineering) |
| Verify Email Address | 3 | Expired link shows *link expired* with *resend verification* | `Verify Email Address — AC 3: expired link resend action` | pending (Engineering) |

### Log In

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Log In | 1 | Valid credentials create *customer session*; redirect to previous page or account dashboard | `Log In — AC 1: session created and redirect` | pending (Engineering) |
| Log In | 2 | Incorrect credentials show generic *invalid email or password* | `Log In — AC 2: generic credential error` | pending (Engineering) |
| Log In | 3 | Unverified account shows *please verify your email first* with resend; no account-only session | `Log In — AC 3: unverified blocked with resend` | pending (Engineering) |
| Log In | 4 | Guest *shopping cart* merges into account cart; duplicate SKUs sum quantities | `Log In — AC 4: guest cart merge sums quantities` | pending (Engineering) |

### Log Out

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Log Out | 1 | *Log Out* invalidates current *customer session*; redirect to home as guest | `Log Out — AC 1: current session invalidated` | pending (Engineering) |
| Log Out | 2 | Logout on one device leaves other sessions active; *Log out everywhere* invalidates all | `Log Out — AC 2: single device vs log out everywhere` | pending (Engineering) |

### Reset Password

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Reset Password | 1 | Reset request shows *check your email* regardless of account existence | `Reset Password — AC 1: enumeration-safe confirmation` | pending (Engineering) |
| Reset Password | 2 | Valid reset link opens set-new-password form with registration-equivalent requirements | `Reset Password — AC 2: valid link opens form` | pending (Engineering) |
| Reset Password | 3 | New password updates account and invalidates all sessions | `Reset Password — AC 3: password update invalidates sessions` | pending (Engineering) |
| Reset Password | 4 | Expired or used link shows *link expired* with *Request new reset*; password unchanged | `Reset Password — AC 4: expired or used link rejected` | pending (Engineering) |

### Maintain Session Across Devices

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Maintain Session Across Devices | 1 | Login on new device creates additional session; existing sessions remain active | `Maintain Session Across Devices — AC 1: concurrent sessions` | pending (Engineering) |
| Maintain Session Across Devices | 2 | Session expiry redirects to login; account *shopping cart* entries preserved | `Maintain Session Across Devices — AC 2: expiry redirect preserves cart` | pending (Engineering) |
| Maintain Session Across Devices | 3 | Password reset invalidates all sessions on all devices | `Maintain Session Across Devices — AC 3: password reset cascade` | pending (Engineering) |

### Save Delivery Address

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Save Delivery Address | 1 | Checkout with new address offers *save this address for future orders*; opt-in stores in *address book* | `Save Delivery Address — AC 1: checkout save opt-in` | pending (Engineering) |
| Save Delivery Address | 2 | First saved address automatically becomes *default address* | `Save Delivery Address — AC 2: first address auto-default` | pending (Engineering) |
| Save Delivery Address | 3 | Additional save adds entry without replacing existing; settings shows *set as default* | `Save Delivery Address — AC 3: additional entry non-destructive` | pending (Engineering) |

### Manage Saved Addresses

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Manage Saved Addresses | 1 | *Address book* lists all *saved address* with *default address* indicated | `Manage Saved Addresses — AC 1: list with default indicator` | pending (Engineering) |
| Manage Saved Addresses | 2 | Edit persists; future checkouts reflect updated details | `Manage Saved Addresses — AC 2: edit persists to checkout` | pending (Engineering) |
| Manage Saved Addresses | 3 | Delete removes entry; deleting default prompts new default selection | `Manage Saved Addresses — AC 3: delete default prompts new default` | pending (Engineering) |
| Manage Saved Addresses | 4 | Set new default demotes previous; future checkouts pre-select new default | `Manage Saved Addresses — AC 4: set default demotes previous` | pending (Engineering) |

### Save Payment Method

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Save Payment Method | 1 | Checkout offers *save this payment method for future orders*; stores *StripeWave* vendor token only | `Save Payment Method — AC 1: checkout save via token` | pending (Engineering) |
| Save Payment Method | 2 | Display metadata (last four digits, card type, expiry) stored; future payment uses token | `Save Payment Method — AC 2: display metadata without raw card` | pending (Engineering) |
| Save Payment Method | 3 | Second saved method listed; first remains *default payment method* unless changed | `Save Payment Method — AC 3: second method retains first default` | pending (Engineering) |

### Manage Saved Payment Methods

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Manage Saved Payment Methods | 1 | Settings lists all methods with last four digits, card type, expiry; default indicated | `Manage Saved Payment Methods — AC 1: list with default indicator` | pending (Engineering) |
| Manage Saved Payment Methods | 2 | Remove deletes token; removing default prompts new default | `Manage Saved Payment Methods — AC 2: remove default prompts new default` | pending (Engineering) |
| Manage Saved Payment Methods | 3 | Set new default demotes previous; future checkouts pre-select new default | `Manage Saved Payment Methods — AC 3: set default demotes previous` | pending (Engineering) |

### Select Saved Address at Checkout

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Saved Address at Checkout | 1 | Logged-in shipping step shows all *saved address*; *default address* pre-selected | `Select Saved Address at Checkout — AC 1: list with default pre-selected` | pending (Engineering) |
| Select Saved Address at Checkout | 2 | Selecting saved address auto-fills and advances without manual entry | `Select Saved Address at Checkout — AC 2: selection auto-fills and advances` | pending (Engineering) |
| Select Saved Address at Checkout | 3 | *use a different address* reveals manual entry and save checkbox | `Select Saved Address at Checkout — AC 3: different address with save opt-in` | pending (Engineering) |
| Select Saved Address at Checkout | 4 | Guest sees manual entry only with login/register prompt; checkout proceeds without account | `Select Saved Address at Checkout — AC 4: guest manual only preserved` | pending (Engineering) |

### Select Saved Payment Method at Checkout

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Saved Payment Method at Checkout | 1 | Logged-in payment step shows all *saved payment method*; default pre-selected | `Select Saved Payment Method at Checkout — AC 1: list with default pre-selected` | pending (Engineering) |
| Select Saved Payment Method at Checkout | 2 | Selecting saved method charges via vendor token; shows last four digits and card type | `Select Saved Payment Method at Checkout — AC 2: token charge with confirmation` | pending (Engineering) |
| Select Saved Payment Method at Checkout | 3 | *use a different payment method* reveals StripeWave entry and save checkbox | `Select Saved Payment Method at Checkout — AC 3: manual entry with save opt-in` | pending (Engineering) |
| Select Saved Payment Method at Checkout | 4 | Expired token dimmed/marked; not silently charged; valid methods and manual entry remain | `Select Saved Payment Method at Checkout — AC 4: expired token not charged` | pending (Engineering) |

### View Order History

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Order History | 1 | *Order history* lists orders most recent first with number, date, items, total, status | `View Order History — AC 1: list most recent first` | pending (Engineering) |
| View Order History | 2 | Select opens full detail with line items, address snapshots, delivery option, masked payment, tracking | `View Order History — AC 2: full order detail` | pending (Engineering) |
| View Order History | 3 | Empty state shows *start shopping* prompt | `View Order History — AC 3: empty state` | pending (Engineering) |
| View Order History | 4 | Guest *order* with matching email retroactively appears after registration | `View Order History — AC 4: guest order retroactive association` | pending (Engineering) |

### Manage Wishlist

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Manage Wishlist | 1 | *Add to Wishlist* on product page adds item; control toggles to *Remove from Wishlist* | `Manage Wishlist — AC 1: add toggles control state` | pending (Engineering) |
| Manage Wishlist | 2 | Wishlist page shows name, image, price, and *stock availability* per item | `Manage Wishlist — AC 2: list with stock availability` | pending (Engineering) |
| Manage Wishlist | 3 | *Add to Cart* from wishlist adds to cart without removing from wishlist | `Manage Wishlist — AC 3: add to cart retains wishlist item` | pending (Engineering) |
| Manage Wishlist | 4 | Remove from wishlist resets product page control to *Add to Wishlist* | `Manage Wishlist — AC 4: remove resets product control` | pending (Engineering) |
| Manage Wishlist | 5 | Guest add shows dismissible login/register prompt; stays on product page | `Manage Wishlist — AC 5: guest dismissible prompt` | pending (Engineering) |

### Reorder Previous Purchase

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Reorder Previous Purchase | 1 | *Reorder* adds all line items with original quantities; navigates to cart | `Reorder Previous Purchase — AC 1: reorder navigates to cart` | pending (Engineering) |
| Reorder Previous Purchase | 2 | Delisted products skipped with message; partial reorder succeeds | `Reorder Previous Purchase — AC 2: delisted partial success message` | pending (Engineering) |
| Reorder Previous Purchase | 3 | Out-of-stock added with warning; *proceed anyway* and *remove* on line | `Reorder Previous Purchase — AC 3: out of stock warning options` | pending (Engineering) |
| Reorder Previous Purchase | 4 | Reorder merges into existing cart; duplicate SKUs sum quantities | `Reorder Previous Purchase — AC 4: merge sums quantities` | pending (Engineering) |

---

## Accessibility implementation

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | Registration, login, reset, address, payment, checkout manual entry — `<label for>` on all fields; listbox options associated with group legend |
| Focus order matches reading order | planned | Auth forms: nav → heading → fields → primary action → secondary links. Account sidebar: nav → content → row actions. Checkout saved-entity: listbox → preview → summary → continue |
| Focus is visible | planned | Extend Increment 2–3 focus styles; modal trap focus for guest wishlist prompt |
| Errors programmatically associated | planned | `aria-describedby` on registration, login, address edit, checkout validation; `aria-live="polite"` on reorder partial-success banner |
| State cues not colour-only | planned | *default address* / *default payment method* use text badge + icon; expired payment method uses *expired* label not colour alone; *order status* as text labels |
| Keyboard reachable | planned | Full auth flow, account CRUD, wishlist, saved-entity checkout, reorder cart actions without mouse |
| Axe (or host equivalent) passes | planned | Run on all new/changed screens in Engineering ATDD pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Screen bundle size | No explicit cap | baseline preserved | Do not regress Increment 3 baseline |
| StripeWave widget | Lazy-load on payment step | — | Manual entry and saved-token confirm paths only load widget when needed |
| Account list screens | Render ≤100 rows without jank | — | Order history paginate if count exceeds 50 (future) |
| Session check | Non-blocking on public pages | — | Protected routes evaluate session async; cart preserved on expiry redirect |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | — | Modal enter/exit; reorder feedback banner |

---

## Scope guard (implementation)

| Excluded | Rationale |
| --- | --- |
| Social login | Increment 4 scope guard — email + password only |
| PayNova / VaultPay | *StripeWave* sole active *payment vendor* |
| Customer pet CRUD | Deferred per thin-slicing / UL scope |
| Communication preferences UI | Deferred per Increment 4 scope |
| Express / same-day delivery | Deferred per Increment 3 scope guard |
| Return flow | Deferred to Increment 7 |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout manual shipping | Select Saved Address at Checkout AC 4 — guest path unchanged |
| Increment 2 click-and-collect checkout | C&C path uses billing → pickup store → payment (no shipping) |
| Increment 3 standard delivery guest path | Manual shipping + dual delivery option branching |
| StripeWave-only payment | Increment 4 scope guard |

---

## Affordance trace (Increment 4)

See lo-fi § Affordance trace — all affordances mapped to AC story and clause. Spec implementation targets above cover each row.

---

## Walkthrough parity

| Walkthrough story group | Spec coverage |
| --- | --- |
| Register Account · Send Email Verification · Verify Email Address | register account · registration confirmation · verify email screens + AC mapping |
| Log In · Log Out · Reset Password · Maintain Session Across Devices | log in · account dashboard · reset password screens + session middleware notes |
| Save Delivery Address · Manage Saved Addresses · Select Saved Address at Checkout | address book · edit saved address · checkout shipping branches |
| Save Payment Method · Manage Saved Payment Methods · Select Saved Payment Method at Checkout | saved payment methods · checkout payment branches |
| View Order History · Reorder Previous Purchase | order history · order detail · cart after reorder |
| Manage Wishlist | product page extension · wishlist page · guest modal |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-25 | initial | Specification slot 109 — Increment 4 interface spec from lo-fi + spec-by-example + walkthrough; 22 screens; 57 AC clauses mapped; guest checkout preserved; email verification gate documented |

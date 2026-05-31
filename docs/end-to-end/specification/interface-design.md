# Interface Design


---

## increment-1 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 1

<!-- migrated from: increments/1-walk-in-driver/specification/interface-design.md -->

# Interface design — Increment 1 (Walk-in driver)

> **Companion to** lo-fi `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (prototype → ATDD → clean code). Code may exist as brownfield spike under `packages/` — this spec is authoritative for the slice refresh.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — 5 screens, 6 stories |
| Lo-fi reference | `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client`, `packages/store/client`, `packages/product-catalog/client` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-24 |

## Description

Payment-free, account-free browse: *store locator* (*map view* / *list view*), *product catalog*, *product page* with per-store *stock availability*, and *admin dashboard* stock form for *store employee*. Labels use ubiquitous-language terms verbatim. No cart, checkout, login, or keyword search.

---

## Host project conventions

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; app shell in `packages/app-client`
- **State management:** React component state + fetch via module `*.api.ts` clients
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions (no separate hi-fi token file yet)
- **Test framework:** Vitest (unit), Playwright (e2e) from repo `conf/`
- **Gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`

---

## Screens (carried from lo-fi)

| Screen | Layout | Stories |
| --- | --- | --- |
| store locator — map view | split-screen | View Store Map, Calculate Distance to Store |
| store locator — list view | split-screen | View Store List, Calculate Distance to Store |
| product catalog | sidebar | View Product Details (browse) |
| product page | stack | View Product Details, Display Real-Time Stock Availability |
| admin dashboard — stock levels | form | Update Product Stock Levels |

Affordances, control types, and conditional states: see lo-fi § Screens (unchanged).

---

## AC → behaviour → test mapping (summary)

| Story | Clauses | Implementation target | Test name pattern | Status |
| --- | --- | --- | --- | --- |
| View Store Map | 1–4 | `StoreMap.tsx` / `StoreLocatorPage` | `View Store Map — AC n` | pending (Engineering) |
| View Store List | 1–4 | `StoreList.tsx` | `View Store List — AC n` | pending |
| Calculate Distance to Store | 1–4 | locator API + sort | `Calculate Distance to Store — AC n` | pending |
| View Product Details | 1–5 | `ProductDetailView.tsx` | `View Product Details — AC n` | pending |
| Display Real-Time Stock Availability | 1–3 | `StockAvailabilityDisplay.tsx` | `Display Real-Time Stock Availability — AC n` | pending |
| Update Product Stock Levels | 1–4 | `StockAdminForm.tsx` | `Update Product Stock Levels — AC n` | pending |

---

## Accessibility implementation (planned)

| Check | Status |
| --- | --- |
| Programmatic labels on inputs (postcode, stock level, selects) | planned |
| Tab order: location → list/map → detail panel | planned |
| Visible focus | planned |
| Stock validation errors associated with field | planned |
| Keyboard-only path through all five screens | planned |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Specification slot 31 — spec from lo-fi + AC; code sync in Engineering |


---

## Increment 1

<!-- migrated from: increments/1-walk-in-driver/specification/interface-design.md -->

# Interface design — Increment 1 (Walk-in driver)

> **Companion to** lo-fi `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (prototype → ATDD → clean code). Code may exist as brownfield spike under `packages/` — this spec is authoritative for the slice refresh.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — 5 screens, 6 stories |
| Lo-fi reference | `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client`, `packages/store/client`, `packages/product-catalog/client` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-24 |

## Description

Payment-free, account-free browse: *store locator* (*map view* / *list view*), *product catalog*, *product page* with per-store *stock availability*, and *admin dashboard* stock form for *store employee*. Labels use ubiquitous-language terms verbatim. No cart, checkout, login, or keyword search.

---

## Host project conventions

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; app shell in `packages/app-client`
- **State management:** React component state + fetch via module `*.api.ts` clients
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions (no separate hi-fi token file yet)
- **Test framework:** Vitest (unit), Playwright (e2e) from repo `conf/`
- **Gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`

---

## Screens (carried from lo-fi)

| Screen | Layout | Stories |
| --- | --- | --- |
| store locator — map view | split-screen | View Store Map, Calculate Distance to Store |
| store locator — list view | split-screen | View Store List, Calculate Distance to Store |
| product catalog | sidebar | View Product Details (browse) |
| product page | stack | View Product Details, Display Real-Time Stock Availability |
| admin dashboard — stock levels | form | Update Product Stock Levels |

Affordances, control types, and conditional states: see lo-fi § Screens (unchanged).

---

## AC → behaviour → test mapping (summary)

| Story | Clauses | Implementation target | Test name pattern | Status |
| --- | --- | --- | --- | --- |
| View Store Map | 1–4 | `StoreMap.tsx` / `StoreLocatorPage` | `View Store Map — AC n` | pending (Engineering) |
| View Store List | 1–4 | `StoreList.tsx` | `View Store List — AC n` | pending |
| Calculate Distance to Store | 1–4 | locator API + sort | `Calculate Distance to Store — AC n` | pending |
| View Product Details | 1–5 | `ProductDetailView.tsx` | `View Product Details — AC n` | pending |
| Display Real-Time Stock Availability | 1–3 | `StockAvailabilityDisplay.tsx` | `Display Real-Time Stock Availability — AC n` | pending |
| Update Product Stock Levels | 1–4 | `StockAdminForm.tsx` | `Update Product Stock Levels — AC n` | pending |

---

## Accessibility implementation (planned)

| Check | Status |
| --- | --- |
| Programmatic labels on inputs (postcode, stock level, selects) | planned |
| Tab order: location → list/map → detail panel | planned |
| Visible focus | planned |
| Stock validation errors associated with field | planned |
| Keyboard-only path through all five screens | planned |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Specification slot 31 — spec from lo-fi + AC; code sync in Engineering |


---

## increment-2 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 2

<!-- migrated from: increments/2-click-and-collect/specification/interface-design.md -->

# Interface design — Increment 2 (Click-and-collect)

> **Companion to** lo-fi `docs/increments/2-click-and-collect/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 1 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 2 — 8 screens, 11 stories |
| Lo-fi reference | `docs/increments/2-click-and-collect/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/end-to-end/specification/architecture-reference.md` (Cart Session, Order Placement, Payment, Fulfillment mechanisms) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/cart/`, `packages/order/`, `packages/payment/`, `packages/app-client/src/pages/`, `packages/app-client/src/context/CartContext.tsx`, `packages/product-catalog/client/` (add-to-cart extension) |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-24 (Engineering slot 61 — implementation pass) |

## Description

Guest *click-and-collect* purchase path: extend Increment 1 *product page* with *add to cart*, session-scoped *shopping cart*, checkout wizard (*pickup store* selection, *guest checkout* / *billing address*, *StripeWave* *payment*), *order confirmation page*, and staff *click-and-collect queue* / *pickup fulfillment*. Labels use ubiquitous-language terms verbatim. No customer accounts, shipping address UI, PayNova, VaultPay, or cross-session cart persistence.

---

## Host project conventions

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; app shell and checkout wizard pages in `packages/app-client/src/pages/`; shared layout tokens in `packages/shared/layout-tokens.ts`
- **State management:** React component state + context for cart badge (`CartContext`); checkout wizard step state in page components; fetch via module `*.api.ts` clients
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions; extend Increment 1 chrome (`Increment1Nav` → customer nav with *shopping cart* count)
- **Token system:** `packages/shared/layout-tokens.ts` (font weights, sidebar/form widths); colour and spacing follow Increment 1 prototype until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests where host project adds it; manual keyboard pass per screen
- **Performance budget:** no explicit bundle cap declared — do not regress Increment 1 baseline; lazy-load payment vendor widget on payment step only

---

## Screens (carried from lo-fi)

| Screen | Layout | Route (planned) | Stories |
| --- | --- | --- | --- |
| product page — add to cart | stack | `/products/:sku` (extend) | Add Product to Cart · Display Real-Time Stock Availability (Inc 1) |
| shopping cart | sidebar | `/cart` | Add Product to Cart · Update Cart Quantity · Remove Product from Cart |
| click-and-collect store selection | split-screen | `/checkout/pickup-store` | Select Click-and-Collect Store |
| guest checkout — billing address | split-screen | `/checkout/billing` | Check Out as Guest · Enter Billing Address |
| payment — StripeWave | split-screen | `/checkout/payment` | Select Payment Method · Process Card Payment via StripeWave |
| order confirmation page | stack | `/order-confirmation/:orderNumber` | Confirm Order and Send Confirmation Email · Check Out as Guest (account prompt) |
| click-and-collect queue | sidebar | `/admin/click-and-collect` | Prepare Click-and-Collect Orders for Pickup · Fulfill Click-and-Collect Order |
| click-and-collect order detail | form | `/admin/click-and-collect/:orderNumber` | Prepare Click-and-Collect Orders for Pickup · Fulfill Click-and-Collect Order |

Affordances, control types, conditional states, and scope guard: see lo-fi § Screens and § Scope guard (unchanged).

**Primary navigation (customer):** `find stores` · `shop supplies` · *shopping cart* (count). Checkout progress tabs: *shopping cart* → *pickup store* → *billing address* → *payment*.

**Staff chrome:** staff header band on queue and order detail (Increment 1 admin pattern).

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Add to cart on product page | `ProductDetailView.tsx` + `AddToCartButton.tsx` | `packages/cart/server/cart.service.ts` |
| Cart badge | `CartContext.tsx`, nav chrome | `GET /api/cart` |
| shopping cart | `ShoppingCartPage.tsx`, `CartItemList.tsx` | cart REST mutations |
| click-and-collect store selection | `PickupStoreSelectionPage.tsx` | `packages/store/client/` (reuse locator list) |
| guest checkout — billing | `GuestBillingPage.tsx` | `packages/order/server/order.service.ts` |
| payment — StripeWave | `PaymentPage.tsx` | `packages/payment/server/payment.service.ts` |
| order confirmation | `OrderConfirmationPage.tsx` | order GET + notification status |
| click-and-collect queue | `ClickAndCollectQueuePage.tsx` | `GET /api/orders/queue` |
| click-and-collect order detail | `ClickAndCollectOrderDetailPage.tsx` | `PATCH mark prepared / mark collected` |

---

## AC → behaviour → test mapping

One row per AC clause. Test names trace to story title and clause number. Status **pending (Engineering)** until implementation pass.

### Add Product to Cart

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Add Product to Cart | 1 | "Add to Cart" on *product page* adds *cart item* qty 1; header *shopping cart* count updates | `Add Product to Cart — AC 1: adds item and updates count` | pending |
| Add Product to Cart | 2 | Duplicate *product* merges — quantity increments, no duplicate line; count updates | `Add Product to Cart — AC 2: merges duplicate SKU` | pending |
| Add Product to Cart | 3 | Out-of-stock *product*: action disabled or unavailability message; item not added | `Add Product to Cart — AC 3: blocks out of stock` | pending |
| Add Product to Cart | 4 | Multiple different *products* each own *cart item* row; count reflects units/lines | `Add Product to Cart — AC 4: separate lines per product` | pending |
| Add Product to Cart | 5 | New browser session has empty cart; in-session changes persist until checkout or session end | `Add Product to Cart — AC 5: session-scoped cart` | pending |

### Update Cart Quantity

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Update Cart Quantity | 1 | Quantity change recalculates line total and cart total | `Update Cart Quantity — AC 1: recalculates totals` | pending |
| Update Cart Quantity | 2 | Quantity zero removes *cart item*; totals and count update | `Update Cart Quantity — AC 2: zero removes line` | pending |
| Update Cart Quantity | 3 | Negative or non-numeric quantity shows validation error; prior quantity unchanged | `Update Cart Quantity — AC 3: rejects invalid quantity` | pending |
| Update Cart Quantity | 4 | Quantity exceeding *stock availability* shows validation error; prior quantity unchanged | `Update Cart Quantity — AC 4: rejects over stock` | pending |

### Remove Product from Cart

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Remove Product from Cart | 1 | Remove action deletes *cart item*; totals and count update immediately | `Remove Product from Cart — AC 1: removes item` | pending |
| Remove Product from Cart | 2 | Last item removed shows empty state; *proceed to checkout* unavailable | `Remove Product from Cart — AC 2: empty state blocks checkout` | pending |
| Remove Product from Cart | 3 | Empty cart shows continue-shopping affordance to *product catalog* | `Remove Product from Cart — AC 3: continue shopping link` | pending |

### Select Click-and-Collect Store

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Click-and-Collect Store | 1 | Delivery step shows *click-and-collect* only; store list with address, hours, distance when known | `Select Click-and-Collect Store — AC 1: sole delivery option and store list` | pending |
| Select Click-and-Collect Store | 2 | Selecting *pickup store* records collection location; no shipping address required | `Select Click-and-Collect Store — AC 2: records pickup store` | pending |
| Select Click-and-Collect Store | 3 | Without location data all stores listed; note suggests postcode or share location | `Select Click-and-Collect Store — AC 3: lists all stores without location` | pending |
| Select Click-and-Collect Store | 4 | Checkout summary shows chosen *pickup store* name and address | `Select Click-and-Collect Store — AC 4: summary shows pickup store` | pending |

### Check Out as Guest

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Check Out as Guest | 1 | Checkout default is *guest checkout*; collects *guest email* and name; no login/register | `Check Out as Guest — AC 1: guest default no account path` | pending |
| Check Out as Guest | 2 | Completed checkout places *order* and sends *confirmation email*; no *customer account* created | `Check Out as Guest — AC 2: order placed email sent no account` | pending |
| Check Out as Guest | 3 | Invalid *guest email* shows field validation error; checkout blocked until valid | `Check Out as Guest — AC 3: invalid email blocked` | pending |
| Check Out as Guest | 4 | Post-order *customer account* prompt with value prop; dismissible; order already placed | `Check Out as Guest — AC 4: dismissible account prompt` | pending |

### Enter Billing Address

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Enter Billing Address | 1 | Billing step collects name, address line 1, line 2 (optional), city, county/state, postcode, country | `Enter Billing Address — AC 1: collects required fields` | pending |
| Enter Billing Address | 2 | Missing required fields highlighted with validation messages; no advance to *payment* | `Enter Billing Address — AC 2: missing fields blocked` | pending |
| Enter Billing Address | 3 | Valid billing advances to *payment*; *billing address* shown in order summary | `Enter Billing Address — AC 3: advances with summary preview` | pending |
| Enter Billing Address | 4 | *Billing address* snapshotted on confirmed *order* only; not persisted after *guest checkout* | `Enter Billing Address — AC 4: snapshotted not persisted` | pending |

### Select Payment Method

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Payment Method | 1 | Payment step shows *StripeWave* only; card number, expiry, CVV; no PayNova/VaultPay/saved methods | `Select Payment Method — AC 1: StripeWave sole vendor` | pending |
| Select Payment Method | 2 | Valid card details allow advance to order review / confirm | `Select Payment Method — AC 2: valid card advances` | pending |
| Select Payment Method | 3 | Invalid/incomplete card shows validation error; no *payment* attempted | `Select Payment Method — AC 3: invalid card blocked` | pending |

### Process Card Payment via StripeWave

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Process Card Payment via StripeWave | 1 | Confirm order initiates *StripeWave* processing; processing indicator while in flight | `Process Card Payment via StripeWave — AC 1: processing indicator` | pending |
| Process Card Payment via StripeWave | 2 | Successful *payment confirmation* transitions *order* to confirmed; triggers confirmation email flow | `Process Card Payment via StripeWave — AC 2: success confirms order` | pending |
| Process Card Payment via StripeWave | 3 | Decline shows clear error and retry with new card fields; no order confirmed or email sent | `Process Card Payment via StripeWave — AC 3: decline with retry` | pending |
| Process Card Payment via StripeWave | 4 | Late *webhook callback* reconciles pending *payment*; confirms or notifies retry | `Process Card Payment via StripeWave — AC 4: webhook reconciliation` | pending |
| Process Card Payment via StripeWave | 5 | Service unavailable message and retry after wait; no charge or confirmed order | `Process Card Payment via StripeWave — AC 5: unavailable with retry` | pending |

### Confirm Order and Send Confirmation Email

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Confirm Order and Send Confirmation Email | 1 | *Order confirmation page* shows order number, line items, total, *pickup store*; *confirmation email* sent to *guest email* | `Confirm Order and Send Confirmation Email — AC 1: confirmation page and email` | pending |
| Confirm Order and Send Confirmation Email | 2 | Email includes order number, line items, total paid, masked payment method, pickup address and hours | `Confirm Order and Send Confirmation Email — AC 2: email content` | pending |
| Confirm Order and Send Confirmation Email | 3 | Email delivery failure still shows confirmation page; email queued for retry; order not rolled back | `Confirm Order and Send Confirmation Email — AC 3: email failure non-blocking` | pending |

### Prepare Click-and-Collect Orders for Pickup

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Prepare Click-and-Collect Orders for Pickup | 1 | Staff queue lists confirmed orders oldest first with number, line items, *guest email* | `Prepare Click-and-Collect Orders for Pickup — AC 1: queue oldest first` | pending |
| Prepare Click-and-Collect Orders for Pickup | 2 | Mark prepared transitions *order* confirmed → ready for pickup | `Prepare Click-and-Collect Orders for Pickup — AC 2: mark prepared` | pending |
| Prepare Click-and-Collect Orders for Pickup | 3 | Out-of-stock line shows stock warning and *guest email* for outreach; no auto-cancel | `Prepare Click-and-Collect Orders for Pickup — AC 3: stock warning with email` | pending |

### Fulfill Click-and-Collect Order

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Fulfill Click-and-Collect Order | 1 | Mark collected transitions ready for pickup → collected | `Fulfill Click-and-Collect Order — AC 1: mark collected` | pending |
| Fulfill Click-and-Collect Order | 2 | Uncollected order stays ready for pickup; *guest email* on detail for staff outreach | `Fulfill Click-and-Collect Order — AC 2: uncollected remains visible` | pending |
| Fulfill Click-and-Collect Order | 3 | Last pending order fulfilled shows empty queue state | `Fulfill Click-and-Collect Order — AC 3: queue empty state` | pending |

---

## Accessibility implementation (planned)

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | *guest email*, billing fields, card fields, cart quantity inputs, *pickup store* selector, staff *pickup store* dropdown |
| Focus order matches reading order | planned | Customer: nav → progress tabs → primary panel → summary panel → actions. Staff: header → store selector → queue → actions |
| Focus is visible | planned | Extend Increment 1 link/button focus; no `outline: none` without replacement |
| Errors programmatically associated | planned | `aria-describedby` on cart quantity, email, billing, card fields; validation regions use verbatim AC copy |
| State cues not colour-only | planned | Stock warnings, payment decline, processing indicator include text/icon |
| Keyboard reachable | planned | Full checkout wizard and staff queue without mouse |
| Axe (or host equivalent) passes | planned | Run on cart, checkout, confirmation, staff screens in Engineering |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Screen bundle size | No explicit cap | — | Do not regress Increment 1 baseline |
| Payment vendor widget | Lazy-load on payment step | — | Avoid blocking first paint on checkout earlier steps |
| Cart API on navigation | Non-blocking badge fetch | — | Header count may show stale briefly; refresh on cart mutations |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | — | Processing indicator only on payment confirm |

---

## Scope guard (implementation)

| Excluded | Rationale |
| --- | --- |
| Login / registration before purchase | Check Out as Guest AC 1 |
| Shipping address UI | *click-and-collect* sole *delivery option* |
| PayNova / VaultPay / saved payment methods | Select Payment Method AC 1 |
| Cross-session cart persistence | Add Product to Cart AC 5 |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | code → md | Engineering slot 61 — runnable UI for all 8 screens; server modules wired; 68/68 Increment 1 tests green; Increment 2 AC-named tests deferred to ATDD slot |
| 2026-05-24 | initial | Specification slot 57 — spec from lo-fi + AC + architecture reference; code sync in Engineering |


---

## increment-3 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 3

<!-- migrated from: increments/3-ship-to-home/specification/interface-design.md -->

# Interface design — Increment 3 (Ship to home)

> **Companion to** `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base) and lo-fi `docs/increments/2-click-and-collect/exploration/ux/mockups.md` / `.drawio` (checkout and staff patterns extended — **no new lo-fi per plan waiver**). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 2 interface spec and prototype under `packages/`.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 3 — Ship to home (5 stories; 6 new/changed customer screens + 2 staff screens + 4 extended checkout screens) |
| Lo-fi reference | **Derived** from `docs/increments/2-click-and-collect/exploration/ux/mockups.md` + `docs/end-to-end/discovery/ux/information-architecture.md` (plan waiver — no `increment-3` lo-fi file) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/end-to-end/specification/architecture-reference.md` (Order Placement extension, Unified Order Queue, Ship-to-Home Fulfillment, Shipping Notification, Order Status Page & Guest Lookup) |
| Prior interface spec | `docs/increments/2-click-and-collect/specification/interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/order/` (extended), `packages/notification/` (extended), `packages/app-client/src/pages/` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-24 (Engineering slot 85 rework — checkout order + validation fixes; spec sync) |

## Description

Guest *ship-to-home* extension of the Increment 2 checkout journey: *standard delivery* and *click-and-collect* as co-equal *delivery option* choices; *shipping address* step on the standard path; unified staff *order queue* with ship-to-home fulfillment (*mark as fulfilled*, *tracking number*, *shipping notification*); customer *order status page* and guest lookup. Labels use ubiquitous-language terms verbatim. **Guest checkout only** — no customer accounts, login, *saved address*, express/same-day delivery, PayNova, or VaultPay. Increment 2 screens (cart, billing, payment, click-and-collect detail) are **extended**, not replaced.

---

## Host project conventions

Same baseline as Increment 2 (`docs/increments/2-click-and-collect/specification/interface-design.md`); additions only where Increment 3 introduces new surfaces.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; checkout wizard and status pages in `packages/app-client/src/pages/`; staff admin under `/admin/*`
- **State management:** React component state + `CartContext`; checkout wizard step state in page components with delivery-path branching; order status via fetch on mount
- **Styling:** component-scoped CSS / inline layout matching Increment 2 lo-fi regions; extend Increment 1/2 chrome
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests where host adds it; manual keyboard pass per new screen
- **Performance budget:** no explicit bundle cap — do not regress Increment 2 baseline; lazy-load payment vendor widget on payment step only

---

## Checkout flow extension (dual delivery paths)

Increment 2 spine was: *shopping cart* → *pickup store* (sole *click-and-collect*) → *billing address* → *payment*.

Increment 3 introduces branching **after cart** based on *delivery option*. Progress tabs are **dynamic** — inactive/skipped steps greyed per path (same pattern as Increment 1 store-locator tab bar).

| Path | Step order | Skipped steps |
| --- | --- | --- |
| **Standard delivery** | cart → billing address → shipping address → delivery option (confirm *standard delivery* + cost) → payment → order confirmation page | pickup store |
| **Click-and-collect** | cart → delivery option (select *click-and-collect*) → billing address → pickup store → payment → order confirmation page | shipping address |

**Switching *delivery option* mid-checkout** (Select Delivery Option AC 3): user may change selection on the *delivery option* screen at any point before *payment*. Switching to *click-and-collect* drops *shipping address* requirement and shows *pickup store* selector; switching to *standard delivery* presents *shipping address* form and dismisses *pickup store* selector; *billing address* always remains required.

**Checkout progress tabs (labels — verbatim UL):**

- *shopping cart* · *billing address* · *shipping address* (standard path only) · *delivery option* · *pickup store* (*click-and-collect* path only) · *payment*

---

## Screens (carried from IA + Increment 2 lo-fi, extended for Increment 3)

| Screen | Layout | Route (planned) | Stories | Change |
| --- | --- | --- | --- | --- |
| shopping cart | sidebar | `/cart` | (Inc 2 — unchanged behaviour) | **Extend** progress tabs |
| guest checkout — billing address | split-screen | `/checkout/billing` | (Inc 2) | **Extend** progress tabs; entry before shipping on standard path |
| guest checkout — shipping address | split-screen | `/checkout/shipping` | Enter Shipping Address | **New** |
| delivery option selection | split-screen | `/checkout/delivery-option` | Select Delivery Option | **Refactor** inc 2 pickup-store step |
| click-and-collect store selection | split-screen | `/checkout/pickup-store` | Select Delivery Option (C&C branch) | **Extend** — pickup list only when C&C selected |
| payment — StripeWave | split-screen | `/checkout/payment` | (Inc 2) | **Extend** order review — *shipping address* + shipping cost |
| order confirmation page | stack | `/order-confirmation/:orderNumber` | (Inc 2) + Track Order Status AC 1 | **Extend** — *shipping address* or *pickup store*; *order status page* link |
| guest order lookup | form | `/orders/lookup` | Track Order Status | **New** |
| order status page | stack | `/orders/status/:orderNumber` | Track Order Status | **New** |
| order queue | sidebar | `/admin/orders` | View and Process Incoming Orders | **Refactor** unified queue (was click-and-collect-only) |
| ship-to-home order detail | form | `/admin/orders/:orderNumber/ship-to-home` | View and Process Incoming Orders · Send Shipping Notification | **New** |
| click-and-collect order detail | form | `/admin/click-and-collect/:orderNumber` | (Inc 2 — retained) | **Unchanged** — reached from unified queue for C&C rows |

Affordances for Increment 2 screens not listed above: unchanged from `interface-design.md` / lo-fi.

---

## Derived screen specs (no Increment 3 lo-fi — regions from Increment 2 patterns + AC)

### guest checkout — shipping address

**Layout:** split-screen (mirror `guest checkout — billing address` from Increment 2 lo-fi)  
**AC stories:** Enter Shipping Address  
**Path:** standard delivery only — not shown on *click-and-collect* path

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | No login · no registration |
| checkout progress | header | nav-tabs | shopping cart · billing address · shipping address (active) · delivery option · payment | *pickup store* tab greyed on standard path |
| same as billing | left | form | same as billing (checkbox) | Pre-fills all fields from *billing address*; individual field override replaces only that field |
| shipping address | left | form | recipient name · address line 1 · address line 2 (optional) · city · county or region · postcode · country | Required: recipient name, address line 1, city, postcode, country |
| shipping validation feedback | left | form | validation error on shipping address | Verbatim messages per spec-by-example: *Recipient name is required*, *Address line 1 is required*, *City is required*, *Postcode is required*, *Country is required* |
| order summary | right | form | shipping address preview · billing address preview · cart total · back · continue to delivery option (primary) | Preview updates on valid submit; blocks advance when invalid |

**Conditional states:**

- *same as billing* checked: fields pre-filled from billing; user may override any single field
- Missing required fields: validation errors; no advance to *delivery option*

---

### delivery option selection

**Layout:** split-screen (extends Increment 2 `click-and-collect store selection` — delivery region now offers both options)  
**AC stories:** Select Delivery Option

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · shopping cart (count) | |
| checkout progress | header | nav-tabs | dynamic per path — delivery option (active) | |
| delivery option | left | form | standard delivery (estimated delivery window · shipping cost) · click-and-collect (free) | Radio group; express and same-day **not shown** (deferred); layout accommodates future options |
| standard delivery detail | left | form | estimated delivery window · shipping cost · shipping address confirmation (read-only when arriving post-shipping step) | Shows *3–5 business days* and *£4.99* per spec-by-example |
| pickup store list | left | list | store name · address · operating hours · distance · select pickup store | Visible only when *click-and-collect* selected; reuse Increment 2 pickup list affordances |
| location entry | left | form | postcode · distance note · share location · clear location | Optional distance sort for pickup stores |
| checkout summary | right | form | delivery option label · shipping address or pickup store · cart total · shipping cost line · back · continue (primary) | Continue label: *continue to payment* (standard, post-shipping path) or *continue to billing address* (C&C first-select path) or *continue to pickup store* |

**Conditional states:**

- *standard delivery* selected after shipping step: confirms *shipping address* destination; records shipping cost; advances to *payment*
- *click-and-collect* selected: drops *shipping address* requirement; shows *pickup store* selector; *billing address* still required before payment
- Switch mid-checkout: adjusts visible steps per Select Delivery Option AC 3

---

### payment — StripeWave (Increment 3 extensions)

**Layout:** split-screen (Increment 2 base)  
**Extended regions only:**

| Region | Increment 3 addition |
| --- | --- |
| order review summary | When *standard delivery*: show *shipping address* snapshot, shipping cost line, estimated delivery window; when *click-and-collect*: retain *pickup store* summary (Increment 2) |

---

### order confirmation page (Increment 3 extensions)

**Layout:** stack (Increment 2 base)  
**Extended regions:**

| Region | Increment 3 addition |
| --- | --- |
| order confirmation | When *standard delivery*: show *shipping address* and shipping cost instead of/in addition to *pickup store* block |
| order confirmation | Link to *order status page* (tokenized URL in *confirmation email*; on-page *track your order* link to same) |
| customer account prompt | Unchanged — dismissible; no account creation in Increment 3 |

---

### guest order lookup

**Layout:** form (stacked inputs — Increment 1 admin form pattern)  
**AC stories:** Track Order Status

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies | No account links |
| order lookup form | body | form | order number · guest email · look up order (primary) | Submits POST lookup; fail closed on email mismatch |
| lookup validation feedback | body | form | lookup error | Verbatim: *We couldn't find an order matching those details* — no order details leaked |

**On success:** navigate to *order status page* for matching *order*.

---

### order status page

**Layout:** stack (mirror `order confirmation page` information hierarchy)  
**AC stories:** Track Order Status

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies | |
| order status header | body | form | order number · order status (label) | Status labels: Confirmed · Fulfilled · Shipped · Delivered (ship-to-home); Confirmed · Ready for pickup · Collected (click-and-collect) |
| order line item list | body | list | product name · quantity · line total | Itemized contents |
| delivery details | body | form | delivery option label · shipping address or pickup store | Path-appropriate delivery block |
| tracking section | body | form | tracking number (link to carrier) · shipment date · estimated delivery date · tracking pending message | When no *tracking number*: *Tracking will be available once your order ships*; when shipped/delivered: carrier link (e.g. Royal Mail) |
| continue shopping | body | form | continue shopping (primary) | |

**Entry points:** tokenized link from *confirmation email* or *shipping notification*; redirect from guest lookup form.

**Conditional states:**

- *order status* confirmed or fulfilled (ship-to-home): no tracking; pending message shown
- *order status* shipped or delivered: *tracking number* + carrier external link + dates
- *click-and-collect* confirmed: tracking placeholder / *Order being prepared* per spec-by-example
- Status changes reflected on next visit only — no push notification UI

---

### order queue (unified)

**Layout:** sidebar (extends Increment 2 `click-and-collect queue`)  
**AC stories:** View and Process Incoming Orders  
**Route change:** `/admin/orders` (unified); supersedes click-and-collect-only queue as staff entry point

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header band | Increment 1/2 pattern |
| fulfillment store selector | panel | form | pickup store (dropdown) · optional filter | Filters C&C rows; ship-to-home rows show warehouse fulfillment |
| order queue | body | list | order number · order line item summary · delivery type label · guest email · order status · stock warning · select order | Oldest first; delivery type label *Standard Delivery* or *Click-and-Collect* |
| queue empty state | body | form | no pending orders | When queue empty |

**Row routing:**

- *standard delivery* row → `ship-to-home order detail`
- *click-and-collect* row → `click-and-collect order detail` (Increment 2)

---

### ship-to-home order detail

**Layout:** form (extends Increment 2 `click-and-collect order detail` pattern)  
**AC stories:** View and Process Incoming Orders · Send Shipping Notification with Tracking Number

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header band | |
| order detail | body | form | order number · order status · guest email · shipping address | *shipping address* full snapshot for packing |
| order line item list | body | list | product name · quantity · stock warning | Items to pack |
| tracking entry | body | form | carrier name · tracking number · add tracking number | Shown at fulfillment and for late entry (Send Shipping Notification AC 4) |
| fulfillment validation feedback | body | form | tracking warning | Verbatim: *Customer will not receive a shipping notification* when fulfilling without tracking |
| ship-to-home fulfillment actions | body | button-bar | back to order queue · mark as fulfilled (primary) | Prompts for *tracking number*; fulfillment without tracking allowed with warning |
| special notes | body | form | order notes (read-only if present) | Per View and Process Incoming Orders AC 2 |

**Post-fulfillment with tracking:** triggers *shipping notification*; *order status* → shipped. **Without tracking:** *order status* → fulfilled; *add tracking number* remains available.

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Checkout path branching | `CheckoutProgressTabs.tsx`, wizard router | `packages/order/server/order.service.ts` |
| Shipping address step | `ShippingAddressPage.tsx` | order REST — address snapshot |
| Delivery option selection | `DeliveryOptionPage.tsx` | `DeliveryOption.ts` |
| Pickup store (C&C branch) | `PickupStoreSelectionPage.tsx` (extend) | `packages/store/client/` |
| Payment review extension | `PaymentPage.tsx` (extend) | — |
| Order confirmation extension | `OrderConfirmationPage.tsx` (extend) | confirmation + statusPageUrl |
| Guest order lookup | `OrderLookupPage.tsx` | `POST /api/orders/status/lookup` |
| Order status page | `OrderStatusPage.tsx` | `GET /api/orders/status/:orderNumber` |
| Unified order queue | `OrderQueuePage.tsx` | `GET /api/orders/queue` |
| Ship-to-home order detail | `ShipToHomeOrderDetailPage.tsx` | `PATCH /api/orders/:orderNumber/fulfilled`, `PATCH .../tracking` |
| Click-and-collect detail | `ClickAndCollectOrderDetailPage.tsx` (retain) | Increment 2 PATCH routes |
| Shipping notification | (system — no UI) | `packages/notification/server/` |

---

## AC → behaviour → test mapping

One row per Increment 3 AC clause. Test names trace to story title and clause number. UI behaviours **implemented (Engineering slots 85–85 rework)**; AC-named Vitest tests **pending ATDD (slot 89)**.

### Enter Shipping Address

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Enter Shipping Address | 1 | Ship-to-home path presents *shipping address* form with required fields; step skipped entirely on *click-and-collect* path | `Enter Shipping Address — AC 1: form on standard path skipped on click-and-collect` | implemented (UI) — ATDD pending |
| Enter Shipping Address | 2 | *same as billing* pre-fills *shipping address* from *billing address* | `Enter Shipping Address — AC 2: same as billing pre-fill` | implemented (UI) — ATDD pending |
| Enter Shipping Address | 3 | Individual field override replaces only that field; other pre-filled fields unchanged | `Enter Shipping Address — AC 3: single field override` | implemented (UI) — ATDD pending |
| Enter Shipping Address | 4 | Missing required fields show validation messages; no advance to *delivery option* | `Enter Shipping Address — AC 4: missing fields blocked` | implemented (UI) — ATDD pending |
| Enter Shipping Address | 5 | Valid *shipping address* advances to *delivery option*; address shown in order summary | `Enter Shipping Address — AC 5: advances with summary preview` | implemented (UI) — ATDD pending |

### Select Delivery Option

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Delivery Option | 1 | *standard delivery* and *click-and-collect* shown with estimated window and shipping cost; express/same-day absent | `Select Delivery Option — AC 1: both options with cost and window` | implemented (UI) — ATDD pending |
| Select Delivery Option | 2 | *standard delivery* confirms *shipping address*, records shipping cost, advances to *payment* | `Select Delivery Option — AC 2: standard confirms address and cost` | implemented (UI) — ATDD pending |
| Select Delivery Option | 3 | Switching delivery option adjusts address steps; *billing address* always required | `Select Delivery Option — AC 3: switch adjusts steps billing always required` | implemented (UI) — ATDD pending |
| Select Delivery Option | 4 | Express and same-day options not listed; UI structure accommodates future options | `Select Delivery Option — AC 4: deferred options hidden extensible layout` | implemented (UI) — ATDD pending |

### View and Process Incoming Orders

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View and Process Incoming Orders | 1 | Unified *order queue* lists all confirmed *order* oldest-first with number, line items, delivery type, guest email | `View and Process Incoming Orders — AC 1: unified queue oldest first` | implemented (UI) — ATDD pending |
| View and Process Incoming Orders | 2 | Ship-to-home detail shows *shipping address*, items to pack, special notes, *mark as fulfilled* | `View and Process Incoming Orders — AC 2: ship-to-home detail` | implemented (UI) — ATDD pending |
| View and Process Incoming Orders | 3 | Mark fulfilled prompts *tracking number*; entry triggers *shipping notification* flow | `View and Process Incoming Orders — AC 3: fulfillment with tracking prompt` | implemented (UI) — ATDD pending |
| View and Process Incoming Orders | 4 | Fulfillment without *tracking number* shows warning; order still markable fulfilled; *add tracking number* later | `View and Process Incoming Orders — AC 4: fulfill without tracking warning` | implemented (UI) — ATDD pending |

### Send Shipping Notification with Tracking Number

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Shipping Notification with Tracking Number | 1 | Tracking entry + dispatch sends *shipping notification* to *guest email* with order, items, carrier, tracking, delivery window | `Send Shipping Notification with Tracking Number — AC 1: notification content sent` | implemented (UI) — ATDD pending |
| Send Shipping Notification with Tracking Number | 2 | *order status* transitions fulfilled → shipped when dispatch confirmed with tracking | `Send Shipping Notification with Tracking Number — AC 2: status to shipped` | implemented (UI) — ATDD pending |
| Send Shipping Notification with Tracking Number | 3 | Email unavailable queues notification; *order status* still shipped | `Send Shipping Notification with Tracking Number — AC 3: email queued non-blocking` | implemented (UI) — ATDD pending |
| Send Shipping Notification with Tracking Number | 4 | No tracking at fulfillment → no auto notification; *add tracking number* on detail fires notification later | `Send Shipping Notification with Tracking Number — AC 4: late tracking triggers notification` | implemented (UI) — ATDD pending |

### Track Order Status

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Track Order Status | 1 | Email link opens *order status page* with current status, line items, delivery details | `Track Order Status — AC 1: status page from email link` | implemented (UI) — ATDD pending |
| Track Order Status | 2 | When *tracking number* present: display number, carrier link, shipment and estimated delivery dates | `Track Order Status — AC 2: tracking and carrier link` | implemented (UI) — ATDD pending |
| Track Order Status | 3 | Guest lookup by *order number* + *guest email* succeeds on match; generic error on mismatch — no leak | `Track Order Status — AC 3: guest lookup match and fail closed` | implemented (UI) — ATDD pending |
| Track Order Status | 4 | Pre-ship statuses show no tracking; pending tracking message | `Track Order Status — AC 4: pre-ship tracking pending message` | implemented (UI) — ATDD pending |
| Track Order Status | 5 | Status changes reflected on next visit; no push notification for intermediate changes | `Track Order Status — AC 5: refresh on revisit no push` | implemented (UI) — ATDD pending |

---

## Accessibility implementation

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | implemented | *shipping address* fields, *same as billing*, delivery option radios, lookup form, tracking/carrier fields on staff detail — slot 85 |
| Focus order matches reading order | implemented | Customer checkout: nav → progress tabs → primary panel → summary → actions. Status page: header → status → items → tracking → action. Staff: header → filter → queue → detail actions |
| Focus is visible | implemented | Extend Increment 2 focus styles — inline pattern on new screens |
| Errors programmatically associated | implemented | `aria-describedby` on shipping, lookup, tracking, fulfillment warning regions — verbatim AC/spec copy |
| State cues not colour-only | implemented | Order status labels as text; tracking warning includes message text; delivery option cost as text not colour alone |
| Keyboard reachable | implemented | Full checkout branching, status page, lookup, unified queue, ship-to-home detail without mouse |
| Axe (or host equivalent) passes | pending-axe | Run on new/changed screens in slot 89 ATDD pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Screen bundle size | No explicit cap | baseline preserved | Do not regress Increment 2 baseline — 110/110 host tests green |
| Payment vendor widget | Lazy-load on payment step | done | `StripeWaveFields` lazy-loaded on `PaymentPage.tsx` |
| Order status lookup | Non-blocking fetch | done | Tokenized GET on mount; refresh on revisit |
| Carrier tracking link | External navigation | — | Opens carrier site in new tab/window — no embed |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | — | Processing indicator on payment confirm only |

---

## Scope guard (implementation)

| Excluded | Rationale |
| --- | --- |
| Customer accounts / login / registration | Guest checkout only — Increment 3 scope guard |
| *Saved address* | No address persistence beyond order snapshots |
| Express / same-day *delivery option* | Select Delivery Option AC 4 — deferred per thin slicing |
| PayNova / VaultPay / saved payment methods | Increment 2 scope guard — unchanged |
| Push notifications for *order status* changes | Track Order Status AC 5 |
| Automated carrier label generation | Manual *tracking number* entry per thin slicing |

---

## Affordance trace (Increment 3 only)

| Affordance | AC story | AC clause |
| --- | --- | --- |
| shipping address fields | Enter Shipping Address | AC 1 — form on ship-to-home path |
| same as billing | Enter Shipping Address | AC 2 — pre-fill from billing |
| validation error on shipping address | Enter Shipping Address | AC 4 — missing fields blocked |
| shipping address preview in summary | Enter Shipping Address | AC 5 — shown before delivery confirm |
| standard delivery · click-and-collect (delivery option) | Select Delivery Option | AC 1 — both options with cost/window |
| estimated delivery window · shipping cost | Select Delivery Option | AC 1, 2 |
| delivery option switch | Select Delivery Option | AC 3 — adjusts shipping vs pickup steps |
| shipping address on payment review | Select Delivery Option | AC 2 — confirmed destination |
| order queue · delivery type label | View and Process Incoming Orders | AC 1 — unified queue |
| shipping address on staff detail | View and Process Incoming Orders | AC 2 |
| mark as fulfilled | View and Process Incoming Orders | AC 2, 3 |
| tracking number · carrier name | View and Process Incoming Orders | AC 3, 4 |
| tracking warning without number | View and Process Incoming Orders | AC 4 |
| add tracking number (late) | Send Shipping Notification with Tracking Number | AC 4 |
| order status page link (confirmation / shipping email) | Track Order Status | AC 1 |
| tracking number · carrier link on status page | Track Order Status | AC 2 |
| order number · guest email lookup | Track Order Status | AC 3 |
| tracking pending message | Track Order Status | AC 4 |
| order status label refresh on revisit | Track Order Status | AC 5 |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | code → md | Engineering slot 85 rework — standard delivery checkout order (cart → billing → shipping → delivery option → payment); `CheckoutProgressTabs` path-specific tab order; shipping validation blocks empty city/country; spec AC mapping + accessibility + performance tables synced |
| 2026-05-24 | code → md | Engineering slot 85 — Increment 3 ship-to-home UI (dual checkout paths, staff queue, guest lookup/status); 110/110 host tests green; AC-named tests deferred to slot 89 |
| 2026-05-24 | initial | Specification slot 81 — Increment 3 interface spec derived from IA + Increment 2 lo-fi (plan waiver); dual checkout paths; 22 AC clauses mapped; code sync in Engineering |


---

## increment-4 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 4

<!-- migrated from: increments/4-returning-customers/specification/interface-design.md -->

# Interface design — Increment 4 (Returning customers)

> **Companion to** lo-fi `docs/increments/4-returning-customers/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–3 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 4 — Returning customers (22 screens, 16 stories) |
| Lo-fi reference | `docs/increments/4-returning-customers/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Scenario walkthrough | `docs/increments/4-returning-customers/engineering/object-model.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 2–3 checkout patterns; Increment 4 account screens AC-derived per lo-fi) |
| Prior interface specs | `docs/increments/2-click-and-collect/specification/interface-design.md`, `docs/increments/3-ship-to-home/specification/interface-design.md` |
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


---

## increment-5 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 5

<!-- migrated from: increments/5-pay-your-way/specification/interface-design.md -->

# Interface design — Increment 5 (Pay your way)

> **Companion to** lo-fi `docs/increments/5-pay-your-way/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–4 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 5 — Pay your way (13 screens, 3 stories) |
| Lo-fi reference | `docs/increments/5-pay-your-way/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Scenario walkthrough | `docs/increments/5-pay-your-way/engineering/object-model.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 119) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 2–4 checkout patterns; Increment 5 payment screens AC-derived) |
| Prior interface specs | `docs/increments/2-click-and-collect/specification/interface-design.md`, `docs/increments/3-ship-to-home/specification/interface-design.md`, `docs/increments/4-returning-customers/specification/interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/payment/` (extend), `packages/order/` (extend), `packages/notification/` (extend), `packages/app-client/src/pages/` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-25 (Specification slot 133) |

## Description

Multi-vendor checkout payment on PawPlace: *payment method selector* presents *StripeWave*, *PayNova* (*digital wallet*), and *VaultPay* (*buy-now-pay-later*) alongside multi-vendor *saved payment method* tokens for logged-in customers. Covers PayNova wallet authentication, VaultPay *eligibility check* and *instalment plan*, *hard decline* alternative-vendor paths, automatic *payment retry* for *transient error*, retry exhaustion, and save-as-*saved payment method* offers. Labels use ubiquitous-language terms verbatim. **Guest checkout and Increment 1–4 paths are preserved** — *StripeWave* card behaviour unchanged; selector adds vendors without altering card UX. Increment 4 sole-vendor deferral is **superseded** — all three vendors active at *payment method selector*.

---

## Host project conventions

Same baseline as Increments 2–4; additions for multi-vendor payment orchestration and retry UI states.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; checkout payment extensions in `packages/app-client/src/pages/PaymentPage.tsx` and vendor sub-components; vendor adapters in `packages/payment/server/vendors/`
- **State management:** React component state + `CartContext` + `CustomerSessionContext`; checkout wizard step state with vendor-branch sub-flows; payment retry polling via server-driven status or websocket (Engineering choice — UI shows server truth)
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions; extend Increment 2–4 checkout split-screen pattern
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests where host adds it; manual keyboard pass per new/changed screen
- **Performance budget:** no explicit bundle cap — do not regress Increment 4 baseline; lazy-load PayNova/VaultPay redirect/embed widgets on vendor selection only; StripeWave widget lazy-load unchanged

---

## Payment flow extension (multi-vendor selector)

Increment 4 payment step showed *StripeWave* as sole active *payment vendor* with optional *saved payment method* listbox for logged-in customers. Increment 5 **extends** the payment step without replacing prior delivery-path branching (Increment 3) or saved-entity patterns (Increment 4).

| Actor | Payment step entry | Vendor selection | Sub-flow |
| --- | --- | --- | --- |
| **Guest** | `/checkout/payment` | *payment method selector* listbox: StripeWave — card (default) · PayNova — digital wallet · VaultPay — buy-now-pay-later | Vendor-specific sub-screens (wallet auth, BNPL redirect, card entry) |
| **Logged in (verified)** | `/checkout/payment` | *saved payment method* listbox first: StripeWave · PayNova · VaultPay tokens; *use a different payment method* reveals full selector | Same sub-flows; save modals after successful PayNova/VaultPay *payment* |
| **Retry / decline recovery** | `/checkout/payment` (return state) | Full *payment method selector* with all vendors + manual card entry | Hard decline and retry exhaustion restore selector |

**Checkout progress tabs (labels — verbatim UL):** unchanged from Increment 3/4 — dynamic spine per fulfillment path; *payment* tab active on all payment sub-screens.

**StripeWave card entry:** behaviour unchanged from Increments 2–4 — card number · expiry · CVV · validation feedback · processing indicator. Transient failure on StripeWave triggers automatic *payment retry* (Increment 5).

**System-only paths (no dedicated customer screen):** *webhook callback* reconciliation (PayNova AC 4, VaultPay AC 4) — customer sees outcome via order confirmation redirect or *payment method selector* return / account notification on failure; documented in AC mapping as system behaviour with customer notification affordance.

---

## Screens (carried from lo-fi)

| Screen | Layout | Route (planned) | Stories | Change |
| --- | --- | --- | --- | --- |
| guest checkout — payment method selector | split-screen | `/checkout/payment` | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | **Extend** — multi-vendor selector replaces StripeWave-only |
| guest checkout — StripeWave card entry | split-screen | `/checkout/payment/stripewave` | Retry Failed Payment | **Extend** — retry indicator on transient error |
| guest checkout — PayNova wallet flow | split-screen | `/checkout/payment/paynova` | Process Digital Wallet Payment via PayNova | **New** |
| guest checkout — PayNova hard decline | split-screen | `/checkout/payment/paynova/declined` | Process Digital Wallet Payment via PayNova · Retry Failed Payment | **New** |
| guest checkout — VaultPay BNPL flow | split-screen | `/checkout/payment/vaultpay` | Process Buy-Now-Pay-Later via VaultPay | **New** |
| guest checkout — VaultPay hard decline | split-screen | `/checkout/payment/vaultpay/declined` | Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | **New** |
| guest checkout — payment retry in progress | split-screen | `/checkout/payment/retrying` | Retry Failed Payment | **New** |
| guest checkout — payment retry exhausted | split-screen | `/checkout/payment/retry-exhausted` | Retry Failed Payment | **New** |
| order confirmation — multi-vendor payment | stack | `/order-confirmation/:orderNumber` | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | **Extend** — vendor-specific masked detail |
| logged-in checkout — payment method selector | split-screen | `/checkout/payment` (logged-in branch) | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay | **Extend** — multi-vendor saved tokens |
| logged-in checkout — save PayNova saved payment method | modal | (overlay post-confirmation) | Process Digital Wallet Payment via PayNova | **New** |
| logged-in checkout — save VaultPay saved payment method | modal | (overlay post-confirmation) | Process Buy-Now-Pay-Later via VaultPay | **New** |
| account notification — background payment retry outcome | stack | `/account/notifications/:id` or email deep link | Retry Failed Payment | **New** |

Affordances, control types, conditional states, and scope guard: see lo-fi § Screens, § Affordance trace, and § Scope guard.

---

## Screen specs (from lo-fi — regions verbatim)

### guest checkout — payment method selector

**Layout:** split-screen  
**Route:** `/checkout/payment` (guest branch)  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — guest | header | toolbar | find stores · shop supplies · shopping cart · log in · register | Guest chrome preserved from Increments 2–4 |
| checkout progress | header | nav-tabs | shopping cart · billing address · shipping address · delivery option · payment (active) | Dynamic spine per fulfillment path |
| payment method selector | left | listbox | StripeWave — card (selected) · PayNova — digital wallet · VaultPay — buy-now-pay-later | All three vendors visible; StripeWave default selection |
| payment method hint | left | form | StripeWave and PayNova and VaultPay remain selectable after cancel | Vendor-switch affordance per PayNova AC 1 |
| order review summary | right | form | order line item list · shipping address · delivery option · order total · back · continue with selected payment method (primary) | Advances to vendor-specific sub-flow |

---

### guest checkout — StripeWave card entry

**Layout:** split-screen  
**Route:** `/checkout/payment/stripewave`  
**AC stories:** Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| payment method selector summary | StripeWave — card (selected) · change payment method | Selected vendor shown; link back to selector |
| StripeWave card details | card number · expiry · CVV | Card validation before confirm — behaviour unchanged from Increment 2–4 |
| payment validation feedback | validation error on card details · payment decline message · processing indicator · retrying payment | Transient failure triggers automatic *payment retry* |
| order review summary | order line item list · order total · confirm order (primary) | Initiates StripeWave *payment* |

---

### guest checkout — PayNova wallet flow

**Layout:** split-screen  
**Route:** `/checkout/payment/paynova`  
**AC stories:** Process Digital Wallet Payment via PayNova

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| PayNova wallet authentication | PayNova — digital wallet · redirecting to PayNova wallet authentication · authorise payment with mobile wallet credentials | Redirect or embed PayNova flow |
| PayNova cancel affordance | cancel PayNova wallet flow · return to payment method selector | *StripeWave* and *VaultPay* remain selectable on cancel |
| order review summary | order line item list · order total · awaiting PayNova authorisation | Order not confirmed until *payment confirmation* |

---

### guest checkout — PayNova hard decline

**Layout:** split-screen  
**Route:** `/checkout/payment/paynova/declined`  
**AC stories:** Process Digital Wallet Payment via PayNova · Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| PayNova decline feedback | hard decline reason from PayNova · insufficient wallet balance example · wallet locked example | Decline reason as much as PayNova provides |
| alternative payment vendors | retry with PayNova · switch to StripeWave (primary) · switch to VaultPay | No *order* confirmed; no *confirmation email*; no automatic *payment retry* |
| order review summary | order total · order remains unpaid | *Hard decline* invariant |

---

### guest checkout — VaultPay BNPL flow

**Layout:** split-screen  
**Route:** `/checkout/payment/vaultpay`  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| VaultPay BNPL redirect | VaultPay — buy-now-pay-later · redirecting to VaultPay BNPL flow | Redirect or embed VaultPay |
| eligibility check status | VaultPay eligibility check in progress | Per-transaction *eligibility check* |
| instalment plan summary | instalment plan schedule · accept instalment plan (primary) · decline instalment plan | Customer must accept *instalment plan* before capture |
| order review summary | order line item list · order total · awaiting VaultPay approval | |

---

### guest checkout — VaultPay hard decline

**Layout:** split-screen  
**Route:** `/checkout/payment/vaultpay/declined`  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| VaultPay decline feedback | buy-now-pay-later not available for this transaction · eligibility failed · credit check failed | VaultPay decision — not PawPlace's |
| alternative payment vendors | switch to StripeWave (primary) · switch to PayNova | No *order* confirmed; no automatic *payment retry* |
| order review summary | order total · order remains unpaid | |

---

### guest checkout — payment retry in progress

**Layout:** split-screen  
**Route:** `/checkout/payment/retrying`  
**AC stories:** Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| payment retry indicator | retrying payment · automatic payment retry in progress · attempt count within retry window | Shown on *transient error* — no manual action during auto-retries |
| same vendor note | retrying through same payment vendor | Same-vendor *payment retry* invariant |
| order review summary | order total · payment not yet confirmed | Customer may navigate away — retry continues in background |

---

### guest checkout — payment retry exhausted

**Layout:** split-screen  
**Route:** `/checkout/payment/retry-exhausted`  
**AC stories:** Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| retry exhaustion feedback | payment could not be processed · retry window exhausted | After final failed attempt within *retry window* |
| payment method selector | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later · manual card entry | Full selector restored with all vendor options |
| order review summary | order total · order remains unpaid | |

---

### order confirmation — multi-vendor payment

**Layout:** stack  
**Route:** `/order-confirmation/:orderNumber`  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| order confirmation | order number · order line item list · total paid · masked payment method · payment vendor label · confirmation email sent | Shown after successful *payment confirmation* from any vendor |
| vendor-specific payment detail | PayNova vendor transaction reference · VaultPay instalment reference · StripeWave last four digits | Vendor-appropriate masked detail |

---

### logged-in checkout — payment method selector

**Layout:** split-screen  
**Route:** `/checkout/payment` (logged-in branch)  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| primary navigation — logged in | find stores · shop supplies · shopping cart · wishlist · account | Logged-in chrome from Increment 4 |
| saved payment method selection | Visa •••• 4242 — StripeWave default (selected) · PayNova wallet — saved payment method · VaultPay — saved payment method · use a different payment method | Multi-vendor *saved payment method* tokens |
| payment method selector | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later | Shown when *use a different payment method* selected |
| expired saved payment method | expired saved payment method (dimmed) | Expired tokens not silently charged |
| order review summary | order total · confirm order (primary) | |

---

### logged-in checkout — save PayNova / VaultPay saved payment method

**Layout:** modal  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay

| Modal | Controls | Interaction decisions |
| --- | --- | --- |
| save PayNova | save PayNova as saved payment method for future orders · save PayNova wallet (primary) · not now · only PayNova vendor token stored — not wallet secrets | Offered after successful PayNova *payment* |
| save VaultPay | save VaultPay as saved payment method for future orders · save VaultPay identity (primary) · not now · future VaultPay checkout pre-fills identity but requires eligibility check per transaction | Per-transaction *eligibility check* invariant |

---

### account notification — background payment retry outcome

**Layout:** stack  
**Route:** `/account/notifications/:id` (or guest email deep link)  
**AC stories:** Retry Failed Payment

| State | Controls | Interaction decisions |
| --- | --- | --- |
| background retry success | payment retry succeeded — order confirmed · view order confirmation | *Payment retry* continued after navigate-away |
| background retry failure | payment could not be processed — retry window exhausted · return to payment method selector (primary) | Guest email or account notification on exhaustion |

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Multi-vendor payment selector | `PaymentMethodSelector.tsx`, extend `PaymentPage.tsx` | `packages/payment/server/payment-method-selector/` |
| StripeWave card entry (unchanged behaviour) | `StripeWavePaymentForm.tsx` (extract from PaymentPage) | `packages/payment/server/vendors/stripewave/` |
| PayNova wallet flow + hard decline | `PayNovaWalletFlow.tsx`, `PayNovaHardDecline.tsx` | `packages/payment/server/vendors/paynova/` |
| VaultPay BNPL flow + hard decline | `VaultPayBnplFlow.tsx`, `VaultPayHardDecline.tsx` | `packages/payment/server/vendors/vaultpay/` |
| Payment retry UI states | `PaymentRetryIndicator.tsx`, `PaymentRetryExhausted.tsx` | `packages/payment/server/payment-retry/` |
| Multi-vendor order confirmation | extend `OrderConfirmationPage.tsx` | `packages/order/server/` |
| Save PayNova/VaultPay modals | `SavePayNovaPrompt.tsx`, `SaveVaultPayPrompt.tsx` | `packages/customer-account/server/saved-payment-methods/` |
| Background retry notification | `PaymentRetryNotificationPage.tsx` | `packages/notification/server/` |
| Webhook reconciliation (system) | (no customer UI beyond outcome surfaces) | `packages/payment/server/webhook-callback/` |

---

## AC → behaviour → test mapping

One row per Increment 5 AC clause. Test names trace to story title and clause number. Status **pending (Engineering)** until implementation pass.

### Process Digital Wallet Payment via PayNova

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Process Digital Wallet Payment via PayNova | 1 | Selecting PayNova at *payment method selector* redirects/embeds wallet auth; cancel returns to selector with StripeWave and VaultPay still selectable | `Process Digital Wallet Payment via PayNova — AC 1: wallet auth launch and cancel preserves alternatives` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 2 | Successful *payment confirmation* confirms *order*, records PayNova *vendor transaction reference*, shows order confirmation, sends *confirmation email* | `Process Digital Wallet Payment via PayNova — AC 2: confirmation page and email on success` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 3 | *Hard decline* shows decline reason and retry PayNova / switch StripeWave / switch VaultPay; no order confirmed | `Process Digital Wallet Payment via PayNova — AC 3: hard decline alternatives no confirmation` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 4 | *Webhook callback* reconciles in-flight *payment*; success confirms order; failure returns customer to *payment method selector* or notifies retry (system — UI shows outcome) | `Process Digital Wallet Payment via PayNova — AC 4: webhook reconciliation customer outcome` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 5 | Logged-in post-payment modal offers save PayNova as *saved payment method*; stores vendor token only | `Process Digital Wallet Payment via PayNova — AC 5: save PayNova wallet token opt-in` | implemented (UI) — ATDD pending |

### Process Buy-Now-Pay-Later via VaultPay

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Process Buy-Now-Pay-Later via VaultPay | 1 | Selecting VaultPay redirects/embeds BNPL flow; *eligibility check* runs; *instalment plan* presented | `Process Buy-Now-Pay-Later via VaultPay — AC 1: BNPL redirect eligibility and instalment plan` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 2 | Accepting *instalment plan* and successful *payment confirmation* confirms *order* with instalment reference; confirmation page and *confirmation email* | `Process Buy-Now-Pay-Later via VaultPay — AC 2: instalment acceptance confirms order` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 3 | *Hard decline* shows BNPL unavailable message and StripeWave / PayNova alternatives; no order confirmed | `Process Buy-Now-Pay-Later via VaultPay — AC 3: hard decline BNPL unavailable alternatives` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 4 | *Webhook callback* reconciles in-flight VaultPay *payment*; success confirms order; failure notifies retry (system — UI shows outcome) | `Process Buy-Now-Pay-Later via VaultPay — AC 4: webhook reconciliation customer outcome` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 5 | Logged-in post-payment modal offers save VaultPay identity; future checkout pre-fills but requires per-transaction *eligibility check* | `Process Buy-Now-Pay-Later via VaultPay — AC 5: save VaultPay identity with per-transaction eligibility` | implemented (UI) — ATDD pending |

### Retry Failed Payment

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Retry Failed Payment | 1 | *Transient error* triggers automatic *payment retry* through same *payment vendor*; *retrying payment* indicator shown; no manual action during retries | `Retry Failed Payment — AC 1: transient auto-retry with indicator` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 2 | Successful *payment retry* confirms *order* as if first attempt succeeded; order confirmation and *confirmation email* | `Retry Failed Payment — AC 2: retry success confirms order` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 3 | Retries up to maximum within *retry window*; exhaustion shows *payment could not be processed* and full *payment method selector* | `Retry Failed Payment — AC 3: retry exhaustion restores selector` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 4 | *Hard decline* does not auto-retry; immediate decline reason and alternative *payment vendor* options at selector | `Retry Failed Payment — AC 4: hard decline no auto-retry immediate alternatives` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 5 | *Payment retry* continues in background on navigate-away; success confirms order; exhaustion notifies via guest email or account notification | `Retry Failed Payment — AC 5: background retry notification outcomes` | implemented (UI) — ATDD pending |

---

## Accessibility implementation

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | implemented | Fieldset legends and radio labels on vendor selector and saved-payment list; modal save prompts with labelled actions; StripeWave card fields programmatically labelled |
| Focus order matches reading order | implemented | Selector: nav → progress → vendor listbox / saved methods → summary → primary action. Vendor sub-flows: progress → vendor content → cancel/alternatives → summary |
| Focus is visible | implemented | Increment 2–4 focus styles retained; vendor tile selected state uses border + aria-checked |
| Errors programmatically associated | implemented (with notes) | `aria-live="polite"` on retry and eligibility status; `role="alert"` on payment errors. Known gap: `aria-describedby` self-reference on some decline regions — non-blocking |
| State cues not colour-only | implemented | *retrying payment* uses text + aria-live; expired saved payment method uses explicit *expired* label; hard decline uses reason text |
| Keyboard reachable | implemented | Full vendor selection, wallet cancel, instalment accept/decline, alternative vendor buttons, retry exhaustion selector without mouse |
| Axe (or host equivalent) passes | planned | Run on all new/changed payment screens in Engineering ATDD pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Screen bundle size | No explicit cap | baseline preserved | Increment 4 baseline unchanged; PayNova/VaultPay routes eagerly imported in App.tsx |
| PayNova / VaultPay widgets | Lazy-load on vendor selection | eager route imports | Redirect/embed flows load on navigation; lazy-load deferred — no measured regression |
| StripeWave widget | Lazy-load on payment step | `React.lazy` in StripeWavePaymentPage | Increment 4 pattern retained on `/checkout/payment/stripewave` |
| Payment retry polling | Non-blocking UI | `fetchPaymentRetryStatus` polling in PaymentRetryIndicator | Retry indicator polls server status with `aria-live="polite"`; no full-page blocking spinner beyond vendor flows |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | inline styles only | Retry indicator text status; modal overlay — no heavy animation |

---

## Scope guard (implementation)

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
| Increment 3 delivery-path branching | Standard delivery vs click-and-collect checkout spine unchanged |
| Email verification gate (Increment 4) | Account-only saved-entity checkout still requires verified *customer account* |

| Superseded from Increment 4 | Rationale |
| --- | --- |
| StripeWave sole active *payment vendor* | Increment 5 activates PayNova and VaultPay at *payment method selector* |

---

## Affordance trace (Increment 5)

See lo-fi § Affordance trace — all affordances mapped to AC story and clause. Spec implementation targets above cover each row.

---

## Walkthrough parity

| Walkthrough story group | Spec coverage |
| --- | --- |
| Process Digital Wallet Payment via PayNova (7 walks) | payment method selector · PayNova wallet flow · PayNova hard decline · order confirmation · save PayNova modal |
| Process Buy-Now-Pay-Later via VaultPay (6 walks) | payment method selector · VaultPay BNPL flow · VaultPay hard decline · order confirmation · save VaultPay modal |
| Retry Failed Payment (7 walks) | StripeWave card entry · payment retry in progress · payment retry exhausted · PayNova/VaultPay hard decline (no auto-retry) · order confirmation after retry · background notification |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-25 | initial | Specification slot 133 — Increment 5 interface spec from lo-fi + spec-by-example + walkthrough; 13 screens; 15 AC clauses mapped; multi-vendor selector; guest checkout preserved; Increment 4 StripeWave-only superseded |
| 2026-05-25 | code → md | Engineering slot 137 — Increment 5 UI implementation: multi-vendor payment selector, PayNova/VaultPay/retry sub-routes, server vendor adapters + retry status API, order confirmation vendor detail, save modals; AC tests pending ATDD slot |
| 2026-05-25 | code → md | Engineering slot 137 rework — logged-in multi-vendor saved payment (vendor discriminator + `savedPaymentMethodId` charge path), save PayNova/VaultPay modal persistence via `POST /api/account/payment-methods`, AC/a11y/performance tables synced |


---

## increment-6 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 6

<!-- migrated from: increments/6-pet-visits/specification/interface-design.md -->

# Interface design — Increment 6 (Pet visits)

> **Companion to** lo-fi `docs/increments/6-pet-visits/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–5 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 6 — Pet visits (13 screens, 19 stories) |
| Lo-fi reference | `docs/increments/6-pet-visits/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (Run 7 exploration, slots 145–146 cycle) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; Increment 6 screens AC-derived) |
| Prior interface specs | `docs/increments/5-pay-your-way/specification/interface-design.md` and earlier |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/pet/` (new), `packages/appointment/` (new), `packages/notification/` (extend), `packages/app-client/src/pages/` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-26 (Specification slot 159) |

## Description

Increment 6 brings the adoption side of PawPlace live. Customers browse the *Pet Gallery* (species filter), open a *Pet Profile Page* (available or adopted state), and book an *Appointment* to visit a pet at a *Store*. Booking is **customer-account-only** — guest users see an auth gate that holds the *Selected Slot* while they authenticate. Staff access the *Incoming Appointments* board, *Check In* arriving customers, record a *Visit Outcome* (including the adopted path), set *Follow-Up Actions*, and manage *Pet Profiles* (including *Mark Pet as Adopted*). System transactional notifications are shown as a preview screen covering *Appointment Reminder*, *Pet Adopted Before Visit Notification*, and *Visit Follow-Up Notification*. Builds on Increments 1–5 navigation chrome and account patterns.

---

## Host project conventions

Same baseline as Increments 2–5; additions for pet and appointment domain modules.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; customer-facing pages in `packages/app-client/src/pages/`; staff pages in `packages/app-client/src/pages/staff/`; new modules: `packages/pet/`, `packages/appointment/`
- **State management:** React component state + `CustomerSessionContext`; appointment booking wizard step state (slot selection → note → confirm); staff board uses server-polled list; no persistent client-side booking state across sessions (slot hold is server-managed)
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions; extend Increment 1–4 sidebar and list patterns for pet gallery and staff board; form layout matches Increment 2–4 checkout form conventions
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass per new/changed screen
- **Performance budget:** no explicit bundle cap — do not regress Increment 5 baseline; lazy-load staff-area routes; pet gallery and profile routes can eager-load (customer critical path)

---

## Pet and appointment domain extension

Increment 5 completed multi-vendor payment and closed the checkout spine. Increment 6 opens the adoption domain as a separate module family. All Increment 1–5 paths are preserved unchanged.

| Actor | Entry point | Booking gate | Staff path |
| --- | --- | --- | --- |
| **Guest** | `/pets` — *Pet Gallery* | Auth gate on booking attempt — slot held during auth | n/a |
| **Logged in (verified)** | `/pets` — *Pet Gallery* | Direct to booking flow | n/a |
| **Store Employee** | `/staff/appointments` | n/a | *Incoming Appointments* board → outcome / follow-up / check-in |

**Checkout progress tabs:** unchanged from Increments 3–5 — pet gallery and appointment booking are separate flows with their own breadcrumb chrome; they do not share the checkout wizard spine.

**Account area tabs:** *Appointments* tab added alongside *Profile* · *Orders* · *Wishlist* · *Saved Payments* (established Increment 4). Accounts tab is new in Increment 6.

**System-only paths (no dedicated customer screen):** *Appointment Reminder* sending (24h trigger — system), *Pet Adopted Before Visit Notification* trigger (on staff adoption action — system), *Visit Follow-Up Notification* trigger (on *Follow-Up Date* — system). These produce email content shown in the notification preview screen (staff-viewable reference only). Email resilience queuing is the same pattern as Increments 2–5 order confirmation.

---

## Screens (carried from lo-fi)

| Screen | Layout | Route (planned) | Stories | Change |
| --- | --- | --- | --- | --- |
| pet gallery | sidebar | `/pets` | Browse Pets by Species | **New** |
| pet profile page — available | stack | `/pets/:petId` | View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store | **New** |
| pet profile page — adopted | stack | `/pets/:petId` (adopted state) | View Pet Profile (adopted state) | **New** — conditional state on same route |
| book appointment — guest auth gate | modal | `/pets/:petId/book` (guest) | Confirm Appointment Booking | **New** — modal overlay on pet profile or book route |
| book appointment — select time slot | form | `/pets/:petId/book/slots` | View Available Time Slots at Store · Select Date and Time Slot | **New** |
| appointment confirmation — review and note | form | `/pets/:petId/book/confirm` | Add Visit Note · Confirm Appointment Booking | **New** |
| appointment booking confirmed | stack | `/pets/:petId/book/confirmed` | Confirm Appointment Booking | **New** |
| customer account — appointments | stack | `/account/appointments` | View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption | **New** — new tab in account area |
| staff — incoming appointments | stack | `/staff/appointments` | View Incoming Appointments · Check In Customer · Record No-Show | **New** |
| staff — record outcome | form | `/staff/appointments/:appointmentId/outcome` | Record Visit Outcome · Set Follow-Up Action | **New** |
| staff — set follow-up action | form | `/staff/appointments/:appointmentId/follow-up` | Set Follow-Up Action · Send Visit Follow-Up Notification | **New** |
| staff — pet profile editor | form | `/staff/pets/:petId/edit` | Update Pet Profile · Mark Pet as Adopted | **New** |
| notification preview — appointment reminder | stack | `/staff/notifications/preview` | Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification | **New** — staff reference screen |

---

## Screen specs (from lo-fi — regions verbatim)

### pet gallery

**Layout:** sidebar  
**Route:** `/pets`  
**AC stories:** Browse Pets by Species

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | *Pets* added to primary nav in Increment 6; logged-in chrome from Increment 4 |
| breadcrumb | header | chrome | breadcrumb | Home › Pets |
| species filter | panel | listbox | All (selected) · Dogs · Cats · Reptiles · Small Mammals | Filter is a sidebar listbox; active item highlighted; "All" is default; `aria-selected` per item |
| pet gallery grid | body | list | pet photo · pet name · breed · species · store name | Each row is a *Pet Card*; action: select pet card → navigate to `/pets/:petId`; `role="listitem"` per card |
| gallery empty state | body | form | No pets available in this category right now · species filter remains active | Shown when filtered species has no available pets; other species remain visible; empty state text in `aria-live="polite"` region |

**Conditional states:**
- Filter listbox `aria-selected="true"` on active species; `aria-selected="false"` on others
- Empty state rendered when `pets.length === 0` after species filter applied
- Gallery grid re-renders on species selection without full-page reload (React state update)

---

### pet profile page — available

**Layout:** stack  
**Route:** `/pets/:petId` (when `petStatus === "available"`)  
**AC stories:** View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail (selected) | Photo gallery thumbnails; selected photo displayed large above; action: select thumbnail updates main image; `aria-label="Pet photos"` on listbox |
| pet info | body | form | name · species · breed · age · temperament notes (optional) | *Temperament Notes* field omitted when empty — not rendered as blank; all fields read-only labels |
| store location | body | form | store name · store address · operating hours · distance from customer location | *Distance* shown when *Customer Location* available; prompt to share location or enter postcode when absent; store name is a link → Store Detail page (Increment 1) |
| pet status | body | form | Available badge | *Pet Status* displayed as Available badge; `aria-label="Pet status: Available"` |
| book a visit CTA | body | button-bar | Book a Visit (primary) | Links to appointment booking flow; visible only when *Pet Status* is *Available*; if guest → auth gate; if logged in → `/pets/:petId/book/slots` |

**Conditional states:**
- If guest clicks Book a Visit → show guest auth gate modal (slot hold begins)
- Distance region shows distance when `customerLocation` available; prompt shown when absent
- Store name link routes to existing Increment 1 Store Detail page

---

### pet profile page — adopted

**Layout:** stack  
**Route:** `/pets/:petId` (when `petStatus === "adopted"`)  
**AC stories:** View Pet Profile (adopted state)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| breadcrumb | header | chrome | breadcrumb | Home › Pets › [pet name] |
| pet photo gallery | body | listbox | pet photo thumbnail · pet photo thumbnail · pet photo thumbnail | Adopted pets remain viewable — not deleted from gallery; same photo listbox pattern |
| pet info | body | form | name · species · breed · age · temperament notes | Same fields as available state; profile remains viewable |
| store location | body | form | store name · store address · operating hours | Distance section preserved; store name link preserved |
| pet status — adopted | body | form | Adopted badge | *Pet Status* displayed as Adopted badge; `aria-label="Pet status: Adopted"` |
| book a visit — disabled | body | form | Book a Visit (disabled) | Button rendered as disabled (`disabled` attribute + `aria-disabled="true"`); no booking action; no CTA when *Pet Status* is *Adopted* |

**Conditional states:**
- Same route as available state; component branches on `petStatus`
- "Book a Visit" button rendered disabled (not hidden) to preserve screen structure consistency; screen reader announces "Book a Visit, dimmed"

---

### book appointment — guest auth gate

**Layout:** modal  
**Route:** modal overlay on `/pets/:petId/book` (guest branch)  
**AC stories:** Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| auth gate prompt | body | form | Appointments require a customer account · Sign In (primary) · Register | Guest cannot confirm; slot held temporarily (10 min) while customer authenticates; modal `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to heading |
| slot hold notice | body | form | Your selected slot is held for 10 minutes | Temporary hold preserved during auth so customer doesn't lose the *Selected Slot*; shown as `aria-live="polite"` notice |

**Conditional states:**
- Modal opens when guest selects Book a Visit; background (pet profile) remains inert (`aria-inert` or `inert` attribute)
- Sign In navigates to login route with `returnTo` param; after login, booking flow resumes
- Hold expires after 10 min server-side; if expired before auth completes, return to slot selection with slot released notice

---

### book appointment — select time slot

**Layout:** form  
**Route:** `/pets/:petId/book/slots`  
**AC stories:** View Available Time Slots at Store · Select Date and Time Slot

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | pet name · store name · store address | Context carried forward from pet profile; read-only; `aria-label` on each field |
| appointment calendar | body | listbox | date header (next 14 days) · 10:00 AM · 11:00 AM (selected) · 12:00 PM · 2:00 PM · 3:00 PM | *Available Time Slots* list; already-booked slots absent from list; selected slot highlighted (`aria-selected="true"`); 10-min hold on selection (server-side); keyboard: up/down arrows navigate slots |
| no slots available notice | body | form | No slots available — try a later date | Shown when all slots in date range are booked; `aria-live="polite"` |
| slot hold notice | body | form | Slot held for 10 minutes — complete booking to confirm | Shown after slot selection to indicate temporary hold; `aria-live="polite"` |
| slot released notice | body | form | Your selected slot is no longer held — please select a new time | Shown when temporary hold expires before customer confirms (*Select Date and Time Slot* AC 2); `role="alert"` |
| continue | body | button-bar | Continue (primary) · Back to pet profile | Proceeds to review and note step; Back navigates to `/pets/:petId` |

**Conditional states:**
- Slot hold started server-side when slot selected; UI shows 10-min countdown or static notice
- If hold expires: `role="alert"` slot released notice shown; Continue button disabled until new slot selected
- Double-booking (AC 3): server rejects second confirm; customer sees slot released notice on `/pets/:petId/book/confirm` — no separate customer screen; handled as a conflict error at confirm step

---

### appointment confirmation — review and note

**Layout:** form  
**Route:** `/pets/:petId/book/confirm`  
**AC stories:** Add Visit Note · Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment summary | body | form | pet name · store name · date · time slot | Read-only booking summary before confirm; `aria-label` per field |
| visit note | body | form | Visit Note (optional textarea — up to 500 characters) · character count remaining | Optional field; `aria-label="Visit Note (optional)"` + `aria-describedby` pointing to character count |
| visit note validation | body | form | validation error: visit note exceeds 500 characters | Shown when note exceeds character limit; `role="alert"`; booking not submitted until within limits |
| confirm booking | body | button-bar | Confirm Booking (primary) · Back to slot selection | Confirms the *Appointment Booking*; transitions *Time Slot* from available to booked; Back → `/pets/:petId/book/slots` |

**Conditional states:**
- Character counter updates live (`aria-live="polite"` on count); validation error on submit if over limit
- Blank *Visit Note*: textarea submitted empty; server stores no note; staff view shows no note field (not "empty")
- Slot conflict: if server returns slot-taken error, show slot released notice inline and route to `/pets/:petId/book/slots`

---

### appointment booking confirmed

**Layout:** stack  
**Route:** `/pets/:petId/book/confirmed`  
**AC stories:** Confirm Appointment Booking

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| confirmation header | body | form | Appointment confirmed! · booking reference | Confirmation page shown after successful booking; `aria-live="polite"` on confirmation message (page load) |
| booking details | body | form | pet name · store name · date/time · visit note (if provided) · Appointment Confirmation Email sent to customer email | Full booking summary; email sent notice uses customer's verified email address; visit note shown only if provided |
| post-confirmation actions | body | button-bar | View My Appointments (primary) · Browse More Pets | View My Appointments → `/account/appointments`; Browse More Pets → `/pets` |

**Conditional states:**
- Visit note region omitted from booking details when no note provided
- Email failure (AC 4): booking confirmed page still shown; email queued for retry; no error shown to customer (booking is not gated on email)

---

### customer account — appointments

**Layout:** stack  
**Route:** `/account/appointments`  
**AC stories:** View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Shared chrome |
| account nav | header | nav-tabs | Profile · Orders · Appointments (active) · Wishlist · Saved Payments | Account area tab from Increment 4; *Appointments* tab added in Increment 6; `aria-current="page"` on Appointments tab |
| upcoming appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · status badge · Cancel | Upcoming *Appointments* sorted soonest first; "pet adopted" badge + Cancel + Browse other pets when pet is *Adopted*; `aria-label` per list item includes pet name and date |
| past appointments | body | list | pet photo · pet name · store · date/time · visit note (if any) · outcome | *Past Appointments* below upcoming; cancelled appointments shown with *Cancelled* status badge |
| appointments empty state | body | form | No appointments yet — Browse the Pet Gallery | Shown when no appointments exist; Browse the Pet Gallery links to `/pets` |

**Conditional states:**
- Upcoming list: when appointment's pet is *Adopted* → show "pet adopted" badge + Cancel button + "Browse other pets" link (→ `/pets`)
- Cancel action: `POST /api/appointments/:id/cancel` → slot released; appointment moves to past/cancelled; list refreshes
- Past appointments: *Cancelled* status badge shown on cancelled entries; *Adopted* badge shown on past entries where pet was adopted

---

### staff — incoming appointments

**Layout:** stack  
**Route:** `/staff/appointments`  
**AC stories:** View Incoming Appointments · Check In Customer · Record No-Show

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome; minimal nav |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments (active) · Pet Profiles | *Incoming Appointments* tab active; `aria-current="page"` on active tab |
| appointments list | body | list | customer name · pet name · date/time · visit note (if any) · status · Check In · Record Outcome · Mark No-Show | All booked *Appointments* for this *Store*; sorted by date/time soonest first; "pet adopted" warning badge + notification status when applicable; "no check-in" indicator on past-due unvisited rows; row actions have `aria-label` referencing customer and pet name |
| already checked in | body | form | already checked in — checked in at [original Checked-In Time] | Conditional inline alert (`role="alert"`); shown when Check In triggered but customer already checked in (Check In Customer AC 3) |
| cancelled appointment block | body | form | this appointment was cancelled — no further action available | Conditional inline alert (`role="alert"`); shown when Check In triggered on a cancelled appointment (Check In Customer AC 4) |
| customer already checked in | body | form | customer was already checked in — no-show cannot be recorded | Conditional inline alert (`role="alert"`); shown when Mark No-Show triggered but customer was already checked in (Record No-Show AC 4) |
| appointments empty state | body | form | No upcoming appointments | Standard empty state |

**Conditional states:**
- Check In button: `POST /api/staff/appointments/:id/check-in` → records *Checked-In Time* + staff member; button label changes to "Checked In" with timestamp; already-checked-in alert if already transitioned
- Mark No-Show button: `POST /api/staff/appointments/:id/no-show` → records *No-Show Recorded By* + *No-Show Recorded At*; blocks if appointment is checked-in (customer-already-checked-in alert)
- Past-due rows (slot end passed, not checked in): "no check-in" indicator shown; Mark No-Show action available
- "pet adopted" badge + notification status shown on rows where pet is *Adopted* (from *Mark Pet as Adopted* or *Record Visit Outcome* with *Adopted* outcome)

---

### staff — record outcome

**Layout:** form  
**Route:** `/staff/appointments/:appointmentId/outcome`  
**AC stories:** Record Visit Outcome · Set Follow-Up Action

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time | Read-only; identifies the appointment being recorded; `aria-label` per field |
| outcome selector | body | listbox | Adopted (selected) · Interested — Returning · Not a Fit · Browsing Only | Four *Visit Outcome* options; selecting *Adopted* triggers pet status transition; *Interested — Returning* prompts follow-up; `aria-label="Visit Outcome"` on listbox |
| staff visit notes | body | form | Staff Visit Notes (optional textarea) | *Staff Visit Notes* free-text; optional (notes-less outcome accepted); `aria-label="Staff Visit Notes (optional)"` |
| outcome already recorded notice | body | form | Outcome already recorded: [existing outcome] · Override | Shown when outcome exists; override available to correction-authority staff; `role="alert"` on notice |
| submit | body | button-bar | Record Outcome (primary) · Cancel | Saves *Visit Outcome* + *Staff Visit Notes*; *Adopted* path also transitions *Pet Status* to *Adopted* and triggers *Pet Adopted Before Visit Notification* for affected customers; Cancel → back to `/staff/appointments` |

**Conditional states:**
- Selecting *Adopted*: server `POST /api/staff/appointments/:id/outcome` with `{ outcome: "adopted" }` → triggers pet status change + notification fan-out
- Selecting *Interested — Returning*: after submit, redirect to `/staff/appointments/:appointmentId/follow-up` with prompt
- Outcome already recorded: pre-populate outcome selector with existing value; show notice; Override button clears existing outcome for re-submission (correction-authority check server-side)

---

### staff — set follow-up action

**Layout:** form  
**Route:** `/staff/appointments/:appointmentId/follow-up`  
**AC stories:** Set Follow-Up Action · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| appointment context | body | form | customer name · pet name · date/time · outcome recorded | Context from prior outcome or no-show step; read-only |
| follow-up action | body | listbox | None · Schedule Return Visit · Hold Pet · Send Adoption Paperwork | *Follow-Up Action* options; `aria-label="Follow-Up Action"` on listbox |
| follow-up date | body | form | Follow-Up Date (date picker) | When the *Visit Follow-Up Notification* fires; required if action is not None; `aria-label="Follow-Up Date"` + `aria-required="true"` when visible |
| schedule return visit link | body | form | Book new appointment for [customer name] with [pet name] | Shown only when *Schedule Return Visit* selected; staff-assisted rebooking link to booking flow |
| hold expiry | body | form | Hold expires: [date] | Shown only when *Hold Pet* selected; pet remains *Available* with hold note; `aria-live="polite"` |
| submit | body | button-bar | Set Follow-Up (primary) · Skip | Saves *Follow-Up Action* + *Follow-Up Date*; Skip omits follow-up (sets action to *None*); both → back to `/staff/appointments` |

**Conditional states:**
- *None* selected: date picker hidden, submit saves action:none
- *Hold Pet* selected: show hold expiry field; `aria-required` on follow-up date; pet status remains *Available* server-side with hold note flag
- *Schedule Return Visit* selected: show booking link; staff opens booking flow in new tab or same window
- *Follow-Up Date* reached: system triggers *Visit Follow-Up Notification* (background job); suppressed if pet already *Adopted*

---

### staff — pet profile editor

**Layout:** form  
**Route:** `/staff/pets/:petId/edit`  
**AC stories:** Update Pet Profile · Mark Pet as Adopted

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Shared staff chrome |
| pet info form | body | form | name · species · breed · age · temperament notes · store (dropdown) | All *Pet Profile* fields editable; store dropdown for pet relocation; `aria-label` per field; `aria-required` on required fields |
| pet photo gallery — manage | body | list | photo thumbnail · alt text · remove | Existing photos listed with alt text input per photo; Upload Photo button adds to gallery additively; Remove deletes individual photo; `aria-label="Upload photo"` on upload button |
| pet status — mark adopted | body | form | Status: Available (dropdown — Available / Adopted) | Changing to *Adopted* triggers *Mark Pet as Adopted* flow + notifications to affected customers; `aria-label="Pet Status"` on dropdown |
| already adopted notice | body | form | This pet is already adopted | Shown when attempting to re-mark an already-adopted pet; `role="alert"` |
| save / cancel | body | button-bar | Save Changes (primary) · Cancel | Saves profile; customer-facing *Pet Profile Page* reflects changes immediately; Cancel → back to `/staff/appointments` or prior page |

**Conditional states:**
- Pet Status dropdown: changing from *Available* to *Adopted* shows confirmation dialog before submit (destructive action — triggers notifications)
- Already adopted: if `petStatus === "adopted"`, dropdown shows Adopted (read-only) + already-adopted notice; no re-submission
- Store transfer (AC 4): if store dropdown changes, server triggers store-change notification to customers with affected appointments
- Photo upload: `<input type="file" multiple>` with progressive upload; each uploaded photo appended to gallery list; existing photos not replaced unless Remove clicked

---

### notification preview — appointment reminder

**Layout:** stack  
**Route:** `/staff/notifications/preview`  
**AC stories:** Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | body | nav-tabs | Appointment Reminder (active) · Pet Adopted Before Visit · Visit Follow-Up | Preview selector for three transactional notification types; `aria-current="page"` on active tab |
| appointment reminder preview | body | form | Subject: Your appointment with [pet name] is tomorrow · pet name · store address · date/time · visit note | *Appointment Reminder* sent 24 hours before appointment; suppressed if cancelled or pet adopted |
| pet adopted before visit preview | body | form | Subject: [pet name] has been adopted · pet name · adoption status · Cancel Appointment (primary) · Browse Other Pets | *Pet Adopted Before Visit Notification* sent when staff marks pet adopted; includes cancel/rebook options |
| visit follow-up preview | body | form | Subject: Follow-up on your visit with [pet name] · pet name · store · follow-up context | *Visit Follow-Up Notification* triggered on *Follow-Up Date*; suppressed if pet adopted before date |
| resilience note | body | form | Email queued for retry when delivery system unavailable | Same email resilience pattern as order confirmation (Increments 2–5) |

**Conditional states:**
- Tab switch updates preview content; no server call per tab (static reference templates)
- All three notification types use same email retry pattern: if delivery unavailable, queued within a reasonable window

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Pet gallery (species filter + card list) | `PetGalleryPage.tsx`, `PetCard.tsx`, `SpeciesFilter.tsx` | `packages/pet/server/pet-catalog/` |
| Pet profile page (available + adopted states) | `PetProfilePage.tsx`, `PetPhotoGallery.tsx`, `StoreLocationSection.tsx` | `packages/pet/server/pet-profile/` |
| Book appointment — guest auth gate | `GuestAuthGateModal.tsx` | `packages/appointment/server/booking/` (slot-hold API) |
| Book appointment — slot selection | `AppointmentSlotPickerPage.tsx`, `AppointmentCalendar.tsx` | `packages/appointment/server/slot-availability/` |
| Appointment confirmation — note + confirm | `AppointmentConfirmPage.tsx` | `packages/appointment/server/booking/` |
| Appointment booking confirmed | `AppointmentConfirmedPage.tsx` | `packages/appointment/server/booking/` |
| Customer account — appointments | `CustomerAppointmentsPage.tsx`, `AppointmentListItem.tsx` | `packages/appointment/server/customer-appointments/` |
| Staff — incoming appointments | `StaffAppointmentBoardPage.tsx`, `StaffAppointmentRow.tsx` | `packages/appointment/server/staff-board/` |
| Staff — record outcome | `RecordOutcomePage.tsx` | `packages/appointment/server/visit-outcome/` |
| Staff — set follow-up action | `SetFollowUpPage.tsx` | `packages/appointment/server/follow-up/` |
| Staff — pet profile editor | `StaffPetProfileEditorPage.tsx`, `PetPhotoManager.tsx` | `packages/pet/server/pet-profile-editor/` |
| Notification preview | `NotificationPreviewPage.tsx` | `packages/notification/server/preview/` |
| Appointment reminder (system) | (no customer UI — server-scheduled job) | `packages/notification/server/appointment-reminder/` |
| Pet adopted before visit notification (system) | (no customer UI — triggered by adoption action) | `packages/notification/server/pet-adopted-notification/` |
| Visit follow-up notification (system) | (no customer UI — triggered by follow-up date) | `packages/notification/server/follow-up-notification/` |
| Slot hold management | (server-side — no dedicated component) | `packages/appointment/server/slot-hold/` |

---

## AC → behaviour → test mapping

One row per Increment 6 AC clause. Test names trace to story title and clause number. Status **pending (Engineering)** until implementation pass.

### Browse Pets by Species

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Browse Pets by Species | 1 | *Pet Gallery* shows pets filterable by *Species*; each *Pet Card* shows photo, name, breed, species, and *Store* | `Browse Pets by Species — AC 1: gallery shows pet cards with species filter` | pending (Engineering) |
| Browse Pets by Species | 2 | Selecting a *Species* filter shows only pets of that species; filter is visually active | `Browse Pets by Species — AC 2: species filter narrows gallery and shows active state` | pending (Engineering) |
| Browse Pets by Species | 3 | When no pets available in selected *Species*, gallery shows empty state message; filter remains active | `Browse Pets by Species — AC 3: empty state for filtered species preserves filter` | pending (Engineering) |

### View Pet Profile

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Pet Profile | 1 | *Pet Profile Page* shows *Pet Photo Gallery*, name, species, breed, age, *Temperament Notes*, and *Store* | `View Pet Profile — AC 1: profile page shows all fields and photo gallery` | pending (Engineering) |
| View Pet Profile | 2 | When *Pet Status* is *Available*, profile shows "Book a Visit" action | `View Pet Profile — AC 2: Book a Visit CTA visible when pet available` | pending (Engineering) |
| View Pet Profile | 3 | When *Pet Status* is *Adopted*, profile shows *Adopted* badge and "Book a Visit" is disabled; profile remains viewable | `View Pet Profile — AC 3: adopted badge shown and booking CTA disabled when adopted` | pending (Engineering) |
| View Pet Profile | 4 | When pet has no *Temperament Notes*, field is omitted from profile | `View Pet Profile — AC 4: temperament notes omitted when empty` | pending (Engineering) |

### View Pet Store Location and Distance

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Pet Store Location and Distance | 1 | *Pet Profile Page* shows pet's *Store* with name, address, and operating hours | `View Pet Store Location and Distance — AC 1: store info shown on profile` | pending (Engineering) |
| View Pet Store Location and Distance | 2 | When *Customer Location* available, *Distance* to *Store* is displayed | `View Pet Store Location and Distance — AC 2: distance shown when customer location available` | pending (Engineering) |
| View Pet Store Location and Distance | 3 | When no *Customer Location*, no *Distance* shown and prompt to share location or enter postcode displayed | `View Pet Store Location and Distance — AC 3: no distance without location reference; prompt shown` | pending (Engineering) |
| View Pet Store Location and Distance | 4 | Selecting *Store* name on *Pet Profile Page* opens *Store Detail* page (Increment 1) | `View Pet Store Location and Distance — AC 4: store name link opens store detail page` | pending (Engineering) |

### View Available Time Slots at Store

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Available Time Slots at Store | 1 | *Appointment Calendar* shows *Available Time Slots* at pet's *Store* for next N days | `View Available Time Slots at Store — AC 1: calendar shows available slots for configured date range` | pending (Engineering) |
| View Available Time Slots at Store | 2 | Already-booked *Time Slots* do not appear in *Available Time Slots* list | `View Available Time Slots at Store — AC 2: booked slots absent from calendar` | pending (Engineering) |
| View Available Time Slots at Store | 3 | When no *Time Slots* available in date range, calendar shows empty state message | `View Available Time Slots at Store — AC 3: no slots available message shown when calendar empty` | pending (Engineering) |

### Select Date and Time Slot

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Select Date and Time Slot | 1 | Selecting a *Time Slot* highlights *Selected Slot* and holds it temporarily (10 min) to prevent double-booking | `Select Date and Time Slot — AC 1: slot selection highlights and holds slot for 10 minutes` | pending (Engineering) |
| Select Date and Time Slot | 2 | When temporary hold expires, *Selected Slot* released back to available and customer notified to re-select | `Select Date and Time Slot — AC 2: hold expiry releases slot and notifies customer to re-select` | pending (Engineering) |
| Select Date and Time Slot | 3 | When two customers select same slot simultaneously, only first to confirm gets booking; second sees slot-no-longer-available notice | `Select Date and Time Slot — AC 3: simultaneous selection conflict resolves to first confirm` | pending (Engineering) |

### Add Visit Note

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Add Visit Note | 1 | Optional *Visit Note* field accepts up to 500 characters; character count displayed | `Add Visit Note — AC 1: visit note field accepts up to 500 characters with count` | pending (Engineering) |
| Add Visit Note | 2 | Blank *Visit Note* proceeds without note; staff view shows no note | `Add Visit Note — AC 2: blank note omitted from booking and staff view` | pending (Engineering) |
| Add Visit Note | 3 | *Visit Note* exceeding character limit shows validation error; booking not submitted | `Add Visit Note — AC 3: validation error when note exceeds 500 characters` | pending (Engineering) |

### Confirm Appointment Booking

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Confirm Appointment Booking | 1 | Logged-in customer confirms booking; *Appointment Booking* created; *Appointment Confirmation Page* shown; *Appointment Confirmation Email* sent | `Confirm Appointment Booking — AC 1: confirmation page and email on booking success` | pending (Engineering) |
| Confirm Appointment Booking | 2 | Guest attempting to confirm blocked; prompt to log in or register with explanation; *Selected Slot* held during auth | `Confirm Appointment Booking — AC 2: guest blocked with auth gate; slot held during authentication` | pending (Engineering) |
| Confirm Appointment Booking | 3 | On booking confirmed, *Time Slot* transitions to booked and is no longer shown to other customers | `Confirm Appointment Booking — AC 3: confirmed slot transitions to booked and removed from available` | pending (Engineering) |
| Confirm Appointment Booking | 4 | Email failure does not gate the booking; booking created and email queued for retry | `Confirm Appointment Booking — AC 4: booking created on email failure; email queued for retry` | pending (Engineering) |

### View Upcoming and Past Appointments

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Upcoming and Past Appointments | 1 | *Appointment List* shows upcoming appointments (soonest first), then past; each entry shows pet, store, date/time, and visit note | `View Upcoming and Past Appointments — AC 1: appointment list sorted with upcoming first` | pending (Engineering) |
| View Upcoming and Past Appointments | 2 | Empty *Appointment List* shows empty state with prompt to browse *Pet Gallery* | `View Upcoming and Past Appointments — AC 2: empty state shown with browse prompt when no appointments` | pending (Engineering) |
| View Upcoming and Past Appointments | 3 | When appointment's pet is *Adopted*, entry shows "pet adopted" badge with Cancel and Browse other pets actions | `View Upcoming and Past Appointments — AC 3: adopted badge with cancel and rebook actions on affected entry` | pending (Engineering) |

### Cancel or Rebook Appointment After Pet Adoption

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Cancel or Rebook Appointment After Pet Adoption | 1 | *Pet Adopted Before Visit Notification* includes cancel and browse-other-pets options | `Cancel or Rebook Appointment After Pet Adoption — AC 1: notification includes cancel and browse options` | pending (Engineering) |
| Cancel or Rebook Appointment After Pet Adoption | 2 | Customer cancels appointment; *Time Slot* released; appointment moves to *Cancelled* in *Appointment List* | `Cancel or Rebook Appointment After Pet Adoption — AC 2: cancellation releases slot and marks appointment cancelled` | pending (Engineering) |
| Cancel or Rebook Appointment After Pet Adoption | 3 | Customer chooses to rebook; navigates to *Pet Gallery*; original cancelled appointment remains in past | `Cancel or Rebook Appointment After Pet Adoption — AC 3: rebook navigates to gallery; cancelled appointment preserved in past` | pending (Engineering) |
| Cancel or Rebook Appointment After Pet Adoption | 4 | Customer neither cancels nor rebooks; appointment remains; staff see "pet adopted" warning; treated as no-show after date | `Cancel or Rebook Appointment After Pet Adoption — AC 4: uncancelled adoption appointment shows warning on staff board` | pending (Engineering) |

### Update Pet Profile

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Update Pet Profile | 1 | All *Pet Profile* fields editable by *Store Employee*: name, species, breed, age, *Temperament Notes*, *Pet Photo Gallery*, store | `Update Pet Profile — AC 1: all profile fields editable in staff editor` | pending (Engineering) |
| Update Pet Profile | 2 | Saving *Pet Profile* changes reflects immediately on customer-facing *Pet Profile Page* | `Update Pet Profile — AC 2: saved changes visible immediately on customer profile page` | pending (Engineering) |
| Update Pet Profile | 3 | New photos added to *Pet Photo Gallery* additively; existing photos not replaced unless removed | `Update Pet Profile — AC 3: photo upload is additive; existing photos preserved unless removed` | pending (Engineering) |
| Update Pet Profile | 4 | Changing pet's store triggers store-change notification to customers with affected appointments | `Update Pet Profile — AC 4: store transfer triggers notification to customers with existing appointments` | pending (Engineering) |

### Mark Pet as Adopted

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Mark Pet as Adopted | 1 | *Store Employee* marks pet as *Adopted*; *Pet Status* transitions to *Adopted*; "Book a Visit" disabled on *Pet Profile Page* | `Mark Pet as Adopted — AC 1: pet status transitions to adopted and booking CTA disabled` | pending (Engineering) |
| Mark Pet as Adopted | 2 | When pet has pending *Appointments*, system triggers *Pet Adopted Before Visit Notification* for each affected customer | `Mark Pet as Adopted — AC 2: pending appointments trigger adopted-before-visit notification to customers` | pending (Engineering) |
| Mark Pet as Adopted | 3 | Re-marking already-adopted pet shows "pet is already adopted" message; no status change | `Mark Pet as Adopted — AC 3: idempotent — already adopted pet shows notice with no change` | pending (Engineering) |

### View Incoming Appointments

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| View Incoming Appointments | 1 | Staff *Incoming Appointments* shows all booked appointments at store, sorted by date/time; each entry shows customer, pet, date/time, visit note | `View Incoming Appointments — AC 1: staff board shows all appointments sorted by date` | pending (Engineering) |
| View Incoming Appointments | 2 | When appointment's pet is *Adopted*, entry shows "pet adopted" warning badge and notification status | `View Incoming Appointments — AC 2: adopted pet badge and notification status on staff board entry` | pending (Engineering) |
| View Incoming Appointments | 3 | No upcoming appointments shows empty state | `View Incoming Appointments — AC 3: empty state shown when no appointments` | pending (Engineering) |

### Send Appointment Reminder

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Appointment Reminder | 1 | System sends *Appointment Reminder* email 24 hours before appointment with pet name, store address, date/time, visit note | `Send Appointment Reminder — AC 1: reminder email sent 24h before with correct fields` | pending (Engineering) |
| Send Appointment Reminder | 2 | *Appointment Reminder* suppressed for cancelled appointments | `Send Appointment Reminder — AC 2: reminder suppressed for cancelled appointment` | pending (Engineering) |
| Send Appointment Reminder | 3 | *Appointment Reminder* suppressed when pet is *Adopted*; *Pet Adopted Before Visit Notification* takes precedence | `Send Appointment Reminder — AC 3: reminder suppressed when pet adopted; adopted notification takes precedence` | pending (Engineering) |
| Send Appointment Reminder | 4 | Email delivery failure queues reminder for retry within reasonable window before appointment | `Send Appointment Reminder — AC 4: delivery failure queues reminder for retry` | pending (Engineering) |

### Send Pet Adopted Before Visit Notification

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Pet Adopted Before Visit Notification | 1 | When pet marked *Adopted* with pending *Appointments*, *Pet Adopted Before Visit Notification* sent to each affected customer with cancel and browse-other-pets options | `Send Pet Adopted Before Visit Notification — AC 1: notification sent to affected customers on adoption with cancel and browse options` | pending (Engineering) |
| Send Pet Adopted Before Visit Notification | 2 | Notification recorded against appointment; notification status visible on staff *Incoming Appointments* view | `Send Pet Adopted Before Visit Notification — AC 2: notification status visible on staff board` | pending (Engineering) |
| Send Pet Adopted Before Visit Notification | 3 | When pet adopted but no pending appointments, no notification sent | `Send Pet Adopted Before Visit Notification — AC 3: no notification when no pending appointments` | pending (Engineering) |
| Send Pet Adopted Before Visit Notification | 4 | Email delivery failure queues notification; "pet adopted" badge shown regardless of email failure | `Send Pet Adopted Before Visit Notification — AC 4: delivery failure queues notification; badge shown regardless` | pending (Engineering) |

### Check In Customer

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Check In Customer | 1 | *Store Employee* checks in appointment; system records *Checked-In Time* and staff member; status transitions to *Checked In* | `Check In Customer — AC 1: check-in records time and staff member; status transitions` | pending (Engineering) |
| Check In Customer | 2 | Early or late customer check-in allowed; *Checked-In Time* records actual arrival | `Check In Customer — AC 2: check-in records actual arrival regardless of slot start time` | pending (Engineering) |
| Check In Customer | 3 | Attempting to check in already checked-in appointment shows "already checked in" with original time; no duplicate recorded | `Check In Customer — AC 3: duplicate check-in shows original time; no duplicate recorded` | pending (Engineering) |
| Check In Customer | 4 | Attempting to check in cancelled appointment blocked with "this appointment was cancelled" message | `Check In Customer — AC 4: check-in blocked for cancelled appointment` | pending (Engineering) |

### Record Visit Outcome

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Record Visit Outcome | 1 | *Store Employee* selects outcome from four options: *Adopted* · *Interested — Returning* · *Not a Fit* · *Browsing Only*; *Staff Visit Notes* field available | `Record Visit Outcome — AC 1: outcome selector shows four options with staff notes field` | pending (Engineering) |
| Record Visit Outcome | 2 | Selecting *Adopted* marks appointment completed with *Adopted* outcome; pet status transitions to *Adopted* triggering same notifications | `Record Visit Outcome — AC 2: adopted outcome transitions pet status and triggers notifications` | pending (Engineering) |
| Record Visit Outcome | 3 | Selecting *Interested — Returning* prompts *Set Follow-Up Action* step | `Record Visit Outcome — AC 3: interested-returning outcome prompts follow-up action flow` | pending (Engineering) |
| Record Visit Outcome | 4 | Recording outcome on appointment with existing outcome shows existing data with override option | `Record Visit Outcome — AC 4: existing outcome shown with override option for correction authority` | pending (Engineering) |
| Record Visit Outcome | 5 | Outcome submitted without *Staff Visit Notes* accepted; notes optional | `Record Visit Outcome — AC 5: outcome accepted without staff notes` | pending (Engineering) |

### Record No-Show

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Record No-Show | 1 | After *Time Slot* passes without customer check-in, appointment shows "no check-in" indicator with Mark No-Show action | `Record No-Show — AC 1: past-due unchecked-in appointments show no-show indicator and action` | pending (Engineering) |
| Record No-Show | 2 | *Store Employee* marks appointment *No-Show*; system records staff member and timestamp; status transitions to *No-Show* | `Record No-Show — AC 2: no-show records staff member and timestamp; status transitions` | pending (Engineering) |
| Record No-Show | 3 | No-show triggers follow-up notification to customer offering to rebook | `Record No-Show — AC 3: no-show triggers follow-up notification to customer` | pending (Engineering) |
| Record No-Show | 4 | Attempting no-show on checked-in appointment blocked with "customer was already checked in" message | `Record No-Show — AC 4: no-show blocked for checked-in appointment` | pending (Engineering) |

### Set Follow-Up Action

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Set Follow-Up Action | 1 | *Store Employee* sets *Follow-Up Action* type and *Follow-Up Date*; system records and makes visible on appointment detail | `Set Follow-Up Action — AC 1: follow-up action and date saved and visible on appointment` | pending (Engineering) |
| Set Follow-Up Action | 2 | *Hold Pet* follow-up: pet status remains *Available* with hold note; *Follow-Up Date* shows hold expiry | `Set Follow-Up Action — AC 2: hold pet preserves available status with hold note and expiry date` | pending (Engineering) |
| Set Follow-Up Action | 3 | *Schedule Return Visit* follow-up shows booking link to staff for same pet | `Set Follow-Up Action — AC 3: schedule return visit shows staff-assisted booking link` | pending (Engineering) |
| Set Follow-Up Action | 4 | On *Follow-Up Date*, system triggers *Visit Follow-Up Notification* to customer | `Set Follow-Up Action — AC 4: follow-up notification triggered on follow-up date` | pending (Engineering) |

### Send Visit Follow-Up Notification

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Send Visit Follow-Up Notification | 1 | System sends *Visit Follow-Up Notification* on *Follow-Up Date* with pet name, store, and follow-up context | `Send Visit Follow-Up Notification — AC 1: notification sent on follow-up date with correct fields` | pending (Engineering) |
| Send Visit Follow-Up Notification | 2 | When *Follow-Up Action* is *None*, no follow-up notification sent | `Send Visit Follow-Up Notification — AC 2: no notification when follow-up action is none` | pending (Engineering) |
| Send Visit Follow-Up Notification | 3 | When pet adopted before *Follow-Up Date*, follow-up notification suppressed; *Pet Adopted Before Visit Notification* takes precedence | `Send Visit Follow-Up Notification — AC 3: follow-up suppressed when pet adopted; adopted notification takes precedence` | pending (Engineering) |
| Send Visit Follow-Up Notification | 4 | Email delivery failure queues follow-up notification for retry | `Send Visit Follow-Up Notification — AC 4: delivery failure queues follow-up notification` | pending (Engineering) |

---

## Accessibility implementation

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | `aria-label` on species filter listbox, appointment calendar listbox, all form fields (visit note, outcome selector, follow-up action, all pet profile editor fields); `<label for>` on textarea and date picker; photo upload input labelled; `aria-labelledby` on auth gate dialog |
| Focus order matches reading order | planned | Pet gallery: nav → filter sidebar → gallery grid → empty state. Booking flow: nav → breadcrumb → context → calendar → hold notice → continue. Staff board: nav → tabs → appointment list rows (actions last per row). Modal: heading → body content → primary action → secondary action |
| Focus is visible | planned | Increment 1–5 focus styles retained; listbox selected item uses border + `aria-selected`; modal traps focus while open |
| Errors programmatically associated | planned | `role="alert"` on visit note validation error, slot released notice, already-checked-in notice, cancelled appointment block, already-adopted notice; `aria-describedby` on visit note textarea → character count + validation error |
| State cues not colour-only | planned | *Available* / *Adopted* badges use text label (not colour alone); "no check-in" indicator uses text; slot hold / released notices use text; notification status on staff board uses text ("notified" / "not yet notified") |
| Keyboard reachable | planned | All gallery filter, pet card, booking step navigation, slot calendar selection, outcome selector, follow-up action, staff row actions keyboard-reachable without mouse |
| Modal focus trap | planned | Guest auth gate: focus trapped inside dialog; background inert; Escape closes modal and returns focus to trigger element |
| Axe (or host equivalent) passes | planned | Run on all new screens in Engineering ATDD pass |

---

## Performance constraints

| Constraint | Budget | Notes |
| --- | --- | --- |
| Screen bundle size | No explicit cap | Increment 5 baseline preserved; pet and appointment modules added as separate route chunks |
| Staff routes | Lazy-load on navigation | `/staff/*` routes lazy-loaded — not on critical customer path |
| Pet gallery image loading | Lazy-load per card | Pet card photos `loading="lazy"`; main photo on profile eager-loaded (above fold) |
| Appointment calendar | Non-blocking slot fetch | Available slots fetched async on page load; calendar renders skeleton until data ready |
| Slot hold (server) | 10-minute server-side hold | Client shows static hold notice; no polling required unless hold expiry feedback needed |
| Email retry (system) | Non-blocking | Email send is async; confirmation page shown immediately; retry queue in background |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | No heavy animation in booking flow or staff board; status badge transitions use CSS classes only |

---

## Scope guard (implementation)

| Excluded | Rationale |
| --- | --- |
| Returns / refunds UI | Deferred to Increment 7 |
| Product / checkout / payment UI | Increments 1–5 — preserved, not reproduced |
| Online adoption paperwork form | Physical process — staff handles offline (noted via *Follow-Up Action*: *Send Adoption Paperwork*) |
| Admin notification settings | Back-office scope; notification content configurable but not a customer screen |
| Pet availability calendar per store | Out of scope for Increment 6 |
| Pet breeding or lineage management | Out of scope |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout paths (Increments 2–3) | Guest shopping unchanged; appointment booking adds account gate separately |
| Account nav chrome (Increment 4) | *Appointments* tab added alongside Profile · Orders · Wishlist · Saved Payments |
| Store Detail page (Increment 1) | Reused from pet profile's store link |
| Distance / location entry (Increment 1) | Reused on pet profile to show *Distance* to pet's *Store* |
| Multi-vendor payment flow (Increment 5) | Unchanged — appointment booking is a separate domain |

---

## Affordance trace (Increment 6)

See lo-fi § Affordance trace — all affordances mapped to AC story and clause. Spec implementation targets and AC → behaviour → test mapping above cover each row.

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-26 | initial | Specification slot 159 — Increment 6 interface spec from lo-fi; 13 screens; 19 stories; 65 AC clauses mapped; pet gallery, profile states, booking flow, customer account appointments, staff board + actions, pet profile editor, notification preview; all pending Engineering |


---

## increment-7 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## Increment 7

<!-- migrated from: increments/7-returns-refunds/specification/interface-design.md -->

# Interface design — Increment 7 (Returns and refunds)

> **Companion to** lo-fi `docs/increments/7-returns-refunds/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–6 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 7 — Returns and refunds (7 screens, 6 stories) |
| Lo-fi reference | `docs/increments/7-returns-refunds/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Increment 7 section) |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Prior interface specs | `docs/increments/5-pay-your-way/specification/interface-design.md`, `docs/increments/6-pet-visits/exploration/ux/mockups.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/return/` (domain + API), `packages/app-client/src/pages/account/` (customer), `packages/app-client/src/pages/staff/` (staff) |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-28 (Specification slot 185) |

## Description

Full customer return flow on PawPlace: *order history* extends with Return button on eligible orders, return initiation with item/quantity/*return reason*/*item condition* selection, *return label* PDF + *return QR code* confirmation, *return status* timeline and *refund status* tracking on *order detail*. Staff screens: *order lookup* by number or email, *in-store return* processing with *manager override* for ineligible items. Notification previews: *return received notification*, *refund completed notification*, *refund under review notification* with email resilience. Labels use ubiquitous-language terms verbatim. **Increments 1–6 paths are preserved** — account navigation, order history, staff dashboard patterns extended; multi-vendor payment refund routing is vendor-agnostic to the customer.

---

## Host project conventions

Same baseline as Increments 2–6.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; return domain in `packages/return/`; customer pages in `packages/app-client/src/pages/account/`; staff pages in `packages/app-client/src/pages/staff/`
- **State management:** React component state + context; API calls from `packages/return/client/return.api.ts`
- **Styling:** component-scoped inline styles matching Increment 4–6 patterns; colour tokens via inline hex; consistent radius (6px controls, 8px cards), spacing (12–16px padding)
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass per screen; ARIA labels on sections, forms, controls
- **Performance budget:** no explicit bundle cap — do not regress Increment 6 baseline

---

## Screens

| Screen | Layout | Route | Stories | Status |
| --- | --- | --- | --- | --- |
| customer account — order history with return | stack | `/account/orders` | Initiate Return from Order History | **Updated** |
| initiate return — select items | form | `/account/orders/:orderNumber/return` | Initiate Return from Order History | **Existing** |
| return confirmation — label and QR code | stack | `/account/returns/:returnId/confirmation` | Generate Return Label or QR Code | **Existing** |
| order detail — return and refund tracking | stack | `/account/orders/:orderNumber` | Track Refund Status · Route Refund through Original Payment Vendor · Initiate Return from Order History | **Updated** |
| staff — order lookup for return | stack | `/staff/returns` | Process In-Store Return | **Existing** |
| staff — process in-store return | form | `/staff/returns/:orderNumber/process` | Process In-Store Return | **New** |
| notification preview — return and refund updates | stack | `/staff/notifications/returns` | Send Return and Refund Status Update | **New** |

---

## AC → Behaviour → Test mapping

### Story: Initiate Return from Order History

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — customer selects Return on eligible order | Return button visible on eligible orders in order history; navigates to initiate return page with eligible items, quantity selector, return reason dropdown, item condition dropdown | OrderHistoryPage, InitiateReturnPage | Initiate Return from Order History — AC 1 |
| AC 2 — system creates return record and shows next steps | Submit return request → API creates return record → navigate to return confirmation page with return reference, order number, next steps (label generation) | InitiateReturnPage | Initiate Return from Order History — AC 2 |
| AC 3 — outside return window or items not eligible | Return action hidden/disabled with reason text (e.g. "return window expired") on ineligible orders; order detail still viewable | OrderHistoryPage, OrderHistoryDetailPage | Initiate Return from Order History — AC 3 |
| AC 4 — partial return; items already returned shown as "return in progress" | Items with active return shown as disabled "return in progress"; remaining eligible items selectable; partial return badge on order history row | OrderHistoryPage, InitiateReturnPage | Initiate Return from Order History — AC 4 |

### Story: Generate Return Label or QR Code

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — label and QR shown + emailed | Return confirmation page shows PDF download link, QR code placeholder, email confirmation note | ReturnConfirmationPage | Generate Return Label or QR Code — AC 1 |
| AC 2 — label includes required details | Label download section states: return address, order number, return reference, carrier barcode | ReturnConfirmationPage | Generate Return Label or QR Code — AC 2 |
| AC 3 — QR code displayable on mobile | QR code display area with return reference; text explains mobile carrier drop-off usage; same reference as label | ReturnConfirmationPage | Generate Return Label or QR Code — AC 3 |
| AC 4 — label unavailable fallback | When labelUnavailable flag set, show warning: "return recorded — label generation temporarily unavailable; check back shortly or contact support" | ReturnConfirmationPage | Generate Return Label or QR Code — AC 4 |

### Story: Route Refund through Original Payment Vendor

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1–4 — refund routes through original vendor | Vendor-agnostic refund display on order detail; customer sees refund status, not vendor mechanics | OrderHistoryDetailPage (RefundStatusSection) | Route Refund through Original Payment Vendor — AC 1-4 |
| AC 5 — refund retry resilience | Customer sees "processing" not "refund failed"; on retry exhaustion shows "requires review" | OrderHistoryDetailPage (RefundStatusSection) | Route Refund through Original Payment Vendor — AC 5 |

### Story: Track Refund Status

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — refund status visible | Order detail shows refund status: processing, completed, or requires review | OrderHistoryDetailPage | Track Refund Status — AC 1 |
| AC 2 — completed with notification | Refund status "completed" with amount and masked payment method; "refund completed notification sent" note | OrderHistoryDetailPage | Track Refund Status — AC 2 |
| AC 3 — timing expectation | Processing state shows "refunds typically take 5–10 business days depending on your payment provider" | OrderHistoryDetailPage | Track Refund Status — AC 3 |
| AC 4 — requires review with contact support | Requires review state shows "Please contact support for assistance with your refund" | OrderHistoryDetailPage | Track Refund Status — AC 4 |

### Story: Process In-Store Return

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — order lookup and Start Return | Staff lookup by order number or customer email; matched order shows details + Start Return link | StaffReturnLookupPage | Process In-Store Return — AC 1 |
| AC 2 — return recorded + refund triggered + visible in account | Confirmation screen: return linked to order, refund triggered through original vendor, visible in customer order history | StaffProcessReturnPage | Process In-Store Return — AC 2 |
| AC 3 — guest order support | Guest order note on lookup page; lookup works identically by order number + guest email | StaffReturnLookupPage | Process In-Store Return — AC 3 |
| AC 4 — ineligibility + manager override | Ineligible items shown with reason; Manager Override button → manager approval gate (approving manager + override reason) | StaffProcessReturnPage | Process In-Store Return — AC 4 |

### Story: Send Return and Refund Status Update

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — return received notification | Preview tab: subject, order number, returned items summary, "inspection and refund processing are underway" | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 1 |
| AC 2 — refund completed notification | Preview tab: subject, refunded amount, masked payment method | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 2 |
| AC 3 — refund under review notification | Preview tab: subject, "requires additional review", "contact support", return and order reference | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 3 |
| AC 4 — email resilience | Resilience note: "Email queued for retry when delivery system unavailable — return/refund status still updated" | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 4 |

---

## Accessibility checklist

| Check | Status |
| --- | --- |
| Every input has a programmatic label (`<label htmlFor>` or `aria-label`) | Passing |
| Focus order matches reading order | Passing |
| Focus styles visible (browser default; not removed) | Passing |
| Errors associated with inputs (`aria-describedby` or `role="alert"`) | Passing |
| State changes announced (`aria-live`, `role="alert"`, `role="status"`) | Passing |
| Entire screen keyboard reachable | Passing |
| Colour-independent state cues (text labels + icon/border, not colour alone) | Passing |
| ARIA landmarks on sections | Passing |

---

## Performance budget

| Metric | Target | Status |
| --- | --- | --- |
| Bundle size regression | No increase over Increment 6 baseline | Met |
| Lazy-load return pages | Return pages are standard routes; no additional lazy-load required beyond existing code-splitting | N/A |
| API round-trips per page | 1–3 per page (eligibility, returns, refund status) | Met |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-28 | initial | 7 screens implemented for Increment 7 returns and refunds: OrderHistoryPage updated (Return button, eligibility, partial return badge), OrderHistoryDetailPage updated (return timeline, refund status, partial return affordance), InitiateReturnPage (existing), ReturnConfirmationPage (existing), ReturnTrackingPage (existing), StaffReturnLookupPage (existing), StaffProcessReturnPage (new — in-store return with manager override), ReturnNotificationPreviewPage (new — 3 notification tabs with resilience note). All routes registered in App.tsx. |
| 2026-05-28 | code → md | Engineering pass: fixed 6 API route mismatches between client and server — eligibility endpoint path, staff lookup POST method and path, staff initiate return path, mapReturnToDto field alignment (returnReference, labelUrl, qrCodeData, labelUnavailable), getReturnsByOrder response wrapping. Created return.module.ts to mount return and in-store-return routers in app-server. Added refund-status and batch return-statuses server endpoints. Enriched eligibility response with eligible/alreadyReturning fields for client schema. All AC behaviours wired to real API calls. |


---

## increment-8 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## increment-8-sprint-1-reviews-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 1 (Customer reviews)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screen: *product detail page — reviews and ratings*). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 1 product detail page under `packages/product-catalog/` — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 1 — Customer reviews (1 screen, 3 stories) |
| Ticket | `inc-8-sprint-1-reviews` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ product detail page — reviews and ratings) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 1 review stories only) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanism: Customer Review) |
| Prior interface specs | `docs/increments/7-returns-refunds/specification/interface-design.md`; Increment 1 product detail (`ProductDetailView`) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/product-catalog/client/` — extend `ProductDetailContent.tsx`, new `ReviewForm.tsx`, `ReviewList.tsx`, `ReviewPhotoLightbox.tsx`, `AggregateStarRating.tsx`; `packages/product-catalog/server/` — review API per architecture reference |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-30 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 1 extends the Increment 1 *Product Details Page* with a *Customer Reviews* section below product description. Verified purchasers submit *Customer Reviews* with mandatory *Star Rating* (1–5) and optional written text and *Review Photos*; non-purchasers see a purchase prompt; guests see a login/register prompt without leaving the page. All visitors read *Product Reviews* with *Aggregate Star Rating* (hidden when zero reviews), sort controls (newest, oldest, highest rating, lowest rating), pagination/lazy-load, inline photo thumbnails, and a lightbox for full-size images. Labels use ubiquitous-language terms verbatim. Buy flow and existing product detail regions (breadcrumb, image gallery, description) are preserved unchanged.

---

## Host project conventions

Same baseline as Increments 1–7; review UI lives in the product-catalog client package.

- **Folder layout:** extend `packages/product-catalog/client/` with review components; server review module under `packages/product-catalog/server/` per architecture reference (`review.service.ts`, `review.controller.ts`, etc.)
- **State management:** React component state for form draft (star rating, written text, photo upload errors); server state for review list, aggregate, pagination, sort; `CustomerSessionContext` for auth and purchase-eligibility gate
- **Styling:** component-scoped inline styles matching `productCatalogUiStyles.ts`; star rating uses accessible radio group; sort controls as tablist pattern consistent with Increment 4–7 nav-tabs
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists; accent for primary *Submit Review* button matches existing primary action colour
- **Test framework:** Vitest + React Testing Library (unit/component) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass on review form and lightbox
- **Performance budget:** no explicit bundle cap — do not regress Increment 7 baseline; lazy-load review list page 2+; lightbox dynamically imported

---

## Product detail extension

Increment 1 `ProductDetailView` / `ProductDetailContent` remain the host. Reviews section mounts below `ProductDescription`.

| Actor | Entry | Review form | Read path |
| --- | --- | --- | --- |
| **Guest** | `/product-catalog/:sku` | Login/register prompt; form hidden | Full read access to existing reviews |
| **Logged in — non-purchaser** | same | "Purchase this product to leave a review" | Full read access |
| **Logged in — verified purchaser** | same | Full review form (star rating, text, photos) | Full read access |

**API routes (from architecture reference):**

- `GET /api/products/:sku/reviews` — list with sort, pagination, aggregate
- `POST /api/products/:sku/reviews` — submit review (verified purchaser only)
- `POST /api/products/:sku/reviews/:reviewId/photos` — attach review photo

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| product detail page — reviews and ratings | stack | `/product-catalog/:sku` (existing) | Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews | **Updated** — reviews section added below description |

---

## Screen spec (from lo-fi — regions verbatim)

### product detail page — reviews and ratings

**Layout:** stack  
**Route:** `/product-catalog/:sku` (extends existing `ProductDetailView`)  
**AC stories:** Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged Increment 4 chrome |
| breadcrumb | header | toolbar | Product Catalog · Category · Product Name (current) | Unchanged Increment 1 pattern |
| product header with aggregate star rating | body | form | product name · aggregate star rating (e.g. ★★★★☆ 4.2 · 47 reviews) | *Aggregate Star Rating* in `ProductDetailHeader` when review count > 0; `aria-label="Aggregate star rating 4.2 out of 5, 47 reviews"` |
| product image gallery | body | list | (unchanged Increment 1) | Preserved above description |
| product description | body | form | (unchanged Increment 1) | Preserved |
| no reviews state | body | form | aggregate star rating not shown · "Be the first to review this product!" | When `reviewCount === 0`; no zero-star display |
| review sort controls | body | nav-tabs | Newest (active) · Oldest · Highest Rating · Lowest Rating | `role="tablist"`; default newest; changing sort refetches/reorders list; keyboard arrow navigation between tabs |
| customer reviews list | body | list | star rating · review text · review photo thumbnail · author · date · Load More Reviews | Each review `role="listitem"`; photos as `<button>` thumbnails opening lightbox; pagination via Load More or infinite scroll |
| review photo lightbox | body | dialog | full-size review photo · close lightbox | `role="dialog"` `aria-modal="true"`; Escape closes; focus trap; returns focus to thumbnail |
| review submission form — verified purchaser | body | form | star rating (1–5, radio group) · written review (optional, textarea) · upload review photos (optional, file input) · Submit Review (primary) | Star rating required (`aria-required="true"`); text optional; accept JPEG/PNG/WebP; max 5 MB per SBE |
| photo upload validation error | body | form | validation error (format or size) · star rating and written review preserved | `role="alert"` `aria-live="assertive"`; form draft not cleared on upload failure |
| non-purchaser state | body | form | "Purchase this product to leave a review" | Replaces form when logged in but not verified purchaser; reviews list still visible |
| guest prompt state | body | form | "Log in or register to leave a review" · Log In · Register | Replaces form for guest; page does not navigate away; Log In/Register link with `returnTo` current SKU |

**Conditional states:**

- `reviewCount === 0`: hide aggregate; show "Be the first to review this product!"
- Guest: guest prompt instead of form
- Non-purchaser: purchase prompt instead of form
- Verified purchaser: full form
- Photo upload error: alert region; draft preserved
- Lightbox open: overlay; body scroll locked; focus trapped

---

## AC → behaviour → test mapping

### Story: Submit Written Review with Star Rating

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — verified purchaser sees form | Form shows star rating radio group (1–5) and optional written review textarea; only when customer verified as purchaser | `ReviewForm` | Submit Written Review with Star Rating — AC 1 | pending |
| AC 2 — submit publishes review and recomputes aggregate | Submit Review POST succeeds; new review appears newest-first; aggregate updates in header | `ReviewForm`, `ReviewList`, `AggregateStarRating` | Submit Written Review with Star Rating — AC 2 | pending |
| AC 3 — non-purchaser sees purchase prompt | Form hidden; "Purchase this product to leave a review" shown; existing reviews visible | `ReviewForm` (purchase gate) | Submit Written Review with Star Rating — AC 3 | pending |
| AC 4 — guest login prompt without navigation | Guest sees "Log in or register to leave a review" with Log In and Register links; URL unchanged | `ReviewForm` (guest gate) | Submit Written Review with Star Rating — AC 4 | pending |
| AC 5 — star-rating-only accepted | Submit with star rating only (no text) succeeds; list shows stars without text body | `ReviewForm` | Submit Written Review with Star Rating — AC 5 | pending |

### Story: Submit Photo Review

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — optional photo upload on form | File input labelled "upload review photos"; optional; accepts image files | `ReviewForm` | Submit Photo Review — AC 1 | pending |
| AC 2 — photos displayed inline with lightbox | Thumbnails inline in review list; click opens full-size lightbox | `ReviewList`, `ReviewPhotoLightbox` | Submit Photo Review — AC 2 | pending |
| AC 3 — invalid format/size error preserves draft | Validation error "Supported formats: JPEG, PNG, WebP" or "Image must be under 5 MB"; star rating and text remain | `ReviewForm` | Submit Photo Review — AC 3 | pending |
| AC 4 — review accepted without photos | Submit without photos succeeds as standard written review | `ReviewForm` | Submit Photo Review — AC 4 | pending |

### Story: Read Customer Reviews

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — aggregate and listing | Aggregate near product name; individual reviews below product details | `AggregateStarRating`, `ReviewList` | Read Customer Reviews — AC 1 | pending |
| AC 2 — zero reviews suppresses aggregate | No aggregate display; "Be the first to review this product!" prompt | `AggregateStarRating`, `ReviewList` | Read Customer Reviews — AC 2 | pending |
| AC 3 — pagination and sort controls | Load More or lazy-load; sort tabs newest/oldest/highest/lowest | `ReviewList`, sort tablist | Read Customer Reviews — AC 3 | pending |
| AC 4 — photo thumbnails inline on read path | Thumbnails in list; select opens lightbox at full size | `ReviewList`, `ReviewPhotoLightbox` | Read Customer Reviews — AC 4 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | Star rating: `fieldset` + `legend="Star rating"` + labelled radios; textarea: `<label htmlFor>`; file input: visible label |
| Focus order matches reading order | planned | Header → gallery → description → aggregate → sort tabs → review list → form/gate → Load More |
| Focus is visible | planned | Browser default focus ring preserved; lightbox close button focusable |
| Errors programmatically associated | planned | Upload errors: `aria-describedby` on file input + `role="alert"` |
| State cues not colour-only | planned | Star rating: numeric label + filled/empty star icons; validation uses text message |
| Keyboard reachable | planned | Sort tabs: arrow keys; lightbox: Escape to close; form fully tabbable |
| Axe passes | pending | Run in Engineering implementation pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Bundle size regression | No increase over Increment 7 baseline | pending | Measure in Engineering pass |
| Review list initial load | First page only (e.g. 10 reviews) | pending | Lazy-load / Load More for remainder |
| Lightbox | Dynamic import on first open | pending | Avoid blocking product detail first paint |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | code → md | Engineering pass: ProductReviewsSection wired; eligibility API; aggregate in ProductDetailHeader. Tests pending vitest install. |


---

## increment-8-sprint-2-preferences-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 2 (Notification and communication preferences)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screens: *customer account — communication preferences*, *customer account — notification preferences*; opt-in touchpoints on registration and checkout). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 4 account settings under `packages/app-client/` — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 2 — Notification and communication preferences (2 account screens + 2 opt-in touchpoints, 3 stories) |
| Ticket | `inc-8-sprint-2-preferences` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ customer account — communication preferences · notification preferences) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 2 preference stories only) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanisms: Communication Preferences & Marketing Consent Gate · Notification Preferences (Transactional)) |
| Prior interface specs | `docs/increments/4-returning-customers/specification/interface-design.md`; `docs/increments/8-marketing-engine/specification/interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client/src/pages/account/CommunicationPreferencesPage.tsx`, `NotificationPreferencesPage.tsx`; extend `AccountSettingsNav.tsx`, `RegisterPage.tsx`, checkout payment step; `packages/customer-account/client/`, `packages/marketing/` server per architecture reference |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 2 adds customer-facing preference management for marketing *Communication Preferences* and transactional *Notification Preferences*, plus affirmative *Opt In* paths on registration and checkout. Logged-in customers toggle four *Marketing Category* checkboxes (Promotions, Recommendations, Restock Alerts, Events) and four transactional categories (Order Updates, Shipping Notifications, Appointment Reminders, Return Updates) with immediate persist on toggle — no save button. Guests see login/register prompts without leaving the current route. Registration and checkout expose a promotional email checkbox that is **unchecked by default**. Opting in to Promotions via communication preferences adds the customer to the *Marketing Email List* with a recorded timestamp. All labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–7; preference UI lives in `app-client` account area.

- **Folder layout:** new pages under `packages/app-client/src/pages/account/`; API client in `packages/customer-account/client/` and `packages/marketing/client/` as needed
- **State management:** server-backed preference DTOs; optimistic UI on toggle with PATCH; rollback + `role="alert"` on API failure
- **Styling:** component-scoped inline styles matching existing account pages (`WishlistPage`, `AddressBookPage`); `AccountSettingsLayout` grid
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core in component tests; keyboard pass on toggle lists and guest gates
- **Performance budget:** no regression over Increment 7 baseline; preference pages are lightweight forms

---

## Account navigation extension

Extend `AccountSettingsNav` to match lo-fi account nav (verbatim labels):

| Nav item | Route | Sprint |
| --- | --- | --- |
| overview | `/account` | existing |
| order history | `/account/orders` | existing |
| appointments | `/account/appointments` | existing |
| wishlist | `/account/wishlist` (or existing wishlist route) | existing |
| saved payment methods | `/account/payment-methods` | existing |
| communication | `/account/communication` | **new** |
| notifications | `/account/notifications` | **new** (preference page — distinct from `/account/notifications/:id` payment-retry route; resolve naming: use `/account/notification-preferences` if collision, lo-fi label remains *Notifications*) |

**Note:** If `/account/notifications` conflicts with `PaymentRetryNotificationPage` route, implement preferences at `/account/notification-preferences` and register alias redirect from `/account/notifications` when no `:id` segment — document in engineering pass.

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| customer account — communication preferences | stack | `/account/communication` | Set Communication Preferences · Opt In to Marketing Email List | **New** |
| customer account — notification preferences | stack | `/account/notifications` or `/account/notification-preferences` | Set Notification Preferences | **New** |
| register account (opt-in touchpoint) | form | `/register` | Opt In to Marketing Email List | **Updated** — promotional checkbox |
| checkout payment (opt-in touchpoint) | form | `/checkout/payment` | Opt In to Marketing Email List | **Updated** — promotional checkbox |

---

## Screen spec (from lo-fi — regions verbatim)

### customer account — communication preferences

**Layout:** stack  
**Route:** `/account/communication`  
**AC stories:** Set Communication Preferences · Opt In to Marketing Email List

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged Increment 4 chrome |
| account nav | header | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments · Communication (active) · Notifications | Communication tab active |
| communication preferences header | body | form | Marketing Communication Preferences · "Changes take effect immediately" | `h1` + supporting text; no Submit/Save button |
| marketing category toggles | body | list | marketing category · description · opt-in status | Four rows: Promotions, Recommendations, Restock Alerts, Events |
| promotions toggle | body | form | Promotions — sales, new products, seasonal offers (checkbox) | `aria-checked`; PATCH on change; opt-in adds to Marketing Email List |
| recommendations toggle | body | form | Recommendations — personalized product suggestions (checkbox) | |
| restock alerts toggle | body | form | Restock Alerts — wishlisted products back in stock (checkbox) | |
| events toggle | body | form | Events — in-store event notifications at preferred store (checkbox) | |
| transactional note | body | form | Transactional notifications not affected by these settings | Static note separating marketing from transactional |
| guest access state | body | form | "Log in or register to manage communication preferences" · Log In · Register | Replaces toggles; `returnTo=/account/communication`; URL unchanged |

**Conditional states:**

- Guest: guest gate replaces toggles
- New marketing category (API returns 5th category): render with `opted-out` / unchecked default
- All categories opted out: transactional note still visible
- Toggle error: `role="alert"`; revert checkbox to prior state

**API routes (architecture reference):**

- `GET /api/account/communication-preferences`
- `PATCH /api/account/communication-preferences` (per-category toggle, immediate)

---

### customer account — notification preferences

**Layout:** stack  
**Route:** `/account/notification-preferences` (preferred) with nav label *Notifications*  
**AC stories:** Set Notification Preferences

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged |
| account nav | header | nav-tabs | … · Communication · Notifications (active) | Notifications tab active |
| notification preferences header | body | form | Notification Preferences · "Changes take effect immediately" | Same immediate-toggle pattern |
| order updates toggle | body | form | Order Updates (checkbox) | Maps to category *order updates* |
| shipping notifications toggle | body | form | Shipping Notifications (checkbox) | |
| appointment reminders toggle | body | form | Appointment Reminders (checkbox) | |
| return updates toggle | body | form | Return Updates (checkbox) | |
| critical notifications note | body | form | "Some notifications cannot be disabled (e.g. order confirmation, refund completion)" | Always visible; non-suppressible categories documented |
| guest access state | body | form | "Log in or create an account" · guest order notifications continue via checkout email · Log In · Create Account | Guest gate; note about guest checkout email delivery |

**Conditional states:**

- Guest: login prompt with guest-checkout note
- All optional categories off: critical note remains; order confirmation and refund completion still sent server-side

**API routes:**

- `GET /api/account/notification-preferences`
- `PATCH /api/account/notification-preferences`

---

### Opt-in touchpoints (registration and checkout)

**Stories:** Opt In to Marketing Email List (AC 2–3)

| Touchpoint | Control | Behaviour |
| --- | --- | --- |
| `RegisterPage` | promotional email checkbox (unchecked default) | Label verbatim from UL; `defaultChecked={false}`; only sent to API when checked on submit |
| `PaymentPage` (or final checkout step before pay) | promotional email checkbox (unchecked default) | Same; checked + complete checkout → Marketing Email List + timestamp |

---

## AC → behaviour → test mapping

### Story: Set Notification Preferences

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — categories listed with on/off | Page lists Order Updates, Shipping Notifications, Appointment Reminders, Return Updates with current state | `NotificationPreferencesPage` | Set Notification Preferences — AC 1 | pass |
| AC 2 — toggle persists immediately | PATCH on checkbox change; no save button | `NotificationPreferencesPage` | Set Notification Preferences — AC 2 | pass |
| AC 3 — critical notifications note | Note visible when all optional off; server still sends order confirmation / refund completion | `NotificationPreferencesPage` | Set Notification Preferences — AC 3 | pass |
| AC 4 — guest login prompt | Guest gate with login/create account; guest checkout emails unaffected (server test) | `NotificationPreferencesPage` (guest gate) | Set Notification Preferences — AC 4 | pass |

### Story: Set Communication Preferences

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — marketing categories listed | Four categories with opt-in/opt-out status | `CommunicationPreferencesPage` | Set Communication Preferences — AC 1 | pass |
| AC 2 — immediate persist on toggle | PATCH on change; marketing send blocked after opt-out (integration) | `CommunicationPreferencesPage` | Set Communication Preferences — AC 2 | pass |
| AC 3 — new category defaults opt-out | Unknown category from API renders unchecked | `CommunicationPreferencesPage` | Set Communication Preferences — AC 3 | pass |
| AC 4 — transactional unaffected | Transactional note visible; notification preferences independent (integration) | `CommunicationPreferencesPage` | Set Communication Preferences — AC 4 | pass |
| AC 5 — guest prompt without navigation | Guest on `/account/communication` sees gate; URL unchanged | `CommunicationPreferencesPage` (guest gate) | Set Communication Preferences — AC 5 | pass |

### Story: Opt In to Marketing Email List

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — promotions opt-in adds to list | Toggle Promotions on → Marketing Email List membership + timestamp (API) | `CommunicationPreferencesPage` | Opt In to Marketing Email List — AC 1 | pass |
| AC 2 — registration/checkout checkbox default unchecked | Checkbox `defaultChecked={false}` on register and checkout | `RegisterPage`, `PaymentPage` | Opt In to Marketing Email List — AC 2 | pass |
| AC 3 — no marketing without opt-in | All categories off → no sends (server/integration) | `CommunicationPreferencesPage` | Opt In to Marketing Email List — AC 3 | pass (server) |
| AC 4 — promotions shows opted-in; toggle off unsubscribes | Promotions reflects list state; off removes from list when no categories remain | `CommunicationPreferencesPage` | Opt In to Marketing Email List — AC 4 | pass |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | pass | Each checkbox: `<label htmlFor>` with category name + description |
| Focus order matches reading order | pass | Nav → header → toggles → notes → guest links |
| Focus is visible | pass | Browser default focus ring preserved |
| Errors programmatically associated | pass | Failed PATCH: `role="alert"` `aria-live="assertive"` |
| State cues not colour-only | pass | Checkbox + text label for on/off |
| Keyboard reachable | pass | All toggles and guest links tabbable |
| Axe passes | pass | Component tests cover labels and guest gates |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Bundle size regression | No increase over Increment 7 baseline | pending | Two lightweight account pages |
| Toggle latency | PATCH completes &lt; 500ms p95 in dev | pending | Optimistic UI acceptable with rollback |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Implemented CommunicationPreferencesPage, NotificationPreferencesPage, PreferenceGuestGate, PromotionalEmailOptInCheckbox on RegisterPage and PaymentPage; client tests in `tests/marketing-engine/preferences/`. |
| 2026-05-30 | initial | Specification pass: communication + notification preference pages, account nav extension, registration/checkout opt-in checkboxes; 3 stories, 13 AC clauses mapped. |


---

## increment-8-sprint-3-campaigns-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 3 (Marketing campaigns and alerts)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screen: *notification preview — marketing communications*; product detail *Stock Availability* read path for restock best-effort). Specification-stage spec; implementation and tests land in Engineering. Campaign **dispatch** is system/back-end; this spec defines staff email preview UI, email template affordances (including *Unsubscribe* link), and customer read-path fidelity for restock alerts.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 3 — Marketing campaigns and alerts (1 staff preview screen + product detail stock read path, 4 system stories) |
| Ticket | `inc-8-sprint-3-campaigns` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ notification preview — marketing communications) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 3 campaign stories only) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanism: Marketing Email Dispatch · Marketing Unsubscribe link target) |
| Prior interface specs | `docs/increments/7-returns-refunds/specification/interface-design.md` (`ReturnNotificationPreviewPage` pattern); `docs/end-to-end/specification/interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client/src/pages/staff/MarketingNotificationPreviewPage.tsx`; email templates in `packages/marketing/` + `packages/notification/`; extend `packages/product-catalog/client/` product detail stock display |
| Test path | `tests/` (Vitest + RTL for preview UI; server tests for dispatch/consent gate) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 3 stories are **system** stories — admin batch creation and consent-gated delivery run server-side. Customer-facing UI for this sprint is:

1. **Staff notification preview** — tabbed email mockups for *Promotional Email*, *Personalized Recommendation*, *Restock Alert*, and *In-Store Event Notification*, mirroring Increment 7 return notification previews.
2. **Email template contract** — each marketing email includes an *Unsubscribe* link (routes to unsubscribe flow; confirmation page specified in Sprint 4).
3. **Product Details Page** — *Stock Availability* reflects current inventory on read (restock alert is best-effort, not a guarantee).

No admin marketing compose UI per lo-fi explicit non-goal ("batch creation and delivery are back-end operations").

---

## Host project conventions

- **Staff preview pattern:** copy `ReturnNotificationPreviewPage.tsx` — `StaffPage`, `role="tablist"` selector, per-type preview sections, resilience note footer
- **Folder layout:** `packages/app-client/src/pages/staff/MarketingNotificationPreviewPage.tsx`; route in `App.tsx`
- **State management:** local tab state only (preview is static mockup)
- **Styling:** inline styles consistent with `ReturnNotificationPreviewPage`
- **Test framework:** Vitest + RTL
- **Marketing dispatch tests:** server/integration in `packages/marketing/` — not preview component alone

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| notification preview — marketing communications | stack | `/staff/notifications/marketing` | Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification | **New** |
| product detail page (stock read path) | stack | `/product-catalog/:sku` | Send Restock Alert | **Updated** — live stock availability display (extends Sprint 1 product detail) |

---

## Screen spec (from lo-fi — regions verbatim)

### notification preview — marketing communications

**Layout:** stack  
**Route:** `/staff/notifications/marketing`  
**AC stories:** Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Promotional Email (active) · Personalized Recommendation · Restock Alert · In-Store Event | `role="tablist"`; arrow-key navigation; `aria-selected` |
| promotional email preview | body | form | Subject line · promotional content · unsubscribe link | Mock shows *Unsubscribe* link; documents delivery-time consent check |
| real-time opt-out note | body | form | "communication preferences checked at delivery time, not batch creation time" | Visible on Promotional tab |
| personalized recommendation preview | body | form | Subject line · recommendation basis · in-stock only · not sent without data · unsubscribe | Tab: Personalized Recommendation |
| restock alert preview | body | form | Subject line · wishlist match · best-effort signal · opt-in + wishlist required · unsubscribe | Tab: Restock Alert |
| in-store event preview | body | form | Subject line · event details · store match · preferred store required · walk-in discoverable · unsubscribe | Tab: In-Store Event |
| delivery resilience note | body | form | "Email queued for retry — not silently discarded" | Footer note all tabs |

**Email template requirements (all four types):**

- Visible *Unsubscribe* link in preview and production template
- Subject + body placeholders use UL terms verbatim
- Server enforces consent at send time (not UI)

---

### product detail page — stock availability (read path)

**Layout:** stack (existing product detail)  
**Route:** `/product-catalog/:sku`  
**AC story:** Send Restock Alert — AC 3

| Region | Behaviour |
| --- | --- |
| stock availability display | Shows current *Stock Availability* from API on each page load — if product went out-of-stock after *Restock Alert*, customer sees *out-of-stock* |
| best-effort copy (optional) | No guarantee messaging required in MVP unless AC demands; alert email preview documents best-effort invariant |

---

## AC → behaviour → test mapping

### Story: Send Promotional Email

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — delivered only to opted-in list members | Server: dispatch filters by Marketing Email List + promotions category | `marketing-dispatch.service` (integration) | Send Promotional Email — AC 1 | pending |
| AC 2 — realtime opt-out at delivery | Server: re-check Communication Preferences at send | `marketing-consent.guard` (integration) | Send Promotional Email — AC 2 | pending |
| AC 3 — unsubscribe link opts out + confirmation | Email template includes Unsubscribe link; click → opt-out + confirmation page (Sprint 4 page) | `MarketingNotificationPreviewPage`, `unsubscribe.service` | Send Promotional Email — AC 3 | pass (preview) |
| AC 4 — delivery failure queued | Server: queue retry; preview shows resilience note | `MarketingNotificationPreviewPage`, dispatch queue | Send Promotional Email — AC 4 | pass (preview) |

### Story: Send Personalized Recommendation

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — personalized from history/profile; recommendations opt-in | Server: generate from purchase/browsing/pet profile; gate on recommendations category | dispatch + preview tab | Send Personalized Recommendation — AC 1 | pass (preview) |
| AC 2 — no send without personalization data | Server: skip when no data | dispatch service | Send Personalized Recommendation — AC 2 | pass (preview) |
| AC 3 — out-of-stock excluded | Server: filter recommendations by Stock Availability | dispatch service | Send Personalized Recommendation — AC 3 | pending |
| AC 4 — recommendations opt-out blocks send | Server: consent gate | `marketing-consent.guard` | Send Personalized Recommendation — AC 4 | pending |

### Story: Send Restock Alert

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — alert on stock transition for wishlisted opted-in | Server: hook on stock transition → wishlist + restock alerts opt-in | `marketing-dispatch.service` | Send Restock Alert — AC 1 | pending (server) |
| AC 2 — suppressed when category opted out | Server: consent gate | `marketing-consent.guard` | Send Restock Alert — AC 2 | pending (server) |
| AC 3 — PDP shows current stock after alert | Product detail fetches live Stock Availability | `StockAvailabilityDisplay`, product detail | Send Restock Alert — AC 3 | pass |
| AC 4 — no alert without wishlist | Server: no recipients | dispatch service | Send Restock Alert — AC 4 | pending |

### Story: Send In-Store Event Notification

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — notify when preferred store matches | Server: preferred store match + events opt-in | dispatch service | Send In-Store Event Notification — AC 1 | pass (preview) |
| AC 2 — no notify without preferred store; event on store page | Server: skip send; Store Details Page lists event (store module) | dispatch + store UI | Send In-Store Event Notification — AC 2 | pass (preview) |
| AC 3 — events opt-out suppresses | Server: consent gate | `marketing-consent.guard` | Send In-Store Event Notification — AC 3 | pending |
| AC 4 — wrong store location no notify | Server: store id mismatch | dispatch service | Send In-Store Event Notification — AC 4 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Tab selector keyboard reachable | pass | Same pattern as ReturnNotificationPreviewPage |
| Preview sections labelled | pass | `aria-label` per preview section |
| Unsubscribe link in template preview | pass | Descriptive Unsubscribe link in each preview |
| Axe passes (staff page) | pass | Tablist + labelled sections in client tests |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Preview page bundle | Minimal static content | pending | No heavy deps |
| Batch dispatch | Out of UI scope | n/a | Server/async |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | MarketingNotificationPreviewPage at `/staff/notifications/marketing`; StockAvailabilityDisplay on product detail; client tests in `tests/marketing-engine/campaigns/`. |
| 2026-05-30 | initial | Specification pass: staff marketing notification preview (4 tabs); email template/unsubscribe contract; product detail stock read path for restock best-effort; 4 system stories, 16 AC clauses mapped. |


---

## increment-8-sprint-4-content-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 4 (Content publishing and unsubscribe)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screens: *blog index*, *blog post detail*, *pet care guide index*, *pet care guide detail*, *admin — content editor*, *unsubscribe confirmation*; cross-link touchpoints on pet/product browsing). Specification-stage spec; implementation and tests land in Engineering. Extends primary nav with *blog* and *pet care guides*; staff dashboard gains *Content* tab per Increments 6–7 pattern — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 4 — Content publishing and unsubscribe (6 screens + 2 cross-link touchpoints, 3 stories) |
| Ticket | `inc-8-sprint-4-content` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ blog index · blog post detail · pet care guide index · pet care guide detail · admin — content editor · unsubscribe confirmation) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Publish Blog Post · Publish Pet Care Guide · Unsubscribe from Marketing Emails) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanisms: Content Publishing · Marketing Unsubscribe) |
| Prior interface specs | `docs/end-to-end/specification/interface-design.md` (Communication Preferences unsubscribe path); `docs/end-to-end/specification/interface-design.md` (email *Unsubscribe* link target → this sprint confirmation page) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/content/` (new domain package); `packages/app-client/src/pages/content/` — `BlogIndexPage.tsx`, `BlogPostPage.tsx`, `GuideIndexPage.tsx`, `GuideDetailPage.tsx`, `StaffContentEditorPage.tsx`; `packages/app-client/src/pages/marketing/UnsubscribeConfirmationPage.tsx`; extend `PrimaryNav.tsx`, `StaffNav.tsx`; pet/product browsing cross-links in `packages/pet-gallery/client/`, `packages/product-catalog/client/` |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 4 delivers public *Blog Index* and *Blog Post* detail surfaces, *Guide Index* and *Pet Care Guide* detail surfaces with species-tag filtering and cross-linking from pet and product browsing areas, a staff *Admin Content Area* with draft-to-published lifecycle for *Blog Post* and *Pet Care Guide* (including tag-required validation before publish), and the customer *Unsubscribe Confirmation Page* reached from signed *Unsubscribe Token* links in marketing emails. *Communication Preferences* unsubscribe toggles from Sprint 2 remain the preferences-page path; this sprint adds the one-click email link execution and idempotent confirmation UI. Draft *Content* is never visible to customers; published *Content* is always reachable via its own URL. All labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–7; content UI spans new `packages/content/` and `app-client` routes.

- **Folder layout:** new `packages/content/` per architecture reference (`Content.ts`, `BlogPost.ts`, `PetCareGuide.ts`, server module); customer pages under `packages/app-client/src/pages/content/`; staff editor under `packages/app-client/src/pages/staff/` or `pages/content/StaffContentEditorPage.tsx`; unsubscribe page under `packages/app-client/src/pages/marketing/`
- **State management:** server-backed content DTOs; staff editor local draft state with explicit Save as Draft / Publish actions; customer index/detail pages fetch published content only; unsubscribe page stateless after token processing
- **Styling:** component-scoped inline styles matching existing marketing/account pages; species tag as badge on guide detail; pet type filter as `nav-tabs` on guide index
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core in component tests; keyboard pass on staff editor, filter tabs, and confirmation CTAs
- **Performance budget:** no regression over Increment 7 baseline; content indexes paginate or lazy-load if list grows

---

## Primary navigation extension

Extend global primary nav (verbatim labels from lo-fi):

| Nav item | Route | Sprint |
| --- | --- | --- |
| find stores | existing | existing |
| shop supplies | existing | existing |
| blog | `/blog` | **new** |
| pet care guides | `/guides` | **new** |
| account | existing | existing |

Logged-in chrome (cart · pets · wishlist) unchanged from Increment 4.

---

## Staff navigation extension

Extend staff nav tabs (verbatim labels):

| Nav item | Route | Sprint |
| --- | --- | --- |
| Stock Levels | existing | existing |
| Incoming Appointments | existing | existing |
| Pet Profiles | existing | existing |
| Returns | existing | existing |
| Content | `/staff/content` | **new** |

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| blog index | stack | `/blog` | Publish Blog Post | **New** |
| blog post detail | stack | `/blog/:slug` | Publish Blog Post | **New** |
| pet care guide index | stack | `/guides` | Publish Pet Care Guide | **New** |
| pet care guide detail | stack | `/guides/:slug` | Publish Pet Care Guide | **New** |
| admin — content editor | form | `/staff/content` | Publish Blog Post · Publish Pet Care Guide | **New** |
| unsubscribe confirmation | stack | `/marketing/unsubscribe/:token` | Unsubscribe from Marketing Emails | **New** |
| pet browsing area (cross-link) | stack | existing pet gallery routes | Publish Pet Care Guide | **Updated** — species-filtered guide links |
| product browsing area (cross-link) | stack | existing product catalog routes | Publish Pet Care Guide | **Updated** — species-matched guide links |

---

## Screen spec (from lo-fi — regions verbatim)

### blog index

**Layout:** stack  
**Route:** `/blog`  
**AC stories:** Publish Blog Post (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | Content nav items active/highlight on blog routes |
| blog index header | body | form | PawPlace Blog | Page heading (`h1`) |
| blog post listing | body | list | title · summary · date · author · Read Post | Published posts only — API filters `lifecycle status: published`; drafts never returned |

Each list row links to `/blog/:slug`. *Read Post* is primary row action.

---

### blog post detail

**Layout:** stack  
**Route:** `/blog/:slug` (e.g. `/blog/spring-pet-safety-tips`)  
**AC stories:** Publish Blog Post (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Blog · Post Title (current) | Blog links back to `/blog` |
| blog post content | body | article | title · author · date · body content | Full article; body rendered as readable prose (not editable on customer view) |

Direct URL navigation must render full article (AC 4). 404 for unknown slug or draft slug.

---

### pet care guide index

**Layout:** stack  
**Route:** `/guides`  
**AC stories:** Publish Pet Care Guide (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| guide index header | body | form | Pet Care Guides | Page heading |
| pet type filter | body | nav-tabs | All (active) · Dogs · Cats · Senior Pets · Small Animals | `role="tablist"`; filters listing client-side or via query param |
| pet care guide listing | body | list | title · summary · pet type/species tag · date · Read Guide | Published guides only; tag badge visible per row |

Each row links to `/guides/:slug`. Filter tabs use UL tag vocabulary.

---

### pet care guide detail

**Layout:** stack  
**Route:** `/guides/:slug` (e.g. `/guides/introduce-new-cat`)  
**AC stories:** Publish Pet Care Guide (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Pet Care Guides · Guide Title (current) | Guides links back to `/guides` |
| pet care guide content | body | article | title · author · date · pet type/species tag (badge) · body content | Tag badge uses species from publish metadata |

---

### admin — content editor

**Layout:** form  
**Route:** `/staff/content`  
**AC stories:** Publish Blog Post · Publish Pet Care Guide

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns · Content (active) | Content tab active |
| content type selector | body | nav-tabs | Blog Posts (active) · Pet Care Guides | Toggle editor mode |
| content list | body | list | title · status (draft/published) · date · author · Edit · Publish · New Post (primary) | Staff sees drafts; customers never do |
| blog post editor | body | form | title (text) · summary (textarea) · body content (textarea) · author (text) · Save as Draft · Publish (primary) | Draft → published lifecycle |
| pet care guide editor | body | form | title · summary · body content · pet type/species tag (dropdown) · Save as Draft · Publish (primary) | Shown on Pet Care Guides tab |
| tag required validation | body | alert | At least one pet type or species tag is required before publishing | Conditional: publish blocked; draft preserved |
| publish date note | body | form | Publish date will not change unless you update it explicitly · update publish date (checkbox) | Conditional: editing published post |

**Conditional states:**

- Pet Care Guides tab: guide editor with tag dropdown
- Tag missing on publish: validation `role="alert"`, draft not discarded
- Editing published post: publish date preservation unless explicit checkbox checked

---

### unsubscribe confirmation

**Layout:** stack  
**Route:** `/marketing/unsubscribe/:token`  
**AC stories:** Unsubscribe from Marketing Emails (email link path — AC 1, AC 4)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · account | Minimal nav |
| unsubscribe confirmation | body | form | You've been unsubscribed · category name · re-subscribe note · Manage Communication Preferences · Continue Shopping (primary) | Token processed server-side on GET; immediate category opt-out |
| already unsubscribed state | body | form | You've been unsubscribed · already unsubscribed note | Conditional: idempotent repeat click — same message, no error |

**Note:** Preferences-page unsubscribe (AC 2, AC 3) is implemented on Sprint 2 *Communication Preferences* screen — not duplicated here. Transactional *Notification Preferences* unaffected (AC 3 server invariant).

---

## Cross-link touchpoints (Publish Pet Care Guide — AC 2)

| Touchpoint | Behaviour | Component area |
| --- | --- | --- |
| Pet Browsing Area filtered by species | When species filter matches guide tag, show linked guide title | `packages/pet-gallery/client/` — species browse view |
| Product Browsing Area for species-matched products | Cat products surface cat-tagged guides (and vice versa) | `packages/product-catalog/client/` — category/species listing |

Links use guide title verbatim; route to `/guides/:slug`.

---

## AC → behaviour → test mapping

### Story: Publish Blog Post

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — published post on index with metadata + URL | Publish creates published Blog Post; index lists title, summary, date, author; detail at `/blog/:slug` | `StaffContentEditorPage`, `BlogIndexPage`, `BlogPostPage`, `content.service` | Publish Blog Post — AC 1 | passing |
| AC 2 — draft hidden from customers | Draft excluded from public API and index | `content.service`, `BlogIndexPage` | Publish Blog Post — AC 2 | passing |
| AC 3 — edit reflects live; publish date preserved | PATCH body updates live page; publish date unchanged unless explicit flag | `StaffContentEditorPage`, `content.service` | Publish Blog Post — AC 3 | passing |
| AC 4 — direct URL shows full article | GET `/blog/:slug` renders title, author, date, body | `BlogPostPage` | Publish Blog Post — AC 4 | passing |

### Story: Publish Pet Care Guide

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — published guide on index with tag + URL | Guide index shows title, summary, tag, date; detail at `/guides/:slug` | `GuideIndexPage`, `GuideDetailPage`, `StaffContentEditorPage` | Publish Pet Care Guide — AC 1 | passing |
| AC 2 — species tag cross-links from pet/product browsing | Matching species surfaces guide link | pet gallery + product catalog client | Publish Pet Care Guide — AC 2 | passing |
| AC 3 — draft hidden from customers | Draft excluded from public guide API | `content.service`, `GuideIndexPage` | Publish Pet Care Guide — AC 3 | passing |
| AC 4 — publish blocked without tag; draft preserved | Validation error; remains draft in admin | `StaffContentEditorPage`, `content.service` | Publish Pet Care Guide — AC 4 | passing |

### Story: Unsubscribe from Marketing Emails

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — email link opts out + confirmation | GET token → opt-out category → confirmation page with *you've been unsubscribed* | `UnsubscribeConfirmationPage`, `unsubscribe.service` | Unsubscribe from Marketing Emails — AC 1 | passing |
| AC 2 — preferences page unsubscribe | Toggle on Communication Preferences (Sprint 2) | `CommunicationPreferencesPage` | Unsubscribe from Marketing Emails — AC 2 | passing (Sprint 2) |
| AC 3 — transactional notifications unaffected | Server: marketing unsubscribe does not alter Notification Preferences | `unsubscribe.service`, notification dispatch | Unsubscribe from Marketing Emails — AC 3 | passing |
| AC 4 — repeat link idempotent | Same confirmation message; no error | `UnsubscribeConfirmationPage`, `unsubscribe.service` | Unsubscribe from Marketing Emails — AC 4 | passing |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | done | Staff editor fields use `<label>`; filter tabs use `aria-selected` |
| Focus order matches reading order | done | Editor: title → summary → body → actions |
| Focus is visible | done | Match existing staff/account focus ring |
| Errors programmatically associated | done | Tag validation uses `role="alert"` + `data-testid` |
| State cues not colour-only | done | Draft/published status includes text label |
| Keyboard reachable | done | Tab through content list, editor, confirmation CTAs |
| Axe passes | done | Engineering pass via RTL tests |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Content index pages | Lightweight list render | pending | Paginate if >20 items |
| Staff editor | No heavy WYSIWYG in MVP | pending | Plain textarea per lo-fi |
| Unsubscribe page | Minimal static confirmation | pending | Token verify server-side |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Routes, customer pages, staff editor, unsubscribe confirmation, nav extensions, guide cross-links, client tests (`tests/marketing-engine/content/content_client.test.tsx`). |


---

## increment-9 (rollup)

<!-- migrated from: end-to-end/specification/interface-design.md -->

# Interface Design


---

## increment-9-sprint-1-search-interface-design

<!-- migrated from: increments/9-power-ups/specification/interface-design.md -->

# Interface design — Increment 9 Sprint 1 (Product search and filter)

> **Companion to** lo-fi `docs/increments/9-power-ups/exploration/ux/mockups.md` / `product-search-results.drawio` (screen: *product search results*). Specification-stage spec; implementation and tests land in Engineering. Extends global site header with always-visible *Search Bar* and adds sidebar filter + results layout — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 1 — Product search and filter (1 screen + global header search bar, 2 stories) |
| Ticket | `inc-9-sprint-1-search` |
| Lo-fi reference | `docs/increments/9-power-ups/exploration/ux/mockups.md` (§ Screen 1: Product Search Results) · `docs/increments/9-power-ups/exploration/ux/product-search-results.drawio` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Search Products by Keyword · Filter Products) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/end-to-end/specification/architecture-reference.md` (extend `packages/product-catalog/` search module — assign in engineering arch-reference pass) |
| Prior interface specs | Increment 1 product catalog browse (`ProductCatalogView`); Increment 8 primary nav patterns |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client/src/components/GlobalSearchBar.tsx`; `packages/app-client/src/pages/catalog/ProductSearchResultsPage.tsx`; `packages/product-catalog/client/` — `FilterFacetsPanel.tsx`, `ActiveFilterChips.tsx`, `SearchResultsList.tsx`; `packages/product-catalog/server/search.service.ts`, `search.controller.ts` |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 1 adds global *Product Search* via a header *Search Bar* on every page and a dedicated *Search Results* page with sidebar *Filter Facet* panel, removable *Active Filter* chips, relevance-ranked product list, and guided empty states. *Filter Facet* dimensions are *category*, pet type, brand, price range (min–max), and *Stock Availability*; counts recalculate on every filter change and combine conjunctively. Keyword search supports partial/fuzzy matching; zero-match keyword searches show *no results found* with suggestions; zero-match filter combinations show *no products match your filters* with *clear all filters*. Submitting search from any page navigates to `/catalog/search?q=…`. Labels use power-ups ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–8; search UI extends product-catalog package and global header.

- **Folder layout:** search page under `packages/app-client/src/pages/catalog/`; reusable facets/results under `packages/product-catalog/client/`; API under `packages/product-catalog/server/`
- **State management:** URL query params for `q` and filter state (`category`, `petType`, `brand`, `priceMin`, `priceMax`, `inStock`); server returns ranked results + facet counts for current combined state
- **Styling:** sidebar layout (filter panel left, results right) per lo-fi; active filter chips as removable pills in toolbar row above results
- **Token system:** `packages/shared/layout-tokens.ts`
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core; keyboard navigation for facets, chips, and search submit
- **Performance budget:** debounce facet count refetch optional; no regression over Increment 7 catalog browse baseline

---

## Global header extension

| Region | Route | Stories | Change |
| --- | --- | --- | --- |
| Site header with search bar | all pages | Search Products by Keyword | **Updated** — persistent search input + submit in primary header |

**Controls (verbatim from lo-fi):** Search products… (text input) · submit (implicit Enter or search button)

Submit navigates to `/catalog/search?q={keyword}` preserving current filters only when already on search page (engineering detail).

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| product search results | sidebar | `/catalog/search` | Search Products by Keyword · Filter Products | **New** |

Product catalog browse (`/product-catalog`) reuses the same *Filter Facet* panel and *Active Filter* chip components per Filter Products AC 1 (browse OR search results).

---

## Screen spec (from lo-fi — regions verbatim)

### product search results

**Layout:** sidebar (filter panel left, results body right)  
**Route:** `/catalog/search?q={keyword}`  
**AC stories:** Search Products by Keyword · Filter Products

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| site header with search bar | header | toolbar | Search products… (prefilled with current keyword) | Global access; submit re-runs search |
| filter facets panel | panel | form | category · pet type · brand · price range (min–max) · stock availability | Each dimension lists values with match counts |
| facet match counts | panel | listbox | count per facet value | Counts reflect combined active filter state — never stale |
| active filters | body | toolbar (chips) | removable chips per active filter · clear all filters | Chip remove expands results; zero-result shows clear-all CTA |
| search results list | body | list | product name · price · category · relevance order | Closest keyword match first |
| no results message — keyword | body | chrome | no results found · popular categories · alternative keywords | Conditional: keyword match empty |
| no results message — filters | body | chrome | no products match your filters · clear all filters | Conditional: filters intersect to zero |

**Price range facet:** min and max numeric inputs (not discrete buckets) per UL decision.

**Partial/fuzzy matching:** server-side; UI displays same results list component.

---

## AC → behaviour → test mapping

### Story: Search Products by Keyword

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — keyword match ranked by relevance | Submit keyword → API returns matches on name, description, category, brand; closest first | `GlobalSearchBar`, `SearchResultsList`, `search.service` | Search Products by Keyword — AC 1 | pass |
| AC 2 — no match shows guidance | Empty keyword results show *no results found* + suggestions | `SearchResultsList` | Search Products by Keyword — AC 2 | pass |
| AC 3 — partial keyword fuzzy match | Partial *kitt* returns kitten food product | `search.service`, `SearchResultsList` | Search Products by Keyword — AC 3 | pass (server) |
| AC 4 — global search from any page | Header search on product detail → navigate to search results | `GlobalSearchBar`, routing | Search Products by Keyword — AC 4 | pass |
| AC 5 — filters narrow keyword results | Active filter intersects with keyword results immediately | `FilterFacetsPanel`, `ActiveFilterChips`, `SearchResultsList` | Search Products by Keyword — AC 5 | pass |

### Story: Filter Products

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — facets with counts on browse/search | Five dimensions visible; counts per value | `FilterFacetsPanel` | Filter Products — AC 1 | pass |
| AC 2 — select facet → chip + immediate narrow | Selection adds chip; list updates | `FilterFacetsPanel`, `ActiveFilterChips` | Filter Products — AC 2 | pass |
| AC 3 — conjunctive filters + count refresh | Multiple filters intersect; counts recalculate | `FilterFacetsPanel`, `search.service` | Filter Products — AC 3 | pass |
| AC 4 — remove chip expands + recalculates | Chip remove restores excluded products | `ActiveFilterChips` | Filter Products — AC 4 | pass |
| AC 5 — zero results clear-all | *no products match your filters* + clear all; no stale counts | `SearchResultsList`, `ActiveFilterChips` | Filter Products — AC 5 | pass |
| AC 6 — price range min-max | Min/max inputs behave like other facets | `FilterFacetsPanel` (price range) | Filter Products — AC 6 | pass |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Search input labelled | planned | `aria-label="Search products"` or visible label |
| Facet controls keyboard reachable | planned | Checkbox/radio pattern per facet value |
| Active filter chips removable via keyboard | planned | Chip button with accessible name |
| Focus order | planned | Header search → facets → chips → results |
| Empty states announced | planned | `role="status"` on no-results regions |
| Axe passes | pending | Engineering pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Search results page | No regression vs catalog browse | pending | Server-side ranking |
| Facet count refetch | Immediate on filter change | pending | May batch API calls in engineering |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | initial | Specification pass: global header search bar + product search results sidebar layout; 2 stories, 11 AC clauses mapped. |


---

## increment-9-sprint-2-stores-interface-design

<!-- migrated from: increments/9-power-ups/specification/interface-design.md -->

# Interface design — Increment 9 Sprint 2 (Store preference and tailoring)

> **Companion to** lo-fi `docs/increments/9-power-ups/exploration/ux/mockups.md` / companion `.drawio` (screens: *store locator with filters*, *my store preferences*; tailoring touchpoints on product detail and click-and-collect checkout). Specification-stage spec; implementation and tests land in Engineering. Extends Increment 1 store locator and account settings — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 2 — Store preference and tailoring (2 primary screens + 3 tailoring touchpoints, 3 stories) |
| Ticket | `inc-9-sprint-2-stores` |
| Lo-fi reference | `docs/increments/9-power-ups/exploration/ux/mockups.md` (§ Screen 2 · Screen 3) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Filter Stores · Set My Store Preference · Tailor Experience to Preferred Store) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md` |
| Prior interface specs | `docs/increments/1-walk-in-driver/specification/interface-design.md` (store locator, store detail); `docs/increments/2-click-and-collect/specification/interface-design.md` (click-and-collect store selection); `docs/increments/4-returning-customers/specification/interface-design.md` (account settings) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/store/` — extend `StoreLocatorPage.tsx`, `StoreDetailPage.tsx`, `StoreFilterPanel.tsx`; `packages/customer-account/` — `MyStorePreferencePage.tsx`, preference API; `packages/product-catalog/client/` — default stock to preferred store; checkout C&C step pre-select |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 2 adds *Store Specialization Filter* and *Product Availability Filter* dimensions to the *Store Locator*, conjunctive narrowing with a *clear filters* empty state, and *Set as My Store* on store detail plus account settings to persist *My Store* on the customer account. When *My Store* is set, the *Tailored Experience* highlights the preferred store in the locator, defaults *Stock Availability* on product pages to that store, and pre-selects the store in click-and-collect checkout while keeping the full list available for override. Guests see a login/register prompt without leaving the page when attempting to set preference. Labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–8; store preference spans store and customer-account packages.

- **Folder layout:** filter UI in `packages/store/client/`; preference pages in `packages/app-client/src/pages/account/` and store detail extension
- **State management:** server-backed `myStore` on customer account; locator filters via URL or local state with immediate list refresh; tailoring reads preference from session/context
- **Styling:** sidebar layout for locator filters (matches search facet pattern); preferred store row highlight via border/badge — not colour-only
- **Token system:** `packages/shared/layout-tokens.ts`
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Accessibility check:** axe-core; filter panel keyboard navigable; guest modal `role="dialog"`
- **Performance budget:** no regression over Increment 8 baseline

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| store locator with filters | sidebar | `/stores` (existing) | Filter Stores by Availability and Specialization · Tailor Experience (highlight) | **Updated** |
| store detail — set my store | stack | `/stores/:storeId` (existing) | Set My Store Preference · Tailor Experience | **Updated** — Set as My Store action |
| my store preferences (account) | form | `/account/my-store` | Set My Store Preference | **New** |
| product detail — stock default | stack | `/product-catalog/:sku` | Tailor Experience to Preferred Store | **Updated** — default stock to my store |
| checkout click-and-collect store step | form | existing C&C route | Tailor Experience to Preferred Store | **Updated** — pre-select my store |

---

## Screen spec (from lo-fi — regions verbatim)

### store locator with filters

**Layout:** sidebar  
**Route:** `/stores`  
**AC stories:** Filter Stores by Availability and Specialization · Tailor Experience to Preferred Store (highlight)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Store filter panel | panel | form | store specialization filter · product availability filter | Two filter dimensions per lo-fi |
| Store results list | body | list | store name · address · distance · specialization badges | Only matching stores when filters active |
| My store highlight | body | chrome | preferred store badge / highlight | When customer has *My Store*, matching row visually highlighted (text + icon, not colour-only) |
| No stores message | body | chrome + button-bar | no stores match your filters · clear filters | Zero-match combined filters |

---

### store detail — set my store

**Layout:** stack (extends existing store detail)  
**Route:** `/stores/:storeId`  
**AC stories:** Set My Store Preference

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Store detail header | body | chrome | store name · address · hours | Existing Increment 1 regions preserved |
| Set My Store action | body | button-bar | Set as My Store (primary) | Logged-in: PATCH preference immediately; replaces prior *My Store* |
| Current preference indicator | body | chrome | Your preferred store | Shown when this store is current *My Store* |
| Guest login prompt | body (modal) | chrome + button-bar | log in or register to set my store · Log In · Register | Guest: modal; `returnTo` preserves store detail URL |

---

### my store preferences (account)

**Layout:** form  
**Route:** `/account/my-store`  
**AC stories:** Set My Store Preference

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| account nav | header | nav-tabs | … existing tabs … · My Store (active) | New account nav item |
| preference form | body | form | current my store name · Change store (link to locator) · Clear preference | Alternative path to set/change preference |
| no preference state | body | chrome | No preferred store set · Browse stores | When unset — no tailoring applied |

---

### tailoring touchpoints (no new routes)

| Touchpoint | Behaviour | AC |
| --- | --- | --- |
| Product page stock availability | Defaults to *My Store* stock when preference set | Tailor AC 1 |
| Store locator list | Preferred store row highlighted | Tailor AC 2 |
| Click-and-collect checkout | Preferred store pre-selected; full list still selectable | Tailor AC 3 |
| No my store | All tailoring off; prior increment defaults | Tailor AC 4 |

---

## AC → behaviour → test mapping

### Story: Filter Stores by Availability and Specialization

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — filter dimensions available | Specialization + product availability filters on locator | `StoreFilterPanel` | Filter Stores — AC 1 | done |
| AC 2 — specialization filter narrows list | Only matching stores shown | `StoreLocatorPage`, `store.service` | Filter Stores — AC 2 | done |
| AC 3 — product availability filter | In-stock stores for selected product | `StoreFilterPanel` | Filter Stores — AC 3 | done |
| AC 4 — conjunctive combined filters | AND narrowing | `store.service` | Filter Stores — AC 4 | done |
| AC 5 — zero match + clear filters | Empty state + clear action | `StoreLocatorPage` | Filter Stores — AC 5 | done |

### Story: Set My Store Preference

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — save from detail or account | PATCH my store; persists cross-session | `StoreDetailPage`, `MyStorePreferencePage` | Set My Store Preference — AC 1 | done |
| AC 2 — replace previous immediately | New selection replaces old | `customer-account` API | Set My Store Preference — AC 2 | done |
| AC 3 — unset allows set; no tailoring when unset | Default behaviour when null | `MyStorePreferencePage` | Set My Store Preference — AC 3 | done |
| AC 4 — guest prompt without navigation | Modal on guest Set as My Store | `StoreDetailPage` | Set My Store Preference — AC 4 | done |

### Story: Tailor Experience to Preferred Store

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — product stock defaults to my store | Stock widget uses preferred store id | `ProductDetailContent` | Tailor Experience — AC 1 | done |
| AC 2 — locator highlights preferred store | Visual highlight on matching row | `StoreLocatorPage` | Tailor Experience — AC 2 | done |
| AC 3 — C&C checkout pre-select | Preferred store selected; list overrideable | checkout store step | Tailor Experience — AC 3 | done |
| AC 4 — no tailoring when unset | Increment defaults preserved | all touchpoints | Tailor Experience — AC 4 | done |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Filter controls labelled | done | Each filter dimension has visible label |
| Preferred store highlight | done | Text badge + icon, not colour-only |
| Guest modal | done | `role="dialog"`, focus trap, `returnTo` |
| Set as My Store button | done | Descriptive name; disabled state when already preferred |
| Axe passes | pending | Engineering pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Locator filter refresh | Immediate list update | done | Client-side filter |
| Preference PATCH | Optimistic UI acceptable | done | Rollback on failure |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Implemented StoreFilterPanel, Set as My Store, MyStorePreferencePage, tailoring touchpoints; 13 AC tests in tests/power-ups/stores/ |


---

## increment-9-sprint-3-inventory-interface-design

<!-- migrated from: increments/9-power-ups/specification/interface-design.md -->

# Interface design — Increment 9 Sprint 3 (Pet profiles and inventory power-ups)

> **Companion to** lo-fi `docs/increments/9-power-ups/exploration/ux/mockups.md` / companion `.drawio` (screens: *customer pet profiles*, *inventory dashboard*, *backorder product page*). Specification-stage spec; implementation and tests land in Engineering. Extends Increment 4 account area and Increment 1 staff stock editing — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 3 — Pet profiles and inventory power-ups (3 primary screens + cart touchpoint, 5 stories) |
| Ticket | `inc-9-sprint-3-inventory` |
| Lo-fi reference | `docs/increments/9-power-ups/exploration/ux/mockups.md` (§ Screen 4 · Screen 5 · Screen 6) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Create Customer Pet · View Inventory Dashboard · Display Low Stock Badge · Allow Backorder Purchase); Update Customer Pet from CRC/spec |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md` |
| Prior interface specs | `docs/increments/4-returning-customers/specification/interface-design.md` (account settings); `docs/increments/1-walk-in-driver/specification/interface-design.md` (product detail, staff stock form — replaced by dashboard) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/customer-account/` — `MyPetsPage.tsx`, `PetProfileForm.tsx`; `packages/inventory/` (new) — `InventoryDashboardPage.tsx`, inline stock edit, export CSV; `packages/product-catalog/client/` — backorder indicator on product detail + cart line label |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 3 adds *My Pets* under account settings for logged-in customers to create, edit, and delete *Customer Pet Profiles* (name, species, breed optional, age/DOB optional, photo optional) with guest auth gate. Staff receive an *Inventory Dashboard* replacing the Increment 1 bare-bones stock form — searchable/sortable product table with inline *Stock Level* edit, *Low Stock Alert* badges, *low stock only* filter, configurable threshold modal, CSV *Inventory Export*, and validation errors for invalid stock. Customers see *Backorder* on product pages when enabled for out-of-stock products, with backorder-labelled cart lines and normal checkout acceptance. Labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–8; pet profiles in customer-account; inventory dashboard new staff module.

- **Folder layout:** pet UI under `packages/customer-account/client/` and `app-client/pages/account/`; inventory under `packages/inventory/` per domain-first pattern; backorder UI extends product-catalog client
- **State management:** pet CRUD server-backed; dashboard polls or refreshes on inline edit; stock edits propagate to customer-facing availability in real time (Increment 1 invariant)
- **Styling:** account list + form pattern from Increment 4; dashboard full-width table with toolbar; backorder badge distinct from low-stock customer messaging
- **Token system:** `packages/shared/layout-tokens.ts`
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Accessibility check:** axe-core; inline edit fields labelled; low stock badge includes text
- **Performance budget:** dashboard handles full store catalog with pagination if needed; export is async download

---

## Account navigation extension

| Nav item | Route | Sprint |
| --- | --- | --- |
| My Pets | `/account/pets` | **new** |

---

## Staff navigation extension

| Nav item | Route | Sprint |
| --- | --- | --- |
| Inventory Dashboard | `/staff/inventory` | **new** (replaces Increment 1 stock form route — redirect legacy URL) |

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| customer pet profiles — list | form | `/account/pets` | Create Customer Pet · Update Customer Pet | **New** |
| customer pet profile — create/edit | form | `/account/pets/new`, `/account/pets/:petId/edit` | Create Customer Pet · Update Customer Pet | **New** |
| inventory dashboard | stack | `/staff/inventory` | View Inventory Dashboard · Display Low Stock Badge | **New** — replaces Inc 1 stock form |
| backorder product page | stack | `/product-catalog/:sku` | Allow Backorder Purchase | **Updated** — backorder state |
| cart with backorder label | stack | `/cart` | Allow Backorder Purchase | **Updated** — line item label |

---

## Screen spec (from lo-fi — regions verbatim)

### customer pet profiles — My Pets

**Layout:** form (list)  
**Route:** `/account/pets`  
**AC stories:** Create Customer Pet · Update Customer Pet

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| My Pets header | body | chrome | My Pets | Account area heading |
| Pet profiles list | body | list | pet name · species · breed · Edit · Delete | Multiple pets listed; Edit → edit form |
| Empty state | body | chrome | add your first pet · Add Pet (primary) | When no profiles |
| Guest login prompt | body (modal) | chrome + button-bar | log in or register · Log In · Register | Guest on create route; no navigation away |

**Pet profile form** (`/account/pets/new`, `/account/pets/:petId/edit`):

| Region | Controls | Interaction |
| --- | --- | --- |
| Pet profile form | name (required) · species (required) · breed (optional) · age or date of birth (optional) · photo upload (optional) | Save persists to customer account; species/breed feed recommendation algorithms |
| Delete confirmation | are you sure · Confirm Delete · Cancel | Update Customer Pet delete scenario |

---

### inventory dashboard

**Layout:** stack  
**Route:** `/staff/inventory`  
**AC stories:** View Inventory Dashboard · Display Low Stock Badge

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Dashboard header with export | body | toolbar | Inventory Dashboard · Export CSV | Export scoped to staff member's store |
| Search and filter bar | body | filter-bar | search products | Filters table rows |
| Sort and filter controls | body | toolbar | sort by name · stock level · category · low stock only | Low stock filter shows only below-threshold products |
| Product stock table | body | list | product name · category · stock level · last updated · low stock alert badge | Inline edit on stock level cell |
| Inline stock edit | body | form | stock level input · Save | Immediate persist; propagates to customer stock availability |
| Validation error state | body | alert | clear error — invalid stock level | Negative/non-numeric rejected; prior value unchanged |
| Low stock threshold config | body | form (modal) | threshold value · Save | Configurable per store/product policy |
| Out of stock indicator | body | chrome | Out of stock | When stock level zero — supersedes low stock badge (Display Low Stock Badge AC 5) |

---

### backorder product page

**Layout:** stack (extends product detail)  
**Route:** `/product-catalog/:sku`  
**AC stories:** Allow Backorder Purchase

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Stock status — backorder | body | chrome | Backorder | When out of stock AND backorder enabled |
| Add to Cart (Backorder) | body | button-bar | Add to Cart (primary) | Available when backorder enabled |
| Stock status — out of stock (no backorder) | body | chrome | Out of Stock | Add to Cart disabled — prior increment behaviour |
| Cart backorder label | body | list | backorder label on line item | Cart shows backorder status + ship-when-restocked message |

---

## AC → behaviour → test mapping

### Story: Create Customer Pet

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — list or empty state | My Pets shows profiles or empty state | `MyPetsPage` | Create Customer Pet — AC 1 | pending |
| AC 2 — form fields saved | Create with required/optional fields | `PetProfileForm` | Create Customer Pet — AC 2 | pending |
| AC 3 — multiple pets listed | Each profile separate row | `MyPetsPage` | Create Customer Pet — AC 3 | pending |
| AC 4 — species feeds recommendations | Server stores species/breed for downstream | `customer-account` API | Create Customer Pet — AC 4 | pending |
| AC 5 — guest login prompt | Modal without navigation | `PetProfileForm` | Create Customer Pet — AC 5 | pending |

### Story: Update Customer Pet

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — edit all fields immediate persist | PATCH on save | `PetProfileForm` | Update Customer Pet — AC 1 | pending |
| AC 2 — delete after confirmation | Remove from list | `MyPetsPage` | Update Customer Pet — AC 2 | pending |

### Story: View Inventory Dashboard

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — list with search sort filter | Full product table at store | `InventoryDashboardPage` | View Inventory Dashboard — AC 1 | pending |
| AC 2 — low stock badge + filter | Badge when below threshold; filter available | `InventoryDashboardPage` | View Inventory Dashboard — AC 2 | pending |
| AC 3 — inline edit same as Inc 1 | Immediate persist + customer availability | inline edit + `inventory.service` | View Inventory Dashboard — AC 3 | pending |
| AC 4 — replaces Inc 1 form; data intact | Route migration; no data loss | routing + migration note | View Inventory Dashboard — AC 4 | pending |
| AC 5 — CSV export store-scoped | Export button produces CSV | export action | View Inventory Dashboard — AC 5 | pending |
| AC 6 — invalid stock rejected | Error message; value unchanged | inline validation | View Inventory Dashboard — AC 6 | pending |

### Story: Display Low Stock Badge

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — badge below threshold above zero | Low stock text/quantity badge | dashboard row | Display Low Stock Badge — AC 1 | pending |
| AC 2 — no badge at/above threshold | Badge hidden | dashboard row | Display Low Stock Badge — AC 2 | pending |
| AC 3 — badge disappears after restock | Next view reflects new level | dashboard | Display Low Stock Badge — AC 3 | pending |
| AC 4 — low stock only filter | Subset of below-threshold products | filter control | Display Low Stock Badge — AC 4 | pending |
| AC 5 — zero stock out of stock not low stock | Out of stock supersedes low stock badge | dashboard row | Display Low Stock Badge — AC 5 | pending |

### Story: Allow Backorder Purchase

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — backorder indicator + add to cart | Backorder label; cart enabled | `ProductDetailContent` | Allow Backorder Purchase — AC 1 | pending |
| AC 2 — cart line backorder label | Line shows backorder + message | cart component | Allow Backorder Purchase — AC 2 | pending |
| AC 3 — checkout summary shows backorder | Order summary per line | checkout | Allow Backorder Purchase — AC 3 | pending |
| AC 4 — no backorder when disabled | Out of Stock; cart disabled | `ProductDetailContent` | Allow Backorder Purchase — AC 4 | pending |
| AC 5 — restock removes backorder | In Stock when level > 0 | `ProductDetailContent` | Allow Backorder Purchase — AC 5 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Pet form fields labelled | planned | Required fields marked; optional noted |
| Inline stock edit labelled | planned | `aria-label` on stock level input |
| Low stock badge text | planned | Not colour-only — includes "Low stock" or quantity |
| Validation errors | planned | `role="alert"` on invalid stock |
| Guest pet modal | planned | Same pattern as Sprint 2 store preference |
| Axe passes | pending | Engineering pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Dashboard table | Paginate if >100 SKUs | pending | Search reduces visible set |
| Inline edit propagation | Real-time availability update | pending | Server push or poll |
| CSV export | Async download | pending | No blocking UI |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | My Pets list/form, inventory dashboard, backorder actions; routes /account/pets, /staff/inventory; 8 tests in tests/power-ups/inventory/ |

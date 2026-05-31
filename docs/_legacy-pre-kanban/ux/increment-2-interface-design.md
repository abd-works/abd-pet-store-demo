# Interface design — Increment 2 (Click-and-collect)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-2-click-and-collect.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 1 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 2 — 8 screens, 11 stories |
| Lo-fi reference | `docs/ux/lo-fi/increment-2-click-and-collect.md` |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-2-acceptance-criteria.md` |
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

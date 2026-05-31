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

# Lo-fi — Increment 2: Click-and-collect

> **Companion to** `docs/ux/lo-fi/increment-2-click-and-collect.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 2 — Click-and-collect (8 screens, 11 stories) |
| Initial IA | `docs/ux/information-architecture.md` (Increment 1 base; Increment 2 checkout/staff screens derived from AC) |
| AC source | `docs/story/acceptance-criteria/increment-2-acceptance-criteria.md` |
| Domain terms | `docs/domain/ubiquitous-language.md` |
| State file | `docs/ux/lo-fi/increment-2-click-and-collect-state.json` |
| Wireframe | `docs/ux/lo-fi/increment-2-click-and-collect.drawio` |
| Last updated | 2026-05-24 |

## Description

Lo-fi wireframes for the guest *click-and-collect* purchase path: extend Increment 1 *product page* with *add to cart*, session-scoped *shopping cart*, checkout (*pickup store* selection, *guest checkout* / *billing address*, *StripeWave* *payment*), *order confirmation page*, and staff *click-and-collect queue* / *pickup fulfillment*. No customer accounts, shipping address UI, PayNova, or VaultPay.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1 patterns (`docs/ux/lo-fi/increment-1-walk-in-driver.md`), `information-architecture.md`, and standard e-commerce checkout conventions.

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
node "c:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/ux/lo-fi/increment-2-click-and-collect-state.json" --out "docs/ux/lo-fi/increment-2-click-and-collect.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Eight Increment 2 screens (customer checkout + staff fulfillment); state JSON + drawio generated. |

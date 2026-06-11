# UX specification — Increment 2 (Click-and-collect)

> **Clickable hi-fi prototype** — not production code. Open `prototype/index.html` in a browser.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 2 — 8 screens, 11 stories (guest click-and-collect) |
| Lo-fi / hi-fi reference | `docs/increments/2-click-and-collect/exploration/ux/mockups.drawio` |
| Specification by example | `docs/increments/2-click-and-collect/specification/specification-by-example.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Prototype entry | `docs/increments/2-click-and-collect/specification/prototype/index.html` |
| Spec preview (iframe) | `docs/increments/2-click-and-collect/specification/ux-specification.html` |
| Last updated | 2026-06-09 |

## Description

Guest *click-and-collect* purchase path as a browser-runnable prototype: *product page* with *add to cart*, session-scoped *shopping cart*, checkout wizard (*pickup store*, *guest checkout* / *billing address*, *StripeWave* *payment*), *order confirmation page*, and staff *click-and-collect queue* / order detail. Labels use ubiquitous-language terms verbatim from the mockups and specification-by-example. No customer accounts, shipping address, PayNova, VaultPay, or cross-session cart persistence.

---

## Design carry-over (from mockups.drawio)

| Token / pattern | Prototype value |
| --- | --- |
| Primary action | `#6c8ebf` fill, `#dae8fc` background |
| Chrome band | `#f0f0f0` header, `#e8e8e8` tab bar |
| Body / cards | `#ffffff` surface, `#999999` borders |
| Typography | System UI stack; region titles bold 11–13px equivalent |
| Layout | Stack (product, confirmation); split-screen (checkout steps); sidebar table (cart, staff queue) |

### Screens and regions

| Screen | Key regions (mockup labels) |
| --- | --- |
| product page — add to cart | header · primary navigation · breadcrumb · product header · image gallery · description · stock availability by store · purchase actions |
| shopping cart | checkout progress tabs · cart summary · cart item list · cart validation feedback |
| click-and-collect store selection | delivery option · location entry · pickup store list · checkout summary |
| guest checkout — billing address | guest checkout form · billing address form · checkout summary |
| payment — StripeWave | StripeWave card form · order review · payment decline / unavailable states |
| order confirmation page | order summary · pickup store details · account creation prompt |
| click-and-collect queue | click-and-collect queue table · staff header |
| click-and-collect order detail | order line items · stock warning · pickup fulfillment actions |

**Primary navigation (customer):** `find stores` · `shop supplies` · *shopping cart* (visible item count indicator).

**Checkout progress tabs:** *shopping cart* → *pickup store* → *billing address* → *payment*.

---

## Stub catalogue

| Behaviour | Stub implementation |
| --- | --- |
| Product catalog / stock | Inline `FIXTURES.products`; stock counts from spec tables |
| Add to cart / cart mutations | `sessionStorage` key `pawplace-cart-v2`; recalculates line price and cart subtotal client-side |
| Session-scoped cart | `sessionStorage` only — new tab without storage = empty cart (Scenario 4 demo via *Reset session* in demo panel) |
| Store locator / distance | `FIXTURES.stores`; distance sorted when postcode `NW1` entered, else prompt *Enter a postcode or share location for distance-sorted results* |
| Click-and-collect | Sole delivery option — radio fixed selected; no shipping address fields |
| Guest checkout | No login/register before purchase; guest fields validated with regex |
| Billing address | Client required-field checks; not persisted after order (console toast) |
| StripeWave payment | No real API — `setTimeout` 1.2s; card `4000 0000 0000 0002` = decline, demo panel *Payment unavailable* flag = service error |
| Order placement | Generates `ORD-2001`-style number; `console.log` confirmation email payload |
| Confirmation email | Toast *Confirmation Email queued* — no SMTP |
| Staff queue | Pre-seeded orders `ORD-2001`, `ORD-2002`; status transitions in `sessionStorage` `pawplace-staff-queue` |
| Pickup fulfillment | Buttons toggle order status *confirmed* → *ready for pickup* → *collected* |
| Inventory deduction | Not simulated |

All stubs marked `// PROTOTYPE: stub` in `prototype/click-and-collect.js`.

---

## Intentionally not implemented

- Production React/Express modules under `packages/`
- Automated tests per AC clause
- Real StripeWave / webhook reconciliation
- Email delivery, notification queue persistence
- Cross-session cart (cookies/API)
- Customer account registration flow (prompt is dismissible UI only)
- PayNova, VaultPay, saved payment methods
- Shipping address and non-click-and-collect delivery options
- Lint/type-check gates for prototype assets

---

## AC → demonstrated behaviour map

### Add Product to Cart

| Scenario | Demo path |
| --- | --- |
| Product added — quantity and badge | Product page → *add to cart* on Premium Dog Harness → badge updates → shopping cart shows line |
| Out-of-stock disabled | Demo panel → *Out of stock product* → open Exotic Fish Filter → *add to cart* disabled, label *Out of stock — check back soon* |
| Multiple line items | Add harness + treats → cart shows 2 lines, cart subtotal £39.98, badge 2 |
| Session-scoped cart | Demo panel → *Reset session* → cart empty in new logical session |

### Update Cart Quantity

| Scenario | Demo path |
| --- | --- |
| Quantity recalculates | Cart → change harness qty to 3 → line price £104.97, subtotal updates |
| Quantity zero removes | Set treats qty to 0 → line removed |
| Invalid quantity | Enter -1 → *Quantity must be zero or more* on line |
| Exceeds stock | Enter 25 on harness → *Only 22 available* |

### Remove Product from Cart

| Scenario | Demo path |
| --- | --- |
| Item removed | *remove cart item* on harness → subtotal £9.98, badge 2 |
| Empty cart | Remove last item → *Your cart is empty*, *Continue shopping*, no checkout |

### Select Click-and-Collect Store

| Scenario | Demo path |
| --- | --- |
| Sole delivery option | Pickup store step shows ○ *click-and-collect (sole delivery option)* only |
| Store recorded | Select PawPlace Camden → summary *Collecting from PawPlace Camden*, no shipping address |
| Distance unknown | Clear postcode → list shows 2 stores + prompt *Enter a postcode or share location for distance-sorted results* |
| Summary shows store | Continue → billing summary shows Camden name and address |

### Check Out as Guest

| Scenario | Demo path |
| --- | --- |
| Guest default | Billing step — no login; collects Guest Email, first/last name |
| Valid guest completes | sarah.jones@example.com → place order path |
| Invalid email | `not-an-email` → *Please enter a valid email address* |
| Account prompt after order | Confirmation shows dismissible *Create an account for order history, saved addresses, and reorder* |

### Enter Billing Address

| Scenario | Demo path |
| --- | --- |
| Full form | All fields present; required markers on address line 1, city, postcode, country |
| Valid advances | 10 Elm Avenue… → continue to payment |
| Missing required | Submit empty → *Address line 1 is required*, *Postcode is required* |

### Select Payment Method

| Scenario | Demo path |
| --- | --- |
| StripeWave only | Payment shows *StripeWave (Credit/Debit Card)* only |
| Valid card | 4242… 12/27 CVV 123 → review → pay |
| Expired card | Expiry 01/22 → *Card expiry date is in the past* |
| Missing CVV | Empty CVV → *CVV is required* |

### Process Card Payment via StripeWave

| Scenario | Demo path |
| --- | --- |
| Success | Pay → processing indicator → confirmation ORD-2001 confirmed |
| Declined | Card 4000 0000 0000 0002 → *Your card was declined — please check your details or try another card* + *Try another card* |
| Service unavailable | Demo panel → *Payment service unavailable* → pay → retry message |

### Confirm Order and Send Confirmation Email

| Scenario | Demo path |
| --- | --- |
| Confirmation page | Shows order number, line items, order total, Pickup Store details |
| Email stub | Toast logs email to sarah.jones@example.com with subject *Your PawPlace Order … is confirmed* |

### Prepare Click-and-Collect Orders for Pickup (staff)

| Scenario | Demo path |
| --- | --- |
| Queue sorted | Staff queue → ORD-2001 before ORD-2002, guest email column |
| Mark prepared | Order detail → *mark prepared* → status *ready for pickup* |
| Stock warning | ORD-2002 detail → *Out of stock at this store* on Exotic Fish Filter + tom.brown@example.com |

### Fulfill Click-and-Collect Order (staff)

| Scenario | Demo path |
| --- | --- |
| Collected | Ready order → *confirm handoff* → *collected* |
| Outreach prompt | Demo panel → *Collection window elapsed* on ready order → *Contact customer — collection window elapsed* |
| All fulfilled | Mark last order collected → *All orders fulfilled* / *No pending orders — check back later* |

### Gaps (system-only / not visually demoed)

| AC | Note |
| --- | --- |
| Webhook reconciliation after timeout | Described in stub catalogue only — no separate UI |
| Email queued when delivery down | Use demo toast; no persistent queued state |
| Session cart browser close | Documented; manual *Reset session* stands in for browser end |

---

## Region → element map (customer — product page)

| Region | Elements |
| --- | --- |
| primary navigation | `find stores`, `shop supplies`, `shopping cart (n)` |
| product header | product name, category |
| image gallery | product image thumbnails, previous image, next image |
| description | description, weight, dimensions |
| stock availability by store | store name, stock availability, distance, select store link |
| purchase actions | add to cart (or unavailability message) |

---

## How to run

```text
Open: docs/increments/2-click-and-collect/specification/prototype/index.html
Optional: serve folder with python -m http.server (not required — no fetch to external APIs)
Use the Demo states panel (bottom-right) for edge scenarios.
```

# Slot 75 — Finished

**Timestamp:** 2026-05-24T30:00:00Z
**Stage:** specification
**Role:** business-expert
**Run scope:** Increment 3 — Ship to home
**Practice skill:** abd-class-responsibility-collaborator

## Artifacts produced

| Artifact | Path | Scanner result |
|----------|------|----------------|
| CRC model (Increment 3 refresh) | docs/domain/crc.md | deferred to reviewer |
| Domain vocabulary | docs/domain/domain.json | deferred to reviewer |

## Changes summary

- Updated front matter to `increment_scope: Increment 3 — Ship to home`, `specification_refresh: Run 4 slot 75`
- **Guest Checkout / Billing Address / Shipping Address** — shipping address collection when *standard delivery* selected; billing pre-fill and per-field override rules; address snapshots on *order* only; no guest persistence beyond transaction
- **Order / Delivery Option / Standard Delivery** — dual fulfillment paths (*standard delivery* + *click-and-collect*); ship-to-home lifecycle (confirmed → fulfilled → shipped → delivered); shipping cost on order total; guest lookup invariant (order number + guest email)
- **Tracking Number** — carrier reference entered at *ship-to-home fulfillment*; recommended not blocking; triggers *shipping notification* and fulfilled → shipped transition
- **Ship-to-Home Fulfillment** — store-side packing/dispatch parallel to *pickup fulfillment*; *order queue* integration on *admin dashboard*
- **Click-and-Collect** — no longer sole *delivery option*; remains valid alongside *standard delivery*
- **Notification / Confirmation Email / Shipping Notification** — confirmation email includes shipping address for ship-to-home orders and order status page link; shipping notification fires on tracking number entry with retry-without-blocking
- **Admin Dashboard** — *order queue* unified view across delivery types
- **domain.json** — attributes refreshed for Increment 3 concepts; presentation surfaces omitted from CRC blocks per Increment 2 precedent

## Scanner summary

- Skills validated: abd-class-responsibility-collaborator (executor self-review only)
- All scanners: deferred to reviewer slot 76
- `scanner_validation: deferred to reviewer slot`

## Executor self-review (author sanity pass)

| Check | Result |
| --- | --- |
| Increment 3 concepts refreshed (shipping address, standard delivery, ship-to-home fulfillment, tracking number, order status, shipping notification, order queue) | pass |
| UL slot 69 behavior bullets backed by responsibilities | pass |
| AC increment-3 alignment (Enter Shipping Address, Select Delivery Option, View and Process Incoming Orders, Send Shipping Notification, Track Order Status) | pass |
| Guest checkout only — no customer account persistence | pass |
| StripeWave-only payment unchanged — PayNova/VaultPay deferred | pass |
| Standard delivery + click-and-collect — express/same-day deferred | pass |
| Presentation surfaces omitted (order status page, order queue, order confirmation page) | pass |
| Full-model sections retained for deferred increments | pass |
| domain.json aligned with refreshed CRC noun-phrase attributes | pass |

## Stage outcomes

- Role playbook check: met — Business Expert CRC before spec-by-example
- Story graph updated: not applicable (CRC refresh only)

## Sync-upstream offers

None — CRC is downstream of UL refresh (slot 69) and AC (slot 71). Spec-by-example (next executor slot) may consume refreshed CRC + domain.json.

## For delivery lead

- **Next:** chain reviewer slot 76 — CRC scanners + specification entry-gate for Increment 3
- Exit gate items to verify: `content/stages/specification.md` — CRC blocks for all Increment 3 UL concepts; domain.json parity
- Open questions: none

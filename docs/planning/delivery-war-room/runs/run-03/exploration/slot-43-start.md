# Slot 43 — Start (Run 3 Exploration — UL executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "42"
run_scope: Increment 2 — Click-and-collect (cart, checkout, payment, order fulfillment)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
corrections: docs/corrections-log.md — filter by Affects exploration + business-expert + Increment 2
checkpoint: none
entry_conditions_met:
  - slot-42-finished.md PASS — Run 2 Engineering complete (Increment 1 walk-in driver)
  - docs/domain/ubiquitous-language.md present (Increment 1 scope)
  - docs/story/thin-slicing.md — Increment 2 authoritative
  - docs/story/story-graph.json valid
  - docs/ux/information-architecture.md present
  - docs/architecture/architecture-blueprint.md present
```

## Handoff from Run 2 (Increment 1 complete)

**Artifacts on disk:**

| Area | Paths |
|---|---|
| Domain | `docs/domain/ubiquitous-language.md`, `crc.md`, `object-model.md`, `domain.json` |
| Story | `docs/story/story-graph.json`, increment 1 AC + specs |
| UX | `docs/ux/information-architecture.md`, increment 1 lo-fi + interface design |
| Architecture | `docs/architecture/architecture-reference.md`, blueprint, SLOs |
| Code | `packages/`, `tests/` — Increment 1 walk-in only (no cart/checkout/payment) |

**Decisions / carry-forward:**

- Scanner infra waivers documented (JsCodeScanner import, MERN `--language typescript`, conf/ layout)
- Customer stock API: labels only on walk-in surface; admin retains ATS
- Increment 1 scope guard: no cart, checkout, accounts in production until Increment 2

## Increment 2 stories (thin-slicing.md)

1. Add Product to Cart
2. Update Cart Quantity
3. Remove Product from Cart
4. Select Click-and-Collect Store
5. Check Out as Guest
6. Enter Billing Address
7. Select Payment Method (StripeWave only)
8. Process Card Payment via StripeWave
9. Confirm Order and Send Confirmation Email
10. Prepare Click-and-Collect Orders for Pickup (store employee)
11. Fulfill Click-and-Collect Order (store employee)

## Scope

Refresh UL for **new concepts**: *shopping cart*, *guest checkout*, *order*, *payment* (StripeWave), *click-and-collect*, *confirmation email*, *pickup fulfillment*. Extend `increment_scope` in UL artifact; render/update domain diagram via drawio-domain-sync.

**DO NOT** introduce account/login terms beyond "guest checkout" — accounts are Increment 4.

Write `slot-43-finished.md` with artifact paths.

## Operator policy

Autonomous continuation — no mid-slot CHECKPOINT unless scope creep (accounts, multi-vendor payment, shipping) appears in Increment 2 UL.

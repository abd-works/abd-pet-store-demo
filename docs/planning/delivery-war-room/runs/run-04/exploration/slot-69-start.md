# Slot 69 — Start (Run 4 Exploration — UL executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "68"
run_scope: Increment 3 — Ship to home (shipping address, delivery option, order status, tracking)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
corrections: docs/corrections-log.md — filter by Affects exploration + business-expert + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-68-finished.md PASS — Run 3 Engineering complete (Increment 2 click-and-collect)
  - docs/domain/ubiquitous-language.md present (Increments 1–2 scope)
  - docs/story/thin-slicing.md — Increment 3 authoritative
  - docs/story/story-graph.json valid
  - docs/ux/information-architecture.md present
  - docs/architecture/architecture-blueprint.md present
```

## Handoff from Run 3 (Increment 2 complete)

**Artifacts on disk:**

| Area | Paths |
|---|---|
| Domain | `docs/domain/ubiquitous-language.md`, `crc.md`, `object-model.md`, `domain.json` |
| Story | `docs/story/story-graph.json`, increment 1–2 AC + specs |
| UX | `docs/ux/information-architecture.md`, increment 2 lo-fi + interface design |
| Architecture | `docs/architecture/increment-2-architecture-reference.md`, blueprint, SLOs |
| Code | `packages/cart/`, `packages/order/`, `packages/payment/`, `tests/click-and-collect/` — 110/110 green |

**Decisions / carry-forward:**

- Guest checkout + StripeWave + click-and-collect only in Increment 2 — no shipping yet
- Scanner increment-wide debt documented (slot 68) — MERN conf/ layout waivers apply
- Increment 2 scope guard: no accounts until Increment 4

## Increment 3 stories (thin-slicing.md)

1. Enter Shipping Address
2. Select Delivery Option
3. View and Process Incoming Orders
4. Send Shipping Notification with Tracking Number
5. Track Order Status

## Scope

Refresh UL for **new concepts**: *shipping address*, *delivery option*, *ship-to-home fulfillment*, *tracking number*, *order status*, *shipping notification*. Extend `increment_scope` in UL artifact; render/update domain diagram via drawio-domain-sync.

**DO NOT** introduce customer account/login terms — accounts are Increment 4. Ship-to-home extends checkout; click-and-collect path remains valid.

Write `slot-69-finished.md` with artifact paths.

## Operator policy

Autonomous continuation — no mid-slot CHECKPOINT unless scope creep (accounts, multi-vendor payment beyond StripeWave) appears in Increment 3 UL.

# Slot 47 — Start (Run 3 Exploration — UX mockup executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "46"
run_scope: Increment 2 — Click-and-collect (11 stories — lo-fi wireframes)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by Affects exploration + ux-designer + Increment 2
checkpoint: none
entry_conditions_met:
  - slot-46-finished.md PASS — Increment 2 AC refresh reviewed
  - docs/story/acceptance-criteria/increment-2-acceptance-criteria.md aligned to UL
  - docs/ux/information-architecture.md present
  - docs/story/story-graph.json present
```

## Handoff from slot 46 (AC reviewer)

**PASS** — Increment 2 AC in markdown and graph use UL terms (*guest checkout*, *pickup store*, StripeWave-only, *confirmation email*). Wireframes should exercise AC flows for cart, checkout, store selection, order confirmation, staff pick-prep.

## Increment 2 screens (from IA + AC)

- Shopping cart (session-scoped guest)
- Click-and-collect store selection
- Guest checkout — billing address entry
- Payment method selection (StripeWave only)
- Order confirmation page
- Staff: click-and-collect queue / prepare for pickup / fulfill order

## Scope guard

- No account/login UI beyond guest email capture
- No shipping address UI
- No PayNova/VaultPay payment options in lo-fi
- Extend prior Increment 1 lo-fi patterns under `docs/ux/lo-fi/`

## Deliverables

- `docs/ux/lo-fi/increment-2-click-and-collect.md`
- `docs/ux/lo-fi/increment-2-click-and-collect.drawio`
- `docs/ux/lo-fi/increment-2-click-and-collect-state.json` (if skill requires)

Write `slot-47-finished.md` with artifact paths. Defer scanners to reviewer slot 48.

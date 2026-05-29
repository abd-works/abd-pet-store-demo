# Slot 11 — Start

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "10"
run_scope: increment-1 — Walk-in driver (6 stories: View Store Map, View Store List, Calculate Distance to Store, View Product Details, Display Real-Time Stock Availability, Update Product Stock Levels)
skills:
  - abd-information-architecture
corrections: docs/corrections-log.md — filter by Affects discovery + ux-designer + abd-information-architecture
checkpoint: none
entry_conditions_met:
  - slot-10-finished.md on disk — story-mapping rework pair PASS
  - docs/story/story-graph.json present and valid
  - docs/story/thin-slicing.md present — Increment 1 scope authoritative
  - docs/domain/ubiquitous-language.md present — canonical domain terms for content types
early_questions:
  - scope-unclear: Cannot name Increment 1 screens without cart/checkout/account surfaces — STOP and write blocked.md
  - artifact-missing: story-graph or thin-slicing absent — STOP and write blocked.md
```

## Context

- **Prior pair complete:** abd-story-mapping (slots 07–10 including rework) — PASS with brownfield scanner waivers
- **Upstream artifacts:**
  - `docs/story/thin-slicing.md` — Increment 1 = walk-in driver; no cart, checkout, payment, accounts
  - `docs/story/story-graph.json` — authoritative graph; 6 Increment 1 stories listed above
  - `docs/story/story-map.md` — full map for story name references
  - `docs/domain/ubiquitous-language.md` — store, product catalog, stock availability, store employee concepts
  - `docs/domain/domain-terms.md`, `docs/domain/domain.json` — KA groupings
- **Decisions from prior slots:**
  - Increment 1 is payment-free, account-free — IA must NOT introduce cart, checkout, login, or payment screens
  - Store employee story `Update Product Stock Levels` needs a staff/admin surface (bare-bones stock form per thin-slicing)
  - Customer-facing: store discovery (map/list/distance), product browse/detail, stock-at-store display
  - Use UX terms on IA output; domain concept names only as labels with links to UL — no AC on IA artifact
- **Scope boundary:** Increment 1 only — do not map Increment 2+ screens (cart, checkout, accounts, pets gallery, etc.)

## Filtered corrections

No IA-specific corrections in log yet. Honor cross-cutting discovery norms:

- **Brownfield waivers:** pre-existing story-map scanner waivers do not relax IA scope — still Increment 1 only
- **Pet profile vs customer pet:** UL distinguishes Pet KA (store animal) from Customer Account pet — not in Increment 1 IA scope

## Deliverable

Produce per `abd-information-architecture` skill (**Increment 1 scope**):

| Artifact | Path |
|----------|------|
| Information architecture spec | `docs/ux/information-architecture.md` |
| IA diagram | `docs/ux/information-architecture.drawio` via skill CLI (`drawio-ux.mjs`) |

Expected coverage:
- **Customer:** home/landing → store map → store list → product catalog/browse → product detail (with stock-at-store) → distance/postcode entry
- **Store employee:** stock update form (admin/staff surface for manual stock levels)
- Site map with directed transitions; per-screen layout templates; navigational components; content types and key actions mapped to Increment 1 story names

## For team member

Follow `_shared/executor-workflow.md (via role agent)` Steps 1–8. Scanners deferred to reviewer slot 12. No story-graph update required.

## Operator policy

Autonomous run — no mid-slot CHECKPOINT. Delivery lead chains reviewer slot 12 on finish.

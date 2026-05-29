# Slot 21 — Start (Run 2 Exploration — UX mockup executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "20"
run_scope: Increment 1 — Walk-in driver (6 stories — lo-fi wireframes)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by Affects exploration + ux-designer + Increment 1
checkpoint: after Exploration stage complete (Run 2 gate)
entry_conditions_met:
  - slot-20-finished.md PASS — Increment 1 AC refresh reviewed
  - docs/story/acceptance-criteria/increment-1-acceptance-criteria.md aligned to UL
  - docs/ux/information-architecture.md present
  - docs/story/story-graph.json present
```

## Handoff from slot 20 (AC reviewer)

**PASS** — Increment 1 AC in markdown and graph use lowercase UL terms. Wireframes should exercise AC flows: store locator (map/list/distance), product catalog browse, product page with per-store stock availability, admin dashboard stock form.

## Increment 1 screens (from IA)

- Store locator (map + list)
- Store detail
- Product catalog / category browse
- Product page (stock by store)
- Admin dashboard — stock level form (store employee)

## Filtered corrections

- Brownfield scanner waivers carry forward — do not expand scope to cart, checkout, accounts, or payment UI.

## Operator policy

Autonomous continuation — no mid-slot CHECKPOINT unless new screens outside Increment 1 IA appear.

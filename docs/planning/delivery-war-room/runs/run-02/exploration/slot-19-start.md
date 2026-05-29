# Slot 19 — Start (Run 2 Exploration — AC executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "18"
run_scope: Increment 1 — Walk-in driver (6 stories — AC refresh in story-graph + markdown)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
corrections: docs/corrections-log.md — filter by Affects exploration + product-owner + Increment 1
checkpoint: after Exploration stage complete (Run 2 gate — slot 10 per plan numbering; war room slot TBD)
entry_conditions_met:
  - slot-18-finished.md PASS — abd-ubiquitous-language Increment 1 refresh reviewed
  - docs/domain/ubiquitous-language.md increment_scope present
  - docs/ux/information-architecture.md present
  - docs/story/acceptance-criteria/increment-1-acceptance-criteria.md exists (refresh baseline)
  - docs/story/story-graph.json present
```

## Handoff from slot 18 (UL reviewer)

**PASS** — Increment 1 UL refresh accepted. Non-blocking: align AC markdown and `story-graph.json` AC arrays to lowercase UL canonical terms (`*store locator*`, `*map view*`, `*stock level*`, `*product page*`, etc.).

## Increment 1 stories (thin-slicing.md)

1. View Store Map
2. View Store List
3. Calculate Distance to Store
4. View Product Details
5. Display Real-Time Stock Availability
6. Update Product Stock Levels (store employee)

## Filtered corrections

### Ref traceability format (cross-cutting)

- **DO / DO NOT:** DO use full Ref block structure when citing sources in domain artifacts. AC Evidence lines may cite requirements paths — keep consistent with exploration templates.

### Brownfield small-and-testable scanner waivers (discovery — carry forward)

- **DO / DO NOT:** DO treat pre-existing brownfield CRUD/view stories as accepted waivers unless map restructure is in scope.

## Operator policy

Autonomous continuation — no mid-slot CHECKPOINT unless scope creep (cart, checkout, payment, accounts) appears in Increment 1 AC.

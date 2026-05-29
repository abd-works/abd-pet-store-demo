# Slot 95 — Start (Run 5 Exploration — Increment 4 AC executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "94"
run_scope: Increment 4 — Returning customers (15 stories)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
corrections: docs/corrections-log.md — filter exploration + product-owner + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-94-finished.md PASS
  - docs/domain/ubiquitous-language.md Increment 4 refresh
  - docs/story/story-graph.json valid
```

## Increment 4 stories (15)

Register Account through Reorder Previous Purchase — see `story/thin-slicing.md` § Increment 4.

Produce Increment 4 AC in story-graph + `docs/story/acceptance-criteria/increment-4-acceptance-criteria.md`. Render exploration diagrams via drawio-story-sync. Align terms to refreshed UL (customer account, session, saved address, saved payment method, wishlist, verification, order history, reorder).

**Preserve** guest checkout and Increment 1–3 paths. Account features are additive.

Write `slot-95-finished.md`.

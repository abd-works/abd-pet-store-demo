# Slot 71 — Start (Run 4 Exploration — AC executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "70"
run_scope: Increment 3 — Ship to home (5 stories)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
corrections: docs/corrections-log.md — filter exploration + product-owner + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-70-finished.md PASS
  - docs/domain/ubiquitous-language.md Increment 3 refresh
  - docs/story/story-graph.json valid
```

## Increment 3 stories

1. Enter Shipping Address
2. Select Delivery Option (standard only)
3. View and Process Incoming Orders
4. Send Shipping Notification with Tracking Number
5. Track Order Status

Produce Increment 3 AC in story-graph + `docs/story/acceptance-criteria/increment-3-acceptance-criteria.md`. Render exploration diagrams via drawio-story-sync. Align terms to refreshed UL (shipping address, standard delivery, tracking number, order status, shipping notification).

**DO NOT** add account/login AC. Guest checkout + click-and-collect paths remain.

Write `slot-71-finished.md`.

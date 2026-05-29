# Slot 99 — Start (Run 5 Exploration — Increment 4 architecture template executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "98"
run_scope: Increment 4 — Returning customers
skills:
  - abd-architecture-template
corrections: docs/corrections-log.md — filter exploration + engineer + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-98-finished.md PASS
  - docs/story/acceptance-criteria/increment-4-acceptance-criteria.md
  - docs/ux/lo-fi/increment-4-returning-customers.md
```

Add Increment 4 mechanisms to `docs/architecture/architecture-reference.md`: auth, session, profile, wishlist, saved entities. **Preserve** all prior increment mechanisms (Click-and-Collect, Ship-to-Home, etc.).

Write `slot-99-finished.md`.

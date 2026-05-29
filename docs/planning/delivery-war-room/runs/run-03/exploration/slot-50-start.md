# Slot 50 — Start (Run 3 Exploration — architecture template reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "49"
run_scope: Increment 2 — cart, order, payment, email, inventory reservation
skills:
  - abd-architecture-template
prior_executor_slot: 49
artifact_paths:
  - docs/planning/delivery-war-room/slot-49-finished.md
  - docs/architecture/architecture-reference.md
practice_skill_under_review: abd-architecture-template
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-49-finished.md exists
```

Run scanners per abd-architecture-template. Validate Increment 2 mechanisms present; guest checkout scope; no account/shipping creep. Write slot-50-finished.md.

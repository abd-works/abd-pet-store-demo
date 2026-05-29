# Slot 52 — Start (Run 3 Specification — CRC reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "51"
run_scope: Increment 2 — cart, order, payment, fulfillment
skills:
  - abd-class-responsibility-collaborator
prior_executor_slot: 51
artifact_paths:
  - docs/planning/delivery-war-room/slot-51-finished.md
  - docs/domain/crc.md
  - docs/domain/domain.json
practice_skill_under_review: abd-class-responsibility-collaborator
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-51-finished.md exists
```

Run abd-class-responsibility-collaborator scanners. Validate Increment 2 CRC contexts; guest checkout scope. Write slot-52-finished.md.

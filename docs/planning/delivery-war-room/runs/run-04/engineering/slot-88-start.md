# Slot 88 — Start (Run 4 Engineering — object model reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "87"
skills:
  - abd-object-model
prior_executor_slot: 87
artifact_paths:
  - docs/planning/delivery-war-room/slot-87-finished.md
  - docs/domain/object-model.md
  - packages/order/shared/
practice_skill_under_review: abd-object-model
checkpoint: none
```

Review slot 87 Increment 3 object model. Run abd-object-model scanners. npm test 110/110 from conf/. Validate vs CRC/UL. Scope guard: guest checkout only.

Write `slot-88-finished.md`.

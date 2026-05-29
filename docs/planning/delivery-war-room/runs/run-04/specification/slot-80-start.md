# Slot 80 — Start (Run 4 Specification — walkthrough reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "79"
skills:
  - abd-scenario-walkthrough
prior_executor_slot: 79
artifact_paths:
  - docs/planning/delivery-war-room/slot-79-finished.md
  - docs/domain/increment-3-walkthrough.md
practice_skill_under_review: abd-scenario-walkthrough
checkpoint: none
```

Review slot 79 Increment 3 walkthrough vs CRC and spec-by-example. Run abd-scenario-walkthrough scanners if present. Scope guard: guest checkout only.

Write `slot-80-finished.md`.

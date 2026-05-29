# Slot 106 — Start (Run 5 Specification — Increment 4 walkthrough reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "105"
skills:
  - abd-scenario-walkthrough
prior_executor_slot: 105
artifact_paths:
  - docs/planning/delivery-war-room/slot-105-finished.md
  - docs/domain/increment-4-walkthrough.md
  - docs/domain/crc.md
  - docs/story/specification-by-example/increment-4-specification-by-example.md
practice_skill_under_review: abd-scenario-walkthrough
checkpoint: none
```

Review slot 105 Increment 4 walkthrough vs CRC and spec-by-example. Run abd-scenario-walkthrough scanners if present. Scope guards: guest checkout coexists, email verification gates account-only features, StripeWave sole vendor, deferred scope omitted.

Write `slot-106-finished.md`.

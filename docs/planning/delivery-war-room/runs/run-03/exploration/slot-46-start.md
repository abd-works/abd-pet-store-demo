# Slot 46 — Start (Run 3 Exploration — AC reviewer)

```yaml
team-role: product-owner
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "45"
run_scope: Increment 2 — Click-and-collect
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
prior_executor_slot: 45
artifact_paths:
  - docs/planning/delivery-war-room/slot-45-finished.md
  - docs/story/acceptance-criteria/increment-2-acceptance-criteria.md
  - docs/story/story-graph.json
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-45-finished.md exists
```

## Handoff

Review slot 45 Increment 2 AC refresh. Run scanners with `--language` if applicable. Validate exploration.md skill 2 exit items: all 11 Increment 2 stories have AC; terms align to UL; no account/shipping scope creep.

Write `slot-46-finished.md`.

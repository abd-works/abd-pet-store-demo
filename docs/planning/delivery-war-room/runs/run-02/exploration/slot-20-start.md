# Slot 20 — Start (Run 2 Exploration — AC reviewer)

```yaml
team-role: product-owner
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "19"
run_scope: Increment 1 — Walk-in driver (6 stories)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
prior_executor_slot: 19
artifact_paths:
  - docs/story/acceptance-criteria/increment-1-acceptance-criteria.md
  - docs/story/story-graph.json
practice_skill_under_review: abd-acceptance-criteria
corrections: docs/corrections-log.md — filter exploration + acceptance-criteria + Increment 1
entry_conditions_met:   - slot-19-finished.md exists
```

## Review scope

Validate executor slot 19 artifacts against `abd-acceptance-criteria` rules and exploration-stage exit-gate items scoped to AC refresh (UL term alignment, behavioral AC, graph integrity for six Increment 1 stories).

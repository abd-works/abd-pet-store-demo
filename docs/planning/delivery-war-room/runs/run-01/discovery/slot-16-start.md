# Slot 16 — Start

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "15"
run_scope: review abd-service-level-objectives artifacts from slot 15 only
skills:
  - abd-service-level-objectives
prior_executor_slot: 15
artifact_paths:   - docs/architecture/service-level-objectives.md
corrections: docs/corrections-log.md — filter by Affects discovery + engineer + abd-service-level-objectives
checkpoint: none
entry_conditions_met:
  - slot-15-finished.md on disk
  - docs/architecture/service-level-objectives.md present
```

## Review scope

1. Run scanners: abd-service-level-objectives via execute-skill-using-skills-rules
2. Validate discovery exit-gate items scoped to SLO only
3. Ripple: SLO scopes vs story-map parent epics; criticality vs thin-slicing Increment 1; SLA looser than SLO
4. Write slot-16-finished.md — PASS/FAIL

## Operator policy

Autonomous — delivery lead runs discovery stage exit gate after PASS.

# Slot NN — Start

```yaml
team-role: product-owner | business-expert | ux-designer | engineer | reviewer
workspace: <absolute path to engagement root>
stage: shaping | discovery | exploration | specification | engineering
run_scope: <exact story ids or slice id — never qualitative>
skills:
  - <practice-skill-name>   # executor: one primary skill per pair; reviewer: omit or leave empty
prior_executor_slot: <NN>   # reviewer only — executor slot being reviewed
artifact_paths:             # reviewer only — from executor finished file
  - <workspace-relative path>
corrections: docs/corrections-log.md — filter by Affects for this stage and scope
checkpoint: after_slot | mid_slot | none
entry_conditions_met:
  - <verified precondition from stages/<stage>.md>
early_questions:
  - <trigger-name>: <condition description — STOP and write blocked.md if triggered>
```

## Context

- Upstream artifacts: <paths to artifacts from prior stages>
- Decisions from prior stages: <key decisions or constraints>
- Open questions: <unresolved items from prior slots>

## Filtered corrections

<Paste relevant entries from docs/corrections-log.md filtered by Affects for this stage/role/scope. Team member MUST read these before producing artifacts.>

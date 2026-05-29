# Slot 09 — Start (Rework)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "08"
run_scope: rework — Store Employee "Update Pet Profile" story AC in story-graph.json only (Browse Available Pets → Manage Pet Listings)
skills:
  - abd-story-mapping
prior_executor_slot: 07
rework_for_reviewer_slot: 08
corrections: docs/corrections-log.md — entries "Store Employee Update Pet Profile AC" and "Brownfield small-and-testable scanner waivers"
checkpoint: none
entry_conditions_met:
  - slot-08-finished.md — reviewer FAIL with substantive blocker documented
  - increment-6 AC reference available at docs/story/acceptance-criteria/increment-6-acceptance-criteria.md
early_questions:   - scope-unclear: Cannot locate Store Employee Update Pet Profile node in graph — STOP and write blocked.md
```

## Context

- **Rework trigger:** Reviewer slot 08 FAIL — Store Employee `Update Pet Profile` AC copied from customer-account flow
- **Fix scope:** Update `acceptance_criteria` array on Store Employee `Update Pet Profile` in `docs/story/story-graph.json` only
- **Reference AC:** `docs/story/acceptance-criteria/increment-6-acceptance-criteria.md` lines 289–317 (4 criteria)
- **Do NOT:** Rename stories, restructure epics, or refresh thin-slicing in this slot

## Filtered corrections

### Store Employee Update Pet Profile AC must use Pet KA fields

- **DO / DO NOT:** DO use store-animal pet profile fields and Store Employee actor. DO NOT use Customer Pet Profile CRUD language.

## Deliverable

1. Fix AC via story-graph-ops CLI (do not hand-edit JSON)
2. Validate: `python story_graph_cli.py read --file docs/story/story-graph.json`
3. Write `slot-09-finished.md` — scanners deferred to reviewer slot 10

## For team member

Follow role executor agent + _shared/executor-workflow.md rework path. Minimal diff — AC fix only.

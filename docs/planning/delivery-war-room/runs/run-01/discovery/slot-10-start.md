# Slot 10 — Start (Rework Reviewer)

```yaml
team-role: product-owner
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "09"
run_scope: rework validation — Store Employee "Update Pet Profile" AC fix from slot 09 only
skills:
  - abd-story-mapping
prior_executor_slot: 09
artifact_paths:   - docs/story/story-graph.json
corrections: docs/corrections-log.md — filter by Affects discovery + product-owner + abd-story-mapping
checkpoint: none
entry_conditions_met:
  - slot-09-finished.md on disk — rework executor complete
  - story-graph.json read validation PASS per slot 09
early_questions:   - artifact-missing: story-graph.json absent or read fails — STOP and write blocked.md
```

## Context

- **Prior executor:** slot 09 (rework) — AC fix on Store Employee `Update Pet Profile` only
- **Prior reviewer FAIL:** slot 08 — substantive blocker on store-employee AC; scanner FAIL with brownfield waiver policy pending
- **Upstream ripple:** `docs/domain/ubiquitous-language.md` — Pet KA vs Customer Account KA vocabulary

## Filtered corrections

### Store Employee Update Pet Profile AC must use Pet KA fields

- **DO / DO NOT:** DO verify AC uses store-animal pet profile fields and Store Employee actor. DO NOT accept Customer Pet Profile CRUD language.

### Brownfield small-and-testable scanner waivers for discovery map

- **DO / DO NOT:** DO apply waiver for pre-existing CRUD/view stories if substantive blocker is fixed. DO NOT FAIL gate solely on brownfield scanner false positives.

## Review scope

1. Re-run abd-story-mapping scanners via `execute-skill-using-skills-rules` — record pass/fail; apply brownfield waiver policy for small-and-testable if AC blocker is resolved
2. Re-check discovery exit-gate item 4 (graph AC vs UL Pet KA) for Store Employee `Update Pet Profile` only
3. Confirm story-graph read still passes
4. Write `slot-10-finished.md` — PASS if AC blocker resolved and waivers documented; FAIL if AC still wrong

## Operator policy

Autonomous run — no mid-slot CHECKPOINT. Delivery lead chains IA executor slot 11 on PASS.

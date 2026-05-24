# Slot 02 — Start

```yaml
team-role: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — review slot 01 abd-domain-terms output only
skills: []
prior_executor_slot: 01
artifact_paths:
  - docs/domain/domain-terms.md
corrections: none yet — read docs/corrections-log.md if created; filter by Affects discovery
checkpoint: after_slot
entry_conditions_met:
  - slot-01-finished.md exists on disk
  - docs/domain/domain-terms.md present
early_questions:
  - artifact-missing: Executor artifact path absent or empty — STOP and write blocked.md
  - scope-creep: Review finds terms outside story-graph epic coverage with no gap documentation — flag in findings
```

## Context

- **Prior executor:** slot 01 (business-expert, `abd-domain-terms`)
- **Artifacts to review:** `docs/domain/domain-terms.md` only — no new stage artifacts
- **Practice skill under review:** `abd-domain-terms`
- **Stage exit gate reference:** `.cursor/content/stages/discovery.md` — apply items scoped to domain-terms only (not full-stage ripple checks)

## Delivery-lead pre-check (slot 01 executor)

| Check | Result | Notes |
| --- | --- | --- |
| Artifact at expected path | PASS | `docs/domain/domain-terms.md`, `state: domain-terms` |
| KA coverage vs story-graph epics | PASS | 8 core KAs + 2 boundary terms map to 10 epics |
| Terms italicized in behavioral bullets | PASS | Spot-check across KAs |
| Ref blocks with source extracts | PASS | Ref/source pairs present throughout |
| Gaps documented in finished file | PASS | 9 new terms + naming collision noted |
| Scanners | DEFERRED | Run `execute-skill-using-skills-rules` scanners for `abd-domain-terms` |

## Open questions from executor (flag in exit-gate review)

1. **`pet profile` vs `customer pet`** — executor renamed Customer Account concept to `customer pet`; confirm canonical names before UL pass.
2. **Visit outcome terms** (visit outcome, check-in, no-show, follow-up action) — sourced from story-graph only; CRC/key-abstractions do not mention them. Flag whether CRC rework is needed or terms are correctly story-graph-only.

## Filtered corrections

- Domain attribute details belong in KA term definitions, not story titles (cross-cutting — apply if story-graph naming conflicts found during review)

## Deliverable

Write `slot-02-finished.md` per `templates/slot-finished-reviewer.md`:

1. Run scanners on `docs/domain/domain-terms.md` via `abd-domain-terms` skill root
2. Review exit-gate items scoped to domain-terms
3. Record PASS/FAIL, findings, and suggested fixes — no new artifacts

# Slot 89 — Start (Run 4 Engineering — Increment 3 ATDD executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "88"
run_scope: Increment 3 — Ship to home (5 stories, 22 AC)
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter engineering + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-88-finished.md PASS
  - docs/story/specification-by-example/increment-3-specification-by-example.md
  - docs/ux/increment-3-interface-design.md (test name mapping)
  - docs/architecture/architecture-reference.md Inc 3 handoff
  - npm test 110/110 baseline
```

Write Increment 3 acceptance tests under `tests/ship-to-home/` (or parallel structure to `tests/click-and-collect/`). Follow orchestrator pattern from Increment 2. Map to increment-3 spec-by-example and AC. RED acceptable if production gaps found — fix to GREEN within slot if tests expose real bugs (slot 65 precedent).

Run npm test from conf/ before finish — report file/test counts.

Write `slot-89-finished.md`.

# Slot 65 — Start (Run 3 Engineering — ATDD executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "64"
run_scope: Increment 2 — Click-and-collect
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:
  - slot-64-finished.md PASS
  - docs/story/specification-by-example/increment-2-specification-by-example.md
```

Increment 2 acceptance tests (RED where applicable). Run `npm test` from conf/. Write `slot-65-finished.md`.

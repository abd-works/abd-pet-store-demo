# Slot 103 — Start (Run 5 Specification — Increment 4 spec-by-example executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "102"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-specification-by-example
checkpoint: none
entry_conditions_met:
  - slot-102-finished.md PASS
  - docs/domain/crc.md Increment 4
  - docs/story/acceptance-criteria/increment-4-acceptance-criteria.md
```

Produce `docs/story/specification-by-example/increment-4-specification-by-example.md` — Given/When/Then for all 16 Increment 4 stories with concrete domain values.

Write `slot-103-finished.md`.

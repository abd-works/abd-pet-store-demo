# Slot 77 — Start (Run 4 Specification — spec-by-example executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "76"
run_scope: Increment 3 — Ship to home (5 stories)
skills:
  - abd-specification-by-example
corrections: docs/corrections-log.md — filter specification + product-owner + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-76-finished.md PASS
  - docs/domain/crc.md Increment 3 refresh
  - docs/story/acceptance-criteria/increment-3-acceptance-criteria.md
```

Produce `docs/story/specification-by-example/increment-3-specification-by-example.md` for all 5 Increment 3 stories. Given/When/Then with domain values; align to CRC + UL + AC.

Guest checkout only; no accounts.

Write `slot-77-finished.md`.

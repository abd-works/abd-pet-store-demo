# Slot 79 — Start (Run 4 Specification — scenario walkthrough executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "78"
run_scope: Increment 3 — Ship to home
skills:
  - abd-scenario-walkthrough
corrections: docs/corrections-log.md — filter specification + business-expert + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-78-finished.md PASS
  - docs/story/specification-by-example/increment-3-specification-by-example.md
  - docs/domain/crc.md Increment 3 refresh
```

Walk Increment 3 scenarios through CRC. Output per skill template (e.g. `docs/domain/increment-3-walkthrough.md` or path per skill convention — check prior increment-2-walkthrough.md).

Guest checkout only; no accounts.

Write `slot-79-finished.md`.

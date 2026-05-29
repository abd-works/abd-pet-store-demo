# Slot 55 — Start (Run 3 Specification — walkthrough executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "54"
run_scope: Increment 2 — Click-and-collect
skills:
  - abd-scenario-walkthrough
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-54-finished.md PASS
```

Walk Increment 2 specs through CRC. Output `docs/domain/increment-2-walkthrough.md`. Write `slot-55-finished.md`.

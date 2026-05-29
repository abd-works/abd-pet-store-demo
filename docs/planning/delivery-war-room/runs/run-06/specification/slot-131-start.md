# Slot 131 — Start (Run 6 — Increment 5: Pay your way — Increment 5 scenario walkthrough executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: specification
depends_on:
  - "130"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-scenario-walkthrough
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-130-finished.md exists
```

Walk payment + retry scenarios through domain model for Increment 5.

Output: `docs/domain/increment-5-walkthrough.md` (or per-skill convention).

Write `slot-131-finished.md`.

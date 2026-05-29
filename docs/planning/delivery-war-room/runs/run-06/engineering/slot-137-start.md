# Slot 137 — Start (Run 6 — Increment 5: Pay your way — Increment 5 UI implementation executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: engineering
depends_on:
  - "136"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-interface-design
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-136-finished.md exists
```

Payment selection UI implementation pass — three vendors (StripeWave + PayNova + VaultPay).

Depends on Run 6 spec exit (slot 136). May run parallel to Run 5 engineering 117–118 if Run 6 spec completes first.

Write `slot-137-finished.md`.

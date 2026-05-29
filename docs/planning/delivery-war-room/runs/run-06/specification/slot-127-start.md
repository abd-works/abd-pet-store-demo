# Slot 127 — Start (Run 6 — Increment 5: Pay your way — Increment 5 CRC executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: specification
depends_on:
  - "126"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-class-responsibility-collaborator
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-126-finished.md exists
```

CRC — payment vendor abstraction, retry, refund routing for Increment 5.

Output: refresh `docs/domain/crc.md` Increment 5 sections.

Write `slot-127-finished.md`.

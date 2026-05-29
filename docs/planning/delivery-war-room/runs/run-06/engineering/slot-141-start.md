# Slot 141 — Start (Run 6 — Increment 5: Pay your way — Increment 5 ATDD RED executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: engineering
depends_on:
  - "140"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-140-finished.md exists
```

Write failing acceptance tests (RED) for Increment 5 payment + retry under `tests/` per MERN patterns.

Tests may fail (RED) until slot 143 GREEN — npm test must run without infrastructure errors.

Write `slot-141-finished.md`.

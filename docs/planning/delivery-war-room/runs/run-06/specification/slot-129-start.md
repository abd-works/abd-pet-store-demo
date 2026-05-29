# Slot 129 — Start (Run 6 — Increment 5: Pay your way — Increment 5 spec-by-example executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: specification
depends_on:
  - "128"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-specification-by-example
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-128-finished.md exists
```

Output: `docs/story/specification-by-example/increment-5-specification-by-example.md`.

Write `slot-129-finished.md`.

# Slot 123 — Start (Run 6 — Increment 5: Pay your way — Increment 5 lo-fi mockup executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: exploration
depends_on:
  - "122"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-122-finished.md exists
```

Lo-fi payment method selection — wallet (PayNova) + BNPL (VaultPay) alongside existing card flow.

Output under `docs/ux/lo-fi/` for Increment 5; companion markdown as per skill.

Write `slot-123-finished.md`.

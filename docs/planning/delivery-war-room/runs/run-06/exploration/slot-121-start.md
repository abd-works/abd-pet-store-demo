# Slot 121 — Start (Run 6 — Increment 5: Pay your way — Increment 5 AC executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: exploration
depends_on:
  - "120"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-120-finished.md exists
```

Increment 5 acceptance criteria + exploration diagrams for PayNova, VaultPay, retry failed payment.

Output: `docs/story/acceptance-criteria/increment-5-acceptance-criteria.md` (+ drawio companion if used).

Align to refreshed UL and thin-slicing Increment 5 stories.

Write `slot-121-finished.md`.

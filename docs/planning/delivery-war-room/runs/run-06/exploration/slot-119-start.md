# Slot 119 — Start (Run 6 — Increment 5: Pay your way — Increment 5 UL executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: exploration
depends_on:
  - "110"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
entry_conditions_met:
  - slot-110-finished.md exists
  - Run 5 specification exit (slot 110) — parallel to Run 5 engineering
  - story/story-graph.json valid
```

Cross-run entry: opens parallel to Run 5 engineering 115–118 (`depends_on: "110"` = Run 5 spec exit).

Refresh ubiquitous language for Increment 5: PayNova, VaultPay, payment vendor abstraction, failed-payment retry, refund routing foundation.

Stories: *Process Digital Wallet Payment via PayNova*, *Process Buy-Now-Pay-Later via VaultPay*, *Retry Failed Payment*.

Render/update `docs/domain/ubiquitous-language.drawio` via drawio-domain-sync.

**DO NOT** implement production code — exploration UL only. Preserve StripeWave and Increments 1–4 terms.

Write `slot-119-finished.md`.

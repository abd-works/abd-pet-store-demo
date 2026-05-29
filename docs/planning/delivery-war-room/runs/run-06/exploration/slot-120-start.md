# Slot 120 — Start (Run 6 — Increment 5: Pay your way — Increment 5 UL reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: exploration
depends_on:
  - "119"
run_scope: Increment 5 — Pay your way (PayNova, VaultPay, retry)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
prior_executor_slot: 119
artifact_paths:
  - docs/planning/delivery-war-room/slot-119-finished.md
  - docs/domain/ubiquitous-language.md
  - docs/domain/domain.json
  - docs/domain/ubiquitous-language.drawio
practice_skill_under_review: abd-ubiquitous-language
corrections: docs/corrections-log.md — filter by stage + Increment 5
checkpoint: none
```

Review slot 119 UL for Increment 5. Run scanners on UL artifacts. Validate exploration exit-gate items scoped to UL.

Scope guard: multi-vendor alongside StripeWave; retry/refund routing vocabulary only — no implementation.

Write `slot-120-finished.md`.

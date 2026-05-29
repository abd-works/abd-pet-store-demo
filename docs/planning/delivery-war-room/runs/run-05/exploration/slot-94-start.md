# Slot 94 — Start (Run 5 Exploration — Increment 4 UL reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "93"
run_scope: Increment 4 — Returning customers (15 stories)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
prior_executor_slot: 93
artifact_paths:
  - docs/planning/delivery-war-room/slot-93-finished.md
  - docs/domain/ubiquitous-language.md
  - docs/domain/domain.json
  - docs/domain/ubiquitous-language.drawio
practice_skill_under_review: abd-ubiquitous-language
corrections: docs/corrections-log.md — filter exploration + Increment 4
checkpoint: none
entry_conditions_met:   - slot-93-finished.md exists
```

Review slot 93 UL refresh for Increment 4. Run scanners on UL artifact. Validate exploration exit-gate items scoped to UL. Scope guard: guest checkout preserved; Increment 1–3 terms intact; account/session/wishlist/saved entities for Increment 4 only.

Mirror slot-70 reviewer pattern (Increment 3 UL review).

Write `slot-94-finished.md`.

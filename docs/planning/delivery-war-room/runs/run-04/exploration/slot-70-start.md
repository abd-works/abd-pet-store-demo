# Slot 70 — Start (Run 4 Exploration — UL reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "69"
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
prior_executor_slot: 69
artifact_paths:
  - docs/planning/delivery-war-room/slot-69-finished.md
  - docs/domain/ubiquitous-language.md
  - docs/domain/domain.json
  - docs/domain/ubiquitous-language.drawio
practice_skill_under_review: abd-ubiquitous-language
checkpoint: none
```

Review slot 69 UL refresh for Increment 3. Run scanners on UL artifact. Validate exploration exit-gate items scoped to UL. Scope guard: no accounts; ship-to-home + click-and-collect + guest checkout.

Write `slot-70-finished.md`.

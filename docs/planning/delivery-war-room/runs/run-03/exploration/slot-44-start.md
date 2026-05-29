# Slot 44 — Start (Run 3 Exploration — UL reviewer)

```yaml
team-role: business-expert
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "43"
run_scope: Increment 2 — Click-and-collect (UL refresh)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
prior_executor_slot: 43
artifact_paths:
  - docs/planning/delivery-war-room/slot-43-finished.md
  - docs/domain/ubiquitous-language.md
  - docs/domain/domain.json
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-43-finished.md exists
```

## Handoff

Review slot 43 UL refresh for Increment 2 only. **No new stage artifacts.**

1. Read slot-43-finished.md and artifact paths.
2. Run scanners:

```powershell
python c:\dev\agilebydesign-skills\skills\skill-helpers\execute-skill-using-skills-rules\scripts\run_scanners.py --skill-root c:\dev\abd-pet-store-demo\.cursor\skills\abd-ubiquitous-language --workspace c:\dev\abd-pet-store-demo
```

3. Validate exploration.md skill 1 exit items scoped to Increment 2 UL: new cart/checkout/order/payment/click-and-collect terms present; no account/login scope creep; increment_scope updated.
4. Write `slot-44-finished.md` using reviewer template.

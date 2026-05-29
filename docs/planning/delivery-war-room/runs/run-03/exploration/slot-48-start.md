# Slot 48 — Start (Run 3 Exploration — UX mockup reviewer)

```yaml
team-role: ux-designer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "47"
run_scope: Increment 2 — Click-and-collect lo-fi
skills:
  - abd-ux-mockup
prior_executor_slot: 47
artifact_paths:
  - docs/planning/delivery-war-room/slot-47-finished.md
  - docs/ux/lo-fi/increment-2-click-and-collect.md
  - docs/ux/lo-fi/increment-2-click-and-collect.drawio
  - docs/ux/lo-fi/increment-2-click-and-collect-state.json
practice_skill_under_review: abd-ux-mockup
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-47-finished.md exists
```

## Review scope

Validate slot 47 lo-fi against abd-ux-mockup rules and exploration exit-gate items: cart/checkout/store selection/order confirmation/staff pick-prep screens; AC affordance trace; scope guard (no accounts/shipping/alternate payment).

Run scanners:
```powershell
python c:\dev\agilebydesign-skills\skills\skill-helpers\execute-skill-using-skills-rules\scripts\run_scanners.py --skill-root c:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup --workspace c:\dev\abd-pet-store-demo
```

Write `slot-48-finished.md`.

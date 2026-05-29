# Slot 73 — Rework Start (Run 4 Exploration — arch template)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "74"
run_scope: rework — restore Click-and-Collect Fulfillment mechanism in architecture-reference.md
skills:
  - abd-architecture-template
prior_executor_slot: 73
rework_for_reviewer_slot: 74
corrections: docs/corrections-log.md — entry "Architecture reference — preserve Increment 2 mechanism sections when extending"
checkpoint: none
entry_conditions_met:   - slot-74-finished.md — reviewer FAIL; blocker documented
```

## Rework trigger

Reviewer slot 74 FAIL: **Click-and-Collect Fulfillment** `## Mechanism:` section removed while Overview, TOC, Increment 2 list, and traceability table still reference it. Unified Order Queue is staff list routing — not a substitute for prepared/collected fulfillment contract.

## Fix scope (minimal)

1. **Restore** `## Mechanism: Click-and-Collect Fulfillment` with full five-part shape (Principles, File Structure, Participants, Flow, Walkthrough, Testing) — align to existing `packages/order/` implementation and Increment 2 AC.
2. **Clarify** Unified Order Queue routes to click-and-collect vs ship-to-home fulfillment — does not subsume click-and-collect mechanism.
3. **Minor fixes** from slot 74: `sendConfirmationEmail` sample branches on delivery option; fix duplicate step `3.` in Inventory Reservation walkthrough.
4. **Preserve** all Increment 3 mechanisms added in slot 73.

## Do NOT

- Remove Increment 3 sections
- Add accounts/shipping vendors beyond scope

Write `slot-73-rework-finished.md`. Scanners deferred to slot 74 re-review.

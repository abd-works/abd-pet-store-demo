# Slot 149-rework-2 — Start (Run 7 — Increment 6: Pet visits — UX mockup micro-rework)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "150-re-review"
run_scope: Increment 6 — Pet visits (single-line fix — F1 lo-fi.md only)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by stage: exploration · role: ux-designer · run: Run 7
checkpoint: none
entry_conditions_met:
  - slot-150-re-review-finished.md exists (Overall gate: FAIL — F1 lo-fi.md row missing)
prior_executor_slot: 149-rework
reviewer_slot: 150-re-review
```

**One targeted fix only. Do NOT re-generate the drawio or touch state.json — they are already correct.**

## Fix F1 (final) — Add missing row to lo-fi.md screen table

**File:** `docs/ux/lo-fi/increment-6-pet-visits.md`
**Screen:** "book appointment — select time slot"
**Location:** Insert the following row between the `slot hold notice` row and the `continue` row in the screen regions table:

```
|| slot released notice | body | form | Your selected slot is no longer held — please select a new time | Shown when temporary hold expires before customer confirms; AC Select Date and Time Slot AC 2 |
```

Verify after insertion that:
- `slot hold notice` row is immediately above the new row
- `continue` row is immediately below the new row
- No other rows or content were disturbed

**Do not touch:** `state.json`, `drawio`, affordance trace, any other screen.

Write `slot-149-rework-2-finished.md`.

# Slot 149-rework — Start (Run 7 — Increment 6: Pet visits — UX mockup rework executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "150"
run_scope: Increment 6 — Pet visits (targeted rework — 3 blocking fixes from slot-150-finished.md)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by stage: exploration · role: ux-designer · run: Run 7
checkpoint: none
entry_conditions_met:
  - slot-150-finished.md exists (Overall gate: FAIL — 3 blocking findings)
prior_executor_slot: 149
reviewer_slot: 150
```

Apply the 3 blocking fixes from slot-150-finished.md to the Increment 6 lo-fi wireframe artifacts. Do NOT re-generate the full wireframe — make targeted edits only.

## Fix F1 — Add `slot released notice` region

**File:** `docs/ux/lo-fi/increment-6-pet-visits.md`
**Screen:** "book appointment — select time slot"
**Action:** Add a `form` region named `slot released notice` with field text: "Your selected slot is no longer held — please select a new time".
Also add the same region to `docs/ux/lo-fi/increment-6-pet-visits-state.json` in the matching screen's regions array.

## Fix F3 — Add `Browse other pets` action to state.json

**File:** `docs/ux/lo-fi/increment-6-pet-visits-state.json`
**Screen:** "customer account — appointments" (upcoming appointments list)
**Action:** Add `{ "label": "Browse other pets" }` to the `upcoming appointments` region's actions array (alongside the existing `{ "label": "Cancel" }`).
Update `lo-fi.md` interaction decisions to match if wording differs.

## Fix F4 — Correct label in state.json

**File:** `docs/ux/lo-fi/increment-6-pet-visits-state.json`
**Screen:** "pet profile page — available" (and adopted variant if present)
**Action:** Change field label `"distance from your location"` → `"distance from customer location"` to match `lo-fi.md` spec table verbatim.

## Advisory F2 (include in rework)

Add labelled conditional inline alert regions for the three idempotent staff action states on the "staff — incoming appointments" screen:
- `already checked in` (Check In Customer AC 3)
- `cancelled appointment block` (Check In Customer AC 4)
- `customer already checked in` (Record No-Show AC 4)

Add each as a conditional `form` region (or shared inline alert region noted as conditional) in both `lo-fi.md` and `state.json`.

## After fixes

Regenerate `docs/ux/lo-fi/increment-6-pet-visits.drawio` from the updated `state.json`.

Verify `lo-fi.md` and `state.json` are in exact sync for all modified regions.

Write `slot-149-rework-finished.md`.

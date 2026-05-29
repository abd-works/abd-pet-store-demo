# Slot 150-re-review — Start (Run 7 — Increment 6: Pet visits — UX mockup re-review)

```yaml
team-role: ux-designer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "149-rework"
run_scope: Increment 6 — Pet visits (re-review of 3 blocking + 1 advisory UX mockup fixes)
skills:
  - abd-ux-mockup
prior_executor_slot: 149-rework
artifact_paths:
  - docs/planning/delivery-war-room/slot-149-rework-finished.md
  - docs/ux/lo-fi/increment-6-pet-visits.md
  - docs/ux/lo-fi/increment-6-pet-visits-state.json
  - docs/ux/lo-fi/increment-6-pet-visits.drawio
practice_skill_under_review: abd-ux-mockup
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
re_review_for_slot: "150"
```

Verify the fixes from rework slot 149-rework are correctly applied. Check the following against `docs/ux/lo-fi/increment-6-pet-visits.md` and `docs/ux/lo-fi/increment-6-pet-visits-state.json`:

**F1 — slot released notice region (was blocking):**
Confirm "book appointment — select time slot" screen has a `slot released notice` form region in both `lo-fi.md` and `state.json`.

**F3 — Browse other pets action (was blocking):**
Confirm `state.json` `upcoming appointments` actions array includes `{ "label": "Browse other pets" }` alongside `{ "label": "Cancel" }`. Confirm `lo-fi.md` interaction decisions match.

**F4 — distance from customer location label (was blocking):**
Confirm `state.json` store location field label reads `"distance from customer location"` (not `"distance from your location"`) on pet profile page screens. Confirm drawio was regenerated.

**F2 — conditional inline alert regions for staff screen (was advisory):**
Confirm the "staff — incoming appointments" screen has conditional form regions for: `already checked in` (Check In AC 3), `cancelled appointment block` (Check In AC 4), and `customer already checked in` (Record No-Show AC 4) in both `lo-fi.md` and `state.json`.

Also re-run AI pass on `ucd-affordances-and-feedback` and `markdown-spec-stays-in-sync` rules from slot 150 (the two rules that failed) to confirm they now pass.

If all fixes are correctly applied with no regressions, write `slot-150-re-review-finished.md` with **Overall gate: PASS**.
If any fix is missing or incorrect, write with **Overall gate: FAIL** and specific locations.

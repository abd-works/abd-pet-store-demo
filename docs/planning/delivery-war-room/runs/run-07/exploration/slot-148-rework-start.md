# Slot 148-rework — Start (Run 7 — Increment 6: Pet visits — AC rework executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "148"
run_scope: Increment 6 — Pet visits (targeted AC rework — 7 italicization findings from reviewer slot 148)
skills:
  - abd-acceptance-criteria
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
rework_for_slot: "148"
```

Seven targeted italicization fixes to `docs/story/acceptance-criteria/increment-6-acceptance-criteria.md` per reviewer slot 148 findings. Do not re-generate the full document — apply surgical edits only. After fixing the markdown, also update `docs/story/story-graph.json` AC arrays for affected stories to match.

## Fixes required

### Fix 1 — Confirm Appointment Booking, AC #2
Replace `customer account` with `*Customer Account*` in the WHEN or THEN clause of AC #2.

### Fix 2 — Confirm Appointment Booking, AC #4
Replace `email` with `*Appointment Confirmation Email*` in AC #4.

### Fix 3 — Cancel or Rebook After Pet Adoption, AC #4
Italicize `pet adopted`, `incoming appointments view`, and `no-show` where they appear plain in AC #4.

### Fix 4 — Record No-Show, AC #3
Replace `no-show` with `*No-Show*` and `follow-up notification` with `*Visit Follow-Up Notification*` in AC #3.

### Fix 5 — Send Appointment Reminder, AC #4
Replace `reminder` with `*Appointment Reminder*` in AC #4.

### Fix 6 — Send Pet Adopted Before Visit Notification, AC #4
Italicize `notification` and `pet adopted badge` where they appear plain in AC #4.

### Fix 7 — Send Visit Follow-Up Notification, AC #4
Replace `notification` with `*Visit Follow-Up Notification*` in AC #4.

## Scope guard

Edit only the 7 AC lines identified above. Do not alter any other stories, conditions, or prior-increment content. After applying markdown fixes, update the matching AC array entries in `docs/story/story-graph.json` for the 5 affected stories (Confirm Appointment Booking, Cancel or Rebook After Pet Adoption, Record No-Show, Send Appointment Reminder, Send Pet Adopted Before Visit Notification, Send Visit Follow-Up Notification).

Write `slot-148-rework-finished.md` when all fixes are applied and verified.

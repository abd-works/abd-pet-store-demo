# Slot 149 — Start (Run 7 — Increment 6: Pet visits — UX mockup executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "148-re-review"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-146-re-review-finished.md exists (Overall gate: PASS — UL rework cycle closed)
```

Produce lo-fi wireframes for Increment 6 screens: pet gallery (species filter), pet profile, adoption appointment request, appointment confirmation/cancellation, staff appointment board, conduct visit / record outcome, follow-up notification preview.

Save as `docs/ux/lo-fi/increment-6-pet-visits.md` and `docs/ux/lo-fi/increment-6-pet-visits.drawio`.

Appointment booking screens are account-gated — show auth gate / redirect for guests.

Write `slot-149-finished.md`.

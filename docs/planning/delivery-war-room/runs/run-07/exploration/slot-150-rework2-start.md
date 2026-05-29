# Slot 150-rework2 — Start (Run 7 — Increment 6: Pet visits — UX mockup rework executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "150-re-review"
run_scope: Increment 6 — Pet visits (single row insertion — B1 from slot-150-re-review-finished.md)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
rework_for_slot: "150-re-review"
```

Single surgical fix to `docs/ux/lo-fi/increment-6-pet-visits.md`. Do not touch any other file.

## Fix B1 — Insert `slot released notice` row in lo-fi.md screen table

In `docs/ux/lo-fi/increment-6-pet-visits.md`, find the screen table for **"book appointment — select time slot"**.

Locate the row for `slot hold notice` and the row for `continue`. Insert the following row **between** them:

```
| slot released notice | body | form | Your selected slot is no longer held — please select a new time | Shown when temporary hold expires before customer confirms; AC Select Date and Time Slot AC 2 |
```

The `state.json` already has this region correctly. No change to `state.json` or `drawio` is needed — only `lo-fi.md` needs this one row.

After inserting, verify the screen table reads: `slot hold notice` → `slot released notice` → `continue`.

Write `slot-150-rework2-finished.md` when done.

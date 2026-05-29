# Slot 147 — Start (Run 7 — Increment 6: Pet visits — AC executor)

```yaml
team-role: product-owner
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "146-re-review"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-acceptance-criteria
  - drawio-story-sync
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-146-finished.md exists
```

Write acceptance criteria for all 19 Increment 6 stories in `docs/story/acceptance-criteria/increment-6-acceptance-criteria.md`. Update `docs/story/story-graph.json` with AC arrays using story-graph-ops CLI.

Render exploration diagram via drawio-story-sync.

Use UL terms from slot-145 output. Scope guard: Increment 6 stories only — do not add AC to Increments 1–5 stories.

Write `slot-147-finished.md`.

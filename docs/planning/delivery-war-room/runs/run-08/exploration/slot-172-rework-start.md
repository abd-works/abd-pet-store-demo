# Slot 172-rework — Start (Run 8 — Increment 7: Returns and refunds — UL italicization fix)

```yaml
team-role: business-expert
slot_type: executor
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
ticket_run: 8
stage: exploration
depends_on:
  - "172"
run_scope: Increment 7 — returns and refunds
skills:
  - abd-ubiquitous-language
rework_for: 172
checkpoint: none
```

## Rework instructions

Slot 172 reviewer found **~60–80 un-italicized domain terms** in the new Increment 7 sections of `docs/domain/ubiquitous-language.md`. Fix these only in the **Increment 7 content** (do not touch pre-existing debt from Increments 1–6).

**Rule:** Every domain term reference within behavior bullets, invariants, and relationship descriptions must be italicized per abd-ubiquitous-language rules.

**Most frequent offenders (from reviewer):**
- `payment` (~30 occurrences) — should be *Payment*, *Payment Method*, *Saved Payment Method* etc.
- `refund` (~20 occurrences) — should be *Refund*, *Refund Status*, *Refund Retry* etc.
- `notification` (~20 occurrences) — should be *Notification*, *Return Received Notification* etc.

**Scope:** Only fix italicization in the Increment 7 sections. Do not restructure content, add/remove concepts, or modify domain.json/drawio (those passed).

Write `slot-172-rework-finished.md` when done.

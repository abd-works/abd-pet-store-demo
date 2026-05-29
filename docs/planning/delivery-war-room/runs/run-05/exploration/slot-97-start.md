# Slot 97 — Start (Run 5 Exploration — Increment 4 UX mockup executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "96"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-ux-mockup
corrections: docs/corrections-log.md — filter exploration + ux-designer + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-96-finished.md PASS
  - docs/story/acceptance-criteria/increment-4-acceptance-criteria.md
  - docs/domain/ubiquitous-language.md Increment 4 terms
```

Lo-fi Draw.io mockups for Increment 4: registration, login, account settings, wishlist, checkout-with-saved-entities. Save under `docs/ux/lo-fi/` (e.g. `increment-4-returning-customers.drawio`). Align to AC and UL. Preserve guest checkout paths from prior increments.

Write `slot-97-finished.md`.

# Slot 101 — Start (Run 5 Specification — Increment 4 CRC executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "100"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-class-responsibility-collaborator
corrections: docs/corrections-log.md — filter specification + business-expert + Increment 4
checkpoint: none
entry_conditions_met:
  - Run 5 exploration stage_exit_gate PASS
  - docs/domain/ubiquitous-language.md Increment 4
  - docs/story/acceptance-criteria/increment-4-acceptance-criteria.md
```

CRC refresh for Increment 4: account aggregate, session, wishlist, saved entities. Update `docs/domain/crc.md` and `docs/domain/domain.json`. Preserve Increment 1–3 CRC blocks.

Write `slot-101-finished.md`.

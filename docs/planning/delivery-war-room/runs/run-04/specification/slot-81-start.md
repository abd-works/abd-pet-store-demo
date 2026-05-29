# Slot 81 — Start (Run 4 Specification — interface design executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "80"
run_scope: Increment 3 — Ship to home
skills:
  - abd-interface-design
corrections: docs/corrections-log.md — filter specification + ux-designer + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-80-finished.md PASS
  - docs/ux/information-architecture.md
  - docs/ux/increment-2-interface-design.md
  - increment-3-specification-by-example.md
```

Produce `docs/ux/increment-3-interface-design.md` — shipping address step, delivery option select, order status page, staff order queue extensions (no new lo-fi per plan waiver — derive from IA + prior lo-fi).

Guest checkout only; standard delivery + click-and-collect.

Write `slot-81-finished.md`.

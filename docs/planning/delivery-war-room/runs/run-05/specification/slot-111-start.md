# Slot 111 — Start (Run 5 Specification — Increment 4 architecture reference executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "110"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-architecture-reference
checkpoint: none
entry_conditions_met:
  - slot-110-finished.md PASS
  - docs/architecture/architecture-reference.md
  - docs/ux/increment-4-interface-design.md
  - docs/domain/increment-4-walkthrough.md
  - docs/story/specification-by-example/increment-4-specification-by-example.md
```

Extend `docs/architecture/architecture-reference.md` with Increment 4 mechanism reference sections: auth, session, email verification, saved addresses/payment methods, wishlist, order history/reorder. Preserve all prior increment mechanism sections.

Write `slot-111-finished.md`.

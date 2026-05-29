# Slot 115 — Start (Run 5 Engineering — Increment 4 ATDD RED executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "114"
run_scope: Increment 4 — Returning customers (16 stories)
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter engineering + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-114-finished.md PASS
  - docs/domain/object-model.md Increment 4 types in shared packages
  - docs/ux/increment-4-interface-design.md
  - docs/story/specification-by-example/increment-4-specification-by-example.md
  - docs/architecture/architecture-reference.md Increment 4 handoff
  - npm test 146/146 green baseline
```

Write failing acceptance tests (RED) for Increment 4 returning customers: registration, login, email verification, password reset, session, profile, saved addresses/payment methods, wishlist, order history, reorder. Follow abd-acceptance-test-driven-development rules and MERN test structure from prior increments (tests/ship-to-home/ pattern).

Tests may fail (RED) until slot 117 GREEN — but npm test suite must run without infrastructure errors.

Write `slot-115-finished.md`.

# Slot 117 — Start (Run 5 Engineering — Increment 4 clean code GREEN executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "116"
run_scope: Increment 4 — Returning customers GREEN (accounts + saved checkout + order history + wishlist)
skills:
  - abd-clean-code
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter engineering + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-116-finished.md PASS
  - tests/returning-customers/ RED baseline from slot 115
  - docs/architecture/architecture-reference.md Increment 4 handoff
  - docs/ux/increment-4-interface-design.md
  - packages/customer-account/, packages/order/, packages/payment/, packages/app-client/ Increment 4 scope
```

Increment 4 production code GREEN pass — registration, login, email verification, password reset, session, profile, saved addresses/payment methods, wishlist, order history, reorder, checkout with saved entities. Implement production code to satisfy failing acceptance tests from slot 115. Follow abd-clean-code + MERN rules. Minimal diffs only.

Run `npm test` from conf/ — all tests must PASS (including returning-customers suite).

Write `slot-117-finished.md`.

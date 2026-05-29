# Slot 91 — Start (Run 4 Engineering — Increment 3 clean code executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "90"
run_scope: Increment 3 — Ship to home GREEN (production code pass)
skills:
  - abd-clean-code
  - mern-technical-architecture
corrections: docs/corrections-log.md — filter engineering + Increment 3
checkpoint: none
entry_conditions_met:
  - slot-90-finished.md PASS
  - tests/ship-to-home/ 146/146 baseline
  - docs/architecture/architecture-reference.md Inc 3 handoff
  - packages/order/, packages/app-client/ Increment 3 code from slots 85/87
```

Increment 3 production code GREEN pass — ship-to-home checkout, staff fulfillment, tracking notification. ATDD already GREEN (slot 89); refine production to satisfy clean-code + MERN rules where gaps exist. Minimal diffs only.

Run `npm test` from conf/ — maintain **146/146 PASS**.

Write `slot-91-finished.md`.

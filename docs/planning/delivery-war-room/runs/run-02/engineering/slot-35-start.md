# Slot 35 — Start (Run 2 Engineering — abd-interface-design implementation pass)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "34"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-interface-design
corrections: docs/corrections-log.md
entry_conditions_met:
  - slot-34-finished.md PASS — Specification stage exit
  - docs/ux/increment-1-interface-design.md
  - docs/ux/lo-fi/increment-1-walk-in-driver.md
  - docs/architecture/architecture-reference.md
```

## Handoff

Per `content/stages/engineering.md` step 1 — **UX Designer** runs `abd-interface-design` **implementation pass**: runnable UI from approved `interface-design.md` (spec pass completed slot 31). Read skill rules; run scanners. Brownfield spike in `packages/` is input only.

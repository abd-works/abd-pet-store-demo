# Slot 137 — Rework Start (Run 6 — Increment 5 UI implementation fix)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 6 — Increment 5: Pay your way"
stage: engineering
depends_on:
  - "138"
run_scope: Increment 5 — Pay your way logged-in payment + spec sync fixes
skills:
  - abd-interface-design
prior_executor_slot: 137
checkpoint: none
entry_conditions_met:
  - slot-137-finished.md exists
  - slot-138-finished.md FAIL (reviewer blockers documented)
rework_reason: Reviewer slot 138 — logged-in multi-vendor saved payment selection, save PayNova/VaultPay modals stubbed, increment-5-interface-design.md AC/a11y/performance tables not synced
```

Address reviewer blockers from slot 138:

1. **Logged-in multi-vendor saved payment** — Extend saved payment UI/DTO so PayNova and VaultPay saved tokens display per spec; checkout charges the selected vendor token (not hardcoded StripeWave card).
2. **Save PayNova / VaultPay modals** — Wire `onSave` to persistence API (server endpoints from slot 137); tokens appear in saved list after save.
3. **`markdown-spec-stays-in-sync`** — Update `docs/ux/increment-5-interface-design.md`: AC mapping rows, accessibility checklist, performance `Current` column to reflect implemented behaviour.

Preserve guest multi-vendor flows, StripeWave lazy-load, and Increments 1–4 test baseline. Run `npm test` from `conf/` — require full suite PASS.

Write `slot-137-rework-finished.md` (prefer over overwriting slot-137-finished.md). Do NOT run scanners. Do NOT open slot 139 until reviewer re-pass.

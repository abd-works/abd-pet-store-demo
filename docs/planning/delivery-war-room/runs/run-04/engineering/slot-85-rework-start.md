# Slot 85 — Rework Start (Run 4 Engineering — interface implementation)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "86"
run_scope: rework — slot 86 blockers only
skills:
  - abd-interface-design
prior_executor_slot: 85
rework_for_reviewer_slot: 86
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-86-finished.md FAIL — 3 blockers documented
```

## Rework trigger (slot 86 FAIL)

1. **Standard delivery checkout order** — Fix flow to cart → billing → shipping → delivery option → payment; fix CheckoutProgressTabs order on standard path.
2. **Shipping validation bug** — `ShippingAddressPage.validate()` must reject empty city/country (Enter Shipping Address AC 4).
3. **Spec sync** — Update `docs/ux/increment-3-interface-design.md` change log + test status post-implementation per markdown-spec-stays-in-sync.

## Do NOT

- Break Increment 2 click-and-collect tests (110/110 must stay green)
- Add accounts/shipping vendors beyond scope

Run `npm test` from conf/ before finish. Write `slot-85-rework-finished.md`.

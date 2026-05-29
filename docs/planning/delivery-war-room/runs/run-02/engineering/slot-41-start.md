# Slot 41 — Start (Run 2 Engineering — clean code GREEN)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "40"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-clean-code
  - mern-technical-architecture
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:
  - slot-40-finished.md — ATDD pair complete (reviewer PASS or waived fixes incorporated)
  - slot-39-finished.md — acceptance tests in place
  - docs/architecture/architecture-reference.md
  - docs/domain/object-model.md
  - packages/*/ shared + client + server spike from slots 35–37
```

## Handoff

Implement Increment 1 production code (GREEN) and **strengthen tests** per slot-40 reviewer findings. Run `npm test` from `conf/` before finishing.

**Lead waiver:** RED bar waived for Run 2 ATDD refresh (suite was already GREEN from prototype slots). Enforce slot 38/36 ripples via code + tests below.

**Required fixes (from slot-40-finished.md):**

1. **Walk-in stock UX** — Remove `qty {available_to_sell_quantity}` from `StockAvailabilityDisplay`; labels only.
2. **Customer stock API** — `GET /api/products/:sku/stock` must not expose raw counts to customers; `stock_label` per store only.
3. **Client stock tests** — Add `thenWalkInSurfaceShowsLabelsOnly()` — assert no `/qty\s+\d+/` on walk-in surface.
4. **Server stock tests** — Assert customer GET response omits `available_to_sell_quantity` on store entries.
5. **Browse catalog** — Visible **select product** affordance per lo-fi; update `ProductCatalogGrid` + `browse-product-catalog_client.test.tsx`.
6. **Locate stores** — keep lo-fi/spec markup alignment.

Write `slot-41-finished.md` with artifact paths and test status.

## Filtered corrections

- Slot 36: visible `select product` affordance where spec requires
- Slot 38: customer API must not expose raw stock counts for walk-in

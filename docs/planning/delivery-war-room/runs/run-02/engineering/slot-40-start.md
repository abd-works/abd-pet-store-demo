# Slot 40 — Start (Run 2 Engineering — ATDD reviewer)

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "39"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
prior_executor_slot: 39
artifact_paths:
  - docs/planning/delivery-war-room/slot-39-finished.md
  - tests/find-store/locate-stores/locate-stores_client.test.tsx
  - tests/find-store/locate-stores/helpers/locate-stores.client.ts
  - tests/browse-product-catalog/search-and-filter-products/search-and-filter-products_server.test.ts
  - tests/browse-product-catalog/search-and-filter-products/search-and-filter-products_client.test.tsx
  - tests/browse-product-catalog/search-and-filter-products/helpers/
  - tests/browse-product-catalog/view-product-details/
  - tests/browse-product-catalog/browse-product-catalog_client.test.tsx
  - tests/manage-store-operations/manage-inventory/helpers/manage-inventory.client.ts
  - docs/story/specification-by-example/increment-1-specification-by-example.md
  - docs/architecture/architecture-reference.md
corrections: docs/corrections-log.md
entry_conditions_met:   - slot-39-finished.md exists
```

## Handoff

Review slot 39 ATDD executor output for Increment 1 walk-in driver. **Do not produce new stage artifacts.**

1. Read `slot-39-finished.md` and every artifact path listed.
2. Run scanners via `execute-skill-using-skills-rules`:

```powershell
python c:\dev\agilebydesign-skills\skills\skill-helpers\execute-skill-using-skills-rules\scripts\run_scanners.py --skill-root c:\dev\abd-pet-store-demo\.cursor\skills\abd-acceptance-test-driven-development --workspace c:\dev\abd-pet-store-demo
```

3. Validate engineering.md skill 3 exit items scoped to ATDD:
   - Acceptance tests exist for Increment 1 stories from spec-by-example
   - Test layout matches architecture reference (client/server tiers, helper pattern)
   - RED bar: note whether tests fail appropriately before GREEN implementation (slot 39 finished file reports all passing — document finding)
4. Confirm walk-in stock assertions use labels only (`In Stock` / `Out of Stock`), not raw counts on customer-facing surfaces (slot 38 ripple).
5. Write `slot-40-finished.md` using `slot-finished-reviewer.md` template.

## Filtered corrections

- Slot 36: visible `select product` affordance in tests if spec requires
- Slot 38: customer API must not expose raw stock counts for walk-in

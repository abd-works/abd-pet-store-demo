# Slot 39 — Start (Run 2 Engineering — ATDD)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "38"
run_scope: Increment 1 — walk-in driver
skills:
  - abd-acceptance-test-driven-development
  - mern-technical-architecture
corrections: docs/corrections-log.md
entry_conditions_met:
  - slot-38-finished.md — object model pair complete (scanner infra waived; manual PASS)
  - docs/domain/object-model.md
  - docs/story/specification-by-example/increment-1-specification-by-example.md
  - docs/architecture/architecture-reference.md
  - packages/*/shared/ typed surface
  - packages/app-client/ prototype (slot 35)
```

## Handoff

Write Increment 1 acceptance tests (RED) from spec-by-example + AC. Use mern-technical-architecture test layout per architecture reference. Refresh failing tests from prototype/object-model ripples:

- `locate-stores_client.test.tsx` — align to lo-fi/spec markup
- `search-and-filter-products` server tests — walk-in stock labels (`In Stock` / `Out of Stock`, no raw counts)

Tests must fail before clean-code slot implements GREEN. Run `npm test` from `conf/` and report status.

## Prior reviewer notes (incorporate)

- Slot 36: add visible `select product` affordance in tests if spec requires
- Slot 38: customer API must not expose raw stock counts for walk-in

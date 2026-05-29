# Slot 14 — Start

```yaml
team-role: engineer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "13"
run_scope: system-wide — review abd-architecture-blueprint artifacts from slot 13 only
skills:
  - abd-architecture-blueprint
prior_executor_slot: 13
artifact_paths:
  - docs/architecture/architecture-blueprint.md
  - docs/architecture/architecture-reference.md
  - docs/architecture/diagrams/component-overview.drawio
  - docs/architecture/diagrams/entity-relationships.drawio
  - docs/architecture/decisions/ADR-001-domain-first-mern-packages.md
  - docs/architecture/decisions/ADR-002-mongodb-persistence.md
  - docs/architecture/decisions/ADR-003-zod-api-validation.md
  - docs/architecture/decisions/ADR-004-vitest-playwright-test-tiers.md
corrections: docs/corrections-log.md — filter by Affects discovery + engineer + abd-architecture-blueprint
checkpoint: none
entry_conditions_met:
  - slot-13-finished.md on disk — abd-architecture-blueprint executor complete
  - docs/architecture/architecture-blueprint.md present
  - paired drawio sources present under docs/architecture/diagrams/
early_questions:   - artifact-missing: Any listed artifact path absent — STOP and write blocked.md
```

## Context

- **Prior executor:** slot 13 (`abd-architecture-blueprint`) — engineer, discovery, system-wide PawPlace MERN blueprint
- **Upstream for ripple checks:**
  - `docs/ux/information-architecture.md` — Increment 1 screens (catalog, detail, store locator, admin stock)
  - `docs/domain/ubiquitous-language.md` — bounded contexts and KAs
  - `docs/domain/object-model.md` — aggregates and ownership
  - `packages/` — Increment 1 MERN spike (product-catalog, store, app-server, app-client)
- **Executor flags (from slot-13-finished):**
  1. PNG export blocked — draw.io Desktop not installed; blueprint embeds PNG paths but files missing; drawio sources populated
  2. No architecture outline on disk — brownfield waiver documented in §1 Scope

## Filtered corrections

No blueprint-specific corrections yet. Honor cross-cutting discovery norms.

## Review scope

1. Run scanners: `abd-architecture-blueprint` via `execute-skill-using-skills-rules`
2. Validate discovery exit-gate items **scoped to architecture-blueprint** only (not SLO — slot 15+)
3. Ripple: blueprint components vs IA screens and packages layout; entity diagram vs object model; mechanism stubs vs reference index
4. Manual rule review: components-in-paragraphs, typed mechanisms, paired drawio (PNG waiver decision), no Extension section without seams
5. Write `slot-14-finished.md` per reviewer template — PASS/FAIL with findings

## Operator policy

Autonomous run — no mid-slot CHECKPOINT. Delivery lead chains slot 15 executor on PASS or rework on FAIL.

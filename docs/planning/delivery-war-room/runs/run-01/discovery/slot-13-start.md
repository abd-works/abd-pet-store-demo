# Slot 13 — Start

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "12"
run_scope: system-wide — PawPlace MERN architecture blueprint (all bounded contexts; Increment 1 modules implemented in packages/, future increments named as components)
skills:
  - abd-architecture-blueprint
corrections: docs/corrections-log.md — filter by Affects discovery + engineer + abd-architecture-blueprint
checkpoint: none
entry_conditions_met:
  - slot-12-finished.md on disk — abd-information-architecture reviewer PASS
  - docs/ux/information-architecture.md and .drawio present
  - docs/story/story-graph.json present and valid
  - docs/domain/ubiquitous-language.md present
  - packages/ MERN spike exists (product-catalog, store, app-server, app-client)
early_questions:
  - scope-unclear: Cannot name major systems or bounded contexts from domain + packages — STOP and write blocked.md
  - artifact-missing: IA or UL absent — STOP and write blocked.md
```

## Context

- **Prior pair complete:** abd-information-architecture (slots 11–12) — PASS; five customer screens + staff stock form for Increment 1
- **No architecture outline on disk** — brownfield waiver: synthesize major systems from `docs/domain/object-model.md`, `docs/domain/ubiquitous-language.md`, `packages/` layout, and IA screen inventory. Section 1 (Scope) must state outline is implicit from domain + MERN packages and defer platform/deployment detail to a future outline if needed.
- **Upstream artifacts:**
  - `docs/ux/information-architecture.md` — customer catalog/store locator flows; staff admin stock form
  - `docs/domain/ubiquitous-language.md` — Product Catalog, Store, Stock Availability, Store Employee KAs
  - `docs/domain/object-model.md` — full domain aggregates (catalog, store, orders, payments, pets, etc.)
  - `docs/story/thin-slicing.md` — nine increments; blueprint is system-wide, not slice-only
  - `packages/product-catalog/`, `packages/store/`, `packages/app-server/`, `packages/app-client/` — Increment 1 MERN spike (domain-first modules: shared/server/client per capability)
- **Decisions from prior slots:**
  - MERN stack, domain-first package layout per `mern-technical-architecture` skill conventions
  - Increment 1 has no cart, checkout, payment, or accounts — blueprint still names future components (orders, payments) as planned, not implemented
  - IA ↔ blueprint ripple: components must support catalog browse, store locator, stock display, staff stock update

## Filtered corrections

No blueprint-specific corrections yet. Honor cross-cutting discovery norms and brownfield story-map waivers (do not omit future bounded contexts named in object model).

## Deliverable

Produce per `abd-architecture-blueprint` skill (**system-wide PawPlace**):

| Artifact | Path |
|----------|------|
| Architecture blueprint | `docs/architecture/architecture-blueprint.md` |
| Component overview diagram | `docs/architecture/diagrams/component-overview.drawio` (+ PNG export) |
| Entity relationships diagram | `docs/architecture/diagrams/entity-relationships.drawio` (+ PNG export) |
| Blueprint-level ADRs | `docs/architecture/decisions/ADR-*.md` (continue numbering from 001 if no outline ADRs) |
| Reference stub | `docs/architecture/architecture-reference.md` (mechanism index — stubs only) |

Run `arch-drawio.ps1 init` and `export` from skill scripts folder. Components: at minimum Product Catalog, Store Locator, App Shell (client + server), and placeholder systems for later increments. Mechanisms: Security, Error Handling, Logging, Validation, Configuration, Persistence, Communication (REST), Testing tiers (Vitest + Playwright per conf/).

## For team member

Follow `_shared/executor-workflow.md (via role agent)` Steps 1–8. Scanners deferred to reviewer slot 14. No story-graph update required.

## Operator policy

Autonomous run — no mid-slot CHECKPOINT. Delivery lead chains reviewer slot 14 on finish.

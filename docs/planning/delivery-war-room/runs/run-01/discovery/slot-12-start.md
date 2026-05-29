# Slot 12 — Start

```yaml
team-role: ux-designer
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "11"
run_scope: increment-1 — review abd-information-architecture artifacts from slot 11 only
skills:
  - abd-information-architecture
prior_executor_slot: 11
artifact_paths:
  - docs/ux/information-architecture.md
  - docs/ux/information-architecture.drawio
corrections: docs/corrections-log.md — filter by Affects discovery + ux-designer + abd-information-architecture
checkpoint: none
entry_conditions_met:
  - slot-11-finished.md on disk — abd-information-architecture executor complete
  - docs/ux/information-architecture.md present
  - docs/ux/information-architecture.drawio present
early_questions:   - artifact-missing: Any listed artifact path absent — STOP and write blocked.md
```

## Context

- **Prior executor:** slot 11 (`abd-information-architecture`) — ux-designer, discovery, Increment 1 walk-in driver IA
- **Upstream for ripple checks:**
  - `docs/story/thin-slicing.md` — Increment 1 scope (no cart, checkout, payment, accounts)
  - `docs/story/story-graph.json` — 6 Increment 1 stories for traceability
  - `docs/domain/ubiquitous-language.md` — canonical domain terms
- **Executor self-review (from slot-11-finished):** all checks pass — Increment 1 only, five customer screens + staff stock form, tab siblings, eight transitions, six stories traced

## Filtered corrections

No IA-specific corrections yet. Honor cross-cutting discovery norms and brownfield story-map waivers (do not relax IA scope).

## Review scope

1. Run scanners: `abd-information-architecture` via `execute-skill-using-skills-rules` against `docs/ux/`
2. Validate discovery exit-gate items **scoped to IA** only (not blueprint/SLO — not yet run)
3. Ripple: IA vs thin-slicing Increment 1 scope; domain terms vs UL; md/drawio parity
4. Write `slot-12-finished.md` per reviewer template — PASS/FAIL with findings

## Operator policy

Autonomous run — no mid-slot CHECKPOINT. Delivery lead chains slot 13 (architecture blueprint executor) on PASS or rework on FAIL.

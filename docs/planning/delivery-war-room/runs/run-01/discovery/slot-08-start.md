# Slot 08 — Start

```yaml
team-role: product-owner
slot_type: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
depends_on:
  - "07"
run_scope: system-wide — review abd-story-mapping artifacts from slot 07 only
skills:
  - abd-story-mapping
  - drawio-story-sync
prior_executor_slot: 07
artifact_paths:
  - docs/story/story-map.md
  - docs/story/story-graph.json
  - docs/story/story-map.drawio
corrections: docs/corrections-log.md — filter by Affects discovery + product-owner + abd-story-mapping
checkpoint: none
entry_conditions_met:
  - slot-07-finished.md on disk — abd-story-mapping executor complete
  - docs/story/story-map.md present
  - docs/story/story-graph.json present and valid
early_questions:   - artifact-missing: Any listed artifact path absent — STOP and write blocked.md
```

## Context

- **Prior executor:** slot 07 (`abd-story-mapping` + `drawio-story-sync`) — product-owner, discovery, full-mode map refresh
- **Upstream for ripple checks:**
  - `docs/domain/ubiquitous-language.md` — canonical vocabulary (`customer pet` vs `pet profile`)
  - `docs/domain/domain-terms.md` — KA groupings
  - `docs/story/thin-slicing.md` — increment order (waived refresh in Run 1; flag label drift only)
- **Executor non-blocking flags (from slot-07-finished):**
  1. Store Employee `Update Pet Profile` — AC may be copied from customer flow; exploration fix
  2. Thin-slicing artifacts still use legacy customer pet labels — out of scope unless blocking map gate
  3. drawio-story-sync CLI render failed — outline updated manually; verify diagram vs graph

## Filtered corrections

### Ref traceability format (cross-cutting)

- **DO / DO NOT:** DO use full Ref block structure when citing sources. DO NOT regress prose-only citations.

## Review scope

1. Run scanners: `abd-story-mapping` (and `drawio-story-sync` if applicable) via `execute-skill-using-skills-rules`
2. Validate discovery exit-gate items **scoped to story-mapping** only (not IA/blueprint — not yet run)
3. Ripple: map vocabulary vs `ubiquitous-language.md`; graph validates via story-graph-ops
4. Write `slot-08-finished.md` per reviewer template — PASS/FAIL with findings

## Operator policy

Autonomous run — no mid-slot CHECKPOINT. Delivery lead chains next slot on PASS or rework on FAIL.

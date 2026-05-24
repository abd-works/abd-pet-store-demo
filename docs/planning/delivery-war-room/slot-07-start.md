# Slot 07 — Start

```yaml
team-role: product-owner
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — full story map refresh from docs/story/story-graph.json (10 epics, all stories); align naming to canonical domain terms
skills:
  - abd-story-mapping
  - drawio-story-sync
corrections: docs/corrections-log.md — filter by Affects discovery + product-owner + abd-story-mapping
checkpoint: after_slot
entry_conditions_met:
  - slot-06-finished.md on disk — abd-ubiquitous-language pair PASS (reviewer validated)
  - docs/domain/ubiquitous-language.md present with state: ubiquitous-language front matter
  - docs/domain/domain-terms.md present with state: domain-terms front matter
  - docs/story/story-graph.json present and valid (story_graph_cli read OK)
early_questions:
  - scope-unclear: Cannot reconcile story-graph epic count with domain KA map without documented gap — STOP and write blocked.md
  - term-conflict: customer pet vs pet profile naming cannot be applied consistently across map without operator decision — STOP and write blocked.md
```

## Context

- **Prior pair complete:** abd-ubiquitous-language (slots 05 executor → 06 reviewer PASS)
- **Upstream artifacts:**
  - `docs/domain/ubiquitous-language.md` — canonical vocabulary; supersedes `key-abstractions.md` for term choices
  - `docs/domain/domain.json` — machine-readable concepts (43 Terms-list concepts)
  - `docs/domain/domain-terms.md` — KA groupings and Ref traceability baseline
  - `docs/story/story-graph.json` — authoritative graph (10 epics, 65 stories)
  - `docs/story/story-map.md` — existing brownfield map (refresh target)
  - `docs/story/thin-slicing.md` — increment order authoritative; thin-slicing waived in Run 1
- **Decisions from prior slots:**
  - **`pet profile` vs `customer pet` resolved:** `pet profile` (Pet KA) = store animal online presentation; `customer pet` (Customer Account KA) = customer's own pet record for recommendations. Refresh story titles/labels where legacy map conflates these.
  - 8 core KAs + 2 boundary terms align to 10 story-graph epics
  - Ref format corrections confirmed — do not regress when citing domain terms in map context notes
  - UL supersedes `key-abstractions.md` for canonical vocabulary
- **Open questions (resolve or document in finished file):**
  1. **Story naming refresh** — executor slot 05 offered Story Map sync for `customer pet` vs legacy `pet profile` labels; apply during full-mode refresh where stories use outdated terms
  2. **Track Visit Outcomes stories** — empty AC in graph; keep stories, defer AC to exploration
  3. **drawio-story-sync** — refresh `docs/story/story-map.drawio` after map if graph/story-map.md changes (optional if no structural change)

## Filtered corrections

### Ref traceability format (cross-cutting — honor when citing sources)

- **Status:** confirmed
- **Affects:** stage: discovery · role: business-expert · skill: abd-domain-terms
- **DO / DO NOT:** DO use full Ref block structure when adding term references in supporting notes. DO NOT introduce prose-only citations where structured Ref is required.

### Boundary term owner field format

- **Status:** confirmed
- **Affects:** abd-domain-terms only — preserve boundary naming (`content`, `admin dashboard`) consistent with domain artifacts

## Non-blocking carry-forward from slot 06 reviewer (optional fixes)

1. Payment vendor subtype headings in UL — heading form only; does not block story map
2. `domain.json` — `customer pet` may omit `breed` attribute; align if map references pet attributes explicitly
3. Scanner infrastructure — abd-ubiquitous-language `_build_context()` fix deferred; not in scope for this slot

## Deliverable

Produce or refresh per `abd-story-mapping` skill (**full mode** — epics → sub-epics → stories):

| Artifact | Path |
|----------|------|
| Story map | `docs/story/story-map.md` |
| Story graph (if updated) | `docs/story/story-graph.json` via story-graph-ops |
| Story diagram (if map changes) | `docs/story/story-map.drawio` via `drawio-story-sync` |

Light refresh aligned to canonical UL terms — reconcile legacy `pet profile` / `customer pet` naming in story titles where the graph allows. Do not restructure epics unless domain alignment requires documented gap.

## For team member

Follow `delivery-team-member/AGENT.md` Steps 1–8. Scanners deferred to reviewer slot 08.

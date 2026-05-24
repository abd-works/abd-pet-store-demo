# Slot 05 — Start

```yaml
team-role: business-expert
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — refresh ubiquitous language from domain-terms.md and existing domain artifacts
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
corrections: docs/corrections-log.md — filter by Affects discovery + business-expert + abd-ubiquitous-language
checkpoint: after_slot
entry_conditions_met:
  - slot-04-finished.md on disk — abd-domain-terms pair PASS (rework validated)
  - docs/domain/domain-terms.md present with state: domain-terms front matter
  - docs/domain/key-abstractions.md, crc.md, object-model.md exist (brownfield baseline)
early_questions:
  - scope-unclear: Cannot reconcile domain-terms KA groupings with key-abstractions without documented gap — STOP and write blocked.md
  - term-conflict: pet profile vs customer pet — no defensible canonical choice after domain-terms review — STOP and write blocked.md
```

## Context

- **Prior pair complete:** abd-domain-terms (slots 01 → 02 FAIL → 03 rework → 04 PASS)
- **Upstream artifacts:**
  - `docs/domain/domain-terms.md` — authoritative term grouping and Ref traceability (slot 03 rework)
  - `docs/domain/key-abstractions.md` — prior domain-sketch state; may be superseded or merged by UL output
  - `docs/domain/crc.md`, `docs/domain/object-model.md` — brownfield references
  - `docs/story/story-graph.json` — 10 epics, 65 stories (validated)
  - `story/thin-slicing.md` — increment order authoritative; thin-slicing waived in Run 1
- **Decisions from prior slots:**
  - 8 core KAs + 2 boundary terms (`content`, `admin dashboard`) align to 10 story-graph epics
  - Gap terms documented in domain-terms (9 terms + naming collision note)
  - Ref format corrections confirmed — full `**Ref —**` blocks required for all terms
- **Open questions (resolve or document in finished file):**
  1. **`pet profile` vs `customer pet`** — confirm canonical naming in UL (flagged slots 03/04)
  2. **Visit outcome terms in CRC** — optional CRC sync; not blocking
  3. **Story-graph gap terms** — Track Visit Outcomes stories have empty AC; defer detail to exploration
  4. **key-abstractions.md relationship** — clarify whether UL supersedes, merges, or references it

## Filtered corrections

### Ref traceability format (cross-cutting — honor when citing terms)

- **Status:** confirmed
- **Affects:** abd-domain-terms; UL should not regress Ref discipline when adding behavior sketches
- **DO / DO NOT:** DO use full Ref block structure when adding new term references. DO NOT introduce prose-only citations for terms that require traceability.

### Boundary term owner field format

- **Status:** confirmed
- **Affects:** abd-domain-terms only — preserve `Owned by:` format if UL references boundary terms

## Deliverable

Produce or refresh per `abd-ubiquitous-language` skill:

| Artifact | Path |
|----------|------|
| Ubiquitous language | `docs/domain/ubiquitous-language.md` |
| Domain diagram (optional) | `docs/domain/ubiquitous-language.drawio` via `drawio-domain-sync` |

Light refresh aligned to `domain-terms.md` KA groupings — do not rewrite domain from scratch unless gaps are documented in finished file. Resolve `pet profile` vs `customer pet` naming if possible.

## For team member

Follow `delivery-team-member/AGENT.md` Steps 1–8. Scanners deferred to reviewer slot 06.

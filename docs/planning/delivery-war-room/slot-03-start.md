# Slot 03 — Start (rework)

```yaml
team-role: business-expert
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — rework abd-domain-terms Ref format only (same scope as slot 01)
skills:
  - abd-domain-terms
rework: true
prior_reviewer_slot: 02
prior_executor_slot: 01
artifact_paths:
  - docs/domain/domain-terms.md
corrections: docs/corrections-log.md — filter by Affects discovery + abd-domain-terms
checkpoint: after_slot
entry_conditions_met:
  - slot-02-finished.md reports FAIL — rework required before abd-ubiquitous-language
  - docs/domain/domain-terms.md present (edit in place; do not regenerate from scratch)
early_questions:
  - scope-creep: Rework expands beyond Ref format fixes into new terms or KA restructuring — STOP and write blocked.md
  - source-unavailable: Cannot locate verbatim extract for a gap term in story-graph or CRC — document in finished file and flag delivery lead
```

## Context

- **Rework trigger:** Reviewer slot 02 FAIL — 8 terms lack full Ref format; mechanical scanners crashed (infrastructure — do not fix scanners in this slot)
- **Artifact to fix:** `docs/domain/domain-terms.md` — edit in place
- **Do not change:** KA grouping, epic coverage, term definitions, gap documentation, `pet profile` / `customer pet` disambiguation (defer naming confirmation to ubiquitous-language pass after this pair passes review)

## Required fixes (from slot-02-finished.md)

Add full `**Ref — title**` / `Source:` / `Locator:` / `Extract:` and fenced `source` block for:

1. `pet source`
2. `pet lineage`
3. `visit outcome`
4. `check-in`
5. `no-show`
6. `follow-up action`
7. `cart item`
8. `order line item`

**Source guidance:**

- Story-graph gap terms → pull verbatim AC or story description from `docs/story/story-graph.json`
- CRC-derived terms → quote relevant CRC or requirements passage from existing domain docs

**Optional (if time permits):** align boundary term owner format to `Owned by:` field line per corrections log.

## Filtered corrections

### Ref traceability format for gap and CRC-derived terms

- **DO / DO NOT:** DO use full Ref block structure for every term — including gap and CRC-derived terms. DO NOT use prose-only References.
- **Example (wrong):** Prose-only References for the 8 terms listed above.
- **Status:** open — fix in this slot

### Boundary term owner field format

- **DO / DO NOT:** DO use `Owned by: <Module>` field line after heading when aligning to scanner rules.
- **Status:** open — optional in this slot; required if reviewer re-runs scanners after infrastructure fix

## Open questions (carry forward — do not resolve in rework)

1. **`pet profile` vs `customer pet`** — confirm at ubiquitous-language slot after this pair passes
2. **Visit outcome terms in CRC** — optional future CRC sync; not blocking this rework

## Deliverable

Write `slot-03-finished.md` per `templates/slot-finished.md`:

- Updated `docs/domain/domain-terms.md` with Ref fixes
- Self-review against `abd-domain-terms` rules (refs-per-term)
- Scanners deferred to slot 04 reviewer (next slot after this rework executor)

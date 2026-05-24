# Slot 04 — Start (reviewer)

```yaml
team-role: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — re-review abd-domain-terms after rework slot 03 (same scope as slots 01/03)
skills: []
prior_executor_slot: 03
prior_reviewer_slot: 02
artifact_paths:
  - docs/domain/domain-terms.md
corrections: docs/corrections-log.md — filter by Affects discovery + abd-domain-terms
checkpoint: after_slot
entry_conditions_met:
  - slot-03-finished.md on disk — rework executor complete
  - docs/domain/domain-terms.md updated in place with Ref format fixes for 8 terms
early_questions:
  - scope-creep: Review expands into new artifact production — STOP and write blocked.md
```

## Context

- **Review trigger:** Rework executor slot 03 finished — re-validate `abd-domain-terms` pair before proceeding to `abd-ubiquitous-language`
- **Prior reviewer:** slot 02 FAIL — 8 Ref format gaps + scanner crash (infrastructure)
- **Rework executor:** slot 03 — fixed Ref format for `pet source`, `pet lineage`, `visit outcome`, `check-in`, `no-show`, `follow-up action`, `cart item`, `order line item`; optional boundary `Owned by:` format applied
- **Delivery lead pre-check (slot 03):** PASS on rework scope — all 8 terms have `**Ref —**` + Source/Locator/Extract + fenced `source` block; scope preserved (KA grouping, epic coverage, definitions unchanged)

## Scanner guidance

Run:

```bash
python skills/skill-helpers/execute-skill-using-skills-rules/scripts/run_scanners.py \
  --skill-root <abd-domain-terms skill root> \
  --workspace c:\dev\abd-pet-store-demo
```

**Known infrastructure notes (from delivery lead pre-check):**

1. `_build_context()` crash from slot 02 appears **fixed** — scanners execute now
2. Path resolution finds `docs/domain/domain-terms.md` correctly
3. **`refs-per-term-scanner.py` misparses** — reports false negatives on terms that have Ref blocks (including the 8 reworked terms); also picks up CRC headings inside fenced `source` blocks as spurious terms (`### **Pet Source**`, etc.)
4. If mechanical refs-per-term fails, **supplement with manual AI review** against `rules/refs-per-term.md` scoped to the **8 reworked terms** plus any new violations found
5. `boundary-terms-have-owner-scanner.py` **PASS** in pre-check; `terms-in-partition-order-scanner.py` **N/A** (no module-partition file)

## Exit-gate review scope

Reference: `.cursor/content/stages/discovery.md` — items scoped to `abd-domain-terms` / `domain-terms.md` only (not full discovery stage gate)

| Gate item | Focus |
|-----------|-------|
| Scanners green for `abd-domain-terms` | Run all 3; record pass/fail; manual supplement if refs-per-term misparses |
| KA coverage vs story-graph epics | Confirm unchanged from slot 02 PASS |
| Ref format on 8 reworked terms | Must PASS — primary rework validation |
| `state: domain-terms` front matter | Confirm present |
| Independence / module-fit decisions | Confirm present per term |
| Boundary terms owner format | Confirm `Owned by:` field lines if applicable |
| Gaps documented | Confirm unchanged from slot 01/02 PASS |

## Filtered corrections (confirmed — verify not regressed)

### Ref traceability format for gap and CRC-derived terms

- **Status:** confirmed (slot 03)
- **DO / DO NOT:** DO use full Ref block structure for every term. DO NOT use prose-only References.
- **Verify:** 8 reworked terms still have full Ref blocks

### Boundary term owner field format

- **Status:** confirmed (slot 03)
- **DO / DO NOT:** DO use `Owned by: <Module>` field line after heading
- **Verify:** `content` and `admin dashboard` boundary terms

## Open questions (flag only — not blockers unless regressed)

1. **`pet profile` vs `customer pet`** — defer canonical naming confirmation to ubiquitous-language executor slot (after this pair passes)
2. **Visit outcome terms in CRC** — optional future CRC sync; not blocking
3. **Story-graph gap terms** — Track Visit Outcomes stories have empty `acceptance_criteria`; Ref extracts use verbatim story JSON until exploration

## Deliverable

Write `slot-04-finished.md` per `templates/slot-finished-reviewer.md`:

- Scanner results (mechanical + manual supplement if needed)
- Exit-gate review scoped to `abd-domain-terms`
- PASS → delivery lead chains ubiquitous-language executor slot 05
- FAIL → delivery lead logs corrections and authors rework executor slot

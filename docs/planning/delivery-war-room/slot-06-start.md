# Slot 06 — Start (reviewer)

```yaml
team-role: reviewer
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — review abd-ubiquitous-language artifacts from executor slot 05
skills: []
prior_executor_slot: 05
artifact_paths:
  - docs/domain/ubiquitous-language.md
  - docs/domain/domain.json
corrections: docs/corrections-log.md — filter by Affects discovery + business-expert + abd-ubiquitous-language
checkpoint: after_slot
entry_conditions_met:
  - slot-05-finished.md on disk — abd-ubiquitous-language executor complete
  - docs/domain/ubiquitous-language.md present with state: ubiquitous-language front matter
  - docs/domain/domain.json present (machine-readable vocabulary)
early_questions:
  - scope-creep: Review expands into new artifact production — STOP and write blocked.md
```

## Context

- **Review trigger:** Executor slot 05 finished — validate `abd-ubiquitous-language` pair before proceeding to `abd-story-mapping`
- **Prior pair complete:** abd-domain-terms (slots 01 → 02 FAIL → 03 rework → 04 PASS)
- **Executor deliverables:**
  - `docs/domain/ubiquitous-language.md` — light refresh aligned to `domain-terms.md` KA groupings
  - `docs/domain/domain.json` — machine-readable concepts extracted from UL
  - `docs/domain/ubiquitous-language.drawio` — **not produced** (optional per slot 05 start; N/A for scanners)
- **Delivery lead pre-check (slot 05):** PASS on executor scope — artifacts present; 8 core KAs + 2 boundary terms; `pet profile` vs `customer pet` resolved in Decisions made; UL supersedes `key-abstractions.md` for canonical vocabulary; Ref discipline preserved; scanners deferred to this slot

## Scanner guidance

Run:

```bash
python skills/skill-helpers/execute-skill-using-skills-rules/scripts/run_scanners.py \
  --skill-root <abd-ubiquitous-language skill root> \
  --workspace c:\dev\abd-pet-store-demo
```

**Practice skills in scope:**

| Skill | Scanners | Notes |
|-------|----------|-------|
| abd-ubiquitous-language | `domain-terms-coverage-scanner.py`, `no-premature-design-commitments-scanner.py` | Primary validation |
| drawio-domain-sync | N/A | Diagram not produced in slot 05 |

**Known infrastructure notes (from prior pairs):**

1. `refs-per-term` misparsing on `domain-terms.md` does **not** apply to UL — validate UL Ref blocks via skill rules + manual review if needed
2. Ref format correction from slot 02/03/04 still applies when reviewing UL `### References` sections — full `**Ref —**` structure required

## Exit-gate review scope

Reference: `.cursor/content/stages/discovery.md` — items scoped to `abd-ubiquitous-language` / `ubiquitous-language.md` only (not full discovery stage gate)

| Gate item | Focus |
|-----------|-------|
| Scanners green for `abd-ubiquitous-language` | Run both scanners; record pass/fail |
| KA groupings consistent with `domain-terms.md` | 8 core KAs + 2 boundary terms; term placement unchanged |
| Behavior sketches with verb-led bullets | Each concept has behavior; invariants explicit where required |
| Independence / scope-fit decisions | `### Decisions made` per KA including boundary |
| `pet profile` vs `customer pet` canonical naming | Must PASS — resolved in Pet and Customer Account Decisions made |
| `domain.json` concepts align with named terms | Every UL term represented; attributes reasonable |
| Ref traceability not regressed | Honor confirmed corrections from domain-terms pair |
| `state: ubiquitous-language` front matter | Confirm present |

## Filtered corrections (confirmed — verify not regressed)

### Ref traceability format (cross-cutting)

- **Status:** confirmed
- **Affects:** abd-domain-terms; UL should not regress Ref discipline when adding behavior sketches
- **DO / DO NOT:** DO use full Ref block structure when adding new term references. DO NOT introduce prose-only citations for terms that require traceability.
- **Verify:** UL `### References` sections under each KA use structured Ref blocks where source material is cited

### Boundary term owner format

- **Status:** confirmed
- **Affects:** abd-domain-terms only — preserve `Owned by:` format if UL references boundary terms
- **Verify:** `content` and `admin dashboard` boundary entries name owning modules

## Open questions (flag only — not blockers unless regressed)

1. **Visit outcome terms in CRC** — optional future CRC sync; gap terms documented under Appointment References
2. **Story-graph gap terms** — Track Visit Outcomes stories have empty AC; defer to exploration
3. **drawio-domain-sync** — optional render if operator wants diagram before story-mapping; not blocking
4. **Sync-upstream offer from executor** — story map naming may need refresh for `customer pet` vs legacy `pet profile` labels (defer to PO slot after this pair passes)

## Deliverable

Write `slot-06-finished.md` per `templates/slot-finished-reviewer.md`:

- Scanner results (mechanical + manual supplement if needed)
- Exit-gate review scoped to `abd-ubiquitous-language`
- PASS → delivery lead chains story-mapping executor slot 07
- FAIL → delivery lead logs corrections and authors rework executor slot

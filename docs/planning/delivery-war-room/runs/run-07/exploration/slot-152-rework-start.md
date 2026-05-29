# Slot 152-rework — Start (Run 7 — Increment 6: Pet visits — Architecture template rework executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "152"
run_scope: Increment 6 — Pet visits (architecture reference rework — blocker + minor finding from slot-152-finished.md)
skills:
  - abd-architecture-template
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
rework_for_slot: "152"
```

Two targeted fixes to `docs/architecture/architecture-reference.md`. Do not re-write the document — make surgical edits only.

## Fix B1 — Delete duplicate draft mechanism sections (BLOCKER)

The document currently has all four Increment 6 mechanisms appearing **twice**:
- Draft set: approximately lines 3791–4382
- Final set: approximately lines 4384–4999

**Action:** Delete the draft set (the first occurrence of each of the four mechanisms). The final set (second occurrence) is the authoritative version and must be kept intact. Verify after deletion that each of the four mechanism headings appears exactly once in the document:
- `## Pet Catalog`
- `## Adoption Appointment Lifecycle`
- `## Staff Appointment Workflow`
- `## Transactional Appointment Notification`

Also confirm the TOC links for these four sections resolve correctly after deletion.

## Fix M1 — Reconcile findAvailable vs findAll in Pet Catalog (MINOR)

In the **final** Pet Catalog mechanism section (the one being kept), the walkthrough and code sample use `findAvailable` which filters to available-only pets. The intended behavior per AC is: return pets of **all statuses**; the client renders adopted pets with a badge.

**Action:** In the Pet Catalog walkthrough steps and TypeScript code sample, replace `findAvailable` with `findAll` (or equivalent all-status query method). Add a comment or note in the walkthrough clarifying that the API returns all statuses and the client applies the `Adopted` badge rendering.

## Scope guard

Edit only the two locations above. Do not alter any other mechanism sections, Increment 1–5 content, or document structure outside the affected sections.

Write `slot-152-rework-finished.md` when both fixes are applied and verified.

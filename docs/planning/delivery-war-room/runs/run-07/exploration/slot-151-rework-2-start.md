# Slot 151-rework-2 — Start (Run 7 — Increment 6: Pet visits — Architecture template micro-rework)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "152-re-review"
run_scope: Increment 6 — Pet visits (two-line fix — Pet Catalog mechanism only)
skills:
  - abd-architecture-template
corrections: docs/corrections-log.md — filter by stage: exploration · role: engineer · run: Run 7
checkpoint: none
entry_conditions_met:
  - slot-152-re-review-finished.md exists (Overall gate: FAIL — M1 findAvailable not replaced)
prior_executor_slot: 151-rework
reviewer_slot: 152-re-review
```

**Two targeted line edits only. Do NOT touch any other mechanism, any Increment 1–5 content, or document structure.**

## Fix M1 — Pet Catalog: findAvailable → findAll

**File:** `docs/architecture/architecture-reference.md`

**Edit 1 — Line 3878 (walkthrough step 4):**

Replace:
> returns only pets with `lifecycleState: available` AND `species: dog`

With:
> returns pets of **all lifecycle states** (`available`, `adopted`) with `species: dog`; the client renders adopted pets with an "Adopted" badge and suppresses the "Book a Visit" CTA for adopted entries

**Edit 2 — Line 3895 (code sample):**

Replace:
```typescript
const pets = await this.petRepository.findAvailable(species);
```

With:
```typescript
const pets = await this.petRepository.findAll(species);
```

(Use `findAll(species)` or `findBySpecies(species)` — whichever matches the repository interface; the semantic intent is all-status query.)

**After edits, verify:**
- Line 3878 no longer mentions `lifecycleState: available` filtering
- Line 3895 calls `findAll` (not `findAvailable`)
- No other lines in the Pet Catalog section or elsewhere were changed

Write `slot-151-rework-2-finished.md`.

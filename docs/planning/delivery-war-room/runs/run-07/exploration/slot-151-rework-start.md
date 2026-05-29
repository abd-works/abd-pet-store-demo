# Slot 151-rework — Start (Run 7 — Increment 6: Pet visits — Architecture template rework executor)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "152"
run_scope: Increment 6 — Pet visits (targeted fix — remove duplicate mechanism sections)
skills:
  - abd-architecture-template
corrections: docs/corrections-log.md — filter by stage: exploration · role: engineer · run: Run 7
checkpoint: none
entry_conditions_met:
  - slot-152-finished.md exists (Overall gate: FAIL — duplicate mechanism sections)
prior_executor_slot: 151
reviewer_slot: 152
```

**One targeted fix only. Do NOT rewrite mechanism content — remove the duplicate first pass only.**

## Fix — Remove duplicate mechanism sections

**File:** `docs/architecture/architecture-reference.md`

**Action:** Delete the first (weaker) set of Increment 6 mechanism sections at approximately lines 3791–4382. The second set (approximately lines 4384–5000) is the correct, complete version — keep it intact.

The second set passes all seven `abd-architecture-template` rules:
- Walkthroughs: 9–10 numbered steps, each naming the participant
- Code: constructor injection, domain error types, no Manager/Handler anti-patterns
- Tests: class-per-story Given/When/Then helpers
- Diagrams: Mermaid sequence diagrams + four-column participant tables

**After deletion, verify:**
- Each of the four mechanisms appears exactly once: Pet Catalog, Adoption Appointment Lifecycle, Staff Appointment Workflow, Transactional Appointment Notification
- The TOC entries still resolve to the correct (single) heading locations
- Increments 1–5 mechanisms are untouched
- File is valid Markdown (no broken headings or orphaned content)

Write `slot-151-rework-finished.md`.

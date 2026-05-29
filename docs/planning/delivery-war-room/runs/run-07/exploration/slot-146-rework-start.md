# Slot 146-rework — Start (Run 7 — Increment 6: Pet visits — UL rework executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "146"
run_scope: Increment 6 — Pet visits (targeted UL rework — two findings from reviewer slot 146)
skills:
  - abd-ubiquitous-language
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
rework_for_slot: "146"
```

Two targeted fixes to `docs/domain/ubiquitous-language.md` per reviewer slot 146 findings. Do not re-generate the full document — apply surgical edits only.

## Fix 1 — Italicize `check-in` in `staff appointments view` block (rule violation)

In `docs/domain/ubiquitous-language.md`, locate the `### staff appointments view` concept block. Find:

```
- supports check-in, *visit outcome* recording, and *no-show* marking from within the view
```

Replace with:

```
- supports *check-in*, *visit outcome* recording, and *no-show* marking from within the view
```

Rule: `domain-terms-italicized-in-prose-and-bullets` — every named domain term must be italicized in every occurrence.

## Fix 2 — Update Customer Account KA for Increment 6 live state (prose gap)

In `docs/domain/ubiquitous-language.md`, locate the Customer Account KA intro paragraph. Change the "in later increments" deferred language:

- **KA intro paragraph:** Change `"and (in later increments) *appointment* history"` → `"and *appointment* history (live from Increment 6)"`
- **`### customer account` aggregation bullet:** Add `*appointment* history` to the aggregation list, e.g.:
  `"- aggregates *order history*, *appointment* history, *wishlist*, *address book*, *saved payment method*, and preferred *store*"`
  (Italicize `*appointment*` since it resolves to a named concept block.)

Rule: KA intro and concept block must reflect current-increment state — do not leave deferred language once the increment is live.

## Scope guard

Edit only the two locations above. Do not alter any other concept blocks, term definitions, or prior-increment content.

Write `slot-146-rework-finished.md` when both fixes are applied.

# Slot 171-rework — Start (Run 8 — Increment 7: Returns and refunds — UL rework)

```yaml
team-role: business-expert
slot_type: executor
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
ticket_run: 8
stage: exploration
depends_on:
  - "172"
run_scope: Increment 7 — returns and refunds
skills:
  - abd-ubiquitous-language
rework_reason: "Slot 172 reviewer FAIL — ~60-80 un-italicized domain terms in Increment 7 content"
checkpoint: none
```

## Rework instructions

Slot 172 reviewer reported FAIL on two gate items:

1. **Scanner FAIL (domain-terms-coverage):** ~60-80 un-italicized domain term occurrences in the new Increment 7 sections of `docs/domain/ubiquitous-language.md`. Most frequent offenders: `payment` (~30), `refund` (~20), `notification` (~20), `payment vendor` (~6), `refund status` (~3), `refund retry` (~2), `payment confirmation` (~2).

2. **Corrections-log entry 1 not fully applied:** "DO italicize every named domain term in every prose paragraph and behavior bullet." The new content (Order return concepts lines 1022–1110, Payment refund concepts lines 1268–1435, Notification return/refund concepts lines 1547–1660) still has bare domain terms.

**Scope of fix:** Only the NEW Increment 7 content (lines ~1022–1660 approximately). Do NOT fix pre-existing Increment 1–6 debt (~400+ warnings) — that is out of scope for this rework.

**What to do:**
1. Read `docs/domain/ubiquitous-language.md`
2. In the Increment 7 sections (Order return concepts, Payment refund concepts, Notification return/refund concepts, Product Catalog restocking), wrap every named domain term in `*term*` italic markup
3. Run the scanner: `python .cursor/skills/execute-skill-using-skills-rules/scripts/run_scanners.py --skill-root .cursor/skills/abd-ubiquitous-language --workspace docs/domain`
4. Verify the new-content warnings are resolved (pre-existing Inc 1-6 debt is acceptable)

Write `slot-171-rework-finished.md` to `docs/planning/delivery-war-room/`.

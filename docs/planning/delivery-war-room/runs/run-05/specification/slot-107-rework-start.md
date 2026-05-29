# Slot 107 — Rework Start (Run 5 Specification — Increment 4 walkthrough rework)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: specification
depends_on:
  - "106"
run_scope: rework — Increment 4 walkthrough (slot 106 findings)
skills:
  - abd-scenario-walkthrough
prior_executor_slot: 105
rework_for_reviewer_slot: 106
corrections: docs/corrections-log.md
checkpoint: none
entry_conditions_met:   - slot-106-finished.md FAIL — 3 corrections logged
```

## Rework trigger (slot 106 FAIL)

Fix `docs/domain/increment-4-walkthrough.md` only:

1. **CRC trace** — Map every domain-logic pseudocode call to a CRC class + responsibility from `docs/domain/crc.md`, OR record explicit GAP under the relevant KA `### decisions made`. Replace invented ops: `VerificationLink.handleClick()`, `session.evaluate()`, `PaymentStep.renderSavedMethods()`, `Wishlist.attemptAddAsGuest()`, `AddressBook.setDefaultAddress()` / `book.remove()` without CRC owners.
2. **Reset Password used-link** — Add walk for spec Scenario Outline 2 *used* reset link (`expected_message: link already used`); Walk 4 currently covers expired only.
3. **Formal Scope block** — Add `## Scope` with epic `Returning customers - accounts, history, reorder` (exact from `docs/story/story-graph.json`) and all 16 story names.
4. **Optional** — Verify Email Walk 2: align `oneTimeUseFlag` with spec boolean *used* semantics.

## Do NOT

- Break existing walk coverage for other stories
- Run scanners (reviewer job)

Write `slot-107-rework-finished.md`.

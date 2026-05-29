# Slot 93 — Start (Run 5 Exploration — Increment 4 UL executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: exploration
depends_on:
  - "92"
run_scope: Increment 4 — Returning customers (15 stories)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
corrections: docs/corrections-log.md — filter exploration + business-expert + Increment 4
checkpoint: none
entry_conditions_met:
  - slot-92-finished.md PASS
  - Run 4 complete (Increment 3 ship-to-home)
  - docs/domain/ubiquitous-language.md exists (refresh for Increment 4)
  - story/story-graph.json valid
```

## Increment 4 scope (from thin-slicing)

Returning customers: accounts, saved addresses/payment methods, order history, wishlist, reorder. Stories *Register Account* through *Reorder Previous Purchase* (15 stories).

Refresh ubiquitous language for Increment 4 concepts:
- Customer account, session, verification
- Saved address, saved payment method
- Wishlist, order history, reorder

Render/update `docs/domain/ubiquitous-language.drawio` via drawio-domain-sync.

**DO NOT** implement production code — exploration UL only. Preserve guest checkout and Increment 1–3 terms.

Write `slot-93-finished.md`.

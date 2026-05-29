# Slot 145 — Start (Run 7 — Increment 6: Pet visits — UL executor)

```yaml
team-role: business-expert
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
depends_on:
  - "136"
run_scope: Increment 6 — Pet visits (pet gallery, adoption appointments, staff workflow, transactional reminders)
skills:
  - abd-ubiquitous-language
  - drawio-domain-sync
corrections: docs/corrections-log.md — filter by stage + Increment 6
checkpoint: none
entry_conditions_met:
  - slot-136-finished.md exists
  - Run 6 specification exit (slot 136) — parallel to Run 6 engineering complete (slot 144)
  - story/story-graph.json valid
```

Opens after Run 6 specification exit (slot 136). Run 6 engineering is now also complete (282/282 tests — slot 144).

Refresh ubiquitous language for Increment 6: pet (adoption), appointment, visit outcome, species, availability slot, staff workflow, transactional notification.

Stories: *Browse Pets by Species*, *View Pet Profile*, *Request Adoption Appointment*, *Confirm or Cancel Appointment*, *Conduct Staff Visit*, *Record Visit Outcome*, *Send Visit Follow-Up Notification*, and all 19 stories listed under Increment 6 in `story/thin-slicing.md`.

Render/update `docs/domain/ubiquitous-language.drawio` via drawio-domain-sync.

**DO NOT** implement production code — exploration UL only. Preserve Increments 1–5 terms (products, cart, order, payment vendors, customer account, wishlist).

Write `slot-145-finished.md`.

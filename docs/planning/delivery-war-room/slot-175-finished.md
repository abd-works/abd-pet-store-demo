# Slot 175 — Finished (Run 8 — Increment 7: Returns and refunds — UX mockup executor)

**Timestamp:** 2026-05-27T21:48:00Z
**Stage:** exploration
**Role:** executor (`slot_type: executor`; `team-role: ux-designer`)
**Practice skill:** abd-ux-mockup

## Artifacts produced

| Artifact | Path |
|----------|------|
| State JSON | `docs/ux/lo-fi/increment-7-returns-refunds-state.json` |
| Lo-fi spec | `docs/ux/lo-fi/increment-7-returns-refunds.md` |
| DrawIO wireframe | `docs/ux/lo-fi/increment-7-returns-refunds.drawio` |

## Summary

7 lo-fi screens covering the full Increment 7 returns and refunds scope:

**Customer flow (4 screens):**
1. **customer account — order history with return** — extends Increment 4 order history with Return action on eligible orders; ineligible state and partial return indicators
2. **initiate return — select items** — item selection with quantities, return reason, item condition; conditional damaged item detail (description + photo upload); partial return blocking
3. **return confirmation — label and QR code** — return reference, downloadable PDF label, mobile QR code display, email confirmation, label unavailable fallback
4. **order detail — return and refund tracking** — return status timeline (7 lifecycle states), refund status (processing/completed/requires review), timing expectation, support escalation, partial return affordance

**Staff flow (2 screens):**
5. **staff — order lookup for return** — order lookup by number or email, guest order support, Start Return action
6. **staff — process in-store return** — item selector, reason/condition, ineligibility with Manager Override, manager approval gate, return recorded confirmation

**Notifications (1 screen):**
7. **notification preview — return and refund updates** — tabs for return received, refund completed, refund under review; email resilience note

All 6 Increment 7 stories covered. All 26 AC clauses traced in affordance table. 6 connections between screens.

## Scanner validation

scanner_validation: deferred to reviewer slot

## Stage skill unit

Executor UX mockup complete for Increment 7. Ticket moves toward review on board sync.

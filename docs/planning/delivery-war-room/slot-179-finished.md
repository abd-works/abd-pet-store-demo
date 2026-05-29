# Slot 179 — Finished (Run 8 — Increment 7: Returns and refunds — CRC executor)

**Timestamp:** 2026-05-28T12:49:00Z
**Stage:** specification
**Role:** business-expert (`slot_type: executor`)
**Skill:** abd-class-responsibility-collaborator
**Run scope:** Increment 7 — Returns and refunds

## Artifacts produced

| Artifact | Path |
|----------|------|
| CRC model (refreshed) | `docs/domain/crc.md` |
| Domain vocabulary (refreshed) | `docs/domain/domain.json` |

## Summary of changes

### Order KA
- **Return** fully elaborated from deferred stub to full lifecycle: originating order, initiating party, return request, returned items, return status, return label, return QR code, partial return support, refund routing invariant, customer account reflection.
- **Return Request** introduced — captures selected order line items, quantities, return reason; creates return record against eligible orders.
- **Return Eligibility** introduced — evaluates per-item eligibility against return window; hides or disables return action when ineligible.
- **Return Window** introduced — configured period anchored to delivery or collection date; category-specific variation.
- **Return Reason** introduced — reason category (wrong size, damaged in transit, not as described, changed mind, other); inspection policy hint for auto-approval.
- **Returned Items** introduced — order line item references with returned quantities; per-item return status tracking; triggers restocking on inspection pass.
- **Return Status** introduced — lifecycle state (initiated → label generated → shipped back → received → inspected → refund processing → completed); triggers return received notification on warehouse receipt.
- **Return Label** introduced — printable PDF with return address, order number, return reference, carrier barcode.
- **Return QR Code** introduced — mobile-displayable code encoding same return reference as label.
- **In-Store Return** introduced — order lookup by number or email, store employee initiator, guest order support, same refund routing invariant.
- **Manager Override** introduced — staff escalation for blocked in-store returns, explicit manager approval, audit trail recording.
- **Restocking** introduced — replenishment of returned items to stock availability after inspection pass.
- **Order** entry-point responsibility activated — "Return" action gated by return eligibility.

### Payment KA
- **Refund** fully activated from Increment 5 foundation — triggered by return completion, routes through original payment vendor, handles vendor failure via refund retry, escalates to "requires review" on exhaustion.
- **Refund Status** introduced — lifecycle state (processing, completed, requires review); triggers refund completed and refund under review notifications; timing expectation note; "refund failed" never shown to customer.
- **Refund Retry** introduced — automatic retry through same vendor on temporary unavailability; transitions refund status to "requires review" on exhaustion.
- **Payment** refund routing responsibility activated — supersedes "foundation for Increment 7" language.
- **Payment Vendor** "process refund" responsibility activated — all three vendor refund APIs routable.

### Notification KA
- **Return Received Notification** introduced — fires when return status transitions to "received"; includes order number and returned items summary.
- **Refund Completed Notification** introduced — fires when refund status transitions to "completed"; includes refunded amount and masked payment method.
- **Refund Under Review Notification** introduced — fires when refund status transitions to "requires review"; includes support guidance.
- **Notification** triggering event updated for Increment 7 paths; all three new types support both customer account and guest email recipient paths.

### Boundary Domain
- **Admin Dashboard** — in-store return lookup surface added (order search, return eligibility view, return initiation, manager override).

### Front matter and vocabulary
- State marker: `crc`; increment scope: Increment 7; specification refresh: Run 8 slot 179.
- Core terms and KA groupings updated with all new Increment 7 concepts.
- `domain.json` updated with CRC-level attributes for all refreshed concepts.

## Scanner validation

`scanner_validation: deferred to reviewer slot`

## Executor gate

Executor slot 179 complete — ticket moves toward **review** on board sync.

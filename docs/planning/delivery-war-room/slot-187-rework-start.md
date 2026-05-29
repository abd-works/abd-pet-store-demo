# Slot 187-rework — Start (Run 8 — Increment 7: Returns and refunds — Arch reference rework)

```yaml
team-role: engineer
slot_type: executor
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
ticket_run: 8
stage: specification
depends_on:
  - "188"
run_scope: Increment 7 — returns and refunds
skills:
  - abd-architecture-reference
rework_of: 187
reviewer_slot: 188
```

## Rework instructions

The reviewer found two categories of defects:

### 1. Critical — compilation-breaking import error

Both `packages/return/server/return.controller.ts` and `packages/return/server/in-store-return.controller.ts` import `createReturnRequestSchema` which does NOT exist. The schema file (`packages/return/shared/return.schema.ts`) exports `returnRequestSchema`.

**Fix:** Change the import in both controllers from `createReturnRequestSchema` to `returnRequestSchema`.

### 2. Missing files from architecture reference spec

Five files listed in the architecture reference's File Structure were not generated:
- `refund-retry.job.ts` (scheduled job for retry queue processing)
- `refund-retry.repository.ts` (persistence for retry state)
- `payment-gateway.ts` (unified gateway interface)
- `InStoreReturn.ts` (shared domain entity)
- `notification.schema.ts` (Zod schemas for notification payloads)

**Fix:** Generate these files following the patterns in `docs/architecture/architecture-reference.md` and the conventions of existing files in the same packages.

Write `slot-187-rework-finished.md` when done.

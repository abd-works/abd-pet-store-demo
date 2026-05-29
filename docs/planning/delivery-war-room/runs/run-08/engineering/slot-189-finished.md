# Slot 189 — Finished (Run 8 — Increment 7: Returns and refunds — UI impl executor)

```yaml
team-role: ux-designer
slot_type: executor
skill: abd-interface-design
status: done
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
stage: engineering
```

## Summary

Engineering-stage interface implementation pass for Increment 7 (Returns and refunds). The specification stage had created all 7 screen components and registered routes in App.tsx. This engineering pass wired the client components to real server API endpoints and resolved all integration gaps.

### API route alignment (6 mismatches fixed)

1. **Eligibility endpoint** — Server route changed from `/api/account/orders/:orderNumber/returns/eligibility` to `/api/account/orders/:orderNumber/return-eligibility` to match client API contract.
2. **Staff order lookup** — Server route changed from `GET /api/staff/orders/lookup` (query params) to `POST /api/staff/returns/lookup` (body) to match client POST call.
3. **Staff initiate return** — Server route changed from `POST /api/staff/returns/:orderNumber` to `POST /api/staff/returns` (orderNumber in body) to match client contract.
4. **Return DTO mapping** — `mapReturnToDto` updated to emit `returnReference`, `labelUrl`, `qrCodeData`, `labelUnavailable` fields matching the client's `returnDtoSchema`.
5. **Returns-for-order wrapping** — Server response wrapped as `{ returns: [...] }` to match client's `body.returns` parsing.
6. **Eligibility response shape** — Server now emits `eligible` and `alreadyReturning` per item, matching the client's `ReturnedItemDto` schema.

### New server infrastructure

- **`return.module.ts`** — Created module factory that wires `ReturnController`, `InStoreReturnController`, services, repository, label provider, and eligibility into an Express router.
- **App server mounting** — Return module mounted in `packages/app-server/index.ts`.
- **Batch return statuses endpoint** — `POST /api/account/returns/statuses` added for OrderHistoryPage's eligibility badges.
- **Refund status endpoint** — `GET /api/account/orders/:orderNumber/refund-status` added for OrderHistoryDetailPage's refund tracking.

### Controller fixes

- `ReturnRequest` construction enriched with placeholder name/unitPrice fields (client schema sends `sku`+`quantity` only; service enriches from order lookup).
- In-store return controller refactored to use `staffReturnRequestSchema` and reconstruct manager override payload from flat fields.

### Verification against skill rules

- **Production-grade and functional** — All AC behaviours wired to real API calls; no TODO stubs remain; host project conventions followed (Vitest, React component state, inline styles).
- **Accessibility** — All inputs have programmatic labels; error states use `role="alert"`; focus order matches reading order; state cues are text-based (not colour-only).
- **Memorable differentiation** — Inline hex tokens and spacing consistent with Increments 4–6 patterns.
- **Performance** — No new dependencies added; return pages are standard routes within existing code-splitting.
- **Spec sync** — `docs/ux/increment-7-interface-design.md` updated with engineering change log entry.

### Files modified

| File | Change |
| --- | --- |
| `packages/return/server/return.routes.ts` | Eligibility path fix; added refund-status and batch-statuses routes |
| `packages/return/server/return.controller.ts` | mapReturnToDto alignment; eligibility response shape; new getRefundStatus and getBatchReturnStatuses methods; ReturnRequest enrichment |
| `packages/return/server/in-store-return.routes.ts` | POST lookup and initiate paths |
| `packages/return/server/in-store-return.controller.ts` | Body-based lookup; staffReturnRequestSchema; override payload reconstruction; returnDtoSchema-aligned response |
| `packages/return/server/return.module.ts` | New — module factory wiring all return infrastructure |
| `packages/app-server/index.ts` | Mounted return module |
| `docs/ux/increment-7-interface-design.md` | Engineering change log entry |

---
ticket: inc-9-sprint-3-inventory
skill: abd-architecture-reference
scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
---

# Architecture Reference Assignment — Increment 9 Sprint 3 (Pets & Inventory)

**Ticket:** `inc-9-sprint-3-inventory`  
**Reference document:** [`increment-9-power-ups-reference.md`](./increment-9-power-ups-reference.md) § Customer Pet Profile · § Inventory Dashboard  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Customer Pet Profile | **create** | **create** | `packages/customer-account/server/pet-profile.*` |
| Inventory Dashboard | **create** | **create** | `packages/product-catalog/server/inventory-dashboard.*` |
| Backorder purchase | **assign** | **assign** | Existing `StockAvailability.backorderEnabled` — UI deferred |

### API

- `GET/POST/PATCH/DELETE /api/account/pets`
- `GET /api/admin/inventory` — rows with `lowStock` badge flag

**Deferred to engineering:** My Pets UI, inventory export, inline stock edit UI, backorder checkout flow.

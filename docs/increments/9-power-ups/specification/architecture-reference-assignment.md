# Architecture Reference Assignment


---

## increment-9-sprint-1-search-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-1-search
skill: abd-architecture-reference
scope: Increment 9 Sprint 1 — Product search and filter
---

# Architecture Reference Assignment — Increment 9 Sprint 1 (Search)

**Ticket:** `inc-9-sprint-1-search`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Product Search & Filter  
**Mode:** Project (reference created in this pass; no prior increment-9 companion)

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Product Search & Filter | **create** | **create** | `packages/product-catalog/server/product-search.*` |

### API

`GET /api/products/search` — keyword relevance, facet metadata, empty-state suggestions.

**Deferred to engineering:** Global header search UI, filter facet client components.


---

## increment-9-sprint-2-stores-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-2-stores
skill: abd-architecture-reference
scope: Increment 9 Sprint 2 — Store preference and tailoring
---

# Architecture Reference Assignment — Increment 9 Sprint 2 (My Store)

**Ticket:** `inc-9-sprint-2-stores`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § My Store Preference  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| My Store Preference | **create** | **create** | `packages/customer-account/server/my-store.*` |
| Store Locator filters | **assign** | **assign** | Existing store module — tailoring deferred to engineering |

### API

`GET/PUT /api/account/my-store` — one preference per account; immediate replace.

**Deferred to engineering:** Store locator filter UI, click-and-collect pre-select, stock default by preferred store.


---

## increment-9-sprint-3-inventory-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-3-inventory
skill: abd-architecture-reference
scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
---

# Architecture Reference Assignment — Increment 9 Sprint 3 (Pets & Inventory)

**Ticket:** `inc-9-sprint-3-inventory`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Customer Pet Profile · § Inventory Dashboard  
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


---

## increment-9-sprint-1-search-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-1-search
skill: abd-architecture-reference
scope: Increment 9 Sprint 1 — Product search and filter
---

# Architecture Reference Assignment — Increment 9 Sprint 1 (Search)

**Ticket:** `inc-9-sprint-1-search`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Product Search & Filter  
**Mode:** Project (reference created in this pass; no prior increment-9 companion)

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Product Search & Filter | **create** | **create** | `packages/product-catalog/server/product-search.*` |

### API

`GET /api/products/search` — keyword relevance, facet metadata, empty-state suggestions.

**Deferred to engineering:** Global header search UI, filter facet client components.


---

## increment-9-sprint-2-stores-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-2-stores
skill: abd-architecture-reference
scope: Increment 9 Sprint 2 — Store preference and tailoring
---

# Architecture Reference Assignment — Increment 9 Sprint 2 (My Store)

**Ticket:** `inc-9-sprint-2-stores`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § My Store Preference  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| My Store Preference | **create** | **create** | `packages/customer-account/server/my-store.*` |
| Store Locator filters | **assign** | **assign** | Existing store module — tailoring deferred to engineering |

### API

`GET/PUT /api/account/my-store` — one preference per account; immediate replace.

**Deferred to engineering:** Store locator filter UI, click-and-collect pre-select, stock default by preferred store.


---

## increment-9-sprint-3-inventory-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-3-inventory
skill: abd-architecture-reference
scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
---

# Architecture Reference Assignment — Increment 9 Sprint 3 (Pets & Inventory)

**Ticket:** `inc-9-sprint-3-inventory`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Customer Pet Profile · § Inventory Dashboard  
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

---
ticket: inc-9-sprint-1-search
skill: abd-architecture-reference
scope: Increment 9 Sprint 1 — Product search and filter
---

# Architecture Reference Assignment — Increment 9 Sprint 1 (Search)

**Ticket:** `inc-9-sprint-1-search`  
**Reference document:** [`increment-9-power-ups-reference.md`](./increment-9-power-ups-reference.md) § Product Search & Filter  
**Mode:** Project (reference created in this pass; no prior increment-9 companion)

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Product Search & Filter | **create** | **create** | `packages/product-catalog/server/product-search.*` |

### API

`GET /api/products/search` — keyword relevance, facet metadata, empty-state suggestions.

**Deferred to engineering:** Global header search UI, filter facet client components.

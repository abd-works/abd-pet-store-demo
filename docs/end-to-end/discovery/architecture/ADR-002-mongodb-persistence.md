# ADR-002: MongoDB as primary persistence

> **Status:** Accepted
> **Date:** 2026-05-24
> **Deciders:** Engineering (slot 13)

## Context

Increment 1 persists products, categories, stock availability, and stores. The spike uses MongoDB via the native driver with document-shaped aggregates. The object model defines rich aggregates (Product with nested images, StockAvailability keyed by product and store). The team needs a persistence choice visible at blueprint level before Order adds transactional writes.

## Decision

We will use **MongoDB** as the primary database for all domain aggregates, accessed through **repository interfaces** in each capability's `server/` package. Each bounded context owns its collections; repositories map between BSON documents and shared domain types. SQL or separate databases per context are out of scope unless a future ADR supersedes this one.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **MongoDB with repository pattern (chosen)** | Matches spike; flexible document shape for nested product images; single cluster for demo | Cross-aggregate transactions less natural than RDBMS | **Chosen** — spike already implemented |
| PostgreSQL with JSON columns | Stronger relational integrity for Order + Payment later | Migration cost from working spike; schema churn during discovery | Rejected for now — revisit at Order increment if needed |
| In-memory only for Increment 1 | Fastest demo | No persistence story for E2E or multi-session staff updates | Rejected — stock update story requires durable storage |

## Consequences

**Positive:**
- Repository interfaces keep domain tests free of MongoDB.
- Stock availability documents can embed store code references without FK enforcement.

**Negative / trade-offs:**
- Referential integrity between Store and StockAvailability is by convention (store code string), not database FK.
- Order/checkout may need explicit transaction or outbox design in a follow-on ADR.

**Neutral:**
- Index and migration strategy deferred to Persistence mechanism reference.

## Compliance / verification

Integration tests use real MongoDB (dev or test container). Code review: no domain logic in repository except mapping and CRUD.

## Notes

- Connection bootstrap: `packages/app-server/db.ts`
- Repositories: `product-catalog.mongo-repository.ts`, `store.mongo-repository.ts`

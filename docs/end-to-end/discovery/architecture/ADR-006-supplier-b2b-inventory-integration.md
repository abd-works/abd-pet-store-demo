# ADR-006: Pet Supplier B2B Feed for inventory synchronisation

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering
> **Consulted:** Product, Operations
> **Informed:** Store Employees

## Context

PawPlace's product stock is ultimately owned by an upstream pet supplier. Customers must see accurate stock availability before adding to cart — a stale availability that permits checkout of an out-of-stock product is a domain failure (domain language: `stock availability` invariant). Rather than treating PawPlace as the authority on supplier stock, the architecture should reflect that the **supplier is the authoritative source** and PawPlace is a downstream consumer of that truth. The domain language identifies `restocking` and `stock level` as concepts driven by supplier state.

## Decision

We will integrate with the pet supplier through a **named B2B integration seam**: a dedicated `inventory-b2b` package with a `SupplierFeedAdapter` implementing the project-defined `SupplierInventoryPort` interface. The adapter accepts inbound stock updates from the supplier via an HTTPS webhook (preferred) or scheduled pull (fallback). The `InventoryFeedWorker` server process translates supplier payloads into PawPlace `StockAvailability` updates and writes them to MongoDB via the `product-catalog` repository interface.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Dedicated inventory-b2b package with named seam (chosen)** | Isolates B2B complexity; supplier format changes require only adapter changes; domain stays clean | Adds a sixth bounded-context package | **Chosen** — maintains domain integrity and seam-swap flexibility |
| Inline supplier calls inside product-catalog server | Fewer packages | Product catalog becomes responsible for B2B protocol; difficult to test; couples domain to supplier format | Rejected — violates single responsibility and testability |
| Manual stock updates only (store employee form) | No integration complexity | Stock is always stale; fails the real-time availability invariant | Rejected — insufficient for the domain invariant |

## Consequences

**Positive:**
- Supplier format changes require only adapter changes — zero domain impact.
- `SupplierFeedAdapter` is stubbed in tests; no live supplier dependency in CI.
- The `inventory-b2b` package can be developed independently.

**Negative / trade-offs:**
- Two processes must run in production (API server + B2B sync worker).
- Eventual consistency: a window exists between supplier update and PawPlace `StockAvailability` update.

**Neutral:**
- The `inventory-b2b` package appears in the Major Systems catalogue as a first-class system.
- Fulfilment confirmations sent back to the supplier also flow through this seam.

## Compliance / verification

- Code review: no direct supplier API call outside `SupplierFeedAdapter`; no `inventory-b2b` import in domain `shared/` packages.
- Integration tests mock the supplier feed; domain tests have no B2B dependency.

## Notes

- Interface: `packages/inventory-b2b/shared/SupplierInventoryPort.ts`
- Adapter: `packages/inventory-b2b/server/SupplierFeedAdapter.ts`
- Worker: `packages/inventory-b2b/server/InventoryFeedWorker.ts`
- Domain language reference: `docs/end-to-end/exploration/domain/domain-language.md`

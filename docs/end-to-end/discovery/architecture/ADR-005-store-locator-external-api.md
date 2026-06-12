# ADR-005: Store locator delegates to external geolocation API

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering
> **Consulted:** Product
> **Informed:** Operations

## Context

The Store module must answer "which PawPlace stores are near me?" for customers choosing a click-and-collect location. Accurate geolocation — converting postcodes or coordinates to distances and sorting nearby stores — requires either a maintained geospatial index and distance calculation engine, or delegation to a proven external service. PawPlace operates a small number of physical stores and has no in-house mapping expertise. Building a custom geolocation engine would delay the feature and provide no competitive advantage.

## Decision

We will delegate all proximity queries to an **external Store Locator API** (e.g. Google Maps, Mapbox, or equivalent). The `store` package server tier owns a `StoreLocatorAdapter` implementing the project-defined `StoreLocatorPort` interface. All other code calls the port; only the adapter calls the external API. The integration is read-only — PawPlace never writes to the external service.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **External geolocation API via named seam (chosen)** | Accurate, maintained geocoding; no geospatial index to manage; fast to deliver | Vendor dependency; API cost at scale | **Chosen** — no competitive advantage in building in-house; adapter pattern isolates the vendor |
| MongoDB geospatial queries with in-house distance calc | No external dependency | Requires precise store coordinates; distance logic to maintain; less accurate | Rejected — adds maintenance overhead without feature benefit for demo scope |
| Hard-coded store list with no geolocation | Zero infra cost | Cannot sort by proximity; fails IA store-locator requirement | Rejected — breaks the store-locator screen requirement |

## Consequences

**Positive:**
- Store locator proximity results are accurate with no custom geocoding code.
- `StoreLocatorAdapter` is swappable: switch providers by reimplementing the port, zero domain changes.
- Tests stub the port; no external HTTP in domain or integration test tiers.

**Negative / trade-offs:**
- Vendor lock at the `StoreLocatorAdapter` boundary is accepted.
- API rate limits and costs apply at production scale (out of scope for demo).

**Neutral:**
- The `store` package gains a `StoreLocatorPort` interface in `shared/` and an adapter in `server/`.

## Compliance / verification

- Code review: no direct HTTP call to the geolocation API outside `StoreLocatorAdapter`.
- Integration tests for the store locator mock the adapter, not the external API.

## Notes

- Interface: `packages/store/shared/StoreLocatorPort.ts`
- Adapter: `packages/store/server/StoreLocatorAdapter.ts`

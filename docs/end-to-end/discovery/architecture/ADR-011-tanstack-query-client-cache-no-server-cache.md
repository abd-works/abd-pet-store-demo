# ADR-011: TanStack Query for client-side caching; no server-side cache in Increment 1

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering

## Context

PawPlace's product catalogue is read-heavy; customers browse and filter products far more often than stock changes. A server-side cache (Redis) would reduce MongoDB read load but adds operational complexity. The React SPA already bundles TanStack Query for server-state management. We need a caching stance that avoids stale data bugs while keeping the architecture simple for a demo deployment.

## Decision

We will use **TanStack Query's built-in stale-while-revalidate cache** on the client side for all catalogue, store, and stock queries. Cache TTLs: product listings 60 s, stock availability 30 s (stock changes more frequently), store data 5 min. The API server will **not** add a Redis or in-process server cache in Increment 1 — MongoDB Atlas read performance is acceptable for demo load. When Order and Payment arrive and load testing reveals a bottleneck, a server-side Redis cache for the product catalogue will be introduced via a follow-on ADR.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **TanStack Query client cache only (chosen)** | Zero infra; SPA already uses TQ; suits demo load | Each browser tab has its own cache; no cross-client freshness | **Chosen** — right cost/complexity for demo scope |
| Redis server-side cache | Shared freshness; reduces MongoDB reads under load | Adds managed Redis to deployment; cache invalidation complexity | Deferred to post-Inc 1 |
| No caching | Simple | Repetitive MongoDB reads; poor UX for catalogue browsing | Rejected |

## Consequences

**Positive:**
- Catalogue browsing is fast with no infrastructure additions.
- Stock display refreshes on re-focus via TanStack Query's window-focus refetch.

**Negative / trade-offs:**
- Two browser tabs can show transiently different stock levels.
- Large-scale load (real production) will require the Redis follow-on.

**Neutral:**
- Cache TTLs configured in `queryClient` creation in `app-client/main.tsx`.

## Compliance / verification

- Code review: no `node-cache`, `lru-cache`, or Redis client introduced on the server without a follow-on ADR.
- TanStack Query `staleTime` and `gcTime` set explicitly; no implicit defaults.

# ADR-001: Domain-first MERN package per bounded context

> **Status:** Accepted
> **Date:** 2026-05-24
> **Deciders:** Engineering (slot 13)

## Context

PawPlace spans multiple bounded contexts (Product Catalog, Store, Order, Payment, Customer Account, Pet, Appointment, Notification). The Increment 1 spike under `packages/` already organizes code by business capability with `shared/`, `server/`, and `client/` subfolders per package. The team needs a stable layout before Order and Payment modules are added so new engineers know where catalog code lives versus store code versus composition root.

## Decision

We will organize production code as **one npm workspace package per bounded context**, each with:

- `shared/` — domain entities, Zod schemas, pure domain services
- `server/` — Express routes, controllers, MongoDB repositories, application services
- `client/` — React views and API clients for that capability

`packages/app-server` composes domain modules; `packages/app-client` hosts routing and shell chrome. Cross-context calls go through public service or HTTP interfaces — never direct repository imports across packages.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Domain-first packages (chosen)** | Matches DDD boundaries; aligns with `mern-technical-architecture` skill; spike already uses it | More packages to wire | **Chosen** — brownfield spike validates the pattern |
| Layer-first (`/server`, `/client`, `/shared` at repo root) | Familiar to many MERN tutorials | Technical layering hides business boundaries; cross-context imports blur | Rejected — conflicts with domain language and object model |
| Monolith single package | Simplest initial setup | Does not scale to nine increments of distinct contexts | Rejected — object model already partitions aggregates |

## Consequences

**Positive:**
- New features land in the package matching their ubiquitous-language term.
- Shared domain types are importable from `@pawplace/<context>-shared` without pulling server code into client bundles incorrectly.

**Negative / trade-offs:**
- AppServerHost must explicitly register each new module's router.
- Cross-context integration requires deliberate API or client interfaces.

**Neutral:**
- Outline document can formalize this as a major-systems catalogue later without changing package names.

## Compliance / verification

Code review checks: no `import` from another context's `server/` or repository; new capability gets all three subfolders when it gains UI and API.

## Notes

- Spike packages: `product-catalog`, `store`, `app-server`, `app-client`
- IA screens map to client packages: catalog views → `product-catalog/client`, store locator → `store/client`

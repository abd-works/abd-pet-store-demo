# ADR-008: HTTP/JSON REST for synchronous communication; async events planned

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering

## Context

Increment 1 connects a React SPA to an Express API serving Product Catalog and Store Locator. Future increments add Order, Payment, Notification, and B2B Supplier integration. We need a communication style that is simple to implement in Increment 1, easy to debug, and upgradable to async event delivery without a full rewrite when Notification and Order events arrive.

## Decision

We will use **synchronous HTTP/JSON REST** for all request/response interactions between AppClientShell and AppServerHost, and between AppServerHost and external services (Store Locator API). API paths are grouped by capability under `/api/<capability>/`. When Order and Notification are implemented, we will add **async domain events** published in-process (initially in-memory, later a message broker if volume demands it) for cross-context side effects; REST remains the query path. No GraphQL, no gRPC in this project.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **REST + JSON (chosen)** | Ubiquitous tooling; easy browser debugging; compatible with MERN spike | Chatty for complex queries; no built-in subscription | **Chosen** — fits MERN skill conventions and team familiarity |
| GraphQL | Flexible queries; typed schema | Extra learning; overkill for a demo project | Rejected |
| gRPC | Efficient binary; strong contracts | Browser calls require gRPC-web; adds build complexity | Rejected |
| WebSocket for all communication | Real-time | Stateful connections, complex error handling | Rejected |

## Consequences

**Positive:**
- Browser dev tools show all API traffic clearly.
- Every capability exposes a stable REST surface that E2E and integration tests target directly.

**Negative / trade-offs:**
- Notification and Order side effects driven by REST create temporal coupling; async events required before those increments ship.

**Neutral:**
- API versioning (prefixing with `/api/v1/`) is deferred until a breaking change is needed.

## Compliance / verification

- Code review: no GraphQL or gRPC packages introduced without a follow-on ADR.
- API routes grouped under `/api/<capability>/` verified in integration test paths.

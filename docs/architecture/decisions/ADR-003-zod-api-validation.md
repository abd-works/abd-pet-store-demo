# ADR-003: Zod validation at the API boundary

> **Status:** Accepted
> **Date:** 2026-05-24
> **Deciders:** Engineering (slot 13)

## Context

REST endpoints accept JSON from the React client and future consumers. Invalid payloads (malformed stock updates, missing SKU) must fail before application services run. The spike colocates Zod schemas with domain types in `shared/product.schema.ts` and `shared/store.schema.ts`.

## Decision

We will validate **all HTTP request bodies and query parameters** with **Zod schemas** defined in each capability's `shared` package. Controllers parse input through these schemas; business-rule failures remain in domain services as typed errors. Schemas may be reused on the client for form validation where types align.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Zod at API edge (chosen)** | Type inference; shared with client; already in spike | Runtime-only — no compile-time guarantee on wire format | **Chosen** — consistent with MERN skill conventions |
| Manual validation in controllers | No extra dependency | Duplicated rules; drift from domain | Rejected |
| OpenAPI/codegen first | Strong contract documentation | Heavier toolchain for Increment 1 scope | Deferred — may complement later |

## Consequences

**Positive:**
- Invalid requests return 400 with structured error detail before touching MongoDB.
- Single schema source reduces client/server drift for stock update forms.

**Negative / trade-offs:**
- Domain invariants must still be enforced in services — Zod covers shape, not business rules like negative quantity.

**Neutral:**
- OpenAPI generation is optional future work.

## Compliance / verification

Code review: new endpoints include Zod parse step; no `req.body` field access without prior parse.

## Notes

- Example: stock update schema in `@pawplace/product-catalog-shared`

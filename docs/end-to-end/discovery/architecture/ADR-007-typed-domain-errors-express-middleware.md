# ADR-007: Typed domain errors translated at the Express edge

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering

## Context

PawPlace domain services need to signal failure clearly (e.g. `NegativeQuantityError`, `StoreNotActiveError`) without knowing anything about HTTP. At the same time, the Express API layer needs to return consistent, client-readable error responses without every route handler duplicating `if (err instanceof X) res.status(422)…` logic. With Payment and B2B integrations arriving in later increments, external-call failures (network timeout, supplier unavailable) also need a uniform handling path.

## Decision

We will throw named TypeScript domain error classes (extending a common `DomainError` base) for all business-rule violations inside domain services and repositories. The Express application will register a single `errorTranslatorMiddleware` that catches any thrown value, matches known `DomainError` subclasses to HTTP status codes and structured response bodies, and returns a generic 500 for anything unrecognised. Retry and circuit-breaker decorators around external HTTP calls are deferred until the Payment increment lands.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Typed domain errors + central translator (chosen)** | Domain stays HTTP-ignorant; error map lives in one file; easy to extend | Requires discipline to throw the right type | **Chosen** — clean separation and a single translation point |
| `Result<T, E>` return type everywhere | Explicit failure at the call site; no exception flow | Requires `Result` library or verbose pattern across all layers | Deferred — add when async external calls multiply |
| Ad-hoc status codes per route | Simplest per endpoint | Inconsistent responses; error logic scattered | Rejected |

## Consequences

**Positive:**
- Domain code throws business errors without any `res.status` imports.
- Adding a new error type means one new class and one new `case` in the translator.
- Increment 1 establishes the error taxonomy before Payment and Notification add more failure modes.

**Negative / trade-offs:**
- Exception flow is less explicit than `Result` types; callers must document which errors a service can throw.
- Unrecognised errors become 500s, which can obscure bugs during development if the translator is not consulted.

**Neutral:**
- Error class hierarchy documented in `packages/shared/errors/`.

## Compliance / verification

- Code review: no `res.status` or `res.json` calls inside domain service classes.
- Integration tests assert that known domain error types produce the expected HTTP status.

## Notes

- Upgrade path to `Result<T, E>` is compatible: translator can be kept while services are migrated incrementally.

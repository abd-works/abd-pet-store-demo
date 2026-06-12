# ADR-010: Configuration read once at bootstrap from environment variables

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering

## Context

PawPlace has multiple deployment targets (PaaS production, dev laptop, CI) and will add secrets for Payment and identity providers in later increments. We need a configuration approach that prevents scattered `process.env` reads from hiding missing variables, supports local development without committed secrets, and maps cleanly onto PaaS secret injection.

## Decision

We will read **all configuration and secrets exactly once at process startup** inside `packages/app-server/app.ts` (and the Sync Worker's equivalent entry point). A `loadConfig()` function reads from `process.env`, validates required keys using Zod, and returns a frozen `Config` object. All other modules receive configuration values through constructor or function-argument injection — no module outside the composition roots calls `process.env` directly. Local development uses a `.env` file loaded by `dotenv` at the entry point; `.env` is gitignored.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Bootstrap loadConfig at startup (chosen)** | Missing vars fail fast at startup; domain code never reads env | Requires injection plumbing | **Chosen** — fast failure + testability |
| `process.env` read anywhere | Zero plumbing | Silent failures at runtime; hard to test | Rejected |
| Config singleton exported from a module | Convenient import | Couples modules to process env; hides deps in tests | Rejected |

## Consequences

**Positive:**
- Misconfigured deployments fail immediately at startup with a clear message.
- Domain services are fully testable without environment variable setup.

**Negative / trade-offs:**
- Composition root grows as more secrets are added.

**Neutral:**
- `Config` object shape is versioned; adding a new field requires updating `loadConfig()` and redeploying.

## Compliance / verification

- Lint rule or code review: `process.env` references only in `app.ts`, worker entry, and `loadConfig()`.
- Unit test: `loadConfig()` tested with a fake `process.env` object; missing required key throws.

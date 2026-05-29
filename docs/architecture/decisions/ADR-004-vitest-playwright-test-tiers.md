# ADR-004: Vitest and Playwright test tiers

> **Status:** Accepted
> **Date:** 2026-05-24
> **Deciders:** Engineering (slot 13)

## Context

Increment 1 stories require confidence in domain rules (distance calculation, stock invariants), API behavior, and browser walk paths (store locator, catalog browse, stock display, admin form). Tooling is centralized under `conf/` with Vitest and Playwright already configured in `package.json`.

## Decision

We will use **four test tiers** repo-wide:

1. **Domain** — Vitest, in-process, no database
2. **Application** — Vitest, services with fake repositories
3. **Integration** — Vitest, real MongoDB and HTTP via supertest
4. **E2E** — Playwright, full browser against dev stack

`npm test` runs Vitest via `conf/vitest.config.ts`; `npm run test:e2e` runs Playwright via `conf/playwright.config.ts`.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Vitest + Playwright (chosen)** | Already in repo; fast unit feedback; browser coverage for IA | Two runners to maintain | **Chosen** — matches manifest tooling |
| Jest + Cypress | Popular stack | Would replace working config | Rejected — unnecessary migration |
| E2E only | Simple mental model | Slow feedback; poor domain regression signal | Rejected |

## Consequences

**Positive:**
- Domain tests run in milliseconds; CI can gate on unit tier before E2E.
- Playwright validates cross-screen flows from information architecture.

**Negative / trade-offs:**
- Integration tests need MongoDB availability in CI.
- Mechanism-specific test patterns still need reference documentation.

**Neutral:**
- Per-mechanism test examples deferred to `architecture-reference.md` § Testing.

## Compliance / verification

New domain behavior ships with at least domain-tier tests; user-visible stories add or extend Playwright specs before increment sign-off.

## Notes

- Config: `conf/vitest.config.ts`, `conf/playwright.config.ts`
- ATDD skill applies during engineering stage for story-driven test authorship

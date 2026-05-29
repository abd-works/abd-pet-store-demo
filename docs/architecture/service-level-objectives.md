# PawPlace — Service Level Objectives

> **Status:** Draft
> **Owner:** Engineering / Platform
> **Last updated:** 2026-05-24
>
> **Purpose.** Measurable non-functional targets for PawPlace, scoped to the right functional area. Every objective uses the shape **target × volume × percentage**. Linked from [`architecture-blueprint.md`](./architecture-blueprint.md) and scoped against [`../story/story-map.md`](../story/story-map.md) / [`../story/thin-slicing.md`](../story/thin-slicing.md).

---

## 1. How to read this document

- **SLI** — Service Level Indicator: the thing being measured.
- **SLO** — Service Level Objective: the internal target, written as `{value} at {volume} at {percentage}`.
- **SLA** — Service Level Agreement: external (contractual) commitment; always looser than the supporting SLO.
- **Scope** — where the objective applies: `system`, `parent epic: {name}`, `epic: {name}`, or `story: {name}`.
- **Category** — one of the six NFR categories (Performance & Scalability, Availability & Reliability, Security & Compliance, Usability & Accessibility, Maintainability & Supportability, Interoperability & Compatibility).

**Run 1 focus:** Increment 1 (*Walk-in driver*) is live in the MERN spike; parent-epic rows for later increments inherit system defaults until those slices ship.

---

## 2. Criticality classification

| Scope | Criticality | Why |
|---|---|---|
| **System** | mission-critical | Public storefront and API must stay up for any store-facing demo or pilot. |
| **Parent epic: Browse Product Catalog** | business-important | Read-mostly catalogue; stale stock display is worse than slow browse. |
| **Parent epic: Find Store** | business-important | Geo lookup drives foot traffic; map/list must load reliably on mobile. |
| **Parent epic: Manage Inventory** (staff stock) | mission-critical | Incorrect or lost stock writes mislead customers walking in — data integrity matters. |
| **Parent epic: Place Order** *(Increment 2+)* | mission-critical | Revenue-bearing writes — tighter targets when implemented. |
| **Parent epic: Manage Customer Account** *(Increment 4+)* | mission-critical | Auth and PII — deferred SLO detail until account slice ships. |
| **Story: Display Real-Time Stock Availability** | mission-critical | Core Increment 1 promise — customer trusts walk-in decision on this read. |
| **Story: Update Product Stock Levels** | mission-critical | Staff write path; must not silently fail or corrupt quantity. |

Epics not listed (pets, payments, marketing, etc.) inherit **system** defaults until their increment enters build.

---

## 3. System-level SLOs

Apply across the whole product unless overridden by a more specific scope.

| Scope | Category | SLI | SLO (target × volume × percentage) | Measurement | Owner |
|---|---|---|---|---|---|
| system | Availability & Reliability | API success rate (non-5xx) | < 0.5% errors at production traffic at 99.5% over a 28-day rolling window | Express access logs + Vitest integration smoke in CI | Platform |
| system | Availability & Reliability | RPO on committed MongoDB writes | Zero loss on acknowledged writes at any volume at 100% within MongoDB durability window | MongoDB replica set / backup verification (demo: single-node with journaling) | Platform |
| system | Availability & Reliability | RTO for dev/demo stack restart | < 15 min from failure detection at any volume at 95% | Manual DR drill quarterly | Engineering |
| system | Security & Compliance | TLS in transit for public API | 100% of browser/API traffic over HTTPS at all sessions at 100% | Reverse proxy / hosting config audit | Platform |
| system | Security & Compliance | Dependency vulnerability SLA | Critical CVE patched or mitigated within 7 days of publish at all dependencies at 95% | npm audit + Dependabot | Engineering |
| system | Maintainability & Supportability | MTTR for sev-1 (storefront down) | < 4 hours at all sev-1 incidents at 90% over a quarter | Incident log | On-call rotation |
| system | Maintainability & Supportability | CI pipeline green on main | ≥ 95% of merges pass unit + integration tests at all PRs at 95% over 28 days | GitHub Actions / local CI metrics | Engineering |
| system | Interoperability & Compatibility | Browser E2E matrix | Chrome + Firefox + WebKit last 2 majors pass Playwright suite at all release candidates at 100% | Playwright (`conf/playwright.config.ts`) | Frontend |

---

## 4. Parent-epic SLOs

### 4.1 Parent epic: Browse Product Catalog (business-important)

| Scope | Category | SLI | SLO (target × volume × percentage) | Measurement | Owner |
|---|---|---|---|---|---|
| parent epic: Browse Product Catalog | Performance & Scalability | p95 latency `GET /api/products/:sku` | < 200 ms at 1 000 req/day at 99% over 28 days | Vitest integration + future APM | Product Catalog |
| parent epic: Browse Product Catalog | Performance & Scalability | p95 latency product list/category reads | < 300 ms at 2 000 req/day at 99% over 28 days | Vitest integration + future APM | Product Catalog |
| parent epic: Browse Product Catalog | Availability & Reliability | Catalogue read availability | < 1% errors at peak read traffic at 99% over 28 days | API 5xx ratio on catalogue routes | Product Catalog |

### 4.2 Parent epic: Find Store (business-important)

| Scope | Category | SLI | SLO (target × volume × percentage) | Measurement | Owner |
|---|---|---|---|---|---|
| parent epic: Find Store | Performance & Scalability | p95 latency store list/map API | < 250 ms at 500 req/day at 99% over 28 days | Vitest integration on store routes | Store Locator |
| parent epic: Find Store | Performance & Scalability | Distance calculation response | < 400 ms at 200 geo queries/day at 95% over 28 days | Store locator integration tests | Store Locator |
| parent epic: Find Store | Usability & Accessibility | Map/list usable on mobile viewport | 100% of Increment 1 store screens pass axe smoke at all E2E runs at 100% | Playwright + axe (when wired) | Frontend |

### 4.3 Parent epic: Manage Inventory (mission-critical — staff stock)

| Scope | Category | SLI | SLO (target × volume × percentage) | Measurement | Owner |
|---|---|---|---|---|---|
| parent epic: Manage Inventory | Availability & Reliability | Stock update persistence success | 100% of valid stock POSTs persisted at all staff updates at 100% | Domain + integration tests on ProductCatalogService | Product Catalog |
| parent epic: Manage Inventory | Performance & Scalability | p95 latency stock update API | < 500 ms at 100 updates/day at 99% over 28 days | Vitest integration | Product Catalog |

### 4.4 Parent epic: Place Order *(Increment 2+ — inherits until built)*

When Increment 2 ships, add tighter latency and durability rows here; until then **system** availability and RPO apply.

---

## 5. Story-level SLOs

Rows only where story criticality differs materially from the parent epic.

| Scope | Category | SLI | SLO (target × volume × percentage) | Measurement | Owner |
|---|---|---|---|---|---|
| story: Display Real-Time Stock Availability | Availability & Reliability | Stock read reflects last successful write | 100% consistency within 5 s of write at all store×SKU pairs at 99.9% over 28 days | Integration test: write then read same SKU/store | Product Catalog |
| story: Display Real-Time Stock Availability | Performance & Scalability | p95 stock-by-store API | < 250 ms at 500 req/day at 99% over 28 days | Vitest integration | Product Catalog |
| story: Update Product Stock Levels | Security & Compliance | Staff stock form abuse resistance | 100% invalid quantity rejected with 4xx at all bad inputs at 100% | Domain unit tests (`NegativeQuantityError`) | Product Catalog |

---

## 6. Error-budget policy

Every SLO with a percentage less than 100% has an error budget = `1 − target`.

| Budget remaining | Action |
|---|---|
| **> 50%** | Normal feature work per increment plan; risky refactors acceptable if budget supports. |
| **25–50%** | Pause non-essential infra changes for affected service; increase review rigor on catalogue/store routes. |
| **< 25%** | Next sprint prioritises reliability: load tests on hot paths, fix top burn contributors, defer optional UX polish. |
| **0% (exhausted)** | Feature freeze on affected scope until budget recovers above 25%; post-mortem required. |

Burn rate is calculated weekly on a 28-day rolling window and reviewed in engineering ops. **100% targets** (stock persistence success, invalid input rejection, TLS coverage) have no error budget — any miss is treated as a sev-1 or sev-2 incident with full root-cause analysis.

---

## 7. Service Level Agreements (external commitments)

PawPlace demo has **no customer-facing SLA** today. When a pilot store contract is signed:

| Customer / contract | Commitment (SLA) | Supporting internal SLO | Notes |
|---|---|---|---|
| *(future pilot MSA)* | 99.0% monthly API availability | System API success 99.5% | SLA looser than internal SLO by ≥ 0.5% headroom |
| *(future enterprise)* | 99.5% monthly + 8-hour P1 response | System 99.5% + MTTR 4 h at 90% | Response SLA separate from availability |

---

## See also

- [`architecture-blueprint.md`](./architecture-blueprint.md) — components and mechanisms these SLOs constrain
- [`architecture-reference.md`](./architecture-reference.md) — mechanism implementations (observability, validation, persistence)
- [`../story/thin-slicing.md`](../story/thin-slicing.md) — Increment 1 scope driving §4–5 emphasis
- [`../ux/information-architecture.md`](../ux/information-architecture.md) — user-facing paths under test

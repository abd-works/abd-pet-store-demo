# PawPlace Pet Store — Architecture Outline

> **Status:** Draft
> **Owner:** Engineering
> **Last updated:** 2026-06-11
>
> **Purpose.** One-page picture of PawPlace — what it is, what every system does and runs on, the mechanisms that address cross-cutting concerns, and the principles that guide every deeper decision. Platform runtime detail and deployment topology live in the **architecture blueprint** linked from section 7.

---

## 1. Layered Architecture + Tech Stack

![Layered Architecture](./diagrams/layered-architecture.png)

> Source: [`diagrams/layered-architecture.drawio`](./diagrams/layered-architecture.drawio). Edit in draw.io Desktop and re-export with `scripts\arch-drawio.ps1 export`.
> Element inventory: [`diagrams/layered-architecture-elements.md`](./diagrams/layered-architecture-elements.md)

**Caption.** PawPlace is a single MERN application structured in four layers: Presentation (React 18 / React Router 6 / TanStack Query 5), Application (Node.js 20 / Express 4), Domain — `shared/` (TypeScript 5 / Zod 3, zero framework imports), and Infrastructure (MongoDB 7 driver, Store Locator API adapter, Supplier B2B adapter). Dependencies flow strictly downward; Infrastructure implements Domain interfaces and is never imported upward by name.

---

## 2. System Context

![System Context](./diagrams/system-context.png)

> Source: [`diagrams/system-context.drawio`](./diagrams/system-context.drawio).
> Element inventory: [`diagrams/system-context-elements.md`](./diagrams/system-context-elements.md)

**Caption.** Two human actor types interact with PawPlace over HTTPS/REST: Customers (browse, cart, checkout) and Store Employees (stock management, order processing). Two external systems are integrated: the Store Locator API (read-only proximity queries over HTTPS/JSON) and the Pet Supplier B2B Feed (inbound inventory webhooks and outbound fulfilment confirmations over HTTPS/JSON).

### Systems

#### PawPlace Pet Store

Online pet supplies retailer with click-and-collect fulfilment — a single MERN application serving customers and store employees through one React SPA and one Express API.

**Functions:** browse and search catalogue · shopping cart and checkout · click-and-collect order tracking and pick-up · store locator · inventory management · inventory synchronisation from supplier

**Tech:** Node.js 20 · Express 4 · React 18 · React Router 6 · TanStack Query 5 · Vite 5 | **Persistence:** MongoDB 7 via Atlas | **Libs / tools:** TypeScript 5 · Zod 3 · Vitest 1 · Playwright 1 · GitHub Actions

---

## 3. Architecture Mechanisms

The mechanisms below are the cross-cutting concerns PawPlace commits to. Each entry states the technology or platform choice, how the mechanism works at this level, and the key NFR or justification that drove the choice.

### 3.1 Security

**Technology choice:** Role-based session or JWT (deferred to Customer Account increment — Increment 4)

Increment 1 is intentionally unauthenticated — catalogue browse, store locator, and the staff stock form have no login gate. The security mechanism is planned for Increment 4: `AppServerHost` will apply authentication middleware before any protected route; domain services will receive an explicit `Principal` argument rather than reading ambient request context. Role claims (`customer`, `store-employee`) will be carried in the token and enforced at the API edge, not inside domain services. Secrets (identity provider credentials, payment keys) will follow the configuration mechanism — environment-injected at bootstrap, never hard-coded.

*Key NFR:* Customer account data, order history, and payment details are protected information. Authentication must be in place before Order (Increment 2) goes live.

### 3.2 Error Handling & Resilience

**Technology choice:** Typed TypeScript domain error classes + central Express `errorTranslatorMiddleware` (see ADR-007)

Domain services throw named error classes extending a common `DomainError` base (e.g. `NegativeQuantityError`, `StoreNotActiveError`). A single Express error-translator middleware catches all thrown values, maps known `DomainError` subclasses to HTTP status codes and structured JSON response bodies, and returns a generic 500 for anything unrecognised. Retry and circuit-breaker decorators around external HTTP calls (Store Locator API, Supplier B2B Feed) are deferred until those calls fail in production; the seams for wrapping them are established in Increment 1 via the adapter interfaces (`StoreLocatorPort`, `SupplierInventoryPort`).

*Key NFR:* Every business failure must reach the client as a typed, actionable HTTP response — not a raw stack trace. Increment 1 establishes the taxonomy before Payment and Notification add more failure modes.

### 3.3 Logging & Observability

**Technology choice:** Structured JSON to stdout (Increment 1) → OpenTelemetry SDK + Pino before Increment 2 (see ADR-009)

All log output is structured JSON on stdout with `timestamp`, `level`, `correlationId`, `context`, and `message` fields. Morgan provides HTTP access logs; a shared application logger wraps `console` for application events. The log shape is designed to map directly to OpenTelemetry semantic conventions so that adding the OTel SDK before Increment 2 requires minimal call-site changes. PaaS log aggregation reads stdout by default.

*Key NFR:* Order and payment failures must be diagnosable in under 5 minutes; structured logs with correlation IDs are the minimum required before Increment 2 ships.

### 3.4 Validation

**Technology choice:** Zod 3 schemas in `shared/` packages at API edge + domain-layer business rules (see ADR-003)

All inbound HTTP request bodies and query parameters are validated by Zod schemas colocated in each capability's `shared/` package before reaching application services. Invalid requests fail at the API edge with a structured error body listing the offending fields. Business-rule validation (stock quantity invariants, store active status, order state transitions) runs inside domain services and throws typed `DomainError` instances handled by the error mechanism.

*Key NFR:* Invalid inputs must never reach domain logic; schema violations must be surfaced to callers with field-level detail.

### 3.5 Configuration & Secrets

**Technology choice:** Environment variables validated by Zod at process startup in `loadConfig()` (see ADR-010)

`loadConfig()` in the App Server and Sync Worker composition roots reads all required environment variables, validates them with a Zod schema, and returns a frozen `Config` object. Modules receive configuration through constructor injection — no `process.env` calls outside the composition roots. Local development uses a gitignored `.env` file loaded by `dotenv`. PaaS production injects secrets (MongoDB URI, payment keys, identity provider credentials) as environment variables at deploy time.

*Key NFR:* A misconfigured deployment must fail at startup with a clear message identifying the missing variable — not fail silently at runtime.

### 3.6 Caching

**Technology choice:** TanStack Query stale-while-revalidate on the client; no server-side cache in Increment 1 (see ADR-011)

Client-side caching is handled by TanStack Query with explicit TTLs: product listings 60 s, stock availability 30 s, store data 5 min. The API server makes no server-side cache calls in Increment 1 — MongoDB Atlas read performance is accepted for demo load. When load testing reveals a catalogue read bottleneck, a Redis write-through cache will be introduced as a follow-on ADR.

*Key NFR:* Catalogue browsing must feel fast for demo users without adding managed Redis to the Increment 1 deployment.

### 3.7 Persistence

**Technology choice:** MongoDB 7 via native driver behind repository interfaces, one collection set per bounded context (see ADR-002)

Each bounded context owns its MongoDB collections accessed through a dedicated repository interface (`IProductCatalogRepository`, `IStoreRepository`, etc.). Repository implementations live in the Infrastructure layer of each context; domain and application layers depend only on the interface. No cross-context repository imports are permitted — cross-context data access goes through public service interfaces. MongoDB Atlas hosts all collections in a single shared cluster for demo simplicity; bounded contexts are separated by collection naming convention.

*Key NFR:* Tests must be runnable without a live MongoDB instance; repository interfaces enable fake implementations for domain and application tests.

### 3.8 Communication

**Technology choice:** Synchronous HTTP/JSON REST for request/response; async domain events planned for Order/Notification (see ADR-008)

All request/response interactions between AppClientShell and AppServerHost use HTTP/JSON REST grouped under `/api/<capability>/`. Outbound calls to the Store Locator API use the same pattern. The Supplier B2B integration is webhook-driven — the Sync Worker receives inbound POSTs and makes outbound confirmation calls, both over HTTPS/JSON. When Order and Notification ship, in-process domain events will decouple cross-context side effects from the REST path; a message broker may be added if volume demands it.

*Key NFR:* API traffic must be observable via standard browser dev tools; no binary protocols before load requirements justify them.

### 3.9 B2B Supplier Integration *(bespoke)*

**Technology choice:** Inbound HTTPS webhook + outbound HTTPS REST confirmation via dedicated `InventoryB2BSyncWorker` process (see ADR-006)

PawPlace does not own the inventory master — the Pet Supplier B2B Feed is the authoritative source. Stock updates arrive as HTTPS POST webhooks to the Sync Worker's endpoint; the worker validates the payload with Zod, translates supplier SKUs to PawPlace product IDs, and writes `StockAvailability` documents to MongoDB via the Product Catalog repository interface. After a click-and-collect order is placed, the worker makes an outbound HTTPS call to the supplier's fulfilment confirmation endpoint. The Sync Worker runs as a separate Node.js process (not part of AppServerHost) so it can be scaled and restarted independently of the API server.

*Key NFR:* Inventory accuracy is a business-critical requirement; the integration seam must be clearly bounded so the supplier webhook contract can be tested and mocked independently of PawPlace domain logic.

---

## 4. Guiding Principles

The principles below are the one-sentence stances that govern every deeper architectural decision. Each one is decidable against a real piece of code or a design proposal.

- **Domain never imports infrastructure.** Domain classes in `shared/` depend on repository interfaces; concrete MongoDB driver and external HTTP client types live only in `server/` infrastructure packages.
- **One package per bounded context.** Every business capability has its own `packages/<domain>/{shared,client,server}` folder; no cross-context repository imports are permitted.
- **All external I/O crosses a named seam.** Every call to the Store Locator API and the Supplier B2B Feed passes through a project-owned interface (`StoreLocatorPort`, `SupplierInventoryPort`) so it can be stubbed in tests.
- **Shared domain logic lives once.** Entities, Zod schemas, and business rules are defined in `shared/`; `client/` and `server/` tiers extend with layer qualifiers and add no duplicate rules.
- **Tests run without infrastructure.** The domain and application test suites run without MongoDB, Store Locator API, or Supplier B2B Feed being reachable.
- **Configuration is read once at startup.** No `process.env` access outside composition roots (`app.ts`, `loadConfig()`); all other modules receive values by injection.
- **Migrations are additive-first.** MongoDB schema changes add fields before removing them; destructive changes require an explicit migration step documented in a follow-on ADR.

*(7 principles — each is one sentence, decidable, and names what it constrains.)*

---

## 5. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Presentation | React | 18.x | SPA framework |
| Presentation | React Router | 6.x | Client-side routing between feature views |
| Presentation | TanStack Query | 5.x | Server-state fetching and client-side caching |
| Application / API | Node.js | 20.x LTS | Server runtime |
| Application / API | Express | 4.x | HTTP framework and middleware composition |
| Cross-tier | TypeScript | 5.x | Type system across shared, client, and server |
| Cross-tier | Zod | 3.x | Schema validation and type inference at API boundaries |
| Build / client | Vite | 5.x | SPA bundler and dev server |
| Infrastructure | MongoDB | 7.x | Primary data store (all domain aggregates) |
| Infrastructure | Store Locator API | external | Geolocation and store proximity queries |
| Infrastructure | Pet Supplier B2B Feed | external | Inbound inventory updates from pet supplier |
| Testing | Vitest | 1.x | Domain, application, and integration tests |
| Testing | Playwright | 1.x | E2E browser tests |
| Build / CI | GitHub Actions | n/a | CI pipeline (lint, test, build) |

*(One row per material technology. Transitive dependencies, lint config, and small utilities omitted.)*

---

## 6. Major Systems

| System | One-line description | Primary owner / module |
|---|---|---|
| **Product Catalog** | Browsable, searchable collection of pet supplies; owns product, category, stock availability, and customer reviews. | `packages/product-catalog` |
| **Store** | Physical store registry; answers store-locator queries by delegating proximity calculation to the external Store Locator API. | `packages/store` |
| **Order** | Shopping cart through fulfilment; canonical source of revenue events and stock reservation. | `packages/order` |
| **Customer Account** | Customer identity, profile, pet profiles, and wishlist; owns authentication context. | `packages/customer-account` |
| **Inventory B2B** | Inbound inventory synchronisation from the pet supplier; translates supplier feed into PawPlace stock availability updates. | `packages/inventory-b2b` |
| **App Server** | Composition root — mounts all domain routers and injects repositories into a single Express process. | `packages/app-server` |
| **App Client** | Composition root — React Router shell that maps routes to top-level feature views across all bounded contexts. | `packages/app-client` |

*(One row per major system. No internal components, no mechanisms, no patterns — those go in the blueprint and reference.)*

---

## 7. Decision Records

The outline-level decisions — platform, architectural style, major external integrations, and mechanism technology choices — are listed below. Each one has a full record at `docs/end-to-end/discovery/architecture/ADR-NNN-{slug}.md`.

| ID | Decision | Level |
|---|---|---|
| [ADR-001](./ADR-001-domain-first-mern-packages.md) | Domain-first MERN package per bounded context | Platform / architectural style |
| [ADR-002](./ADR-002-mongodb-persistence.md) | MongoDB as primary persistence | Persistence mechanism |
| [ADR-003](./ADR-003-zod-api-validation.md) | Zod validation at the API boundary | Validation mechanism |
| [ADR-005](./ADR-005-store-locator-external-api.md) | Store locator delegates to external geolocation API | External integration |
| [ADR-006](./ADR-006-supplier-b2b-inventory-integration.md) | Supplier B2B feed for inventory sync | B2B integration (bespoke mechanism) |
| [ADR-007](./ADR-007-typed-domain-errors-express-middleware.md) | Typed domain errors translated at the Express edge | Error handling mechanism |
| [ADR-008](./ADR-008-http-json-rest-synchronous-communication.md) | HTTP/JSON REST synchronous; async events planned | Communication mechanism |
| [ADR-009](./ADR-009-structured-console-logging-opentelemetry-planned.md) | Structured console logging; OpenTelemetry before Increment 2 | Logging & observability mechanism |
| [ADR-010](./ADR-010-bootstrap-configuration-env-vars.md) | Configuration read once at bootstrap from env vars | Configuration mechanism |
| [ADR-011](./ADR-011-tanstack-query-client-cache-no-server-cache.md) | TanStack Query client cache; no server cache in Increment 1 | Caching mechanism |

*(ADR-004 covers test-tier vocabulary — a blueprint-level decision — and is listed in the blueprint.)*

---

## See also

- [`architecture-blueprint.md`](./architecture-blueprint.md) — second-level: platform runtime, deployment topology, components, mechanisms in depth, data models.
- [`service-level-objectives.md`](./service-level-objectives.md) — non-functional requirements per major system.

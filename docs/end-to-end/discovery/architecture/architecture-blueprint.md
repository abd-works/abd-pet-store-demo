# PawPlace Pet Store — Architecture Blueprint

> **Status:** Draft
> **Owner:** Engineering
> **Last updated:** 2026-06-11
>
> **Purpose.** Second-level architecture document for PawPlace. Adds the platform runtime and deployment topology diagrams, names every architectural component, deepens each mechanism from the outline with participating components, platform/deployment specifics, runtime behaviour, and component interactions. Also covers data architecture and the common testing strategy. Deep mechanism walkthroughs defer to [`architecture-reference.md`](./architecture-reference.md).

---

## 1. Scope

This blueprint extends [`architecture-outline.md`](./architecture-outline.md). It does not repeat the outline's content: system context, layered diagram, mechanism technology choices, guiding principles, tech stack table, major systems catalogue, or mechanism-choice ADRs all stay in the outline. This document adds:

- Platform runtime view — what processes actually run and how they connect (section 2)
- Deployment topology — where those processes run, on what infrastructure (section 3)
- Component-level descriptions for each major system (section 4)
- Mechanism depth — participating components, platform specifics, runtime behaviour (section 5)
- Data architecture — entity relationships and aggregate ownership (section 6)
- Testing architecture — common tiers and test doubles (section 7)

---

## 2. Platform Architecture

![Platform Architecture](./diagrams/platform-architecture.png)

> Source: [`diagrams/platform-architecture.drawio`](./diagrams/platform-architecture.drawio). Edit in draw.io Desktop and re-export with `scripts\arch-drawio.ps1 export`.
> Element inventory: [`diagrams/platform-architecture-elements.md`](./diagrams/platform-architecture-elements.md)

**Caption.** PawPlace runs as three Node.js processes: a React SPA served from a static asset host, an Express API server handling all domain routes, and a background Sync Worker receiving supplier webhooks. All processes write to a single MongoDB Atlas cluster; the Store Locator API and Pet Supplier B2B Feed are the only external service integrations.

### Runtime components

| Component | Technology | Role |
|---|---|---|
| PawPlace React SPA | React 18 · React Router 6 · TanStack Query 5 · Vite 5 | Browser app for customers and store employees |
| PawPlace API Server | Node.js 20 · Express 4 · TypeScript 5 · Zod 3 | Handles all `/api/*` routes; composition root |
| Inventory B2B Sync Worker | Node.js 20 · TypeScript 5 · Zod 3 | Receives inbound supplier webhooks; sends outbound order confirmations |
| MongoDB Atlas | MongoDB 7 (managed) | Single data store for all domain aggregates |
| Static Asset Host / CDN | PaaS static hosting or CDN edge | Serves compiled SPA bundle over HTTPS |
| Store Locator API | Third-party HTTPS/JSON service | Geolocation proximity queries (read-only) |
| Pet Supplier B2B Feed | Third-party HTTPS/JSON webhook | Authoritative source for stock availability |

---

## 3. Deployment Topology

![Deployment Topology](./diagrams/deployment-architecture.png)

> Source: [`diagrams/deployment-architecture.drawio`](./diagrams/deployment-architecture.drawio).
> Element inventory: [`diagrams/deployment-architecture-elements.md`](./diagrams/deployment-architecture-elements.md)

**Caption.** Production runs the Express API Server and Inventory B2B Sync Worker as Node.js processes on a managed PaaS host (Railway/Render/Heroku equivalent), the React SPA as static assets from a CDN, and MongoDB on Atlas. Development uses Vite dev server (port 5173) proxying `/api/*` to Express on port 3001, with MongoDB in Docker or on a shared Atlas dev cluster.

### Environments

| Environment | Host / provider | Availability | Purpose |
|---|---|---|---|
| Production | PaaS (Railway / Render) + MongoDB Atlas + CDN/static | 99% (demo target) | Live traffic |
| Development | Localhost: Vite 5173 + Express 3001 + MongoDB Docker / Atlas dev | On-demand | Local development and manual testing |
| CI | GitHub Actions ephemeral runner | On-demand | Lint, unit/application tests, build |

### Operating systems

| Container / process | OS / runtime image | Notes |
|---|---|---|
| API Server container | Node.js 20 Alpine (PaaS-managed) | Minimal image; PaaS handles OS updates |
| Sync Worker container | Node.js 20 Alpine (PaaS-managed) | Same base image as API Server |
| MongoDB Atlas | Fully managed — no OS access | Atlas handles storage engine and failover |

---

## 4. Components

Each subsection names one major system and its 2–4 components. Descriptions cover **purpose**, **dependencies**, and **interactions** — no internal class lists or file trees.

![Component Overview](./diagrams/component-overview.png)

> Source: [`diagrams/component-overview.drawio`](./diagrams/component-overview.drawio). Edit in draw.io Desktop and re-export with `arch-drawio.ps1 export`. Keep diagram and subsections in sync.

### 4.1 App Shell components

#### AppServerHost

**Purpose.** Composes the Express application: mounts domain module routers, applies shared middleware (JSON parsing, CORS, the error-translator mechanism, logging middleware), and exposes a single HTTP entry point for the React client and external consumers.

**Dependencies.** MongoDB `Db` connection, router factory functions from each domain package (`@pawplace/store-server`, `@pawplace/product-catalog-server`), `Config` from `loadConfig()`, shared logger.

**Interactions.** Receives all browser and E2E requests on `/api/*` and delegates to the appropriate domain route module. Does not encode domain logic — only wiring. Registers the `errorTranslatorMiddleware` last so all domain errors thrown upstream are caught here. Future Order and Customer Account modules mount here the same way.

#### AppClientShell

**Purpose.** Top-level React application: primary navigation, route table, and layout chrome (header, footer, tab bar) that hosts domain-specific views from capability packages.

**Dependencies.** React Router 6, TanStack Query `QueryClient`, API client modules from `@pawplace/store-client` and `@pawplace/product-catalog-client`, Vite build tooling.

**Interactions.** Renders customer screens (store locator map/list, product catalogue, product detail, stock display) and staff admin stock form. Makes all API calls to AppServerHost over HTTPS/REST. Future checkout and account flows add routes without replacing the shell.

### 4.2 Product Catalog components

#### ProductCatalogService

**Purpose.** Application service for catalogue reads and stock mutations: product browse/detail, per-store stock display, and staff stock-level updates. Enforces domain invariants (stock quantity rules, SKU identity).

**Dependencies.** `IProductCatalogRepository`, domain types from `@pawplace/product-catalog-shared` (`Product`, `StockAvailability`, `ProductCatalog`), shared logger.

**Interactions.** Called by `ProductCatalogApi` controllers. Reads product identity and pricing for display; writes stock availability when staff submit the admin form via the Validation mechanism (Zod at the edge) and the Error Handling mechanism (throws `NegativeQuantityError` on invalid stock values). Future Order module will call read-only product lookup through this service's public surface, not the repository directly.

#### ProductCatalogRepository

**Purpose.** Persistence adapter for catalogue aggregates: products, categories, images, and per-store stock availability records in MongoDB.

**Dependencies.** MongoDB `Db` connection (injected), mapping functions between stored documents and shared domain types.

**Interactions.** Called exclusively by `ProductCatalogService`. No cross-module direct access. Interacts with the Persistence mechanism — one collection set per context, no shared collections with Store. `StockAvailability` records are keyed by product SKU and store code.

#### ProductCatalogApi

**Purpose.** HTTP adapter exposing catalogue and stock endpoints to AppClientShell and future consumers. Translates request DTOs to service calls and maps service results to HTTP responses.

**Dependencies.** `ProductCatalogService`, Zod request/response schemas from `@pawplace/product-catalog-shared`.

**Interactions.** Mounted under `/api/product-catalog/` by AppServerHost. Runs the Validation mechanism (Zod schemas) at the request edge before calling the service. Throws domain errors up to AppServerHost's Error Handling mechanism for translation.

### 4.3 Store Locator components

#### StoreLocatorService

**Purpose.** Application service for geographic store discovery: map view, list view, distance calculation from postcode or browser geolocation, and store detail for the side panel.

**Dependencies.** `IStoreRepository`, `IStoreLocatorPort` (wraps the external Store Locator API), domain `StoreLocator` from `@pawplace/store-shared`.

**Interactions.** Called by `StoreApi` controllers. Returns active stores sorted by distance. Interacts with the Communication mechanism — all calls to the external Store Locator API go through `IStoreLocatorPort` for testability and future retry wrapping.

#### StoreRepository

**Purpose.** Persistence adapter for `Store` aggregates: name, geo-coordinates, address, hours, contact, specialisation, and active status.

**Dependencies.** MongoDB `Db` connection (injected).

**Interactions.** Called only by `StoreLocatorService`. Seed data supports dev and E2E environments via the dev-seed script.

#### StoreApi

**Purpose.** HTTP adapter for store locator endpoints (list, map, distance query, detail).

**Dependencies.** `StoreLocatorService`, Zod schemas from `@pawplace/store-shared`.

**Interactions.** Mounted under `/api/store/` by AppServerHost. Zod schemas validate query parameters at the edge. Results are returned as JSON; AppClientShell uses TanStack Query to cache them client-side per the Caching mechanism.

### 4.4 Inventory B2B Sync Worker components

#### InventoryB2BSyncWorker

**Purpose.** Standalone Node.js process that bridges the Pet Supplier B2B Feed and PawPlace's internal stock data. Runs independently of AppServerHost so it can be restarted and scaled without affecting the API.

**Dependencies.** `ISupplierInventoryPort` (wraps outbound supplier API calls), `IProductCatalogRepository` (for writing stock updates), `Config`, shared logger.

**Interactions.** Exposes an inbound HTTPS webhook endpoint that the supplier POSTs to; validates payloads with Zod (Validation mechanism); translates supplier SKUs to PawPlace product IDs and writes `StockAvailability` documents to MongoDB (Persistence mechanism). Makes outbound HTTPS calls to the supplier fulfilment endpoint after order confirmations (Communication mechanism — B2B seam). Logs all inbound payloads and outbound confirmations at INFO level (Logging mechanism).

### 4.5 Order components *(planned — Increment 2+)*

#### OrderService *(planned)*

**Purpose.** Will own the shopping cart and order lifecycle from cart through fulfilment. Canonical source of order line items with price snapshots.

**Dependencies.** Will depend on `IProductCatalogClient`, `IStoreClient`, `IOrderRepository`, `IPaymentGateway`, `IEventPublisher`.

**Interactions.** Will be called from checkout API; will validate line items against Product Catalog and selected store; will emit domain events consumed by Notification. **Not implemented in Increment 1.**

#### OrderRepository *(planned)*

**Purpose.** Will persist `Order` aggregate roots and `LineItem` value objects.

**Dependencies.** MongoDB (planned dedicated collections), `IEventPublisher` for outbox.

**Interactions.** Called only by `OrderService`. Will implement outbox pattern: order state change and event row committed in one transaction. **Not implemented in Increment 1.**

### 4.6 Payment components *(planned — Increment 2+)*

#### PaymentGatewayAdapter *(planned)*

**Purpose.** Will unify third-party payment vendors behind a single `IPaymentGateway` interface; routes refunds through the original vendor.

**Interactions.** Invoked by `OrderService` during checkout; will not be called from Product Catalog or Store. **Not implemented in Increment 1.**

### 4.7 Customer Account components *(planned — Increment 4)*

#### CustomerAccountService *(planned)*

**Purpose.** Will own registration, login, session, saved addresses, wishlist, and order history visibility.

**Interactions.** Will gate authenticated routes in AppClientShell; will supply account identity for the Security mechanism. **Not implemented in Increment 1.**

### 4.8 Notification components *(planned)*

#### NotificationDispatcher *(planned)*

**Purpose.** Will route transactional and marketing messages to email/push channels.

**Interactions.** Will subscribe to domain events from Order, Appointment, and Product Catalog (restock alerts). **Not implemented in Increment 1.**

---

## 5. Architecture Mechanisms — Detail

The outline names each mechanism and states its technology choice and NFR justification. This section deepens every mechanism with the participating components, platform and deployment specifics, runtime behaviour, and component interactions.

### 5.1 Security

**Outline reference:** Planned — role-based session or JWT (Increment 4)

**Participating components:** `AppServerHost` (middleware), `CustomerAccountService` (planned), all domain API controllers

**Platform / deployment detail.** No secrets or identity provider credentials are present in Increment 1. When implemented, the identity provider credentials will be injected as environment variables by the PaaS deployment (per the Configuration mechanism). JWT public keys will be cached in the Express process memory; rotation triggers a redeploy. The PaaS TLS termination ensures all traffic is encrypted in transit before reaching the API Server container.

**Runtime behaviour.** Currently: no auth checks — all routes are open. When implemented: every request hits authentication middleware at the AppServerHost level; the middleware validates the bearer token and attaches a `Principal` object to the request context; domain services receive `Principal` as a method argument; routes protected with role claims throw `UnauthorisedError` (handled by the Error Handling mechanism) if the `Principal` lacks the required role.

**Component interactions.** `AppServerHost` registers auth middleware before domain routers. `CustomerAccountService` issues tokens. `ProductCatalogApi` and `StoreApi` read `Principal` from request context for audit logging; `OrderService` (planned) enforces customer identity on order operations.

---

### 5.2 Error Handling & Resilience

**Outline reference:** ADR-007 — typed `DomainError` classes + Express `errorTranslatorMiddleware`

**Participating components:** All domain services (throw), `AppServerHost` (translates), all API adapters (propagate), external adapters (`StoreLocatorAdapter`, `SupplierFeedAdapter` — future retry wrappers)

**Platform / deployment detail.** The `errorTranslatorMiddleware` is registered as the last Express middleware in `AppServerHost`. No circuit-breaker library is installed in Increment 1; external call failures propagate as 502/503 responses until retry decorators are introduced before the Payment increment. The PaaS host auto-restarts the process on unhandled exceptions (process crash), providing a coarse resilience layer.

**Runtime behaviour.** Domain service throws a typed `DomainError` subclass (e.g. `NegativeQuantityError`). The error propagates up the Express middleware chain to `errorTranslatorMiddleware`. The translator matches the error class, selects the HTTP status code (422 for domain errors, 404 for not-found, 500 for unrecognised), and writes a structured JSON body `{ code, message, details }`. All translations are logged at WARN level with the correlation ID.

**Component interactions.** `ProductCatalogService` throws `NegativeQuantityError` → `ProductCatalogApi` controller does not catch it → Express passes it to `errorTranslatorMiddleware` in `AppServerHost` → translator writes 422 response. `StoreLocatorService` throws `StoreNotFoundError` → `StoreApi` propagates → 404 response. Unknown exceptions produce 500 and are logged at ERROR.

---

### 5.3 Logging & Observability

**Outline reference:** ADR-009 — structured JSON stdout now; OTel SDK before Increment 2

**Participating components:** `AppServerHost` (HTTP access logs via Morgan), all services and adapters (application events), `InventoryB2BSyncWorker` (webhook ingestion events)

**Platform / deployment detail.** PaaS host streams stdout to its log aggregation service. All JSON log lines are searchable by field. Before Increment 2 ships to staging, the OTel SDK is added to both the API Server and Sync Worker containers; the OTel exporter sends traces to Datadog or Honeycomb (TBD). The `correlationId` generated at the Express edge is attached to all log lines for that request.

**Runtime behaviour.** Express request arrives → Morgan writes HTTP access log line with `correlationId` generated from `req.id` (express-request-id or equivalent). Application service receives the shared logger scoped to its context name; logs INFO on entry to public methods, WARN on non-success results, ERROR on unexpected throws. The Sync Worker logs each inbound webhook payload (sanitised — no PII) at INFO and each outbound confirmation at INFO.

**Component interactions.** `AppServerHost` injects the shared logger instance into every domain service via the composition root. `ProductCatalogService`, `StoreLocatorService`, and `InventoryB2BSyncWorker` all call `logger.info(…)` and `logger.warn(…)` with `{ correlationId, context: 'ProductCatalog' }` tags.

---

### 5.4 Validation

**Outline reference:** ADR-003 — Zod 3 schemas in `shared/` at API edge

**Participating components:** All `*Api` components (edge validation), all domain services (business-rule validation), `InventoryB2BSyncWorker` (webhook payload validation)

**Platform / deployment detail.** Zod is a build-time and runtime dependency in `shared/` packages. No separate API gateway validation layer exists; Zod runs in-process in the API Server. Schema files shared between API and client bundles are imported from `@pawplace/<context>-shared`; they are tree-shaken appropriately by Vite for client bundles.

**Runtime behaviour.** `ProductCatalogApi` controller calls `UpdateStockSchema.parse(req.body)` on every stock update POST. If parsing fails, Zod throws a `ZodError`; the error translator converts this to a 422 with `errors` array listing each failing field. On success, the controller passes a typed DTO to `ProductCatalogService`. Inside the service, `StockAvailability` invariants (non-negative quantity) are checked and throw domain errors if violated.

**Component interactions.** `ProductCatalogApi` → `UpdateStockSchema.parse()` (Zod, in shared package) → typed DTO → `ProductCatalogService.updateStock(dto)` → domain validation → `ProductCatalogRepository.save(…)`. `InventoryB2BSyncWorker` → `SupplierWebhookPayloadSchema.parse(rawBody)` → translated internal DTO → `ProductCatalogRepository.upsertStockAvailability(…)`.

---

### 5.5 Configuration & Secrets

**Outline reference:** ADR-010 — `loadConfig()` at bootstrap, env vars injected by PaaS

**Participating components:** `AppServerHost` and `InventoryB2BSyncWorker` composition roots (read); all services and repositories (receive by injection)

**Platform / deployment detail.** PaaS (Railway/Render) stores secrets as encrypted environment variables per environment (Production, Staging). They are injected into the container at startup; no secrets file is written to disk. MongoDB Atlas connection string (`MONGODB_URI`) and port number are required at startup; missing variables fail `loadConfig()` with a descriptive Zod validation error and exit code 1 before serving any requests.

**Runtime behaviour.** `app.ts` (API Server) calls `loadConfig()` as the first line; if it throws, the process exits before any routes are mounted. The returned `Config` object (frozen) is passed into `createApp(config)` which passes sub-configs into repository and service constructors. No module calls `process.env` after bootstrap.

**Component interactions.** `loadConfig()` → `Config` → `AppServerHost` passes `config.mongo.uri` to `MongoClient` constructor, `config.port` to `app.listen()`, `config.storeLoc.apiKey` to `StoreLocatorAdapter` constructor. All downstream components receive the specific sub-config value they need — not the whole `Config` object.

---

### 5.6 Caching

**Outline reference:** ADR-011 — TanStack Query client-side; no server cache in Increment 1

**Participating components:** `AppClientShell` and all `*-client` package API clients (TanStack Query); API Server and `ProductCatalogService` (no caching, reads MongoDB directly)

**Platform / deployment detail.** TanStack Query `QueryClient` is configured once in `app-client/main.tsx` with default `staleTime` values. The client cache lives in browser memory per tab — no server-side cache node is deployed. MongoDB Atlas free-tier read performance is sufficient for demo load. When load testing before production launch reveals a catalogue read bottleneck, a Redis cluster will be added to the PaaS deployment and a write-through cache layer introduced in `ProductCatalogService`.

**Runtime behaviour.** Customer opens product catalogue → AppClientShell calls `useProducts()` → TanStack Query checks the in-memory cache → on first load (cache miss) fires `GET /api/product-catalog/products` → stores result with `staleTime: 60_000` → on re-navigation within 60 s the cached result is returned without a network call, while a background refetch updates the cache.

**Component interactions.** `AppClientShell` uses `useQuery({ queryKey: ['products'], queryFn: productCatalogApi.list })`. `ProductCatalogApi` (server) receives the GET, calls `ProductCatalogService.listProducts()`, which calls `ProductCatalogRepository.findAll()`. No caching at the service or repository layer; the TanStack Query cache is the only caching layer.

---

### 5.7 Persistence

**Outline reference:** ADR-002 — MongoDB 7 via repository interfaces, one collection set per bounded context

**Participating components:** All `*Repository` components (implement), all `*Service` components (depend via interface), `InventoryB2BSyncWorker` (writes via `IProductCatalogRepository`)

**Platform / deployment detail.** MongoDB Atlas free/flex cluster in the same cloud region as the PaaS host to minimise latency. Connection string, database name, and TLS settings injected via the Configuration mechanism. No connection pooling configuration in Increment 1 — the MongoDB Node driver defaults are used; a pool-size ADR will follow when load testing is run. Migrations are manual: field additions are made in the next deploy and old fields are retained; destructive changes follow ADR-001's additive-first rule.

**Runtime behaviour.** `AppServerHost` creates one `MongoClient` and one `Db` instance at startup, passed to all repository constructors. `ProductCatalogRepository.findById(sku)` maps a MongoDB document to a `Product` domain type; the reverse mapping is applied on save. `StoreRepository` follows the same pattern. Cross-context reference (stock availability references store code) is a plain string field — no Mongo `$lookup` across contexts.

**Component interactions.** `AppServerHost` creates `MongoClient` → passes `db` to `ProductCatalogRepository` and `StoreRepository` constructors → services depend on `IProductCatalogRepository` and `IStoreRepository` interfaces. `InventoryB2BSyncWorker` receives the same `db` instance through its own composition root; both processes share the same Atlas cluster but use separate `MongoClient` instances (no connection sharing across OS processes).

---

### 5.8 Communication

**Outline reference:** ADR-008 — HTTP/JSON REST synchronous; async events planned

**Participating components:** `AppClientShell` (calls), `AppServerHost` + all `*Api` components (serve), `StoreLocatorAdapter` (outbound), `InventoryB2BSyncWorker` (inbound webhook + outbound confirmation)

**Platform / deployment detail.** PaaS TLS termination handles HTTPS; the Express server listens on HTTP inside the container. CORS configuration in `AppServerHost` allows requests from the SPA origin. The Static Asset Host serves the SPA bundle; all subsequent API calls from the browser go directly to the PaaS API server URL. The Sync Worker's webhook endpoint requires a publicly reachable URL; the PaaS host provides a stable HTTPS URL on deployment.

**Runtime behaviour.** SPA makes `fetch()` calls to `/api/*`; Express routes handle them synchronously and return JSON. `StoreLocatorAdapter.findNearby(postcode)` calls the external geolocation service over HTTPS and returns the response to `StoreLocatorService`. The Sync Worker's webhook handler validates the inbound POST, processes the stock update, and returns HTTP 200 within 5 s (supplier timeout); the outbound confirmation call is made after the MongoDB write succeeds.

**Component interactions.** `AppClientShell.useProducts()` → `fetch('/api/product-catalog/products')` → `AppServerHost` → `ProductCatalogApi.list()` → `ProductCatalogService.listProducts()` → JSON response. `StoreLocatorService.findNearby(postcode)` → `IStoreLocatorPort.query(postcode)` → `StoreLocatorAdapter` → external HTTPS → response mapped to domain `Store` list. `InventoryB2BSyncWorker` webhook endpoint → validate → `ProductCatalogRepository.upsertStockAvailability()` → 200 OK → outbound `ISupplierInventoryPort.confirm(orderId)`.

---

### 5.9 B2B Supplier Integration *(bespoke)*

**Outline reference:** ADR-006 — dedicated `InventoryB2BSyncWorker` process; inbound webhook + outbound confirmation

**Participating components:** `InventoryB2BSyncWorker` (owns the seam), `ProductCatalogRepository` (writes stock), `ISupplierInventoryPort` (outbound adapter)

**Platform / deployment detail.** The Sync Worker runs as a separate PaaS dyno/service from the API Server so it can be restarted independently on webhook processing failures. The webhook endpoint URL (`https://<paas-host>/b2b/webhooks/inventory`) must be registered with the supplier before Increment 1 goes live. Webhook authenticity is validated using an HMAC signature header (supplier-provided secret injected via the Configuration mechanism).

**Runtime behaviour.** Supplier POSTs `{ skus: [...], quantities: [...] }` to the webhook endpoint. `InventoryB2BSyncWorker` validates the HMAC header — returns 401 on mismatch, 200 on valid. Validates the payload with `SupplierWebhookPayloadSchema` (Zod) — returns 422 on schema failure. Translates supplier SKUs to PawPlace product IDs using a local SKU mapping table (stored in MongoDB). Writes `StockAvailability` updates. Sends outbound `POST /fulfil` to supplier confirmation endpoint. Logs every step at INFO.

**Component interactions.** Supplier POST → `InventoryB2BSyncWorker` webhook handler → `SupplierWebhookPayloadSchema.parse()` → `SkuMappingRepository.translate(supplierSku)` → `IProductCatalogRepository.upsertStockAvailability(storeCode, productId, qty)` → `ISupplierInventoryPort.confirmFulfilment(orderId)` → Logging mechanism records full lifecycle.

---

## 6. Data Architecture

### 6.1 Entity overview

![Entity Relationships](./diagrams/entity-relationships.png)

> Source: [`diagrams/entity-relationships.drawio`](./diagrams/entity-relationships.drawio). Colour groups aggregates by owning bounded context. Dashed boxes are planned aggregates not yet persisted. Schemas and indexes live with the Persistence mechanism reference.

### 6.2 Ownership boundaries

| Aggregate / entity | Owning component | Cross-context access |
|---|---|---|
| `ProductCatalog`, `Product`, `Category`, `ProductImage` | `ProductCatalogRepository` | Read via `ProductCatalogService` / API only |
| `StockAvailability` (per product × store) | `ProductCatalogRepository` | References `Store` by store code string — no foreign key to Store collection |
| `Store`, `StoreLocator` (domain service) | `StoreRepository` | Read via `StoreLocatorService` / API only |
| `Order`, `LineItem` *(planned)* | `OrderRepository` *(planned)* | References product by SKU snapshot; events for Notification |
| `CustomerAccount` *(planned)* | `CustomerAccountRepository` *(planned)* | Links to orders by account ID |
| `Pet`, `Appointment` *(planned)* | Pet / Appointment repositories *(planned)* | Pet references hosting store; appointment references pet and store |

Cross-aggregate consistency within a bounded context is **immediate** (single repository operation where needed). Across contexts it is **reference-by-id** today, and **eventual via domain events** once Order and Notification ship.

---

## 7. Testing Architecture

Test tiers common to the whole PawPlace system:

| Tier | Scope | Test doubles | Where it runs |
|---|---|---|---|
| **Domain** | One aggregate or domain service, no I/O | Real domain objects; in-memory store lists for `StoreLocator` | Vitest — `packages/*/shared` and service unit tests |
| **Application** | One use case through service + fake repository | Fake/in-memory repository implementations | Vitest — `packages/*/server` application tests |
| **Integration** | One module against real MongoDB via HTTP | Real DB (test container or dev DB); supertest for Express routes | Vitest — `packages/app-server` integration tests |
| **E2E** | Key user paths through browser + live API + live DB | Real dev stack | Playwright — `conf/playwright.config.ts` |

Common test doubles: `InMemoryProductCatalogRepository`, `InMemoryStoreRepository`, seeded MongoDB fixtures via `dev-seed.ts`. Mechanism-specific testing (Security principal injection, Payment sandbox, B2B HMAC validation) is documented in `architecture-reference.md` as those mechanisms are implemented.

---

## 8. Decision Records

Blueprint-level decisions (continuing ADR numbering from the outline):

| ID | Decision | One-line consequence |
|---|---|---|
| [ADR-004](./ADR-004-vitest-playwright-test-tiers.md) | Vitest for domain/application/integration; Playwright for E2E | Fast in-process domain tests; browser coverage for IA walk paths. |

*(Mechanism technology choices have their ADRs in the outline. Blueprint ADRs cover: test-tier vocabulary, component boundaries, data ownership patterns. Further blueprint ADRs will be added as Order, Payment, and Identity increments introduce new decisions at this level.)*

---

## See also

- [`architecture-outline.md`](./architecture-outline.md) — one-page outline: layered diagram, system context with functions + tech, mechanisms catalogue with tech choices and NFR justifications, principles, tech stack, major systems, mechanism ADRs.
- [`architecture-reference.md`](./architecture-reference.md) — deep-dive per mechanism: code walkthroughs, sequence diagrams, tests.
- [`service-level-objectives.md`](./service-level-objectives.md) — non-functional requirements per major system.
- `packages/` — Increment 1 MERN spike implementing Product Catalog, Store Locator, App Shell.

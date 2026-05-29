# PawPlace — Architecture Blueprint

> **Status:** Draft
> **Owner:** Engineering
> **Last updated:** 2026-05-24
>
> **Purpose.** Second-level architecture document for PawPlace — an online pet store with in-store adoption visits. Names every architectural component, catalogues cross-cutting concerns as typed **architecture mechanisms**, sketches the data architecture, captures the common testing strategy, and records blueprint-level decisions. Deep mechanism walkthroughs live in [`architecture-reference.md`](./architecture-reference.md).

---

## 1. Scope

There is **no architecture outline on disk** for this brownfield engagement. Major systems are synthesized from [`docs/domain/object-model.md`](../domain/object-model.md), [`docs/domain/ubiquitous-language.md`](../domain/ubiquitous-language.md), the Increment 1 MERN spike under `packages/`, and the screen inventory in [`docs/ux/information-architecture.md`](../ux/information-architecture.md). Platform choice (MERN), deployment topology, and guiding principles are **implicit** from the spike and [`mern-technical-architecture`](../../.cursor/skills/mern-technical-architecture/SKILL.md) conventions; a formal outline may be produced later without contradicting this blueprint.

This blueprint adds **component-level descriptions** and a **mechanism catalogue** for the full PawPlace system. Increment 1 implements Product Catalog, Store Locator, and App Shell only; later increments (Order, Payment, Customer Account, Pet, Appointment, Notification) appear here as **named placeholder components** so downstream work has stable targets. Mechanism internals, sequence diagrams, file trees, and test code defer to [`architecture-reference.md`](./architecture-reference.md).

---

## 2. Components

Each subsection names one major system and its 2–4 components. Descriptions cover **purpose**, **dependencies**, and **interactions** only — no internal class lists or file trees.

![Component Overview](./diagrams/component-overview.png)

> Source: [`diagrams/component-overview.drawio`](./diagrams/component-overview.drawio). Edit in draw.io Desktop and re-export with `arch-drawio.ps1 export`. Keep diagram and subsections in sync.

### 2.1 App Shell components

#### AppServerHost

**Purpose.** Composes the Express application: mounts domain module routers, applies shared middleware (JSON parsing, error translation), and exposes a single HTTP entry point for the React client and future API consumers.

**Dependencies.** MongoDB `Db` connection, factory functions from `@pawplace/store-server` and `@pawplace/product-catalog-server`, shared configuration loaded at startup.

**Interactions.** Receives browser and E2E requests on `/api/*`; delegates to Store Locator and Product Catalog route modules. Does not contain domain logic — only wiring. Future Order and Customer Account modules mount here the same way.

#### AppClientShell

**Purpose.** Top-level React application: primary navigation, route table, and layout chrome (header, footer, tab bar) that hosts domain-specific views from capability packages.

**Dependencies.** React Router, API client modules from `@pawplace/store-client` and `@pawplace/product-catalog-client`, build tooling (Vite).

**Interactions.** Renders customer screens from IA (store locator map/list, product catalog, product detail, stock display) and the staff admin stock form. Calls REST endpoints on AppServerHost. Future checkout and account flows add routes without replacing the shell.

### 2.2 Product Catalog components

#### ProductCatalogService

**Purpose.** Application service for catalog reads and stock mutations: product browse/detail, per-store stock display, and staff stock-level updates. Enforces domain invariants from the Product Catalog bounded context (stock quantity rules, SKU identity).

**Dependencies.** `ProductCatalogRepository`, domain types from `@pawplace/product-catalog-shared` (`Product`, `StockAvailability`, `ProductCatalog`).

**Interactions.** Called by ProductCatalogApi controllers. Reads product identity and pricing for display; writes stock availability when staff submit the admin form. Future Order module will call read-only product lookup and stock gating through this service's public surface — not the repository directly.

#### ProductCatalogRepository

**Purpose.** Persistence adapter for catalog aggregates: products, categories, images, and per-store stock availability records in MongoDB.

**Dependencies.** MongoDB collections, mapping between stored documents and shared domain types.

**Interactions.** Called exclusively by ProductCatalogService. No cross-module direct access. Stock availability records are keyed by product SKU and store code.

#### ProductCatalogApi

**Purpose.** HTTP adapter exposing catalog and stock endpoints to AppClientShell and future consumers. Translates request DTOs to service calls and HTTP status codes.

**Dependencies.** ProductCatalogService, Zod request/response schemas from shared package.

**Interactions.** Mounted under `/api` by AppServerHost. Serves product detail, stock-by-store lists, and staff stock update POST. Validation runs at this edge before the service layer.

### 2.3 Store Locator components

#### StoreLocatorService

**Purpose.** Application service for geographic store discovery: map view, list view, distance calculation from postcode or browser geolocation, and store detail for the side panel.

**Dependencies.** `StoreRepository`, domain `StoreLocator` from `@pawplace/store-shared`.

**Interactions.** Called by StoreApi controllers. Returns active stores sorted or filtered by distance. Product Catalog's stock display references store codes from this context but does not own store data.

#### StoreRepository

**Purpose.** Persistence adapter for Store aggregates: name, geo-coordinates, address, hours, contact, specialization, and active status.

**Dependencies.** MongoDB store collection.

**Interactions.** Called only by StoreLocatorService. Seed data supports dev and E2E environments.

#### StoreApi

**Purpose.** HTTP adapter for store locator endpoints (list, map, distance query, detail).

**Dependencies.** StoreLocatorService, Zod schemas from shared package.

**Interactions.** Mounted under `/api` by AppServerHost. Consumed by map and list views in AppClientShell.

### 2.4 Order components *(planned — Increment 2+)*

#### OrderService *(planned)*

**Purpose.** Will own the shopping cart and order lifecycle from cart through fulfilment and return. Canonical source of order line items with price snapshots.

**Dependencies.** Will depend on `IProductCatalogClient`, `IStoreClient`, `IOrderRepository`, `IPaymentGateway`, `IEventPublisher`.

**Interactions.** Will be called from checkout API; will validate line items against Product Catalog and selected store; will emit domain events for Notification. **Not implemented in Increment 1.**

#### OrderRepository *(planned)*

**Purpose.** Will persist Order aggregate roots and line items. Will enforce one repository per aggregate boundary.

**Dependencies.** MongoDB (planned dedicated collections).

**Interactions.** Will be called only by OrderService. **Not implemented in Increment 1.**

### 2.5 Payment components *(planned — Increment 2+)*

#### PaymentGatewayAdapter *(planned)*

**Purpose.** Will unify third-party payment vendors (StripeWave first) behind a single checkout interface; routes refunds through the original vendor.

**Dependencies.** Will depend on vendor SDKs and `IPaymentRepository`.

**Interactions.** Will be invoked by OrderService during checkout; will not be called from Product Catalog or Store Locator. **Not implemented in Increment 1.**

### 2.6 Customer Account components *(planned — Increment 4)*

#### CustomerAccountService *(planned)*

**Purpose.** Will own registration, login, session, saved addresses, saved payment methods, wishlist, and order history visibility.

**Dependencies.** Will depend on `ICustomerAccountRepository`, `IIdentityProvider` (or local credential store), `IOrderClient`.

**Interactions.** Will gate authenticated routes in AppClientShell; will supply account identity for CustomerReview authorship. **Not implemented in Increment 1.**

### 2.7 Pet & Appointment components *(planned — later increment)*

#### PetProfileService *(planned)*

**Purpose.** Will manage in-store pet profiles, lifecycle events, and adoption browsing — pets are not purchasable online.

**Dependencies.** Will depend on `IPetRepository`, `IStoreClient`.

**Interactions.** Will collaborate with AppointmentService for visit booking. **Not implemented in Increment 1.**

#### AppointmentService *(planned)*

**Purpose.** Will schedule customer visits to meet pets at a hosting store; manages time slots, check-in, and visit outcomes.

**Dependencies.** Will depend on `IAppointmentRepository`, `IPetProfileService`, `IStoreClient`, `INotificationClient`.

**Interactions.** Will consume store location from Store Locator; will send transactional notifications. **Not implemented in Increment 1.**

### 2.8 Notification components *(planned)*

#### NotificationDispatcher *(planned)*

**Purpose.** Will route transactional and marketing messages to email/push channels according to communication preferences.

**Dependencies.** Will depend on template store and channel providers.

**Interactions.** Will subscribe to domain events from Order, Appointment, and Product Catalog (restock alerts). **Not implemented in Increment 1.**

---

## 3. Architecture Mechanisms

Each mechanism names a cross-cutting concern the architecture commits to (or plans). Description is 1–2 paragraphs; deep walkthroughs defer to [`architecture-reference.md`](./architecture-reference.md).

### 3.1 Security

Increment 1 is intentionally **unauthenticated** — catalog browse, store locator, and a bare staff stock form have no login gate. Security mechanism is **planned** for Customer Account (Increment 4): session or token-based identity, role claims for store employees vs customers, and secret handling via environment configuration — never hard-coded. AppServerHost will apply authentication middleware before protected routes; domain services receive an explicit principal argument rather than reading ambient request context.

*See [`architecture-reference.md` § Security](./architecture-reference.md#security) for the full middleware sequence and role model when implemented.*

### 3.2 Error Handling & Resilience

Domain layer throws typed domain errors (e.g. `NegativeQuantityError` on invalid stock updates). API adapters map known failures to HTTP 4xx responses; unexpected errors become 500 with a generic body. Increment 1 has no external payment or identity calls, so retry/circuit-breaker decorators are **deferred** until Payment and third-party integrations land. The convention is established: domain failures are explicit and translatable at the HTTP edge.

*See [`architecture-reference.md` § Error Handling & Resilience](./architecture-reference.md#error-handling--resilience).*

### 3.3 Logging & Observability

Structured console logging at API entry and domain failure points. Correlation IDs and OpenTelemetry export are **planned** for production hardening but not required for the Increment 1 spike. Log shape and metric naming will be fixed before Increment 2 checkout goes live.

*See [`architecture-reference.md` § Logging & Observability](./architecture-reference.md#logging--observability).*

### 3.4 Validation

Request and response contracts are validated with **Zod schemas** colocated in each capability's `shared` package. Invalid requests fail at the API edge before reaching application services. Business-rule validation (stock quantity invariants, store active status) runs inside domain services and returns typed errors.

*See [`architecture-reference.md` § Validation](./architecture-reference.md#validation).*

### 3.5 Configuration

Configuration is read at process startup from environment variables (`MONGODB_URI`, port, seed flags). Domain and shared packages do not read `process.env` directly — only AppServerHost and dev entry scripts do. Secrets for payment vendors and auth providers will follow the same bootstrap pattern when those increments ship.

*See [`architecture-reference.md` § Configuration](./architecture-reference.md#configuration).*

### 3.6 Persistence

Each bounded context owns its MongoDB collections accessed through a dedicated repository interface. Product Catalog and Store Locator do not share collections or cross-write aggregates. Cross-context consistency is **read-by-reference** (store code on stock availability) until Order introduces transactional boundaries and optional outbox publishing.

*See [`architecture-reference.md` § Persistence](./architecture-reference.md#persistence).*

### 3.7 Communication

**Synchronous REST** over HTTP/JSON is the only integration style in Increment 1. AppClientShell calls AppServerHost; AppServerHost routes to module routers. Future event-driven notification will add async domain events without replacing REST for query paths. API paths are grouped by capability under `/api`.

*See [`architecture-reference.md` § Communication](./architecture-reference.md#communication).*

---

## 4. Data Architecture

### 4.1 Entity overview

![Entity Relationships](./diagrams/entity-relationships.png)

> Source: [`diagrams/entity-relationships.drawio`](./diagrams/entity-relationships.drawio). Colour groups aggregates by owning bounded context. Dashed boxes are planned aggregates not yet persisted. Schemas and indexes live with the Persistence mechanism reference.

### 4.2 Ownership boundaries

| Aggregate / entity | Owning component | Cross-context access |
|---|---|---|
| `ProductCatalog`, `Product`, `Category`, `ProductImage` | ProductCatalogRepository | Read via ProductCatalogService / API only |
| `StockAvailability` (per product × store) | ProductCatalogRepository | References `Store` by store code; no FK to Store collection |
| `Store`, `StoreLocator` (domain service over stores) | StoreRepository | Read via StoreLocatorService / API only |
| `Order`, `LineItem` *(planned)* | OrderRepository *(planned)* | Will reference product by SKU snapshot; events for Notification |
| `CustomerAccount` *(planned)* | CustomerAccountRepository *(planned)* | Will link to orders by account id |
| `Pet`, `Appointment` *(planned)* | Pet / Appointment repositories *(planned)* | Pet references hosting store; appointment references pet and store |

Cross-aggregate consistency within a bounded context is **immediate** (single repository transaction where needed). Across contexts it is **reference-by-id** today and **eventual via domain events** once Order and Notification ship.

---

## 5. Testing Architecture

Test tiers common to the whole PawPlace system:

| Tier | Scope | Test doubles | Where it runs |
|---|---|---|---|
| **Domain** | One aggregate or domain service, no I/O | Real domain objects; in-memory store lists for StoreLocator | Vitest — `packages/*/shared` and service unit tests |
| **Application** | One use case through service + fake repository | Fake/in-memory repositories | Vitest — `packages/*/server` |
| **Integration** | One module against real MongoDB | Real DB (test container or dev DB); supertest for HTTP | Vitest — app-server integration tests |
| **E2E** | Key user paths through browser + API | Real dev stack | Playwright — `conf/playwright.config.ts` |

Common doubles: in-memory repository implementations, seeded MongoDB fixtures via `dev-seed.ts`. Mechanism-specific testing (security principal injection, payment sandbox) lives in the architecture reference as those mechanisms are implemented.

---

## 6. Decision Records

Blueprint-level decisions (no prior outline ADRs — numbering starts at 001):

| ID | Decision | One-line consequence |
|---|---|---|
| [ADR-001](./decisions/ADR-001-domain-first-mern-packages.md) | Domain-first MERN package per bounded context | Each capability owns `shared/`, `server/`, `client/`; App Shell composes modules. |
| [ADR-002](./decisions/ADR-002-mongodb-persistence.md) | MongoDB as primary persistence | Repositories map documents to shared domain types; one collection set per context. |
| [ADR-003](./decisions/ADR-003-zod-api-validation.md) | Zod schemas at the API boundary | Invalid requests fail before application services; schemas shared with client where useful. |
| [ADR-004](./decisions/ADR-004-vitest-playwright-test-tiers.md) | Vitest for unit/application/integration; Playwright for E2E | Fast in-process domain tests; browser coverage for IA walk paths. |

---

## See also

- [`docs/domain/ubiquitous-language.md`](../domain/ubiquitous-language.md) — canonical domain vocabulary
- [`docs/domain/object-model.md`](../domain/object-model.md) — aggregate operations and invariants
- [`docs/ux/information-architecture.md`](../ux/information-architecture.md) — Increment 1 screens this architecture supports
- [`docs/story/thin-slicing.md`](../story/thin-slicing.md) — increment scope and ordering
- [`architecture-reference.md`](./architecture-reference.md) — mechanism deep-dives (stubs)
- `packages/` — Increment 1 MERN spike implementing Product Catalog, Store Locator, App Shell

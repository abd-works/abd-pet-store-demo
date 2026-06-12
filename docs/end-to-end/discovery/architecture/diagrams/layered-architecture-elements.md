# PawPlace Pet Store — Layered Architecture Elements

> **Diagram:** `layered-architecture.drawio`
> **Last updated:** 2026-06-11

---

## Layers

### Presentation (Layer)
Owns all UI concerns: React views, React hooks, client-side domain JS extensions (`<Entity>sClient`, `<Entity>Client`), and type-safe HTTP API clients (`<Entity>Api`). Contains no business rules; delegates all domain behaviour to client-side domain classes or to the API server.

**Technology:** React 18 · React Router 6 · TanStack Query 5 · Vite 5 · TypeScript 5

### Application (Layer)
Owns HTTP routing and request orchestration: Express route handlers (`<Entity>Router`) and server-side domain classes (`<Entity>sServer`) that co-ordinate repository calls and business operations. No business rules are encoded here — domain classes own them.

**Technology:** Node.js 20 · Express 4 · TypeScript 5 · Zod 3

### Domain — shared/ (Layer)
Encodes business rules and invariants: entities, value objects, collection classes, Zod schemas, and repository interfaces. Has zero imports from any framework, database driver, or HTTP library; all infrastructure dependencies are expressed as interfaces owned here.

**Technology:** TypeScript 5 · Zod 3 (schema definitions only)

### Infrastructure (Layer)
Implements all external concerns: MongoDB repository classes (`<Entity>RepositoryServer`), the Store Locator API adapter (`StoreLocatorAdapter`), and the Supplier B2B adapter (`SupplierFeedAdapter`). Never imported by Application or Domain by class name — only via the interfaces they implement.

**Technology:** MongoDB 7 (native driver) · Store Locator API (HTTPS/JSON) · Pet Supplier B2B Feed (HTTPS/JSON)

---

## Dependency Direction

### PawPlace Dependency Rule (Dependency Direction)
Dependencies flow strictly downward: Presentation → Application → Domain (shared/) → Infrastructure interfaces; Infrastructure implements Domain interfaces but is never imported upward by Application or Domain layers.

---

## Legend

| Visual | Meaning |
|---|---|
| Dark stacked horizontal box | One architectural layer |
| Technology badge line (italic) | Runtime technologies resident in that layer |
| Solid arrow (downward) | Allowed compile-time dependency |
| Dashed arrow (upward) | Interface implementation — Infrastructure realises Domain interfaces |

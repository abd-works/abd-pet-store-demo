# PawPlace Pet Store — Platform Architecture Elements

> **Diagram:** `platform-architecture.drawio`
> **Last updated:** 2026-06-11

---

## Client Applications

### PawPlace React SPA (Client Application)
Browser-based React 18 application; single entry point for both the customer shopping journey (catalogue, cart, checkout, order tracking, store locator) and the staff admin view (stock management, order processing). Built and bundled by Vite 5.

---

## Backend Services

### PawPlace API Server (Backend Service)
Node.js 20 / Express 4 REST API; composition root that mounts all domain module routers, applies shared middleware (JSON parsing, error translation, CORS), and serves all `/api/*` routes to the SPA and external consumers.

---

## Background Workers

### Inventory B2B Sync Worker (Background Worker)
Node.js 20 long-running process; receives inbound inventory update webhooks from the Pet Supplier B2B Feed and sends outbound fulfilment order confirmations. Writes translated `StockAvailability` documents to MongoDB via the Product Catalog repository interface.

---

## Data Stores

### MongoDB Atlas (Data Store)
Managed MongoDB 7 cloud cluster hosting all domain aggregate collections (products, categories, stock availability, stores, orders, customers). Single data store for the application; bounded contexts are separated by collection naming conventions, not separate clusters.

---

## CDN / Edge

### Static Asset Host / CDN (CDN / Edge)
Serves the compiled React SPA build artefacts (HTML, JS, CSS bundles) from a CDN edge or PaaS static-file middleware. Reduces API server load for SPA fetches; all subsequent API calls are made from the running browser SPA.

---

## Third-Party Integrations

### Store Locator API (Third-Party Integration)
External geolocation service providing store proximity calculations by postcode or coordinates. Called read-only by the API Server at query time; PawPlace owns no geolocation engine.

### Pet Supplier B2B Feed (Third-Party Integration)
Upstream pet product supplier and the authoritative source for stock availability. Sends webhook events inbound to the Sync Worker and receives outbound fulfilment notifications; the integration is asynchronous and webhook-driven.

---

## Technology Badges

| Element | Technology badge |
|---|---|
| PawPlace React SPA | React 18 · React Router 6 · TanStack Query 5 · Vite 5 · TypeScript 5 |
| PawPlace API Server | Node.js 20 · Express 4 · TypeScript 5 · Zod 3 |
| Inventory B2B Sync Worker | Node.js 20 · TypeScript 5 · Zod 3 |
| MongoDB Atlas | MongoDB 7 (managed Atlas cluster) |

---

## Legend

| Visual | Meaning |
|---|---|
| Blue rounded box | Client application (browser-side) |
| Orange rounded box | Backend service (server-side) |
| Purple rounded box | Background worker |
| Cylinder | Data store |
| Grey diamond | CDN / edge node |
| Grey rounded box | Third-party integration |
| Solid arrow | Synchronous request/response |
| Dashed arrow | Async or webhook connection |

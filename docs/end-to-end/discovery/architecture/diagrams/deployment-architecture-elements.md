# PawPlace Pet Store — Deployment Architecture Elements

> **Diagram:** `deployment-architecture.drawio` · C4 Deployment
> **Last updated:** 2026-06-11

---

## Environments

### Production (Deployment Environment)
PaaS host (Railway / Render / Heroku or equivalent); single region, managed database on MongoDB Atlas; 99% availability target for demo scope.

### Development (Deployment Environment)
Developer laptop; Vite dev server on port 5173 proxying `/api/*` to a local Express process on port 3001; MongoDB running in Docker or connecting to a shared Atlas dev cluster.

---

## Deployment Nodes

### PaaS Host (Deployment Node)
Managed platform-as-a-service runtime that hosts the Node.js processes; handles TLS termination, process restarts, and basic horizontal scaling for the demo.

### MongoDB Atlas (Deployment Node)
Managed MongoDB cloud cluster hosting all domain aggregate collections; shared Atlas free/flex tier for demo, with replica set for data safety.

---

## Infrastructure Nodes

### Static Asset Host / CDN (Infrastructure Node)
Serves the compiled React SPA build artefacts (HTML, JS, CSS) from the edge or from the PaaS static-file middleware; reduces origin load for SPA requests.

---

## Container Instances

### PawPlace API Server (Container Instance)
Node.js 20 Express process (`packages/app-server`); single instance for demo, handles all domain API routes for customers and store employees.

### Inventory B2B Sync Worker (Container Instance)
Node.js 20 background process (`packages/inventory-b2b/server`); receives inbound supplier webhooks and runs scheduled inventory pull jobs; writes to MongoDB via the product-catalog repository.

---

## Relationships

### Browser → Static Asset Host: HTTPS (Relationship)
Customer or employee browser fetches the compiled SPA bundle over HTTPS; all subsequent API calls are made from the SPA running in the browser.

### Browser → PawPlace API Server: HTTPS / JSON (Relationship)
SPA makes REST API calls over HTTPS; JWT included in the `Authorization` header; API server validates the token before processing any request.

### PawPlace API Server → MongoDB Atlas: MongoDB wire protocol (Relationship)
API server connects to Atlas over TLS using the MongoDB driver; reads and writes domain aggregate collections through bounded-context repository implementations.

### PawPlace API Server → Store Locator API: HTTPS / JSON (Relationship)
For store-locator queries, the API server makes an outbound HTTPS call to the external geolocation service and returns proximity results to the SPA.

### Pet Supplier B2B Feed → Inventory B2B Sync Worker: HTTPS / JSON webhook (Relationship)
Supplier POSTs stock-level update payloads to the worker's webhook endpoint over HTTPS; the worker validates and applies the updates.

### Inventory B2B Sync Worker → MongoDB Atlas: MongoDB wire protocol (Relationship)
Worker writes translated `StockAvailability` documents to Atlas after processing each supplier update batch.

### Inventory B2B Sync Worker → Pet Supplier B2B Feed: HTTPS / JSON (Relationship)
Worker sends outbound fulfilment order confirmations to the supplier after a click-and-collect order is placed.

---

## Legend

| Visual | Meaning |
|---|---|
| Outer rounded box | Deployment environment |
| Inner box | Deployment node |
| Solid box | Container instance (running process) |
| Diamond / cylinder | Infrastructure node (CDN, load balancer, database) |
| Solid arrow | Synchronous HTTPS / TCP connection; label shows protocol |
| Dashed arrow | Async or event-driven connection |

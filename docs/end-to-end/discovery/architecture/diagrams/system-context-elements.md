# PawPlace Pet Store — System Context Elements

> **Diagram:** `system-context.drawio` · C4 Level 1
> **Last updated:** 2026-06-11

---

## Systems in Scope

### PawPlace Pet Store (Software System)
Online pet supplies retailer with click-and-collect fulfilment — a single MERN application serving customers and store employees through one React SPA and one Express API.

**Major functions:**
- Browse and search the product catalogue by category, pet type, and brand
- Shopping cart management and checkout with click-and-collect store selection
- Click-and-collect order tracking and in-store pick-up processing
- Store locator — find nearby PawPlace stores by postcode or location
- Inventory management — store employees update stock levels via the admin dashboard
- Inventory synchronisation — receive and apply stock updates from the pet supplier

**Platform technology:**
- **App stack:** Node.js 20 · Express 4 (API server) · React 18 · React Router 6 · TanStack Query 5 · Vite 5
- **Persistence:** MongoDB 7 via Atlas — single data store for all domain aggregates
- **Tools / infrastructure libs:** TypeScript 5 · Zod 3 · Vitest 1 · Playwright 1 · GitHub Actions

---

## Persons

### Customer (Person)
Pet owner who browses the product catalogue, adds items to a cart, places click-and-collect orders, and tracks order status through the PawPlace Web SPA.

### Store Employee (Person)
PawPlace staff member who updates stock levels, processes click-and-collect pick-ups, and manages product listings through the admin-dashboard routes in the same SPA.

---

## External Systems

### Store Locator API (External System)
Third-party geolocation service that returns store proximity results for a given postcode or coordinates; called read-only by the PawPlace API server.

### Pet Supplier B2B Feed (External System)
Upstream pet product supplier that is the authoritative source for stock availability; sends inventory updates to PawPlace via HTTPS webhook and receives outbound fulfilment order confirmations.

---

## Relationships

### Customer → PawPlace Pet Store: Browse, cart, and checkout (Relationship)
**Protocol:** HTTPS / REST + JSON
Customer interacts via the React SPA; the SPA renders catalogue, cart, and order flows returned by the API server over REST.

### Store Employee → PawPlace Pet Store: Manage stock and orders (Relationship)
**Protocol:** HTTPS / REST + JSON
Employee uses role-gated admin routes in the same SPA; the API server enforces role authorisation before accepting stock updates or order state changes.

### PawPlace Pet Store → Store Locator API: Proximity query (Relationship)
**Protocol:** HTTPS / REST + JSON (outbound read-only)
The API server sends a postcode or coordinate and receives a distance-ordered list of nearby stores; no writes, no authentication data sent to the external service.

### Pet Supplier B2B Feed → PawPlace Pet Store: Inventory update webhook (Relationship)
**Protocol:** HTTPS / JSON webhook (POST)
The supplier POSTs stock-level changes to the PawPlace B2B Sync Worker endpoint; the worker validates the payload and writes updated `StockAvailability` records to MongoDB.

### PawPlace Pet Store → Pet Supplier B2B Feed: Fulfilment order confirmation (Relationship)
**Protocol:** HTTPS / REST + JSON (outbound)
After a click-and-collect order is confirmed, the B2B Sync Worker sends an outbound fulfilment notification to the supplier so the supplier can allocate stock.

---

## Legend

| Visual | Meaning |
|---|---|
| Dark blue rounded box | Software system in scope (PawPlace) |
| Green rounded box | Human actor / person |
| Red/orange rounded box | External software system |
| Solid bidirectional arrow | Interactive HTTPS/JSON exchange |
| Solid directional arrow | One-way call or data flow; label states what crosses the boundary |

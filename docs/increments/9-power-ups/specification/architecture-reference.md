# Architecture Reference


---

## increment-9-power-ups-reference

<!-- migrated from: increments/9-power-ups/specification/architecture-reference.md -->

# Increment 9 — Power-ups Architecture Reference

Companion reference for Increment 9 sprint specification and engineering. Mechanisms created during specification `abd-architecture-reference` passes.

---

## Mechanism: Product Search & Filter

Keyword search with relevance ranking; conjunctive filter facets (category, pet type, brand, price range, in-stock). Stateless application service over product catalog repository.

**File Structure:** `packages/product-catalog/server/product-search.service.ts`, `product-search.controller.ts`, `product-search.routes.ts`

**Route:** `GET /api/products/search?q=&category=&petType=&brand=&minPrice=&maxPrice=&inStock=`

---

## Mechanism: My Store Preference

Logged-in customer persists one preferred store code; replaces previous preference immediately.

**File Structure:** `packages/customer-account/server/my-store.repository.ts`, `my-store.service.ts`, `my-store.controller.ts`, `my-store.routes.ts`

**Routes:** `GET/PUT /api/account/my-store`

---

## Mechanism: Customer Pet Profile

CRUD for customer-owned pet profiles under account scope.

**File Structure:** `packages/customer-account/server/pet-profile.repository.ts`, `pet-profile.service.ts`, `pet-profile.controller.ts`, `pet-profile.routes.ts`

**Routes:** `GET/POST /api/account/pets`, `PATCH/DELETE /api/account/pets/:id`

---

## Mechanism: Inventory Dashboard

Staff read model over stock rows with low-stock badge when `availableToSellQuantity <= threshold`.

**File Structure:** `packages/product-catalog/server/inventory-dashboard.service.ts`, `inventory-dashboard.controller.ts`, `inventory-dashboard.routes.ts`

**Route:** `GET /api/admin/inventory`

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

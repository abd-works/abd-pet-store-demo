---
ticket: inc-8-sprint-1-reviews
skill: abd-architecture-reference
scope: Increment 8 Sprint 1 — Customer reviews
---

# Architecture Reference Assignment — Increment 8 Sprint 1 (Customer reviews)

**Ticket:** `inc-8-sprint-1-reviews`  
**Reference document:** [`increment-8-marketing-engine-reference.md`](./increment-8-marketing-engine-reference.md) § Mechanism: Customer Review  
**Mode:** Project (companion reference exists from exploration)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Customer Review | Yes |
| Communication Preferences & Marketing Consent Gate | No (Sprint 2) |
| Marketing Email Dispatch | No (Sprint 3) |
| Marketing Unsubscribe | No (Sprint 4) |
| Content Publishing | No (Sprint 4) |
| Notification Preferences (Transactional) | No (Sprint 2) |

Cross-cutting mechanisms (**Error Handling**, **Validation**, **Persistence**) are **assigned** from [`architecture-reference.md`](./architecture-reference.md) — not re-authored.

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Customer Review | **assign** | **create** | Reference: `docs/architecture/increment-8-marketing-engine-reference.md` § Customer Review |
| Error Handling (typed domain errors → HTTP) | **assign** | **assign** | `architecture-reference.md` § Error Handling; controller maps `NotPurchasedError` → 403 |
| Validation (Zod at API edge) | **assign** | **create** | `packages/product-catalog/shared/review.schema.ts` |
| Persistence (in-memory repository; Mongo deferred to engineering) | **assign** | **create** | `packages/product-catalog/server/review.in-memory-repository.ts` |
| Purchase verification (Order cross-context) | **assign** | **create** | `packages/product-catalog/server/purchase-verification.client.ts` |
| Review photo storage adapter | **assign** | **create** | `packages/product-catalog/server/review-photo.storage.ts` |
| Presentation (review UI components) | **assign** | **create** | `packages/product-catalog/client/ReviewForm.tsx`, `ReviewList.tsx`, `ReviewPhotoLightbox.tsx`, `AggregateStarRating.tsx` |

### Created files (Customer Review mechanism)

```
packages/product-catalog/shared/
  CustomerReview.ts
  StarRating.ts
  ReviewPhoto.ts
  AggregateStarRating.ts
  review.schema.ts
  review.errors.ts
packages/product-catalog/server/
  review.service.ts
  review.controller.ts
  review.routes.ts
  review.repository.ts
  review.in-memory-repository.ts
  review-photo.storage.ts
  purchase-verification.client.ts
  review.module.ts
packages/product-catalog/client/
  ReviewForm.tsx
  ReviewList.tsx
  ReviewPhotoLightbox.tsx
  AggregateStarRating.tsx
```

### Assigned unchanged (prior increments / exploration)

- `docs/end-to-end/specification/architecture-reference.md` — layer model, error handling, validation, persistence patterns
- `docs/architecture/increment-8-marketing-engine-reference.md` — mechanism specification (walkthrough authoritative)
- `packages/product-catalog/client/ProductDetailContent.tsx` — host surface; review section wired in engineering (`abd-interface-design` implementation pass)
- `packages/app-client` routing — unchanged this pass

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/products/:sku/reviews` | List reviews + aggregate (public) |
| POST | `/api/products/:sku/reviews` | Submit review (verified purchaser) |
| POST | `/api/products/:sku/reviews/:reviewId/photos` | Attach review photo |

### Walkthrough traceability

Architecture reference walkthrough (star-rating-only review for verified purchaser of `DOG-FOOD-01`):

1. `ReviewController.submitReview` — validates body via `createReviewSchema`, extracts account from session
2. `ReviewService.submitReview` — `PurchaseVerificationClient.hasPurchased` gate
3. `CustomerReview.create` — accepts rating without body
4. `ReviewRepository.insert` — persists review
5. `ReviewService.recomputeAggregate` — `AggregateStarRating.fromReviews`
6. Aggregate exposed on `GET /api/products/:sku/reviews` — product detail consumes in engineering

### Test coverage (this pass)

| Tier | Location | Focus |
| --- | --- | --- |
| Domain unit | `packages/product-catalog/shared/*.test.ts` | StarRating bounds, AggregateStarRating empty state |
| Application integration | `tests/marketing-engine/customer-reviews/*_server.test.ts` | Purchase gate 403, submit 201, aggregate recompute, photo validation |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

# Architecture Reference Assignment


---

## increment-8 (rollup)

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

# Architecture Reference Assignment


---

## increment-8-sprint-1-reviews-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-1-reviews
skill: abd-architecture-reference
scope: Increment 8 Sprint 1 — Customer reviews
---

# Architecture Reference Assignment — Increment 8 Sprint 1 (Customer reviews)

**Ticket:** `inc-8-sprint-1-reviews`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Mechanism: Customer Review  
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
| Customer Review | **assign** | **create** | Reference: `docs/increments/8-marketing-engine/specification/architecture-reference.md` § Customer Review |
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
- `docs/increments/8-marketing-engine/specification/architecture-reference.md` — mechanism specification (walkthrough authoritative)
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


---

## increment-8-sprint-2-preferences-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-2-preferences
skill: abd-architecture-reference
scope: Increment 8 Sprint 2 — Notification and communication preferences
---

# Architecture Reference Assignment — Increment 8 Sprint 2 (Preferences)

**Ticket:** `inc-8-sprint-2-preferences`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Communication Preferences & Marketing Consent Gate · § Notification Preferences (Transactional)  
**Mode:** Project (companion reference exists from exploration)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Communication Preferences & Marketing Consent Gate | Yes |
| Notification Preferences (Transactional) | Yes |
| Customer Review | No (Sprint 1) |
| Marketing Email Dispatch | No (Sprint 3) |
| Marketing Unsubscribe | No (Sprint 4) |
| Content Publishing | No (Sprint 4) |

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Communication Preferences & Marketing Consent Gate | **assign** | **create** | Reference: `architecture-reference.md` § Communication Preferences |
| Marketing Consent Guard | **assign** | **create** | `packages/marketing/server/marketing-consent.guard.ts` |
| Notification Preferences (Transactional) | **assign** | **create** | Reference: `architecture-reference.md` § Notification Preferences |
| Error Handling / Validation / Persistence | **assign** | **assign** | `architecture-reference.md`; Zod schemas at API edge |

### Created files

```
packages/customer-account/shared/
  MarketingCategory.ts
  CommunicationPreferences.ts
  communication-preferences.schema.ts
packages/customer-account/server/
  communication-preferences.repository.ts
  communication-preferences.service.ts
  communication-preferences.controller.ts
  communication-preferences.routes.ts
  notification-preferences.controller.ts
  notification-preferences.routes.ts
packages/marketing/shared/
  MarketingConsentGuard.ts
  OptInRecord.ts
packages/marketing/server/
  marketing-consent.guard.ts
  preferences.module.ts
packages/notification/shared/
  TransactionalCategory.ts
  NotificationPreferences.ts
  notification-preferences.schema.ts
packages/notification/server/
  notification-preferences.repository.ts
  notification-preferences.service.ts
```

**Note:** Notification delivery for marketing uses `NotificationService.sendMarketingEmail` wired inside `packages/marketing/server/marketing.module.ts`.

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/account/communication-preferences` | List marketing category opt-in status |
| PATCH | `/api/account/communication-preferences` | Immediate toggle per category |
| GET | `/api/account/notification-preferences` | List transactional notification toggles + critical note |
| PATCH | `/api/account/notification-preferences` | Immediate toggle per transactional category |

### Walkthrough traceability

Communication preferences opt-out at delivery time (reference walkthrough steps 1–6): PATCH toggle → `CommunicationPreferencesService.setCategoryOptIn` → later `MarketingConsentGuard.canSend` re-reads repository.

Notification preferences (reference walkthrough): PATCH `shipping: false` → optional transactional sends gated via `NotificationService.sendTransactional` with `mandatory: false`.

### Test coverage

| Tier | Location | Focus |
| --- | --- | --- |
| Domain unit | `tests/marketing-engine/preferences/preferences_server.test.ts` | Default opt-out; mandatory note |
| Application integration | same | PATCH/GET routes; consent guard realtime opt-out |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

**Deferred to engineering (`abd-interface-design` / `abd-clean-code`):** `CommunicationPreferencesPage.tsx`, `NotificationPreferencesPage.tsx`, account nav wiring.


---

## increment-8-sprint-3-campaigns-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-3-campaigns
skill: abd-architecture-reference
scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
---

# Architecture Reference Assignment — Increment 8 Sprint 3 (Campaigns)

**Ticket:** `inc-8-sprint-3-campaigns`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Mechanism: Marketing Email Dispatch  
**Mode:** Project (companion reference exists from exploration; Sprint 2 consent gate assigned)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Marketing Email Dispatch | Yes |
| Communication Preferences & Marketing Consent Gate | **assign** (Sprint 2) |
| Customer Review | No (Sprint 1) |
| Marketing Unsubscribe | No (Sprint 4) |
| Content Publishing | No (Sprint 4) |
| Notification Preferences | No (Sprint 2) |

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Marketing Email Dispatch | **assign** | **create** | Reference: `architecture-reference.md` § Marketing Email Dispatch |
| Marketing Consent Guard | **assign** | **assign** | `packages/marketing/server/marketing-consent.guard.ts` (Sprint 2) |
| NotificationService marketing path | **assign** | **create** | `NotificationService.sendMarketingEmail` |
| Promotional / Recommendation / Restock / Event templates | **assign** | **create** | `packages/marketing/shared/*.ts` |

### Created files

```
packages/marketing/shared/
  PromotionalEmail.ts
  PersonalizedRecommendation.ts
  RestockAlert.ts
  InStoreEventNotification.ts
  marketing.schema.ts
packages/marketing/server/
  marketing-dispatch.service.ts
  promotional-batch.repository.ts
  recommendation.engine.ts
  marketing.routes.ts
  marketing.module.ts
packages/notification/shared/
  MarketingEmailMessage.ts
packages/notification/server/
  notification.repository.ts (InMemoryNotificationRepository)
  email.provider.ts (ConsoleEmailProvider)
```

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/admin/marketing/promotional` | Admin promotional batch with delivery-time consent re-check |

Programmatic entry points (no HTTP): `sendPersonalizedRecommendation`, `sendRestockAlert`, `sendInStoreEventNotification` on `MarketingDispatchService`.

### Walkthrough traceability

Restock alert (reference walkthrough steps 1–6): stock event → wishlist lookup → `MarketingConsentGuard.canSend(restock_alerts)` per account → `NotificationService.sendMarketingEmail`.

Promotional batch: iterate recipients → delivery-time consent skip when opted out after batch creation.

### Test coverage

| Tier | Location | Focus |
| --- | --- | --- |
| Application integration | `tests/marketing-engine/campaigns/marketing-dispatch_server.test.ts` | Promotional skip after opt-out; restock alert consent gate |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

**Deferred to engineering:** stock transition event listener wiring, admin preview UI, recommendation scheduling jobs.


---

## increment-8-sprint-4-content-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-4-content
skill: abd-architecture-reference
scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
---

# Architecture Reference Assignment — Increment 8 Sprint 4 (Content)

**Ticket:** `inc-8-sprint-4-content`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Content Publishing · § Marketing Unsubscribe  
**Mode:** Project (companion reference exists from exploration)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Content Publishing | Yes |
| Marketing Unsubscribe | Yes |
| Marketing Email Dispatch | **assign** (Sprint 3 — footer URLs wired) |
| Communication Preferences & Marketing Consent Gate | **assign** (Sprint 2) |

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Content Publishing | **assign** | **create** | Reference: `architecture-reference.md` § Content Publishing |
| Marketing Unsubscribe | **assign** | **create** | Reference: `architecture-reference.md` § Marketing Unsubscribe |
| CommunicationPreferencesService | **assign** | **assign** | Sprint 2 `communication-preferences.service.ts` |
| Marketing dispatch unsubscribe URLs | **assign** | **create** | `UnsubscribeToken.buildUrl` per category in `marketing-dispatch.service.ts` |

### Created files

```
packages/content/shared/
  Content.ts
  BlogPost.ts
  PetCareGuide.ts
  content.errors.ts
  content.schema.ts
packages/content/server/
  content.repository.ts
  content.service.ts
  content.controller.ts
  content.routes.ts
  content.module.ts
packages/marketing/shared/
  UnsubscribeToken.ts
  unsubscribe.errors.ts
packages/marketing/server/
  unsubscribe.service.ts
  unsubscribe.controller.ts
  unsubscribe.routes.ts
```

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/content/blog` | Published blog index |
| GET | `/api/content/blog/:slug` | Published blog detail |
| GET | `/api/content/guides` | Published guide index (optional `speciesTag` filter) |
| GET | `/api/content/guides/:slug` | Published guide detail |
| POST | `/api/staff/content/blog` | Create blog draft |
| POST | `/api/staff/content/guides` | Create guide draft |
| POST | `/api/staff/content/:id/publish` | Publish (422 when guide missing tags) |
| PATCH | `/api/staff/content/:id` | Update published content |
| GET | `/api/marketing/unsubscribe/:token` | One-click category unsubscribe |

### Walkthrough traceability

Blog post draft hidden from index; publish makes slug accessible. Guide publish enforces `TagRequiredError` when `speciesTags` empty. Unsubscribe token verifies HMAC payload, calls `setCategoryOptIn(false)`, idempotent on repeat.

### Test coverage

| Tier | Location | Focus |
| --- | --- | --- |
| Application integration | `tests/marketing-engine/content/content-publishing_server.test.ts` | Draft vs published blog; guide tag invariant |
| Application integration | `tests/marketing-engine/content/unsubscribe_server.test.ts` | Token opt-out; idempotency; invalid token |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

**Deferred to engineering:** Staff content editor UI pages, blog/guide client routes, marketing email footer React page.


---

## increment-8-sprint-1-reviews-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-1-reviews
skill: abd-architecture-reference
scope: Increment 8 Sprint 1 — Customer reviews
---

# Architecture Reference Assignment — Increment 8 Sprint 1 (Customer reviews)

**Ticket:** `inc-8-sprint-1-reviews`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Mechanism: Customer Review  
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
| Customer Review | **assign** | **create** | Reference: `docs/increments/8-marketing-engine/specification/architecture-reference.md` § Customer Review |
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
- `docs/increments/8-marketing-engine/specification/architecture-reference.md` — mechanism specification (walkthrough authoritative)
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


---

## increment-8-sprint-2-preferences-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-2-preferences
skill: abd-architecture-reference
scope: Increment 8 Sprint 2 — Notification and communication preferences
---

# Architecture Reference Assignment — Increment 8 Sprint 2 (Preferences)

**Ticket:** `inc-8-sprint-2-preferences`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Communication Preferences & Marketing Consent Gate · § Notification Preferences (Transactional)  
**Mode:** Project (companion reference exists from exploration)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Communication Preferences & Marketing Consent Gate | Yes |
| Notification Preferences (Transactional) | Yes |
| Customer Review | No (Sprint 1) |
| Marketing Email Dispatch | No (Sprint 3) |
| Marketing Unsubscribe | No (Sprint 4) |
| Content Publishing | No (Sprint 4) |

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Communication Preferences & Marketing Consent Gate | **assign** | **create** | Reference: `architecture-reference.md` § Communication Preferences |
| Marketing Consent Guard | **assign** | **create** | `packages/marketing/server/marketing-consent.guard.ts` |
| Notification Preferences (Transactional) | **assign** | **create** | Reference: `architecture-reference.md` § Notification Preferences |
| Error Handling / Validation / Persistence | **assign** | **assign** | `architecture-reference.md`; Zod schemas at API edge |

### Created files

```
packages/customer-account/shared/
  MarketingCategory.ts
  CommunicationPreferences.ts
  communication-preferences.schema.ts
packages/customer-account/server/
  communication-preferences.repository.ts
  communication-preferences.service.ts
  communication-preferences.controller.ts
  communication-preferences.routes.ts
  notification-preferences.controller.ts
  notification-preferences.routes.ts
packages/marketing/shared/
  MarketingConsentGuard.ts
  OptInRecord.ts
packages/marketing/server/
  marketing-consent.guard.ts
  preferences.module.ts
packages/notification/shared/
  TransactionalCategory.ts
  NotificationPreferences.ts
  notification-preferences.schema.ts
packages/notification/server/
  notification-preferences.repository.ts
  notification-preferences.service.ts
```

**Note:** Notification delivery for marketing uses `NotificationService.sendMarketingEmail` wired inside `packages/marketing/server/marketing.module.ts`.

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/account/communication-preferences` | List marketing category opt-in status |
| PATCH | `/api/account/communication-preferences` | Immediate toggle per category |
| GET | `/api/account/notification-preferences` | List transactional notification toggles + critical note |
| PATCH | `/api/account/notification-preferences` | Immediate toggle per transactional category |

### Walkthrough traceability

Communication preferences opt-out at delivery time (reference walkthrough steps 1–6): PATCH toggle → `CommunicationPreferencesService.setCategoryOptIn` → later `MarketingConsentGuard.canSend` re-reads repository.

Notification preferences (reference walkthrough): PATCH `shipping: false` → optional transactional sends gated via `NotificationService.sendTransactional` with `mandatory: false`.

### Test coverage

| Tier | Location | Focus |
| --- | --- | --- |
| Domain unit | `tests/marketing-engine/preferences/preferences_server.test.ts` | Default opt-out; mandatory note |
| Application integration | same | PATCH/GET routes; consent guard realtime opt-out |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

**Deferred to engineering (`abd-interface-design` / `abd-clean-code`):** `CommunicationPreferencesPage.tsx`, `NotificationPreferencesPage.tsx`, account nav wiring.


---

## increment-8-sprint-3-campaigns-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-3-campaigns
skill: abd-architecture-reference
scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
---

# Architecture Reference Assignment — Increment 8 Sprint 3 (Campaigns)

**Ticket:** `inc-8-sprint-3-campaigns`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Mechanism: Marketing Email Dispatch  
**Mode:** Project (companion reference exists from exploration; Sprint 2 consent gate assigned)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Marketing Email Dispatch | Yes |
| Communication Preferences & Marketing Consent Gate | **assign** (Sprint 2) |
| Customer Review | No (Sprint 1) |
| Marketing Unsubscribe | No (Sprint 4) |
| Content Publishing | No (Sprint 4) |
| Notification Preferences | No (Sprint 2) |

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Marketing Email Dispatch | **assign** | **create** | Reference: `architecture-reference.md` § Marketing Email Dispatch |
| Marketing Consent Guard | **assign** | **assign** | `packages/marketing/server/marketing-consent.guard.ts` (Sprint 2) |
| NotificationService marketing path | **assign** | **create** | `NotificationService.sendMarketingEmail` |
| Promotional / Recommendation / Restock / Event templates | **assign** | **create** | `packages/marketing/shared/*.ts` |

### Created files

```
packages/marketing/shared/
  PromotionalEmail.ts
  PersonalizedRecommendation.ts
  RestockAlert.ts
  InStoreEventNotification.ts
  marketing.schema.ts
packages/marketing/server/
  marketing-dispatch.service.ts
  promotional-batch.repository.ts
  recommendation.engine.ts
  marketing.routes.ts
  marketing.module.ts
packages/notification/shared/
  MarketingEmailMessage.ts
packages/notification/server/
  notification.repository.ts (InMemoryNotificationRepository)
  email.provider.ts (ConsoleEmailProvider)
```

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/admin/marketing/promotional` | Admin promotional batch with delivery-time consent re-check |

Programmatic entry points (no HTTP): `sendPersonalizedRecommendation`, `sendRestockAlert`, `sendInStoreEventNotification` on `MarketingDispatchService`.

### Walkthrough traceability

Restock alert (reference walkthrough steps 1–6): stock event → wishlist lookup → `MarketingConsentGuard.canSend(restock_alerts)` per account → `NotificationService.sendMarketingEmail`.

Promotional batch: iterate recipients → delivery-time consent skip when opted out after batch creation.

### Test coverage

| Tier | Location | Focus |
| --- | --- | --- |
| Application integration | `tests/marketing-engine/campaigns/marketing-dispatch_server.test.ts` | Promotional skip after opt-out; restock alert consent gate |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

**Deferred to engineering:** stock transition event listener wiring, admin preview UI, recommendation scheduling jobs.


---

## increment-8-sprint-4-content-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-8-sprint-4-content
skill: abd-architecture-reference
scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
---

# Architecture Reference Assignment — Increment 8 Sprint 4 (Content)

**Ticket:** `inc-8-sprint-4-content`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Content Publishing · § Marketing Unsubscribe  
**Mode:** Project (companion reference exists from exploration)

## Mechanisms in scope

| Mechanism | In sprint scope |
| --- | --- |
| Content Publishing | Yes |
| Marketing Unsubscribe | Yes |
| Marketing Email Dispatch | **assign** (Sprint 3 — footer URLs wired) |
| Communication Preferences & Marketing Consent Gate | **assign** (Sprint 2) |

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Content Publishing | **assign** | **create** | Reference: `architecture-reference.md` § Content Publishing |
| Marketing Unsubscribe | **assign** | **create** | Reference: `architecture-reference.md` § Marketing Unsubscribe |
| CommunicationPreferencesService | **assign** | **assign** | Sprint 2 `communication-preferences.service.ts` |
| Marketing dispatch unsubscribe URLs | **assign** | **create** | `UnsubscribeToken.buildUrl` per category in `marketing-dispatch.service.ts` |

### Created files

```
packages/content/shared/
  Content.ts
  BlogPost.ts
  PetCareGuide.ts
  content.errors.ts
  content.schema.ts
packages/content/server/
  content.repository.ts
  content.service.ts
  content.controller.ts
  content.routes.ts
  content.module.ts
packages/marketing/shared/
  UnsubscribeToken.ts
  unsubscribe.errors.ts
packages/marketing/server/
  unsubscribe.service.ts
  unsubscribe.controller.ts
  unsubscribe.routes.ts
```

### API routes implemented

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/content/blog` | Published blog index |
| GET | `/api/content/blog/:slug` | Published blog detail |
| GET | `/api/content/guides` | Published guide index (optional `speciesTag` filter) |
| GET | `/api/content/guides/:slug` | Published guide detail |
| POST | `/api/staff/content/blog` | Create blog draft |
| POST | `/api/staff/content/guides` | Create guide draft |
| POST | `/api/staff/content/:id/publish` | Publish (422 when guide missing tags) |
| PATCH | `/api/staff/content/:id` | Update published content |
| GET | `/api/marketing/unsubscribe/:token` | One-click category unsubscribe |

### Walkthrough traceability

Blog post draft hidden from index; publish makes slug accessible. Guide publish enforces `TagRequiredError` when `speciesTags` empty. Unsubscribe token verifies HMAC payload, calls `setCategoryOptIn(false)`, idempotent on repeat.

### Test coverage

| Tier | Location | Focus |
| --- | --- | --- |
| Application integration | `tests/marketing-engine/content/content-publishing_server.test.ts` | Draft vs published blog; guide tag invariant |
| Application integration | `tests/marketing-engine/content/unsubscribe_server.test.ts` | Token opt-out; idempotency; invalid token |

**Standards:** `abd-clean-code`, `abd-acceptance-test-driven-development`, `mern-technical-architecture`

**Deferred to engineering:** Staff content editor UI pages, blog/guide client routes, marketing email footer React page.


---

## increment-9 (rollup)

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

# Architecture Reference Assignment


---

## increment-9-sprint-1-search-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-1-search
skill: abd-architecture-reference
scope: Increment 9 Sprint 1 — Product search and filter
---

# Architecture Reference Assignment — Increment 9 Sprint 1 (Search)

**Ticket:** `inc-9-sprint-1-search`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Product Search & Filter  
**Mode:** Project (reference created in this pass; no prior increment-9 companion)

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Product Search & Filter | **create** | **create** | `packages/product-catalog/server/product-search.*` |

### API

`GET /api/products/search` — keyword relevance, facet metadata, empty-state suggestions.

**Deferred to engineering:** Global header search UI, filter facet client components.


---

## increment-9-sprint-2-stores-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-2-stores
skill: abd-architecture-reference
scope: Increment 9 Sprint 2 — Store preference and tailoring
---

# Architecture Reference Assignment — Increment 9 Sprint 2 (My Store)

**Ticket:** `inc-9-sprint-2-stores`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § My Store Preference  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| My Store Preference | **create** | **create** | `packages/customer-account/server/my-store.*` |
| Store Locator filters | **assign** | **assign** | Existing store module — tailoring deferred to engineering |

### API

`GET/PUT /api/account/my-store` — one preference per account; immediate replace.

**Deferred to engineering:** Store locator filter UI, click-and-collect pre-select, stock default by preferred store.


---

## increment-9-sprint-3-inventory-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-3-inventory
skill: abd-architecture-reference
scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
---

# Architecture Reference Assignment — Increment 9 Sprint 3 (Pets & Inventory)

**Ticket:** `inc-9-sprint-3-inventory`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Customer Pet Profile · § Inventory Dashboard  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Customer Pet Profile | **create** | **create** | `packages/customer-account/server/pet-profile.*` |
| Inventory Dashboard | **create** | **create** | `packages/product-catalog/server/inventory-dashboard.*` |
| Backorder purchase | **assign** | **assign** | Existing `StockAvailability.backorderEnabled` — UI deferred |

### API

- `GET/POST/PATCH/DELETE /api/account/pets`
- `GET /api/admin/inventory` — rows with `lowStock` badge flag

**Deferred to engineering:** My Pets UI, inventory export, inline stock edit UI, backorder checkout flow.


---

## increment-9-sprint-1-search-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-1-search
skill: abd-architecture-reference
scope: Increment 9 Sprint 1 — Product search and filter
---

# Architecture Reference Assignment — Increment 9 Sprint 1 (Search)

**Ticket:** `inc-9-sprint-1-search`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Product Search & Filter  
**Mode:** Project (reference created in this pass; no prior increment-9 companion)

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Product Search & Filter | **create** | **create** | `packages/product-catalog/server/product-search.*` |

### API

`GET /api/products/search` — keyword relevance, facet metadata, empty-state suggestions.

**Deferred to engineering:** Global header search UI, filter facet client components.


---

## increment-9-sprint-2-stores-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-2-stores
skill: abd-architecture-reference
scope: Increment 9 Sprint 2 — Store preference and tailoring
---

# Architecture Reference Assignment — Increment 9 Sprint 2 (My Store)

**Ticket:** `inc-9-sprint-2-stores`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § My Store Preference  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| My Store Preference | **create** | **create** | `packages/customer-account/server/my-store.*` |
| Store Locator filters | **assign** | **assign** | Existing store module — tailoring deferred to engineering |

### API

`GET/PUT /api/account/my-store` — one preference per account; immediate replace.

**Deferred to engineering:** Store locator filter UI, click-and-collect pre-select, stock default by preferred store.


---

## increment-9-sprint-3-inventory-architecture-reference-assignment

<!-- migrated from: end-to-end/specification/architecture-reference-assignment.md -->

---
ticket: inc-9-sprint-3-inventory
skill: abd-architecture-reference
scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
---

# Architecture Reference Assignment — Increment 9 Sprint 3 (Pets & Inventory)

**Ticket:** `inc-9-sprint-3-inventory`  
**Reference document:** [`architecture-reference.md`](./architecture-reference.md) § Customer Pet Profile · § Inventory Dashboard  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| Customer Pet Profile | **create** | **create** | `packages/customer-account/server/pet-profile.*` |
| Inventory Dashboard | **create** | **create** | `packages/product-catalog/server/inventory-dashboard.*` |
| Backorder purchase | **assign** | **assign** | Existing `StockAvailability.backorderEnabled` — UI deferred |

### API

- `GET/POST/PATCH/DELETE /api/account/pets`
- `GET /api/admin/inventory` — rows with `lowStock` badge flag

**Deferred to engineering:** My Pets UI, inventory export, inline stock edit UI, backorder checkout flow.

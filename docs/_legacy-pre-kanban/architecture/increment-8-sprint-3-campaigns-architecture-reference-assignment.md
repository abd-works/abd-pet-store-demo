---
ticket: inc-8-sprint-3-campaigns
skill: abd-architecture-reference
scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
---

# Architecture Reference Assignment — Increment 8 Sprint 3 (Campaigns)

**Ticket:** `inc-8-sprint-3-campaigns`  
**Reference document:** [`increment-8-marketing-engine-reference.md`](./increment-8-marketing-engine-reference.md) § Mechanism: Marketing Email Dispatch  
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
| Marketing Email Dispatch | **assign** | **create** | Reference: `increment-8-marketing-engine-reference.md` § Marketing Email Dispatch |
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

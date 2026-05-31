---
ticket: inc-8-sprint-2-preferences
skill: abd-architecture-reference
scope: Increment 8 Sprint 2 — Notification and communication preferences
---

# Architecture Reference Assignment — Increment 8 Sprint 2 (Preferences)

**Ticket:** `inc-8-sprint-2-preferences`  
**Reference document:** [`increment-8-marketing-engine-reference.md`](./increment-8-marketing-engine-reference.md) § Communication Preferences & Marketing Consent Gate · § Notification Preferences (Transactional)  
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
| Communication Preferences & Marketing Consent Gate | **assign** | **create** | Reference: `increment-8-marketing-engine-reference.md` § Communication Preferences |
| Marketing Consent Guard | **assign** | **create** | `packages/marketing/server/marketing-consent.guard.ts` |
| Notification Preferences (Transactional) | **assign** | **create** | Reference: `increment-8-marketing-engine-reference.md` § Notification Preferences |
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

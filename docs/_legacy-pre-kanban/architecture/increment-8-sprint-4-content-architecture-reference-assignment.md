---
ticket: inc-8-sprint-4-content
skill: abd-architecture-reference
scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
---

# Architecture Reference Assignment — Increment 8 Sprint 4 (Content)

**Ticket:** `inc-8-sprint-4-content`  
**Reference document:** [`increment-8-marketing-engine-reference.md`](./increment-8-marketing-engine-reference.md) § Content Publishing · § Marketing Unsubscribe  
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
| Content Publishing | **assign** | **create** | Reference: `increment-8-marketing-engine-reference.md` § Content Publishing |
| Marketing Unsubscribe | **assign** | **create** | Reference: `increment-8-marketing-engine-reference.md` § Marketing Unsubscribe |
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

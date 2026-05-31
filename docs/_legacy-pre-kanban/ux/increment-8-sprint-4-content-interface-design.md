# Interface design — Increment 8 Sprint 4 (Content publishing and unsubscribe)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-8-marketing-engine.md` / `.drawio` (screens: *blog index*, *blog post detail*, *pet care guide index*, *pet care guide detail*, *admin — content editor*, *unsubscribe confirmation*; cross-link touchpoints on pet/product browsing). Specification-stage spec; implementation and tests land in Engineering. Extends primary nav with *blog* and *pet care guides*; staff dashboard gains *Content* tab per Increments 6–7 pattern — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 4 — Content publishing and unsubscribe (6 screens + 2 cross-link touchpoints, 3 stories) |
| Ticket | `inc-8-sprint-4-content` |
| Lo-fi reference | `docs/ux/lo-fi/increment-8-marketing-engine.md` (§ blog index · blog post detail · pet care guide index · pet care guide detail · admin — content editor · unsubscribe confirmation) |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Publish Blog Post · Publish Pet Care Guide · Unsubscribe from Marketing Emails) |
| Specification by example | `docs/story/specification-by-example/increment-8-sprint-4-content-specification-by-example.md` |
| Domain / CRC | `docs/domain/marketing-engine-content-crc.md`, `docs/domain/marketing-engine-ubiquitous-language.md` |
| Architecture reference | `docs/architecture/increment-8-marketing-engine-reference.md` (Mechanisms: Content Publishing · Marketing Unsubscribe) |
| Prior interface specs | `docs/ux/increment-8-sprint-2-preferences-interface-design.md` (Communication Preferences unsubscribe path); `docs/ux/increment-8-sprint-3-campaigns-interface-design.md` (email *Unsubscribe* link target → this sprint confirmation page) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/content/` (new domain package); `packages/app-client/src/pages/content/` — `BlogIndexPage.tsx`, `BlogPostPage.tsx`, `GuideIndexPage.tsx`, `GuideDetailPage.tsx`, `StaffContentEditorPage.tsx`; `packages/app-client/src/pages/marketing/UnsubscribeConfirmationPage.tsx`; extend `PrimaryNav.tsx`, `StaffNav.tsx`; pet/product browsing cross-links in `packages/pet-gallery/client/`, `packages/product-catalog/client/` |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 4 delivers public *Blog Index* and *Blog Post* detail surfaces, *Guide Index* and *Pet Care Guide* detail surfaces with species-tag filtering and cross-linking from pet and product browsing areas, a staff *Admin Content Area* with draft-to-published lifecycle for *Blog Post* and *Pet Care Guide* (including tag-required validation before publish), and the customer *Unsubscribe Confirmation Page* reached from signed *Unsubscribe Token* links in marketing emails. *Communication Preferences* unsubscribe toggles from Sprint 2 remain the preferences-page path; this sprint adds the one-click email link execution and idempotent confirmation UI. Draft *Content* is never visible to customers; published *Content* is always reachable via its own URL. All labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–7; content UI spans new `packages/content/` and `app-client` routes.

- **Folder layout:** new `packages/content/` per architecture reference (`Content.ts`, `BlogPost.ts`, `PetCareGuide.ts`, server module); customer pages under `packages/app-client/src/pages/content/`; staff editor under `packages/app-client/src/pages/staff/` or `pages/content/StaffContentEditorPage.tsx`; unsubscribe page under `packages/app-client/src/pages/marketing/`
- **State management:** server-backed content DTOs; staff editor local draft state with explicit Save as Draft / Publish actions; customer index/detail pages fetch published content only; unsubscribe page stateless after token processing
- **Styling:** component-scoped inline styles matching existing marketing/account pages; species tag as badge on guide detail; pet type filter as `nav-tabs` on guide index
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core in component tests; keyboard pass on staff editor, filter tabs, and confirmation CTAs
- **Performance budget:** no regression over Increment 7 baseline; content indexes paginate or lazy-load if list grows

---

## Primary navigation extension

Extend global primary nav (verbatim labels from lo-fi):

| Nav item | Route | Sprint |
| --- | --- | --- |
| find stores | existing | existing |
| shop supplies | existing | existing |
| blog | `/blog` | **new** |
| pet care guides | `/guides` | **new** |
| account | existing | existing |

Logged-in chrome (cart · pets · wishlist) unchanged from Increment 4.

---

## Staff navigation extension

Extend staff nav tabs (verbatim labels):

| Nav item | Route | Sprint |
| --- | --- | --- |
| Stock Levels | existing | existing |
| Incoming Appointments | existing | existing |
| Pet Profiles | existing | existing |
| Returns | existing | existing |
| Content | `/staff/content` | **new** |

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| blog index | stack | `/blog` | Publish Blog Post | **New** |
| blog post detail | stack | `/blog/:slug` | Publish Blog Post | **New** |
| pet care guide index | stack | `/guides` | Publish Pet Care Guide | **New** |
| pet care guide detail | stack | `/guides/:slug` | Publish Pet Care Guide | **New** |
| admin — content editor | form | `/staff/content` | Publish Blog Post · Publish Pet Care Guide | **New** |
| unsubscribe confirmation | stack | `/marketing/unsubscribe/:token` | Unsubscribe from Marketing Emails | **New** |
| pet browsing area (cross-link) | stack | existing pet gallery routes | Publish Pet Care Guide | **Updated** — species-filtered guide links |
| product browsing area (cross-link) | stack | existing product catalog routes | Publish Pet Care Guide | **Updated** — species-matched guide links |

---

## Screen spec (from lo-fi — regions verbatim)

### blog index

**Layout:** stack  
**Route:** `/blog`  
**AC stories:** Publish Blog Post (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | Content nav items active/highlight on blog routes |
| blog index header | body | form | PawPlace Blog | Page heading (`h1`) |
| blog post listing | body | list | title · summary · date · author · Read Post | Published posts only — API filters `lifecycle status: published`; drafts never returned |

Each list row links to `/blog/:slug`. *Read Post* is primary row action.

---

### blog post detail

**Layout:** stack  
**Route:** `/blog/:slug` (e.g. `/blog/spring-pet-safety-tips`)  
**AC stories:** Publish Blog Post (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Blog · Post Title (current) | Blog links back to `/blog` |
| blog post content | body | article | title · author · date · body content | Full article; body rendered as readable prose (not editable on customer view) |

Direct URL navigation must render full article (AC 4). 404 for unknown slug or draft slug.

---

### pet care guide index

**Layout:** stack  
**Route:** `/guides`  
**AC stories:** Publish Pet Care Guide (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| guide index header | body | form | Pet Care Guides | Page heading |
| pet type filter | body | nav-tabs | All (active) · Dogs · Cats · Senior Pets · Small Animals | `role="tablist"`; filters listing client-side or via query param |
| pet care guide listing | body | list | title · summary · pet type/species tag · date · Read Guide | Published guides only; tag badge visible per row |

Each row links to `/guides/:slug`. Filter tabs use UL tag vocabulary.

---

### pet care guide detail

**Layout:** stack  
**Route:** `/guides/:slug` (e.g. `/guides/introduce-new-cat`)  
**AC stories:** Publish Pet Care Guide (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Pet Care Guides · Guide Title (current) | Guides links back to `/guides` |
| pet care guide content | body | article | title · author · date · pet type/species tag (badge) · body content | Tag badge uses species from publish metadata |

---

### admin — content editor

**Layout:** form  
**Route:** `/staff/content`  
**AC stories:** Publish Blog Post · Publish Pet Care Guide

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns · Content (active) | Content tab active |
| content type selector | body | nav-tabs | Blog Posts (active) · Pet Care Guides | Toggle editor mode |
| content list | body | list | title · status (draft/published) · date · author · Edit · Publish · New Post (primary) | Staff sees drafts; customers never do |
| blog post editor | body | form | title (text) · summary (textarea) · body content (textarea) · author (text) · Save as Draft · Publish (primary) | Draft → published lifecycle |
| pet care guide editor | body | form | title · summary · body content · pet type/species tag (dropdown) · Save as Draft · Publish (primary) | Shown on Pet Care Guides tab |
| tag required validation | body | alert | At least one pet type or species tag is required before publishing | Conditional: publish blocked; draft preserved |
| publish date note | body | form | Publish date will not change unless you update it explicitly · update publish date (checkbox) | Conditional: editing published post |

**Conditional states:**

- Pet Care Guides tab: guide editor with tag dropdown
- Tag missing on publish: validation `role="alert"`, draft not discarded
- Editing published post: publish date preservation unless explicit checkbox checked

---

### unsubscribe confirmation

**Layout:** stack  
**Route:** `/marketing/unsubscribe/:token`  
**AC stories:** Unsubscribe from Marketing Emails (email link path — AC 1, AC 4)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · account | Minimal nav |
| unsubscribe confirmation | body | form | You've been unsubscribed · category name · re-subscribe note · Manage Communication Preferences · Continue Shopping (primary) | Token processed server-side on GET; immediate category opt-out |
| already unsubscribed state | body | form | You've been unsubscribed · already unsubscribed note | Conditional: idempotent repeat click — same message, no error |

**Note:** Preferences-page unsubscribe (AC 2, AC 3) is implemented on Sprint 2 *Communication Preferences* screen — not duplicated here. Transactional *Notification Preferences* unaffected (AC 3 server invariant).

---

## Cross-link touchpoints (Publish Pet Care Guide — AC 2)

| Touchpoint | Behaviour | Component area |
| --- | --- | --- |
| Pet Browsing Area filtered by species | When species filter matches guide tag, show linked guide title | `packages/pet-gallery/client/` — species browse view |
| Product Browsing Area for species-matched products | Cat products surface cat-tagged guides (and vice versa) | `packages/product-catalog/client/` — category/species listing |

Links use guide title verbatim; route to `/guides/:slug`.

---

## AC → behaviour → test mapping

### Story: Publish Blog Post

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — published post on index with metadata + URL | Publish creates published Blog Post; index lists title, summary, date, author; detail at `/blog/:slug` | `StaffContentEditorPage`, `BlogIndexPage`, `BlogPostPage`, `content.service` | Publish Blog Post — AC 1 | passing |
| AC 2 — draft hidden from customers | Draft excluded from public API and index | `content.service`, `BlogIndexPage` | Publish Blog Post — AC 2 | passing |
| AC 3 — edit reflects live; publish date preserved | PATCH body updates live page; publish date unchanged unless explicit flag | `StaffContentEditorPage`, `content.service` | Publish Blog Post — AC 3 | passing |
| AC 4 — direct URL shows full article | GET `/blog/:slug` renders title, author, date, body | `BlogPostPage` | Publish Blog Post — AC 4 | passing |

### Story: Publish Pet Care Guide

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — published guide on index with tag + URL | Guide index shows title, summary, tag, date; detail at `/guides/:slug` | `GuideIndexPage`, `GuideDetailPage`, `StaffContentEditorPage` | Publish Pet Care Guide — AC 1 | passing |
| AC 2 — species tag cross-links from pet/product browsing | Matching species surfaces guide link | pet gallery + product catalog client | Publish Pet Care Guide — AC 2 | passing |
| AC 3 — draft hidden from customers | Draft excluded from public guide API | `content.service`, `GuideIndexPage` | Publish Pet Care Guide — AC 3 | passing |
| AC 4 — publish blocked without tag; draft preserved | Validation error; remains draft in admin | `StaffContentEditorPage`, `content.service` | Publish Pet Care Guide — AC 4 | passing |

### Story: Unsubscribe from Marketing Emails

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — email link opts out + confirmation | GET token → opt-out category → confirmation page with *you've been unsubscribed* | `UnsubscribeConfirmationPage`, `unsubscribe.service` | Unsubscribe from Marketing Emails — AC 1 | passing |
| AC 2 — preferences page unsubscribe | Toggle on Communication Preferences (Sprint 2) | `CommunicationPreferencesPage` | Unsubscribe from Marketing Emails — AC 2 | passing (Sprint 2) |
| AC 3 — transactional notifications unaffected | Server: marketing unsubscribe does not alter Notification Preferences | `unsubscribe.service`, notification dispatch | Unsubscribe from Marketing Emails — AC 3 | passing |
| AC 4 — repeat link idempotent | Same confirmation message; no error | `UnsubscribeConfirmationPage`, `unsubscribe.service` | Unsubscribe from Marketing Emails — AC 4 | passing |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | done | Staff editor fields use `<label>`; filter tabs use `aria-selected` |
| Focus order matches reading order | done | Editor: title → summary → body → actions |
| Focus is visible | done | Match existing staff/account focus ring |
| Errors programmatically associated | done | Tag validation uses `role="alert"` + `data-testid` |
| State cues not colour-only | done | Draft/published status includes text label |
| Keyboard reachable | done | Tab through content list, editor, confirmation CTAs |
| Axe passes | done | Engineering pass via RTL tests |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Content index pages | Lightweight list render | pending | Paginate if >20 items |
| Staff editor | No heavy WYSIWYG in MVP | pending | Plain textarea per lo-fi |
| Unsubscribe page | Minimal static confirmation | pending | Token verify server-side |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Routes, customer pages, staff editor, unsubscribe confirmation, nav extensions, guide cross-links, client tests (`tests/marketing-engine/content/content_client.test.tsx`). |

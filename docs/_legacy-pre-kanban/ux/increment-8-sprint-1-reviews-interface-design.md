# Interface design — Increment 8 Sprint 1 (Customer reviews)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-8-marketing-engine.md` / `.drawio` (screen: *product detail page — reviews and ratings*). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 1 product detail page under `packages/product-catalog/` — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 1 — Customer reviews (1 screen, 3 stories) |
| Ticket | `inc-8-sprint-1-reviews` |
| Lo-fi reference | `docs/ux/lo-fi/increment-8-marketing-engine.md` (§ product detail page — reviews and ratings) |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Sprint 1 review stories only) |
| Specification by example | `docs/story/specification-by-example/increment-8-sprint-1-reviews-specification-by-example.md` |
| Domain / CRC | `docs/domain/marketing-engine-reviews-crc.md`, `docs/domain/marketing-engine-ubiquitous-language.md` |
| Architecture reference | `docs/architecture/increment-8-marketing-engine-reference.md` (Mechanism: Customer Review) |
| Prior interface specs | `docs/ux/increment-7-interface-design.md`; Increment 1 product detail (`ProductDetailView`) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/product-catalog/client/` — extend `ProductDetailContent.tsx`, new `ReviewForm.tsx`, `ReviewList.tsx`, `ReviewPhotoLightbox.tsx`, `AggregateStarRating.tsx`; `packages/product-catalog/server/` — review API per architecture reference |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-30 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 1 extends the Increment 1 *Product Details Page* with a *Customer Reviews* section below product description. Verified purchasers submit *Customer Reviews* with mandatory *Star Rating* (1–5) and optional written text and *Review Photos*; non-purchasers see a purchase prompt; guests see a login/register prompt without leaving the page. All visitors read *Product Reviews* with *Aggregate Star Rating* (hidden when zero reviews), sort controls (newest, oldest, highest rating, lowest rating), pagination/lazy-load, inline photo thumbnails, and a lightbox for full-size images. Labels use ubiquitous-language terms verbatim. Buy flow and existing product detail regions (breadcrumb, image gallery, description) are preserved unchanged.

---

## Host project conventions

Same baseline as Increments 1–7; review UI lives in the product-catalog client package.

- **Folder layout:** extend `packages/product-catalog/client/` with review components; server review module under `packages/product-catalog/server/` per architecture reference (`review.service.ts`, `review.controller.ts`, etc.)
- **State management:** React component state for form draft (star rating, written text, photo upload errors); server state for review list, aggregate, pagination, sort; `CustomerSessionContext` for auth and purchase-eligibility gate
- **Styling:** component-scoped inline styles matching `productCatalogUiStyles.ts`; star rating uses accessible radio group; sort controls as tablist pattern consistent with Increment 4–7 nav-tabs
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists; accent for primary *Submit Review* button matches existing primary action colour
- **Test framework:** Vitest + React Testing Library (unit/component) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass on review form and lightbox
- **Performance budget:** no explicit bundle cap — do not regress Increment 7 baseline; lazy-load review list page 2+; lightbox dynamically imported

---

## Product detail extension

Increment 1 `ProductDetailView` / `ProductDetailContent` remain the host. Reviews section mounts below `ProductDescription`.

| Actor | Entry | Review form | Read path |
| --- | --- | --- | --- |
| **Guest** | `/product-catalog/:sku` | Login/register prompt; form hidden | Full read access to existing reviews |
| **Logged in — non-purchaser** | same | "Purchase this product to leave a review" | Full read access |
| **Logged in — verified purchaser** | same | Full review form (star rating, text, photos) | Full read access |

**API routes (from architecture reference):**

- `GET /api/products/:sku/reviews` — list with sort, pagination, aggregate
- `POST /api/products/:sku/reviews` — submit review (verified purchaser only)
- `POST /api/products/:sku/reviews/:reviewId/photos` — attach review photo

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| product detail page — reviews and ratings | stack | `/product-catalog/:sku` (existing) | Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews | **Updated** — reviews section added below description |

---

## Screen spec (from lo-fi — regions verbatim)

### product detail page — reviews and ratings

**Layout:** stack  
**Route:** `/product-catalog/:sku` (extends existing `ProductDetailView`)  
**AC stories:** Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged Increment 4 chrome |
| breadcrumb | header | toolbar | Product Catalog · Category · Product Name (current) | Unchanged Increment 1 pattern |
| product header with aggregate star rating | body | form | product name · aggregate star rating (e.g. ★★★★☆ 4.2 · 47 reviews) | *Aggregate Star Rating* in `ProductDetailHeader` when review count > 0; `aria-label="Aggregate star rating 4.2 out of 5, 47 reviews"` |
| product image gallery | body | list | (unchanged Increment 1) | Preserved above description |
| product description | body | form | (unchanged Increment 1) | Preserved |
| no reviews state | body | form | aggregate star rating not shown · "Be the first to review this product!" | When `reviewCount === 0`; no zero-star display |
| review sort controls | body | nav-tabs | Newest (active) · Oldest · Highest Rating · Lowest Rating | `role="tablist"`; default newest; changing sort refetches/reorders list; keyboard arrow navigation between tabs |
| customer reviews list | body | list | star rating · review text · review photo thumbnail · author · date · Load More Reviews | Each review `role="listitem"`; photos as `<button>` thumbnails opening lightbox; pagination via Load More or infinite scroll |
| review photo lightbox | body | dialog | full-size review photo · close lightbox | `role="dialog"` `aria-modal="true"`; Escape closes; focus trap; returns focus to thumbnail |
| review submission form — verified purchaser | body | form | star rating (1–5, radio group) · written review (optional, textarea) · upload review photos (optional, file input) · Submit Review (primary) | Star rating required (`aria-required="true"`); text optional; accept JPEG/PNG/WebP; max 5 MB per SBE |
| photo upload validation error | body | form | validation error (format or size) · star rating and written review preserved | `role="alert"` `aria-live="assertive"`; form draft not cleared on upload failure |
| non-purchaser state | body | form | "Purchase this product to leave a review" | Replaces form when logged in but not verified purchaser; reviews list still visible |
| guest prompt state | body | form | "Log in or register to leave a review" · Log In · Register | Replaces form for guest; page does not navigate away; Log In/Register link with `returnTo` current SKU |

**Conditional states:**

- `reviewCount === 0`: hide aggregate; show "Be the first to review this product!"
- Guest: guest prompt instead of form
- Non-purchaser: purchase prompt instead of form
- Verified purchaser: full form
- Photo upload error: alert region; draft preserved
- Lightbox open: overlay; body scroll locked; focus trapped

---

## AC → behaviour → test mapping

### Story: Submit Written Review with Star Rating

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — verified purchaser sees form | Form shows star rating radio group (1–5) and optional written review textarea; only when customer verified as purchaser | `ReviewForm` | Submit Written Review with Star Rating — AC 1 | pending |
| AC 2 — submit publishes review and recomputes aggregate | Submit Review POST succeeds; new review appears newest-first; aggregate updates in header | `ReviewForm`, `ReviewList`, `AggregateStarRating` | Submit Written Review with Star Rating — AC 2 | pending |
| AC 3 — non-purchaser sees purchase prompt | Form hidden; "Purchase this product to leave a review" shown; existing reviews visible | `ReviewForm` (purchase gate) | Submit Written Review with Star Rating — AC 3 | pending |
| AC 4 — guest login prompt without navigation | Guest sees "Log in or register to leave a review" with Log In and Register links; URL unchanged | `ReviewForm` (guest gate) | Submit Written Review with Star Rating — AC 4 | pending |
| AC 5 — star-rating-only accepted | Submit with star rating only (no text) succeeds; list shows stars without text body | `ReviewForm` | Submit Written Review with Star Rating — AC 5 | pending |

### Story: Submit Photo Review

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — optional photo upload on form | File input labelled "upload review photos"; optional; accepts image files | `ReviewForm` | Submit Photo Review — AC 1 | pending |
| AC 2 — photos displayed inline with lightbox | Thumbnails inline in review list; click opens full-size lightbox | `ReviewList`, `ReviewPhotoLightbox` | Submit Photo Review — AC 2 | pending |
| AC 3 — invalid format/size error preserves draft | Validation error "Supported formats: JPEG, PNG, WebP" or "Image must be under 5 MB"; star rating and text remain | `ReviewForm` | Submit Photo Review — AC 3 | pending |
| AC 4 — review accepted without photos | Submit without photos succeeds as standard written review | `ReviewForm` | Submit Photo Review — AC 4 | pending |

### Story: Read Customer Reviews

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — aggregate and listing | Aggregate near product name; individual reviews below product details | `AggregateStarRating`, `ReviewList` | Read Customer Reviews — AC 1 | pending |
| AC 2 — zero reviews suppresses aggregate | No aggregate display; "Be the first to review this product!" prompt | `AggregateStarRating`, `ReviewList` | Read Customer Reviews — AC 2 | pending |
| AC 3 — pagination and sort controls | Load More or lazy-load; sort tabs newest/oldest/highest/lowest | `ReviewList`, sort tablist | Read Customer Reviews — AC 3 | pending |
| AC 4 — photo thumbnails inline on read path | Thumbnails in list; select opens lightbox at full size | `ReviewList`, `ReviewPhotoLightbox` | Read Customer Reviews — AC 4 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | Star rating: `fieldset` + `legend="Star rating"` + labelled radios; textarea: `<label htmlFor>`; file input: visible label |
| Focus order matches reading order | planned | Header → gallery → description → aggregate → sort tabs → review list → form/gate → Load More |
| Focus is visible | planned | Browser default focus ring preserved; lightbox close button focusable |
| Errors programmatically associated | planned | Upload errors: `aria-describedby` on file input + `role="alert"` |
| State cues not colour-only | planned | Star rating: numeric label + filled/empty star icons; validation uses text message |
| Keyboard reachable | planned | Sort tabs: arrow keys; lightbox: Escape to close; form fully tabbable |
| Axe passes | pending | Run in Engineering implementation pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Bundle size regression | No increase over Increment 7 baseline | pending | Measure in Engineering pass |
| Review list initial load | First page only (e.g. 10 reviews) | pending | Lazy-load / Load More for remainder |
| Lightbox | Dynamic import on first open | pending | Avoid blocking product detail first paint |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | code → md | Engineering pass: ProductReviewsSection wired; eligibility API; aggregate in ProductDetailHeader. Tests pending vitest install. |

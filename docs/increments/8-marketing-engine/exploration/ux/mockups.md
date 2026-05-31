# Mockups

# Lo-fi — Increment 8: Marketing engine — reviews, alerts, and content

> **Companion to** `docs/increments/8-marketing-engine/exploration/ux/mockups.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 — Marketing engine (11 screens, 16 stories) |
| Initial IA | `docs/end-to-end/discovery/ux/information-architecture.md` (Increment 1 base; extends Increment 4 account patterns, Increment 6 staff dashboard) |
| AC source | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| State file | `docs/increments/8-marketing-engine/exploration/ux/mockups-state.json` |
| Wireframe | `docs/increments/8-marketing-engine/exploration/ux/mockups.drawio` |
| Last updated | 2026-05-30 |

## Description

Lo-fi wireframes for the Marketing Engine increment — customer reviews with star ratings and photo uploads on the product detail page, communication preferences for marketing opt-in/opt-out per category, notification preferences for transactional settings, blog and pet care guide browsing with content publishing from the admin area, email unsubscribe confirmation, and notification previews for all marketing and transactional email types. The product detail page extends from Increment 1 with a reviews section; account navigation extends from Increment 4 with Communication and Notifications tabs; the staff dashboard extends from Increments 6–7 with a Content tab. New screens include blog index, blog post detail, pet care guide index, pet care guide detail, and unsubscribe confirmation. **Consent-gated marketing** — all marketing communication types enforce opt-in at delivery time, not batch time; unsubscribe takes effect immediately.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 1–7 lo-fi patterns and standard e-commerce/marketing UX conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 1 | product detail page | stack | Product header, image gallery, description — extended with reviews |
| Inc 4 | account nav tabs | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments — add Communication · Notifications |
| Inc 6–7 | staff nav tabs | nav-tabs | Stock Levels · Appointments · Pet Profiles · Returns — add Content |
| AC | review submission form | form | Star rating (radio 1–5), optional text, optional photo upload |
| AC | review sort controls | nav-tabs | Newest (default), Oldest, Highest Rating, Lowest Rating |
| AC | customer reviews list | list | Star rating, review text, review photos (thumbnails), author, date |
| AC | communication preferences | form (checkbox) | Per-category toggles, immediate persist, default opt-out |
| AC | notification preferences | form (checkbox) | Per-category toggles, critical notifications non-optional |
| AC | blog post listing | list | Title, summary, date, author — with Read Post action |
| AC | pet care guide listing | list | Title, summary, pet type/species tag, date — with pet type filter tabs |
| AC | content editor | form | Title, summary, body, author/tags; Save as Draft / Publish actions |
| AC | notification previews (marketing) | nav-tabs + form | 4 tabs: Promotional, Personalized Recommendation, Restock Alert, In-Store Event |
| AC | notification previews (transactional) | nav-tabs + form | 3 tabs: Order Confirmation, Shipping Update, Click-and-Collect Ready |

**Design principles applied:** Product detail page extends with reviews below product info; account nav gains two preference tabs; communication preferences use immediate-toggle checkboxes (no save button); blog/guide browsing follows standard content index patterns; staff content editor mirrors draft/publish lifecycle; notification previews use tabbed email mockup pattern from Increment 7.

---

## Screens

### product detail page — reviews and ratings

**Layout:** stack
**AC stories:** Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Logged-in chrome from Increment 4 |
| breadcrumb | header | toolbar | Product Catalog · Category · Product Name (current) | Back navigation to catalog |
| product header with aggregate star rating | body | form | product name · aggregate star rating (★★★★☆ 4.2 · 47 reviews) | Aggregate displayed prominently near product name |
| no reviews state | body | form | aggregate star rating not shown — not displayed as zero · "Be the first to review this product!" | Conditional: product has no customer reviews |
| review sort controls | body | nav-tabs | Newest (active) · Oldest · Highest Rating · Lowest Rating | Default sort: newest first |
| customer reviews list | body | list | star rating · review text · review photo · author · date · Load More Reviews | Paginated/lazy-loaded reviews; photo thumbnails inline |
| review photo lightbox | body | form | [full-size review photo — lightbox overlay] · close lightbox | Conditional: selecting thumbnail opens full-size |
| review submission form — verified purchaser | body | form | star rating (1–5, radio) · written review (optional, textarea) · upload review photos (optional) · Submit Review (primary) | Star rating mandatory, text and photos optional |
| photo upload validation error | body | form | validation error: file format not supported or exceeds size limit · review text and star rating preserved | Conditional: unsupported format or size exceeded |
| non-purchaser state | body | form | "Purchase this product to leave a review" | Conditional: customer has not purchased product; form hidden |
| guest prompt state | body | form | "Log in or register to leave a review" · Log In · Register | Conditional: guest with no customer account; page not navigated away from |

**Conditional states:**
- No reviews: aggregate star rating hidden, "be the first to review" prompt shown
- Non-purchaser: review form hidden, purchase prompt shown instead
- Guest: review form replaced by login/register prompt
- Photo upload error: validation message shown, review text and star rating preserved
- Lightbox: full-size image overlay on thumbnail click

---

### blog index

**Layout:** stack
**AC stories:** Publish Blog Post (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | Content navigation added to primary nav |
| blog index header | body | form | PawPlace Blog | Page heading |
| blog post listing | body | list | title · summary · date · author · Read Post | Published posts only — drafts not visible to customers |

---

### blog post detail

**Layout:** stack
**AC stories:** Publish Blog Post (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Blog · Post Title (current) | Back to blog index |
| blog post content | body | form | title · author · date · body content (textarea) | Full article accessible via its own URL |

---

### pet care guide index

**Layout:** stack
**AC stories:** Publish Pet Care Guide (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| guide index header | body | form | Pet Care Guides | Page heading |
| pet type filter | body | nav-tabs | All (active) · Dogs · Cats · Senior Pets · Small Animals | Filter by pet type/species tag |
| pet care guide listing | body | list | title · summary · pet type/species tag · date · Read Guide | Cross-linked with pet browsing areas based on tags |

---

### pet care guide detail

**Layout:** stack
**AC stories:** Publish Pet Care Guide (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Pet Care Guides · Guide Title (current) | Back to guide index |
| pet care guide content | body | form | title · author · date · pet type/species tag (badge) · body content (textarea) | Full guide accessible via its own URL; tagged by pet type or species per UL definition |

---

### customer account — communication preferences

**Layout:** stack
**AC stories:** Set Communication Preferences · Opt In to Marketing Email List · Unsubscribe from Marketing Emails

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| account nav | header | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments · Communication (active) · Notifications | Communication tab active |
| communication preferences header | body | form | Marketing Communication Preferences · "Changes take effect immediately" | No save button — immediate persist on toggle |
| marketing category toggles | body | list | marketing category · description · opt-in status | Overview of all 4 categories |
| promotions toggle | body | form | Promotions — sales, new products, seasonal offers (checkbox) | Unchecked by default for new opt-in |
| recommendations toggle | body | form | Recommendations — personalized product suggestions (checkbox) | |
| restock alerts toggle | body | form | Restock Alerts — wishlisted products back in stock (checkbox) | |
| events toggle | body | form | Events — in-store event notifications at preferred store (checkbox) | |
| transactional note | body | form | Transactional notifications not affected by these settings | Clear separation from notification preferences |
| guest access state | body | form | "Log in or register to manage communication preferences" · Log In · Register | Conditional: guest; page not navigated away from |

**Conditional states:**
- Guest: login/register prompt replaces toggle interface
- New marketing category: defaults to opt-out (unchecked)
- All categories opted out: transactional note still visible, confirming those are unaffected

---

### customer account — notification preferences

**Layout:** stack
**AC stories:** Set Notification Preferences

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| account nav | header | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments · Communication · Notifications (active) | Notifications tab active |
| notification preferences header | body | form | Notification Preferences · "Changes take effect immediately" | Same immediate-toggle pattern as communication preferences |
| order updates toggle | body | form | Order Updates (checkbox) | |
| shipping notifications toggle | body | form | Shipping Notifications (checkbox) | |
| appointment reminders toggle | body | form | Appointment Reminders (checkbox) | |
| return updates toggle | body | form | Return Updates (checkbox) | |
| critical notifications note | body | form | "Some notifications cannot be disabled (e.g. order confirmation, refund completion)" | Non-suppressible transactional notifications called out |
| guest access state | body | form | "Log in or create an account" · guest order notifications continue via checkout email · Log In · Create Account | Conditional: guest |

**Conditional states:**
- Guest: login prompt with note about guest order notifications
- All disabled: critical notifications note remains; order confirmation and refund completion still sent

---

### unsubscribe confirmation

**Layout:** stack
**AC stories:** Unsubscribe from Marketing Emails

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · account | Minimal nav on confirmation page |
| unsubscribe confirmation | body | form | "You've been unsubscribed" · category name · re-subscribe note · Manage Communication Preferences · Continue Shopping (primary) | Confirmation page after email unsubscribe link click |
| already unsubscribed state | body | form | "You've been unsubscribed" · already unsubscribed note | Conditional: idempotent — no error on repeat click |

**Conditional states:**
- Already unsubscribed: same confirmation message, no error — idempotent

---

### admin — content editor

**Layout:** form
**AC stories:** Publish Blog Post · Publish Pet Care Guide

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns · Content (active) | Content tab extends staff dashboard |
| content type selector | body | nav-tabs | Blog Posts (active) · Pet Care Guides | Toggle between content types |
| content list | body | list | title · status (draft/published) · date · author · Edit · Publish · New Post (primary) | Draft entries visible to staff only |
| blog post editor | body | form | title (text) · summary (textarea) · body content (textarea) · author (text) · Save as Draft · Publish (primary) | Draft → published lifecycle |
| pet care guide editor | body | form | title (text) · summary (textarea) · body content (textarea) · pet type/species tag (dropdown) · Save as Draft · Publish (primary) | Conditional: Pet Care Guides tab; requires at least one tag |
| tag required validation | body | form | "At least one pet type or species tag is required before publishing" | Conditional: attempt to publish guide without tag; draft not lost |
| publish date note | body | form | "Publish date will not change unless you update it explicitly" · update publish date (checkbox) | Conditional: editing a published post |

**Conditional states:**
- Pet Care Guides tab: guide editor shown with tag dropdown instead of blog editor
- Tag missing: validation error, draft preserved
- Editing published post: publish date preservation note with explicit checkbox

---

### notification preview — marketing communications

**Layout:** stack
**AC stories:** Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Promotional Email (active) · Personalized Recommendation · Restock Alert · In-Store Event | 4 marketing email types tabbed |
| promotional email preview | body | form | Subject line · promotional content · unsubscribe link | Unsubscribe immediately opts out of promotions category |
| real-time opt-out note | body | form | "communication preferences checked at delivery time, not batch creation time" | Key invariant surfaced |
| personalized recommendation preview | body | form | Subject line · recommendation basis · in-stock only · not sent without data · unsubscribe | Conditional: Personalized Recommendation tab |
| restock alert preview | body | form | Subject line · wishlist match · best-effort signal · opt-in + wishlist required · unsubscribe | Conditional: Restock Alert tab |
| in-store event preview | body | form | Subject line · event details · store match · preferred store required · walk-in discoverable · unsubscribe | Conditional: In-Store Event tab |
| delivery resilience note | body | form | "Email queued for retry — not silently discarded" | Same resilience pattern as prior increments |

---

### notification preview — transactional updates

**Layout:** stack
**AC stories:** Send Order Confirmation · Send Shipping Update with Tracking · Send Click-and-Collect Ready Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Order Confirmation (active) · Shipping Update · Click-and-Collect Ready | 3 transactional notification types |
| order confirmation preview | body | form | Subject line · order details · mandatory notification · guest routing | Cannot be suppressed; guest email from checkout |
| shipping update preview | body | form | Subject line · tracking details · initial mandatory, follow-ups respect preferences | Conditional: Shipping Update tab |
| click-and-collect ready preview | body | form | Subject line · pickup details · collection window reminder · guest routing | Conditional: Click-and-Collect Ready tab |
| resilience note | body | form | "Email queued for retry — order/shipping status still updated" | Notification failure does not block processing |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| aggregate star rating display near product name | Read Customer Reviews | AC 1 — aggregate star rating displayed prominently, individual reviews listed below |
| aggregate star rating hidden, "be the first to review" prompt | Read Customer Reviews | AC 2 — not displayed as zero when no reviews; prompt appears |
| review sort controls (newest, oldest, highest, lowest) | Read Customer Reviews | AC 3 — paginated/lazy-loaded with sort controls |
| review photo thumbnails inline, lightbox on select | Read Customer Reviews | AC 4 — thumbnails inline, full size on select |
| review form with star rating (1–5) and optional text | Submit Written Review with Star Rating | AC 1 — form collects star rating and optional written review; purchasers only |
| Submit Review → review appears, aggregate recomputed | Submit Written Review with Star Rating | AC 2 — review associated, appears newest first, aggregate recomputed |
| review form hidden, "purchase this product to leave a review" | Submit Written Review with Star Rating | AC 3 — non-purchaser cannot submit; existing reviews viewable |
| guest prompt: log in or register | Submit Written Review with Star Rating | AC 4 — guest prompted to log in; page not navigated away from |
| star-rating-only review accepted (no text) | Submit Written Review with Star Rating | AC 5 — star rating mandatory, text optional |
| photo upload field on review form | Submit Photo Review | AC 1 — optional photo upload field on review submission |
| review photos displayed alongside review, lightbox at full size | Submit Photo Review | AC 2 — images displayed alongside review, lightbox |
| photo upload validation error, review text and star rating preserved | Submit Photo Review | AC 3 — validation error; text and star rating not lost |
| review accepted without photos | Submit Photo Review | AC 4 — photos optional |
| communication preferences: 4 marketing category toggles | Set Communication Preferences | AC 1 — all marketing categories listed with current status |
| immediate toggle persist, no save action | Set Communication Preferences | AC 2 — persists immediately on toggle |
| new marketing category defaults to opt-out | Set Communication Preferences | AC 3 — new categories default opt-out |
| transactional notifications unaffected by marketing opt-out | Set Communication Preferences | AC 4 — transactional notifications unaffected |
| guest communication preferences prompt | Set Communication Preferences | AC 5 — guest prompted to log in or register |
| opt-in to promotions via communication preferences | Opt In to Marketing Email List | AC 1 — opt-in adds to marketing email list with timestamp |
| opt-in checkbox unchecked by default | Opt In to Marketing Email List | AC 2 — opt-in must be affirmative; unchecked by default |
| no marketing communications without opt-in | Opt In to Marketing Email List | AC 3 — zero exceptions |
| opted-in customer sees promotions as active | Opt In to Marketing Email List | AC 4 — shows as opted-in; toggle off to unsubscribe |
| email unsubscribe link → immediate opt-out, confirmation page | Unsubscribe from Marketing Emails | AC 1 — immediately opted out; confirmation page shown |
| communication preferences page unsubscribe → immediate effect | Unsubscribe from Marketing Emails | AC 2 — change takes effect immediately |
| unsubscribe all → transactional notifications unaffected | Unsubscribe from Marketing Emails | AC 3 — transactional unaffected |
| repeat unsubscribe → same confirmation, no error (idempotent) | Unsubscribe from Marketing Emails | AC 4 — idempotent; no confusing message |
| notification preference categories with toggles | Set Notification Preferences | AC 1 — categories listed with current setting |
| notification toggle immediate persist | Set Notification Preferences | AC 2 — preference saved immediately |
| critical notifications non-suppressible with note | Set Notification Preferences | AC 3 — critical notifications still sent; note explains |
| guest notification preferences prompt | Set Notification Preferences | AC 4 — guest prompted; guest order notifications continue |
| promotional email to opted-in customers only | Send Promotional Email | AC 1 — delivered only to opted-in promotions category |
| real-time opt-out respected (delivery-time check) | Send Promotional Email | AC 2 — opt-out between batch and delivery respected |
| unsubscribe link in email → immediate opt-out + confirmation | Send Promotional Email | AC 3 — unsubscribe link; confirmation page |
| promotional email queued for retry if unavailable | Send Promotional Email | AC 4 — queued, not discarded |
| personalized recommendation based on history/profile, opted-in only | Send Personalized Recommendation | AC 1 — based on purchase, browsing, pet profile; opt-in required |
| no recommendation without personalization data | Send Personalized Recommendation | AC 2 — not sent without data |
| out-of-stock products excluded from recommendations | Send Personalized Recommendation | AC 3 — excluded |
| no recommendation without opt-in | Send Personalized Recommendation | AC 4 — not sent regardless of data |
| restock alert to wishlisted + opted-in customers | Send Restock Alert | AC 1 — wishlist + opt-in required |
| no alert without restock alerts opt-in | Send Restock Alert | AC 2 — not sent even if on wishlist |
| best-effort signal, product may go back out of stock | Send Restock Alert | AC 3 — best effort |
| no alert if product not on any wishlist | Send Restock Alert | AC 4 — not sent |
| in-store event to preferred-store + events opt-in customers | Send In-Store Event Notification | AC 1 — preferred store match + opt-in |
| no event notification without preferred store | Send In-Store Event Notification | AC 2 — not sent; event discoverable on store page |
| no event notification without events opt-in | Send In-Store Event Notification | AC 3 — not sent |
| no event notification for non-matching store | Send In-Store Event Notification | AC 4 — not sent |
| blog post listing: title, summary, date, author | Publish Blog Post | AC 1 — appears on blog index with required fields; accessible via URL |
| draft blog post not visible to customers | Publish Blog Post | AC 2 — draft not visible; editable from admin |
| published post edit preserves publish date unless explicit update | Publish Blog Post | AC 3 — publish date unchanged unless author updates |
| direct URL access to published blog post | Publish Blog Post | AC 4 — full article at own URL |
| pet care guide listing: title, summary, pet type tag, date | Publish Pet Care Guide | AC 1 — appears on guide index; accessible via URL |
| pet care guide detail: pet type/species tag displayed | Publish Pet Care Guide | AC 1 — published article tagged by pet type or species; accessible via own URL |
| guide appears in pet browsing areas matching tags | Publish Pet Care Guide | AC 2 — cross-linked with pet/product browsing areas |
| draft guide not visible to customers | Publish Pet Care Guide | AC 3 — draft not visible; editable from admin |
| tag required before publishing (validation) | Publish Pet Care Guide | AC 4 — at least one tag required; draft not lost |
| order confirmation: order number, items, total, delivery option, estimated delivery/pickup | Send Order Confirmation | AC 1 — sends notification with order details on payment success |
| order confirmation mandatory — cannot be suppressed by notification preferences | Send Order Confirmation | AC 2 — mandatory transactional notification |
| order confirmation queued for retry if delivery unavailable | Send Order Confirmation | AC 3 — email failure does not block order processing |
| order confirmation sent to guest email provided at checkout | Send Order Confirmation | AC 4 — guest order routing |
| shipping update: order number, tracking number, carrier link, estimated delivery | Send Shipping Update with Tracking | AC 1 — notification sent when order status changes to shipped |
| follow-up shipping notifications if carrier data available | Send Shipping Update with Tracking | AC 2 — additional status changes (out for delivery, delivered) |
| initial shipping notification mandatory, follow-ups respect preferences | Send Shipping Update with Tracking | AC 3 — initial non-suppressible, follow-ups optional |
| shipping notification queued for retry if delivery unavailable | Send Shipping Update with Tracking | AC 4 — email failure does not block fulfilment |
| click-and-collect ready: order number, pickup store address, hours, collection window | Send Click-and-Collect Ready Notification | AC 1 — notification sent when order marked ready for pickup |
| click-and-collect ready sent to guest email provided at checkout | Send Click-and-Collect Ready Notification | AC 2 — guest order routing |
| collection window reminder when deadline approaching and order not collected | Send Click-and-Collect Ready Notification | AC 3 — reminder notification for uncollected orders |
| click-and-collect notification queued for retry if delivery unavailable | Send Click-and-Collect Ready Notification | AC 4 — email failure does not block fulfilment |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| product detail page — reviews and ratings | Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews | customer review · star rating · review photo · aggregate star rating · product · customer account · product details page |
| blog index | Publish Blog Post | blog post · blog index · content |
| blog post detail | Publish Blog Post | blog post · content · content author |
| pet care guide index | Publish Pet Care Guide | pet care guide · guide index · content |
| pet care guide detail | Publish Pet Care Guide | pet care guide · pet type/species tag · content · content author |
| customer account — communication preferences | Set Communication Preferences · Opt In to Marketing Email List · Unsubscribe from Marketing Emails | communication preferences · marketing category · marketing email list · marketing communication · unsubscribe · promotional email · personalized recommendation · restock alert · in-store event notification |
| customer account — notification preferences | Set Notification Preferences | notification preferences · customer account |
| unsubscribe confirmation | Unsubscribe from Marketing Emails | unsubscribe · marketing category · communication preferences |
| admin — content editor | Publish Blog Post · Publish Pet Care Guide | content · blog post · pet care guide · content author · blog index · guide index |
| notification preview — marketing communications | Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification | promotional email · personalized recommendation · restock alert · in-store event notification · marketing communication · communication preferences · marketing category · unsubscribe · marketing email list |
| notification preview — transactional updates | Send Order Confirmation · Send Shipping Update with Tracking · Send Click-and-Collect Ready Notification | notification preferences · customer account |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Admin marketing email compose/send UI | System story — batch creation and delivery are back-end operations; notification preview shows email format |
| Review moderation workflow | No AC mention of admin moderation; reviews appear immediately |
| Content scheduling/calendar | Lifecycle is draft → publish; no scheduling AC exist |
| Email template builder | System concern — email format is shown in notification previews |
| Recommendation algorithm configuration | Back-end personalization engine; customer sees result in email |
| Event creation admin UI | In-Store Event Notification is triggered by admin event creation, but no admin event screen AC exist for this increment |

| Preserved from prior increments | Rationale |
| --- | --- |
| Product detail page (Increment 1) | Extended with reviews section below product info |
| Account navigation tabs (Increment 4) | Communication and Notifications tabs added |
| Staff dashboard tabs (Increments 6–7) | Content tab added alongside Stock Levels, Appointments, Pet Profiles, Returns |
| Notification resilience pattern (Increment 6–7) | Same email queue-for-retry applied to marketing and transactional notifications |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/increments/8-marketing-engine/exploration/ux/mockups-state.json" --out "docs/increments/8-marketing-engine/exploration/ux/mockups.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-30 | initial | 10 Increment 8 screens (product reviews, blog index, blog detail, pet care guide index, communication preferences, notification preferences, unsubscribe confirmation, admin content editor, marketing notification previews, transactional notification previews); state JSON + drawio generated. |
| 2026-05-30 | rework | Added pet care guide detail screen (with pet type/species tag) — guide index "Read Guide" now navigates here instead of blog post detail. Added story/domain-term annotation boxes to drawio. Screen count now 11. |

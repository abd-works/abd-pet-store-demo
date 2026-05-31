# Object Model


---

## marketing-engine-content-object-model

<!-- sprint: inc-8-sprint-4-content -->

---
state: domain-model
sprint_scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
---

# Module: [Marketing Engine]

Scope: Sprint 4 — *Content* draft-to-published lifecycle for *Blog Post* and *Pet Care Guide*, public index and detail surfaces, species-tag cross-linking, and full *Unsubscribe* execution via signed email token and preferences toggle with idempotent confirmation.

---

# Core Domain

## **Content**

*Content* is published material for on-site customer education and marketing email fodder. The typed model separates shared lifecycle (*Content*), type-specific entities (*BlogPost*, *PetCareGuide*), and read-side collection behavior (*BlogIndex*, *GuideIndex*).

### **Content** << Entity >>

Initialisation: factory method `Content.createDraft(title, summary, body)` — identity assigned at creation; lifecycle starts in draft.
------
+ contentId: String
	Invariant: must be unique across all content items
+ lifecycleStatus: ContentLifecycleStatus
	Invariant: draft content must never be visible to customers
+ publishedAt: DateTime | null
+ title: String
+ summary: String
+ body: String
+ slug: String
	Invariant: published content must always be accessible via its own URL derived from slug
----
+ transitionDraftToPublished(publishDate: DateTime): Content
	Invariant: published content must always be accessible via its own URL
	Interaction:
		if lifecycleStatus is not draft: reject transition
		return Content with lifecycleStatus = published, publishedAt = publishDate
+ hideDraftFromCustomers(): Boolean
	Invariant: draft content must never be visible to customers
	Interaction:
		return lifecycleStatus is draft
+ exposePublishedViaOwnUrl(): String
	Invariant: published content must always be accessible via its own URL
	Interaction:
		if lifecycleStatus is not published: reject exposure
		return buildPublicUrl(slug: this.slug)

### **BlogPost** << Entity >>

Initialisation: factory method `BlogPost.createDraft(author, title, summary, body)` — composes *Content* lifecycle with author attribution.
------
+ content: Content
+ << composition >> authorAttribution: ContentAuthorRef
	Invariant: must display title, summary, date, and author on the blog index when published
----
+ saveAsDraft(title: String, summary: String, body: String): BlogPost
	Interaction:
		draftContent: Content = Content.createDraft(title: title, summary: summary, body: body)
		return BlogPost with content = draftContent
+ publishToLive(publishDate: DateTime, blogIndex: BlogIndex): BlogPost
	Invariant: edits to a published post must not change the publish date unless explicitly requested
	Interaction:
		publishedContent: Content = this.content.transitionDraftToPublished(publishDate: publishDate)
		blogIndex.addPublishedPost(blogPost: this with content = publishedContent)
		return BlogPost with content = publishedContent
+ reflectEditsOnLivePage(title: String, summary: String, body: String, preservePublishDate: Boolean): BlogPost
	Invariant: edits to a published post must not change the publish date unless explicitly requested
	Interaction:
		updatedContent: Content = this.content with title = title, summary = summary, body = body
		if preservePublishDate: return BlogPost with content = updatedContent
		return BlogPost with content = updatedContent
+ displayOnBlogIndex(blogIndex: BlogIndex): BlogIndexEntry | null
	Interaction:
		if this.content.hideDraftFromCustomers(): return null
		return blogIndex.buildEntry(blogPost: this)

### **PetCareGuide** << Entity >>

Initialisation: factory method `PetCareGuide.createDraft(title, summary, body)` — species tags required before publish.
------
+ content: Content
+ << composition >> speciesTags: List<SpeciesTag>
	Invariant: must carry at least one pet type or species tag before publish
----
+ saveAsDraft(title: String, summary: String, body: String): PetCareGuide
	Interaction:
		draftContent: Content = Content.createDraft(title: title, summary: summary, body: body)
		return PetCareGuide with content = draftContent, speciesTags = empty
+ requireTagBeforePublish(): Boolean
	Invariant: must carry at least one pet type or species tag
	Interaction:
		return speciesTags.isEmpty()
+ publishToLive(publishDate: DateTime, guideIndex: GuideIndex): PetCareGuide
	Invariant: must appear in relevant browsing areas matching its tags when published
	Interaction:
		if requireTagBeforePublish(): reject publish — draft is not lost
		publishedContent: Content = this.content.transitionDraftToPublished(publishDate: publishDate)
		guideIndex.addPublishedGuide(guide: this with content = publishedContent)
		return PetCareGuide with content = publishedContent
+ crossLinkFromTaggedBrowsingAreas(petArea: PetBrowsingArea, productArea: ProductBrowsingArea): void
	Invariant: must appear in relevant browsing areas matching its tags
	Interaction:
		for each tag in speciesTags:
			petArea.surfaceGuidesMatching(tag: tag, guide: this)
			productArea.surfaceGuidesMatching(tag: tag, guide: this)
+ displayOnGuideIndex(guideIndex: GuideIndex): GuideIndexEntry | null
	Interaction:
		if this.content.hideDraftFromCustomers(): return null
		return guideIndex.buildEntry(guide: this)

### **BlogIndex** << Entity >>

Initialisation: constructed per public blog listing surface — scoped to published posts only.
------
+ << aggregation >> publishedPosts: List<BlogPost>
----
+ listWithTitleSummaryDateAuthor(): List<BlogIndexEntry>
	Invariant: only published blog posts appear — drafts are excluded
	Interaction:
		visiblePosts: List<BlogPost> = publishedPosts filter where not content.hideDraftFromCustomers()
		return visiblePosts map to buildEntry(blogPost:)
+ addPublishedPost(blogPost: BlogPost): BlogIndex
	Interaction:
		if blogPost.content.hideDraftFromCustomers(): return this
		return BlogIndex with publishedPosts = publishedPosts + blogPost

### **GuideIndex** << Entity >>

Initialisation: constructed per public guide listing surface — scoped to published guides only.
------
+ << aggregation >> publishedGuides: List<PetCareGuide>
----
+ listWithTitleSummaryTagDate(): List<GuideIndexEntry>
	Invariant: only published pet care guides appear — drafts are excluded
	Interaction:
		visibleGuides: List<PetCareGuide> = publishedGuides filter where not content.hideDraftFromCustomers()
		return visibleGuides map to buildEntry(guide:)
+ addPublishedGuide(guide: PetCareGuide): GuideIndex
	Interaction:
		if guide.requireTagBeforePublish(): reject add
		if guide.content.hideDraftFromCustomers(): return this
		return GuideIndex with publishedGuides = publishedGuides + guide

### **ContentAuthorRef** << ValueObject >>

Initialisation: factory method `ContentAuthorRef.of(authorId, displayName)`.
------
+ authorId: String
+ displayName: String

### **SpeciesTag** << ValueObject >>

Initialisation: factory method `SpeciesTag.of(name)` — validates against allowed tag vocabulary.
------
+ name: String
	Invariant: tag must be a recognized pet type or species label (dogs, cats, senior pets, specific breeds)

### references

**Ref — Content and blog**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 33
Extract: whole

```source
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails.
```

**Ref — Content stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Publish Blog Post, Publish Pet Care Guide
Extract: acceptance criteria

```source
WHEN Content Author creates and publishes a Blog Post
THEN the post appears on the Blog Index with title, summary, date, and author
AND the full post is accessible via its own URL

WHEN Content Author saves a Blog Post as draft
THEN the post is not visible to customers
AND the draft remains editable and publishable from the admin content area

WHEN Content Author creates and publishes a Pet Care Guide
THEN the guide appears on the Guide Index with title, summary, pet type/species tag, and date
AND the full guide is accessible via its own URL

WHEN Content Author attempts to publish a guide without any pet type or species tag
THEN the system requires at least one tag before publishing
BUT the draft is not lost — it can be saved and tagged later
```

### decisions made

- *Content* is the KA class listed first — shared draft/publish lifecycle and content-wide invariants; *BlogPost* and *PetCareGuide* are separate entities, not subtypes (CRC independence test).
- *BlogIndex* and *GuideIndex* modeled as Entities with aggregation — listing published items with draft exclusion is collection-level behavior (collection-class rule).
- *ContentAuthorRef* is a ValueObject — author attribution on blog posts is a snapshot reference, not lifecycle ownership (boundary *Content Author* owns role permissions).
- Publish-date preservation on edit is explicit via `preservePublishDate` parameter on *BlogPost.reflectEditsOnLivePage* — pet care guide AC does not specify date preservation.
- Species-tag cross-linking delegates to boundary browsing areas — guide owns tags; presentation surfaces match (explicit-chain-of-responsibility).

---

## **Marketing Communication**

*Marketing Communication* in this sprint completes the full *Unsubscribe* execution path — signed email-link token verification, immediate category opt-out, idempotent confirmation, and transactional-notification isolation.

### **MarketingCommunication** << Service >>

Initialisation: stateless service — constructed with *UnsubscribeToken* encoder at application bootstrap.
------
+ carryUnsubscribeLinkInMessage(message: MarketingMessage, category: MarketingCategory, account: CustomerAccount): MarketingMessage
	Invariant: every marketing communication must include a category-scoped unsubscribe link
	Invariant: unsubscribe link must target the sending marketing category
	Interaction:
		token: UnsubscribeToken = UnsubscribeToken.encode(accountId: account.accountId, category: category)
		link: String = buildUnsubscribeUrl(token: token)
		return message with unsubscribeLink = link

### **Unsubscribe** << Service >>

Initialisation: stateless service — coordinates *CommunicationPreferences*, *MarketingEmailList*, and *UnsubscribeToken* verification.
------
+ targetMarketingCategory: MarketingCategory
----
+ executeViaEmailLink(token: UnsubscribeToken, timestamp: DateTime): UnsubscribeResult
	Invariant: must take effect immediately — no further marketing communications of that category after execution
	Invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed
	Interaction:
		verifiedPayload: TokenPayload = token.verifyOnEmailLinkRequest()
		preferences: CommunicationPreferences = loadPreferences(accountId: verifiedPayload.accountId)
		updatedPreferences: CommunicationPreferences = preferences.toggleCategoryOptIn(category: verifiedPayload.category, optedIn: false, timestamp: timestamp)
		marketingEmailList.removeOnCategoryOptOut(preferences: updatedPreferences)
		return UnsubscribeResult with preferences = updatedPreferences, confirmationRequired = true
+ executeViaPreferencesToggle(preferences: CommunicationPreferences, category: MarketingCategory, timestamp: DateTime): CommunicationPreferences
	Invariant: must take effect immediately
	Invariant: must not suppress transactional notifications
	Interaction:
		updatedPreferences: CommunicationPreferences = preferences.toggleCategoryOptIn(category: category, optedIn: false, timestamp: timestamp)
		marketingEmailList.removeOnCategoryOptOut(preferences: updatedPreferences)
		return updatedPreferences
+ repeatEmailLinkIdempotently(token: UnsubscribeToken, timestamp: DateTime): UnsubscribeResult
	Invariant: repeat clicks show the same confirmation without error — action is idempotent
	Interaction:
		verifiedPayload: TokenPayload = token.verifyOnEmailLinkRequest()
		preferences: CommunicationPreferences = loadPreferences(accountId: verifiedPayload.accountId)
		if preferences.isOptedIn(category: verifiedPayload.category):
			return executeViaEmailLink(token: token, timestamp: timestamp)
		return UnsubscribeResult with preferences = preferences, confirmationRequired = true, alreadyUnsubscribed = true
+ showConfirmationAfterEmailLink(result: UnsubscribeResult): void
	Invariant: email-link path produces a you have been unsubscribed confirmation page
	Interaction:
		unsubscribeConfirmationPage.renderUnsubscribedMessage(alreadyUnsubscribed: result.alreadyUnsubscribed)

### **UnsubscribeToken** << ValueObject >>

Initialisation: factory method `UnsubscribeToken.encode(accountId, category)` — signed payload at dispatch time.
------
+ signedPayload: String
	Invariant: token must be signed to prevent tampering with account or category
	Invariant: token encodes exactly one marketing category per unsubscribe action
----
+ encode(accountId: String, category: MarketingCategory): UnsubscribeToken
	Interaction:
		payload: TokenPayload = TokenPayload.of(accountId: accountId, category: category)
		return UnsubscribeToken with signedPayload = sign(payload: payload)
+ verifyOnEmailLinkRequest(): TokenPayload
	Invariant: token must be signed to prevent tampering with account or category
	Interaction:
		payload: TokenPayload = verifyAndDecode(signedPayload: this.signedPayload)
		return payload

### references

**Ref — Easy unsubscribe**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe.
```

**Ref — Unsubscribe story**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Unsubscribe from Marketing Emails
Extract: acceptance criteria

```source
WHEN the customer clicks the Unsubscribe link in any Marketing Communication
THEN the customer is immediately opted out of that Marketing Category
AND a "you've been unsubscribed" confirmation page is shown

WHEN the customer clicks an Unsubscribe link for a Marketing Category they have already unsubscribed from
THEN the confirmation page still shows "you've been unsubscribed" — the action is idempotent
BUT no error or confusing message is displayed
```

### decisions made

- *UnsubscribeToken* introduced as ValueObject state-carrier — signed email-link payload (account + category) is distinct from the opt-out act; verification and tamper protection belong on the token (introduce-state-carrier-class rule).
- Full *Unsubscribe* responsibilities consolidated in Sprint 4 — Sprint 2 deferred email-link confirmation; Sprint 3 carried promotional-link boundary only; this sprint owns complete story (scope-fit test).
- Idempotent repeat execution via *repeatEmailLinkIdempotently* — AC requires graceful repeat clicks without error (every-behavior-has-backing-responsibility).
- *MarketingCommunication* generates category-scoped links at dispatch — preference mutation remains on *CommunicationPreferences* boundary (explicit-chain-of-responsibility).

---

# Boundary Domain

### **CommunicationPreferences** << Entity >>

Initialisation: boundary from Sprint 2 — owned by Customer Account module.
------
+ toggleCategoryOptIn(category: MarketingCategory, optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: changes persist immediately — unsubscribe via preferences page uses same path as Sprint 2
+ isOptedIn(category: MarketingCategory): Boolean

### **MarketingCategory** << ValueObject >>

Initialisation: pre-defined catalog — promotions, recommendations, restockAlerts, events.
------
+ name: MarketingCategoryName
	Invariant: category name is the unit of consent for unsubscribe

### **MarketingEmailList** << Entity >>

Initialisation: boundary from Sprint 2 — membership derived from communication preferences.
------
+ removeOnCategoryOptOut(preferences: CommunicationPreferences): MarketingEmailList
	Invariant: membership requires at least one active marketing category opt-in

### **CustomerAccount** << Entity >>

Initialisation: boundary — owned by Customer Account module.
------
+ accountId: String
+ verifiedEmail: String
+ communicationPreferences: CommunicationPreferences

### **TransactionalNotification** << Entity >>

Initialisation: boundary — owned by Notification module.
------
+ deliverTo(account: CustomerAccount, preferences: NotificationPreferences): Boolean
	Invariant: order confirmations, shipping updates, and appointment reminders continue regardless of marketing opt-out
	Invariant: marketing unsubscribe must not suppress transactional notifications

### **NotificationPreferences** << Entity >>

Initialisation: boundary — owned by Notification module.
------
+ transactionalCategorySettings: Dictionary<TransactionalCategory, Boolean>
	Invariant: separate from communication preferences — marketing unsubscribe does not alter these settings

### **ContentAuthor** << Entity >>

Initialisation: boundary — owned by Store Operations module.
------
+ authorId: String
+ displayName: String
----
+ createEditPublishContent(content: Content): void
	Invariant: only authenticated staff with content author role may publish

### **AdminContentArea** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ presentDraftAndPublishActions(blogPost: BlogPost | PetCareGuide): void
+ retainEditableDraft(content: Content): void

### **UnsubscribeConfirmationPage** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ renderUnsubscribedMessage(alreadyUnsubscribed: Boolean): void
+ linkToCommunicationPreferences(): void

### **PetBrowsingArea** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ surfaceGuidesMatching(tag: SpeciesTag, guide: PetCareGuide): void

### **ProductBrowsingArea** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ surfaceGuidesMatching(tag: SpeciesTag, guide: PetCareGuide): void

### references

**Ref — CRC boundary concepts**
Source: docs/increments/8-marketing-engine/specification/crc.md
Locator: Boundary Domain — Content Author, Admin Content Area, Transactional Notification
Extract: partial

```source
Content Author (boundary) — only authenticated staff with content author role may publish
Admin Content Area (boundary) — present draft and publish actions; retain editable draft
Transactional Notification (boundary) — unaffected by marketing unsubscribe; order confirmations continue
Notification Preferences (boundary) — separate from communication preferences
```

### decisions made

- *ContentAuthor* and *AdminContentArea* remain boundary — role permissions and staff UI owned by Store Operations; sprint models publish lifecycle and public surfaces only (scope-fit test).
- *TransactionalNotification* and *NotificationPreferences* remain boundary — marketing unsubscribe isolation enforced via invariant on delivery, not by mutating notification settings (explicit-chain-of-responsibility).
- *PetBrowsingArea* and *ProductBrowsingArea* modeled as Services — cross-link surfacing is presentation orchestration without persisted domain state (mirrors *ProductDetailsPage* pattern from Sprint 1).

---


---

## marketing-engine-campaigns-object-model

<!-- migrated from: increments/8-marketing-engine/engineering/object-model.md -->

---
state: domain-model
sprint_scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
---

# Module: [Marketing Engine]

Scope: Sprint 3 — consent-gated delivery of admin *Promotional Email*, system-generated *Personalized Recommendation*, inventory-triggered *Restock Alert*, and store-matched *In-Store Event Notification*. Preference management and content publishing are boundary dependencies from Sprint 2 and Sprint 4.

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the shared send-time gate for all four message types in this sprint — consent check at delivery, verified-email routing, and retry-on-failure semantics.

### **MarketingCommunication** << Service >>

Initialisation: stateless service — constructed with *CommunicationPreferences* lookup, *CustomerAccount* lookup, and delivery queue at application bootstrap.
------
+ checkCommunicationPreferencesAtSend(accountId: String, category: MarketingCategory): Boolean
	Invariant: must never send without explicit opt-in for the relevant marketing category
	Invariant: preference check must occur at delivery time, not batch creation time
	Interaction:
		preferences: CommunicationPreferences = loadPreferences(accountId: accountId)
		return preferences.isOptedIn(category: category)
+ routeToVerifiedCustomerEmail(account: CustomerAccount): String
	Invariant: guest checkout sessions cannot receive marketing communications
	Interaction:
		return account.verifiedEmail
+ queueForRetryOnDeliveryFailure(messageRef: String, recipient: String): void
	Invariant: delivery failure must queue for retry — message is not silently discarded

### **PromotionalEmail** << Service >>

Initialisation: stateless service — orchestrates batch send with realtime opt-out re-check at delivery.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: delivered only to marketing email list members with active promotions category opt-in
----
+ sendToMarketingEmailList(content: PromotionalContent, list: MarketingEmailList): SendResult
	Invariant: must not be delivered to customers who opted out between batch creation and delivery
	Interaction:
		for each accountId in list.memberAccountIds:
			if checkCommunicationPreferencesAtSend(accountId: accountId, category: promotions): deliver(content, accountId)
+ includeUnsubscribeLink(content: PromotionalContent): PromotionalContent
	Invariant: unsubscribe link must immediately opt customer out of promotions category on click

### **PersonalizedRecommendation** << Service >>

Initialisation: stateless service — consumes purchase, browsing, and pet profile boundary data.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: must be genuinely personalized — if no data exists to personalize against, do not send
	Invariant: must never recommend an out-of-stock product
	Invariant: generic suggestions are handled by promotional email, not this channel
----
+ generateFromPurchaseHistory(history: PurchaseHistory, catalog: ProductCatalog): List<Product>
+ generateFromBrowsingPatterns(history: BrowsingHistory, catalog: ProductCatalog): List<Product>
+ generateFromPetProfile(profile: PetProfile, catalog: ProductCatalog): List<Product>
+ excludeOutOfStock(products: List<Product>, availability: StockAvailability): List<Product>
+ sendWhenRecommendationsOptedIn(account: CustomerAccount, products: List<Product>): SendResult | null
	Interaction:
		if products.isEmpty(): return null
		if not checkCommunicationPreferencesAtSend(accountId: account.id, category: recommendations): return skipped
		return deliverRecommendation(account: account, products: products)

### **RestockAlert** << Service >>

Initialisation: stateless service — triggered on stock transition events.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: sent only when stock availability transitions from out-of-stock to in-stock
	Invariant: requires product on customer wishlist and restock alerts category opt-in
----
+ evaluateOnStockTransition(product: Product, priorState: StockState, newState: StockState): List<RestockAlertCandidate>
	Interaction:
		if priorState is not out_of_stock or newState is not in_stock: return empty
		return wishlistedCustomers(product: product) map to RestockAlertCandidate
+ sendWhenRestockAlertsOptedIn(candidate: RestockAlertCandidate): SendResult | null
	Invariant: must not be sent to customers who have not opted in to restock alerts, even if the product is on their wishlist
	Invariant: is a best-effort signal — product may go back out of stock before the customer acts

### **InStoreEvent** << Entity >>

Initialisation: factory method `InStoreEvent.create(store, eventType, scheduledDate)` — admin-authored event metadata.
------
+ eventId: String
+ eventType: InStoreEventType
+ scheduledDate: Date
+ << association >> hostStore: Store
	Invariant: must be associated with exactly one store location
----
+ remainDiscoverableOnStoreDetailPage(): void
	Invariant: event remains visible on store detail page for walk-in discovery even when no notification is sent

### **InStoreEventNotification** << Service >>

Initialisation: stateless service — matches event location to customer preferred store.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: must not be sent when no preferred store is set — system does not guess proximity
	Invariant: must not send when event location differs from customer preferred store
	Invariant: must not send without explicit opt-in for events marketing category
----
+ matchCustomerPreferredStore(event: InStoreEvent, account: CustomerAccount): Boolean
	Interaction:
		preferredStore: Store | null = account.preferredStore
		if preferredStore is null: return false
		return preferredStore.id == event.hostStore.id
+ sendWhenEventsOptedIn(event: InStoreEvent, account: CustomerAccount): SendResult | null
	Interaction:
		if not matchCustomerPreferredStore(event: event, account: account): return null
		if not checkCommunicationPreferencesAtSend(accountId: account.id, category: events): return skipped
		return deliverEventNotification(event: event, account: account)

### references

**Ref — Campaign and alert stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Send Promotional Email, Send Personalized Recommendation, Send Restock Alert, Send In-Store Event Notification
Extract: acceptance criteria

```source
WHEN admin creates and sends a Promotional Email
THEN the email is delivered only to customers on the Marketing Email List who have opted in to the promotions Marketing Category

WHEN a customer on the list has opted out between batch creation and delivery
THEN the email is not delivered to that customer
AND the opt-out is respected because the system checks Communication Preferences at delivery time, not at batch creation time

WHEN the system generates a Personalized Recommendation for a customer
THEN the recommendation is based on purchase history, browsing patterns, or Pet Profile data
AND it is sent only if the customer has opted in to the recommendations Marketing Category

WHEN a Product's Stock Availability transitions from out-of-stock to in-stock
THEN the system sends a Restock Alert to each customer who has the Product on their Wishlist and has opted in to the restock alerts Marketing Category

WHEN admin creates an in-store event (adoption day, grooming workshop, training session)
THEN the system sends In-Store Event Notifications to customers whose preferred Store matches the event location and who have opted in to the events Marketing Category
```

### decisions made

- *MarketingCommunication* remains the shared send-time gate from Sprint 2 — this sprint adds message-type-specific services that delegate consent checks (explicit-chain-of-responsibility).
- Four message types modeled as separate Services, not subtypes — distinct triggering logic and invariants per CRC independence test.
- *InStoreEvent* is an Entity — admin-created event metadata with store association and walk-in discoverability lifecycle.
- *PersonalizedRecommendation* skips send when personalization inputs are empty — null return rather than generic fallback (UL invariant).
- *RestockAlert* evaluates on stock transition only — wishlist intersection and category opt-in enforced at send (collection-class targeting).

---

# Boundary Domain

### **CommunicationPreferences** << Entity >>

Initialisation: boundary from Sprint 2 — owned by Customer Account module.
------
+ checkAtDeliveryTime(category: MarketingCategory): Boolean
	Invariant: enforced at delivery time, not batch creation time
	Invariant: changes persist immediately — send path must read current state at delivery

### **MarketingCategory** << ValueObject >>

Initialisation: pre-defined catalog — promotions, recommendations, restockAlerts, events.
------
+ name: MarketingCategoryName
	Invariant: category name is the unit of consent for send

### **MarketingEmailList** << Entity >>

Initialisation: boundary from Sprint 2 — membership derived from communication preferences.
------
+ memberAccountIds: List<String>
	Invariant: membership requires at least one active marketing category opt-in

### **Unsubscribe** << Service >>

Initialisation: boundary — email-link execution for promotional sends in this sprint.
------
+ executeViaEmailLink(accountId: String, category: MarketingCategory): void
	Invariant: must take effect immediately
	Invariant: must not suppress transactional notifications

### **CustomerAccount** << Entity >>

Initialisation: boundary — owned by Customer Account module.
------
+ verifiedEmail: String
+ preferredStore: Store | null
+ purchaseHistory: PurchaseHistory
	Invariant: guest sessions cannot receive marketing communications

### **Wishlist** << Entity >>

Initialisation: boundary — owned by Customer Account module.
------
+ wishlistedProducts: List<Product>
	Invariant: restock alert targeting source — only wishlisted products trigger evaluation

### **Product** << Entity >>

Initialisation: boundary — owned by Product Catalog module.
------
+ sku: String
+ stockAvailability: StockAvailability

### **StockAvailability** << ValueObject >>

Initialisation: boundary — inventory state on product.
------
+ state: StockState
+ onTransition(from: StockState, to: StockState): StockTransition | null
	Invariant: transition to in-stock triggers restock alert evaluation

### **Store** << Entity >>

Initialisation: boundary — owned by Store module.
------
+ storeId: String
+ hostForEvent(event: InStoreEvent): Boolean

### **PetProfile** << Entity >>

Initialisation: boundary — owned by Customer Account / Pet Visits module.
------
+ species: String
+ breed: String
+ age: Number

### **PurchaseHistory** << Entity >>

Initialisation: boundary — past orders for customer.
------
+ orders: List<Order>

### **BrowsingHistory** << Entity >>

Initialisation: boundary — viewed products for customer.
------
+ viewedProducts: List<Product>

### references

**Ref — Marketing communication boundaries**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: Marketing Communication KA, boundary concepts
Extract: partial

```source
Marketing Communication depends on customer account for preference storage and delivery target, on product for restock triggers, on wishlist for restock targeting, and on store for event-location matching.
```

### decisions made

- Preference and list classes remain boundary from Sprint 2 — send services consume them at delivery without duplicating preference management (scope-fit test).
- *PurchaseHistory* and *BrowsingHistory* split as boundary inputs — personalization algorithm ownership stays outside Marketing Engine.
- *ProductDetailsPage* and *StoreDetailsPage* omitted from typed model — presentation-only; restock best-effort display and event walk-in discovery deferred to interface-design (mirrors Sprint 1 pattern).

---


---

## marketing-engine-preferences-object-model

<!-- migrated from: end-to-end/engineering/object-model.md -->

---
state: domain-model
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
---

# Module: [Marketing Engine]

Scope: Sprint 2 — transactional *Notification Preferences* management (boundary), marketing *Communication Preferences* and *Marketing Category* opt-in, affirmative *Marketing Email List* enrollment with timestamp, and account-settings presentation.

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated messaging layer. The typed model separates send-time gating (*MarketingCommunication*), per-customer opt-in records (*CommunicationPreferences*), category catalog and status (*MarketingCategory*, *CategoryOptInState*), list membership (*MarketingEmailList*), affirmative enrollment (*OptIn*), and category opt-out (*Unsubscribe*).

### **MarketingCommunication** << Service >>

Initialisation: stateless service — constructed with *CommunicationPreferences* repository and *CustomerAccount* lookup at application bootstrap.
------
+ checkCommunicationPreferencesAtSend(accountId: String, category: MarketingCategory): Boolean
	Invariant: must never send without explicit opt-in for the relevant marketing category
	Invariant: preference check must occur at delivery time, not batch creation time
	Interaction:
		preferences: CommunicationPreferences = loadPreferences(accountId: accountId)
		return preferences.isOptedIn(category: category)
+ routeToVerifiedCustomerEmail(account: CustomerAccount): String
	Invariant: guest checkout sessions cannot receive marketing communications
	Interaction:
		return account.verifiedEmail

### **CommunicationPreferences** << Entity >>

Initialisation: factory method `CommunicationPreferences.createDefault(accountId)` — all marketing categories default to opted-out.
------
+ accountId: String
	Invariant: must belong to exactly one customer account
+ << composition >> categoryStates: Dictionary<MarketingCategory, CategoryOptInState>
	Invariant: new marketing categories default to opt-out for every customer
----
+ listCategoriesWithOptInStatus(): List<CategoryOptInState>
+ toggleCategoryOptIn(category: MarketingCategory, optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: changes persist immediately on toggle — no separate save action
	Invariant: opting out of a category stops further marketing communications of that category after the toggle
	Interaction:
		updatedState: CategoryOptInState = CategoryOptInState.withStatus(category: category, optedIn: optedIn, timestamp: timestamp)
		updatedStates: Dictionary<MarketingCategory, CategoryOptInState> = this.categoryStates with category = updatedState
		return CommunicationPreferences with categoryStates = updatedStates
+ hasAnyOptIn(): Boolean
	Interaction:
		return any categoryStates where status is opted-in
+ offerPromotionalOptInAtRegistration(optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: registration opt-in checkbox is unchecked by default — opt-in must be affirmative
	Interaction:
		return optedIn ? this.toggleCategoryOptIn(category: promotions, optedIn: true, timestamp: timestamp) : this
+ offerPromotionalOptInAtCheckout(optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: checkout opt-in checkbox is unchecked by default — opt-in must be affirmative
	Interaction:
		return optedIn ? this.toggleCategoryOptIn(category: promotions, optedIn: true, timestamp: timestamp) : this

### **MarketingCategory** << ValueObject >>

Initialisation: pre-defined catalog instances — promotions, recommendations, restockAlerts, events.
------
+ name: MarketingCategoryName
	Invariant: category name must be one of the extensible catalog values
----
+ defaultNewCategoryToOptOut(preferences: CommunicationPreferences): CommunicationPreferences
	Invariant: new categories must default to opt-out — no broadcast without explicit opt-in for that category
	Interaction:
		return CommunicationPreferences.createDefault(accountId: preferences.accountId)

### **CategoryOptInState** << ValueObject >>

Initialisation: factory method `CategoryOptInState.withStatus(category, optedIn, timestamp)`.
------
+ category: MarketingCategory
+ status: OptInStatus
+ optedInAt: DateTime | null
+ optedOutAt: DateTime | null
	Invariant: opted-in status requires an affirmative action timestamp

### **MarketingEmailList** << Entity >>

Initialisation: derived collection — no independent identity beyond marketing consent records.
------
+ << aggregation >> memberAccountIds: List<String>
----
+ addOnAffirmativeCategoryOptIn(preferences: CommunicationPreferences, timestamp: DateTime): MarketingEmailList
	Invariant: opt-in must always be affirmative — no customer is added without an explicit action
	Invariant: membership requires at least one active marketing category opt-in
	Interaction:
		accountId: String = preferences.accountId
		return preferences.hasAnyOptIn() ? addMember(accountId: accountId) : removeMember(accountId: accountId)
+ removeOnCategoryOptOut(preferences: CommunicationPreferences): MarketingEmailList
	Interaction:
		return preferences.hasAnyOptIn() ? this : removeMember(accountId: preferences.accountId)
+ deriveMembershipFromAnyOptIn(preferences: CommunicationPreferences): Boolean
	Interaction:
		return preferences.hasAnyOptIn()

### **OptIn** << ValueObject >>

Initialisation: factory method `OptIn.record(category, timestamp)` — created only on affirmative customer action.
------
+ category: MarketingCategory
+ recordedAt: DateTime
	Invariant: must be an explicit customer action — never implied or pre-checked

### **Unsubscribe** << Service >>

Initialisation: stateless service — coordinates *CommunicationPreferences* and *MarketingEmailList*.
------
+ executeViaPreferencesToggle(preferences: CommunicationPreferences, category: MarketingCategory, timestamp: DateTime): CommunicationPreferences
	Invariant: must take effect immediately — no further marketing communications of that category after execution
	Invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed
	Interaction:
		updatedPreferences: CommunicationPreferences = preferences.toggleCategoryOptIn(category: category, optedIn: false, timestamp: timestamp)
		return updatedPreferences
+ executeViaEmailLink(accountId: String, category: MarketingCategory, timestamp: DateTime): CommunicationPreferences
	Invariant: email-link unsubscribe must take effect immediately
	Interaction:
		preferences: CommunicationPreferences = loadPreferences(accountId: accountId)
		return executeViaPreferencesToggle(preferences: preferences, category: category, timestamp: timestamp)

### references

**Ref — Email marketing and preferences**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe.
```

**Ref — Preference stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Set Notification Preferences, Set Communication Preferences, Opt In to Marketing Email List
Extract: acceptance criteria

```source
WHEN the customer opens Communication Preferences from account settings
THEN all available Marketing Categories are listed (promotions, recommendations, restock alerts, events)
AND each shows the current opt-in/opt-out status

WHEN the customer toggles a Marketing Category
THEN the change persists immediately on toggle — no separate "save" action is required
AND no Marketing Communications of an opted-out category are sent after the toggle

WHEN the customer opts in to promotional emails via Communication Preferences
THEN the customer is added to the Marketing Email List
AND the opt-in is recorded with a timestamp

WHEN the customer opts in during account registration or checkout
THEN the opt-in checkbox is unchecked by default — opt-in must be affirmative
AND if checked, the customer is added to the Marketing Email List
```

### decisions made

- *CommunicationPreferences* uses factory initialisation with all categories opted-out — matches default opt-out invariant and existing `@pawplace/customer-account-shared` implementation.
- *CategoryOptInState* extracted as ValueObject — per-category status, timestamps, and toggle immutability are distinct from aggregate identity (extract-complex-logic-to-named-operation).
- *MarketingEmailList* membership is derived from *CommunicationPreferences.hasAnyOptIn()* — no separate persisted list identity; timestamp recorded on *CategoryOptInState* (collection-class rule from CRC).
- *MarketingCommunication* modeled as Service — send-time gate and verified-email routing are stateless delivery checks, not entity lifecycle (receiver-not-responsible-for-receiving).
- *OptIn* is a ValueObject — affirmative enrollment is a recorded fact, not a tracked entity (independence test from UL).
- *Unsubscribe* email-link confirmation UI deferred to Sprint 4 — service models preferences-toggle and email-link execution paths only (scope-fit test from CRC decisions).
- Registration and checkout promotional opt-in delegate to *CommunicationPreferences.toggleCategoryOptIn* for promotions category — shared affirmative-action semantics (explicit-chain-of-responsibility).

---

# Boundary Domain

### **NotificationPreferences** << Entity >>

Initialisation: factory method `NotificationPreferences.createDefault(accountId)` — optional categories default to on; critical categories non-optional at send.
------
+ accountId: String
+ << composition >> categoryToggles: Dictionary<TransactionalCategory, CategoryToggleState>
----
+ listCategoriesWithCurrentSetting(): List<CategoryToggleState>
+ toggleCategorySetting(category: TransactionalCategory, enabled: Boolean): NotificationPreferences
	Invariant: changes persist immediately on toggle
+ enforceAtDeliveryTime(category: TransactionalCategory): Boolean
+ protectCriticalCategories(notificationKind: TransactionalNotificationKind): Boolean
	Invariant: order confirmation and refund completion cannot be disabled — critical transactional notifications remain sent
	Invariant: disabling all optional categories still allows critical notifications with an explanatory note
	Interaction:
		return notificationKind.isCritical() || this.isEnabled(category: mapKindToCategory(notificationKind))

### **TransactionalNotification** << Entity >>

Initialisation: constructed per outbound notification at send time.
------
+ category: TransactionalCategory
+ deliveryTarget: CustomerAccount
----
+ respectCategoryPreferenceAtSend(preferences: NotificationPreferences): Boolean
	Invariant: optional follow-up notifications may respect preference; mandatory confirmations always send
	Interaction:
		return preferences.protectCriticalCategories(notificationKind: this.kind) || preferences.enforceAtDeliveryTime(category: this.category)

### **CustomerAccount** << Entity >>

Initialisation: owned by Customer Account module — boundary collaborator.
------
+ accountId: String
+ verifiedEmail: String
+ communicationPreferences: CommunicationPreferences
+ notificationPreferences: NotificationPreferences
----
+ requireLoginForPreferencePages(session: CustomerSession | null): Boolean
	Invariant: guest checkout sessions cannot manage communication or notification preferences on account

### **AccountSettings** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ presentNotificationPreferences(preferences: NotificationPreferences): void
+ presentCommunicationPreferences(preferences: CommunicationPreferences): void
+ promptGuestToLogInOrRegister(): void
	Invariant: guest prompt must not navigate away from the current page

### references

**Ref — Notification preferences boundary**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: notification preferences boundary, communication preferences
Extract: partial

```source
notification preferences (boundary) — governs transactional notification settings (order updates, shipping, appointments, returns) — separate from communication preferences which govern marketing opt-in.

communication preferences — is the per-customer record of which marketing categories have active opt-in status; stored on the customer account but enforced by the marketing communication system at delivery time.

customer account (boundary) — stores the customer's communication preferences and provides the verified email delivery target for marketing communications.
```

**Ref — Set Notification Preferences story**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Set Notification Preferences
Extract: acceptance criteria

```source
WHEN the customer opens Notification Preferences from account settings
THEN the available notification categories are listed (order updates, shipping, appointments, returns)
AND each category shows the current setting (on/off)

WHEN the customer toggles a notification category
THEN the preference is saved immediately
AND future Transactional Notifications of that type respect the updated preference

WHEN the customer disables all transactional notifications
THEN critical notifications (e.g. order confirmation, refund completion) are still sent — they are non-optional
```

### decisions made

- *NotificationPreferences* and *TransactionalNotification* remain boundary — owned by the Notification module; sprint 2 depends on them for transactional toggle behavior and critical-category rules (scope-fit test from CRC).
- Transactional categories modeled as orderUpdates, shipping, appointments, returns — aligned with *Set Notification Preferences* AC; distinct from marketing *MarketingCategory* names (slash-terms-resolved).
- *AccountSettings* modeled as Service — presentation orchestration without persisted domain state (mirrors *ProductDetailsPage* pattern from Sprint 1 reviews object model).
- Critical-notification protection on *NotificationPreferences.protectCriticalCategories* — enforcement at send remains on the Notification module (explicit-chain-of-responsibility).

---


---

## marketing-engine-reviews-object-model

<!-- migrated from: increments/8-marketing-engine/engineering/object-model.md -->

---
state: domain-model
sprint_scope: Increment 8 Sprint 1 — Customer reviews
---

# Module: [Marketing Engine]

Scope: Sprint 1 — verified customer reviews with star ratings, optional written text and photos, aggregate social proof on the product details page, and read-side pagination and sorting.

---

# Core Domain

## **Customer Review**

*Customer Review* is the social-proof mechanism that attaches verified customer opinions to products. The typed model separates authorship and lifecycle (*CustomerReview*), mandatory score (*StarRating*), optional attachments (*ReviewPhoto*), derived rollup (*AggregateStarRating*), and collection read behavior (*ProductReviews*).

### **CustomerReview** << Entity >>

Initialisation: factory method `CustomerReview.create(input)` — private constructor; identity assigned at creation.
------
+ reviewId: String
	Invariant: must be unique across all customer reviews
+ authorId: String
	Invariant: must be authored by exactly one verified customer account that has purchased the product — guest checkout sessions cannot leave reviews
+ productSku: String
	Invariant: must attach to exactly one product
+ starRating: StarRating
	Invariant: must carry exactly one star rating; written text is optional
+ body: String | null
+ << composition >> photos: List<ReviewPhoto>
+ createdAt: DateTime
----
+ attachPhoto(photo: ReviewPhoto): CustomerReview
	Invariant: upload failure on a subsequent photo must not discard the parent review's written text or star rating
	Interaction:
		updatedPhotos: List<ReviewPhoto> = this.photos + photo
		return CustomerReview with photos = updatedPhotos

### **StarRating** << ValueObject >>

Initialisation: factory method `StarRating.of(value)` — validates bounds at creation.
------
+ value: Integer
	Invariant: must be an integer between 1 and 5 inclusive; no half-stars or zero stars

### **ReviewPhoto** << ValueObject >>

Initialisation: factory method `ReviewPhoto.create(input)` — validates format and size at creation.
------
+ storageKey: String
+ originalFilename: String
+ contentType: String
	Invariant: must be a supported image format (JPEG, PNG, WebP)
+ sizeBytes: Integer
	Invariant: must be within configured size limits (5 MB)

### **AggregateStarRating** << ValueObject >>

Initialisation: factory method `AggregateStarRating.fromReviews(reviews)` — derived; no independent identity.
------
+ average: Decimal
+ reviewCount: Integer
----
+ isEmpty(): Boolean
	Invariant: when reviewCount is zero, aggregate must not be displayed as zero on the product details page — show nothing or a prompt instead
	Interaction:
		return reviewCount == 0

### **ProductReviews** << Entity >>

Initialisation: constructed per product SKU when listing reviews for a product details page.
------
+ productSku: String
+ << aggregation >> reviews: List<CustomerReview>
----
+ listSorted(sort: ReviewSort, page: Integer, pageSize: Integer): ReviewPage
	Invariant: default listing order is newest first
	Interaction:
		sortedReviews: List<CustomerReview> = applySort(reviews: this.reviews, sort: sort)
		return paginate(reviews: sortedReviews, page: page, pageSize: pageSize)

### references

**Ref — Customer reviews and ratings**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: whole

```source
We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.
Other customers should be able to see them and they should factor into some kind of aggregate star rating on the product.
```

**Ref — Review stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Submit Written Review with Star Rating, Submit Photo Review, Read Customer Reviews
Extract: acceptance criteria

```source
WHEN a logged-in customer opens the review form on a Product Details Page
THEN the form collects a Star Rating (1–5) and an optional written review (free text)
AND the customer must have purchased the Product to access the form

WHEN the customer submits a valid Customer Review
THEN the review is associated with the Product and the customer's Customer Account
AND the review appears on the Product Details Page sorted by newest first
AND the Product's Aggregate Star Rating is recomputed to include the new Star Rating

WHEN there are many Customer Reviews
THEN the reviews are paginated or lazy-loaded
AND sort controls are provided: newest, oldest, highest rating, lowest rating
```

### decisions made

- *CustomerReview* uses factory initialisation — purchase verification happens in *ReviewService* before `create`; the entity enforces star rating and attachment invariants only (receiver-not-responsible-for-receiving).
- *StarRating* and *ReviewPhoto* are ValueObjects — immutable, validated at construction; no independent lifecycle.
- *AggregateStarRating* is a ValueObject — derived from review snapshots; `isEmpty()` drives suppress-zero display invariant on the product details page.
- *ProductReviews* is an Entity scoped to one product SKU — pagination and sort are collection-level behavior beyond a single review (collection-class rule from CRC).
- Photo attachment returns a new *CustomerReview* instance — immutable entity pattern matches `@pawplace/product-catalog-shared` implementation.
- Purchase verification, aggregate recompute orchestration, and repository persistence live in *ReviewService* (application layer) — not modeled as domain operations on *CustomerReview* (explicit-chain-of-responsibility).

---

# Boundary Domain

### **Product** << Entity >>

Initialisation: owned by Product Catalog module — boundary collaborator.
------
+ sku: String
+ aggregateStarRating: AggregateStarRating | null
----
+ recomputeAggregateOnReviewChange(reviews: List<CustomerReview>): void
	Interaction:
		aggregate: AggregateStarRating = AggregateStarRating.fromReviews(reviews)
		this.aggregateStarRating = aggregate.isEmpty() ? null : aggregate

### **CustomerAccount** << Entity >>

Initialisation: owned by Customer Account module — boundary collaborator.
------
+ accountId: String
----
+ hasPurchasedProduct(sku: String): Boolean
	Invariant: only verified purchasers may create a customer review; guest checkout sessions cannot leave reviews

### **ProductDetailsPage** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ displayAggregateStarRating(aggregate: AggregateStarRating | null): void
	Invariant: when aggregate is empty, show "Be the first to review" prompt instead of zero stars
+ listCustomerReviews(page: ReviewPage): void
+ presentReviewSubmissionForm(canSubmit: Boolean): void
+ promptGuestToSignIn(): void
	Invariant: guest prompt must not navigate away from the product details page

### references

**Ref — Product catalog boundary**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: product, product details page boundary concepts
Extract: partial

```source
product (boundary) — is the entity a customer review attaches to and whose aggregate star rating is derived from accumulated reviews; owns the product details page where reviews are displayed.

customer account (boundary) — is the authoring identity that gates review submission — only verified purchasers of the product may create a customer review.

product details page (boundary) — is the presentation surface where customer reviews and the aggregate star rating are displayed for a product.
```

### decisions made

- *Product*, *CustomerAccount*, and *ProductDetailsPage* remain boundary — owned by Product Catalog and Customer Account modules; sprint 1 depends on them for attachment, authorship verification, and read-side presentation.
- *ProductDetailsPage* modeled as Service — presentation orchestration without persisted domain state (receiver-not-responsible-for-receiving).

---


---

## increment-8-sprint-1-reviews-walkthrough

<!-- migrated from: end-to-end/engineering/object-model.md -->

---
state: walkthrough
sprint_scope: Increment 8 Sprint 1 — Customer reviews
---

# Module: [Marketing Engine]

Scope: Increment 8 Sprint 1 — Customer reviews (verified purchaser reviews, star ratings, optional photos, aggregate social proof, read-side pagination and sorting)

**Epic (story-graph):** Marketing engine - reviews, alerts, and content

**Stories (story-graph):**
- Submit Written Review with Star Rating
- Submit Photo Review
- Read Customer Reviews

**Prior phase:** `docs/increments/8-marketing-engine/specification/crc.md` · **Spec:** `docs/end-to-end/specification/specification-by-example.md`

---

# Core Domain

## **Customer Review**

Submission and read-path scenarios for verified purchaser reviews, star ratings, optional photos, and aggregate recomputation. Each walk traces CRC operations on *Customer Review*, *Star Rating*, *Review Photo*, *Aggregate Star Rating*, and *Product Reviews*.

### **Verified purchaser submits written review with star rating — happy path**

**Purpose:** Validate purchaser verification, review submission with mandatory star rating and optional text, listing on product details page, and aggregate recomputation.
**Concepts traced:** Customer Review, Star Rating, Customer Account, Product, Product Reviews, Aggregate Star Rating

#### Walk 1 — Covers: Submit Written Review with Star Rating — verified purchaser sees form and submits review

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501", name: "Premium Dog Kibble 10kg")
review: CustomerReview = new CustomerReview()
    // Customer Review.verify purchaser before submission — CRC: verified purchaser of product
    account.verifyProductPurchaseHistory(product: product)
        return purchased: true  // Order ORD-8801
    review.verifyPurchaserBeforeSubmission(
        customerAccount: account,
        product: product
    )
        return eligible: true
rating: StarRating = new StarRating(numericScore: 5)
    // Customer Review.submit with star rating and text
    review.submitWithStarRatingAndText(
        customerAccount: account,
        product: product,
        starRating: rating,
        writtenText: "My dog loves this kibble"
    )
        reviews: ProductReviews = product.attachedCustomerReviews
        reviews.accumulatedReviews.add(review)
        reviews.defaultSortByNewestFirst()
            // Product Reviews — CRC invariant: default listing order is newest first
        aggregate: AggregateStarRating = product.aggregateStarRating
        aggregate.recomputeOnReviewCreate(customerReview: review)
            // Aggregate Star Rating.recompute on review create
            aggregate.derivedAverage = 4.8  // illustrative after recompute
        review.contributeStarRatingToAggregate(
            product: product,
            aggregateStarRating: aggregate
        )
        return review
return review  // published on Product Details Page, newest first
```

#### Walk 2 — Covers: Submit Written Review with Star Rating — star-rating-only submission accepted

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = new CustomerReview()
    review.verifyPurchaserBeforeSubmission(customerAccount: account, product: product)
        return eligible: true
rating: StarRating = new StarRating(numericScore: 3)
    review.submitWithStarRatingAndText(
        customerAccount: account,
        product: product,
        starRating: rating,
        writtenText: null
    )
        // Star Rating — CRC invariant: integer 1–5; written text optional on Customer Review
        return review  // accepted with Star Rating 3, no written text body
return
```

### **Non-purchaser cannot submit review — failure path**

**Purpose:** Validate that purchase verification blocks submission while existing reviews remain viewable on the read path.
**Concepts traced:** Customer Review, Customer Account, Product, Product Details Page, Product Reviews

#### Walk 1 — Covers: Submit Written Review with Star Rating — non-purchaser sees purchase prompt

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-TOY-220", name: "Squeaky Bone Chew")
review: CustomerReview = new CustomerReview()
    review.verifyPurchaserBeforeSubmission(customerAccount: account, product: product)
        account.verifyProductPurchaseHistory(product: product)
            return purchased: false
        return eligible: false
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.hideFormForNonPurchasers(customerAccount: account, product: product)
        // Product Details Page — presentation: "Purchase this product to leave a review"
    page.listCustomerReviews(productReviews: product.attachedCustomerReviews)
        // existing Customer Reviews on SKU-TOY-220 remain viewable
return  // no submitWithStarRatingAndText invoked
```

### **Review photo attached on submit with read-side thumbnail — cooperation path**

**Purpose:** Validate photo attachment on submit, graceful validation isolation, and cooperation between *Review Photo*, *Customer Review*, and *Product Details Page* on the read path.
**Concepts traced:** Customer Review, Review Photo, Product Reviews, Product Details Page

#### Walk 1 — Covers: Submit Photo Review — photo stored and displayed inline with lightbox

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = new CustomerReview()
    review.verifyPurchaserBeforeSubmission(customerAccount: account, product: product)
        return eligible: true
photo: ReviewPhoto = new ReviewPhoto(fileName: "dog-kibble-bowl.jpg")
    photo.validateSupportedFormatAndSize(file: "dog-kibble-bowl.jpg")
        return valid: true
rating: StarRating = new StarRating(numericScore: 5)
    review.attachReviewPhotosOnSubmit(reviewPhoto: photo)
    review.submitWithStarRatingAndText(
        customerAccount: account,
        product: product,
        starRating: rating,
        writtenText: "Great quality"
    )
        product.attachedCustomerReviews.accumulatedReviews.add(review)
        return review
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.displayReviewPhotoThumbnails(reviewPhoto: photo)
        photo.displayAsInlineThumbnail()
    page.openPhotoLightboxAtFullSize(reviewPhoto: photo)
        photo.expandToFullSizeInLightbox()
return
```

#### Walk 2 — Covers: Submit Photo Review — unsupported format rejected without losing draft

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = new CustomerReview()  // draft in form
rating: StarRating = new StarRating(numericScore: 4)  // entered, not yet submitted
draftText: String = "Great product"
photo: ReviewPhoto = new ReviewPhoto()
    photo.validateSupportedFormatAndSize(file: "photo.bmp")
        // Review Photo — CRC invariant: supported image format
        return valid: false  // "Supported formats: JPEG, PNG, WebP"
    // Review Photo — CRC invariant: upload failure must not discard parent review written text or star rating
return  // Star Rating 4 and written text "Great product" remain in form; no attachReviewPhotosOnSubmit
```

#### Walk 3 — Covers: Submit Photo Review — oversized image rejected without losing draft

```
photo: ReviewPhoto = new ReviewPhoto()
    photo.validateSupportedFormatAndSize(file: "large-photo.jpg", sizeBytes: 6_500_000)
        return valid: false  // "Image must be under 5 MB"
return  // draft Star Rating and written text preserved; submit not called
```

### **Product with reviews shows aggregate and paginated listing — happy path**

**Purpose:** Validate aggregate display, default newest-first sort, pagination, and alternate sort by highest rating on the read path.
**Concepts traced:** Product, Product Reviews, Aggregate Star Rating, Customer Review, Star Rating, Product Details Page

#### Walk 1 — Covers: Read Customer Reviews — aggregate and listing with sort controls

```
product: Product = Product(sku: "SKU-FOOD-501", name: "Premium Dog Kibble 10kg")
reviews: ProductReviews = product.attachedCustomerReviews
    // 27 Customer Reviews accumulated
aggregate: AggregateStarRating = product.aggregateStarRating
    aggregate.derivedAverage = 4.3
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.displayAggregateStarRating(aggregateStarRating: aggregate, product: product)
        // Aggregate Star Rating.displayed on product details page
    page.listCustomerReviews(productReviews: reviews)
    reviews.defaultSortByNewestFirst()
        return orderedReviews: CustomerReview[]
return
```

#### Walk 2 — Covers: Read Customer Reviews — many reviews paginated; highest-rating sort

```
reviews: ProductReviews = product.attachedCustomerReviews
    reviews.paginateOrLazyLoadListing(productDetailsPage: page)
        // Product Reviews.paginate or lazy-load listing
    reviews.sortByHighestRating()
        // Product Reviews.sort by highest rating — collaborates with Star Rating on each Customer Review
        return orderedByStarRatingDescending: CustomerReview[]
return
```

### **Product with no reviews suppresses zero aggregate — edge path**

**Purpose:** Validate *Aggregate Star Rating* suppress-display invariant and first-review prompt on *Product Details Page*.
**Concepts traced:** Product, Product Reviews, Aggregate Star Rating, Product Details Page

#### Walk 1 — Covers: Read Customer Reviews — zero reviews, no aggregate shown

```
product: Product = Product(sku: "SKU-TOY-220", name: "Squeaky Bone Chew")
reviews: ProductReviews = product.attachedCustomerReviews
    // zero Customer Reviews
aggregate: AggregateStarRating = product.aggregateStarRating
    aggregate.suppressDisplayWhenNoReviews(productReviews: reviews)
        // Aggregate Star Rating — CRC invariant: must not display as zero when no reviews exist
        return displayAggregate: false
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.showBeTheFirstToReviewPrompt(product: product, productReviews: reviews)
return  // "Be the first to review"; no numeric zero shown
```

### references

**Ref — Customer reviews CRC**
Source: docs/increments/8-marketing-engine/specification/crc.md
Locator: Customer Review, Star Rating, Review Photo, Aggregate Star Rating, Product Reviews
Extract: operations and invariants

```source
verify purchaser before submission | Customer Account, Product
submit with star rating and text    | Customer Account, Product, Star Rating, Product Reviews, Aggregate Star Rating
attach review photos on submit      | Review Photo, Product Reviews
recompute on review create          | Customer Review, Product
suppress display when no reviews    | Product Details Page, Product Reviews
default sort by newest first        | Customer Review
```

**Ref — Specification by Example Sprint 1**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: all three stories
Extract: whole

```source
When Customer Account tom.nguyen@pawplace.example submits a Customer Review on Product SKU-FOOD-501 with Star Rating 5 and written text "My dog loves this kibble"
Then the Customer Review is associated with Product SKU-FOOD-501 and Customer Account tom.nguyen@pawplace.example
And Product SKU-FOOD-501 Aggregate Star Rating is recomputed to include Star Rating 5
```

### decisions made

- Walk pseudocode uses CRC operation names verbatim from `marketing-engine-reviews-crc.md` / `marketing-engine-reviews-domain.json`; no new core classes introduced.
- *edit existing review* and *remove review* are modeled on CRC but not exercised in Sprint 1 spec scenarios — deferred to a later sprint unless AC expands (no gap filed; out of sprint scope per ticket notes).
- Purchase verification is initiated on *Customer Review* with *Customer Account* as collaborator; form visibility copy remains on *Product Details Page* (boundary), matching CRC decisions.

---

# Boundary Domain

Guest and presentation flows that cross into Product Catalog and Customer Account modules while keeping review rules in Marketing Engine.

### **Guest prompted to sign in without leaving product details page**

**Purpose:** Validate boundary presentation on *Product Details Page* for guests attempting review submission.
**Concepts traced:** Product Details Page, Customer Account, Customer Review, Product

#### Walk 1 — Covers: Submit Written Review with Star Rating — guest login prompt in place

```
product: Product = Product(sku: "SKU-FOOD-501")
page: ProductDetailsPage = product.hostProductDetailsPage()
    // no Customer Account session (guest)
page.promptGuestToLogInOrRegister()
    // Product Details Page — CRC invariant: guest prompt must not navigate away from product details page
    page.presentReviewSubmissionForm(customerReview: null, customerAccount: null)
        return formShown: false
return  // Product Details Page remains in view; no Customer Review.submitWithStarRatingAndText
```

### **Product hosts reviews and aggregate on details page — cooperation path**

**Purpose:** Validate boundary *Product* cooperation when reviews change and details page hosts the read surface.
**Concepts traced:** Product, Customer Review, Aggregate Star Rating, Product Details Page, Product Reviews

#### Walk 1 — Covers: Read Customer Reviews — Product boundary hosts page and aggregate recompute hook

```
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = /* newly submitted */
product.recomputeAggregateOnReviewChange(customerReview: review)
    aggregate: AggregateStarRating = product.aggregateStarRating
        aggregate.recomputeOnReviewCreate(customerReview: review)
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.displayAggregateStarRating(aggregateStarRating: aggregate, product: product)
    page.listCustomerReviews(productReviews: product.attachedCustomerReviews)
return
```

### references

**Ref — CRC boundary concepts**
Source: docs/increments/8-marketing-engine/specification/crc.md
Locator: Boundary Domain — Product, Customer Account, Product Details Page
Extract: partial

```source
Product (boundary) — attached customer reviews, aggregate star rating, host product details page
Customer Account (boundary) — verify product purchase history, author customer reviews
Product Details Page (boundary) — display aggregate, list reviews, hide form for non-purchasers, prompt guest to log in or register
```

### decisions made

- Boundary walks intentionally stop at presentation and attachment hooks; purchase-history persistence stays in Customer Account module (owned_by per domain.json).
- No gap against CRC: guest and non-purchaser flows split verification (*Customer Account* / *Customer Review*) from copy (*Product Details Page*) as decided in CRC *decisions made*.

---

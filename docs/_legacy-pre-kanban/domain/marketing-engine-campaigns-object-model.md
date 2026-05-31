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
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
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
Source: docs/domain/marketing-engine-ubiquitous-language.md
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

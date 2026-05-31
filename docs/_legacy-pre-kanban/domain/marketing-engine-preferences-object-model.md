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
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
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
Source: docs/domain/marketing-engine-ubiquitous-language.md
Locator: notification preferences boundary, communication preferences
Extract: partial

```source
notification preferences (boundary) — governs transactional notification settings (order updates, shipping, appointments, returns) — separate from communication preferences which govern marketing opt-in.

communication preferences — is the per-customer record of which marketing categories have active opt-in status; stored on the customer account but enforced by the marketing communication system at delivery time.

customer account (boundary) — stores the customer's communication preferences and provides the verified email delivery target for marketing communications.
```

**Ref — Set Notification Preferences story**
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
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

---
state: crc
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
stories:
  - Set Notification Preferences
  - Set Communication Preferences
  - Opt In to Marketing Email List
---

# Module: [Marketing Engine]

Scope: Sprint 2 — transactional *Notification Preferences* management (boundary), marketing *Communication Preferences* and *Marketing Category* opt-in, affirmative *Marketing Email List* enrollment with timestamp, and account-settings presentation. Review submission, campaign sending, and content publishing are out of scope for this artifact.

**Core terms**:
- communication preferences
- marketing category
- marketing email list
- opt-in
- marketing communication

**Key Abstractions (term grouping)**:
- **Marketing Communication**: communication preferences, marketing category, marketing email list, opt-in, marketing communication, unsubscribe

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated messaging layer. This sprint owns how customers record per-category marketing opt-in, how membership on the *Marketing Email List* is derived and timestamped, and how send-time checks respect preferences. Transactional *Notification Preferences* remain a boundary concern of the Notification module.

### **Marketing Communication**
marketing category                    | Marketing Category
delivery target customer account      | Customer Account
check communication preferences at send | Communication Preferences
                                      |   invariant: must never be sent without explicit opt-in for the relevant marketing category
                                      |   invariant: preference check must occur at delivery time, not batch creation time
route to verified customer email      | Customer Account
                                      |   invariant: guest checkout sessions cannot receive marketing communications
lifecycle: (stateless)
invariants:
  - must never be sent without explicit opt-in for the relevant marketing category
  - preference check must occur at delivery time

### **Communication Preferences**
owning customer account               | Customer Account
marketing category opt-in statuses    | Marketing Category
list categories with opt-in status    | Marketing Category
toggle category opt-in                | Marketing Category, Marketing Email List, Unsubscribe
persist immediately on toggle         | Customer Account
                                      |   invariant: changes persist immediately on toggle — no separate save action
                                      |   invariant: new marketing categories default to opt-out for every customer
                                      |   invariant: opting out of a category stops further marketing communications of that category after the toggle
offer promotional opt-in at registration | Marketing Email List, Marketing Category
offer promotional opt-in at checkout  | Marketing Email List, Marketing Category
                                      |   invariant: registration and checkout opt-in checkbox is unchecked by default
lifecycle: (stateless)
invariants:
  - new marketing categories default to opt-out
  - changes persist immediately on toggle

### **Marketing Category**
category name                         | (promotions, recommendations, restock alerts, events)
opt-in status per customer            | Communication Preferences
extensible category catalog           |
default new category to opt-out       | Communication Preferences
                                      |   invariant: new categories must default to opt-out — no broadcast without explicit opt-in for that category
lifecycle: (stateless)
invariants:
  - new categories default to opt-out

### **Marketing Email List**
member customer accounts              | Customer Account, Communication Preferences
add on affirmative category opt-in    | Communication Preferences, Customer Account
record opt-in timestamp               | Communication Preferences
remove on category opt-out            | Communication Preferences, Unsubscribe
derive membership from any opt-in     | Communication Preferences
                                      |   invariant: opt-in must always be affirmative — no customer is added without an explicit action
                                      |   invariant: membership requires at least one active marketing category opt-in
lifecycle: (stateless)
invariants:
  - opt-in must always be affirmative
  - checkbox at registration and checkout is unchecked by default

### **Opt In**
affirmative enrollment action         | Communication Preferences, Marketing Email List
recorded timestamp                    | Marketing Email List
target marketing category             | Marketing Category
lifecycle: (stateless)
invariants:
  - must be an explicit customer action — never implied or pre-checked

### **Unsubscribe**
target marketing category             | Marketing Category
execute via email link                | Marketing Communication, Communication Preferences, Marketing Email List
execute via preferences toggle        | Communication Preferences, Marketing Email List
take effect immediately               | Communication Preferences, Marketing Email List
                                      |   invariant: must take effect immediately — no further marketing communications of that category after execution
                                      |   invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed
show confirmation after email link    | (you have been unsubscribed)
lifecycle: (stateless)
invariants:
  - must not suppress transactional notifications

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

- *Communication preferences* is the KA class listed first — per-customer opt-in record, immediate persist, and category listing are owned here, not on *Customer Account* (independence test from UL).
- *Marketing category* earns its own class — unit of consent, extensibility, and default opt-out invariant are distinct from the preference aggregate (independence test from UL).
- *Marketing email list* earns its own class — membership derivation, affirmative opt-in invariant, and timestamp recording are collection-level behavior beyond a single toggle (collection-class rule).
- *Opt in* introduced as a stateless collaboration concept — registration, checkout, and preferences-page paths share affirmative-action and timestamp semantics without a separate lifecycle subtype (scope-fit test).
- *Unsubscribe* included with delta responsibilities only for sprint stories — full email-link confirmation flow deferred to Sprint 4; preferences-toggle path and transactional-notification isolation are in scope for *Set Communication Preferences* and *Opt In* AC.
- *Marketing communication* carries send-time gate responsibilities — supports "no send without opt-in" AC even though campaign stories are a later sprint (every-behavior-has-backing-responsibility).
- *Notification preferences* is boundary — transactional category toggles and critical-notification rules are owned by the Notification module; this sprint models the account-settings collaboration surface only (scope-fit test; aligned with UL).

---

# Boundary Domain

### **Notification Preferences**
owning customer account               | Customer Account
order updates setting                 | (on or off)
shipping setting                      | (on or off)
appointments setting                  | (on or off)
returns setting                       | (on or off)
list categories with current setting  | Transactional Notification
toggle category setting               | Transactional Notification, Customer Account
persist immediately on toggle         | Customer Account
enforce at delivery time              | Transactional Notification
protect critical categories           | Transactional Notification
                                      |   invariant: order confirmation and refund completion cannot be disabled — critical transactional notifications remain sent
                                      |   invariant: disabling all optional categories still allows critical notifications with an explanatory note
lifecycle: (stateless)
invariants:
  - critical transactional notifications cannot be suppressed

### **Transactional Notification**
notification category                 | (order updates, shipping, appointments, returns)
delivery target                       | Customer Account
respect category preference at send   | Notification Preferences
                                      |   invariant: optional follow-up notifications may respect preference; mandatory confirmations always send
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
store communication preferences       | Communication Preferences
store notification preferences        | Notification Preferences
verified email delivery target        | Marketing Communication
require login for preference pages    | Account Settings
                                      |   invariant: guest checkout sessions cannot manage communication or notification preferences on account
lifecycle: (stateless)
invariants:
  - guest sessions cannot manage account preferences

### **Account Settings**
present notification preferences      | Notification Preferences, Customer Account
present communication preferences     | Communication Preferences, Customer Account
prompt guest to log in or register    | Customer Account
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

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

- *Notification preferences* and *Transactional Notification* are boundary — owned by the Notification module; this sprint depends on them for transactional toggle behavior and critical-category rules (scope-fit test).
- Transactional categories modeled as order updates, shipping, appointments, returns — aligned with *Set Notification Preferences* AC; distinct from marketing *Marketing Category* names (slash-terms-resolved: no conflation of notification preferences with communication preferences).
- *Account settings* introduced as presentation boundary — hosts preference pages and guest-login prompt without owning preference persistence (mirrors *Product Details Page* pattern from Sprint 1 reviews CRC).
- Critical-notification protection modeled on *Notification Preferences* with *Transactional Notification* as collaborator — enforcement at send remains on the Notification module.

---

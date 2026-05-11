---  
state: crc  
---  

# Module: [PawPlace]  

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.  

**Core terms**:  
- product catalog  
- product  
- product image  
- category  
- customer review  
- stock availability  
- pet  
- breed  
- pet photo  
- temperament assessment  
- health record  
- pet lifecycle event  
- pet source  
- pet lineage  
- appointment  
- time slot  
- store  
- store locator  
- click-and-collect  
- customer account  
- guest checkout  
- pet profile  
- wishlist  
- communication preferences  
- saved address  
- shopping cart  
- cart item  
- order  
- order line item  
- delivery option  
- return  
- payment  
- payment vendor  
- saved payment method  
- refund  
- notification  
- notification preferences  
- restock alert  

**Key Abstractions (term grouping)**:  
- **Product Catalog**: product catalog, product, product image, category, customer review, stock availability  
- **Pet**: pet, breed, pet photo, temperament assessment, health record, pet lifecycle event, pet source, pet lineage, pet profile  
- **Appointment**: appointment, time slot  
- **Store**: store, store locator, click-and-collect  
- **Customer Account**: customer account, guest checkout, wishlist, communication preferences, saved address  
- **Order**: order, order line item, shopping cart, cart item, delivery option, return  
- **Payment**: payment, payment vendor, saved payment method, refund  
- **Notification**: notification, notification preferences, restock alert  

---  

# Core Domain  

## **Product Catalog**  

The browsable, searchable collection of pet supplies. Single source of truth for product identity, pricing, stock truth, and review ownership.  

### **Product Catalog**  
browsable product collection        | Product  
filter and search results           | Product, Category  
                                    |   invariant: no other abstraction may duplicate product identity, stock truth, or review ownership  
review and rating system            | Customer Review, Product  

### **Product**  
product name                        |  
SKU                                 |  
                                    |   invariant: must be unique across the entire catalog  
price                               |  
                                    |   invariant: must be positive; historical orders retain the price at time of purchase, not the current price  
brand                               |  
images                              | Product Image  
description                        |  
weight                              |  
length                              |  
width                               |  
height                              |  
categories                          | Category  
                                    |   invariant: must always belong to at least one category  
stock availability                  | Stock Availability  
                                    |   invariant: must always expose current stock availability  
accumulated customer reviews        | Customer Review  
aggregate star rating               |  
                                    |   invariant: recomputed when a review is created, edited, or deleted  
review count                        |  

### **Product Image**  
image file                          |  
alt text                            |  
display order                       |  
uploaded date                       |  

### **Category**  
category name                       |  
parent category                     | Category  
                                    |   invariant: top-level categories have no parent; nesting depth is finite  
display order                       |  
active status                       |  
accept product into multiple categories | Product  

### **Customer Review**  
authoring customer account          | Customer Account  
                                    |   invariant: must be authored by exactly one customer account; guest checkout sessions cannot leave reviews  
review date                         |  
star rating                         |  
review title                        |  
written text                        |  
photo attachment                    |  
attached product                    | Product  
                                    |   invariant: must be attached to exactly one product  
contribute to aggregate rating      | Product  

### **Stock Availability**  
product                             | Product  
                                    |   invariant: one stock availability record per product per stocking location  
quantity on hand                    |  
reserved quantity                   |  
available-to-sell quantity          |  
                                    |   invariant: available-to-sell must never go negative; if it reaches zero, purchasability is false  
reorder point                       |  
reorder quantity                    |  
low stock threshold                 |  
last restocked date                 |  
expected restock date               |  
backorder enabled                   |  
gate order flow                     | Order  
                                    |   invariant: prevents checkout of items with zero available-to-sell unless backorder is enabled  
trigger restock alert               | Restock Alert, Notification  
                                    |   invariant: must be current — stale availability that allows checkout of unavailable items is a domain failure  

### references  

**Ref — Product catalog and browsing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: lines 3–5  
Extract: whole  

```source  
So the basic idea is we're building an online pet store — think of it as the go-to place for pet owners and people looking to become pet owners. The core of the site is a shopping experience for pet supplies: food, toys, beds, leashes, grooming products, aquarium gear, the whole lot. People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.  

The product catalog needs to be rich. Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews. We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.  
```  

### decisions made  

- Customer review authorship modeled as a responsibility on Customer Review with Customer Account as collaborator — two-sided relationship with Customer Account aggregating authored reviews.  
- Aggregate star rating is a derived property on Product, not its own class — recomputed on review lifecycle events.  
- Photo review is an optional attribute of Customer Review, not a subtype — no distinct behavior in the source.  
- Stock Availability extracted as its own class with full inventory data — quantity on hand, reserved, available-to-sell, reorder point, low stock threshold, restock dates, backorder status.  
- **Introduced Product Image** as a first-class concept — same pattern as Pet Photo. Each image has its own file, alt text, and display order. Product references a collection of Product Image.  
- **Decomposed dimensions** into length, width, height as separate properties — the parenthetical `(length, width, height with unit)` was hiding three distinct data fields.  
- Category needs hierarchy (parent category) for navigation — pet stores organize products in trees.  
- Product carries price as a domain property — price is snapshotted to Order Line Item at purchase time so historical orders survive price changes.  
- **No parenthetical values on the right side.** Properties that hold simple data (name, SKU, price, dates, counts) have an empty collaborator column — the property name is the data. Properties that reference another concept list the concept as a collaborator.  

---  

## **Pet**  

Everything pet — store animals showcased online for adoption visits, and customer-owned pet profiles that drive personalised recommendations and reorder reminders. Store pets carry sourcing provenance, health records, temperament assessments, breed data, photos, lineage, and a full auditable lifecycle. Customer pet profiles capture species, breed, age, and dietary needs. The central rule distinguishing pet browsing from product shopping: pets are never purchasable online.  

### **Pet**  
breed                              | Breed  
date of birth                      |  
hosting store                      | Store  
                                   |   invariant: must always be associated with exactly one store  
pet source                         | Pet Source  
lineage                            | Pet Lineage  
photos                             | Pet Photo  
temperament assessments            | Temperament Assessment  
health records                     | Health Record  
lifecycle events                   | Pet Lifecycle Event  
appointment booking call-to-action | Appointment  
                                   |   invariant: must never expose a purchase path  

### **Breed**  
breed name                         |  
species                            |  
size                               |  
coat type                          |  
typical temperament range          |  
exercise needs                     |  

### **Pet Photo**  
image file                         |  
caption                            |  
uploaded by                        | Store  
upload date                        |  

### **Temperament Assessment**  
behavioral observation             |  
assessed by                        | Store  
assessment date                    |  

### **Health Record**  
record type                        |  
condition or event description     |  
recorded date                      |  
recorded by                        | Store  
shareable status                   |  
                                   |   invariant: health history shared online must only include entries marked as shareable  

### **Pet Lifecycle Event**  
lifecycle state                    |  
transitioned on                    |  
transitioned by                    | Store  
transition context                 |  
                                   |   invariant: each event is immutable once recorded  
                                   |   invariant: transitions follow allowed state paths — no skipping quarantine after intake if health check is pending  

### **Pet Source**  
supplier type                      |  
supplier name                      |  
supplier location                  |  
supplier phone                     |  
supplier email                     |  
intake date                        |  
provenance documentation           |  
                                   |   invariant: every pet must trace to exactly one source  

### **Pet Lineage**  
sire                               | Pet  
dam                                | Pet  
pedigree documentation             |  
generation depth                   |  

### **Pet Profile**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account  
pet name                            |  
pet species                         |  
pet breed                           |  
date of birth or approximate age    |  
known allergies                     |  
preferred food type                 |  
special dietary requirements        |  
enable personalised recommendations | Notification, Product  
enable smart reorder timing         | Order, Notification  

### references  

**Ref — Pets and in-store visits**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 7  
Extract: whole  

```source  
Now here's the important bit about the pets themselves: **you cannot buy a pet online**. That's not how this works. What we're offering is the ability to browse available animals — dogs, cats, birds, fish, small mammals, reptiles — and then **register an appointment** to come visit them in store. The idea is that buying a living creature should involve meeting it, seeing how it behaves, making sure it's the right fit. So the online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing. And then there's a big clear call-to-action to book a visit.  
```  

**Ref — Admin pet management**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentence about store staff managing pet profiles.  

```source  
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.  
```  

**Ref — Customer pet profiles**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: partial  
Part: Sentences about customer pet profiles and reorder reminders.  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

### decisions made  

- Decomposed "browsable profile" parenthetical into first-class classes — photos, breed, temperament assessments, health records each carry their own data and lifecycle.  
- **Decomposed breed characteristics** — `(size, coat type, typical temperament range, exercise needs)` was hiding four separate properties on Breed.  
- **Decomposed supplier contact** — `(name, location, phone, email)` was hiding four separate properties on Pet Source.  
- Introduced Pet Lifecycle Event as a state-carrier — each transition records when, who, and why.  
- Expanded lifecycle states beyond available/adopted to include intake, quarantine, available, reserved, adopted, transferred, returned.  
- Introduced Pet Source for provenance — breeders, rescues, shelters, private surrenders.  
- Introduced Pet Lineage for pedigree — sire, dam, documentation.  
- Age is derived from date of birth, not stored directly.  
- Pet adoption triggers notification to customers with pending appointments via Pet Lifecycle Event.  
- **Pet Profile moved to Pet KA.** Pet Profile is data about a pet — species, breed, dietary needs, allergies. It belongs in the Pet KA even though it is owned by a Customer Account. Customer Account references Pet Profile as a collaborator.  

---  

## **Appointment**  

A scheduled visit binding a customer account, a pet, and a store. The bridge between online pet browsing and in-store interaction.  

### **Appointment**  
booking customer account            | Customer Account  
                                    |   invariant: must be booked by exactly one customer account; guest checkout cannot book  
visited pet                         | Pet  
                                    |   invariant: must reference exactly one pet  
hosting store                       | Store  
                                    |   invariant: must reference exactly one store  
scheduled date and time slot        | Time Slot  
                                    |   invariant: must always have a date and time slot  
visit note                          |  
booking date                        |  
appointment status                  |  
cancellation reason                 |  
checked-in time                     |  
checked-in by                       | Store  
visit outcome                       |  
staff visit notes                   |  
follow-up action                    |  
follow-up date                      |  
no-show recorded by                 | Store  
no-show recorded at                 |  
trigger confirmation notification   | Notification  
trigger reminder notification       | Notification  
trigger follow-up notification      | Notification  
record in appointment history       | Customer Account  
appear on staff incoming bookings   | Store  

### **Time Slot**  
start time                          |  
end time                            |  
duration                            |  
available date-and-time window      | Store  
                                    |   invariant: scoped to a specific store's operating hours  
booking status                      |  
consume on booking                  | Appointment  
                                    |   invariant: once booked, no longer available to other customers  
present filtered by store and date  | Store  

### references  

**Ref — Appointment booking system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: whole  

```source  
The appointment system needs to be tied to a specific store location. We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children." They get a confirmation email, a reminder the day before, and the store staff should see it on their end too.  
```  

### decisions made  

- Time slot carries real temporal data — start time, end time, duration.  
- Appointment has its own lifecycle: booked → confirmed → completed / cancelled / no-show. Cancellation requires a reason.  
- Booking date records when the appointment was created (distinct from the scheduled visit date).  
- Time slot has a booking status (available, booked, blocked) — "blocked" covers staff-reserved or maintenance windows.  
- Visit tracking: checked-in time, checked-in by, visit outcome (adopted, interested-returning, not-a-fit, browsing-only), staff visit notes, follow-up action (none, schedule-return-visit, hold-pet, send-adoption-paperwork), follow-up date.  
- No-show tracking: no-show recorded by, no-show recorded at — provides audit trail and triggers follow-up notifications.  
- Follow-up notification trigger: when staff record a follow-up action, the appointment triggers a follow-up notification to the customer on the follow-up date.  

---  

## **Store**  

A physical retail location anchoring the offline dimension — where pets live, appointments happen, click-and-collect is fulfilled, and in-store returns are processed.  

### **Store**  
store name                          |  
store code                          |  
address line one                    |  
address line two                    |  
city                                |  
county or region                    |  
postcode                            |  
country                             |  
                                    |   invariant: must always have a valid street address  
latitude                            |  
longitude                           |  
                                    |   invariant: must always have valid coordinates  
opening time per day                |  
closing time per day                |  
holiday overrides                   |  
                                    |   invariant: must always have operating hours  
phone number                        |  
email address                       |  
active status                       |  
product specialisation              | Category  
hosted pets                         | Pet  
time slots for booking              | Time Slot  
fulfill click-and-collect orders    | Click-and-Collect, Order  
preferred store tailoring           | Customer Account  

### **Store Locator**  
map view of all stores              | Store  
list view of all stores             | Store  
filter stores by availability       | Store  
filter stores by specialisation     | Store, Category  
filter stores by distance           | Store  
customer shared location            |  
customer entered postcode           |  
calculate distance from customer    | Store  
sort nearest-first                  | Store  

### **Click-and-Collect**  
originating order                   | Order  
                                    |   invariant: must reference a specific order  
selected pickup store               | Store  
                                    |   invariant: must reference a specific store for pickup  
pickup status                       |  
estimated ready time                |  
collection window                   |  
notify customer when ready          | Notification  
trigger store-side fulfillment      | Store  

### references  

**Ref — Store locator**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 11  
Extract: whole  

```source  
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.  
```  

**Ref — Store geo and operations**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: partial  
Part: Sentences describing store geo-tagging, address, and operational details.  

```source  
We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits.  
```  

**Ref — Click-and-collect**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences about click-and-collect.  

```source  
Speaking of which — click-and-collect should probably be an option. Order online, pick up at your local store. Saves on shipping and gets people in the door.  
```  

### decisions made  

- **Decomposed Store address** into line 1, line 2, city, county, postcode, country — same pattern as Saved Address. No parenthetical blobs.  
- **Decomposed geo-coordinates** into latitude and longitude as separate properties.  
- **Decomposed operating hours** into opening time per day, closing time per day, and holiday overrides — not a parenthetical blob.  
- **Decomposed Store Locator filters** into separate responsibilities — filter by availability, by specialisation, by distance — instead of `(by availability, specialisation, distance)`.  
- **Decomposed customer location** into shared location and entered postcode as separate inputs.  
- Click-and-Collect enriched with pickup lifecycle.  

---  

## **Customer Account**  

The persistent identity tying a person's entire PawPlace relationship together — history, preferences, saved details, and authored content.  

### **Customer Account**  
first name                          |  
last name                           |  
email address                       |  
                                    |   invariant: must always have a verified email; must be unique across all accounts  
phone number                        |  
username                            |  
password hash                       |  
registration date                   |  
account status                      |  
log in                              |  
log out                             |  
reset password                      |  
verify email                        |  
session across devices              |  
                                    |   invariant: session management must be reliable across devices  
order history                       | Order  
appointment history                 | Appointment  
wishlist                            | Wishlist  
saved addresses                     | Saved Address  
saved payment methods               | Saved Payment Method  
pet profiles                        | Pet Profile  
preferred store                     | Store  
authored customer reviews           | Customer Review  
communication preferences           | Communication Preferences  
drive reorder reminders             | Pet Profile, Order, Notification  

### **Guest Checkout**  
guest email                         |  
guest first name                    |  
guest last name                     |  
guest phone                         |  
complete purchase without account   | Order  
collect guest shipping address      | Order  
collect guest billing address       | Order  
promote account creation            | Customer Account  

### **Wishlist**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; guest sessions do not have wishlists  
held products                       | Product  
date added per product              |  
persist across sessions             | Customer Account  
link to catalog for price and stock | Product, Stock Availability  

### **Communication Preferences**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; guest sessions cannot opt into marketing  
promotional opt-in                  |  
restock alerts opt-in               |  
pet care tips opt-in                |  
event notifications opt-in          |  
granular opt-in and opt-out         | Notification  
                                    |   invariant: marketing notifications must never be sent without explicit opt-in for that category  
last updated date                   |  

### **Saved Address**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; guest checkout collects addresses per-transaction only  
address label                       |  
address line one                    |  
address line two                    |  
city                                |  
county or region                    |  
postcode                            |  
country                             |  
default shipping flag               |  
default billing flag                |  
selectable at checkout              | Order  
                                    |   invariant: historical orders retain a snapshot of the address used; soft-deletion does not break past order references  

### references  

**Ref — User accounts**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: whole  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

**Ref — Authentication**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 15  
Extract: whole  

```source  
For authentication, we're doing standard username and password authentication — registration, login, logout, password reset, email verification, session management, the works. Nothing exotic, just solid and reliable. If someone's logged in on their phone they shouldn't get randomly kicked out every ten minutes.  
```  

**Ref — Shopping and guest checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about guest checkout and account creation appeal.  

```source  
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.  
```  

**Ref — Notification preferences (account side)**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: partial  
Part: Sentences about preference management.  

```source  
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

### decisions made  

- **Decomposed authenticate** — `(registration, login, logout, password reset, email verification)` was five operations collapsed into one parenthetical. Now separate: log in, log out, reset password, verify email. Registration is the creation of the account itself.  
- **Decomposed Guest Checkout transaction details** — `(shipping address, billing address)` was hiding two separate data collections. Now: collect guest shipping address, collect guest billing address.  
- **Decomposed Communication Preferences opted-in categories** — `(promotional, restock alerts, pet care tips, event notifications)` was hiding four separate opt-in flags. Now each is its own property.  
- **Pet Profile moved to Pet KA.** Pet Profile is pet data — it belongs with the Pet abstraction. Customer Account still references it as a collaborator.  

---  

## **Order**  

The complete purchase lifecycle from cart through delivery and potential return. Owns financial summary, line items, shipping details, and tracking.  

### **Order**  
order number                        |  
                                    |   invariant: must be unique across all orders  
order date                          |  
placing party                       | Customer Account, Guest Checkout  
                                    |   invariant: must reference exactly one placing party (customer account or guest checkout session)  
order line items                    | Order Line Item  
                                    |   invariant: must have at least one line item  
shipping address line one           |  
shipping address line two           |  
shipping city                       |  
shipping county or region           |  
shipping postcode                   |  
shipping country                    |  
                                    |   invariant: snapshotted at order time — survives address deletion or editing  
billing address line one            |  
billing address line two            |  
billing city                        |  
billing county or region            |  
billing postcode                    |  
billing country                     |  
delivery option                     | Delivery Option  
subtotal                            |  
tax amount                          |  
shipping cost                       |  
order total                         |  
                                    |   invariant: order total must equal subtotal + tax + shipping  
currency                            |  
completed payment                   | Payment  
                                    |   invariant: must have a completed payment before confirmed  
order status                        |  
tracking number                     |  
estimated delivery date             |  
trigger confirmation notification   | Notification  
trigger shipping notification       | Notification  
provide entry point for returns     | Return  
provide entry point for reorders    | Customer Account  

### **Order Line Item**  
ordered product                     | Product  
product name snapshot               |  
SKU snapshot                        |  
unit price snapshot                  |  
                                    |   invariant: must capture the price at the moment the order is confirmed, not the current catalog price  
quantity                            |  
                                    |   invariant: must be at least one  
line discount                       |  
line total                          |  

### **Shopping Cart**  
owning party                        | Customer Account, Guest Checkout  
                                    |   invariant: must reference exactly one owner (customer account or guest session)  
cart items                          | Cart Item  
created date                        |  
last modified date                  |  
cart subtotal                       |  
persist across devices              | Customer Account  
                                    |   invariant: must persist across devices for logged-in customers; guest carts are session-scoped  
transition to checkout              | Order  

### **Cart Item**  
product in cart                     | Product  
quantity                            |  
                                    |   invariant: must be at least one  
unit price at time of adding        |  
line price                          |  

### **Delivery Option**  
delivery method name                |  
estimated delivery days             |  
shipping cost                       |  
click-and-collect alternative       | Click-and-Collect  
selected during checkout            | Order  
delivery instructions               |  

### **Return**  
originating order                   | Order  
                                    |   invariant: must reference exactly one originating order  
return date                         |  
initiating party                    | Customer Account, Guest Checkout, Store  
return reason                       |  
returned items                      | Order Line Item  
                                    |   invariant: returned items must reference line items from the originating order  
returned quantity per item          |  
item condition                      |  
return status                       |  
return label or QR code             |  
route refund through original vendor| Refund, Payment  
                                    |   invariant: refund must always route through the payment vendor that handled the original transaction  
support online and in-store flows   | Store  
                                    |   invariant: in-store returns require a store employee to record against the original order  

### references  

**Ref — Shopping cart persistence**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about shopping cart persistence.  

```source  
For the shopping side, we need all the standard e-commerce functionality. A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).  
```  

**Ref — Order confirmation and shipping**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 19  
Extract: whole  

```source  
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.  
```  

**Ref — Checkout delivery options**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentence listing delivery options.  

```source  
Checkout flow: shipping address, billing address, delivery options (standard, express, maybe same-day for local), and then payment.  
```  

**Ref — Returns and exchanges**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: whole  

```source  
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.  
```  

### decisions made  

- Introduced Order Line Item and Cart Item as state-carrier classes — many-to-many relationships with their own data.  
- **Decomposed Order address snapshots** into 6 properties each for shipping and billing — line 1, line 2, city, county, postcode, country. No parenthetical blobs.  
- Order carries real financial data: order number, subtotal, tax, shipping cost, total, currency.  
- Tracking number and estimated delivery date added for shipping notifications.  
- Return enriched with real lifecycle: return date, reason, returned items, quantity, condition, status.  
- Delivery Option carries delivery method name, estimated days, shipping cost, delivery instructions.  

---  

## **Payment**  

Financial transaction handling across three integrated vendors. Owns vendor abstraction, webhook processing, retries, refund routing, and saved payment method lifecycle.  

### **Payment**  
payment reference                   |  
associated order                    | Order  
                                    |   invariant: must be associated with exactly one order  
payment amount                      |  
                                    |   invariant: must equal the order total at time of payment  
currency                            |  
payment date                        |  
payment method used                 | Saved Payment Method, Payment Vendor  
payment status                      |  
processing vendor                   | Payment Vendor  
unified checkout experience         | Payment Vendor  
handle webhook callbacks            | Payment Vendor  
handle payment confirmations        | Payment Vendor  
retry failed payments               | Payment Vendor  
                                    |   invariant: retry logic must not duplicate charges  
route refund through original vendor| Refund, Payment Vendor  
                                    |   invariant: refund must always route through the original vendor  

### **Payment Vendor**  
vendor name                         |  
vendor code                         |  
supported payment types             |  
active status                       |  
authorize                           | Payment  
capture                             | Payment  
settle                              | Payment  
refund                              | Refund  

### **StripeWave : Payment Vendor**  
credit and debit card processing    |  

### **PayNova : Payment Vendor**  
digital wallet mobile authorization |  

### **VaultPay : Payment Vendor**  
buy-now-pay-later installment plan  |  
installment count                   |  
installment amount                  |  
installment schedule                |  

### **Refund**  
refund reference                    |  
originating return                  | Return  
                                    |   invariant: must reference exactly one return  
refund amount                       |  
refund date                         |  
route through original vendor       | Payment Vendor  
                                    |   invariant: must always route through the vendor that handled the original transaction  
authorizing party                   |  
                                    |   invariant: authorizing party is recorded for audit  
refund status                       |  
                                    |   invariant: customer sees refund status but not vendor mechanics  

### **Saved Payment Method**  
owning customer account             | Customer Account  
                                    |   invariant: must be owned by exactly one customer account; not exposed to guest checkout  
customer-assigned label             |  
vendor-token reference              | Payment Vendor  
last four digits                    |  
card brand                          |  
wallet provider                     |  
expiry month                        |  
expiry year                         |  
                                    |   invariant: vendor token must remain valid or be marked expired for the method to be usable  
date added                          |  
selectable at checkout              | Order, Payment  
add and soft-delete                 | Customer Account  
                                    |   invariant: deletion must not break refund routing on past orders; historical orders retain the vendor reference  

### references  

**Ref — Payment vendors and checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentences describing the three payment vendors and their integration.  

```source  
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.  
```  

**Ref — Returns and refund routing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: partial  
Part: Sentences about refund routing through original payment vendor.  

```source  
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.  
```  

### decisions made  

- Payment carries real financial data: reference, amount, currency, date, status.  
- Payment status tracks the full authorization lifecycle: pending → authorized → captured → settled / failed / refunded.  
- **Decomposed Saved Payment Method masked display details** — `(last four digits, card brand or wallet provider)` was three separate properties. Now: last four digits, card brand, wallet provider.  
- **Decomposed expiry** into expiry month and expiry year as separate properties.  
- VaultPay enriched with installment data: count, amount, schedule.  
- Refund carries reference, amount, date. Refund amount may differ from order total (partial refund).  

---  

## **Notification**  

The communication layer delivering transactional and marketing messages. Transactional notifications are event-driven and mandatory; marketing notifications are opt-in only.  

### **Notification**  
notification subject                |  
notification body                   |  
notification channel                |  
sent date                           |  
delivery status                     |  
triggering event                    | Order, Appointment, Pet, Refund, Stock Availability  
                                    |   invariant: transactional notifications must always fire for lifecycle events  
recipient                           | Customer Account, Guest Checkout  
                                    |   invariant: every notification must have a deliverable target (verified account email or guest checkout email)  
deliver transactional message       | Order, Appointment, Pet, Refund  
deliver marketing message           | Communication Preferences  
                                    |   invariant: marketing notifications must never fire without explicit opt-in  
check communication preferences     | Communication Preferences  
                                    |   invariant: checked before every marketing send, producing a send-or-suppress decision  

### **Notification Preferences**  
promotional opt-in                  |  
restock alerts opt-in               |  
pet care tips opt-in                |  
event notifications opt-in          |  
checked at delivery time            | Notification  
stored on customer account          | Customer Account  
enforced by notification system     | Notification  

### **Restock Alert**  
monitored product                   | Product  
                                    |   invariant: monitors a specific product the customer has previously purchased  
monitoring customer account         | Customer Account  
last purchase date                  |  
average purchase interval           |  
next expected reorder date          |  
fire on purchase frequency signal   | Notification, Customer Account  
                                    |   invariant: fires when the current date approaches or passes the next expected reorder date  
gated by communication preferences  | Communication Preferences  
                                    |   invariant: only sent if opt-in is active for restock alerts  

### references  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: whole  

```source  
We want a proper **email and notification system**. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

### decisions made  

- Notification carries real message data: subject, body, channel, sent date, delivery status.  
- Delivery status tracks the full dispatch lifecycle: queued → sent → delivered / bounced / failed.  
- **Decomposed Notification Preferences opted-in categories** into separate opt-in flags — promotional, restock alerts, pet care tips, event notifications — matching Communication Preferences.  
- Restock Alert enriched with real purchase-frequency data: last purchase date, average interval, next expected reorder date.  
- Restock Alert tracks a specific product × customer account pairing.  

---  

# Boundary Domain  

### **Content** *(owned by: Content Management — future module)*  
content title                       |  
publication date                    |  
content body                        |  
content author                      |  
published content surface           | Notification  
                                    |   invariant: only published content is visible to PawPlace; authoring and versioning are external concerns  

### **Store Dashboard** *(owned by: Store Operations — future module)*  
inventory levels surface            | Product, Stock Availability  
                                    |   invariant: inventory dashboard is a Store Owner concern; stock updates are a Store Employee concern  
incoming appointments surface       | Appointment  
pet profile edit surface            | Pet  
click-and-collect fulfillment queue | Click-and-Collect, Order  
consume events and data             | Order, Appointment, Pet, Product  
                                    |   invariant: Store Employee handles day-to-day operations; Store Owner has business oversight; Admin is platform-level (content publishing)  

### references  

**Ref — Content and blog**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 33  
Extract: whole  

```source  
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.  
```  

**Ref — Admin dashboard**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences describing the admin dashboard capabilities.  

```source  
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.  
```  

### decisions made  

- Content gains real data: title, publication date, body, author — even as a boundary concept, PawPlace needs to display this content and must know what shape it arrives in.  
- Admin Dashboard renamed to Store Dashboard — it surfaces data from core domain classes but does not own data of its own within PawPlace's boundary. Three actor roles now interact with it: Store Employee (operations), Store Owner (business oversight), and Admin (content publishing).  

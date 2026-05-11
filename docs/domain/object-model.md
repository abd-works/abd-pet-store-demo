---  
state: domain-model  
---  

# Module: [PawPlace]  

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.  

---  

# Core Domain  

## **Product Catalog**  

The browsable, searchable collection of pet supplies. Single source of truth for product identity, pricing, stock truth, and review ownership.  

### **Product Catalog** << Entity >>  

+ ProductCatalog()  
------  
+ << composition >> products: List<Product>  
----  
+ browseProducts(): List<Product>  
	Invariant: returns only active products with at least one category assignment  
+ filterByCategory(category: Category): List<Product>  
	Invariant: returns products belonging to the given category or any of its children  
+ filterByBrand(brand: String): List<Product>  
+ search(keyword: String): List<Product>  
	Invariant: searches across product name, description, brand, and category names  
+ computeAggregateRating(product: Product): void  
	Invariant: recomputed when a review is created, edited, or deleted  
	Interaction:  
		reviews: List<CustomerReview> = product.customerReviews  
		totalStars: Integer = sum of review.starRating for each review in reviews  
		count: Integer = reviews.size()  
		averageRating: Decimal = totalStars / count  
		product.aggregateStarRating = averageRating  
		product.reviewCount = count  

### **Product** << Entity >>  

+ Product(name: String, sku: String, price: Money, brand: String)  
------  
+ name: String  
+ sku: String  
	Invariant: must be unique across the entire catalog  
+ price: Money  
	Invariant: must be positive; historical orders retain the price at time of purchase, not the current price  
+ brand: String  
+ << composition >> images: List<ProductImage>  
+ description: String  
+ weight: Decimal  
+ length: Decimal  
+ width: Decimal  
+ height: Decimal  
+ << aggregation >> categories: List<Category>  
	Invariant: must always belong to at least one category  
+ stockAvailability: StockAvailability  
	Invariant: must always expose current stock availability  
+ << composition >> customerReviews: List<CustomerReview>  
+ aggregateStarRating: Decimal  
	Invariant: recomputed when a review is created, edited, or deleted  
+ reviewCount: Integer  
----  
+ addReview(review: CustomerReview): void  
	Invariant: only one review per customer account per product  
	Interaction:  
		this.customerReviews.add(review)  
		catalog: ProductCatalog = this.owningCatalog  
		catalog.computeAggregateRating(product: this)  
+ snapshotPrice(): Money  
	Invariant: returns the current price for capture at order time  

### **ProductImage** << ValueObject >>  

+ ProductImage(imageFile: String, altText: String, displayOrder: Integer)  
------  
+ imageFile: String  
+ altText: String  
+ displayOrder: Integer  
+ uploadedDate: Date  

### **Category** << Entity >>  

+ Category(categoryName: String)  
------  
+ categoryName: String  
+ parentCategory: Category  
	Invariant: top-level categories have no parent; nesting depth is finite  
+ displayOrder: Integer  
+ activeStatus: Boolean  
----  
+ acceptProduct(product: Product): void  
	Invariant: product is added to this category's product set  
+ children(): List<Category>  
	Invariant: returns all categories whose parentCategory is this  

### **CustomerReview** << Entity >>  

+ CustomerReview(authoringAccount: CustomerAccount, product: Product, starRating: Integer)  
------  
+ authoringAccount: CustomerAccount  
	Invariant: must be authored by exactly one customer account; guest checkout sessions cannot leave reviews  
+ reviewDate: Date  
+ starRating: Integer  
	Invariant: must be between 1 and 5 inclusive  
+ reviewTitle: String  
+ writtenText: String  
+ photoAttachment: String  
+ attachedProduct: Product  
	Invariant: must be attached to exactly one product  

### **StockAvailability** << Entity >>  

+ StockAvailability(product: Product, quantityOnHand: Integer)  
------  
+ product: Product  
	Invariant: one stock availability record per product per stocking location  
+ quantityOnHand: Integer  
+ reservedQuantity: Integer  
+ availableToSellQuantity: Integer  
	Invariant: available-to-sell must never go negative; if it reaches zero, purchasability is false  
+ reorderPoint: Integer  
+ reorderQuantity: Integer  
+ lowStockThreshold: Integer  
+ lastRestockedDate: Date  
+ expectedRestockDate: Date  
+ backorderEnabled: Boolean  
----  
+ gateOrderFlow(requestedQuantity: Integer): Boolean  
	Invariant: prevents checkout of items with zero available-to-sell unless backorder is enabled  
	Interaction:  
		available: Integer = this.availableToSellQuantity  
		if available >= requestedQuantity: return true  
		if this.backorderEnabled: return true  
		return false  
+ reserveStock(quantity: Integer): void  
	Invariant: reserved quantity increases; available-to-sell decreases by the same amount  
	Interaction:  
		this.reservedQuantity = this.reservedQuantity + quantity  
		this.availableToSellQuantity = this.quantityOnHand - this.reservedQuantity  
+ releaseReservedStock(quantity: Integer): void  
	Invariant: reverses a prior reservation — reserved decreases, available-to-sell increases  
+ updateQuantityOnHand(newQuantity: Integer): void  
	Invariant: recalculates available-to-sell; triggers restock alert if below low stock threshold  
	Interaction:  
		this.quantityOnHand = newQuantity  
		this.availableToSellQuantity = this.quantityOnHand - this.reservedQuantity  
		if this.availableToSellQuantity <= this.lowStockThreshold: triggerRestockAlert()  
- triggerRestockAlert(): void  
	Invariant: fires a restock alert notification for subscribed customers  

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

- ProductCatalog is an Entity — it is the single root that owns all products. browseProducts, filterByCategory, filterByBrand, search are all operations on the catalog, not on Product.  
- Product is an Entity — identity by SKU. Price is typed as Money (value object). Images are composition — they have no identity outside the product.  
- Categories use aggregation — a product belongs to categories, but categories have independent lifecycle (shared across products).  
- CustomerReview is an Entity — each review has its own identity and lifecycle. Photo attachment is optional (not a subtype — no distinct behavior).  
- StockAvailability is an Entity — one record per product per stocking location. gateOrderFlow is the key domain operation that enforces the checkout invariant.  
- aggregateStarRating and reviewCount are derived properties on Product, recomputed by ProductCatalog.computeAggregateRating — not their own class.  
- ProductImage is a ValueObject — defined entirely by its content (file, alt text, order). Two images with the same attributes are interchangeable.  
- triggerRestockAlert is a private helper on StockAvailability — the external caller is updateQuantityOnHand.  

---  

## **Pet**  

Everything pet — store animals showcased online for adoption visits, and customer-owned pet profiles that drive personalised recommendations and reorder reminders. Store pets carry sourcing provenance, health records, temperament assessments, breed data, photos, lineage, and a full auditable lifecycle. Customer pet profiles capture species, breed, age, and dietary needs.  

### **Pet** << Entity >>  

+ Pet(breed: Breed, hostingStore: Store, petSource: PetSource)  
------  
+ breed: Breed  
+ dateOfBirth: Date  
+ hostingStore: Store  
	Invariant: must always be associated with exactly one store  
+ petSource: PetSource  
	Invariant: every pet must trace to exactly one source  
+ lineage: PetLineage  
+ << composition >> photos: List<PetPhoto>  
+ << composition >> temperamentAssessments: List<TemperamentAssessment>  
+ << composition >> healthRecords: List<HealthRecord>  
+ << composition >> lifecycleEvents: List<PetLifecycleEvent>  
----  
+ currentLifecycleState(): String  
	Invariant: derived from the most recent lifecycle event  
	Interaction:  
		latestEvent: PetLifecycleEvent = this.lifecycleEvents.last()  
		return latestEvent.lifecycleState  
+ transitionLifecycle(newState: String, transitionedBy: Store, context: String): PetLifecycleEvent  
	Invariant: transitions follow allowed state paths — no skipping quarantine after intake if health check is pending  
	Interaction:  
		currentState: String = this.currentLifecycleState()  
		event: PetLifecycleEvent = new PetLifecycleEvent(lifecycleState: newState, transitionedOn: now(), transitionedBy: transitionedBy, transitionContext: context)  
		this.lifecycleEvents.add(event)  
		return event  
+ addHealthRecord(record: HealthRecord): void  
+ addTemperamentAssessment(assessment: TemperamentAssessment): void  
+ addPhoto(photo: PetPhoto): void  
+ shareableHealthRecords(): List<HealthRecord>  
	Invariant: returns only entries marked as shareable  
	Interaction:  
		shareable: List<HealthRecord> = filter this.healthRecords where record.shareableStatus == true  
		return shareable  
+ bookingCallToAction(): Appointment  
	Invariant: must never expose a purchase path  

### **Breed** << ValueObject >>  

+ Breed(breedName: String, species: String)  
------  
+ breedName: String  
+ species: String  
+ size: String  
+ coatType: String  
+ typicalTemperamentRange: String  
+ exerciseNeeds: String  

### **PetPhoto** << ValueObject >>  

+ PetPhoto(imageFile: String, caption: String, uploadedBy: Store)  
------  
+ imageFile: String  
+ caption: String  
+ uploadedBy: Store  
+ uploadDate: Date  

### **TemperamentAssessment** << ValueObject >>  

+ TemperamentAssessment(behavioralObservation: String, assessedBy: Store, assessmentDate: Date)  
------  
+ behavioralObservation: String  
+ assessedBy: Store  
+ assessmentDate: Date  

### **HealthRecord** << ValueObject >>  

+ HealthRecord(recordType: String, conditionOrEventDescription: String, recordedBy: Store)  
------  
+ recordType: String  
+ conditionOrEventDescription: String  
+ recordedDate: Date  
+ recordedBy: Store  
+ shareableStatus: Boolean  
	Invariant: health history shared online must only include entries marked as shareable  

### **PetLifecycleEvent** << ValueObject >>  

+ PetLifecycleEvent(lifecycleState: String, transitionedOn: DateTime, transitionedBy: Store, transitionContext: String)  
------  
+ lifecycleState: String  
+ transitionedOn: DateTime  
+ transitionedBy: Store  
+ transitionContext: String  
	Invariant: each event is immutable once recorded  
	Invariant: transitions follow allowed state paths — no skipping quarantine after intake if health check is pending  

### **PetSource** << ValueObject >>  

+ PetSource(supplierType: String, supplierName: String)  
------  
+ supplierType: String  
+ supplierName: String  
+ supplierLocation: String  
+ supplierPhone: String  
+ supplierEmail: String  
+ intakeDate: Date  
+ provenanceDocumentation: String  
	Invariant: every pet must trace to exactly one source  

### **PetLineage** << ValueObject >>  

+ PetLineage()  
------  
+ sire: Pet  
+ dam: Pet  
+ pedigreeDocumentation: String  
+ generationDepth: Integer  

### **PetProfile** << Entity >>  

+ PetProfile(owningCustomerAccount: CustomerAccount, petName: String, petSpecies: String)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account  
+ petName: String  
+ petSpecies: String  
+ petBreed: String  
+ dateOfBirthOrApproximateAge: String  
+ knownAllergies: String  
+ preferredFoodType: String  
+ specialDietaryRequirements: String  
+ enablePersonalisedRecommendations: Boolean  
+ enableSmartReorderTiming: Boolean  
----  
+ recommendProducts(catalog: ProductCatalog): List<Product>  
	Invariant: excludes products containing flagged allergens or incompatible ingredients when knownAllergies or specialDietaryRequirements are set  
	Interaction:  
		allProducts: List<Product> = catalog.browseProducts()  
		filtered: List<Product> = exclude products incompatible with this.knownAllergies and this.specialDietaryRequirements  
		return filtered  
+ calculateNextReorderDate(orderHistory: List<Order>): Date  
	Invariant: based on average purchase interval for this pet's food type  
	Interaction:  
		relevantOrders: List<Order> = filter orderHistory for this.preferredFoodType  
		averageInterval: Integer = computeAverageIntervalDays(orders: relevantOrders)  
		lastOrderDate: Date = relevantOrders.last().orderDate  
		nextReorderDate: Date = lastOrderDate + averageInterval  
		return nextReorderDate  
- computeAverageIntervalDays(orders: List<Order>): Integer  
	Invariant: calculates the mean number of days between consecutive orders of the same food type  

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

- Pet is an Entity — identity tracks an individual animal across its lifecycle. Composition for photos, temperament assessments, health records, lifecycle events — they cannot exist without the pet.  
- Breed is a ValueObject — two breeds with the same name and species are the same breed. No mutable lifecycle.  
- PetPhoto, TemperamentAssessment, HealthRecord are ValueObjects — immutable records once created.  
- PetLifecycleEvent is a ValueObject — immutable once recorded. The lifecycle state machine is enforced by Pet.transitionLifecycle which validates allowed paths.  
- PetSource is a ValueObject — provenance data captured at intake. Immutable record.  
- PetLineage is a ValueObject — pedigree data. sire and dam reference Pet entities but lineage itself is a value.  
- PetProfile is an Entity — it has identity (owned by a specific customer account for a specific pet). enablePersonalisedRecommendations and enableSmartReorderTiming are Boolean flags that drive collaborations with Notification and Product/Order.  
- recommendProducts and calculateNextReorderDate are the operations that fulfil the CRC collaborator references to Product, Order, and Notification on PetProfile.  
- bookingCallToAction on Pet returns an Appointment reference for the UI call-to-action — never a purchase path.  
- age is derived from dateOfBirth, not stored.  

---  

## **Appointment**  

A scheduled visit binding a customer account, a pet, and a store. The bridge between online pet browsing and in-store interaction.  

### **Appointment** << Entity >>  

+ Appointment(bookingCustomerAccount: CustomerAccount, visitedPet: Pet, hostingStore: Store, scheduledDateAndTimeSlot: TimeSlot)  
------  
+ bookingCustomerAccount: CustomerAccount  
	Invariant: must be booked by exactly one customer account; guest checkout cannot book  
+ visitedPet: Pet  
	Invariant: must reference exactly one pet  
+ hostingStore: Store  
	Invariant: must reference exactly one store  
+ scheduledDateAndTimeSlot: TimeSlot  
	Invariant: must always have a date and time slot  
+ visitNote: String  
+ bookingDate: Date  
+ appointmentStatus: String  
+ cancellationReason: String  
+ checkedInTime: DateTime  
+ checkedInBy: Store  
+ visitOutcome: String  
+ staffVisitNotes: String  
+ followUpAction: String  
+ followUpDate: Date  
+ noShowRecordedBy: Store  
+ noShowRecordedAt: DateTime  
----  
+ confirm(): void  
	Invariant: transitions status from booked to confirmed  
	Interaction:  
		this.appointmentStatus = "confirmed"  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.bookingCustomerAccount, type: "confirmation")  
+ cancel(reason: String): void  
	Invariant: requires a cancellation reason; releases the time slot  
	Interaction:  
		this.appointmentStatus = "cancelled"  
		this.cancellationReason = reason  
		this.scheduledDateAndTimeSlot.releaseBooking()  
+ checkIn(checkedInBy: Store): void  
	Invariant: transitions status from confirmed to checked-in; records who and when  
	Interaction:  
		this.appointmentStatus = "checked-in"  
		this.checkedInTime = now()  
		this.checkedInBy = checkedInBy  
+ recordVisitOutcome(outcome: String, staffNotes: String): void  
	Invariant: transitions status from checked-in to completed  
	Interaction:  
		this.appointmentStatus = "completed"  
		this.visitOutcome = outcome  
		this.staffVisitNotes = staffNotes  
+ recordNoShow(recordedBy: Store): void  
	Invariant: transitions status from confirmed to no-show; records who and when  
	Interaction:  
		this.appointmentStatus = "no-show"  
		this.noShowRecordedBy = recordedBy  
		this.noShowRecordedAt = now()  
+ setFollowUpAction(action: String, followUpDate: Date): void  
	Invariant: triggers a follow-up notification to the customer on the follow-up date  
	Interaction:  
		this.followUpAction = action  
		this.followUpDate = followUpDate  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.bookingCustomerAccount, type: "follow-up")  
+ triggerReminder(): void  
	Invariant: sends reminder notification the day before the scheduled date  

### **TimeSlot** << Entity >>  

+ TimeSlot(startTime: DateTime, endTime: DateTime, store: Store)  
------  
+ startTime: DateTime  
+ endTime: DateTime  
+ duration: Duration  
+ availableDateAndTimeWindow: Store  
	Invariant: scoped to a specific store's operating hours  
+ bookingStatus: String  
----  
+ consumeOnBooking(appointment: Appointment): void  
	Invariant: once booked, no longer available to other customers  
	Interaction:  
		this.bookingStatus = "booked"  
+ releaseBooking(): void  
	Invariant: reverts to available when an appointment is cancelled  
	Interaction:  
		this.bookingStatus = "available"  
+ isAvailable(): Boolean  
	Invariant: returns true only if bookingStatus is available and the time is in the future  

### references  

**Ref — Appointment booking system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: whole  

```source  
The appointment system needs to be tied to a specific store location. We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children." They get a confirmation email, a reminder the day before, and the store staff should see it on their end too.  
```  

### decisions made  

- Appointment is an Entity — each appointment has unique identity and a lifecycle (booked → confirmed → checked-in → completed / cancelled / no-show).  
- TimeSlot is an Entity — each slot is individually identifiable by its start time, end time, and store. It has a mutable bookingStatus.  
- visit outcome uses a constrained string, not a subtype — all outcomes follow the same appointment lifecycle (adopted, interested-returning, not-a-fit, browsing-only).  
- follow-up action is a constrained string (none, schedule-return-visit, hold-pet, send-adoption-paperwork) — no subtype behavior.  
- checkedInBy, noShowRecordedBy reference Store (representing the staff location) — not a separate StoreEmployee entity at this model level.  
- Notification creation is called from appointment lifecycle operations (confirm, setFollowUpAction, triggerReminder) — Notification is the collaborator.  

---  

## **Store**  

A physical retail location anchoring the offline dimension — where pets live, appointments happen, click-and-collect is fulfilled, and in-store returns are processed.  

### **Store** << Entity >>  

+ Store(storeName: String, storeCode: String)  
------  
+ storeName: String  
+ storeCode: String  
+ addressLineOne: String  
+ addressLineTwo: String  
+ city: String  
+ countyOrRegion: String  
+ postcode: String  
+ country: String  
	Invariant: must always have a valid street address  
+ latitude: Decimal  
+ longitude: Decimal  
	Invariant: must always have valid coordinates  
+ openingTimePerDay: Dictionary<String, DateTime>  
+ closingTimePerDay: Dictionary<String, DateTime>  
+ holidayOverrides: List<HolidayOverride>  
	Invariant: must always have operating hours  
+ phoneNumber: String  
+ emailAddress: String  
+ activeStatus: Boolean  
+ productSpecialisation: List<Category>  
+ << aggregation >> hostedPets: List<Pet>  
+ << composition >> timeSlotsForBooking: List<TimeSlot>  
----  
+ fulfillClickAndCollectOrder(order: Order, clickAndCollect: ClickAndCollect): void  
	Invariant: marks the click-and-collect as ready and triggers customer notification  
	Interaction:  
		clickAndCollect.pickupStatus = "ready"  
		notification: Notification = Notification.createTransactional(triggeredBy: clickAndCollect, recipient: order.placingParty, type: "click-and-collect-ready")  
+ isOpenAt(dateTime: DateTime): Boolean  
	Invariant: checks operating hours and holiday overrides for the given date and time  
+ availableTimeSlots(date: Date): List<TimeSlot>  
	Invariant: returns only time slots with bookingStatus available on the given date  

### **HolidayOverride** << ValueObject >>  

+ HolidayOverride(date: Date, closed: Boolean)  
------  
+ date: Date  
+ closed: Boolean  
+ overrideOpeningTime: DateTime  
+ overrideClosingTime: DateTime  

### **StoreLocator** << Service >>  

Initialisation: stateless service — no constructor; operates on the Store collection  
------  
+ << aggregation >> stores: List<Store>  
----  
+ mapView(): List<Store>  
+ listView(): List<Store>  
+ filterByAvailability(product: Product): List<Store>  
+ filterBySpecialisation(category: Category): List<Store>  
+ filterByDistance(customerLatitude: Decimal, customerLongitude: Decimal, maxDistanceKm: Decimal): List<Store>  
+ calculateDistanceFromCustomer(store: Store, customerLatitude: Decimal, customerLongitude: Decimal): Decimal  
	Invariant: distance calculated using geo-coordinates  
+ sortNearestFirst(stores: List<Store>, customerLatitude: Decimal, customerLongitude: Decimal): List<Store>  
	Interaction:  
		distances: List<Decimal> = for each store in stores: calculateDistanceFromCustomer(store: store, customerLatitude: customerLatitude, customerLongitude: customerLongitude)  
		sorted: List<Store> = sort stores by distances ascending  
		return sorted  

### **ClickAndCollect** << Entity >>  

+ ClickAndCollect(originatingOrder: Order, selectedPickupStore: Store)  
------  
+ originatingOrder: Order  
	Invariant: must reference a specific order  
+ selectedPickupStore: Store  
	Invariant: must reference a specific store for pickup  
+ pickupStatus: String  
+ estimatedReadyTime: DateTime  
+ collectionWindow: DateTime  
----  
+ notifyCustomerWhenReady(): void  
	Invariant: sends a click-and-collect ready notification including order number, store address, operating hours, and collection window  
	Interaction:  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.originatingOrder.placingParty, type: "click-and-collect-ready")  
+ triggerStoreSideFulfillment(): void  
	Invariant: places the order into the store's fulfillment queue  

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

- Store is an Entity — each store has unique identity (storeCode) and a mutable lifecycle (active/inactive).  
- HolidayOverride extracted as a ValueObject — the CRC had "holiday overrides" as a property on Store; it needs its own typed shape (date, closed flag, override times).  
- Operating hours modeled as Dictionary<String, DateTime> for opening/closing per day-of-week — not a named collection class since the structure is simple key-value.  
- StoreLocator is a Service — stateless, operates on the Store collection. No identity of its own.  
- ClickAndCollect is an Entity — each click-and-collect has its own lifecycle (pending → ready → collected / expired).  
- hostedPets uses aggregation — pets have independent identity; the store hosts but does not own their lifecycle.  
- timeSlotsForBooking uses composition — time slots are created for and owned by the store.  
- customerSharedLocation and customerEnteredPostcode from CRC are parameters to StoreLocator operations, not stored state on StoreLocator.  

---  

## **Customer Account**  

The persistent identity tying a person's entire PawPlace relationship together — history, preferences, saved details, and authored content.  

### **CustomerAccount** << Entity >>  

+ CustomerAccount(firstName: String, lastName: String, emailAddress: String, username: String, passwordHash: String)  
------  
+ firstName: String  
+ lastName: String  
+ emailAddress: String  
	Invariant: must always have a verified email; must be unique across all accounts  
+ phoneNumber: String  
+ username: String  
+ passwordHash: String  
+ registrationDate: Date  
+ accountStatus: String  
+ << aggregation >> orderHistory: List<Order>  
+ << aggregation >> appointmentHistory: List<Appointment>  
+ wishlist: Wishlist  
+ << composition >> savedAddresses: List<SavedAddress>  
+ << aggregation >> savedPaymentMethods: List<SavedPaymentMethod>  
+ << aggregation >> petProfiles: List<PetProfile>  
+ preferredStore: Store  
+ << aggregation >> authoredCustomerReviews: List<CustomerReview>  
+ communicationPreferences: CommunicationPreferences  
----  
+ logIn(username: String, password: String): Boolean  
	Invariant: validates credentials and establishes session  
+ logOut(): void  
	Invariant: terminates the active session  
+ resetPassword(newPasswordHash: String): void  
	Invariant: updates password hash after identity verification  
+ verifyEmail(token: String): void  
	Invariant: marks emailAddress as verified upon valid token  
+ driveReorderReminders(): List<Notification>  
	Invariant: for each pet profile with enableSmartReorderTiming, calculates next reorder date and fires notification  
	Interaction:  
		reminders: List<Notification> = empty list  
		for each petProfile in this.petProfiles where petProfile.enableSmartReorderTiming:  
			nextReorderDate: Date = petProfile.calculateNextReorderDate(orderHistory: this.orderHistory)  
			if nextReorderDate <= today():  
				reminder: Notification = Notification.createTransactional(triggeredBy: petProfile, recipient: this, type: "reorder-reminder")  
				reminders.add(reminder)  
		return reminders  

### **GuestCheckout** << ValueObject >>  

+ GuestCheckout(guestEmail: String, guestFirstName: String, guestLastName: String)  
------  
+ guestEmail: String  
+ guestFirstName: String  
+ guestLastName: String  
+ guestPhone: String  
----  
+ completePurchaseWithoutAccount(order: Order): void  
	Invariant: creates an order without requiring a customer account  
+ collectGuestShippingAddress(): SavedAddress  
	Invariant: collects shipping address for this transaction only — not persisted  
+ collectGuestBillingAddress(): SavedAddress  
	Invariant: collects billing address for this transaction only — not persisted  
+ promoteAccountCreation(): CustomerAccount  
	Invariant: offers post-purchase account creation using the guest's email and order data  

### **Wishlist** << Entity >>  

+ Wishlist(owningCustomerAccount: CustomerAccount)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; guest sessions do not have wishlists  
+ << aggregation >> heldProducts: List<Product>  
+ dateAddedPerProduct: Dictionary<Product, Date>  
----  
+ addProduct(product: Product): void  
	Invariant: persists across sessions for logged-in customers  
+ removeProduct(product: Product): void  
+ linkToCatalogForPriceAndStock(product: Product): StockAvailability  
	Invariant: returns live price and stock from the catalog — not a snapshot  

### **CommunicationPreferences** << ValueObject >>  

+ CommunicationPreferences(owningCustomerAccount: CustomerAccount)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; guest sessions cannot opt into marketing  
+ promotionalOptIn: Boolean  
+ restockAlertsOptIn: Boolean  
+ petCareTipsOptIn: Boolean  
+ eventNotificationsOptIn: Boolean  
+ lastUpdatedDate: Date  
----  
+ updatePreference(category: String, optIn: Boolean): void  
	Invariant: marketing notifications must never be sent without explicit opt-in for that category  

### **SavedAddress** << ValueObject >>  

+ SavedAddress(addressLineOne: String, city: String, postcode: String, country: String)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; guest checkout collects addresses per-transaction only  
+ addressLabel: String  
+ addressLineOne: String  
+ addressLineTwo: String  
+ city: String  
+ countyOrRegion: String  
+ postcode: String  
+ country: String  
+ defaultShippingFlag: Boolean  
+ defaultBillingFlag: Boolean  
----  
+ selectAtCheckout(): SavedAddress  
	Invariant: historical orders retain a snapshot of the address used; soft-deletion does not break past order references  

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

- CustomerAccount is an Entity — persistent identity across the entire platform.  
- GuestCheckout is a ValueObject — no persistent identity; session-scoped. collectGuestShippingAddress and collectGuestBillingAddress return SavedAddress shapes but they are not persisted to the account.  
- Wishlist is an Entity — it has identity (one per customer account) and mutable state (add/remove products).  
- CommunicationPreferences is a ValueObject — defined by its opt-in flags. Replaced immutably when preferences change.  
- SavedAddress is a ValueObject — defined by its address fields. Two addresses with the same fields are the same address.  
- Session management is a CRC responsibility on CustomerAccount but is not modeled as a separate class — it is infrastructure-level (session tokens, expiry) not domain. Recorded as intentional exclusion.  
- NotificationPreferences from CRC is functionally identical to CommunicationPreferences — consolidated into CommunicationPreferences. Notification Preferences was a boundary concept echoing the same opt-in flags stored on Customer Account.  
- orderHistory, appointmentHistory, authoredCustomerReviews use aggregation — these entities have independent lifecycles but are navigated from the account.  
- savedPaymentMethods uses aggregation — payment methods have lifecycle managed by the payment domain; the account navigates to them.  
- savedAddresses uses composition — addresses are owned by the account and have no identity outside it.  

---  

## **Order**  

The complete purchase lifecycle from cart through delivery and potential return. Owns financial summary, line items, shipping details, and tracking.  

### **Order** << Entity >>  

+ Order(orderNumber: String, placingParty: CustomerAccount, orderDate: Date)  
+ Order(orderNumber: String, placingParty: GuestCheckout, orderDate: Date)  
------  
+ orderNumber: String  
	Invariant: must be unique across all orders  
+ orderDate: Date  
+ placingParty: CustomerAccount  
	Invariant: must reference exactly one placing party (customer account or guest checkout session)  
+ << composition >> orderLineItems: List<OrderLineItem>  
	Invariant: must have at least one line item  
+ shippingAddressLineOne: String  
+ shippingAddressLineTwo: String  
+ shippingCity: String  
+ shippingCountyOrRegion: String  
+ shippingPostcode: String  
+ shippingCountry: String  
	Invariant: snapshotted at order time — survives address deletion or editing  
+ billingAddressLineOne: String  
+ billingAddressLineTwo: String  
+ billingCity: String  
+ billingCountyOrRegion: String  
+ billingPostcode: String  
+ billingCountry: String  
+ deliveryOption: DeliveryOption  
+ subtotal: Money  
+ taxAmount: Money  
+ shippingCost: Money  
+ orderTotal: Money  
	Invariant: order total must equal subtotal + tax + shipping  
+ currency: String  
+ completedPayment: Payment  
	Invariant: must have a completed payment before confirmed  
+ orderStatus: String  
+ trackingNumber: String  
+ estimatedDeliveryDate: Date  
----  
+ confirm(payment: Payment): void  
	Invariant: transitions to confirmed only after payment is completed  
	Interaction:  
		this.completedPayment = payment  
		this.orderStatus = "confirmed"  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.placingParty, type: "order-confirmation")  
+ ship(trackingNumber: String, estimatedDeliveryDate: Date): void  
	Invariant: transitions to shipped; records tracking information  
	Interaction:  
		this.orderStatus = "shipped"  
		this.trackingNumber = trackingNumber  
		this.estimatedDeliveryDate = estimatedDeliveryDate  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.placingParty, type: "shipping-update")  
+ calculateTotals(): void  
	Invariant: subtotal is the sum of all line totals; orderTotal equals subtotal + taxAmount + shippingCost  
	Interaction:  
		this.subtotal = sum of lineItem.lineTotal for each lineItem in this.orderLineItems  
		this.orderTotal = this.subtotal + this.taxAmount + this.shippingCost  
+ initiateReturn(): Return  
	Invariant: creates a return linked to this order  
+ reorder(): ShoppingCart  
	Invariant: creates a new cart pre-populated with the same line items  

### **OrderLineItem** << ValueObject >>  

+ OrderLineItem(orderedProduct: Product, quantity: Integer)  
------  
+ orderedProduct: Product  
+ productNameSnapshot: String  
+ skuSnapshot: String  
+ unitPriceSnapshot: Money  
	Invariant: must capture the price at the moment the order is confirmed, not the current catalog price  
+ quantity: Integer  
	Invariant: must be at least one  
+ lineDiscount: Money  
+ lineTotal: Money  
----  
+ snapshotFromProduct(product: Product, quantity: Integer): OrderLineItem  
	Invariant: captures current product name, SKU, and price at order confirmation time  
	Interaction:  
		snapshot: OrderLineItem = new OrderLineItem(orderedProduct: product, quantity: quantity)  
		snapshot.productNameSnapshot = product.name  
		snapshot.skuSnapshot = product.sku  
		snapshot.unitPriceSnapshot = product.price  
		snapshot.lineTotal = product.price * quantity - snapshot.lineDiscount  
		return snapshot  

### **ShoppingCart** << Entity >>  

+ ShoppingCart(owningParty: CustomerAccount)  
+ ShoppingCart(owningParty: GuestCheckout)  
------  
+ owningParty: CustomerAccount  
	Invariant: must reference exactly one owner (customer account or guest session)  
+ << composition >> cartItems: List<CartItem>  
+ createdDate: Date  
+ lastModifiedDate: Date  
+ cartSubtotal: Money  
----  
+ addItem(product: Product, quantity: Integer): void  
	Invariant: if product already in cart, increments quantity  
	Interaction:  
		existingItem: CartItem = find in this.cartItems where cartItem.productInCart == product  
		if existingItem exists: existingItem.quantity = existingItem.quantity + quantity  
		else: this.cartItems.add(new CartItem(productInCart: product, quantity: quantity, unitPriceAtTimeOfAdding: product.price))  
		this.lastModifiedDate = now()  
		this.recalculateSubtotal()  
+ removeItem(product: Product): void  
+ updateItemQuantity(product: Product, newQuantity: Integer): void  
	Invariant: must be at least one; setting to zero removes the item  
+ transitionToCheckout(): Order  
	Invariant: converts cart items into order line items with price snapshots; empties the cart  
	Interaction:  
		order: Order = new Order(orderNumber: generateOrderNumber(), placingParty: this.owningParty, orderDate: now())  
		for each cartItem in this.cartItems:  
			lineItem: OrderLineItem = OrderLineItem.snapshotFromProduct(product: cartItem.productInCart, quantity: cartItem.quantity)  
			order.orderLineItems.add(lineItem)  
		order.calculateTotals()  
		this.cartItems.clear()  
		return order  
- recalculateSubtotal(): void  
	Invariant: cartSubtotal is the sum of all cartItem.linePrice values  
+ persistAcrossDevices(): void  
	Invariant: must persist across devices for logged-in customers; guest carts are session-scoped  

### **CartItem** << ValueObject >>  

+ CartItem(productInCart: Product, quantity: Integer, unitPriceAtTimeOfAdding: Money)  
------  
+ productInCart: Product  
+ quantity: Integer  
	Invariant: must be at least one  
+ unitPriceAtTimeOfAdding: Money  
+ linePrice: Money  

### **DeliveryOption** << ValueObject >>  

+ DeliveryOption(deliveryMethodName: String, estimatedDeliveryDays: Integer, shippingCost: Money)  
------  
+ deliveryMethodName: String  
+ estimatedDeliveryDays: Integer  
+ shippingCost: Money  
+ clickAndCollectAlternative: ClickAndCollect  
+ deliveryInstructions: String  

### **Return** << Entity >>  

+ Return(originatingOrder: Order, initiatingParty: CustomerAccount, returnDate: Date)  
------  
+ originatingOrder: Order  
	Invariant: must reference exactly one originating order  
+ returnDate: Date  
+ initiatingParty: CustomerAccount  
+ returnReason: String  
+ << aggregation >> returnedItems: List<OrderLineItem>  
	Invariant: returned items must reference line items from the originating order  
+ returnedQuantityPerItem: Dictionary<OrderLineItem, Integer>  
+ itemCondition: String  
+ returnStatus: String  
+ returnLabelOrQrCode: String  
----  
+ initiateOnlineReturn(items: List<OrderLineItem>, quantities: List<Integer>, reason: String, condition: String): void  
	Invariant: validates items belong to the originating order; generates return label  
	Interaction:  
		this.returnedItems = items  
		for i in range(items.size()):  
			this.returnedQuantityPerItem.put(items[i], quantities[i])  
		this.returnReason = reason  
		this.itemCondition = condition  
		this.returnStatus = "initiated"  
		this.returnLabelOrQrCode = generateReturnLabel()  
+ processInStoreReturn(items: List<OrderLineItem>, quantities: List<Integer>, reason: String, condition: String, store: Store): void  
	Invariant: in-store returns require a store employee to record against the original order  
+ routeRefund(): Refund  
	Invariant: refund must always route through the payment vendor that handled the original transaction  
	Interaction:  
		originalPayment: Payment = this.originatingOrder.completedPayment  
		refund: Refund = new Refund(originatingReturn: this, refundAmount: calculateRefundAmount(), routeThroughVendor: originalPayment.processingVendor)  
		return refund  
- calculateRefundAmount(): Money  
	Invariant: refund amount based on returned item prices and quantities; may differ from order total for partial returns  
- generateReturnLabel(): String  
	Invariant: produces a printable label or scannable QR code for shipping  

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

- Order is an Entity — identity by orderNumber. Two constructors for the two placing-party types (CustomerAccount and GuestCheckout).  
- OrderLineItem is a ValueObject — immutable snapshot of product data at order time. snapshotFromProduct is a factory method that captures current catalog state.  
- ShoppingCart is an Entity — it has identity (one per customer/guest) and mutable state. Composition for cart items.  
- CartItem is a ValueObject — defined by its product reference, quantity, and price. Immutable once created (quantity updates replace the item).  
- DeliveryOption is a ValueObject — defined by method name, estimated days, and cost.  
- Return is an Entity — each return has its own lifecycle (initiated → processing → completed / rejected). routeRefund creates a Refund through the original payment vendor.  
- Address fields on Order are inline snapshots (6 properties each for shipping and billing) rather than references to SavedAddress — addresses are snapshotted at order time and never change.  
- placingParty is typed as CustomerAccount but also accepts GuestCheckout — the two constructors handle polymorphic placing parties.  
- calculateRefundAmount and generateReturnLabel are private helpers on Return.  

---  

## **Payment**  

Financial transaction handling across three integrated vendors. Owns vendor abstraction, webhook processing, retries, refund routing, and saved payment method lifecycle.  

### **Payment** << Entity >>  

+ Payment(paymentReference: String, associatedOrder: Order, paymentAmount: Money, processingVendor: PaymentVendor)  
------  
+ paymentReference: String  
+ associatedOrder: Order  
	Invariant: must be associated with exactly one order  
+ paymentAmount: Money  
	Invariant: must equal the order total at time of payment  
+ currency: String  
+ paymentDate: Date  
+ paymentMethodUsed: SavedPaymentMethod  
+ paymentStatus: String  
+ processingVendor: PaymentVendor  
----  
+ authorize(): void  
	Invariant: transitions to authorized; delegates to processingVendor  
	Interaction:  
		this.processingVendor.authorize(payment: this)  
		this.paymentStatus = "authorized"  
+ capture(): void  
	Invariant: transitions from authorized to captured  
	Interaction:  
		this.processingVendor.capture(payment: this)  
		this.paymentStatus = "captured"  
+ settle(): void  
	Invariant: transitions from captured to settled  
	Interaction:  
		this.processingVendor.settle(payment: this)  
		this.paymentStatus = "settled"  
+ handleWebhookCallback(payload: String): void  
	Invariant: processes vendor webhook and updates payment status accordingly  
+ retryFailedPayment(): void  
	Invariant: retry logic must not duplicate charges  
	Interaction:  
		if this.paymentStatus == "failed":  
			this.processingVendor.authorize(payment: this)  
			this.paymentStatus = "authorized"  
+ routeRefund(refund: Refund): void  
	Invariant: refund must always route through the original vendor  
	Interaction:  
		this.processingVendor.refund(refund: refund)  

### **PaymentVendor** << Entity >>  

+ PaymentVendor(vendorName: String, vendorCode: String)  
------  
+ vendorName: String  
+ vendorCode: String  
+ supportedPaymentTypes: List<String>  
+ activeStatus: Boolean  
----  
+ authorize(payment: Payment): void  
+ capture(payment: Payment): void  
+ settle(payment: Payment): void  
+ refund(refund: Refund): void  

### **StripeWave : PaymentVendor** << Entity >>  

+ creditAndDebitCardProcessing: Boolean  

### **PayNova : PaymentVendor** << Entity >>  

+ digitalWalletMobileAuthorization: Boolean  

### **VaultPay : PaymentVendor** << Entity >>  

+ installmentCount: Integer  
+ installmentAmount: Money  
+ installmentSchedule: List<Date>  
----  
+ createInstallmentPlan(payment: Payment): void  
	Invariant: splits the payment amount into installmentCount equal parts on the installmentSchedule  

### **Refund** << Entity >>  

+ Refund(refundReference: String, originatingReturn: Return, refundAmount: Money, routeThroughVendor: PaymentVendor)  
------  
+ refundReference: String  
+ originatingReturn: Return  
	Invariant: must reference exactly one return  
+ refundAmount: Money  
+ refundDate: Date  
+ routeThroughVendor: PaymentVendor  
	Invariant: must always route through the vendor that handled the original transaction  
+ authorizingParty: String  
	Invariant: authorizing party is recorded for audit  
+ refundStatus: String  
	Invariant: customer sees refund status but not vendor mechanics  

### **SavedPaymentMethod** << Entity >>  

+ SavedPaymentMethod(owningCustomerAccount: CustomerAccount, vendorTokenReference: String, paymentVendor: PaymentVendor)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; not exposed to guest checkout  
+ customerAssignedLabel: String  
+ vendorTokenReference: String  
+ lastFourDigits: String  
+ cardBrand: String  
+ walletProvider: String  
+ expiryMonth: Integer  
+ expiryYear: Integer  
	Invariant: vendor token must remain valid or be marked expired for the method to be usable  
+ dateAdded: Date  
----  
+ selectAtCheckout(): SavedPaymentMethod  
	Invariant: returns this method for use in a payment transaction  
+ softDelete(): void  
	Invariant: deletion must not break refund routing on past orders; historical orders retain the vendor reference  

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

- Payment is an Entity — each payment has unique identity (paymentReference) and a lifecycle (pending → authorized → captured → settled / failed / refunded).  
- PaymentVendor is an Entity — each vendor has persistent identity and active status. authorize, capture, settle, refund are the core operations all vendors support.  
- StripeWave, PayNova, VaultPay are subtypes of PaymentVendor with delta members only. VaultPay adds installment-specific data and a createInstallmentPlan operation.  
- Refund is an Entity — tracks refund lifecycle independently of the return and payment.  
- SavedPaymentMethod is an Entity — it has identity and mutable state (can be soft-deleted). Token reference and vendor are persisted for refund routing.  
- The unified checkout experience CRC responsibility maps to the Payment.authorize/capture/settle chain — the caller does not need to know which vendor is processing.  
- handleWebhookCallback on Payment processes incoming vendor webhooks — a single entry point regardless of vendor.  
- retryFailedPayment guards against duplicate charges via the invariant.  

---  

## **Notification**  

The communication layer delivering transactional and marketing messages. Transactional notifications are event-driven and mandatory; marketing notifications are opt-in only.  

### **Notification** << Entity >>  

+ Notification.createTransactional(triggeredBy: Object, recipient: CustomerAccount, type: String): Notification  
+ Notification.createMarketing(recipient: CustomerAccount, communicationPreferences: CommunicationPreferences): Notification  
------  
+ notificationSubject: String  
+ notificationBody: String  
+ notificationChannel: String  
+ sentDate: DateTime  
+ deliveryStatus: String  
+ triggeringEvent: Object  
+ recipient: CustomerAccount  
	Invariant: every notification must have a deliverable target (verified account email or guest checkout email)  
----  
+ deliverTransactionalMessage(): void  
	Invariant: transactional notifications must always fire for lifecycle events  
	Interaction:  
		this.deliveryStatus = "queued"  
		send(channel: this.notificationChannel, to: this.recipient.emailAddress, subject: this.notificationSubject, body: this.notificationBody)  
		this.deliveryStatus = "sent"  
		this.sentDate = now()  
+ deliverMarketingMessage(communicationPreferences: CommunicationPreferences): void  
	Invariant: marketing notifications must never fire without explicit opt-in  
	Interaction:  
		sendOrSuppress: Boolean = checkCommunicationPreferences(preferences: communicationPreferences, notificationType: this.notificationChannel)  
		if sendOrSuppress == false: this.deliveryStatus = "suppressed"; return  
		send(channel: this.notificationChannel, to: this.recipient.emailAddress, subject: this.notificationSubject, body: this.notificationBody)  
		this.deliveryStatus = "sent"  
		this.sentDate = now()  
- checkCommunicationPreferences(preferences: CommunicationPreferences, notificationType: String): Boolean  
	Invariant: checked before every marketing send, producing a send-or-suppress decision  
- send(channel: String, to: String, subject: String, body: String): void  
	Invariant: dispatches the message through the appropriate channel  

### **NotificationPreferences** << ValueObject >>  

Initialisation: mirrors CommunicationPreferences stored on CustomerAccount — read-only projection  
------  
+ promotionalOptIn: Boolean  
+ restockAlertsOptIn: Boolean  
+ petCareTipsOptIn: Boolean  
+ eventNotificationsOptIn: Boolean  

### **RestockAlert** << Entity >>  

+ RestockAlert(monitoredProduct: Product, monitoringCustomerAccount: CustomerAccount)  
------  
+ monitoredProduct: Product  
	Invariant: monitors a specific product the customer has previously purchased  
+ monitoringCustomerAccount: CustomerAccount  
+ lastPurchaseDate: Date  
+ averagePurchaseInterval: Integer  
+ nextExpectedReorderDate: Date  
----  
+ fireOnPurchaseFrequencySignal(): void  
	Invariant: fires when the current date approaches or passes the next expected reorder date  
	Interaction:  
		if today() >= this.nextExpectedReorderDate:  
			isOptedIn: Boolean = this.monitoringCustomerAccount.communicationPreferences.restockAlertsOptIn  
			if isOptedIn:  
				notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.monitoringCustomerAccount, type: "restock-alert")  
				notification.deliverTransactionalMessage()  
+ recalculateInterval(orderHistory: List<Order>): void  
	Invariant: updates averagePurchaseInterval and nextExpectedReorderDate from latest order data  

### references  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: whole  

```source  
We want a proper **email and notification system**. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

### decisions made  

- Notification is an Entity — each notification has identity and a lifecycle (queued → sent → delivered / bounced / failed / suppressed).  
- Notification uses factory methods (createTransactional, createMarketing) rather than a public constructor — creation depends on the notification type and involves different validation paths.  
- NotificationPreferences is a ValueObject — mirrors CommunicationPreferences. In practice this is a read-only projection of the CommunicationPreferences stored on CustomerAccount. The two CRC classes (Notification Preferences and Communication Preferences) have been consolidated — CommunicationPreferences is the source of truth, NotificationPreferences is the consumption view.  
- RestockAlert is an Entity — it tracks a specific product × customer pairing over time with mutable interval data.  
- checkCommunicationPreferences is a private helper — the external operation is deliverMarketingMessage which encapsulates the send-or-suppress decision.  
- triggeringEvent is typed as Object — it could be Order, Appointment, Pet, Refund, or StockAvailability. This avoids a dependency magnet but means the caller must provide the right type.  
- Delivery status lifecycle: queued → sent → delivered / bounced / failed (transactional) or suppressed (marketing with opt-out).  

---  

# Boundary Domain  

### **Content** << ValueObject >> *(owned by: Content Management — future module)*  

Initialisation: created externally by the content management system; PawPlace receives published content  
------  
+ contentTitle: String  
+ publicationDate: Date  
+ contentBody: String  
+ contentAuthor: String  
----  
+ publishedContentSurface(): void  
	Invariant: only published content is visible to PawPlace; authoring and versioning are external concerns  

### **StoreDashboard** << Service >> *(owned by: Store Operations — future module)*  

Initialisation: stateless service — surfaces data from core domain classes  
------  
+ inventoryLevelsSurface: List<StockAvailability>  
+ incomingAppointmentsSurface: List<Appointment>  
+ petProfileEditSurface: List<Pet>  
+ clickAndCollectFulfillmentQueue: List<ClickAndCollect>  
----  
+ consumeEventsAndData(orders: List<Order>, appointments: List<Appointment>, pets: List<Pet>, products: List<Product>): void  
	Invariant: Store Employee handles day-to-day operations; Store Owner has business oversight; Admin is platform-level (content publishing)  

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

- Content is a ValueObject — PawPlace receives immutable published content from an external CMS. No mutable lifecycle within this boundary.  
- StoreDashboard (renamed from Admin Dashboard) is a Service — stateless, surfaces data from core domain classes. No identity of its own.  
- Three actor roles interact with the dashboard: Store Employee (operations), Store Owner (business oversight), Admin (content publishing). This is an access-control concern, not a domain-model distinction — all three consume the same data surfaces.  

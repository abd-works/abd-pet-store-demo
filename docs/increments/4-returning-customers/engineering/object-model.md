# Object Model


---

## increment-4-walkthrough

<!-- migrated from: increments/4-returning-customers/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 4 — Returning customers
specification_refresh: Run 5 slot 107 rework
prior_model: crc.md
---

# Module: PawPlace

Walk Increment 4 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). *Guest checkout* coexists; *StripeWave* sole active *payment vendor*; mandatory *email verification* gates account-only features; deferred scope omitted.

## Scope

**Epic:** Returning customers - accounts, history, reorder

**Stories:**

- Register Account
- Send Email Verification
- Verify Email Address
- Log In
- Log Out
- Reset Password
- Maintain Session Across Devices
- Save Delivery Address
- Save Payment Method
- View Order History
- Manage Wishlist
- Reorder Previous Purchase
- Manage Saved Addresses
- Manage Saved Payment Methods
- Select Saved Address at Checkout
- Select Saved Payment Method at Checkout

**Source graph:** `docs/end-to-end/discovery/stories/story-graph.json` (epic priority 4)

---

# Core Domain

## **Customer Account**

Registration, authentication, email verification, session lifecycle, address book, wishlist, and guest-checkout coexistence for returning customers.

### **Register Account — form, valid registration, duplicate email, password validation**

**Purpose:** Validate *register via email and password*, duplicate-email rejection without status leak, and password-requirement gating before account creation.
**Concepts traced:** Customer Account, Email Verification, Account Verification Status

#### Walk 1 — Covers: registration form collects email and password with requirements visible

```
// presentation surfaces password requirements before submission — no domain mutation
form: RegistrationForm = RegistrationForm.open()
assert form.collects(emailAddress, password, passwordConfirmation)
assert form.showsRequirements(minLength: 8, uppercase: true, digit: true, special: true)
return form
```

#### Walk 2 — Covers: valid registration creates unverified account and triggers email verification

```
assert CustomerAccount.byEmail("jane.doe@example.com") == null
account: CustomerAccount = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "jane.doe@example.com",
    password: "Str0ngP@ss!",
    firstName: "Jane",
    lastName: "Doe"
)
// Customer Account.register via email and password → Email Verification
verification: EmailVerification = account.emailVerification
assert account.accountVerificationStatus.verificationLabel == "unverified"
// invariant: must remain unverified until email verification succeeds
EmailVerification.sendVerificationEmail(verification, target: account)
return account
```

#### Walk 3 — Covers: duplicate email rejected without revealing verification status

```
existing: CustomerAccount = CustomerAccount.byEmail("existing@example.com")
assert existing.accountVerificationStatus.verificationLabel == "verified"
result: RegistrationResult = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "existing@example.com",
    password: "Str0ngP@ss!"
)
assert result.succeeded == false
assert result.errorMessage == "This email is already in use"
// invariant: error must not reveal verified vs unverified
assert result.revealsVerificationStatus == false
return result
```

#### Walk 4 — Covers: password failing requirements blocks account creation

```
result: RegistrationResult = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "new.user@example.com",
    password: "short"
)
assert result.succeeded == false
assert result.unmetRequirements.contains("minimum 8 characters")
assert CustomerAccount.byEmail("new.user@example.com") == null
return result
```

### **Send Email Verification — delivery, expired link, queued retry**

**Purpose:** Validate *send verification email*, expired-link resend path, and *queue for retry on delivery failure* without blocking registration confirmation.
**Concepts traced:** Email Verification, Verification Link, Notification, Customer Account

#### Walk 1 — Covers: verification email sent with unique time-limited link on account creation

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
link: VerificationLink = verification.verificationLink
assert link.uniqueLinkToken == "vlink-abc123"
assert link.expiryTime == "2025-05-25T12:00:00Z"
assert link.oneTimeUseFlag == false  // not yet consumed
notification: Notification = EmailVerification.sendVerificationEmail(verification, target: account)
// Email Verification.send verification email → Notification
assert notification.notificationChannel == "email"
assert notification.recipient == account
assert notification.body.contains(link)
return notification
```

#### Walk 2 — Covers: expired verification link shows message and resend action

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
link: VerificationLink = verification.verificationLink
assert link.expiryTime == "2025-05-23T12:00:00Z"  // expired > 24 hours ago
assert link.expiryTime < now()  // invariant: expires after configured window
// Verification Link.offer resend when expired → Email Verification
resendOffer: ResendOffer = VerificationLink.offerResendWhenExpired(link)
assert resendOffer.message == "This verification link has expired"
assert resendOffer.offersResend == true
EmailVerification.resendVerification(verification, link)
return resendOffer
```

#### Walk 3 — Covers: email delivery unavailable queues verification for retry

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
notification: Notification = EmailVerification.sendVerificationEmail(verification, target: account)
// delivery system unavailable — Email Verification.queue for retry on delivery failure → Notification
assert notification.deliveryStatus == "queued"
// invariant: email delivery failure must not block registration confirmation
assert account.accountVerificationStatus.verificationLabel == "unverified"
return notification
```

### **Verify Email Address — valid link, idempotent reuse, expired resend**

**Purpose:** Validate *transition account verification status*, idempotent already-used links, and expired-link resend on verify flow.
**Concepts traced:** Email Verification, Verification Link, Account Verification Status, Customer Account

#### Walk 1 — Covers: valid verification link transitions account to verified

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "unverified"
link: VerificationLink = account.emailVerification.verificationLink
assert link.expiryTime > now()
assert link.oneTimeUseFlag == false  // not yet consumed
EmailVerification.transitionAccountVerificationStatus(
    account.emailVerification,
    status: AccountVerificationStatus.verified()
)
// Email Verification.transition account verification status → Account Verification Status
assert account.accountVerificationStatus.verificationLabel == "verified"
return account
```

#### Walk 2 — Covers: already-used verification link is idempotent

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "verified"
link: VerificationLink = account.emailVerification.verificationLink
assert link.oneTimeUseFlag == "used"
// Verification Link invariant: already-used link shows already verified message
// Email Verification.transition account verification status — idempotent, no regression
assert account.accountVerificationStatus.verificationLabel == "verified"
return account
```

#### Walk 3 — Covers: expired verification link offers resend on verify screen

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
link: VerificationLink = verification.verificationLink
assert link.expiryTime < now()
// Verification Link.offer resend when expired → Email Verification
resendOffer: ResendOffer = VerificationLink.offerResendWhenExpired(link)
assert resendOffer.message == "link expired"
assert resendOffer.offersResend == true
EmailVerification.resendVerification(verification, link)
return resendOffer
```

### **Log In — credentials, unverified block, guest cart merge**

**Purpose:** Validate *log in* session creation, generic invalid-credentials error, unverified-account gate, and *merge guest shopping cart on login*.
**Concepts traced:** Customer Account, Customer Session, Email Verification, Account Verification Status, Shopping Cart, Guest Checkout

#### Walk 1 — Covers: valid credentials create customer session and redirect

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "verified"
session: CustomerSession = CustomerAccount.logIn(
    account,
    credentials: validPassword
)
// Customer Account.log in → Customer Session
// Customer Session.create on successful login → Customer Account, Email Verification
assert session.authenticatedCustomerAccount == account
assert session.sessionToken.isPresent()
return session
```

#### Walk 2 — Covers: invalid credentials show generic error

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
result: LoginResult = CustomerAccount.logIn(
    account,
    credentials: incorrectPassword
)
assert result.succeeded == false
assert result.errorMessage == "invalid email or password"
// invariant: must not specify which field is wrong
assert result.specifiesField == false
return result
```

#### Walk 3 — Covers: unverified account blocked from customer session with account-only access

```
account: CustomerAccount = CustomerAccount.byEmail("tom.reed@example.com")
assert account.accountVerificationStatus.verificationLabel == "unverified"
result: LoginResult = CustomerAccount.logIn(account, credentials: validPassword)
// Email Verification.block account-only features → Customer Account, Customer Session
// Account Verification Status.gate customer session access
assert result.succeeded == false
assert result.message == "please verify your email first"
assert result.offersResendVerification == true
assert result.customerSessionCreated == false
return result
```

#### Walk 4 — Covers: guest shopping cart merges into account cart on login

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
accountCart: ShoppingCart = account.shoppingCart
accountCart.add(product: Product.bySku("SKU-CAT-TOY-05"), quantity: 1)
guestCart: ShoppingCart = GuestCheckout.current().shoppingCart
guestCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 2)
session: CustomerSession = CustomerAccount.logIn(account, guestCart: guestCart)
// Customer Session.merge guest shopping cart on login → Shopping Cart, Guest Checkout
merged: ShoppingCart = session.authenticatedCustomerAccount.shoppingCart
assert merged.quantityFor("SKU-DOG-FOOD-01") == 2
assert merged.quantityFor("SKU-CAT-TOY-05") == 1
return merged
```

#### Walk 5 — Covers: merge sums quantities when both carts contain same product

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
account.shoppingCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 1)
guestCart: ShoppingCart = GuestCheckout.current().shoppingCart
guestCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 2)
CustomerSession.mergeGuestShoppingCartOnLogin(account, guestCart)
// invariant: duplicate product entries sum quantities
assert account.shoppingCart.quantityFor("SKU-DOG-FOOD-01") == 3
return account.shoppingCart
```

### **Log Out — single device and log out everywhere**

**Purpose:** Validate *log out* invalidates current session only vs *invalidate all sessions* across devices.
**Concepts traced:** Customer Account, Customer Session

#### Walk 1 — Covers: logout invalidates current customer session only

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
mobile: CustomerSession = CustomerSession.active(account, device: "mobile phone")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
CustomerAccount.logOut(account, session: mobile)
// Customer Account.log out → Customer Session.invalidate on logout
assert mobile.isValid == false
assert laptop.isValid == true
// Customer Session.allow concurrent sessions — other device unaffected
return laptop
```

#### Walk 2 — Covers: log out everywhere invalidates all customer sessions

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
mobile: CustomerSession = CustomerSession.active(account, device: "mobile phone")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
CustomerSession.invalidateAllSessions(account)
// Customer Session.invalidate all sessions → Customer Account
assert mobile.isValid == false
assert laptop.isValid == false
return account
```

### **Reset Password — ambiguous confirmation, valid link, session invalidation, expired/used links**

**Purpose:** Validate *reset password* without account-enumeration leak, password update, session invalidation, and expired/used reset links.
**Concepts traced:** Customer Account, Customer Session, Verification Link, Email Verification, Notification

#### Walk 1 — Covers: reset request shows same confirmation regardless of account existence

```
// known account — reset link sent
resultKnown: ResetRequestResult = CustomerAccount.resetPassword(
    emailAddress: "jane.doe@example.com"
)
assert resultKnown.confirmationMessage == "check your email"
assert resultKnown.resetLinkSent == true
// unknown email — same confirmation, no link sent
resultUnknown: ResetRequestResult = CustomerAccount.resetPassword(
    emailAddress: "unknown@example.com"
)
assert resultUnknown.confirmationMessage == "check your email"
assert resultUnknown.resetLinkSent == false
return resultKnown
```

#### Walk 2 — Covers: valid reset link opens set-new-password form

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
link: VerificationLink = account.passwordResetVerificationLink
assert link.expiryTime > now()
assert link.oneTimeUseFlag == false  // not yet consumed
// Customer Account.reset password — valid link enables set-new-password entry (presentation gate; no password change until submit)
return link
```

#### Walk 3 — Covers: password update invalidates all customer sessions

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
mobile: CustomerSession = CustomerSession.active(account, device: "mobile phone")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
CustomerAccount.resetPassword(account, newPassword: "NewStr0ngP@ss!")
// invariant: password reset invalidates all customer sessions on all devices
assert mobile.isValid == false
assert laptop.isValid == false
return account
```

#### Walk 4 — Covers: expired reset link rejected

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
link: VerificationLink = account.passwordResetVerificationLink
assert link.expiryTime < now()
// Verification Link.offer resend when expired → Email Verification
result: ResetPasswordResult = CustomerAccount.resetPassword(account, verificationLink: link)
assert result.passwordUpdated == false
assert result.message == "link expired"
assert result.offeredAction == "Request new reset"
// invariant: customer account password remains unchanged
return result
```

#### Walk 5 — Covers: used reset link rejected

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
link: VerificationLink = account.passwordResetVerificationLink
assert link.oneTimeUseFlag == true  // spec Scenario Outline 2: link_status *used*
// Customer Account.reset password — invariant: password unchanged when link already consumed
result: ResetPasswordResult = CustomerAccount.resetPassword(account, verificationLink: link)
assert result.passwordUpdated == false
assert result.message == "link already used"
assert result.offeredAction == "Request new reset"
// invariant: customer account password remains unchanged
return result
```

### **Maintain Session Across Devices — concurrent sessions, expiry preserves cart, password reset cascade**

**Purpose:** Validate *allow concurrent sessions*, session expiry redirect with cart retention, and password-reset session invalidation across devices.
**Concepts traced:** Customer Session, Customer Account, Shopping Cart, Customer Account

#### Walk 1 — Covers: login on new device creates additional customer session

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
tablet: CustomerSession = CustomerAccount.logIn(account, device: "tablet")
// Customer Session.allow concurrent sessions
assert laptop.isValid == true
assert tablet.isValid == true
return tablet
```

#### Walk 2 — Covers: session expiry redirects to login but preserves shopping cart

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
cart: ShoppingCart = account.shoppingCart
assert cart.cartItems.count == 3
session: CustomerSession = CustomerSession.active(account)
session.sessionToken = expiredToken  // inactivity timeout or max duration
// Customer Session.session token + inactivity timeout — expired token invalidates authenticated request
assert session.sessionToken.isValid == false
// GAP: presentation middleware redirects to login on protected request — no Customer Session.evaluate() CRC operation
// invariant: shopping cart tied to customer account retains all entries
assert account.shoppingCart.cartItems.count == 3
return cart
```

#### Walk 3 — Covers: password reset invalidates all customer sessions

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
tablet: CustomerSession = CustomerSession.active(account, device: "tablet")
CustomerAccount.resetPassword(account, newPassword: "NewStr0ngP@ss!")
assert laptop.isValid == false
assert tablet.isValid == false
return account
```

### **Save Delivery Address — checkout save, first-default, additional entry**

**Purpose:** Validate *accept new entry from checkout* on *address book*, first-address default rule, and non-destructive additional saves.
**Concepts traced:** Address Book, Saved Address, Shipping Address, Customer Account

#### Walk 1 — Covers: checkout offers save address option for logged-in customer

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
shipping: ShippingAddress = ShippingAddress.collect(
    addressLineOne: "42 Oak Lane",
    city: "Bristol",
    postcode: "BS1 4QT",
    country: "United Kingdom"
)
saved: SavedAddress = AddressBook.acceptNewEntryFromCheckout(
    account.addressBook,
    shipping: shipping,
    saveOptIn: true
)
// Address Book.accept new entry from checkout → Saved Address, Shipping Address
assert saved.addressLineOne == "42 Oak Lane"
assert saved.city == "Bristol"
assert saved.postcode == "BS1 4QT"
return saved
```

#### Walk 2 — Covers: first saved address becomes default address automatically

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.addressBook.savedAddresses.isEmpty()
saved: SavedAddress = AddressBook.acceptNewEntryFromCheckout(
    account.addressBook,
    shipping: ShippingAddress.at("42 Oak Lane", "Bristol", "BS1 4QT")
)
// Address Book.default address designation → Saved Address
// invariant: first saved address becomes default automatically
assert saved.defaultShippingFlag == true
return saved
```

#### Walk 3 — Covers: additional saved address does not replace existing entries

```
book: AddressBook = account.addressBook  // Home at 42 Oak Lane, default true
newEntry: SavedAddress = AddressBook.acceptNewEntryFromAccountSettings(
    book,
    addressLineOne: "10 High Street",
    city: "London",
    postcode: "E1 6AN"
)
assert book.savedAddresses.count == 2
assert newEntry.defaultShippingFlag == false
// invariant: existing Home entry unchanged
assert book.savedAddress("Home").defaultShippingFlag == true
return book
```

### **Manage Saved Addresses — list, edit, delete default, set new default**

**Purpose:** Validate *manage from account settings* CRUD, default demotion on reassignment, and delete-default prompt.
**Concepts traced:** Address Book, Saved Address, Customer Account

#### Walk 1 — Covers: address book lists all saved addresses with default indicated

```
book: AddressBook = CustomerAccount.byEmail("jane.doe@example.com").addressBook
entries: SavedAddress[] = book.savedAddresses
assert entries.count == 2
defaultAddr: SavedAddress = book.defaultAddress
assert defaultAddr.addressLabel == "Home"
assert defaultAddr.addressLineOne == "42 Oak Lane"
return book
```

#### Walk 2 — Covers: edited saved address persists for future checkouts

```
saved: SavedAddress = SavedAddress.byLabel("Home")
saved.city = "Bath"
SavedAddress.manageFromAccountSettings(saved)
// invariant: historical orders retain snapshot — edit affects future checkouts only
assert saved.city == "Bath"
return saved
```

#### Walk 3 — Covers: deleting default saved address prompts new default selection

```
book: AddressBook = account.addressBook
home: SavedAddress = book.savedAddress("Home")  // default
work: SavedAddress = book.savedAddress("Work")
SavedAddress.manageFromAccountSettings(home, action: delete)
// Address Book invariant: deleting default requires selecting new default when others remain
assert book.promptsNewDefaultSelection == true
assert book.offeredDefault == work
return book
```

#### Walk 4 — Covers: setting new default address demotes previous default

```
home: SavedAddress = book.savedAddress("Home")  // defaultShippingFlag true
work: SavedAddress = book.savedAddress("Work")  // defaultShippingFlag false
AddressBook.defaultAddressDesignation(book, newDefault: work)
assert work.defaultShippingFlag == true
assert home.defaultShippingFlag == false
// Saved Address.selectable at checkout — future checkouts pre-select Work
return work
```

### **Select Saved Address at Checkout — pre-select, auto-fill, different address, guest manual only**

**Purpose:** Validate *pre-fill from saved address*, checkout selection, manual override with save opt-in, and guest-checkout coexistence without address book.
**Concepts traced:** Shipping Address, Saved Address, Address Book, Guest Checkout, Customer Account

#### Walk 1 — Covers: saved addresses shown with default pre-selected at shipping step

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
book: AddressBook = account.addressBook
options: SavedAddress[] = book.savedAddresses
assert options.contains(label: "Home", defaultShippingFlag: true)
// Shipping Address.pre-fill from saved address → Saved Address, Address Book
preSelected: SavedAddress = book.defaultAddress
assert preSelected.addressLabel == "Home"
return preSelected
```

#### Walk 2 — Covers: selecting saved address auto-fills shipping fields and advances checkout

```
work: SavedAddress = book.savedAddress("Work")
shipping: ShippingAddress = ShippingAddress.preFillFromSavedAddress(work, book)
// Billing Address.select from saved address — shipping step uses Saved Address collaborator
assert shipping.addressLineOne == "10 High Street"
assert shipping.city == "London"
assert shipping.postcode == "E1 6AN"
// Shipping Address.copy to confirmed order — required fields complete advances checkout
assert shipping.requiredFieldsComplete == true
return shipping
```

#### Walk 3 — Covers: use different address reveals manual entry and save option

```
shipping: ShippingAddress = ShippingAddress.manualEntry()
// Shipping Address.save to address book on opt-in — available when logged in
assert shipping.saveToAddressBookOptInAvailable == true
return shipping
```

#### Walk 4 — Covers: guest checkout shows manual address entry only

```
guest: GuestCheckout = GuestCheckout.current()
assert guest.isLoggedIn == false
// invariant: guest checkout remains available alongside logged-in checkout
shipping: ShippingAddress = guest.collectShippingAddress()
assert guest.addressBookSelectionShown == false
assert guest.showsLoginPrompt == true  // dismissible
// invariant: guest details must not persist beyond transaction
return shipping
```

### **Manage Wishlist — add, display stock, add-to-cart retention, remove, guest prompt**

**Purpose:** Validate *require verified customer account*, catalog-linked display, *add to shopping cart* without removal, and guest login prompt.
**Concepts traced:** Wishlist, Wishlist Item, Customer Account, Email Verification, Product, Stock Availability, Shopping Cart

#### Walk 1 — Covers: add to wishlist from product details page

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "verified"
wishlist: Wishlist = account.wishlist
product: Product = Product.bySku("SKU-DOG-FOOD-01")
item: WishlistItem = WishlistItem(
    parentWishlist: wishlist,
    referencedProduct: product
)
// Wishlist.wishlist items — Wishlist Item references product on parent wishlist
wishlist.wishlistItems.append(item)
// Wishlist.require verified customer account → Email Verification, Customer Session
assert wishlist.contains("SKU-DOG-FOOD-01")
return item
```

#### Walk 2 — Covers: wishlist shows product details and stock availability

```
wishlist: Wishlist = account.wishlist
for each item in wishlist.wishlistItems:
    product: Product = item.referencedProduct
    stock: StockAvailability = item.currentStockAvailabilityAtDisplay()
    // Wishlist.link to catalog for price and stock → Product, Stock Availability
    assert item.currentCatalogPriceAtDisplay == product.price
    assert stock.availableToSellQuantity >= 0
return wishlist
```

#### Walk 3 — Covers: add to cart from wishlist leaves item on wishlist

```
item: WishlistItem = wishlist.itemFor("SKU-DOG-FOOD-01")
item.addToShoppingCart(account.shoppingCart)
// invariant: adding to cart does not remove item from wishlist
assert wishlist.contains("SKU-DOG-FOOD-01")
assert account.shoppingCart.contains("SKU-DOG-FOOD-01")
return account.shoppingCart
```

#### Walk 4 — Covers: remove wishlist item resets product page control

```
item: WishlistItem = wishlist.wishlistItems.find("SKU-DOG-FOOD-01")
wishlist.wishlistItems.remove(item)
// Wishlist.wishlist items collection — no explicit CRC remove operation; see decisions made
assert wishlist.contains("SKU-DOG-FOOD-01") == false
return wishlist
```

#### Walk 5 — Covers: guest add to wishlist shows dismissible login prompt

```
guest: GuestCheckout = GuestCheckout.current()
product: Product = Product.bySku("SKU-DOG-FOOD-01")
// Wishlist.require verified customer account → Email Verification, Customer Session
gate: FeatureGate = EmailVerification.blockAccountOnlyFeatures(
    targetAccount: null,
    session: null,
    feature: "wishlist"
)
assert gate.prompt == "log in or register"
assert gate.dismissible == true
assert gate.productAdded == false
return gate
```

### references

**Ref — Register Account**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Register Account / Scenario 2
Extract: partial

```source
Given no **Customer Account** exists for **email address** *jane.doe@example.com*
When the customer submits **email address** *jane.doe@example.com* and password *Str0ngP@ss!* with matching confirmation
Then a **Customer Account** is created for *Jane Doe* with **account verification status** *unverified*
And the system triggers **Email Verification** to *jane.doe@example.com*
```

**Ref — Guest checkout coexistence**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Select Saved Address at Checkout / Scenario 4
Extract: partial

```source
Given a guest customer with a **Shopping Cart** is not logged in
When the guest reaches the shipping step during **Guest Checkout**
Then no **Address Book** selection is shown — only manual **Shipping Address** entry
And **Guest Checkout** proceeds without requiring a **Customer Account**
```

### decisions made

- Registration password-requirement validation is modeled on *Customer Account.register via email and password* — presentation shows rules; domain rejects before persist.
- Duplicate-email error messaging is a registration concern — CRC invariant on unique *email address* drives rejection without *account verification status* leak.
- *Registration form* and confirmation screens are presentation surfaces — walks enter through CRC operations only; `RegistrationForm.open()` is presentation setup with no domain mutation.
- Field-level login/registration UI copy (*check your email*, *invalid email or password*, *already verified*, *link expired*) documented as walk outcomes from CRC invariants; CRC does not define message-delivery operations on *Verification Link* click — resend and transition paths use *Email Verification* responsibilities.
- Password-reset link click before password submit is a presentation gate — *Customer Account.reset password* owns password update and session invalidation; expired/used link rejection uses *Verification Link* one-time-use and expiry invariants plus *Customer Account.reset password* with no password change. `passwordResetVerificationLink` is walk shorthand for reset *Verification Link* issued by *Customer Account.reset password* email request.
- Session expiry redirect to login is presentation middleware — no CRC session-evaluation operation; *Customer Session* `session token` and `inactivity timeout` properties determine validity; cart retention is on *Customer Account* / *Shopping Cart* (GAP recorded in Maintain Session Walk 2).
- Guest wishlist prompt is outcome of *Email Verification.block account-only features* collaborating with *Wishlist.require verified customer account*.
- Wishlist item add/remove is collection management on *Wishlist.wishlist items* via *Wishlist Item* state-carrier — no explicit CRC add/remove operation names; walks compose *Wishlist Item* with *referenced product* and assert post-state.

---

## **Order**

Order history, reorder from prior purchases, and account-persistent shopping cart behavior.

### **View Order History — list, detail, empty state, retroactive guest association**

**Purpose:** Validate *order history* chronology, full detail with snapshots, empty state, and *retroactively associate guest orders*.
**Concepts traced:** Order History, Order, Customer Account, Guest Checkout, Order Line Item, Tracking Number, Payment, Saved Payment Method

#### Walk 1 — Covers: order history lists orders most recent first

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
history: OrderHistory = account.orderHistory
// Order History.associated orders — most recent first
orders: Order[] = history.associatedOrders
assert orders[0].orderNumber == "ORD-1002"
assert orders[1].orderNumber == "ORD-1001"
// Order History.display order summary per row → Order
return history
```

#### Walk 2 — Covers: order detail shows full snapshot including tracking

```
order: Order = Order.byNumber("ORD-1002")
detail: OrderDetail = OrderHistory.openFullOrderDetail(history, order)
// Order History.open full order detail → Order, Order Line Item, Delivery Option, Payment, Tracking Number
assert detail.orderLineItems.count >= 1
assert detail.trackingNumber.carrierReference == "RM-1Z999AA10123456784"
assert detail.maskedPaymentMethod.lastFourDigits == "4242"
return detail
```

#### Walk 3 — Covers: empty order history shows start shopping prompt

```
account: CustomerAccount = CustomerAccount.byEmail("new.customer@example.com")
history: OrderHistory = account.orderHistory
assert history.associatedOrders.isEmpty()
assert history.emptyStatePrompt == "start shopping"
return history
```

#### Walk 4 — Covers: guest order retroactively associated when email matches new account

```
guestOrder: Order = Order.byNumber("ORD-0999")  // guest checkout, sarah.jones@example.com
account: CustomerAccount = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "sarah.jones@example.com",
    password: "Str0ngP@ss!"
)
// Customer Account.retroactively associate guest orders → Order, Guest Checkout
CustomerAccount.retroactivelyAssociateGuestOrders(account)
assert account.orderHistory.contains("ORD-0999")
return account.orderHistory
```

### **Reorder Previous Purchase — full reorder, delisted skip, out-of-stock warning, cart merge**

**Purpose:** Validate *reorder* from *order history*, delisted skip with partial success, out-of-stock warning, and quantity merge into existing cart.
**Concepts traced:** Reorder, Order History, Order, Order Line Item, Product, Stock Availability, Shopping Cart, Cart Item

#### Walk 1 — Covers: reorder adds all order line items to shopping cart

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
history: OrderHistory = account.orderHistory
source: Order = Order.byNumber("ORD-1001")
reorder: Reorder = OrderHistory.provideEntryPointForReorder(history, source)
cart: ShoppingCart = account.shoppingCart
Reorder.addProductsWithOriginalQuantities(reorder, source.orderLineItems, targetCart: cart)
// Reorder.add products with original quantities → Order Line Item, Product
assert cart.quantityFor("SKU-DOG-FOOD-01") == 2
assert cart.quantityFor("SKU-LEASH-03") == 1
// Reorder.navigate to shopping cart for review → Shopping Cart
return cart
```

#### Walk 2 — Covers: reorder skips delisted product with partial success

```
source: Order = Order.byNumber("ORD-1001")  // includes SKU-DISCONTINUED
reorder: Reorder = OrderHistory.provideEntryPointForReorder(account.orderHistory, source)
cart: ShoppingCart = account.shoppingCart
Reorder.addProductsWithOriginalQuantities(reorder, source.orderLineItems, targetCart: cart)
// Reorder.skip delisted products → Product
assert reorder.skipped.contains(sku: "SKU-DISCONTINUED", reason: "product delisted")
assert reorder.partialSuccess == true
assert cart.containsAvailableItems == true
return cart
```

#### Walk 3 — Covers: reorder adds out-of-stock product with warning and options

```
line: OrderLineItem = source.lineItemFor("SKU-LEASH-03")
stock: StockAvailability = StockAvailability.forProduct("SKU-LEASH-03")
assert stock.availableToSellQuantity == 0
cartItem: CartItem = Reorder.warnOnOutOfStockProducts(line, cart: account.shoppingCart)
// Reorder.warn on out of stock products → Stock Availability, Cart Item
assert cartItem.stockWarning.isPresent()
assert cartItem.options == ["proceed anyway", "remove"]
return cartItem
```

#### Walk 4 — Covers: reorder merges quantities into existing shopping cart

```
account.shoppingCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 1)
source: Order = Order.byNumber("ORD-1001")
reorder: Reorder = OrderHistory.provideEntryPointForReorder(account.orderHistory, source)
Reorder.addProductsWithOriginalQuantities(reorder, source.orderLineItems, targetCart: account.shoppingCart)
// Reorder.merge duplicate cart items → Cart Item — sums quantities
assert account.shoppingCart.quantityFor("SKU-DOG-FOOD-01") == 3
return account.shoppingCart
```

### references

**Ref — View Order History**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story View Order History / Scenario 4
Extract: partial

```source
Given a **Guest Checkout** **Order** *ORD-0999* was placed with **Guest Email** *sarah.jones@example.com*
When a **Customer Account** is created with **email address** *sarah.jones@example.com*
Then **Order** *ORD-0999* is retroactively associated with that **Customer Account**
And **Order** *ORD-0999* appears in **Order History**
```

**Ref — Reorder partial success**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Reorder Previous Purchase / Scenario 2
Extract: partial

```source
When the customer selects *Reorder* on **Order** *ORD-1001*
Then available **Product** entries are added to the **Shopping Cart**
And a clear message lists *SKU-DISCONTINUED* as unavailable because *product delisted*
And partial **Reorder** succeeds — available items are not blocked
```

### decisions made

- *Order history* page and *start shopping* empty state are presentation — CRC *Order History* owns associated-order list and retroactive inclusion invariant.
- Masked payment display on order detail delegates to *Saved Payment Method* display metadata — walk references *Payment* collaborator on detail open.
- Reorder *proceed anyway* / *remove* choices are cart-item presentation — domain adds item with *Stock Availability* warning via *Reorder.warn on out of stock products*.
- Reorder partial-success skip list (`reorder.skipped`) is walk outcome shorthand for *Reorder.skip delisted products* invariant messaging.

---

## **Payment**

Saved payment method lifecycle and StripeWave-only checkout selection for returning customers.

### **Save Payment Method — checkout save via token, display metadata, second method retains default**

**Purpose:** Validate *save during checkout on opt-in*, vendor-token storage without raw card numbers, and default retention when adding second method.
**Concepts traced:** Saved Payment Method, Payment Vendor, StripeWave, Customer Account, Payment

#### Walk 1 — Covers: checkout offers save payment method via StripeWave token

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
token: VendorToken = StripeWave.tokenize(cardDetailsEnteredAtCheckout)
saved: SavedPaymentMethod = SavedPaymentMethod.saveDuringCheckoutOnOptIn(
    account,
    vendor: StripeWave,
    tokenReference: "tok_sw_4242"
)
// Payment Vendor.tokenize for saved payment method → Saved Payment Method, Customer Account
// invariant: raw card numbers never persist on customer account
assert saved.vendorTokenReference == "tok_sw_4242"
assert account.rawCardNumbersStored == false
return saved
```

#### Walk 2 — Covers: saved payment method stores display metadata only

```
saved: SavedPaymentMethod = account.savedPaymentMethods.last()
assert saved.lastFourDigits == "4242"
assert saved.cardBrand == "Visa"
assert saved.expiryMonth == 12
assert saved.expiryYear == 2027
// future Payment uses vendor-token reference — Saved Payment Method.selectable at checkout
return saved
```

#### Walk 3 — Covers: second saved payment method retains first as default

```
first: SavedPaymentMethod = account.savedPaymentMethod(ending: "4242")  // default
second: SavedPaymentMethod = SavedPaymentMethod.saveDuringCheckoutOnOptIn(
    account, vendor: StripeWave, tokenReference: "tok_sw_5555", lastFour: "5555"
)
assert account.savedPaymentMethods.count == 2
// invariant: first saved method remains default unless customer changes in settings
assert first.defaultPaymentMethodFlag == true
assert second.defaultPaymentMethodFlag == false
return account.savedPaymentMethods
```

### **Manage Saved Payment Methods — list, remove default, set new default**

**Purpose:** Validate saved-method listing, default removal prompt, and default demotion on reassignment.
**Concepts traced:** Saved Payment Method, Customer Account, Payment Vendor

#### Walk 1 — Covers: saved payment methods listed with default indicated

```
methods: SavedPaymentMethod[] = account.savedPaymentMethods
assert methods.count == 2
defaultMethod: SavedPaymentMethod = methods.find(defaultPaymentMethodFlag: true)
assert defaultMethod.lastFourDigits == "4242"
return methods
```

#### Walk 2 — Covers: removing default payment method prompts new default

```
default4242: SavedPaymentMethod = account.savedPaymentMethod(ending: "4242")
alt5555: SavedPaymentMethod = account.savedPaymentMethod(ending: "5555")
SavedPaymentMethod.addAndSoftDelete(default4242, action: remove)
// Saved Payment Method.add and soft-delete — vendor-token reference deleted
assert account.savedPaymentMethods.contains(ending: "4242") == false
assert account.promptsNewDefaultPaymentMethod == true
assert account.offeredDefault == alt5555
return account
```

#### Walk 3 — Covers: setting new default payment method demotes previous default

```
method4242: SavedPaymentMethod = account.savedPaymentMethod(ending: "4242")  // default true
method5555: SavedPaymentMethod = account.savedPaymentMethod(ending: "5555")  // default false
method5555.defaultPaymentMethodFlag = true
method4242.defaultPaymentMethodFlag = false
// Saved Payment Method.default payment method flag — customer changes default in account settings
// future checkouts pre-select method5555 via Saved Payment Method.selectable at checkout
return method5555
```

### **Select Saved Payment Method at Checkout — pre-select, token charge, manual entry, expired token**

**Purpose:** Validate *selectable at checkout*, *StripeWave* token charge, manual override with save opt-in, and expired-token marking without silent charge.
**Concepts traced:** Saved Payment Method, Payment, StripeWave, Customer Account, Order

#### Walk 1 — Covers: saved payment methods shown with default pre-selected

```
methods: SavedPaymentMethod[] = account.savedPaymentMethods
preSelected: SavedPaymentMethod = methods.find(defaultPaymentMethodFlag: true)  // ending 4242
// Saved Payment Method.selectable at checkout → Order, Payment
assert preSelected.defaultPaymentMethodFlag == true
return preSelected
```

#### Walk 2 — Covers: selecting saved payment method charges via vendor token

```
method: SavedPaymentMethod = account.savedPaymentMethod(token: "tok_sw_4242")
payment: Payment = Payment.initiateAuthorizeCaptureSettle(
    order: Order.pending(),
    vendor: StripeWave,
    savedPaymentMethod: method
)
// Payment.initiate authorize-capture-settle → StripeWave, Saved Payment Method
// StripeWave.receive card details or saved token
assert payment.processingVendor is StripeWave
assert payment.paymentMethodUsed == method
return payment
```

#### Walk 3 — Covers: use different payment method reveals manual entry and save option

```
// manual StripeWave entry at checkout with save opt-in
token: VendorToken = StripeWave.tokenize(newCardDetails)
SavedPaymentMethod.saveDuringCheckoutOnOptIn(account, vendor: StripeWave, token)
return token
```

#### Walk 4 — Covers: expired vendor token marked and not silently charged

```
expired: SavedPaymentMethod = account.savedPaymentMethod(token: "tok_sw_expired")
assert expired.expiryYear == 2024
assert expired.isExpired() == true
// Saved Payment Method.invariant: vendor token must remain valid or be marked expired
// Saved Payment Method.selectable at checkout → Order, Payment — expired method shown but not chargeable
assert expired.markedExpired == true
// Payment.initiate authorize-capture-settle → StripeWave, Saved Payment Method — must not charge expired token
chargeResult: PaymentResult = Payment.initiateAuthorizeCaptureSettle(
    order: Order.pending(),
    vendor: StripeWave,
    savedPaymentMethod: expired
)
assert chargeResult.chargeAttempted == false
return expired
```

### references

**Ref — Save Payment Method**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Save Payment Method / Scenario 1
Extract: partial

```source
Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* completes **Payment** through **StripeWave**
When the customer accepts *save this payment method for future orders*
Then a **Saved Payment Method** is created with **vendor-token reference** *tok_sw_4242*
And raw card numbers are not stored on the **Customer Account**
```

**Ref — Expired token at checkout**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Select Saved Payment Method at Checkout / Scenario 4
Extract: partial

```source
Then that **Saved Payment Method** is marked *expired*
And remaining valid **Saved Payment Method** entries and manual card entry are displayed as alternatives
And the expired token is not used for a **Payment** charge attempt
```

### decisions made

- *StripeWave* is sole active *payment vendor* in Increment 4 — walks never invoke PayNova or VaultPay collaborators.
- Expired-token checkout uses *Saved Payment Method.selectable at checkout* and *Payment.initiate authorize-capture-settle* — **GAP:** checkout UI marks expired methods visually; domain invariant prevents charge on expired vendor token while valid methods and manual entry remain available.
- *Payment* retry with alternate saved method deferred to payment-failure stories (Increment 2/3) — not re-walked here unless selected at checkout.
- Default payment method reassignment uses *Saved Payment Method.default payment method flag* property — no separate CRC operation name beyond account-settings management via *Saved Payment Method.add and soft-delete* collaborator path.

---

## **Notification**

Transactional verification email delivery tied to account registration (cross-cuts Customer Account stories).

### **Send Email Verification — notification channel and retry queue**

**Purpose:** Confirm *Notification* ownership of verification email dispatch and retry queue separate from Customer Account registration persist.
**Concepts traced:** Notification, Email Verification, Confirmation Email (verification path), Customer Account

#### Walk 1 — Covers: verification notification deliver transactional message

```
verification: EmailVerification = CustomerAccount.byEmail("jane.doe@example.com").emailVerification
notification: Notification = Notification.deliverTransactionalMessage(
    trigger: verification,
    recipient: verification.targetCustomerAccount,
    channel: "email"
)
// Notification.deliver transactional message → Email Verification
assert notification.deliveryStatus in ["sent", "queued"]
return notification
```

#### Walk 2 — Covers: queued verification survives delivery failure

```
notification.deliveryStatus = "queued"
Notification.queueFailedDeliveryForRetry(notification)
// invariant: must not block account registration confirmation
assert verification.targetCustomerAccount.registrationConfirmed == true
return notification
```

### references

**Ref — Email delivery retry**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Send Email Verification / Scenario 3
Extract: partial

```source
Then the **Notification** is queued with **delivery status** *queued* for retry
And the registration confirmation screen tells the customer *expect the email shortly*
```

### decisions made

- Verification email is transactional — *Notification.check communication preferences* not applied (marketing deferred Increment 4).
- *Confirmation Email* CRC block targets order confirmation — verification uses generic *Notification* with *Email Verification* trigger per Increment 4 CRC refresh.

---

# Boundary Domain

No Increment 4 boundary walks — account settings and checkout presentation surfaces delegate to core-domain collaborators documented above. *Admin dashboard*, *communication preferences* UI, and *customer pet* CRUD remain deferred.

### decisions made

- Account settings UI (*Address Book*, saved payment methods list) is presentation composing *Address Book* and *Saved Payment Method* — no separate boundary CRC block.
- Deferred scope explicitly omitted from walks: PayNova, VaultPay, *return*, express/same-day delivery, *customer pet* CRUD, *communication preferences* management UI.

# Impact map — ASCII wall sketch (PawPlace)

> **Companion diagram:** `impact-map.drawio` (four-column wall with node connectors). Author or update **this file first**, then run `scripts/render_impact_map_drawio.py` to refresh the canvas.
```text
OBJECTIVE (Why?) | PERSONA (Who?) | IMPACT (How?) | INITIATIVE (What?)
-----------------+----------------+---------------+--------------------
Grow PawPlace as a profitable omnichannel pet retail and adoption business | | |
Compound store value through incremental omnichannel capabilities stores can use on day one | | |
  # Online revenue per participating store grows year-over-year (economic) | | |
  # Foot traffic attributable to digital stock-check journeys rises in pilot stores (strategic) | | |
  # Adoption appointment-to-visit completion rate improves as the pet gallery goes live (strategic) | | |
NOTE: I1-I9 below = delivery increments from thin-slicing.md | | |
ASSUMPTION: Walk-in stock accuracy depends on front-line staff updating stock within the same business day; pet appointments deferred until commerce spine (I1-I4) is live | | |

| Walk-in shoppers (mobile, no account, first visit) | Finds nearest store and confirms a product is in stock before visiting |
| | | # Stock-check sessions that end with a store visit (pilot attribution)
| Walk-in shoppers (mobile, no account, first visit) | Finds nearest store and confirms a product is in stock before visiting | Store locator — map view
| Walk-in shoppers (mobile, no account, first visit) | Finds nearest store and confirms a product is in stock before visiting | Store locator — list view
| Walk-in shoppers (mobile, no account, first visit) | Finds nearest store and confirms a product is in stock before visiting | Location entry (postcode and share location)
| Walk-in shoppers (mobile, no account, first visit) | Browses the product catalog and opens product detail without abandoning the journey |
| | | # Product detail views per catalog session
| Walk-in shoppers (mobile, no account, first visit) | Browses the product catalog and opens product detail without abandoning the journey | Product catalog with category filter
| Walk-in shoppers (mobile, no account, first visit) | Browses the product catalog and opens product detail without abandoning the journey | Product detail page with image gallery and description
| Walk-in shoppers (mobile, no account, first visit) | Reads per-store stock availability on the product detail page |
| | | # Stock availability region viewed per product detail session
| Walk-in shoppers (mobile, no account, first visit) | Reads per-store stock availability on the product detail page | Real-time stock availability by store on product detail page
| Store employees (front-line, inventory and fulfillment) | Updates per-store stock levels so customer-facing availability stays accurate |
| | | # Median time from shelf change to digital stock update; target same business day
| Store employees (front-line, inventory and fulfillment) | Updates per-store stock levels so customer-facing availability stays accurate | Admin dashboard — stock levels form
| Store employees (front-line, inventory and fulfillment) | Prepares and hands off click-and-collect orders at the counter |
| | | # Click-and-collect pickup completion rate vs orders placed
| Store employees (front-line, inventory and fulfillment) | Prepares and hands off click-and-collect orders at the counter | Click-and-collect order preparation workflow
| Store employees (front-line, inventory and fulfillment) | Prepares and hands off click-and-collect orders at the counter | Click-and-collect ready notification (transactional)
| Store employees (front-line, inventory and fulfillment) | Processes and ships incoming online orders |
| | | # Order fulfillment cycle time from payment to ship notification
| Store employees (front-line, inventory and fulfillment) | Processes and ships incoming online orders | Incoming orders queue for store staff
| Store employees (front-line, inventory and fulfillment) | Processes and ships incoming online orders | Shipping notification with tracking number
| Guest online shoppers (click-and-collect, no account) | Completes purchase online and selects a pickup store without creating an account |
| | | # Guest click-and-collect checkout completion rate
| Guest online shoppers (click-and-collect, no account) | Completes purchase online and selects a pickup store without creating an account | Shopping cart (add, update, remove)
| Guest online shoppers (click-and-collect, no account) | Completes purchase online and selects a pickup store without creating an account | Guest checkout with click-and-collect store selection
| Guest online shoppers (click-and-collect, no account) | Completes purchase online and selects a pickup store without creating an account | StripeWave card payment
| Guest online shoppers (click-and-collect, no account) | Completes purchase online and selects a pickup store without creating an account | Order confirmation email
| Guest online shoppers (ship-to-home, standard delivery) | Completes a shipped order with a delivery address and standard delivery option |
| | | # Ship-to-home order completion rate among guest checkouts
| Guest online shoppers (ship-to-home, standard delivery) | Completes a shipped order with a delivery address and standard delivery option | Shipping address capture at checkout
| Guest online shoppers (ship-to-home, standard delivery) | Completes a shipped order with a delivery address and standard delivery option | Standard delivery option selection
| Guest online shoppers (ship-to-home, standard delivery) | Completes a shipped order with a delivery address and standard delivery option | Order status tracking for the customer
| Returning registered customers (repeat purchase) | Registers, verifies email, and maintains session across devices |
| | | # Registration-to-verified-email rate; cross-device login success rate
| Returning registered customers (repeat purchase) | Registers, verifies email, and maintains session across devices | Registration and email verification flow
| Returning registered customers (repeat purchase) | Registers, verifies email, and maintains session across devices | Login, logout, and password reset
| Returning registered customers (repeat purchase) | Registers, verifies email, and maintains session across devices | Cross-device session management
| Returning registered customers (repeat purchase) | Reorders from order history using saved addresses and payment methods |
| | | # Repeat purchase rate from registered customers; saved-entity use at checkout
| Returning registered customers (repeat purchase) | Reorders from order history using saved addresses and payment methods | Saved addresses and payment methods management
| Returning registered customers (repeat purchase) | Reorders from order history using saved addresses and payment methods | Order history and one-click reorder
| Returning registered customers (repeat purchase) | Reorders from order history using saved addresses and payment methods | Wishlist
| Price-sensitive and premium-basket online shoppers | Completes payment using a preferred wallet or buy-now-pay-later option |
| | | # Conversion lift on PayNova and VaultPay segments vs card-only baseline
| Price-sensitive and premium-basket online shoppers | Completes payment using a preferred wallet or buy-now-pay-later option | PayNova digital wallet payment
| Price-sensitive and premium-basket online shoppers | Completes payment using a preferred wallet or buy-now-pay-later option | VaultPay buy-now-pay-later payment
| Price-sensitive and premium-basket online shoppers | Completes payment using a preferred wallet or buy-now-pay-later option | Failed payment retry across all vendors
| Prospective pet owners (adoption visit, verified account) | Browses available pets and books an in-store visit at a chosen store |
| | | # Appointment booking completion rate among gallery browsers
| Prospective pet owners (adoption visit, verified account) | Browses available pets and books an in-store visit at a chosen store | Pet gallery browse by species with store location and distance
| Prospective pet owners (adoption visit, verified account) | Browses available pets and books an in-store visit at a chosen store | Appointment scheduling with account gate
| Prospective pet owners (adoption visit, verified account) | Browses available pets and books an in-store visit at a chosen store | Appointment reminder (transactional)
| Prospective pet owners (adoption visit, verified account) | Cancels or rebooks when a booked pet is adopted before the visit |
| | | # Rebook or cancel response rate after adoption notification
| Prospective pet owners (adoption visit, verified account) | Cancels or rebooks when a booked pet is adopted before the visit | Pet adopted before visit notification
| Prospective pet owners (adoption visit, verified account) | Cancels or rebooks when a booked pet is adopted before the visit | Cancel or rebook appointment flow
| Store employees (appointment and visit operations) | Checks in visitors and records visit outcomes including no-shows |
| | | # Visit outcome capture rate; no-show recording accuracy
| Store employees (appointment and visit operations) | Checks in visitors and records visit outcomes including no-shows | Incoming appointments view
| Store employees (appointment and visit operations) | Checks in visitors and records visit outcomes including no-shows | Customer check-in and visit outcome recording
| Store employees (appointment and visit operations) | Checks in visitors and records visit outcomes including no-shows | No-show recording and follow-up action assignment
| Store employees (appointment and visit operations) | Maintains accurate pet listings for the adoption gallery |
| | | # Pet profile freshness (available vs adopted status accuracy)
| Store employees (appointment and visit operations) | Maintains accurate pet listings for the adoption gallery | Pet profile update and adopted marking (staff)
| Customers resolving post-purchase issues | Initiates return online and tracks refund to the original payment method |
| | | # Return initiation rate; refund settlement time to original vendor
| Customers resolving post-purchase issues | Initiates return online and tracks refund to the original payment method | Return initiation from order history with label or QR code
| Customers resolving post-purchase issues | Initiates return online and tracks refund to the original payment method | Refund routing through original payment vendor
| Customers resolving post-purchase issues | Initiates return online and tracks refund to the original payment method | In-store return processing (staff)
| Engaged repeat visitors (reviews and marketing opt-in) | Submits product reviews with account-verified authorship |
| | | # Verified review submission rate per product detail views
| Engaged repeat visitors (reviews and marketing opt-in) | Submits product reviews with account-verified authorship | Written review with star rating (account-gated)
| Engaged repeat visitors (reviews and marketing opt-in) | Submits product reviews with account-verified authorship | Photo review submission
| Engaged repeat visitors (reviews and marketing opt-in) | Submits product reviews with account-verified authorship | Customer reviews on product detail page
| Engaged repeat visitors (reviews and marketing opt-in) | Opts into marketing categories they care about and acts on relevant nudges |
| | | # Marketing opt-in rate by category; click-through on promotional and restock emails
| Engaged repeat visitors (reviews and marketing opt-in) | Opts into marketing categories they care about and acts on relevant nudges | Notification and communication preference management
| Engaged repeat visitors (reviews and marketing opt-in) | Opts into marketing categories they care about and acts on relevant nudges | Promotional email and personalized recommendation sends
| Engaged repeat visitors (reviews and marketing opt-in) | Opts into marketing categories they care about and acts on relevant nudges | Restock alert and in-store event notifications
| Store owners (operational oversight) | Monitors inventory and order flow across the store |
| | | # Inventory dashboard usage frequency; stock exception resolution time
| Store owners (operational oversight) | Monitors inventory and order flow across the store | Inventory dashboard for store owners
| Catalog browsers (deep catalog, returning visitors) | Finds products via keyword search and multi-dimension filters |
| | | # Search-to-product-detail conversion rate
| Catalog browsers (deep catalog, returning visitors) | Finds products via keyword search and multi-dimension filters | Keyword product search
| Catalog browsers (deep catalog, returning visitors) | Finds products via keyword search and multi-dimension filters | Product filters (category, pet type, brand)
| Catalog browsers (deep catalog, returning visitors) | Finds products via keyword search and multi-dimension filters | Low stock badge on listings
| Catalog browsers (deep catalog, returning visitors) | Sets a preferred store and receives a tailored experience |
| | | # Preferred-store set rate among returning visitors; engagement lift on tailored surfaces
| Catalog browsers (deep catalog, returning visitors) | Sets a preferred store and receives a tailored experience | My store preference
| Catalog browsers (deep catalog, returning visitors) | Sets a preferred store and receives a tailored experience | Experience tailored to preferred store
| Catalog browsers (deep catalog, returning visitors) | Sets a preferred store and receives a tailored experience | Customer pet profiles for recommendations
```

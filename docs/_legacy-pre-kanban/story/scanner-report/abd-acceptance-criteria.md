# Scanner Report — abd-acceptance-criteria

**Workspace:** c:\dev\abd-pet-store-demo\docs\story
**Date:** 2026-05-26 07:03:43

---

## Scanner Execution Status

### 🟨 Overall Status: NEEDS ATTENTION

| Status | Count | Description |
|--------|-------|-------------|
| 🟩 Executed Successfully | 12 | Scanners ran without errors |
| 🟩 Clean Rules | 8 | No violations found |
| 🟨 Rules with Warnings | 3 | Found 272 warning violation(s) |
| 🟥 Rules with Errors | 1 | Found 21 error violation(s) |

**Total Rules:** 12
- **Rules with Scanners:** 12
  - 🟩 **Executed Successfully:** 12

---

### Scanner Results

| Status | Rule | Violations |
|--------|------|------------|
| 🟨 WARNINGS | Actor-Alternation | 217 |
| 🟨 WARNINGS | Emphasize-Domain-Terms | 49 |
| 🟥 ERRORS | Story-Sizing | 21 |
| 🟨 WARNINGS | Negative-Conditions | 6 |
| 🟩 CLEAN | Ac-Domain-Crossing | 0 |
| 🟩 CLEAN | Atomic-Ac | 0 |
| 🟩 CLEAN | Behavioral-Ac | 0 |
| 🟩 CLEAN | Channel-Specific-Language | 0 |
| 🟩 CLEAN | Domain-Terms-Source | 0 |
| 🟩 CLEAN | Enumerate-Ac-Permutations | 0 |
| 🟩 CLEAN | Reaction-Chaining | 0 |
| 🟩 CLEAN | Verb-Noun | 0 |

---

## Violations

### 🟨 Actor-Alternation — 217 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `epics[0].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Search Products by Keyword" AC #1 has 3 consecutive system steps without alternating | warning |
| 2 | `epics[0].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Search Products by Keyword" AC #2 has 3 consecutive system steps without alternating | warning |
| 3 | `epics[0].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Search Products by Keyword" AC #4 has 3 consecutive system steps without alternating | warning |
| 4 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Filter Products" AC #1 has 3 consecutive system steps without alternating | warning |
| 5 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Filter Products" AC #2 has 3 consecutive system steps without alternating | warning |
| 6 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Filter Products" AC #3 has 3 consecutive system steps without alternating | warning |
| 7 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[4]` | Story "Filter Products" AC #5 has 3 consecutive system steps without alternating | warning |
| 8 | `epics[0].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Display Real-Time Stock Availability" AC #1 has 3 consecutive system steps without alternating | warning |
| 9 | `epics[0].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Display Real-Time Stock Availability" AC #2 has 3 consecutive system steps without alternating | warning |
| 10 | `epics[0].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Display Real-Time Stock Availability" AC #3 has 3 consecutive system steps without alternating | warning |
| 11 | `epics[0].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "View Product Details" AC #1 has 3 consecutive system steps without alternating | warning |
| 12 | `epics[0].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[1]` | Story "View Product Details" AC #2 has 3 consecutive system steps without alternating | warning |
| 13 | `epics[0].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "View Product Details" AC #3 has 3 consecutive system steps without alternating | warning |
| 14 | `epics[0].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[3]` | Story "View Product Details" AC #4 has 3 consecutive system steps without alternating | warning |
| 15 | `epics[0].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Read Customer Reviews" AC #2 has 3 consecutive system steps without alternating | warning |
| 16 | `epics[0].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Read Customer Reviews" AC #3 has 3 consecutive system steps without alternating | warning |
| 17 | `epics[0].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Read Customer Reviews" AC #4 has 3 consecutive system steps without alternating | warning |
| 18 | `epics[0].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Submit Photo Review" AC #3 has 3 consecutive system steps without alternating | warning |
| 19 | `epics[1].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Browse Pets by Species" AC #1 has 3 consecutive system steps without alternating | warning |
| 20 | `epics[1].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Browse Pets by Species" AC #3 has 3 consecutive system steps without alternating | warning |
| 21 | `epics[1].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[1]` | Story "View Pet Profile" AC #2 has 3 consecutive system steps without alternating | warning |
| 22 | `epics[1].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "View Pet Profile" AC #3 has 3 consecutive system steps without alternating | warning |
| 23 | `epics[1].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[3]` | Story "View Pet Profile" AC #4 has 3 consecutive system steps without alternating | warning |
| 24 | `epics[1].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[2]` | Story "View Pet Store Location and Distance" AC #3 has 3 consecutive system steps without alternating | warning |
| 25 | `epics[1].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Update Pet Profile" AC #1 has 3 consecutive system steps without alternating | warning |
| 26 | `epics[1].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Update Pet Profile" AC #3 has 3 consecutive system steps without alternating | warning |
| 27 | `epics[1].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Update Pet Profile" AC #4 has 3 consecutive system steps without alternating | warning |
| 28 | `epics[1].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Mark Pet as Adopted" AC #1 has 3 consecutive system steps without alternating | warning |
| 29 | `epics[1].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Mark Pet as Adopted" AC #3 has 3 consecutive system steps without alternating | warning |
| 30 | `epics[2].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "View Available Time Slots at Store" AC #1 has 3 consecutive system steps without alternating | warning |
| 31 | `epics[2].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[1]` | Story "View Available Time Slots at Store" AC #2 has 3 consecutive system steps without alternating | warning |
| 32 | `epics[2].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "View Available Time Slots at Store" AC #3 has 3 consecutive system steps without alternating | warning |
| 33 | `epics[2].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Add Visit Note" AC #1 has 3 consecutive system steps without alternating | warning |
| 34 | `epics[2].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Add Visit Note" AC #2 has 3 consecutive system steps without alternating | warning |
| 35 | `epics[2].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Add Visit Note" AC #3 has 3 consecutive system steps without alternating | warning |
| 36 | `epics[2].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Confirm Appointment Booking" AC #2 has 3 consecutive user steps without alternating | warning |
| 37 | `epics[2].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Confirm Appointment Booking" AC #3 has 3 consecutive system steps without alternating | warning |
| 38 | `epics[2].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Confirm Appointment Booking" AC #4 has 3 consecutive system steps without alternating | warning |
| 39 | `epics[2].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "View Upcoming and Past Appointments" AC #1 has 3 consecutive system steps without alternating | warning |
| 40 | `epics[2].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "View Upcoming and Past Appointments" AC #3 has 3 consecutive system steps without alternating | warning |
| 41 | `epics[2].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Cancel or Rebook Appointment After Pet Adoption" AC #2 has 3 consecutive system steps without alternating | warning |
| 42 | `epics[2].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Cancel or Rebook Appointment After Pet Adoption" AC #3 has 3 consecutive system steps without alternating | warning |
| 43 | `epics[2].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Cancel or Rebook Appointment After Pet Adoption" AC #4 has 3 consecutive system steps without alternating | warning |
| 44 | `epics[2].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[1]` | Story "View Incoming Appointments" AC #2 has 3 consecutive system steps without alternating | warning |
| 45 | `epics[2].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[2]` | Story "View Incoming Appointments" AC #3 has 3 consecutive system steps without alternating | warning |
| 46 | `epics[2].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Check In Customer" AC #1 has 3 consecutive system steps without alternating | warning |
| 47 | `epics[2].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Check In Customer" AC #3 has 3 consecutive system steps without alternating | warning |
| 48 | `epics[2].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Check In Customer" AC #4 has 3 consecutive system steps without alternating | warning |
| 49 | `epics[2].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Record Visit Outcome" AC #1 has 3 consecutive system steps without alternating | warning |
| 50 | `epics[2].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Record Visit Outcome" AC #2 has 3 consecutive system steps without alternating | warning |
| 51 | `epics[2].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Record Visit Outcome" AC #3 has 3 consecutive system steps without alternating | warning |
| 52 | `epics[2].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Record Visit Outcome" AC #4 has 3 consecutive system steps without alternating | warning |
| 53 | `epics[2].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[4]` | Story "Record Visit Outcome" AC #5 has 3 consecutive system steps without alternating | warning |
| 54 | `epics[2].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Record No-Show" AC #1 has 3 consecutive system steps without alternating | warning |
| 55 | `epics[2].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Record No-Show" AC #2 has 3 consecutive system steps without alternating | warning |
| 56 | `epics[2].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[0]` | Story "Set Follow-Up Action" AC #1 has 3 consecutive system steps without alternating | warning |
| 57 | `epics[2].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Set Follow-Up Action" AC #2 has 3 consecutive system steps without alternating | warning |
| 58 | `epics[2].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Set Follow-Up Action" AC #3 has 3 consecutive system steps without alternating | warning |
| 59 | `epics[2].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Set Follow-Up Action" AC #4 has 3 consecutive system steps without alternating | warning |
| 60 | `epics[3].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "View Store Map" AC #1 has 3 consecutive system steps without alternating | warning |
| 61 | `epics[3].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "View Store Map" AC #3 has 3 consecutive system steps without alternating | warning |
| 62 | `epics[3].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[3]` | Story "View Store Map" AC #4 has 3 consecutive system steps without alternating | warning |
| 63 | `epics[3].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "View Store List" AC #1 has 3 consecutive system steps without alternating | warning |
| 64 | `epics[3].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "View Store List" AC #3 has 3 consecutive system steps without alternating | warning |
| 65 | `epics[3].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[3]` | Story "View Store List" AC #4 has 3 consecutive system steps without alternating | warning |
| 66 | `epics[3].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Filter Stores by Availability and Specialization" AC #4 has 3 consecutive system steps without alternating | warning |
| 67 | `epics[3].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Calculate Distance to Store" AC #2 has 3 consecutive system steps without alternating | warning |
| 68 | `epics[3].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Calculate Distance to Store" AC #3 has 3 consecutive system steps without alternating | warning |
| 69 | `epics[3].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Calculate Distance to Store" AC #4 has 3 consecutive system steps without alternating | warning |
| 70 | `epics[3].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Set My Store Preference" AC #1 has 3 consecutive system steps without alternating | warning |
| 71 | `epics[3].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Set My Store Preference" AC #2 has 3 consecutive system steps without alternating | warning |
| 72 | `epics[3].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Set My Store Preference" AC #3 has 3 consecutive system steps without alternating | warning |
| 73 | `epics[3].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Tailor Experience to Preferred Store" AC #1 has 3 consecutive system steps without alternating | warning |
| 74 | `epics[3].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Tailor Experience to Preferred Store" AC #2 has 3 consecutive system steps without alternating | warning |
| 75 | `epics[4].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Register Account" AC #3 has 3 consecutive system steps without alternating | warning |
| 76 | `epics[4].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Send Email Verification" AC #1 has 3 consecutive system steps without alternating | warning |
| 77 | `epics[4].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Send Email Verification" AC #2 has 3 consecutive system steps without alternating | warning |
| 78 | `epics[4].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Verify Email Address" AC #1 has 3 consecutive user steps without alternating | warning |
| 79 | `epics[4].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Verify Email Address" AC #2 has 3 consecutive system steps without alternating | warning |
| 80 | `epics[4].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[0]` | Story "Log In" AC #1 has 3 consecutive user steps without alternating | warning |
| 81 | `epics[4].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[0]` | Story "Log Out" AC #1 has 3 consecutive user steps without alternating | warning |
| 82 | `epics[4].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Log Out" AC #2 has 3 consecutive user steps without alternating | warning |
| 83 | `epics[4].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[1]` | Story "Reset Password" AC #2 has 3 consecutive system steps without alternating | warning |
| 84 | `epics[4].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[2]` | Story "Reset Password" AC #3 has 3 consecutive user steps without alternating | warning |
| 85 | `epics[4].sub_epics[0].story_groups[0].stories[6].acceptance_criteria[0]` | Story "Maintain Session Across Devices" AC #1 has 3 consecutive user steps without alternating | warning |
| 86 | `epics[4].sub_epics[0].story_groups[0].stories[6].acceptance_criteria[1]` | Story "Maintain Session Across Devices" AC #2 has 3 consecutive user steps without alternating | warning |
| 87 | `epics[4].sub_epics[0].story_groups[0].stories[6].acceptance_criteria[2]` | Story "Maintain Session Across Devices" AC #3 has 3 consecutive user steps without alternating | warning |
| 88 | `epics[4].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Save Delivery Address" AC #1 has 3 consecutive system steps without alternating | warning |
| 89 | `epics[4].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Save Delivery Address" AC #3 has 3 consecutive system steps without alternating | warning |
| 90 | `epics[4].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Manage Saved Addresses" AC #1 has 3 consecutive system steps without alternating | warning |
| 91 | `epics[4].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Manage Saved Addresses" AC #2 has 3 consecutive system steps without alternating | warning |
| 92 | `epics[4].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Manage Saved Addresses" AC #4 has 3 consecutive system steps without alternating | warning |
| 93 | `epics[4].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Save Payment Method" AC #1 has 3 consecutive system steps without alternating | warning |
| 94 | `epics[4].sub_epics[1].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Manage Saved Payment Methods" AC #3 has 3 consecutive system steps without alternating | warning |
| 95 | `epics[4].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Create Customer Pet" AC #2 has 3 consecutive system steps without alternating | warning |
| 96 | `epics[4].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[2]` | Story "Create Customer Pet" AC #3 has 3 consecutive system steps without alternating | warning |
| 97 | `epics[4].sub_epics[1].story_groups[0].stories[5].acceptance_criteria[1]` | Story "Update Customer Pet" AC #2 has 3 consecutive system steps without alternating | warning |
| 98 | `epics[4].sub_epics[1].story_groups[0].stories[5].acceptance_criteria[2]` | Story "Update Customer Pet" AC #3 has 3 consecutive system steps without alternating | warning |
| 99 | `epics[4].sub_epics[1].story_groups[0].stories[6].acceptance_criteria[0]` | Story "Set Communication Preferences" AC #1 has 3 consecutive system steps without alternating | warning |
| 100 | `epics[4].sub_epics[1].story_groups[0].stories[6].acceptance_criteria[1]` | Story "Set Communication Preferences" AC #2 has 3 consecutive system steps without alternating | warning |
| 101 | `epics[4].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Manage Wishlist" AC #3 has 3 consecutive system steps without alternating | warning |
| 102 | `epics[4].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Manage Wishlist" AC #4 has 3 consecutive system steps without alternating | warning |
| 103 | `epics[4].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Reorder Previous Purchase" AC #2 has 3 consecutive system steps without alternating | warning |
| 104 | `epics[4].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Reorder Previous Purchase" AC #3 has 3 consecutive system steps without alternating | warning |
| 105 | `epics[5].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Add Product to Cart" AC #1 has 3 consecutive system steps without alternating | warning |
| 106 | `epics[5].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Add Product to Cart" AC #2 has 3 consecutive system steps without alternating | warning |
| 107 | `epics[5].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Add Product to Cart" AC #3 has 3 consecutive system steps without alternating | warning |
| 108 | `epics[5].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Add Product to Cart" AC #4 has 3 consecutive system steps without alternating | warning |
| 109 | `epics[5].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[4]` | Story "Add Product to Cart" AC #5 has 3 consecutive system steps without alternating | warning |
| 110 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Update Cart Quantity" AC #1 has 3 consecutive system steps without alternating | warning |
| 111 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Update Cart Quantity" AC #2 has 3 consecutive system steps without alternating | warning |
| 112 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Update Cart Quantity" AC #3 has 3 consecutive system steps without alternating | warning |
| 113 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Update Cart Quantity" AC #4 has 3 consecutive system steps without alternating | warning |
| 114 | `epics[5].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Remove Product from Cart" AC #1 has 3 consecutive system steps without alternating | warning |
| 115 | `epics[5].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Remove Product from Cart" AC #2 has 3 consecutive system steps without alternating | warning |
| 116 | `epics[5].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Enter Shipping Address" AC #1 has 3 consecutive system steps without alternating | warning |
| 117 | `epics[5].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Enter Shipping Address" AC #3 has 3 consecutive system steps without alternating | warning |
| 118 | `epics[5].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Enter Shipping Address" AC #4 has 3 consecutive system steps without alternating | warning |
| 119 | `epics[5].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[4]` | Story "Enter Shipping Address" AC #5 has 3 consecutive system steps without alternating | warning |
| 120 | `epics[5].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Enter Billing Address" AC #2 has 3 consecutive system steps without alternating | warning |
| 121 | `epics[5].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Enter Billing Address" AC #3 has 3 consecutive system steps without alternating | warning |
| 122 | `epics[5].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Enter Billing Address" AC #4 has 3 consecutive system steps without alternating | warning |
| 123 | `epics[5].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Select Saved Address at Checkout" AC #1 has 3 consecutive system steps without alternating | warning |
| 124 | `epics[5].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Select Saved Address at Checkout" AC #2 has 3 consecutive system steps without alternating | warning |
| 125 | `epics[5].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Select Saved Address at Checkout" AC #3 has 3 consecutive system steps without alternating | warning |
| 126 | `epics[5].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Select Saved Address at Checkout" AC #4 has 3 consecutive system steps without alternating | warning |
| 127 | `epics[5].sub_epics[1].story_groups[0].stories[3].acceptance_criteria[0]` | Story "Select Delivery Option" AC #1 has 3 consecutive system steps without alternating | warning |
| 128 | `epics[5].sub_epics[1].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Select Delivery Option" AC #2 has 3 consecutive system steps without alternating | warning |
| 129 | `epics[5].sub_epics[1].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Select Delivery Option" AC #3 has 3 consecutive system steps without alternating | warning |
| 130 | `epics[5].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Select Click-and-Collect Store" AC #2 has 3 consecutive system steps without alternating | warning |
| 131 | `epics[5].sub_epics[1].story_groups[0].stories[5].acceptance_criteria[2]` | Story "Check Out as Guest" AC #3 has 3 consecutive system steps without alternating | warning |
| 132 | `epics[5].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Select Payment Method" AC #3 has 3 consecutive system steps without alternating | warning |
| 133 | `epics[5].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Select Saved Payment Method at Checkout" AC #2 has 3 consecutive system steps without alternating | warning |
| 134 | `epics[5].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Select Saved Payment Method at Checkout" AC #3 has 3 consecutive system steps without alternating | warning |
| 135 | `epics[5].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Select Saved Payment Method at Checkout" AC #4 has 3 consecutive system steps without alternating | warning |
| 136 | `epics[5].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Process Card Payment via StripeWave" AC #2 has 3 consecutive system steps without alternating | warning |
| 137 | `epics[5].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Process Card Payment via StripeWave" AC #3 has 3 consecutive system steps without alternating | warning |
| 138 | `epics[5].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Process Card Payment via StripeWave" AC #4 has 3 consecutive system steps without alternating | warning |
| 139 | `epics[5].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[4]` | Story "Process Card Payment via StripeWave" AC #5 has 3 consecutive system steps without alternating | warning |
| 140 | `epics[5].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Process Digital Wallet Payment via PayNova" AC #2 has 3 consecutive system steps without alternating | warning |
| 141 | `epics[5].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Process Digital Wallet Payment via PayNova" AC #3 has 3 consecutive system steps without alternating | warning |
| 142 | `epics[5].sub_epics[2].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Process Digital Wallet Payment via PayNova" AC #4 has 3 consecutive system steps without alternating | warning |
| 143 | `epics[5].sub_epics[2].story_groups[0].stories[4].acceptance_criteria[0]` | Story "Process Buy-Now-Pay-Later via VaultPay" AC #1 has 3 consecutive system steps without alternating | warning |
| 144 | `epics[5].sub_epics[2].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Process Buy-Now-Pay-Later via VaultPay" AC #2 has 3 consecutive system steps without alternating | warning |
| 145 | `epics[5].sub_epics[2].story_groups[0].stories[4].acceptance_criteria[2]` | Story "Process Buy-Now-Pay-Later via VaultPay" AC #3 has 3 consecutive system steps without alternating | warning |
| 146 | `epics[5].sub_epics[2].story_groups[0].stories[4].acceptance_criteria[3]` | Story "Process Buy-Now-Pay-Later via VaultPay" AC #4 has 3 consecutive system steps without alternating | warning |
| 147 | `epics[5].sub_epics[3].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Confirm Order and Send Confirmation Email" AC #1 has 3 consecutive system steps without alternating | warning |
| 148 | `epics[5].sub_epics[3].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Confirm Order and Send Confirmation Email" AC #2 has 3 consecutive system steps without alternating | warning |
| 149 | `epics[5].sub_epics[3].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Confirm Order and Send Confirmation Email" AC #3 has 3 consecutive system steps without alternating | warning |
| 150 | `epics[5].sub_epics[3].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Send Shipping Notification with Tracking Number" AC #1 has 3 consecutive system steps without alternating | warning |
| 151 | `epics[5].sub_epics[3].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Send Shipping Notification with Tracking Number" AC #2 has 3 consecutive system steps without alternating | warning |
| 152 | `epics[5].sub_epics[3].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Send Shipping Notification with Tracking Number" AC #3 has 3 consecutive system steps without alternating | warning |
| 153 | `epics[5].sub_epics[3].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Send Shipping Notification with Tracking Number" AC #4 has 3 consecutive system steps without alternating | warning |
| 154 | `epics[5].sub_epics[3].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Fulfill Click-and-Collect Order" AC #1 has 3 consecutive system steps without alternating | warning |
| 155 | `epics[5].sub_epics[3].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Fulfill Click-and-Collect Order" AC #2 has 3 consecutive system steps without alternating | warning |
| 156 | `epics[5].sub_epics[3].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Fulfill Click-and-Collect Order" AC #3 has 3 consecutive system steps without alternating | warning |
| 157 | `epics[5].sub_epics[3].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Track Order Status" AC #2 has 3 consecutive system steps without alternating | warning |
| 158 | `epics[5].sub_epics[3].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Track Order Status" AC #3 has 3 consecutive system steps without alternating | warning |
| 159 | `epics[5].sub_epics[3].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Track Order Status" AC #4 has 3 consecutive system steps without alternating | warning |
| 160 | `epics[6].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Initiate Return from Order History" AC #3 has 3 consecutive system steps without alternating | warning |
| 161 | `epics[6].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Initiate Return from Order History" AC #4 has 3 consecutive system steps without alternating | warning |
| 162 | `epics[6].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Generate Return Label or QR Code" AC #1 has 3 consecutive system steps without alternating | warning |
| 163 | `epics[6].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Generate Return Label or QR Code" AC #3 has 3 consecutive system steps without alternating | warning |
| 164 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Route Refund through Original Payment Vendor" AC #1 has 3 consecutive system steps without alternating | warning |
| 165 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Route Refund through Original Payment Vendor" AC #3 has 3 consecutive system steps without alternating | warning |
| 166 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Route Refund through Original Payment Vendor" AC #4 has 3 consecutive system steps without alternating | warning |
| 167 | `epics[6].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Track Refund Status" AC #3 has 3 consecutive system steps without alternating | warning |
| 168 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Process In-Store Return" AC #2 has 3 consecutive system steps without alternating | warning |
| 169 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Process In-Store Return" AC #3 has 3 consecutive system steps without alternating | warning |
| 170 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Process In-Store Return" AC #4 has 3 consecutive system steps without alternating | warning |
| 171 | `epics[7].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Send Order Confirmation" AC #1 has 3 consecutive system steps without alternating | warning |
| 172 | `epics[7].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Send Order Confirmation" AC #3 has 3 consecutive system steps without alternating | warning |
| 173 | `epics[7].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Send Shipping Update with Tracking" AC #1 has 3 consecutive system steps without alternating | warning |
| 174 | `epics[7].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Send Shipping Update with Tracking" AC #2 has 3 consecutive system steps without alternating | warning |
| 175 | `epics[7].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Send Shipping Update with Tracking" AC #3 has 3 consecutive system steps without alternating | warning |
| 176 | `epics[7].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Send Appointment Reminder" AC #1 has 3 consecutive system steps without alternating | warning |
| 177 | `epics[7].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[1]` | Story "Send Appointment Reminder" AC #2 has 3 consecutive system steps without alternating | warning |
| 178 | `epics[7].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Send Appointment Reminder" AC #3 has 3 consecutive system steps without alternating | warning |
| 179 | `epics[7].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Send Appointment Reminder" AC #4 has 3 consecutive system steps without alternating | warning |
| 180 | `epics[7].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[0]` | Story "Send Pet Adopted Before Visit Notification" AC #1 has 3 consecutive system steps without alternating | warning |
| 181 | `epics[7].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Send Pet Adopted Before Visit Notification" AC #2 has 3 consecutive system steps without alternating | warning |
| 182 | `epics[7].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[2]` | Story "Send Pet Adopted Before Visit Notification" AC #3 has 3 consecutive system steps without alternating | warning |
| 183 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[0]` | Story "Send Return and Refund Status Update" AC #1 has 3 consecutive system steps without alternating | warning |
| 184 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Send Return and Refund Status Update" AC #2 has 3 consecutive system steps without alternating | warning |
| 185 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[3]` | Story "Send Return and Refund Status Update" AC #4 has 3 consecutive system steps without alternating | warning |
| 186 | `epics[7].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[0]` | Story "Send Visit Follow-Up Notification" AC #1 has 3 consecutive system steps without alternating | warning |
| 187 | `epics[7].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[1]` | Story "Send Visit Follow-Up Notification" AC #2 has 3 consecutive system steps without alternating | warning |
| 188 | `epics[7].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[2]` | Story "Send Visit Follow-Up Notification" AC #3 has 3 consecutive system steps without alternating | warning |
| 189 | `epics[7].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[3]` | Story "Send Visit Follow-Up Notification" AC #4 has 3 consecutive system steps without alternating | warning |
| 190 | `epics[7].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Send Promotional Email" AC #1 has 3 consecutive system steps without alternating | warning |
| 191 | `epics[7].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Send Promotional Email" AC #2 has 3 consecutive system steps without alternating | warning |
| 192 | `epics[7].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Send Personalized Recommendation" AC #3 has 3 consecutive system steps without alternating | warning |
| 193 | `epics[7].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[0]` | Story "Send In-Store Event Notification" AC #1 has 3 consecutive system steps without alternating | warning |
| 194 | `epics[7].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Send In-Store Event Notification" AC #2 has 3 consecutive system steps without alternating | warning |
| 195 | `epics[7].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Set Notification Preferences" AC #1 has 3 consecutive system steps without alternating | warning |
| 196 | `epics[7].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Set Notification Preferences" AC #2 has 3 consecutive system steps without alternating | warning |
| 197 | `epics[7].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Set Notification Preferences" AC #3 has 3 consecutive system steps without alternating | warning |
| 198 | `epics[7].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Unsubscribe from Marketing Emails" AC #2 has 3 consecutive system steps without alternating | warning |
| 199 | `epics[8].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Publish Blog Post" AC #1 has 3 consecutive system steps without alternating | warning |
| 200 | `epics[8].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Publish Blog Post" AC #2 has 3 consecutive system steps without alternating | warning |
| 201 | `epics[8].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Publish Blog Post" AC #3 has 3 consecutive system steps without alternating | warning |
| 202 | `epics[8].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Publish Pet Care Guide" AC #1 has 3 consecutive system steps without alternating | warning |
| 203 | `epics[8].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Publish Pet Care Guide" AC #2 has 3 consecutive system steps without alternating | warning |
| 204 | `epics[8].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Publish Pet Care Guide" AC #3 has 3 consecutive system steps without alternating | warning |
| 205 | `epics[9].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[0]` | Story "Update Product Stock Levels" AC #1 has 3 consecutive system steps without alternating | warning |
| 206 | `epics[9].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Update Product Stock Levels" AC #2 has 3 consecutive system steps without alternating | warning |
| 207 | `epics[9].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Update Product Stock Levels" AC #3 has 3 consecutive system steps without alternating | warning |
| 208 | `epics[9].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Update Product Stock Levels" AC #4 has 3 consecutive system steps without alternating | warning |
| 209 | `epics[9].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[0]` | Story "View Inventory Dashboard" AC #1 has 3 consecutive system steps without alternating | warning |
| 210 | `epics[9].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[1]` | Story "View Inventory Dashboard" AC #2 has 3 consecutive system steps without alternating | warning |
| 211 | `epics[9].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "View Inventory Dashboard" AC #3 has 3 consecutive system steps without alternating | warning |
| 212 | `epics[9].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[3]` | Story "View Inventory Dashboard" AC #4 has 3 consecutive system steps without alternating | warning |
| 213 | `epics[9].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[4]` | Story "View Inventory Dashboard" AC #5 has 3 consecutive system steps without alternating | warning |
| 214 | `epics[9].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[1]` | Story "View and Process Incoming Orders" AC #2 has 3 consecutive system steps without alternating | warning |
| 215 | `epics[9].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "View and Process Incoming Orders" AC #3 has 3 consecutive system steps without alternating | warning |
| 216 | `epics[9].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Prepare Click-and-Collect Orders for Pickup" AC #2 has 3 consecutive system steps without alternating | warning |
| 217 | `epics[9].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Prepare Click-and-Collect Orders for Pickup" AC #3 has 3 consecutive system steps without alternating | warning |

### 🟨 Emphasize-Domain-Terms — 49 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `epics[0].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Search Products by Keyword" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 2 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Filter Products" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 3 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[4]` | Story "Filter Products" AC #5: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 4 | `epics[0].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Read Customer Reviews" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 5 | `epics[0].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Submit Written Review with Star Rating" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 6 | `epics[0].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Submit Written Review with Star Rating" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 7 | `epics[0].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[4]` | Story "Submit Written Review with Star Rating" AC #5: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 8 | `epics[0].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Submit Photo Review" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 9 | `epics[0].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Submit Photo Review" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 10 | `epics[2].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Confirm Appointment Booking" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 11 | `epics[2].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Confirm Appointment Booking" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 12 | `epics[2].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Cancel or Rebook Appointment After Pet Adoption" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 13 | `epics[2].sub_epics[2].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Record No-Show" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 14 | `epics[3].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Filter Stores by Availability and Specialization" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 15 | `epics[4].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[1]` | Story "Reset Password" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 16 | `epics[4].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[3]` | Story "Reset Password" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 17 | `epics[4].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[2]` | Story "Create Customer Pet" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 18 | `epics[4].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[3]` | Story "Create Customer Pet" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 19 | `epics[4].sub_epics[1].story_groups[0].stories[5].acceptance_criteria[1]` | Story "Update Customer Pet" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 20 | `epics[4].sub_epics[1].story_groups[0].stories[6].acceptance_criteria[1]` | Story "Set Communication Preferences" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 21 | `epics[4].sub_epics[1].story_groups[0].stories[6].acceptance_criteria[2]` | Story "Set Communication Preferences" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 22 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Update Cart Quantity" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 23 | `epics[6].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Initiate Return from Order History" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 24 | `epics[6].sub_epics[0].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Initiate Return from Order History" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 25 | `epics[6].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Generate Return Label or QR Code" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 26 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Route Refund through Original Payment Vendor" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 27 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Route Refund through Original Payment Vendor" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 28 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[3]` | Story "Route Refund through Original Payment Vendor" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 29 | `epics[6].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[4]` | Story "Route Refund through Original Payment Vendor" AC #5: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 30 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[0]` | Story "Process In-Store Return" AC #1: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 31 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Process In-Store Return" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 32 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Process In-Store Return" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 33 | `epics[7].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[3]` | Story "Send Appointment Reminder" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 34 | `epics[7].sub_epics[0].story_groups[0].stories[3].acceptance_criteria[3]` | Story "Send Pet Adopted Before Visit Notification" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 35 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[0]` | Story "Send Return and Refund Status Update" AC #1: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 36 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Send Return and Refund Status Update" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 37 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[2]` | Story "Send Return and Refund Status Update" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 38 | `epics[7].sub_epics[0].story_groups[0].stories[4].acceptance_criteria[3]` | Story "Send Return and Refund Status Update" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 39 | `epics[7].sub_epics[0].story_groups[0].stories[5].acceptance_criteria[3]` | Story "Send Visit Follow-Up Notification" AC #4: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 40 | `epics[7].sub_epics[1].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Opt In to Marketing Email List" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 41 | `epics[7].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Send Promotional Email" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 42 | `epics[7].sub_epics[1].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Send Promotional Email" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 43 | `epics[7].sub_epics[1].story_groups[0].stories[3].acceptance_criteria[1]` | Story "Send Restock Alert" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 44 | `epics[7].sub_epics[1].story_groups[0].stories[4].acceptance_criteria[1]` | Story "Send In-Store Event Notification" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 45 | `epics[7].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[1]` | Story "Set Notification Preferences" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 46 | `epics[7].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Set Notification Preferences" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 47 | `epics[7].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[0]` | Story "Unsubscribe from Marketing Emails" AC #1: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 48 | `epics[7].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Unsubscribe from Marketing Emails" AC #3: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |
| 49 | `epics[8].story_groups[0].stories[1].acceptance_criteria[1]` | Story "Publish Pet Care Guide" AC #2: many words but no *italic* domain phrases; consider emphasizing domain terms (see Emphasize domain-significant terms). | warning |

### 🟥 Story-Sizing — 21 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `epics[0].sub_epics[0].story_groups[0].stories[1].acceptance_criteria` | Story "Filter Products" has 11 11 acceptance criteria (should be 4-10) | warning |
| 2 | `epics[0].sub_epics[1].story_groups[0].stories[0].acceptance_criteria` | Story "View Product Details" has 11 11 acceptance criteria (should be 4-10) | warning |
| 3 | `epics[2].sub_epics[0].story_groups[0].stories[3].acceptance_criteria` | Story "Confirm Appointment Booking" has 11 11 acceptance criteria (should be 4-10) | warning |
| 4 | `epics[4].sub_epics[0].story_groups[0].stories[0].acceptance_criteria` | Story "Register Account" has 11 11 acceptance criteria (should be 4-10) | warning |
| 5 | `epics[4].sub_epics[0].story_groups[0].stories[1].acceptance_criteria` | Story "Send Email Verification" has 11 11 acceptance criteria (should be 4-10) | warning |
| 6 | `epics[4].sub_epics[2].story_groups[0].stories[3].acceptance_criteria` | Story "Reorder Previous Purchase" has 11 11 acceptance criteria (should be 4-10) | warning |
| 7 | `epics[5].sub_epics[1].story_groups[0].stories[0].acceptance_criteria` | Story "Enter Shipping Address" has 12 12 acceptance criteria (should be 4-10) | error |
| 8 | `epics[5].sub_epics[1].story_groups[0].stories[3].acceptance_criteria` | Story "Select Delivery Option" has 21 21 acceptance criteria (should be 4-10) | error |
| 9 | `epics[5].sub_epics[1].story_groups[0].stories[4].acceptance_criteria` | Story "Select Click-and-Collect Store" has 17 17 acceptance criteria (should be 4-10) | error |
| 10 | `epics[5].sub_epics[2].story_groups[0].stories[1].acceptance_criteria` | Story "Select Saved Payment Method at Checkout" has 12 12 acceptance criteria (should be 4-10) | error |
| 11 | `epics[5].sub_epics[2].story_groups[0].stories[2].acceptance_criteria` | Story "Process Card Payment via StripeWave" has 19 19 acceptance criteria (should be 4-10) | error |
| 12 | `epics[5].sub_epics[2].story_groups[0].stories[3].acceptance_criteria` | Story "Process Digital Wallet Payment via PayNova" has 21 21 acceptance criteria (should be 4-10) | error |
| 13 | `epics[5].sub_epics[2].story_groups[0].stories[4].acceptance_criteria` | Story "Process Buy-Now-Pay-Later via VaultPay" has 21 21 acceptance criteria (should be 4-10) | error |
| 14 | `epics[5].sub_epics[2].story_groups[0].stories[5].acceptance_criteria` | Story "Retry Failed Payment" has 19 19 acceptance criteria (should be 4-10) | error |
| 15 | `epics[5].sub_epics[3].story_groups[0].stories[1].acceptance_criteria` | Story "Send Shipping Notification with Tracking Number" has 13 13 acceptance criteria (should be 4-10) | error |
| 16 | `epics[5].sub_epics[3].story_groups[0].stories[3].acceptance_criteria` | Story "Track Order Status" has 15 15 acceptance criteria (should be 4-10) | error |
| 17 | `epics[6].sub_epics[1].story_groups[0].stories[2].acceptance_criteria` | Story "Process In-Store Return" has 11 11 acceptance criteria (should be 4-10) | warning |
| 18 | `epics[7].sub_epics[1].story_groups[0].stories[4].acceptance_criteria` | Story "Send In-Store Event Notification" has 3 3 acceptance criteria (should be 4-10) | warning |
| 19 | `epics[9].sub_epics[0].story_groups[0].stories[1].acceptance_criteria` | Story "View Inventory Dashboard" has 12 12 acceptance criteria (should be 4-10) | error |
| 20 | `epics[9].sub_epics[1].story_groups[0].stories[0].acceptance_criteria` | Story "View and Process Incoming Orders" has 12 12 acceptance criteria (should be 4-10) | error |
| 21 | `epics[9].sub_epics[1].story_groups[0].stories[1].acceptance_criteria` | Story "Prepare Click-and-Collect Orders for Pickup" has 11 11 acceptance criteria (should be 4-10) | warning |

### 🟨 Negative-Conditions — 6 violation(s)

| # | Location | Message | Severity |
|---|----------|---------|----------|
| 1 | `epics[0].sub_epics[2].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Submit Photo Review" AC #3: describes error/validation outcome but has no BUT step stating what the system does not do (e.g. save, allow, drop). | warning |
| 2 | `epics[2].sub_epics[0].story_groups[0].stories[2].acceptance_criteria[2]` | Story "Add Visit Note" AC #3: describes error/validation outcome but has no BUT step stating what the system does not do (e.g. save, allow, drop). | warning |
| 3 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[2]` | Story "Update Cart Quantity" AC #3: describes error/validation outcome but has no BUT step stating what the system does not do (e.g. save, allow, drop). | warning |
| 4 | `epics[5].sub_epics[0].story_groups[0].stories[1].acceptance_criteria[3]` | Story "Update Cart Quantity" AC #4: describes error/validation outcome but has no BUT step stating what the system does not do (e.g. save, allow, drop). | warning |
| 5 | `epics[5].sub_epics[1].story_groups[0].stories[5].acceptance_criteria[2]` | Story "Check Out as Guest" AC #3: describes error/validation outcome but has no BUT step stating what the system does not do (e.g. save, allow, drop). | warning |
| 6 | `epics[5].sub_epics[2].story_groups[0].stories[0].acceptance_criteria[2]` | Story "Select Payment Method" AC #3: describes error/validation outcome but has no BUT step stating what the system does not do (e.g. save, allow, drop). | warning |

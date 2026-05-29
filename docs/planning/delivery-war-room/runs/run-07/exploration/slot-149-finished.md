# Slot 149 — Finished (Executor)

```yaml
team-role: ux-designer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
finished_at: "2026-05-26T05:20:00Z"
scanner_validation: deferred to reviewer slot (slot 150)
```

## Artifacts produced

| Artifact | Path | Description |
| --- | --- | --- |
| Lo-fi spec | `docs/ux/lo-fi/increment-6-pet-visits.md` | 13-screen wireframe spec with affordance trace, per-screen annotations, scope guard, and CLI command |
| State JSON | `docs/ux/lo-fi/increment-6-pet-visits-state.json` | Source-of-truth state file for the drawio CLI |
| Drawio wireframe | `docs/ux/lo-fi/increment-6-pet-visits.drawio` | Generated wireframe — 13 screens, 11 connections |

## Screens covered

| Screen | Role | Stories |
| --- | --- | --- |
| pet gallery | customer | Browse Pets by Species |
| pet profile page — available | customer | View Pet Profile · View Pet Store Location and Distance · View Available Time Slots at Store |
| pet profile page — adopted | customer | View Pet Profile (adopted state) |
| book appointment — guest auth gate | customer | Confirm Appointment Booking (guest block) |
| book appointment — select time slot | customer | View Available Time Slots at Store · Select Date and Time Slot |
| appointment confirmation — review and note | customer | Add Visit Note · Confirm Appointment Booking |
| appointment booking confirmed | customer | Confirm Appointment Booking |
| customer account — appointments | customer | View Upcoming and Past Appointments · Cancel or Rebook Appointment After Pet Adoption |
| staff — incoming appointments | staff | View Incoming Appointments · Check In Customer · Record No-Show |
| staff — record outcome | staff | Record Visit Outcome · Set Follow-Up Action |
| staff — set follow-up action | staff | Set Follow-Up Action · Send Visit Follow-Up Notification |
| staff — pet profile editor | staff | Update Pet Profile · Mark Pet as Adopted |
| notification preview — appointment reminder | system | Send Appointment Reminder · Send Pet Adopted Before Visit Notification · Send Visit Follow-Up Notification |

## Key decisions

- **Account gate:** Appointment booking is customer-account-only; guest auth gate modal holds the *Selected Slot* for 10 minutes while customer authenticates — matches AC Confirm Appointment Booking AC 2
- **Species filter:** Uses `listbox` type in sidebar matching category filter pattern from Increment 1; "All" default; active species highlighted
- **Pet status states:** Two profile page variants (available vs adopted) — adopted profile remains viewable; "Book a Visit" CTA hidden/disabled per AC View Pet Profile AC 3
- **Temperament notes:** Omitted from form when empty (not shown as blank) per AC View Pet Profile AC 4
- **Staff board actions:** Check In, Record Outcome, and Mark No-Show as inline per-row actions on the appointments list; "pet adopted" warning badge rendered on affected rows
- **Outcome recording:** Listbox with 4 options; selecting *Adopted* triggers pet status transition; selecting *Interested — Returning* prompts Set Follow-Up Action step
- **Notification preview:** Nav-tabs switch between three transactional email previews (Appointment Reminder, Pet Adopted Before Visit, Visit Follow-Up) — system stories covered without separate UI screens
- **No Design/ images:** Layout follows Increment 1–5 lo-fi patterns; noted in Design reference section
- **Chrome type:** Used for staff header regions; breadcrumbs rendered as toolbar type (matching Increment 2 pattern)

## AC coverage

All 17 stories from `docs/story/acceptance-criteria/increment-6-acceptance-criteria.md` are covered in affordance trace. Every AC clause maps to at least one wireframe affordance.

## Unknowns / notes for reviewer

- Slot grid layout: col 0–5 row 0 for customer flow; col 0–4 row 2 for staff flow — reviewer to verify reasonable spacing in the drawio
- Chrome type regions render as labelled bands; staff header label shows as "staff header" in wireframe — acceptable for lo-fi
- `past appointments` list has `"actions": []` (no inline actions) — past appointments are read-only; reviewer to confirm AC alignment
- Distance / location prompt on pet profile page: when no customer location is shared, a prompt to share/enter postcode is shown (inline in the store location form region) — matches Increment 1 pattern per AC View Pet Store Location and Distance AC 3

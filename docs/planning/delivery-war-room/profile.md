# Engagement Profile

**Profile:** brownfield

## Rationale

PawPlace has upstream story, domain, CRC, object model, and increment 1 AC/specs. MERN code exists **only for Increment 1**, and only partially (browse + store). **Run 2 still delivers the whole Increment 1 slice** — UX, specification, and engineering are all outstanding. Increments 2–9 have no code yet. Run 1 backfills UX IA and architecture blueprint first.

## Default run shape

- **Run 1 (Discovery):** one slot per discovery skill — domain terms → UL → full story map → UX IA → blueprint → SLOs; thin slicing waived
- **Run 2 (Increment 1):** one slot per skill across Exploration (4) → Specification (5) → Engineering (4)
- **Runs 3–10:** template pattern with waivable UX/arch/domain slots when increment adds no new surface; always ATDD + clean code

## Early-question bias

- Domain term conflicts between existing key-abstractions and new architecture/UX surfaces
- Increment 1 scope creep (cart/checkout must stay out until Increment 2)
- Treating partial `packages/` code as “mostly done” — Run 2 is a full delivery run for Increment 1
- Payment vendor scope in Increment 2 (StripeWave only until Increment 5)

## Harness

- War room: `docs/planning/delivery-war-room/`
- **Agent mode:** local Runs 1–2; cloud from Run 3 (after Run 2 complete)
- **Checkpoint:** stage boundary Runs 1–2; full run from Run 3 onward
- **Notifications:** `cursor-teams` in manifest — set `teams_webhook_url` in `~/.cursor/cli-config.json` or `agilebydesign-skills/cli_harness/cli-config.json`
- **Progress:** `delivery-war-room/board.json` (Kanban) + `delivery-plan-checklist.md` + slot finished files
- **Open runs:** `generate_run_slots.py --run N` materializes `slot-NN-start.md` from `system-of-work.json` + `run-catalog.json`

## Start Run 1 (CLI harness)

Prerequisites:

1. `CURSOR_API_KEY` in environment (or `api_key` in cli-config)
2. `teams_webhook_url` in cli-config for Teams posts (falls back to console if unset)
3. Delivery package deployed: `.cursor/agents/`, `.cursor/skills/` on the engagement repo

```powershell
cd c:\dev\agilebydesign-skills
$env:PYTHONIOENCODING = 'utf-8'
python -m cli_harness status C:\dev\abd-pet-store-demo
python -m cli_harness run C:\dev\abd-pet-store-demo
```

Active slot: **01** — Business Expert, `abd-domain-terms`, discovery stage.

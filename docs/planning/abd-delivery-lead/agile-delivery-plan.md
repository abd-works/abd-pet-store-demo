# Agile Delivery Plan — PawPlace (abd-pet-store-demo)

**Workspace:** `c:\dev\abd-pet-store-demo`  
**Strategy:** `new-initiative-no-documented-architecture` + `new-thin-slice` (abd-delivery-planning)  
**Profile:** brownfield — story map, domain, CRC, object model, and increment 1 AC/specs exist; MERN code covers **Increment 1 only**, partially  
**Autonomy:** **full** — chain runs and stages without operator pause until **Increment 9** is complete  
**Runtime:** `isolated-subagent` — **delivery-lead** orchestrates; eight role agents execute in isolated subagents  

**War room (authoritative progress):** `docs/planning/delivery-war-room/`

| Artifact | Role |
| --- | --- |
| `system-of-work.json` | Named stage + skill order (+ parallel profiles) |
| `run-catalog.json` | All runs — scope, stages, `system_of_work`, `opens_after` |
| `run-state.json` | Which runs have materialized slots; `next_slot_id` |
| `board.json` | Kanban snapshot — **delivery-lead** runs `sync_kanban_board.py` |
| `slot-NN-*.md` | Handoffs — generated at **run open** via `generate_run_slots.py` |
| `delivery-plan-checklist.md` | Orchestration checkboxes + resume pointer |

**Kanban UI** reads the above — it does **not** create the plan or slots (only `wip-policy.json` for agent +/−).

---

## End-to-end delivery contract

**Operator directive:** deliver **Runs 2–10 (Increments 1–9) end to end**. Stop only on `slot-NN-blocked.md`.

| Rule | Meaning |
| --- | --- |
| **Run = full vertical slice** | Exploration → Specification → Engineering per increment |
| **System of work** | Skill order defined once; Runs 2–10 share `pawplace-increment-vertical` |
| **Slots at run open** | Delivery-lead runs `generate_run_slots.py --run N` when a run starts — not all slots in this plan |
| **Slot IDs sequential** | Rework inserts extra IDs; see `run-state.json` |
| **Chain on green** | After run complete → `generate_run_slots.py` for next run → sync board |
| **Cross-run parallel** | Run N+1 exploration opens after Run N **specification exit** (not engineering exit) |
| **End condition** | Run 10 engineering exit gate PASS |

**Current (2026-05-26):** Runs **1–6 complete**. **Run 7** — specification in progress (parallel slots 153 / 159 / 161). Runs **8–10** registered — slots not generated until Run 7 opens them.

---

## System of work

Authoritative machine copy: `delivery-war-room/system-of-work.json`.

### `pawplace-discovery` (Run 1)

**From strategy:** `new-initiative-no-documented-architecture`  
**Stages:** discovery  

| Order | Role | Skill |
| --- | --- | --- |
| 1 | business-expert | `abd-domain-terms` |
| 2 | business-expert | `abd-ubiquitous-language`, `drawio-domain-sync` |
| 3 | product-owner | `abd-story-mapping`, `drawio-story-sync` |
| 4 | ux-designer | `abd-information-architecture` |
| 5 | engineer | `abd-architecture-blueprint` |
| 6 | engineer | `abd-service-level-objectives` |

**Waived:** `abd-thin-slicing` — `story/thin-slicing.md` is authoritative.

### `pawplace-increment-vertical` (Runs 2–10)

**From strategy:** `new-thin-slice`  
**Stages:** exploration → specification → engineering  
**Parallel profile:** `increment-vertical` — see `delivery-war-room/run-7-parallel-flow.md` for DAG rationale.

**Exploration:** UL → AC → UX mockup → arch template (BE → PO → UX → Engineer)

**Specification:** CRC → SBE → walkthrough → interface design → arch reference (BE → PO → BE → UX → Engineer)

**Engineering:** UI impl → object model → ATDD → clean code (+ `mern-technical-architecture` where assigned)

Per-skill roles match `content/stages/*.md` and `content/roles/team-roles.md`.

---

## Runs summary

| Run | Increment | Stages | system_of_work | Status | Opens after |
| --- | --- | --- | --- | --- | --- |
| 1 | Discovery foundation | discovery | `pawplace-discovery` | complete | — |
| 2 | Walk-in driver | exp → spec → eng | `pawplace-increment-vertical` | complete | Run 1 |
| 3 | Click-and-collect | exp → spec → eng | `pawplace-increment-vertical` | complete | Run 2 spec exit |
| 4 | Ship to home | exp → spec → eng | `pawplace-increment-vertical` | complete | Run 3 spec exit |
| 5 | Returning customers | exp → spec → eng | `pawplace-increment-vertical` | complete | Run 4 spec exit |
| 6 | Pay your way | exp → spec → eng | `pawplace-increment-vertical` | complete | Run 5 spec exit |
| 7 | Pet visits | exp → spec → eng | `pawplace-increment-vertical` | **active** | Run 6 spec exit (slot 136) |
| 8 | Returns and refunds | exp → spec → eng | `pawplace-increment-vertical` | planned | Run 7 spec exit |
| 9 | Marketing engine | exp → spec → eng | `pawplace-increment-vertical` | planned | Run 8 spec exit |
| 10 | Power-ups | exp → spec → eng | `pawplace-increment-vertical` | planned | Run 9 spec exit |

Slot ranges for **materialized** runs: `run-state.json` (`first_slot`, `last_slot`, `spec_exit_slot`).

**Generate slots when a run opens:**

```powershell
python .cursor/skills/abd-delivery-war-room/scripts/generate_run_slots.py --workspace C:\dev\abd-pet-store-demo --run 8
python .cursor/skills/abd-delivery-war-room/scripts/sync_kanban_board.py --workspace C:\dev\abd-pet-store-demo
```

---

## Agent mode

| Runs | Mode |
| --- | --- |
| 1–2 | local |
| 3–10 | cloud (`manifest.md` `agent_mode`) |

**Checkpoint policy:** `on_block_only` for Runs 2–10.

---

## Context inventory

| Artifact | Path | Status |
| --- | --- | --- |
| Story graph | `story/story-graph.json` | done |
| Thin slicing | `story/thin-slicing.md` | done — 9 increments |
| Domain | `docs/domain/` | done — refresh per increment |
| MERN code | `packages/`, `tests/` | Increment 1 partial; Increments 2–6 delivered on disk |
| Architecture blueprint | `docs/architecture/` | done — Run 1 |
| UX IA | `docs/ux/information-architecture.md` | done — Run 1 |

## Risk classification

| Risk | Level | Mitigation |
| --- | --- | --- |
| Domain | low | UL/CRC refresh per increment |
| Technical | medium | Arch template + reference before engineering each slice |
| UX | high | IA (Run 1) + mockup + interface design per increment |
| Integration | medium | StripeWave, PayNova, VaultPay, returns — explicit arch slots |
| Delivery | medium | End-to-end chain; stage exit gates on disk |

---

## Run completion (before opening next run)

1. Stage exit gates in `run-log.jsonl` for exploration, specification, engineering.
2. Non-waived skill pairs have `slot-NN-finished.md` (rework incorporated).
3. Checklist synced from run-log.
4. Lead appends `run_complete`; runs **`generate_run_slots.py --run N+1`**; sync board.

---

## Run 1 — Discovery foundation

**Status:** Complete (slots 05–16; `run-state.json`).  
**system_of_work:** `pawplace-discovery`  
**Goal:** Domain, story map, UX IA, architecture blueprint, SLOs before increment work.

---

## Run 2 — Increment 1: Walk-in driver

**Status:** Complete.  
**system_of_work:** `pawplace-increment-vertical` (reference run — first increment using shared system)  
**Goal:** Full vertical slice for Increment 1; brownfield spike is input only.  
**Historical slots:** 19–42 (`run-state.json`).  
**Waivers:** Exploration UL refresh waived (Run 1 UL sufficient).  
**Constraints:** No cart, checkout, payment, or accounts in Increment 1.

---

## Run 3 — Increment 2: Click-and-collect

**Status:** Complete. **system_of_work:** `pawplace-increment-vertical`  
**Goal:** Guest checkout, cart, StripeWave, click-and-collect.  
**Stories:** Cart, guest checkout, StripeWave, pickup fulfillment (`story/thin-slicing.md` § Increment 2).  
**Slots:** 43–68 on disk.

---

## Run 4 — Increment 3: Ship to home

**Status:** Complete. **system_of_work:** `pawplace-increment-vertical`  
**Goal:** Shipping address, delivery options, order tracking, notifications.  
**Waivers:** Exploration `abd-ux-mockup` — extends Increment 2 checkout screens.  
**Slots:** 69–92 on disk.

---

## Run 5 — Increment 4: Returning customers

**Status:** Complete. **system_of_work:** `pawplace-increment-vertical`  
**Goal:** Accounts, wishlist, order history, reorder.  
**Cross-run:** Run 6 exploration opened after spec exit slot **110** (parallel to Run 5 engineering).  
**Slots:** 93–118 on disk.

---

## Run 6 — Increment 5: Pay your way

**Status:** Complete. **system_of_work:** `pawplace-increment-vertical`  
**Goal:** PayNova, VaultPay, failed-payment retry.  
**Cross-run:** Run 7 opened after spec exit slot **136**.  
**Slots:** 119–144 on disk.

---

## Run 7 — Increment 6: Pet visits

**Status:** **Active** — specification (parallel CRC / interface / arch reference).  
**system_of_work:** `pawplace-increment-vertical` · **parallel_profile:** `increment-vertical`  
**Goal:** Pet gallery, adoption appointments, staff workflow, reminders.  
**Stories:** 19 stories — `story/thin-slicing.md` § Increment 6.  
**Slots:** 145–170 materialized (`run-state.json`). Exploration complete.  
**Next run opens after:** spec exit (slot **162** when all spec reviewers pass).

---

## Run 8 — Increment 7: Returns and refunds

**Status:** Registered — **slots not generated**.  
**system_of_work:** `pawplace-increment-vertical` · **discovery_precompleted:** true  
**Goal:** Online + in-store returns; refund via original payment vendor.  
**Stories:** Return initiation through refund status (`story/thin-slicing.md` § Increment 7).  
**Opens after:** Run 7 specification exit → `generate_run_slots.py --run 8`.

---

## Run 9 — Increment 8: Marketing engine

**Status:** Registered — **slots not generated**.  
**system_of_work:** `pawplace-increment-vertical` · **discovery_precompleted:** true  
**Goal:** Reviews, opt-in marketing, restock alerts, content publishing.  
**Stories:** 16 stories — `story/thin-slicing.md` § Increment 8.  
**Opens after:** Run 8 specification exit → `generate_run_slots.py --run 9`.

---

## Run 10 — Increment 9: Power-ups

**Status:** Registered — **slots not generated**.  
**system_of_work:** `pawplace-increment-vertical` · **discovery_precompleted:** true  
**Goal:** Search, filters, store personalization, inventory dashboard.  
**Stories:** 10 stories — `story/thin-slicing.md` § Increment 9.  
**Opens after:** Run 9 specification exit → `generate_run_slots.py --run 10`.  
**End:** Engineering exit gate → engagement complete.

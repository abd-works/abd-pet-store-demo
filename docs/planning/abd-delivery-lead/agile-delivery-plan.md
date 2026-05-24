# Agile Delivery Plan — PawPlace (abd-pet-store-demo)

**Workspace:** `c:\dev\abd-pet-store-demo`  
**Strategy:** `new-initiative-no-documented-architecture` + `new-thin-slice` (abd-delivery-planning)  
**Profile:** brownfield — story map, domain, CRC, object model, and increment 1 AC/specs exist; MERN code covers **Increment 1 only**, partially; Run 2 still delivers Increment 1 end-to-end; UX IA and architecture blueprint missing  
**Autonomy:** tight (Runs 1–2); moderate from Run 3 onward  
**Harness:** CLI war room at `docs/planning/delivery-war-room/` — authoritative progress (`delivery-plan-checklist.md`, slot files, run log); one slot per skill; **operator CHECKPOINT** on stage boundaries (Runs 1–2) or full run (Runs 3–10)  
**Notification:** CLI harness → **Cursor Teams integration** (configured once in Cursor / `~/.cursor/cli-config.json`); stage events Runs 1–2, run events Runs 3–10

## Agent mode

| Runs | Mode | Why |
| --- | --- | --- |
| **1–2** | **local** | Operator present — Discovery foundation and first increment; validate UX and architecture on machine before walk-away |
| **3–10** | **cloud** | Walk-away delivery — Cursor cloud agents on `abd-pet-store-demo` repo; no open IDE required |

- **Runs 1–2:** `agent_mode: local` in `manifest.md` and `harness-config.json` (default now).
- **Run 3 onward:** delivery lead sets `agent_mode: cloud` in manifest + harness-config before slot 20 (Increment 2). Requires `repo_url` / `repo_ref` already in manifest.
- **Switch trigger:** operator CHECKPOINT after Run 2 Engineering stage (slot 19) — not mid–Run 2.

## Runs vs slots vs checkpoints

| Concept | What it is | PawPlace |
| --- | --- | --- |
| **Run** | Planned chunk — scope, stages, rationale | Run 1 = Discovery foundation; Runs 2–10 = Increments 1–9 |
| **Slot** | One harness handoff — one role, one skill, `slot-NN-start.md` → agent → finished | Run 1 = 6 slots; Run 2 = 13 slots; Runs 3–10 ≈ 10 slots each |
| **CHECKPOINT** | Operator confirms before continuing | **Not the same as a slot** — see checkpoint policy below |

**Progress:** all resumable state lives in `docs/planning/delivery-war-room/` — `delivery-plan-checklist.md` (orchestration + runs/stages), `slot-NN-finished.md` (slots).

Slots chain **without** an operator pause unless a CHECKPOINT fires. Runs 1–2: pause at **stage** exit. Runs 3–10: pause only when the **whole run** finishes.

## Bootcamp alignment

| Phase | When | Skill order (one slot per row unless waived) |
| --- | --- | --- |
| **Shaping** | Waived | Brownfield — story outline, impact map, and arch outline already captured in prior work |
| **Discovery** | Run 1 | domain → story (full) → UX IA → architecture → thin slicing **waived** (exists) |
| **Exploration** | Per increment | UL → AC → UX mockup → arch template |
| **Specification** | Per increment | CRC → spec-by-example → walkthrough → interface → arch reference |
| **Engineering** | Per increment | clickable prototype → object model → acceptance tests → clean code |

## Context inventory

| Artifact | Path | Status |
| --- | --- | --- |
| Story graph | `story/story-graph.json` | done |
| Thin slicing | `story/thin-slicing.md` | done — 9 increments |
| Domain | `docs/domain/key-abstractions.md`, `crc.md`, `object-model.md` | done |
| Increment 1 AC + specs | `docs/stories/acceptance-criteria/increment-1-*`, `specification-by-example/increment-1-*` | done — refresh in Exploration/Specification |
| MERN code | `packages/`, `tests/` | **Increment 1 only, partial** — browse + store modules and some tests; **Run 2 still does the full slice** (UX → spec → prototype → tests → production code). Increments 2–9: not started |
| Tooling | `conf/` | package.json, vitest, playwright, tsconfig — run tests via `npm test` from repo root |
| Delivery deploy | `.cursor/agents/`, `.cursor/skills/` | delivery-lead, team-member, reviewer; abd-delivery-planning, war-room, estimation |
| Architecture blueprint | — | **missing** — Run 1 slot 05 |
| UX information architecture | — | **missing** — Run 1 slot 04 |
| UX mockups / interface | — | **missing** — Run 2 Exploration/Specification |
| Draw.io (domain, story, UX, arch) | partial | **gaps** |

## Risk classification

Engagement-wide — not per increment. Run rationales in **Runs summary** say what each run proves; this section says what could go wrong across the whole PawPlace delivery.

| Risk | Level | What | Mitigation |
| --- | --- | --- | --- |
| Domain | low | Story map, CRC, and object model exist; later increments add payment, pet, and return concepts | UL/CRC refresh in Exploration/Specification when a slice adds concepts |
| Technical | medium | No architecture blueprint; Increment 1 MERN is partial spike only; production patterns not proven | Run 1 blueprint + SLOs; Run 2 arch template, reference, and full Engineering chain |
| UX | high | No information architecture, mockups, or interface design for any increment | Run 1 IA; Exploration + Specification UX skills on every increment that introduces screens |
| Integration | medium | External surfaces accumulate across increments — StripeWave (Run 3), shipping/notifications (Run 4+), multi-vendor payments (Run 6), email and marketing hooks (Run 8+) | Arch template + reference before Engineering on each increment; tight checkpoints on payment and vendor stories |
| Delivery | medium | Nine increments, slot-per-skill, brownfield artifact drift | Stage checkpoints Runs 1–2; run checkpoint Runs 3–10; Run 1 gate before increment delivery |

**Not classified:** value (thin slicing done), regulatory, AI-model — none apply to this demo engagement.

## Runs summary

| Run | Stages | Scope | Checkpoint Policy | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Discovery | Foundation backfill — domain refresh, full story map, UX IA, architecture blueprint, SLOs | **After Discovery stage** (end of run) | Missing IA + blueprint block increment delivery |
| 2 | Exploration → Specification → Engineering | Increment 1 — walk-in driver (full skill chain) | **After each stage** — Exploration, Specification, Engineering | First vertical slice; establishes UX, arch reference, prototype, OM, tests, code |
| 3 | Exploration → Specification → Engineering | Increment 2 — click-and-collect | **After full run** | Payment + cart — new UX and payment mechanisms |
| 4 | Exploration → Specification → Engineering | Increment 3 — ship to home | **After full run** | Shipping + order lifecycle |
| 5 | Exploration → Specification → Engineering | Increment 4 — returning customers | **After full run** | Accounts, saved entities, wishlist |
| 6 | Exploration → Specification → Engineering | Increment 5 — pay your way | **After full run** | Multi-vendor payments |
| 7 | Exploration → Specification → Engineering | Increment 6 — pet visits | **After full run** | New customer surface + staff workflow |
| 8 | Exploration → Specification → Engineering | Increment 7 — returns and refunds | **After full run** | Return lifecycle + vendor routing |
| 9 | Exploration → Specification → Engineering | Increment 8 — marketing engine | **After full run** | Reviews, alerts, recommendations |
| 10 | Exploration → Specification → Engineering | Increment 9 — power-ups | **After full run** | Search, personalization, admin polish |

**Mapping:** Run 1 = foundation. Runs 2–10 = Increments 1–9 from `story/thin-slicing.md`.  
**Thin slicing:** waived in Run 1 — `story/thin-slicing.md` is authoritative; refresh only if Discovery reveals re-order need.

---

## Run 1 — Discovery foundation

**Goal:** Align domain vocabulary, full story map, UX information architecture, and architecture blueprint before increment work.  
**Stages:** discovery (skill order: domain → story → UX → architecture)  
**Agent mode:** local  
**Gate:** operator CHECKPOINT after Discovery stage (slot 06 finished); approval before Run 2.

| Slot | Phase | Role | Skills | Deliverable |
| --- | --- | --- | --- | --- |
| 01 | discovery | business-expert | `abd-domain-terms` | Gap-check terms vs existing `docs/domain/` — light refresh only |
| 02 | discovery | business-expert | `abd-ubiquitous-language`, `drawio-domain-sync` | Refresh UL + domain diagram if arch/UX surfaces gaps |
| 03 | discovery | product-owner | `abd-story-mapping`, `drawio-story-sync` | Full map refresh from `story/story-graph.json` if IA/blueprint requires |
| 04 | discovery | ux-designer | `abd-information-architecture` | Increment 1 screen inventory, navigation, content model |
| 05 | discovery | engineer | `abd-architecture-blueprint` | System-wide PawPlace MERN blueprint |
| 06 | discovery | engineer | `abd-service-level-objectives` | NFR/SLO targets for Increment 1 slice |

**Waived:** `abd-thin-slicing`, post-slice `drawio-story-sync` — increment order already in `story/thin-slicing.md`.

---

## Run 2 — Increment 1: Walk-in driver

**Goal:** Deliver **Increment 1 from scratch through the full skill chain** — existing browse/store code in `packages/` is incomplete spike input only, not delivered software.  
**Checkpoint policy:** operator CHECKPOINT after **Exploration** (slot 10), **Specification** (slot 15), and **Engineering** (slot 19). Slots within a stage chain without operator pause.  
**Agent mode:** local (entire Run 2).

### Exploration — UL → AC → UX → arch template

| Slot | Phase | Role | Skills | Deliverable |
| --- | --- | --- | --- | --- |
| 07 | exploration | business-expert | `abd-ubiquitous-language`, `drawio-domain-sync` | Increment 1 UL refresh |
| 08 | exploration | product-owner | `abd-acceptance-criteria`, `drawio-story-sync` | Increment 1 AC refresh + exploration diagrams |
| 09 | exploration | ux-designer | `abd-ux-mockup` | Increment 1 wireframes + drawio |
| 10 | exploration | engineer | `abd-architecture-template` | Mechanisms for catalog, store, stock (no reference yet) |

### Specification — CRC → spec → walkthrough → interface → reference

| Slot | Phase | Role | Skills | Deliverable |
| --- | --- | --- | --- | --- |
| 11 | specification | business-expert | `abd-class-responsibility-collaborator` | CRC + `domain.json` refresh for Increment 1 |
| 12 | specification | product-owner | `abd-specification-by-example` | Increment 1 scenarios refresh |
| 13 | specification | business-expert | `abd-scenario-walkthrough` | Walk Increment 1 specs through CRC |
| 14 | specification | ux-designer | `abd-interface-design` | Production UI spec from mockups |
| 15 | specification | engineer | `abd-architecture-reference` | Deep mechanism reference for Engineering |

### Engineering — prototype → object model → acceptance tests → clean code

| Slot | Phase | Role | Skills | Deliverable |
| --- | --- | --- | --- | --- |
| 16 | engineering | engineer | **Clickable prototype** | Runnable UI shell from interface spec |
| 17 | engineering | engineer | `abd-object-model` | Typed domain surface for Increment 1 modules |
| 18 | engineering | engineer | `abd-acceptance-test-driven-development`, `mern-technical-architecture` | Increment 1 tests (RED) |
| 19 | engineering | engineer | `abd-clean-code`, `mern-technical-architecture` | Increment 1 production code (GREEN) + deploy — built from interface spec; may replace spike in `packages/` |

**Constraints:** No cart, checkout, payment, or accounts in Increment 1 — block scope creep at checkpoint.

---

## Runs 3–10 — Increments 2–9 (routine template)

**Goal:** Deliver each increment through Exploration → Specification → Engineering.  
**Checkpoint policy:** operator CHECKPOINT **after full run only** (last slot of increment). Stages and slots chain inside the run without operator pause.  
**Agent mode:** cloud (Runs 3–10).  
**Engineering waivers (Increments 2–9):** skip clickable prototype and object-model slots when no new domain types or UI shell — lead documents waiver in slot start. Always run acceptance tests and clean code.

**Slot pattern per increment** (base slot = last slot of prior run + 1):

| Offset | Phase | Role | Skills | Waive when |
| --- | --- | --- | --- | --- |
| +0 | exploration | business-expert | `abd-ubiquitous-language` | no new domain terms |
| +1 | exploration | product-owner | `abd-acceptance-criteria`, `drawio-story-sync` | never |
| +2 | exploration | ux-designer | `abd-ux-mockup` | no new screens (e.g. Inc 3–5 backend-heavy) |
| +3 | exploration | engineer | `abd-architecture-template` | no new mechanisms |
| +4 | specification | business-expert | `abd-class-responsibility-collaborator`, `abd-scenario-walkthrough` | no CRC delta |
| +5 | specification | product-owner | `abd-specification-by-example` | never |
| +6 | specification | ux-designer | `abd-interface-design` | UX mockup waived |
| +7 | specification | engineer | `abd-architecture-reference` | arch template waived |
| +8 | engineering | engineer | `abd-acceptance-test-driven-development`, `mern-technical-architecture` | never |
| +9 | engineering | engineer | `abd-clean-code`, `mern-technical-architecture` | never |

### Run slot map

| Run | Increment | First slot | Last slot | Notes |
| --- | --- | --- | --- | --- |
| 3 | 2 Click-and-collect | 20 | 29 | Full pattern — checkout UX + StripeWave |
| 4 | 3 Ship to home | 30 | 39 | Waive UX mock if extending existing checkout |
| 5 | 4 Returning customers | 40 | 49 | Accounts — full UX |
| 6 | 5 Pay your way | 50 | 59 | Multi-vendor payment mechanisms |
| 7 | 6 Pet visits | 60 | 69 | New gallery + appointment UX |
| 8 | 7 Returns and refunds | 70 | 79 | Return flow UX |
| 9 | 8 Marketing engine | 80 | 89 | Marketing surfaces |
| 10 | 9 Power-ups | 90 | 99 | Search + admin dashboard |

Delivery lead authors `slot-NN-start.md` and manifest entries **one slot ahead** — after prior slot finishes or at run open for the first slot of a run.

---

## Checkpoint policy

| Runs | Operator CHECKPOINT when | Slots between checkpoints |
| --- | --- | --- |
| **1** | Discovery stage complete (slot 06 finished) | 01–06 chain; one stage = one checkpoint |
| **2** | Exploration complete (slot 10), Specification complete (slot 15), Engineering complete (slot 19) | Slots within each stage chain automatically |
| **3–10** | Full run complete (last slot of increment) | All stage slots chain until run ends |

- **Run 1 gate:** same as Discovery stage checkpoint — operator approval before Run 2 slots are authored.
- **Team member mid-slot review** still happens inside each slot; operator is not asked until the checkpoint boundary above.
- **Harness:** `manifest.md` sets `checkpoint_policy: after_every_run`; delivery lead applies **stage gates** for Runs 1–2 per this table.
- **Agent mode:** local Runs 1–2; lead sets `agent_mode: cloud` in manifest + `harness-config.json` before Run 3 (after Run 2 slot 19 checkpoint).
- **Notifications:** harness uses `notification_channel: cursor-teams` from Cursor config — not per-engagement webhook setup.
- **Autonomy:** tight Runs 1–2; moderate from Run 3 — lead may merge waivable slots when error rate drops.

## Changelog

| Date | Change |
| --- | --- |
| 2026-05-23 | Initial plan from operator brief |
| 2026-05-23 | Rebuilt for five-stage bootcamp model and CLI harness slot-per-skill |
| 2026-05-23 | Checkpoint policy — stage gates Runs 1–2; full-run gates Runs 3–10 |
| 2026-05-23 | Agent mode — local Runs 1–2, cloud Runs 3–10; Teams via Cursor integration |

# War Room Manifest — PawPlace

```yaml
goal: "PawPlace delivery — complete all increments through Increment 9 (Power-ups); operator: no CHECKPOINT stops until last increment done"
profile: brownfield
autonomy: full
checkpoint_policy: on_block_only
operator_directive: "Chain all runs (2–10) without operator pause; delivery-lead orchestrates only; eight role agents via isolated subagents; stop only on slot-NN-blocked.md"
scanner_infra_policy: block_chain_until_fixed
scanner_exception_policy: documented_obvious_irrelevance_only
scanner_infra:
  abd_clean_code: fixed_2026-05-24
  abd_object_model: fixed_2026-05-24
  mern_technical_architecture: fixed_2026-05-24
  note: "MERN scanners need tree-sitter (`pip install tree-sitter tree-sitter-typescript`). Report: scanner-report/mern-technical-architecture.md — ALL CLEAN"
checkpoint_phases:
  runs_2_10: on_block_only
run_sizing_policy:
  stories_per_slot: 1
  stages_per_run: 1
  stall_timeout_minutes: 20
  notification_detail: high
agent_mode: cloud
agent_mode_phases:
  runs_1_2: local
  runs_3_plus: cloud
notification_channel: cursor-teams
repo_url: https://github.com/abd-works/abd-pet-store-demo
repo_ref: main
runtime: isolated-subagent
role_agents_bootstrapped: true
operator_restart:
  at: "2026-05-25T23:45:00Z"
  reason: "Kanban war room — stop prior agent sessions; re-bootstrap eight role agents with board.json pull model"
  resume_from_board: true
cross_run_pipeline:
  next_run_opens_after: prior_run_specification_exit
  parallel_while_prior_run_engineering: true
  upstream_roles: [business-expert, product-owner]
planning_model:
  system_of_work: delivery-war-room/system-of-work.json
  run_catalog: delivery-war-room/run-catalog.json
  run_state: delivery-war-room/run-state.json
  slot_generation: generate_run_slots.py at run open
```

## Slots

Skill order and stage rails: **`system-of-work.json`**. Runs: **`run-catalog.json`**. Slot files live under **`runs/run-NN/<stage>/`** (materialized at run open via **`generate_run_slots.py`**).

## Notes

- **Workspace:** `c:\dev\abd-pet-store-demo`
- **Plan:** `docs/planning/abd-delivery-lead/agile-delivery-plan.md` (narrative + system of work)
- **Machine plan:** `system-of-work.json`, `run-catalog.json`, `run-state.json`
- **Progress (authoritative):** `board.json` (delivery-lead sync), `delivery-plan-checklist.md`, `slot-NN-finished.md`, `run-log.jsonl`
- **Kanban UI:** read-only except `wip-policy.json` (agent +/−)
- **Sync board** (delivery-lead after slot/stage events):
  ```powershell
  python .cursor/skills/abd-delivery-war-room/scripts/sync_kanban_board.py --workspace C:\dev\abd-pet-store-demo
  ```
- **Open next run:**
  ```powershell
  python .cursor/skills/abd-delivery-war-room/scripts/generate_run_slots.py --workspace C:\dev\abd-pet-store-demo --run N
  ```
- **Resume:** read `board.json` + checklist `<!-- resume: slot NN -->` — Run 7 specification in progress (153 / 159 / 161 parallel)

# War Room Manifest — PawPlace

```yaml
goal: "PawPlace brownfield delivery - Discovery foundation, then Increments 1-9 via Exploration, Specification, Engineering"
profile: brownfield
autonomy: tight
checkpoint_policy: after_every_run
checkpoint_phases:
  runs_1_2: stage_gate
  runs_3_plus: after_every_run
run_sizing_policy:
  stories_per_slot: 1
  stages_per_run: 1
  stall_timeout_minutes: 20
  notification_detail: high
agent_mode: local
agent_mode_phases:
  runs_1_2: local
  runs_3_plus: cloud
notification_channel: cursor-teams
repo_url: https://github.com/abd-works/abd-pet-store-demo
repo_ref: main
```

## Slots

Run 1 slots are defined below. Run 2+ slots are authored by the delivery lead after each gate (see `agile-delivery-plan.md` slot map).

```yaml
slots:
  - id: "01"
    run: "Run 1 — Discovery foundation"
    stage: discovery
    role: business-expert
    skills:
      - abd-domain-terms
    expected_artifacts:
      - docs/domain/domain-terms.md
    entry_conditions:
      - story/story-graph.json exists
      - docs/domain/ artifacts exist
    early_question_triggers:
      - scope-unclear: Cannot reconcile existing key-abstractions with story-graph terms
  - id: "02"
    run: "Run 1 — Discovery foundation"
    stage: discovery
    role: business-expert
    skills:
      - abd-ubiquitous-language
      - drawio-domain-sync
    expected_artifacts:
      - docs/domain/ubiquitous-language.md
      - docs/domain/ubiquitous-language.drawio
    entry_conditions:
      - slot-01-finished exists OR operator waives domain-terms refresh
  - id: "03"
    run: "Run 1 — Discovery foundation"
    stage: discovery
    role: product-owner
    skills:
      - abd-story-mapping
      - drawio-story-sync
    expected_artifacts:
      - story/story-map.md
      - story/story-map.drawio
    entry_conditions:
      - slot-02-finished exists OR operator waives UL dependency
  - id: "04"
    run: "Run 1 — Discovery foundation"
    stage: discovery
    role: ux-designer
    skills:
      - abd-information-architecture
    expected_artifacts:
      - docs/ux/information-architecture.md
      - docs/ux/information-architecture.drawio
    entry_conditions:
      - slot-03-finished exists OR operator waives story refresh
  - id: "05"
    run: "Run 1 — Discovery foundation"
    stage: discovery
    role: engineer
    skills:
      - abd-architecture-blueprint
    expected_artifacts:
      - docs/architecture/architecture-blueprint.md
    entry_conditions:
      - slot-04-finished exists OR operator waives IA dependency
    early_question_triggers:
      - scope-unclear: Cannot determine bounded contexts or deployment topology
  - id: "06"
    run: "Run 1 — Discovery foundation"
    stage: discovery
    role: engineer
    skills:
      - abd-service-level-objectives
    expected_artifacts:
      - docs/architecture/service-level-objectives.md
    entry_conditions:
      - slot-05-finished exists
```

## Notes

- **Workspace:** `c:\dev\abd-pet-store-demo`
- **Delivery agents/skills:** `.cursor/agents/`, `.cursor/skills/` (deployed from agilebydesign-skills `delivery/`)
- **Tooling config:** `conf/` (package.json, vitest, playwright, tsconfig)
- **Plan:** `docs/planning/abd-delivery-lead/agile-delivery-plan.md`
- **Progress (authoritative):** `delivery-plan-checklist.md`, `slot-NN-finished.md`, `run-log.jsonl` in this folder
- **Stages:** shaping (waived) · discovery · exploration · specification · engineering
- **Roles:** product-owner · business-expert · ux-designer · engineer
- **Agent mode:** local Runs 1–2; switch to **cloud** before Run 3 (after Run 2 slot 19 checkpoint)
- **Notifications:** `cursor-teams` — set `teams_webhook_url` in `~/.cursor/cli-config.json` (or `cli_harness/cli-config.json`); harness posts on slot start, finish, block, and stall
- **Run 1 gate:** operator CHECKPOINT after Discovery stage (slot 06); then author Run 2 slots
- **Run 2:** operator CHECKPOINT after Exploration (10), Specification (15), Engineering (19)
- **Runs 3+:** operator CHECKPOINT after full run only

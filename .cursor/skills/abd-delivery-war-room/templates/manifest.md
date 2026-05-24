# War Room Manifest

```yaml
goal: "<one-line engagement goal>"
profile: greenfield | brownfield | small-build | feature | bespoke
autonomy: tight | moderate | full
checkpoint_policy: after_every_slot | after_every_run | on_block_only
run_sizing_policy:
  stories_per_slot: 2
  stages_per_run: 1
  stall_timeout_minutes: 15
  notification_detail: high
```

## Slots

```yaml
slots:
  - id: "01"
    run: "Run 1 — <run name>"
    stage: shaping | discovery | exploration | specification | engineering
    role: product-owner | business-expert | ux-designer | engineer
    skills:
      - <practice-skill-name>
    expected_artifacts:
      - <artifact-path>
    entry_conditions:
      - <precondition from stages/<stage>.md>
    early_question_triggers:
      - <trigger-name>
```

## Notes

- Delivery lead agent writes this after operator approves the agile delivery plan.
- **Progress:** `delivery-plan-checklist.md` in this folder (generated from `agile-delivery-plan.md`); slot completion = `slot-NN-finished.md`.
- `run_sizing_policy` is updated by the lead after each run; the CLI harness reads it.
- Operator can override runs upfront; lead documents overrides with rationale.
- Slot definitions are added one at a time as the prior slot finishes.

---
name: abd-delivery-war-room
description: >-
  File-based war room for `delivery-lead`, `delivery-team-member`, and the CLI harness:
  `delivery-war-room/` under the engagement workspace is the **authoritative source of
  all delivery progress** — orchestration checklist, manifest, slots, run log, and harness
  config. Read this skill before Step 2 when running with the CLI harness.
---

# abd-delivery-war-room

## Purpose

Single on-disk home for **progress**, **handoffs**, and **harness state**. The delivery lead, team members, operator, and CLI harness all read and write here.

## Progress authority

| What | Where | Who updates |
| --- | --- | --- |
| Orchestration + run/stage checkboxes | `delivery-plan-checklist.md` | Delivery lead (`track_task` generator + manual `- [x]`) |
| Slot completion | `slot-NN-finished.md` | Team member (harness detects) |
| Active slot / harness policy | `manifest.md`, `slot-NN-start.md` | Delivery lead |
| Audit trail | `run-log.jsonl` | Harness + lead |
| Blockers | `slot-NN-blocked.md`, `slot-NN-answer.md` | Team member / operator |

**Resume rule:** read the war room first. First unchecked line in `delivery-plan-checklist.md` = orchestration/run/stage position. `slot-NN-finished.md` = slot done — do not ask “is it done?” when disk already says so.

**Per-stage checklist:** each stage tracks **executor** → **reviewer** (scanners + exit-gate review as **separate** checkboxes) → **rework** (fixes incorporated + re-scan) → **delivery-lead gate**. Tick every line; reviewer and rework are mandatory tracking steps, not optional prose.

## Bootcamp alignment

| Stages | `shaping` → `discovery` → `exploration` → `specification` → `engineering` |
| Roles | `product-owner`, `business-expert`, `ux-designer`, `engineer`, `reviewer` |

Stage gates and skill order: [`../../content/stages/README.md`](../../content/stages/README.md).

## Workspace layout

```text
<workspace>/docs/planning/
  abd-delivery-lead/
    agile-delivery-plan.md          # narrative plan (strategy, runs, slots in tables)
    agile-delivery-plan.changelog.md
  delivery-war-room/                # ← authoritative progress
    delivery-plan-checklist.md      # generated; orchestration + run/stage checkboxes
    INSTRUCTIONS.md                 # team member autostart
    manifest.md
    profile.md
    harness-config.json
    run-log.jsonl
    slot-01-start.md
    slot-01-finished.md
    …
```

Regenerate checklist after plan confirm or revision:

```bash
python skills/skill-helpers/track_task/scripts/generate_delivery_checklist.py --workspace <workspace>
```

## Delivery lead — start of a cycle

1. Create `<workspace>/docs/planning/delivery-war-room/`.
2. Copy **`templates/INSTRUCTIONS.md`** → `INSTRUCTIONS.md`.
3. Write `manifest.md`, `profile.md`, `harness-config.json`.
4. Regenerate **`delivery-plan-checklist.md`** into the war room (from `agile-delivery-plan.md`).
5. Initialize `run-log.jsonl`.
6. Write **only** `slot-01-start.md` first.

## Team member — autostart

If `INSTRUCTIONS.md` exists:

1. Read `INSTRUCTIONS.md` → read `workspace` from the active `slot-NN-start.md`.
2. Read `manifest.md`, pick active `NN` (smallest slot with start present, finished absent).
3. Read `slot-NN-start.md`, then continue per `delivery-team-member/AGENT.md` Step 1.

## Team member — when finished

Write `slot-NN-finished.md` with: timestamp, artifact paths, scanner results, stage-complete status.

- **Executor slots** — use `templates/slot-finished.md`.
- **Reviewer slots** — use `templates/slot-finished-reviewer.md` (findings only; no new artifacts).

## Reviewer slot

When `team-role: reviewer` in the slot start file:

1. Read the **prior executor** `slot-NN-finished.md` and every artifact path listed.
2. Run scanners via `execute-skill-using-skills-rules` — record pass/fail per skill (**reviewer scanned**).
3. Validate exit-gate items from `stages/<stage>.md` — record pass/fail and findings (**reviewer reviewed**).
4. Write reviewer `slot-MM-finished.md`. Do not produce new stage artifacts.

If findings require fixes, stop. The delivery lead logs corrections, authors a **rework** executor slot, and ticks **Rework** lines in `delivery-plan-checklist.md` when fixes are incorporated and re-scanned.

## Delivery lead — chaining slots

After validating slot NN, read `slot-NN-finished.md`, tick matching lines in `delivery-plan-checklist.md` (executor, reviewer, rework — each checkbox separately), then create `slot-(NN+1)-start.md`.

## Templates

Copy from `templates/` into the engagement war room: `INSTRUCTIONS.md`, `manifest.md`, `profile.md`, `slot-start.md`, `slot-finished.md`, `slot-finished-reviewer.md`, `slot-blocked.md`, `slot-answer.md`.

## Limits

- Cursor cannot spawn chats for you; someone still opens **New chat** for each agent.
- Exit gates remain in `stages/*.md`; war room records state, it does not replace stage definitions.

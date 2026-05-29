# Delivery war room — role agent autostart

Eight **persistent role agents** pull work from the **Kanban board** (`board.json`). Open the agent matching your role — not one chat per slot.

Kanban model: `.cursor/content/kanban.md`

| You are | Agent |
| --- | --- |
| Product Owner executor | `.cursor/agents/product-owner/AGENT.md` |
| Product Owner reviewer | `.cursor/agents/product-owner-reviewer/AGENT.md` |
| Business Expert executor | `.cursor/agents/business-expert/AGENT.md` |
| Business Expert reviewer | `.cursor/agents/business-expert-reviewer/AGENT.md` |
| UX Designer executor | `.cursor/agents/ux-designer/AGENT.md` |
| UX Designer reviewer | `.cursor/agents/ux-designer-reviewer/AGENT.md` |
| Engineer executor | `.cursor/agents/engineer/AGENT.md` |
| Engineer reviewer | `.cursor/agents/engineer-reviewer/AGENT.md` |

Shared queue rules: `.cursor/agents/_shared/work-queue.md`

## 1) Workspace

Bootstrap must include **`workspace`**: `c:\dev\abd-pet-store-demo`. Use it for every `--workspace` flag, scanner path, and `story-graph-ops` call.

## 2) Kanban board

Read `docs/planning/delivery-war-room/board.json` and `manifest.md`.

Each **run** = one **ticket** in **one column**: `backlog` · `in_progress` · `review` · `done` · `blocked` · `stalled`.

Stage flow on a ticket: **in_progress → review → done** (no Ready).

**Resume order:** read **`board.json`** first, then checklist `<!-- resume: slot NN -->`.

## 3) Claim next slot

1. Read **`board.json`** — find tickets in your column (`in_progress` for executors, `review` for reviewers).
2. Resolve `active_slot` or smallest eligible `slot-NN-start.md` for your `team-role` and `slot_type`.
3. Verify every id in **`depends_on`** has a finished file and no conflicting `slot-*-claim.md`.
4. Write `slot-NN-claim.md` before starting.

**Cross-run:** separate tickets can be active (e.g. Run 5 engineering + Run 6 exploration). Run N+1 opens after Run N **specification exit** — not engineering exit. See `manifest.md` `cross_run_pipeline` and `_shared/work-queue.md`.

If none qualify, report **no pending work for this role**.

## 4) Handoff

Read `slot-NN-start.md` for scope, stage, **`skills`**, corrections, and entry conditions.

**If `slot_type: reviewer`** — read prior executor finished file + `artifact_paths` only. Use reviewer finished template. Do not produce new stage artifacts.

**If `slot_type: executor`** — follow your role agent + `_shared/executor-workflow.md`.

## 5) Mid-slot checkpoint

Waived when `manifest.md` `checkpoint_policy: on_block_only`.

## 6) Story graph update

After confirmation, update `docs/story/story-graph.json` via `story-graph-ops` when the skill produces graph content.

## 7) When done

Write `slot-NN-finished.md`. Remove `slot-*-claim.md`. Claim next eligible slot in the same session. Delivery lead re-syncs **`board.json`** and checklist.

## 8) When blocked or stalled

**Blocked:** write `slot-NN-blocked.md` — ticket column `blocked`. Clear via `slot-NN-answer.md`.

**Stalled:** claim open past `stall_timeout_minutes` — delivery lead nudges; ticket column `stalled` on sync.

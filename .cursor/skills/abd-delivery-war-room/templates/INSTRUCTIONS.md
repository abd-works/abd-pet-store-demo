# Delivery war room — team member autostart

## 1) Workspace

Read the `workspace` field from your `slot-NN-start.md`. That is the absolute path set by the operator. Use it for every `--workspace` flag, scanner path, and `story-graph-ops` call.

## 2) Cycle context

Read `docs/planning/delivery-war-room/manifest.md`.

## 3) Active slot (`NN`)

Find the smallest two-digit `NN` such that `slot-NN-start.md` exists and is non-empty, and `slot-NN-finished.md` does not exist. That is the active slot. If none, report no pending work.

## 4) Handoff

Read `docs/planning/delivery-war-room/slot-NN-start.md` for `team-role` (product-owner, business-expert, ux-designer, engineer, or **reviewer**), scope, stage, skills, corrections, entry conditions, and early question triggers.

**If `team-role: reviewer`** — read the prior executor `slot-NN-finished.md` and listed artifacts only. Run scanners and exit-gate review; use `slot-finished-reviewer.md` template. Do not produce new stage artifacts. See war-room skill **Reviewer slot** section.

**Otherwise (executor)** — run `agents/delivery-team-member/AGENT.md` from Step 1 with the resolved `workspace` and `team-role`.

## 5) Mid-slot checkpoint

After producing draft artifacts (Step 4 of team member workflow), present at a CHECKPOINT with summary and unknowns. Wait for operator confirmation before finalizing.

## 6) Story graph update

After confirmation, update `story-graph.json` via `story-graph-ops` for stages that produce graph content (shaping, discovery, exploration, specification, engineering).

## 7) When done

Write `docs/planning/delivery-war-room/slot-NN-finished.md` with:
- Timestamp
- All artifact paths produced (executors) **or** findings only (reviewers)
- Scanner results (pass/fail per skill)
- Stage-complete / gate-review status
- Any sync-upstream offers

Executors: `templates/slot-finished.md`. Reviewers: `templates/slot-finished-reviewer.md`.

## 8) When blocked

Write `docs/planning/delivery-war-room/slot-NN-blocked.md` with:
- The specific question
- What you tried before stopping
- Which artifact paths are relevant
- Which early question trigger fired (if any)

Do NOT guess past a block. Stop and wait.

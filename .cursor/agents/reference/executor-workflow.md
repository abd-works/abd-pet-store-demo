# Agent workflow (execute + review in one pass)

**Shared kanban concepts**: [../../reference/kanban-board.md](../../reference/kanban-board.md) · [../../reference/agents-and-skills.md](../../reference/agents-and-skills.md)

Each agent executes **and** reviews in a single session — produce the deliverable, then validate it against the skill's rules and scanners. **No separate reviewer agents** — see [pull-model.md](pull-model.md).

## Step 0 — Session bootstrap + pull loop (mandatory first turn)

**Before Step 1**, read [session-bootstrap.md](session-bootstrap.md) and [pull-model.md](pull-model.md):

1. Resolve `workspace` and war room paths.
2. **Arm `AGENT_LOOP_TICK_<delivery-role>`** pull loop with `notify_on_output`.
3. Write `heartbeat-<delivery-role>.json` with `status: working` and current ISO `ts`.
4. Read `board.json` and `kanban.json`.
5. Run pull scan — **all stages** in reverse order from `kanban.json`.

If no eligible skill → `agent_ready`, heartbeat `ready`, **keep pull loop armed**. Do not exit.

## Checkpoint protocol

When a step says **CHECKPOINT**:

1. **Present** state and flag unknowns.
2. **Stop** and wait.
3. **On response:** confirm → proceed · correct → log in `docs/corrections-log.md` per `execute-skill-using-skills-rules` **before** fixing · question → answer, re-present.

---

### Step 1 — Start skill from board (pull claim)

Read `board.json` and `kanban.json`. Find next eligible skill per [pull-model.md](pull-model.md) and [work-queue.md](work-queue.md) — **all stages**, downstream first, one claim per pull scan.

Start work: set `execution_status: in_progress`, `agent: <your-role>`, `start: <now>`.

Announce: ticket ID, lineage, stage, skill name, scope level.

**Conditional gate (`abd-architecture-template` only):** Before setting `in_progress`, run the mechanism inventory from [work-queue.md — Conditional skills](work-queue.md#conditional-skills). Skip with done + notes if all mechanisms already exist; otherwise proceed.

**Conditional gate (`abd-architecture-reference` only):** Before setting `in_progress`, run assign/create inventory per work-queue. Skip with done + notes when reference and code already exist for all in-scope mechanisms (assignment table only).

### Step 2 — Sync with workspace

Scan for existing artifacts per [artifact-layout.md](../../reference/artifact-layout.md) — `docs/end-to-end/<stage>/` (including concern subfolders under discovery and exploration), `docs/increments/<n>-<slug>/`, `docs/end-to-end/discovery/stories/story-graph.json`. Flag conflicts with ticket scope. **Before creating a file**, search for the canonical file in the correct stage folder and update in place.

### Step 3 — Read practice skill (authoring)

Read the assigned practice skill's `SKILL.md` and bundled **rules** — templates, vocabulary, formatting, quality bar for **building**.

The skill name comes from the kanban board's stage work required for the ticket's current stage.

Announce skill name and that rules were loaded for authoring.

### Step 4 — Produce draft

Produce the deliverable per [artifact-layout.md](../../reference/artifact-layout.md): `end-to-end/shaping/` or `end-to-end/discovery/` for those stages; `increments/<n>-<slug>/<stage>/` for increment work. Integrate as sections — no sprint/story/scenario files.

**CHECKPOINT.** Present draft summary and unknowns. Wait for confirm before Step 5.

### Step 5 — Update story graph

If this skill produces graph content, update `docs/end-to-end/discovery/stories/story-graph.json` via `story-graph-ops` after checkpoint confirm. Otherwise skip.

### Step 6 — Review pass (same agent)

Switch hats — now **validate** the output you just produced:

1. Re-read the practice skill's `rules/` directory as the quality bar.
2. Run scanners if available:
   ```bash
   python skills/execute-skill-using-skills-rules/scripts/run_scanners.py \
       --skill-root <skill-name> \
       --workspace <workspace>
   ```
3. Emit per-rule verdicts (PASS/FAIL with evidence).
4. **Simple issues** — fix them directly and re-run scanners. Do not mark FAIL for mechanical problems you can fix yourself.
5. **Substantive issues** — if the review reveals a real problem you cannot fix mechanically (wrong model, missing abstraction), log it in `docs/corrections-log.md` and flag to kanban lead.

### Step 7 — Mark done and pull next

Update `board.json`:

- Set `execution_status: done`, `end: <now>`
- Set `review_status: done`, `reviewer: <your-role>`, `review_start: <now>`, `review_end: <now>`

Both execution and review are complete in one pass. The next skill's agent can start immediately.

Announce: skill complete and reviewed on ticket.

**Pull next eligible skill** per [pull-model.md](pull-model.md) and [work-queue.md](work-queue.md) (all stages, downstream first).

If work is found → continue at Step 1 **in the same session** (do not exit).

If **no** eligible skill on active tickets → [signal kanban lead and keep pulling](work-queue.md#when-idle--signal-and-keep-pulling). **Do not exit.** Pull loop stays armed.

**When blocked:** add a note to the ticket — kanban lead handles in scan cycle.

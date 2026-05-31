# War room — agent bootstrap

**Read first (mandatory):**

1. `.cursor/agents/reference/session-bootstrap.md` — loop wiring, paths, heartbeats
2. `.cursor/agents/reference/pull-model.md` — **all stages, all roles, continuous pull**
3. `.cursor/reference/artifact-layout.md` — **where to read and write docs**

## Artifact paths (summary)

```text
docs/end-to-end/
  shaping/                    ← flat
  discovery/                  ← domain/, stories/, ux/, architecture/
  exploration/                ← same four subfolders (rolled up from increments)
  specification/              ← flat
  engineering/                ← flat
docs/increments/<n>-<slug>/   ← e.g. 8-marketing-engine
  exploration/                ← domain/, stories/, ux/, architecture/
  specification/              ← flat
  engineering/                ← flat
```

- Shaping → `docs/end-to-end/shaping/`. Discovery → `docs/end-to-end/discovery/{domain,stories,ux,architecture}/`.
- Active increment → `docs/increments/<n>-<slug>/`; exploration uses the same four subfolders.
- Increment archived → kanban lead merges into matching `docs/end-to-end/<stage>/` (per subfolder for exploration).
- One canonical file per type per folder — no sprint/story/scenario docs.
- Story graph: `docs/end-to-end/discovery/stories/story-graph.json`. Increment names: `discovery/stories/thin-slicing.md`.

## Pull rules (summary)

- **Delivery roles (BE, PO, UX, Engineer):** Turn 1 → arm `AGENT_LOOP_TICK_<role>` → pull scan **all active tickets, all stages** (downstream first per `kanban.json`) → claim → execute → review → **pull again**. Never exit after one skill.
- **Kanban lead:** Turn 1 → arm `AGENT_LOOP_TICK_kanban_lead` → every scan: advance/scatter, roll up completed increments, pull backlog on `agent_ready`, spawn/re-spawn **executor** agents when eligible work exists. **No reviewer agents.**

## War room paths

| File | Purpose |
| --- | --- |
| `board.json` | Tickets, skill_progress |
| `kanban.json` | Stages (authoritative order), stage work required, team |
| `metrics-log.jsonl` | `agent_ready`, `ticket_pulled`, `increment_rollup`, … |
| `heartbeat-*.json` | Liveness |

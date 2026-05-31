# PawPlace documentation layout

Delivery artifacts follow the kanban **end-to-end + increments** structure. See `.cursor/reference/artifact-layout.md` for the full spec.

```text
docs/
  end-to-end/                    # Whole solution — one subfolder per stage
    shaping/
    discovery/                   # story-graph.json, story-map, domain-terms, IA, blueprint
    exploration/                 # domain/, stories/, ux/, architecture/ (rolled up from increments)
    specification/
    engineering/
  increments/                    # Active increment work
    <n>-<slug>/                  # e.g. 8-marketing-engine — see increments/README.md
      exploration/
      specification/
      engineering/
  planning/
    delivery-war-room/           # board machine (board.json, kanban.json, heartbeats)
  _legacy-pre-kanban/            # Pre-migration archive (do not write here)
```

**Rules**

- Files are **flat inside each stage folder** — no `domain/`, `story/`, or `ux/` family folders.
- While an increment is active, write exploration / specification / engineering under `increments/<n>-<slug>/` (name from `thin-slicing.md`).
- When an increment is fully archived, the kanban lead merges its stage folders into `end-to-end/<stage>/`.

**Migration**

One-time migration script: `planning/migrate-kanban-docs-layout.py`. Path mapping: `planning/docs-layout-migration-map.txt`.

# PawPlace — Domain Modeling Process

## Steps

- [x] **1. Scaffold** — Create workspace structure (`docs/`, `external-context/`)
- [x] **2. Key Abstractions** — Extract domain terms (via module-partition skill), group into KAs with prose definitions, decisions, and verbatim source blocks → `docs/key-abstractions.md`
- [x] **3. Story Mapping** — Structure product discovery into epics, sub-epics, stories → `docs/story-map.md` + `docs/story-graph.json`
- [x] **4. Thin Slicing** — 9 vertical, store-first delivery increments → `docs/thin-slicing.md` + `.txt`
- [x] **5. Domain Sketch** — Standalone per-phase file with `## **KA** → ### **concept** → ### references → ### decisions made` flat shape → `docs/domain-sketch.md`
- [x] **6. Acceptance Criteria** — Write behavioral WHEN/THEN AC per story, per increment → `docs/acceptance-criteria/increment-{1..9}-acceptance-criteria.md`

- [x] **7. CRC Cards** — Assign responsibilities, collaborators, and invariants per domain concept → `docs/crc.md`
- [ ] **8. Scenario Walkthrough** — Walk key scenarios through the CRC model to find gaps
- [ ] **9. Object Model** — Build the typed object model from CRC

## Artifacts

| Step | Output | Status |
|---|---|---|
| 1 | `docs/`, `external-context/` | done |
| 2 | `docs/key-abstractions.md` (state: key-abstractions) | done — to be re-split into `docs/paw-place-key-abstractions.md` per new per-phase rule |
| 3 | `docs/story-map.md` + `docs/story-graph.json` (Level 2, 10 epics, 65 stories) | done |
| 5 | `docs/domain-sketch.md` (state: domain-sketch, flat shape) | done |
| 4 | `docs/thin-slicing.md` + `.txt` (9 increments, value-first, store-supporting) | done |
| 6 | `docs/acceptance-criteria/increment-{1..9}-acceptance-criteria.md` + `.txt` (WHEN/THEN per story) | done |
| 7 | `docs/crc.md` (state: crc, flat shape, 8 KAs + 2 boundary) | done |

## Skills used

| Step | Skill |
|---|---|
| 2 | `abd-module-partition` → `abd-key-abstractions` |
| 3 | `abd-story-mapping` |
| 4 | `abd-domain-sketch` |
| 5 | `abd-acceptance-criteria` |
| 6 | `abd-thin-slicing` |
| 7 | `abd-class-responsibility-collaborator` |
| 8 | `abd-scenario-walkthrough` |
| 9 | `abd-object-model` |

## Corrections

- `corrections-log.md` — Domain attribute details removed from story names (belong in KA term definitions, not story titles)

## Source

- `external-context/requirements-chat-with-product-owner.md` — PawPlace product owner requirements chat

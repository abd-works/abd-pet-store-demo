#!/usr/bin/env python3
"""Build docs/domain/ubiquitous-language.drawio from ubiquitous-language.md.

Parses Ubiquitous Language concept blocks into Draw.io class diagrams —
one page per Key Abstraction. Re-run after UL changes.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SKILL_SCRIPTS = REPO_ROOT / ".cursor/skills/drawio-domain-sync/scripts"
sys.path.insert(0, str(SKILL_SCRIPTS))

from drawio_tools import (  # noqa: E402
    CELL_WIDTH,
    add_page,
    audit_diagram_report,
    create_class_cell,
    create_edge,
    create_empty_mxfile,
    find_cell_by_name,
    save_drawio,
)

ULL_PATH = REPO_ROOT / "docs/domain/ubiquitous-language.md"
DRAWIO_PATH = REPO_ROOT / "docs/domain/ubiquitous-language.drawio"

# Increment 6 active KAs — Pet and Appointment added for pet visits increment
ACTIVE_KAS = {
    "Product Catalog",
    "Pet",
    "Appointment",
    "Store",
    "Customer Account",
    "Order",
    "Payment",
    "Notification",
}

ITALIC_RE = re.compile(r"\*([^*]+)\*")
SUBTYPE_RE = re.compile(r"^### (.+?) \*is a type of\* (.+)$")
CONCEPT_RE = re.compile(r"^### (.+)$")
KA_RE = re.compile(r"^## (.+)$")


def _normalize_name(raw: str) -> str:
    return raw.strip().lower()


def _title_case(raw: str) -> str:
    return " ".join(w.capitalize() if w.lower() not in ("and", "of") else w for w in raw.split())


def parse_ull(path: Path) -> dict[str, list[dict]]:
    """Return {ka_name: [concept_dict, ...]}."""
    text = path.read_text(encoding="utf-8")
    in_core = False
    current_ka: str | None = None
    kas: dict[str, list[dict]] = {}

    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip() == "# Core Domain":
            in_core = True
            i += 1
            continue
        if line.startswith("# Boundary Domain"):
            break
        if not in_core:
            i += 1
            continue

        ka_match = KA_RE.match(line)
        if ka_match and not line.startswith("###"):
            current_ka = ka_match.group(1).strip()
            kas.setdefault(current_ka, [])
            i += 1
            continue

        if current_ka and line.startswith("### "):
            heading = line[4:].strip()
            subtype_match = SUBTYPE_RE.match(heading)
            if subtype_match:
                name, base = subtype_match.group(1).strip(), subtype_match.group(2).strip()
                concept = {
                    "name": name,
                    "kind": "subtype",
                    "base": base,
                    "rows": [],
                    "invariants": [],
                }
            elif heading in ("Decisions made", "References"):
                i += 1
                continue
            else:
                concept = {
                    "name": heading,
                    "kind": "concept",
                    "base": None,
                    "rows": [],
                    "invariants": [],
                }
            kas[current_ka].append(concept)
            i += 1
            while i < len(lines):
                bl = lines[i]
                if bl.startswith("## ") or bl.startswith("### ") or bl.strip() == "---":
                    break
                if bl.startswith("- "):
                    body = bl[2:].strip()
                    if body.startswith("**Invariant:**"):
                        concept["invariants"].append(body.replace("**Invariant:**", "").strip())
                    elif body.startswith("*(property") or body.startswith("*(presentation") or body.startswith("*(computed") or body.startswith("*(customer") or body.startswith("*(sort"):
                        concept["rows"].append(body)
                    else:
                        plain = ITALIC_RE.sub(r"\1", body)
                        collabs = [c.strip() for c in ITALIC_RE.findall(body)]
                        collab_str = ", ".join(_title_case(c) for c in collabs) if collabs else ""
                        row = f"{plain} : {collab_str}" if collab_str else plain
                        concept["rows"].append(row)
                i += 1
            continue
        i += 1
    return kas


def _concept_display_name(name: str) -> str:
    if " *is a type of* " in name:
        return name.split(" *is a type of* ")[0]
    return name


def _all_concept_names(kas: dict[str, list[dict]]) -> set[str]:
    names: set[str] = set()
    for concepts in kas.values():
        for c in concepts:
            names.add(_normalize_name(_concept_display_name(c["name"])))
            if c.get("base"):
                names.add(_normalize_name(c["base"]))
    return names


def _resolve_collaborator(term: str, local_names: set[str], all_names: set[str]) -> str | None:
    key = _normalize_name(term)
    if key in local_names:
        return None
    if key in all_names:
        return _title_case(term)
    return None


def render_page(root, ka_name: str, concepts: list[dict], all_names: set[str]) -> None:
    local_names = {_normalize_name(_concept_display_name(c["name"])) for c in concepts}
    cells: dict[str, object] = {}
    y = 40
    x = 40
    col = 0

    for concept in concepts:
        display = _concept_display_name(concept["name"])
        props = [r for r in concept["rows"] if not r.startswith("is a ")]
        ops = []
        invs = concept["invariants"]
        cx = x + col * (CELL_WIDTH + 40)
        cy = y
        cell = create_class_cell(
            root,
            _title_case(display),
            base=concept.get("base"),
            properties=props[:8],
            operations=ops,
            invariants=invs,
            x=cx,
            y=cy,
        )
        cells[_normalize_name(display)] = cell
        col += 1
        if col >= 3:
            col = 0
            y += 280

    # Inheritance edges
    for concept in concepts:
        if concept.get("kind") == "subtype" and concept.get("base"):
            child_key = _normalize_name(concept["name"])
            parent_key = _normalize_name(concept["base"])
            if child_key in cells and parent_key in cells:
                create_edge(
                    root,
                    cells[child_key].get("id"),
                    cells[parent_key].get("id"),
                    "inheritance-orthogonal",
                )

    # Association edges from italicized collaborators (folded)
    seen_edges: set[tuple[str, str]] = set()
    for concept in concepts:
        src_key = _normalize_name(_concept_display_name(concept["name"]))
        if src_key not in cells:
            continue
        for row in concept["rows"]:
            for term in ITALIC_RE.findall(row):
                target = _resolve_collaborator(term, local_names, all_names)
                if not target:
                    continue
                tgt_key = _normalize_name(term)
                edge_key = (src_key, tgt_key)
                if edge_key in seen_edges:
                    continue
                tgt_cell = cells.get(tgt_key) or find_cell_by_name(root, _title_case(term))
                if tgt_cell is None:
                    continue
                seen_edges.add(edge_key)
                create_edge(
                    root,
                    cells[src_key].get("id"),
                    tgt_cell.get("id") if hasattr(tgt_cell, "get") else tgt_cell,
                    "association",
                )


def main() -> int:
    kas = parse_ull(ULL_PATH)
    all_names = _all_concept_names(kas)

    mxfile = create_empty_mxfile()
    for ka_name in kas:
        if ka_name not in ACTIVE_KAS:
            continue
        _, root = add_page(mxfile, ka_name)
        render_page(root, ka_name, kas[ka_name], all_names)

    save_drawio(DRAWIO_PATH, mxfile)
    print(f"Wrote {DRAWIO_PATH}")
    print(audit_diagram_report(DRAWIO_PATH))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

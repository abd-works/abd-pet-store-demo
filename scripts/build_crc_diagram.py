#!/usr/bin/env python3
"""
Build a Draw.io class diagram from the PawPlace CRC model.

Each Key Abstraction becomes one page. CRC responsibilities render as
operation rows with `name : Collaborator` notation. Cross-KA collaborators
appear as imported classes with dashed borders.

Usage:
    python scripts/build_crc_diagram.py
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SKILL_SCRIPTS = REPO_ROOT / ".cursor" / "skills" / "drawio-domain-sync" / "scripts"
sys.path.insert(0, str(SKILL_SCRIPTS))

from drawio_tools import (
    create_empty_mxfile,
    add_page,
    get_page,
    save_drawio,
    create_class_cell,
    create_edge,
    find_cell_by_name,
    calc_cell_height,
    audit_diagram_report,
    CELL_WIDTH,
    LINE_HEIGHT,
)

CRC_PATH = REPO_ROOT / "docs" / "domain" / "crc.md"
OUTPUT_PATH = REPO_ROOT / "docs" / "domain" / "crc-class-diagram.drawio"

CELL_W = 300
COL_GAP = 100
ROW_GAP = 80
IMPORT_ROW_GAP = 30
PAGE_W = 6000
PAGE_H = 5000


# ---------------------------------------------------------------------------
# CRC Parser
# ---------------------------------------------------------------------------

def parse_crc(path: Path):
    """Parse the CRC markdown into a structured dict.

    Returns: {ka_name: {description, classes: [{name, base, responsibilities, invariants}]}}
    """
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")

    kas = {}
    current_ka = None
    current_class = None
    in_references = False
    in_decisions = False
    in_boundary = False

    for line in lines:
        stripped = line.strip()

        # Boundary domain section
        if stripped == "# Boundary Domain":
            in_boundary = True
            continue

        # KA heading: ## **Name**
        ka_match = re.match(r"^##\s+\*\*(.+?)\*\*\s*$", stripped)
        if ka_match and not in_boundary:
            ka_name = ka_match.group(1)
            current_ka = ka_name
            kas[ka_name] = {"classes": [], "description": ""}
            current_class = None
            in_references = False
            in_decisions = False
            continue

        # Class heading: ### **Name** or ### **Name : Base**
        class_match = re.match(r"^###\s+\*\*(.+?)\*\*\s*$", stripped)
        if class_match and current_ka and not in_references and not in_decisions:
            raw = class_match.group(1)
            base = None
            if " : " in raw:
                name, base = raw.split(" : ", 1)
                name = name.strip()
                base = base.strip()
            else:
                name = raw
            current_class = {
                "name": name,
                "base": base,
                "responsibilities": [],
                "invariants": [],
            }
            kas[current_ka]["classes"].append(current_class)
            continue

        # Boundary class: ### **Name** *(owned by: ...)*
        boundary_match = re.match(
            r"^###\s+\*\*(.+?)\*\*\s+\*\(owned by:\s*(.+?)\)\*\s*$", stripped
        )
        if boundary_match and in_boundary:
            name = boundary_match.group(1)
            owner = boundary_match.group(2)
            if "Boundary" not in kas:
                kas["Boundary"] = {"classes": [], "description": "Boundary domain concepts"}
            current_ka = "Boundary"
            current_class = {
                "name": name,
                "base": None,
                "responsibilities": [],
                "invariants": [],
                "boundary_owner": owner,
            }
            kas["Boundary"]["classes"].append(current_class)
            continue

        # References / decisions section markers
        if stripped == "### references":
            in_references = True
            current_class = None
            continue
        if stripped == "### decisions made":
            in_decisions = True
            current_class = None
            continue
        if stripped == "---":
            in_references = False
            in_decisions = False
            continue

        if current_class is None or in_references or in_decisions:
            continue

        # Responsibility line: text | Collaborator(s)
        # or property line: text |
        # or invariant continuation: | invariant: text
        resp_match = re.match(r"^(.+?)\s*\|\s*(.*)$", stripped)
        if resp_match:
            left = resp_match.group(1).strip()
            right = resp_match.group(2).strip()

            if not left and right.startswith("invariant:"):
                inv_text = right[len("invariant:"):].strip()
                current_class["invariants"].append(inv_text)
            elif left:
                collabs = []
                if right and not right.startswith("invariant:") and not right.startswith("("):
                    collabs = [c.strip() for c in right.split(",") if c.strip()]
                current_class["responsibilities"].append({
                    "name": left,
                    "collaborators": collabs,
                })
            elif not left and right.startswith("("):
                pass  # value constraint — skip
            continue

    return kas


# ---------------------------------------------------------------------------
# Layout engine
# ---------------------------------------------------------------------------

def _class_height(cls):
    """Estimate cell height from content."""
    props = [r for r in cls["responsibilities"] if not r["collaborators"]]
    ops = [r for r in cls["responsibilities"] if r["collaborators"]]
    inv_count = min(len(cls["invariants"]), 5)  # cap displayed invariants
    return calc_cell_height(len(props), len(ops), inv_count)


def _order_by_connectivity(classes):
    """Reorder classes so that heavily connected pairs are adjacent in the list."""
    local_names = {c["name"] for c in classes}
    by_name = {c["name"]: c for c in classes}

    # Build adjacency counts (local only)
    adj = {}
    for cls in classes:
        adj[cls["name"]] = {}
        for r in cls["responsibilities"]:
            for collab in r["collaborators"]:
                if collab in local_names and collab != cls["name"]:
                    adj[cls["name"]][collab] = adj[cls["name"]].get(collab, 0) + 1

    # Add reverse direction
    for name, targets in list(adj.items()):
        for t, count in targets.items():
            adj.setdefault(t, {})[name] = adj[t].get(name, 0) + count

    # Greedy walk: start with most-connected class, pick nearest unvisited neighbor
    remaining = set(c["name"] for c in classes)
    if not remaining:
        return classes

    # Start with the class that has the most total connections
    start = max(remaining, key=lambda n: sum(adj.get(n, {}).values()))
    ordered_names = [start]
    remaining.remove(start)

    while remaining:
        current = ordered_names[-1]
        neighbors = adj.get(current, {})
        # Pick the most-connected unvisited neighbor
        best = None
        best_score = -1
        for n in remaining:
            score = neighbors.get(n, 0)
            if score > best_score:
                best_score = score
                best = n
        if best is None:
            best = next(iter(remaining))
        ordered_names.append(best)
        remaining.remove(best)

    return [by_name[n] for n in ordered_names]


def _layout_classes(classes, start_x=40, start_y=40, max_cols=4):
    """Position classes in a grid. Returns dict: class_name -> (x, y, h).

    Inheritance hierarchy: base classes go first row, subtypes in second row,
    then remaining classes ordered by connectivity.
    """
    # Separate base classes and subtypes
    bases = [c for c in classes if c.get("base") is None]
    subtypes = [c for c in classes if c.get("base") is not None]

    # Order non-subtypes by connectivity, then append subtypes after their bases
    ordered_bases = _order_by_connectivity(bases)
    ordered_subtypes = _order_by_connectivity(subtypes) if subtypes else []

    # Place subtypes directly after their parent for adjacency
    ordered = []
    placed = set()
    for cls in ordered_bases:
        ordered.append(cls)
        placed.add(cls["name"])
        # Add subtypes of this class immediately after
        for sub in ordered_subtypes:
            if sub.get("base") == cls["name"] and sub["name"] not in placed:
                ordered.append(sub)
                placed.add(sub["name"])
    # Add remaining subtypes (base might be imported)
    for sub in ordered_subtypes:
        if sub["name"] not in placed:
            ordered.append(sub)

    positions = {}
    x, y = start_x, start_y
    row_max_h = 0
    col_idx = 0
    row_idx = 0

    for cls in ordered:
        h = _class_height(cls)
        # Stagger both axes so no two class centers share an exact coordinate
        y_stagger = col_idx * 17
        x_stagger = row_idx * 13
        positions[cls["name"]] = (x + x_stagger, y + y_stagger, h)
        row_max_h = max(row_max_h, h + y_stagger)
        col_idx += 1

        if col_idx >= max_cols:
            col_idx = 0
            x = start_x
            y += row_max_h + ROW_GAP
            row_max_h = 0
            row_idx += 1
        else:
            x += CELL_W + COL_GAP

    return positions


def _build_page(mxfile, ka_name, classes, all_kas):
    """Build one diagram page for a Key Abstraction."""
    _, root = get_page(mxfile, ka_name)
    if root is None:
        add_page(mxfile, ka_name, PAGE_W, PAGE_H)
        _, root = get_page(mxfile, ka_name)

    local_names = {c["name"] for c in classes}

    # Only import cross-KA BASE classes (inheritance), not all collaborators
    name_to_ka = {}
    for ka, data in all_kas.items():
        for c in data["classes"]:
            name_to_ka[c["name"]] = ka

    imports_to_add = {}
    for cls in classes:
        if cls.get("base") and cls["base"] not in local_names:
            source_ka = name_to_ka.get(cls["base"])
            if source_ka and source_ka != ka_name:
                imports_to_add[cls["base"]] = source_ka

    # Layout: imported classes at top, then local classes below
    import_y = 40
    import_x = 40
    import_positions = {}
    col_idx = 0
    max_import_cols = 6

    for imp_name in sorted(imports_to_add.keys()):
        import_positions[imp_name] = (import_x, import_y)
        col_idx += 1
        if col_idx >= max_import_cols:
            col_idx = 0
            import_x = 40
            import_y += 80 + IMPORT_ROW_GAP
        else:
            import_x += CELL_W + COL_GAP

    # Local classes start below imports
    local_start_y = import_y + 120 if imports_to_add else 40
    max_cols = 4 if len(classes) > 8 else 3
    if len(classes) > 15:
        max_cols = 5
    positions = _layout_classes(classes, start_x=40, start_y=local_start_y, max_cols=max_cols)

    # Create imported class cells
    for imp_name, source_ka in sorted(imports_to_add.items()):
        ix, iy = import_positions[imp_name]
        create_class_cell(
            root, imp_name,
            properties=[], operations=[],
            x=ix, y=iy, imported_from=source_ka,
        )

    # Create local class cells
    for cls in classes:
        cx, cy, _ = positions[cls["name"]]
        props = [r["name"] for r in cls["responsibilities"] if not r["collaborators"]]
        ops = [
            f'{r["name"]} : {", ".join(r["collaborators"])}'
            for r in cls["responsibilities"]
            if r["collaborators"]
        ]
        invs = cls["invariants"][:5]

        create_class_cell(
            root, cls["name"],
            base=cls.get("base"),
            properties=props,
            operations=ops,
            invariants=invs,
            x=cx, y=cy,
            imported_from=None,
        )

    # Add edges — only between local classes (plus inheritance to imports)
    _add_edges(root, classes, local_names, imports_to_add)


def _add_edges(root, classes, local_names, imports):
    """Add inheritance and association edges.

    Inheritance: always drawn (child -> parent), including to imports.
    Association: drawn only between LOCAL classes to keep diagrams readable.
    """
    # Inheritance edges (child -> parent)
    for cls in classes:
        if cls.get("base"):
            child_cell = find_cell_by_name(root, cls["name"])
            parent_cell = find_cell_by_name(root, cls["base"])
            if child_cell is not None and parent_cell is not None:
                try:
                    create_edge(
                        root,
                        child_cell.get("id"),
                        parent_cell.get("id"),
                        "inheritance-orthogonal",
                    )
                except ValueError:
                    pass

    # Association edges — only between local classes, one per unique pair
    added_edges = set()
    for cls in classes:
        for resp in cls["responsibilities"]:
            for collab in resp["collaborators"]:
                if collab in local_names and collab != cls["name"]:
                    pair = tuple(sorted([cls["name"], collab]))
                    if pair not in added_edges:
                        added_edges.add(pair)
                        src_cell = find_cell_by_name(root, cls["name"])
                        tgt_cell = find_cell_by_name(root, collab)
                        if src_cell is not None and tgt_cell is not None:
                            try:
                                create_edge(
                                    root,
                                    src_cell.get("id"),
                                    tgt_cell.get("id"),
                                    "association",
                                )
                            except ValueError:
                                pass


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"Parsing: {CRC_PATH}")
    kas = parse_crc(CRC_PATH)

    print(f"Found {len(kas)} Key Abstractions:")
    for ka_name, data in kas.items():
        print(f"  {ka_name}: {len(data['classes'])} classes")

    mxfile = create_empty_mxfile()

    # Build each KA page
    for ka_name, data in kas.items():
        if not data["classes"]:
            continue
        print(f"\nRendering page: {ka_name}")
        _build_page(mxfile, ka_name, data["classes"], kas)

    save_drawio(OUTPUT_PATH, mxfile)
    print(f"\nWrote: {OUTPUT_PATH}")

    # Run audit
    print("\n" + audit_diagram_report(str(OUTPUT_PATH)))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Build the PawPlace domain model class diagram.

Usage:
    python scripts/build_domain_model_diagram.py

Reads:  docs/end-to-end/specification/domain-model.md
Writes: docs/end-to-end/specification/domain-model-class-diagram.drawio

Layout strategy:
  - Full render via drawio_domain_cli (Sugiyama hierarchical layout).
  - Post-render moves for classes whose auto-layout put them in a column
    that causes definitive edge crossings:
      * Marketing Communication page — Notification Preferences moved to
        column 2 so Customer Account->Notification Preferences does not
        cross Account Settings.
      * Customer Review page — Product Details Page moved to column 2 so
        Product->Product Details Page does not cross Product Reviews,
        Star Rating, and Aggregate Star Rating.

Exit codes:
  0 — diagram written; no definitive edge_crosses_class violations.
  1 — definitive violations remain after all fixes.
"""

import subprocess
import sys
from pathlib import Path

# ── Resolve paths ────────────────────────────────────────────────────────────

repo_root = Path(__file__).resolve().parent.parent
source_md = repo_root / "docs" / "end-to-end" / "specification" / "domain-model.md"
output_drawio = (
    repo_root / "docs" / "end-to-end" / "specification" / "domain-model-class-diagram.drawio"
)

skill_scripts = Path(r"c:\dev\sandbox\.cursor\skills\drawio-domain-sync\scripts")
sys.path.insert(0, str(skill_scripts))

from drawio_tools import (
    load_drawio,
    get_page,
    find_cell_by_name,
    set_geometry,
    save_drawio,
    audit_diagram_report,
)

# ── Step 1: Full render via CLI ──────────────────────────────────────────────

cli = skill_scripts / "drawio_domain_cli.py"
result = subprocess.run(
    [sys.executable, str(cli), str(source_md), "--output", str(output_drawio)],
    capture_output=False,  # stream output so progress is visible
    env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"},
)
# CLI exits non-zero if definitive violations exist; we re-check after fixes.

# ── Step 2: Post-render layout fixes ────────────────────────────────────────

_, mxfile = load_drawio(str(output_drawio))

# Marketing Communication page — Notification Preferences sits below Account
# Settings in the same column.  Customer Account->Notification Preferences
# therefore cuts through Account Settings.  Moving it to column 2 clears the
# crossing.
_, root = get_page(mxfile, "Marketing Communication")
if root is not None:
    cell = find_cell_by_name(root, "Notification Preferences")
    if cell is not None:
        set_geometry(cell, x=400, y=1490)
        print("  [fix] Marketing Communication: Notification Preferences → x=400, y=1490")

# Customer Review page — Product Details Page sits below Product Reviews, Star
# Rating, and Aggregate Star Rating in the same column.  Product->Product
# Details Page cuts through all three.  Moving it to column 2 at the same row
# as Product clears the crossing.
_, root = get_page(mxfile, "Customer Review")
if root is not None:
    cell = find_cell_by_name(root, "Product Details Page")
    if cell is not None:
        set_geometry(cell, x=380, y=698)
        print("  [fix] Customer Review: Product Details Page → x=380, y=698")

save_drawio(str(output_drawio), mxfile)
print(f"\nSaved: {output_drawio}")

# ── Step 3: Audit ────────────────────────────────────────────────────────────

report = audit_diagram_report(str(output_drawio))
print("\n" + report)

definitive = [
    ln for ln in report.splitlines()
    if "[edge_crosses_class]" in ln and "(approx)" not in ln
]

if definitive:
    print(f"\nDefinitive edge_crosses_class violations ({len(definitive)}) — must fix:")
    for ln in definitive:
        print(" ", ln, file=sys.stderr)
    sys.exit(1)
else:
    print("\nNo definitive edge_crosses_class violations. Diagram is clean.")

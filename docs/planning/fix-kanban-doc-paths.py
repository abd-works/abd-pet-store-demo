#!/usr/bin/env python3
"""Second-pass path fixes after kanban docs layout migration."""

from __future__ import annotations

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
REPO = DOCS.parent
MAP = DOCS / "planning" / "docs-layout-migration-map.txt"

EXTS = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
SKIP_PARTS = {"node_modules", ".git", "_legacy-pre-kanban"}


def load_replacements() -> list[tuple[str, str]]:
    items: dict[str, str] = {}
    for line in MAP.read_text(encoding="utf-8").splitlines():
        if " -> " not in line:
            continue
        old, new = line.split(" -> ", 1)
        for prefix in ("docs/", ""):
            o = f"{prefix}{old}" if not old.startswith("docs/") else old
            n = f"{prefix}{new}" if not new.startswith("docs/") else new
            items[o] = n
    # lo-fi state/json targets (not in map as full paths)
    for n in range(1, 10):
        inc = f"docs/increments/increment-{n}/exploration"
        for pat in Path(DOCS / "increments" / f"increment-{n}" / "exploration").glob("*"):
            name = pat.name
            if name.endswith(("-state.json", ".drawio", ".md")) and name.startswith("increment-"):
                old_base = f"docs/ux/lo-fi/{name}"
                items[old_base] = f"{inc}/{name}"
    # increment AC drawio legacy
    for n in range(1, 10):
        items[f"docs/story/acceptance-criteria/increment-{n}-acceptance-criteria.drawio"] = (
            f"docs/end-to-end/exploration/increment-{n}-acceptance-criteria.drawio"
        )
    return sorted(items.items(), key=lambda x: -len(x[0]))


def apply_to_file(path: Path, replacements: list[tuple[str, str]]) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return False
    orig = text
    for old, new in replacements:
        text = text.replace(old, new)
        text = text.replace(old.replace("/", "\\"), new.replace("/", "\\"))
    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    replacements = load_replacements()
    targets = [REPO / "docs", REPO / "src", REPO / "packages", REPO / "apps", REPO / "test"]
    count = 0
    for base in targets:
        if not base.exists():
            continue
        for f in base.rglob("*"):
            if not f.is_file() or f.suffix not in EXTS:
                continue
            if any(p in SKIP_PARTS for p in f.parts):
                continue
            if f.name in ("migrate-kanban-docs-layout.py", "fix-kanban-doc-paths.py"):
                continue
            if apply_to_file(f, replacements):
                count += 1
    print(f"Updated {count} files.")


if __name__ == "__main__":
    main()

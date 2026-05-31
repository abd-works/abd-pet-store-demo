#!/usr/bin/env python3
"""Rename increment-N folders to N-meaningful-slug per artifact-layout."""

from __future__ import annotations

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
INC = REPO / "docs" / "increments"

# From docs/end-to-end/discovery/stories/thin-slicing.md marketable increment names
RENAMES = {
    "increment-1": "1-walk-in-driver",
    "increment-2": "2-click-and-collect",
    "increment-3": "3-ship-to-home",
    "increment-4": "4-returning-customers",
    "increment-5": "5-pay-your-way",
    "increment-6": "6-pet-visits",
    "increment-7": "7-returns-refunds",
    "increment-8": "8-marketing-engine",
    "increment-9": "9-power-ups",
}

EXTS = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
SKIP = {"node_modules", ".git", "_legacy-pre-kanban"}


def main() -> None:
    for old, new in RENAMES.items():
        src = INC / old
        dst = INC / new
        if src.exists() and not dst.exists():
            src.rename(dst)
            print(f"renamed {old} -> {new}")

    # longest-first path replacement in repo
    pairs = sorted(
        [(f"increments/{old}", f"increments/{new}") for old, new in RENAMES.items()]
        + [(f"docs/increments/{old}", f"docs/increments/{new}") for old, new in RENAMES.items()],
        key=lambda x: -len(x[0]),
    )

    count = 0
    for base in [REPO / "docs", REPO / "src", REPO / "packages", REPO / "apps", REPO / ".cursor"]:
        if not base.exists():
            continue
        for f in base.rglob("*"):
            if not f.is_file() or f.suffix not in EXTS:
                continue
            if any(p in SKIP for p in f.parts):
                continue
            if f.name in ("migrate-kanban-docs-layout.py", "fix-kanban-doc-paths.py", "rename-increment-folders.py"):
                continue
            try:
                text = f.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            orig = text
            for old, new in pairs:
                text = text.replace(old, new)
                text = text.replace(old.replace("/", "\\"), new.replace("/", "\\"))
            if text != orig:
                f.write_text(text, encoding="utf-8")
                count += 1
    print(f"Updated {count} files with new increment folder paths.")


if __name__ == "__main__":
    main()

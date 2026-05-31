#!/usr/bin/env python3
"""Reorganize docs/end-to-end/discovery/ into stories/, architecture/, ux/, domain/."""

from __future__ import annotations

import shutil
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]
DISCOVERY = DOCS / "end-to-end" / "discovery"
REPO = DOCS.parent

MOVES: dict[str, str] = {
    "story-graph.json": "stories/story-graph.json",
    "story-map.md": "stories/story-map.md",
    "story-map.drawio": "stories/story-map.drawio",
    "thin-slicing.md": "stories/thin-slicing.md",
    "thin-slicing.drawio": "stories/thin-slicing.drawio",
    "thin-slicing.txt": "stories/thin-slicing.txt",
    "architecture-blueprint.md": "architecture/architecture-blueprint.md",
    "service-level-objectives.md": "architecture/service-level-objectives.md",
    "entity-relationships.drawio": "architecture/entity-relationships.drawio",
    "information-architecture.md": "ux/information-architecture.md",
    "information-architecture.drawio": "ux/information-architecture.drawio",
    "domain-terms.md": "domain/domain-terms.md",
}

TEXT_EXTS = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
SKIP_PARTS = {"node_modules", ".git", "_legacy-pre-kanban"}


def move_files() -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    for sub in ("stories", "architecture", "ux", "domain"):
        (DISCOVERY / sub).mkdir(parents=True, exist_ok=True)

    for old_name, new_rel in MOVES.items():
        src = DISCOVERY / old_name
        dst = DISCOVERY / new_rel
        if not src.exists():
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists():
            dst.unlink()
        shutil.move(str(src), str(dst))
        pairs.append(
            (f"end-to-end/discovery/{old_name}", f"end-to-end/discovery/{new_rel}")
        )
        print(f"  {old_name} -> {new_rel}")

    for adr in sorted(DISCOVERY.glob("ADR-*.md")):
        dst = DISCOVERY / "architecture" / adr.name
        if dst.exists():
            adr.unlink()
        else:
            shutil.move(str(adr), str(dst))
        pairs.append(
            (f"end-to-end/discovery/{adr.name}", f"end-to-end/discovery/architecture/{adr.name}")
        )
        print(f"  {adr.name} -> architecture/{adr.name}")

    return pairs


def apply_replacements(pairs: list[tuple[str, str]]) -> int:
    pairs = sorted(set(pairs), key=lambda x: -len(x[0]))
    count = 0
    for base in [REPO / "docs", REPO / "src", REPO / ".cursor"]:
        if not base.exists():
            continue
        for f in base.rglob("*"):
            if not f.is_file() or f.suffix not in TEXT_EXTS:
                continue
            if any(part in SKIP_PARTS for part in f.parts):
                continue
            if f.name == Path(__file__).name:
                continue
            try:
                text = f.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            orig = text
            for old, new in pairs:
                text = text.replace(f"docs/{old}", f"docs/{new}")
                text = text.replace(old, new)
                text = text.replace(old.replace("/", "\\"), new.replace("/", "\\"))
            if text != orig:
                f.write_text(text, encoding="utf-8")
                count += 1
    return count


def main() -> None:
    print("Moving discovery artifacts...")
    pairs = move_files()
    updated = apply_replacements(pairs)
    print(f"\nUpdated {updated} files with new discovery paths.")


if __name__ == "__main__":
    main()

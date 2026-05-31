#!/usr/bin/env python3
"""Reorganize docs/end-to-end/exploration/ into stories/, architecture/, ux/, domain/."""

from __future__ import annotations

import shutil
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]
EXPLORATION = DOCS / "end-to-end" / "exploration"
REPO = DOCS.parent

MOVES: dict[str, str] = {
    "acceptance-criteria.md": "stories/acceptance-criteria.md",
    "acceptance-criteria.drawio": "stories/acceptance-criteria.drawio",
    "ubiquitous-language.md": "domain/ubiquitous-language.md",
    "ubiquitous-language.drawio": "domain/ubiquitous-language.drawio",
    "mockups.md": "ux/mockups.md",
    "architecture-template.md": "architecture/architecture-template.md",
}

UX_SCREEN_DRAWIOS = (
    "backorder-product-page.drawio",
    "customer-pet-profiles.drawio",
    "inventory-dashboard.drawio",
    "my-store-preferences.drawio",
    "product-search-results.drawio",
    "store-locator-filters.drawio",
)

TEXT_EXTS = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
SKIP_PARTS = {"node_modules", ".git", "_legacy-pre-kanban"}


def move_files() -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    for sub in ("stories", "architecture", "ux", "domain"):
        (EXPLORATION / sub).mkdir(parents=True, exist_ok=True)

    for old_name, new_rel in MOVES.items():
        src = EXPLORATION / old_name
        if not src.exists():
            continue
        dst = EXPLORATION / new_rel
        if dst.exists() and dst != src:
            dst.unlink()
        shutil.move(str(src), str(dst))
        pairs.append(
            (f"end-to-end/exploration/{old_name}", f"end-to-end/exploration/{new_rel}")
        )
        print(f"  {old_name} -> {new_rel}")

    for name in UX_SCREEN_DRAWIOS:
        src = EXPLORATION / name
        if not src.exists():
            continue
        dst = EXPLORATION / "ux" / name
        if dst.exists():
            src.unlink()
        else:
            shutil.move(str(src), str(dst))
        pairs.append(
            (f"end-to-end/exploration/{name}", f"end-to-end/exploration/ux/{name}")
        )
        print(f"  {name} -> ux/{name}")

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
            if f.name in (Path(__file__).name, "merge-end-to-end-exploration.py"):
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
    print("Moving exploration artifacts...")
    pairs = move_files()
    updated = apply_replacements(pairs)
    print(f"\nUpdated {updated} files with new exploration paths.")


if __name__ == "__main__":
    main()

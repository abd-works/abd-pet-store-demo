#!/usr/bin/env python3
"""Organize exploration/ into domain, stories, ux, architecture subfolders (like discovery/)."""

from __future__ import annotations

import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
EXTS = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
SKIP = {"node_modules", ".git", "_legacy-pre-kanban"}


def subfolder(name: str) -> str:
    if name.startswith("ubiquitous-language"):
        return "domain"
    if name.startswith("acceptance-criteria"):
        return "stories"
    if name.startswith("architecture-template"):
        return "architecture"
    return "ux"


def reorganize_exploration(expl: Path) -> list[tuple[str, str]]:
    moves: list[tuple[str, str]] = []
    if not expl.is_dir():
        return moves
    for f in list(expl.iterdir()):
        if not f.is_file():
            continue
        dest_dir = expl / subfolder(f.name)
        dest_dir.mkdir(parents=True, exist_ok=True)
        dst = dest_dir / f.name
        if dst.exists():
            continue
        rel_old = f.relative_to(REPO / "docs").as_posix()
        shutil.move(str(f), str(dst))
        rel_new = dst.relative_to(REPO / "docs").as_posix()
        moves.append((f"docs/{rel_old}", f"docs/{rel_new}"))
    return moves


def apply_replacements(moves: list[tuple[str, str]]) -> int:
    # static paths (flat → subfolder) longest first
    static = [
        ("docs/end-to-end/exploration/ubiquitous-language.md", "docs/end-to-end/exploration/domain/ubiquitous-language.md"),
        ("docs/end-to-end/exploration/ubiquitous-language.drawio", "docs/end-to-end/exploration/domain/ubiquitous-language.drawio"),
        ("docs/end-to-end/exploration/acceptance-criteria.md", "docs/end-to-end/exploration/stories/acceptance-criteria.md"),
        ("docs/end-to-end/exploration/acceptance-criteria.drawio", "docs/end-to-end/exploration/stories/acceptance-criteria.drawio"),
        ("docs/end-to-end/exploration/mockups.md", "docs/end-to-end/exploration/ux/mockups.md"),
        ("docs/end-to-end/exploration/architecture-template.md", "docs/end-to-end/exploration/architecture/architecture-template.md"),
    ]
    pairs = sorted(set(moves + static), key=lambda x: -len(x[0]))
    count = 0
    for base in [REPO / "docs", REPO / "src", REPO / "packages", REPO / "apps", REPO / ".cursor"]:
        if not base.exists():
            continue
        for f in base.rglob("*"):
            if not f.is_file() or f.suffix not in EXTS:
                continue
            if any(p in SKIP for p in f.parts):
                continue
            if f.name == Path(__file__).name:
                continue
            try:
                text = f.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            orig = text
            for old, new in pairs:
                text = text.replace(old, new)
                text = text.replace(old.replace("/", "\\"), new.replace("/", "\\"))
            # generic increment + end-to-end exploration paths
            for prefix in ("docs/end-to-end/exploration/", "docs/increments/"):
                if prefix in text:
                    text = text.replace(f"{prefix}ubiquitous-language", f"{prefix}domain/ubiquitous-language")
                    text = text.replace(f"{prefix}acceptance-criteria", f"{prefix}stories/acceptance-criteria")
                    text = text.replace(f"{prefix}mockups", f"{prefix}ux/mockups")
                    text = text.replace(f"{prefix}architecture-template", f"{prefix}architecture/architecture-template")
            if text != orig:
                f.write_text(text, encoding="utf-8")
                count += 1
    return count


def main() -> None:
    all_moves: list[tuple[str, str]] = []
    e2e = REPO / "docs" / "end-to-end" / "exploration"
    all_moves.extend(reorganize_exploration(e2e))
    inc_root = REPO / "docs" / "increments"
    if inc_root.exists():
        for inc in inc_root.iterdir():
            if inc.is_dir():
                all_moves.extend(reorganize_exploration(inc / "exploration"))
    updated = apply_replacements(all_moves)
    print(f"Moved {len(all_moves)} files; updated {updated} reference files.")


if __name__ == "__main__":
    main()

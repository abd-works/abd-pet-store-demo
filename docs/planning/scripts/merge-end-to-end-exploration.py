#!/usr/bin/env python3
"""Rebuild docs/end-to-end/exploration/ as merged whole-solution files (not per-increment)."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]
E2E_EXPL = DOCS / "end-to-end" / "exploration"
E2E_STORIES = E2E_EXPL / "stories"
E2E_UX = E2E_EXPL / "ux"
E2E_DOMAIN = E2E_EXPL / "domain"
INC = DOCS / "increments"
THIN = DOCS / "end-to-end" / "discovery" / "stories" / "thin-slicing.md"

CANONICAL_MD = ("acceptance-criteria.md", "mockups.md")

ROLLUP_BLOCK = re.compile(
    r"\n---\s*\n+\s*## (?:Increment \d+|increment-\d+[-\w]*)\s*\n+\s*<!-- migrated from:",
    re.I,
)

LEGACY_UL = DOCS / "_legacy-pre-kanban" / "domain" / "ubiquitous-language.md"
LEGACY_AC_DRAWIO = DOCS / "_legacy-pre-kanban" / "story" / "acceptance-criteria.drawio"

# Per-increment story-map / AC drawio — not canonical in end-to-end/exploration
REMOVE_DRAWIO_GLOBS = (
    "increment-*-acceptance-criteria.drawio",
    "increment-*-*.drawio",
)


def increment_dirs() -> list[tuple[int, Path]]:
    rows: list[tuple[int, Path]] = []
    for d in sorted(INC.iterdir()):
        if not d.is_dir():
            continue
        m = re.match(r"^(\d+)-", d.name)
        if m:
            rows.append((int(m.group(1)), d))
    return sorted(rows, key=lambda x: x[0])


def increment_titles() -> dict[int, str]:
    text = THIN.read_text(encoding="utf-8")
    titles: dict[int, str] = {}
    for m in re.finditer(r"### Increment (\d+): `([^`]+)`", text):
        titles[int(m.group(1))] = m.group(2).strip()
    return titles


def strip_migration_cruft(body: str, filename: str) -> str:
    """Keep first canonical block only; drop duplicate rollup appendices."""
    text = body.strip().lstrip("\ufeff")
    text = re.sub(
        r"^#\s+(Acceptance Criteria|Mockups|Ubiquitous Language)\s*\n+",
        "",
        text,
        flags=re.I,
    )
    text = re.sub(
        r"^---\s*\n+\s*## (?:increment-\d+[-\w]*|Increment \d+)\s*\n+\s*<!-- migrated from:[^>]+-->\s*\n+",
        "",
        text,
        count=1,
        flags=re.I | re.MULTILINE,
    )
    text = re.sub(r"^## Increment \d+\s*\n+\s*<!-- migrated from:[^>]+-->\s*\n+", "", text, flags=re.I)
    if filename == "acceptance-criteria.md":
        text = re.sub(
            r"^#\s+Acceptance [Cc]riteria\s*[—–-]\s*Increment\s+\d+[^\n]*\n+",
            "",
            text,
            count=1,
            flags=re.I | re.MULTILINE,
        )
    if filename == "mockups.md":
        text = re.sub(
            r"^#\s+(Lo-fi|Lo-Fi Wireframes?|Mockups)\s*[—–-]?\s*Increment\s+\d+[^\n]*\n+",
            "",
            text,
            count=1,
            flags=re.I | re.MULTILINE,
        )
    # Drop duplicate rollup appendices (second+ copy of same increment content)
    m = ROLLUP_BLOCK.search(text)
    if m:
        text = text[: m.start()]
    text = re.sub(r"\n{3,}", "\n\n", text.strip())
    return text


def merge_ubiquitous_language() -> None:
    titles = increment_titles()
    parts = [
        "# Ubiquitous language",
        "",
        "Whole-solution domain vocabulary for PawPlace.",
        "",
    ]
    if LEGACY_UL.exists():
        body = LEGACY_UL.read_text(encoding="utf-8")
        body = re.sub(r"^---\n.*?\n---\n", "", body, flags=re.DOTALL).strip()
        parts.append("## Core domain (Increments 1–7)")
        parts.append("")
        parts.append(body)
        parts.append("")
    for n, inc_dir in increment_dirs():
        if n not in (8, 9):
            continue
        src = inc_dir / "exploration" / "ubiquitous-language.md"
        if not src.exists():
            continue
        title = titles.get(n, inc_dir.name)
        body = strip_migration_cruft(src.read_text(encoding="utf-8"), "ubiquitous-language.md")
        body = re.sub(r"^---\nstate:.*?\n---\n", "", body, flags=re.DOTALL).strip()
        parts.append(f"## Increment {n}: {title}")
        parts.append("")
        parts.append(body)
        parts.append("")
    target = E2E_DOMAIN / "ubiquitous-language.md"
    target.write_text("\n".join(parts).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {target.relative_to(DOCS.parent)} ({target.stat().st_size} bytes)")


def merge_markdown(filename: str, intro: str) -> None:
    titles = increment_titles()
    parts = [intro.rstrip(), ""]
    for n, inc_dir in increment_dirs():
        src = inc_dir / "exploration" / filename
        if not src.exists():
            continue
        title = titles.get(n, inc_dir.name)
        body = strip_migration_cruft(src.read_text(encoding="utf-8"), filename)
        parts.append(f"## Increment {n}: {title}")
        parts.append("")
        parts.append(body)
        parts.append("")
    subdir = E2E_STORIES if filename == "acceptance-criteria.md" else E2E_UX
    target = subdir / filename
    target.write_text("\n".join(parts).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {target.relative_to(DOCS.parent)} ({target.stat().st_size} bytes)")


def remove_per_increment_drawios() -> int:
    removed = 0
    for pattern in REMOVE_DRAWIO_GLOBS:
        for f in E2E_EXPL.rglob(pattern.split("/")[-1] if "/" not in pattern else pattern):
            if f.is_file():
                f.unlink()
                removed += 1
                print(f"Removed {f.relative_to(E2E_EXPL)}")
    return removed


def main() -> None:
    merge_markdown(
        "acceptance-criteria.md",
        "# Acceptance criteria\n\n"
        "Whole-solution exploration acceptance criteria for PawPlace. "
        "Each increment section lists domain terms and WHEN/THEN/AND/BUT behavioral AC.",
    )
    merge_markdown(
        "mockups.md",
        "# Mockups\n\n"
        "Whole-solution lo-fi wireframe specs. Screen `.drawio` companions live in `ux/`.",
    )
    merge_ubiquitous_language()
    if LEGACY_AC_DRAWIO.exists():
        dst = E2E_STORIES / "acceptance-criteria.drawio"
        shutil.copy2(LEGACY_AC_DRAWIO, dst)
        print(f"Copied {dst.relative_to(DOCS.parent)} from legacy story/")
    n = remove_per_increment_drawios()
    print(f"Removed {n} per-increment drawio files from end-to-end/exploration/")


if __name__ == "__main__":
    main()

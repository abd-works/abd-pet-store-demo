#!/usr/bin/env python3
"""Canonicalize increment folder filenames — drop increment-N prefix from artifact names."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]
INC = DOCS / "increments"
REPO = DOCS.parent

TEXT_EXTS = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
SKIP_PARTS = {"node_modules", ".git", "_legacy-pre-kanban"}


def increment_dirs() -> list[Path]:
    return sorted(
        [d for d in INC.iterdir() if d.is_dir() and re.match(r"^\d+-", d.name)],
        key=lambda p: p.name,
    )


def wireframe_spec_md(expl: Path) -> Path | None:
    for f in sorted(expl.glob("increment-*.md")):
        if "acceptance" in f.name.lower():
            continue
        return f
    return None


def normalize_mockups_md(expl: Path, inc_rel: str) -> None:
    """Use standalone wireframe spec as canonical mockups.md; fix paths."""
    src = wireframe_spec_md(expl)
    target = expl / "mockups.md"
    if src and src.name != "mockups.md":
        body = src.read_text(encoding="utf-8").lstrip("\ufeff")
        if not body.startswith("# Mockups"):
            body = f"# Mockups\n\n{body}"
        target.write_text(body, encoding="utf-8")
        src.unlink()
        print(f"  merged {src.name} -> mockups.md")
    elif target.exists():
        body = target.read_text(encoding="utf-8")
    else:
        return

    body = target.read_text(encoding="utf-8")
    body = re.sub(
        rf"docs/increments/{re.escape(inc_rel)}/exploration/increment-\d+-[\w-]+-state\.json",
        f"docs/increments/{inc_rel}/exploration/mockups-state.json",
        body,
    )
    body = re.sub(
        rf"docs/increments/{re.escape(inc_rel)}/exploration/increment-\d+-[\w-]+\.drawio",
        f"docs/increments/{inc_rel}/exploration/mockups.drawio",
        body,
    )
    body = re.sub(
        rf"docs/increments/{re.escape(inc_rel)}/exploration/increment-\d+-[\w-]+\.md",
        f"docs/increments/{inc_rel}/exploration/mockups.md",
        body,
    )
    body = re.sub(
        rf"docs/increments/{re.escape(inc_rel)}/exploration/increment-\d+-acceptance-criteria\.drawio",
        f"docs/increments/{inc_rel}/exploration/acceptance-criteria.drawio",
        body,
    )
    target.write_text(body, encoding="utf-8")


def rename_exploration_artifacts(expl: Path, inc_rel: str) -> list[tuple[str, str]]:
    """Rename increment-prefixed files; return old->new relative path pairs (from docs/)."""
    replacements: list[tuple[str, str]] = []
    prefix = f"increments/{inc_rel}/exploration/"

    for f in sorted(expl.glob("increment-*-acceptance-criteria.drawio")):
        dst = expl / "acceptance-criteria.drawio"
        if dst.exists() and dst != f:
            f.unlink()
        else:
            shutil.move(str(f), str(dst))
        replacements.append((prefix + f.name, prefix + "acceptance-criteria.drawio"))
        print(f"  {f.name} -> acceptance-criteria.drawio")

    for f in sorted(expl.glob("increment-*-state.json")):
        dst = expl / "mockups-state.json"
        if dst.exists() and dst != f:
            f.unlink()
        else:
            shutil.move(str(f), str(dst))
        replacements.append((prefix + f.name, prefix + "mockups-state.json"))
        print(f"  {f.name} -> mockups-state.json")
        data = dst.read_text(encoding="utf-8")
        data = data.replace(f.name.replace("-state.json", ".drawio"), "mockups.drawio")
        data = re.sub(r"increment-\d+-[\w-]+\.drawio", "mockups.drawio", data)
        data = re.sub(
            rf"docs/increments/{re.escape(inc_rel)}/exploration/increment-\d+-[\w-]+\.drawio",
            f"docs/increments/{inc_rel}/exploration/mockups.drawio",
            data,
        )
        dst.write_text(data, encoding="utf-8")

    for f in sorted(expl.glob("increment-*.drawio")):
        if f.name.startswith("increment-") and "acceptance-criteria" not in f.name:
            dst = expl / "mockups.drawio"
            if dst.exists() and dst != f:
                f.unlink()
            else:
                shutil.move(str(f), str(dst))
            replacements.append((prefix + f.name, prefix + "mockups.drawio"))
            print(f"  {f.name} -> mockups.drawio")

    return replacements


def apply_replacements(root: Path, pairs: list[tuple[str, str]]) -> int:
    if not pairs:
        return 0
    # longest old paths first
    pairs = sorted(set(pairs), key=lambda x: -len(x[0]))
    count = 0
    scan_roots = [root / "docs", root / "src", root / ".cursor"]
    for base in scan_roots:
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
            if text != orig:
                f.write_text(text, encoding="utf-8")
                count += 1
    return count


def main() -> None:
    all_pairs: list[tuple[str, str]] = []
    for inc_dir in increment_dirs():
        expl = inc_dir / "exploration"
        if not expl.exists():
            continue
        inc_rel = inc_dir.name
        print(f"\n{inc_rel}/exploration/")
        normalize_mockups_md(expl, inc_rel)
        all_pairs.extend(rename_exploration_artifacts(expl, inc_rel))

    updated = apply_replacements(REPO, all_pairs)
    print(f"\nUpdated {updated} files with new increment artifact paths.")
    print(f"Renamed {len(all_pairs)} artifact paths.")


if __name__ == "__main__":
    main()

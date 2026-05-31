#!/usr/bin/env python3
"""One-time migration: legacy docs/ layout → kanban end-to-end + increments structure."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
E2E = DOCS / "end-to-end"
INC = DOCS / "increments"

STAGES_E2E = ("shaping", "discovery", "exploration", "specification", "engineering")
STAGES_INC = ("exploration", "specification", "engineering")

LEGACY_DIRS = ("architecture", "domain", "story", "ux", "engineering", "scanner-report")

# Old path prefix → new path prefix (longest first when applying)
PATH_REPLACEMENTS: list[tuple[str, str]] = []


def ensure_dirs() -> None:
    for stage in STAGES_E2E:
        (E2E / stage).mkdir(parents=True, exist_ok=True)
    INC.mkdir(parents=True, exist_ok=True)
    for n in range(1, 10):
        for stage in STAGES_INC:
            (INC / f"increment-{n}" / stage).mkdir(parents=True, exist_ok=True)


def move_if_exists(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        return
    shutil.move(str(src), str(dst))
    PATH_REPLACEMENTS.append((posix(src.relative_to(DOCS)), posix(dst.relative_to(DOCS))))


def copy_if_exists(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not dst.exists():
        shutil.copy2(src, dst)
        PATH_REPLACEMENTS.append((posix(src.relative_to(DOCS)), posix(dst.relative_to(DOCS))))


def posix(p: str | Path) -> str:
    return str(p).replace("\\", "/")


def append_section(target: Path, heading: str, source: Path) -> None:
    if not source.exists():
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    body = source.read_text(encoding="utf-8")
    block = f"\n\n---\n\n{heading}\n\n<!-- migrated from: {posix(source.relative_to(DOCS))} -->\n\n{body}"
    if target.exists():
        target.write_text(target.read_text(encoding="utf-8") + block, encoding="utf-8")
    else:
        target.write_text(f"# {target.stem.replace('-', ' ').title()}\n{block}", encoding="utf-8")
    PATH_REPLACEMENTS.append((posix(source.relative_to(DOCS)), posix(target.relative_to(DOCS))))


def glob_one(base: Path, pattern: str) -> Path | None:
    matches = sorted(base.glob(pattern))
    return matches[0] if matches else None


def migrate_discovery() -> None:
    d = E2E / "discovery"
    moves = [
        (DOCS / "story" / "story-graph.json", d / "story-graph.json"),
        (DOCS / "story" / "story-map.md", d / "story-map.md"),
        (DOCS / "story" / "story-map.drawio", d / "story-map.drawio"),
        (DOCS / "story" / "thin-slicing.md", d / "thin-slicing.md"),
        (DOCS / "story" / "thin-slicing.drawio", d / "thin-slicing.drawio"),
        (DOCS / "story" / "thin-slicing.txt", d / "thin-slicing.txt"),
        (DOCS / "domain" / "domain-terms.md", d / "domain-terms.md"),
        (DOCS / "ux" / "information-architecture.md", d / "information-architecture.md"),
        (DOCS / "ux" / "information-architecture.drawio", d / "information-architecture.drawio"),
        (DOCS / "architecture" / "architecture-blueprint.md", d / "architecture-blueprint.md"),
        (DOCS / "architecture" / "service-level-objectives.md", d / "service-level-objectives.md"),
    ]
    for src, dst in moves:
        move_if_exists(src, dst)

    arch = DOCS / "architecture"
    if arch.exists():
        for adr in arch.glob("decisions/ADR-*.md"):
            move_if_exists(adr, d / adr.name)
        for diagram in (arch / "diagrams").glob("*") if (arch / "diagrams").exists() else []:
            move_if_exists(diagram, d / diagram.name)


def migrate_shaping() -> None:
    s = E2E / "shaping"
    moves = [
        (DOCS / "domain" / "key-abstractions.md", s / "key-abstractions.md"),
        (DOCS / "domain" / "domain-sketch.md", s / "domain-sketch.md"),
    ]
    for src, dst in moves:
        move_if_exists(src, dst)
    # Component overview is shaping-level context
    move_if_exists(DOCS / "architecture" / "diagrams" / "component-overview.drawio", s / "component-overview.drawio")


def increment_num_from_name(name: str) -> int | None:
    m = re.search(r"increment[-_]?(\d+)", name, re.I)
    return int(m.group(1)) if m else None


def migrate_increment_exploration(n: int) -> None:
    expl = INC / f"increment-{n}" / "exploration"
    ac = DOCS / "story" / "acceptance-criteria" / f"increment-{n}-acceptance-criteria.md"
    if ac.exists():
        append_section(expl / "acceptance-criteria.md", f"## Increment {n}", ac)
    ac_root = DOCS / "story" / "acceptance-criteria.md"
    if n == 0 and ac_root.exists():
        pass

    ul_patterns = []
    if n == 8:
        ul_patterns = ["marketing-engine-ubiquitous-language.md"]
    elif n == 9:
        ul_patterns = ["power-ups-ubiquitous-language.md"]
    for name in ul_patterns:
        ul = DOCS / "domain" / name
        if ul.exists():
            append_section(expl / "ubiquitous-language.md", f"## {ul.stem}", ul)

    lo_fi = DOCS / "ux" / "lo-fi"
    if lo_fi.exists():
        for md in sorted(lo_fi.glob(f"increment-{n}-*.md")):
            append_section(expl / "mockups.md", f"## {md.stem}", md)
        for drawio in sorted(lo_fi.glob(f"increment-{n}-*.drawio")):
            copy_if_exists(drawio, expl / drawio.name)
        if n == 9:
            for f in lo_fi.glob("increment-9-lo-fi.md"):
                append_section(expl / "mockups.md", "## increment-9-lo-fi", f)
            for f in lo_fi.glob("*.drawio"):
                if not f.name.startswith("increment-"):
                    copy_if_exists(f, expl / f.name)
            for f in lo_fi.glob("increment-9*.md"):
                if f.name != "increment-9-lo-fi.md":
                    append_section(expl / "mockups.md", f"## {f.stem}", f)

    for drawio in (DOCS / "story" / "acceptance-criteria").glob(f"increment-{n}-*.drawio"):
        copy_if_exists(drawio, expl / drawio.name)


def migrate_increment_specification(n: int) -> None:
    spec = INC / f"increment-{n}" / "specification"
    sbe_dir = DOCS / "story" / "specification-by-example"

    inc_sbe = sbe_dir / f"increment-{n}-specification-by-example.md"
    if inc_sbe.exists():
        append_section(spec / "specification-by-example.md", f"## Increment {n}", inc_sbe)
    for sprint_sbe in sorted(sbe_dir.glob(f"increment-{n}-sprint-*-specification-by-example.md")):
        append_section(spec / "specification-by-example.md", f"## {sprint_sbe.stem}", sprint_sbe)

    ux = DOCS / "ux"
    iface = ux / f"increment-{n}-interface-design.md"
    if iface.exists():
        append_section(spec / "interface-design.md", f"## Increment {n}", iface)
    for sprint_iface in sorted(ux.glob(f"increment-{n}-sprint-*-interface-design.md")):
        append_section(spec / "interface-design.md", f"## {sprint_iface.stem}", sprint_iface)

    for crc in sorted((DOCS / "domain").glob("*-crc.md")):
        if n == 8 and crc.name.startswith("marketing-engine"):
            append_section(spec / "crc.md", f"## {crc.stem}", crc)
        elif n == 9 and crc.name.startswith("power-ups"):
            append_section(spec / "crc.md", f"## {crc.stem}", crc)

    domain_json = sbe_dir / "domain.json" if n == 8 else DOCS / "domain" / f"marketing-engine-domain.json"
    if n == 8:
        for dj in [sbe_dir / "domain.json", DOCS / "domain" / "marketing-engine-domain.json", DOCS / "domain" / "domain.json"]:
            copy_if_exists(dj, spec / "domain.json")
    if n == 9:
        copy_if_exists(DOCS / "domain" / "power-ups-domain.json", spec / "domain.json")

    arch = DOCS / "architecture"
    for ref in sorted(arch.glob(f"increment-{n}*reference*.md")):
        if "assignment" in ref.name:
            append_section(spec / "architecture-reference-assignment.md", f"## {ref.stem}", ref)
        else:
            append_section(spec / "architecture-reference.md", f"## {ref.stem}", ref)
    for sprint_ref in sorted(arch.glob(f"increment-{n}-sprint-*-architecture-reference-assignment.md")):
        append_section(spec / "architecture-reference-assignment.md", f"## {sprint_ref.stem}", sprint_ref)

    if n == 1:
        copy_if_exists(arch / "architecture-reference.md", spec / "architecture-reference.md")


def migrate_increment_engineering(n: int) -> None:
    eng = INC / f"increment-{n}" / "engineering"
    for om in sorted((DOCS / "domain").glob("*-object-model.md")):
        if n == 8 and om.name.startswith("marketing-engine"):
            append_section(eng / "object-model.md", f"## {om.stem}", om)
        elif n == 9 and (om.name.startswith("power-ups") or om.name == "object-model.md"):
            append_section(eng / "object-model.md", f"## {om.stem}", om)
    for wt in (DOCS / "domain").glob(f"increment-{n}*walkthrough*.md"):
        append_section(eng / "object-model.md", f"## {wt.stem}", wt)


def rollup_to_end_to_end() -> None:
    """Merge increment stage folders into end-to-end stage folders."""
    for stage in STAGES_INC:
        e2e_stage = E2E / stage
        for inc_dir in sorted(INC.glob("increment-*")):
            n = inc_dir.name.replace("increment-", "")
            src_dir = inc_dir / stage
            if not src_dir.exists():
                continue
            for f in sorted(src_dir.iterdir()):
                if f.is_dir() or f.name.startswith("."):
                    continue
                if f.suffix in (".py",):
                    continue
                append_section(e2e_stage / f.name, f"## {inc_dir.name} (rollup)", f)


def migrate_global_spec() -> None:
    """Whole-solution files that lived at domain/story root."""
    copy_if_exists(DOCS / "architecture" / "architecture-reference.md", E2E / "specification" / "architecture-reference.md")
    copy_if_exists(DOCS / "domain" / "crc.md", E2E / "specification" / "crc.md")
    copy_if_exists(DOCS / "domain" / "domain.json", E2E / "specification" / "domain.json")
    copy_if_exists(DOCS / "domain" / "ubiquitous-language.md", E2E / "exploration" / "ubiquitous-language.md")
    copy_if_exists(DOCS / "domain" / "ubiquitous-language.drawio", E2E / "exploration" / "ubiquitous-language.drawio")
    copy_if_exists(DOCS / "domain" / "object-model.md", E2E / "engineering" / "object-model.md")
    copy_if_exists(DOCS / "story" / "acceptance-criteria.md", E2E / "exploration" / "acceptance-criteria.md")


def move_scanner_reports() -> None:
    for sr in DOCS.rglob("scanner-report"):
        if not sr.is_dir():
            continue
        for f in sr.rglob("*.md"):
            rel = f.relative_to(sr)
            # keep under planning/scanner-report/<original-parent>/
            dst = DOCS / "planning" / "scanner-report" / rel
            move_if_exists(f, dst)


def remove_empty_legacy() -> None:
    for name in LEGACY_DIRS:
        p = DOCS / name
        if not p.exists():
            continue
        # remove only if empty or only scanner-report subdirs already moved
        try:
            remaining = list(p.rglob("*"))
            files = [x for x in remaining if x.is_file()]
            if not files:
                shutil.rmtree(p)
            elif name == "architecture":
                # keep scripts temporarily at planning
                for f in files:
                    if f.suffix == ".py":
                        move_if_exists(f, DOCS / "planning" / f.name)
                if not any(p.rglob("*")):
                    shutil.rmtree(p, ignore_errors=True)
        except OSError:
            pass


def build_replacement_table() -> list[tuple[str, str]]:
    # dedupe; sort longest first
    seen: dict[str, str] = {}
    for old, new in PATH_REPLACEMENTS:
        seen[old] = new
    static = [
        ("docs/story/story-graph.json", "docs/end-to-end/discovery/stories/story-graph.json"),
        ("docs/story/story-map.md", "docs/end-to-end/discovery/stories/story-map.md"),
        ("docs/story/story-map.drawio", "docs/end-to-end/discovery/stories/story-map.drawio"),
        ("docs/story/thin-slicing.md", "docs/end-to-end/discovery/stories/thin-slicing.md"),
        ("docs/domain/domain-terms.md", "docs/end-to-end/discovery/domain/domain-terms.md"),
        ("docs/ux/information-architecture.md", "docs/end-to-end/discovery/ux/information-architecture.md"),
        ("docs/ux/information-architecture.drawio", "docs/end-to-end/discovery/ux/information-architecture.drawio"),
        ("docs/architecture/architecture-blueprint.md", "docs/end-to-end/discovery/architecture/architecture-blueprint.md"),
        ("docs/architecture/service-level-objectives.md", "docs/end-to-end/discovery/architecture/service-level-objectives.md"),
        ("docs/architecture/architecture-reference.md", "docs/end-to-end/specification/architecture-reference.md"),
        ("docs/domain/crc.md", "docs/end-to-end/specification/crc.md"),
        ("docs/domain/domain.json", "docs/end-to-end/specification/domain.json"),
        ("docs/domain/ubiquitous-language.md", "docs/end-to-end/exploration/domain/ubiquitous-language.md"),
        ("docs/domain/object-model.md", "docs/end-to-end/engineering/object-model.md"),
        ("docs/story/acceptance-criteria.md", "docs/end-to-end/exploration/stories/acceptance-criteria.md"),
    ]
    for old, new in static:
        seen[old] = new
    items = sorted(seen.items(), key=lambda x: -len(x[0]))
    return items


def update_references(root: Path) -> int:
    replacements = build_replacement_table()
    count = 0
    exts = {".md", ".json", ".ts", ".tsx", ".js", ".jsx", ".py", ".drawio", ".txt", ".mdc"}
    skip_parts = {"node_modules", ".git", ".cursor"}
    targets = [root / "docs", root / "src", root / "packages", root / "apps"]
    if (root / "test").exists():
        targets.append(root / "test")
    for base in targets:
        if not base.exists():
            continue
        for f in base.rglob("*"):
            if not f.is_file() or f.suffix not in exts:
                continue
            if any(part in skip_parts for part in f.parts):
                continue
            if f.name == "migrate-kanban-docs-layout.py":
                continue
            try:
                text = f.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            orig = text
            for old, new in replacements:
                text = text.replace(old, new)
                text = text.replace(old.replace("/", "\\"), new.replace("/", "\\"))
            if text != orig:
                f.write_text(text, encoding="utf-8")
                count += 1
    return count


def main() -> None:
    ensure_dirs()
    migrate_discovery()
    migrate_shaping()
    for n in range(1, 10):
        migrate_increment_exploration(n)
        migrate_increment_specification(n)
        migrate_increment_engineering(n)
    migrate_global_spec()
    rollup_to_end_to_end()
    move_scanner_reports()
    remove_empty_legacy()

    mapping_path = DOCS / "planning" / "docs-layout-migration-map.txt"
    lines = [f"{old} -> {new}" for old, new in build_replacement_table()]
    mapping_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    repo_root = DOCS.parent
    updated = update_references(repo_root)
    print(f"Migration complete. Updated {updated} files with new paths.")
    print(f"Mapping: {mapping_path}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Parse specification-by-example markdown files and inject scenarios into story-graph.json."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

SPEC_DIR = Path(__file__).parent.parent / "docs" / "stories" / "specification-by-example"
GRAPH_FILE = Path(__file__).parent.parent / "docs" / "stories" / "story-graph.json"

STEP_KEYWORDS = re.compile(r"^(Given|When|Then|And|But)\b", re.IGNORECASE)


def parse_markdown_table(lines: list[str]) -> tuple[list[str], list[list[str]]]:
    """Return (columns, rows) from a markdown table block."""
    columns: list[str] = []
    rows: list[list[str]] = []
    for line in lines:
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(set(c) <= set("-: ") for c in cells):
            continue  # separator row
        if not columns:
            columns = cells
        else:
            rows.append(cells)
    return columns, rows


def collect_steps(lines: list[str]) -> list[str]:
    steps = []
    for line in lines:
        stripped = line.strip()
        if STEP_KEYWORDS.match(stripped):
            steps.append(stripped)
    return steps


def parse_spec_file(path: Path) -> dict[str, dict]:
    """Return {story_name: {"scenarios": [...], "scenario_outlines": [...]}}."""
    text = path.read_text(encoding="utf-8")
    result: dict[str, dict] = {}

    # Split into story blocks
    story_blocks = re.split(r"^## Story:\s*`([^`]+)`", text, flags=re.MULTILINE)
    # story_blocks: [preamble, name1, block1, name2, block2, ...]
    i = 1
    while i < len(story_blocks) - 1:
        story_name = story_blocks[i].strip()
        block = story_blocks[i + 1]
        i += 2

        scenarios: list[dict] = []
        scenario_outlines: list[dict] = []

        # Split block into scenario sections
        # Match: ### Scenario Outline N: `name` or ### Scenario N: `name`
        # Also handle: ### Scenario 1: `name` without "Outline"
        section_pattern = re.compile(
            r"^### (Scenario Outline|Scenario)\s+\w+:\s*`([^`]+)`",
            re.MULTILINE,
        )
        parts = section_pattern.split(block)
        # parts: [pre, kind, name, body, kind, name, body, ...]
        j = 1
        while j < len(parts) - 2:
            kind = parts[j].strip()     # "Scenario Outline" or "Scenario"
            name = parts[j + 1].strip()
            body = parts[j + 2]
            j += 3

            lines = body.splitlines()

            if kind == "Scenario Outline":
                # Collect steps up to #### Examples:
                steps: list[str] = []
                examples_lines: list[str] = []
                in_examples = False
                for line in lines:
                    if re.match(r"^####\s+Examples", line.strip()):
                        in_examples = True
                        continue
                    if in_examples:
                        examples_lines.append(line)
                    elif STEP_KEYWORDS.match(line.strip()):
                        steps.append(line.strip())

                columns, rows = parse_markdown_table(examples_lines)
                outline: dict = {"name": name, "steps": steps}
                if columns:
                    outline["examples"] = {"columns": columns, "rows": rows}
                scenario_outlines.append(outline)

            else:
                # Plain scenario — collect steps
                steps = collect_steps(lines)
                if steps:
                    scenarios.append({"name": name, "steps": steps})

        result[story_name] = {
            "scenarios": scenarios,
            "scenario_outlines": scenario_outlines,
        }

    return result


def collect_all_specs() -> dict[str, dict]:
    """Merge specs from all increment files."""
    merged: dict[str, dict] = {}
    for path in sorted(SPEC_DIR.glob("increment-*-specification-by-example.md")):
        specs = parse_spec_file(path)
        for story_name, data in specs.items():
            if story_name not in merged:
                merged[story_name] = {"scenarios": [], "scenario_outlines": []}
            merged[story_name]["scenarios"].extend(data["scenarios"])
            merged[story_name]["scenario_outlines"].extend(data["scenario_outlines"])
    return merged


def inject_into_graph(graph: dict, specs: dict[str, dict]) -> tuple[int, list[str]]:
    """Walk the graph and inject scenarios. Returns (stories_updated, unmatched_names)."""
    updated = 0
    matched: set[str] = set()

    for epic in graph.get("epics", []):
        for se in epic.get("sub_epics", []):
            for sg in se.get("story_groups", []):
                for story in sg.get("stories", []):
                    name = story.get("name", "")
                    if name in specs:
                        data = specs[name]
                        story["scenarios"] = data["scenarios"]
                        story["scenario_outlines"] = data["scenario_outlines"]
                        matched.add(name)
                        if data["scenarios"] or data["scenario_outlines"]:
                            updated += 1

    unmatched = [n for n in specs if n not in matched]
    return updated, unmatched


def main() -> int:
    print(f"Reading specs from: {SPEC_DIR}")
    specs = collect_all_specs()
    print(f"Found scenarios for {len(specs)} stories")
    for name, data in specs.items():
        sc = len(data["scenarios"])
        so = len(data["scenario_outlines"])
        print(f"  {name}: {sc} scenario(s), {so} outline(s)")

    print(f"\nReading graph: {GRAPH_FILE}")
    graph = json.loads(GRAPH_FILE.read_text(encoding="utf-8"))

    updated, unmatched = inject_into_graph(graph, specs)

    GRAPH_FILE.write_text(
        json.dumps(graph, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"\nUpdated {updated} stories in graph.")
    if unmatched:
        print(f"\nWARNING — {len(unmatched)} story name(s) from specs not found in graph:")
        for n in unmatched:
            print(f"  - {n}")
    else:
        print("All story names matched.")
    return 0 if not unmatched else 1


if __name__ == "__main__":
    sys.exit(main())

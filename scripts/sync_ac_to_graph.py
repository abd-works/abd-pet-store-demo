"""Parse AC from increment-*-acceptance-criteria.md files and write into story-graph.json."""
import json
import re
import sys
from pathlib import Path

AC_DIR = Path(r"c:\dev\abd-augmented-delivery-course\docs\acceptance-criteria")
GRAPH = Path(r"c:\dev\abd-augmented-delivery-course\docs\story-graph.json")

STORY_RE = re.compile(r"^## Story:\s*`?(.+?)`?\s*$")
AC_HEADER_RE = re.compile(r"^### Acceptance criteria\s*$")
AC_NUM_RE = re.compile(r"^\d+[a-z]?\.\s+\*\*WHEN\*\*")


def parse_ac_from_md(path: Path) -> dict[str, list[str]]:
    """Return {story_name: [ac_text, ...]}."""
    lines = path.read_text(encoding="utf-8").splitlines()
    result: dict[str, list[str]] = {}
    current_story = None
    in_ac = False
    current_ac_lines: list[str] = []
    ac_list: list[str] = []

    def flush_ac():
        nonlocal current_ac_lines
        if current_ac_lines:
            ac_list.append("\n".join(current_ac_lines).strip())
            current_ac_lines = []

    for line in lines:
        story_m = STORY_RE.match(line)
        if story_m:
            if current_story and ac_list:
                flush_ac()
                result[current_story] = list(ac_list)
            current_story = story_m.group(1).strip()
            in_ac = False
            ac_list = []
            current_ac_lines = []
            continue

        if AC_HEADER_RE.match(line):
            in_ac = True
            current_ac_lines = []
            ac_list = []
            continue

        if in_ac:
            if line.startswith("---") or line.startswith("## "):
                flush_ac()
                if current_story and ac_list:
                    result[current_story] = list(ac_list)
                if line.startswith("## "):
                    story_m2 = STORY_RE.match(line)
                    if story_m2:
                        current_story = story_m2.group(1).strip()
                        in_ac = False
                        ac_list = []
                        current_ac_lines = []
                else:
                    in_ac = False
                continue

            if AC_NUM_RE.match(line.strip()):
                flush_ac()
                current_ac_lines = [line.strip()]
            elif current_ac_lines:
                current_ac_lines.append(line.strip())

    flush_ac()
    if current_story and ac_list:
        result[current_story] = list(ac_list)

    return result


def _inject_stories(story_groups: list, all_ac: dict[str, list[str]]) -> int:
    count = 0
    for sg in story_groups:
        for story in sg.get("stories", []):
            name = story["name"]
            if name in all_ac:
                story["acceptance_criteria"] = all_ac[name]
                count += 1
    return count


def _inject_sub_epics(sub_epics: list, all_ac: dict[str, list[str]]) -> int:
    count = 0
    for se in sub_epics:
        count += _inject_stories(se.get("story_groups", []), all_ac)
        count += _inject_sub_epics(se.get("sub_epics", []), all_ac)
    return count


def inject_ac_into_graph(graph: dict, all_ac: dict[str, list[str]]) -> int:
    """Walk graph recursively and set acceptance_criteria on matching stories."""
    count = 0
    for epic in graph.get("epics", []):
        count += _inject_stories(epic.get("story_groups", []), all_ac)
        count += _inject_sub_epics(epic.get("sub_epics", []), all_ac)
    return count


def main():
    all_ac: dict[str, list[str]] = {}
    for i in range(1, 10):
        p = AC_DIR / f"increment-{i}-acceptance-criteria.md"
        if not p.exists():
            print(f"SKIP: {p.name} not found")
            continue
        parsed = parse_ac_from_md(p)
        print(f"{p.name}: {len(parsed)} stories parsed")
        for name in parsed:
            if name in all_ac:
                print(f"  WARNING: duplicate story '{name}' — overwriting")
            all_ac[name] = parsed[name]

    print(f"\nTotal unique stories with AC: {len(all_ac)}")

    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    matched = inject_ac_into_graph(graph, all_ac)
    print(f"Matched and injected: {matched} stories in graph")

    unmatched = set(all_ac.keys()) - {
        s["name"]
        for e in graph["epics"]
        for se in e["sub_epics"]
        for sg in se["story_groups"]
        for s in sg["stories"]
        if s.get("acceptance_criteria")
    }
    if unmatched:
        print(f"\nWARNING — AC parsed but no graph match: {unmatched}")

    GRAPH.write_text(json.dumps(graph, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nWrote {GRAPH}")


if __name__ == "__main__":
    main()

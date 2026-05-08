"""For each increment in story-graph.json, produce a filtered graph containing only
stories from that increment, then render an exploration draw.io diagram.
Evidence lines are stripped from AC before rendering — they add noise to diagrams."""
import json
import copy
import re
import subprocess
import sys
import tempfile
from pathlib import Path

GRAPH = Path(r"c:\dev\abd-augmented-delivery-course\docs\story-graph.json")
OUT_DIR = Path(r"c:\dev\abd-augmented-delivery-course\docs\acceptance-criteria")
DRAWIO_CLI = Path(r"c:\dev\agilebydesign-skills\skills\story-driven-delivery\drawio-story-sync\scripts\drawio_story_sync_cli.py")
PYTHONPATH = ";".join([
    str(Path(r"c:\dev\agilebydesign-skills\skills\story-driven-delivery\drawio-story-sync\scripts")),
    str(Path(r"c:\dev\agilebydesign-skills\skills\story-driven-delivery\story-graph-ops\scripts")),
])


def filter_graph_for_increment(graph: dict, increment_idx: int) -> tuple[str, dict]:
    """Return (increment_name, filtered_graph) keeping only stories in this increment."""
    inc = graph["increments"][increment_idx]
    inc_name = inc["name"]
    story_names = {s["name"] for s in inc.get("stories", [])}

    filtered = copy.deepcopy(graph)
    filtered.pop("increments", None)

    new_epics = []
    for epic in filtered["epics"]:
        new_epic = _filter_node(epic, story_names)
        if new_epic:
            new_epics.append(new_epic)
    filtered["epics"] = new_epics
    return inc_name, filtered


def _filter_node(node: dict, story_names: set) -> dict | None:
    new_sgs = []
    for sg in node.get("story_groups", []):
        kept = [s for s in sg.get("stories", []) if s["name"] in story_names]
        if kept:
            sg_copy = copy.deepcopy(sg)
            sg_copy["stories"] = kept
            new_sgs.append(sg_copy)

    new_ses = []
    for se in node.get("sub_epics", []):
        child = _filter_node(se, story_names)
        if child:
            new_ses.append(child)

    if new_sgs or new_ses:
        result = copy.deepcopy(node)
        result["story_groups"] = new_sgs
        result["sub_epics"] = new_ses
        return result
    return None


_EVIDENCE_RE = re.compile(r"\n\s*\**Evidence:\**.*", re.DOTALL)


_AC_NUMBER_RE = re.compile(r"^\d+[a-z]?\.\s*")
_BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
_ITALIC_RE = re.compile(r"\*(.+?)\*")


def md_to_drawio_html(text: str) -> str:
    """Convert markdown bold/italic to Draw.io HTML tags."""
    text = _BOLD_RE.sub(r"<b>\1</b>", text)
    text = _ITALIC_RE.sub(r"<i>\1</i>", text)
    return text


def strip_evidence(ac_text: str) -> str:
    """Remove Evidence lines, leading AC numbers, and convert markdown to HTML for diagrams."""
    lines = ac_text.split("\n")
    kept = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("**Evidence:**") or stripped.startswith("Evidence:"):
            continue
        if stripped.startswith("<b>Evidence:</b>"):
            continue
        kept.append(line)
    text = "\n".join(kept).rstrip()
    text = _AC_NUMBER_RE.sub("", text)
    text = md_to_drawio_html(text)
    return text


def strip_evidence_from_graph(graph: dict) -> None:
    """Walk all stories and strip evidence from acceptance_criteria in-place."""
    for epic in graph.get("epics", []):
        _strip_node(epic)


def _strip_node(node: dict) -> None:
    for sg in node.get("story_groups", []):
        for story in sg.get("stories", []):
            story["acceptance_criteria"] = [
                strip_evidence(ac) for ac in story.get("acceptance_criteria", [])
            ]
    for se in node.get("sub_epics", []):
        _strip_node(se)


def slugify(name: str) -> str:
    return name.lower().replace(" ", "-").replace(",", "").replace("'", "")


def main():
    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    n_inc = len(graph.get("increments", []))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    env = dict(__import__("os").environ)
    env["PYTHONPATH"] = PYTHONPATH
    env["PYTHONIOENCODING"] = "utf-8"

    for i in range(n_inc):
        inc_name, filtered = filter_graph_for_increment(graph, i)
        strip_evidence_from_graph(filtered)
        slug = f"increment-{i+1}"
        out_path = OUT_DIR / f"{slug}-exploration.drawio"

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".json", delete=False, encoding="utf-8"
        ) as tmp:
            json.dump(filtered, tmp, indent=2, ensure_ascii=False)
            tmp_path = tmp.name

        print(f"\n--- {slug}: {inc_name} ---")
        epic_count = len(filtered["epics"])
        story_count = sum(
            len(s.get("stories", []))
            for e in filtered["epics"]
            for sg in e.get("story_groups", [])
            for s in [sg]
        ) + sum(
            len(s.get("stories", []))
            for e in filtered["epics"]
            for se in e.get("sub_epics", [])
            for sg in se.get("story_groups", [])
            for s in [sg]
        )
        print(f"  Epics: {epic_count}, Stories (approx): {story_count}")
        print(f"  Rendering → {out_path.name}")

        result = subprocess.run(
            [
                sys.executable, str(DRAWIO_CLI),
                "render",
                "--mode", "exploration",
                "--graph", tmp_path,
                "--out", str(out_path),
            ],
            env=env,
            capture_output=True,
            text=True,
        )
        Path(tmp_path).unlink(missing_ok=True)

        if result.returncode != 0:
            print(f"  ERROR (exit {result.returncode}):")
            print(f"  {result.stderr[:500]}")
        else:
            print(f"  OK — {out_path.name} written")

    print(f"\nDone — {n_inc} exploration diagrams in {OUT_DIR}")


if __name__ == "__main__":
    main()

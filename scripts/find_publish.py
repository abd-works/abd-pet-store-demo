import json
from pathlib import Path

g = json.loads(Path(r"c:\dev\abd-augmented-delivery-course\docs\story-graph.json").read_text(encoding="utf-8"))

for e in g["epics"]:
    for se in e.get("sub_epics", []):
        if se["name"] == "Publish Content":
            print(f"Found under epic: {e['name']}")
            for sg in se.get("story_groups", []):
                for s in sg.get("stories", []):
                    print(f"  story: {s['name']} ac: {len(s.get('acceptance_criteria', []))}")
        for se2 in se.get("sub_epics", []):
            if se2["name"] == "Publish Content":
                print(f"Found nested under epic: {e['name']} > {se['name']}")

# Also check if Publish Content is a top-level epic
for e in g["epics"]:
    if e["name"] == "Publish Content":
        print(f"Publish Content IS an epic itself")
        for sg in e.get("story_groups", []):
            for s in sg.get("stories", []):
                print(f"  story: {s['name']} ac: {len(s.get('acceptance_criteria', []))}")

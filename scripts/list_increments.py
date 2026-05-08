import json
from pathlib import Path

g = json.loads(Path(r"c:\dev\abd-augmented-delivery-course\docs\story-graph.json").read_text(encoding="utf-8"))
for i, inc in enumerate(g.get("increments", []), 1):
    stories = inc.get("stories", [])
    print(f"{i}. {inc['name']} ({len(stories)} stories)")

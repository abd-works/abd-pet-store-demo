import re
from pathlib import Path

text = Path(r"c:\dev\abd-augmented-delivery-course\docs\acceptance-criteria\increment-1-exploration.drawio").read_text(encoding="utf-8")
for m in re.finditer(r'ac-\d+" value="(.*?)"', text):
    val = m.group(1).replace("&#10;", "\n").replace("&quot;", '"').replace("&gt;", ">").replace("&lt;", "<")
    print("---")
    print(val[:300])
    print()

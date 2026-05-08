import pathlib

p = pathlib.Path(r"c:\Users\thoma\.cursor\skills\abd-acceptance-criteria\SKILL.md")
text = p.read_text(encoding="utf-8")

anchor = "unless the story is explicitly technical and scoped that way).\n\n### Domain terms"
new_rule = (
    "unless the story is explicitly technical and scoped that way).\n"
    '- **Never describe capability** (\u201cthe customer can override\u201d, \u201cstaff can contact\u201d). '
    "AC describe **state**: something is displayed, shown, provided, or available. "
    "If the actor acts on it, that is a separate **WHEN**. "
    'Write \u201cAND an override field is displayed\u201d or \u201cWHEN the customer overrides the field, THEN\u2026\u201d '
    '\u2014 never \u201cAND the customer can override the field.\u201d\n'
    "\n### Domain terms"
)

if anchor in text:
    text = text.replace(anchor, new_rule, 1)
    p.write_text(text, encoding="utf-8")
    print("Updated SKILL.md")
else:
    print("Anchor not found!")
    idx = text.find("### Domain terms")
    print(f"Domain terms at char {idx}")
    idx2 = text.find("scoped that way)")
    print(f"scoped that way at char {idx2}")
    print(repr(text[idx2:idx2+80]))

import pathlib

p = pathlib.Path(r"c:\dev\abd-augmented-delivery-course\corrections-log.md")
text = p.read_text(encoding="utf-8")

entry = (
    "\n\n---\n\n"
    "## Entry: AC used capability language instead of observable state\n\n"
    "- **Status:** confirmed and fixed\n"
    "- **Context:** All 9 increment AC files (docs/acceptance-criteria/increment-{1..9}-acceptance-criteria.md). "
    "~25 AC lines used \u201cthe customer can...\u201d or \u201cstaff can...\u201d phrasing, "
    "describing what an actor is able to do rather than what the system shows or provides.\n"
    "- **DO / DO NOT:** DO describe system state in AND/THEN/BUT clauses: "
    "\u201ca retry option is displayed\u201d, \u201can editable field is shown\u201d, "
    "\u201cthe notification status is visible\u201d. "
    "If the actor acts on the displayed element, that is a separate WHEN/THEN AC. "
    "DO NOT write \u201cthe customer can override\u201d, \u201cstaff can contact\u201d, "
    "\u201cthe customer can sort\u201d \u2014 these describe capability, not observable behavior.\n"
    "- **Example (wrong):** `AND the customer can override individual fields if needed`\n"
    "- **Example (correct):** `WHEN the customer overrides an individual field on the pre-filled "
    "Shipping Address / THEN the overridden value replaces the billing value for that field only` "
    "(separate AC with its own trigger-response pair).\n"
    "- **Likely source:** Natural English tendency to describe what a user \u201ccan do\u201d "
    "rather than what the system presents. The abd-acceptance-criteria skill\u2019s Step section says "
    "\u201cobservable behavior\u201d but did not explicitly prohibit capability language.\n"
    "- **Skill improvement:** Added a new bullet to `abd-acceptance-criteria/SKILL.md` \u00a7 Step: "
    "\u201cNever describe capability\u201d with examples and the correct pattern.\n"
)

text += entry
p.write_text(text, encoding="utf-8")
print("Appended correction entry")

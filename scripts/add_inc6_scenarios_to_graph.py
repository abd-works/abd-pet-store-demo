"""
Add Increment 6 specification-by-example scenario outlines to story-graph.json.
Reads the SBE markdown and populates scenario_outlines on matching stories.
"""
import json
import re

GRAPH_FILE = r"c:\dev\abd-pet-store-demo\docs\story\story-graph.json"
SBE_FILE   = r"c:\dev\abd-pet-store-demo\docs\story\specification-by-example\increment-6-specification-by-example.md"

# ---------------------------------------------------------------------------
# Story name → canonical graph story name mapping (SBE heading → graph name)
# ---------------------------------------------------------------------------
STORY_MAP = {
    "Browse Pets by Species":                              "Browse Pets by Species",
    "View Pet Profile":                                    "View Pet Profile",
    "View Pet Store Location and Distance":                "View Pet Store Location and Distance",
    "View Available Time Slots at Store":                  "View Available Time Slots at Store",
    "Select Date and Time Slot":                           "Select Date and Time Slot",
    "Add Visit Note":                                      "Add Visit Note",
    "Confirm Appointment Booking":                         "Confirm Appointment Booking",
    "View Upcoming and Past Appointments":                 "View Upcoming and Past Appointments",
    "Cancel or Rebook Appointment After Pet Adoption":     "Cancel or Rebook Appointment After Pet Adoption",
    "Update Pet Profile":                                  "Update Pet Profile",
    "Mark Pet as Adopted":                                 "Mark Pet as Adopted",
    "View Incoming Appointments":                          "View Incoming Appointments",
    "Send Appointment Reminder":                           "Send Appointment Reminder",
    "Send Pet Adopted Before Visit Notification":          "Send Pet Adopted Before Visit Notification",
    "Check In Customer":                                   "Check In Customer",
    "Record Visit Outcome":                               "Record Visit Outcome",
    "Record No-Show":                                      "Record No-Show",
    "Set Follow-Up Action":                                "Set Follow-Up Action",
    "Send Visit Follow-Up Notification":                   "Send Visit Follow-Up Notification",
}

def parse_sbe_file(path):
    """Parse SBE markdown and return {story_name: [scenario_outline, ...]}."""
    with open(path, encoding="utf-8") as f:
        content = f.read()

    stories = {}
    current_story = None
    current_outline = None
    collecting_steps = False
    lines = content.split("\n")

    i = 0
    while i < len(lines):
        line = lines[i]

        # Detect story heading
        m = re.match(r"^## Story: `(.+?)`", line)
        if m:
            current_story = m.group(1).strip()
            if current_story not in stories:
                stories[current_story] = []
            current_outline = None
            collecting_steps = False
            i += 1
            continue

        # Detect scenario outline heading
        if current_story and re.match(r"^### Scenario Outline:", line):
            name = re.sub(r"^### Scenario Outline:\s*", "", line).strip()
            current_outline = {"name": name, "steps": []}
            stories[current_story].append(current_outline)
            collecting_steps = True
            i += 1
            continue

        # Collect Given/When/Then/And/But steps inside a scenario outline
        if collecting_steps and current_outline is not None:
            stripped = line.strip()
            if stripped.startswith(("Given ", "When ", "Then ", "And ", "But ")):
                current_outline["steps"].append(stripped)
                i += 1
                continue
            # Stop collecting on blank or table / new section
            if stripped.startswith("|") or stripped.startswith("#") or stripped == "---":
                collecting_steps = False
                i += 1
                continue
            # Empty line — allow one gap then stop
            if stripped == "":
                # Look ahead: if next non-empty line is a step keyword, keep going
                j = i + 1
                while j < len(lines) and lines[j].strip() == "":
                    j += 1
                if j < len(lines) and lines[j].strip().startswith(
                    ("Given ", "When ", "Then ", "And ", "But ")
                ):
                    i = j
                    continue
                else:
                    collecting_steps = False
                    i += 1
                    continue

        i += 1

    return stories


def find_story_node(data, story_name):
    """Return the story dict in the graph with the given name, or None."""
    for epic in data.get("epics", []):
        for se in epic.get("sub_epics", []):
            for sg in se.get("story_groups", []):
                for s in sg.get("stories", []):
                    if s.get("name") == story_name:
                        return s
    return None


def main():
    print("Loading story graph…")
    with open(GRAPH_FILE, encoding="utf-8") as f:
        data = json.load(f)

    print("Parsing SBE file…")
    sbe_stories = parse_sbe_file(SBE_FILE)

    updated = 0
    for sbe_name, outlines in sbe_stories.items():
        graph_name = STORY_MAP.get(sbe_name)
        if not graph_name:
            print(f"  SKIP  (no mapping): {sbe_name}")
            continue
        node = find_story_node(data, graph_name)
        if node is None:
            print(f"  MISS  (not in graph): {graph_name}")
            continue
        node["scenario_outlines"] = outlines
        print(f"  OK    {graph_name}: {len(outlines)} scenario outlines")
        updated += 1

    print(f"\nUpdated {updated}/{len(STORY_MAP)} stories.")

    print("Writing updated graph…")
    with open(GRAPH_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Done.")


if __name__ == "__main__":
    main()

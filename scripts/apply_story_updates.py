"""Apply domain-decision-driven story additions to docs/story-graph.json.

Adds 6 new stories into the epics tree at the right sub_epic/story_group, and
also adds them into the appropriate increments arrays. Renumbers
sequential_order locally where required.
"""
import json
from pathlib import Path

GRAPH_PATH = Path("c:/dev/abd-augmented-delivery-course/docs/story-graph.json")

with GRAPH_PATH.open("r", encoding="utf-8") as f:
    g = json.load(f)


def find_sub_epic(epic_name, sub_epic_name):
    for e in g["epics"]:
        if e["name"] == epic_name:
            for se in e["sub_epics"]:
                if se["name"] == sub_epic_name:
                    return se
    raise KeyError(f"sub_epic {epic_name!r} > {sub_epic_name!r} not found")


def insert_story(epic_name, sub_epic_name, story_name, story_type, after_name=None, at_end=False):
    """Insert a story into the first story_group of the given sub_epic.
    Renumbers all stories in that group to keep sequential_order contiguous.
    """
    se = find_sub_epic(epic_name, sub_epic_name)
    sg = se["story_groups"][0]
    stories = sg["stories"]
    if at_end:
        idx = len(stories)
    elif after_name is not None:
        idx = next(i for i, s in enumerate(stories) if s["name"] == after_name) + 1
    else:
        idx = len(stories)
    stories.insert(idx, {"name": story_name, "story_type": story_type, "sequential_order": 0.0})
    for i, s in enumerate(stories, start=1):
        s["sequential_order"] = float(i)
    return story_name


inserts = [
    # epic, sub_epic, story_name, story_type, after_name
    ("Book Pet Visit", "Manage Appointments", "Cancel or Rebook Appointment After Pet Adoption",
     "Customer", "View Upcoming and Past Appointments"),
    ("Manage Customer Account", "Manage Profile", "Manage Saved Addresses",
     "Customer", "Save Delivery Address"),
    ("Manage Customer Account", "Manage Profile", "Manage Saved Payment Methods",
     "Customer", "Save Payment Method"),
    ("Purchase Products", "Check Out", "Select Saved Address at Checkout",
     "Customer", "Enter Billing Address"),
    ("Purchase Products", "Process Payment", "Select Saved Payment Method at Checkout",
     "Customer", "Select Payment Method"),
    ("Manage Notifications", "Send Transactional Notifications", "Send Pet Adopted Before Visit Notification",
     "System", "Send Appointment Reminder"),
]

for ep, se, name, stype, after in inserts:
    insert_story(ep, se, name, stype, after_name=after)
    print(f"inserted: {ep!r} > {se!r} > {name!r}")


def append_story_to_increment(increment_name, story_name):
    inc = next(i for i in g["increments"] if i["name"] == increment_name)
    next_order = max((s["sequential_order"] for s in inc["stories"]), default=0.0) + 1.0
    inc["stories"].append({"name": story_name, "sequential_order": next_order})
    print(f"appended to increment {increment_name!r}: {story_name!r}")


inc_map = {
    "Returning customers - accounts, history, reorder": [
        "Manage Saved Addresses",
        "Manage Saved Payment Methods",
        "Select Saved Address at Checkout",
        "Select Saved Payment Method at Checkout",
    ],
    "Pet visits - gallery and in-store appointments": [
        "Cancel or Rebook Appointment After Pet Adoption",
        "Send Pet Adopted Before Visit Notification",
    ],
}

for inc_name, story_names in inc_map.items():
    for sn in story_names:
        append_story_to_increment(inc_name, sn)


with GRAPH_PATH.open("w", encoding="utf-8") as f:
    json.dump(g, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"\nwrote {GRAPH_PATH}")

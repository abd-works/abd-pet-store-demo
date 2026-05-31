#!/usr/bin/env python3
"""Generate Run 6 war-room slot-NN-start.md files (slots 119-144)."""
from __future__ import annotations

from pathlib import Path

WAR_ROOM = Path(__file__).resolve().parents[1] / "delivery-war-room"
WORKSPACE = r"c:\dev\abd-pet-store-demo"
RUN = "Run 6 — Increment 5: Pay your way"
SCOPE = "Increment 5 — Pay your way (PayNova, VaultPay, retry)"
CORRECTIONS = "docs/corrections-log.md — filter by stage + Increment 5"

# (slot, stage, role, slot_type, depends_on, skills, title, prior_executor, body_lines)
SLOTS: list[tuple] = [
    (
        119,
        "exploration",
        "business-expert",
        "executor",
        ["110"],
        ["abd-ubiquitous-language", "drawio-domain-sync"],
        "Increment 5 UL executor",
        None,
        [
            "Cross-run entry: opens parallel to Run 5 engineering 115–118 (`depends_on: \"110\"` = Run 5 spec exit).",
            "",
            "Refresh ubiquitous language for Increment 5: PayNova, VaultPay, payment vendor abstraction, failed-payment retry, refund routing foundation.",
            "",
            "Stories: *Process Digital Wallet Payment via PayNova*, *Process Buy-Now-Pay-Later via VaultPay*, *Retry Failed Payment*.",
            "",
            "Render/update `docs/end-to-end/exploration/domain/ubiquitous-language.drawio` via drawio-domain-sync.",
            "",
            "**DO NOT** implement production code — exploration UL only. Preserve StripeWave and Increments 1–4 terms.",
        ],
    ),
    (
        120,
        "exploration",
        "business-expert",
        "reviewer",
        ["119"],
        ["abd-ubiquitous-language", "drawio-domain-sync"],
        "Increment 5 UL reviewer",
        119,
        [
            "Review slot 119 UL for Increment 5. Run scanners on UL artifacts. Validate exploration exit-gate items scoped to UL.",
            "",
            "Scope guard: multi-vendor alongside StripeWave; retry/refund routing vocabulary only — no implementation.",
        ],
    ),
    (
        121,
        "exploration",
        "product-owner",
        "executor",
        ["120"],
        ["abd-acceptance-criteria", "drawio-story-sync"],
        "Increment 5 AC executor",
        None,
        [
            "Increment 5 acceptance criteria + exploration diagrams for PayNova, VaultPay, retry failed payment.",
            "",
            "Output: `docs/end-to-end/exploration/stories/acceptance-criteria.md` (+ drawio companion if used).",
            "",
            "Align to refreshed UL and thin-slicing Increment 5 stories.",
        ],
    ),
    (
        122,
        "exploration",
        "product-owner",
        "reviewer",
        ["121"],
        ["abd-acceptance-criteria", "drawio-story-sync"],
        "Increment 5 AC reviewer",
        121,
        [
            "Review slot 121 AC + diagrams. Run scanners. Validate exploration AC exit-gate for Increment 5.",
        ],
    ),
    (
        123,
        "exploration",
        "ux-designer",
        "executor",
        ["122"],
        ["abd-ux-mockup"],
        "Increment 5 lo-fi mockup executor",
        None,
        [
            "Lo-fi payment method selection — wallet (PayNova) + BNPL (VaultPay) alongside existing card flow.",
            "",
            "Output under `docs/ux/lo-fi/` for Increment 5; companion markdown as per skill.",
        ],
    ),
    (
        124,
        "exploration",
        "ux-designer",
        "reviewer",
        ["123"],
        ["abd-ux-mockup"],
        "Increment 5 lo-fi mockup reviewer",
        123,
        [
            "Review slot 123 mockups. Run scanners. Validate exploration UX exit-gate for Increment 5 payment selection.",
        ],
    ),
    (
        125,
        "exploration",
        "engineer",
        "executor",
        ["124"],
        ["abd-architecture-template"],
        "Increment 5 architecture template executor",
        None,
        [
            "Architecture template — multi-vendor payment, webhooks, retry policy for Increment 5.",
            "",
            "Extend architecture template artifacts per skill; no production code.",
        ],
    ),
    (
        126,
        "exploration",
        "engineer",
        "reviewer",
        ["125"],
        ["abd-architecture-template"],
        "Increment 5 architecture template reviewer",
        125,
        [
            "Review slot 125 template sections. Run scanners. Validate exploration architecture-template exit-gate.",
        ],
    ),
    (
        127,
        "specification",
        "business-expert",
        "executor",
        ["126"],
        ["abd-class-responsibility-collaborator"],
        "Increment 5 CRC executor",
        None,
        [
            "CRC — payment vendor abstraction, retry, refund routing for Increment 5.",
            "",
            "Output: refresh `docs/end-to-end/specification/crc.md` Increment 5 sections.",
        ],
    ),
    (
        128,
        "specification",
        "business-expert",
        "reviewer",
        ["127"],
        ["abd-class-responsibility-collaborator"],
        "Increment 5 CRC reviewer",
        127,
        [
            "Review slot 127 CRC. Run scanners. Validate specification CRC exit-gate for Increment 5.",
        ],
    ),
    (
        129,
        "specification",
        "product-owner",
        "executor",
        ["128"],
        ["abd-specification-by-example"],
        "Increment 5 spec-by-example executor",
        None,
        [
            "Output: `docs/end-to-end/specification/specification-by-example.md`.",
        ],
    ),
    (
        130,
        "specification",
        "product-owner",
        "reviewer",
        ["129"],
        ["abd-specification-by-example"],
        "Increment 5 spec-by-example reviewer",
        129,
        [
            "Review slot 129 spec-by-example. Run scanners. Validate specification exit-gate items.",
        ],
    ),
    (
        131,
        "specification",
        "business-expert",
        "executor",
        ["130"],
        ["abd-scenario-walkthrough"],
        "Increment 5 scenario walkthrough executor",
        None,
        [
            "Walk payment + retry scenarios through domain model for Increment 5.",
            "",
            "Output: `docs/increments/5-pay-your-way/engineering/object-model.md` (or per-skill convention).",
        ],
    ),
    (
        132,
        "specification",
        "business-expert",
        "reviewer",
        ["131"],
        ["abd-scenario-walkthrough"],
        "Increment 5 scenario walkthrough reviewer",
        131,
        [
            "Review slot 131 walkthrough. Run scanners. Validate specification walkthrough exit-gate.",
        ],
    ),
    (
        133,
        "specification",
        "ux-designer",
        "executor",
        ["132"],
        ["abd-interface-design"],
        "Increment 5 interface design executor",
        None,
        [
            "Output: `docs/increments/5-pay-your-way/specification/interface-design.md` and related lo-fi companion paths.",
        ],
    ),
    (
        134,
        "specification",
        "ux-designer",
        "reviewer",
        ["133"],
        ["abd-interface-design"],
        "Increment 5 interface design reviewer",
        133,
        [
            "Review slot 133 interface design. Run scanners. Scope: three-vendor payment selection UI spec.",
        ],
    ),
    (
        135,
        "specification",
        "engineer",
        "executor",
        ["134"],
        ["abd-architecture-reference"],
        "Increment 5 architecture reference executor",
        None,
        [
            "Reference — PayNova, VaultPay, webhook + retry mechanisms in `docs/end-to-end/specification/architecture-reference.md`.",
        ],
    ),
    (
        136,
        "specification",
        "engineer",
        "reviewer",
        ["135"],
        ["abd-architecture-reference"],
        "Increment 5 architecture reference reviewer",
        135,
        [
            "Review slot 135 architecture reference. Run scanners. Validate specification architecture-reference exit-gate.",
        ],
    ),
    (
        137,
        "engineering",
        "ux-designer",
        "executor",
        ["136"],
        ["abd-interface-design"],
        "Increment 5 UI implementation executor",
        None,
        [
            "Payment selection UI implementation pass — three vendors (StripeWave + PayNova + VaultPay).",
            "",
            "Depends on Run 6 spec exit (slot 136). May run parallel to Run 5 engineering 117–118 if Run 6 spec completes first.",
        ],
    ),
    (
        138,
        "engineering",
        "ux-designer",
        "reviewer",
        ["137"],
        ["abd-interface-design"],
        "Increment 5 UI implementation reviewer",
        137,
        [
            "Review slot 137 UI implementation. Run scanners. Validate engineering interface-design exit-gate.",
        ],
    ),
    (
        139,
        "engineering",
        "engineer",
        "executor",
        ["138"],
        ["abd-object-model"],
        "Increment 5 object model executor",
        None,
        [
            "Payment vendor abstraction + retry types in shared packages and `docs/end-to-end/engineering/object-model.md`.",
        ],
    ),
    (
        140,
        "engineering",
        "engineer",
        "reviewer",
        ["139"],
        ["abd-object-model"],
        "Increment 5 object model reviewer",
        139,
        [
            "Review slot 139 object model. Run abd-object-model scanners. Validate engineering object-model exit-gate.",
        ],
    ),
    (
        141,
        "engineering",
        "engineer",
        "executor",
        ["140"],
        ["abd-acceptance-test-driven-development", "mern-technical-architecture"],
        "Increment 5 ATDD RED executor",
        None,
        [
            "Write failing acceptance tests (RED) for Increment 5 payment + retry under `tests/` per MERN patterns.",
            "",
            "Tests may fail (RED) until slot 143 GREEN — npm test must run without infrastructure errors.",
        ],
    ),
    (
        142,
        "engineering",
        "engineer",
        "reviewer",
        ["141"],
        ["abd-acceptance-test-driven-development", "mern-technical-architecture"],
        "Increment 5 ATDD RED reviewer",
        141,
        [
            "Review slot 141 ATDD tests. Run scanners with `--language javascript`. RED behavior failures OK.",
        ],
    ),
    (
        143,
        "engineering",
        "engineer",
        "executor",
        ["142"],
        ["abd-clean-code", "mern-technical-architecture"],
        "Increment 5 clean code GREEN executor",
        None,
        [
            "GREEN — multi-vendor payment + retry production code. All Increment 5 tests PASS from conf/.",
        ],
    ),
    (
        144,
        "engineering",
        "engineer",
        "reviewer",
        ["143"],
        ["abd-clean-code", "mern-technical-architecture"],
        "Increment 5 clean code GREEN reviewer",
        143,
        [
            "Review slot 143 GREEN implementation. Run abd-clean-code + MERN scanners. npm test all green.",
        ],
    ),
]


def yaml_list(items: list[str], indent: int = 0) -> str:
    pad = " " * indent
    if not items:
        return "[]"
    return "\n".join(f'{pad}- "{x}"' for x in items)


def artifact_paths(slot: int, role: str, stage: str) -> list[str]:
    paths = [f"docs/planning/delivery-war-room/slot-{slot}-finished.md"]
    if role == "business-expert" and stage == "exploration":
        paths += [
            "docs/end-to-end/exploration/domain/ubiquitous-language.md",
            "docs/end-to-end/specification/domain.json",
            "docs/end-to-end/exploration/domain/ubiquitous-language.drawio",
        ]
    elif role == "product-owner" and stage == "exploration":
        paths += [
            "docs/end-to-end/exploration/stories/acceptance-criteria.md",
        ]
    elif role == "engineer" and stage == "engineering":
        paths += ["docs/end-to-end/engineering/object-model.md", "tests/"]
    return paths


def render_slot(
    slot: int,
    stage: str,
    role: str,
    slot_type: str,
    depends_on: list[str],
    skills: list[str],
    title: str,
    prior_executor: int | None,
    body_lines: list[str],
) -> str:
    lines = [
        f"# Slot {slot} — Start ({RUN} — {title})",
        "",
        "```yaml",
        f"team-role: {role}",
        f"slot_type: {slot_type}",
        f"workspace: {WORKSPACE}",
        f'run: "{RUN}"',
        f"stage: {stage}",
        "depends_on:",
        yaml_list(depends_on, 2),
        f"run_scope: {SCOPE}",
    ]
    if skills:
        lines.append("skills:")
        lines.extend(f"  - {s}" for s in skills)
    if slot_type == "reviewer" and prior_executor is not None:
        lines.append(f"prior_executor_slot: {prior_executor}")
        lines.append("artifact_paths:")
        for p in artifact_paths(prior_executor, role, stage):
            lines.append(f"  - {p}")
        if skills:
            lines.append(f"practice_skill_under_review: {skills[0]}")
    lines.append(f"corrections: {CORRECTIONS}")
    lines.append("checkpoint: none")
    if slot_type == "executor":
        lines.append("entry_conditions_met:")
        for dep in depends_on:
            lines.append(f"  - slot-{dep}-finished.md exists")
        if slot == 119:
            lines.append("  - Run 5 specification exit (slot 110) — parallel to Run 5 engineering")
            lines.append("  - story/story-graph.json valid")
    lines.append("```")
    lines.append("")
    lines.extend(body_lines)
    lines.append("")
    lines.append(f"Write `slot-{slot}-finished.md`.")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    WAR_ROOM.mkdir(parents=True, exist_ok=True)
    for row in SLOTS:
        slot, stage, role, slot_type, depends_on, skills, title, prior, body = row
        path = WAR_ROOM / f"slot-{slot}-start.md"
        path.write_text(
            render_slot(slot, stage, role, slot_type, depends_on, skills, title, prior, body),
            encoding="utf-8",
        )
        print(f"wrote {path.name}")


if __name__ == "__main__":
    main()

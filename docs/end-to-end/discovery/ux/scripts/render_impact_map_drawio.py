#!/usr/bin/env python3
"""Render impact-map-ascii.md to impact-map.drawio (four-column wall + connectors)."""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

# Column layout (ABD training wall: Why | Who | How | What)
COLS = [
    ("OBJECTIVE (Why?)", 40, 300),
    ("PERSONA (Who?)", 360, 260),
    ("IMPACT (How?)", 640, 300),
    ("INITIATIVE (What?)", 960, 300),
]
ROW_H = 44
HEADER_H = 48
START_Y = 60

STYLE = {
    "header": "rounded=0;whiteSpace=wrap;html=1;fillColor=#37474f;strokeColor=#263238;fontColor=#ffffff;fontStyle=1;fontSize=12;verticalAlign=middle;align=center;",
    "goal": "ellipse;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontStyle=1;fontSize=11;verticalAlign=middle;align=center;",
    "goal_metric": "rounded=1;whiteSpace=wrap;html=1;fillColor=#fff9e6;strokeColor=#d6b656;fontStyle=2;fontSize=10;verticalAlign=middle;align=left;spacingLeft=6;",
    "note": "rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#bdbdbd;fontStyle=2;fontSize=10;verticalAlign=middle;align=left;spacingLeft=6;dashed=1;",
    "actor": "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=10;verticalAlign=middle;align=center;",
    "impact": "rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=10;verticalAlign=middle;align=center;",
    "impact_metric": "rounded=1;whiteSpace=wrap;html=1;fillColor=#f3e8f8;strokeColor=#9673a6;fontStyle=2;fontSize=9;verticalAlign=middle;align=left;spacingLeft=6;",
    "initiative": "rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=10;verticalAlign=middle;align=center;",
    "edge": "edgeStyle=orthogonalEdgeStyle;html=1;strokeColor=#666666;endArrow=block;endFill=1;fontSize=9;",
}


def esc(text: str) -> str:
    return html.escape(text.strip(), quote=True)


def parse_ascii_table(lines: list[str]) -> list[dict]:
    rows: list[dict] = []
    for raw in lines:
        line = raw.rstrip()
        if not line or line.startswith("---") or "OBJECTIVE (Why?)" in line:
            continue
        if line.startswith("|"):
            parts = [p.strip() for p in line.split("|")[1:-1]]
            while len(parts) < 3:
                parts.append("")
            persona, impact, initiative = parts[0], parts[1], parts[2]
            joined = " ".join(parts)
            if "#" in joined and not initiative and not (persona and impact and not persona.startswith("#")):
                metric = ""
                for p in parts:
                    if p.startswith("#"):
                        metric = p.removeprefix("#").strip()
                        break
                if metric:
                    rows.append({"kind": "impact_metric", "text": metric})
                    continue
            if initiative:
                rows.append(
                    {
                        "kind": "initiative",
                        "persona": persona,
                        "impact": impact,
                        "initiative": initiative,
                    }
                )
            elif persona and impact:
                rows.append({"kind": "impact_row", "persona": persona, "impact": impact})
            continue
        text = line.strip()
        if text.endswith("| | |"):
            text = text[: -len("| | |")].strip()
        if text.startswith("#"):
            rows.append({"kind": "goal_metric", "text": text.removeprefix("#").strip()})
        elif text.startswith("NOTE:") or text.startswith("ASSUMPTION:"):
            rows.append({"kind": "note", "text": text})
        elif text:
            rows.append({"kind": "goal", "text": text})
    return rows


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    src = root / "impact-map-ascii.md"
    out = root / "impact-map.drawio"
    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    if len(sys.argv) > 2:
        out = Path(sys.argv[2])

    text = src.read_text(encoding="utf-8")
    m = re.search(r"```text\n(.*?)```", text, re.DOTALL)
    if not m:
        print("No ```text block found", file=sys.stderr)
        return 1
    rows = parse_ascii_table(m.group(1).splitlines())

    cells: list[str] = []
    edges: list[str] = []
    cid = 2

    def cell(style: str, value: str, x: float, y: float, w: float, h: float, parent: str = "1") -> str:
        nonlocal cid
        id_ = str(cid)
        cid += 1
        cells.append(
            f'                <mxCell id="{id_}" value="{esc(value)}" style="{style}" parent="{parent}" vertex="1">\n'
            f'                    <mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/>\n'
            f"                </mxCell>"
        )
        return id_

    def edge(source: str, target: str) -> None:
        nonlocal cid
        id_ = str(cid)
        cid += 1
        edges.append(
            f'                <mxCell id="{id_}" style="{STYLE["edge"]}" parent="1" source="{source}" target="{target}" edge="1">\n'
            f'                    <mxGeometry relative="1" as="geometry"/>\n'
            f"                </mxCell>"
        )

    # Column headers
    for label, x, w in COLS:
        cell(STYLE["header"], label, x, 10, w, HEADER_H)

    y = START_Y
    current_goal_id: str | None = None
    current_actor_id: str | None = None
    current_impact_id: str | None = None

    for row in rows:
        kind = row["kind"]
        if kind == "goal":
            current_goal_id = cell(STYLE["goal"], row["text"], COLS[0][1], y, COLS[0][2], ROW_H + 8)
            y += ROW_H + 12
            continue
        if kind == "goal_metric":
            cell(STYLE["goal_metric"], f"# {row['text']}", COLS[0][1], y, COLS[0][2], ROW_H - 8)
            y += ROW_H - 4
            continue
        if kind == "note":
            cell(STYLE["note"], row["text"], COLS[0][1], y, COLS[0][2] + COLS[1][2] + 40, ROW_H - 4)
            y += ROW_H
            continue
        if kind == "impact_metric":
            cell(STYLE["impact_metric"], f"# {row['text']}", COLS[2][1], y, COLS[2][2], ROW_H - 8)
            y += ROW_H - 4
            continue
        if kind == "impact_row":
            current_actor_id = cell(STYLE["actor"], row["persona"], COLS[1][1], y, COLS[1][2], ROW_H)
            current_impact_id = cell(STYLE["impact"], row["impact"], COLS[2][1], y, COLS[2][2], ROW_H + 4)
            if current_goal_id:
                edge(current_goal_id, current_actor_id)
            edge(current_actor_id, current_impact_id)
            y += ROW_H + 6
            continue
        if kind == "initiative":
            actor_id = cell(STYLE["actor"], row["persona"], COLS[1][1], y, COLS[1][2], ROW_H)
            impact_id = cell(STYLE["impact"], row["impact"], COLS[2][1], y, COLS[2][2], ROW_H + 4)
            init_id = cell(STYLE["initiative"], row["initiative"], COLS[3][1], y, COLS[3][2], ROW_H)
            if current_goal_id:
                edge(current_goal_id, actor_id)
            edge(actor_id, impact_id)
            edge(impact_id, init_id)
            y += ROW_H + 6

    page_h = int(y + 120)
    page_w = 1320

    xml = f"""<mxfile host="app.diagrams.net" agent="render_impact_map_drawio.py">
    <diagram id="impact-map-pawplace" name="PawPlace impact map">
        <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{page_w}" pageHeight="{page_h}" math="0" shadow="0">
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
{chr(10).join(cells)}
{chr(10).join(edges)}
            </root>
        </mxGraphModel>
    </diagram>
</mxfile>
"""
    out.write_text(xml, encoding="utf-8")
    print(f"Wrote {out} ({len(rows)} logical rows, {len(cells)} cells, {len(edges)} edges)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

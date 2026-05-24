# Corrections log

Engagement: PawPlace (`abd-pet-store-demo`)
Source: delivery-war-room reviewer slot 02 (`abd-domain-terms` review of slot 01)

---

## Entry: Ref traceability format for gap and CRC-derived terms

- **Status:** confirmed
- **Context:** Reviewer slot 02 — `docs/domain/domain-terms.md` produced by executor slot 01 (`abd-domain-terms`); fixed in rework executor slot 03
- **Affects:** stage: discovery · role: business-expert · skill: abd-domain-terms · run: Run 1
- **DO / DO NOT:** DO use the full `**Ref — title**` / `Source:` / `Locator:` / `Extract:` structure with a fenced `source` block for **every** term reference — including gap terms sourced from story-graph and CRC-derived terms without prior quotes. DO NOT substitute a prose-only `References` section or inline prose citation when the refs-per-term rule requires the structured Ref block.
- **Example (wrong):** Eight terms (`pet source`, `pet lineage`, `visit outcome`, `check-in`, `no-show`, `follow-up action`, `cart item`, `order line item`) document References as prose only — no `**Ref —**` heading, no Source/Locator/Extract fields, no fenced `source` block.
- **Example (correct):** `visit outcome` term in `docs/domain/domain-terms.md` — full Ref block with story-graph story JSON in fenced `source` block; CRC-derived terms quote `docs/domain/crc.md` verbatim.
- **Likely source:** instruction not read — executor treated gap/CRC-derived terms as exempt from full Ref format

---

## Entry: Boundary term owner field format (optional if scanners remain broken)

- **Status:** confirmed
- **Context:** Reviewer slot 02 — boundary terms in `docs/domain/domain-terms.md`; aligned in rework executor slot 03
- **Affects:** stage: discovery · role: business-expert · skill: abd-domain-terms
- **DO / DO NOT:** DO place `Owned by: <Module>` as a dedicated field line immediately after the term heading when aligning to bundled scanner rules. DO NOT rely solely on `*(owned by: …)*` in the heading if mechanical scanners are fixed and re-run.
- **Example (wrong):** `# Boundary Domain` section with owners only in heading suffix `*(owned by: Content Management)*`.
- **Example (correct):** `### content` followed by `Owned by: Content Management` field line before behavioral bullets (see `docs/domain/domain-terms.md` boundary section).
- **Likely source:** edge case — engagement layout differs from default scanner path expectations

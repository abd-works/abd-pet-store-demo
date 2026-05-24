# Slot 01 — Start

```yaml
team-role: business-expert
workspace: c:\dev\abd-pet-store-demo
stage: discovery
run_scope: system-wide — gap-check domain terms against existing PawPlace artifacts
skills:
  - abd-domain-terms
corrections: none yet — log domain corrections in repo-root corrections-log.md when they arise
checkpoint: after_stage
entry_conditions_met:
  - story/story-graph.json exists
  - docs/domain/key-abstractions.md, crc.md, object-model.md exist
  - partial MERN code exists at packages/ — Increment 1 only, incomplete
early_questions:
  - scope-unclear: Cannot reconcile story-graph story names with key-abstractions terms — STOP and write blocked.md
  - term-conflict: Same concept named differently in graph vs domain with no clear canonical choice — STOP and write blocked.md
```

## Context

- Upstream artifacts:
  - `story/story-graph.json` — 10 epics, 65 stories, 9 increments
  - `story/thin-slicing.md` — Increment 1: walk-in driver (store locator + catalog + stock)
  - `docs/domain/key-abstractions.md`, `crc.md`, `object-model.md`
  - `packages/product-catalog/`, `packages/store/` — Increment 1 spike only; Run 2 delivers the full slice from UX onward
  - `conf/` — vitest, playwright, tsconfig, package deps (`npm install --prefix conf`)
  - `.cursor/agents/`, `.cursor/skills/` — delivery harness agents and planning skills
  - `docs/external-context/requirements-chat-with-product-owner.md`
- Decisions from prior stages:
  - MERN stack chosen; module layout follows Run 1 IA and Run 2 interface spec
  - Increment 1 is payment-free, account-free — no cart/checkout
  - Shaping waived — brownfield; thin slicing authoritative at `story/thin-slicing.md`
- Open questions:
  - Whether `key-abstractions.md` should be superseded by `domain-terms.md` output or merged

## Filtered corrections

- Domain attribute details belong in KA term definitions, not story titles (record in `corrections-log.md` when created)

## Deliverable

Produce or refresh `docs/domain/domain-terms.md` per `abd-domain-terms` skill — grouped terms ready for ubiquitous-language pass in slot 02. Light refresh only; do not rewrite domain from scratch unless gaps are documented in finished file.

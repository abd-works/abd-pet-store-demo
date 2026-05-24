# Team roles

Four roles map to four practice skill **families**. The delivery lead assigns **`team-role`** per slot in `slot-NN-start.md`.

**Bootcamp reference:** [Five Families × Five Stages](https://forge.abdworks.net/abd-ai-augmented-bootcamp/#/22/1)

| Family | Role | Playbook |
| --- | --- | --- |
| **Story-driven delivery** | **Product Owner** | [product-owner.md](product-owner.md) |
| **Domain-driven design** | **Business Expert** | [business-expert.md](business-expert.md) |
| **User experience design** | **UX Designer** | [ux-designer.md](ux-designer.md) |
| **Architecture & engineering** | **Engineer** | [engineer.md](engineer.md) |
| **Review (validate only)** | **Reviewer** | Reviewer workflow in [AGENT.md](../../agents/delivery-team-reviewer/AGENT.md) — no separate playbook; no new artifacts |

**Architecture and engineering are one family** — outline, blueprint, template, reference, ATDD, stack skills, and clean code all use **Engineer**.

## Stages by role

| Stage | Primary role | Common extension roles |
| --- | --- | --- |
| [Shaping](../stages/shaping.md) | Product Owner | Business Expert, UX Designer, Engineer |
| [Discovery](../stages/discovery.md) | Product Owner | Business Expert, UX Designer, Engineer |
| [Exploration](../stages/exploration.md) | Product Owner | UX Designer, Business Expert, Engineer |
| [Specification](../stages/specification.md) | Product Owner | UX Designer, Business Expert, Engineer |
| [Engineering](../stages/engineering.md) | Engineer | — |

Stage index: [stages/README.md](../stages/README.md)

**Engineering stage skill order:** clickable prototype → object model → ATDD (+ stack/arch) → clean code (+ stack/arch). ATDD is not a separate stage.

## Common pipeline

All roles use **`story-graph-ops`**, **`execute-skill-using-skills-rules`**, and **`track_task`** when the deliverable touches `story-graph.json`.

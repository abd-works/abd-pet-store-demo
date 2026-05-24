# Engineering

**Prior:** [specification.md](specification.md) · **Index:** [README.md](README.md)

Bootcamp stage **5 — Engineering**. One **Engineer** stage; multiple **skills** in fixed order (`abd-acceptance-test-driven-development` is skill **3**).

Plans may use one slot for the whole stage or **one slot per skill** — keep this order either way.

## Purpose

Deliver working software for the slice: runnable UI shell, domain types in code, failing then passing tests, and clean production implementation — honoring specification artifacts (scenarios, interface design, CRC, architecture reference).

## Team role

**Engineer** for all skills in this stage.

**Business Expert** reviews `abd-object-model` output at checkpoint; Engineer produces the implementation.

## Practice skills (required order)

Run skills **top to bottom**. Skip only when the engagement plan explicitly waives a step.

| Order | Family | Skill | Role | Notes |
| --- | --- | --- | --- | --- |
| 1 | **Architecture & engineering** | **Clickable prototype** | Engineer | Runnable UI shell from mockups / interface spec |
| 2 | **Architecture & engineering** | `abd-object-model` | Engineer | Typed domain surface aligned with CRC / UL; Business Expert validates at checkpoint |
| 3 | **Architecture & engineering** | `abd-acceptance-test-driven-development` **+** stack / arch skill **if provided** (e.g. `mern-technical-architecture`, `hero-vtt-technical-architecture`) | Engineer | Acceptance tests from scenarios; example data from object model; test layout per [architecture reference](specification.md) |
| 4 | **Architecture & engineering** | `abd-clean-code` **+** same stack / arch skill **if provided** | Engineer | Production code to pass tests; implementation patterns from architecture reference |

**Architecture reference** (`abd-architecture-reference`) is produced in [Specification](specification.md). In this stage, **use** it — do not re-run the reference skill unless specification was incomplete. Step 3: testing patterns and folder layout. Step 4: implementation patterns.

All rows are **Architecture & engineering** family — one **Engineer** role throughout.

## Entry conditions

- [Specification](specification.md) exit gate passed.
- Scenarios, interface spec, CRC, and architecture reference (when in scope) available.

## Expected outputs

1. Clickable prototype (when assigned).
2. Domain modules / types from object model.
3. Failing acceptance test suite, then passing after implementation; test-to-story mapping.
4. Production code passing all tests.

## Exit gate

1. Scanners green for **each assigned skill** in order.
2. Step 3: acceptance tests exist and fail before step 4 implementation (when ATDD ran).
3. Object model in code matches CRC / UL when step 2 ran.
4. Tests trace to scenarios; example data matches object model; test structure matches architecture reference when stack skill ran.
5. Implementation honors architecture reference and interface spec when stack skill was assigned.
6. **Ripple check** per [README.md](README.md).
7. User confirmed at checkpoint.

## Handoff

Final stage for the increment. Pass to delivery lead:

- Stories delivered, tests green, deploy status.
- Technical debt and ripple items for next increment or [discovery.md](discovery.md) refresh.

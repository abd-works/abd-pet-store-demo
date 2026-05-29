# ABD Delivery Plan — Checklist

<!-- generated-by: skill-helpers/skills/track_task/scripts/generate_delivery_checklist.py -->
<!-- generated-at: 2026-05-26T13:40:17+00:00 -->
<!-- source-plan: C:\dev\abd-pet-store-demo\docs\planning\abd-delivery-lead\agile-delivery-plan.md -->

**Sub-bullets** under a stage are ticked when that **run's** stage exit gate is in `run-log.jsonl`.
**Structure:** `#### stage` -> `##### role` (Executor / Reviewer / Rework / Delivery lead) -> `###### skill` -> activity checkboxes.
**Synced:** all activity lines under a completed stage, **Run N CHECKPOINT**, orchestration Steps, **Progress at a glance**.




<!-- resume: slot 163 next; synced-at: 2026-05-26T13:40:17+00:00 -->

## Progress at a glance (from run-log — authoritative)

- **Next slot:** 163
- **Runs complete:** 1, 2, 3, 4, 5, 6
- **Run 1 stages done:** discovery; slots 5–16
- **Run 2 stages done:** engineering, exploration, specification; slots 17–42
- **Run 3 stages done:** engineering, exploration, specification; slots 43–68
- **Run 4 stages done:** engineering, exploration, specification; slots 69–92
- **Run 5 stages done:** engineering, exploration, specification
- **Run 6 stages done:** engineering, exploration, specification
- **Run 7 stages done:** exploration

**Per-stage tracking:** each skill is executor slot -> role-matched reviewer slot -> stage-level rework -> delivery-lead exit gate. Tick each line.

## Orchestration (delivery-lead AGENT.md)

- [x] **Step 1 — Establish workspace** — workspace path confirmed and existing artifacts noted
- [x] **Step 2 — Build the plan** — plan presented at CHECKPOINT and `agile-delivery-plan.md` written
- [x] **Step 3 — Open first stage of first run** — entry conditions verified for the current stage
- [x] **Step 4 — Monitor role agents** — eight role agents bootstrapped; pipeline monitored on disk
- [x] **Step 5 — Validate stage exit** — reviewer scanned + reviewed; fixes incorporated; exit gate at CHECKPOINT
- [x] **Step 6 — Handoff to next stage** — artifacts, decisions, corrections passed forward
- [x] **Step 7 — Run complete, revise plan** — run summary + revised plan presented at CHECKPOINT
- [ ] **Step 8 — Plan complete** — final summary, open items, strategy save proposal at CHECKPOINT

## Runs

### Run 1 — Discovery foundation
- **Scope:** Foundation backfill — domain, story, UX IA, architecture blueprint, SLOs

#### discovery

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-domain-terms
- *Domain terms · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-domain-terms` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-story-mapping
- *Story map · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-story-mapping` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-information-architecture
- *Information architecture · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-information-architecture` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-blueprint
- *Architecture blueprint · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-blueprint` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-service-level-objectives
- *SLOs · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-service-level-objectives` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-domain-terms
- *Domain terms*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-story-mapping
- *Story map*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-information-architecture
- *Information architecture*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-blueprint
- *Architecture blueprint*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-service-level-objectives
- *SLOs*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/discovery.md`
- [x] **STAGE CHECKPOINT** — user confirms `discovery` complete for this run

- [x] **Run 1 CHECKPOINT** — run summary + plan revision presented

### Run 2 — Increment 1: Walk-in driver
- **Scope:** Increment 1 — walk-in driver (thin-slicing.md)

#### exploration

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-criteria` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ux-mockup` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-template` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/exploration.md`
- [x] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-class-responsibility-collaborator` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-specification-by-example` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-scenario-walkthrough` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-reference` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/specification.md`
- [x] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-object-model` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-test-driven-development` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-clean-code` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/engineering.md`
- [x] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [x] **Run 2 CHECKPOINT** — run summary + plan revision presented

### Run 3 — Increment 2: Click-and-collect
- **Scope:** Increment 2 — click-and-collect

#### exploration

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-criteria` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ux-mockup` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-template` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/exploration.md`
- [x] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-class-responsibility-collaborator` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-specification-by-example` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-scenario-walkthrough` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-reference` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/specification.md`
- [x] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-object-model` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-test-driven-development` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-clean-code` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/engineering.md`
- [x] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [x] **Run 3 CHECKPOINT** — run summary + plan revision presented

### Run 4 — Increment 3: Ship to home
- **Scope:** Increment 3 — ship to home

#### exploration

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-criteria` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-template` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/exploration.md`
- [x] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-class-responsibility-collaborator` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-specification-by-example` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-scenario-walkthrough` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-reference` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/specification.md`
- [x] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-object-model` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-test-driven-development` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-clean-code` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/engineering.md`
- [x] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [x] **Run 4 CHECKPOINT** — run summary + plan revision presented

### Run 5 — Increment 4: Returning customers
- **Scope:** Increment 4 — returning customers

#### exploration

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-criteria` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ux-mockup` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-template` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/exploration.md`
- [x] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-class-responsibility-collaborator` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-specification-by-example` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-scenario-walkthrough` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-reference` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/specification.md`
- [x] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-object-model` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-test-driven-development` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-clean-code` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/engineering.md`
- [x] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [x] **Run 5 CHECKPOINT** — run summary + plan revision presented

### Run 6 — Increment 5: Pay your way
- **Scope:** Increment 5 — pay your way

#### exploration

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-criteria` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ux-mockup` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-template` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/exploration.md`
- [x] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-class-responsibility-collaborator` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-specification-by-example` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-scenario-walkthrough` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-reference` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/specification.md`
- [x] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-interface-design` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-object-model` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-test-driven-development` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-clean-code` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/engineering.md`
- [x] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [x] **Run 6 CHECKPOINT** — run summary + plan revision presented

### Run 7 — Increment 6: Pet visits
- **Scope:** Increment 6 — Pet visits

#### exploration

- [x] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ubiquitous-language` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-acceptance-criteria` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-ux-mockup` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [x] slot queued / claimed (`slot-NN-claim.md`)
- [x] draft artifacts produced
- [x] self-review against `abd-architecture-template` rules complete
- [x] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [x] story-graph updated via story-graph-ops (when stage produces graph content)
- [x] scanners green (`execute-skill-using-skills-rules`)
- [x] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [x] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [x] read executor `slot-NN-finished.md` + artifact paths
- [x] scanners run; pass/fail recorded in reviewer finished file
- [x] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [x] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [x] corrections logged for reviewer findings (or N/A if clean pass)
- [x] executor incorporated suggested fixes (rework slot complete)
- [x] scanners green after fix incorporation

##### Delivery lead

- [x] exit gate verified against `stages/exploration.md`
- [x] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-class-responsibility-collaborator` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-specification-by-example` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-scenario-walkthrough` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-reference` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/specification.md`
- [ ] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-object-model` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-test-driven-development` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-clean-code` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/engineering.md`
- [ ] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [ ] **Run 7 CHECKPOINT** — run summary + plan revision presented

### Run 8 — Increment 7: Returns and refunds
- **Scope:** Increment 7 — returns and refunds

#### exploration

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-ubiquitous-language` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-criteria` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-ux-mockup` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-template` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/exploration.md`
- [ ] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-class-responsibility-collaborator` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-specification-by-example` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-scenario-walkthrough` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-reference` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/specification.md`
- [ ] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-object-model` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-test-driven-development` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-clean-code` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/engineering.md`
- [ ] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [ ] **Run 8 CHECKPOINT** — run summary + plan revision presented

### Run 9 — Increment 8: Marketing engine
- **Scope:** Increment 8 — marketing engine

#### exploration

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-ubiquitous-language` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-criteria` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-ux-mockup` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-template` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/exploration.md`
- [ ] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-class-responsibility-collaborator` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-specification-by-example` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-scenario-walkthrough` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-reference` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/specification.md`
- [ ] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-object-model` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-test-driven-development` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-clean-code` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/engineering.md`
- [ ] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [ ] **Run 9 CHECKPOINT** — run summary + plan revision presented

### Run 10 — Increment 9: Power-ups
- **Scope:** Increment 9 — power-ups

#### exploration

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-ubiquitous-language
- *UL · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-ubiquitous-language` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-criteria
- *AC · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-criteria` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-ux-mockup
- *UX mockup · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-ux-mockup` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-template
- *Arch template · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-template` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-ubiquitous-language
- *UL*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-criteria
- *AC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-ux-mockup
- *UX mockup*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-template
- *Arch template*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/exploration.md`
- [ ] **STAGE CHECKPOINT** — user confirms `exploration` complete for this run

#### specification

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-class-responsibility-collaborator
- *CRC · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-class-responsibility-collaborator` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-specification-by-example
- *SBE · product-owner*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-specification-by-example` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-scenario-walkthrough
- *Walkthrough · business-expert*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-scenario-walkthrough` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-interface-design
- *Interface design · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-architecture-reference
- *Arch reference · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-architecture-reference` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-class-responsibility-collaborator
- *CRC*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-specification-by-example
- *SBE*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-scenario-walkthrough
- *Walkthrough*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-interface-design
- *Interface design*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-architecture-reference
- *Arch reference*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/specification.md`
- [ ] **STAGE CHECKPOINT** — user confirms `specification` complete for this run

#### engineering

- [ ] **Stage opened** — entry conditions verified for this run

##### Executor

###### abd-interface-design
- *UI impl · ux-designer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-interface-design` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-object-model
- *Object model · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-object-model` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-acceptance-test-driven-development
- *ATDD · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-acceptance-test-driven-development` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

###### abd-clean-code
- *Clean code · engineer*
- [ ] slot queued / claimed (`slot-NN-claim.md`)
- [ ] draft artifacts produced
- [ ] self-review against `abd-clean-code` rules complete
- [ ] **EXECUTOR CHECKPOINT** — operator confirms drafts
- [ ] story-graph updated via story-graph-ops (when stage produces graph content)
- [ ] scanners green (`execute-skill-using-skills-rules`)
- [ ] slot finished (`slot-NN-finished.md` on disk)

##### Reviewer

###### abd-interface-design
- *UI impl*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-object-model
- *Object model*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-acceptance-test-driven-development
- *ATDD*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

###### abd-clean-code
- *Clean code*
- [ ] reviewer claimed slot (`slot_type: reviewer`; same `team-role` as executor)
- [ ] read executor `slot-NN-finished.md` + artifact paths
- [ ] scanners run; pass/fail recorded in reviewer finished file
- [ ] exit-gate review complete; findings in reviewer `slot-MM-finished.md`
- [ ] **REVIEWER CHECKPOINT** — delivery lead reads findings

##### Rework

- [ ] corrections logged for reviewer findings (or N/A if clean pass)
- [ ] executor incorporated suggested fixes (rework slot complete)
- [ ] scanners green after fix incorporation

##### Delivery lead

- [ ] exit gate verified against `stages/engineering.md`
- [ ] **STAGE CHECKPOINT** — user confirms `engineering` complete for this run

- [ ] **Run 10 CHECKPOINT** — run summary + plan revision presented


---
ticket: inc-9-sprint-2-stores
skill: abd-architecture-reference
scope: Increment 9 Sprint 2 — Store preference and tailoring
---

# Architecture Reference Assignment — Increment 9 Sprint 2 (My Store)

**Ticket:** `inc-9-sprint-2-stores`  
**Reference document:** [`increment-9-power-ups-reference.md`](./increment-9-power-ups-reference.md) § My Store Preference  
**Mode:** Project

## Assignment table

| Mechanism | Reference | Code | Paths |
| --- | --- | --- | --- |
| My Store Preference | **create** | **create** | `packages/customer-account/server/my-store.*` |
| Store Locator filters | **assign** | **assign** | Existing store module — tailoring deferred to engineering |

### API

`GET/PUT /api/account/my-store` — one preference per account; immediate replace.

**Deferred to engineering:** Store locator filter UI, click-and-collect pre-select, stock default by preferred store.

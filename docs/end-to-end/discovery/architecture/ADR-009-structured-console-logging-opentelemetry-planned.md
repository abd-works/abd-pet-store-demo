# ADR-009: Structured console logging now; OpenTelemetry before Increment 2

> **Status:** Accepted
> **Date:** 2026-06-11
> **Deciders:** Engineering

## Context

Increment 1 is a demo-scope deployment. Structured logging and distributed tracing are essential for diagnosing order and payment failures that will arrive in Increment 2, but full observability infrastructure (log aggregation, trace collector) is over-engineering for the first shipping cut. We need a logging approach that is immediately useful in development, easy to search in PaaS logs, and upgradeable to a production observability stack without rewriting every call site.

## Decision

We will use **structured JSON logging to stdout** via a lightweight logger (Morgan for HTTP access logs, console with a structured wrapper for application events) in Increment 1. Every log line includes `timestamp`, `level`, `correlationId`, `context` (module name), and `message`. Before Increment 2 goes to staging, we will introduce the **OpenTelemetry SDK** with a Pino-compatible log exporter and trace spans on all cross-component calls; the structured shape established in Increment 1 maps directly to OpenTelemetry semantic conventions so call sites need minimal change.

## Options considered

| Option | Pros | Cons | Why rejected (or chosen) |
|---|---|---|---|
| **Structured console + OTel roadmap (chosen)** | Zero infra in Inc 1; log shape is OTel-compatible | Requires discipline to keep the format consistent | **Chosen** — defer cost without creating a migration debt |
| Full Pino + OTel from day one | Production-ready immediately | Requires trace collector deployment; adds Inc 1 scope | Rejected for Inc 1; adopted at Inc 2 |
| Unstructured console.log | Zero setup | Unsearchable in PaaS logs; hard to correlate across requests | Rejected |

## Consequences

**Positive:**
- PaaS log search works immediately via JSON field filters.
- Correlation IDs in Increment 1 logs make request tracing manual-but-feasible before OTel lands.

**Negative / trade-offs:**
- Two-phase migration: logger wrapper must be replaced before Increment 2 staging.

**Neutral:**
- Log levels: DEBUG (dev only), INFO (request in/out, domain events), WARN (non-fatal domain failures), ERROR (unexpected exceptions).

## Compliance / verification

- Code review: no raw `console.log` in production modules; all log calls go through the shared logger wrapper.
- Before Increment 2 merge: OTel SDK installed and verified in staging.

# ROADIS Web --- AI Coding Agent Instructions

## Mission

Build the ROADIS React/TypeScript admin dashboard without inventing API,
business rules, data, permissions or AI capabilities.

## Mandatory reading

Read `AGENTS.md` and docs `00`--`12` before meaningful changes. For API
work, inspect backend route/controller/model first.

## Source-of-truth priority

1.  verified backend; 2. verified mobile; 3. verified API contract; 4.
    data model; 5. role permissions; 6. requirements; 7. PRD; 8.
    Stitch; 9. AI inference (never for business facts).

## Hard rules

- Never invent endpoints or response fields.
- Never use fake production data.
- Never treat client role checks as security.
- Never infer legal authority solely from OSM.
- Never equate AI confidence with severity.
- Never claim depth estimation without a real field.
- Support multiple detections.
- Do not duplicate navbar/sidebar/layouts.
- Do not duplicate business logic in JSX.
- Avoid unnecessary `any`.
- Do not put secrets in Vite client env.

## Roles

Pemdes: DESA + own wilayah; update only authorized scope. PU: target
VIEW all road types, UPDATE KABUPATEN only. Superadmin: full
administrative access according to backend.

## Report rules

Status `MENUNGGU/PROSES/SELESAI`; severity `RINGAN/SEDANG/BERAT`;
completion target requires handling note + repair evidence. Backend
remains final authority.

## AI rules

Target detection:
`className, confidence, bbox, severity, severityScore, modelVersion`.
Never fabricate missing values.

## Chat

Private per report. Never public forum. Treat backend IDOR finding as a
security gap, not something client filtering can solve.

## Design

Use Stitch tokens: `#021024 #052659 #5483B3 #7DA0CA #C1E8FF #F4F7FB`;
semantic status/severity colors; Inter; 24px cards; 16px controls;
floating consistent navigation; no neon/glassmorphism/financial
metaphor.

## Architecture

Use feature-based structure with shared `AppShell`. API flow: page →
hook → feature API → apiClient → backend. TanStack Query for server
state, React local state for UI state, Zod at critical API boundaries.

## Workflow

Before coding: read → inspect → classify facts as
CONFIRMED/TARGET/BACKEND GAP/UNKNOWN → plan. Implement only approved
scope. After: lint/typecheck/build and report changes, assumptions and
remaining gaps.

## Vibe-coding prompt discipline

Ask the agent to analyze before coding, work one vertical slice at a
time, reuse existing components, never invent APIs, and perform a
separate reviewer pass after implementation.

## Stop conditions

Stop and report when endpoint, response, permission, business rule or AI
output is unknown/contradictory. Use `UNKNOWN`, `BACKEND GAP`, or
`DECISION NEEDED` rather than guessing.

## Definition of done

Requirement, API, permission, UI states, tests/checks and docs agree;
typecheck/lint/build pass; no fake production data; no unexplained
TODOs.

## Final principle

**Correctness over speed; verified contract over convention; reusable
architecture over copy-paste; real data over impressive fake UI.**

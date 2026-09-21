# ROADIS Web --- Decision Log

## ADR-001 React + TypeScript + Vite

Accepted. Matches existing direction and typed dashboard needs.

## ADR-002 Feature-based structure

Accepted. Keeps reports/map/chat/users separate while sharing
primitives.

## ADR-003 Shared AppShell

Accepted. Navbar/sidebar must remain visually consistent; role
differences are configuration.

## ADR-004 Backend authorization

Accepted. Frontend guards are UX only.

## ADR-005 No fake production data

Accepted. Fixtures allowed only in tests/demo isolation.

## ADR-006 TanStack Query

Accepted for remote/server state and invalidation.

## ADR-007 Zod API boundary

Accepted for runtime validation of important responses.

## ADR-008 OSM is not legal authority

Accepted. OSM/Nominatim provide geospatial context; ROADIS business/data
determines authority.

## ADR-009 Severity != confidence

Accepted. Always separate in UI and domain types.

## ADR-010 No depth claim

Accepted until a real model/backend field exists.

## ADR-011 Multiple detections

Accepted. Detail UI uses an array, not one damage string.

## ADR-012 Admin PU view/update separation

Accepted target: view all, update KABUPATEN only. Backend audit gap
tracked.

## ADR-013 Admin Pemdes locked scope

Accepted: DESA + current wilayah.

## ADR-014 Completion evidence

Accepted target: note + repair photo. Backend must enforce.

## ADR-015 Private chat

Accepted per report and authorized actors only.

## ADR-016 Frontend does not hide backend gaps

Accepted. Track detection/severity/priority/repair
evidence/mark-read/chat changes as gaps until available.

## ADR-017 Client env

Accepted `VITE_API_BASE_URL`; never expose secrets.

## ADR-018 Docs are context contract

Accepted. Update docs whenever API, role, data model, design or
architecture changes.

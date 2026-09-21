# ROADIS Web --- Requirements

## Status vocabulary

`CONFIRMED`, `TARGET`, `BACKEND GAP`, `UNKNOWN`, `DEFERRED`.

## Functional requirements

### Authentication

-   FR-AUTH-001 login with email/password --- target/verified endpoint.
-   FR-AUTH-002 protected requests carry auth token.
-   FR-AUTH-003 invalid/expired session produces 401 handling.
-   FR-AUTH-004 role guards control UX routes.
-   FR-AUTH-005 logout clears client session.
-   FR-AUTH-006 no backend secrets in browser.
-   FR-AUTH-007 admin creation belongs to Superadmin, subject to
    verified endpoint.
-   FR-AUTH-008 forgot-password/refresh-token: UNKNOWN.

### Dashboard

-   FR-DASH-001 KPI totals/statuses.
-   FR-DASH-002 priority list only when backend supplies priority.
-   FR-DASH-003 map summary.
-   FR-DASH-004 Pemdes scoped to DESA + own wilayah.
-   FR-DASH-005 PU view-all target; current backend is a gap.
-   FR-DASH-006 Superadmin global view.

### Reports

-   list/search/filter/pagination; detail; photo; coordinates; road
    name; authority; damage; severity; priority; AI detections; status
    update; repair evidence. Several fields are backend gaps.
-   completion target: note + repair photo.
-   Superadmin may delete invalid/spam reports if endpoint supports it.

### Map

Leaflet/OSM map, markers, severity/status filters, popup, role-scoped
data. Never allow a UI selector to bypass authority scope.

### Chat

Private per-report conversation; load history/send reply if backend
supports it. Real-time, read receipts and attachments are UNKNOWN.

### Notifications

List/unread state; mark-as-read is a backend gap according to audit.
Push delivery is UNKNOWN.

### Superadmin

User CRUD, wilayah CRUD, global reports; activity/settings are UNKNOWN
or backend gaps until verified.

## Non-functional

Strict TypeScript, accessible controls, responsive desktop-first layout,
query caching, pagination, centralized API errors, no hardcoded local
IP, maintainable feature structure.

## Acceptance template

`Requirement / Source / API / Permission / Loading / Empty / Error / 401 / 403 / Test / Status`.

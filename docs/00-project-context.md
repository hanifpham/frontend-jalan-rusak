# ROADIS Web --- Project Context

**Status:** Draft v1.0 \| **Date:** 2026-09-21

## 1. Product

ROADIS is a road-damage reporting and GIS system for Kabupaten
Indramayu. The ecosystem consists of Flutter mobile for citizens, React
web for administrators, and a Go/Gin backend. YOLOv11/TFLite is intended
to run on mobile; web displays the resulting detection data.

**Routing means complaint routing to the responsible authority, not
vehicle navigation or shortest-path routing.**

## 2. Web roles

-   **Admin Pemdes:** only DESA reports in the admin's assigned village;
    can update authorized reports and private chat. No user/territory
    management.
-   **Admin PU:** target rule is VIEW all road types for monitoring,
    UPDATE only KABUPATEN. Existing backend audit says its current list
    filter is still kabupaten-only; track as backend gap.
-   **Superadmin:** full administrative access, including reports,
    users, and wilayah, subject to backend authorization.

## 3. Canonical values

Status: `MENUNGGU`, `PROSES`, `SELESAI`. Severity: `RINGAN`, `SEDANG`,
`BERAT`. Road authority: `DESA`, `KABUPATEN`, `PROVINSI`, `NASIONAL`; UI
may show `TIDAK_TERIDENTIFIKASI` when unresolved.

Severity is not AI confidence. A target detection contains class,
confidence, bbox, severity, severityScore, and modelVersion. Multiple
detections must be supported. Do not show depth estimation unless a real
backend/model field exists.

## 4. Report lifecycle

`MENUNGGU → PROSES → SELESAI`. Target completion rule: handling note +
repair evidence photo are required. Backend must enforce this; frontend
provides UX validation.

## 5. Chat

Chat is private per report between the citizen and authorized admin(s).
Backend audit found the existing chat model is Q&A-like and an admin
chat IDOR risk exists. Web must not treat chat as a public forum.

## 6. Design anchor

Palette: `#021024`, `#052659`, `#5483B3`, `#7DA0CA`, `#C1E8FF`, canvas
`#F4F7FB`, white, muted `#667085`. Semantic: done `#2E9E5B`, waiting
`#F59E0B`, process `#5483B3`, high `#E4572E`, medium `#F0A94E`, low
`#7BC67E`. Inter. Cards 24px; inputs/controls 16px; pills full; chat
bubbles rounded-2xl. Floating \~95%/88px top navbar and consistent
sidebar. No neon, glassmorphism, excessive gradients, or
finance-dashboard metaphor.

## 7. Source-of-truth order

1.  verified backend source; 2. verified mobile source; 3. verified API
    contract; 4. data model; 5. role permissions; 6. requirements; 7.
    PRD; 8. Stitch design. If a point is not supported, mark `UNKNOWN`
    or `BACKEND GAP`; never guess.

## 8. Audit baseline

Backend currently has auth, CRUD reports/users/wilayah, MySQL/GORM,
Cloudinary, JWT and basic chat/notifications, but lacks dedicated
detection/severity/priority/authority models and has security/routing
gaps. Mobile audit found UI/auth partial but no implemented YOLO/TFLite,
camera, report creation, GPS/Nominatim, authority classification,
upload, chat, or real API-driven map/history/notifications.

## 9. Frontend principle

**The UI may be ahead of the backend as a documented target, but live
integration must only claim capabilities supported by the verified
contract.**

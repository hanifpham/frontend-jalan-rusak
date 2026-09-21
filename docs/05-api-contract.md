# ROADIS Web --- API Contract

> This document tracks verified/target contracts. It is not permission
> to invent endpoints.

## Status

`VERIFIED`, `AUDITED`, `TARGET`, `BACKEND GAP`, `UNKNOWN`.

## Audited existing endpoints

The backend audit identifies `POST /api/register`, `POST /api/login`,
`GET /api/warga/laporan/peta`, `PUT /api/admin/laporan/:id/status`, and
`GET /admin/laporan/:id/chat`. Re-check exact route registration before
frontend integration; treat these as AUDITED until directly verified.

## Auth

Login response conceptually contains id, nama, email, role, wilayah_id,
profile photo and token. Exact JSON must be verified. Public register
forces new users to `warga`, so it must not be used to create admins.

## Target report model

``` ts
type Report = {
  id: number; userId?: number; wilayahId?: number; title: string; description?: string;
  latitude: number; longitude: number; imageUrl?: string; roadName?: string;
  roadAuthority?: RoadAuthority; damageType?: string; severity?: Severity;
  severityScore?: number; priorityScore?: number; status: ReportStatus;
  assignedTo?: string; handlingNote?: string; createdAt: string; updatedAt?: string;
}
```

Target fields are not claims about the current backend.

## Detection target

``` ts
{ className, confidence, bbox, severity, severityScore, modelVersion }
```

Backend audit says no dedicated detection model exists yet → BACKEND
GAP.

## Mutation target

Status update conceptually accepts status, handling note and repair
evidence file. Exact multipart field names are UNKNOWN until verified.

## Chat target

Message `{id, reportId, senderId, senderRole, body, createdAt}`.
Existing backend is Q&A-like → BACKEND GAP/adaptation required.

## Notification target

`{id, reportId?, title, message, isRead, createdAt?}`. Mark-read
endpoint is a backend gap.

## Environment

`.env.example`: `VITE_API_BASE_URL=http://localhost:8080/api`. Vite
client variables are public; never put JWT secrets, DB passwords or
Cloudinary secrets there.

## Freeze procedure

Inspect route → controller → request binding → response → auth →
permission → model → errors → update this file → implement API hook.

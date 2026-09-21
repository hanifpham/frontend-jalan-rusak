# ROADIS Web --- Data Model

## Roles

``` ts
type Role = "warga" | "admin_pemdes" | "admin_pu" | "super_admin";
```

## Enums

``` ts
type ReportStatus = "menunggu" | "proses" | "selesai";
type Severity = "ringan" | "sedang" | "berat";
type RoadAuthority = "desa" | "kabupaten" | "provinsi" | "nasional" | "tidak_teridentifikasi";
```

## Existing backend report fields from audit

`id, user_id, wilayah_id, jenis_jalan, judul, deskripsi, latitude, longitude, image_url, tipe_kerusakan, status, ditugaskan_ke, foto_bukti, catatan_admin`.

## Target report

Add conceptually: roadName, authority, severity, severityScore,
priorityScore, detections, repair evidence. These are target fields and
several are backend gaps.

## Detection

``` ts
type BoundingBox = { x:number; y:number; width:number; height:number };
type Detection = { id?:number; className:string; confidence:number; bbox?:BoundingBox; severity?:Severity; severityScore?:number; modelVersion?:string };
```

## Repair evidence

Target `{id?, imageUrl, note?, createdAt?}`. Existing backend stores
photo/note directly on report, not a dedicated model.

## User

`id, name/nama, email, role, wilayahId?, profilePhoto?`; never expose
password.

## Wilayah

Existing `id, nama, tipe`. Do not invent hierarchy/code fields.

## Notification

`id, userId?, reportId?, title, message, isRead, createdAt?`.

## Message

Target `{id, reportId, senderId, senderRole, message, createdAt}`.
Existing backend differs.

## Data semantics

Distinguish `null`, missing, empty arrays, unavailable and unknown.
Normalize backend naming at the API boundary. Keep dates as transport
strings and format centrally. Never swap latitude/longitude.

# ROADIS Web --- Known Unknowns

## Rule

This file prevents AI from converting missing information into guesses.
Use `CONFIRMED`, `TARGET`, `BACKEND GAP`, `UNKNOWN`, `DECISION NEEDED`.

## Backend/API unknowns

-   exact login response/error shape --- verify;
-   exact report list/detail routes --- verify;
-   detection API/model --- backend gap;
-   severity/severityScore --- backend gap;
-   priority field/formula --- backend gap/unknown;
-   road name --- backend gap;
-   repair evidence model --- backend gap;
-   notification mark-read --- backend gap;
-   final chat thread/message model --- backend gap;
-   WebSocket/polling --- unknown;
-   refresh token/forgot password --- unknown;
-   export API --- unknown.

## AI unknowns

Mobile audit found no
TFLite/model/interpreter/inference/pre/post-processing. Exact model
output, severity algorithm, bbox coordinate convention and model version
are therefore unknown. Do not fabricate them in web.

## GIS unknowns

-   exact reverse-geocoding response;
-   legal authority dataset;
-   road-segment source;
-   final authority classification algorithm;
-   map marker volume/performance strategy. OSM/Nominatim cannot be
    assumed to be the legal authority source.

## Role unknowns

Admin PU target is clear, but current backend list scope differs.
Activity logs, settings, authority management and export are unknown
until verified.

## Chat unknowns

Real-time, pagination, read receipts, typing, attachments, edit/delete
and unread semantics are unknown. MVP should remain load history/send if
API supports it.

## Notification unknowns

Push/FCM, polling, real-time, notification type enum and mark-read route
are unknown.

## Security gaps from backend audit

JWT secret fallback, upload validation, chat IDOR, and broad citizen map
exposure were identified. Frontend cannot fully fix these.

## Decision queue

1.  final report detail endpoint; 2. report response; 3. detection
    response; 4. severity algorithm; 5. priority algorithm; 6. authority
    enum; 7. status transition; 8. status-update payload; 9. evidence
    upload; 10. chat API; 11. notification API; 12. real-time
    strategy; 13. admin CRUD API; 14. functional settings.

## Agent stop rule

If a required item is UNKNOWN, stop guessing. Request the
source/decision or implement only an explicitly isolated placeholder.

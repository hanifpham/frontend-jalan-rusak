# ROADIS Web --- PRD

## 1. Vision

Provide a reliable operational dashboard for administrators to monitor,
inspect, communicate about, and process road-damage reports without
crossing role boundaries.

## 2. Goals

-   authenticated admin access;
-   scoped report visibility;
-   status workflow;
-   map-based geographic context;
-   AI result visibility;
-   repair evidence;
-   private chat;
-   notifications;
-   Superadmin administration;
-   consistent Stitch visual language.

## 3. Non-goals

Web does not run YOLO inference, replace backend authorization, infer
legal road authority solely from OSM, calculate business priority
independently, or act as a citizen mobile app.

## 4. Modules

Authentication, Dashboard, Reports, Map, Messages, Notifications,
Profile; Superadmin adds Users, Wilayah, Activities and Settings only
where backend support is real.

## 5. UX rules

Every API page supports loading, success, empty, error, 401 and 403
states where applicable. Mutations support pending/success/error. Do not
use fake production data.

## 6. Acceptance

Baseline is reached when login, route guards, shared shell, typed API
boundary, role scope, report list/detail, map, status update, AI
metadata display, and required states work against the real backend
contract.

## 7. Product principle

**Scope first, data second, polish third.**

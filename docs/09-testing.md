# ROADIS Web --- Testing Strategy

## Layers

1.  Static: typecheck, lint, production build.
2.  Unit: policy, normalization, validation, status rules, coordinate
    validation.
3.  Component: tables, badges, filters, detection cards, permission
    controls, states.
4.  Integration: auth, report list/detail, status update, notification
    navigation.
5.  E2E: critical role/report flows.

## Permission tests

Pemdes own DESA → view/update. Other village/non-DESA → forbidden. PU
all-road view target; only KABUPATEN update. Superadmin follows backend.

## Completion tests

Target: no note/no evidence, note/no evidence, no note/evidence →
reject; note+evidence → allowed. Backend remains final authority.

## AI tests

Given class Pothole, confidence .91, severity berat, score 92, model
YOLOv11, UI must show each separately. Multiple detections must all
render.

## API tests

Success, malformed response, optional missing field, 401, 403, 404, 422,
5xx and network failure.

## Map tests

Correct coordinates, no lat/lng swap, popup, marker severity, role
scope.

## Accessibility

Keyboard, focus, labels, aria names, modal semantics, contrast, reduced
motion.

## Regression checklist

Auth, logout, guards, all role dashboards, report list/detail, map,
status/evidence, chat privacy, notifications, user management,
responsive, error states, build.

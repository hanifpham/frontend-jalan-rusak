# ROADIS Web --- Implementation TODO

## Phase 0 --- Context

-   [ ] Add all docs + AGENTS.md
-   [ ] Inspect current roadis-web source/dependencies
-   [ ] Confirm Stitch anchor

## Phase 1 --- Contract

-   [ ] Verify auth routes/response/errors
-   [ ] Verify report list/detail/status routes
-   [ ] Verify chat/notification routes
-   [ ] Verify user/wilayah CRUD
-   [ ] Update API contract

## Phase 2 --- Foundation

-   [ ] API client + error model
-   [ ] QueryClient
-   [ ] Zod schemas
-   [ ] env config
-   [ ] design tokens

## Phase 3 --- Shell

-   [ ] AppShell
-   [ ] TopNavbar
-   [ ] Sidebar
-   [ ] PageContainer/Header/Breadcrumb
-   [ ] role-aware navigation

## Phase 4 --- Auth

-   [ ] Login
-   [ ] session handling
-   [ ] logout
-   [ ] 401 handling
-   [ ] route guards

## Phase 5 --- Shared UI

-   [ ] Button/Input/Select
-   [ ] Badge/Status/Severity
-   [ ] Table/Pagination
-   [ ] Dialog/Dropdown/Tabs
-   [ ] Skeleton/Empty/Error
-   [ ] FileUpload

## Phase 6 --- Permissions

-   [ ] capability map
-   [ ] report action policy
-   [ ] Pemdes scope
-   [ ] PU view/update separation
-   [ ] Superadmin guard

## Phase 7 --- Admin Pemdes vertical slice

-   [ ] dashboard
-   [ ] map
-   [ ] reports list
-   [ ] report detail
-   [ ] AI detection UI
-   [ ] status/evidence
-   [ ] private chat
-   [ ] notifications/profile

## Phase 8 --- Admin PU

-   [ ] dashboard
-   [ ] broad monitoring
-   [ ] report list/detail
-   [ ] KABUPATEN update controls
-   [ ] map/chat/notifications/profile

## Phase 9 --- Superadmin

-   [ ] global dashboard/reports/map
-   [ ] user management
-   [ ] wilayah management
-   [ ] activity if available
-   [ ] settings if available

## Phase 10 --- Integration

-   [ ] remove production mocks
-   [ ] query keys/mutations/invalidation
-   [ ] response validation
-   [ ] error handling

## Phase 11 --- GIS

-   [ ] Leaflet/OSM attribution
-   [ ] markers/popup/legend
-   [ ] filters/scope
-   [ ] coordinate validation

## Phase 12 --- Chat/notifications

-   [ ] message history/send
-   [ ] privacy handling
-   [ ] unread/mark-read if backend exists

## Phase 13 --- QA

-   [ ] unit/component/integration
-   [ ] permission regression
-   [ ] E2E critical paths
-   [ ] accessibility/responsive

## First 10 actions

1.  Put docs into repo.
2.  Inspect existing web repo.
3.  Verify backend routes.
4.  Freeze API contract.
5.  Build foundation.
6.  Build shared shell.
7.  Build auth.
8.  Build permission layer.
9.  Build Admin Pemdes as first vertical slice.
10. Review before expanding to PU/Superadmin.

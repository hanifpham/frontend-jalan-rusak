# ROADIS Web --- Architecture

## Stack

React + TypeScript + Vite + React Router + Tailwind CSS + TanStack
Query + Zod + Leaflet/React Leaflet + Material Symbols; Framer Motion
sparingly.

## Structure

``` text
src/
├── app/
├── components/{ui,layout,feedback,data-display}/
├── features/{auth,dashboard,reports,map,messages,notifications,users,activities,settings,profile}/
├── services/api/{client,errors,schemas}/
├── hooks/
├── lib/
├── types/
└── styles/
```

## Layering

Page → feature hook → feature API → apiClient → backend. Presentational
components must not call fetch directly.

## Server vs local state

Server state: reports, dashboard, notifications, messages, users,
profile, wilayah → TanStack Query. Local state: modal, filters draft,
selected row, UI toggles → React state. Avoid Redux unless a concrete
global client-state problem appears.

## App shell

One `AppShell` contains `TopNavbar`, `Sidebar`, `PageContainer`, and
`Outlet`. Role differences come from a navigation/capability
configuration, not duplicated role layouts.

## Routes

`/login`; `/app/dashboard`; `/app/reports`; `/app/reports/:id`;
`/app/map`; `/app/messages`; `/app/notifications`; `/app/profile`;
`/app/settings`; Superadmin `/app/users`, `/app/activities`. Exact route
naming may be adjusted before coding.

## API boundary

Centralize base URL, auth headers, JSON parsing, error normalization and
response validation. Normalize Indonesian backend field names at the
boundary.

## Domain types

Use explicit `Role`, `ReportStatus`, `Severity`, `RoadAuthority`,
`Detection`, `Report`, `Message`, `Notification` types. Do not make
every type global.

## Runtime validation

Use Zod for critical API responses. Treat network JSON as `unknown`
until validated.

## Rules

No duplicated shell, no hardcoded API URLs, no business logic in JSX, no
fake AI data, no client-side authority override, no unexplained `any`.

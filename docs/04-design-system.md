# ROADIS Web --- Design System

## Colors

``` text
#021024 deepest navy
#052659 primary navy
#5483B3 medium blue
#7DA0CA supporting blue
#C1E8FF pale blue
#F4F7FB canvas
#FFFFFF white
#667085 muted
```

Semantic: Selesai `#2E9E5B`, Menunggu `#F59E0B`, Proses `#5483B3`; Berat
`#E4572E`, Sedang `#F0A94E`, Ringan `#7BC67E`.

## Typography

Inter. Page title 28px bold; KPI 32px extra-bold; card title 16px
semibold; body 14px; table header 12px semibold uppercase; badge 12px
semibold.

## Shape

Cards 24px. Inputs/filter controls 16px. Buttons/badges/avatars full.
Chat bubbles rounded-2xl.

## Navigation

Floating white top navbar around 95% width and 88px height,
centered/sticky. Sidebar uses consistent floating/pill treatment.
Primary navigation: Beranda, Laporan, Peta, Pesan. Superadmin
additionally has administration modules. Bell and avatar stay
consistent.

## Visual language

Modern premium civic SaaS/GIS: spacious white cards on soft canvas,
subtle borders/shadows, clean line icons. No financial dashboard
metaphor, neon, excessive gradient, glassmorphism or 3D decoration.

## Components

Button, Input, Select, SearchInput, Badge, StatusBadge, SeverityBadge,
Card, StatCard, Table, Pagination, Modal/Dialog, Dropdown, Tabs,
Skeleton, EmptyState, ErrorState, ConfirmDialog, FileUpload, MapCard.

## Detail report

Priority/status/severity → photo → report info → AI detections → map →
private chat → status update. Show class/confidence/severity/severity
score/model version separately.

## States

Loading: skeleton where useful. Empty: explicit copy. Error: actionable.
403: explicit forbidden. Never rely on color alone.

# ROADIS Web --- Role & Permission Matrix

## Principle

Frontend controls UX; backend controls authorization. A hidden button is
not security.

  Capability                   Admin Pemdes             Admin PU            Superadmin
  -------------------------- -------------- -------------------- ---------------------
  Dashboard                               ✓                    ✓                     ✓
  View DESA                     own village                    ✓                     ✓
  View KABUPATEN                          ✗                    ✓                     ✓
  View PROVINSI/NASIONAL                  ✗   monitoring/context                     ✓
  Update DESA                   own village                    ✗                     ✓
  Update KABUPATEN                        ✗                    ✓                     ✓
  Update PROVINSI/NASIONAL                ✗                    ✗                     ✓
  Private chat                    own scope    authorized report        administrative
  Manage users                            ✗                    ✗                     ✓
  Manage wilayah                          ✗                    ✗                     ✓
  Activity/settings                       ✗                    ✗   if backend supports

## Admin Pemdes

Scope is `role=admin_pemdes + wilayah_id=current admin`. No arbitrary
village selector.

## Admin PU

Target: VIEW all road types; UPDATE only KABUPATEN. Existing backend
list filter is narrower and must be tracked as a backend gap.

## Superadmin

Use backend policy as final authority; do not assume every possible
administrative control exists.

## Guards

Route guard checks authentication and role. Report detail/mutation still
relies on backend 200/403/404.

## Regression cases

Pemdes own DESA allowed; other village forbidden; non-DESA update
forbidden. PU view broad; PU update KABUPATEN allowed and other
authority update forbidden. Superadmin verified against backend.

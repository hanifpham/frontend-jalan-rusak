import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RoleGuard } from '@/features/auth/RoleGuard';
import { FoundationHome } from '@/features/auth/FoundationHome';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/useAuth';

// Admin Pemdes Pages
import { AdminPemdesDashboardPage } from '@/features/admin-pemdes/pages/AdminPemdesDashboardPage';
import { AdminPemdesReportsPage } from '@/features/admin-pemdes/pages/AdminPemdesReportsPage';
import { AdminPemdesReportDetailPage } from '@/features/admin-pemdes/pages/AdminPemdesReportDetailPage';
import { AdminPemdesMapPage } from '@/features/admin-pemdes/pages/AdminPemdesMapPage';
import { AdminPemdesMessagesPage } from '@/features/admin-pemdes/pages/AdminPemdesMessagesPage';
import { AdminPemdesNotificationsPage } from '@/features/admin-pemdes/pages/AdminPemdesNotificationsPage';
import { AdminPemdesProfilePage } from '@/features/admin-pemdes/pages/AdminPemdesProfilePage';
import { AdminPemdesSettingsPage } from '@/features/admin-pemdes/pages/AdminPemdesSettingsPage';

// Admin PU Foundation Pages
import { AdminPUDashboardPage } from '@/features/admin-pu/pages/AdminPUDashboardPage';
import { AdminPUReportsPage } from '@/features/admin-pu/pages/AdminPUReportsPage';
import { AdminPUReportDetailPage } from '@/features/admin-pu/pages/AdminPUReportDetailPage';
import { AdminPUMapPage } from '@/features/admin-pu/pages/AdminPUMapPage';
import { AdminPUMessagesPage } from '@/features/admin-pu/pages/AdminPUMessagesPage';
import { AdminPUNotificationsPage } from '@/features/admin-pu/pages/AdminPUNotificationsPage';
import { AdminPUProfilePage } from '@/features/admin-pu/pages/AdminPUProfilePage';
import { AdminPUSettingsPage } from '@/features/admin-pu/pages/AdminPUSettingsPage';

// Superadmin Pages
import { SuperadminDashboardPage } from '@/features/superadmin/pages/SuperadminDashboardPage';
import { SuperadminReportsPage } from '@/features/superadmin/pages/SuperadminReportsPage';
import { SuperadminReportDetailPage } from '@/features/superadmin/pages/SuperadminReportDetailPage';
import { SuperadminMapPage } from '@/features/superadmin/pages/SuperadminMapPage';
import { SuperadminMessagesPage } from '@/features/superadmin/pages/SuperadminMessagesPage';
import { SuperadminUsersPage } from '@/features/superadmin/pages/SuperadminUsersPage';
import { SuperadminWilayahPage } from '@/features/superadmin/pages/SuperadminWilayahPage';
import { SuperadminNotificationsPage } from '@/features/superadmin/pages/SuperadminNotificationsPage';
import { SuperadminProfilePage } from '@/features/superadmin/pages/SuperadminProfilePage';
import { SuperadminSettingsPage } from '@/features/superadmin/pages/SuperadminSettingsPage';

/**
 * Dispatches the root route ('/') according to user role.
 * - admin_pemdes: navigates to Admin Pemdes Beranda (/pemdes/beranda).
 * - admin_pu: navigates to Admin PU Beranda (/pu/beranda).
 * - super_admin: navigates to Superadmin Beranda (/superadmin/beranda).
 * - other roles: displays FoundationHome until their specific phases begin.
 */
function HomeRouteDispatcher(): React.JSX.Element {
  const { role } = useAuth();

  if (role === 'admin_pemdes') {
    return <Navigate to="/pemdes/beranda" replace />;
  }

  if (role === 'admin_pu') {
    return <Navigate to="/pu/beranda" replace />;
  }

  if (role === 'super_admin') {
    return <Navigate to="/superadmin/beranda" replace />;
  }

  return <FoundationHome />;
}

/**
 * Role-aware redirector for top-level alias routes
 */
function RoleRouteRedirect({
  pemdesPath,
  puPath,
  superadminPath,
  fallbackPath = '/',
}: {
  pemdesPath: string;
  puPath: string;
  superadminPath?: string;
  fallbackPath?: string;
}): React.JSX.Element {
  const { role } = useAuth();

  if (role === 'admin_pemdes') {
    return <Navigate to={pemdesPath} replace />;
  }

  if (role === 'admin_pu') {
    return <Navigate to={puPath} replace />;
  }

  if (role === 'super_admin' && superadminPath) {
    return <Navigate to={superadminPath} replace />;
  }

  return <Navigate to={fallbackPath} replace />;
}

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Application Area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {/* Root Beranda */}
            <Route path="/" element={<HomeRouteDispatcher />} />

            {/* Explicit Admin Pemdes routes protected with RoleGuard */}
            <Route element={<RoleGuard allowedRoles={['admin_pemdes']} />}>
              <Route path="/pemdes/beranda" element={<AdminPemdesDashboardPage />} />
              <Route path="/pemdes/laporan" element={<AdminPemdesReportsPage />} />
              <Route path="/pemdes/laporan/:id" element={<AdminPemdesReportDetailPage />} />
              <Route path="/pemdes/peta" element={<AdminPemdesMapPage />} />
              <Route path="/pemdes/pesan" element={<AdminPemdesMessagesPage />} />
              <Route path="/pemdes/notifikasi" element={<AdminPemdesNotificationsPage />} />
              <Route path="/pemdes/profil" element={<AdminPemdesProfilePage />} />
              <Route path="/pemdes/pengaturan" element={<AdminPemdesSettingsPage />} />
            </Route>

            {/* Explicit Admin PU routes protected with RoleGuard */}
            <Route element={<RoleGuard allowedRoles={['admin_pu']} />}>
              <Route path="/pu/beranda" element={<AdminPUDashboardPage />} />
              <Route path="/pu/laporan" element={<AdminPUReportsPage />} />
              <Route path="/pu/laporan/:id" element={<AdminPUReportDetailPage />} />
              <Route path="/pu/peta" element={<AdminPUMapPage />} />
              <Route path="/pu/pesan" element={<AdminPUMessagesPage />} />
              <Route path="/pu/notifikasi" element={<AdminPUNotificationsPage />} />
              <Route path="/pu/profil" element={<AdminPUProfilePage />} />
              <Route path="/pu/pengaturan" element={<AdminPUSettingsPage />} />
            </Route>

            {/* Explicit Superadmin routes protected with RoleGuard */}
            <Route element={<RoleGuard allowedRoles={['super_admin']} />}>
              <Route path="/superadmin/beranda" element={<SuperadminDashboardPage />} />
              <Route path="/superadmin/laporan" element={<SuperadminReportsPage />} />
              <Route path="/superadmin/laporan/:id" element={<SuperadminReportDetailPage />} />
              <Route path="/superadmin/peta" element={<SuperadminMapPage />} />
              <Route path="/superadmin/pesan" element={<SuperadminMessagesPage />} />
              <Route path="/superadmin/pengguna" element={<SuperadminUsersPage />} />
              <Route path="/superadmin/wilayah" element={<SuperadminWilayahPage />} />
              <Route path="/superadmin/notifikasi" element={<SuperadminNotificationsPage />} />
              <Route path="/superadmin/profil" element={<SuperadminProfilePage />} />
              <Route path="/superadmin/pengaturan" element={<SuperadminSettingsPage />} />
            </Route>

            {/* Aliases for general routes to role-appropriate pages */}
            <Route path="/reports" element={<RoleRouteRedirect pemdesPath="/pemdes/laporan" puPath="/pu/laporan" superadminPath="/superadmin/laporan" />} />
            <Route path="/map" element={<RoleRouteRedirect pemdesPath="/pemdes/peta" puPath="/pu/peta" superadminPath="/superadmin/peta" />} />
            <Route path="/messages" element={<RoleRouteRedirect pemdesPath="/pemdes/pesan" puPath="/pu/pesan" superadminPath="/superadmin/pesan" />} />
            <Route path="/chat" element={<RoleRouteRedirect pemdesPath="/pemdes/pesan" puPath="/pu/pesan" superadminPath="/superadmin/pesan" />} />
            <Route path="/pesan" element={<RoleRouteRedirect pemdesPath="/pemdes/pesan" puPath="/pu/pesan" superadminPath="/superadmin/pesan" />} />
            <Route path="/users" element={<RoleRouteRedirect pemdesPath="/pemdes/beranda" puPath="/pu/beranda" superadminPath="/superadmin/pengguna" />} />
            <Route path="/wilayah" element={<RoleRouteRedirect pemdesPath="/pemdes/beranda" puPath="/pu/beranda" superadminPath="/superadmin/wilayah" />} />
            <Route path="/notifikasi" element={<RoleRouteRedirect pemdesPath="/pemdes/notifikasi" puPath="/pu/notifikasi" superadminPath="/superadmin/notifikasi" />} />
            <Route path="/notifications" element={<RoleRouteRedirect pemdesPath="/pemdes/notifikasi" puPath="/pu/notifikasi" superadminPath="/superadmin/notifikasi" />} />
            <Route path="/profil" element={<RoleRouteRedirect pemdesPath="/pemdes/profil" puPath="/pu/profil" superadminPath="/superadmin/profil" />} />
            <Route path="/profile" element={<RoleRouteRedirect pemdesPath="/pemdes/profil" puPath="/pu/profil" superadminPath="/superadmin/profil" />} />
            <Route path="/pengaturan" element={<RoleRouteRedirect pemdesPath="/pemdes/pengaturan" puPath="/pu/pengaturan" superadminPath="/superadmin/pengaturan" />} />
            <Route path="/settings" element={<RoleRouteRedirect pemdesPath="/pemdes/pengaturan" puPath="/pu/pengaturan" superadminPath="/superadmin/pengaturan" />} />

            {/* Test 403 route for verifying RoleGuard UX */}
            <Route
              path="/unauthorized"
              element={<RoleGuard allowedRoles={[]} />}
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

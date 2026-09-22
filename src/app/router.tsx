import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RoleGuard } from '@/features/auth/RoleGuard';
import { FoundationHome } from '@/features/auth/FoundationHome';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/useAuth';
import { AdminPemdesDashboardPage } from '@/features/admin-pemdes/pages/AdminPemdesDashboardPage';
import { AdminPemdesReportsPage } from '@/features/admin-pemdes/pages/AdminPemdesReportsPage';
import { AdminPemdesReportDetailPage } from '@/features/admin-pemdes/pages/AdminPemdesReportDetailPage';

/**
 * Dispatches the root route ('/') according to user role.
 * - admin_pemdes: navigates to Admin Pemdes Beranda.
 * - other roles: displays FoundationHome until their specific phases begin.
 */
function HomeRouteDispatcher(): React.JSX.Element {
  const { role } = useAuth();

  if (role === 'admin_pemdes') {
    return <Navigate to="/pemdes/beranda" replace />;
  }

  return <FoundationHome />;
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
            </Route>

            {/* Alias /reports route to role-appropriate laporan page */}
            <Route path="/reports" element={<Navigate to="/pemdes/laporan" replace />} />

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

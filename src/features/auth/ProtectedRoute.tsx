import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Align website access with product architecture: Warga must use the mobile application
  if (role === 'warga') {
    logout();
    return (
      <Navigate
        to="/login"
        state={{
          serverError:
            'Akses Ditolak: Portal web ini khusus untuk staf administratif (Admin Pemdes, Admin PU, dan Superadmin). Warga / Pelapor silakan gunakan aplikasi mobile ROADIS.',
        }}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}

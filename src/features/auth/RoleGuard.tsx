/**
 * RoleGuard provides client-side UX navigation protection and guidance only.
 * 
 * IMPORTANT ARCHITECTURAL & SECURITY PRINCIPLE:
 * - Backend = Authoritative authorization and security boundary.
 * - Frontend = Navigation visibility + UX role guards.
 * - The backend must enforce report/chat ownership, IDOR prevention, and role scopes.
 * Client-side role guards must NEVER be treated as a security solution or defense against IDOR.
 */
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from './useAuth';
import { type Role } from '@/types/domain';
import { formatRoleLabel } from '@/lib/permissions';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

export interface RoleGuardProps {
  allowedRoles: Role[];
  children?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role } = useAuth();
  const navigate = useNavigate();

  const isAllowed = role !== null && allowedRoles.includes(role);

  if (!isAllowed) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6" role="alert">
        <Card className="max-w-md w-full text-center border-severity-berat/30 shadow-md">
          <CardHeader className="items-center pb-2">
            <div className="w-14 h-14 rounded-full bg-severity-berat/10 text-severity-berat flex items-center justify-center mb-2">
              <ShieldAlert className="w-7 h-7" aria-hidden="true" />
            </div>
            <CardTitle className="text-xl text-navy-deepest">
              403 — Hak Akses Ditolak
            </CardTitle>
            <CardDescription className="text-sm">
              Peran Anda saat ini (<strong>{formatRoleLabel(role)}</strong>) tidak memiliki kewenangan untuk mengakses atau mengelola modul ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 text-xs text-muted">
            Kebijakan sistem membatasi antarmuka berdasarkan kewenangan peran. Otorisasi data aktual tetap dikendalikan penuh oleh backend.
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/')}
            >
              Kembali ke Beranda
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}

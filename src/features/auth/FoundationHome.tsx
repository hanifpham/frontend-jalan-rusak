import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { useAuth } from './useAuth';
import { formatRoleLabel } from '@/lib/permissions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';

export function FoundationHome(): React.JSX.Element {
  const { user, role } = useAuth();

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-full bg-status-selesai/15 text-status-selesai">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-xl">
              Fase 2: Shared Shell & Otentikasi Berhasil
            </CardTitle>
          </div>
          <CardDescription>
            Lingkungan fondasi antarmuka ROADIS telah aktif. Sesi login terverifikasi dan shell navigasi telah terpasang sesuai hak akses peran.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-control bg-canvas border border-blue-pale/40 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-deepest">
              Informasi Sesi Terautentikasi:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted">Nama Pengguna: </span>
                <strong className="text-navy-deepest">{user?.nama || '-'}</strong>
              </div>
              <div>
                <span className="text-muted">Alamat Email: </span>
                <strong className="text-navy-deepest">{user?.email || '-'}</strong>
              </div>
              <div>
                <span className="text-muted">Peran Sistem: </span>
                <strong className="text-blue-medium">{formatRoleLabel(role)}</strong>
              </div>
              <div>
                <span className="text-muted">Wilayah ID: </span>
                <strong className="text-navy-deepest">{user?.wilayahId ?? 'Seluruh Kabupaten (Pusat)'}</strong>
              </div>
            </div>
          </div>

          {/* Design System Tokens Showcase */}
          <div className="p-4 rounded-control bg-white border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-deepest">
              Verifikasi Token Desain & Lencana (Design System Primitives):
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted mr-2">Status:</span>
              <StatusBadge status="menunggu" />
              <StatusBadge status="proses" />
              <StatusBadge status="selesai" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted mr-2">Tingkat Kerusakan:</span>
              <SeverityBadge severity="ringan" />
              <SeverityBadge severity="sedang" />
              <SeverityBadge severity="berat" />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-control bg-blue-pale/20 text-xs text-navy-primary border border-blue-pale/40">
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Pemberitahuan:</strong> Sesuai lingkup Fase 2, modul bisnis (Dashboard analitik, Laporan, Peta GIS, Pesan, dan Administrasi) belum diaktifkan dan tidak menggunakan data tiruan (no fake data).
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

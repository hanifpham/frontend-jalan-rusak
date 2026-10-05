import React from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { formatRoleLabel } from '@/lib/permissions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AdminPUProfilePage(): React.JSX.Element {
  const { user, role } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const displayName = profile?.name || user?.nama || 'Admin Dinas PU';
  const displayEmail = profile?.email || user?.email || '-';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/pu/beranda')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali ke Beranda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-blue-pale/40 dark:bg-white/10 text-navy-primary dark:text-blue-pale">
              <User className="w-5 h-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-lg text-navy-deepest dark:text-white">
              Profil Administrator Dinas PU
            </CardTitle>
          </div>
          <CardDescription>
            Informasi akun dan hak akses administratif Dinas Pekerjaan Umum dan Penataan Ruang.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/40 dark:border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted dark:text-[#AFC0D4]">Nama Lengkap:</span>
                <p className="font-bold text-navy-deepest dark:text-white mt-0.5">{displayName}</p>
              </div>
              <div>
                <span className="text-muted dark:text-[#AFC0D4]">Alamat Email:</span>
                <p className="font-bold text-navy-deepest dark:text-white mt-0.5">{displayEmail}</p>
              </div>
              <div>
                <span className="text-muted dark:text-[#AFC0D4]">Peran Sistem:</span>
                <p className="font-bold text-navy-deepest dark:text-white mt-0.5">{formatRoleLabel(role)}</p>
              </div>
              <div>
                <span className="text-muted dark:text-[#AFC0D4]">Instansi:</span>
                <p className="font-bold text-navy-deepest dark:text-white mt-0.5">Dinas PUPR Kab. Indramayu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPUProfilePage;

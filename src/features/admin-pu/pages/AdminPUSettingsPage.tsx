import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AdminPUSettingsPage(): React.JSX.Element {
  const navigate = useNavigate();

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
              <Settings className="w-5 h-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-lg text-navy-deepest dark:text-white">
              Pengaturan Sistem Dinas PU
            </CardTitle>
          </div>
          <CardDescription>
            Preferensi antarmuka, notifikasi audio, dan preferensi operasional Dinas PU.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/40 dark:border-white/10 text-xs space-y-1">
            <p className="font-bold text-navy-deepest dark:text-white">Rute /pu/pengaturan Aktif</p>
            <p className="text-muted dark:text-[#AFC0D4]">
              Modul pengaturan telah terdaftar dan siap untuk konfigurasi lanjutan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPUSettingsPage;

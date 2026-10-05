import React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AdminPUMessagesPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-blue-pale/40 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-primary/10 dark:bg-blue-medium/20 text-navy-primary dark:text-blue-pale flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-deepest dark:text-white">
              Pusat Pesan & Komunikasi Laporan PU
            </h1>
            <p className="text-xs text-muted dark:text-[#AFC0D4] mt-0.5">
              Komunikasi dua arah antara Dinas PU dan pelapor terkait klarifikasi dan perkembangan perbaikan jalan.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-blue-pale/40 dark:bg-white/10 text-navy-primary dark:text-blue-pale">
              <Send className="w-5 h-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-lg text-navy-deepest dark:text-white">
              Fondasi Modul Pesan Admin PU
            </CardTitle>
          </div>
          <CardDescription>
            Rute `/pu/pesan` siap digunakan. Antarmuka daftar percakapan dan obrolan per laporan akan diintegrasikan pada fase pesan PU.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/40 dark:border-white/10 text-xs space-y-2">
            <p className="text-muted dark:text-[#AFC0D4]">
              Modul pesan Dinas PU akan memungkinkan penanganan balasan langsung pada laporan jalan tingkat kabupaten.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/pu/beranda')}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPUMessagesPage;

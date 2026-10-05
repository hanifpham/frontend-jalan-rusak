import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function AdminPUReportDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/pu/laporan')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali ke Daftar Laporan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-blue-pale/40 dark:bg-white/10 text-navy-primary dark:text-blue-pale">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-lg text-navy-deepest dark:text-white">
              Detail Laporan Kerusakan #{id || '-'}
            </CardTitle>
          </div>
          <CardDescription>
            Halaman detail laporan untuk verifikasi teknis, catatan penanganan, dan integrasi peta GIS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/40 dark:border-white/10 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-muted dark:text-[#AFC0D4]">ID Parameter Rute:</span>
                <p className="font-bold text-navy-deepest dark:text-white mt-0.5">{id}</p>
              </div>
              <div>
                <span className="text-muted dark:text-[#AFC0D4]">Status Fondasi:</span>
                <p className="font-bold text-status-selesai mt-0.5">Route Parameter Terhubung</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/pu/laporan')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali ke Daftar Laporan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminPUReportDetailPage;

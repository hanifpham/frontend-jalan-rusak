import React from 'react';
import { Map, Layers, Navigation } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function AdminPUMapPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-blue-pale/40 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy-primary/10 dark:bg-blue-medium/20 text-navy-primary dark:text-blue-pale flex items-center justify-center shrink-0">
            <Map className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-deepest dark:text-white">
              Peta Sebaran Kerusakan Jalan Kabupaten Indramayu
            </h1>
            <p className="text-xs text-muted dark:text-[#AFC0D4] mt-0.5">
              Pemantauan geospasial titik kerusakan jalan, clustering wilayah, dan status penanganan tingkat kabupaten.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-blue-pale/40 dark:bg-white/10 text-navy-primary dark:text-blue-pale">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-lg text-navy-deepest dark:text-white">
              Fondasi Peta Geospasial GIS Dinas PU
            </CardTitle>
          </div>
          <CardDescription>
            Rute `/pu/peta` siap digunakan. Integrasi peta Leaflet tingkat kabupaten akan diimplementasikan pada fase peta PU.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 rounded-2xl bg-canvas dark:bg-[#07111F] border border-dashed border-blue-pale/80 dark:border-white/20 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-pale/40 dark:bg-white/10 text-navy-primary dark:text-blue-pale flex items-center justify-center">
              <Navigation className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-bold text-navy-deepest dark:text-white">
              Area Peta GIS Kabupaten Indramayu
            </p>
            <p className="text-[11px] text-muted dark:text-[#AFC0D4] max-w-sm">
              Rendering peta Leaflet dan layer jalan kabupaten akan aktif pada fase peta Admin PU.
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

export default AdminPUMapPage;

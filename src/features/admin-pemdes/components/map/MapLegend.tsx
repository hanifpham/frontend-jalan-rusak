import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export interface MapLegendProps {
  menungguCount: number;
  prosesCount: number;
  selesaiCount: number;
}

export function MapLegend({
  menungguCount,
  prosesCount,
  selesaiCount,
}: MapLegendProps): React.JSX.Element {
  return (
    <div
      className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-xs rounded-2xl border border-blue-pale/50 shadow-lg p-3.5 z-20 flex flex-col gap-2.5 min-w-52.5 select-none pointer-events-auto"
      aria-label="Legenda Peta Status Laporan"
    >
      {/* Title */}
      <div className="font-bold text-[12px] text-navy-deepest flex items-center gap-1.5">
        <Layers className="w-4 h-4 text-blue-medium shrink-0" aria-hidden="true" />
        <span>Status Laporan</span>
      </div>

      {/* Dynamic Status Counts (Derived from live backend data) */}
      <div className="flex flex-col gap-1.5 text-[11px]">
        <div className="flex items-center justify-between text-navy-deepest font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-menunggu shrink-0" aria-hidden="true" />
            <span>Menunggu</span>
          </span>
          <span className="font-bold text-navy-deepest">{menungguCount} titik</span>
        </div>

        <div className="flex items-center justify-between text-navy-deepest font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-proses shrink-0" aria-hidden="true" />
            <span>Proses</span>
          </span>
          <span className="font-bold text-navy-deepest">{prosesCount} titik</span>
        </div>

        <div className="flex items-center justify-between text-navy-deepest font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-selesai shrink-0" aria-hidden="true" />
            <span>Selesai</span>
          </span>
          <span className="font-bold text-navy-deepest">{selesaiCount} titik</span>
        </div>
      </div>

      {/* Footer Constraint Badge */}
      <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-[10px] text-muted font-medium">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-status-selesai shrink-0" aria-hidden="true" />
          <span>100% Kewenangan Jalan Desa</span>
        </span>
      </div>
    </div>
  );
}

export default MapLegend;

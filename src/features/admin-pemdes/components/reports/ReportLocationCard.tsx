import React from 'react';
import { MapPin, AlertTriangle, ExternalLink } from 'lucide-react';

export interface ReportLocationCardProps {
  latitude?: number;
  longitude?: number;
  roadName?: string;
  villageName?: string;
  roadAuthority?: string;
}

export function ReportLocationCard({
  latitude,
  longitude,
  roadName,
  villageName,
  roadAuthority = 'Jalan Desa',
}: ReportLocationCardProps): React.JSX.Element {
  const displayVillage = villageName ? `Desa ${villageName.replace(/^Desa\s+/i, '')}` : 'Desa Sukamaju';
  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude !== 0 &&
    longitude !== 0;

  const coordString = hasCoordinates
    ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    : '—';

  const osmUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
    : undefined;

  return (
    <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-6 flex flex-col gap-4">
      {/* Header: Map Icon + Title & Authority Badge */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-navy-primary" aria-hidden="true" />
          <h2 className="text-[17px] font-bold text-navy-deepest">
            Lokasi Laporan
          </h2>
        </div>

        <span
          className="inline-flex items-center gap-1 bg-canvas text-navy-primary border border-blue-pale/40 px-3 py-1 rounded-full text-[11px] font-bold select-none"
          title="Kewenangan Penanganan"
        >
          Kewenangan: {roadAuthority} ({displayVillage})
        </span>
      </div>

      {/* Visual Spatial Map Canvas (matching Stitch aesthetic) */}
      <div className="relative w-full h-55 rounded-2xl overflow-hidden border border-blue-pale/40 map-grid-bg flex items-center justify-center select-none">
        {/* Decorative Vector Roads Overlay */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path
              d="M-10 120 C 140 110, 220 80, 480 90 S 700 130, 900 110"
              fill="none"
              stroke="#94A3B8"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <path
              d="M-10 120 C 140 110, 220 80, 480 90 S 700 130, 900 110"
              fill="none"
              stroke="#FFFFFF"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              d="M260 -20 L 260 260"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="10"
            />
            <path
              d="M260 -20 L 260 260"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
            />
          </svg>
        </div>

        {/* Central Spatial Marker Pin with Ping Animation */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-severity-berat opacity-75" />
            <div className="w-9 h-9 rounded-full bg-severity-berat text-white flex items-center justify-center shadow-lg border-2 border-white">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-2 bg-navy-deepest/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-severity-berat" />
            <span>{displayVillage}</span>
          </div>
        </div>

        {/* Bottom Coordinates Tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-navy-deepest text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg border border-blue-pale/50 shadow-xs">
          {coordString}
        </div>

        {/* External Map Link Button */}
        {osmUrl && (
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-white/95 hover:bg-canvas text-navy-primary hover:text-navy-deepest text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-pale/50 shadow-xs flex items-center gap-1 transition-colors"
            title="Buka titik koordinat di OpenStreetMap"
          >
            <span>Peta OpenStreetMap</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* 4-Column Grid Metadata (Nama Jalan, Wilayah, Jenis Jalan, Koordinat) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* 1. Nama Jalan (Rule 11: Honest backend gap if not available) */}
        <div className="bg-canvas/60 rounded-xl p-3 border border-blue-pale/30 flex flex-col">
          <span className="text-[11px] text-muted font-medium">
            Nama Jalan
          </span>
          <span className="text-[13px] font-bold text-navy-deepest mt-0.5 truncate">
            {roadName || '— (Belum tercatat di database)'}
          </span>
        </div>

        {/* 2. Wilayah Administrasi */}
        <div className="bg-canvas/60 rounded-xl p-3 border border-blue-pale/30 flex flex-col">
          <span className="text-[11px] text-muted font-medium">
            Wilayah Administrasi
          </span>
          <span className="text-[13px] font-bold text-navy-deepest mt-0.5 truncate">
            {displayVillage}
          </span>
        </div>

        {/* 3. Jenis Jalan */}
        <div className="bg-canvas/60 rounded-xl p-3 border border-blue-pale/30 flex flex-col">
          <span className="text-[11px] text-muted font-medium">
            Jenis Jalan
          </span>
          <span className="text-[13px] font-bold text-navy-deepest mt-0.5 truncate">
            {roadAuthority} (Kewenangan Pemdes)
          </span>
        </div>

        {/* 4. Koordinat GPS */}
        <div className="bg-canvas/60 rounded-xl p-3 border border-blue-pale/30 flex flex-col">
          <span className="text-[11px] text-muted font-medium">
            Koordinat GPS
          </span>
          <span className="text-[13px] font-bold font-mono text-navy-deepest mt-0.5 truncate">
            {coordString}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReportLocationCard;

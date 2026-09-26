import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, ExternalLink } from 'lucide-react';

export interface ReportLocationCardProps {
  latitude?: number;
  longitude?: number;
  roadName?: string;
  villageName?: string;
  roadAuthority?: string;
  status?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function ReportLocationCard({
  latitude,
  longitude,
  roadName,
  villageName,
  roadAuthority = 'Jalan Desa',
  status,
}: ReportLocationCardProps): React.JSX.Element {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const displayVillage = villageName ? `Desa ${villageName.replace(/^Desa\s+/i, '')}` : 'Desa Sukamaju';
  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude !== 0 &&
    longitude !== 0;

  const coordString = hasCoordinates
    ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    : '—';

  const osmUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
    : undefined;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!hasCoordinates || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 16);
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality OpenStreetMap tiles (consistent with /pemdes/peta)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Standard OpenStreetMap attribution placed at top right to avoid overlap
    L.control
      .attribution({
        position: 'topright',
        prefix: false,
      })
      .addTo(map);

    // Status-based styling consistent with MapView
    const normalizedStatus = status?.toLowerCase();
    const statusColor =
      normalizedStatus === 'selesai'
        ? '#2E9E5B'
        : normalizedStatus === 'proses'
        ? '#5483B3'
        : '#F59E0B';

    const markerIconSvg =
      normalizedStatus === 'selesai'
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

    const customIcon = L.divIcon({
      className: 'custom-roadis-marker',
      iconSize: [120, 56],
      iconAnchor: [60, 24],
      html: `
        <div class="relative flex flex-col items-center group select-none cursor-pointer">
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110" style="background-color: ${statusColor}">
              ${markerIconSvg}
            </div>
          </div>
          <div class="mt-1 bg-navy-deepest text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap opacity-90 max-w-30 truncate text-center">
            ${escapeHtml(displayVillage)}
          </div>
        </div>
      `,
    });

    const marker = L.marker([latitude, longitude], {
      icon: customIcon,
      title: `Titik Lokasi: ${displayVillage}`,
    }).addTo(map);

    marker.bindTooltip(`Lokasi Laporan: ${displayVillage}`, {
      direction: 'top',
      offset: [0, -18],
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    mapInstanceRef.current = map;

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, hasCoordinates, displayVillage, status]);

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

      {/* Real Spatial Map Canvas with Leaflet + OpenStreetMap */}
      <div className="relative z-0 isolate w-full h-55 rounded-2xl overflow-hidden border border-blue-pale/40 flex items-center justify-center select-none bg-canvas">
        {hasCoordinates ? (
          <>
            {/* Real Leaflet Map Container */}
            <div
              ref={mapContainerRef}
              className="w-full h-full min-h-55 z-0 outline-none"
              style={{ minHeight: '220px' }}
            />

            {/* Bottom Coordinates Tag */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-navy-deepest text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg border border-blue-pale/50 shadow-xs z-20 pointer-events-auto">
              {coordString}
            </div>

            {/* External Map Link Button */}
            {osmUrl && (
              <a
                href={osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-white/95 hover:bg-canvas text-navy-primary hover:text-navy-deepest text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-pale/50 shadow-xs flex items-center gap-1 transition-colors z-20 pointer-events-auto"
                title="Buka titik koordinat di OpenStreetMap"
              >
                <span>Peta OpenStreetMap</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 p-6 text-center">
            <MapPin className="w-8 h-8 text-muted/60" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-navy-deepest">
              Koordinat lokasi tidak tersedia.
            </span>
            <span className="text-[11px] text-muted">
              Data GPS belum tercatat pada laporan ini.
            </span>
          </div>
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

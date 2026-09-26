import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Plus, Minus, Navigation, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { type AdminMapReport } from '@/types/domain';
import { MapLegend } from './MapLegend';

export interface MapViewProps {
  reports: AdminMapReport[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const DEFAULT_COORDS: [number, number] = [-6.415, 108.283]; // Lobener Lor coordinates
const DEFAULT_ZOOM = 15;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function MapView({
  reports,
  isLoading,
  error,
  onRetry,
  defaultCenter = DEFAULT_COORDS,
  defaultZoom = DEFAULT_ZOOM,
}: MapViewProps): React.JSX.Element {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const firstReport = reports[0];
    const initialCenter: [number, number] =
      firstReport && typeof firstReport.latitude === 'number' && typeof firstReport.longitude === 'number'
        ? [firstReport.latitude, firstReport.longitude]
        : defaultCenter;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: defaultZoom,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Standard attribution placed discreetly at bottom right
    L.control
      .attribution({
        position: 'bottomright',
        prefix: false,
      })
      .addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    // Trigger resize calculation once mounted
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []); // Run once on mount

  // 2. Render Markers whenever `reports` changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (reports.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    reports.forEach((report) => {
      if (
        typeof report.latitude !== 'number' ||
        typeof report.longitude !== 'number' ||
        isNaN(report.latitude) ||
        isNaN(report.longitude)
      ) {
        return;
      }

      latLngs.push([report.latitude, report.longitude]);

      // Semantic status styling based on verified status
      const statusColor =
        report.status === 'selesai'
          ? '#2E9E5B'
          : report.status === 'proses'
          ? '#5483B3'
          : '#F59E0B';

      const statusLabel =
        report.status === 'selesai'
          ? 'Selesai'
          : report.status === 'proses'
          ? 'Proses'
          : 'Menunggu';

      // SVG Icon inside marker
      const markerIconSvg =
        report.status === 'selesai'
          ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

      // Custom HTML Marker using Stitch Pill Aesthetic
      const customIcon = L.divIcon({
        className: 'custom-roadis-marker',
        iconSize: [120, 56],
        iconAnchor: [60, 24],
        popupAnchor: [0, -20],
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer select-none">
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110" style="background-color: ${statusColor}">
                ${markerIconSvg}
              </div>
            </div>
            <div class="mt-1 bg-navy-deepest text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap opacity-90 max-w-30 truncate text-center">
              ${escapeHtml(report.tipeKerusakan || report.judul)}
            </div>
          </div>
        `,
      });

      const marker = L.marker([report.latitude, report.longitude], {
        icon: customIcon,
        title: report.judul,
      });

      // Build popup container DOM
      const popupContainer = document.createElement('div');
      popupContainer.className =
        'w-[290px] sm:w-[310px] bg-white rounded-2xl shadow-xl border border-blue-pale/50 p-4 flex flex-col gap-3 select-none';

      const escapedTitle = escapeHtml(report.judul);
      const escapedTipe = escapeHtml(report.tipeKerusakan);
      const escapedJalan = escapeHtml(report.jenisJalan || 'desa');
      const escapedReporter = report.reporterName ? escapeHtml(report.reporterName) : '';
      const fallbackImg =
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800';
      const actualImg = report.imageUrl || fallbackImg;

      popupContainer.innerHTML = `
        <div class="relative w-full h-30 rounded-xl overflow-hidden border border-blue-pale/40 bg-gray-100 shrink-0">
          <img src="${escapeHtml(actualImg)}" alt="${escapedTitle}" class="w-full h-full object-cover" onerror="this.src='${fallbackImg}'; this.onerror=null;" />
        </div>
        <div class="flex flex-col gap-2">
          <div class="font-bold text-navy-deepest text-[13px] leading-snug line-clamp-2" title="${escapedTitle}">
            ${escapedTitle}
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-muted font-medium">Jenis: <b class="text-navy-deepest">${escapedTipe}</b></span>
            <span class="inline-flex items-center gap-1 bg-canvas border border-blue-pale/40 px-2 py-0.5 rounded-full font-semibold text-navy-primary capitalize">
              Jalan ${escapedJalan}
            </span>
          </div>
          <div class="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100 text-muted">
            <span class="inline-flex items-center gap-1.5 font-bold" style="color: ${statusColor}">
              <span class="w-2 h-2 rounded-full" style="background-color: ${statusColor}"></span>
              ${statusLabel}
            </span>
            ${escapedReporter ? `<span class="font-medium text-muted">Pelapor: ${escapedReporter}</span>` : ''}
          </div>
        </div>
        <button type="button" class="cta-detail-btn w-full bg-navy-primary hover:bg-navy-deepest text-white text-[12px] font-semibold py-2.5 px-4 rounded-full text-center flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98">
          <span>Lihat Detail Laporan</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      `;

      // Bind navigate handler to CTA button
      const ctaBtn = popupContainer.querySelector<HTMLButtonElement>('.cta-detail-btn');
      if (ctaBtn) {
        ctaBtn.onclick = (e) => {
          e.preventDefault();
          navigate(`/pemdes/laporan/${report.id}`);
        };
      }

      marker.bindPopup(popupContainer, {
        className: 'roadis-leaflet-popup',
        offset: [0, -10],
        maxWidth: 340,
        minWidth: 290,
      });

      marker.on('click', () => {
        map.panTo([report.latitude, report.longitude]);
      });

      marker.addTo(markersLayer);
    });

    // Auto-fit bounds if we have coordinates
    const singlePoint = latLngs[0];
    if (latLngs.length === 1 && singlePoint) {
      map.setView(singlePoint, defaultZoom);
    } else if (latLngs.length > 1) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [reports, defaultZoom, navigate]);

  // Map Controls Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (reports.length > 0) {
      const validReports = reports.filter(
        (r) => typeof r.latitude === 'number' && typeof r.longitude === 'number'
      );
      const firstValid = validReports[0];
      if (validReports.length === 1 && firstValid) {
        map.setView([firstValid.latitude, firstValid.longitude], defaultZoom);
      } else if (validReports.length > 1) {
        const bounds = L.latLngBounds(
          validReports.map((r) => [r.latitude, r.longitude] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } else {
        map.setView(defaultCenter, defaultZoom);
      }
    } else {
      map.setView(defaultCenter, defaultZoom);
    }
  };

  // Status counts for dynamic legend
  const menungguCount = reports.filter((r) => r.status === 'menunggu').length;
  const prosesCount = reports.filter((r) => r.status === 'proses').length;
  const selesaiCount = reports.filter((r) => r.status === 'selesai').length;

  return (
    <div className="relative z-0 isolate bg-white rounded-card border border-blue-pale/40 shadow-sm overflow-hidden flex-1 min-h-160 h-165 flex flex-col">
      {/* 1. Leaflet Map Element Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-160 z-0 bg-[#EAF0F6] outline-none"
        style={{ minHeight: '640px' }}
      />

      {/* 2. Floating Map Controls (Top-Right) */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-full bg-white hover:bg-canvas border border-blue-pale/50 text-navy-deepest flex items-center justify-center shadow-md transition-colors cursor-pointer active:scale-95"
          title="Perbesar Peta"
          aria-label="Perbesar Peta"
        >
          <Plus className="w-5 h-5 text-navy-deepest" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-full bg-white hover:bg-canvas border border-blue-pale/50 text-navy-deepest flex items-center justify-center shadow-md transition-colors cursor-pointer active:scale-95"
          title="Perkecil Peta"
          aria-label="Perkecil Peta"
        >
          <Minus className="w-5 h-5 text-navy-deepest" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleCenterView}
          className="w-10 h-10 rounded-full bg-white hover:bg-canvas border border-blue-pale/50 text-navy-primary flex items-center justify-center shadow-md transition-colors cursor-pointer active:scale-95 mt-1"
          title="Pusatkan ke Titik Laporan"
          aria-label="Pusatkan Peta ke Titik Laporan"
        >
          <Navigation className="w-5 h-5 text-navy-primary" aria-hidden="true" />
        </button>
      </div>

      {/* 3. Floating Map Legend Card (Bottom-Left) */}
      <MapLegend
        menungguCount={menungguCount}
        prosesCount={prosesCount}
        selesaiCount={selesaiCount}
      />

      {/* 4. Loading Overlay State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-pale border-t-navy-primary rounded-full animate-spin" />
          <span className="text-sm font-semibold text-navy-deepest">
            Memuat data spasial titik laporan...
          </span>
        </div>
      )}

      {/* 5. Error Overlay State */}
      {error && !isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-6 text-center gap-3">
          <AlertCircle className="w-12 h-12 text-severity-berat" />
          <h2 className="text-base font-bold text-navy-deepest">
            Gagal Memuat Titik Peta
          </h2>
          <p className="text-xs text-muted max-w-md">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold rounded-full shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang</span>
            </button>
          )}
        </div>
      )}

      {/* 6. Empty State Overlay Banner */}
      {!isLoading && !error && reports.length === 0 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-blue-pale/60 rounded-full px-5 py-2.5 shadow-md z-20 flex items-center gap-2 select-none">
          <MapPin className="w-4 h-4 text-muted" aria-hidden="true" />
          <span className="text-xs font-semibold text-navy-deepest">
            Peta Belum Memiliki Laporan
          </span>
          <span className="text-xs text-muted">
            (Tidak ada titik laporan kerusakan pada filter ini)
          </span>
        </div>
      )}
    </div>
  );
}

export default MapView;

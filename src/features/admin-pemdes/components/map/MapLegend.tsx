import React from "react";
import { Layers, CheckCircle2, Building2 } from "lucide-react";

export interface MapLegendProps {
  menungguCount: number;
  prosesCount: number;
  selesaiCount: number;
  ditolakCount?: number;
  scopeLabel?: string;
  showAuthorityLegend?: boolean;
  authorityCounts?: {
    desa: number;
    kabupaten: number;
    provinsi: number;
    nasional: number;
  };
}

export function MapLegend({
  menungguCount,
  prosesCount,
  selesaiCount,
  ditolakCount,
  scopeLabel = "100% Kewenangan Jalan Desa",
  showAuthorityLegend = false,
  authorityCounts,
}: MapLegendProps): React.JSX.Element {
  return (
    <div
      className="absolute bottom-5 left-5 bg-white/95 dark:bg-[#0D1A2D]/95 backdrop-blur-xs rounded-2xl border border-blue-pale/50 dark:border-white/10 shadow-lg p-3.5 z-20 flex flex-col gap-3 min-w-56 select-none pointer-events-auto max-h-[85%] overflow-y-auto"
      aria-label="Legenda Peta Status & Kewenangan Laporan"
    >
      {/* Section 1: Kewenangan Jalan (PU-5.1) */}
      {showAuthorityLegend && (
        <div className="flex flex-col gap-2">
          <div className="font-bold text-[12px] text-navy-deepest dark:text-white flex items-center gap-1.5">
            <Building2
              className="w-4 h-4 text-navy-primary dark:text-[#5483B3] shrink-0"
              aria-hidden="true"
            />
            <span>Kewenangan Jalan</span>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px]">
            <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"
                  aria-hidden="true"
                />
                <span>Desa</span>
              </span>
              <span className="font-bold text-navy-deepest dark:text-white">
                {authorityCounts?.desa ?? 0} titik
              </span>
            </div>

            <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"
                  aria-hidden="true"
                />
                <span>Kabupaten</span>
              </span>
              <span className="font-bold text-navy-deepest dark:text-white">
                {authorityCounts?.kabupaten ?? 0} titik
              </span>
            </div>

            <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"
                  aria-hidden="true"
                />
                <span>Provinsi</span>
              </span>
              <span className="font-bold text-navy-deepest dark:text-white">
                {authorityCounts?.provinsi ?? 0} titik
              </span>
            </div>

            <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"
                  aria-hidden="true"
                />
                <span>Nasional</span>
              </span>
              <span className="font-bold text-navy-deepest dark:text-white">
                {authorityCounts?.nasional ?? 0} titik
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Divider if both are shown */}
      {showAuthorityLegend && (
        <div className="border-t border-gray-100 dark:border-white/10" />
      )}

      {/* Section 2: Status Laporan */}
      <div className="flex flex-col gap-2">
        <div className="font-bold text-[12px] text-navy-deepest dark:text-white flex items-center gap-1.5">
          <Layers
            className="w-4 h-4 text-blue-medium shrink-0"
            aria-hidden="true"
          />
          <span>Status Laporan</span>
        </div>

        {/* Dynamic Status Counts (Derived from live backend data) */}
        <div className="flex flex-col gap-1.5 text-[11px]">
          <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full bg-status-menunggu shrink-0"
                aria-hidden="true"
              />
              <span>Menunggu</span>
            </span>
            <span className="font-bold text-navy-deepest dark:text-white">
              {menungguCount} titik
            </span>
          </div>

          <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full bg-status-proses shrink-0"
                aria-hidden="true"
              />
              <span>Proses</span>
            </span>
            <span className="font-bold text-navy-deepest dark:text-white">
              {prosesCount} titik
            </span>
          </div>

          <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full bg-status-selesai shrink-0"
                aria-hidden="true"
              />
              <span>Selesai</span>
            </span>
            <span className="font-bold text-navy-deepest dark:text-white">
              {selesaiCount} titik
            </span>
          </div>

          {ditolakCount !== undefined && (
            <div className="flex items-center justify-between text-navy-deepest dark:text-[#AFC0D4] font-medium">
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-severity-berat shrink-0"
                  aria-hidden="true"
                />
                <span>Ditolak</span>
              </span>
              <span className="font-bold text-navy-deepest dark:text-white">
                {ditolakCount} titik
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Constraint Badge */}
      <div className="border-t border-gray-100 dark:border-white/10 pt-2 flex items-center justify-between text-[10px] text-muted dark:text-[#8FA4BA] font-medium">
        <span className="flex items-center gap-1">
          <CheckCircle2
            className="w-3 h-3 text-status-selesai shrink-0"
            aria-hidden="true"
          />
          <span>{scopeLabel}</span>
        </span>
      </div>
    </div>
  );
}

export default MapLegend;

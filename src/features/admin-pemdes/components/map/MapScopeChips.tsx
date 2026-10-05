import React from "react";
import { Lock, Building2 } from "lucide-react";
import { WilayahChip } from "../WilayahChip";

export interface MapScopeChipsProps {
  villageName?: string;
  locationLabel?: string;
  scopeLabel?: string;
  totalReports: number;
  isLoading?: boolean;
}

export function MapScopeChips({
  villageName,
  locationLabel,
  scopeLabel = "Jalan Desa",
  totalReports,
  isLoading = false,
}: MapScopeChipsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 flex-wrap select-none">
      {/* 1. Location Scope Chip */}
      {locationLabel ? (
        <div
          className="inline-flex items-center gap-2 bg-blue-pale/50 dark:bg-white/10 text-navy-deepest font-semibold text-[13px] px-4 py-2 rounded-full border border-blue-supporting/30 dark:border-white/10 shadow-xs select-none"
          title="Wilayah Administrasi Kabupaten"
        >
          <Building2
            className="w-4 h-4 text-navy-primary dark:text-[#5483B3] shrink-0"
            aria-hidden="true"
          />
          <span>{locationLabel}</span>
        </div>
      ) : (
        <WilayahChip villageName={villageName} />
      )}

      {/* 2. Authority Constraint Chip */}
      <div
        className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] text-navy-deepest font-medium text-[13px] px-4 py-2 rounded-full border border-blue-pale/50 dark:border-[rgba(193,232,255,0.12)] shadow-xs"
        title={`Kewenangan administrasi khusus ${scopeLabel.toLowerCase()}`}
      >
        <Lock
          className="w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] shrink-0"
          aria-hidden="true"
        />
        <span>{scopeLabel}</span>
      </div>

      {/* 3. Live Total Reports Count Chip */}
      <div className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] text-navy-deepest text-[13px] font-medium px-4 py-2 rounded-full border border-blue-pale/50 dark:border-[rgba(193,232,255,0.12)] shadow-xs">
        <span
          className="w-2 h-2 rounded-full bg-blue-medium shrink-0"
          aria-hidden="true"
        />
        {isLoading ? (
          <span className="inline-block w-6 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="font-bold text-navy-deepest">
            {totalReports}
          </span>
        )}
        <span className="text-muted dark:text-[#AFC0D4]">Laporan</span>
      </div>
    </div>
  );
}

export default MapScopeChips;

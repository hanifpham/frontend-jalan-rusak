import React from "react";
import { Lock } from "lucide-react";
import { WilayahChip } from "@/components/ui/WilayahChip";

export interface ReportScopeChipsProps {
  villageName?: string;
  totalReports?: number;
  isLoading?: boolean;
  scopeLabel?: string;
  locationLabel?: string;
}

export function ReportScopeChips({
  villageName,
  totalReports = 0,
  isLoading = false,
  scopeLabel = "Jalan Desa",
  locationLabel,
}: ReportScopeChipsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 flex-wrap select-none">
      {/* 1. Location Chip */}
      <WilayahChip villageName={villageName} locationLabel={locationLabel} />

      {/* 2. Locked Scope Indicator */}
      <div
        className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0D1A2D] text-muted dark:text-[#8FA4BA] font-medium text-[12px] px-3.5 py-2 rounded-full border border-blue-pale/50 dark:border-white/10 shadow-xs select-none"
        title="Cakupan otomatis wilayah wewenang sesuai regulasi perundang-undangan"
      >
        <Lock
          className="w-3.5 h-3.5 text-muted/80 dark:text-[#8FA4BA]/80 shrink-0"
          aria-hidden="true"
        />
        <span>{scopeLabel}</span>
      </div>

      {/* 3. Badge Counter with Ping Indicator */}
      <div className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] text-navy-deepest text-[12px] font-semibold px-3.5 py-2 rounded-full border border-blue-pale/50 dark:border-white/10 shadow-xs select-none">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-berat opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-berat" />
        </span>
        {isLoading ? (
          <span className="inline-block w-6 h-3.5 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        ) : (
          <span className="text-navy-deepest font-bold">{totalReports}</span>
        )}
        <span className="text-muted dark:text-[#8FA4BA] font-medium">
          Laporan
        </span>
      </div>
    </div>
  );
}

export default ReportScopeChips;

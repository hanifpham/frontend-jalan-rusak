import React from 'react';
import { Lock } from 'lucide-react';
import { WilayahChip } from '../WilayahChip';

export interface ReportScopeChipsProps {
  villageName?: string;
  totalReports?: number;
  isLoading?: boolean;
}

export function ReportScopeChips({
  villageName,
  totalReports = 0,
  isLoading = false,
}: ReportScopeChipsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* 1. Location Chip */}
      <WilayahChip villageName={villageName} />

      {/* 2. Locked Scope Indicator */}
      <div
        className="inline-flex items-center gap-1.5 bg-white text-muted font-medium text-[12px] px-3.5 py-2 rounded-full border border-blue-pale/50 shadow-xs select-none"
        title="Cakupan otomatis wilayah wewenang sesuai regulasi Permendagri & UU Desa"
      >
        <Lock className="w-3.5 h-3.5 text-muted/80 shrink-0" aria-hidden="true" />
        <span>Jalan Desa</span>
      </div>

      {/* 3. Badge Counter with Ping Indicator */}
      <div className="inline-flex items-center gap-2 bg-white text-navy-deepest text-[12px] font-semibold px-3.5 py-2 rounded-full border border-blue-pale/50 shadow-xs select-none">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-berat opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-berat" />
        </span>
        {isLoading ? (
          <span className="inline-block w-6 h-3.5 bg-gray-200 rounded animate-pulse" />
        ) : (
          <span className="text-navy-deepest font-bold">{totalReports}</span>
        )}
        <span className="text-muted font-medium">Laporan</span>
      </div>
    </div>
  );
}

export default ReportScopeChips;

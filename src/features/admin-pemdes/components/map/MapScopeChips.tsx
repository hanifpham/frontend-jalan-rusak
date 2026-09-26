import React from 'react';
import { Lock } from 'lucide-react';
import { WilayahChip } from '../WilayahChip';

export interface MapScopeChipsProps {
  villageName?: string;
  totalReports: number;
  isLoading?: boolean;
}

export function MapScopeChips({
  villageName,
  totalReports,
  isLoading = false,
}: MapScopeChipsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 flex-wrap select-none">
      {/* 1. Location Scope Chip (Shared WilayahChip matching Reports page) */}
      <WilayahChip villageName={villageName} />

      {/* 2. Authority Constraint Chip */}
      <div
        className="inline-flex items-center gap-2 bg-white text-navy-deepest font-medium text-[13px] px-4 py-2 rounded-full border border-blue-pale/50 shadow-xs"
        title="Kewenangan administrasi khusus jalan desa"
      >
        <Lock className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
        <span>Jalan Desa</span>
      </div>

      {/* 3. Live Total Reports Count Chip */}
      <div className="inline-flex items-center gap-2 bg-white text-navy-deepest text-[13px] font-medium px-4 py-2 rounded-full border border-blue-pale/50 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-blue-medium shrink-0" aria-hidden="true" />
        {isLoading ? (
          <span className="inline-block w-6 h-4 bg-gray-200 rounded animate-pulse" />
        ) : (
          <span className="font-bold text-navy-deepest">{totalReports}</span>
        )}
        <span className="text-muted">Laporan</span>
      </div>
    </div>
  );
}

export default MapScopeChips;

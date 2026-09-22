import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WilayahChipProps {
  villageName?: string;
  className?: string;
}

/**
 * Shared WilayahChip Component for Admin Pemdes (Beranda & Laporan)
 * Source of Truth: Visual reference from Admin Pemdes Laporan scope chips.
 */
export function WilayahChip({ villageName, className }: WilayahChipProps): React.JSX.Element {
  const displayVillage = villageName ? `Desa ${villageName.replace(/^Desa\s+/i, '')}` : 'Wilayah belum tersedia';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 bg-blue-pale/50 text-navy-deepest font-semibold text-[13px] px-4 py-2 rounded-full border border-blue-supporting/30 shadow-xs select-none',
        className
      )}
      title="Wilayah Administrasi Pemdes"
    >
      <MapPin className="w-4 h-4 text-navy-primary shrink-0" aria-hidden="true" />
      <span>{displayVillage}</span>
    </div>
  );
}

export default WilayahChip;

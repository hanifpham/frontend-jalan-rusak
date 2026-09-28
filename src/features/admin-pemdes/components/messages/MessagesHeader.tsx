import React from 'react';
import { MapPin, Lock } from 'lucide-react';

export interface MessagesHeaderProps {
  villageName?: string;
}

/**
 * Header and scope chips for Admin Pemdes Messages page.
 * Derived from Stitch reference: 'Pusat Pesan & Percakapan'.
 */
export function MessagesHeader({ villageName = 'Sukamaju' }: MessagesHeaderProps): React.JSX.Element {
  const displayVillage = villageName.startsWith('Desa') ? villageName : `Desa ${villageName}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      <div>
        <h1 className="text-2xl font-bold text-navy-deepest tracking-tight">
          Pusat Pesan &amp; Percakapan
        </h1>
        <p className="text-sm text-muted mt-0.5">
          Komunikasi privat dengan warga pelapor di wilayah {displayVillage}.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Chip 1: Wilayah Penugasan */}
        <div
          className="inline-flex items-center gap-1.5 bg-blue-pale/80 text-navy-primary px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs select-none"
          title="Wilayah penugasan Admin Pemdes"
        >
          <MapPin className="w-4 h-4 text-navy-primary shrink-0" aria-hidden="true" />
          <span>{displayVillage}</span>
        </div>

        {/* Chip 2: Kewenangan & Kerahasiaan */}
        <div
          className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-xs select-none"
          title="Lingkup kewenangan Jalan Desa dan komunikasi privat"
        >
          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
          <span>Jalan Desa • Privat</span>
        </div>
      </div>
    </div>
  );
}

export default MessagesHeader;

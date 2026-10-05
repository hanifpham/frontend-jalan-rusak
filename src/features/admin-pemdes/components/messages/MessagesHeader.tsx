import React from "react";
import { MapPin, Lock } from "lucide-react";

export interface MessagesHeaderProps {
  villageName?: string;
  locationName?: string;
  scopeLabel?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Header and scope chips for Admin Pemdes Messages page.
 * Derived from Stitch reference: 'Pusat Pesan & Percakapan'.
 */
export function MessagesHeader({
  villageName = "Sukamaju",
  locationName,
  scopeLabel,
  title = "Pusat Pesan & Percakapan",
  subtitle,
}: MessagesHeaderProps): React.JSX.Element {
  const displayVillage = locationName
    ? locationName
    : villageName.startsWith("Desa")
      ? villageName
      : `Desa ${villageName}`;

  const displaySubtitle =
    subtitle || `Komunikasi privat dengan warga pelapor di wilayah ${displayVillage}.`;

  const displayScope = scopeLabel || "Jalan Desa • Privat";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
      <div>
        <h1 className="text-2xl font-bold text-navy-deepest tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted dark:text-[#AFC0D4] mt-0.5">
          {displaySubtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Chip 1: Wilayah Penugasan */}
        <div
          className="inline-flex items-center gap-1.5 bg-blue-pale/80 dark:bg-[#5483B3]/20 text-navy-primary dark:text-blue-pale px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs select-none"
          title="Wilayah penugasan Admin Pemdes"
        >
          <MapPin
            className="w-4 h-4 text-navy-primary dark:text-blue-pale shrink-0"
            aria-hidden="true"
          />
          <span>{displayVillage}</span>
        </div>

        {/* Chip 2: Kewenangan & Kerahasiaan */}
        <div
          className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-[rgba(193,232,255,0.12)] text-slate-700 dark:text-[#AFC0D4] px-3.5 py-1.5 rounded-full text-xs font-medium shadow-xs select-none"
          title="Lingkup kewenangan Jalan Desa dan komunikasi privat"
        >
          <Lock
            className="w-3.5 h-3.5 text-slate-500 dark:text-[#8FA4BA] shrink-0"
            aria-hidden="true"
          />
          <span>{displayScope}</span>
        </div>
      </div>
    </div>
  );
}

export default MessagesHeader;

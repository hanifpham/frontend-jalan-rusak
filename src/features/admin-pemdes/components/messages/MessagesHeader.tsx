import React from "react";
import { Lock } from "lucide-react";
import { WilayahChip } from "../WilayahChip";

export interface MessagesHeaderProps {
  villageName?: string;
  locationName?: string;
  locationLabel?: string;
  scopeLabel?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Header and scope chips for Admin Pemdes & Admin PU Messages page.
 * Harmonized with other pages using WilayahChip as single source of truth.
 */
export function MessagesHeader({
  villageName = "Sukamaju",
  locationName,
  locationLabel,
  scopeLabel,
  title = "Pusat Pesan & Percakapan",
  subtitle,
}: MessagesHeaderProps): React.JSX.Element {
  const resolvedLocation = locationLabel ?? locationName;
  const isKabupaten = Boolean(
    resolvedLocation || (villageName && /kabupaten/i.test(villageName))
  );

  const displaySubtitle =
    subtitle ||
    (isKabupaten
      ? `Komunikasi privat dengan warga pelapor terkait laporan jalan kewenangan Kabupaten.`
      : `Komunikasi privat dengan warga pelapor di wilayah Desa ${villageName.replace(/^Desa\s+/i, "")}.`);

  const displayScope =
    scopeLabel || (isKabupaten ? "Jalan Kabupaten • Privat" : "Jalan Desa • Privat");

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
        {/* Chip 1: Wilayah Penugasan (Harmonized dengan Dashboard, Laporan, & Peta) */}
        <WilayahChip villageName={villageName} locationLabel={resolvedLocation} />

        {/* Chip 2: Kewenangan & Kerahasiaan */}
        <div
          className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0D1A2D] text-muted dark:text-[#8FA4BA] font-medium text-[12px] px-3.5 py-2 rounded-full border border-blue-pale/50 dark:border-white/10 shadow-xs select-none"
          title={
            isKabupaten
              ? "Lingkup kewenangan Jalan Kabupaten dan komunikasi privat"
              : "Lingkup kewenangan Jalan Desa dan komunikasi privat"
          }
        >
          <Lock
            className="w-3.5 h-3.5 text-muted/80 dark:text-[#8FA4BA]/80 shrink-0"
            aria-hidden="true"
          />
          <span>{displayScope}</span>
        </div>
      </div>
    </div>
  );
}

export default MessagesHeader;

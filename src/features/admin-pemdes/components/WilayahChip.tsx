import React from "react";
import { MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WilayahChipProps {
  villageName?: string;
  locationLabel?: string;
  className?: string;
}

/**
 * Shared WilayahChip Component for Admin Pemdes & Admin PU
 * Supports both Village level (MapPin icon) and Kabupaten/Regency level (Building2 icon).
 * Single source of truth for location scope chip.
 */
export function WilayahChip({
  villageName,
  locationLabel,
  className,
}: WilayahChipProps): React.JSX.Element {
  const isKabupaten = Boolean(
    locationLabel || (villageName && /kabupaten/i.test(villageName))
  );

  const displayText = locationLabel
    ? locationLabel
    : villageName
      ? isKabupaten
        ? villageName
        : `Desa ${villageName.replace(/^Desa\s+/i, "")}`
      : "Wilayah belum tersedia";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 bg-blue-pale/50 dark:bg-white/10 text-navy-deepest font-semibold text-[13px] px-4 py-2 rounded-full border border-blue-supporting/30 dark:border-white/10 shadow-xs select-none",
        className
      )}
      title={isKabupaten ? "Wilayah Administrasi Kabupaten" : "Wilayah Administrasi Pemdes"}
    >
      {isKabupaten ? (
        <Building2
          className="w-4 h-4 text-navy-primary dark:text-[#5483B3] shrink-0"
          aria-hidden="true"
        />
      ) : (
        <MapPin
          className="w-4 h-4 text-navy-primary dark:text-[#5483B3] shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
    </div>
  );
}

export default WilayahChip;


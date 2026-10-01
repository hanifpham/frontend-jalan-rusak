import React, { useState } from "react";
import { MapPin, Image as ImageIcon } from "lucide-react";
import { type Report, type Severity } from "@/types/domain";
import { cn } from "@/lib/utils";

export interface ReportContextBarProps {
  report?: Report | null;
  fallbackTitle?: string;
  fallbackVillage?: string;
  fallbackStatus?: string;
}

export function ReportContextBar({
  report,
  fallbackTitle = "Laporan Kerusakan Jalan",
  fallbackVillage,
  fallbackStatus = "menunggu",
}: ReportContextBarProps): React.JSX.Element {
  const [imageError, setImageError] = useState(false);

  const title = report?.title || fallbackTitle;
  const location =
    report?.roadName ||
    (fallbackVillage
      ? `Desa ${fallbackVillage.replace(/^Desa\s+/i, "")}`
      : "Wilayah Desa");
  const imageUrl = report?.imageUrl;

  // Status mapping
  const currentStatus = (report?.status || fallbackStatus || "").toLowerCase();
  let statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200/50";
  let statusLabel = "Menunggu";

  if (currentStatus === "proses") {
    statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-200/50";
    statusLabel = "Diproses";
  } else if (currentStatus === "selesai") {
    statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
    statusLabel = "Selesai";
  } else if (currentStatus === "ditolak") {
    statusBadgeClass = "bg-red-50 text-red-600 border-red-200/50";
    statusLabel = "Ditolak";
  }

  // Severity mapping (honest domain data only, no fake AI score)
  const severity: Severity | undefined = report?.severity;
  let severityBadgeClass = "bg-amber-50 text-amber-600 border-amber-200/50";
  let severityLabel = "Sedang";

  if (severity === "berat") {
    severityBadgeClass = "bg-red-50 text-red-600 border-red-200/50";
    severityLabel = "Berat";
  } else if (severity === "ringan") {
    severityBadgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200/50";
    severityLabel = "Ringan";
  }

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-[#12233A] border border-slate-200/80 dark:border-[rgba(193,232,255,0.12)] p-2.5 flex items-center justify-between gap-3 mt-3 shrink-0">
      {/* Left: Report Image & Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Photo or Placeholder */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10 shadow-xs"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-[#8FA4BA] shrink-0 shadow-xs"
            aria-label="Foto laporan tidak tersedia"
          >
            <ImageIcon
              className="w-5 h-5 text-slate-400 dark:text-[#8FA4BA]"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Text Details & Badges */}
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-navy-deepest truncate">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-[#AFC0D4] mt-0.5">
            <MapPin
              className="w-3.5 h-3.5 text-slate-400 dark:text-[#8FA4BA] shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {/* Severity Chip (if valid) */}
            {severity && (
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
                  severityBadgeClass,
                )}
              >
                {severityLabel}
              </span>
            )}

            {/* Status Chip */}
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
                statusBadgeClass,
              )}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Authority Scope (Admin Pemdes = Jalan Desa) */}
      <div className="text-right shrink-0 hidden sm:block">
        <span className="text-[10px] text-slate-400 dark:text-[#8FA4BA] block mb-0.5 font-medium">
          Kewenangan:
        </span>
        <span className="bg-[#EFF4FF] dark:bg-[#5483B3]/20 border border-[#d0e4ff] dark:border-[#5483B3]/40 text-navy-primary dark:text-blue-pale text-[11px] font-semibold px-3 py-1 rounded-full inline-block select-none">
          Jalan Desa (Pemdes)
        </span>
      </div>
    </div>
  );
}

export default ReportContextBar;

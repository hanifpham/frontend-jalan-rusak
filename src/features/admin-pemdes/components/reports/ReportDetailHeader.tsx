import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, AlertTriangle } from "lucide-react";
import { type ReportStatus, type Severity } from "@/types/domain";
import { cn } from "@/lib/utils";

export interface ReportDetailHeaderProps {
  reportId: number | string;
  villageName?: string;
  status: ReportStatus;
  severity?: Severity;
  priorityScore?: number;
  backPath?: string;
  subtitle?: string;
  roadAuthority?: string;
}

/**
 * Authority badge pill matching Stitch design tokens
 */
function AuthorityPill({ authority }: { authority?: string }): React.JSX.Element {
  let label = "Tidak Teridentifikasi";
  let color =
    "bg-gray-100 dark:bg-white/10 text-muted dark:text-[#8FA4BA] border-gray-200 dark:border-white/10";

  switch ((authority || "").toLowerCase()) {
    case "kabupaten":
      label = "Jalan Kabupaten";
      color =
        "bg-blue-pale/50 dark:bg-[#5483B3]/25 text-navy-deepest dark:text-blue-pale border-blue-supporting/40 dark:border-[#5483B3]/40";
      break;
    case "desa":
      label = "Jalan Desa";
      color =
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      break;
    case "provinsi":
      label = "Jalan Provinsi";
      color =
        "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
      break;
    case "nasional":
      label = "Jalan Nasional";
      color =
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold border shadow-xs select-none",
        color,
      )}
      title={`Kewenangan: ${label}`}
    >
      {label}
    </span>
  );
}

/**
 * Status badge pill matching exact Stitch design tokens.
 */
function StatusPill({ status }: { status: ReportStatus }): React.JSX.Element {
  switch (status.toLowerCase()) {
    case "selesai":
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-status-selesai border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Selesai"
        >
          <span
            className="w-2 h-2 rounded-full bg-status-selesai"
            aria-hidden="true"
          />
          <span>Selesai</span>
        </span>
      );
    case "proses":
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-blue-medium/15 text-status-proses border border-blue-medium/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Proses"
        >
          <span
            className="w-2 h-2 rounded-full bg-status-proses"
            aria-hidden="true"
          />
          <span>Proses</span>
        </span>
      );
    case "ditolak":
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-red-500/15 text-severity-berat border border-red-500/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Ditolak"
        >
          <span
            className="w-2 h-2 rounded-full bg-severity-berat"
            aria-hidden="true"
          />
          <span>Ditolak</span>
        </span>
      );
    case "menunggu":
    default:
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-status-menunggu/15 text-[#B45309] border border-status-menunggu/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Menunggu"
        >
          <span
            className="w-2 h-2 rounded-full bg-status-menunggu"
            aria-hidden="true"
          />
          <span>Menunggu</span>
        </span>
      );
  }
}

/**
 * Severity badge pill.
 * NOTE (Rule 9): Backend does not yet have a verified severity model.
 * If severity is undefined, renders honest backend-gap dash (—).
 */
function SeverityPill({
  severity,
}: {
  severity?: Severity;
}): React.JSX.Element {
  if (!severity) {
    return (
      <span
        className="inline-flex items-center gap-1.5 bg-canvas dark:bg-[#12233A] text-muted dark:text-[#8FA4BA] border border-blue-pale/40 dark:border-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-medium select-none"
        title="Tingkat keparahan belum tersedia dari backend (BACKEND GAP)"
      >
        <span>Keparahan: —</span>
      </span>
    );
  }

  const colorMap: Record<
    Severity,
    { bg: string; text: string; border: string; dot: string; label: string }
  > = {
    berat: {
      bg: "bg-severity-berat/10",
      text: "text-severity-berat",
      border: "border-severity-berat/25",
      dot: "bg-severity-berat",
      label: "Berat",
    },
    sedang: {
      bg: "bg-severity-sedang/15",
      text: "text-[#B45309] dark:text-amber-400",
      border: "border-severity-sedang/30",
      dot: "bg-severity-sedang",
      label: "Sedang",
    },
    ringan: {
      bg: "bg-severity-ringan/15",
      text: "text-status-selesai dark:text-emerald-400",
      border: "border-severity-ringan/30",
      dot: "bg-severity-ringan",
      label: "Ringan",
    },
  };

  const config = colorMap[severity] || colorMap.sedang;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none",
        config.bg,
        config.text,
        config.border,
      )}
      title={`Tingkat Keparahan: ${config.label}`}
    >
      <span
        className={cn("w-2 h-2 rounded-full", config.dot)}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
}

/**
 * Priority badge pill.
 * NOTE (Rule 10): Backend does not yet have a priority calculation formula.
 * If priorityScore is undefined, renders honest backend-gap state.
 */
function PriorityPill({ score }: { score?: number }): React.JSX.Element {
  if (score === undefined || score === null) {
    return (
      <span
        className="inline-flex items-center gap-1.5 bg-canvas dark:bg-[#12233A] text-muted dark:text-[#8FA4BA] border border-blue-pale/40 dark:border-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-medium select-none"
        title="Skor prioritas belum tersedia di backend (BACKEND GAP)"
      >
        <AlertTriangle
          className="w-3.5 h-3.5 text-muted/70 dark:text-[#8FA4BA]"
          aria-hidden="true"
        />
        <span>Prioritas: —</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 bg-navy-primary dark:bg-[#5483B3] text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold shadow-xs select-none"
      title={`Skor Prioritas: ${score.toFixed(1)}`}
    >
      <AlertTriangle
        className="w-3.5 h-3.5 text-amber-300"
        aria-hidden="true"
      />
      <span>Prioritas {score.toFixed(1)}</span>
    </span>
  );
}

export function ReportDetailHeader({
  reportId,
  villageName,
  status,
  severity,
  priorityScore,
  backPath = "/pemdes/laporan",
  subtitle,
  roadAuthority,
}: ReportDetailHeaderProps): React.JSX.Element {
  const displayVillage = villageName
    ? `Desa ${villageName.replace(/^Desa\s+/i, "")}`
    : "Jalan Desa";

  return (
    <div className="flex flex-col gap-4">
      {/* First Row: Navigation + ID + Wilayah + Authority (Left) & Status + Severity + Priority (Right) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left: Back button, ID badge, Wilayah chip, and Authority badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/40 dark:border-[rgba(193,232,255,0.12)] hover:border-blue-pale/70 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors select-none group"
            title="Kembali ke Daftar Laporan"
          >
            <ArrowLeft
              className="w-4 h-4 text-navy-primary dark:text-blue-pale group-hover:-translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
            <span>Kembali ke Laporan</span>
          </Link>

          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold bg-blue-pale/25 dark:bg-[#5483B3]/20 text-navy-primary dark:text-blue-pale border border-blue-pale/40 dark:border-[#5483B3]/40 select-none">
            #{reportId}
          </span>

          <div
            className="inline-flex items-center gap-1.5 bg-blue-pale/50 dark:bg-[#5483B3]/25 text-navy-deepest font-semibold text-[12px] px-3.5 py-1.5 rounded-full border border-blue-supporting/30 dark:border-[#5483B3]/40 shadow-xs select-none"
            title="Wilayah Administrasi Laporan"
          >
            <MapPin
              className="w-3.5 h-3.5 text-navy-primary dark:text-blue-pale shrink-0"
              aria-hidden="true"
            />
            <span>{displayVillage}</span>
          </div>

          {roadAuthority && <AuthorityPill authority={roadAuthority} />}
        </div>

        {/* Right: Status, Severity, and Priority Indicators */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <StatusPill status={status} />
          <SeverityPill severity={severity} />
          <PriorityPill score={priorityScore} />
        </div>
      </div>

      {/* Second Row: Page Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-navy-deepest tracking-tight">
          Detail Laporan Kerusakan Jalan
        </h1>
        <p className="text-[14px] text-muted dark:text-[#AFC0D4]">
          {subtitle ||
            "Data pengamatan citra AI, koordinat spasial, verifikasi pelapor, dan kontrol penanganan Pemdes."}
        </p>
      </div>
    </div>
  );
}

export default ReportDetailHeader;

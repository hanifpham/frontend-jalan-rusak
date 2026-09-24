import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle } from 'lucide-react';
import { type ReportStatus, type Severity } from '@/types/domain';
import { cn } from '@/lib/utils';

export interface ReportDetailHeaderProps {
  reportId: number | string;
  villageName?: string;
  status: ReportStatus;
  severity?: Severity;
  priorityScore?: number;
}

/**
 * Status badge pill matching exact Stitch design tokens.
 */
function StatusPill({ status }: { status: ReportStatus }): React.JSX.Element {
  switch (status.toLowerCase()) {
    case 'selesai':
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-status-selesai border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Selesai"
        >
          <span className="w-2 h-2 rounded-full bg-status-selesai" aria-hidden="true" />
          <span>Selesai</span>
        </span>
      );
    case 'proses':
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-blue-medium/15 text-status-proses border border-blue-medium/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Proses"
        >
          <span className="w-2 h-2 rounded-full bg-status-proses" aria-hidden="true" />
          <span>Proses</span>
        </span>
      );
    case 'menunggu':
    default:
      return (
        <span
          className="inline-flex items-center gap-1.5 bg-status-menunggu/15 text-[#B45309] border border-status-menunggu/30 px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none"
          title="Status: Menunggu"
        >
          <span className="w-2 h-2 rounded-full bg-status-menunggu" aria-hidden="true" />
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
function SeverityPill({ severity }: { severity?: Severity }): React.JSX.Element {
  if (!severity) {
    return (
      <span
        className="inline-flex items-center gap-1.5 bg-canvas text-muted border border-blue-pale/40 px-3.5 py-1.5 rounded-full text-[12px] font-medium select-none"
        title="Tingkat keparahan belum tersedia dari backend (BACKEND GAP)"
      >
        <span>Keparahan: —</span>
      </span>
    );
  }

  const colorMap: Record<Severity, { bg: string; text: string; border: string; dot: string; label: string }> = {
    berat: {
      bg: 'bg-severity-berat/10',
      text: 'text-severity-berat',
      border: 'border-severity-berat/25',
      dot: 'bg-severity-berat',
      label: 'Berat',
    },
    sedang: {
      bg: 'bg-severity-sedang/15',
      text: 'text-[#B45309]',
      border: 'border-severity-sedang/30',
      dot: 'bg-severity-sedang',
      label: 'Sedang',
    },
    ringan: {
      bg: 'bg-severity-ringan/15',
      text: 'text-[#2E9E5B]',
      border: 'border-severity-ringan/30',
      dot: 'bg-severity-ringan',
      label: 'Ringan',
    },
  };

  const config = colorMap[severity] || colorMap.sedang;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-3.5 py-1.5 rounded-full text-[12px] font-bold select-none',
        config.bg,
        config.text,
        config.border
      )}
      title={`Tingkat Keparahan: ${config.label}`}
    >
      <span className={cn('w-2 h-2 rounded-full', config.dot)} aria-hidden="true" />
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
        className="inline-flex items-center gap-1.5 bg-canvas text-muted border border-blue-pale/40 px-3.5 py-1.5 rounded-full text-[12px] font-medium select-none"
        title="Skor prioritas belum tersedia di backend (BACKEND GAP)"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-muted/70" aria-hidden="true" />
        <span>Prioritas: —</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 bg-navy-primary text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold shadow-xs select-none"
      title={`Skor Prioritas: ${score.toFixed(1)}`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
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
}: ReportDetailHeaderProps): React.JSX.Element {
  const displayVillage = villageName ? `Desa ${villageName.replace(/^Desa\s+/i, '')}` : 'Jalan Desa';

  return (
    <div className="flex flex-col gap-4">
      {/* First Row: Navigation + ID + Wilayah (Left) & Status + Severity + Priority (Right) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left: Back button, ID badge, and Wilayah chip */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/pemdes/laporan"
            className="inline-flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/40 hover:border-blue-pale/70 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors select-none group"
            title="Kembali ke Daftar Laporan"
          >
            <ArrowLeft className="w-4 h-4 text-navy-primary group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            <span>Kembali ke Laporan</span>
          </Link>

          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold bg-blue-pale/25 text-navy-primary border border-blue-pale/40 select-none">
            #{reportId}
          </span>

          <div
            className="inline-flex items-center gap-1.5 bg-blue-pale/50 text-navy-deepest font-semibold text-[12px] px-3.5 py-1.5 rounded-full border border-blue-supporting/30 shadow-xs select-none"
            title="Wilayah Administrasi Laporan"
          >
            <MapPin className="w-3.5 h-3.5 text-navy-primary shrink-0" aria-hidden="true" />
            <span>{displayVillage}</span>
          </div>
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
        <p className="text-[14px] text-muted">
          Data pengamatan citra AI, koordinat spasial, verifikasi pelapor, dan kontrol penanganan Pemdes.
        </p>
      </div>
    </div>
  );
}

export default ReportDetailHeader;

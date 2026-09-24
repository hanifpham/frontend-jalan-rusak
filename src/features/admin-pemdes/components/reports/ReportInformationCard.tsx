import React from 'react';
import { FileText } from 'lucide-react';
import { type Report } from '@/types/domain';

export interface ReportInformationCardProps {
  report: Report;
}

/**
 * Format ISO datetime into Indonesian locale: e.g. "24 Jun 2026 • 14:20 WIB"
 */
function formatIndoDateTime(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    const dateFormatted = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${dateFormatted} • ${hours}:${minutes} WIB`;
  } catch {
    return '—';
  }
}

/**
 * Renders status pill according to design tokens
 */
function StatusPill({ status }: { status: string }): React.JSX.Element {
  switch (status.toLowerCase()) {
    case 'selesai':
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-status-selesai border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-status-selesai" />
          Selesai
        </span>
      );
    case 'proses':
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-medium/15 text-status-proses border border-blue-medium/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-status-proses" />
          Proses
        </span>
      );
    case 'menunggu':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 bg-status-menunggu/15 text-[#B45309] border border-status-menunggu/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-status-menunggu" />
          Menunggu
        </span>
      );
  }
}

export function ReportInformationCard({
  report,
}: ReportInformationCardProps): React.JSX.Element {
  const displayVillage = report.villageName
    ? `Desa ${report.villageName.replace(/^Desa\s+/i, '')}`
    : 'Desa Sukamaju';

  return (
    <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-6 flex flex-col gap-4">
      {/* Header: FileText Icon + Title & Created At Timestamp */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-navy-primary" aria-hidden="true" />
          <h2 className="text-[17px] font-bold text-navy-deepest">
            Informasi Laporan
          </h2>
        </div>

        <span className="text-[11px] text-muted font-medium">
          Dibuat: {formatIndoDateTime(report.createdAt)}
        </span>
      </div>

      {/* Report Title & Citizen Description Bubble */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-navy-deepest leading-snug">
          {report.title}
        </h3>

        {report.description ? (
          <p className="text-[13px] text-muted leading-relaxed bg-canvas/70 p-3.5 rounded-xl border border-blue-pale/30 italic">
            &ldquo;{report.description}&rdquo;
          </p>
        ) : (
          <p className="text-[12px] text-muted/80 bg-canvas/50 p-3 rounded-xl border border-blue-pale/20 italic">
            Tidak ada deskripsi tambahan dari pelapor.
          </p>
        )}
      </div>

      {/* Metadata Detail List */}
      <div className="grid grid-cols-1 divide-y divide-gray-100 text-[13px] pt-1">
        {/* ID Laporan */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">ID Laporan</span>
          <span className="font-mono font-bold text-navy-primary bg-canvas px-2.5 py-0.5 rounded-full text-[12px] border border-blue-pale/40">
            #{report.id}
          </span>
        </div>

        {/* Pelapor */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Pelapor</span>
          <span className="font-semibold text-navy-deepest truncate max-w-50 text-right">
            {report.reporterName || '—'}
          </span>
        </div>

        {/* Lokasi */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Lokasi</span>
          <span className="font-semibold text-navy-deepest truncate max-w-55 text-right">
            {report.roadName || displayVillage}
          </span>
        </div>

        {/* Desa / Kecamatan */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Desa / Kecamatan</span>
          <span className="font-semibold text-navy-deepest text-right">
            {displayVillage}
          </span>
        </div>

        {/* Kewenangan */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Kewenangan</span>
          <span className="font-semibold text-navy-deepest">
            {report.roadAuthority === 'desa' ? 'Jalan Desa' : report.roadAuthority || 'Jalan Desa'}
          </span>
        </div>

        {/* Jenis Kerusakan */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Jenis Kerusakan</span>
          <span className="font-semibold text-navy-deepest truncate max-w-50 text-right">
            {report.damageType || '—'}
          </span>
        </div>


        {/* Tingkat Keparahan (Rule 9: Backend Gap) */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Tingkat Keparahan</span>
          <span
            className="text-muted font-medium text-xs"
            title="Tingkat keparahan belum dianalisis di backend"
          >
            —
          </span>
        </div>

        {/* Status */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Status</span>
          <StatusPill status={report.status} />
        </div>

        {/* Tanggal & Waktu */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Tanggal & Waktu</span>
          <span className="font-medium text-navy-deepest text-[12px]">
            {formatIndoDateTime(report.createdAt)}
          </span>
        </div>

        {/* Skor Prioritas (Rule 10: Backend Gap) */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted font-medium">Skor Prioritas</span>
          <span
            className="text-muted font-medium text-xs"
            title="Skor prioritas belum tersedia di backend"
          >
            —
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReportInformationCard;

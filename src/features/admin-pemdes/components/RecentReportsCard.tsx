import React from 'react';
import { ArrowRight, Navigation, Image as ImageIcon } from 'lucide-react';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { type Report } from '@/types/domain';

export interface RecentReportsCardProps {
  reports?: Report[] | null;
  isLoading?: boolean;
  error?: string | null;
  villageName?: string;
  onViewAll?: () => void;
  onDetailClick?: (reportId: number) => void;
}

export function RecentReportsCard({
  reports = null,
  isLoading = false,
  error = null,
  villageName = 'Sukamaju',
  onViewAll,
  onDetailClick,
}: RecentReportsCardProps): React.JSX.Element {
  const hasReports = reports !== null && reports.length > 0;

  return (
    <div className="bg-white rounded-card p-6 shadow-[0_4px_20px_rgba(0,18,52,0.04)] border border-slate-100">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-navy-deepest">Laporan Terbaru</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar kerusakan jalan desa yang baru dilaporkan warga Desa {villageName}
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-canvas hover:bg-slate-100 text-navy-primary text-xs font-bold transition-all border border-slate-200/70 self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
        >
          <span>Lihat Semua Laporan</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Table Container matching Stitch structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Tabel Laporan Terbaru">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              <th scope="col" className="py-3 px-4">Laporan</th>
              <th scope="col" className="py-3 px-4">Tingkat</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4">Tanggal</th>
              <th scope="col" className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-slate-200 rounded w-48" />
                        <div className="h-2.5 bg-slate-100 rounded w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-3.5 w-20 bg-slate-200 rounded" /></td>
                  <td className="py-3.5 px-4 text-right"><div className="h-7 w-16 bg-slate-200 rounded-full ml-auto" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-xs text-severity-berat">
                  {error}
                </td>
              </tr>
            ) : hasReports ? (
              reports.map((report) => {
                const dateDisplay = report.createdAt
                  ? new Date(report.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—';

                return (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Column 1: Photo & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {report.imageUrl ? (
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full bg-blue-pale text-navy-primary flex items-center justify-center shrink-0 ring-1 ring-slate-200"
                            aria-hidden="true"
                          >
                            <ImageIcon className="w-4 h-4 text-navy-primary" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div
                            onClick={() => onDetailClick?.(report.id)}
                            className="font-bold text-navy-deepest hover:text-navy-primary transition-colors cursor-pointer truncate max-w-xs sm:max-w-md"
                          >
                            {report.title}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <Navigation className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                            <span>
                              {report.roadName || `Desa ${villageName}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Tingkat (Severity) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SeverityBadge severity={report.severity || 'sedang'} />
                    </td>

                    {/* Column 3: Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* Column 4: Tanggal */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {dateDisplay}
                    </td>

                    {/* Column 5: Action Button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onDetailClick?.(report.id)}
                        className="px-4 py-1.5 rounded-full bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                  Belum ada laporan kerusakan jalan yang masuk untuk wilayah ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

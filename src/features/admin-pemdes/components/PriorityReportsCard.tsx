import React from 'react';
import { AlertTriangle, ArrowRight, CheckSquare } from 'lucide-react';
import { type Report } from '@/types/domain';

export interface PriorityReportsCardProps {
  reports?: Report[] | null;
  onViewAll?: () => void;
  onFollowUp?: () => void;
}

export function PriorityReportsCard({
  reports = null,
  onViewAll,
  onFollowUp,
}: PriorityReportsCardProps): React.JSX.Element {
  // Filter urgent reports (menunggu or berat) from actual data
  const urgentReports = reports
    ? reports
        .filter((r) => r.status === 'menunggu' || r.severity === 'berat')
        .slice(0, 3)
    : [];

  const hasUrgent = urgentReports.length > 0;

  return (
    <div className="bg-white rounded-card p-6 shadow-[0_4px_20px_rgba(0,18,52,0.04)] border border-slate-100 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-navy-deepest">Perlu Tindakan</h2>
            <span className="w-2 h-2 rounded-full bg-severity-berat animate-pulse" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-500">Laporan yang perlu segera diperhatikan.</p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-navy-primary hover:underline flex items-center gap-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-medium rounded"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* 3 Urgent Items List */}
      <div className="flex flex-col gap-3 my-1">
        {hasUrgent ? (
          urgentReports.map((item) => {
            const isHeavy = item.severity === 'berat';
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-pale transition-all flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isHeavy
                        ? 'bg-red-100 text-severity-berat'
                        : 'bg-amber-100 text-severity-sedang'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-navy-deepest truncate group-hover:text-navy-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold border ${
                          isHeavy
                            ? 'bg-red-50 text-severity-berat border-red-200/50'
                            : 'bg-amber-50 text-severity-sedang border-amber-200/50'
                        }`}
                      >
                        {isHeavy ? 'Berat' : 'Sedang'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          item.status === 'menunggu'
                            ? 'bg-amber-50 text-status-menunggu'
                            : 'bg-blue-50 text-status-proses'
                        }`}
                      >
                        {item.status === 'menunggu' ? 'Menunggu' : 'Proses'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-extrabold text-severity-berat bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                    Prioritas
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center py-7">
            <p className="text-xs font-semibold text-navy-deepest">
              Tidak ada laporan darurat saat ini
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Semua laporan kerusakan jalan berada dalam status aman atau telah ditangani.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onFollowUp}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-navy-primary hover:bg-navy-deepest text-white text-xs font-bold transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
        >
          <CheckSquare className="w-4 h-4" aria-hidden="true" />
          <span>Tindak Lanjuti Laporan Prioritas</span>
        </button>
      </div>
    </div>
  );
}

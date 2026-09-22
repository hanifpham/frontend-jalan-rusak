import React, { useState } from 'react';
import { type Report } from '@/types/domain';

export interface ReportTrendCardProps {
  reports?: Report[] | null;
  villageName?: string;
}

interface MonthStat {
  name: string;
  count: number;
  heightPx: number;
  isPeak: boolean;
  isCurrent: boolean;
}

export function ReportTrendCard({
  reports = null,
  villageName = 'Sukamaju',
}: ReportTrendCardProps): React.JSX.Element {
  const [periodType, setPeriodType] = useState<'minggu' | 'bulan'>('bulan');

  // Generate 6-month timeline (Jan - Jun or trailing 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];

  // Aggregate actual reports by month if available
  const monthCounts = monthNames.map((_name, index) => {
    if (!reports || reports.length === 0) {
      return 0;
    }
    return reports.filter((r) => {
      const date = new Date(r.createdAt);
      return date.getMonth() === index;
    }).length;
  });

  const maxCount = Math.max(...monthCounts, 1);
  const maxIdx = monthCounts.indexOf(Math.max(...monthCounts));

  const monthStats: MonthStat[] = monthNames.map((name, index) => {
    const count = monthCounts[index] ?? 0;
    // Map 0 to a clean minimal baseline height (16px) or proportional height up to 130px
    const heightPx = count > 0 ? Math.round((count / maxCount) * 110) + 20 : 16;
    return {
      name,
      count,
      heightPx,
      isPeak: count > 0 && index === maxIdx,
      isCurrent: index === 5,
    };
  });

  return (
    <div className="bg-white rounded-card p-6 shadow-[0_4px_20px_rgba(0,18,52,0.04)] border border-slate-100 flex flex-col justify-between">
      {/* Header: Title & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-navy-deepest">Tren Laporan</h2>
          <p className="text-xs text-slate-500">
            Statistik laporan kerusakan jalan per {periodType} di Desa {villageName}
          </p>
        </div>

        {/* Toggle: Minggu / Bulan */}
        <div className="flex items-center bg-canvas p-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriodType('minggu')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              periodType === 'minggu'
                ? 'bg-navy-primary text-white shadow-xs'
                : 'text-slate-500 hover:text-navy-deepest'
            }`}
          >
            Minggu
          </button>
          <button
            type="button"
            onClick={() => setPeriodType('bulan')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              periodType === 'bulan'
                ? 'bg-navy-primary text-white shadow-xs'
                : 'text-slate-500 hover:text-navy-deepest'
            }`}
          >
            Bulan
          </button>
        </div>
      </div>

      {/* Chart Visual Container with Dashed Horizontal Guide Lines */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="relative h-56 flex items-end justify-between px-4 pb-6">
          {/* Background Horizontal Grid Lines */}
          <div className="absolute inset-x-4 top-0 border-b border-dashed border-slate-100" />
          <div className="absolute inset-x-4 top-1/4 border-b border-dashed border-slate-100" />
          <div className="absolute inset-x-4 top-2/4 border-b border-dashed border-slate-100" />
          <div className="absolute inset-x-4 top-3/4 border-b border-dashed border-slate-100" />

          {/* 6 Month Bars matching Stitch layout */}
          {monthStats.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 z-10 w-12 relative group">
              {item.isPeak && item.count > 0 && (
                <div className="absolute -top-7 px-2 py-0.5 bg-navy-primary text-white text-[10px] font-bold rounded-full shadow-sm whitespace-nowrap animate-in fade-in">
                  Tertinggi
                </div>
              )}

              <span
                className={`text-[11px] transition-colors ${
                  item.isPeak
                    ? 'text-navy-primary font-bold'
                    : 'text-slate-400 group-hover:text-navy-primary font-medium'
                }`}
              >
                {item.count}
              </span>

              <div
                className={`w-8 rounded-t-xl transition-all duration-300 ${
                  item.isPeak
                    ? 'bg-navy-primary shadow-md'
                    : item.isCurrent
                    ? 'bg-blue-medium hover:bg-navy-primary'
                    : 'bg-blue-pale hover:bg-blue-medium'
                }`}
                style={{ height: `${item.heightPx}px` }}
              />

              <span
                className={`text-xs font-semibold ${
                  item.isPeak || item.isCurrent ? 'text-navy-deepest font-bold' : 'text-slate-500'
                }`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

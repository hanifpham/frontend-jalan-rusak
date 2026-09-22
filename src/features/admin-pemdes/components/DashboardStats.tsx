import React from 'react';
import { BarChart3, Hourglass, HardHat, CheckCircle2, TrendingUp } from 'lucide-react';

export interface DashboardStatsData {
  total_laporan: number;
  total_menunggu: number;
  total_proses: number;
  total_selesai: number;
  total_ditolak?: number;
}

export interface DashboardStatsProps {
  stats?: DashboardStatsData | null;
  isLoading?: boolean;
}

export function DashboardStats({
  stats,
  isLoading = false,
}: DashboardStatsProps): React.JSX.Element {
  const total = stats?.total_laporan ?? 0;
  const menunggu = stats?.total_menunggu ?? 0;
  const proses = stats?.total_proses ?? 0;
  const selesai = stats?.total_selesai ?? 0;

  const prosesPct = total > 0 ? Math.round((proses / total) * 100) : 0;
  const selesaiPct = total > 0 ? Math.round((selesai / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Laporan (Hero Navy Card) */}
      <div className="bg-navy-primary rounded-card p-6 text-white shadow-[0_8px_24px_rgba(5,38,89,0.18)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">
            Total Laporan
          </span>
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-4xl font-extrabold tracking-tight">
            {isLoading ? (
              <span className="inline-block w-16 h-10 bg-white/10 rounded animate-pulse" />
            ) : (
              total
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-pale font-semibold">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
          <span>Laporan terdaftar</span>
        </div>
      </div>

      {/* 2. Menunggu Verifikasi */}
      <div className="bg-white rounded-card p-6 shadow-[0_4px_20px_rgba(0,18,52,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Menunggu Verifikasi
          </span>
          <span className="w-8 h-8 rounded-full bg-amber-50 text-status-menunggu flex items-center justify-center">
            <Hourglass className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-4xl font-extrabold text-navy-deepest tracking-tight">
            {isLoading ? (
              <span className="inline-block w-14 h-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              menunggu
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-severity-berat">
            <span className="w-1.5 h-1.5 rounded-full bg-severity-berat" />
            {menunggu > 0 ? `${menunggu} laporan menunggu` : 'Tidak ada antrean'}
          </span>
        </div>
      </div>

      {/* 3. Sedang Ditangani */}
      <div className="bg-white rounded-card p-6 shadow-[0_4px_20px_rgba(0,18,52,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Sedang Ditangani
          </span>
          <span className="w-8 h-8 rounded-full bg-blue-50 text-status-proses flex items-center justify-center">
            <HardHat className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-4xl font-extrabold text-navy-deepest tracking-tight">
            {isLoading ? (
              <span className="inline-block w-14 h-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              proses
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-status-proses">
            {prosesPct}% dari total
          </span>
          <span>sedang aktif</span>
        </div>
      </div>

      {/* 4. Selesai */}
      <div className="bg-white rounded-card p-6 shadow-[0_4px_20px_rgba(0,18,52,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Selesai
          </span>
          <span className="w-8 h-8 rounded-full bg-emerald-50 text-status-selesai flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-4xl font-extrabold text-navy-deepest tracking-tight">
            {isLoading ? (
              <span className="inline-block w-14 h-10 bg-slate-100 rounded animate-pulse" />
            ) : (
              selesai
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-status-selesai">
            {selesaiPct}% dari total
          </span>
          <span>tertangani baik</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { WilayahChip } from './WilayahChip';

export interface DashboardHeaderProps {
  userName?: string;
  villageName?: string;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export function DashboardHeader({
  userName = 'Admin Pemdes',
  villageName = 'Sukamaju',
  selectedPeriod = 'Bulan Ini',
  onPeriodChange,
}: DashboardHeaderProps): React.JSX.Element {
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const periods = ['Bulan Ini', 'Bulan Lalu', 'Tahun Ini'];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Greeting & Village Scope */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-deepest tracking-tight">
          Selamat datang kembali, {userName}
        </h1>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <p className="text-sm text-muted font-normal">
            Pantau laporan kerusakan jalan di wilayah Desa {villageName}.
          </p>
          <WilayahChip villageName={villageName} />
        </div>
      </div>

      {/* Right: Period Filter Dropdown */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setPeriodDropdownOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
          aria-haspopup="true"
          aria-expanded={periodDropdownOpen}
        >
          <Calendar className="w-4 h-4 text-blue-medium" aria-hidden="true" />
          <span>{selectedPeriod}</span>
          <ChevronDown className="w-4 h-4 text-muted transition-transform" aria-hidden="true" />
        </button>

        {periodDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-lg border border-slate-100 py-1.5 z-20"
            role="menu"
            aria-orientation="vertical"
          >
            {periods.map((period) => (
              <button
                key={period}
                type="button"
                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-pale/40 text-navy-primary'
                    : 'text-navy-deepest hover:bg-slate-50'
                }`}
                role="menuitem"
                onClick={() => {
                  onPeriodChange?.(period);
                  setPeriodDropdownOpen(false);
                }}
              >
                {period}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

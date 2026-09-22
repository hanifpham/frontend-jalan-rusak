import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  ArrowUpDown,
  RotateCcw,
  Download,
  ChevronDown,
  Check,
} from 'lucide-react';
import { ReportExportModal } from './ReportExportModal';
import { cn } from '@/lib/utils';

export type StatusFilterValue = 'all' | 'menunggu' | 'proses' | 'selesai';
export type SeverityFilterValue = 'all' | 'ringan' | 'sedang' | 'berat';
export type DateFilterValue = 'all' | 'today' | 'this_week' | 'this_month';
export type SortFilterValue = 'newest' | 'oldest';

export interface ReportFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilterValue;
  onStatusChange: (status: StatusFilterValue) => void;
  severity: SeverityFilterValue;
  onSeverityChange: (severity: SeverityFilterValue) => void;
  dateFilter: DateFilterValue;
  onDateFilterChange: (dateFilter: DateFilterValue) => void;
  sortBy: SortFilterValue;
  onSortByChange: (sortBy: SortFilterValue) => void;
  onReset: () => void;
}

export function ReportFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  severity,
  onSeverityChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  onReset,
}: ReportFiltersProps): React.JSX.Element {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenDropdown(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const statusLabels: Record<StatusFilterValue, string> = {
    all: 'Semua',
    menunggu: 'Menunggu',
    proses: 'Proses',
    selesai: 'Selesai',
  };

  const severityLabels: Record<SeverityFilterValue, string> = {
    all: 'Semua',
    ringan: 'Ringan',
    sedang: 'Sedang',
    berat: 'Berat',
  };

  const dateLabels: Record<DateFilterValue, string> = {
    all: 'Semua',
    today: 'Hari Ini',
    this_week: 'Minggu Ini',
    this_month: 'Bulan Ini',
  };

  const sortLabels: Record<SortFilterValue, string> = {
    newest: 'Terbaru',
    oldest: 'Terlama',
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3 w-full">
      {/* Row 1: Search & Filter Dropdowns */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan judul laporan..."
            className="w-full bg-white border border-blue-pale/50 rounded-full pl-10 pr-4 py-2.5 text-[13px] text-navy-deepest placeholder:text-muted/70 focus:outline-none focus:border-navy-primary focus:ring-1 focus:ring-navy-primary shadow-xs transition-all duration-200"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end shrink-0">
          {/* 1. Filter: Status */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('status')}
              className={cn(
                'flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-3.5 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer select-none',
                openDropdown === 'status' && 'ring-2 ring-blue-medium/30 border-blue-medium'
              )}
              aria-expanded={openDropdown === 'status'}
              aria-haspopup="true"
            >
              <Filter className="w-4 h-4 text-blue-medium shrink-0" aria-hidden="true" />
              <span>
                Status: <b className="font-semibold text-navy-deepest">{statusLabels[status]}</b>
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted transition-transform duration-200',
                  openDropdown === 'status' && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'status' && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-44 bg-white rounded-2xl shadow-xl border border-blue-pale/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(['all', 'menunggu', 'proses', 'selesai'] as StatusFilterValue[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onStatusChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 text-xs text-left hover:bg-canvas transition-colors cursor-pointer',
                      status === val ? 'font-bold text-navy-primary bg-blue-pale/20' : 'text-navy-deepest'
                    )}
                  >
                    <span>{statusLabels[val]}</span>
                    {status === val && <Check className="w-3.5 h-3.5 text-navy-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Filter: Keparahan */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('severity')}
              className={cn(
                'flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-3.5 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer select-none',
                openDropdown === 'severity' && 'ring-2 ring-blue-medium/30 border-blue-medium'
              )}
              aria-expanded={openDropdown === 'severity'}
              aria-haspopup="true"
            >
              <AlertTriangle className="w-4 h-4 text-blue-medium shrink-0" aria-hidden="true" />
              <span>
                Keparahan: <b className="font-semibold text-navy-deepest">{severityLabels[severity]}</b>
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted transition-transform duration-200',
                  openDropdown === 'severity' && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'severity' && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-52 bg-white rounded-2xl shadow-xl border border-blue-pale/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] text-amber-700 bg-amber-50 mx-2 rounded-lg border border-amber-200 mb-1">
                  Field keparahan belum ada di backend
                </div>
                {(['all', 'ringan', 'sedang', 'berat'] as SeverityFilterValue[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onSeverityChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 text-xs text-left hover:bg-canvas transition-colors cursor-pointer',
                      severity === val ? 'font-bold text-navy-primary bg-blue-pale/20' : 'text-navy-deepest'
                    )}
                  >
                    <span>{severityLabels[val]}</span>
                    {severity === val && <Check className="w-3.5 h-3.5 text-navy-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Filter: Tanggal */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('date')}
              className={cn(
                'flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-3.5 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer select-none',
                openDropdown === 'date' && 'ring-2 ring-blue-medium/30 border-blue-medium'
              )}
              aria-expanded={openDropdown === 'date'}
              aria-haspopup="true"
            >
              <Calendar className="w-4 h-4 text-blue-medium shrink-0" aria-hidden="true" />
              <span>
                Tanggal: <b className="font-semibold text-navy-deepest">{dateLabels[dateFilter]}</b>
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted transition-transform duration-200',
                  openDropdown === 'date' && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'date' && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-44 bg-white rounded-2xl shadow-xl border border-blue-pale/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(['all', 'today', 'this_week', 'this_month'] as DateFilterValue[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onDateFilterChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 text-xs text-left hover:bg-canvas transition-colors cursor-pointer',
                      dateFilter === val ? 'font-bold text-navy-primary bg-blue-pale/20' : 'text-navy-deepest'
                    )}
                  >
                    <span>{dateLabels[val]}</span>
                    {dateFilter === val && <Check className="w-3.5 h-3.5 text-navy-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Sort, Reset Filter, and Export */}
      <div className="flex items-center justify-between gap-3 w-full flex-wrap pt-0.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('sort')}
              className={cn(
                'flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-3.5 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer select-none',
                openDropdown === 'sort' && 'ring-2 ring-blue-medium/30 border-blue-medium'
              )}
              aria-expanded={openDropdown === 'sort'}
              aria-haspopup="true"
            >
              <ArrowUpDown className="w-4 h-4 text-blue-medium shrink-0" aria-hidden="true" />
              <span>
                Urutkan: <b className="font-semibold text-navy-deepest">{sortLabels[sortBy]}</b>
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted transition-transform duration-200',
                  openDropdown === 'sort' && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'sort' && (
              <div className="absolute left-0 top-[calc(100%+6px)] w-56 bg-white rounded-2xl shadow-xl border border-blue-pale/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(['newest', 'oldest'] as SortFilterValue[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onSortByChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 text-xs text-left hover:bg-canvas transition-colors cursor-pointer',
                      sortBy === val ? 'font-bold text-navy-primary bg-blue-pale/20' : 'text-navy-deepest'
                    )}
                  >
                    <span>{sortLabels[val]}</span>
                    {sortBy === val && <Check className="w-3.5 h-3.5 text-navy-primary" />}
                  </button>
                ))}
                <div
                  className="px-4 py-2 text-xs text-muted/50 flex items-center justify-between border-t border-gray-100 cursor-not-allowed select-none"
                  title="Priority score belum tersedia di backend"
                >
                  <span>Prioritas Tertinggi</span>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-muted">Belum ada</span>
                </div>
              </div>
            )}
          </div>

          {/* Reset Filter button */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 bg-white hover:bg-canvas text-muted hover:text-navy-deepest border border-blue-pale/50 px-3.5 py-2 rounded-full text-[13px] font-medium shadow-xs transition-colors cursor-pointer select-none"
            title="Reset semua pencarian dan filter"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Export Button with dropdown visual */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors cursor-pointer select-none"
            title="Export data laporan ke file PDF atau XLS"
          >
            <Download className="w-4 h-4 text-navy-primary" aria-hidden="true" />
            <span>Export</span>
            <span className="text-[10px] bg-canvas text-navy-primary px-1.5 py-0.5 rounded font-bold border border-blue-pale/40">
              PDF/XLS
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Export Modal Notice */}
      <ReportExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}

export default ReportFilters;

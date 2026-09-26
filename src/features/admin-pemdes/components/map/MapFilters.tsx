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
import { type ReportStatus } from '@/types/domain';
import { cn } from '@/lib/utils';

export type MapStatusFilter = 'all' | ReportStatus;
export type MapSortFilter = 'default' | 'title_asc' | 'title_desc' | 'status';

export interface MapFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: MapStatusFilter;
  onStatusChange: (status: MapStatusFilter) => void;
  sortBy: MapSortFilter;
  onSortByChange: (sortBy: MapSortFilter) => void;
  onReset: () => void;
}

export function MapFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  onReset,
}: MapFiltersProps): React.JSX.Element {
  const [openDropdown, setOpenDropdown] = useState<'status' | 'sort' | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click or escape
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

  const toggleDropdown = (name: 'status' | 'sort') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const statusLabels: Record<MapStatusFilter, string> = {
    all: 'Semua',
    menunggu: 'Menunggu',
    proses: 'Proses',
    selesai: 'Selesai',
  };

  const sortLabels: Record<MapSortFilter, string> = {
    default: 'Default',
    title_asc: 'Judul (A-Z)',
    title_desc: 'Judul (Z-A)',
    status: 'Status Laporan',
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3.5 w-full select-none">
      {/* Row 1: Search & Filter Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-70 relative flex items-center bg-white border border-blue-pale/50 rounded-full px-4 py-2 shadow-xs transition-all focus-within:border-navy-primary focus-within:ring-1 focus-within:ring-navy-primary">
          <Search className="w-4 h-4 text-muted mr-2 shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan judul laporan..."
            className="w-full bg-transparent border-0 p-0 text-[13px] text-navy-deepest placeholder:text-muted/70 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Status Filter (Client-side working filter) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('status')}
            className={cn(
              'inline-flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer',
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
            <div className="absolute left-0 mt-2 w-48 bg-white border border-blue-pale/50 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {(['all', 'menunggu', 'proses', 'selesai'] as MapStatusFilter[]).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onStatusChange(val);
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas transition-colors cursor-pointer',
                    status === val ? 'font-bold text-navy-primary bg-blue-pale/20' : 'text-navy-deepest'
                  )}
                >
                  <span>{statusLabels[val]}</span>
                  {status === val && <Check className="w-4 h-4 text-navy-primary" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Severity Filter: Disabled honestly per Rule 15 */}
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 bg-canvas/80 border border-blue-pale/40 px-4 py-2 rounded-full text-[13px] font-medium text-muted cursor-not-allowed shadow-xs opacity-75"
          title="Data tingkat keparahan belum tersedia dari backend"
        >
          <AlertTriangle className="w-4 h-4 text-muted/70 shrink-0" aria-hidden="true" />
          <span>
            Keparahan: <b className="font-semibold text-muted">Belum tersedia</b>
          </span>
        </button>

        {/* Date Filter: Disabled honestly per Rule 16 */}
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 bg-canvas/80 border border-blue-pale/40 px-4 py-2 rounded-full text-[13px] font-medium text-muted cursor-not-allowed shadow-xs opacity-75"
          title="Data tanggal laporan belum tersedia pada response endpoint peta"
        >
          <Calendar className="w-4 h-4 text-muted/70 shrink-0" aria-hidden="true" />
          <span>
            Tanggal: <b className="font-semibold text-muted">Belum tersedia</b>
          </span>
        </button>
      </div>

      {/* Row 2: Sort, Reset & Export */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sorting Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('sort')}
              className={cn(
                'inline-flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer',
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
              <div className="absolute left-0 mt-2 w-52 bg-white border border-blue-pale/50 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(['default', 'title_asc', 'title_desc', 'status'] as MapSortFilter[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onSortByChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas transition-colors cursor-pointer',
                      sortBy === val ? 'font-bold text-navy-primary bg-blue-pale/20' : 'text-navy-deepest'
                    )}
                  >
                    <span>{sortLabels[val]}</span>
                    {sortBy === val && <Check className="w-4 h-4 text-navy-primary" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filter Button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/50 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest shadow-xs transition-colors cursor-pointer active:scale-95"
            title="Reset semua filter pencarian dan status"
          >
            <RotateCcw className="w-4 h-4 text-navy-deepest shrink-0" aria-hidden="true" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Export Button: Disabled honestly per Rule 18 */}
        <div className="flex items-center">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 bg-canvas/80 border border-blue-pale/40 px-4 py-2 rounded-full text-[13px] font-medium text-muted cursor-not-allowed shadow-xs opacity-75"
            title="Fitur ekspor data peta belum didukung backend"
          >
            <Download className="w-4 h-4 text-muted/70 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-muted">Export</span>
            <span className="bg-gray-200 text-muted text-[10px] font-bold px-1.5 py-0.5 rounded">
              PDF/XLS
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapFilters;

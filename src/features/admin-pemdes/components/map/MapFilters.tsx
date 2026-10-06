import React, { useState, useRef, useEffect } from "react";
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
  Building2,
} from "lucide-react";
import { type ReportStatus } from "@/types/domain";
import { ReportExportModal } from "../reports/ReportExportModal";
import { cn } from "@/lib/utils";

export type MapStatusFilter = "all" | ReportStatus;
export type MapAuthorityFilter =
  | "all"
  | "desa"
  | "kabupaten"
  | "provinsi"
  | "nasional";
export type MapSeverityFilter = "all" | "ringan" | "sedang" | "berat";
export type MapDateFilter = "all" | "today" | "this_week" | "this_month";
export type MapSortFilter = "default" | "title_asc" | "title_desc" | "status";

export interface MapFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: MapStatusFilter;
  onStatusChange: (status: MapStatusFilter) => void;
  authority?: MapAuthorityFilter;
  onAuthorityChange?: (authority: MapAuthorityFilter) => void;
  allowedAuthorities?: MapAuthorityFilter[];
  severity: MapSeverityFilter;
  onSeverityChange: (severity: MapSeverityFilter) => void;
  dateFilter: MapDateFilter;
  onDateFilterChange: (dateFilter: MapDateFilter) => void;
  sortBy: MapSortFilter;
  onSortByChange: (sortBy: MapSortFilter) => void;
  onReset: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
}

export function MapFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  authority,
  onAuthorityChange,
  allowedAuthorities,
  severity,
  onSeverityChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  onReset,
  onExport,
  searchPlaceholder,
}: MapFiltersProps): React.JSX.Element {
  const [openDropdown, setOpenDropdown] = useState<
    "status" | "authority" | "severity" | "date" | "sort" | null
  >(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDropdown = (
    name: "status" | "authority" | "severity" | "date" | "sort",
  ) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const statusLabels: Record<MapStatusFilter, string> = {
    all: "Semua",
    menunggu: "Menunggu",
    proses: "Proses",
    selesai: "Selesai",
    ditolak: "Ditolak",
  };

  const authorityLabels: Record<MapAuthorityFilter, string> = {
    all: "Semua Kewenangan",
    desa: "Desa",
    kabupaten: "Kabupaten",
    provinsi: "Provinsi",
    nasional: "Nasional",
  };

  const severityLabels: Record<MapSeverityFilter, string> = {
    all: "Semua",
    ringan: "Ringan",
    sedang: "Sedang",
    berat: "Berat",
  };

  const dateLabels: Record<MapDateFilter, string> = {
    all: "Semua",
    today: "Hari Ini",
    this_week: "Minggu Ini",
    this_month: "Bulan Ini",
  };

  const sortLabels: Record<MapSortFilter, string> = {
    default: "Default",
    title_asc: "Judul (A-Z)",
    title_desc: "Judul (Z-A)",
    status: "Status Laporan",
  };

  const effectiveAuthorities: MapAuthorityFilter[] =
    allowedAuthorities && allowedAuthorities.length > 0
      ? allowedAuthorities
      : ["all", "desa", "kabupaten", "provinsi", "nasional"];

  const handleExportClick = () => {
    if (onExport) {
      onExport();
    } else {
      setExportModalOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3.5 w-full select-none"
    >
      {/* Row 1: Search & Filter Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-64 sm:min-w-72 relative flex items-center bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded-full px-4 py-2 shadow-xs transition-all focus-within:border-navy-primary focus-within:ring-1 focus-within:ring-navy-primary">
          <Search
            className="w-4 h-4 text-muted dark:text-[#8FA4BA] mr-2 shrink-0"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              searchPlaceholder ||
              "Cari berdasarkan judul, deskripsi, atau pelapor..."
            }
            className="w-full bg-transparent border-0 p-0 text-[13px] text-navy-deepest dark:text-white placeholder:text-muted/70 dark:placeholder:text-[#8FA4BA] focus:outline-none focus:ring-0"
          />
        </div>

        {/* 1. Status Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("status")}
            className={cn(
              "inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer",
              openDropdown === "status" &&
                "ring-2 ring-blue-medium/30 border-blue-medium",
            )}
            aria-expanded={openDropdown === "status"}
            aria-haspopup="true"
          >
            <Filter
              className="w-4 h-4 text-blue-medium shrink-0"
              aria-hidden="true"
            />
            <span>
              Status:{" "}
              <b className="font-semibold text-navy-deepest dark:text-blue-pale">
                {statusLabels[status]}
              </b>
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] transition-transform duration-200",
                openDropdown === "status" && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {openDropdown === "status" && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {(
                [
                  "all",
                  "menunggu",
                  "proses",
                  "selesai",
                  "ditolak",
                ] as MapStatusFilter[]
              ).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onStatusChange(val);
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer",
                    status === val
                      ? "font-bold text-navy-primary dark:text-blue-pale bg-blue-pale/20 dark:bg-[#5483B3]/20"
                      : "text-navy-deepest dark:text-[#AFC0D4]",
                  )}
                >
                  <span>{statusLabels[val]}</span>
                  {status === val && (
                    <Check
                      className="w-4 h-4 text-navy-primary dark:text-blue-pale"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Authority / Kewenangan Filter (Hanya tampil jika authority & onAuthorityChange diberikan) */}
        {authority !== undefined && onAuthorityChange !== undefined && (
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("authority")}
              className={cn(
                "inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer",
                openDropdown === "authority" &&
                  "ring-2 ring-blue-medium/30 border-blue-medium",
              )}
              aria-expanded={openDropdown === "authority"}
              aria-haspopup="true"
            >
              <Building2
                className="w-4 h-4 text-blue-medium shrink-0"
                aria-hidden="true"
              />
              <span>
                Kewenangan:{" "}
                <b className="font-semibold text-navy-deepest dark:text-blue-pale">
                  {authorityLabels[authority]}
                </b>
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] transition-transform duration-200",
                  openDropdown === "authority" && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "authority" && (
              <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {effectiveAuthorities.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onAuthorityChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer",
                      authority === val
                        ? "font-bold text-navy-primary dark:text-blue-pale bg-blue-pale/20 dark:bg-[#5483B3]/20"
                        : "text-navy-deepest dark:text-[#AFC0D4]",
                    )}
                  >
                    <span>{authorityLabels[val]}</span>
                    {authority === val && (
                      <Check
                        className="w-4 h-4 text-navy-primary dark:text-blue-pale"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Keparahan / Severity Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("severity")}
            className={cn(
              "inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer",
              openDropdown === "severity" &&
                "ring-2 ring-blue-medium/30 border-blue-medium",
            )}
            aria-expanded={openDropdown === "severity"}
            aria-haspopup="true"
          >
            <AlertTriangle
              className="w-4 h-4 text-blue-medium shrink-0"
              aria-hidden="true"
            />
            <span>
              Keparahan:{" "}
              <b className="font-semibold text-navy-deepest dark:text-blue-pale">
                {severityLabels[severity]}
              </b>
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] transition-transform duration-200",
                openDropdown === "severity" && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {openDropdown === "severity" && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {(
                ["all", "ringan", "sedang", "berat"] as MapSeverityFilter[]
              ).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onSeverityChange(val);
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer",
                    severity === val
                      ? "font-bold text-navy-primary dark:text-blue-pale bg-blue-pale/20 dark:bg-[#5483B3]/20"
                      : "text-navy-deepest dark:text-[#AFC0D4]",
                  )}
                >
                  <span>{severityLabels[val]}</span>
                  {severity === val && (
                    <Check
                      className="w-4 h-4 text-navy-primary dark:text-blue-pale"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Tanggal / Date Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown("date")}
            className={cn(
              "inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer",
              openDropdown === "date" &&
                "ring-2 ring-blue-medium/30 border-blue-medium",
            )}
            aria-expanded={openDropdown === "date"}
            aria-haspopup="true"
          >
            <Calendar
              className="w-4 h-4 text-blue-medium shrink-0"
              aria-hidden="true"
            />
            <span>
              Tanggal:{" "}
              <b className="font-semibold text-navy-deepest dark:text-blue-pale">
                {dateLabels[dateFilter]}
              </b>
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] transition-transform duration-200",
                openDropdown === "date" && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {openDropdown === "date" && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {(
                ["all", "today", "this_week", "this_month"] as MapDateFilter[]
              ).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onDateFilterChange(val);
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer",
                    dateFilter === val
                      ? "font-bold text-navy-primary dark:text-blue-pale bg-blue-pale/20 dark:bg-[#5483B3]/20"
                      : "text-navy-deepest dark:text-[#AFC0D4]",
                  )}
                >
                  <span>{dateLabels[val]}</span>
                  {dateFilter === val && (
                    <Check
                      className="w-4 h-4 text-navy-primary dark:text-blue-pale"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Sort, Reset & Export */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sorting Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("sort")}
              className={cn(
                "inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer",
                openDropdown === "sort" &&
                  "ring-2 ring-blue-medium/30 border-blue-medium",
              )}
              aria-expanded={openDropdown === "sort"}
              aria-haspopup="true"
            >
              <ArrowUpDown
                className="w-4 h-4 text-blue-medium shrink-0"
                aria-hidden="true"
              />
              <span>
                Urutkan:{" "}
                <b className="font-semibold text-navy-deepest dark:text-blue-pale">
                  {sortLabels[sortBy] || sortBy}
                </b>
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] transition-transform duration-200",
                  openDropdown === "sort" && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === "sort" && (
              <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(
                  [
                    "default",
                    "title_asc",
                    "title_desc",
                    "status",
                  ] as MapSortFilter[]
                ).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      onSortByChange(val);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[13px] flex items-center justify-between hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer",
                      sortBy === val
                        ? "font-bold text-navy-primary dark:text-blue-pale bg-blue-pale/20 dark:bg-[#5483B3]/20"
                        : "text-navy-deepest dark:text-[#AFC0D4]",
                    )}
                  >
                    <span>{sortLabels[val]}</span>
                    {sortBy === val && (
                      <Check
                        className="w-4 h-4 text-navy-primary dark:text-blue-pale"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filter Button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer active:scale-95"
            title="Reset semua filter pencarian, status, kewenangan, keparahan, dan tanggal"
          >
            <RotateCcw
              className="w-4 h-4 text-muted dark:text-[#8FA4BA] shrink-0"
              aria-hidden="true"
            />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Export Button (Matching design screenshot) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleExportClick}
            className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/50 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-medium text-navy-deepest dark:text-white shadow-xs transition-colors cursor-pointer active:scale-95"
            title="Ekspor dokumen laporan titik peta"
          >
            <Download
              className="w-4 h-4 text-blue-medium shrink-0"
              aria-hidden="true"
            />
            <span className="font-semibold text-navy-deepest dark:text-white">
              Export
            </span>
            <span className="bg-blue-pale/40 dark:bg-[#5483B3]/20 text-navy-primary dark:text-blue-pale text-[10px] font-bold px-1.5 py-0.5 rounded">
              PDF/XLS
            </span>
          </button>
        </div>
      </div>

      {/* Export Modal Dialog */}
      <ReportExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}

export default MapFilters;

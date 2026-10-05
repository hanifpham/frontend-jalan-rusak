import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  LayoutDashboard,
  FileText,
  MapPin,
  MessageSquare,
  Settings,
  ChevronRight,
  Loader2,
  AlertCircle,
  SearchX,
  CornerDownLeft,
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { getAuthorizedNavigation } from "@/lib/permissions";
import { useAdminLaporan } from "@/features/admin-pemdes/api/useAdminPemdesData";
import { type Report } from "@/types/domain";
import { StatusBadge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";

export interface GlobalQuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavResultItem {
  id: string;
  type: "nav";
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

interface ReportResultItem {
  id: string;
  type: "report";
  report: Report;
}

type SearchItem = NavResultItem | ReportResultItem;

/**
 * ReportSearchSection
 * Separate sub-component to ensure useAdminLaporan is ONLY executed
 * when debounced search query length is >= 2 characters.
 * Reuses existing TanStack Query caching and normalization.
 */
function ReportSearchSection({
  query,
  selectedIndex,
  navCount,
  onSelectReport,
  onReportsChange,
}: {
  query: string;
  selectedIndex: number;
  navCount: number;
  onSelectReport: (reportId: number) => void;
  onReportsChange: (reports: Report[], isLoading: boolean, isError: boolean) => void;
}): React.JSX.Element {
  const { data, isLoading, isError, refetch } = useAdminLaporan({
    search: query,
    limit: 5,
  });

  const reports = useMemo(() => data?.reports || [], [data?.reports]);

  useEffect(() => {
    onReportsChange(reports, isLoading, isError);
  }, [reports, isLoading, isError, onReportsChange]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#AFC0D4] select-none">
          Laporan
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 text-xs text-muted dark:text-[#AFC0D4] bg-[#EEF5FB]/60 dark:bg-white/5 rounded-2xl">
          <Loader2 className="w-4 h-4 animate-spin text-navy-primary dark:text-[#AFC0D4] shrink-0" aria-hidden="true" />
          <span>Mencari laporan...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#AFC0D4] select-none">
          Laporan
        </div>
        <div className="flex items-center justify-between px-4 py-3 text-xs text-severity-berat bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-2xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Gagal memuat hasil laporan.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-semibold underline hover:text-red-700 cursor-pointer focus-visible:outline-none"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-1">
      <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#AFC0D4] select-none">
        Laporan
      </div>
      {reports.map((report, idx) => {
        const itemIndex = navCount + idx;
        const isSelected = selectedIndex === itemIndex;
        const formattedDate = report.createdAt ? formatRelativeTime(report.createdAt) : "";

        return (
          <button
            key={report.id}
            type="button"
            onClick={() => onSelectReport(report.id)}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-colors cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium",
              isSelected
                ? "bg-navy-primary dark:bg-[#001234] text-white shadow-md"
                : "text-navy-deepest dark:text-[#AFC0D4] hover:bg-[#EEF5FB] dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white",
            )}
            role="option"
            aria-selected={isSelected}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-[#EEF5FB] dark:bg-white/10 text-navy-primary dark:text-[#AFC0D4] group-hover:bg-white/60 group-hover:text-navy-primary",
                )}
                aria-hidden="true"
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-semibold truncate leading-snug">
                    {report.title || `Laporan #${report.id}`}
                  </p>
                  <StatusBadge status={report.status} className="shrink-0 text-[10px] px-1.5 py-0.5" />
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-[11px] mt-0.5 truncate",
                  isSelected ? "text-white/70" : "text-muted dark:text-[#AFC0D4]"
                )}>
                  {report.damageType && (
                    <span className="truncate">{report.damageType}</span>
                  )}
                  {report.damageType && formattedDate && <span>•</span>}
                  {formattedDate && <span>{formattedDate}</span>}
                </div>
              </div>
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 shrink-0 transition-transform",
                isSelected
                  ? "text-white translate-x-0.5"
                  : "text-muted/50 dark:text-[#AFC0D4]/50 group-hover:text-navy-primary dark:group-hover:text-white",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export function GlobalQuickSearchModal({
  isOpen,
  onClose,
}: GlobalQuickSearchModalProps): React.JSX.Element | null {
  const { role } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loadedReports, setLoadedReports] = useState<Report[]>([]);
  const [isReportsLoading, setIsReportsLoading] = useState(false);
  const [isReportsError, setIsReportsError] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Debounce query by 300ms using native timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus search input on mount / open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Base authorized navigation matching role from permissions.ts
  const rawNavItems = useMemo(() => {
    const items = getAuthorizedNavigation(role);
    const settingsPath =
      role === "admin_pu"
        ? "/pu/pengaturan"
        : role === "admin_pemdes"
          ? "/pemdes/pengaturan"
          : "/settings";

    const mapped: NavResultItem[] = items.map((item) => {
      let IconComponent = LayoutDashboard;
      if (item.iconName === "ClipboardList") IconComponent = FileText;
      if (item.iconName === "MapPin") IconComponent = MapPin;
      if (item.iconName === "MessageSquare") IconComponent = MessageSquare;

      return {
        id: `nav-${item.label}`,
        type: "nav",
        label: item.label,
        path: item.path,
        icon: IconComponent,
      };
    });

    // Append Settings navigation item
    mapped.push({
      id: "nav-Pengaturan",
      type: "nav",
      label: "Pengaturan",
      path: settingsPath,
      icon: Settings,
    });

    return mapped;
  }, [role]);

  // Filter navigation items based on query
  const filteredNavItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return rawNavItems;
    }

    const matches = rawNavItems.filter((item) =>
      item.label.toLowerCase().includes(trimmed),
    );

    // Prefix matches prioritized
    matches.sort((a, b) => {
      const aPrefix = a.label.toLowerCase().startsWith(trimmed);
      const bPrefix = b.label.toLowerCase().startsWith(trimmed);
      if (aPrefix && !bPrefix) return -1;
      if (!aPrefix && bPrefix) return 1;
      return 0;
    });

    return matches;
  }, [rawNavItems, query]);

  // Has minimum query for backend report search (>= 2 characters)
  const hasMinQuery = debouncedQuery.trim().length >= 2;

  // Handle reports update from child sub-component
  const handleReportsChange = useCallback(
    (reports: Report[], loading: boolean, error: boolean) => {
      setLoadedReports(reports);
      setIsReportsLoading(loading);
      setIsReportsError(error);
    },
    [],
  );

  // When query drops below 2 characters, clear reports state
  useEffect(() => {
    if (!hasMinQuery) {
      setLoadedReports([]);
      setIsReportsLoading(false);
      setIsReportsError(false);
    }
  }, [hasMinQuery]);

  // Combined searchable item list for keyboard navigation
  const allItems: SearchItem[] = useMemo(() => {
    const list: SearchItem[] = [...filteredNavItems];
    if (hasMinQuery && loadedReports.length > 0) {
      loadedReports.forEach((r) => {
        list.push({
          id: `report-${r.id}`,
          type: "report",
          report: r,
        });
      });
    }
    return list;
  }, [filteredNavItems, hasMinQuery, loadedReports]);

  // Reset selectedIndex whenever item list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [allItems.length, query]);

  // Selection handler
  const handleSelectNav = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleSelectReport = (reportId: number) => {
    onClose();
    const targetPath =
      role === "admin_pu"
        ? `/pu/laporan/${reportId}`
        : `/pemdes/laporan/${reportId}`;
    navigate(targetPath);
  };

  const handleSelectItem = (item: SearchItem) => {
    if (item.type === "nav") {
      handleSelectNav(item.path);
    } else {
      handleSelectReport(item.report.id);
    }
  };

  // Keyboard navigation handler (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (allItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % allItems.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (allItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const targetItem = allItems[selectedIndex];
      if (targetItem) {
        handleSelectItem(targetItem);
      }
    }
  };

  if (!isOpen) return null;

  const isCompletelyEmpty =
    hasMinQuery &&
    !isReportsLoading &&
    !isReportsError &&
    filteredNavItems.length === 0 &&
    loadedReports.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-navy-deepest/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Cepat ROADIS"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-blue-pale/30 dark:border-white/10 bg-canvas/40 dark:bg-white/5">
          <Search className="w-5 h-5 text-muted dark:text-[#8FA4BA] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari di ROADIS..."
            className="w-full bg-transparent text-sm sm:text-base text-navy-deepest dark:text-white placeholder:text-muted/60 dark:placeholder:text-[#8FA4BA]/60 focus:outline-none"
            aria-label="Cari di ROADIS"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-muted hover:text-navy-deepest dark:hover:text-white hover:bg-canvas dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Hapus kata kunci"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-muted dark:text-[#8FA4BA] bg-white dark:bg-[#12233A] border border-blue-pale/60 dark:border-white/10 rounded-md shadow-xs select-none">
              ESC
            </kbd>
          )}
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden p-1 rounded-full text-muted hover:text-navy-deepest dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup pencarian"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1">
          {/* Section A: Navigasi */}
          {filteredNavItems.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#AFC0D4] select-none">
                Navigasi
              </div>
              {filteredNavItems.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectNav(item.path)}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all active:scale-[0.99] cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium",
                      isSelected
                        ? "bg-navy-primary dark:bg-[#001234] text-white shadow-md"
                        : "text-muted dark:text-[#AFC0D4] hover:bg-[#EEF5FB] dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white",
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#EEF5FB] dark:bg-white/10 text-navy-primary dark:text-[#AFC0D4] group-hover:bg-white/60 group-hover:text-navy-primary",
                        )}
                        aria-hidden="true"
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={cn(
                        "text-xs sm:text-sm font-semibold",
                        isSelected ? "text-white" : ""
                      )}>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isSelected
                          ? "text-white translate-x-0.5"
                          : "text-muted/40 dark:text-[#AFC0D4]/40 group-hover:text-navy-primary dark:group-hover:text-white",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Section B: Laporan (Rendered only when query >= 2 chars) */}
          {hasMinQuery && (
            <ReportSearchSection
              query={debouncedQuery.trim()}
              selectedIndex={selectedIndex}
              navCount={filteredNavItems.length}
              onSelectReport={handleSelectReport}
              onReportsChange={handleReportsChange}
            />
          )}

          {/* Empty State */}
          {isCompletelyEmpty && (
            <div className="py-10 px-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#EEF5FB] dark:bg-white/5 text-muted dark:text-[#AFC0D4] flex items-center justify-center mx-auto">
                <SearchX className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-navy-deepest dark:text-white">
                Data tidak ditemukan
              </p>
              <p className="text-xs text-muted dark:text-[#AFC0D4]">
                Coba gunakan kata kunci lain.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2.5 bg-[#EEF5FB]/60 dark:bg-white/5 border-t border-blue-pale/30 dark:border-white/10 hidden sm:flex items-center justify-between text-[11px] text-muted dark:text-[#AFC0D4] select-none">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded shadow-xs text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded shadow-xs text-[10px]">
                ↓
              </kbd>
              <span className="ml-0.5">pilih</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded shadow-xs text-[10px] flex items-center">
                <CornerDownLeft className="w-3 h-3" />
              </kbd>
              <span className="ml-0.5">buka</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 rounded shadow-xs text-[10px]">
                ESC
              </kbd>
              <span className="ml-0.5">tutup</span>
            </span>
          </div>
          <span className="text-[10px] text-muted/70 dark:text-[#AFC0D4]/70">ROADIS Quick Search</span>
        </div>
      </div>
    </div>
  );
}

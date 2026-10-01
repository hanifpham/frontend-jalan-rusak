import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  MoreVertical,
  RotateCw,
  Copy,
  X,
  Check,
} from "lucide-react";
import { getInitials, formatReportId } from "./ConversationItem";
import { type Report } from "@/types/domain";

export interface ChatHeaderProps {
  citizenName?: string;
  reportId: number;
  villageName?: string;
  profilePhoto?: string;
  reportDetail?: Report | null;
  fallbackTitle?: string;
  fallbackStatus?: string;
  fallbackJenisJalan?: string;
  onBackToList?: () => void;
  onRefreshConversation?: () => Promise<void> | void;
}

export function ChatHeader({
  citizenName,
  reportId,
  villageName,
  profilePhoto,
  reportDetail,
  fallbackTitle,
  fallbackStatus,
  fallbackJenisJalan,
  onBackToList,
  onRefreshConversation,
}: ChatHeaderProps): React.JSX.Element {
  const initials = getInitials(citizenName);
  const formattedId = formatReportId(reportId);

  // States for Info and More popups
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for outside click handling
  const infoRef = useRef<HTMLDivElement | null>(null);
  const infoBtnRef = useRef<HTMLButtonElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const moreBtnRef = useRef<HTMLButtonElement | null>(null);

  // Handle ESC and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsInfoOpen(false);
        setIsMoreOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isInfoOpen &&
        infoRef.current &&
        !infoRef.current.contains(target) &&
        !infoBtnRef.current?.contains(target)
      ) {
        setIsInfoOpen(false);
      }
      if (
        isMoreOpen &&
        moreRef.current &&
        !moreRef.current.contains(target) &&
        !moreBtnRef.current?.contains(target)
      ) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInfoOpen, isMoreOpen]);

  // Toggle Info (mutually exclusive with More)
  const toggleInfo = () => {
    setIsMoreOpen(false);
    setIsInfoOpen((prev) => !prev);
  };

  // Toggle More (mutually exclusive with Info)
  const toggleMore = () => {
    setIsInfoOpen(false);
    setIsMoreOpen((prev) => !prev);
  };

  // Action: Salin ID laporan
  const handleCopyReportId = async () => {
    try {
      await navigator.clipboard.writeText(formattedId);
      setCopyFeedback("ID laporan disalin");
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch {
      setCopyFeedback("Gagal menyalin");
      setTimeout(() => setCopyFeedback(null), 2000);
    }
    setIsMoreOpen(false);
  };

  // Action: Muat ulang percakapan
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsMoreOpen(false);
    try {
      if (onRefreshConversation) {
        await onRefreshConversation();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Normalized display values for genuine report metadata
  const currentTitle =
    reportDetail?.title || fallbackTitle || "Laporan Kerusakan Jalan";
  const currentStatus = (
    reportDetail?.status ||
    fallbackStatus ||
    "menunggu"
  ).toLowerCase();
  const currentJenisJalan = reportDetail?.roadAuthority
    ? `Jalan ${reportDetail.roadAuthority.charAt(0).toUpperCase() + reportDetail.roadAuthority.slice(1)}`
    : fallbackJenisJalan
      ? `Jalan ${fallbackJenisJalan.charAt(0).toUpperCase() + fallbackJenisJalan.slice(1)}`
      : "Jalan Desa";
  const currentWilayah =
    villageName ||
    reportDetail?.villageName ||
    (reportDetail?.roadName ? reportDetail.roadName : "Desa");
  const currentTipeKerusakan = reportDetail?.damageType;
  const currentTanggal = reportDetail?.createdAt
    ? new Date(reportDetail.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  let statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
  let statusBadgeLabel = "MENUNGGU";

  if (currentStatus === "proses") {
    statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-200";
    statusBadgeLabel = "PROSES";
  } else if (currentStatus === "selesai") {
    statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    statusBadgeLabel = "SELESAI";
  } else if (currentStatus === "ditolak") {
    statusBadgeClass = "bg-red-50 text-red-600 border-red-200";
    statusBadgeLabel = "DITOLAK";
  }

  return (
    <div className="relative pb-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
      {/* Left: Avatar, Citizen Name & Report ID */}
      <div className="flex items-center gap-3 min-w-0">
        {onBackToList && (
          <button
            type="button"
            onClick={onBackToList}
            className="lg:hidden p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-navy-deepest transition-colors shrink-0 cursor-pointer"
            aria-label="Kembali ke daftar percakapan"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <div
          className="w-10 h-10 rounded-full bg-navy-primary text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs relative select-none"
          aria-hidden="true"
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={citizenName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-navy-deepest truncate">
              {citizenName || "Warga Pelapor"}
            </span>
            <span className="bg-slate-100 dark:bg-[#12233A] text-slate-600 dark:text-[#AFC0D4] text-[11px] font-medium px-2 py-0.5 rounded-full select-none">
              {formattedId}
            </span>
          </div>

          <p className="text-xs text-[#6B7A90] dark:text-[#8FA4BA] mt-0.5 flex items-center gap-1.5 truncate">
            <span>Warga Pelapor</span>
            <span>•</span>
            <span>
              {villageName
                ? `Desa ${villageName.replace(/^Desa\s+/i, "")}`
                : "Jalan Desa"}
            </span>
          </p>
        </div>
      </div>

      {/* Right: Actions Group (Detail Link, Info, More) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Copy Feedback Toast */}
        {copyFeedback && (
          <span className="text-xs bg-navy-deepest dark:bg-[#12233A] text-white px-2.5 py-1 rounded-full shadow-md animate-fade-in flex items-center gap-1 select-none">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            {copyFeedback}
          </span>
        )}

        <Link
          to={`/pemdes/laporan/${reportId}`}
          className="rounded-full px-3.5 py-1.5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-navy-primary dark:text-navy-deepest hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors shadow-xs select-none"
          title="Lihat Detail Laporan"
        >
          <span className="hidden sm:inline">Lihat Detail Laporan</span>
          <span className="sm:hidden">Detail</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>

        {/* Info button */}
        <button
          ref={infoBtnRef}
          type="button"
          onClick={toggleInfo}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isInfoOpen
              ? "bg-navy-primary text-white"
              : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-[#AFC0D4]"
          }`}
          title="Informasi Percakapan"
          aria-label="Informasi Percakapan"
          aria-expanded={isInfoOpen}
        >
          <Info className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* More button */}
        <button
          ref={moreBtnRef}
          type="button"
          onClick={toggleMore}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isMoreOpen
              ? "bg-navy-primary text-white"
              : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-[#AFC0D4]"
          }`}
          title="Menu Lainnya"
          aria-label="Menu Lainnya"
          aria-expanded={isMoreOpen}
        >
          <MoreVertical className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Info Popover / Panel */}
      {isInfoOpen && (
        <div
          ref={infoRef}
          className="absolute right-0 top-14 z-30 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-[rgba(193,232,255,0.12)] shadow-xl p-5 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-3">
            <h4 className="text-sm font-bold text-navy-deepest flex items-center gap-2">
              <Info
                className="w-4 h-4 text-navy-primary dark:text-blue-pale"
                aria-hidden="true"
              />
              Informasi Percakapan
            </h4>
            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup Informasi Percakapan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-start gap-2">
              <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                Warga:
              </span>
              <span className="font-semibold text-navy-deepest text-right truncate">
                {citizenName || "Warga Pelapor"}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                ID Laporan:
              </span>
              <span className="font-semibold font-mono text-navy-deepest bg-slate-100 dark:bg-[#12233A] px-2 py-0.5 rounded">
                {formattedId}
              </span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                Laporan:
              </span>
              <span className="font-semibold text-navy-deepest text-right line-clamp-2">
                {currentTitle}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                Status:
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}
              >
                {statusBadgeLabel}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                Jenis Jalan:
              </span>
              <span className="font-medium text-navy-deepest text-right">
                {currentJenisJalan}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                Wilayah:
              </span>
              <span className="font-medium text-navy-deepest text-right truncate">
                {currentWilayah}
              </span>
            </div>

            {currentTipeKerusakan && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                  Tipe Kerusakan:
                </span>
                <span className="font-medium text-navy-deepest text-right truncate">
                  {currentTipeKerusakan}
                </span>
              </div>
            )}

            {currentTanggal && (
              <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100 dark:border-white/10">
                <span className="text-slate-500 dark:text-[#8FA4BA] font-medium shrink-0">
                  Tanggal Laporan:
                </span>
                <span className="text-slate-600 dark:text-[#AFC0D4] text-right">
                  {currentTanggal}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* More Popover Menu */}
      {isMoreOpen && (
        <div
          ref={moreRef}
          className="absolute right-0 top-14 z-30 w-56 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-[rgba(193,232,255,0.12)] shadow-lg p-1.5 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#AFC0D4] hover:bg-slate-50 dark:hover:bg-white/5 hover:text-navy-deepest rounded-lg transition-colors cursor-pointer text-left"
          >
            <RotateCw
              className={`w-4 h-4 text-slate-500 dark:text-[#8FA4BA] ${isRefreshing ? "animate-spin text-navy-primary" : ""}`}
            />
            <span>
              {isRefreshing ? "Memuat ulang..." : "Muat ulang percakapan"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopyReportId}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#AFC0D4] hover:bg-slate-50 dark:hover:bg-white/5 hover:text-navy-deepest rounded-lg transition-colors cursor-pointer text-left"
          >
            <Copy className="w-4 h-4 text-slate-500 dark:text-[#8FA4BA]" />
            <span>Salin ID laporan</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatHeader;

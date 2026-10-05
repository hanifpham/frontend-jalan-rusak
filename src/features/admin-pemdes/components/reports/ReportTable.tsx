import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import {
  MapPin,
  ArrowRight,
  Image as ImageIcon,
  Inbox,
  AlertCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { type Report } from "@/types/domain";

export interface ReportTableProps {
  reports: Report[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  villageName?: string;
  scopeLabel?: string;
  detailPathPrefix?: string;
  density?: "comfortable" | "compact";
  isFiltered?: boolean;
  onResetFilters?: () => void;
  showAuthorityColumn?: boolean;
}

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
export { AuthorityBadge };

/**
 * Formats ISO date string to Indonesian formatted date (e.g. 24 Jun 2026)
 */
function formatIndoDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Thumbnail with graceful fallback on load error or missing URL
 */
function ReportPhotoCell({
  imageUrl,
  title,
}: {
  imageUrl?: string;
  title: string;
}): React.JSX.Element {
  const [imgError, setImgError] = useState(false);

  if (!imageUrl || imgError) {
    return (
      <div
        className="w-11 h-11 rounded-full bg-slate-100 dark:bg-[#07111F] border border-blue-pale/40 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-[#7F93AA] shrink-0 shadow-xs"
        title="Foto tidak tersedia"
        aria-label="Foto tidak tersedia"
      >
        <ImageIcon
          className="w-5 h-5 text-slate-400 dark:text-[#7F93AA]"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`Foto kerusakan: ${title}`}
      onError={() => setImgError(true)}
      className="w-11 h-11 object-cover ring-1 ring-blue-pale/60 dark:ring-white/10 shadow-xs rounded-full shrink-0"
      loading="lazy"
    />
  );
}

/**
 * Status cell matching exact Stitch design tokens
 */
function StatusCell({ status }: { status: string }): React.JSX.Element {
  switch (status.toLowerCase()) {
    case "selesai":
      return (
        <span className="inline-flex items-center gap-1.5 font-semibold text-[12px] text-status-selesai dark:text-status-selesai">
          <span className="w-2 h-2 rounded-full bg-status-selesai" />
          Selesai
        </span>
      );
    case "proses":
      return (
        <span className="inline-flex items-center gap-1.5 font-semibold text-[12px] text-status-proses dark:text-[#5483B3]">
          <span className="w-2 h-2 rounded-full bg-status-proses" />
          Proses
        </span>
      );
    case "ditolak":
      return (
        <span className="inline-flex items-center gap-1.5 font-semibold text-[12px] text-severity-berat dark:text-severity-berat">
          <span className="w-2 h-2 rounded-full bg-severity-berat" />
          Ditolak
        </span>
      );
    case "menunggu":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 font-semibold text-[12px] text-[#B45309] dark:text-status-menunggu">
          <span className="w-2 h-2 rounded-full bg-status-menunggu" />
          Menunggu
        </span>
      );
  }
}

export function ReportTable({
  reports,
  isLoading,
  error,
  onRetry,
  villageName,
  scopeLabel,
  detailPathPrefix,
  density = "comfortable",
  isFiltered = false,
  onResetFilters,
  showAuthorityColumn = false,
}: ReportTableProps): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const baseDetailPrefix =
    detailPathPrefix ||
    (user?.role === "admin_pu" ? "/pu/laporan" : "/pemdes/laporan");
  const isCompact = density === "compact";
  const cellPy = isCompact ? "py-2.5" : "py-3.5";

  return (
    <div className="overflow-x-auto w-full">
      <table
        className="w-full text-left border-collapse"
        aria-label="Tabel Laporan Kerusakan Jalan"
      >
        <thead>
          <tr className="border-b border-blue-pale/40 dark:border-white/10 text-[12px] font-semibold text-muted dark:text-[#AFC0D4] tracking-wider uppercase select-none">
            <th scope="col" className="pb-3.5 px-3">
              FOTO
            </th>
            <th scope="col" className="pb-3.5 px-4 min-w-60">
              LAPORAN
            </th>
            {showAuthorityColumn && (
              <th scope="col" className="pb-3.5 px-4 text-center whitespace-nowrap">
                KEWENANGAN
              </th>
            )}
            <th scope="col" className="pb-3.5 px-4 min-w-40">
              JENIS KERUSAKAN
            </th>
            <th scope="col" className="pb-3.5 px-4 text-center">
              KEPARAHAN
            </th>
            <th scope="col" className="pb-3.5 px-4 text-center">
              STATUS
            </th>
            <th scope="col" className="pb-3.5 px-4 text-center">
              PRIORITY
            </th>
            <th scope="col" className="pb-3.5 px-4 whitespace-nowrap">
              TANGGAL
            </th>
            <th scope="col" className="pb-3.5 pl-4 pr-2 text-right">
              ACTION
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-blue-pale/20 dark:divide-white/10 text-[13px]">
          {/* 1. Loading State: Skeletons */}
          {isLoading && (
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className={`${cellPy} px-3`}>
                    <div className="w-11 h-11 bg-gray-200 dark:bg-white/10 rounded-full" />
                  </td>
                  <td className={`${cellPy} px-4`}>
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-1.5" />
                    <div className="h-3 bg-gray-150 dark:bg-white/5 rounded w-1/2" />
                  </td>
                  {showAuthorityColumn && (
                    <td className={`${cellPy} px-4 text-center`}>
                      <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-full w-20 mx-auto" />
                    </td>
                  )}
                  <td className={`${cellPy} px-4`}>
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" />
                  </td>
                  <td className={`${cellPy} px-4 text-center`}>
                    <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-full w-14 mx-auto" />
                  </td>
                  <td className={`${cellPy} px-4 text-center`}>
                    <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-full w-16 mx-auto" />
                  </td>
                  <td className={`${cellPy} px-4 text-center`}>
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-8 mx-auto" />
                  </td>
                  <td className={`${cellPy} px-4`}>
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20" />
                  </td>
                  <td className={`${cellPy} pl-4 pr-2 text-right`}>
                    <div className="h-7 bg-gray-200 dark:bg-white/10 rounded-full w-16 ml-auto" />
                  </td>
                </tr>
              ))}
            </>
          )}

          {/* 2. Error State */}
          {!isLoading && error && (
            <tr>
              <td colSpan={showAuthorityColumn ? 9 : 8} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-severity-berat flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-deepest">
                      Gagal Memuat Laporan
                    </h4>
                    <p className="text-xs text-muted dark:text-[#8FA4BA] mt-0.5">
                      {error}
                    </p>
                  </div>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-navy-primary text-white hover:bg-navy-deepest transition-colors shadow-xs cursor-pointer mt-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Coba Lagi</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}

          {/* 3. Empty State */}
          {!isLoading && !error && reports.length === 0 && (
            <tr>
              <td colSpan={showAuthorityColumn ? 9 : 8} className="py-14 text-center">
                {isFiltered ? (
                  <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                    <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 text-blue-medium dark:text-[#5483B3] flex items-center justify-center">
                      <Filter className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-deepest">
                        Tidak Ada Laporan yang Sesuai Filter
                      </h4>
                      <p className="text-xs text-muted dark:text-[#8FA4BA] mt-1 leading-relaxed">
                        {showAuthorityColumn
                          ? "Tidak ada laporan kerusakan jalan yang sesuai dengan filter atau kata kunci pencarian yang dipilih."
                          : "Tidak ada laporan kerusakan jalan desa yang sesuai dengan filter atau kata kunci pencarian yang dipilih."}
                      </p>
                    </div>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-navy-primary text-white hover:bg-navy-deepest dark:bg-[#001234] dark:hover:bg-[#5483B3] transition-colors shadow-xs cursor-pointer mt-1 border border-transparent dark:border-white/10"
                      >
                        <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Reset Filter</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                    <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 text-blue-medium dark:text-[#5483B3] flex items-center justify-center">
                      <Inbox className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-deepest">
                        Belum Ada Laporan
                      </h4>
                      {scopeLabel ? (
                        <p className="text-xs text-muted dark:text-[#8FA4BA] mt-1 leading-relaxed">
                          Belum ada laporan kerusakan jalan yang tercatat di{" "}
                          <span className="font-semibold text-navy-primary dark:text-blue-pale">
                            {scopeLabel}
                          </span>
                          . Laporan yang dikirimkan warga akan muncul di sini
                          secara otomatis.
                        </p>
                      ) : (
                        <p className="text-xs text-muted dark:text-[#8FA4BA] mt-1 leading-relaxed">
                          Belum ada laporan kerusakan jalan desa yang tercatat di
                          wilayah{" "}
                          <span className="font-semibold text-navy-primary dark:text-blue-pale">
                            {villageName
                              ? `Desa ${villageName.replace(/^Desa\s+/i, "")}`
                              : "ini"}
                          </span>
                          . Laporan yang dikirimkan warga akan muncul di sini
                          secara otomatis.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          )}

          {/* 4. Live Report Data Rows */}
          {!isLoading &&
            !error &&
            reports.map((report) => {
              const locationSubtext =
                report.roadName ||
                (scopeLabel
                  ? scopeLabel
                  : villageName
                  ? `Desa ${villageName.replace(/^Desa\s+/i, "")}, Jalan Desa`
                  : "Jalan Desa");

              return (
                <tr
                  key={report.id}
                  onClick={() => {
                    if (report.id) {
                      navigate(`${baseDetailPrefix}/${report.id}`);
                    }
                  }}
                  className="hover:bg-blue-pale/15 dark:hover:bg-white/4 transition-colors duration-150 group cursor-pointer"
                >
                  {/* Column 1: FOTO */}
                  <td className={`${cellPy} px-3`}>
                    <ReportPhotoCell
                      imageUrl={report.imageUrl}
                      title={report.title}
                    />
                  </td>

                  {/* Column 2: LAPORAN (Judul + Lokasi) */}
                  <td className={`${cellPy} px-4`}>
                    <div className="font-bold text-navy-deepest group-hover:text-navy-primary dark:group-hover:text-[#5483B3] transition-colors text-[13px] leading-snug line-clamp-2">
                      {report.title}
                    </div>
                    <div className="text-[12px] text-muted dark:text-[#8FA4BA] flex items-center gap-1 mt-0.5">
                      <MapPin
                        className="w-3.5 h-3.5 text-navy-primary dark:text-[#5483B3] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate max-w-70">
                        {locationSubtext}
                      </span>
                    </div>
                  </td>

                  {/* Column: KEWENANGAN (if showAuthorityColumn) */}
                  {showAuthorityColumn && (
                    <td className={`${cellPy} px-4 text-center whitespace-nowrap`}>
                      <AuthorityBadge authority={report.roadAuthority} />
                    </td>
                  )}

                  {/* Column 3: JENIS KERUSAKAN */}
                  <td
                    className={`${cellPy} px-4 font-medium text-navy-deepest dark:text-[#AFC0D4] text-[13px]`}
                  >
                    {report.damageType || "—"}
                  </td>

                  {/* Column 4: KEPARAHAN (Honest Unknown / Dash) */}
                  <td className={`${cellPy} px-4 text-center`}>
                    <span
                      className="text-muted dark:text-[#7F93AA] font-medium text-xs select-none"
                      title="Tingkat keparahan belum dianalisis oleh backend"
                    >
                      —
                    </span>
                  </td>

                  {/* Column 5: STATUS */}
                  <td
                    className={`${cellPy} px-4 text-center whitespace-nowrap`}
                  >
                    <StatusCell status={report.status} />
                  </td>

                  {/* Column 6: PRIORITY (Honest Unknown / Dash) */}
                  <td className={`${cellPy} px-4 text-center`}>
                    <span
                      className="text-muted dark:text-[#7F93AA] font-medium text-xs select-none"
                      title="Skor prioritas belum tersedia di backend"
                    >
                      —
                    </span>
                  </td>

                  {/* Column 7: TANGGAL */}
                  <td
                    className={`${cellPy} px-4 text-[12px] text-muted dark:text-[#8FA4BA] font-medium whitespace-nowrap`}
                  >
                    {formatIndoDate(report.createdAt)}
                  </td>

                  {/* Column 8: ACTION */}
                  <td
                    className={`${cellPy} pl-4 pr-2 text-right whitespace-nowrap`}
                  >
                    <Link
                      to={`${baseDetailPrefix}/${report.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="inline-flex items-center gap-1 bg-navy-primary hover:bg-navy-deepest dark:bg-[#001234] dark:hover:bg-[#5483B3] text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer select-none border border-transparent dark:border-white/10"
                      title={`Buka detail laporan #${report.id}`}
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;

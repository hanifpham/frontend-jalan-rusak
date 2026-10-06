import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw, Lock, ShieldAlert } from "lucide-react";
import { isForbiddenError } from "@/services/api/errors";
import { useAdminReportDetail } from "@/features/admin-pemdes/api/useAdminPemdesData";
import { ReportDetailHeader } from "@/components/reports/ReportDetailHeader";
import { ReportImageCard } from "@/components/reports/ReportImageCard";
import { ReportDetectionCard } from "@/components/reports/ReportDetectionCard";
import { ReportLocationCard } from "@/components/reports/ReportLocationCard";
import { ReportInformationCard } from "@/components/reports/ReportInformationCard";
import { ReportStatusUpdateCard } from "@/components/reports/ReportStatusUpdateCard";
import { ReportChatCard } from "@/components/reports/ReportChatCard";

function formatRoadAuthorityLabel(authority?: string): string {
  switch ((authority || "").toLowerCase()) {
    case "kabupaten":
      return "Jalan Kabupaten";
    case "desa":
      return "Jalan Desa";
    case "provinsi":
      return "Jalan Provinsi";
    case "nasional":
      return "Jalan Nasional";
    default:
      return "Tidak Teridentifikasi";
  }
}

function getManagingEntity(authority?: string): string {
  switch ((authority || "").toLowerCase()) {
    case "desa":
      return "Pemerintah Desa";
    case "provinsi":
      return "Dinas Bina Marga Provinsi";
    case "nasional":
      return "Kementerian PUPR (BBPJN)";
    default:
      return "instansi teknis pengelola terkait";
  }
}

export function AdminPUReportDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useAdminReportDetail(id);

  const report = data?.report;

  // 1. Loading State: Skeleton structure preserving exact 12-column layout
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-6 max-w-full animate-pulse select-none"
        aria-busy="true"
        aria-label="Memuat detail laporan"
      >
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-40 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="h-8 w-28 bg-gray-200 dark:bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="h-8 w-80 bg-gray-200 dark:bg-white/10 rounded-lg mt-2" />
          <div className="h-4 w-96 bg-gray-150 dark:bg-white/5 rounded" />
        </div>

        {/* Desktop 12-Column Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Left Column Skeletons (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-110 flex flex-col gap-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded-lg" />
              <div className="flex-1 bg-gray-200 dark:bg-white/10 rounded-2xl" />
            </div>
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-65 flex flex-col gap-4">
              <div className="h-6 w-40 bg-gray-200 dark:bg-white/10 rounded-lg" />
              <div className="flex-1 bg-gray-150 dark:bg-white/5 rounded-xl" />
            </div>
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-80 flex flex-col gap-4">
              <div className="h-6 w-36 bg-gray-200 dark:bg-white/10 rounded-lg" />
              <div className="h-45 bg-gray-200 dark:bg-white/10 rounded-2xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-150 dark:bg-white/5 rounded-xl" />
                <div className="h-12 bg-gray-150 dark:bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column Skeletons (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-100 flex flex-col gap-4">
              <div className="h-6 w-44 bg-gray-200 dark:bg-white/10 rounded-lg" />
              <div className="h-16 bg-gray-150 dark:bg-white/5 rounded-xl" />
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-gray-150 dark:bg-white/5 rounded" />
                <div className="h-4 bg-gray-150 dark:bg-white/5 rounded" />
                <div className="h-4 bg-gray-150 dark:bg-white/5 rounded" />
                <div className="h-4 bg-gray-150 dark:bg-white/5 rounded" />
              </div>
            </div>
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-90 flex flex-col gap-4">
              <div className="h-6 w-52 bg-gray-200 dark:bg-white/10 rounded-lg" />
              <div className="h-10 bg-gray-200 dark:bg-white/10 rounded-xl" />
              <div className="h-20 bg-gray-150 dark:bg-white/5 rounded-xl" />
              <div className="h-12 bg-gray-200 dark:bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || !report) {
    const isForbidden = isForbiddenError(error);
    const errorMessage =
      error instanceof Error ? error.message : "Laporan tidak ditemukan";

    return (
      <div className="flex flex-col gap-6 max-w-full py-8">
        <div>
          <Link
            to="/pu/laporan"
            className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/40 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors select-none"
          >
            <ArrowLeft
              className="w-4 h-4 text-navy-primary dark:text-blue-pale"
              aria-hidden="true"
            />
            <span>Kembali ke Laporan</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-4 max-w-xl mx-auto w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 text-severity-berat flex items-center justify-center">
            <AlertCircle className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-navy-deepest">
              {isForbidden ? "Akses Ditolak" : "Laporan Tidak Ditemukan"}
            </h2>
            <p className="text-xs text-muted dark:text-[#AFC0D4] max-w-md leading-relaxed">
              {isForbidden
                ? errorMessage ||
                  "Anda tidak memiliki hak akses untuk melihat laporan ini."
                : errorMessage === "Laporan tidak ditemukan"
                  ? `Laporan dengan ID #${id} tidak ditemukan pada basis data sistem.`
                  : errorMessage}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-canvas dark:bg-[#12233A] hover:bg-gray-200 dark:hover:bg-white/10 text-navy-deepest text-xs font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Coba Lagi</span>
            </button>

            <Link
              to="/pu/laporan"
              className="inline-flex items-center gap-2 bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Kembali ke Laporan</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isKabupaten = (report.roadAuthority || "").toLowerCase() === "kabupaten";
  const authorityLabel = formatRoadAuthorityLabel(report.roadAuthority);

  // 3. Render Live Detail View
  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* HEADER: Back to /pu/laporan, ID, Wilayah, Authority Badge & Status */}
      <ReportDetailHeader
        reportId={report.id}
        villageName={report.villageName || "Kabupaten Indramayu"}
        status={report.status}
        severity={report.severity}
        priorityScore={report.priorityScore}
        backPath="/pu/laporan"
        subtitle="Data pengamatan citra AI, koordinat spasial, verifikasi pelapor, dan penanganan teknis Dinas PUPR."
        roadAuthority={report.roadAuthority}
      />

      {/* DESKTOP CONTENT GRID: col-span-7 (Left) + col-span-5 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        {/* LEFT COLUMN: Foto, Deteksi AI, Lokasi Laporan */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Foto Kerusakan Jalan */}
          <ReportImageCard
            imageUrl={report.imageUrl}
            title={report.title}
            detections={report.detections}
          />

          {/* Card 2: Hasil Deteksi AI */}
          <ReportDetectionCard
            damageType={report.damageType}
            detections={report.detections}
            modelVersion={undefined}
          />

          {/* Card 3: Lokasi Laporan */}
          <ReportLocationCard
            latitude={report.latitude}
            longitude={report.longitude}
            roadName={report.roadName}
            villageName={report.villageName}
            roadAuthority={authorityLabel}
            status={report.status}
          />
        </div>

        {/* RIGHT COLUMN: Informasi Laporan, Status Update (Gated), Chat (Gated) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: Informasi Laporan */}
          <ReportInformationCard report={report} />

          {/* AUTHORITY-BASED GATING: Status Update & Chat only available for Kabupaten */}
          {isKabupaten ? (
            <>
              {/* Card 2: Update Status Penanganan */}
              <ReportStatusUpdateCard
                reportId={report.id}
                initialStatus={report.status}
                initialHandlingNote={report.handlingNote}
                existingEvidenceUrl={report.repairEvidenceUrl}
              />

              {/* Card 3: Chat dengan Pelapor */}
              <ReportChatCard
                reportId={report.id}
                reporterName={report.reporterName}
              />
            </>
          ) : (
            /* Non-Kabupaten Authority Notice Card: View-Only Mode */
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-amber-200 dark:border-amber-900/40 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-white/10">
                <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-navy-deepest">
                    Di Luar Kewenangan Penanganan
                  </h3>
                  <p className="text-[12px] text-muted dark:text-[#8FA4BA]">
                    Mode Pantau Saja (View-Only)
                  </p>
                </div>
              </div>

              <p className="text-[13px] text-navy-deepest dark:text-[#AFC0D4] leading-relaxed">
                Laporan ini berklasifikasi wewenang{" "}
                <strong className="text-navy-primary dark:text-blue-pale font-bold">
                  {authorityLabel}
                </strong>
                . Sesuai regulasi pembagian wewenang infrastruktur jalan, Admin Dinas PUPR Kabupaten hanya memiliki akses pemantauan (view-only). Pembaruan status operasional dan komunikasi tindak lanjut dikelola langsung oleh{" "}
                <strong className="font-semibold text-navy-deepest dark:text-white">
                  {getManagingEntity(report.roadAuthority)}
                </strong>
                .
              </p>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[12px] text-amber-900 dark:text-amber-300 font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span>Laporan ini berada di luar kewenangan update Admin PU.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPUReportDetailPage;

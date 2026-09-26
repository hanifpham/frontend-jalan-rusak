import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { isForbiddenError } from '@/services/api/errors';
import { useAdminReportDetail } from '../api/useAdminPemdesData';
import { ReportDetailHeader } from '../components/reports/ReportDetailHeader';
import { ReportImageCard } from '../components/reports/ReportImageCard';
import { ReportDetectionCard } from '../components/reports/ReportDetectionCard';
import { ReportLocationCard } from '../components/reports/ReportLocationCard';
import { ReportInformationCard } from '../components/reports/ReportInformationCard';
import { ReportStatusUpdateCard } from '../components/reports/ReportStatusUpdateCard';
import { ReportChatCard } from '../components/reports/ReportChatCard';

export function AdminPemdesReportDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Dynamic user village fallback if report's village is unassigned
  const userVillageName =
    user?.wilayahId === 2
      ? 'Lobener Lor'
      : user?.wilayahId
      ? `Wilayah #${user.wilayahId}`
      : undefined;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useAdminReportDetail(id);

  const report = data?.report;

  // 1. Loading State: Skeleton structure preserving exact 12-column layout
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-full animate-pulse select-none" aria-busy="true" aria-label="Memuat detail laporan">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-40 bg-gray-200 rounded-full" />
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
              <div className="h-8 w-32 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
              <div className="h-8 w-28 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="h-8 w-80 bg-gray-200 rounded-lg mt-2" />
          <div className="h-4 w-96 bg-gray-150 rounded" />
        </div>

        {/* Desktop 12-Column Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Left Column Skeletons (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 h-110 flex flex-col gap-4">
              <div className="h-6 w-48 bg-gray-200 rounded-lg" />
              <div className="flex-1 bg-gray-200 rounded-2xl" />
            </div>
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 h-65 flex flex-col gap-4">
              <div className="h-6 w-40 bg-gray-200 rounded-lg" />
              <div className="flex-1 bg-gray-150 rounded-xl" />
            </div>
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 h-80 flex flex-col gap-4">
              <div className="h-6 w-36 bg-gray-200 rounded-lg" />
              <div className="h-45 bg-gray-200 rounded-2xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-150 rounded-xl" />
                <div className="h-12 bg-gray-150 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column Skeletons (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 h-100 flex flex-col gap-4">
              <div className="h-6 w-44 bg-gray-200 rounded-lg" />
              <div className="h-16 bg-gray-150 rounded-xl" />
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-gray-150 rounded" />
                <div className="h-4 bg-gray-150 rounded" />
                <div className="h-4 bg-gray-150 rounded" />
                <div className="h-4 bg-gray-150 rounded" />
              </div>
            </div>
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 h-90 flex flex-col gap-4">
              <div className="h-6 w-52 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-gray-200 rounded-xl" />
              <div className="h-20 bg-gray-150 rounded-xl" />
              <div className="h-12 bg-gray-200 rounded-full" />
            </div>
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 h-55 flex flex-col gap-4">
              <div className="h-6 w-44 bg-gray-200 rounded-lg" />
              <div className="flex-1 bg-gray-150 rounded-2xl" />
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
      error instanceof Error ? error.message : 'Laporan tidak ditemukan';

    return (
      <div className="flex flex-col gap-6 max-w-full py-8">
        <div>
          <Link
            to="/pemdes/laporan"
            className="inline-flex items-center gap-2 bg-white hover:bg-canvas border border-blue-pale/40 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors select-none"
          >
            <ArrowLeft className="w-4 h-4 text-navy-primary" aria-hidden="true" />
            <span>Kembali ke Laporan</span>
          </Link>
        </div>

        <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-4 max-w-xl mx-auto w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 text-severity-berat flex items-center justify-center">
            <AlertCircle className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-navy-deepest">
              {isForbidden ? 'Akses Ditolak' : 'Laporan Tidak Ditemukan'}
            </h2>
            <p className="text-xs text-muted max-w-md leading-relaxed">
              {isForbidden
                ? (errorMessage || 'Anda tidak memiliki hak akses untuk melihat laporan ini. Pastikan laporan berada dalam wilayah kewenangan desa Anda.')
                : errorMessage === 'Laporan tidak ditemukan'
                ? `Laporan dengan ID #${id} tidak ditemukan pada daftar laporan terverifikasi atau berada di luar cakupan wilayah kewenangan akun Pemdes Anda.`
                : errorMessage}
            </p>
          </div>


          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-canvas hover:bg-gray-200 text-navy-deepest text-xs font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Coba Lagi</span>
            </button>

            <Link
              to="/pemdes/laporan"
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

  const effectiveVillage = report.villageName || userVillageName;

  // 3. Render Live Detail View (Matching Stitch Reference Architecture)
  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* HEADER: Back Button, ID, Wilayah, Status Badges & Page Title */}
      <ReportDetailHeader
        reportId={report.id}
        villageName={effectiveVillage}
        status={report.status}
        severity={report.severity}
        priorityScore={report.priorityScore}
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
            villageName={effectiveVillage}
            roadAuthority={report.roadAuthority === 'desa' ? 'Jalan Desa' : report.roadAuthority}
            status={report.status}
          />
        </div>

        {/* RIGHT COLUMN: Informasi Laporan, Update Status Penanganan, Chat */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: Informasi Laporan */}
          <ReportInformationCard report={report} />

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
        </div>
      </div>
    </div>
  );
}

export default AdminPemdesReportDetailPage;

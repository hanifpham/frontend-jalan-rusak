import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';
import { isForbiddenError } from '@/services/api/errors';
import { useAdminReportDetail } from '@/features/admin-pemdes/api/useAdminPemdesData';
import { useDeleteSpamReport } from '@/features/superadmin/api/useSuperadminReports';
import { ReportDetailHeader } from '@/components/reports/ReportDetailHeader';
import { ReportImageCard } from '@/components/reports/ReportImageCard';
import { ReportDetectionCard } from '@/components/reports/ReportDetectionCard';
import { ReportLocationCard } from '@/components/reports/ReportLocationCard';
import { ReportInformationCard } from '@/components/reports/ReportInformationCard';
import { ReportStatusUpdateCard } from '@/components/reports/ReportStatusUpdateCard';
import { ReportChatCard } from '@/components/reports/ReportChatCard';

function formatRoadAuthorityLabel(authority?: string): string {
  switch ((authority || '').toLowerCase()) {
    case 'kabupaten':
      return 'Jalan Kabupaten';
    case 'desa':
      return 'Jalan Desa';
    case 'provinsi':
      return 'Jalan Provinsi';
    case 'nasional':
      return 'Jalan Nasional';
    default:
      return 'Tidak Teridentifikasi';
  }
}

export function SuperadminReportDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useAdminReportDetail(id);
  const deleteSpamMutation = useDeleteSpamReport();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const report = data?.report;

  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-6 max-w-full animate-pulse select-none"
        aria-busy="true"
        aria-label="Memuat detail laporan"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-40 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded-full" />
              <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="h-8 w-80 bg-gray-200 dark:bg-white/10 rounded-lg mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-110" />
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-65" />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-100" />
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 h-90" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    const isForbidden = isForbiddenError(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Laporan tidak ditemukan';

    return (
      <div className="flex flex-col gap-6 max-w-full py-8">
        <div>
          <Link
            to="/superadmin/laporan"
            className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1A2D] hover:bg-canvas dark:hover:bg-white/5 border border-blue-pale/40 dark:border-white/10 px-4 py-2 rounded-full text-[13px] font-semibold text-navy-deepest shadow-xs transition-colors select-none"
          >
            <ArrowLeft className="w-4 h-4 text-navy-primary dark:text-blue-pale" />
            <span>Kembali ke Laporan</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-4 max-w-xl mx-auto w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 text-severity-berat flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-navy-deepest">
            {isForbidden ? 'Akses Ditolak' : 'Laporan Tidak Ditemukan'}
          </h2>
          <p className="text-xs text-muted dark:text-[#AFC0D4] max-w-md">
            {isForbidden ? errorMessage : `Laporan dengan ID #${id} tidak ditemukan.`}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-canvas dark:bg-[#12233A] text-navy-deepest text-xs font-semibold px-4 py-2.5 rounded-full"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>
            <Link
              to="/superadmin/laporan"
              className="inline-flex items-center gap-2 bg-navy-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Laporan</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorityLabel = formatRoadAuthorityLabel(report.roadAuthority);

  const handleDeleteSpam = async () => {
    if (!report.id) return;
    setDeleteError(null);
    try {
      await deleteSpamMutation.mutateAsync(report.id);
      setIsDeleteModalOpen(false);
      navigate('/superadmin/laporan', { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Gagal menghapus laporan spam.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-3">
        <ReportDetailHeader
          reportId={report.id}
          villageName={report.villageName || 'Seluruh Wilayah'}
          status={report.status}
          severity={report.severity}
          priorityScore={report.priorityScore}
          backPath="/superadmin/laporan"
          subtitle="Data pengamatan citra AI, koordinat spasial, verifikasi pelapor, dan penanganan teknis Superadmin."
          roadAuthority={report.roadAuthority}
        />

        {/* Superadmin Moderation Bar */}
        <div className="flex items-center justify-between p-3.5 bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl">
          <div className="flex items-center gap-2.5 text-xs text-red-900 dark:text-red-200">
            <ShieldAlert className="w-4 h-4 text-severity-berat shrink-0" />
            <span>
              <strong>Aksi Superadmin:</strong> Jika laporan ini terbukti tidak valid atau spam, Anda dapat menghapusnya secara permanen dari sistem.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-severity-berat hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tandai &amp; Hapus Spam</span>
          </button>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        {/* LEFT COLUMN: Foto, Deteksi AI, Lokasi */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ReportImageCard
            imageUrl={report.imageUrl}
            title={report.title}
            detections={report.detections}
          />

          <ReportDetectionCard
            damageType={report.damageType}
            detections={report.detections}
            modelVersion={undefined}
          />

          <ReportLocationCard
            latitude={report.latitude}
            longitude={report.longitude}
            roadName={report.roadName}
            villageName={report.villageName}
            roadAuthority={authorityLabel}
            status={report.status}
          />
        </div>

        {/* RIGHT COLUMN: Informasi, Update Status, Chat */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ReportInformationCard report={report} />

          {/* Superadmin has full authority to update status on any road */}
          <ReportStatusUpdateCard
            reportId={report.id}
            initialStatus={report.status}
            initialHandlingNote={report.handlingNote}
            existingEvidenceUrl={report.repairEvidenceUrl}
          />

          {/* Superadmin has full authority to communicate on any report */}
          <ReportChatCard
            reportId={report.id}
            reporterName={report.reporterName}
          />
        </div>
      </div>

      {/* Delete Spam Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-red-200 dark:border-red-900/40 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-severity-berat flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-deepest">
              Hapus Laporan Spam?
            </h3>
            <p className="text-xs text-muted dark:text-[#AFC0D4] leading-relaxed">
              Laporan <strong>&ldquo;{report.title}&rdquo;</strong> (ID #{report.id}) akan dihapus secara permanen beserta berkas fotonya dari server. Tindakan ini tidak dapat dibatalkan.
            </p>

            {deleteError && (
              <p className="text-xs text-severity-berat bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteSpamMutation.isPending}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSpam}
                disabled={deleteSpamMutation.isPending}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-severity-berat hover:bg-red-700 text-white shadow-xs transition-colors"
              >
                {deleteSpamMutation.isPending ? 'Menghapus...' : 'Ya, Hapus Spam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminReportDetailPage;

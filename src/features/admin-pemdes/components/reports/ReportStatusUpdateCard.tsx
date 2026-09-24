import React, { useState, useRef, useEffect } from 'react';
import {
  Edit3,
  CloudUpload,
  CheckCircle,
  Save,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { type ReportStatus } from '@/types/domain';
import { useUpdateReportStatus } from '../../api/useAdminPemdesData';
import { cn } from '@/lib/utils';

export interface ReportStatusUpdateCardProps {
  reportId: number;
  initialStatus: ReportStatus;
  initialHandlingNote?: string;
  existingEvidenceUrl?: string;
}

export function ReportStatusUpdateCard({
  reportId,
  initialStatus,
  initialHandlingNote = '',
  existingEvidenceUrl,
}: ReportStatusUpdateCardProps): React.JSX.Element {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(initialStatus);
  const [catatanAdmin, setCatatanAdmin] = useState(initialHandlingNote);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateMutation = useUpdateReportStatus();

  // Synchronize initial values when report data changes
  useEffect(() => {
    setSelectedStatus(initialStatus);
    setCatatanAdmin(initialHandlingNote || '');
  }, [initialStatus, initialHandlingNote]);

  // Clean up object URL when file changes
  useEffect(() => {
    if (!evidenceFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(evidenceFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [evidenceFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation: Type and Size (5 MB max)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setValidationError('Format file harus berupa JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Ukuran foto maksimal adalah 5 MB.');
      return;
    }

    setValidationError(null);
    setEvidenceFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setValidationError('Format file harus berupa JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Ukuran foto maksimal adalah 5 MB.');
      return;
    }

    setValidationError(null);
    setEvidenceFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = () => {
    setEvidenceFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessFeedback(null);

    // Business rule validation:
    // If status is "selesai", handling note and repair evidence are required by business rule.
    if (selectedStatus === 'selesai') {
      if (!catatanAdmin.trim()) {
        setValidationError(
          'Catatan penanganan wajib diisi sebelum laporan dapat ditandai Selesai.'
        );
        return;
      }

      if (!evidenceFile && !existingEvidenceUrl) {
        setValidationError(
          'Foto bukti perbaikan wajib diunggah sebelum laporan dapat ditandai Selesai.'
        );
        return;
      }
    }

    try {
      await updateMutation.mutateAsync({
        id: reportId,
        status: selectedStatus,
        catatanAdmin: catatanAdmin.trim(),
        fotoBukti: evidenceFile,
      });

      setSuccessFeedback('Status penanganan laporan berhasil diperbarui.');
      setEvidenceFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Auto dismiss success feedback after 5 seconds
      setTimeout(() => {
        setSuccessFeedback(null);
      }, 5000);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Gagal memperbarui status laporan.'
      );
    }
  };

  return (
    <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-6 flex flex-col gap-5">
      {/* Header: Edit Icon + Title & Admin Badge */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-navy-primary" aria-hidden="true" />
          <h2 className="text-[17px] font-bold text-navy-deepest">
            Update Status Penanganan
          </h2>
        </div>

        <span
          className="inline-flex items-center gap-1 bg-canvas text-navy-primary border border-blue-pale/40 px-3 py-1 rounded-full text-[11px] font-bold select-none"
          title="Tingkat Otoritas"
        >
          Admin Pemdes
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Status Selector: 3 Pill Buttons */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-canvas rounded-2xl border border-blue-pale/40">
          {/* Menunggu */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('menunggu');
              setValidationError(null);
            }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer select-none',
              selectedStatus === 'menunggu'
                ? 'bg-status-menunggu text-white shadow-xs'
                : 'text-muted hover:bg-white hover:text-navy-deepest'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                selectedStatus === 'menunggu' ? 'bg-white' : 'bg-status-menunggu'
              )}
              aria-hidden="true"
            />
            <span>Menunggu</span>
          </button>

          {/* Proses */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('proses');
              setValidationError(null);
            }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer select-none',
              selectedStatus === 'proses'
                ? 'bg-status-proses text-white shadow-xs'
                : 'text-muted hover:bg-white hover:text-navy-deepest'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                selectedStatus === 'proses' ? 'bg-white' : 'bg-status-proses'
              )}
              aria-hidden="true"
            />
            <span>Proses</span>
          </button>

          {/* Selesai */}
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('selesai');
              setValidationError(null);
            }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer select-none',
              selectedStatus === 'selesai'
                ? 'bg-status-selesai text-white shadow-xs'
                : 'text-muted hover:bg-white hover:text-navy-deepest'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                selectedStatus === 'selesai' ? 'bg-white' : 'bg-status-selesai'
              )}
              aria-hidden="true"
            />
            <span>Selesai</span>
          </button>
        </div>

        {/* Catatan Penanganan Textarea */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="catatan-penanganan"
            className="text-[13px] font-bold text-navy-deepest flex items-center justify-between"
          >
            <span>
              Catatan Penanganan{' '}
              {selectedStatus === 'selesai' && (
                <span className="text-severity-berat">*</span>
              )}
            </span>
            <span className="text-[11px] font-normal text-muted">
              Rencana aksi desa
            </span>
          </label>
          <textarea
            id="catatan-penanganan"
            rows={3}
            value={catatanAdmin}
            onChange={(e) => setCatatanAdmin(e.target.value)}
            placeholder="Masukkan rencana tindakan (misal: Dijadwalkan pengurukan dan penambalan cold-mix besok pagi oleh Tim Sarpras Pemdes)..."
            className="w-full bg-white border border-blue-pale/50 rounded-xl p-3 text-[13px] text-navy-deepest placeholder:text-muted/60 focus:outline-none focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all resize-y"
          />
        </div>

        {/* Foto Bukti Perbaikan */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-navy-deepest flex items-center justify-between">
            <span>
              Foto Bukti Perbaikan{' '}
              {selectedStatus === 'selesai' && (
                <span className="text-severity-berat">*</span>
              )}
            </span>
            <span className="text-[11px] font-normal text-muted">
              Wajib saat Selesai
            </span>
          </label>

          {/* Hidden Native File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="evidence-file-input"
          />

          {/* Display Existing Evidence if available and no new file selected */}
          {!previewUrl && existingEvidenceUrl && (
            <div className="p-3 bg-canvas/70 rounded-2xl border border-blue-pale/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={existingEvidenceUrl}
                  alt="Bukti perbaikan tersimpan"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-blue-pale/60 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-navy-deepest truncate">
                    Foto Bukti Tersimpan
                  </p>
                  <p className="text-[11px] text-status-selesai flex items-center gap-1 mt-0.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sudah diunggah ke sistem</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-navy-primary hover:text-navy-deepest bg-white border border-blue-pale/50 px-3 py-1.5 rounded-full hover:bg-canvas transition-colors shrink-0 cursor-pointer"
              >
                Ganti Foto
              </button>
            </div>
          )}

          {/* New Selected File Preview */}
          {previewUrl && evidenceFile && (
            <div className="p-3 bg-canvas/70 rounded-2xl border border-blue-pale/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={previewUrl}
                  alt="Pratinjau bukti perbaikan"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-blue-pale/60 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-navy-deepest truncate">
                    {evidenceFile.name}
                  </p>
                  <p className="text-[11px] text-muted">
                    {(evidenceFile.size / 1024).toFixed(0)} KB • Siap diunggah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="w-8 h-8 rounded-full bg-white hover:bg-red-50 text-muted hover:text-severity-berat flex items-center justify-center border border-gray-200 transition-colors shrink-0 cursor-pointer"
                title="Batalkan foto"
                aria-label="Batalkan foto"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Drag & Drop Upload Zone (when no new file selected) */}
          {!previewUrl && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-pale/70 hover:border-navy-primary/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 bg-canvas/40 hover:bg-canvas transition-colors cursor-pointer text-center select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Unggah foto bukti perbaikan"
            >
              <div className="w-10 h-10 rounded-full bg-blue-pale/40 flex items-center justify-center text-blue-medium">
                <CloudUpload className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="text-[13px] font-semibold text-navy-deepest">
                Klik atau seret foto bukti perbaikan ke sini
              </div>
              <span className="text-[11px] text-muted">
                Format JPG, PNG (Maks 5 MB)
              </span>
            </div>
          )}

          {/* Subtext Note */}
          <span className="text-[11px] text-muted/90 italic flex items-center gap-1.5 mt-0.5">
            <CheckCircle className="w-3.5 h-3.5 text-navy-primary shrink-0" aria-hidden="true" />
            <span>
              Foto bukti perbaikan wajib diunggah sebelum laporan dapat ditandai Selesai.
            </span>
          </span>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-severity-berat rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-snug">{validationError}</p>
          </div>
        )}

        {/* Success Feedback Banner */}
        {successFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-status-selesai rounded-xl text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-snug font-medium">{successFeedback}</p>
          </div>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-navy-primary hover:bg-navy-deepest text-white font-bold text-[14px] py-3 px-6 rounded-full shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 select-none"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Menyimpan Perubahan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Simpan Perubahan Status</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ReportStatusUpdateCard;

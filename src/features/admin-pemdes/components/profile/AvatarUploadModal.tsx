import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Camera, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useUploadAvatar } from '@/hooks/useProfile';

export interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string | null;
  onSuccessNotification: (msg: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function AvatarUploadModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSuccessNotification,
}: AvatarUploadModalProps): React.JSX.Element | null {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAvatarMutation = useUploadAvatar();

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setValidationError(null);
    }
  }, [isOpen]);

  // Clean up object URL when file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validasi Ukuran File (<= 2 MB)
    if (file.size > MAX_FILE_SIZE) {
      setValidationError('Ukuran file foto melebihi batas maksimal 2 MB.');
      e.target.value = '';
      return;
    }

    // 2. Validasi Ekstensi & MIME
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!hasValidExt || !hasValidMime) {
      setValidationError('Format file tidak didukung. Format yang diizinkan: JPG, PNG, WEBP.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Silakan pilih berkas foto terlebih dahulu.');
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(selectedFile);
      onSuccessNotification('Foto profil berhasil diperbarui.');
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengunggah foto profil.';
      setValidationError(errorMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-avatar-title"
    >
      <div className="bg-white rounded-3xl border border-blue-pale/50 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={uploadAvatarMutation.isPending}
          className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted hover:text-navy-deepest transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-blue-pale text-navy-primary flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="upload-avatar-title" className="text-lg font-bold text-navy-deepest">
              Ubah Foto Profil
            </h3>
            <p className="text-xs text-muted">
              Pilih foto format JPG, PNG, atau WEBP (Maks. 2 MB).
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-severity-berat rounded-2xl p-3 flex items-start gap-2.5 text-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">{validationError}</div>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Avatar Preview Section */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-canvas border border-dashed border-blue-pale/70">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-2 border-blue-pale shadow-md mb-3 flex items-center justify-center relative group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview foto baru"
                  className="w-full h-full object-cover"
                />
              ) : currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt="Foto saat ini"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted/60 flex flex-col items-center">
                  <ImageIcon className="w-8 h-8" aria-hidden="true" />
                  <span className="text-[10px] mt-1">Belum ada foto</span>
                </div>
              )}
            </div>

            {selectedFile ? (
              <p className="text-xs font-semibold text-navy-deepest truncate max-w-xs text-center">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            ) : (
              <p className="text-xs text-muted text-center">
                Klik tombol di bawah untuk memilih berkas foto baru
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploadAvatarMutation.isPending}
              className="hidden"
              id="avatar-file-input"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
              className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-blue-pale/60 text-navy-primary hover:bg-blue-pale/20 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{selectedFile ? 'Pilih Berkas Lain' : 'Pilih Berkas Foto'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-pale/30">
            <button
              type="button"
              onClick={onClose}
              disabled={uploadAvatarMutation.isPending}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-blue-pale/50 text-muted hover:text-navy-deepest hover:bg-canvas transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploadAvatarMutation.isPending}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploadAvatarMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              )}
              <span>Simpan Foto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

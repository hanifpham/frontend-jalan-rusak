import React, { useState, useEffect } from 'react';
import { X, User, Mail, MapPin, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfile';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentPhone?: string | null;
  email: string;
  wilayahName?: string;
  roleLabel: string;
  onSuccessNotification: (msg: string) => void;
}

const INDO_PHONE_REGEX = /^(\+62|62|0)[0-9\- ]{8,20}$/;

export function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentPhone,
  email,
  wilayahName,
  roleLabel,
  onSuccessNotification,
}: EditProfileModalProps): React.JSX.Element | null {
  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    setName(currentName);
    setPhone(currentPhone || '');
    setValidationError(null);
  }, [currentName, currentPhone, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError('Nama lengkap wajib diisi.');
      return;
    }

    if (trimmedName.length > 150) {
      setValidationError('Nama lengkap maksimal 150 karakter.');
      return;
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone) {
      if (!INDO_PHONE_REGEX.test(trimmedPhone)) {
        setValidationError(
          'Format nomor telepon tidak valid. Gunakan format nomor telepon Indonesia yang umum (contoh: 08123456789 atau +628123456789).'
        );
        return;
      }
      const digitsOnly = trimmedPhone.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 9 || digitsOnly.length > 16) {
        setValidationError('Jumlah digit nomor telepon harus antara 9 hingga 16 angka.');
        return;
      }
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: trimmedName,
        phone: trimmedPhone || null,
      });
      onSuccessNotification('Profil berhasil diperbarui.');
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memperbarui profil.';
      setValidationError(errorMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div className="bg-white rounded-3xl border border-blue-pale/50 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={updateProfileMutation.isPending}
          className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted hover:text-navy-deepest transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-blue-pale text-navy-primary flex items-center justify-center shrink-0 shadow-xs">
            <User className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="edit-profile-title" className="text-lg font-bold text-navy-deepest">
              Edit Informasi Profil
            </h3>
            <p className="text-xs text-muted">
              Perbarui nama dan nomor telepon kontak Anda.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-severity-berat rounded-2xl p-3.5 flex items-start gap-2.5 text-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">{validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Editable: Nama Lengkap */}
          <div>
            <label htmlFor="edit-name" className="block text-xs font-bold text-navy-deepest mb-1.5">
              Nama Lengkap <span className="text-severity-berat">*</span>
            </label>
            <div className="relative">
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={150}
                required
                disabled={updateProfileMutation.isPending}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 bg-white text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          {/* Editable: Nomor Telepon */}
          <div>
            <label htmlFor="edit-phone" className="block text-xs font-bold text-navy-deepest mb-1.5">
              Nomor Telepon
            </label>
            <div className="relative">
              <input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                disabled={updateProfileMutation.isPending}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 bg-white text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium transition-all"
                placeholder="Contoh: 08123456789"
              />
            </div>
            <p className="text-[11px] text-muted mt-1">
              Gunakan awalan 0 atau +62 (opsional).
            </p>
          </div>

          {/* Readonly: Email */}
          <div>
            <label className="block text-xs font-bold text-navy-deepest mb-1.5">
              Alamat Email (Terkunci)
            </label>
            <div className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{email}</span>
              </div>
              <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                Sistem
              </span>
            </div>
          </div>

          {/* Readonly: Role & Wilayah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-navy-deepest mb-1">
                Peran Akun
              </label>
              <div className="px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-center gap-1.5 truncate">
                <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{roleLabel}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-deepest mb-1">
                Wilayah Kewenangan
              </label>
              <div className="px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{wilayahName || '-'}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted italic pt-1">
            * Email, peran, dan wilayah kewenangan hanya dapat diubah oleh Administrator Utama.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-blue-pale/30">
            <button
              type="button"
              onClick={onClose}
              disabled={updateProfileMutation.isPending}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-blue-pale/50 text-muted hover:text-navy-deepest hover:bg-canvas transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              )}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

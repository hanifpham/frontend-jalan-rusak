import React, { useState, useEffect } from "react";
import { X, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useChangePassword } from "@/hooks/useProfile";

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification: (msg: string) => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccessNotification,
}: ChangePasswordModalProps): React.JSX.Element | null {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const changePasswordMutation = useChangePassword();

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setValidationError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!currentPassword) {
      setValidationError("Password saat ini wajib diisi.");
      return;
    }

    if (!newPassword || !newPassword.trim()) {
      setValidationError(
        "Password baru tidak boleh kosong atau hanya berisi spasi.",
      );
      return;
    }

    if (newPassword.length < 6) {
      setValidationError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Konfirmasi password baru tidak cocok.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      });

      onSuccessNotification("Password akun berhasil diperbarui.");
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Gagal memperbarui password.";
      setValidationError(errorMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          disabled={changePasswordMutation.isPending}
          className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas dark:hover:bg-white/10 text-muted dark:text-[#8FA4BA] hover:text-navy-deepest transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-blue-pale dark:bg-white/10 text-navy-primary dark:text-blue-pale flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3
              id="change-password-title"
              className="text-lg font-bold text-navy-deepest"
            >
              Ubah Password Akun
            </h3>
            <p className="text-xs text-muted dark:text-[#8FA4BA]">
              Masukkan password saat ini dan buat password baru yang kuat.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-severity-berat rounded-2xl p-3 flex items-start gap-2.5 text-xs animate-in fade-in duration-150">
            <AlertCircle
              className="w-4 h-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1">{validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password-input"
              className="block text-xs font-bold text-navy-deepest mb-1.5"
            >
              Password Saat Ini <span className="text-severity-berat">*</span>
            </label>
            <div className="relative">
              <input
                id="current-password-input"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={changePasswordMutation.isPending}
                className="w-full px-3.5 py-2.5 pr-10 rounded-2xl border border-blue-pale/50 dark:border-white/10 bg-white dark:bg-[#12233A] text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium transition-all"
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-muted dark:text-[#8FA4BA] hover:text-navy-deepest transition-colors cursor-pointer"
                aria-label={
                  showCurrent ? "Sembunyikan password" : "Lihat password"
                }
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="new-password-input"
              className="block text-xs font-bold text-navy-deepest mb-1.5"
            >
              Password Baru <span className="text-severity-berat">*</span>
            </label>
            <div className="relative">
              <input
                id="new-password-input"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                disabled={changePasswordMutation.isPending}
                className="w-full px-3.5 py-2.5 pr-10 rounded-2xl border border-blue-pale/50 dark:border-white/10 bg-white dark:bg-[#12233A] text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium transition-all"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-muted dark:text-[#8FA4BA] hover:text-navy-deepest transition-colors cursor-pointer"
                aria-label={showNew ? "Sembunyikan password" : "Lihat password"}
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm-password-input"
              className="block text-xs font-bold text-navy-deepest mb-1.5"
            >
              Konfirmasi Password Baru{" "}
              <span className="text-severity-berat">*</span>
            </label>
            <div className="relative">
              <input
                id="confirm-password-input"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                disabled={changePasswordMutation.isPending}
                className="w-full px-3.5 py-2.5 pr-10 rounded-2xl border border-blue-pale/50 dark:border-white/10 bg-white dark:bg-[#12233A] text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium transition-all"
                placeholder="Ketik ulang password baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-muted dark:text-[#8FA4BA] hover:text-navy-deepest transition-colors cursor-pointer"
                aria-label={
                  showConfirm ? "Sembunyikan password" : "Lihat password"
                }
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-blue-pale/30 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={changePasswordMutation.isPending}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-blue-pale/50 dark:border-white/10 text-muted dark:text-[#AFC0D4] hover:text-navy-deepest dark:hover:text-white hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {changePasswordMutation.isPending && (
                <Loader2
                  className="w-3.5 h-3.5 animate-spin"
                  aria-hidden="true"
                />
              )}
              <span>Simpan Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;

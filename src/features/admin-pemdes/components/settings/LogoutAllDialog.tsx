import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export interface LogoutAllDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutAllDialog({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: LogoutAllDialogProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/50 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted dark:text-[#AFC0D4] hover:text-navy-deepest dark:hover:text-white hover:bg-canvas dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-severity-berat dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 id="logout-dialog-title" className="text-base font-bold text-navy-deepest">
              Keluar dari semua sesi?
            </h3>
            <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] leading-relaxed">
              Anda akan dikeluarkan dari semua perangkat dan harus login kembali untuk menggunakan akun.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#12233A] border border-blue-pale/60 dark:border-white/10 text-navy-primary dark:text-navy-deepest hover:bg-[#EEF5FB] dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium select-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-severity-berat hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-severity-berat select-none disabled:opacity-60"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
            <span>Logout Semua Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
}

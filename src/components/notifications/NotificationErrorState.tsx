import React from "react";
import { AlertCircle } from "lucide-react";

export interface NotificationErrorStateProps {
  onRetry: () => void;
}

export function NotificationErrorState({
  onRetry,
}: NotificationErrorStateProps): React.JSX.Element {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-severity-berat flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="text-base font-bold text-navy-deepest dark:text-white">
        Gagal memuat notifikasi
      </p>
      <p className="text-xs text-muted dark:text-[#AFC0D4] mt-1 max-w-sm">
        Terjadi kendala saat mengambil data notifikasi dari server. Silakan coba kembali.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-navy-primary hover:bg-navy-deepest dark:bg-[#5483B3] dark:hover:bg-[#436b94] rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
      >
        Coba lagi
      </button>
    </div>
  );
}

export default NotificationErrorState;

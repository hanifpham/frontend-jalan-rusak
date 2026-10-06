import React from "react";
import { Bell, CheckCheck, FileText, MessageSquare, RefreshCw } from "lucide-react";
import { type NotificationFilterTab } from "@/types/notification";

export interface NotificationEmptyStateProps {
  filter: NotificationFilterTab;
}

export function NotificationEmptyState({
  filter,
}: NotificationEmptyStateProps): React.JSX.Element {
  switch (filter) {
    case "unread":
      return (
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 flex items-center justify-center text-muted dark:text-[#8FA4BA] mb-3">
            <CheckCheck className="w-7 h-7 text-accent-blue dark:text-blue-pale" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-navy-deepest dark:text-white">
            Semua notifikasi telah dibaca
          </h3>
          <p className="text-xs text-muted dark:text-[#AFC0D4] mt-1 max-w-sm leading-relaxed">
            Tidak ada notifikasi yang belum dibaca saat ini.
          </p>
        </div>
      );

    case "laporan":
      return (
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 flex items-center justify-center text-muted dark:text-[#8FA4BA] mb-3">
            <FileText className="w-7 h-7 text-accent-blue dark:text-blue-pale" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-navy-deepest dark:text-white">
            Belum ada notifikasi laporan
          </h3>
          <p className="text-xs text-muted dark:text-[#AFC0D4] mt-1 max-w-sm leading-relaxed">
            Pemberitahuan laporan masuk akan tampil di sini.
          </p>
        </div>
      );

    case "pesan":
      return (
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 flex items-center justify-center text-muted dark:text-[#8FA4BA] mb-3">
            <MessageSquare className="w-7 h-7 text-accent-blue dark:text-blue-pale" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-navy-deepest dark:text-white">
            Belum ada notifikasi pesan
          </h3>
          <p className="text-xs text-muted dark:text-[#AFC0D4] mt-1 max-w-sm leading-relaxed">
            Belum ada pesan atau interaksi baru dari warga.
          </p>
        </div>
      );

    case "status":
      return (
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 flex items-center justify-center text-muted dark:text-[#8FA4BA] mb-3">
            <RefreshCw className="w-7 h-7 text-accent-blue dark:text-blue-pale" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-navy-deepest dark:text-white">
            Belum ada notifikasi status
          </h3>
          <p className="text-xs text-muted dark:text-[#AFC0D4] mt-1 max-w-sm leading-relaxed">
            Pembaruan status penanganan jalan akan tampil di sini.
          </p>
        </div>
      );

    default:
      return (
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/50 dark:border-white/10 flex items-center justify-center text-muted dark:text-[#8FA4BA] mb-3">
            <Bell className="w-7 h-7 text-accent-blue dark:text-blue-pale" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-navy-deepest dark:text-white">
            Belum ada notifikasi
          </h3>
          <p className="text-xs text-muted dark:text-[#AFC0D4] mt-1 max-w-sm leading-relaxed">
            Notifikasi baru tentang laporan dan komunikasi warga akan muncul di sini.
          </p>
        </div>
      );
  }
}

export default NotificationEmptyState;

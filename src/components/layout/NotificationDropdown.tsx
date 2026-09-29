import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  FileText,
  RefreshCw,
  MessageSquare,
  Reply,
  AlertCircle,
  Clock,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';
import { type NotificationItem } from '@/types/notification';
import { formatRelativeTime } from '@/lib/date';
import { cn } from '@/lib/utils';

export interface NotificationDropdownProps {
  notifications: NotificationItem[];
  totalCount?: number;
  unreadCount?: number;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead?: () => void;
}

/**
 * Returns appropriate Lucide icon component according to backend notification content
 */
function getNotificationIcon(judul: string) {
  const lower = judul.toLowerCase();
  if (lower.includes('laporan baru')) {
    return FileText;
  }
  if (lower.includes('status')) {
    return RefreshCw;
  }
  if (lower.includes('balasan')) {
    return Reply;
  }
  if (lower.includes('pesan') || lower.includes('chat')) {
    return MessageSquare;
  }
  return Bell;
}

export function NotificationDropdown({
  notifications,
  unreadCount = 0,
  isLoading,
  isError,
  onRefetch,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: NotificationDropdownProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleItemClick = (item: NotificationItem) => {
    // 1. Mark as read if unread
    if (!item.isRead) {
      onMarkRead(item.id);
    }

    // 2. Navigate if report ID is present
    if (item.laporanId) {
      onClose();
      navigate(`/pemdes/laporan/${item.laporanId}`);
    } else {
      onClose();
    }
  };

  const handleViewAll = () => {
    onClose();
    navigate('/pemdes/notifikasi');
  };

  return (
    <div
      role="dialog"
      aria-label="Notifikasi"
      className="absolute right-0 top-[calc(100%+12px)] w-[360px] sm:w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl shadow-navy-deepest/10 border border-blue-pale/40 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Dropdown Header: Notifikasi & Lihat semua */}
      <div className="px-4 py-3 border-b border-blue-pale/30 flex items-center justify-between bg-white select-none">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-navy-deepest">Notifikasi</h3>
          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold text-accent-blue bg-blue-pale/40 text-navy-primary px-2 py-0.5 rounded-full">
              {unreadCount} belum dibaca
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleViewAll}
          className="text-xs font-semibold text-accent-blue hover:text-navy-primary transition-colors cursor-pointer flex items-center gap-0.5 focus-visible:outline-none focus-visible:underline"
        >
          <span>Lihat semua</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Dropdown Body: Maximum 5 latest items */}
      <div className="max-h-[360px] overflow-y-auto">
        {/* Loading State: Minimal Skeleton Rows */}
        {isLoading && (
          <div className="p-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="py-8 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-red-50 text-severity-berat flex items-center justify-center mb-2.5">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-navy-deepest">
              Gagal memuat notifikasi
            </p>
            <button
              type="button"
              onClick={onRefetch}
              className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-navy-primary bg-blue-pale/30 hover:bg-blue-pale/50 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && notifications.length === 0 && (
          <div className="py-10 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-canvas border border-blue-pale/40 flex items-center justify-center text-muted mb-3">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-navy-deepest">
              Belum ada notifikasi
            </p>
            <p className="text-xs text-muted mt-1 max-w-[240px] leading-relaxed">
              Notifikasi laporan dan pesan akan muncul di sini.
            </p>
          </div>
        )}

        {/* Notification Items List */}
        {!isLoading && !isError && notifications.length > 0 && (
          <div className="divide-y divide-blue-pale/20" role="menu">
            {notifications.map((item) => {
              const IconComponent = getNotificationIcon(item.judul);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full text-left p-3.5 sm:p-4 transition-colors flex items-start gap-3 cursor-pointer group focus-visible:outline-none focus-visible:bg-blue-pale/20",
                    !item.isRead
                      ? "bg-blue-pale/15 hover:bg-blue-pale/25"
                      : "bg-white hover:bg-canvas/70"
                  )}
                  role="menuitem"
                >
                  {/* Category Icon */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      !item.isRead
                        ? "bg-blue-pale/60 text-navy-primary"
                        : "bg-canvas text-muted border border-blue-pale/30"
                    )}
                    aria-hidden="true"
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Notification Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-xs sm:text-sm truncate",
                          !item.isRead
                            ? "font-bold text-navy-deepest"
                            : "font-medium text-slate-700"
                        )}
                      >
                        {item.judul}
                      </p>
                      {!item.isRead && (
                        <span
                          className="w-2 h-2 rounded-full bg-severity-sedang shrink-0"
                          title="Belum dibaca"
                          aria-label="Belum dibaca"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.pesan}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-muted mt-1.5">
                      <Clock className="w-3 h-3 text-muted/70 shrink-0" aria-hidden="true" />
                      <span>{formatRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Dropdown Footer: Tandai semua dibaca (jika unread > 0) & Link Halaman Penuh */}
      {unreadCount > 0 && onMarkAllRead && (
        <div className="p-2 border-t border-blue-pale/30 bg-canvas/40 flex items-center justify-center">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="w-full py-2 px-3 text-xs font-semibold text-navy-primary hover:bg-blue-pale/25 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
          >
            <CheckCheck className="w-4 h-4 text-accent-blue" aria-hidden="true" />
            <span>Tandai semua dibaca</span>
          </button>
        </div>
      )}
    </div>
  );
}

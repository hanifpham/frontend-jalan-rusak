import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  FileText,
  RefreshCw,
  MessageSquare,
  Reply,
  Clock,
  CheckCheck,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications';
import { type NotificationItem } from '@/types/notification';
import { formatRelativeTime } from '@/lib/date';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'unread';

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

export function AdminPemdesNotificationsPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // React Query hook: GET /api/notifikasi?page=X&limit=Y
  const {
    data: notifData,
    isLoading,
    isError,
    refetch,
  } = useNotifications(page, pageSize);

  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const allItems = notifData?.items || [];
  const unreadCount = notifData?.unreadCount ?? 0;
  const meta = notifData?.meta || {
    page: 1,
    limit: pageSize,
    total: allItems.length,
    unread_count: unreadCount,
    total_pages: 1,
  };

  // Filter items based on active tab
  const displayedItems = useMemo(() => {
    if (filter === 'unread') {
      return allItems.filter((n) => !n.isRead);
    }
    return allItems;
  }, [allItems, filter]);

  const handleNotificationClick = (item: NotificationItem) => {
    // 1. Mark as read if unread
    if (!item.isRead) {
      markNotificationRead.mutate(item.id);
    }

    // 2. Navigate if linked report ID exists
    if (item.laporanId) {
      navigate(`/pemdes/laporan/${item.laporanId}`);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteNotification.mutate(id);
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllNotificationsRead.mutate();
    }
  };

  // Pagination bounds calculation
  const totalPages = Math.max(1, meta.total_pages);
  const startItem = meta.total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, meta.total);

  // Generate pagination page numbers
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page, '...', totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
          Notifikasi
        </h1>
        <p className="text-sm text-muted">
          Pantau pembaruan laporan dan komunikasi warga.
        </p>
      </div>

      {/* 2. Main Content Card */}
      <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-5 sm:p-6 flex flex-col gap-6 overflow-hidden">
        {/* Toolbar: Filter Tabs & Mark All as Read Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-pale/30 pb-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-canvas p-1 rounded-full border border-blue-pale/40 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none',
                filter === 'all'
                  ? 'bg-white text-navy-primary shadow-xs'
                  : 'text-muted hover:text-navy-deepest'
              )}
            >
              Semua {meta.total > 0 && `(${meta.total})`}
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter('unread');
                setPage(1);
              }}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none flex items-center gap-1.5',
                filter === 'unread'
                  ? 'bg-white text-navy-primary shadow-xs'
                  : 'text-muted hover:text-navy-deepest'
              )}
            >
              <span>Belum dibaca</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-severity-berat" />
              )}
            </button>
          </div>

          {/* Action: Tandai semua dibaca */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markAllNotificationsRead.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-blue-pale/30 hover:bg-blue-pale/50 text-navy-primary border border-blue-pale/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium self-start sm:self-auto disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4 text-accent-blue" aria-hidden="true" />
              <span>Tandai semua dibaca</span>
            </button>
          )}
        </div>

        {/* 3. Notifications List */}
        <div>
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-blue-pale/25 bg-canvas/40 flex items-start gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/4 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && isError && (
            <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-severity-berat flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="text-base font-bold text-navy-deepest">
                Gagal memuat notifikasi
              </p>
              <p className="text-xs text-muted mt-1 max-w-sm">
                Terjadi kendala saat mengambil data notifikasi dari server. Silakan coba kembali.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-navy-primary hover:bg-navy-deepest rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && displayedItems.length === 0 && (
            <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-canvas border border-blue-pale/50 flex items-center justify-center text-muted mb-3">
                {filter === 'unread' ? (
                  <CheckCheck className="w-7 h-7 text-accent-blue" aria-hidden="true" />
                ) : (
                  <Bell className="w-7 h-7" aria-hidden="true" />
                )}
              </div>
              <h3 className="text-base font-bold text-navy-deepest">
                {filter === 'unread'
                  ? 'Semua notifikasi telah dibaca'
                  : 'Belum ada notifikasi'}
              </h3>
              <p className="text-xs text-muted mt-1 max-w-sm leading-relaxed">
                {filter === 'unread'
                  ? 'Tidak ada notifikasi yang belum dibaca saat ini.'
                  : 'Notifikasi baru tentang laporan dan komunikasi warga akan muncul di sini.'}
              </p>
            </div>
          )}

          {/* Notification Items List */}
          {!isLoading && !isError && displayedItems.length > 0 && (
            <div className="space-y-3" role="list">
              {displayedItems.map((item) => {
                const IconComponent = getNotificationIcon(item.judul);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(item);
                      }
                    }}
                    className={cn(
                      'p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium select-none',
                      !item.isRead
                        ? 'bg-blue-pale/15 border-blue-pale/60 hover:bg-blue-pale/25 shadow-xs'
                        : 'bg-white border-blue-pale/30 hover:bg-canvas/80'
                    )}
                    aria-label={`${item.judul}: ${item.pesan}`}
                  >
                    {/* Category Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs',
                        !item.isRead
                          ? 'bg-blue-pale text-navy-primary'
                          : 'bg-canvas text-muted border border-blue-pale/40'
                      )}
                      aria-hidden="true"
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content Body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <h4
                            className={cn(
                              'text-sm truncate',
                              !item.isRead
                                ? 'font-bold text-navy-deepest'
                                : 'font-semibold text-slate-700'
                            )}
                          >
                            {item.judul}
                          </h4>
                          {!item.isRead && (
                            <span
                              className="w-2 h-2 rounded-full bg-severity-sedang shrink-0"
                              title="Belum dibaca"
                              aria-label="Belum dibaca"
                            />
                          )}
                        </div>

                        {/* Delete Action Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id)}
                          disabled={deleteNotification.isPending}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-muted/60 hover:text-severity-berat hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shrink-0 cursor-pointer"
                          title="Hapus notifikasi"
                          aria-label={`Hapus notifikasi ${item.judul}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.pesan}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted mt-2">
                        <Clock className="w-3.5 h-3.5 text-muted/70 shrink-0" aria-hidden="true" />
                        <span>{formatRelativeTime(item.createdAt)}</span>
                        {item.laporanId && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium text-navy-primary/70">
                              Laporan #{item.laporanId}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Pagination Footer */}
        {!isLoading && !isError && meta.total > 0 && (
          <div className="pt-4 border-t border-blue-pale/30 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-muted select-none">
            {/* Left: Summary */}
            <div>
              <span>
                Menampilkan{' '}
                <span className="font-bold text-navy-deepest">
                  {startItem}–{endItem}
                </span>{' '}
                dari <span className="font-bold text-navy-deepest">{meta.total}</span> notifikasi
              </span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1.5" aria-label="Navigasi Halaman Notifikasi">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border border-blue-pale/50 text-muted transition-colors',
                  page <= 1
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-canvas hover:text-navy-deepest cursor-pointer'
                )}
                title="Halaman Sebelumnya"
                aria-label="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Page Numbers */}
              {pageNumbers.map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-1 text-muted text-xs">
                      ...
                    </span>
                  );
                }

                const pageNum = p as number;
                const isActive = pageNum === page;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-[12px] transition-colors cursor-pointer',
                      isActive
                        ? 'bg-navy-primary text-white font-bold shadow-xs'
                        : 'border border-blue-pale/50 hover:bg-canvas text-muted font-medium'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Halaman ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border border-blue-pale/50 text-muted transition-colors',
                  page >= totalPages
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-canvas hover:text-navy-deepest cursor-pointer'
                )}
                title="Halaman Berikutnya"
                aria-label="Halaman Berikutnya"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPemdesNotificationsPage;

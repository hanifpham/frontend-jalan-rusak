import React, { useState, useMemo } from "react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import {
  type NotificationFilterTab,
  matchNotificationFilter,
} from "@/types/notification";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationFilterToolbar } from "./NotificationFilterToolbar";
import { NotificationItemCard } from "./NotificationItemCard";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { NotificationErrorState } from "./NotificationErrorState";
import { NotificationPagination } from "./NotificationPagination";

export interface NotificationViewProps {
  role: "admin_pu" | "admin_pemdes";
  title?: string;
  subtitle?: string;
  scopeAuthority: "kabupaten" | "desa";
  reportsBasePath: string;
  messagesBasePath: string;
}

export function NotificationView({
  title = "Notifikasi",
  subtitle = "Pantau pembaruan laporan dan komunikasi warga.",
  scopeAuthority,
  reportsBasePath,
  messagesBasePath,
}: NotificationViewProps): React.JSX.Element {
  const [filter, setFilter] = useState<NotificationFilterTab>("all");
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
    return allItems.filter((item) => matchNotificationFilter(item, filter));
  }, [allItems, filter]);

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllNotificationsRead.mutate();
    }
  };

  const handleFilterChange = (tab: NotificationFilterTab) => {
    setFilter(tab);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <NotificationHeader title={title} subtitle={subtitle} />

      {/* 2. Main Content Card */}
      <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-[rgba(193,232,255,0.12)] shadow-sm p-5 sm:p-6 flex flex-col gap-6 overflow-hidden">
        {/* Toolbar: Filter Tabs & Mark All as Read Action */}
        <NotificationFilterToolbar
          filter={filter}
          onFilterChange={handleFilterChange}
          unreadCount={unreadCount}
          totalCount={meta.total}
          onMarkAllRead={handleMarkAllRead}
          isMarkingAllRead={markAllNotificationsRead.isPending}
        />

        {/* 3. Notifications List */}
        <div>
          {/* Loading Skeleton */}
          {isLoading && <NotificationSkeleton />}

          {/* Error State */}
          {!isLoading && isError && (
            <NotificationErrorState onRetry={() => refetch()} />
          )}

          {/* Empty State */}
          {!isLoading && !isError && displayedItems.length === 0 && (
            <NotificationEmptyState filter={filter} />
          )}

          {/* Notification Items List */}
          {!isLoading && !isError && displayedItems.length > 0 && (
            <div className="space-y-3" role="list">
              {displayedItems.map((item) => (
                <NotificationItemCard
                  key={item.id}
                  item={item}
                  scopeAuthority={scopeAuthority}
                  reportsBasePath={reportsBasePath}
                  messagesBasePath={messagesBasePath}
                  onMarkRead={(id) => markNotificationRead.mutate(id)}
                  onDelete={(id) => deleteNotification.mutate(id)}
                  isDeleting={deleteNotification.isPending}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. Pagination Footer */}
        {!isLoading && !isError && meta.total > 0 && (
          <NotificationPagination
            page={page}
            pageSize={pageSize}
            meta={meta}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
}

export default NotificationView;

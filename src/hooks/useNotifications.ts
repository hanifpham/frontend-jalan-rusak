import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { useAuth } from '@/features/auth/useAuth';
import {
  type BackendNotificationResponse,
  type NotificationListResult,
  normalizeNotification,
} from '@/types/notification';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';

/**
 * Hook to fetch paginated notifications from verified backend GET /api/notifikasi
 * Supports ?page=1&limit=20
 */
export function useNotifications(page = 1, limit = 20) {
  const { isAuthenticated } = useAuth();

  return useQuery<NotificationListResult, Error>({
    queryKey: [NOTIFICATIONS_QUERY_KEY, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<BackendNotificationResponse>('/notifikasi', {
        params: { page, limit },
      });

      const rawItems = Array.isArray(response?.data) ? response.data : [];
      const items = rawItems.map(normalizeNotification);
      const unreadCount = Number(
        response?.unread_count ?? response?.meta?.unread_count ?? 0
      );

      const meta = response?.meta || {
        page,
        limit,
        total: items.length,
        unread_count: unreadCount,
        total_pages: Math.max(1, Math.ceil(items.length / limit)),
      };

      return {
        items,
        unreadCount,
        meta,
      };
    },
    enabled: isAuthenticated,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

/**
 * Mutation hook to mark single notification as read via PUT /api/notifikasi/:id/read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.put<{
        status: string;
        message: string;
        data?: unknown;
      }>(`/notifikasi/${id}/read`);
      return response;
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.setQueriesData<NotificationListResult>(
        { queryKey: [NOTIFICATIONS_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;
          const target = oldData.items.find((n) => n.id === id);
          const wasUnread = target && !target.isRead;
          return {
            ...oldData,
            unreadCount: wasUnread
              ? Math.max(0, oldData.unreadCount - 1)
              : oldData.unreadCount,
            items: oldData.items.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          };
        }
      );
    },
    onSettled: () => {
      // Invalidate all notifications queries to synchronize list and unread count
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

/**
 * Mutation hook to mark all notifications as read via PUT /api/notifikasi/read-all
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.put<{
        status: string;
        message: string;
      }>('/notifikasi/read-all');
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.setQueriesData<NotificationListResult>(
        { queryKey: [NOTIFICATIONS_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            unreadCount: 0,
            items: oldData.items.map((n) => ({ ...n, isRead: true })),
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

/**
 * Mutation hook to soft delete a notification via DELETE /api/notifikasi/:id
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete<{
        status: string;
        message: string;
      }>(`/notifikasi/${id}`);
      return response;
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.setQueriesData<NotificationListResult>(
        { queryKey: [NOTIFICATIONS_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;
          const target = oldData.items.find((n) => n.id === id);
          const wasUnread = target && !target.isRead;
          return {
            ...oldData,
            unreadCount: wasUnread
              ? Math.max(0, oldData.unreadCount - 1)
              : oldData.unreadCount,
            items: oldData.items.filter((n) => n.id !== id),
            meta: {
              ...oldData.meta,
              total: Math.max(0, oldData.meta.total - 1),
            },
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}


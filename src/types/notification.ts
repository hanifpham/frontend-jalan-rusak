/**
 * Notification Types and Normalization
 * Strictly based on backend Go models: `models.Notifikasi`
 * Endpoints:
 * - GET /api/notifikasi?page=1&limit=20
 * - PUT /api/notifikasi/:id/read
 * - PATCH /api/notifikasi/:id/read
 * - PUT /api/notifikasi/read-all
 * - PATCH /api/notifikasi/read-all
 * - DELETE /api/notifikasi/:id
 */

export interface BackendNotificationItem {
  ID?: number;
  id?: number;
  CreatedAt?: string;
  created_at?: string;
  UpdatedAt?: string;
  updated_at?: string;
  DeletedAt?: string | null;
  deleted_at?: string | null;
  user_id: number;
  laporan_id?: number | null;
  judul: string;
  pesan: string;
  is_read: boolean;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  unread_count: number;
  total_pages: number;
}

export interface BackendNotificationResponse {
  status: string;
  message: string;
  data: BackendNotificationItem[];
  unread_count?: number;
  meta?: NotificationMeta;
}

export interface NotificationItem {
  id: number;
  userId: number;
  laporanId?: number;
  judul: string;
  pesan: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  items: NotificationItem[];
  unreadCount: number;
  meta: NotificationMeta;
}

/**
 * Normalizes backend Notifikasi model into frontend NotificationItem.
 * Supports both uppercase GORM defaults (ID, CreatedAt) and lowercase variants.
 */
export function normalizeNotification(item: BackendNotificationItem): NotificationItem {
  return {
    id: item.ID ?? item.id ?? 0,
    userId: item.user_id,
    laporanId: item.laporan_id ? Number(item.laporan_id) : undefined,
    judul: item.judul || '',
    pesan: item.pesan || '',
    isRead: Boolean(item.is_read),
    createdAt: item.CreatedAt ?? item.created_at ?? '',
  };
}

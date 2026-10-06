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

export type NotificationFilterTab = 'all' | 'unread' | 'laporan' | 'pesan' | 'status';

/**
 * Determines whether a notification is chat/message related
 */
export function isMessageNotification(judul: string, pesan = ''): boolean {
  const lower = `${judul} ${pesan}`.toLowerCase();
  return lower.includes('pesan') || lower.includes('chat') || lower.includes('balasan');
}

/**
 * Extracts ReportStatus (menunggu, proses, selesai, ditolak) from notification text if present
 */
export function extractStatusFromNotification(
  judul: string,
  pesan = ''
): 'menunggu' | 'proses' | 'selesai' | 'ditolak' | null {
  const lower = `${judul} ${pesan}`.toLowerCase();
  if (
    lower.includes('menjadi: selesai') ||
    lower.includes('status: selesai') ||
    lower.includes('status selesai')
  ) {
    return 'selesai';
  }
  if (
    lower.includes('menjadi: proses') ||
    lower.includes('status: proses') ||
    lower.includes('status proses')
  ) {
    return 'proses';
  }
  if (
    lower.includes('menjadi: ditolak') ||
    lower.includes('status: ditolak') ||
    lower.includes('status ditolak')
  ) {
    return 'ditolak';
  }
  if (
    lower.includes('menjadi: menunggu') ||
    lower.includes('status: menunggu') ||
    lower.includes('status menunggu')
  ) {
    return 'menunggu';
  }
  return null;
}

/**
 * Categorizes a notification item against the active filter tab
 */
export function matchNotificationFilter(
  item: NotificationItem,
  filter: NotificationFilterTab
): boolean {
  if (filter === 'all') return true;
  if (filter === 'unread') return !item.isRead;
  if (filter === 'pesan') return isMessageNotification(item.judul, item.pesan);
  const lower = `${item.judul} ${item.pesan}`.toLowerCase();
  if (filter === 'status') return lower.includes('status');
  if (filter === 'laporan') {
    return (
      (lower.includes('laporan') && !lower.includes('status')) ||
      Boolean(item.laporanId)
    );
  }
  return true;
}


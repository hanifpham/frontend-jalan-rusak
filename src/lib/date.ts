/**
 * Indonesian Relative Time Formatter
 * Complies with ROADIS Phase 14 Notification UI specification.
 *
 * Formats:
 * - < 1 min: "Baru saja"
 * - < 60 min: "X menit lalu"
 * - < 24 jam: "X jam lalu"
 * - 1 hari: "Kemarin"
 * - 2-6 hari: "X hari lalu"
 * - >= 7 hari: "29 Sep 2026" (Locale ID)
 */

const ID_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  // If time is negative (clock skew) or under 60 seconds
  if (diffInMs < 60 * 1000) {
    return 'Baru saja';
  }

  const diffInMinutes = Math.floor(diffInMs / (60 * 1000));
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  }

  const diffInHours = Math.floor(diffInMs / (3600 * 1000));
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  }

  const diffInDays = Math.floor(diffInMs / (24 * 3600 * 1000));
  if (diffInDays === 1) {
    return 'Kemarin';
  }

  if (diffInDays < 7) {
    return `${diffInDays} hari lalu`;
  }

  // Format as "29 Sep 2026"
  const day = date.getDate();
  const month = ID_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Format timestamp into Indonesian full date & time (WIB)
 * Example: "29 Sep 2026 • 21:30 WIB"
 */
export function formatDateTimeIndo(dateStr?: string | null): string {
  if (!dateStr) return 'Belum tersedia';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Belum tersedia';

  const day = date.getDate();
  const month = ID_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} • ${hours}:${minutes} WIB`;
}

/**
 * Utility functions for formatting chat timestamps cleanly according to Stitch design specifications.
 */

const MONTH_MAP: Record<string, number> = {
  januari: 0,
  jan: 0,
  februari: 1,
  feb: 1,
  maret: 2,
  mar: 2,
  april: 3,
  apr: 3,
  mei: 4,
  juni: 5,
  jun: 5,
  juli: 6,
  jul: 6,
  agustus: 7,
  ags: 7,
  agu: 7,
  september: 8,
  sep: 8,
  oktober: 9,
  okt: 9,
  november: 10,
  nov: 10,
  desember: 11,
  des: 11,
};

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const FULL_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_NAMES = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

/**
 * Parses either an Indonesian formatted date string ("Jumat, 25 September 2026 jam 09:15 WIB")
 * or an ISO timestamp string into a Date object.
 */
export function parseDateString(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Try standard ISO parsing first
  if (trimmed.includes('T') || (trimmed.includes('-') && !trimmed.includes(' '))) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }

  // Indonesian format: "[Hari,] DD Bulan YYYY [jam HH:mm [WIB]]"
  const indoRegex = /(?:([A-Za-z]+),\s+)?(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:\s+jam\s+(\d{1,2}):(\d{2}))?/;
  const match = trimmed.match(indoRegex);

  if (match && match[2] && match[3] && match[4]) {
    const day = parseInt(match[2], 10);
    const monthKey = match[3].toLowerCase();
    const month = MONTH_MAP[monthKey] ?? 0;
    const year = parseInt(match[4], 10);
    const hour = match[5] ? parseInt(match[5], 10) : 0;
    const minute = match[6] ? parseInt(match[6], 10) : 0;

    const d = new Date(year, month, day, hour, minute);
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback to Date.parse
  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Formats a timestamp for the Conversation List (modern chat format):
 * - Today: "HH:mm" (e.g. "14:32")
 * - Yesterday: "Kemarin"
 * - Within past 6 days: Day name (e.g. "Jumat")
 * - Older: "DD MMM" (e.g. "25 Sep", "21 Jun")
 * - Never includes "jam".
 */
export function formatConversationTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = parseDateString(dateStr);
  if (!d) {
    // If parsing fails, extract time part if present
    const timeMatch = dateStr.match(/(\d{1,2}:\d{2})/);
    return timeMatch && timeMatch[1] ? timeMatch[1] : dateStr;
  }

  const now = new Date();

  // Reset hours to compare calendar days
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const timeFormatted = `${hours}:${minutes}`;

  if (diffDays === 0) {
    return timeFormatted;
  }
  if (diffDays === 1) {
    return 'Kemarin';
  }
  if (diffDays > 1 && diffDays < 7) {
    const dayName = DAY_NAMES[d.getDay()];
    return dayName ? dayName : timeFormatted;
  }

  const day = d.getDate();
  const month = SHORT_MONTHS[d.getMonth()] || '';

  if (d.getFullYear() !== now.getFullYear()) {
    return `${day} ${month} ${d.getFullYear()}`.trim();
  }

  return `${day} ${month}`.trim();
}

/**
 * Formats a message bubble timestamp:
 * Returns concise "HH:mm WIB" (e.g. "14:20 WIB", "09:15 WIB")
 */
export function formatMessageTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = parseDateString(dateStr);
  if (!d) {
    const timeMatch = dateStr.match(/(\d{1,2}:\d{2})/);
    return timeMatch && timeMatch[1] ? `${timeMatch[1]} WIB` : dateStr;
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}

/**
 * Formats the date separator divider in chat thread:
 * e.g. "Hari Ini, 29 September 2026" or "Jumat, 25 September 2026"
 */
export function formatDateSeparator(dateStr?: string | null): string {
  if (!dateStr) return 'Hari Ini';
  const d = parseDateString(dateStr);
  if (!d) return dateStr.split(' jam ')[0] || dateStr;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  const day = d.getDate();
  const month = FULL_MONTHS[d.getMonth()] || '';
  const year = d.getFullYear();
  const dayName = DAY_NAMES[d.getDay()] || 'Hari';

  if (diffDays === 0) {
    return `Hari Ini, ${day} ${month} ${year}`.trim();
  }
  if (diffDays === 1) {
    return `Kemarin, ${day} ${month} ${year}`.trim();
  }

  return `${dayName}, ${day} ${month} ${year}`.trim();
}

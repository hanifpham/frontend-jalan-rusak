import React from 'react';
import { type BackendAdminInboxItem } from '../../api/useAdminPemdesData';
import { cn } from '@/lib/utils';
import { formatConversationTime } from './chatDateUtils';

export interface ConversationItemProps {
  conversation: BackendAdminInboxItem;
  isActive: boolean;
  onSelect: (reportId: number) => void;
}

export function getInitials(name?: string): string {
  if (!name) return 'WP';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) return 'WP';
  if (parts.length === 1 || !second) {
    return first.slice(0, 2).toUpperCase();
  }
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

export function formatReportId(id: number): string {
  return `#RPT-DS-${String(id).padStart(4, '0')}`;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps): React.JSX.Element {
  const initials = getInitials(conversation.nama_warga);
  const formattedId = formatReportId(conversation.laporan_id);
  const formattedTime = formatConversationTime(conversation.waktu_pesan_terakhir);

  // Status badge styling derived honestly from report status
  const statusLower = (conversation.status_laporan || '').toLowerCase();
  let statusBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200/50';
  let statusLabel = 'Menunggu';

  if (statusLower === 'proses') {
    statusBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200/50';
    statusLabel = 'Diproses';
  } else if (statusLower === 'selesai') {
    statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
    statusLabel = 'Selesai';
  } else if (statusLower === 'ditolak') {
    statusBadgeClass = 'bg-red-50 text-red-600 border-red-200/50';
    statusLabel = 'Ditolak';
  }

  // Ensure Cloudinary URLs or attachment-only replies show friendly text
  let previewText = conversation.isi_pesan_terakhir || 'Belum ada pesan';
  if (
    previewText.startsWith('http://') ||
    previewText.startsWith('https://') ||
    previewText.includes('cloudinary.com')
  ) {
    previewText = '📎 Lampiran gambar';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(conversation.laporan_id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(conversation.laporan_id);
        }
      }}
      className={cn(
        'w-full text-left rounded-2xl p-3 cursor-pointer transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-medium',
        isActive
          ? 'bg-[#EFF4FF] border border-[#d0e4ff] shadow-xs'
          : 'hover:bg-slate-50 border border-transparent'
      )}
      aria-selected={isActive}
    >
      <div className="flex items-start gap-2.5">
        {/* Citizen Avatar with Initials or Photo */}
        <div
          className={cn(
            'w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 relative shadow-xs',
            isActive ? 'bg-navy-primary text-white' : 'bg-blue-medium text-white'
          )}
          aria-hidden="true"
        >
          {conversation.profile_photo ? (
            <img
              src={conversation.profile_photo}
              alt={conversation.nama_warga}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
          {/* Waiting for response indicator dot */}
          {conversation.menunggu_balasan_admin && (
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white bg-amber-500"
              title="Menunggu balasan admin"
            />
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0">
          {/* Baris 1: [Nama Warga] ... [Waktu] */}
          <div className="flex items-center justify-between mb-0.5 gap-1.5">
            <span className="text-xs font-bold text-navy-deepest truncate">
              {conversation.nama_warga || 'Warga Pelapor'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 shrink-0">
              {formattedTime}
            </span>
          </div>

          {/* Baris 2: [ID Laporan] ... [Status/Severity] */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] text-slate-500 font-medium">
              {formattedId}
            </span>
            <span
              className={cn(
                'text-[9px] px-1.5 py-0.5 rounded font-semibold border',
                statusBadgeClass
              )}
            >
              {statusLabel}
            </span>
          </div>

          {/* Baris 3: [Preview pesan terakhir] ... [Perlu respon badge] */}
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs text-slate-600 truncate leading-snug">
              {previewText}
            </p>
            {conversation.menunggu_balasan_admin && (
              <span
                className="bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0 ml-1 select-none shadow-2xs"
                title="Perlu balasan admin"
                aria-label="1 pesan menunggu respon"
              >
                1
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationItem;

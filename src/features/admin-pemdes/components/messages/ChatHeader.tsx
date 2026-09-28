import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Info, MoreVertical } from 'lucide-react';
import { getInitials, formatReportId } from './ConversationItem';

export interface ChatHeaderProps {
  citizenName?: string;
  reportId: number;
  villageName?: string;
  profilePhoto?: string;
  onBackToList?: () => void;
}

export function ChatHeader({
  citizenName,
  reportId,
  villageName,
  profilePhoto,
  onBackToList,
}: ChatHeaderProps): React.JSX.Element {
  const initials = getInitials(citizenName);
  const formattedId = formatReportId(reportId);

  return (
    <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
      {/* Left: Avatar, Citizen Name & Report ID */}
      <div className="flex items-center gap-3 min-w-0">
        {onBackToList && (
          <button
            type="button"
            onClick={onBackToList}
            className="lg:hidden p-1.5 rounded-full hover:bg-slate-100 text-navy-deepest transition-colors shrink-0 cursor-pointer"
            aria-label="Kembali ke daftar percakapan"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <div
          className="w-10 h-10 rounded-full bg-navy-primary text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs relative select-none"
          aria-hidden="true"
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={citizenName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-selesai rounded-full ring-2 ring-white"
            title="Aktif sekarang"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-navy-deepest truncate">
              {citizenName || 'Warga Pelapor'}
            </span>
            <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-full select-none">
              {formattedId}
            </span>
          </div>

          <p className="text-xs text-[#6B7A90] mt-0.5 flex items-center gap-1.5 truncate">
            <span>Warga Pelapor</span>
            <span>•</span>
            <span>{villageName ? `Desa ${villageName.replace(/^Desa\s+/i, '')}` : 'Jalan Desa'}</span>
            <span>•</span>
            <span className="text-status-selesai font-medium flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-status-selesai" />
              Aktif sekarang
            </span>
          </p>
        </div>
      </div>

      {/* Right: Actions Group (Detail Link, Info, More - NO CALL BUTTON) */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/pemdes/laporan/${reportId}`}
          className="rounded-full px-3.5 py-1.5 border border-slate-200 text-xs font-semibold text-navy-primary hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs select-none"
          title="Lihat Detail Laporan"
        >
          <span className="hidden sm:inline">Lihat Detail Laporan</span>
          <span className="sm:hidden">Detail</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>

        {/* Info button */}
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Informasi Percakapan"
          aria-label="Informasi Percakapan"
        >
          <Info className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* More button */}
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Menu Lainnya"
          aria-label="Menu Lainnya"
        >
          <MoreVertical className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;

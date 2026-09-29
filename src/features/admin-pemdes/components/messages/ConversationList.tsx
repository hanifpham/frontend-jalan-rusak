import React, { useState, useMemo } from 'react';
import { Search, X, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { type BackendAdminInboxItem } from '../../api/useAdminPemdesData';
import { ConversationItem, formatReportId } from './ConversationItem';

export interface ConversationListProps {
  conversations: BackendAdminInboxItem[];
  selectedReportId: number | null;
  onSelectConversation: (reportId: number) => void;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export type InboxFilterType = 'all' | 'needs_reply';

export function ConversationList({
  conversations,
  selectedReportId,
  onSelectConversation,
  isLoading,
  error,
  onRetry,
}: ConversationListProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<InboxFilterType>('all');

  // Filter conversations by search and tab
  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      // 1. Tab filter
      if (activeFilter === 'needs_reply' && !item.menunggu_balasan_admin) {
        return false;
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const citizenName = (item.nama_warga || '').toLowerCase();
      const reportTitle = (item.judul_laporan || '').toLowerCase();
      const reportIdStr = String(item.laporan_id);
      const formattedId = formatReportId(item.laporan_id).toLowerCase();
      const lastMessage = (item.isi_pesan_terakhir || '').toLowerCase();

      return (
        citizenName.includes(q) ||
        reportTitle.includes(q) ||
        reportIdStr.includes(q) ||
        formattedId.includes(q) ||
        lastMessage.includes(q)
      );
    });
  }, [conversations, searchQuery, activeFilter]);

  const totalContacts = conversations.length;
  const needsReplyCount = useMemo(
    () => conversations.filter((c) => c.menunggu_balasan_admin).length,
    [conversations]
  );

  return (
    <div className="w-full h-full rounded-[24px] bg-white border border-slate-200/80 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
      {/* 1. Header Card: Title & Contact Count */}
      <div className="flex items-center justify-between pb-2 shrink-0">
        <h2 className="text-sm font-bold text-navy-deepest">Daftar Percakapan</h2>
        <span className="bg-[#EFF4FF] text-navy-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full select-none">
          {totalContacts} Kontak
        </span>
      </div>

      {/* 2. Search Input (Vertically centered per Section 10) */}
      <div className="mt-2 relative shrink-0 flex items-center">
        <Search
          className="absolute left-3 text-slate-400 w-4 h-4 pointer-events-none shrink-0"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama warga atau ID laporan..."
          className="w-full bg-slate-100/80 border-none rounded-full pl-9 pr-8 py-2 text-xs text-navy-deepest placeholder-slate-400 focus:ring-1 focus:ring-blue-medium outline-none transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
            aria-label="Bersihkan pencarian"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* 3. Filter Tabs (Semua & Perlu Respon) */}
      <div className="flex gap-2 mt-3 pb-2.5 border-b border-slate-100 shrink-0">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-navy-primary text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Semua ({totalContacts})
        </button>

        {needsReplyCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('needs_reply')}
            className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeFilter === 'needs_reply'
                ? 'bg-navy-primary text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Perlu Respon ({needsReplyCount})
          </button>
        )}
      </div>

      {/* 4. Conversation Items Scrollable List */}
      <div className="overflow-y-auto flex-1 min-h-0 mt-2.5 space-y-2 pr-1 custom-scrollbar overflow-x-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3 p-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl p-3 bg-slate-50 border border-slate-100 animate-pulse flex items-start gap-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-2 w-16 bg-slate-200 rounded" />
                  <div className="h-2.5 w-full bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-severity-berat flex flex-col items-center text-center gap-2 my-4">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p className="font-semibold">Gagal memuat percakapan</p>
            <p className="text-[11px] text-slate-600">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-red-200 text-xs font-medium text-navy-deepest hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Coba Lagi</span>
              </button>
            )}
          </div>
        )}

        {/* Empty Inbox State */}
        {!isLoading && !error && conversations.length === 0 && (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center gap-2.5 text-muted">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-bold text-navy-deepest">
              Belum ada percakapan
            </p>
            <p className="text-[11px] text-slate-500 max-w-50 leading-relaxed">
              Tidak ada percakapan warga yang perlu ditampilkan di wilayah ini.
            </p>
          </div>
        )}

        {/* Empty Search State */}
        {!isLoading && !error && conversations.length > 0 && filteredConversations.length === 0 && (
          <div className="py-10 px-4 flex flex-col items-center justify-center text-center gap-2 text-muted">
            <p className="text-xs font-bold text-navy-deepest">
              Percakapan tidak ditemukan
            </p>
            <p className="text-[11px] text-slate-500 max-w-50">
              Tidak ada percakapan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}

        {/* Render Conversations */}
        {!isLoading &&
          !error &&
          filteredConversations.map((item) => (
            <ConversationItem
              key={item.laporan_id}
              conversation={item}
              isActive={selectedReportId === item.laporan_id}
              onSelect={onSelectConversation}
            />
          ))}
      </div>
    </div>
  );
}

export default ConversationList;

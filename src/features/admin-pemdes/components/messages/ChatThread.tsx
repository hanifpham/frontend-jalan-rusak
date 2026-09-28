import React, { useEffect, useRef } from 'react';
import { CheckCheck, MessageSquare, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { type BackendChatItem } from '../../api/useAdminPemdesData';
import { formatMessageTime, formatDateSeparator } from './chatDateUtils';

export interface ChatThreadProps {
  messages: BackendChatItem[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  citizenName?: string;
}

export function ChatThread({
  messages,
  isLoading,
  error,
  onRetry,
  citizenName,
}: ChatThreadProps): React.JSX.Element {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    if (!isLoading) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Extract date divider from first message timestamp
  const dateDividerText = messages[0]?.waktu_kirim
    ? formatDateSeparator(messages[0].waktu_kirim)
    : null;

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar min-h-60">
      {/* 1. Loading State */}
      {isLoading && (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
          <Loader2 className="w-6 h-6 animate-spin text-navy-primary" aria-hidden="true" />
          <p className="text-xs">Memuat riwayat pesan...</p>
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-severity-berat flex flex-col items-center text-center gap-2 my-6">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">Gagal memuat pesan</p>
          <p className="text-[11px] text-slate-600">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-red-200 text-xs font-medium text-navy-deepest hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Muat Ulang</span>
            </button>
          )}
        </div>
      )}

      {/* 3. Empty Messages State */}
      {!isLoading && !error && messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-16 text-muted">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-navy-deepest">
            Belum ada pesan
          </p>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            {citizenName || 'Warga pelapor'} belum mengirimkan pesan atau pertanyaan untuk laporan ini.
          </p>
        </div>
      )}

      {/* 4. Chat Messages Chronological Thread */}
      {!isLoading && !error && messages.length > 0 && (
        <>
          {/* Date Divider */}
          {dateDividerText && (
            <div className="flex justify-center my-3 select-none">
              <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-3.5 py-1 rounded-full shadow-2xs">
                {dateDividerText}
              </span>
            </div>
          )}

          {messages.map((msg) => {
            const formattedTimeKirim = formatMessageTime(msg.waktu_kirim);
            const formattedTimeBalas = formatMessageTime(msg.waktu_balas);

            return (
              <div key={`chat-msg-${msg.id}`} className="space-y-4">
                {/* Message from Citizen (Left Bubble) */}
                <div className="flex flex-col items-start max-w-[75%] sm:max-w-[65%]">
                  <div className="bg-[#EFF4FB] rounded-2xl rounded-tl-none p-3.5 text-sm text-navy-deepest leading-relaxed shadow-xs">
                    {msg.pesan}
                  </div>
                  {formattedTimeKirim && (
                    <span className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
                      {formattedTimeKirim}
                    </span>
                  )}
                </div>

                {/* Reply from Admin Pemdes (Right Bubble) */}
                {msg.balasan && (
                  <div className="flex flex-col items-end max-w-[75%] sm:max-w-[65%] ml-auto">
                    <div className="bg-navy-primary text-white rounded-2xl rounded-tr-none p-3.5 text-sm leading-relaxed shadow-sm">
                      {msg.balasan}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 mr-1 flex items-center gap-1 justify-end font-medium">
                      {formattedTimeBalas && <span>{formattedTimeBalas}</span>}
                      <CheckCheck className="w-3.5 h-3.5 text-blue-medium shrink-0" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
}

export default ChatThread;

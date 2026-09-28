import React, { useState } from 'react';
import { Send, Loader2, AlertCircle, Paperclip } from 'lucide-react';

export interface MessageComposerProps {
  citizenName?: string;
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
  error?: string | null;
  disabled?: boolean;
  disabledReason?: string;
}

const QUICK_REPLIES = [
  'Siap ditindaklanjuti',
  'Sedang diproses',
  'Terima kasih atas laporannya',
];

export function MessageComposer({
  citizenName,
  onSend,
  isSending,
  error,
  disabled = false,
  disabledReason,
}: MessageComposerProps): React.JSX.Element {
  const [inputText, setInputText] = useState('');

  const handleQuickReplyClick = (reply: string) => {
    if (disabled || isSending) return;
    setInputText(reply);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      await onSend(trimmed);
      setInputText('');
    } catch {
      // Error handled by parent query state
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const placeholderText = disabled
    ? disabledReason || 'Tidak dapat membalas saat ini'
    : citizenName
    ? `Ketik pesan balasan untuk ${citizenName}...`
    : 'Ketik pesan balasan...';

  return (
    <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 shrink-0">
      {/* 1. Quick Reply Chips */}
      {!disabled && (
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 custom-scrollbar select-none">
          <span className="text-xs text-slate-400 font-medium shrink-0">
            Balasan cepat:
          </span>
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReplyClick(reply)}
              className="rounded-full bg-slate-100 hover:bg-slate-200 text-xs px-3 py-1 text-slate-700 transition-colors shrink-0 cursor-pointer active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* 2. Error Alert */}
      {error && (
        <div className="p-2 px-3 bg-red-50 border border-red-200 rounded-xl text-xs text-severity-berat flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Input Form Bar with Disabled Attachment Button */}
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="rounded-full bg-slate-100/90 border border-slate-200 px-4 py-1.5 flex items-center gap-3 shadow-inner mt-1">
          {/* Attachment button: non-functional visual element with tooltip per Section 18 */}
          <button
            type="button"
            disabled
            title="Lampiran belum tersedia"
            className="text-slate-400 hover:text-slate-500 transition-colors flex items-center justify-center shrink-0 cursor-not-allowed"
            aria-label="Lampiran belum tersedia"
          >
            <Paperclip className="w-4 h-4" aria-hidden="true" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSending}
            placeholder={placeholderText}
            className="bg-transparent border-none focus:outline-none text-sm text-slate-800 placeholder-slate-400 w-full py-1 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={disabled || isSending || !inputText.trim()}
            className="w-9 h-9 rounded-full bg-navy-primary text-white flex items-center justify-center hover:bg-navy-deepest transition-all active:scale-95 shadow-sm shrink-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Kirim Pesan Balasan"
            aria-label="Kirim Pesan Balasan"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageComposer;

import React, { useState, useRef } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  Paperclip,
  X,
  Image as ImageIcon,
} from "lucide-react";

export interface MessageComposerProps {
  citizenName?: string;
  onSend: (message: string, attachment?: File | null) => Promise<void>;
  isSending: boolean;
  error?: string | null;
  disabled?: boolean;
  disabledReason?: string;
  quickReplies?: string[];
}

const QUICK_REPLIES = [
  "Siap ditindaklanjuti",
  "Sedang diproses",
  "Terima kasih atas laporannya",
];

const MAX_ATTACHMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function MessageComposer({
  citizenName,
  onSend,
  isSending,
  error,
  disabled = false,
  disabledReason,
  quickReplies = QUICK_REPLIES,
}: MessageComposerProps): React.JSX.Element {
  const [inputText, setInputText] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(
    null,
  );
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleQuickReplyClick = (reply: string) => {
    if (disabled || isSending) return;
    setInputText(reply);
  };

  const handleAttachmentClick = () => {
    if (disabled || isSending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError("Hanya file gambar (JPEG, PNG, WEBP) yang didukung.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
      setValidationError("Ukuran file gambar maksimal 5 MB.");
      e.target.value = "";
      return;
    }

    // Clean up previous preview url if any
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }

    setSelectedAttachment(file);
    const objectUrl = URL.createObjectURL(file);
    setAttachmentPreview(objectUrl);
  };

  const handleCancelAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }
    setSelectedAttachment(null);
    setAttachmentPreview(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();

    // Must have at least text or attachment
    if ((!trimmed && !selectedAttachment) || isSending || disabled) return;

    try {
      await onSend(trimmed, selectedAttachment);
      // On success, reset input & attachment
      setInputText("");
      handleCancelAttachment();
    } catch {
      // Error is handled by parent / error prop, text & attachment are preserved
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const canSubmit =
    !disabled &&
    !isSending &&
    (inputText.trim().length > 0 || selectedAttachment !== null);

  const placeholderText = disabled
    ? disabledReason || "Tidak dapat membalas saat ini"
    : citizenName
      ? `Ketik pesan balasan untuk ${citizenName}...`
      : "Ketik pesan balasan...";

  return (
    <div className="border-t border-slate-100 dark:border-white/10 pt-3 flex flex-col gap-2 shrink-0">
      {/* 1. Quick Reply Chips */}
      {!disabled && (
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 custom-scrollbar select-none">
          <span className="text-xs text-slate-400 dark:text-[#8FA4BA] font-medium shrink-0">
            Balasan cepat:
          </span>
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReplyClick(reply)}
              className="rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs px-3 py-1 text-slate-700 dark:text-[#AFC0D4] transition-colors shrink-0 cursor-pointer active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* 2. Validation or API Error Alerts */}
      {(validationError || error) && (
        <div className="p-2 px-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-severity-berat flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{validationError || error}</span>
          </div>
          {validationError && (
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="p-1 text-red-400 hover:text-red-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 3. Attachment Preview Card */}
      {selectedAttachment && attachmentPreview && (
        <div className="flex items-center justify-between gap-3 p-2 px-3 bg-slate-50 dark:bg-[#12233A] border border-slate-200 dark:border-white/10 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 shrink-0 shadow-2xs">
              <img
                src={attachmentPreview}
                alt="Preview Lampiran"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-navy-deepest truncate">
                {selectedAttachment.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-[#AFC0D4]">
                {(selectedAttachment.size / 1024).toFixed(0)} KB • Siap dikirim
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancelAttachment}
            disabled={isSending}
            className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-50"
            title="Batalkan lampiran"
            aria-label="Batalkan lampiran"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Input Form Bar with Real Attachment Button */}
      <form onSubmit={handleFormSubmit} className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isSending}
          tabIndex={-1}
        />

        <div className="rounded-full bg-slate-100/90 dark:bg-[#12233A] border border-slate-200 dark:border-[rgba(193,232,255,0.12)] px-4 py-1.5 flex items-center gap-3 shadow-inner mt-1">
          {/* Functional Attachment Button */}
          <button
            type="button"
            onClick={handleAttachmentClick}
            disabled={disabled || isSending}
            title={
              selectedAttachment ? "Ganti lampiran gambar" : "Lampirkan gambar"
            }
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
              selectedAttachment
                ? "text-navy-primary dark:text-blue-pale bg-blue-pale/50 dark:bg-[#5483B3]/20"
                : "text-slate-500 dark:text-[#AFC0D4] hover:text-navy-primary dark:hover:text-navy-deepest hover:bg-slate-200/60 dark:hover:bg-white/10"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Lampirkan gambar"
          >
            {selectedAttachment ? (
              <ImageIcon className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Paperclip className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSending}
            placeholder={placeholderText}
            className="bg-transparent border-none focus:outline-none text-sm text-slate-800 dark:text-navy-deepest placeholder-slate-400 dark:placeholder-[#8FA4BA] w-full py-1 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!canSubmit}
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

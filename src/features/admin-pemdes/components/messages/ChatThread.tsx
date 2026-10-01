import React, { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Loader2,
  X,
  ImageOff,
} from "lucide-react";
import { type BackendChatItem } from "../../api/useAdminPemdesData";
import { formatMessageTime, formatDateSeparator } from "./chatDateUtils";

export interface ChatThreadProps {
  messages: BackendChatItem[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  citizenName?: string;
  reportId?: number;
}

export function ChatThread({
  messages,
  isLoading,
  error,
  onRetry,
  citizenName,
  reportId,
}: ChatThreadProps): React.JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevReportIdRef = useRef<number | undefined>(reportId);
  const prevMessagesCountRef = useRef<number>(messages.length);

  // Lightbox / Image Preview Modal state
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Helper to scroll the message container ref directly (never window.scrollTo)
  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // 1. Initial load or report selection change: scroll to bottom immediately
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      if (reportId !== prevReportIdRef.current) {
        prevReportIdRef.current = reportId;
        prevMessagesCountRef.current = messages.length;
        requestAnimationFrame(() => {
          scrollToBottom("auto");
        });
      }
    }
  }, [reportId, isLoading, messages.length]);

  // 2. Initial load completion
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // 3. Track reply changes and message additions to scroll to latest message smoothly
  const lastMsg = messages[messages.length - 1];
  const lastReplyKey = lastMsg
    ? `${lastMsg.id}-${Boolean(lastMsg.balasan)}-${Boolean(lastMsg.lampiran_balasan?.url || lastMsg.lampiran_balasan_url)}`
    : "";
  const prevLastReplyKeyRef = useRef<string>(lastReplyKey);

  useEffect(() => {
    const isNewMessage = messages.length > prevMessagesCountRef.current;
    const isNewReply = lastReplyKey !== prevLastReplyKeyRef.current;

    if (isNewMessage || isNewReply) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }

    prevMessagesCountRef.current = messages.length;
    prevLastReplyKeyRef.current = lastReplyKey;
  }, [messages.length, lastReplyKey]);

  // Handle ESC for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxImage(null);
      }
    };
    if (lightboxImage) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxImage]);

  const handleImageError = (url: string) => {
    setBrokenImages((prev) => ({ ...prev, [url]: true }));
  };

  // Extract date divider from first message timestamp
  const dateDividerText = messages[0]?.waktu_kirim
    ? formatDateSeparator(messages[0].waktu_kirim)
    : null;

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 space-y-4 pr-1 custom-scrollbar relative"
    >
      {/* 1. Loading State */}
      {isLoading && (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
          <Loader2
            className="w-6 h-6 animate-spin text-navy-primary"
            aria-hidden="true"
          />
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
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-[#8FA4BA]">
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-navy-deepest">
            Belum ada pesan
          </p>
          <p className="text-xs text-slate-500 dark:text-[#AFC0D4] max-w-xs leading-relaxed">
            {citizenName || "Warga pelapor"} belum mengirimkan pesan atau
            pertanyaan untuk laporan ini.
          </p>
        </div>
      )}

      {/* 4. Chat Messages Chronological Thread */}
      {!isLoading && !error && messages.length > 0 && (
        <>
          {/* Date Divider */}
          {dateDividerText && (
            <div className="flex justify-center my-3 select-none">
              <span className="bg-slate-100 dark:bg-[#12233A] text-slate-500 dark:text-[#AFC0D4] text-[11px] font-medium px-3.5 py-1 rounded-full shadow-2xs">
                {dateDividerText}
              </span>
            </div>
          )}

          {messages.map((msg) => {
            const formattedTimeKirim = formatMessageTime(msg.waktu_kirim);
            const formattedTimeBalas = formatMessageTime(msg.waktu_balas);

            const hasBalasanText = Boolean(msg.balasan && msg.balasan.trim());
            const attachmentUrl =
              msg.lampiran_balasan?.url || msg.lampiran_balasan_url;
            const attachmentName =
              msg.lampiran_balasan?.nama || "Foto Lampiran";
            const hasBalasan = hasBalasanText || Boolean(attachmentUrl);

            return (
              <div key={`chat-msg-${msg.id}`} className="space-y-4">
                {/* Message from Citizen (Left Bubble) */}
                <div className="flex flex-col items-start max-w-[75%] sm:max-w-[65%]">
                  <div className="bg-[#EFF4FB] dark:bg-[#12233A] rounded-2xl rounded-tl-none p-3.5 text-sm text-navy-deepest leading-relaxed shadow-xs wrap-anywhere whitespace-pre-wrap">
                    {msg.pesan}
                  </div>
                  {formattedTimeKirim && (
                    <span className="text-[10px] text-slate-400 dark:text-[#8FA4BA] mt-1 ml-1 font-medium">
                      {formattedTimeKirim}
                    </span>
                  )}
                </div>

                {/* Reply from Admin Pemdes (Right Bubble) */}
                {hasBalasan && (
                  <div className="flex flex-col items-end max-w-[80%] sm:max-w-[65%] ml-auto">
                    <div className="bg-navy-primary dark:bg-[#5483B3] text-white rounded-2xl rounded-tr-none p-3.5 text-sm leading-relaxed shadow-sm space-y-2.5 max-w-full">
                      {/* Optional Text Message */}
                      {hasBalasanText && (
                        <p className="whitespace-pre-wrap wrap-anywhere">
                          {msg.balasan}
                        </p>
                      )}

                      {/* Attachment Image Display */}
                      {attachmentUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/20 bg-black/10 max-w-full">
                          {brokenImages[attachmentUrl] ? (
                            <div className="p-4 flex flex-col items-center justify-center text-center text-white/80 gap-1.5 py-6">
                              <ImageOff className="w-6 h-6 text-white/60" />
                              <span className="text-xs">
                                Gambar gagal dimuat
                              </span>
                            </div>
                          ) : (
                            <img
                              src={attachmentUrl}
                              alt={attachmentName}
                              loading="lazy"
                              onClick={() =>
                                setLightboxImage({
                                  url: attachmentUrl,
                                  title: attachmentName,
                                })
                              }
                              onError={() => handleImageError(attachmentUrl)}
                              className="max-h-60 max-w-full w-auto rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              title="Klik untuk memperbesar gambar"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 dark:text-[#8FA4BA] mt-1 mr-1 flex items-center gap-1 justify-end font-medium">
                      {formattedTimeBalas && <span>{formattedTimeBalas}</span>}
                      <CheckCheck
                        className="w-3.5 h-3.5 text-blue-medium dark:text-blue-pale shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Sederhana Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] flex flex-col items-center bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-1.5 text-white hover:text-slate-300 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup pratinjau gambar"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
            {lightboxImage.title && (
              <p className="mt-2 text-xs text-white/80 font-medium">
                {lightboxImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatThread;

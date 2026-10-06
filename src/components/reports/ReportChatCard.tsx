import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  CornerDownRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import {
  useReportChat,
  useReplyChat,
  type BackendChatItem,
} from "@/features/admin-pemdes/api/useAdminPemdesData";

export interface ReportChatCardProps {
  reportId: number;
  reporterName?: string;
}

function getInitials(name?: string): string {
  if (!name) return "W";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) return "W";
  if (parts.length === 1 || !second) {
    return first.slice(0, 2).toUpperCase();
  }
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

export function ReportChatCard({
  reportId,
  reporterName,
}: ReportChatCardProps): React.JSX.Element {
  const { role } = useAuth();
  const isPU = role === "admin_pu";
  const authorityName = isPU ? "Dinas PU" : "Pemdes";
  const adminSenderLabel = isPU ? "Admin Dinas PU" : "Admin Pemdes";

  const { data: messages = [], isLoading, error } = useReportChat(reportId);
  const replyMutation = useReplyChat(reportId);

  const [activeReplyChatId, setActiveReplyChatId] = useState<number | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find latest message for cardlet preview
  const latestMessage: BackendChatItem | undefined =
    messages.length > 0 ? messages[messages.length - 1] : undefined;

  const handleCloseModal = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Block any trailing ghost clicks from triggering underlying dropzone or file input
    const stopGhostClick = (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
    };
    window.addEventListener("click", stopGhostClick, { capture: true, once: true });
    setTimeout(() => {
      window.removeEventListener("click", stopGhostClick, { capture: true });
    }, 400);

    setIsModalOpen(false);
  };

  const handleSendReply = async (chatId: number) => {
    if (!replyText.trim()) return;
    setActionError(null);

    try {
      await replyMutation.mutateAsync({
        chatId,
        balasan: replyText.trim(),
      });
      setReplyText("");
      setActiveReplyChatId(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Gagal mengirim balasan chat.",
      );
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-[rgba(193,232,255,0.12)] shadow-sm p-6 flex flex-col gap-4">
        {/* Header: Chat Icon + Title & Privat Badge */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare
              className="w-5 h-5 text-navy-primary dark:text-blue-pale"
              aria-hidden="true"
            />
            <h2 className="text-[17px] font-bold text-navy-deepest">
              Chat dengan Pelapor
            </h2>
          </div>

          <span
            className="inline-flex items-center gap-1 bg-canvas dark:bg-[#12233A] text-muted dark:text-[#AFC0D4] border border-blue-pale/40 dark:border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold select-none"
            title="Percakapan privat antara warga pelapor dan instansi berwenang"
          >
            Privat
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 flex items-center justify-center gap-2 text-muted dark:text-[#AFC0D4] text-xs">
            <Loader2
              className="w-4 h-4 animate-spin text-navy-primary dark:text-blue-pale"
              aria-hidden="true"
            />
            <span>Memuat pesan percakapan...</span>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-severity-berat flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Gagal memuat riwayat percakapan.</span>
          </div>
        )}

        {/* Content: Has Messages vs Empty State */}
        {!isLoading && !error && (
          <>
            {latestMessage ? (
              <div className="flex flex-col gap-3">
                {/* Latest Citizen Message Cardlet */}
                <div className="flex items-start gap-3 p-3.5 bg-canvas/70 dark:bg-[#12233A] rounded-2xl border border-blue-pale/40 dark:border-white/10">
                  <div className="w-10 h-10 rounded-full bg-navy-primary text-white font-bold flex items-center justify-center shrink-0 text-[13px] shadow-xs select-none">
                    {getInitials(latestMessage.user?.name || reporterName)}
                  </div>

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[13px] font-bold text-navy-deepest truncate">
                        {latestMessage.user?.name || reporterName || "Pelapor"}
                      </span>
                      <span className="text-[11px] text-muted dark:text-[#8FA4BA] shrink-0">
                        {latestMessage.waktu_kirim}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted dark:text-[#AFC0D4] line-clamp-2 leading-relaxed">
                      &ldquo;{latestMessage.pesan}&rdquo;
                    </p>

                    {/* Admin Reply Indicator if already replied */}
                    {latestMessage.balasan ? (
                      <div className="mt-1 pt-1.5 border-t border-blue-pale/30 dark:border-white/10 flex items-start gap-1.5 text-[11px] text-navy-primary dark:text-blue-pale font-medium">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-status-selesai shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          Sudah dibalas: &ldquo;{latestMessage.balasan}&rdquo;
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-status-menunggu" />
                        <span className="text-[11px] font-medium text-[#B45309]">
                          Belum dibalas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Quick Reply Form if not replied */}
                {!latestMessage.balasan && (
                  <div className="flex flex-col gap-2 pt-1">
                    {activeReplyChatId === latestMessage.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tulis balasan untuk pelapor..."
                          className="w-full bg-white dark:bg-[#12233A] border border-blue-pale/60 dark:border-white/10 rounded-xl p-2.5 text-xs text-navy-deepest placeholder:text-muted/60 dark:placeholder:text-[#8FA4BA]/60 focus:outline-none focus:border-navy-primary"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReplyChatId(null);
                              setReplyText("");
                            }}
                            className="px-3 py-1 rounded-full text-xs text-muted hover:bg-canvas dark:hover:bg-white/5 cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            disabled={
                              replyMutation.isPending || !replyText.trim()
                            }
                            onClick={() => handleSendReply(latestMessage.id)}
                            className="inline-flex items-center gap-1.5 bg-navy-primary hover:bg-navy-deepest text-white px-3.5 py-1.5 rounded-full text-xs font-semibold disabled:opacity-50 cursor-pointer"
                          >
                            {replyMutation.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Kirim Balasan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveReplyChatId(latestMessage.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-primary hover:text-navy-deepest self-start cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Balas pesan ini langsung</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Honest Empty State (Rule 16: No fake messages) */
              <div className="py-6 px-4 flex flex-col items-center justify-center gap-2 bg-canvas/40 dark:bg-[#12233A]/40 rounded-2xl border border-blue-pale/30 dark:border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-canvas dark:bg-[#12233A] border border-blue-pale/50 dark:border-white/10 flex items-center justify-center text-blue-medium">
                  <MessageSquare
                    className="w-5 h-5 text-muted/60"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-navy-deepest">
                    Belum Ada Pesan Percakapan
                  </p>
                  <p className="text-[11px] text-muted max-w-xs">
                    Pelapor belum mengirimkan pertanyaan atau pesan lanjutan
                    untuk laporan ini.
                  </p>
                </div>
              </div>
            )}

            {actionError && (
              <p className="text-xs text-severity-berat">{actionError}</p>
            )}

            {/* Open Full Chat Modal Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 text-[13px] font-bold text-navy-primary hover:bg-canvas dark:hover:bg-white/5 border border-navy-primary/30 px-4 py-2.5 rounded-full transition-colors w-full cursor-pointer select-none"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>
                {messages.length > 0
                  ? `Buka Chat Percakapan (${messages.length})`
                  : "Buka Chat Percakapan"}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Full Conversation Thread Modal (Rendered via createPortal to isolate from page click events) */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Percakapan dengan Pelapor"
          >
            {/* Modal Backdrop with capture-phase click/touch protection */}
            <div
              className="fixed inset-0"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleCloseModal}
              aria-hidden="true"
            />

            <div className="relative max-w-lg w-full bg-white dark:bg-[#0D1A2D] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh] border border-blue-pale/40 dark:border-white/10">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#0D1A2D]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-primary text-white font-bold flex items-center justify-center text-sm shadow-xs select-none">
                    {getInitials(reporterName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-deepest">
                      {reporterName || "Warga Pelapor"}
                    </h3>
                    <p className="text-[11px] text-muted dark:text-[#8FA4BA]">
                      Laporan #{reportId} • Jalur Privat {authorityName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-canvas dark:bg-[#12233A] hover:bg-gray-200 dark:hover:bg-white/10 text-navy-deepest dark:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Percakapan"
                  title="Tutup Percakapan"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Messages Thread Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-canvas/40 dark:bg-[#07111F] min-h-60">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted dark:text-[#8FA4BA] text-xs">
                    Belum ada riwayat pesan percakapan.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={`modal-msg-${msg.id}`} className="space-y-3">
                      {/* Warga Message Bubble (Left) */}
                      <div className="flex items-start gap-2.5 max-w-[85%]">
                        <div className="w-7 h-7 rounded-full bg-navy-primary text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {getInitials(msg.user?.name || reporterName)}
                        </div>
                        <div className="bg-white dark:bg-[#12233A] p-3.5 rounded-2xl rounded-tl-sm border border-blue-pale/40 dark:border-white/10 shadow-xs space-y-1">
                          <div className="flex items-center justify-between gap-3 text-[10px] text-muted dark:text-[#8FA4BA]">
                            <span className="font-semibold text-navy-deepest dark:text-white">
                              {msg.user?.name || reporterName || "Pelapor"}
                            </span>
                            <span>{msg.waktu_kirim}</span>
                          </div>
                          <p className="text-xs text-navy-deepest dark:text-[#AFC0D4] leading-relaxed">
                            {msg.pesan}
                          </p>
                        </div>
                      </div>

                      {/* Admin Reply Bubble (Right) */}
                      {msg.balasan ? (
                        <div className="flex items-start gap-2.5 max-w-[85%] ml-auto justify-end">
                          <div className="bg-navy-primary dark:bg-[#5483B3] text-white p-3.5 rounded-2xl rounded-tr-sm shadow-xs space-y-1">
                            <div className="flex items-center justify-between gap-3 text-[10px] text-white/70">
                              <span className="font-semibold text-white">
                                {adminSenderLabel}
                              </span>
                              <span>{msg.waktu_balas}</span>
                            </div>
                            <p className="text-xs text-white leading-relaxed">
                              {msg.balasan}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Reply box for unanswered message */
                        <div className="pl-9 pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={
                                activeReplyChatId === msg.id ? replyText : ""
                              }
                              onChange={(e) => {
                                setActiveReplyChatId(msg.id);
                                setReplyText(e.target.value);
                              }}
                              placeholder="Ketik balasan untuk pesan ini..."
                              className="flex-1 bg-white dark:bg-[#12233A] border border-blue-pale/50 dark:border-white/10 rounded-full px-3.5 py-1.5 text-xs text-navy-deepest dark:text-white placeholder:text-muted/60 dark:placeholder:text-[#8FA4BA]/60 focus:outline-none focus:border-navy-primary"
                            />
                            <button
                              type="button"
                              disabled={
                                replyMutation.isPending ||
                                activeReplyChatId !== msg.id ||
                                !replyText.trim()
                              }
                              onClick={() => handleSendReply(msg.id)}
                              className="bg-navy-primary hover:bg-navy-deepest text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                            >
                              {replyMutation.isPending &&
                              activeReplyChatId === msg.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              <span>Balas</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default ReportChatCard;

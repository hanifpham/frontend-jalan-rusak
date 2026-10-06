import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare, ShieldAlert } from "lucide-react";
import {
  useAdminChatInbox,
  useReportChat,
  useReplyChat,
  useAdminReportDetail,
} from "@/features/admin-pemdes/api/useAdminPemdesData";
import { isForbiddenError } from "@/services/api/errors";
import {
  MessagesHeader,
  ConversationList,
  ChatHeader,
  ReportContextBar,
  ChatThread,
  MessageComposer,
} from "@/components/messages";

export function AdminPUMessagesPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialReportParam = searchParams.get("reportId");

  // 1. Fetch Conversations Inbox from GET /api/admin/chat
  const {
    data: rawInbox = [],
    isLoading: isInboxLoading,
    error: inboxError,
    refetch: refetchInbox,
  } = useAdminChatInbox();

  // ATURAN AKSES & SECURITY:
  // Admin PU strictly only handles reports with jenis_jalan === 'kabupaten'.
  // Defensive frontend filtering ensures zero cross-authority leakage.
  const inbox = useMemo(() => {
    return (rawInbox || []).filter(
      (item) => (item.jenis_jalan || "").toLowerCase() === "kabupaten",
    );
  }, [rawInbox]);

  // Selected report state
  const [selectedReportId, setSelectedReportId] = useState<number | null>(
    () => {
      if (initialReportParam) {
        const parsed = parseInt(initialReportParam, 10);
        return !isNaN(parsed) && parsed > 0 ? parsed : null;
      }
      return null;
    },
  );

  const handleSelectConversation = (reportId: number) => {
    setSelectedReportId(reportId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("reportId", String(reportId));
        return next;
      },
      { replace: true },
    );
  };

  const handleBackToList = () => {
    setSelectedReportId(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("reportId");
        return next;
      },
      { replace: true },
    );
  };

  // Auto-select first conversation when inbox loads, if nothing selected
  useEffect(() => {
    if (inbox.length > 0 && selectedReportId === null) {
      const firstId = inbox[0]?.laporan_id;
      if (firstId) setSelectedReportId(firstId);
    } else if (inbox.length > 0 && selectedReportId !== null) {
      const exists = inbox.some((item) => item.laporan_id === selectedReportId);
      if (!exists && !initialReportParam) {
        const firstId = inbox[0]?.laporan_id;
        if (firstId) setSelectedReportId(firstId);
      }
    }
  }, [inbox, selectedReportId, initialReportParam]);

  // Active inbox item metadata
  const activeInboxItem = inbox.find(
    (item) => item.laporan_id === selectedReportId,
  );

  // 2. Fetch Chat Thread from GET /api/admin/laporan/:id/chat
  const {
    data: messages = [],
    isLoading: isChatLoading,
    error: chatError,
    refetch: refetchChat,
  } = useReportChat(selectedReportId ?? undefined);

  // 3. Fetch Report Context from GET /api/admin/laporan/:id
  const { data: reportDetailData, error: reportDetailError } =
    useAdminReportDetail(selectedReportId ?? undefined);

  // 4. Reply Mutation via PUT /api/admin/chat/:chat_id
  const replyMutation = useReplyChat(selectedReportId ?? undefined);
  const [sendError, setSendError] = useState<string | null>(null);

  // Check if loaded report is outside Kabupaten authority
  const loadedReportAuthority = (
    reportDetailData?.report?.roadAuthority || ""
  ).toLowerCase();
  const isAuthorityDenied = Boolean(
    loadedReportAuthority && loadedReportAuthority !== "kabupaten",
  );

  // Handle Send Reply with optional attachment
  const handleSendReply = async (
    messageText: string,
    attachmentFile?: File | null,
  ) => {
    if (!selectedReportId || messages.length === 0 || isAuthorityDenied) return;
    setSendError(null);

    // Identify target chat_id to reply:
    // Prefer the latest unanswered citizen message; fallback to the latest message in thread
    const unanswered = messages.filter(
      (m) => !m.balasan && !m.lampiran_balasan?.url && !m.lampiran_balasan_url,
    );
    const targetChat =
      unanswered.length > 0
        ? unanswered[unanswered.length - 1]
        : messages[messages.length - 1];

    if (!targetChat) return;

    try {
      await replyMutation.mutateAsync({
        chatId: targetChat.id,
        balasan: messageText,
        lampiran: attachmentFile,
      });
      setSendError(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim balasan chat.";
      setSendError(msg);
      throw err;
    }
  };

  // Handle Refresh Conversation (Chat Thread + Inbox)
  const handleRefreshConversation = async () => {
    await Promise.all([refetchChat(), refetchInbox()]);
  };

  // Determine if composer should be disabled
  const isChatForbidden =
    isForbiddenError(chatError) ||
    isForbiddenError(reportDetailError) ||
    isAuthorityDenied;

  const isComposerDisabled =
    !selectedReportId ||
    isChatForbidden ||
    (messages.length === 0 && !isChatLoading);

  const composerDisabledReason = isChatForbidden
    ? "Akses ditolak: Admin PU hanya dapat merespon laporan jalan Kabupaten"
    : messages.length === 0 && !isChatLoading
      ? "Belum ada pesan dari warga untuk dibalas"
      : undefined;

  return (
    <div className="flex flex-col gap-4 max-w-full min-h-0 -mb-12">
      {/* 1. Page Header & Scope Chips (Identical structure to Admin Pemdes) */}
      <MessagesHeader
        title="Pusat Pesan & Percakapan"
        subtitle="Komunikasi privat dengan warga pelapor terkait laporan jalan kewenangan Kabupaten."
        locationLabel="Kabupaten Indramayu"
        scopeLabel="Jalan Kabupaten • Privat"
      />

      {/* 2. Workspace 2-Kolom (Daftar Percakapan & Area Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-stretch h-[calc(100vh-246px)] min-h-110 min-w-0">
        {/* Kolom Kiri: Daftar Percakapan (~300px) */}
        <div
          className={`w-full h-full min-h-0 ${
            selectedReportId !== null ? "hidden lg:block" : "block"
          }`}
        >
          <ConversationList
            conversations={inbox}
            selectedReportId={selectedReportId}
            onSelectConversation={handleSelectConversation}
            isLoading={isInboxLoading}
            error={inboxError instanceof Error ? inboxError.message : null}
            onRetry={refetchInbox}
          />
        </div>

        {/* Kolom Kanan: Area Chat (Card Putih Rounded 24px) */}
        <div
          className={`w-full h-full min-h-0 ${
            selectedReportId === null ? "hidden lg:block" : "block"
          }`}
        >
          <div className="w-full h-full rounded-[24px] bg-white dark:bg-[#0D1A2D] border border-slate-200/80 dark:border-[rgba(193,232,255,0.12)] shadow-sm p-5 flex flex-col min-h-0 overflow-hidden">
            {selectedReportId &&
            (activeInboxItem || reportDetailData?.report) ? (
              isChatForbidden ? (
                /* Cross-Authority Access Forbidden State */
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-8">
                  <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 text-severity-berat flex items-center justify-center">
                    <ShieldAlert className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-navy-deepest dark:text-white">
                    Akses Chat Ditolak
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#AFC0D4] max-w-sm leading-relaxed">
                    Sesuai aturan akses, Admin PU hanya berwenang berkomunikasi
                    pada laporan kerusakan jalan dengan kewenangan{" "}
                    <strong className="text-navy-primary dark:text-blue-pale font-bold">
                      KABUPATEN
                    </strong>
                    . Chat untuk laporan Desa, Provinsi, dan Nasional tidak
                    dapat diakses oleh Admin PU.
                  </p>
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="mt-2 text-xs font-semibold px-4 py-2 rounded-full bg-slate-100 dark:bg-[#12233A] text-navy-deepest dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    Kembali ke Daftar Percakapan
                  </button>
                </div>
              ) : (
                <>
                  {/* 2.1 Chat Header */}
                  <ChatHeader
                    citizenName={
                      activeInboxItem?.nama_warga ||
                      reportDetailData?.report?.reporterName
                    }
                    reportId={selectedReportId}
                    villageName={
                      activeInboxItem?.nama_wilayah || "Kabupaten Indramayu"
                    }
                    profilePhoto={activeInboxItem?.profile_photo}
                    reportDetail={reportDetailData?.report}
                    fallbackTitle={activeInboxItem?.judul_laporan}
                    fallbackStatus={activeInboxItem?.status_laporan}
                    fallbackJenisJalan={
                      activeInboxItem?.jenis_jalan || "kabupaten"
                    }
                    detailPath={`/pu/laporan/${selectedReportId}`}
                    onBackToList={handleBackToList}
                    onRefreshConversation={handleRefreshConversation}
                  />

                  {/* 2.2 Report Context Bar */}
                  <ReportContextBar
                    report={reportDetailData?.report}
                    fallbackTitle={activeInboxItem?.judul_laporan}
                    fallbackVillage={
                      activeInboxItem?.nama_wilayah || "Kabupaten Indramayu"
                    }
                    fallbackStatus={activeInboxItem?.status_laporan}
                    fallbackAuthority={
                      activeInboxItem?.jenis_jalan || "kabupaten"
                    }
                  />

                  {/* 2.3 Chat Thread Body */}
                  <ChatThread
                    messages={messages}
                    isLoading={isChatLoading}
                    error={
                      chatError instanceof Error ? chatError.message : null
                    }
                    onRetry={refetchChat}
                    citizenName={
                      activeInboxItem?.nama_warga ||
                      reportDetailData?.report?.reporterName
                    }
                    reportId={selectedReportId}
                  />

                  {/* 2.4 Composer (Sticky Bottom) */}
                  <MessageComposer
                    citizenName={
                      activeInboxItem?.nama_warga ||
                      reportDetailData?.report?.reporterName
                    }
                    onSend={handleSendReply}
                    isSending={replyMutation.isPending}
                    error={sendError}
                    disabled={isComposerDisabled}
                    disabledReason={composerDisabledReason}
                    quickReplies={[
                      "Laporan sedang diverifikasi Dinas PU",
                      "Tim teknis sedang dijadwalkan ke lokasi",
                      "Terima kasih atas laporannya",
                    ]}
                  />
                </>
              )
            ) : (
              /* Empty Selection State (Identical to Admin Pemdes) */
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-8 text-muted">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-[#8FA4BA]">
                  <MessageSquare className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-navy-deepest dark:text-white">
                  Pusat Percakapan Warga
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#AFC0D4] max-w-sm leading-relaxed">
                  Pilih salah satu percakapan dari daftar di sebelah kiri untuk
                  melihat pesan dan membalas warga pelapor terkait kerusakan
                  jalan kewenangan kabupaten.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPUMessagesPage;

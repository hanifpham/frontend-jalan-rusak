import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";
import {
  useAdminChatInbox,
  useReportChat,
  useReplyChat,
  useAdminReportDetail,
} from "../api/useAdminPemdesData";
import { MessagesHeader } from "../components/messages/MessagesHeader";
import { ConversationList } from "../components/messages/ConversationList";
import { ChatHeader } from "../components/messages/ChatHeader";
import { ReportContextBar } from "../components/messages/ReportContextBar";
import { ChatThread } from "../components/messages/ChatThread";
import { MessageComposer } from "../components/messages/MessageComposer";
import { MessageSquare } from "lucide-react";

export function AdminPemdesMessagesPage(): React.JSX.Element {
  const { user } = useAuth();

  // Dynamic village name derived from authenticated session
  const villageName =
    user?.wilayahId === 2
      ? "Lobener Lor"
      : user?.wilayahId === 1
        ? "Indramayu"
        : user?.wilayahId
          ? `Wilayah #${user.wilayahId}`
          : "Lobener Lor";

  // 1. Fetch Conversations Inbox from verified GET /api/admin/chat
  const {
    data: inbox = [],
    isLoading: isInboxLoading,
    error: inboxError,
    refetch: refetchInbox,
  } = useAdminChatInbox();

  // Active selected report state
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  // Auto-select the first conversation when inbox loads, if nothing selected
  useEffect(() => {
    if (inbox.length > 0 && selectedReportId === null) {
      const firstId = inbox[0]?.laporan_id;
      if (firstId) setSelectedReportId(firstId);
    } else if (inbox.length > 0 && selectedReportId !== null) {
      // Ensure selected ID still exists in inbox
      const exists = inbox.some((item) => item.laporan_id === selectedReportId);
      if (!exists) {
        const firstId = inbox[0]?.laporan_id;
        if (firstId) setSelectedReportId(firstId);
      }
    }
  }, [inbox, selectedReportId]);

  // Active inbox item metadata
  const activeInboxItem = inbox.find(
    (item) => item.laporan_id === selectedReportId,
  );

  // 2. Fetch Chat Thread from verified GET /api/admin/laporan/:id/chat
  const {
    data: messages = [],
    isLoading: isChatLoading,
    error: chatError,
    refetch: refetchChat,
  } = useReportChat(selectedReportId ?? undefined);

  // 3. Fetch Report Context from verified GET /api/admin/laporan/:id
  const { data: reportDetailData } = useAdminReportDetail(
    selectedReportId ?? undefined,
  );

  // 4. Reply Mutation via verified PUT /api/admin/chat/:chat_id
  const replyMutation = useReplyChat(selectedReportId ?? undefined);
  const [sendError, setSendError] = useState<string | null>(null);

  // Handle Send Reply with optional attachment
  const handleSendReply = async (
    messageText: string,
    attachmentFile?: File | null,
  ) => {
    if (!selectedReportId || messages.length === 0) return;
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
  const isComposerDisabled =
    !selectedReportId || (messages.length === 0 && !isChatLoading);
  const composerDisabledReason =
    messages.length === 0 && !isChatLoading
      ? "Belum ada pesan dari warga untuk dibalas"
      : undefined;

  return (
    <div className="flex flex-col gap-4 max-w-full min-h-0 -mb-12">
      {/* 1. Page Header & Scope Chips */}
      <MessagesHeader villageName={villageName} />

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
            onSelectConversation={(reportId) => setSelectedReportId(reportId)}
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
            {selectedReportId && activeInboxItem ? (
              <>
                {/* 2.1 Chat Header */}
                <ChatHeader
                  citizenName={activeInboxItem.nama_warga}
                  reportId={selectedReportId}
                  villageName={activeInboxItem.nama_wilayah || villageName}
                  profilePhoto={activeInboxItem.profile_photo}
                  reportDetail={reportDetailData?.report}
                  fallbackTitle={activeInboxItem.judul_laporan}
                  fallbackStatus={activeInboxItem.status_laporan}
                  fallbackJenisJalan={activeInboxItem.jenis_jalan}
                  onBackToList={() => setSelectedReportId(null)}
                  onRefreshConversation={handleRefreshConversation}
                />

                {/* 2.2 Report Context Bar */}
                <ReportContextBar
                  report={reportDetailData?.report}
                  fallbackTitle={activeInboxItem.judul_laporan}
                  fallbackVillage={activeInboxItem.nama_wilayah || villageName}
                  fallbackStatus={activeInboxItem.status_laporan}
                />

                {/* 2.3 Chat Thread Body */}
                <ChatThread
                  messages={messages}
                  isLoading={isChatLoading}
                  error={chatError instanceof Error ? chatError.message : null}
                  onRetry={refetchChat}
                  citizenName={activeInboxItem.nama_warga}
                  reportId={selectedReportId}
                />

                {/* 2.4 Composer (Sticky Bottom) */}
                <MessageComposer
                  citizenName={activeInboxItem.nama_warga}
                  onSend={handleSendReply}
                  isSending={replyMutation.isPending}
                  error={sendError}
                  disabled={isComposerDisabled}
                  disabledReason={composerDisabledReason}
                />
              </>
            ) : (
              /* Empty Selection State */
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 p-8 text-muted">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-[#8FA4BA]">
                  <MessageSquare className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-navy-deepest">
                  Pusat Percakapan Warga
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#AFC0D4] max-w-sm leading-relaxed">
                  Pilih salah satu percakapan dari daftar di sebelah kiri untuk
                  melihat pesan dan membalas warga pelapor di wilayah penugasan
                  Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPemdesMessagesPage;

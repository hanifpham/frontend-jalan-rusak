import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  FileText,
  RefreshCw,
  MessageSquare,
  Reply,
  Clock,
  Check,
  Trash2,
} from "lucide-react";
import {
  type NotificationItem,
  isMessageNotification,
  extractStatusFromNotification,
} from "@/types/notification";
import { formatRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { AuthorityBadge } from "@/components/ui/AuthorityBadge";
import { StatusBadge } from "@/components/ui/Badge";

export interface NotificationItemCardProps {
  item: NotificationItem;
  scopeAuthority: "kabupaten" | "desa";
  reportsBasePath: string;
  messagesBasePath: string;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

/**
 * Returns appropriate Lucide icon component according to backend notification content
 */
function getNotificationIcon(judul: string, pesan = "") {
  const lower = `${judul} ${pesan}`.toLowerCase();
  if (lower.includes("balasan")) {
    return Reply;
  }
  if (isMessageNotification(judul, pesan)) {
    return MessageSquare;
  }
  if (lower.includes("status")) {
    return RefreshCw;
  }
  if (lower.includes("laporan baru") || lower.includes("laporan")) {
    return FileText;
  }
  return Bell;
}

export function NotificationItemCard({
  item,
  scopeAuthority,
  reportsBasePath,
  messagesBasePath,
  onMarkRead,
  onDelete,
  isDeleting = false,
}: NotificationItemCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const IconComponent = getNotificationIcon(item.judul, item.pesan);
  const detectedStatus = extractStatusFromNotification(item.judul, item.pesan);
  const isChat = isMessageNotification(item.judul, item.pesan);

  const handleClick = () => {
    // 1. Mark as read if currently unread
    if (!item.isRead) {
      onMarkRead(item.id);
    }

    // 2. Navigate based on notification category
    if (isChat) {
      navigate(messagesBasePath);
    } else if (item.laporanId) {
      navigate(`${reportsBasePath}/${item.laporanId}`);
    }
  };

  const handleMarkReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isRead) {
      onMarkRead(item.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium select-none",
        !item.isRead
          ? "bg-blue-pale/15 dark:bg-[#5483B3]/15 border-blue-pale/60 dark:border-[#5483B3]/30 hover:bg-blue-pale/25 dark:hover:bg-[#5483B3]/25 shadow-xs"
          : "bg-white dark:bg-[#12233A] border-blue-pale/30 dark:border-white/5 hover:bg-canvas/80 dark:hover:bg-white/5"
      )}
      aria-label={`${item.judul}: ${item.pesan}`}
    >
      {/* Category Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs",
          !item.isRead
            ? "bg-blue-pale dark:bg-[#5483B3]/30 text-navy-primary dark:text-blue-pale"
            : "bg-canvas dark:bg-white/5 text-muted dark:text-[#8FA4BA] border border-blue-pale/40 dark:border-white/10"
        )}
        aria-hidden="true"
      >
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Content Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h4
              className={cn(
                "text-sm truncate",
                !item.isRead
                  ? "font-bold text-navy-deepest dark:text-white"
                  : "font-semibold text-slate-700 dark:text-[#AFC0D4]"
              )}
            >
              {item.judul}
            </h4>
            {!item.isRead && (
              <span
                className="w-2 h-2 rounded-full bg-severity-sedang shrink-0"
                title="Belum dibaca"
                aria-label="Belum dibaca"
              />
            )}
          </div>

          {/* Action buttons (Mark Read & Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            {!item.isRead && (
              <button
                type="button"
                onClick={handleMarkReadClick}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted/70 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                title="Tandai sudah dibaca"
                aria-label={`Tandai sudah dibaca ${item.judul}`}
              >
                <Check className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted/60 dark:text-[#8FA4BA] hover:text-severity-berat hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer disabled:opacity-50"
              title="Hapus notifikasi"
              aria-label={`Hapus notifikasi ${item.judul}`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-[#AFC0D4] mt-1 leading-relaxed">
          {item.pesan}
        </p>

        {/* Metadata, Badges & Time info */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted dark:text-[#8FA4BA] mt-2.5">
          <div className="flex items-center gap-1 shrink-0">
            <Clock
              className="w-3.5 h-3.5 text-muted/70 dark:text-[#8FA4BA] shrink-0"
              aria-hidden="true"
            />
            <span>{formatRelativeTime(item.createdAt)}</span>
          </div>

          {item.laporanId && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-semibold text-navy-primary/80 dark:text-blue-pale/90">
                Laporan #{item.laporanId}
              </span>
            </>
          )}

          {/* Status Badge jika relevan */}
          {detectedStatus && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <StatusBadge
                status={detectedStatus}
                className="text-[10px] px-2 py-0.5"
              />
            </>
          )}

          {/* AuthorityBadge sesuai scope */}
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <AuthorityBadge authority={scopeAuthority} size="sm" />
        </div>
      </div>
    </div>
  );
}

export default NotificationItemCard;

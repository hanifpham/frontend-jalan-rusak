import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { type NotificationFilterTab } from "@/types/notification";

export interface NotificationFilterToolbarProps {
  filter: NotificationFilterTab;
  onFilterChange: (tab: NotificationFilterTab) => void;
  unreadCount: number;
  totalCount: number;
  onMarkAllRead: () => void;
  isMarkingAllRead?: boolean;
}

export function NotificationFilterToolbar({
  filter,
  onFilterChange,
  unreadCount,
  totalCount,
  onMarkAllRead,
  isMarkingAllRead = false,
}: NotificationFilterToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-pale/30 dark:border-white/10 pb-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-canvas dark:bg-[#07111F] p-1 rounded-full border border-blue-pale/40 dark:border-white/10 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none",
            filter === "all"
              ? "bg-white dark:bg-[#5483B3] text-navy-primary dark:text-white shadow-xs"
              : "text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white"
          )}
        >
          Semua {totalCount > 0 && `(${totalCount})`}
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("unread")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none flex items-center gap-1.5",
            filter === "unread"
              ? "bg-white dark:bg-[#5483B3] text-navy-primary dark:text-white shadow-xs"
              : "text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white"
          )}
        >
          <span>Belum dibaca</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-severity-berat" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("laporan")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none",
            filter === "laporan"
              ? "bg-white dark:bg-[#5483B3] text-navy-primary dark:text-white shadow-xs"
              : "text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white"
          )}
        >
          Laporan
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("pesan")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none",
            filter === "pesan"
              ? "bg-white dark:bg-[#5483B3] text-navy-primary dark:text-white shadow-xs"
              : "text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white"
          )}
        >
          Pesan
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("status")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none",
            filter === "status"
              ? "bg-white dark:bg-[#5483B3] text-navy-primary dark:text-white shadow-xs"
              : "text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white"
          )}
        >
          Status
        </button>
      </div>

      {/* Action: Tandai semua dibaca */}
      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={isMarkingAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-blue-pale/30 dark:bg-[#5483B3]/20 hover:bg-blue-pale/50 dark:hover:bg-[#5483B3]/30 text-navy-primary dark:text-blue-pale border border-blue-pale/60 dark:border-[#5483B3]/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium self-start sm:self-auto disabled:opacity-50"
        >
          <CheckCheck
            className="w-4 h-4 text-accent-blue dark:text-blue-pale"
            aria-hidden="true"
          />
          <span>Tandai semua dibaca</span>
        </button>
      )}
    </div>
  );
}

export default NotificationFilterToolbar;

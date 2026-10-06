import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type NotificationMeta } from "@/types/notification";

export interface NotificationPaginationProps {
  page: number;
  pageSize: number;
  meta: NotificationMeta;
  onPageChange: (newPage: number) => void;
}

export function NotificationPagination({
  page,
  pageSize,
  meta,
  onPageChange,
}: NotificationPaginationProps): React.JSX.Element {
  const totalPages = Math.max(1, meta.total_pages);
  const startItem = meta.total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, meta.total);

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", page, "...", totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pt-4 border-t border-blue-pale/30 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-muted dark:text-[#8FA4BA] select-none">
      {/* Left: Summary */}
      <div>
        <span>
          Menampilkan{" "}
          <span className="font-bold text-navy-deepest dark:text-white">
            {startItem}–{endItem}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-navy-deepest dark:text-white">
            {meta.total}
          </span>{" "}
          notifikasi
        </span>
      </div>

      {/* Right: Controls */}
      <div
        className="flex items-center gap-1.5"
        aria-label="Navigasi Halaman Notifikasi"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border border-blue-pale/50 dark:border-white/10 text-muted dark:text-[#AFC0D4] transition-colors",
            page <= 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-canvas dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white cursor-pointer"
          )}
          title="Halaman Sebelumnya"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-muted dark:text-[#8FA4BA] text-xs"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === page;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[12px] transition-colors cursor-pointer",
                isActive
                  ? "bg-navy-primary dark:bg-[#5483B3] text-white font-bold shadow-xs"
                  : "border border-blue-pale/50 dark:border-white/10 hover:bg-canvas dark:hover:bg-white/5 text-muted dark:text-[#AFC0D4] font-medium"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Halaman ${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border border-blue-pale/50 dark:border-white/10 text-muted dark:text-[#AFC0D4] transition-colors",
            page >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-canvas dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white cursor-pointer"
          )}
          title="Halaman Berikutnya"
          aria-label="Halaman Berikutnya"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default NotificationPagination;

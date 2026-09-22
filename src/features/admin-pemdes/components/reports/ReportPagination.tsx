import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReportPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ReportPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: ReportPaginationProps): React.JSX.Element {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate pagination buttons
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="pt-4 border-t border-blue-pale/30 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-muted select-none">
      {/* Left: Summary Results */}
      <div>
        {totalItems === 0 ? (
          <span>Menampilkan <b className="font-bold text-navy-deepest">0</b> laporan</span>
        ) : (
          <span>
            Menampilkan{' '}
            <span className="font-bold text-navy-deepest">
              {startItem}–{endItem}
            </span>{' '}
            dari <span className="font-bold text-navy-deepest">{totalItems}</span> laporan
          </span>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1.5" aria-label="Navigasi Halaman Laporan">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center border border-blue-pale/50 text-muted transition-colors',
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-canvas hover:text-navy-deepest cursor-pointer'
          )}
          title="Halaman Sebelumnya"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Page Buttons */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 text-muted text-xs">
                ...
              </span>
            );
          }

          const pageNumber = p as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-[12px] transition-colors cursor-pointer',
                isActive
                  ? 'bg-navy-primary text-white font-bold shadow-xs'
                  : 'border border-blue-pale/50 hover:bg-canvas text-muted font-medium'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Halaman ${pageNumber}`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center border border-blue-pale/50 text-muted transition-colors',
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-canvas hover:text-navy-deepest cursor-pointer'
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

export default ReportPagination;

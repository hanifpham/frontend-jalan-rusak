import React, { useEffect } from 'react';
import { Download, AlertCircle, X } from 'lucide-react';

export interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportExportModal({ isOpen, onClose }: ReportExportModalProps): React.JSX.Element | null {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="bg-white rounded-3xl border border-blue-pale/50 shadow-2xl max-w-md w-full p-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted hover:text-navy-deepest transition-colors"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-pale/40 text-navy-primary flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 id="export-modal-title" className="text-lg font-bold text-navy-deepest">
              Export Dokumen Laporan
            </h3>
            <span className="text-[10px] bg-canvas text-navy-primary px-2 py-0.5 rounded-full font-bold border border-blue-pale/40">
              Format: PDF &amp; XLS
            </span>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3 mb-5">
          <AlertCircle className="w-5 h-5 text-status-menunggu shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs text-amber-950 leading-relaxed space-y-1">
            <p className="font-bold">Backend Gap — Belum Tersedia di Server</p>
            <p className="text-amber-900/90">
              Endpoint backend untuk pembuatan file PDF dan spreadsheet XLS belum diimplementasikan di server ROADIS.
            </p>
            <p className="text-[11px] text-amber-800">
              Sesuai aturan arsitektur ROADIS, sistem tidak menghasilkan file dummy/palsu. Fitur ini akan aktif otomatis setelah API backend siap.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportExportModal;

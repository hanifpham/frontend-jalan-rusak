import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, Info } from 'lucide-react';

export function AdminPemdesReportDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-4">
      {/* Navigation Back */}
      <div>
        <Link
          to="/pemdes/laporan"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-navy-primary transition-colors py-1.5 px-3 rounded-full hover:bg-white/80 border border-transparent hover:border-blue-pale/40 select-none"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Daftar Laporan</span>
        </Link>
      </div>

      {/* Main Detail Placeholder Card */}
      <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-pale/30 text-navy-primary border border-blue-pale/60 mb-2">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Detail Laporan #{id}</span>
            </div>
            <h1 className="text-2xl font-bold text-navy-deepest tracking-tight">
              Informasi Laporan Kerusakan
            </h1>
            <p className="text-xs text-muted mt-1">
              Data detail laporan kerusakan jalan desa
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-status-menunggu border border-amber-200">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Dalam Pengembangan</span>
          </div>
        </div>

        {/* Informative Backend Gap Box */}
        <div className="bg-canvas rounded-2xl p-6 border border-blue-pale/40 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-pale/50 text-navy-primary flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-muted">
            <p className="font-semibold text-navy-deepest text-sm">
              Modul Detail Laporan Terstruktur
            </p>
            <p>
              Endpoint backend spesifik untuk detail laporan tunggal (<code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[11px]">GET /api/admin/laporan/:id</code>) saat ini tercatat sebagai <strong>BACKEND GAP</strong> dan sedang dalam antrean pengembangan backend.
            </p>
            <p>
              Sesuai prinsip arsitektur ROADIS (ADR-005 &amp; ADR-016), frontend tidak membuat data detail palsu (no mock data). Halaman ini disediakan sebagai target routing yang valid dari tombol Action pada tabel laporan.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            to="/pemdes/laporan"
            className="inline-flex items-center gap-2 bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Kembali ke Daftar Laporan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPemdesReportDetailPage;

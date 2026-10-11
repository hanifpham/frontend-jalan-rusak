import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import {
  useSuperadminWilayah,
  useCreateWilayah,
  useUpdateWilayah,
  useDeleteWilayah,
} from '@/features/superadmin/api/useSuperadminWilayah';
import { type SuperadminWilayah, type WilayahType } from '@/types/superadmin';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { ReportPagination } from '@/components/reports/ReportPagination';
import { formatDateTimeIndo } from '@/lib/date';
import { cn } from '@/lib/utils';

export function SuperadminWilayahPage(): React.JSX.Element {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWilayah, setEditingWilayah] = useState<SuperadminWilayah | null>(null);
  const [deletingWilayah, setDeletingWilayah] = useState<SuperadminWilayah | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const { data: rawWilayah = [], isLoading, isError, refetch } = useSuperadminWilayah();
  const createMutation = useCreateWilayah();
  const updateMutation = useUpdateWilayah();
  const deleteMutation = useDeleteWilayah();

  // Form states
  const [formData, setFormData] = useState<{ nama: string; tipe: WilayahType }>({
    nama: '',
    tipe: 'desa',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ nama: '', tipe: 'desa' });
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (w: SuperadminWilayah) => {
    setEditingWilayah(w);
    const validTipe = ['desa', 'kabupaten', 'provinsi', 'nasional'].includes((w.tipe || '').toLowerCase())
      ? (w.tipe.toLowerCase() as WilayahType)
      : 'desa';
    setFormData({ nama: w.nama, tipe: validTipe });
    setFormError(null);
  };

  // Client-side filtering & pagination
  const filteredWilayah = useMemo(() => {
    let list = [...rawWilayah];
    if (typeFilter !== 'all') {
      if (typeFilter === 'tidak_teridentifikasi') {
        list = list.filter((w) => !w.tipe || w.tipe.trim() === '' || w.tipe.toLowerCase() === 'tidak_teridentifikasi');
      } else {
        list = list.filter((w) => (w.tipe || '').toLowerCase() === typeFilter.toLowerCase());
      }
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((w) => w.nama.toLowerCase().includes(q));
    }
    return list;
  }, [rawWilayah, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredWilayah.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const paginatedWilayah = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredWilayah.slice(start, start + pageSize);
  }, [filteredWilayah, activePage, pageSize]);

  const handleTypeFilterChange = (val: string) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedNama = formData.nama.trim();
    if (!trimmedNama) {
      setFormError('Nama wilayah tidak boleh kosong.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        nama: trimmedNama,
        tipe: formData.tipe,
      });
      setIsAddModalOpen(false);
      resetForm();
      showToast('Wilayah berhasil ditambahkan.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menambahkan wilayah.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWilayah) return;
    setFormError(null);

    const trimmedNama = formData.nama.trim();
    if (!trimmedNama) {
      setFormError('Nama wilayah tidak boleh kosong.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingWilayah.id || editingWilayah.ID || 0,
        payload: {
          nama: trimmedNama,
          tipe: formData.tipe,
        },
      });
      setEditingWilayah(null);
      resetForm();
      showToast('Wilayah berhasil diperbarui.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal memperbarui wilayah.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWilayah) return;
    setDeleteError(null);
    const targetId = deletingWilayah.id || deletingWilayah.ID || 0;

    try {
      await deleteMutation.mutateAsync(targetId);
      setDeletingWilayah(null);
      showToast(`Wilayah "${deletingWilayah.nama}" berhasil dihapus.`);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Gagal menghapus wilayah.');
    }
  };

  const typeTabs = [
    { value: 'all', label: 'Semua Tingkat' },
    { value: 'desa', label: 'Desa' },
    { value: 'kabupaten', label: 'Kabupaten' },
    { value: 'provinsi', label: 'Provinsi' },
    { value: 'nasional', label: 'Nasional' },
    { value: 'tidak_teridentifikasi', label: 'Tidak Teridentifikasi' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* Toast Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-navy-deepest text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-pale/30 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-4 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-status-selesai shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-deepest tracking-tight">
            Manajemen Wilayah
          </h1>
          <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] mt-1">
            Kelola data master wilayah administratif dan kewenangan teritorial sistem ROADIS.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Wilayah</span>
        </button>
      </div>

      {/* Toolbar: Tipe Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-canvas dark:bg-[#07111F] rounded-full border border-blue-pale/40 dark:border-white/10 overflow-x-auto">
          {typeTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTypeFilterChange(tab.value)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                typeFilter === tab.value
                  ? 'bg-white dark:bg-[#0D1A2D] text-navy-primary dark:text-blue-pale shadow-xs'
                  : 'text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-70">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari nama wilayah..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#0D1A2D] border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue-medium transition-all"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-6 flex flex-col gap-4 overflow-hidden">
        {isLoading && (
          <div className="space-y-3 py-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-white/5 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-severity-berat mb-2" />
            <h3 className="text-sm font-bold text-navy-deepest">Gagal memuat data wilayah</h3>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 rounded-full bg-navy-primary text-white text-xs font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredWilayah.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center text-muted">
            <Layers className="w-12 h-12 text-slate-300 dark:text-[#8FA4BA] mb-3" />
            <h3 className="text-sm font-bold text-navy-deepest dark:text-white">
              Tidak ada wilayah ditemukan
            </h3>
            <p className="text-xs text-muted dark:text-[#8FA4BA] mt-1">
              {search || typeFilter !== 'all'
                ? 'Tidak ada wilayah yang cocok dengan kriteria filter.'
                : 'Belum ada data wilayah yang terdaftar pada sistem.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredWilayah.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-blue-pale/30 dark:border-white/10 text-muted uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Wilayah</th>
                  <th className="py-3 px-4">Tingkat Kewenangan</th>
                  <th className="py-3 px-4">Tanggal Dibuat</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-pale/20 dark:divide-white/5">
                {paginatedWilayah.map((w) => {
                  const id = w.id || w.ID || 0;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-canvas/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-muted">
                        #{id}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-navy-deepest dark:text-white">
                        {w.nama}
                      </td>

                      <td className="py-3.5 px-4">
                        <AuthorityBadge authority={w.tipe} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-muted dark:text-[#8FA4BA]">
                        {w.created_at ? formatDateTimeIndo(w.created_at) : '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(w)}
                            title="Edit data wilayah"
                            className="p-1.5 rounded-full hover:bg-blue-pale/30 text-navy-primary dark:text-blue-pale transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setDeletingWilayah(w);
                            }}
                            title="Hapus wilayah"
                            className="p-1.5 rounded-full hover:bg-red-50 text-muted hover:text-severity-berat transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && filteredWilayah.length > 0 && (
          <ReportPagination
            currentPage={activePage}
            totalItems={filteredWilayah.length}
            pageSize={pageSize}
            onPageChange={setPage}
            unitName="wilayah"
          />
        )}
      </div>

      {/* Modal: Tambah Wilayah */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-deepest mb-1">Tambah Wilayah Baru</h3>
            <p className="text-xs text-muted mb-4">
              Daftarkan master wilayah baru ke dalam sistem administrasi ROADIS.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-severity-berat flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Nama Wilayah <span className="text-severity-berat">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={250}
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Sukamaju"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Tingkat Kewenangan <span className="text-severity-berat">*</span>
                </label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({ ...formData, tipe: e.target.value as WilayahType })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium bg-white dark:bg-[#12233A]"
                >
                  <option value="desa">Desa</option>
                  <option value="kabupaten">Kabupaten</option>
                  <option value="provinsi">Provinsi</option>
                  <option value="nasional">Nasional</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-blue-pale/30">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs flex items-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Wilayah</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Wilayah */}
      {editingWilayah && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setEditingWilayah(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-deepest mb-1">Edit Wilayah</h3>
            <p className="text-xs text-muted mb-4">
              Perbarui data nama dan tingkat kewenangan wilayah.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-severity-berat flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Nama Wilayah <span className="text-severity-berat">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={250}
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Tingkat Kewenangan <span className="text-severity-berat">*</span>
                </label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({ ...formData, tipe: e.target.value as WilayahType })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium bg-white dark:bg-[#12233A]"
                >
                  <option value="desa">Desa</option>
                  <option value="kabupaten">Kabupaten</option>
                  <option value="provinsi">Provinsi</option>
                  <option value="nasional">Nasional</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-blue-pale/30">
                <button
                  type="button"
                  onClick={() => setEditingWilayah(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs flex items-center gap-2"
                >
                  {updateMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hapus Wilayah */}
      {deletingWilayah && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-red-200 dark:border-red-900/40 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-severity-berat flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-deepest">Hapus Wilayah?</h3>
            <p className="text-xs text-muted dark:text-[#AFC0D4] leading-relaxed">
              Wilayah <strong>&ldquo;{deletingWilayah.nama}&rdquo;</strong> akan dihapus dari data master. Wilayah yang masih memiliki relasi aktif ke pengguna atau laporan tidak dapat dihapus.
            </p>

            {deleteError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs text-severity-berat text-left">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingWilayah(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-severity-berat hover:bg-red-700 text-white shadow-xs"
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminWilayahPage;

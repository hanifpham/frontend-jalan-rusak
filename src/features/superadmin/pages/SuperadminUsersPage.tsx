import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import {
  useSuperadminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/features/superadmin/api/useSuperadminUsers';
import { useSuperadminWilayah } from '@/features/superadmin/api/useSuperadminWilayah';
import { type Role } from '@/types/domain';
import { type SuperadminUser } from '@/types/superadmin';
import { formatDateTimeIndo } from '@/lib/date';
import { ReportPagination } from '@/components/reports/ReportPagination';
import { cn } from '@/lib/utils';

function formatRoleBadge(role: Role) {
  switch (role) {
    case 'super_admin':
      return {
        label: 'Superadmin',
        classes: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      };
    case 'admin_pu':
      return {
        label: 'Admin Dinas PU',
        classes: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      };
    case 'admin_pemdes':
      return {
        label: 'Admin Pemdes',
        classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      };
    case 'warga':
    default:
      return {
        label: 'Warga',
        classes: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border-gray-200 dark:border-white/10',
      };
  }
}

export function SuperadminUsersPage(): React.JSX.Element {
  const { user: currentAuthUser } = useAuth();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SuperadminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<SuperadminUser | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // React Query hooks
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useSuperadminUsers({
    page,
    limit: pageSize,
    role: roleFilter,
    search: debouncedSearch,
  });

  const { data: wilayahList = [] } = useSuperadminWilayah();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;

  // Form states for Create/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'warga' as Role,
    wilayah_id: '' as string,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'warga',
      wilayah_id: '',
    });
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: SuperadminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      wilayah_id: user.wilayah_id ? String(user.wilayah_id) : '',
    });
    setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email wajib diisi.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setFormError('Password minimal 6 karakter.');
      return;
    }
    if (formData.role === 'admin_pemdes' && !formData.wilayah_id) {
      setFormError('Admin Pemdes wajib memilih wilayah penugasan.');
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        wilayah_id:
          formData.role === 'admin_pemdes' && formData.wilayah_id
            ? Number(formData.wilayah_id)
            : null,
      });
      setIsAddModalOpen(false);
      resetForm();
      showToast('Pengguna baru berhasil ditambahkan.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menambahkan pengguna.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email wajib diisi.');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setFormError('Password baru minimal 6 karakter.');
      return;
    }
    if (formData.role === 'admin_pemdes' && !formData.wilayah_id) {
      setFormError('Admin Pemdes wajib memiliki wilayah penugasan.');
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        payload: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password ? formData.password : undefined,
          role: formData.role,
          wilayah_id:
            formData.role === 'admin_pemdes' && formData.wilayah_id
              ? Number(formData.wilayah_id)
              : null,
        },
      });
      setEditingUser(null);
      resetForm();
      showToast('Data pengguna berhasil diperbarui.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal memperbarui pengguna.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      await deleteUserMutation.mutateAsync(deletingUser.id);
      setDeletingUser(null);
      showToast(`Pengguna "${deletingUser.name}" berhasil dihapus.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus pengguna.');
    }
  };

  const roleTabs = [
    { value: 'all', label: 'Semua Peran' },
    { value: 'super_admin', label: 'Superadmin' },
    { value: 'admin_pu', label: 'Admin Dinas PU' },
    { value: 'admin_pemdes', label: 'Admin Pemdes' },
    { value: 'warga', label: 'Warga' },
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
            Manajemen Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] mt-1">
            Kelola data akun, verifikasi peran, dan izin akses pengguna sistem ROADIS.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Toolbar: Role Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-canvas dark:bg-[#07111F] rounded-full border border-blue-pale/40 dark:border-white/10 overflow-x-auto">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setRoleFilter(tab.value);
                setPage(1);
              }}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                roleFilter === tab.value
                  ? 'bg-white dark:bg-[#0D1A2D] text-navy-primary dark:text-blue-pale shadow-xs'
                  : 'text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-70">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
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
            <h3 className="text-sm font-bold text-navy-deepest">Gagal memuat pengguna</h3>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 rounded-full bg-navy-primary text-white text-xs font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center text-muted">
            <Users className="w-12 h-12 text-slate-300 dark:text-[#8FA4BA] mb-3" />
            <h3 className="text-sm font-bold text-navy-deepest dark:text-white">
              Tidak ada pengguna ditemukan
            </h3>
            <p className="text-xs text-muted dark:text-[#8FA4BA] mt-1">
              {search || roleFilter !== 'all'
                ? 'Tidak ada data yang cocok dengan kriteria pencarian.'
                : 'Belum ada data pengguna yang terdaftar pada sistem.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-blue-pale/30 dark:border-white/10 text-muted uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Wilayah Penugasan</th>
                  <th className="py-3 px-4">Dibuat Pada</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-pale/20 dark:divide-white/5">
                {users.map((u: SuperadminUser) => {
                  const roleBadge = formatRoleBadge(u.role);
                  const isCurrentUser = currentAuthUser?.email === u.email;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-canvas/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-pale/60 dark:bg-white/10 text-navy-primary dark:text-blue-pale font-bold flex items-center justify-center shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-navy-deepest dark:text-white truncate">
                              {u.name}
                              {isCurrentUser && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 font-semibold">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-muted dark:text-[#8FA4BA] truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                            roleBadge.classes
                          )}
                        >
                          {roleBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-[#AFC0D4]">
                        {u.role === 'admin_pemdes' && u.wilayah?.nama ? (
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-medium shrink-0" />
                            <span>Desa {u.wilayah.nama}</span>
                          </span>
                        ) : u.role === 'super_admin' ? (
                          <span className="text-muted dark:text-[#8FA4BA] italic">Pusat Sistem</span>
                        ) : u.role === 'admin_pu' ? (
                          <span className="text-muted dark:text-[#8FA4BA] italic">Kab. Indramayu</span>
                        ) : (
                          <span className="text-muted dark:text-[#8FA4BA]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-muted dark:text-[#8FA4BA]">
                        {formatDateTimeIndo(u.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            title="Edit data pengguna"
                            className="p-1.5 rounded-full hover:bg-blue-pale/30 text-navy-primary dark:text-blue-pale transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingUser(u)}
                            disabled={isCurrentUser}
                            title={isCurrentUser ? 'Tidak dapat menghapus akun sendiri' : 'Hapus pengguna'}
                            className="p-1.5 rounded-full hover:bg-red-50 text-muted hover:text-severity-berat transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
        {!isLoading && !isError && totalUsers > 0 && (
          <ReportPagination
            currentPage={page}
            totalItems={totalUsers}
            pageSize={pageSize}
            onPageChange={setPage}
            unitName="pengguna"
          />
        )}
      </div>

      {/* Modal: Tambah Pengguna */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-deepest mb-1">Tambah Pengguna Baru</h3>
            <p className="text-xs text-muted mb-4">
              Lengkapi formulir untuk membuat akun baru pada sistem ROADIS.
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
                  Nama Lengkap <span className="text-severity-berat">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Alamat Email <span className="text-severity-berat">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contoh@roadis.go.id"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Kata Sandi <span className="text-severity-berat">*</span> (Min. 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Peran Akun (Role) <span className="text-severity-berat">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const r = e.target.value as Role;
                    setFormData({
                      ...formData,
                      role: r,
                      wilayah_id: r === 'admin_pemdes' ? formData.wilayah_id : '',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium bg-white dark:bg-[#12233A]"
                >
                  <option value="warga">Warga / Pelapor</option>
                  <option value="admin_pemdes">Admin Pemdes</option>
                  <option value="admin_pu">Admin Dinas PU</option>
                  <option value="super_admin">Superadmin</option>
                </select>
              </div>

              {formData.role === 'admin_pemdes' && (
                <div>
                  <label className="block text-xs font-bold text-navy-deepest mb-1">
                    Wilayah Penugasan Desa <span className="text-severity-berat">*</span>
                  </label>
                  <select
                    required
                    value={formData.wilayah_id}
                    onChange={(e) => setFormData({ ...formData, wilayah_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium bg-white dark:bg-[#12233A]"
                  >
                    <option value="">-- Pilih Wilayah Desa --</option>
                    {wilayahList.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nama} ({w.tipe})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  disabled={createUserMutation.isPending}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs flex items-center gap-2"
                >
                  {createUserMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Pengguna */}
      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-canvas text-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-deepest mb-1">Edit Pengguna</h3>
            <p className="text-xs text-muted mb-4">
              Perbarui profil, hak akses peran, atau setel ulang kata sandi pengguna.
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
                  Nama Lengkap <span className="text-severity-berat">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Alamat Email <span className="text-severity-berat">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Ganti Kata Sandi (Kosongkan jika tidak ingin mengubah)
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-deepest mb-1">
                  Peran Akun (Role)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const r = e.target.value as Role;
                    setFormData({
                      ...formData,
                      role: r,
                      wilayah_id: r === 'admin_pemdes' ? formData.wilayah_id : '',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium bg-white dark:bg-[#12233A]"
                >
                  <option value="warga">Warga / Pelapor</option>
                  <option value="admin_pemdes">Admin Pemdes</option>
                  <option value="admin_pu">Admin Dinas PU</option>
                  <option value="super_admin">Superadmin</option>
                </select>
              </div>

              {formData.role === 'admin_pemdes' && (
                <div>
                  <label className="block text-xs font-bold text-navy-deepest mb-1">
                    Wilayah Penugasan Desa <span className="text-severity-berat">*</span>
                  </label>
                  <select
                    required
                    value={formData.wilayah_id}
                    onChange={(e) => setFormData({ ...formData, wilayah_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-blue-pale/50 dark:border-white/10 text-xs text-navy-deepest focus:outline-none focus:ring-2 focus:ring-blue-medium bg-white dark:bg-[#12233A]"
                  >
                    <option value="">-- Pilih Wilayah Desa --</option>
                    {wilayahList.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nama} ({w.tipe})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-blue-pale/30">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs flex items-center gap-2"
                >
                  {updateUserMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hapus Pengguna */}
      {deletingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/50 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#0D1A2D] rounded-3xl border border-red-200 dark:border-red-900/40 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-severity-berat flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-deepest">Hapus Pengguna?</h3>
            <p className="text-xs text-muted dark:text-[#AFC0D4] leading-relaxed">
              Akun <strong>&ldquo;{deletingUser.name}&rdquo;</strong> ({deletingUser.email}) akan dinonaktifkan/dihapus dari sistem. Tindakan ini membatalkan seluruh hak akses pengguna tersebut.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteUserMutation.isPending}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-severity-berat hover:bg-red-700 text-white shadow-xs"
              >
                {deleteUserMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminUsersPage;

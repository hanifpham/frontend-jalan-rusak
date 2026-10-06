import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Camera,
  Trash2,
  Edit3,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Check,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/features/auth/useAuth";
import { formatDateTimeIndo } from "@/lib/date";
import { AuthorityBadge } from "@/components/ui/AuthorityBadge";
import { WilayahChip } from "@/components/ui/WilayahChip";
import { EditProfileModal } from "./EditProfileModal";
import { AvatarUploadModal } from "./AvatarUploadModal";
import { DeleteAvatarDialog } from "./DeleteAvatarDialog";
import { ChangePasswordModal } from "./ChangePasswordModal";

export interface ProfileViewProps {
  role?: "admin_pemdes" | "admin_pu";
}

export function ProfileView({ role: propRole }: ProfileViewProps): React.JSX.Element {
  const location = useLocation();
  const { user, role: authRole } = useAuth();
  const { data: profile, isLoading, isError, refetch } = useProfile();

  const currentRole = propRole || (authRole === "admin_pu" ? "admin_pu" : "admin_pemdes");
  const isPU = currentRole === "admin_pu";

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isDeleteAvatarOpen, setIsDeleteAvatarOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (
      (location.state as { openPasswordModal?: boolean })?.openPasswordModal
    ) {
      setIsPasswordModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  const getInitials = (name?: string): string => {
    const fallback = isPU ? "PU" : "AP";
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0];
    const second = parts[1];
    if (first && second) {
      return (first.charAt(0) + second.charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || fallback;
  };

  const displayName = profile?.name || user?.nama || (isPU ? "Admin Dinas PU" : "Admin Pemdes");
  const userInitials = getInitials(displayName);

  const pemdesWilayahName = profile?.wilayah?.nama
    ? (profile.wilayah.nama.toLowerCase().startsWith("desa ")
        ? profile.wilayah.nama
        : `Desa ${profile.wilayah.nama}`)
    : profile?.wilayah_id
      ? `Wilayah #${profile.wilayah_id}`
      : "Wilayah Desa";

  const effectiveWilayahName = isPU ? "Kabupaten Indramayu" : pemdesWilayahName;
  const roleLabel = isPU ? "Admin Dinas PU" : "Admin Pemdes";
  const breadcrumbRole = isPU ? "Admin Dinas PU" : "Admin Pemdes";

  const puCapabilities = [
    {
      title: "Laporan Jalan Kabupaten",
      description: "Pantau, verifikasi, dan kelola status perbaikan jalan kewenangan kabupaten",
    },
    {
      title: "Peta Laporan Kabupaten",
      description: "Visualisasi spasial sebaran titik kerusakan jalan lintas kecamatan",
    },
    {
      title: "Komunikasi Lintas Sektor",
      description: "Koordinasi penanganan jalan dengan warga dan instansi terkait",
    },
    {
      title: "Notifikasi Sistem",
      description: "Pemberitahuan real-time aduan masuk dan pembaruan eskalasi laporan",
    },
    {
      title: "Detail Penanganan Teknis",
      description: "Akses data teknis laporan dan riwayat tindakan perbaikan dinas",
    },
  ];

  const pemdesCapabilities = [
    {
      title: "Laporan Jalan Desa",
      description: "Pantau dan verifikasi pelaporan kerusakan jalan wilayah desa",
    },
    {
      title: "Peta Laporan Desa",
      description: "Visualisasi geospasial titik kerusakan jalan desa penugasan",
    },
    {
      title: "Pesan dengan Warga",
      description: "Komunikasi langsung dan tindak lanjut aduan warga",
    },
    {
      title: "Notifikasi Sistem",
      description: "Pemberitahuan real-time terkait aduan dan pembaruan",
    },
    {
      title: "Detail Laporan Sesuai Kewenangan",
      description: "Akses informasi pelapor dan bukti foto wilayah desa",
    },
  ];

  const capabilities = isPU ? puCapabilities : pemdesCapabilities;

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-navy-deepest text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-pale/30 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-4 duration-200"
        >
          <CheckCircle2
            className="w-4 h-4 text-status-selesai shrink-0"
            aria-hidden="true"
          />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col gap-1.5">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-muted font-medium flex items-center gap-1.5"
        >
          <span>{breadcrumbRole}</span>
          <span className="text-slate-300">/</span>
          <span className="text-navy-primary font-bold">Profil</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
          Profil
        </h1>
        <p className="text-sm text-muted">
          Kelola informasi akun dan keamanan profil Anda.
        </p>
      </div>

      {/* 2. Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full bg-slate-200" />
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="w-full h-10 bg-slate-100 rounded-full mt-2" />
            </div>
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/4" />
              <div className="space-y-3">
                <div className="h-10 bg-slate-100 rounded-2xl" />
                <div className="h-10 bg-slate-100 rounded-2xl" />
                <div className="h-10 bg-slate-100 rounded-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-card border border-blue-pale/40 p-6 space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/4" />
              <div className="h-10 bg-slate-100 rounded-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Error State */}
      {!isLoading && isError && (
        <div className="bg-white rounded-card border border-blue-pale/40 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-severity-berat flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-navy-deepest">
            Profil tidak dapat dimuat.
          </h2>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Terjadi kendala saat mengambil data profil dari server. Silakan coba
            muat ulang halaman.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 px-5 py-2.5 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Muat Ulang</span>
          </button>
        </div>
      )}

      {/* 4. Loaded Profile Content (2-Column Layout) */}
      {!isLoading && !isError && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Profile Summary (Card A) & Role Access (Card C) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* CARD A: Profile Summary */}
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-6 sm:p-7 flex flex-col items-center text-center relative overflow-hidden">
              {/* Background Ambient Decorative Accent */}
              <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-blue-pale/25 dark:from-white/5 via-blue-pale/10 dark:via-transparent to-transparent pointer-events-none" />

              {/* Large Avatar with Camera Trigger Overlay */}
              <div className="relative mt-2 mb-4 group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-blue-pale dark:bg-white/10 text-navy-primary dark:text-navy-deepest font-bold text-2xl sm:text-3xl flex items-center justify-center ring-4 ring-white dark:ring-[#0D1A2D] shadow-lg border border-blue-pale/60 dark:border-white/10 relative">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-navy-primary dark:bg-[#5483B3] hover:bg-navy-deepest dark:hover:bg-[#5483B3]/80 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-[#0D1A2D] transition-transform active:scale-95 cursor-pointer"
                  title="Ubah foto profil"
                  aria-label="Ubah foto profil"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Name & Badge */}
              <h2 className="text-lg sm:text-xl font-extrabold text-navy-deepest tracking-tight">
                {profile.name}
              </h2>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-pale/40 dark:bg-white/10 text-navy-primary dark:text-blue-pale border border-blue-pale/70 dark:border-white/10 shadow-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPU ? "bg-blue-500" : "bg-status-selesai"
                  }`}
                />
                <span>{roleLabel}</span>
              </div>

              {/* Wilayah / Scope & Email Info */}
              <div className="mt-3.5 flex flex-col items-center gap-2 text-xs text-muted dark:text-[#8FA4BA]">
                <div className="flex items-center justify-center gap-2 font-semibold text-slate-700 dark:text-[#AFC0D4] flex-wrap">
                  {isPU ? (
                    <WilayahChip
                      locationLabel="Kabupaten Indramayu"
                      className="px-3 py-1 text-xs font-semibold"
                    />
                  ) : (
                    <WilayahChip
                      villageName={profile.wilayah?.nama || "Wilayah Desa"}
                      className="px-3 py-1 text-xs font-semibold"
                    />
                  )}
                  <AuthorityBadge authority={isPU ? "kabupaten" : "desa"} size="sm" />
                </div>
                <p className="truncate max-w-60 text-muted dark:text-[#8FA4BA] text-[11px] mt-0.5">
                  {profile.email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-6 pt-5 border-t border-blue-pale/30 dark:border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-full text-xs font-semibold bg-navy-primary hover:bg-navy-deepest text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Edit Profil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-full text-xs font-semibold border border-blue-pale/60 dark:border-white/10 bg-white dark:bg-[#12233A] hover:bg-blue-pale/20 dark:hover:bg-white/10 text-navy-primary dark:text-navy-deepest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera
                    className="w-3.5 h-3.5 text-blue-medium"
                    aria-hidden="true"
                  />
                  <span>Ubah Foto</span>
                </button>

                {profile.avatar_url && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteAvatarOpen(true)}
                    className="p-2.5 rounded-full text-muted hover:text-severity-berat hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/50 cursor-pointer shrink-0"
                    title="Hapus foto profil"
                    aria-label="Hapus foto profil"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* CARD C: Role & Hak Akses */}
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-6 sm:p-7 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-blue-pale/30 dark:border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-pale/50 dark:bg-white/10 text-navy-primary dark:text-blue-pale flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-deepest">
                      Peran &amp; Akses
                    </h3>
                    <p className="text-[11px] text-muted dark:text-[#8FA4BA]">
                      Kewenangan akun Anda
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-navy-primary text-white">
                  {roleLabel}
                </span>
              </div>

              {/* Authorized Capability Checklist */}
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-[#AFC0D4]">
                {capabilities.map((cap) => (
                  <div key={cap.title} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-status-selesai/15 text-status-selesai flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-3" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-deepest">
                        {cap.title}
                      </p>
                      <p className="text-[11px] text-muted dark:text-[#8FA4BA]">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-canvas dark:bg-[#07111F] rounded-2xl border border-blue-pale/40 dark:border-white/10 text-[11px] text-muted dark:text-[#8FA4BA] leading-relaxed">
                Peran dan cakupan hak akses ditetapkan oleh Administrator Utama
                sistem dan tidak dapat diubah secara mandiri.
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Profile Information (Card B) & Security (Card D)    */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* CARD B: Informasi Profil */}
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-blue-pale/30 dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-navy-deepest">
                    Informasi Profil
                  </h3>
                  <p className="text-xs text-muted dark:text-[#8FA4BA]">
                    Detail data identitas akun {roleLabel} Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-pale/30 dark:bg-white/10 hover:bg-blue-pale/50 dark:hover:bg-white/15 text-navy-primary dark:text-blue-pale border border-blue-pale/60 dark:border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ubah</span>
                </button>
              </div>

              {/* Data Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Nama Lengkap */}
                <div className="p-3.5 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10">
                  <div className="flex items-center gap-2 text-muted dark:text-[#8FA4BA] mb-1 font-semibold text-[11px]">
                    <User
                      className="w-3.5 h-3.5 text-blue-medium"
                      aria-hidden="true"
                    />
                    <span>Nama Lengkap</span>
                  </div>
                  <p className="font-bold text-navy-deepest text-sm truncate">
                    {profile.name}
                  </p>
                </div>

                {/* 2. Nomor Telepon */}
                <div className="p-3.5 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10">
                  <div className="flex items-center gap-2 text-muted dark:text-[#8FA4BA] mb-1 font-semibold text-[11px]">
                    <Phone
                      className="w-3.5 h-3.5 text-blue-medium"
                      aria-hidden="true"
                    />
                    <span>Nomor Telepon</span>
                  </div>
                  <p className="font-bold text-navy-deepest text-sm truncate">
                    {profile.phone || (
                      <span className="font-normal text-muted dark:text-[#8FA4BA] italic">
                        Belum diisi
                      </span>
                    )}
                  </p>
                </div>

                {/* 3. Alamat Email (Readonly) */}
                <div className="p-3.5 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10 sm:col-span-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-muted dark:text-[#8FA4BA] mb-1 font-semibold text-[11px]">
                      <Mail
                        className="w-3.5 h-3.5 text-blue-medium"
                        aria-hidden="true"
                      />
                      <span>Alamat Email</span>
                    </div>
                    <p className="font-bold text-navy-deepest text-sm truncate">
                      {profile.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-white dark:bg-[#12233A] text-muted dark:text-[#8FA4BA] px-2 py-0.5 rounded-full border border-blue-pale/50 dark:border-white/10 shrink-0">
                    Terkunci
                  </span>
                </div>

                {/* 4. Peran Akun (Readonly) */}
                <div className="p-3.5 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10">
                  <div className="flex items-center gap-2 text-muted dark:text-[#8FA4BA] mb-1 font-semibold text-[11px]">
                    <Shield
                      className="w-3.5 h-3.5 text-blue-medium"
                      aria-hidden="true"
                    />
                    <span>Peran Akun</span>
                  </div>
                  <p className="font-bold text-navy-deepest text-sm truncate">
                    {roleLabel}
                  </p>
                </div>

                {/* 5. Wilayah Penugasan / Kewenangan (Readonly) */}
                <div className="p-3.5 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10">
                  <div className="flex items-center gap-2 text-muted dark:text-[#8FA4BA] mb-1 font-semibold text-[11px]">
                    <MapPin
                      className="w-3.5 h-3.5 text-blue-medium"
                      aria-hidden="true"
                    />
                    <span>Wilayah &amp; Kewenangan</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-navy-deepest text-sm flex-wrap">
                    <span>{effectiveWilayahName}</span>
                    <AuthorityBadge authority={isPU ? "kabupaten" : "desa"} size="sm" />
                  </div>
                </div>
              </div>

              {/* Explanatory Banner */}
              <div className="p-3.5 bg-blue-pale/15 dark:bg-[#5483B3]/10 rounded-2xl border border-blue-pale/40 dark:border-white/10 text-[11px] text-muted dark:text-[#8FA4BA] flex items-start gap-2.5">
                <AlertCircle
                  className="w-4 h-4 text-blue-medium shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="leading-relaxed">
                  {isPU
                    ? "Alamat email, peran, dan wilayah kewenangan dikelola langsung oleh sistem ROADIS. Jika terdapat pembaruan data instansi dinas, hubungi Administrator Sistem."
                    : "Alamat email, peran, dan wilayah penugasan dikelola langsung oleh sistem ROADIS. Jika terdapat perubahan wilayah dinas, hubungi Administrator Kabupaten."}
                </p>
              </div>
            </div>

            {/* CARD D: Keamanan Akun */}
            <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-6 sm:p-7 flex flex-col gap-5">
              <div className="border-b border-blue-pale/30 dark:border-white/10 pb-4">
                <h3 className="text-base font-bold text-navy-deepest">
                  Keamanan Akun
                </h3>
                <p className="text-xs text-muted dark:text-[#8FA4BA]">
                  Kelola kata sandi dan pantau aktivitas sesi masuk Anda.
                </p>
              </div>

              {/* Password Row */}
              <div className="p-4 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-[#12233A] border border-blue-pale/40 dark:border-white/10 flex items-center justify-center text-navy-primary dark:text-navy-deepest shrink-0 shadow-xs">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-deepest">
                      Password Akun
                    </p>
                    <p className="text-xs text-muted dark:text-[#8FA4BA] tracking-widest mt-0.5">
                      ••••••••••••
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#12233A] hover:bg-blue-pale/20 dark:hover:bg-white/10 text-navy-primary dark:text-navy-deepest border border-blue-pale/60 dark:border-white/10 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Ubah Password
                </button>
              </div>

              {/* Last Login Info Row */}
              <div className="p-4 rounded-2xl bg-canvas dark:bg-[#07111F] border border-blue-pale/30 dark:border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-[#12233A] border border-blue-pale/40 dark:border-white/10 flex items-center justify-center text-blue-medium shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-deepest">
                    Login Terakhir
                  </p>
                  <p className="text-xs text-slate-700 dark:text-[#AFC0D4] font-medium mt-0.5">
                    {formatDateTimeIndo(profile.last_login_at)}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-500/20 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                {isPU
                  ? "Gunakan password yang kuat dan jangan bagikan kepada pihak manapun untuk menjaga integritas data infrastruktur jalan kabupaten."
                  : "Gunakan password yang kuat dan jangan bagikan kepada pihak manapun untuk menjaga integritas data infrastruktur jalan desa."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {profile && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            currentName={profile.name}
            currentPhone={profile.phone}
            email={profile.email}
            wilayahName={effectiveWilayahName}
            roleLabel={roleLabel}
            authority={isPU ? "kabupaten" : "desa"}
            onSuccessNotification={showToast}
          />

          <AvatarUploadModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            currentAvatarUrl={profile.avatar_url}
            onSuccessNotification={showToast}
          />

          <DeleteAvatarDialog
            isOpen={isDeleteAvatarOpen}
            onClose={() => setIsDeleteAvatarOpen(false)}
            onSuccessNotification={showToast}
          />

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSuccessNotification={showToast}
          />
        </>
      )}
    </div>
  );
}

export default ProfileView;

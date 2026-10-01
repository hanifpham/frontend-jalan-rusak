import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Palette,
  Map,
  Shield,
  User,
  Sun,
  Laptop,
  Moon,
  Volume2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  useSettings,
  useUpdateSettings,
  useLogoutAllSessions,
  playNotificationSound,
} from "@/hooks/useSettings";
import { formatDateTimeIndo } from "@/lib/date";
import { SettingsSection } from "../components/settings/SettingsSection";
import { SettingsRow } from "../components/settings/SettingsRow";
import { SettingsToggle } from "../components/settings/SettingsToggle";
import {
  SettingsSegmentedControl,
  type SegmentedOption,
} from "../components/settings/SettingsSegmentedControl";
import { LogoutAllDialog } from "../components/settings/LogoutAllDialog";
import {
  type ThemePreference,
  type DisplayDensityPreference,
  type MapDefaultViewPreference,
  type ReportDisplayPreference,
} from "@/types/settings";

const THEME_OPTIONS: SegmentedOption<ThemePreference>[] = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "system", label: "Sistem", icon: Laptop },
  { value: "dark", label: "Gelap", icon: Moon },
];

const DENSITY_OPTIONS: SegmentedOption<DisplayDensityPreference>[] = [
  { value: "comfortable", label: "Nyaman" },
  { value: "compact", label: "Ringkas" },
];

const MAP_VIEW_OPTIONS: SegmentedOption<MapDefaultViewPreference>[] = [
  { value: "standard", label: "Standar" },
  { value: "satellite", label: "Satelit" },
];

const REPORT_DISPLAY_OPTIONS: SegmentedOption<ReportDisplayPreference>[] = [
  { value: "comfortable", label: "Nyaman" },
  { value: "compact", label: "Ringkas" },
];

export function AdminPemdesSettingsPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { data: settings, isLoading, isError, refetch } = useSettings();
  const updateSettings = useUpdateSettings();
  const logoutAll = useLogoutAllSessions();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  // Notification handlers
  const handleToggleSound = (checked: boolean) => {
    if (checked) {
      playNotificationSound();
    }
    updateSettings.mutate(
      { notification_sound_enabled: checked },
      {
        onSuccess: () =>
          showFeedback(
            checked
              ? "Suara notifikasi diaktifkan"
              : "Suara notifikasi dinonaktifkan",
          ),
        onError: () => showFeedback("Gagal memperbarui preferensi suara."),
      },
    );
  };

  const handleTestSound = () => {
    playNotificationSound();
    showFeedback("Pratinjau suara notifikasi diputar");
  };

  const handleToggleReport = (checked: boolean) => {
    updateSettings.mutate(
      { notification_report_enabled: checked },
      {
        onSuccess: () =>
          showFeedback(
            checked
              ? "Notifikasi laporan baru diaktifkan"
              : "Notifikasi laporan baru dinonaktifkan",
          ),
        onError: () =>
          showFeedback("Gagal memperbarui preferensi notifikasi laporan."),
      },
    );
  };

  const handleToggleStatus = (checked: boolean) => {
    updateSettings.mutate(
      { notification_status_enabled: checked },
      {
        onSuccess: () =>
          showFeedback(
            checked
              ? "Notifikasi status laporan diaktifkan"
              : "Notifikasi status laporan dinonaktifkan",
          ),
        onError: () =>
          showFeedback("Gagal memperbarui preferensi notifikasi status."),
      },
    );
  };

  const handleToggleChat = (checked: boolean) => {
    updateSettings.mutate(
      { notification_chat_enabled: checked },
      {
        onSuccess: () =>
          showFeedback(
            checked
              ? "Notifikasi pesan warga diaktifkan"
              : "Notifikasi pesan warga dinonaktifkan",
          ),
        onError: () =>
          showFeedback("Gagal memperbarui preferensi notifikasi pesan."),
      },
    );
  };

  // Appearance handlers
  const handleChangeTheme = (theme: ThemePreference) => {
    updateSettings.mutate(
      { theme },
      {
        onSuccess: () =>
          showFeedback(
            `Tema diubah ke ${theme === "light" ? "Terang" : theme === "dark" ? "Gelap" : "Sistem"}`,
          ),
        onError: () => showFeedback("Gagal memperbarui tema."),
      },
    );
  };

  const handleChangeDensity = (display_density: DisplayDensityPreference) => {
    updateSettings.mutate(
      { display_density },
      {
        onSuccess: () =>
          showFeedback(
            `Kepadatan diubah ke ${display_density === "comfortable" ? "Nyaman" : "Ringkas"}`,
          ),
        onError: () => showFeedback("Gagal memperbarui kepadatan tampilan."),
      },
    );
  };

  // Map & Report handlers
  const handleChangeMapView = (map_default_view: MapDefaultViewPreference) => {
    updateSettings.mutate(
      { map_default_view },
      {
        onSuccess: () =>
          showFeedback(
            `Tampilan peta default: ${map_default_view === "standard" ? "Standar" : "Satelit"}`,
          ),
        onError: () => showFeedback("Gagal memperbarui preferensi peta."),
      },
    );
  };

  const handleToggleMapLabels = (checked: boolean) => {
    updateSettings.mutate(
      { map_show_labels: checked },
      {
        onSuccess: () =>
          showFeedback(
            checked
              ? "Label lokasi peta diaktifkan"
              : "Label lokasi peta dinonaktifkan",
          ),
        onError: () => showFeedback("Gagal memperbarui label peta."),
      },
    );
  };

  const handleChangeReportDisplay = (
    report_display_preference: ReportDisplayPreference,
  ) => {
    updateSettings.mutate(
      { report_display_preference },
      {
        onSuccess: () =>
          showFeedback(
            `Tampilan laporan: ${report_display_preference === "comfortable" ? "Nyaman" : "Ringkas"}`,
          ),
        onError: () =>
          showFeedback("Gagal memperbarui preferensi tampilan laporan."),
      },
    );
  };

  // Logout All handler
  const handleConfirmLogoutAll = () => {
    logoutAll.mutate(undefined, {
      onSuccess: () => {
        setIsLogoutDialogOpen(false);
        navigate("/login", { replace: true });
      },
      onError: () => {
        setIsLogoutDialogOpen(false);
        showFeedback("Gagal mengeluarkan semua sesi. Silakan coba kembali.");
      },
    });
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div
        className="w-full max-w-5xl mx-auto space-y-6 animate-pulse px-4 sm:px-6 lg:px-8"
        aria-busy="true"
        aria-label="Memuat pengaturan"
      >
        <div className="space-y-2">
          <div className="h-4 w-36 bg-blue-pale/40 dark:bg-white/10 rounded-full" />
          <div className="h-8 w-60 bg-blue-pale/50 dark:bg-white/15 rounded-2xl" />
          <div className="h-4 w-96 bg-blue-pale/30 dark:bg-white/10 rounded-full" />
        </div>

        <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 p-6 sm:p-10 space-y-10 shadow-xs">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4 pt-6 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-pale/40 dark:bg-white/10" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-5 w-48 bg-blue-pale/40 dark:bg-white/10 rounded-full" />
                  <div className="h-3 w-80 bg-blue-pale/20 dark:bg-white/5 rounded-full" />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-12 bg-canvas/60 dark:bg-[#07111F]/60 rounded-xl border border-blue-pale/20 dark:border-white/10" />
                <div className="h-12 bg-canvas/60 dark:bg-[#07111F]/60 rounded-xl border border-blue-pale/20 dark:border-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !settings) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/50 dark:border-white/10 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-severity-berat dark:text-red-400 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-navy-deepest mb-1.5">
            Pengaturan tidak dapat dimuat
          </h2>
          <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] max-w-md mb-6 leading-relaxed">
            Periksa koneksi Anda dan coba lagi.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-navy-primary dark:bg-[#5483B3] text-white text-xs font-semibold hover:bg-navy-deepest transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  const account = settings?.account;
  const preferences = settings?.preferences;
  const security = settings?.security;

  // Account Status display helper: supports active/aktif and inactive/tidak_aktif
  const isAccountActive =
    account?.status === "active" || account?.status === "aktif";
  const displayAccountStatus = isAccountActive
    ? "Aktif"
    : account?.status === "inactive" || account?.status === "tidak_aktif"
      ? "Tidak Aktif"
      : "Status Tidak Diketahui";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="space-y-1.5">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-muted dark:text-[#8FA4BA] font-medium flex items-center gap-1.5"
        >
          <span>Admin Pemdes</span>
          <span className="text-slate-300 dark:text-gray-600">/</span>
          <span className="text-navy-primary dark:text-[#5483B3] font-bold">
            Pengaturan
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-deepest tracking-tight">
          Pengaturan
        </h1>
        <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] leading-relaxed">
          Kelola preferensi aplikasi, notifikasi, tampilan, peta, laporan, dan
          keamanan akun Anda.
        </p>
      </header>

      {/* Floating subtle feedback notification */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-navy-deepest dark:bg-[#12233A] text-white px-4 py-2.5 rounded-full shadow-xl border border-blue-pale/30 dark:border-white/10 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200"
        >
          <Sparkles
            className="w-4 h-4 text-blue-medium dark:text-blue-pale shrink-0"
            aria-hidden="true"
          />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Settings Surface */}
      <main
        className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-xs p-6 sm:p-10 space-y-8"
        aria-label="Konten Pengaturan Aplikasi"
      >
        {/* SECTION 01 — PREFERENSI NOTIFIKASI */}
        <SettingsSection
          id="section-notifikasi"
          title="Preferensi Notifikasi"
          description="Atur bagaimana ROADIS memberi tahu Anda mengenai aktivitas laporan dan komunikasi warga."
          icon={Bell}
          iconBgColor="bg-[#EAF4FB] dark:bg-blue-medium/20"
          iconTextColor="text-navy-primary dark:text-blue-pale"
        >
          {/* Row 1: Suara Notifikasi */}
          <SettingsRow
            title="Suara Notifikasi"
            description="Putar suara ketika terdapat notifikasi baru."
            badge={
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  preferences?.notification_sound_enabled
                    ? "bg-status-selesai/10 text-status-selesai border-status-selesai/20"
                    : "bg-gray-100 text-muted border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                {preferences?.notification_sound_enabled ? "ON" : "OFF"}
              </span>
            }
            control={
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#12233A] border border-blue-pale/60 dark:border-white/10 text-navy-primary dark:text-navy-deepest hover:bg-[#EEF5FB] dark:hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium active:scale-95 shadow-2xs select-none"
                  aria-label="Uji suara notifikasi"
                >
                  <Volume2
                    className="w-3.5 h-3.5 text-blue-medium dark:text-blue-pale"
                    aria-hidden="true"
                  />
                  <span>Uji Suara</span>
                </button>
                <SettingsToggle
                  checked={!!preferences?.notification_sound_enabled}
                  onChange={handleToggleSound}
                  isLoading={
                    updateSettings.isPending &&
                    updateSettings.variables?.notification_sound_enabled !==
                      undefined
                  }
                  ariaLabel="Suara Notifikasi"
                />
              </div>
            }
          />

          {/* Row 2: Laporan Baru */}
          <SettingsRow
            title="Laporan Baru"
            description="Terima pemberitahuan ketika laporan baru masuk ke wilayah penugasan Anda."
            control={
              <SettingsToggle
                checked={!!preferences?.notification_report_enabled}
                onChange={handleToggleReport}
                isLoading={
                  updateSettings.isPending &&
                  updateSettings.variables?.notification_report_enabled !==
                    undefined
                }
                ariaLabel="Notifikasi Laporan Baru"
              />
            }
          />

          {/* Row 3: Perubahan Status Laporan */}
          <SettingsRow
            title="Perubahan Status Laporan"
            description="Terima pemberitahuan ketika status laporan berubah."
            control={
              <SettingsToggle
                checked={!!preferences?.notification_status_enabled}
                onChange={handleToggleStatus}
                isLoading={
                  updateSettings.isPending &&
                  updateSettings.variables?.notification_status_enabled !==
                    undefined
                }
                ariaLabel="Notifikasi Perubahan Status Laporan"
              />
            }
          />

          {/* Row 4: Pesan Warga */}
          <SettingsRow
            title="Pesan Warga"
            description="Terima pemberitahuan ketika warga mengirim pesan baru."
            control={
              <SettingsToggle
                checked={!!preferences?.notification_chat_enabled}
                onChange={handleToggleChat}
                isLoading={
                  updateSettings.isPending &&
                  updateSettings.variables?.notification_chat_enabled !==
                    undefined
                }
                ariaLabel="Notifikasi Pesan Warga"
              />
            }
          />
        </SettingsSection>

        {/* SECTION 02 — TAMPILAN */}
        <SettingsSection
          id="section-tampilan"
          title="Tampilan"
          description="Sesuaikan tampilan ROADIS dengan preferensi Anda."
          icon={Palette}
          iconBgColor="bg-[#EAF4FB] dark:bg-blue-medium/20"
          iconTextColor="text-navy-primary dark:text-blue-pale"
        >
          {/* Row 1: Tema Aplikasi */}
          <SettingsRow
            title="Tema Aplikasi"
            description="Pilih skema warna antarmuka yang nyaman bagi Anda."
            control={
              <SettingsSegmentedControl
                options={THEME_OPTIONS}
                value={preferences?.theme || "system"}
                onChange={handleChangeTheme}
                disabled={updateSettings.isPending}
                ariaLabel="Pilihan Tema Aplikasi"
              />
            }
          />

          {/* Row 2: Kepadatan Tampilan */}
          <SettingsRow
            title="Kepadatan Tampilan"
            description="Atur jarak dan kerapatan elemen dalam antarmuka."
            control={
              <SettingsSegmentedControl
                options={DENSITY_OPTIONS}
                value={preferences?.display_density || "comfortable"}
                onChange={handleChangeDensity}
                disabled={updateSettings.isPending}
                ariaLabel="Pilihan Kepadatan Tampilan"
              />
            }
          />
        </SettingsSection>

        {/* SECTION 03 — PETA & LAPORAN */}
        <SettingsSection
          id="section-peta-laporan"
          title="Peta & Laporan"
          description="Atur preferensi tampilan peta dan daftar laporan."
          icon={Map}
          iconBgColor="bg-[#EAF4FB] dark:bg-blue-medium/20"
          iconTextColor="text-navy-primary dark:text-blue-pale"
        >
          {/* Row 1: Tampilan Default Peta */}
          <SettingsRow
            title="Tampilan Default Peta"
            description="Pilih layer peta standar yang dimuat saat membuka modul peta."
            control={
              <SettingsSegmentedControl
                options={MAP_VIEW_OPTIONS}
                value={preferences?.map_default_view || "standard"}
                onChange={handleChangeMapView}
                disabled={updateSettings.isPending}
                ariaLabel="Pilihan Tampilan Default Peta"
              />
            }
          />

          {/* Row 2: Tampilkan Label Lokasi */}
          <SettingsRow
            title="Tampilkan Label Lokasi"
            description="Tampilkan informasi label lokasi pada tampilan peta."
            control={
              <SettingsToggle
                checked={!!preferences?.map_show_labels}
                onChange={handleToggleMapLabels}
                isLoading={
                  updateSettings.isPending &&
                  updateSettings.variables?.map_show_labels !== undefined
                }
                ariaLabel="Tampilkan Label Lokasi Peta"
              />
            }
          />

          {/* Row 3: Preferensi Tampilan Laporan */}
          <SettingsRow
            title="Preferensi Tampilan Laporan"
            description="Pilih format kerapatan daftar baris pada tabel laporan."
            control={
              <SettingsSegmentedControl
                options={REPORT_DISPLAY_OPTIONS}
                value={preferences?.report_display_preference || "comfortable"}
                onChange={handleChangeReportDisplay}
                disabled={updateSettings.isPending}
                ariaLabel="Pilihan Tampilan Laporan"
              />
            }
          />
        </SettingsSection>

        {/* SECTION 04 — KEAMANAN */}
        <SettingsSection
          id="section-keamanan"
          title="Keamanan"
          description="Kelola keamanan dan akses akun Anda."
          icon={Shield}
          iconBgColor="bg-[#FFF4E8] dark:bg-amber-950/40"
          iconTextColor="text-severity-berat dark:text-amber-400"
        >
          {/* Row 1: Kata Sandi */}
          <SettingsRow
            title="Kata Sandi"
            description="Perbarui kata sandi akun Anda secara berkala."
            control={
              <Link
                to="/pemdes/profil"
                state={{ openPasswordModal: true }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#12233A] border border-blue-pale/60 dark:border-white/10 text-xs font-semibold text-navy-primary dark:text-navy-deepest hover:bg-[#EEF5FB] dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium shadow-2xs group select-none"
              >
                <span>Ubah Password</span>
                <ChevronRight
                  className="w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] group-hover:text-navy-primary dark:group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  aria-hidden="true"
                />
              </Link>
            }
          />

          {/* Row 2: Login Terakhir */}
          <SettingsRow
            title="Login Terakhir"
            description="Waktu autentikasi sesi terakhir akun Anda."
            control={
              <span className="text-xs font-semibold text-navy-deepest bg-canvas dark:bg-[#07111F] px-3.5 py-1.5 rounded-full border border-blue-pale/30 dark:border-white/10 select-none">
                {security?.last_login_at
                  ? formatDateTimeIndo(security.last_login_at)
                  : "Belum pernah login"}
              </span>
            }
          />

          {/* Row 3: Sesi Saat Ini */}
          <SettingsRow
            title="Sesi Saat Ini"
            description="Status perangkat dan sesi aktif saat ini."
            control={
              security?.has_active_session ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-status-selesai/10 text-status-selesai border border-status-selesai/20 select-none">
                  <span
                    className="w-2 h-2 rounded-full bg-status-selesai animate-pulse"
                    aria-hidden="true"
                  />
                  <span>Aktif</span>
                </span>
              ) : (
                <span className="text-xs text-muted dark:text-[#8FA4BA]">
                  Tidak Ada Sesi
                </span>
              )
            }
          />

          {/* Row 4: Logout Semua Sesi */}
          <SettingsRow
            title="Logout Semua Sesi"
            description="Keluarkan akun Anda dari semua sesi aktif. Anda harus login kembali setelah tindakan ini."
            control={
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-semibold text-severity-berat dark:text-red-400 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-severity-berat select-none shadow-2xs"
              >
                <span>Logout Semua Sesi</span>
              </button>
            }
          />
        </SettingsSection>

        {/* SECTION 05 — AKUN */}
        <SettingsSection
          id="section-akun"
          title="Akun"
          description="Informasi akun dan wilayah penugasan Anda."
          icon={User}
          iconBgColor="bg-[#EAF4FB] dark:bg-blue-medium/20"
          iconTextColor="text-navy-primary dark:text-blue-pale"
        >
          {/* Row 1: Profil */}
          <SettingsRow
            title="Profil"
            description="Kelola nama, nomor telepon, avatar, dan informasi pribadi."
            control={
              <Link
                to="/pemdes/profil"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#12233A] border border-blue-pale/60 dark:border-white/10 text-xs font-semibold text-navy-primary dark:text-navy-deepest hover:bg-[#EEF5FB] dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium shadow-2xs group select-none"
              >
                <span>Lihat Profil</span>
                <ChevronRight
                  className="w-3.5 h-3.5 text-muted dark:text-[#8FA4BA] group-hover:text-navy-primary dark:group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  aria-hidden="true"
                />
              </Link>
            }
          />

          {/* Row 2: Wilayah Penugasan (Read Only) */}
          <SettingsRow
            title="Wilayah Penugasan"
            description="Cakupan kewenangan operasional akun Anda."
            control={
              account?.wilayah ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-navy-deepest">
                    Desa {account.wilayah.nama || "-"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-pale/40 dark:bg-blue-medium/20 text-navy-primary dark:text-blue-pale border border-blue-pale/60 dark:border-white/10 uppercase">
                    {account.wilayah.tipe || "DESA"}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted dark:text-[#8FA4BA] italic">
                  Belum ditentukan
                </span>
              )
            }
          />

          {/* Row 3: Status Akun */}
          <SettingsRow
            title="Status Akun"
            description="Status keaktifan identitas operasional akun di sistem ROADIS."
            control={
              isAccountActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-status-selesai/10 text-status-selesai border border-status-selesai/20 select-none">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-status-selesai"
                    aria-hidden="true"
                  />
                  <span>{displayAccountStatus}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-severity-berat dark:text-red-400 select-none">
                  <span>{displayAccountStatus}</span>
                </span>
              )
            }
          />
        </SettingsSection>
      </main>

      {/* Confirmation Dialog for Logout All Sessions */}
      <LogoutAllDialog
        isOpen={isLogoutDialogOpen}
        isLoading={logoutAll.isPending}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogoutAll}
      />
    </div>
  );
}

export default AdminPemdesSettingsPage;

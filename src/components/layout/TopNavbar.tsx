import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  User,
  Settings,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { getAuthorizedNavigation, formatRoleLabel } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import { useSettings, playNotificationSound } from "@/hooks/useSettings";
import { NotificationDropdown } from "./NotificationDropdown";
import { GlobalQuickSearchModal } from "./GlobalQuickSearchModal";

export interface TopNavbarProps {
  onMenuToggle?: () => void;
}

/**
 * RoadLogoIcon
 * Pixel-accurate reproduction of the ROADIS road emblem from Stitch reference.
 * Features dual road boundaries and dashed central dividing lanes.
 */
function RoadLogoIcon({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={cn("w-7 h-7 md:w-8 md:h-8 shrink-0", className)}
      aria-hidden="true"
    >
      {/* Left road lane curb */}
      <rect x="4" y="3" width="4" height="26" rx="2" />
      {/* Right road lane curb */}
      <rect x="24" y="3" width="4" height="26" rx="2" />
      {/* Center lane divider dashes */}
      <rect x="14" y="4" width="4" height="5" rx="1.5" />
      <rect x="14" y="13.5" width="4" height="5" rx="1.5" />
      <rect x="14" y="23" width="4" height="5" rx="1.5" />
    </svg>
  );
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps): React.JSX.Element {
  const { user, role, logout } = useAuth();
  const { data: profile } = useProfile();
  const navItems = getAuthorizedNavigation(role);
  const location = useLocation();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    data: notifData,
    isLoading: isNotifLoading,
    isError: isNotifError,
    refetch: refetchNotifs,
  } = useNotifications(1, 20);

  const notifications = notifData?.items || [];
  const unreadCount = notifData?.unreadCount ?? 0;

  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  const { data: settings } = useSettings();
  const prevUnreadRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevUnreadRef.current !== null && unreadCount > prevUnreadRef.current) {
      if (settings?.preferences?.notification_sound_enabled) {
        playNotificationSound();
      }
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, settings?.preferences?.notification_sound_enabled]);

  const avatarSrc =
    profile?.avatar_url || user?.avatar_url || user?.profilePhoto;
  const displayName = profile?.name || user?.nama || "Admin Pemdes";
  const displayEmail = profile?.email || user?.email || "";
  const displayWilayah = profile?.wilayah?.nama
    ? `Desa ${profile.wilayah.nama}`
    : user?.wilayahId === 2
      ? "Desa Lobener Lor"
      : "Desa Sukamaju, Kec. Cikedung";
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : "A";

  // Automatically close dropdowns and search on route changes
  useEffect(() => {
    setNotifOpen(false);
    setProfileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Close profile dropdown on click outside or Escape key press
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  // Close notification dropdown on click outside or Escape key press
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotifOpen(false);
      }
    }

    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notifOpen]);

  return (
    <>
      <header
      className="bg-white dark:bg-[#0D1A2D] border border-blue-pale/40 dark:border-white/10 shadow-sm flex items-center justify-between px-6 sm:px-8 md:px-12 h-22 sticky top-6 z-40 rounded-full mx-auto mt-6 w-[95%]"
      aria-label="Navigasi Utama Aplikasi"
    >
      {/* Left: Mobile Toggle & Brand (Icon + ROADIS text) */}
      <div className="flex items-center gap-2 md:gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-full hover:bg-blue-pale/20 dark:hover:bg-white/10 hover:text-navy-deepest dark:hover:text-white text-navy-deepest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <NavLink
          to="/"
          className="flex items-center gap-2 group select-none"
          title="Beranda ROADIS"
        >
          <RoadLogoIcon className="text-navy-primary dark:text-[#5483B3] group-hover:text-navy-deepest dark:group-hover:text-white transition-colors" />
          <span className="text-[26px] font-bold text-navy-deepest tracking-tight select-none leading-none">
            ROADIS
          </span>
        </NavLink>
      </div>

      {/* Center: Desktop Navigation Pills */}
      <nav
        className="hidden md:flex items-center bg-canvas dark:bg-[#07111F] p-1.5 rounded-full border border-blue-pale/40 dark:border-white/10"
        aria-label="Daftar Menu"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "px-6 py-2.5 rounded-full text-[14px] transition-colors duration-200 select-none",
                isActive
                  ? "bg-white dark:bg-[#0D1A2D] shadow-sm text-navy-primary dark:text-navy-deepest font-bold"
                  : "text-muted dark:text-[#AFC0D4] hover:text-navy-deepest dark:hover:text-white hover:bg-blue-pale/20 dark:hover:bg-white/5 font-medium",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right: Search, Notifications, Avatar Profile */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        {/* Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-11 h-11 rounded-full bg-canvas dark:bg-[#07111F] flex items-center justify-center text-muted dark:text-[#AFC0D4] hover:bg-blue-pale/20 dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white hover:border-blue-pale/60 dark:hover:border-white/20 transition-colors border border-blue-pale/40 dark:border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
          title="Cari (Ctrl+K)"
          aria-label="Pencarian Cepat"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Notifications Button with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileMenuOpen(false);
            }}
            className={cn(
              "w-11 h-11 rounded-full bg-canvas dark:bg-[#07111F] flex items-center justify-center text-muted dark:text-[#AFC0D4] hover:bg-blue-pale/20 dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white hover:border-blue-pale/60 dark:hover:border-white/20 transition-colors relative border border-blue-pale/40 dark:border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium",
              notifOpen &&
                "bg-blue-pale/20 dark:bg-white/10 text-navy-deepest dark:text-white border-blue-pale/60 dark:border-white/20",
            )}
            title="Notifikasi"
            aria-label="Notifikasi"
            aria-expanded={notifOpen}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-severity-berat text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white select-none leading-none shadow-xs"
                aria-hidden="true"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <NotificationDropdown
              notifications={notifications.slice(0, 5)}
              unreadCount={unreadCount}
              totalCount={notifData?.meta?.total}
              isLoading={isNotifLoading}
              isError={isNotifError}
              onRefetch={() => refetchNotifs()}
              onClose={() => setNotifOpen(false)}
              onMarkRead={(id) => markNotificationRead.mutate(id)}
              onMarkAllRead={() => markAllNotificationsRead.mutate()}
            />
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 sm:gap-3 cursor-pointer p-1.5 pr-2.5 sm:pr-3 rounded-full transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium group select-none",
              profileMenuOpen
                ? "bg-blue-pale/20 dark:bg-white/10 border-blue-pale/40 dark:border-white/20 text-navy-deepest dark:text-white"
                : "hover:bg-blue-pale/20 dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white border-transparent hover:border-blue-pale/40 dark:hover:border-white/20",
            )}
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
            aria-label="Menu Profil Pengguna"
          >
            <div
              className="w-9 h-9 rounded-full bg-blue-pale dark:bg-blue-medium/30 text-navy-primary dark:text-blue-pale font-bold flex items-center justify-center text-xs ring-1 ring-blue-pale/60 dark:ring-white/10 shadow-xs overflow-hidden"
              aria-hidden="true"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                userInitial
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted dark:text-[#AFC0D4] group-hover:text-navy-deepest dark:group-hover:text-white transition-all duration-200",
                profileMenuOpen &&
                  "rotate-180 text-navy-deepest dark:text-white",
              )}
              aria-hidden="true"
            />
          </button>

          {/* Profile Dropdown Menu - Executive Administrative Design */}
          {profileMenuOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-[calc(100%+12px)] w-80 bg-white dark:bg-[#0D1A2D] rounded-3xl shadow-2xl shadow-navy-deepest/12 border border-blue-pale/40 dark:border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              role="menu"
              aria-label="Profil Pengguna"
            >
              {/* Header Profile Cardlet */}
              <div className="p-4 bg-linear-to-br from-canvas via-white to-blue-pale/20 dark:from-[#0D1A2D] dark:via-[#0D1A2D] dark:to-[#12233A] border-b border-blue-pale/30 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-navy-primary to-blue-medium text-white font-bold text-lg flex items-center justify-center shadow-md ring-2 ring-white dark:ring-white/20 shrink-0 overflow-hidden">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy-deepest truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-muted dark:text-[#AFC0D4] truncate mt-0.5">
                      {displayEmail}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white dark:bg-[#12233A] text-navy-primary dark:text-navy-deepest border border-blue-pale/60 dark:border-white/10 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-selesai animate-pulse" />
                      {formatRoleLabel(role)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Territory Section */}
              <div className="px-4 py-3 bg-canvas/60 dark:bg-[#07111F]/60 border-b border-blue-pale/20 dark:border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#12233A] border border-blue-pale/40 dark:border-white/10 flex items-center justify-center text-blue-medium shadow-xs shrink-0">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted dark:text-[#AFC0D4]">
                    Wilayah Penugasan
                  </p>
                  <p className="text-xs font-semibold text-navy-deepest truncate">
                    {displayWilayah}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="p-2 space-y-1">
                <NavLink
                  to={role === "admin_pemdes" ? "/pemdes/profil" : "/profile"}
                  onClick={() => setProfileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-navy-deepest hover:bg-canvas dark:hover:bg-white/5 hover:text-navy-primary dark:hover:text-white transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <User
                      className="w-4 h-4 text-muted dark:text-[#AFC0D4] group-hover:text-navy-primary dark:group-hover:text-white transition-colors"
                      aria-hidden="true"
                    />
                    <span>Profil Pengguna</span>
                  </div>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-muted/60 dark:text-[#AFC0D4]/60 group-hover:text-navy-primary dark:group-hover:text-white group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </NavLink>

                <NavLink
                  to={
                    role === "admin_pemdes" ? "/pemdes/pengaturan" : "/settings"
                  }
                  onClick={() => setProfileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-navy-deepest hover:bg-canvas dark:hover:bg-white/5 hover:text-navy-primary dark:hover:text-white transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings
                      className="w-4 h-4 text-muted dark:text-[#AFC0D4] group-hover:text-navy-primary dark:group-hover:text-white transition-colors"
                      aria-hidden="true"
                    />
                    <span>Pengaturan Sistem</span>
                  </div>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-muted/60 dark:text-[#AFC0D4]/60 group-hover:text-navy-primary dark:group-hover:text-white group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </NavLink>
              </div>

              {/* Logout Action */}
              <div className="p-2 border-t border-blue-pale/30 dark:border-white/10 bg-gray-50/50 dark:bg-[#07111F]/50">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-severity-berat dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all cursor-pointer group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-red-100/70 text-severity-berat flex items-center justify-center group-hover:bg-red-200/70 transition-colors">
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <span>Keluar dari Akun</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Global Quick Search Modal */}
    {isSearchOpen && (
      <GlobalQuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    )}
  </>
  );
}

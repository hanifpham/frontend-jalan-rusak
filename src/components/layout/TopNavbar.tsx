import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
import { getAuthorizedNavigation, formatRoleLabel } from "@/lib/permissions";
import { cn } from "@/lib/utils";

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
  const navItems = getAuthorizedNavigation(role);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userInitial = user?.nama ? user.nama.charAt(0).toUpperCase() : "B";

  // Close dropdown on click outside or Escape key press
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

  return (
    <header
      className="bg-white border border-blue-pale/40 shadow-sm flex items-center justify-between px-6 sm:px-8 md:px-12 h-22 sticky top-6 z-40 rounded-full mx-auto mt-6 w-[95%]"
      aria-label="Navigasi Utama Aplikasi"
    >
      {/* Left: Mobile Toggle & Brand (Icon + ROADIS text) */}
      <div className="flex items-center gap-2 md:gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-full hover:bg-canvas text-navy-deepest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
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
          <RoadLogoIcon className="text-navy-primary group-hover:text-navy-deepest transition-colors" />
          <span className="text-[26px] font-bold text-navy-deepest tracking-tight select-none leading-none">
            ROADIS
          </span>
        </NavLink>
      </div>

      {/* Center: Desktop Navigation Pills */}
      <nav
        className="hidden md:flex items-center bg-canvas p-1.5 rounded-full border border-blue-pale/40"
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
                  ? "bg-white shadow-sm text-navy-primary font-bold"
                  : "text-muted hover:text-navy-deepest hover:bg-white/60 font-medium",
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
          className="w-11 h-11 rounded-full bg-canvas flex items-center justify-center text-muted hover:bg-blue-pale/20 hover:text-navy-deepest transition-colors border border-blue-pale/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
          title="Cari"
          aria-label="Pencarian Laporan"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Notifications Button with Red Dot */}
        <button
          type="button"
          className="w-11 h-11 rounded-full bg-canvas flex items-center justify-center text-muted hover:bg-blue-pale/20 hover:text-navy-deepest transition-colors relative border border-blue-pale/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
          title="Notifikasi"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span
            className="absolute top-2.5 right-3 w-2 h-2 bg-severity-berat rounded-full ring-2 ring-white"
            aria-hidden="true"
          />
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-canvas p-1.5 pr-2.5 sm:pr-3 rounded-full transition-colors border border-transparent hover:border-blue-pale/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
            aria-label="Menu Profil Pengguna"
          >
            <div
              className="w-9 h-9 rounded-full bg-blue-pale text-navy-primary font-bold flex items-center justify-center text-xs ring-1 ring-blue-pale/60 shadow-xs"
              aria-hidden="true"
            >
              {userInitial}
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted transition-transform duration-200",
                profileMenuOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {/* Profile Dropdown Menu - Executive Administrative Design */}
          {profileMenuOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-[calc(100%+12px)] w-80 bg-white rounded-3xl shadow-2xl shadow-navy-deepest/12 border border-blue-pale/40 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              role="menu"
              aria-label="Profil Pengguna"
            >
              {/* Header Profile Cardlet */}
              <div className="p-4 bg-linear-to-br from-canvas via-white to-blue-pale/20 border-b border-blue-pale/30">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-navy-primary to-blue-medium text-white font-bold text-lg flex items-center justify-center shadow-md ring-2 ring-white shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy-deepest truncate">
                      {user?.nama || "Budi Santoso"}
                    </p>
                    <p className="text-[11px] text-muted truncate mt-0.5">
                      {user?.email || "admin.pemdes@roadis.id"}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-navy-primary border border-blue-pale/60 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-selesai animate-pulse" />
                      {formatRoleLabel(role)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Territory Section */}
              <div className="px-4 py-3 bg-canvas/60 border-b border-blue-pale/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-blue-pale/40 flex items-center justify-center text-blue-medium shadow-xs shrink-0">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted">
                    Wilayah Penugasan
                  </p>
                  <p className="text-xs font-semibold text-navy-deepest truncate">
                    {user?.wilayahId === 2
                      ? "Desa Lobener Lor"
                      : "Desa Sukamaju, Kec. Cikedung"}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="p-2 space-y-1">
                <NavLink
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-navy-deepest hover:bg-canvas hover:text-navy-primary transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <User
                      className="w-4 h-4 text-muted group-hover:text-navy-primary transition-colors"
                      aria-hidden="true"
                    />
                    <span>Profil Pengguna</span>
                  </div>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-muted/60 group-hover:text-navy-primary group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-navy-deepest hover:bg-canvas hover:text-navy-primary transition-colors cursor-pointer group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings
                      className="w-4 h-4 text-muted group-hover:text-navy-primary transition-colors"
                      aria-hidden="true"
                    />
                    <span>Pengaturan Sistem</span>
                  </div>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-muted/60 group-hover:text-navy-primary group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </NavLink>
              </div>

              {/* Logout Action */}
              <div className="p-2 border-t border-blue-pale/30 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-severity-berat hover:bg-red-50 rounded-2xl transition-all cursor-pointer group"
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
  );
}

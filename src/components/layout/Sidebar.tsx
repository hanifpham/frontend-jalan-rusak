import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Map,
  MessageSquare,
  Users,
  Layers,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import {
  getAuthorizedNavigation,
  type NavigationItem,
} from "@/lib/permissions";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const iconRegistry: Record<
  NavigationItem["iconName"],
  React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>
> = {
  LayoutDashboard,
  ClipboardList: FileText,
  MapPin: Map,
  MessageSquare,
  Users,
  Layers,
};

export function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps): React.JSX.Element {
  const { role, logout } = useAuth();
  const location = useLocation();
  const navItems = getAuthorizedNavigation(role);

  const settingsPath =
    role === "admin_pemdes" ? "/pemdes/pengaturan" : "/settings";
  const isSettingsActive =
    location.pathname === "/pemdes/pengaturan" ||
    location.pathname.startsWith("/pemdes/pengaturan/") ||
    location.pathname === "/settings" ||
    location.pathname === "/pengaturan";

  const desktopContent = (
    <nav
      className="hidden md:flex flex-col gap-4 w-18 shrink-0 sticky top-30 h-[calc(100vh-160px)] z-30"
      aria-label="Navigasi Samping"
    >
      {/* Top Main Navigation Pill Container */}
      <div className="p-3 flex flex-col gap-4 items-center border border-blue-pale/40 dark:border-white/10 shadow-sm rounded-full bg-white dark:bg-[#0D1A2D]">
        {navItems.map((item) => {
          const IconComponent = iconRegistry[item.iconName] || LayoutDashboard;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium",
                  isActive
                    ? "bg-navy-primary dark:bg-[#001234] text-white shadow-md"
                    : "text-muted dark:text-[#AFC0D4] hover:bg-[#EEF5FB] dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white",
                )
              }
              aria-label={item.label}
            >
              <IconComponent className="w-5 h-5" aria-hidden="true" />
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Navigation Pill Container: Pengaturan & Keluar */}
      <div className="mt-auto p-3 flex flex-col gap-4 items-center border border-blue-pale/40 dark:border-white/10 shadow-sm rounded-full bg-white dark:bg-[#0D1A2D]">
        <NavLink
          to={settingsPath}
          title="Pengaturan"
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium",
            isSettingsActive
              ? "bg-navy-primary dark:bg-[#001234] text-white shadow-md"
              : "text-muted dark:text-[#AFC0D4] hover:bg-[#EEF5FB] dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white",
          )}
          aria-label="Pengaturan"
          aria-current={isSettingsActive ? "page" : undefined}
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </NavLink>

        <button
          type="button"
          onClick={logout}
          title="Keluar dari Akun"
          className="w-12 h-12 rounded-full text-muted dark:text-[#AFC0D4] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-severity-berat dark:hover:text-red-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-severity-berat"
          aria-label="Keluar dari akun"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );

  const mobileDrawerContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0D1A2D] rounded-3xl border border-blue-pale/50 dark:border-white/10 shadow-xl p-5">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-white/10">
        <span className="font-bold text-sm text-navy-deepest">
          Menu Navigasi ROADIS
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-canvas dark:hover:bg-white/5 text-muted dark:text-[#AFC0D4] hover:text-navy-deepest dark:hover:text-white"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const IconComponent = iconRegistry[item.iconName] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-navy-primary dark:bg-[#001234] text-white font-bold shadow-sm"
                    : "text-muted dark:text-[#AFC0D4] hover:bg-[#EEF5FB] dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white",
                )
              }
            >
              <IconComponent className="w-5 h-5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-1.5">
        <NavLink
          to={settingsPath}
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors select-none",
            isSettingsActive
              ? "bg-navy-primary dark:bg-[#001234] text-white font-bold shadow-sm"
              : "text-muted dark:text-[#AFC0D4] hover:bg-[#EEF5FB] dark:hover:bg-white/5 hover:text-navy-deepest dark:hover:text-white",
          )}
          aria-current={isSettingsActive ? "page" : undefined}
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
          <span>Pengaturan</span>
        </NavLink>

        <button
          type="button"
          onClick={() => {
            onClose?.();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-severity-berat dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {desktopContent}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Seluler"
        >
          <div
            className="fixed inset-0 bg-navy-deepest/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full p-4 z-10">
            {mobileDrawerContent}
          </div>
        </div>
      )}
    </>
  );
}

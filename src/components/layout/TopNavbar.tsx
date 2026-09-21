import React from 'react';
import { LogOut, Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { formatRoleLabel } from '@/lib/permissions';
import { Button } from '@/components/ui/Button';

export interface TopNavbarProps {
  onMenuToggle?: () => void;
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps): React.JSX.Element {
  const { user, role, logout } = useAuth();

  const userInitial = user?.nama ? user.nama.charAt(0).toUpperCase() : 'A';

  return (
    <header className="sticky top-3 z-30 w-[95%] max-w-7xl mx-auto">
      <nav
        className="h-[88px] px-6 sm:px-8 bg-white/95 backdrop-blur-md rounded-full border border-blue-pale/50 shadow-sm flex items-center justify-between transition-all"
        aria-label="Navigasi Utama Aplikasi"
      >
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-full hover:bg-canvas text-navy-deepest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-navy-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-navy-deepest tracking-tight">
                  ROADIS
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-blue-pale/40 text-navy-primary">
                  Indramayu
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-muted -mt-0.5">
                Sistem Pemantauan Kerusakan Jalan
              </p>
            </div>
          </div>
        </div>

        {/* Right: User Information & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden md:block">
              <p className="text-xs font-bold text-navy-deepest leading-tight">
                {user?.nama || 'Administrator'}
              </p>
              <span className="inline-block mt-0.5 text-[11px] font-medium text-blue-medium">
                {formatRoleLabel(role)}
              </span>
            </div>

            <div
              className="w-10 h-10 rounded-full bg-blue-pale/50 border border-blue-pale text-navy-primary font-bold flex items-center justify-center text-sm shadow-inner"
              title={user?.email || 'Admin'}
              aria-label={`Akun ${user?.nama || 'Admin'}`}
            >
              {userInitial}
            </div>
          </div>

          <div className="h-7 w-px bg-gray-200 hidden sm:block" aria-hidden="true" />

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="h-9 px-3 text-muted hover:text-severity-berat hover:border-severity-berat/40"
            title="Keluar dari sesi akun"
            aria-label="Keluar dari akun"
          >
            <LogOut className="w-4 h-4 sm:mr-1.5" aria-hidden="true" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}

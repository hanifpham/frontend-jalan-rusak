import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  MessageSquare,
  Users,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { getAuthorizedNavigation, type NavigationItem } from '@/lib/permissions';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const iconRegistry: Record<
  NavigationItem['iconName'],
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
> = {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  MessageSquare,
  Users,
  Layers,
};

export function Sidebar({ isOpen = false, onClose }: SidebarProps): React.JSX.Element {
  const { role } = useAuth();
  const navItems = getAuthorizedNavigation(role);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white rounded-card border border-blue-pale/50 shadow-sm p-4">
      {/* Mobile Header with close button */}
      <div className="lg:hidden flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <span className="font-bold text-sm text-navy-deepest">Menu Navigasi</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-canvas text-muted hover:text-navy-deepest"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5" aria-label="Navigasi Menu Samping">
        {navItems.map((item) => {
          const IconComponent = iconRegistry[item.iconName] || LayoutDashboard;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors select-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium focus-visible:ring-offset-1',
                  isActive
                    ? 'bg-navy-primary text-white shadow-sm font-semibold'
                    : 'text-muted hover:text-navy-deepest hover:bg-blue-pale/20'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-blue-medium')}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-100 text-center text-[11px] text-muted">
        ROADIS Indramayu v0.1.0
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-28 self-start">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Seluler"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-deepest/30 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[80vw] h-full p-4 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

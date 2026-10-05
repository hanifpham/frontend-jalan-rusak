/**
 * Authoritative capability and navigation configuration derived from docs/07-role-permissions.md.
 * 
 * IMPORTANT ARCHITECTURAL & SECURITY PRINCIPLE:
 * - Backend = Authoritative authorization and security boundary.
 * - Frontend = Navigation visibility + UX role guards.
 * - The backend must enforce report/chat ownership, IDOR prevention, and role scopes.
 * This client-side registry controls UI navigation visibility and user guidance ONLY.
 * It does NOT replace or constitute backend security.
 */
import { type Role } from '@/types/domain';

export type Capability =
  | 'view_dashboard'
  | 'view_reports'
  | 'update_reports'
  | 'view_map'
  | 'use_chat'
  | 'manage_users'
  | 'manage_wilayah'
  | 'view_activities'
  | 'view_settings';

const roleCapabilities: Record<Role, readonly Capability[]> = {
  warga: [],
  admin_pemdes: [
    'view_dashboard',
    'view_reports',
    'update_reports',
    'view_map',
    'use_chat',
  ],
  admin_pu: [
    'view_dashboard',
    'view_reports',
    'update_reports',
    'view_map',
    'use_chat',
  ],
  super_admin: [
    'view_dashboard',
    'view_reports',
    'update_reports',
    'view_map',
    'use_chat',
    'manage_users',
    'manage_wilayah',
    'view_activities',
    'view_settings',
  ],
};

export function hasCapability(role: Role | undefined | null, capability: Capability): boolean {
  if (!role) return false;
  const capabilities = roleCapabilities[role];
  return capabilities ? capabilities.includes(capability) : false;
}

export function formatRoleLabel(role: Role | undefined | null): string {
  switch (role) {
    case 'admin_pemdes':
      return 'Admin Pemdes';
    case 'admin_pu':
      return 'Admin Dinas PU';
    case 'super_admin':
      return 'Superadmin';
    case 'warga':
      return 'Warga / Pelapor';
    default:
      return 'Tamu';
  }
}

export interface NavigationItem {
  label: string;
  path: string;
  iconName: 'LayoutDashboard' | 'ClipboardList' | 'MapPin' | 'MessageSquare' | 'Users' | 'Layers';
  requiredCapability: Capability;
}

/**
 * Authoritative navigation configuration derived from docs/07-role-permissions.md.
 * Admin PU and Admin Pemdes strictly receive operational routes.
 * Superadmin receives administration modules in the navigation configuration.
 */
export const navigationRegistry: NavigationItem[] = [
  {
    label: 'Beranda',
    path: '/',
    iconName: 'LayoutDashboard',
    requiredCapability: 'view_dashboard',
  },
  {
    label: 'Laporan',
    path: '/reports',
    iconName: 'ClipboardList',
    requiredCapability: 'view_reports',
  },
  {
    label: 'Peta',
    path: '/map',
    iconName: 'MapPin',
    requiredCapability: 'view_map',
  },
  {
    label: 'Pesan',
    path: '/messages',
    iconName: 'MessageSquare',
    requiredCapability: 'use_chat',
  },
  {
    label: 'Manajemen Pengguna',
    path: '/users',
    iconName: 'Users',
    requiredCapability: 'manage_users',
  },
  {
    label: 'Manajemen Wilayah',
    path: '/wilayah',
    iconName: 'Layers',
    requiredCapability: 'manage_wilayah',
  },
];

export function getAuthorizedNavigation(role: Role | undefined | null): NavigationItem[] {
  if (!role) return [];
  const items = navigationRegistry.filter((item) => hasCapability(role, item.requiredCapability));

  if (role === 'admin_pemdes') {
    return items.map((item) => {
      if (item.label === 'Beranda') return { ...item, path: '/pemdes/beranda' };
      if (item.label === 'Laporan') return { ...item, path: '/pemdes/laporan' };
      if (item.label === 'Peta') return { ...item, path: '/pemdes/peta' };
      if (item.label === 'Pesan') return { ...item, path: '/pemdes/pesan' };
      return item;
    });
  }

  if (role === 'admin_pu') {
    return items.map((item) => {
      if (item.label === 'Beranda') return { ...item, path: '/pu/beranda' };
      if (item.label === 'Laporan') return { ...item, path: '/pu/laporan' };
      if (item.label === 'Peta') return { ...item, path: '/pu/peta' };
      if (item.label === 'Pesan') return { ...item, path: '/pu/pesan' };
      return item;
    });
  }

  return items;
}

/**
 * Resolves the authoritative default landing route based on user role.
 */
export function getDefaultLandingRoute(role: Role | undefined | null): string {
  switch (role) {
    case 'admin_pu':
      return '/pu/beranda';
    case 'admin_pemdes':
      return '/pemdes/beranda';
    case 'super_admin':
      return '/';
    case 'warga':
      return '/';
    default:
      return '/';
  }
}

/**
 * Checks whether a given path is authorized for the given role.
 * Used during login redirect to prevent unauthorized redirects (e.g. admin_pu landing on /pemdes/*).
 */
export function isPathAllowedForRole(path: string, role: Role | undefined | null): boolean {
  if (!role) return false;
  if (role === 'admin_pu') {
    if (path.startsWith('/pemdes')) return false;
    return true;
  }
  if (role === 'admin_pemdes') {
    if (path.startsWith('/pu')) return false;
    return true;
  }
  return true;
}

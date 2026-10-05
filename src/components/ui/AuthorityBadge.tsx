import React from 'react';
import { cn } from '@/lib/utils';
import { type RoadAuthority } from '@/types/domain';

export type AuthorityValue = RoadAuthority | 'desa' | 'kabupaten' | 'provinsi' | 'nasional' | 'tidak_teridentifikasi' | string;

export interface AuthorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  authority?: AuthorityValue;
  size?: 'sm' | 'md' | 'lg';
}

interface AuthorityConfig {
  label: string;
  colorClass: string;
}

const authorityMap: Record<string, AuthorityConfig> = {
  desa: {
    label: 'DESA',
    colorClass:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  kabupaten: {
    label: 'KABUPATEN',
    colorClass:
      'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  provinsi: {
    label: 'PROVINSI',
    colorClass:
      'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  nasional: {
    label: 'NASIONAL',
    colorClass:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  tidak_teridentifikasi: {
    label: 'TIDAK TERIDENTIFIKASI',
    colorClass:
      'bg-gray-100 dark:bg-white/10 text-muted dark:text-[#8FA4BA] border-gray-200 dark:border-white/10',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
  lg: 'px-3.5 py-1.5 text-xs',
};

/**
 * AuthorityBadge
 * Single source of truth for Road Authority badges across the entire application.
 * Values: DESA (Emerald), KABUPATEN (Blue), PROVINSI (Purple), NASIONAL (Amber), TIDAK TERIDENTIFIKASI (Slate).
 */
const fallbackConfig: AuthorityConfig = {
  label: 'TIDAK TERIDENTIFIKASI',
  colorClass:
    'bg-gray-100 dark:bg-white/10 text-muted dark:text-[#8FA4BA] border-gray-200 dark:border-white/10',
};

export function AuthorityBadge({
  authority,
  size = 'md',
  className,
  ...props
}: AuthorityBadgeProps): React.JSX.Element {
  const normKey = (authority || '').toLowerCase().trim();
  const config: AuthorityConfig = authorityMap[normKey] ?? fallbackConfig;

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold uppercase tracking-wider rounded-full border select-none transition-colors',
        sizeClasses[size],
        config.colorClass,
        className
      )}
      title={`Kewenangan: ${config.label}`}
      {...props}
    >
      {config.label}
    </span>
  );
}

export default AuthorityBadge;

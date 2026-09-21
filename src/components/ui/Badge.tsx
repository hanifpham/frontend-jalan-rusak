import React from 'react';
import { cn } from '@/lib/utils';
import { type ReportStatus, type Severity } from '@/types/domain';

export type StatusType = ReportStatus | 'menunggu' | 'proses' | 'selesai';
export type SeverityType = Severity | 'ringan' | 'sedang' | 'berat';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
}

export interface SeverityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity: SeverityType;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'neutral';
}

const statusConfig: Record<
  ReportStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  menunggu: {
    label: 'MENUNGGU',
    bg: 'bg-status-menunggu/15',
    text: 'text-status-menunggu',
    dot: 'bg-status-menunggu',
  },
  proses: {
    label: 'PROSES',
    bg: 'bg-status-proses/15',
    text: 'text-status-proses',
    dot: 'bg-status-proses',
  },
  selesai: {
    label: 'SELESAI',
    bg: 'bg-status-selesai/15',
    text: 'text-status-selesai',
    dot: 'bg-status-selesai',
  },
};

const severityConfig: Record<
  Severity,
  { label: string; bg: string; text: string; dot: string }
> = {
  ringan: {
    label: 'RINGAN',
    bg: 'bg-severity-ringan/15',
    text: 'text-severity-ringan',
    dot: 'bg-severity-ringan',
  },
  sedang: {
    label: 'SEDANG',
    bg: 'bg-severity-sedang/15',
    text: 'text-severity-sedang',
    dot: 'bg-severity-sedang',
  },
  berat: {
    label: 'BERAT',
    bg: 'bg-severity-berat/15',
    text: 'text-severity-berat',
    dot: 'bg-severity-berat',
  },
};

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const normalizedKey = status.toLowerCase() as ReportStatus;
  const config = statusConfig[normalizedKey] || statusConfig.menunggu;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider select-none border border-transparent',
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity, className, ...props }: SeverityBadgeProps) {
  const normalizedKey = severity.toLowerCase() as Severity;
  const config = severityConfig[normalizedKey] || severityConfig.sedang;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider select-none border border-transparent',
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-blue-pale/30 text-navy-primary border-transparent',
    outline: 'bg-transparent text-navy-deepest border-blue-pale',
    neutral: 'bg-gray-100 text-muted border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

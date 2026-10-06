import React from 'react';
import { cn } from '@/lib/utils';

export interface SettingsRowProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  control: React.ReactNode;
  className?: string;
}

export function SettingsRow({
  title,
  description,
  badge,
  control,
  className,
}: SettingsRowProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4',
        className
      )}
    >
      <div className="space-y-1 pr-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-navy-deepest">{title}</h3>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="shrink-0 self-start sm:self-center">
        {control}
      </div>
    </div>
  );
}

export default SettingsRow;

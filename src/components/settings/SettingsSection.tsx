import React from 'react';
import { cn } from '@/lib/utils';

export interface SettingsSectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  iconBgColor?: string;
  iconTextColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  id,
  title,
  description,
  icon: Icon,
  iconBgColor = 'bg-[#EAF4FB]',
  iconTextColor = 'text-navy-primary',
  children,
  className,
}: SettingsSectionProps): React.JSX.Element {
  return (
    <section aria-labelledby={`${id}-heading`} className={cn('space-y-4 pt-6 first:pt-0', className)}>
      <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100 dark:border-white/10">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs',
            iconBgColor,
            iconTextColor
          )}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id={`${id}-heading`} className="text-base sm:text-lg font-bold text-navy-deepest tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted dark:text-[#8FA4BA] mt-0.5 leading-snug">
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100/80 dark:divide-white/10">
        {children}
      </div>
    </section>
  );
}

export default SettingsSection;

import React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

export interface SettingsSegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel: string;
}

export function SettingsSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel,
}: SettingsSegmentedControlProps<T>): React.JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center p-1 rounded-full bg-canvas dark:bg-[#07111F] border border-blue-pale/40 dark:border-white/10 gap-1 self-start sm:self-center"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const IconComponent = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all select-none cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium active:scale-95',
              isSelected
                ? 'bg-navy-primary dark:bg-navy-primary text-white shadow-xs'
                : 'text-muted dark:text-[#8FA4BA] hover:text-navy-deepest dark:hover:text-white hover:bg-[#EEF5FB]/70 dark:hover:bg-white/5',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {IconComponent && <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SettingsSegmentedControl;

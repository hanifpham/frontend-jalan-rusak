import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SettingsToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
  ariaLabel: string;
}

export function SettingsToggle({
  id,
  checked,
  onChange,
  disabled = false,
  isLoading = false,
  ariaLabel,
}: SettingsToggleProps): React.JSX.Element {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium focus-visible:ring-offset-2',
        checked ? 'bg-navy-primary dark:bg-[#5483B3]' : 'bg-gray-300 dark:bg-[#26364A]',
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'pointer-events-none flex h-6 w-6 transform items-center justify-center rounded-full shadow-sm ring-0 transition duration-200 ease-in-out',
          checked ? 'bg-white translate-x-5' : 'bg-white dark:bg-[#8FA4BA] translate-x-0'
        )}
      >
        {isLoading && (
          <Loader2 className="w-3.5 h-3.5 text-navy-primary animate-spin" aria-hidden="true" />
        )}
      </span>
    </button>
  );
}

export default SettingsToggle;

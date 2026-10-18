import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

export interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ id, checked, onChange, disabled, label, description, className }, ref) => {
    return (
      <div className={cn('inline-flex items-center gap-3 select-none', className)}>
        <button
          id={id}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-150 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            checked ? 'bg-espresso' : 'bg-sand'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-cream shadow-xs ring-0',
              'transition duration-150 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        {(label || description) && (
          <div className="flex flex-col text-left">
            {label && (
              <label
                htmlFor={id}
                onClick={() => !disabled && onChange(!checked)}
                className="text-sm font-medium text-espresso cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-espresso/60">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

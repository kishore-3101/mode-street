import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils.js';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-1.5"
          >
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-espresso/60">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              'w-full bg-cream-surface border border-sand text-espresso text-sm rounded-lg py-2.5 px-3.5',
              'placeholder:text-espresso/40 transition-colors duration-150',
              'focus-visible:outline-none focus-visible:border-camel focus-visible:ring-2 focus-visible:ring-camel/50',
              'disabled:opacity-50 disabled:bg-sand/20 disabled:cursor-not-allowed',
              leftElement ? 'pl-10' : '',
              rightElement ? 'pr-10' : '',
              error ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/30' : '',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-espresso/60">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-espresso/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, id, label, error, helperText, options, children, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-1.5"
          >
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              'w-full appearance-none bg-cream-surface border border-sand text-espresso text-sm rounded-lg py-2.5 pl-3.5 pr-10',
              'transition-colors duration-150 cursor-pointer',
              'focus-visible:outline-none focus-visible:border-camel focus-visible:ring-2 focus-visible:ring-camel/50',
              'disabled:opacity-50 disabled:bg-sand/20 disabled:cursor-not-allowed',
              error ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/30' : '',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-espresso/60">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-espresso/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

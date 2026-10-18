import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils.js';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, error, helperText, disabled, rows = 3, ...props }, ref) => {
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
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full bg-cream-surface border border-sand text-espresso text-sm rounded-lg py-2.5 px-3.5',
            'placeholder:text-espresso/40 transition-colors duration-150 resize-y',
            'focus-visible:outline-none focus-visible:border-camel focus-visible:ring-2 focus-visible:ring-camel/50',
            'disabled:opacity-50 disabled:bg-sand/20 disabled:cursor-not-allowed',
            error ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/30' : '',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-espresso/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

import { type ReactNode } from 'react';
import { cn } from '../../lib/utils.js';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-sand/60',
        className
      )}
    >
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-espresso">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-espresso/70 font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}

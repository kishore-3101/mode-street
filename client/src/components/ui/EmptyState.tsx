import { type ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <PackageOpen className="w-10 h-10 text-camel stroke-[1.5]" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl',
        'border border-dashed border-sand bg-cream/30',
        className
      )}
    >
      <div className="p-3 bg-cream-surface rounded-full shadow-xs mb-3 border border-sand/40">
        {icon}
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-espresso">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-espresso/70 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

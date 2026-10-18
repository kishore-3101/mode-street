import { type ReactNode } from 'react';
import { cn } from '../../lib/utils.js';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'camel' | 'gold' | 'maroon';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}: BadgeProps) {
  const variants = {
    success: 'bg-success-bg text-success border border-[#C6DAC9]',
    warning: 'bg-warning-bg text-warning border border-[#E9D9BF]',
    danger: 'bg-danger-bg text-danger border border-[#F0CBD1]',
    neutral: 'bg-sand/30 text-text/80 border border-sand',
    camel: 'bg-gold/15 text-gold-dark border border-gold/30',
    gold: 'bg-gold/15 text-gold-dark border border-gold/30',
    maroon: 'bg-maroon/10 text-maroon border border-maroon/25',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 uppercase tracking-wider select-none font-sans',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

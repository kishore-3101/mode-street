import type { OrderStatus } from '../../types/index.js';
import { cn } from '../../lib/utils.js';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-[#FDF6E2] text-[#8C6D1F] border-[#F3E5AB]',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-[#F7F2EB] text-[#8C6D4F] border-[#D9C5B2]',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-espresso/5 text-espresso border-espresso/35',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-[#EEF6F0] text-[#2D6A4F] border-[#C6DAC9]',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-[#FDF0EE] text-[#A63A3A] border-[#F0CBD1]',
  },
};

export function OrderStatusBadge({
  status,
  size = 'md',
  className,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-sand/30 text-espresso/80 border-sand',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-1 rounded-[6px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border uppercase tracking-wider select-none font-sans',
        config.className,
        sizes[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}

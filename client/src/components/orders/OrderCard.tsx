import { Link } from 'react-router-dom';
import type { Order } from '../../types/index.js';
import { OrderStatusBadge } from './OrderStatusBadge.js';
import { formatCurrency, formatOrderDate } from '../../lib/utils.js';

export interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="relative bg-cream-surface rounded-xl border border-sand/60 p-4 hover:border-sand transition-colors group">
      <div className="flex items-center justify-between gap-3 mb-2">
        <Link
          to={`/admin/orders/${order.id}`}
          className="font-serif text-lg font-semibold text-espresso hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded after:absolute after:inset-0"
        >
          #{order.order_number}
        </Link>
        <div className="relative z-10">
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
      </div>

      <div className="text-xs text-espresso/60 mb-3">
        {formatOrderDate(order.created_at)}
      </div>

      <div className="border-t border-sand/40 pt-3 flex items-end justify-between gap-4">
        <div>
          <div className="font-medium text-sm text-espresso">
            {order.customer_name}
          </div>
          <div className="text-xs text-espresso/65 mt-0.5">
            {order.phone}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-espresso/50 font-medium">
            Total
          </div>
          <div className="font-serif text-base font-semibold text-espresso">
            {formatCurrency(order.total)}
          </div>
        </div>
      </div>
    </div>
  );
}

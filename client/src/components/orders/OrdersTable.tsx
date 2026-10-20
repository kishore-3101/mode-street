import { Link } from 'react-router-dom';
import type { Order } from '../../types/index.js';
import { OrderStatusBadge } from './OrderStatusBadge.js';
import { formatCurrency, formatOrderDate } from '../../lib/utils.js';

export interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-sand/60 bg-cream-surface">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-sand/60 bg-sand/15 text-xs uppercase tracking-wider text-espresso/70">
            <th scope="col" className="py-3.5 px-4 font-semibold">Order</th>
            <th scope="col" className="py-3.5 px-4 font-semibold">Date</th>
            <th scope="col" className="py-3.5 px-4 font-semibold">Customer</th>
            <th scope="col" className="py-3.5 px-4 font-semibold text-right">Total</th>
            <th scope="col" className="py-3.5 px-4 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand/40">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="relative hover:bg-sand/15 transition-colors group"
            >
              <td className="py-4 px-4 font-medium text-espresso whitespace-nowrap">
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="font-medium text-espresso hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded after:absolute after:inset-0"
                >
                  #{order.order_number}
                </Link>
              </td>
              <td className="py-4 px-4 text-espresso/80 whitespace-nowrap">
                {formatOrderDate(order.created_at)}
              </td>
              <td className="py-4 px-4">
                <div className="font-medium text-espresso">{order.customer_name}</div>
                <div className="text-xs text-espresso/60 mt-0.5">{order.phone}</div>
              </td>
              <td className="py-4 px-4 text-right font-medium text-espresso whitespace-nowrap">
                {formatCurrency(order.total)}
              </td>
              <td className="py-4 px-4 text-right whitespace-nowrap">
                <div className="relative z-10 inline-block">
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

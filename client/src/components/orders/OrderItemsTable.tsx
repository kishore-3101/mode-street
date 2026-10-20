import type { OrderItem } from '../../types/index.js';
import { formatCurrency } from '../../lib/utils.js';

export interface OrderItemsTableProps {
  items: OrderItem[];
  total: number;
}

export function OrderItemsTable({ items, total }: OrderItemsTableProps) {
  return (
    <div className="rounded-xl border border-sand/60 bg-cream-surface overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-sand/60 flex items-center justify-between">
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-espresso">
          Items Ordered ({items.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-sand/60 bg-sand/15 text-xs uppercase tracking-wider text-espresso/70">
              <th scope="col" className="py-3 px-4 font-semibold">Product</th>
              <th scope="col" className="py-3 px-4 font-semibold text-center">Size</th>
              <th scope="col" className="py-3 px-4 font-semibold text-center">Qty</th>
              <th scope="col" className="py-3 px-4 font-semibold text-right">Unit Price</th>
              <th scope="col" className="py-3 px-4 font-semibold text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/40">
            {items.map((item) => {
              const lineTotal = item.quantity * item.unit_price;
              return (
                <tr key={item.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-espresso min-w-[160px]">
                    {item.product_name}
                  </td>
                  <td className="py-3.5 px-4 text-center text-espresso/80 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded bg-cream border border-sand/60 text-xs font-medium text-espresso">
                      {item.size}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-espresso/80 font-medium">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 px-4 text-right text-espresso/80 whitespace-nowrap font-sans">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-espresso whitespace-nowrap font-sans">
                    {formatCurrency(lineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-sand bg-sand/10 font-medium">
              <td colSpan={4} className="py-4 px-4 text-right text-xs uppercase tracking-wider text-espresso/70">
                Order Total
              </td>
              <td className="py-4 px-4 text-right font-serif text-lg font-bold text-espresso whitespace-nowrap">
                {formatCurrency(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

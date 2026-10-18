import { ShoppingCart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, PageHeader } from '../../components/ui/index.js';

export function OrdersPlaceholderPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <PageHeader
        title="Orders"
        subtitle="Customer order fulfillment, tracking numbers and order lifecycle management"
      />

      <div className="bg-cream-surface rounded-2xl border border-sand/80 p-8 sm:p-12 text-center shadow-2xs">
        <div className="w-16 h-16 bg-cream rounded-2xl border border-sand/80 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <ShoppingCart className="w-8 h-8 text-camel stroke-[1.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-camel/15 border border-camel/30 text-xs font-semibold uppercase tracking-wider text-camel-dark mb-4">
          <span>Day 3 Scope</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso mb-3">
          Orders Back-Office UI Arriving in Day 3
        </h2>

        <p className="text-sm sm:text-base text-espresso/70 max-w-lg mx-auto leading-relaxed mb-8">
          The server-side order fulfillment engine is fully built and tested: checkout transactions, atomic stock decrementing, and cancellation stock-restoration are already live in the backend.
        </p>

        <div className="bg-cream/50 rounded-xl p-5 border border-sand/60 max-w-md mx-auto mb-8 text-left text-xs sm:text-sm space-y-2.5">
          <div className="flex items-center gap-2 font-medium text-espresso">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Customer checkout API (<code>POST /api/orders</code>)</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-espresso">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Fulfillment status lifecycle (pending, confirmed, shipped, delivered, cancelled)</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-espresso">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Automatic inventory rollback on cancellation</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/admin/products">
            <Button variant="primary" className="gap-2">
              Browse Products Catalog
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

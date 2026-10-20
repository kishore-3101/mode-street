import { Link } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils.js';

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  validItemCount: number;
  flaggedCount?: number;
  children?: React.ReactNode;
  footnote?: string;
  isCheckoutDisabled?: boolean;
}

export function OrderSummary({
  subtotal,
  total,
  validItemCount,
  flaggedCount = 0,
  children,
  footnote,
  isCheckoutDisabled = false,
}: OrderSummaryProps) {
  const canCheckout = validItemCount > 0 && !isCheckoutDisabled;

  return (
    <div className="rounded-[12px] border border-sand bg-cream-surface p-6 sm:p-8 space-y-6">
      <h2 className="font-serif text-2xl font-normal text-espresso tracking-tight border-b border-sand pb-4">
        Order Summary
      </h2>

      {/* Figures */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-espresso/80">
          <span>Subtotal</span>
          <span className="font-medium text-espresso">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {flaggedCount > 0 && (
          <p className="text-xs text-espresso/60 italic">
            Excludes {flaggedCount} unavailable {flaggedCount === 1 ? 'item' : 'items'}.
          </p>
        )}

        <div className="border-t border-sand pt-3 flex justify-between items-baseline">
          <span className="font-serif text-xl text-espresso font-normal">
            Total
          </span>
          <span className="text-xl font-semibold text-espresso">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {footnote && (
        <p className="text-xs text-espresso/60 leading-relaxed">
          {footnote}
        </p>
      )}

      {/* Action button(s) */}
      <div className="space-y-3 pt-2">
        {children ? (
          children
        ) : (
          <Link
            to={canCheckout ? '/checkout' : '#'}
            aria-disabled={!canCheckout}
            onClick={(e) => !canCheckout && e.preventDefault()}
            className={`w-full inline-flex items-center justify-center px-6 py-3.5 rounded-[10px] text-xs sm:text-sm uppercase tracking-wider font-semibold min-h-[48px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel ${
              canCheckout
                ? 'bg-espresso text-cream hover:bg-espresso-light active:bg-espresso-dark cursor-pointer'
                : 'bg-espresso/30 text-cream/70 cursor-not-allowed'
            }`}
          >
            Checkout
          </Link>
        )}

        <div className="text-center pt-1">
          <Link
            to="/shop"
            className="text-xs text-espresso/70 hover:text-espresso underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

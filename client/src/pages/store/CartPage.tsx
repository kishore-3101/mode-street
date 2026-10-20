import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCart } from '../../hooks/useCart.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { getStorefrontProductBySlug } from '../../api/storefront.js';
import { formatCurrency } from '../../lib/utils.js';
import { CartLine, type CartLineStatus } from '../../components/store/CartLine.js';
import { OrderSummary } from '../../components/store/OrderSummary.js';

export function CartPage() {
  useDocumentTitle('Your Cart | Mode Street');
  const { items, updateQty, updateLineMeta, removeItem } = useCart();
  const clampedToastShownRef = useRef(false);

  // 1. Fetch live product data for all unique slugs in the cart
  const uniqueSlugs = Array.from(new Set(items.map((i) => i.slug)));

  const productQueries = useQueries({
    queries: uniqueSlugs.map((slug) => ({
      queryKey: ['storefrontProduct', slug],
      queryFn: () => getStorefrontProductBySlug(slug),
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    })),
  });

  // Map slug -> query result
  const productMap = new Map();
  uniqueSlugs.forEach((slug, index) => {
    productMap.set(slug, productQueries[index]);
  });

  // 2. Evaluate line status, live prices, and stock limits
  const linesWithMeta = items.map((item) => {
    const query = productMap.get(item.slug);

    if (!query || query.isLoading) {
      return {
        item,
        status: 'loading' as CartLineStatus,
        effectivePrice: item.price,
        maxQty: item.maxQty,
        isClamped: false,
      };
    }

    const liveProduct = query.data;

    // Check if product is missing, inactive, or query failed
    if (query.isError || !liveProduct || !liveProduct.is_active) {
      return {
        item,
        status: 'unavailable' as CartLineStatus,
        effectivePrice: item.price,
        maxQty: 0,
        isClamped: false,
      };
    }

    // Check if variant exists
    const variant = liveProduct.variants?.find((v: { id: string }) => v.id === item.variantId);
    if (!variant) {
      return {
        item,
        status: 'unavailable' as CartLineStatus,
        effectivePrice: liveProduct.price,
        maxQty: 0,
        isClamped: false,
      };
    }

    // Check stock
    const stock = Number(variant.stock) || 0;
    if (stock <= 0) {
      return {
        item,
        status: 'sold_out' as CartLineStatus,
        effectivePrice: liveProduct.price,
        maxQty: 0,
        isClamped: false,
      };
    }

    const availableLimit = Math.min(10, stock);
    const isClamped = item.qty > availableLimit;

    return {
      item,
      status: 'available' as CartLineStatus,
      effectivePrice: liveProduct.price,
      maxQty: availableLimit,
      isClamped,
    };
  });

  const anyQtyClamped = linesWithMeta.some((l) => l.isClamped);

  // Sync clamped quantities or updated prices into CartContext
  useEffect(() => {
    if (!updateLineMeta) return;

    linesWithMeta.forEach(({ item, status, effectivePrice, maxQty }) => {
      if (status === 'available') {
        const needsPriceUpdate = item.price !== effectivePrice;
        const needsMaxQtyUpdate = item.maxQty !== maxQty;
        const needsQtyClamp = item.qty > maxQty;

        if (needsPriceUpdate || needsMaxQtyUpdate || needsQtyClamp) {
          updateLineMeta(item.variantId, {
            price: effectivePrice,
            maxQty,
            qty: needsQtyClamp ? maxQty : item.qty,
          });
        }
      }
    });

    if (anyQtyClamped && !clampedToastShownRef.current) {
      toast.info('Quantities were updated to match availability');
      clampedToastShownRef.current = true;
    }
  }, [linesWithMeta, anyQtyClamped, updateLineMeta]);

  // 3. Totals (Exclude flagged sold out / unavailable items)
  const validLines = linesWithMeta.filter((l) => l.status === 'available');
  const flaggedLines = linesWithMeta.filter(
    (l) => l.status === 'sold_out' || l.status === 'unavailable'
  );

  const subtotal = validLines.reduce(
    (sum, line) => sum + line.effectivePrice * line.item.qty,
    0
  );
  const total = subtotal;
  const validItemCount = validLines.reduce((sum, line) => sum + line.item.qty, 0);

  // 4. Empty State
  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso tracking-tight">
          Your cart is empty.
        </h1>
        <p className="text-sm sm:text-base text-espresso/70 max-w-md mx-auto">
          Discover thoughtful silhouettes and timeless essentials designed for everyday living.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
          >
            Shop the collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 space-y-8">
      {/* Page Header */}
      <div className="border-b border-sand pb-4 flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso tracking-tight">
          Your cart
        </h1>
        <span className="text-xs uppercase tracking-wider text-espresso/60 font-medium">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Screen reader announcement for cart total changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Cart total: {formatCurrency(total)}
      </div>

      {/* Two Column Layout: Cart lines (left ~62%), Summary (right ~38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart items */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="border-t border-sand">
            {linesWithMeta.map(({ item, status }) => (
              <CartLine
                key={item.variantId}
                item={item}
                status={status}
                onUpdateQty={(newQty) => updateQty(item.variantId, newQty)}
                onRemove={() => removeItem(item.variantId)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
          <OrderSummary
            subtotal={subtotal}
            total={total}
            validItemCount={validItemCount}
            flaggedCount={flaggedLines.length}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;

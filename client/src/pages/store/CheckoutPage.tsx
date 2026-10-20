import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import {
  getStorefrontProductBySlug,
  createStorefrontOrder,
} from '../../api/storefront.js';
import { formatCurrency, getApiErrorMessage } from '../../lib/utils.js';
import type {
  CartItem,
  CreateOrderInput,
  OrderConfirmationSnapshot,
} from '../../types/index.js';
import { CartLine, type CartLineStatus } from '../../components/store/CartLine.js';
import { CheckoutForm, type CheckoutFormData } from '../../components/store/CheckoutForm.js';

const ORDER_SNAPSHOT_KEY = 'mode_street_last_order';
const CHECKOUT_DRAFT_KEY = 'mode_street_checkout_draft';

function getNowIso(): string {
  return new Date().toISOString();
}

export function CheckoutPage() {
  useDocumentTitle('Checkout | Mode Street');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('mode') === 'buy-now';

  const { items: cartItems, clear: clearCart, buyNowItem, clearBuyNow } = useCart();

  const [mobileSummaryExpanded, setMobileSummaryExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 1. Determine active items based on mode
  const rawItems = useMemo<CartItem[]>(() => {
    if (isBuyNow) {
      return buyNowItem ? [buyNowItem] : [];
    }
    return cartItems;
  }, [isBuyNow, buyNowItem, cartItems]);

  // 2. Fetch live product data for all lines
  const uniqueSlugs = useMemo(
    () => Array.from(new Set(rawItems.map((i) => i.slug))),
    [rawItems]
  );

  const productQueries = useQueries({
    queries: uniqueSlugs.map((slug) => ({
      queryKey: ['storefrontProduct', slug],
      queryFn: () => getStorefrontProductBySlug(slug),
      staleTime: 1000 * 15,
      retry: 1,
    })),
  });

  const productMap = useMemo(() => {
    const map = new Map();
    uniqueSlugs.forEach((slug, index) => {
      map.set(slug, productQueries[index]);
    });
    return map;
  }, [uniqueSlugs, productQueries]);

  // 3. Evaluate live line status & stock availability
  const linesWithMeta = useMemo(() => {
    return rawItems.map((item) => {
      const query = productMap.get(item.slug);

      if (!query || query.isLoading) {
        return {
          item,
          status: 'loading' as CartLineStatus,
          effectivePrice: item.price,
          maxQty: item.maxQty,
        };
      }

      const liveProduct = query.data;
      if (query.isError || !liveProduct || !liveProduct.is_active) {
        return {
          item,
          status: 'unavailable' as CartLineStatus,
          effectivePrice: item.price,
          maxQty: 0,
        };
      }

      const variant = liveProduct.variants?.find((v: { id: string }) => v.id === item.variantId);
      if (!variant) {
        return {
          item,
          status: 'unavailable' as CartLineStatus,
          effectivePrice: liveProduct.price,
          maxQty: 0,
        };
      }

      const stock = Number(variant.stock) || 0;
      if (stock <= 0) {
        return {
          item,
          status: 'sold_out' as CartLineStatus,
          effectivePrice: liveProduct.price,
          maxQty: 0,
        };
      }

      const availableLimit = Math.min(10, stock);
      const effectiveQty = Math.min(item.qty, availableLimit);

      return {
        item: { ...item, qty: effectiveQty, price: liveProduct.price },
        status: 'available' as CartLineStatus,
        effectivePrice: liveProduct.price,
        maxQty: availableLimit,
      };
    });
  }, [rawItems, productMap]);

  // 4. Verification & Totals
  const hasFlaggedLines = linesWithMeta.some(
    (l) => l.status === 'sold_out' || l.status === 'unavailable'
  );

  const validLines = linesWithMeta.filter((l) => l.status === 'available');
  const subtotal = validLines.reduce(
    (sum, line) => sum + line.effectivePrice * line.item.qty,
    0
  );
  const total = subtotal;
  const totalItemsCount = validLines.reduce((sum, line) => sum + line.item.qty, 0);

  // 4. Handle Order Placement
  const handlePlaceOrder = async (
    formData: CheckoutFormData,
    isHoneypot: boolean
  ) => {
    setServerError(null);

    // Guard: block if any line is flagged or empty
    if (hasFlaggedLines || validLines.length === 0) {
      setServerError('Some items are no longer available. Please review your order.');
      return;
    }

    // Bot detection honeypot
    if (isHoneypot) {
      const fakeSnapshot: OrderConfirmationSnapshot = {
        order_id: 'fake-order-id',
        order_number: 'MS-BOT-PREVENT',
        total,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          notes: formData.notes || null,
        },
        items: validLines.map((l) => ({
          variantId: l.item.variantId,
          productId: l.item.productId,
          slug: l.item.slug,
          name: l.item.name,
          size: l.item.size,
          qty: l.item.qty,
          price: l.effectivePrice,
          image: l.item.image,
        })),
        placed_at: getNowIso(),
      };
      sessionStorage.setItem(ORDER_SNAPSHOT_KEY, JSON.stringify(fakeSnapshot));
      navigate('/order-confirmation', { replace: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: CreateOrderInput = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone,
          email: formData.email?.trim() || null,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode,
          notes: formData.notes?.trim() || null,
        },
        // Send only variant_id and quantity (never prices)
        items: validLines.map((l) => ({
          variant_id: l.item.variantId,
          quantity: l.item.qty,
        })),
      };

      const response = await createStorefrontOrder(orderPayload);

      // Create snapshot for confirmation page
      const snapshot: OrderConfirmationSnapshot = {
        order_id: response.order_id,
        order_number: response.order_number,
        total: response.total ?? total,
        customer: {
          name: formData.name.trim(),
          phone: formData.phone,
          email: formData.email?.trim() || null,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode,
          notes: formData.notes?.trim() || null,
        },
        items: validLines.map((l) => ({
          variantId: l.item.variantId,
          productId: l.item.productId,
          slug: l.item.slug,
          name: l.item.name,
          size: l.item.size,
          qty: l.item.qty,
          price: l.effectivePrice,
          image: l.item.image,
        })),
        placed_at: getNowIso(),
      };

      sessionStorage.setItem(ORDER_SNAPSHOT_KEY, JSON.stringify(snapshot));
      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);

      // Clear ONLY the source that was used
      if (isBuyNow) {
        clearBuyNow();
      } else {
        clearCart();
      }

      // Navigate to order confirmation
      navigate('/order-confirmation', { replace: true });
    } catch (err) {
      // Refresh line stock queries on failure
      productQueries.forEach((q) => q.refetch());

      const message = getApiErrorMessage(
        err,
        'Something went wrong while placing your order. Please try again.'
      );
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. If source is empty, show empty redirect UI
  if (rawItems.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso tracking-tight">
          Your checkout is empty.
        </h1>
        <p className="text-sm sm:text-base text-espresso/70 max-w-md mx-auto">
          Please add items to your cart before proceeding to checkout.
        </p>
        <div className="pt-2">
          <Link
            to={isBuyNow ? '/shop' : '/cart'}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
          >
            {isBuyNow ? 'Explore pieces' : 'Return to cart'}
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
          Checkout
        </h1>
        {isBuyNow && (
          <span className="text-xs uppercase tracking-wider text-camel font-semibold">
            Buy Now
          </span>
        )}
      </div>

      {/* Flagged Item Warning Banner */}
      {hasFlaggedLines && (
        <div
          role="alert"
          className="p-4 rounded-[10px] border border-warning bg-warning-bg text-espresso text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-espresso">
              Some items are sold out or unavailable.
            </p>
            <p className="text-xs text-espresso/80">
              Please remove flagged items or update your selection before placing the order.
            </p>
          </div>
        </div>
      )}

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden rounded-[10px] border border-sand bg-cream-surface overflow-hidden">
        <button
          type="button"
          onClick={() => setMobileSummaryExpanded((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
          aria-expanded={mobileSummaryExpanded}
          aria-controls="mobile-checkout-summary"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
              Order Summary ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </span>
            {mobileSummaryExpanded ? (
              <ChevronUp className="w-4 h-4 text-espresso/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-espresso/60" />
            )}
          </div>
          <span className="text-base font-semibold text-espresso">
            {formatCurrency(total)}
          </span>
        </button>

        {mobileSummaryExpanded && (
          <div
            id="mobile-checkout-summary"
            className="p-4 pt-0 border-t border-sand space-y-4"
          >
            <div className="divide-y divide-sand">
              {linesWithMeta.map(({ item, status }) => (
                <CartLine
                  key={item.variantId}
                  item={item}
                  status={status}
                  readOnly
                />
              ))}
            </div>

            <div className="pt-2 flex justify-between items-baseline text-sm border-t border-sand">
              <span className="text-espresso/70">Subtotal</span>
              <span className="font-medium text-espresso">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-[11px] text-espresso/50">
              Total is confirmed when the order is placed.
            </p>
          </div>
        )}
      </div>

      {/* Two Column Layout: Form Left (~58%), Summary Right (~42%, sticky) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 xl:col-span-7">
          <CheckoutForm
            onSubmit={handlePlaceOrder}
            isSubmitting={isSubmitting}
            serverError={serverError}
            onClearServerError={() => setServerError(null)}
            disabled={hasFlaggedLines}
          />
        </div>

        {/* Desktop Sticky Order Summary Column */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28">
          <div className="rounded-[12px] border border-sand bg-cream-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-baseline justify-between border-b border-sand pb-4">
              <h2 className="font-serif text-2xl font-normal text-espresso tracking-tight">
                Order Summary
              </h2>
              <span className="text-xs uppercase tracking-wider text-espresso/60 font-medium">
                {totalItemsCount} {totalItemsCount === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {/* Read-only Line items */}
            <div className="max-h-[360px] overflow-y-auto pr-1 divide-y divide-sand border-b border-sand">
              {linesWithMeta.map(({ item, status }) => (
                <CartLine
                  key={item.variantId}
                  item={item}
                  status={status}
                  readOnly
                />
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-espresso/80">
                <span>Subtotal</span>
                <span className="font-medium text-espresso">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="border-t border-sand pt-3 flex justify-between items-baseline">
                <span className="font-serif text-xl text-espresso font-normal">
                  Total
                </span>
                <span className="text-xl font-semibold text-espresso">
                  {formatCurrency(total)}
                </span>
              </div>

              <p className="text-xs text-espresso/55 leading-relaxed pt-1">
                Total is confirmed when the order is placed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

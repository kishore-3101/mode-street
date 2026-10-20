import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { formatCurrency } from '../../lib/utils.js';
import type { OrderConfirmationSnapshot } from '../../types/index.js';
import { ORDER_CONFIRMATION_COPY } from '../../constants/orderConfirmation.js';

const ORDER_SNAPSHOT_KEY = 'mode_street_last_order';

export function OrderConfirmationPage() {
  useDocumentTitle('Order placed | Mode Street');
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [snapshot] = useState<OrderConfirmationSnapshot | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem(ORDER_SNAPSHOT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // If snapshot is missing, redirect to home
  useEffect(() => {
    if (!snapshot) {
      navigate('/', { replace: true });
    }
  }, [snapshot, navigate]);

  // Move focus to the h1 heading on mount for accessibility
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!snapshot) {
    return null;
  }

  const firstName = snapshot.customer.name.trim().split(' ')[0] || snapshot.customer.name;

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      {/* Header & Order Number */}
      <div className="space-y-4 text-center sm:text-left border-b border-sand pb-8">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso tracking-tight focus:outline-none"
        >
          {ORDER_CONFIRMATION_COPY.headingPrefix} {firstName}.
        </h1>
        <p className="text-base text-espresso/70">
          {ORDER_CONFIRMATION_COPY.placedNotice}
        </p>
        <div className="pt-2">
          <span className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-wide">
            {ORDER_CONFIRMATION_COPY.orderNumberPrefix}{snapshot.order_number}
          </span>
        </div>
      </div>

      {/* Delivery Details Block */}
      <div className="rounded-[12px] border border-sand bg-cream-surface p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-espresso tracking-tight border-b border-sand pb-3">
          {ORDER_CONFIRMATION_COPY.deliveryHeading}
        </h2>

        <div className="text-sm text-espresso/80 space-y-1 leading-relaxed">
          <p className="font-semibold text-espresso">{snapshot.customer.name}</p>
          <p>{snapshot.customer.phone}</p>
          {snapshot.customer.email && <p>{snapshot.customer.email}</p>}
          <p className="pt-1">{snapshot.customer.address}</p>
          <p>
            {snapshot.customer.city}, {snapshot.customer.state} – {snapshot.customer.pincode}
          </p>
          {snapshot.customer.notes && (
            <div className="pt-2 border-t border-sand/50 text-xs text-espresso/70">
              <span className="font-medium text-espresso">Notes: </span>
              {snapshot.customer.notes}
            </div>
          )}
        </div>

        <p className="text-xs text-espresso/60 pt-2 border-t border-sand/60">
          {ORDER_CONFIRMATION_COPY.contactNotice(snapshot.customer.phone)}
        </p>
      </div>

      {/* Items Summary Block */}
      <div className="rounded-[12px] border border-sand bg-cream-surface p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-espresso tracking-tight border-b border-sand pb-3">
          {ORDER_CONFIRMATION_COPY.itemsHeading}
        </h2>

        {/* Lines */}
        <div className="divide-y divide-sand">
          {snapshot.items.map((item) => (
            <div key={item.variantId} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-14 sm:w-16 aspect-4/5 rounded-[4px] border border-sand bg-sand/30 overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-espresso/30 text-[10px]">
                    Mode
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base sm:text-lg font-normal text-espresso leading-snug truncate">
                  {item.name}
                </p>
                <p className="text-xs uppercase tracking-wider text-espresso/60 pt-0.5">
                  Size: {item.size} × {item.qty}
                </p>
              </div>

              {/* Line Price */}
              <div className="text-sm sm:text-base font-semibold text-espresso shrink-0 text-right">
                {formatCurrency(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-sand pt-4 space-y-2">
          <div className="flex justify-between items-center text-sm text-espresso/70">
            <span>{ORDER_CONFIRMATION_COPY.subtotalLabel}</span>
            <span>{formatCurrency(snapshot.total)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-1">
            <span className="font-serif text-xl text-espresso font-normal">
              {ORDER_CONFIRMATION_COPY.totalLabel}
            </span>
            <span className="text-2xl font-semibold text-espresso">
              {formatCurrency(snapshot.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
        >
          {ORDER_CONFIRMATION_COPY.continueShoppingBtn}
        </Link>
        <Link
          to="/"
          className="text-xs text-espresso/70 hover:text-espresso underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded py-2 px-3"
        >
          {ORDER_CONFIRMATION_COPY.homeLink}
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;

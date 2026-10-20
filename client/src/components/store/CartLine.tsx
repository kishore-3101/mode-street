import { Link } from 'react-router-dom';
import type { CartItem } from '../../types/index.js';
import { formatCurrency } from '../../lib/utils.js';
import { QuantityStepper } from './QuantityStepper.js';

export type CartLineStatus = 'available' | 'sold_out' | 'unavailable' | 'loading';

interface CartLineProps {
  item: CartItem;
  status?: CartLineStatus;
  onUpdateQty?: (qty: number) => void;
  onRemove?: () => void;
  readOnly?: boolean;
}

export function CartLine({
  item,
  status = 'available',
  onUpdateQty,
  onRemove,
  readOnly = false,
}: CartLineProps) {
  const isFlagged = status === 'sold_out' || status === 'unavailable';

  return (
    <div
      className={`py-6 border-b border-sand flex gap-4 sm:gap-6 items-start transition-opacity ${
        isFlagged ? 'opacity-70' : 'opacity-100'
      }`}
    >
      {/* 4:5 Aspect Ratio Thumbnail */}
      <div className="shrink-0 w-20 sm:w-24 aspect-4/5 rounded-[4px] border border-sand bg-sand/30 overflow-hidden relative">
        {item.image ? (
          <Link
            to={`/product/${encodeURIComponent(item.slug)}`}
            tabIndex={-1}
            aria-hidden="true"
            className="block w-full h-full"
          >
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2 text-center text-espresso/40">
            <span className="font-serif text-xs font-light">Mode</span>
          </div>
        )}

        {/* Flagged Status Overlay Badge on image */}
        {status === 'sold_out' && (
          <div className="absolute top-1 left-1">
            <span className="px-1.5 py-0.5 bg-espresso text-cream text-[9px] uppercase tracking-wider font-semibold rounded-[2px]">
              Sold out
            </span>
          </div>
        )}
        {status === 'unavailable' && (
          <div className="absolute top-1 left-1">
            <span className="px-1.5 py-0.5 bg-danger text-cream text-[9px] uppercase tracking-wider font-semibold rounded-[2px]">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Details & Controls */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
          <div>
            <Link
              to={`/product/${encodeURIComponent(item.slug)}`}
              className="font-serif text-lg sm:text-xl font-normal text-espresso leading-snug hover:text-camel transition-colors line-clamp-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
            >
              {item.name}
            </Link>
            <p className="text-xs uppercase tracking-wider text-espresso/65 font-medium pt-0.5">
              Size: {item.size}
            </p>
          </div>

          {/* Unit Price */}
          <p className="text-sm font-medium text-espresso shrink-0 sm:text-right">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Status notice text for flagged lines */}
        {status === 'sold_out' && (
          <p className="text-xs text-espresso/70 font-medium">
            This item is currently sold out and will not be charged.
          </p>
        )}
        {status === 'unavailable' && (
          <p className="text-xs text-danger font-medium">
            This item is no longer available and will not be charged.
          </p>
        )}

        {/* Actions Row: Quantity Stepper & Remove Action */}
        <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
          {readOnly ? (
            <span className="text-xs text-espresso/75 font-medium">
              Qty: <strong className="text-espresso font-semibold">{item.qty}</strong>
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <QuantityStepper
                value={item.qty}
                min={1}
                max={item.maxQty}
                disabled={isFlagged}
                onChange={(newQty) => onUpdateQty && onUpdateQty(newQty)}
                ariaLabelPrefix={`${item.name} (${item.size})`}
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="text-xs text-espresso/60 hover:text-espresso underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded min-h-[44px] flex items-center px-1"
                  aria-label={`Remove ${item.name} (${item.size}) from cart`}
                >
                  Remove
                </button>
              )}
            </div>
          )}

          {/* Line Total */}
          <div className="text-right">
            <span className="text-xs text-espresso/50 block sm:hidden">Total:</span>
            <span className={`text-sm sm:text-base font-semibold ${isFlagged ? 'line-through text-espresso/40' : 'text-espresso'}`}>
              {formatCurrency(item.price * item.qty)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

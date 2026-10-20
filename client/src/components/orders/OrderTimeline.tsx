import { Check, XCircle } from 'lucide-react';
import type { OrderStatus } from '../../types/index.js';
import { formatOrderDate, cn } from '../../lib/utils.js';

export interface OrderTimelineProps {
  status: OrderStatus;
  updatedAt?: string | null;
  className?: string;
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Pending' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
];

export function OrderTimeline({ status, updatedAt, className }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div
        className={cn(
          'p-5 rounded-xl border border-[#F0CBD1] bg-[#FDF0EE]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FDF0EE] border border-[#F0CBD1] flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-[#A63A3A]" />
          </div>
          <div>
            <div className="font-semibold text-[#A63A3A] text-sm sm:text-base">
              Order Cancelled
            </div>
            <div className="text-xs text-espresso/70 mt-0.5">
              This order was cancelled and inventory has been returned.
            </div>
          </div>
        </div>

        {updatedAt && (
          <div className="text-xs text-espresso/60 sm:text-right">
            Last updated {formatOrderDate(updatedAt)}
          </div>
        )}
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.status === status);

  return (
    <div
      className={cn(
        'p-5 rounded-xl border border-sand/60 bg-cream-surface space-y-4',
        className
      )}
    >
      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          return (
            <div
              key={step.status}
              className="flex-1 flex flex-col items-center relative text-center group"
            >
              {/* Connector line to previous step */}
              {idx > 0 && (
                <div
                  className={cn(
                    'absolute top-4 -left-1/2 w-full h-[2px] -z-0',
                    idx <= currentIdx ? 'bg-espresso' : 'bg-sand/60'
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors border-2',
                  isCompleted && 'bg-espresso border-espresso text-cream',
                  isCurrent && 'bg-cream-surface border-espresso text-espresso ring-4 ring-sand/40',
                  isUpcoming && 'bg-cream border-sand/80 text-espresso/40'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs mt-2 font-medium tracking-tight',
                  isCurrent && 'text-espresso font-bold',
                  isCompleted && 'text-espresso',
                  isUpcoming && 'text-espresso/40'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="sm:hidden space-y-4 relative pl-2">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          return (
            <div key={step.status} className="flex items-center gap-3 relative">
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'absolute left-4 top-7 w-[2px] h-6 -z-0',
                    idx < currentIdx ? 'bg-espresso' : 'bg-sand/60'
                  )}
                  aria-hidden="true"
                />
              )}

              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 border-2',
                  isCompleted && 'bg-espresso border-espresso text-cream',
                  isCurrent && 'bg-cream-surface border-espresso text-espresso ring-4 ring-sand/40',
                  isUpcoming && 'bg-cream border-sand/80 text-espresso/40'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </div>

              <span
                className={cn(
                  'text-sm font-medium',
                  isCurrent && 'text-espresso font-bold',
                  isCompleted && 'text-espresso',
                  isUpcoming && 'text-espresso/40'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {updatedAt && (
        <div className="text-xs text-espresso/60 text-right pt-2 border-t border-sand/30">
          Last updated {formatOrderDate(updatedAt)}
        </div>
      )}
    </div>
  );
}

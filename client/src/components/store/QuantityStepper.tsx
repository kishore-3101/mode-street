import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (qty: number) => void;
  ariaLabelPrefix?: string;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 10,
  disabled = false,
  onChange,
  ariaLabelPrefix,
}: QuantityStepperProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  const prefix = ariaLabelPrefix ? `${ariaLabelPrefix} - ` : '';

  return (
    <div
      className={`inline-flex items-center rounded-[10px] border border-sand bg-cream-surface transition-opacity ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-espresso/70 hover:text-espresso disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-l-[9px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
        aria-label={`${prefix}Decrease quantity`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span
        className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold text-espresso select-none"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-espresso/70 hover:text-espresso disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-r-[9px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
        aria-label={`${prefix}Increase quantity`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

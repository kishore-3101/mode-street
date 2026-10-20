import { cn } from '../../lib/utils.js';

export interface OrderStatusTabsProps {
  activeStatus: string;
  onChange: (status: string) => void;
  className?: string;
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function OrderStatusTabs({
  activeStatus,
  onChange,
  className,
}: OrderStatusTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 sm:gap-2 border-b border-sand/60 overflow-x-auto scrollbar-none',
        className
      )}
      role="tablist"
      aria-label="Filter orders by status"
    >
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap transition-colors relative cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-1 rounded-t',
              isActive
                ? 'text-espresso font-semibold border-b-2 border-espresso -mb-[1px]'
                : 'text-espresso/60 hover:text-espresso border-b-2 border-transparent -mb-[1px]'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

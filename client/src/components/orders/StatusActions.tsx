import { useState } from 'react';
import type { OrderStatus } from '../../types/index.js';
import { Button } from '../ui/Button.js';
import { ConfirmDialog } from '../ui/ConfirmDialog.js';

export interface StatusActionsProps {
  status: OrderStatus;
  onStatusUpdate: (newStatus: OrderStatus) => Promise<void>;
  isUpdating: boolean;
}

interface ActionConfig {
  targetStatus: OrderStatus;
  title: string;
  description: string;
  confirmLabel: string;
  variant: 'primary' | 'danger';
}

export function StatusActions({
  status,
  onStatusUpdate,
  isUpdating,
}: StatusActionsProps) {
  const [activeDialog, setActiveDialog] = useState<ActionConfig | null>(null);

  if (status === 'delivered') {
    return (
      <div className="text-xs text-espresso/60 italic py-1">
        This order has been delivered.
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="text-xs text-[#A63A3A] italic py-1">
        This order has been cancelled and closed.
      </div>
    );
  }

  const handleConfirmAction = async () => {
    if (!activeDialog || isUpdating) return;
    try {
      await onStatusUpdate(activeDialog.targetStatus);
      setActiveDialog(null);
    } catch {
      // Error handled by parent with toast and refetch
      setActiveDialog(null);
    }
  };

  const getNextAction = (): { label: string; config: ActionConfig } | null => {
    switch (status) {
      case 'pending':
        return {
          label: 'Confirm order',
          config: {
            targetStatus: 'confirmed',
            title: 'Confirm Order',
            description: 'Are you sure you want to mark this order as confirmed?',
            confirmLabel: 'Confirm order',
            variant: 'primary',
          },
        };
      case 'confirmed':
        return {
          label: 'Mark as shipped',
          config: {
            targetStatus: 'shipped',
            title: 'Mark as Shipped',
            description: 'Are you sure you want to mark this order as shipped?',
            confirmLabel: 'Mark as shipped',
            variant: 'primary',
          },
        };
      case 'shipped':
        return {
          label: 'Mark as delivered',
          config: {
            targetStatus: 'delivered',
            title: 'Mark as Delivered',
            description: 'Are you sure you want to mark this order as delivered to the customer?',
            confirmLabel: 'Mark as delivered',
            variant: 'primary',
          },
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  const cancelConfig: ActionConfig = {
    targetStatus: 'cancelled',
    title: 'Cancel Order',
    description:
      'This will cancel the order and return the items to stock. This cannot be undone.',
    confirmLabel: 'Cancel order',
    variant: 'danger',
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3" aria-live="polite">
        {nextAction && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isUpdating}
            onClick={() => setActiveDialog(nextAction.config)}
            className="text-xs uppercase tracking-wider font-semibold min-h-[38px] px-4"
          >
            {nextAction.label}
          </Button>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isUpdating}
          onClick={() => setActiveDialog(cancelConfig)}
          className="text-xs text-danger hover:text-danger hover:border-danger/40 border-sand min-h-[38px] px-3.5"
        >
          Cancel order
        </Button>
      </div>

      {activeDialog && (
        <ConfirmDialog
          isOpen={Boolean(activeDialog)}
          onClose={() => setActiveDialog(null)}
          onConfirm={handleConfirmAction}
          title={activeDialog.title}
          description={activeDialog.description}
          confirmLabel={activeDialog.confirmLabel}
          variant={activeDialog.variant}
          isLoading={isUpdating}
        />
      )}
    </>
  );
}

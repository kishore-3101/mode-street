import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { getAdminOrderById, updateAdminOrderStatus } from '../../api/orders.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { Button, Skeleton } from '../../components/ui/index.js';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.js';
import { OrderTimeline } from '../../components/orders/OrderTimeline.js';
import { OrderItemsTable } from '../../components/orders/OrderItemsTable.js';
import { CustomerCard } from '../../components/orders/CustomerCard.js';
import { StatusActions } from '../../components/orders/StatusActions.js';
import { formatOrderDate, getApiErrorMessage } from '../../lib/utils.js';
import type { OrderStatus } from '../../types/index.js';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // 1. Fetch order details
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => getAdminOrderById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 15,
  });

  // Dynamic Document Title
  useDocumentTitle(
    order?.order_number
      ? `Order #${order.order_number} | Mode Street Admin`
      : 'Order Details | Mode Street Admin'
  );

  // 2. Mutation for status changes
  const statusMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) => updateAdminOrderStatus(id!, newStatus),
    onSuccess: (updatedOrder) => {
      // Invalidate both the list and this order
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.setQueryData(['admin-order', id], updatedOrder);
      toast.success(`Order marked as ${updatedOrder.status}`);
    },
    onError: (err) => {
      // Refetch to ensure local state reflects the actual server status
      refetch();
      const message = getApiErrorMessage(err, 'Failed to update order status');
      toast.error(message);
    },
  });

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    await statusMutation.mutateAsync(newStatus);
  };

  // 3. Loading State Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-sand/60 pb-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-64 lg:col-span-7 rounded-xl" />
          <Skeleton className="h-64 lg:col-span-5 rounded-xl" />
        </div>
      </div>
    );
  }

  // 4. 404 / Missing State
  if (isError || !order) {
    const is404 =
      (error as { response?: { status?: number } })?.response?.status === 404 ||
      !order;

    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-cream-surface rounded-full border border-sand flex items-center justify-center mx-auto text-espresso/40">
          {is404 ? <ShoppingCart className="w-7 h-7 stroke-[1.5]" /> : <AlertCircle className="w-7 h-7 text-danger stroke-[1.5]" />}
        </div>
        <h1 className="font-serif text-2xl font-semibold text-espresso">
          {is404 ? 'Order Not Found' : 'Failed to Load Order'}
        </h1>
        <p className="text-sm text-espresso/70 leading-relaxed">
          {is404
            ? 'The requested order could not be located or may have been deleted.'
            : getApiErrorMessage(error, 'Could not retrieve order details from the server.')}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/admin/orders"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-sand bg-cream-surface text-sm font-medium text-espresso hover:bg-sand/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Return to orders
          </Link>
          {!is404 && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center text-xs font-medium text-espresso/70 hover:text-espresso gap-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orders</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/60 pb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-espresso">
              Order #{order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-xs sm:text-sm text-espresso/70">
            Placed on {formatOrderDate(order.created_at)}
          </p>
        </div>

        {/* Status Actions */}
        <div className="shrink-0">
          <StatusActions
            status={order.status}
            onStatusUpdate={handleStatusUpdate}
            isUpdating={statusMutation.isPending}
          />
        </div>
      </div>

      {/* Status Timeline */}
      <OrderTimeline
        status={order.status}
        updatedAt={order.updated_at}
      />

      {/* Two Column Layout: Items left (~62%), Customer right (~38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <OrderItemsTable
            items={order.order_items || []}
            total={order.total}
          />
        </div>

        <div className="lg:col-span-5">
          <CustomerCard order={order} />
        </div>
      </div>
    </div>
  );
}

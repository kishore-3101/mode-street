import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, X, RotateCw, AlertCircle } from 'lucide-react';
import { getAdminOrders } from '../../api/orders.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import {
  PageHeader,
  Button,
  Pagination,
  EmptyState,
  TableRowSkeleton,
  CardSkeleton,
} from '../../components/ui/index.js';
import { OrderStatusTabs } from '../../components/orders/OrderStatusTabs.js';
import { OrdersTable } from '../../components/orders/OrdersTable.js';
import { OrderCard } from '../../components/orders/OrderCard.js';
import { getApiErrorMessage, cn } from '../../lib/utils.js';
import type { OrderStatus } from '../../types/index.js';

const PAGE_SIZE = 15;
const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export function OrdersListPage() {
  useDocumentTitle('Orders | Mode Street Admin');
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Read and normalize state from URL
  const rawStatus = searchParams.get('status') || 'all';
  const activeStatus: string = VALID_STATUSES.includes(rawStatus as OrderStatus)
    ? rawStatus
    : 'all';

  const urlSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  // Sync state if URL search changes externally (e.g. back/forward navigation or clear)
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  const debouncedSearch = useDebounce(searchInput, 300);

  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // Sync debounced search to URL (resets page to 1)
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    const currentUrlSearch = searchParams.get('search') || '';
    if (trimmed !== currentUrlSearch) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (trimmed) {
          next.set('search', trimmed);
        } else {
          next.delete('search');
        }
        next.set('page', '1');
        return next;
      });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // 2. Fetch orders via TanStack Query
  const queryParams = useMemo(() => {
    return {
      status: activeStatus !== 'all' ? (activeStatus as OrderStatus) : undefined,
      search: debouncedSearch.trim() || undefined,
      page: currentPage,
      limit: PAGE_SIZE,
    };
  }, [activeStatus, debouncedSearch, currentPage]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-orders', queryParams],
    queryFn: () => getAdminOrders(queryParams),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const orders = data?.orders || [];
  const total = data?.total ?? 0;

  // 3. Handlers
  const handleStatusChange = (newStatus: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStatus === 'all') {
        next.delete('status');
      } else {
        next.set('status', newStatus);
      }
      next.set('page', '1');
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  // Subtitle showing total count
  const subtitle = isLoading
    ? 'Loading orders...'
    : `${total} ${total === 1 ? 'order' : 'orders'}`;

  const hasActiveFilters = activeStatus !== 'all' || debouncedSearch.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header with Title, Count Subtitle & Refresh Button */}
      <PageHeader
        title="Orders"
        subtitle={subtitle}
        action={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs text-espresso/70 hover:text-espresso gap-1.5 h-9 px-3 border border-sand/60 hover:bg-sand/20"
            title="Refresh orders list"
          >
            <RotateCw
              className={cn('w-3.5 h-3.5', isFetching && 'animate-spin text-camel')}
            />
            <span>Refresh</span>
          </Button>
        }
      />

      {/* Status Filter Tabs */}
      <OrderStatusTabs
        activeStatus={activeStatus}
        onChange={handleStatusChange}
      />

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by order number, name or phone"
          className={cn(
            'w-full pl-10 pr-9 py-2.5 bg-cream-surface rounded-[10px] text-xs sm:text-sm text-espresso placeholder:text-espresso/40 border border-sand/80',
            'transition-colors focus:border-espresso focus:outline-none focus:ring-2 focus:ring-camel/30'
          )}
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso p-0.5 rounded cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-xl border border-danger/30 bg-danger-bg/40 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-danger mx-auto stroke-[1.5]" />
          <h3 className="font-serif text-lg font-semibold text-danger">
            Failed to load orders
          </h3>
          <p className="text-xs sm:text-sm text-espresso/70 max-w-md mx-auto">
            {getApiErrorMessage(error, 'Could not retrieve orders from the server.')}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && !isError && (
        <div className="space-y-4">
          <div className="hidden md:block overflow-hidden rounded-xl border border-sand/60 bg-cream-surface">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand/60 bg-sand/15 text-xs uppercase tracking-wider text-espresso/70">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && orders.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? 'No orders match your filters.' : 'No orders yet.'}
          description={
            hasActiveFilters
              ? 'Try changing the status tab or clearing your search term.'
              : 'Customer orders placed on the storefront will appear here.'
          }
          action={
            hasActiveFilters ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Orders Table & Cards */}
      {!isLoading && !isError && orders.length > 0 && (
        <div
          className={cn(
            'space-y-4',
            isFetching && 'opacity-60 transition-opacity duration-200'
          )}
        >
          {/* Desktop Table View */}
          <OrdersTable orders={orders} />

          {/* Mobile Stacked Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

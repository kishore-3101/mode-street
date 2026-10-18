import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Boxes,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Save,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAdminProductsApi, updateProductStockApi } from '../../api/products.js';
import {
  Button,
  Input,
  Switch,
  Badge,
  PageHeader,
  EmptyState,
  Skeleton,
} from '../../components/ui/index.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { getApiErrorMessage } from '../../lib/utils.js';
import type { ProductVariant } from '../../types/index.js';

export function InventoryPage() {
  const queryClient = useQueryClient();

  // Query all products (including variants)
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getAdminProductsApi(),
  });

  // Filter states
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 250);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Local pending edits state: { [productId]: { [variantId]: newStock } }
  const [pendingEdits, setPendingEdits] = useState<Record<string, Record<string, number>>>({});

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
      for (const v of p.variants || []) {
        totalUnits += v.stock;
        if (v.stock === 0) {
          outOfStockCount++;
        } else if (v.stock <= 5) {
          lowStockCount++;
        }
      }
    }

    return {
      totalProducts: products.length,
      totalUnits,
      lowStockCount,
      outOfStockCount,
    };
  }, [products]);

  // Current stock helper considering pending edits
  const getEffectiveStock = (productId: string, variant: ProductVariant): number => {
    const productEdits = pendingEdits[productId];
    if (productEdits && typeof productEdits[variant.id] === 'number') {
      return productEdits[variant.id]!;
    }
    return variant.stock;
  };

  // Change stock handler
  const handleStockChange = (productId: string, variant: ProductVariant, newStock: number) => {
    const sanitized = Math.max(0, Math.floor(newStock));

    setPendingEdits((prev) => {
      const currentProductEdits = { ...(prev[productId] || {}) };

      if (sanitized === variant.stock) {
        delete currentProductEdits[variant.id];
      } else {
        currentProductEdits[variant.id] = sanitized;
      }

      if (Object.keys(currentProductEdits).length === 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }

      return {
        ...prev,
        [productId]: currentProductEdits,
      };
    });
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const nameMatch = p.name.toLowerCase().includes(query);
        const slugMatch = p.slug.toLowerCase().includes(query);
        if (!nameMatch && !slugMatch) return false;
      }

      // Low / Out of stock toggle
      if (lowStockOnly) {
        const hasLowOrOut = (p.variants || []).some((v) => {
          const productEdits = pendingEdits[p.id];
          const eff = (productEdits && typeof productEdits[v.id] === 'number')
            ? productEdits[v.id]!
            : v.stock;
          return eff <= 5;
        });
        if (!hasLowOrOut) return false;
      }

      return true;
    });
  }, [products, debouncedSearch, lowStockOnly, pendingEdits]);

  // Mutation to save per product stock
  const stockMutation = useMutation({
    mutationFn: async ({
      productId,
      variants,
    }: {
      productId: string;
      variants: { id: string; stock: number }[];
    }) => {
      return updateProductStockApi(productId, { variants });
    },
    onSuccess: (_, variables) => {
      // Clear pending edits for this product
      setPendingEdits((prev) => {
        const next = { ...prev };
        delete next[variables.productId];
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Inventory updated successfully');
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err, 'Failed to update stock');
      toast.error(msg);
    },
  });

  // Save changes for a single product
  const handleSaveProduct = (productId: string) => {
    const edits = pendingEdits[productId];
    if (!edits) return;

    const variantItems = Object.entries(edits).map(([id, stock]) => ({
      id,
      stock,
    }));

    stockMutation.mutate({ productId, variants: variantItems });
  };

  // Discard edits for a single product
  const handleDiscardProduct = (productId: string) => {
    setPendingEdits((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  // Save all pending changes
  const handleSaveAll = async () => {
    const productIdsWithEdits = Object.keys(pendingEdits);
    if (productIdsWithEdits.length === 0) return;

    for (const pid of productIdsWithEdits) {
      handleSaveProduct(pid);
    }
  };

  const handleDiscardAll = () => {
    setPendingEdits({});
  };

  const totalEditedProducts = Object.keys(pendingEdits).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <PageHeader
        title="Inventory Management"
        subtitle="Live stock adjustments, size variant tracking, and low inventory alerts"
      />

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Products */}
        <div className="bg-cream-surface p-4 rounded-xl border border-sand/80 shadow-2xs text-left">
          <div className="flex items-center justify-between text-espresso/60 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Garments</span>
            <Boxes className="w-4 h-4 text-camel" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            {metrics.totalProducts}
          </p>
          <span className="text-[11px] text-espresso/60 font-sans">Active catalog items</span>
        </div>

        {/* Total Units */}
        <div className="bg-cream-surface p-4 rounded-xl border border-sand/80 shadow-2xs text-left">
          <div className="flex items-center justify-between text-espresso/60 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Units</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-espresso font-mono">
            {metrics.totalUnits}
          </p>
          <span className="text-[11px] text-espresso/60 font-sans">Across all size variants</span>
        </div>

        {/* Low Stock (< 5) */}
        <div className="bg-cream-surface p-4 rounded-xl border border-sand/80 shadow-2xs text-left">
          <div className="flex items-center justify-between text-warning mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider text-espresso/70">
              Low Stock (≤5)
            </span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-warning font-mono">
            {metrics.lowStockCount}
          </p>
          <span className="text-[11px] text-espresso/60 font-sans">Variants need restocking</span>
        </div>

        {/* Out of Stock (0) */}
        <div className="bg-cream-surface p-4 rounded-xl border border-sand/80 shadow-2xs text-left">
          <div className="flex items-center justify-between text-danger mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider text-espresso/70">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-danger font-mono">
            {metrics.outOfStockCount}
          </p>
          <span className="text-[11px] text-espresso/60 font-sans">Immediate replenishment</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-cream-surface p-4 rounded-xl border border-sand/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by product name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftElement={<Search className="w-4 h-4" />}
          />
        </div>

        <Switch
          checked={lowStockOnly}
          onChange={setLowStockOnly}
          label="Low / Out of stock only"
          description="Highlight items with 5 or fewer units left"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-cream-surface p-5 rounded-xl border border-sand/80 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && isError && (
        <div className="p-4 rounded-xl bg-danger-bg border border-[#E8C6C3] text-danger text-sm">
          Failed to load inventory: {getApiErrorMessage(error)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <EmptyState
          icon={<Boxes className="w-10 h-10 text-camel stroke-[1.5]" />}
          title="No products found"
          description="No garments match your current search or stock filter."
          action={
            lowStockOnly ? (
              <Button variant="secondary" onClick={() => setLowStockOnly(false)}>
                Show All Stock
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Products & Variants List */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const hasEdits = Boolean(pendingEdits[product.id]);
            const isSaving = stockMutation.isPending && stockMutation.variables?.productId === product.id;

            return (
              <div
                key={product.id}
                className={`bg-cream-surface rounded-xl border transition-all duration-150 p-4 sm:p-5 shadow-2xs text-left ${
                  hasEdits
                    ? 'border-camel ring-2 ring-camel/30 shadow-xs'
                    : 'border-sand/80 hover:border-sand-dark'
                }`}
              >
                {/* Header: Title + Category + Save Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand/40">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-espresso">
                      {product.name}
                    </h3>
                    <p className="text-xs text-espresso/60">
                      {product.category?.name || 'Unassigned'} • /{product.slug}
                    </p>
                  </div>

                  {/* Row Actions when edited */}
                  {hasEdits && (
                    <div className="flex items-center gap-2 self-end sm:self-auto animate-in fade-in duration-150">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDiscardProduct(product.id)}
                        disabled={isSaving}
                        className="text-xs gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Discard
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveProduct(product.id)}
                        isLoading={isSaving}
                        className="text-xs gap-1.5 shadow-2xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Row
                      </Button>
                    </div>
                  )}
                </div>

                {/* Variants Grid / Steppers */}
                <div className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(product.variants || []).map((variant) => {
                      const currentStock = getEffectiveStock(product.id, variant);
                      const isVariantEdited =
                        pendingEdits[product.id]?.[variant.id] !== undefined;

                      return (
                        <div
                          key={variant.id}
                          className={`p-3 rounded-lg border transition-colors flex flex-col justify-between space-y-2 ${
                            isVariantEdited
                              ? 'bg-camel/10 border-camel'
                              : 'bg-cream/40 border-sand/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-base text-espresso">
                              Size {variant.size}
                            </span>
                            {/* Stock Badge */}
                            {currentStock === 0 ? (
                              <Badge variant="danger" size="sm">
                                Out of stock
                              </Badge>
                            ) : currentStock <= 5 ? (
                              <Badge variant="warning" size="sm">
                                Low stock
                              </Badge>
                            ) : (
                              <Badge variant="success" size="sm">
                                In stock
                              </Badge>
                            )}
                          </div>

                          {/* Stepper Input */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={currentStock <= 0}
                              onClick={() =>
                                handleStockChange(product.id, variant, currentStock - 1)
                              }
                              aria-label={`Decrease stock for size ${variant.size}`}
                              className="w-8 h-8 rounded-md border border-sand bg-cream hover:bg-sand/30 flex items-center justify-center text-espresso transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="number"
                              min={0}
                              value={currentStock}
                              onChange={(e) =>
                                handleStockChange(
                                  product.id,
                                  variant,
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-16 h-8 text-center bg-cream-surface border border-sand rounded-md font-mono font-semibold text-sm text-espresso focus-visible:outline-none focus-visible:border-camel focus-visible:ring-1 focus-visible:ring-camel"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleStockChange(product.id, variant, currentStock + 1)
                              }
                              aria-label={`Increase stock for size ${variant.size}`}
                              className="w-8 h-8 rounded-md border border-sand bg-cream hover:bg-sand/30 flex items-center justify-center text-espresso transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating / Sticky Save Changes Bar */}
      {totalEditedProducts > 0 && (
        <div className="fixed bottom-4 left-4 right-4 lg:left-72 max-w-4xl mx-auto z-40 animate-in slide-in-from-bottom duration-200">
          <div className="bg-espresso text-cream p-4 rounded-xl shadow-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-camel animate-ping" />
              <p className="text-sm font-medium">
                You have unsaved stock changes across{' '}
                <span className="font-bold text-sand-light">{totalEditedProducts}</span>{' '}
                product{totalEditedProducts > 1 ? 's' : ''}.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardAll}
                className="text-sand-light hover:text-cream hover:bg-white/10"
              >
                Discard All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveAll}
                isLoading={stockMutation.isPending}
                className="bg-camel text-espresso hover:bg-camel-light border-transparent font-semibold shadow-xs"
              >
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

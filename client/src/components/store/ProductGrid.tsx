import type { Product } from '../../types/index.js';
import { ProductCard } from './ProductCard.js';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function ProductGrid({
  products,
  isLoading,
  isRefetching,
  isError,
  onRetry,
  onClearFilters,
}: ProductGridProps) {
  // 1. Initial Loading State: 8 skeleton cards in the exact same grid
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        aria-label="Loading products"
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="space-y-3">
            <div className="aspect-4/5 w-full bg-sand/35 rounded-[4px] border border-sand animate-pulse" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-16 bg-sand/40 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-sand/40 rounded animate-pulse" />
              <div className="h-3.5 w-14 bg-sand/40 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <p className="font-serif text-2xl text-espresso font-normal">
          Unable to load collection
        </p>
        <p className="text-sm text-espresso/70">
          Something went wrong while fetching the pieces. Please try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel min-h-[44px]"
        >
          Try again
        </button>
      </div>
    );
  }

  // 3. Empty State (No pieces match)
  if (products.length === 0) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <p className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
          No pieces match your filters.
        </p>
        <p className="text-sm text-espresso/70">
          Try clearing your search or selecting a different category.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel min-h-[44px]"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  // 4. Products Grid (with subtle refetching state when filters change)
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-opacity duration-200 ${
        isRefetching ? 'opacity-60' : 'opacity-100'
      }`}
      aria-busy={isRefetching ? 'true' : undefined}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

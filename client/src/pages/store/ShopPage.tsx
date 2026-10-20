import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getStorefrontCategories,
  getStorefrontProductsWithCount,
} from '../../api/storefront.js';
import type { ProductSortOption } from '../../types/index.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { ShopToolbar } from '../../components/store/ShopToolbar.js';
import { ActiveFilters } from '../../components/store/ActiveFilters.js';
import { ProductGrid } from '../../components/store/ProductGrid.js';
import { ShopPagination } from '../../components/store/ShopPagination.js';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Read parameters from URL (Single source of truth)
  const urlCategory = searchParams.get('category') ?? undefined;
  const urlSearch = searchParams.get('search') ?? '';
  const rawSort = searchParams.get('sort');
  const urlSort: ProductSortOption =
    rawSort === 'price_asc' || rawSort === 'price_desc' ? rawSort : 'newest';
  const rawPage = parseInt(searchParams.get('page') ?? '1', 10);
  const urlPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // 2. Local search input state with 300ms debounce
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync state if URL search parameter changes externally (e.g. back/forward navigation)
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  const debouncedSearch = useDebounce(searchInput, 300);

  // Update URL when debounced search term changes
  useEffect(() => {
    const trimmedDebounced = debouncedSearch.trim();
    const trimmedUrl = urlSearch.trim();

    if (trimmedDebounced !== trimmedUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (trimmedDebounced) {
            next.set('search', trimmedDebounced);
          } else {
            next.delete('search');
          }
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    }
  }, [debouncedSearch, urlSearch, setSearchParams]);

  // 3. Fetch categories for tabs and validation
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['storefrontCategories'],
    queryFn: getStorefrontCategories,
  });

  // Category matching & unknown category handling
  const matchedCategory = urlCategory
    ? categories.find((c) => c.slug === urlCategory)
    : undefined;

  const isUnknownCategory =
    Boolean(urlCategory) && !categoriesLoading && !matchedCategory;

  const effectiveCategorySlug = isUnknownCategory ? undefined : urlCategory;

  // 4. Fetch products with count (limit = 12 per page)
  const {
    data: productsData,
    isLoading: productsLoading,
    isPlaceholderData,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'storefrontProductsWithCount',
      {
        category: effectiveCategorySlug,
        search: urlSearch.trim() || undefined,
        sort: urlSort,
        page: urlPage,
        limit: 12,
      },
    ],
    queryFn: () =>
      getStorefrontProductsWithCount({
        category: effectiveCategorySlug,
        search: urlSearch.trim() || undefined,
        sort: urlSort,
        page: urlPage,
        limit: 12,
      }),
    placeholderData: (previousData) => previousData,
  });

  const products = productsData?.products ?? [];
  const totalCount = productsData?.total ?? 0;
  const totalPages = Math.ceil(totalCount / 12);

  // 5. Dynamic document title
  let pageTitle = 'Shop';
  if (matchedCategory) {
    pageTitle = matchedCategory.name;
  } else if (urlSearch.trim()) {
    pageTitle = 'Search Results';
  }
  useDocumentTitle(`${pageTitle} | Mode Street`);

  // 6. Navigation Actions (Update URL state)
  const handleSelectCategory = (slug: string | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (slug) {
        next.set('category', slug);
      } else {
        next.delete('category');
      }
      next.set('page', '1');
      return next;
    });
  };

  const handleSelectSort = (sort: ProductSortOption) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sort === 'newest') {
        next.delete('sort');
      } else {
        next.set('sort', sort);
      }
      next.set('page', '1');
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(page));
      }
      return next;
    });
  };

  const handleClearCategory = () => {
    handleSelectCategory(undefined);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('search');
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('category');
      next.delete('search');
      next.set('page', '1');
      return next;
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 space-y-8">
      {/* ===================================================================== */}
      {/* 1. BREADCRUMB & HEADER                                                */}
      {/* ===================================================================== */}
      <div className="space-y-4">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs uppercase tracking-wider text-espresso/60">
            <li>
              <Link
                to="/"
                className="hover:text-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-espresso/35">/</li>
            {matchedCategory ? (
              <>
                <li>
                  <Link
                    to="/shop"
                    className="hover:text-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                  >
                    Shop
                  </Link>
                </li>
                <li aria-hidden="true" className="text-espresso/35">/</li>
                <li className="text-espresso font-medium" aria-current="page">
                  {matchedCategory.name}
                </li>
              </>
            ) : (
              <li className="text-espresso font-medium" aria-current="page">
                Shop
              </li>
            )}
          </ol>
        </nav>

        {/* Results Heading & Result Count */}
        <div
          id="results-heading"
          tabIndex={-1}
          className="space-y-2 focus:outline-none scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-sand pb-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso tracking-tight">
                {matchedCategory
                  ? matchedCategory.name
                  : urlSearch.trim()
                  ? 'Search results'
                  : 'Shop'}
              </h1>
              {urlSearch.trim() && (
                <p className="text-xs sm:text-sm text-espresso/70 pt-1">
                  Showing results for{' '}
                  <span className="font-semibold text-espresso">
                    “{urlSearch.trim()}”
                  </span>
                  {matchedCategory && <span> in {matchedCategory.name}</span>}
                </p>
              )}
            </div>

            {/* Result count */}
            <div className="text-xs uppercase tracking-wider text-espresso/60 font-medium">
              {!productsLoading &&
                `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'}`}
            </div>
          </div>

          {/* Accessible announcement of total pieces */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {productsLoading
              ? 'Loading pieces...'
              : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'} found`}
          </div>
        </div>

        {/* Unknown category note banner */}
        {isUnknownCategory && (
          <div className="p-3.5 rounded-[10px] border border-sand bg-cream-surface text-xs text-espresso/80 flex items-center justify-between gap-3">
            <span>Category not found. Showing all pieces.</span>
            <button
              type="button"
              onClick={handleClearCategory}
              className="text-espresso underline hover:text-camel font-medium cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. TOOLBAR (Category Tabs, Search, Sort & Active Filters)             */}
      {/* ===================================================================== */}
      <div className="space-y-3">
        <ShopToolbar
          categories={categories}
          activeCategorySlug={effectiveCategorySlug}
          onSelectCategory={handleSelectCategory}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          sortValue={urlSort}
          onSortChange={handleSelectSort}
        />

        <ActiveFilters
          categoryName={matchedCategory?.name}
          searchQuery={urlSearch.trim()}
          onClearCategory={handleClearCategory}
          onClearSearch={handleClearSearch}
          onClearAll={handleClearAllFilters}
        />
      </div>

      {/* ===================================================================== */}
      {/* 3. PRODUCT GRID                                                       */}
      {/* ===================================================================== */}
      <ProductGrid
        products={products}
        isLoading={productsLoading && !isPlaceholderData}
        isRefetching={isPlaceholderData}
        isError={isError}
        onRetry={() => refetch()}
        onClearFilters={handleClearAllFilters}
      />

      {/* ===================================================================== */}
      {/* 4. PAGINATION                                                         */}
      {/* ===================================================================== */}
      <ShopPagination
        currentPage={urlPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ShopPage;

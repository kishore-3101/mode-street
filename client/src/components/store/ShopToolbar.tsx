import { useState } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { Category, ProductSortOption } from '../../types/index.js';
import { CategoryTabs } from './CategoryTabs.js';
import { FilterSheet } from './FilterSheet.js';

interface ShopToolbarProps {
  categories: Category[];
  activeCategorySlug: string | undefined;
  onSelectCategory: (slug: string | undefined) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
}

export function ShopToolbar({
  categories,
  activeCategorySlug,
  onSelectCategory,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
}: ShopToolbarProps) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  return (
    <div className="space-y-4">
      {/* Top Toolbar Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Desktop Category Tabs */}
        <div className="flex-1 min-w-0">
          <CategoryTabs
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            onSelectCategory={onSelectCategory}
          />

          {/* Mobile Filter Button & Sort Controls */}
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-sand bg-cream-surface text-espresso text-xs font-semibold uppercase tracking-wider min-h-[44px] hover:bg-sand/20 active:bg-sand/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
              aria-label="Open category filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-camel" />
              <span>
                {activeCategory ? `Category: ${activeCategory.name}` : 'Filter'}
              </span>
            </button>

            {/* Mobile Sort Dropdown */}
            <div className="relative">
              <label htmlFor="shop-sort-mobile" className="sr-only">
                Sort by
              </label>
              <select
                id="shop-sort-mobile"
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
                className="h-11 pl-3 pr-8 rounded-[10px] border border-sand bg-cream-surface text-espresso text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer appearance-none"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
              <ChevronDown className="w-4 h-4 text-espresso/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop Search & Sort Controls */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative w-64">
            <label htmlFor="shop-search-desktop" className="sr-only">
              Search pieces
            </label>
            <Search className="w-4 h-4 text-espresso/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="shop-search-desktop"
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pieces..."
              className="w-full h-11 pl-9.5 pr-8 rounded-[10px] border border-sand bg-cream-surface text-espresso text-xs placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-espresso/50 hover:text-espresso rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <div className="relative">
            <label htmlFor="shop-sort-desktop" className="sr-only">
              Sort by
            </label>
            <select
              id="shop-sort-desktop"
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
              className="h-11 pl-3.5 pr-9 rounded-[10px] border border-sand bg-cream-surface text-espresso text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer appearance-none min-w-[170px]"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
            <ChevronDown className="w-4 h-4 text-espresso/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Search Row (full-width above grid) */}
      <div className="lg:hidden">
        <div className="relative w-full">
          <label htmlFor="shop-search-mobile" className="sr-only">
            Search pieces
          </label>
          <Search className="w-4 h-4 text-espresso/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="shop-search-mobile"
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pieces..."
            className="w-full h-11 pl-9.5 pr-8 rounded-[10px] border border-sand bg-cream-surface text-espresso text-xs placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-espresso/50 hover:text-espresso rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      <FilterSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        onSelectCategory={onSelectCategory}
      />
    </div>
  );
}

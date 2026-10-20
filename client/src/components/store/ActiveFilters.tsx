import { X } from 'lucide-react';

interface ActiveFiltersProps {
  categoryName: string | undefined;
  searchQuery: string | undefined;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  categoryName,
  searchQuery,
  onClearCategory,
  onClearSearch,
  onClearAll,
}: ActiveFiltersProps) {
  const hasCategory = Boolean(categoryName);
  const hasSearch = Boolean(searchQuery && searchQuery.trim().length > 0);

  if (!hasCategory && !hasSearch) {
    return null;
  }

  const multipleActive = hasCategory && hasSearch;

  return (
    <div
      className="flex flex-wrap items-center gap-2 pt-1"
      aria-label="Active filters"
    >
      <span className="text-xs text-espresso/60 mr-1 select-none">
        Filtered by:
      </span>

      {hasCategory && (
        <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-[6px] border border-sand bg-cream-surface text-xs text-espresso">
          <span>
            Category: <strong className="font-semibold">{categoryName}</strong>
          </span>
          <button
            type="button"
            onClick={onClearCategory}
            className="p-1 text-espresso/60 hover:text-espresso rounded hover:bg-sand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
            aria-label={`Remove category filter: ${categoryName}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {hasSearch && (
        <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-[6px] border border-sand bg-cream-surface text-xs text-espresso">
          <span>
            Search: <strong className="font-semibold">“{searchQuery}”</strong>
          </span>
          <button
            type="button"
            onClick={onClearSearch}
            className="p-1 text-espresso/60 hover:text-espresso rounded hover:bg-sand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
            aria-label={`Remove search filter: ${searchQuery}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {multipleActive && (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-2 text-xs text-espresso/70 hover:text-espresso underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

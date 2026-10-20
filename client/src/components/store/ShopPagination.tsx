import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);

  if (left > 2) {
    pages.push('...');
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total - 1) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}

export function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);

    // Scroll to results top and shift focus
    const heading = document.getElementById('results-heading');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    heading?.scrollIntoView({
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
      block: 'start',
    });
    heading?.focus({ preventScroll: true });
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5 sm:gap-2 pt-8 sm:pt-12 select-none"
      aria-label="Shop catalog pagination"
    >
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`min-h-[44px] min-w-[44px] px-3 rounded-[10px] border border-sand bg-cream-surface text-espresso flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer ${
          currentPage <= 1
            ? 'opacity-35 pointer-events-none'
            : 'hover:bg-sand/20 active:bg-sand/35'
        }`}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Numbered Page Buttons & Ellipses */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="min-h-[44px] min-w-[36px] flex items-center justify-center text-espresso/45 select-none"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => handlePageClick(p)}
              className={`min-h-[44px] min-w-[44px] rounded-[10px] text-xs sm:text-sm font-medium flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel ${
                isCurrent
                  ? 'bg-espresso text-cream font-semibold shadow-xs'
                  : 'border border-sand bg-cream-surface text-espresso hover:bg-sand/25 active:bg-sand/40'
              }`}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`min-h-[44px] min-w-[44px] px-3 rounded-[10px] border border-sand bg-cream-surface text-espresso flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer ${
          currentPage >= totalPages
            ? 'opacity-35 pointer-events-none'
            : 'hover:bg-sand/20 active:bg-sand/35'
        }`}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

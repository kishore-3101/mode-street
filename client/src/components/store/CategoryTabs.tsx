import type { Category } from '../../types/index.js';

interface CategoryTabsProps {
  categories: Category[];
  activeCategorySlug: string | undefined;
  onSelectCategory: (slug: string | undefined) => void;
}

export function CategoryTabs({
  categories,
  activeCategorySlug,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <nav
      className="hidden lg:flex items-center gap-7 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-sand pb-px"
      aria-label="Filter by category"
    >
      <button
        type="button"
        onClick={() => onSelectCategory(undefined)}
        className={`pb-3 text-xs tracking-wider uppercase font-medium transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded whitespace-nowrap ${
          !activeCategorySlug
            ? 'text-espresso font-semibold'
            : 'text-espresso/65 hover:text-espresso'
        }`}
        aria-current={!activeCategorySlug ? 'true' : undefined}
      >
        All
        {!activeCategorySlug && (
          <span
            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-espresso"
            aria-hidden="true"
          />
        )}
      </button>

      {categories.map((category) => {
        const isActive = activeCategorySlug === category.slug;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.slug)}
            className={`pb-3 text-xs tracking-wider uppercase font-medium transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded whitespace-nowrap ${
              isActive
                ? 'text-espresso font-semibold'
                : 'text-espresso/65 hover:text-espresso'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            {category.name}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-espresso"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

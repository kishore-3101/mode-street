import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import type { Category } from '../../types/index.js';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategorySlug: string | undefined;
  onSelectCategory: (slug: string | undefined) => void;
}

export function FilterSheet({
  isOpen,
  onClose,
  categories,
  activeCategorySlug,
  onSelectCategory,
}: FilterSheetProps) {
  const [prevActiveSlug, setPrevActiveSlug] = useState(activeCategorySlug);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(activeCategorySlug);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  if (activeCategorySlug !== prevActiveSlug) {
    setPrevActiveSlug(activeCategorySlug);
    setSelectedSlug(activeCategorySlug);
  }

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Simple focus trap inside sheet
      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectCategory(selectedSlug);
    onClose();
  };

  const handleReset = () => {
    setSelectedSlug(undefined);
    onSelectCategory(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="relative w-full sm:max-w-md bg-cream rounded-t-[16px] sm:rounded-[12px] border border-sand shadow-2xl flex flex-col max-h-[85vh] overflow-hidden pb-[env(safe-area-inset-bottom,16px)] z-10 transition-transform duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
          <h2
            id="filter-sheet-title"
            className="font-serif text-2xl font-normal text-espresso tracking-tight"
          >
            Filter by Category
          </h2>
          <button
            ref={firstFocusableRef}
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-espresso/70 hover:text-espresso min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List (Radio choices) */}
        <div className="p-6 overflow-y-auto space-y-2 flex-1" role="radiogroup" aria-label="Categories">
          {/* All Pieces */}
          <button
            type="button"
            role="radio"
            aria-checked={!selectedSlug}
            onClick={() => setSelectedSlug(undefined)}
            className={`w-full flex items-center justify-between p-3.5 rounded-[10px] border text-left transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel ${
              !selectedSlug
                ? 'border-espresso bg-sand/30 text-espresso font-medium'
                : 'border-sand bg-cream-surface text-espresso/80 hover:bg-sand/15'
            }`}
          >
            <span className="text-sm">All Pieces</span>
            {!selectedSlug && <Check className="w-4 h-4 text-espresso" />}
          </button>

          {/* Each Category */}
          {categories.map((cat) => {
            const isSelected = selectedSlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedSlug(cat.slug)}
                className={`w-full flex items-center justify-between p-3.5 rounded-[10px] border text-left transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel ${
                  isSelected
                    ? 'border-espresso bg-sand/30 text-espresso font-medium'
                    : 'border-sand bg-cream-surface text-espresso/80 hover:bg-sand/15'
                }`}
              >
                <span className="text-sm">{cat.name}</span>
                {isSelected && <Check className="w-4 h-4 text-espresso" />}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-3 border-t border-sand flex items-center gap-3 bg-cream">
          {selectedSlug && (
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-[10px] border border-sand bg-cream-surface text-espresso text-xs uppercase tracking-wider font-semibold hover:bg-sand/20 transition-colors min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

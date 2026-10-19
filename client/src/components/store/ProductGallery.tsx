import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '../../types/index.js';
import logoImg from '../../assets/logo.png';

interface ProductGalleryProps {
  productName: string;
  images: ProductImage[];
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const total = sortedImages.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // If activeIndex is out of range, clamp it
  const currentIndex = Math.min(activeIndex, Math.max(0, total - 1));

  // Sync mobile scroll when currentIndex changes programmatically
  const scrollToMobileIndex = (index: number) => {
    setActiveIndex(index);
    setMobileIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const width = container.clientWidth;
      container.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  // Track mobile scroll snap position
  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== mobileIndex && newIndex >= 0 && newIndex < total) {
        setMobileIndex(newIndex);
        setActiveIndex(newIndex);
      }
    }
  };

  // Handle keyboard navigation for desktop thumbnails
  const handleThumbnailKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % total;
      setActiveIndex(next);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      setActiveIndex(prev);
    }
  };

  // Lightbox keyboard controls (Escape, ArrowLeft, ArrowRight) and focus trapping
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % total);
      }
    };

    // Trap focus inside lightbox
    const focusable = lightboxRef.current?.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleTab);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, total]);

  // Fallback if product has no images
  if (total === 0) {
    return (
      <div className="w-full aspect-4/5 rounded-[4px] border border-sand bg-sand/30 flex items-center justify-center p-8">
        <img
          src={logoImg}
          alt="Mode Street"
          className="w-40 sm:w-48 max-w-[65%] object-contain opacity-80"
        />
      </div>
    );
  }

  const currentImage = sortedImages[currentIndex];

  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* DESKTOP GALLERY (lg and above)                                     */}
      {/* =================================================================== */}
      <div className="hidden lg:flex gap-4 items-start">
        {/* Vertical Thumbnail Strip */}
        {total > 1 && (
          <div
            className="flex flex-col gap-3 w-20 shrink-0"
            role="tablist"
            aria-label="Product thumbnails"
          >
            {sortedImages.map((img, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={img.id || index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${productName}, view image ${index + 1} of ${total}`}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
                  className={`relative aspect-4/5 w-full rounded-[4px] overflow-hidden bg-sand/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer ${
                    isActive
                      ? 'border border-espresso ring-1 ring-espresso'
                      : 'border border-sand hover:border-camel/70 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${productName}, thumbnail ${index + 1} of ${total}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Main Desktop Image (Click opens Lightbox) */}
        <div className="flex-1">
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-4/5 w-full rounded-[4px] overflow-hidden border border-sand bg-sand/20 cursor-zoom-in group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
            role="button"
            tabIndex={0}
            aria-label={`Open full-screen image for ${productName}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsLightboxOpen(true);
              }
            }}
          >
            <img
              src={currentImage.url}
              alt={`${productName}, image ${currentIndex + 1} of ${total}`}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE GALLERY (below lg)                                          */}
      {/* =================================================================== */}
      <div className="lg:hidden">
        {/* Swipeable scroll-snap carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none aspect-4/5 w-full rounded-[4px] border border-sand bg-sand/20"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedImages.map((img, index) => (
            <div
              key={img.id || index}
              className="w-full h-full shrink-0 snap-center relative"
            >
              <img
                src={img.url}
                alt={`${productName}, image ${index + 1} of ${total}`}
                className="w-full h-full object-cover select-none"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Dot indicators (only if > 1 image) */}
        {total > 1 && (
          <div
            className="flex justify-center items-center gap-2 pt-3"
            aria-label="Image slide indicator"
          >
            {sortedImages.map((_, index) => {
              const isActive = index === mobileIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollToMobileIndex(index)}
                  aria-label={`Go to slide ${index + 1} of ${total}`}
                  className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer ${
                    isActive ? 'w-5 bg-espresso' : 'w-1.5 bg-sand hover:bg-camel'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* LIGHTBOX MODAL                                                     */}
      {/* =================================================================== */}
      {isLightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-espresso/90 backdrop-blur-xs flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image lightbox`}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-cream w-full max-w-5xl mx-auto z-10">
            <span className="text-xs uppercase tracking-widest text-cream/70 font-medium">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 text-cream hover:text-camel transition-colors rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close full-screen image"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image with Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center max-w-5xl w-full mx-auto my-2">
            {total > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev - 1 + total) % total)}
                className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-espresso/60 text-cream hover:text-camel hover:bg-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={sortedImages[currentIndex].url}
              alt={`${productName}, image ${currentIndex + 1} of ${total}`}
              className="max-h-[80vh] max-w-full object-contain rounded-[4px] shadow-xl select-none"
            />

            {total > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % total)}
                className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-espresso/60 text-cream hover:text-camel hover:bg-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Caption */}
          <div className="text-center text-xs text-cream/70 font-medium py-2">
            <span>{productName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

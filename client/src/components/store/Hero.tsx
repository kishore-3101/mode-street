import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStorefrontHeroSlides } from '../../api/storefront.js';
import { useHeroSlideshow } from '../../hooks/useHeroSlideshow.js';
import type { HeroSlide } from '../../types/index.js';
import { cn } from '../../lib/utils.js';

// Fallback slide if database is empty, loading, or network fails
const FALLBACK_SLIDE: HeroSlide = {
  id: 'fallback-static-hero',
  image_url: '/hero.jpg',
  alt_text: 'Mode Street Editorial Collection',
  link_url: '/shop',
  sort_order: 0,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Normalizes and resolves slide image URLs:
 * - Supabase or external absolute URLs (http://, https://, data:) are preserved.
 * - Uploads paths (/uploads/...) resolve through Vite's dev proxy or backend origin.
 * - Local static paths (/hero.jpg) are preserved.
 */
function resolveSlideImageUrl(url?: string | null): string {
  if (!url) return '/hero.jpg';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  // Normalize uploads path
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      const origin = apiUrl.replace(/\/api\/?$/, '');
      return `${origin}${clean}`;
    }
    return clean;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

interface SlideItemProps {
  slide: HeroSlide;
  isActive: boolean;
  isFirst: boolean;
  isNext: boolean;
  prefersReducedMotion: boolean;
}

function SlideItem({
  slide,
  isActive,
  isFirst,
  isNext,
  prefersReducedMotion,
}: SlideItemProps) {
  // Support both snake_case and camelCase field names from API/uploads
  const rawUrl = slide.image_url ?? (slide as any).imageUrl ?? (slide as any).url ?? '';
  const resolvedUrl = resolveSlideImageUrl(rawUrl);
  const [hasError, setHasError] = useState(false);

  // If slide URL changes, reset error state during render
  const [prevUrl, setPrevUrl] = useState(rawUrl);
  if (prevUrl !== rawUrl) {
    setPrevUrl(rawUrl);
    setHasError(false);
  }

  const imgSrc = hasError ? '/hero.jpg' : resolvedUrl;

  // Graceful fallback to static hero on any image loading error
  const handleImageError = () => {
    if (!hasError && resolvedUrl !== '/hero.jpg') {
      setHasError(true);
    }
  };

  const isEager = isFirst || isNext || isActive;
  const isExternal = slide.link_url?.startsWith('http://') || slide.link_url?.startsWith('https://');

  const content = (
    <div className="relative h-full w-full overflow-hidden bg-espresso">
      <img
        src={imgSrc}
        alt={slide.alt_text ?? ''}
        loading={isEager ? 'eager' : 'lazy'}
        fetchPriority={isFirst ? 'high' : undefined}
        decoding="async"
        onError={handleImageError}
        className="h-full w-full select-none object-cover object-center"
      />
    </div>
  );

  return (
    <div
      className={cn(
        'absolute inset-0 h-full w-full',
        prefersReducedMotion
          ? 'transition-none'
          : 'transition-opacity duration-700 ease-in-out',
        isActive
          ? 'opacity-100 z-10 pointer-events-auto'
          : 'opacity-0 z-0 pointer-events-none'
      )}
      aria-hidden={!isActive}
    >
      {slide.link_url ? (
        isExternal ? (
          <a
            href={slide.link_url}
            className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-inset"
            tabIndex={isActive ? 0 : -1}
          >
            {content}
          </a>
        ) : (
          <Link
            to={slide.link_url}
            className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-inset"
            tabIndex={isActive ? 0 : -1}
          >
            {content}
          </Link>
        )
      ) : (
        content
      )}
    </div>
  );
}

export function Hero() {
  const { data: dbSlides = [], isError } = useQuery({
    queryKey: ['storefrontHeroSlides'],
    queryFn: getStorefrontHeroSlides,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Gracefully fallback to static hero if empty or on query error
  const slides = !isError && dbSlides.length > 0 ? dbSlides : [FALLBACK_SLIDE];
  const totalSlides = slides.length;
  const hasMultipleSlides = totalSlides > 1;

  const {
    currentIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    setIsHovered,
    setIsFocused,
    prefersReducedMotion,
  } = useHeroSlideshow({ totalSlides, intervalMs: 3000 });

  const nextIndex = (currentIndex + 1) % totalSlides;

  return (
    <section
      aria-label="Editorial collection showcase"
      className="group relative w-full overflow-hidden bg-espresso h-[460px] sm:h-[600px] lg:h-[calc(80svh-5rem)] min-h-[420px] max-h-[820px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      {/* Slides Stack - Direct absolute positioning to guarantee full height */}
      {slides.map((slide, index) => (
        <SlideItem
          key={slide.id || index}
          slide={slide}
          isActive={currentIndex === index}
          isFirst={index === 0}
          isNext={nextIndex === index}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}

      {/* Multi-slide controls (dots and arrows) */}
      {hasMultipleSlides && (
        <>
          {/* Previous Slide Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden sm:inline-flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-espresso/40 text-cream backdrop-blur-xs border border-sand/30 hover:bg-espresso/70 transition-all opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next Slide Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden sm:inline-flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-espresso/40 text-cream backdrop-blur-xs border border-sand/30 hover:bg-espresso/70 transition-all opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pagination Dots */}
          <nav
            aria-label="Hero slides pagination"
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-espresso/40 backdrop-blur-xs border border-sand/25"
          >
            {slides.map((_, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1} of ${totalSlides}`}
                  aria-current={isSelected ? 'true' : undefined}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer',
                    isSelected
                      ? 'w-6 bg-cream'
                      : 'w-2 bg-cream/40 hover:bg-cream/70'
                  )}
                />
              );
            })}
          </nav>
        </>
      )}
    </section>
  );
}

export default Hero;

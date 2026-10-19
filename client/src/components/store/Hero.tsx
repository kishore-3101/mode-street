import { Link } from 'react-router-dom';

/**
 * Editorial supporting description text for the hero.
 * Kept in a top-level constant for easy editing/client approval.
 */
export const HERO_DESCRIPTION =
  'Refined silhouettes and tactile textiles crafted with deliberate restraint.';

export function Hero() {
  const handleBrowseCategories = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('categories');
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
      block: 'start',
    });

    const heading = document.getElementById('categories-heading');
    heading?.focus({ preventScroll: true });
  };

  return (
    <section
      className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-espresso max-h-[820px] sm:min-h-[640px] lg:min-h-[calc(80svh-5rem)]"
      aria-label="New season collection introduction"
    >
      {/* Layer 1: photograph */}
      <picture className="absolute inset-0 block h-full w-full">
        <source srcSet="/hero-1920.webp" media="(min-width: 768px)" type="image/webp" />
        <source srcSet="/hero-960.webp" media="(max-width: 767px)" type="image/webp" />
        <img
          src="/hero.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1080}
          className="pointer-events-none h-full w-full select-none object-cover object-[25%_center] md:object-[35%_center] lg:object-[center_left]"
        />
      </picture>

      {/* Layer 2: flat dark overlay (no gradient) */}
      <div className="pointer-events-none absolute inset-0 bg-espresso/55" aria-hidden="true" />

      {/* Layer 3: content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <fieldset
          role="presentation"
          className="m-0 w-full min-w-0 max-w-[560px] rounded-none border border-cream/50 bg-espresso/15 p-6 sm:p-8 lg:p-10"
        >
          <legend className="ml-2 select-none px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/80 sm:ml-4">
            NEW SEASON
          </legend>

          <div className="space-y-5">
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.05] tracking-tight text-cream">
              Wear Your Story
            </h1>

            <p className="max-w-[44ch] text-[15px] font-normal leading-[1.6] text-cream/90 sm:text-[16px]">
              {HERO_DESCRIPTION}
            </p>

            <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/shop"
                className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-sand px-[22px] py-3 text-xs font-semibold uppercase tracking-[0.08em] text-espresso transition-colors duration-150 hover:bg-sand/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 focus-visible:ring-offset-espresso sm:text-sm"
              >
                Shop the collection
              </Link>

              <a
                href="#categories"
                onClick={handleBrowseCategories}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[10px] border border-cream/60 bg-transparent px-[22px] py-3 text-xs font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-150 hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 focus-visible:ring-offset-espresso sm:text-sm"
              >
                Browse categories
              </a>
            </div>
          </div>
        </fieldset>
      </div>
    </section>
  );
}

export default Hero;
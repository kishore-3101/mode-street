import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStorefrontCategories, getStorefrontProducts } from '../../api/storefront.js';
import { ProductCard } from '../../components/store/ProductCard.js';
import logoImg from '../../assets/logo.png';

/**
 * Brand photography asset for the hero composition.
 * Leave as null to compose from the newest product images or display the logo fallback.
 */
const HERO_IMAGE: string | null = null;

export function HomePage() {
  // Fetch active categories
  const { data: categories = [] } = useQuery({
    queryKey: ['storefrontCategories'],
    queryFn: getStorefrontCategories,
  });

  // Fetch newest products (limit 8 for new arrivals, plus hero selection)
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['storefrontProducts', { limit: 10 }],
    queryFn: () => getStorefrontProducts({ limit: 10 }),
  });

  // Extract up to 2 products with images for hero composition
  const productsWithImages = products.filter(
    (p) => p.images && p.images.length > 0
  );
  const heroFirstProduct = productsWithImages[0];
  const heroSecondProduct = productsWithImages[1];
  const heroImage1 = heroFirstProduct?.images?.[0]?.url;
  const heroImage2 = heroSecondProduct?.images?.[0]?.url;

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const newArrivals = products.slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 pb-16 sm:pb-24">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                      */}
      {/* ===================================================================== */}
      <section className="min-h-[60vh] lg:min-h-[70vh] flex items-center pt-8 sm:pt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <span className="text-xs uppercase tracking-widest text-camel font-medium block">
                New season
              </span>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-espresso leading-[1.08] tracking-tight">
                Wear your story.
              </h1>

              <p className="text-sm sm:text-base text-espresso/75 leading-relaxed max-w-md font-normal">
                Refined silhouettes and tactile textiles crafted with deliberate restraint.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-espresso/90 active:bg-espresso-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2"
                >
                  Shop the collection
                </Link>

                {categories.length > 0 && (
                  <button
                    type="button"
                    onClick={scrollToCategories}
                    className="inline-flex items-center text-xs uppercase tracking-wider font-medium text-espresso underline underline-offset-4 hover:text-camel transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded cursor-pointer"
                  >
                    Browse categories
                  </button>
                )}
              </div>
            </div>

            {/* Right Media Area */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              {HERO_IMAGE ? (
                <div className="w-full max-w-md aspect-4/5 rounded-[4px] overflow-hidden border border-sand bg-sand/20">
                  <img
                    src={HERO_IMAGE}
                    alt="Mode Street Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : heroImage1 && heroImage2 ? (
                /* Composition of two newest product images offset vertically for rhythm */
                <div className="relative w-full max-w-md grid grid-cols-2 gap-4 sm:gap-6 items-start py-6">
                  {/* First taller card */}
                  <Link
                    to={`/product/${encodeURIComponent(heroFirstProduct.slug)}`}
                    className="group block rounded-[4px] overflow-hidden border border-sand bg-cream-surface aspect-4/5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
                    aria-label={heroFirstProduct.name}
                  >
                    <img
                      src={heroImage1}
                      alt={heroFirstProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                  </Link>

                  {/* Second card offset vertically */}
                  <Link
                    to={`/product/${encodeURIComponent(heroSecondProduct.slug)}`}
                    className="group block rounded-[4px] overflow-hidden border border-sand bg-cream-surface aspect-4/5 shadow-2xs translate-y-6 sm:translate-y-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
                    aria-label={heroSecondProduct.name}
                  >
                    <img
                      src={heroImage2}
                      alt={heroSecondProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                  </Link>
                </div>
              ) : (
                /* Sand-coloured block with logo centred */
                <div className="w-full max-w-md aspect-4/5 rounded-[4px] border border-sand bg-sand/30 flex items-center justify-center p-8">
                  <img
                    src={logoImg}
                    alt="Mode Street"
                    className="w-44 sm:w-52 max-w-[70%] object-contain opacity-90"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. SHOP BY CATEGORY                                                  */}
      {/* ===================================================================== */}
      {categories.length > 0 && (
        <section id="categories" className="scroll-mt-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso tracking-tight">
                Shop by category
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${encodeURIComponent(category.slug)}`}
                  className="group block rounded-[4px] overflow-hidden border border-sand bg-cream-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
                >
                  <div className="relative aspect-4/5 w-full bg-sand/30 overflow-hidden">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 bg-sand/30 text-center">
                        <span className="font-serif text-xl sm:text-2xl text-espresso font-normal">
                          {category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Solid (not gradient) label below image */}
                  <div className="p-3 bg-cream-surface border-t border-sand flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-medium text-espresso group-hover:text-camel transition-colors">
                      {category.name}
                    </span>
                    <span className="text-xs text-espresso/40 group-hover:text-espresso transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 3. NEW ARRIVALS                                                      */}
      {/* ===================================================================== */}
      <section>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-baseline justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso tracking-tight">
              New arrivals
            </h2>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-medium text-espresso hover:text-camel transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
            >
              View all
            </Link>
          </div>

          {productsLoading ? (
            /* Skeleton Loading Cards */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="space-y-3 animate-pulse">
                  <div className="aspect-4/5 w-full bg-sand/30 rounded-[4px] border border-sand" />
                  <div className="h-3 w-16 bg-sand/40 rounded-[2px]" />
                  <div className="h-4 w-36 bg-sand/40 rounded-[2px]" />
                  <div className="h-3 w-12 bg-sand/40 rounded-[2px]" />
                </div>
              ))}
            </div>
          ) : productsError ? (
            /* Error State with Retry */
            <div className="p-8 sm:p-12 text-center rounded-[4px] border border-sand bg-cream-surface max-w-md mx-auto space-y-4">
              <p className="text-sm text-espresso/80">
                Unable to load new arrivals at this moment.
              </p>
              <button
                type="button"
                onClick={() => refetchProducts()}
                className="px-5 py-2.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-espresso/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : newArrivals.length === 0 ? (
            /* Calm Empty State */
            <div className="py-16 text-center rounded-[4px] border border-sand bg-cream-surface">
              <p className="font-serif text-xl sm:text-2xl font-light text-espresso">
                New pieces arrive soon.
              </p>
            </div>
          ) : (
            /* Product Grid: 2 columns mobile, 4 columns desktop */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. BRAND STATEMENT BAND                                              */}
      {/* ===================================================================== */}
      <section className="bg-espresso text-cream py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-2xl">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
            Wear your story.
          </h2>

          <p className="text-sm sm:text-base text-cream/75 leading-relaxed font-normal">
            We design everyday garments shaped by architectural balance, enduring fabrics, and quiet ease.
          </p>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[10px] border border-cream/40 text-cream text-xs uppercase tracking-wider font-medium hover:bg-cream hover:text-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
            >
              Explore the collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

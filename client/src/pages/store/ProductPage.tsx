import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import { getStorefrontProductBySlug, getStorefrontProducts } from '../../api/storefront.js';
import { ProductGallery } from '../../components/store/ProductGallery.js';
import { ProductCard } from '../../components/store/ProductCard.js';
import { useCart } from '../../hooks/useCart.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { formatCurrency, sortVariants } from '../../lib/utils.js';
import type { Product, ProductVariant } from '../../types/index.js';

interface ProductViewProps {
  product: Product;
}

function ProductView({ product }: ProductViewProps) {
  const navigate = useNavigate();
  const { addItem, setBuyNowItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  const sizeSelectorRef = useRef<HTMLDivElement>(null);
  const firstAvailableSizeRef = useRef<HTMLButtonElement>(null);
  const mainActionsRef = useRef<HTMLDivElement>(null);

  // Set document title
  useDocumentTitle(`${product.name} | Mode Street`);

  // Fetch related products from same category
  const categorySlug = product.category?.slug;
  const { data: relatedProductsRaw = [] } = useQuery({
    queryKey: ['storefrontRelatedProducts', categorySlug],
    queryFn: () => getStorefrontProducts({ category: categorySlug, limit: 5 }),
    enabled: Boolean(categorySlug),
  });

  const relatedProducts = useMemo(() => {
    return relatedProductsRaw
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [relatedProductsRaw, product.id]);

  // Sorted variants
  const sortedVariants = useMemo(() => {
    return sortVariants(product.variants ?? []);
  }, [product.variants]);

  // Check if every variant is completely out of stock
  const isAllSoldOut =
    Boolean(sortedVariants.length > 0) &&
    sortedVariants.every((v) => v.stock <= 0);

  // Selected variant details
  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    if (!selectedSize) return undefined;
    return sortedVariants.find((v) => v.size === selectedSize);
  }, [sortedVariants, selectedSize]);

  const maxSelectableQty = selectedVariant
    ? Math.min(10, Math.max(1, selectedVariant.stock))
    : 10;

  // Track scroll past main action buttons for mobile sticky bar
  useEffect(() => {
    const target = mainActionsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show mobile bar when main buttons are scrolled above the viewport
        setShowMobileBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    const v = sortedVariants.find((item) => item.size === size);
    if (v && quantity > v.stock) {
      setQuantity(Math.max(1, Math.min(10, v.stock)));
    }
  };

  const validateAndGetVariant = (): ProductVariant | null => {
    if (!selectedSize || !selectedVariant) {
      setSizeError(true);
      if (sizeSelectorRef.current) {
        sizeSelectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      firstAvailableSizeRef.current?.focus();
      return null;
    }
    return selectedVariant;
  };

  const effectiveQuantity = Math.min(quantity, maxSelectableQty);

  const handleAddToCart = () => {
    const variant = validateAndGetVariant();
    if (!variant) return;

    const primaryImage = product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.position - b.position)[0]?.url
      : null;

    addItem({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: variant.size,
      price: product.price,
      image: primaryImage,
      qty: effectiveQuantity,
      maxQty: variant.stock,
    });

    toast('Added to cart', {
      action: {
        label: 'View cart',
        onClick: () => navigate('/cart'),
      },
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    const variant = validateAndGetVariant();
    if (!variant) return;

    const primaryImage = product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.position - b.position)[0]?.url
      : null;

    setBuyNowItem({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: variant.size,
      price: product.price,
      image: primaryImage,
      qty: effectiveQuantity,
      maxQty: variant.stock,
    });

    navigate('/checkout?mode=buy-now');
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* =================================================================== */}
        {/* BREADCRUMB NAVIGATION                                              */}
        {/* =================================================================== */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-wider text-espresso/60 flex items-center flex-wrap gap-2 mb-6 sm:mb-8 font-normal"
        >
          <Link
            to="/"
            className="hover:text-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
          >
            Home
          </Link>
          <span aria-hidden="true" className="text-espresso/30">/</span>

          {product.category && (
            <>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category.slug)}`}
                className="hover:text-espresso transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
              >
                {product.category.name}
              </Link>
              <span aria-hidden="true" className="text-espresso/30">/</span>
            </>
          )}

          <span
            className="text-espresso font-medium truncate max-w-[200px] sm:max-w-xs"
            aria-current="page"
          >
            {product.name}
          </span>
        </nav>

        {/* =================================================================== */}
        {/* TWO-COLUMN LAYOUT: GALLERY (58%) & STICKY DETAILS (42%)             */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery (about 58%) */}
          <div className="lg:col-span-7">
            <ProductGallery
              productName={product.name}
              images={product.images ?? []}
            />
          </div>

          {/* Right Column: Details (about 42% and sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start space-y-6 sm:space-y-8">
            {/* Title & Price Header */}
            <div className="space-y-2">
              {product.category && (
                <Link
                  to={`/shop?category=${encodeURIComponent(product.category.slug)}`}
                  className="text-xs uppercase tracking-widest text-camel font-medium hover:underline inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso leading-tight tracking-tight">
                {product.name}
              </h1>

              <p className="text-xl sm:text-2xl font-medium text-espresso pt-1">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="h-px bg-sand w-full" />

            {/* If every variant is out of stock */}
            {isAllSoldOut ? (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-4 rounded-[10px] bg-sand/30 text-espresso/50 border border-sand cursor-not-allowed font-medium text-xs uppercase tracking-wider"
                >
                  Sold out
                </button>
                <p className="text-xs text-espresso/60 text-center font-normal">
                  This piece is currently unavailable.
                </p>
              </div>
            ) : (
              /* Active Shopping Flow */
              <div className="space-y-6">
                {/* Size Selector */}
                {sortedVariants.length > 0 && (
                  <div
                    ref={sizeSelectorRef}
                    className={`space-y-3 p-1 rounded-[10px] transition-all duration-200 ${
                      sizeError ? 'ring-2 ring-camel ring-offset-2 ring-offset-cream' : ''
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-wider font-medium text-espresso">
                        Select size
                      </span>

                      {/* Stock message (only once a size is chosen) */}
                      <span
                        aria-live="polite"
                        className="text-xs font-medium text-camel"
                      >
                        {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0
                          ? `Only ${selectedVariant.stock} left`
                          : ''}
                      </span>
                    </div>

                    {/* Radiogroup for sizes */}
                    <div
                      role="radiogroup"
                      aria-label="Select size"
                      className="flex flex-wrap gap-2.5"
                    >
                      {sortedVariants.map((variant, index) => {
                        const isSelected = selectedSize === variant.size;
                        const isOutOfStock = variant.stock <= 0;
                        const isFirstAvailable =
                          !isOutOfStock &&
                          sortedVariants.findIndex((v) => v.stock > 0) === index;

                        return (
                          <button
                            key={variant.id || variant.size}
                            ref={isFirstAvailable ? firstAvailableSizeRef : undefined}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={
                              isOutOfStock
                                ? `${variant.size} - sold out`
                                : `Size ${variant.size}`
                            }
                            disabled={isOutOfStock}
                            onClick={() => handleSizeSelect(variant.size)}
                            className={`min-w-[48px] min-h-[44px] px-3.5 py-2.5 rounded-[10px] text-xs font-medium uppercase tracking-wider transition-all duration-150 relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel ${
                              isSelected
                                ? 'bg-espresso text-cream border border-espresso'
                                : isOutOfStock
                                ? 'opacity-40 border border-sand text-espresso/40 cursor-not-allowed bg-sand/10 overflow-hidden'
                                : 'border border-sand bg-transparent text-espresso hover:border-camel'
                            }`}
                          >
                            <span>{variant.size}</span>
                            {/* Diagonal strike for out of stock */}
                            {isOutOfStock && (
                              <span
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                aria-hidden="true"
                              >
                                <span className="w-full h-px bg-sand -rotate-45" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Size validation error message */}
                    {sizeError && (
                      <p
                        aria-live="polite"
                        className="text-xs font-medium text-danger pt-1"
                      >
                        Please select a size
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-medium text-espresso block">
                    Quantity
                  </span>
                  <div className="inline-flex items-center border border-sand rounded-[10px] bg-transparent">
                    <button
                      type="button"
                      disabled={!selectedSize || quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-espresso hover:text-camel disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-l-[10px]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span
                      aria-live="polite"
                      className="w-12 text-center text-xs font-medium text-espresso select-none"
                    >
                      {effectiveQuantity}
                    </span>

                    <button
                      type="button"
                      disabled={!selectedSize || quantity >= maxSelectableQty}
                      onClick={() => setQuantity((q) => Math.min(maxSelectableQty, q + 1))}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-espresso hover:text-camel disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-r-[10px]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Add to cart and Buy now */}
                <div ref={mainActionsRef} className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full min-h-[44px] py-3.5 px-6 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-espresso/90 active:bg-espresso-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 focus-visible:ring-offset-cream cursor-pointer"
                  >
                    {isAdded ? 'Added' : 'Add to cart'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full min-h-[44px] py-3.5 px-6 rounded-[10px] border border-sand bg-transparent text-espresso text-xs uppercase tracking-wider font-medium hover:border-espresso hover:bg-sand/20 active:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 focus-visible:ring-offset-cream cursor-pointer"
                  >
                    Buy now
                  </button>
                </div>
              </div>
            )}

            {/* Description (plain text paragraphs, no html injection) */}
            {product.description && product.description.trim() !== '' && (
              <div className="pt-6 border-t border-sand space-y-3">
                <h2 className="text-xs uppercase tracking-widest text-camel font-medium">
                  Description
                </h2>
                <div className="text-sm text-espresso/80 leading-relaxed font-normal whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RELATED PRODUCTS ("You may also like")                              */}
        {/* =================================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 sm:mt-32 pt-16 border-t border-sand space-y-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-espresso tracking-tight">
              You may also like
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* =================================================================== */}
      {/* MOBILE STICKY ACTION BAR                                            */}
      {/* =================================================================== */}
      {showMobileBar && !isAllSoldOut && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur-xs border-t border-sand px-4 py-3 lg:hidden flex items-center justify-between gap-4 animate-fadeIn"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider text-espresso/60 block font-medium">
              {selectedSize ? `Size ${selectedSize}` : 'Select size'}
            </span>
            <span className="text-base font-medium text-espresso">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 max-w-[200px] min-h-[44px] py-2.5 px-4 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-espresso/90 active:bg-espresso-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
          >
            {isAdded ? 'Added' : 'Add to cart'}
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch product data
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['storefrontProduct', slug],
    queryFn: () => getStorefrontProductBySlug(slug!),
    enabled: Boolean(slug),
    retry: 1,
  });

  // Loading Skeleton State (No layout shift)
  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="h-4 w-48 bg-sand/30 rounded-[2px] mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="aspect-4/5 w-full bg-sand/30 rounded-[4px] border border-sand animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-3 w-20 bg-sand/40 rounded-[2px] animate-pulse" />
            <div className="h-10 w-3/4 bg-sand/40 rounded-[2px] animate-pulse" />
            <div className="h-6 w-24 bg-sand/40 rounded-[2px] animate-pulse" />
            <div className="h-px bg-sand w-full" />
            <div className="h-12 w-full bg-sand/20 rounded-[10px] animate-pulse" />
            <div className="h-12 w-full bg-sand/30 rounded-[10px] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found / Error State
  if (isError || !product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest text-camel font-medium block">
            Mode Street
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso leading-tight">
            Piece not found
          </h1>

          <p className="text-sm text-espresso/70 leading-relaxed font-normal">
            The piece you are looking for has been moved or is currently unavailable.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-espresso/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
            >
              Browse collection
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] border border-sand text-espresso text-xs uppercase tracking-wider font-medium hover:bg-sand/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProductView key={product.id} product={product} />;
}

export default ProductPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/index.js';
import { formatCurrency } from '../../lib/utils.js';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Sort images by position ascending
  const sortedImages = product.images && product.images.length > 0
    ? [...product.images].sort((a, b) => a.position - b.position)
    : [];

  const primaryImage = sortedImages[0]?.url;
  const secondaryImage = sortedImages[1]?.url;

  // Sold out if variants exist and every variant has 0 stock
  const isSoldOut =
    Boolean(product.variants && product.variants.length > 0) &&
    product.variants!.every((v) => v.stock <= 0);

  return (
    <Link
      to={`/product/${encodeURIComponent(product.slug)}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-[4px]"
      aria-label={`${product.name} - ${formatCurrency(product.price)}`}
    >
      {/* Image frame - 4:5 aspect ratio */}
      <div className="relative aspect-4/5 w-full bg-sand/30 overflow-hidden rounded-[4px] border border-sand">
        {primaryImage && !imageError ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none ${
                secondaryImage ? 'group-hover:opacity-0 transition-opacity duration-300' : ''
              }`}
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-espresso/40 p-4 text-center">
            <span className="font-serif text-2xl font-light">Mode Street</span>
          </div>
        )}

        {/* Sold out label */}
        {isSoldOut && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 bg-espresso text-cream text-[10px] uppercase tracking-widest font-medium rounded-[2px]">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Product metadata */}
      <div className="pt-3 space-y-1">
        {product.category && (
          <p className="text-[11px] uppercase tracking-wider text-espresso/60 font-medium">
            {product.category.name}
          </p>
        )}
        <h3 className="font-serif text-base sm:text-lg font-normal text-espresso leading-snug group-hover:text-camel transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-espresso font-medium">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}

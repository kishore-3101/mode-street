import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStorefrontCategories } from '../../api/storefront.js';

export function Footer() {
  const { data: categories = [] } = useQuery({
    queryKey: ['storefrontCategories'],
    queryFn: getStorefrontCategories,
  });

  return (
    <footer className="bg-espresso text-cream border-t border-espresso">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
              aria-label="Mode Street Home"
            >
              <img
                src="/logo-light.png"
                alt="Mode Street"
                className="w-40 sm:w-48 h-auto object-contain max-h-14"
              />
            </Link>
            <p className="font-serif italic text-cream/75 text-base sm:text-lg">
              Wear your story.
            </p>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-medium text-camel">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                >
                  All Collections
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                    className="hover:text-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin shortcut (quiet and minimal) */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-medium text-camel">
              Studio
            </h3>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <Link
                  to="/admin/login"
                  className="hover:text-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-16 pt-8 border-t border-sand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-cream/60">
          <p>© 2026 ModeStreet.com</p>
          <p className="font-serif text-cream/40 italic">
            Calm, minimal, enduring.
          </p>
        </div>
      </div>
    </footer>
  );
}

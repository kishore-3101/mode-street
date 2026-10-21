import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStorefrontCategories } from '../../api/storefront.js';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';
const linkClass = `hover:text-cream transition-colors ${focusRing}`;

// ---- Dummy business details (replace with real ones) ----
const CONTACT = {
  addressLines: ['24, Nungambakkam High Road', 'Nungambakkam, Chennai', 'Tamil Nadu 600034, India'],
  mapUrl: 'https://maps.google.com/?q=Nungambakkam+High+Road+Chennai',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  email: 'hello@modestreet.com',
  hours: 'Mon – Sat, 10:00 AM – 8:00 PM',
};

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/modestreet',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z',
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/modestreet',
    path: 'M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.8v8h3.2Z',
  },
];

const HELP_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping & Delivery', to: '/shipping' },
  { label: 'Returns & Exchanges', to: '/returns' },
  { label: 'Size Guide', to: '/size-guide' },
  { label: 'FAQs', to: '/faq' },
];

const COMPANY_LINKS = [
  { label: 'Our Story', to: '/about' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
];

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'mt-0.5 shrink-0 text-camel',
};

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs uppercase tracking-widest font-medium text-camel">
      {children}
    </h3>
  );
}

export function Footer() {
  const { data: categories = [] } = useQuery({
    queryKey: ['storefrontCategories'],
    queryFn: getStorefrontCategories,
  });

  return (
    <footer className="bg-espresso text-cream border-t border-espresso">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 lg:gap-x-10">
          {/* Brand, tagline & socials */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-3">
            <Link
              to="/"
              className={`inline-block -ml-2 -mt-4 -mb-3 ${focusRing}`}
              aria-label="Mode Street Home"
            >
              <img
                src="/logo-light.png"
                alt="Mode Street"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain object-left"
              />
            </Link>

            <p className="text-sm text-cream/60 leading-relaxed max-w-sm">
              Thoughtfully made essentials in calm, timeless silhouettes — designed to be worn
              often and kept for years.
            </p>

            <ul className="flex items-center gap-3 pt-2">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className={`flex h-10 w-10 items-center justify-center border border-cream/20 rounded-full text-cream/80 hover:text-cream hover:border-camel hover:bg-camel/10 transition-colors ${focusRing}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop column (from database) */}
          <div className="lg:col-span-2 space-y-4">
            <ColumnHeading>Shop</ColumnHeading>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/shop" className={linkClass}>
                  All Collections
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                    className={linkClass}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & company */}
          <div className="lg:col-span-3 space-y-4">
            <ColumnHeading>Customer Care</ColumnHeading>
            <ul className="space-y-2.5 text-sm text-cream/80">
              {HELP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit & contact */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <ColumnHeading>Visit &amp; Contact</ColumnHeading>
            <ul className="space-y-4 text-sm text-cream/80">
              <li className="flex gap-3">
                <svg {...iconProps}>
                  <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z" />
                  <circle cx="12" cy="9.500" r="2.500" />
                </svg>
                <div>
                  <address className="not-italic leading-relaxed">
                    {CONTACT.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={CONTACT.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block mt-1.5 text-camel hover:text-cream underline underline-offset-4 decoration-camel/40 transition-colors ${focusRing}`}
                  >
                    Get directions
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <svg {...iconProps}>
                  <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                </svg>
                <a href={CONTACT.phoneHref} className={linkClass}>
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <svg {...iconProps}>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <a href={`mailto:${CONTACT.email}`} className={`${linkClass} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <svg {...iconProps}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-8 border-t border-sand/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-cream/60">
          <p>© 2026 ModeStreet.com. All rights reserved.</p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {COMPANY_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="font-serif text-cream/40 italic">Calm, minimal, enduring.</p>
        </div>
      </div>
    </footer>
  );
}

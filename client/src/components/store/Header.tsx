import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStorefrontCategories } from '../../api/storefront.js';
import { useCart } from '../../hooks/useCart.js';
import logoImg from '../../assets/logo.png';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery({
    queryKey: ['storefrontCategories'],
    queryFn: getStorefrontCategories,
  });

  const visibleCategories = categories.slice(0, 5);
  const overflowCategories = categories.slice(5);

  // Track page scroll to toggle hairline border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search, mobile drawer and dropdown when location changes
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }

  // Handle Escape key to close search or drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (moreOpen) setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, mobileMenuOpen, moreOpen]);

  // Focus input when search bar opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

  // Lock scroll and trap focus when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

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

      window.addEventListener('keydown', handleTabKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleTabKey);
      };
    }
    document.body.style.overflow = '';
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const isCurrentCategory = (slug: string) => {
    const params = new URLSearchParams(location.search);
    return location.pathname === '/shop' && params.get('category') === slug;
  };

  const isShopActive = location.pathname === '/shop' && !location.search;

  return (
    <header
      className={`sticky top-0 z-40 bg-cream transition-colors duration-200 ${
        isScrolled ? 'border-b border-sand' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu button (below lg) */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 -ml-2 text-espresso hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Logo (left on desktop, center-ish on mobile) */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
            aria-label="Mode Street Home"
          >
            <img
              src={logoImg}
              alt="Mode Street"
              className="w-36 sm:w-44 h-auto object-contain max-h-12"
            />
          </Link>
        </div>

        {/* Center Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-espresso"
          aria-label="Main Navigation"
        >
          <Link
            to="/shop"
            className={`py-1 transition-colors hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded ${
              isShopActive ? 'border-b border-espresso' : 'border-b border-transparent'
            }`}
          >
            Shop
          </Link>

          {visibleCategories.map((category) => {
            const active = isCurrentCategory(category.slug);
            return (
              <Link
                key={category.id}
                to={`/shop?category=${encodeURIComponent(category.slug)}`}
                className={`py-1 transition-colors hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded ${
                  active ? 'border-b border-espresso' : 'border-b border-transparent'
                }`}
              >
                {category.name}
              </Link>
            );
          })}

          {/* More categories disclosure */}
          {overflowCategories.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className="py-1 inline-flex items-center gap-1 transition-colors hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
                aria-expanded={moreOpen}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-cream border border-sand shadow-sm py-2 z-50 rounded-[4px]"
                  onMouseLeave={() => setMoreOpen(false)}
                >
                  {overflowCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                      className="block px-4 py-2 text-xs text-espresso hover:bg-sand/30 hover:text-camel transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right side icons: Search and Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Toggle Icon */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 text-espresso hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Search catalog"
            aria-expanded={searchOpen}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 text-espresso hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Shopping cart with ${count} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-espresso text-cream text-[10px] font-medium flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Full-width Search Bar (slides under header) */}
      {searchOpen && (
        <div
          ref={searchContainerRef}
          className="border-t border-b border-sand bg-cream px-4 sm:px-6 lg:px-8 py-4 animate-fadeIn"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-[1280px] mx-auto flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-espresso/60 shrink-0" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or style..."
              className="w-full bg-transparent text-sm text-espresso placeholder:text-espresso/50 focus:outline-none font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-espresso/60 hover:text-espresso p-1 min-h-[44px] flex items-center"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-espresso/70 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer (Left slide-over below lg) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-espresso/40 transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div
            ref={drawerRef}
            className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-cream border-r border-sand shadow-lg flex flex-col justify-between p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
          >
            <div className="space-y-6">
              {/* Drawer Top Row */}
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <img
                  src={logoImg}
                  alt="Mode Street"
                  className="w-28 h-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-espresso hover:text-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col space-y-1 text-sm tracking-wider uppercase font-medium">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-2 border-b border-sand/40 hover:text-camel transition-colors min-h-[44px] flex items-center ${
                    isShopActive ? 'border-espresso font-semibold' : ''
                  }`}
                >
                  Shop All
                </Link>

                {categories.map((category) => {
                  const active = isCurrentCategory(category.slug);
                  return (
                    <Link
                      key={category.id}
                      to={`/shop?category=${encodeURIComponent(category.slug)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-3 px-2 border-b border-sand/40 hover:text-camel transition-colors min-h-[44px] flex items-center ${
                        active ? 'border-espresso font-semibold' : ''
                      }`}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom info */}
            <div className="pt-6 border-t border-sand text-xs text-espresso/70 space-y-2">
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-espresso hover:text-camel"
              >
                <span>Shopping Cart</span>
                <span className="font-semibold">({count})</span>
              </Link>
              <p className="font-serif italic text-espresso/80 pt-2">
                Wear your story.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

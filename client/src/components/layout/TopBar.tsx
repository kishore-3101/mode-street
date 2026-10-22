import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import navbarLogo from '../../assets/navbar-logo.png';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-cream/90 backdrop-blur-md border-b border-sand">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-2 -ml-2 text-espresso hover:bg-sand/30 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link
          to="/admin/products"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
          aria-label="Mode Street Admin"
        >
          <img src={navbarLogo} alt="Mode Street" className="h-7 sm:h-8 w-auto object-contain" />
        </Link>
      </div>

      <span className="text-[10px] font-sans uppercase tracking-widest bg-sand/40 text-espresso/80 font-bold px-2 py-0.5 rounded">
        Admin
      </span>
    </header>
  );
}

import { Menu } from 'lucide-react';
import logoImg from '../../assets/logo.png';

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

        <div className="flex items-center gap-2">
          <div className="bg-cream-surface rounded-md p-1 border border-sand shadow-2xs h-8 flex items-center">
            <img src={logoImg} alt="Mode Street" className="h-6 w-auto object-contain" />
          </div>
          <span className="font-serif font-bold text-lg text-espresso tracking-tight">
            Mode Street
          </span>
        </div>
      </div>

      <span className="text-[10px] font-sans uppercase tracking-widest bg-sand/40 text-espresso/80 font-bold px-2 py-0.5 rounded">
        Admin
      </span>
    </header>
  );
}

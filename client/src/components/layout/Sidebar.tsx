import { NavLink } from 'react-router-dom';
import { Shirt, Layers, Boxes, ShoppingCart, LogOut, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import logoImg from '../../assets/logo.png';
import { cn } from '../../lib/utils.js';

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const { admin, logout } = useAuth();

  const navItems = [
    {
      to: '/admin/products',
      label: 'Products',
      icon: Shirt,
    },
    {
      to: '/admin/categories',
      label: 'Categories',
      icon: Layers,
    },
    {
      to: '/admin/inventory',
      label: 'Inventory',
      icon: Boxes,
    },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: 'Soon',
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-espresso text-cream flex flex-col justify-between shrink-0 h-full border-r border-espresso-light',
        className
      )}
    >
      <div>
        {/* Brand Header with Logo on Cream Plate */}
        <div className="p-5 border-b border-white/10">
          <NavLink
            to="/admin/products"
            onClick={onNavigate}
            className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-lg"
          >
            <div className="bg-cream rounded-lg p-2.5 shadow-xs flex items-center justify-center transition-transform duration-150 group-hover:scale-[1.02]">
              <img
                src={logoImg}
                alt="Mode Street"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-sand-light/80">
                Admin Console
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel',
                    isActive
                      ? 'bg-camel/20 text-cream border-l-4 border-camel font-semibold pl-2.5'
                      : 'text-sand-light/80 hover:bg-white/5 hover:text-cream'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-camel" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-sans uppercase tracking-wider bg-camel/30 text-sand-light px-1.5 py-0.5 rounded font-semibold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & footer */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <NavLink
          to="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-sand-light/70 hover:text-cream hover:bg-white/5 transition-colors"
        >
          <span>View Storefront</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </NavLink>

        <div className="px-3 py-2 bg-white/5 rounded-lg flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="text-[11px] uppercase tracking-wider text-sand-light/60 font-semibold">
              Logged in as
            </p>
            <p className="text-xs text-cream truncate font-mono">
              {admin?.email || 'admin@modestreet.com'}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="p-1.5 text-sand-light/70 hover:text-danger hover:bg-white/10 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

import { NavLink } from 'react-router-dom';
import { Shirt, Layers, Boxes, ShoppingCart, LogOut, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { cn } from '../../lib/utils.js';

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof Shirt;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Catalogue',
    items: [
      { to: '/admin/products', label: 'Products', icon: Shirt },
      { to: '/admin/categories', label: 'Categories', icon: Layers },
      { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Sales',
    items: [{ to: '/admin/orders', label: 'Orders', icon: ShoppingCart }],
  },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel';

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const { admin, logout } = useAuth();
  const initial = (admin?.email?.[0] ?? 'A').toUpperCase();

  return (
    <aside
      className={cn('flex h-full w-64 shrink-0 flex-col bg-espresso text-cream', className)}
    >
      {/* Brand */}
      {/* Brand */}
      <div className="px-6 pb-5 pt-7">
        <NavLink
          to="/admin/products"
          onClick={onNavigate}
          className={cn('mx-auto block w-44 rounded', focusRing)}
        >
          <img
            src="/logo-light.png"
            alt="Mode Street"
            className="h-auto w-full object-contain"
          />
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-4" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-2.5 flex items-center gap-3 px-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cream/40">
                {group.label}
              </p>
              <span className="h-px flex-1 bg-cream/10" />
            </div>

            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] transition-colors',
                          focusRing,
                          isActive
                            ? 'bg-cream/[0.08] font-medium text-cream'
                            : 'text-cream/60 hover:bg-cream/[0.04] hover:text-cream'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active marker, flush with the sidebar edge */}
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="absolute -left-4 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-camel"
                            />
                          )}
                          <Icon
                            className={cn(
                              'h-[18px] w-[18px] shrink-0 transition-colors',
                              isActive ? 'text-sand' : 'text-cream/50 group-hover:text-cream/80'
                            )}
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                          <span className="flex-1">{item.label}</span>
                          {'badge' in item && item.badge && (
                            <span className="text-[10px] uppercase tracking-[0.14em] text-cream/35">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5 pt-4">
        <NavLink
          to="/"
          target="_blank"
          rel="noreferrer"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-cream/60 transition-colors hover:bg-cream/[0.04] hover:text-cream',
            focusRing
          )}
        >
          <span className="flex-1">View storefront</span>
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </NavLink>

        <div className="mt-3 flex items-center gap-3 border-t border-cream/10 px-3 pt-4">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-camel text-sm font-semibold text-espresso"
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-cream/90">{admin?.email}</p>
            <p className="text-[11px] text-cream/40">Administrator</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className={cn(
              'cursor-pointer rounded-md p-2 text-cream/50 transition-colors hover:bg-cream/[0.06] hover:text-cream',
              focusRing
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
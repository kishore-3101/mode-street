import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar.js';
import { TopBar } from './TopBar.js';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row font-sans">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile TopBar */}
      <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            className="fixed inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-espresso shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 p-2 text-sand-light/70 hover:text-cream rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} className="w-full h-full border-r-0" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

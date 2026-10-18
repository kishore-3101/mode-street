import { Link } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { Button } from '../components/ui/Button.js';

export function StorefrontPlaceholder() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-between p-6 sm:p-12 text-center selection:bg-camel/30">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b border-sand/60 pb-6">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-lg tracking-wider text-espresso">
            Mode Street
          </span>
        </div>
        <Link to="/admin">
          <Button variant="secondary" size="sm" className="gap-2">
            <Shield className="w-3.5 h-3.5 text-camel" />
            Admin Portal
          </Button>
        </Link>
      </header>

      {/* Main Hero Card */}
      <main className="my-auto py-12 flex flex-col items-center max-w-lg">
        {/* Brand Logo Presentation */}
        <div className="bg-cream-surface p-6 rounded-2xl border border-sand shadow-sm mb-8 transition-transform duration-200 hover:scale-[1.02]">
          <img
            src={logoImg}
            alt="Mode Street - Wear Your Story"
            className="w-48 sm:w-56 h-auto object-contain mx-auto"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-camel/15 border border-camel/30 text-xs font-semibold uppercase tracking-widest text-camel-dark mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Fashion E-Commerce</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-espresso mb-4 leading-tight">
          Storefront coming soon.
        </h1>

        <p className="text-sm sm:text-base text-espresso/70 leading-relaxed max-w-md mb-8">
          We are currently crafting a refined shopping experience. The store catalog and order management are actively maintained in the back-office.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/admin" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto shadow-sm">
              Open Admin Console
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl border-t border-sand/60 pt-6 text-xs text-espresso/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Mode Street. All rights reserved.</p>
        <p className="font-serif italic">Wear your story with elegance.</p>
      </footer>
    </div>
  );
}

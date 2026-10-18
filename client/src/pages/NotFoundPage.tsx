import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/index.js';
import logoImg from '../assets/logo.png';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-cream-surface border border-sand rounded-2xl p-8 max-w-md w-full shadow-sm flex flex-col items-center">
        <div className="p-3 bg-cream rounded-xl border border-sand/60 mb-4 shadow-2xs">
          <img src={logoImg} alt="Mode Street" className="h-10 w-auto object-contain" />
        </div>

        <span className="font-serif text-6xl font-bold text-camel/80 mb-2">404</span>

        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-espresso/70 leading-relaxed mb-6">
          The page or garment collection you are looking for does not exist or may have been relocated.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link to="/admin/products" className="w-full">
            <Button variant="primary" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full">
            <Button variant="secondary" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Storefront
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

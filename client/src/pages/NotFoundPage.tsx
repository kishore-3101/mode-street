import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/index.js';
import navbarLogo from '../assets/navbar-logo.png';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-cream-surface border border-sand rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-sm flex flex-col items-center">
        <Link
          to="/"
          className="mb-6 inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel"
          aria-label="Mode Street Home"
        >
          <img src={navbarLogo} alt="Mode Street" className="h-9 sm:h-10 w-auto object-contain" />
        </Link>

        <span className="font-serif text-6xl font-bold text-camel/80 mb-2">404</span>

        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-espresso/70 leading-relaxed mb-6">
          The page or garment collection you are looking for does not exist or may have been relocated.
        </p>

        <Link to="/" className="w-full">
          <Button variant="primary" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go to Store
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

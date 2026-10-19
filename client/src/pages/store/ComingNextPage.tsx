import { Link, useLocation } from 'react-router-dom';

interface ComingNextPageProps {
  title?: string;
  description?: string;
}

export function ComingNextPage({ title, description }: ComingNextPageProps) {
  const location = useLocation();

  const getPageInfo = () => {
    if (title && description) {
      return { pageTitle: title, pageDescription: description };
    }

    const path = location.pathname;
    if (path.startsWith('/shop')) {
      return {
        pageTitle: 'Shop the collection',
        pageDescription: 'The catalog experience is being crafted with deliberate care.',
      };
    }
    if (path.startsWith('/cart')) {
      return {
        pageTitle: 'Shopping bag',
        pageDescription: 'Bag review and checkout will be available shortly.',
      };
    }
    if (path.startsWith('/checkout')) {
      return {
        pageTitle: 'Checkout',
        pageDescription: 'The checkout experience is currently being prepared for private release.',
      };
    }

    return {
      pageTitle: 'Coming next',
      pageDescription: 'This section of Mode Street is currently under development.',
    };
  };

  const { pageTitle, pageDescription } = getPageInfo();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
      <div className="max-w-md space-y-6">
        <span className="text-xs uppercase tracking-widest text-camel font-medium block">
          Mode Street
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-espresso leading-tight">
          {pageTitle}
        </h1>

        <p className="text-sm sm:text-base text-espresso/70 leading-relaxed font-normal">
          {pageDescription}
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-espresso/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer"
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}

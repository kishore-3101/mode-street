import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export interface PageShellProps {
  title: string;
  intro?: string;
  lastUpdated?: string;
  breadcrumbLabel?: string;
  documentTitle?: string;
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  children: ReactNode;
}

export function PageShell({
  title,
  intro,
  lastUpdated,
  breadcrumbLabel,
  documentTitle,
  maxWidth = 'default',
  children,
}: PageShellProps) {
  // Document title
  useDocumentTitle(documentTitle ?? `${title} | ModeStreet`);

  // Scroll to top on mount / route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const maxWidthClass = {
    narrow: 'max-w-2xl',
    default: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-[1280px]',
  }[maxWidth];

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <div className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className={`${maxWidthClass} mx-auto`}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-1.5 text-xs text-espresso/60 flex-wrap">
            <li>
              <Link
                to="/"
                className={`hover:text-espresso transition-colors ${focusRing}`}
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-espresso/35">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="text-espresso font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {breadcrumbLabel ?? title}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="border-b border-sand/70 pb-8 sm:pb-10 mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso tracking-tight leading-tight">
            {title}
          </h1>

          {intro && (
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-espresso/70 leading-relaxed max-w-2xl">
              {intro}
            </p>
          )}

          {lastUpdated && (
            <p className="mt-3 text-xs uppercase tracking-wider text-espresso/50 font-medium font-sans">
              Last updated: {lastUpdated}
            </p>
          )}
        </header>

        {/* Page Main Content */}
        <div className="text-espresso/85 leading-relaxed text-[15px] sm:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

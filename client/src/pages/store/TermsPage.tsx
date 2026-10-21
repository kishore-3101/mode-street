import { Link } from 'react-router-dom';
import { PageShell } from '../../components/store/PageShell.js';
import { TERMS_SECTIONS } from '../../data/staticPagesData.js';
import { ListFilter } from 'lucide-react';

export function TermsPage() {
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <PageShell
      title="Terms of Service"
      intro="Please read these terms and conditions carefully before exploring or placing an order with Mode Street."
      lastUpdated="October 2026"
      breadcrumbLabel="Terms of Service"
      maxWidth="wide"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Table of Contents - Desktop Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-cream-surface rounded-xl border border-sand/70 p-5 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-sand/60 text-xs font-semibold uppercase tracking-wider text-espresso/70">
            <ListFilter className="w-4 h-4 text-camel" />
            <span>Table of Contents</span>
          </div>

          <nav aria-label="Table of contents" className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1 text-sm">
            {TERMS_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block py-1 px-2 rounded text-espresso/70 hover:text-espresso hover:bg-sand/30 transition-colors text-[13px] ${focusRing}`}
              >
                <span className="text-camel font-mono mr-1.5">{section.number}.</span>
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Table of Contents - Mobile Collapsible */}
        <details className="lg:hidden col-span-1 bg-cream-surface rounded-xl border border-sand/70 p-4 group">
          <summary className={`flex items-center justify-between cursor-pointer text-sm font-semibold text-espresso select-none ${focusRing}`}>
            <span className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-camel" />
              <span>Table of Contents ({TERMS_SECTIONS.length} sections)</span>
            </span>
            <span className="text-xs text-camel group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <nav aria-label="Mobile table of contents" className="pt-4 mt-3 border-t border-sand/50 space-y-2 text-sm">
            {TERMS_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block py-1 text-espresso/75 hover:text-espresso text-[13px] ${focusRing}`}
              >
                <span className="text-camel font-mono mr-1.5">{section.number}.</span>
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </details>

        {/* Content Column */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {TERMS_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 border-b border-sand/40 pb-8 last:border-b-0"
            >
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-espresso tracking-tight mb-3">
                <span className="text-camel mr-2 font-mono text-lg">{section.number}.</span>
                {section.title}
              </h2>

              <div className="space-y-3 text-espresso/80 text-[15px] sm:text-base leading-relaxed">
                {section.content.map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}

                {section.link && (
                  <div className="pt-2">
                    <Link
                      to={section.link.to}
                      className={`inline-flex items-center text-sm font-medium text-camel hover:text-espresso transition-colors underline underline-offset-4 decoration-camel/50 ${focusRing}`}
                    >
                      {section.link.text}
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

import { Link } from 'react-router-dom';
import { PageShell } from '../../components/store/PageShell.js';
import { TERMS_SECTIONS } from '../../data/staticPagesData.js';

export function TermsPage() {
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <PageShell
      title="Terms of Service"
      intro="Please read these terms and conditions carefully before exploring or placing an order with Mode Street."
      lastUpdated="October 2026"
      breadcrumbLabel="Terms of Service"
      maxWidth="default"
    >
      <div className="space-y-10 sm:space-y-12">
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
    </PageShell>
  );
}

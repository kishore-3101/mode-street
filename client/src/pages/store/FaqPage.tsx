import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../../components/store/PageShell.js';
import { FAQ_DATA } from '../../data/staticPagesData.js';
import { Search, X, ChevronDown, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';

export function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'order-modify': true, // Open first question by default
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  // Live filter across categories, questions and answers
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQ_DATA;

    return FAQ_DATA.map((group) => {
      const matchingItems = group.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          group.category.toLowerCase().includes(query)
      );
      return {
        ...group,
        items: matchingItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const totalMatching = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [filteredGroups]);

  return (
    <PageShell
      title="Frequently Asked Questions"
      intro="Common inquiries about our garment construction, sizing, payment methods, delivery schedules, and return policy."
      lastUpdated="October 2026"
      breadcrumbLabel="FAQs"
      maxWidth="wide"
    >
      <div className="space-y-10 sm:space-y-14">
        {/* Live Search Input Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-espresso/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. shipping, refund, sizing, cotton)..."
              aria-label="Search FAQs"
              className={`w-full pl-10 pr-10 py-3 bg-cream-surface rounded-xl text-sm text-espresso placeholder:text-espresso/40 border border-sand/80 shadow-2xs transition-colors focus:border-espresso ${focusRing}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="mt-2 text-xs text-espresso/60 text-center">
              Found <strong>{totalMatching}</strong> {totalMatching === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="py-12 px-6 rounded-2xl bg-cream-surface border border-sand/70 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-sand/30 flex items-center justify-center mx-auto text-camel">
              <HelpCircle className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-espresso">
              No matching answers found
            </h2>

            <p className="text-sm text-espresso/70 leading-relaxed">
              We couldn't find any questions matching "{searchQuery}". Try different keywords or contact our Chennai atelier directly.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`px-4 py-2 rounded-lg border border-sand text-xs font-semibold uppercase tracking-wider text-espresso hover:bg-sand/20 transition-colors cursor-pointer ${focusRing}`}
              >
                Clear Search
              </button>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg bg-espresso text-cream text-xs font-semibold uppercase tracking-wider hover:bg-espresso-light transition-colors ${focusRing}`}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}

        {/* Grouped Accordions */}
        {filteredGroups.map((group) => (
          <section key={group.category} aria-labelledby={`faq-cat-${group.category.replace(/\s+/g, '-').toLowerCase()}`}>
            <h2
              id={`faq-cat-${group.category.replace(/\s+/g, '-').toLowerCase()}`}
              className="font-serif text-xl sm:text-2xl font-semibold text-espresso tracking-tight pb-3 mb-4 border-b border-sand/60"
            >
              {group.category}
            </h2>

            <div className="space-y-3">
              {group.items.map((item) => {
                const isOpen = Boolean(openItems[item.id] || searchQuery.trim().length > 0);
                const buttonId = `faq-btn-${item.id}`;
                const panelId = `faq-panel-${item.id}`;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-sand/70 bg-cream-surface overflow-hidden shadow-2xs transition-colors"
                  >
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-medium text-espresso hover:text-camel transition-colors cursor-pointer select-none ${focusRing}`}
                    >
                      <span className="text-sm sm:text-base font-medium leading-snug">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-camel shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="px-5 sm:px-6 pb-5 pt-1 text-sm text-espresso/75 leading-relaxed border-t border-sand/30"
                      >
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Still Have Questions CTA */}
        <section aria-labelledby="cta-help-heading" className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-camel">
                <MessageSquare className="w-4 h-4" />
                <span>Atelier Assistance</span>
              </div>
              <h2 id="cta-help-heading" className="font-serif text-2xl sm:text-3xl font-semibold text-espresso tracking-tight">
                Still have questions?
              </h2>
              <p className="text-sm text-espresso/70 max-w-lg leading-relaxed">
                Can’t find what you’re looking for? Our Chennai customer care team is available Monday through Saturday to provide tailored guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors ${focusRing}`}
              >
                <span>Write to Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

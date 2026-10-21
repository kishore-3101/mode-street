import { useState } from 'react';
import { PageShell } from '../../components/store/PageShell.js';
import { SIZE_CATEGORIES, MEASURING_TIPS, type SizeCategory } from '../../data/staticPagesData.js';
import { Ruler, Sparkles, Check } from 'lucide-react';

export function SizeGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<SizeCategory['id']>('shirts');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const activeCategory = SIZE_CATEGORIES.find((cat) => cat.id === selectedCategory) ?? SIZE_CATEGORIES[0];
  const activeData = unit === 'cm' ? activeCategory.dataCm : activeCategory.dataInches;

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <PageShell
      title="Size Guide"
      intro="Our silhouettes are cut with mindful ease. Use these body and garment measurement charts to find your ideal Mode Street proportions."
      lastUpdated="October 2026"
      breadcrumbLabel="Size Guide"
      maxWidth="wide"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* Controls: Category Segmented Control & Units Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sand/60">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-1.5 p-1 bg-cream-surface rounded-xl border border-sand/70 self-start sm:self-auto overflow-x-auto scrollbar-none"
            role="tablist"
            aria-label="Garment categories"
          >
            {SIZE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-espresso text-cream shadow-2xs'
                      : 'text-espresso/70 hover:text-espresso hover:bg-sand/30'
                  } ${focusRing}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Unit Switcher (CM / IN) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-espresso/60">
              Units:
            </span>
            <div className="flex items-center p-1 bg-cream-surface rounded-xl border border-sand/70">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                aria-pressed={unit === 'cm'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  unit === 'cm'
                    ? 'bg-espresso text-cream shadow-2xs'
                    : 'text-espresso/70 hover:text-espresso'
                } ${focusRing}`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                aria-pressed={unit === 'in'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  unit === 'in'
                    ? 'bg-espresso text-cream shadow-2xs'
                    : 'text-espresso/70 hover:text-espresso'
                } ${focusRing}`}
              >
                INCHES
              </button>
            </div>
          </div>
        </div>

        {/* Fit Note Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cream-surface border border-sand/70 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center text-camel shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-espresso block mb-0.5">
              Silhouette &amp; Fit Note: {activeCategory.label}
            </span>
            <p className="text-sm text-espresso/80 leading-relaxed">
              {activeCategory.fitNote}
            </p>
          </div>
        </div>

        {/* Size Chart Table */}
        <section aria-labelledby="chart-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="chart-heading" className="font-serif text-xl sm:text-2xl font-semibold text-espresso">
              Garment Dimensions ({unit.toUpperCase()})
            </h2>
            <span className="text-xs text-espresso/60 font-mono hidden sm:inline-block">
              All measurements in {unit === 'cm' ? 'centimeters' : 'inches'}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-sand/70 bg-cream-surface shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-sand/70 bg-sand/15 text-xs uppercase tracking-wider text-espresso/70 font-semibold">
                    {activeCategory.columns.map((col, idx) => (
                      <th
                        key={String(col.key)}
                        scope="col"
                        className={`py-3.5 px-4 sm:px-6 ${idx === 0 ? 'font-bold text-espresso' : 'font-semibold text-center'}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/40">
                  {activeData.map((row) => (
                    <tr key={row.size} className="hover:bg-sand/10 transition-colors">
                      {activeCategory.columns.map((col, idx) => {
                        const val = row[col.key];
                        return (
                          <td
                            key={String(col.key)}
                            className={`py-4 px-4 sm:px-6 whitespace-nowrap ${
                              idx === 0
                                ? 'font-bold text-espresso bg-sand/10 sm:bg-transparent'
                                : 'text-center text-espresso/80 font-mono text-xs sm:text-sm'
                            }`}
                          >
                            {val ?? '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-espresso/60 italic pt-1">
            * Table measurements represent garment finished dimensions. Allow ±1.5 cm tolerance due to the nature of handcrafted artisanal weaving.
          </p>
        </section>

        {/* How to Measure Section */}
        <section aria-labelledby="measure-heading" className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-sand/50">
            <Ruler className="w-5 h-5 text-camel shrink-0" />
            <h2 id="measure-heading" className="font-serif text-2xl font-semibold text-espresso">
              How to Measure for Your Best Fit
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEASURING_TIPS.map((tip, idx) => (
              <div key={tip.title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-espresso text-cream font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-sm text-espresso uppercase tracking-wider">
                    {tip.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  {tip.instruction}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-sand/20 border border-sand/50 text-xs sm:text-sm text-espresso/80 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-camel/20 flex items-center justify-center text-camel shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <p className="leading-relaxed">
              <strong>Studio Pro Tip:</strong> For the most precise sizing, lay flat a well-fitting shirt or pair of trousers from your existing wardrobe and compare its flat dimensions directly to our charts above.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

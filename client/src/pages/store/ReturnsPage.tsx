import { Link } from 'react-router-dom';
import { PageShell } from '../../components/store/PageShell.js';
import { RETURN_STEPS, CONDITION_CHECKLIST } from '../../data/staticPagesData.js';
import { RotateCcw, Check, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';

export function ReturnsPage() {
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <PageShell
      title="Returns & Exchanges"
      intro="We design timeless garments made to last. If a piece does not feel completely right in fit or silhouette, our 14-day return process is straightforward and respectful of your time."
      lastUpdated="October 2026"
      breadcrumbLabel="Returns & Exchanges"
      maxWidth="wide"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* Step 1: 3-Step Visual Process */}
        <section aria-labelledby="steps-heading" className="space-y-6">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-camel shrink-0" />
            <h2 id="steps-heading" className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
              How Returns &amp; Exchanges Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {RETURN_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-7 relative flex flex-col justify-between shadow-2xs group hover:border-sand transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-camel">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-espresso/40">
                      Step {idx + 1} of 3
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-espresso mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-espresso/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sand/40 text-xs text-espresso/60 flex items-center justify-between">
                  <span>Phase {step.step}</span>
                  <span className="text-camel font-medium">ModeStreet Guarantee</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 2: Condition Checklist & Policy Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Condition Checklist */}
          <section className="lg:col-span-6 bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center text-camel">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-espresso">
                Condition Checklist
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-espresso/70">
              To be eligible for an exchange or full monetary refund, returned garments must meet these requirements upon inspection:
            </p>

            <ul className="space-y-3.5 pt-1">
              {CONDITION_CHECKLIST.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-espresso/85">
                  <div className="w-5 h-5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Non-Returnable Items & Exceptions */}
          <section className="lg:col-span-6 bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center text-danger">
                <AlertOctagon className="w-4 h-4 stroke-[2]" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-espresso">
                Non-Returnable Items
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-espresso/70">
              In accordance with hygiene standards and handcrafted craftsmanship rules, the following categories cannot be returned:
            </p>

            <div className="space-y-3 text-sm text-espresso/80">
              <div className="p-3.5 rounded-xl bg-sand/15 border border-sand/50 space-y-1">
                <span className="font-semibold text-espresso block text-xs uppercase tracking-wider">
                  1. Intimates &amp; Innerwear
                </span>
                <span className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  Boxers, undershirts, and base-layer essentials once the tamper-evident packaging seal has been unfastened.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-sand/15 border border-sand/50 space-y-1">
                <span className="font-semibold text-espresso block text-xs uppercase tracking-wider">
                  2. Custom Alterations &amp; Hemming
                </span>
                <span className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  Garments personalized or tailored with bespoke trouser length alterations upon customer request.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-sand/15 border border-sand/50 space-y-1">
                <span className="font-semibold text-espresso block text-xs uppercase tracking-wider">
                  3. Archive Final Sale
                </span>
                <span className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  Clearance archive pieces explicitly cataloged as "Final Sale" on the product detail page.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Step 3: Size Exchanges & How to Start */}
        <section className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/50 pb-5">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso">
                Free Size Exchanges
              </h2>
              <p className="text-xs sm:text-sm text-espresso/70 mt-1">
                Ordered a medium and need a large? We cover complimentary reverse pickup and re-shipment.
              </p>
            </div>

            <Link
              to="/size-guide"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-camel hover:text-espresso transition-colors ${focusRing}`}
            >
              <span>Consult Size Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-espresso/80">
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-semibold text-espresso">
                How to Start Your Return
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm text-espresso/75">
                Simply message us via our Contact page or email <strong>hello@modestreet.com</strong> with your order number (#MS-...) and reason for return. Our support staff will arrange courier pickup within 24 hours.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg font-semibold text-espresso">
                Refund Processing (5–7 Business Days)
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm text-espresso/75">
                Refunds are credited directly to your original payment instrument (Credit/Debit card, UPI, Net Banking) upon physical inspection at our atelier. Bank processing typically settles within 5–7 banking days.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-sand/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-espresso/70">
              <HelpCircle className="w-4 h-4 text-camel shrink-0" />
              <span>Have questions about an existing return request?</span>
            </div>

            <Link
              to="/contact"
              className={`inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors ${focusRing}`}
            >
              Initiate a Return
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

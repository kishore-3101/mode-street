import { Link } from 'react-router-dom';
import { PageShell } from '../../components/store/PageShell.js';
import { SHIPPING_OPTIONS } from '../../data/staticPagesData.js';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export function ShippingPage() {
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <PageShell
      title="Shipping & Delivery"
      intro="Reliable, carbon-conscious fulfillment across all of India. Every piece is carefully inspected, folded, and hand-packed at our Chennai atelier."
      lastUpdated="October 2026"
      breadcrumbLabel="Shipping & Delivery"
      maxWidth="wide"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* Section 1: Delivery Options Table */}
        <section aria-labelledby="delivery-rates-heading">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-camel shrink-0" />
            <h2 id="delivery-rates-heading" className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
              Delivery Options &amp; Rates
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-sand/70 bg-cream-surface shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-sand/70 bg-sand/15 text-xs uppercase tracking-wider text-espresso/70">
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Service</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Estimated Transit</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Fee</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Applicability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/40">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <tr key={opt.name} className="hover:bg-sand/10 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-medium text-espresso whitespace-nowrap">
                        {opt.name}
                        {opt.threshold && (
                          <span className="block text-xs text-camel-dark font-normal mt-0.5">
                            {opt.threshold}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-espresso/80 whitespace-nowrap">
                        {opt.duration}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-medium text-espresso whitespace-nowrap">
                        {opt.cost}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-xs text-espresso/70 max-w-xs leading-relaxed">
                        {opt.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2: Order Processing & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <section className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-7 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sand/30 flex items-center justify-center text-espresso">
              <Clock className="w-5 h-5 text-camel" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-espresso">
              Order Processing Time
            </h3>
            <p className="text-sm text-espresso/75 leading-relaxed">
              Orders are verified and tailored for dispatch within <strong>1–2 business days</strong> (Monday through Saturday, excluding public holidays).
            </p>
            <p className="text-sm text-espresso/70 leading-relaxed pt-1">
              To minimize plastic waste, garments are delicately enclosed in reusable 100% unbleached cotton dust bags inside FSC-certified recycled kraft boxes.
            </p>
          </section>

          <section className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-7 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sand/30 flex items-center justify-center text-espresso">
              <ShieldCheck className="w-5 h-5 text-camel" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-espresso">
              End-to-End Tracking
            </h3>
            <p className="text-sm text-espresso/75 leading-relaxed">
              The moment your parcel is picked up by our logistics partner (Blue Dart, Delhivery, or DTDC), an automated email and SMS notification is dispatched with your live tracking number.
            </p>
            <p className="text-sm text-espresso/70 leading-relaxed pt-1">
              You can monitor your shipment directly with the tracking link or through the carrier’s live portal.
            </p>
          </section>
        </div>

        {/* Section 3: Coverage, Delays & Address Changes */}
        <section className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-6 shadow-2xs">
          <h2 className="font-serif text-2xl font-semibold text-espresso tracking-tight">
            Shipping Guidelines &amp; Exceptions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 divide-y md:divide-y-0 md:divide-x divide-sand/50">
            {/* Nationwide Coverage */}
            <div className="space-y-2 md:pr-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso">
                <MapPin className="w-4 h-4 text-camel" />
                <span>Pan-India Coverage</span>
              </div>
              <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                We service over 19,000 pincodes across India, including remote regions and military addresses (APO/FPO). International express delivery to North America, the UK, Europe, and the Middle East will launch later this year.
              </p>
            </div>

            {/* Delays & Lost Parcels */}
            <div className="space-y-2 pt-5 md:pt-0 md:px-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso">
                <AlertCircle className="w-4 h-4 text-camel" />
                <span>Delayed or Lost Parcels</span>
              </div>
              <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                If your parcel experiences unexpected courier delays exceeding 48 hours past the estimated window, our customer care team will intervene directly. If a package is confirmed lost in transit, we issue an immediate replacement or full refund.
              </p>
            </div>

            {/* Address Corrections */}
            <div className="space-y-2 pt-5 md:pt-0 md:pl-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso">
                <Clock className="w-4 h-4 text-camel" />
                <span>Address Changes</span>
              </div>
              <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                Need to amend an address or pin code? Please contact us within <strong>2 hours</strong> of ordering. Once an airway bill (AWB) is generated and handed to the courier, in-transit address re-routing incurs a 24–48 hour delay.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-sand/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs sm:text-sm text-espresso/70">
              Have specific questions regarding an active delivery?
            </span>
            <Link
              to="/contact"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-camel hover:text-espresso transition-colors ${focusRing}`}
            >
              <span>Get in touch with support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

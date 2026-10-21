import { PageShell } from '../../components/store/PageShell.js';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';

export function ContactPage() {
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  return (
    <PageShell
      title="Contact Us"
      intro="We’re here to help with sizing guidance, order tracking, returns, or fabric advice. Our Chennai atelier team is at your service."
      breadcrumbLabel="Contact Us"
      maxWidth="wide"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {/* Left Card: Contact Details */}
        <div className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso tracking-tight">
                Atelier &amp; Studio
              </h2>
              <p className="mt-1 text-xs text-espresso/60 uppercase tracking-widest font-medium">
                Flagship Location • Chennai
              </p>
            </div>

            <ul className="space-y-4 text-sm text-espresso/85">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <address className="not-italic leading-relaxed font-sans text-espresso/90">
                    24, Nungambakkam High Road<br />
                    Nungambakkam, Chennai<br />
                    Tamil Nadu 600034, India
                  </address>
                  <a
                    href="https://maps.google.com/?q=Nungambakkam+High+Road+Chennai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold uppercase tracking-wider text-camel hover:text-espresso transition-colors underline underline-offset-4 decoration-camel/40 ${focusRing}`}
                  >
                    <span>Get directions</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3 pt-2 border-t border-sand/40">
                <Phone className="w-4 h-4 text-camel shrink-0" />
                <div>
                  <span className="text-xs text-espresso/60 block">Phone &amp; WhatsApp</span>
                  <a
                    href="tel:+919876543210"
                    className={`font-medium text-espresso hover:text-camel transition-colors ${focusRing}`}
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3 pt-2 border-t border-sand/40">
                <Mail className="w-4 h-4 text-camel shrink-0" />
                <div>
                  <span className="text-xs text-espresso/60 block">Email Inquiries</span>
                  <a
                    href="mailto:hello@modestreet.com"
                    className={`font-medium text-espresso hover:text-camel transition-colors ${focusRing}`}
                  >
                    hello@modestreet.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 pt-2 border-t border-sand/40">
                <Clock className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-espresso/60 block">Atelier Hours</span>
                  <span className="font-medium text-espresso">
                    Mon – Sat, 10:00 AM – 8:00 PM IST
                  </span>
                  <span className="block text-xs text-espresso/55 mt-0.5">
                    Closed on Sundays &amp; national holidays
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Card: Decorative Map */}
        <div className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 space-y-4 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso tracking-tight">
              Location
            </h2>
            <p className="mt-1 text-xs text-espresso/60 uppercase tracking-widest font-medium">
              Nungambakkam High Road
            </p>
          </div>

          <div className="h-56 sm:h-64 w-full rounded-xl bg-sand/20 border border-sand/50 relative overflow-hidden flex flex-col justify-between p-4 my-auto">
            {/* Geometric street line graphics */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full text-sand/40 stroke-current opacity-70 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0" y1="40" x2="100%" y2="70" strokeWidth="2.5" />
              <line x1="0" y1="120" x2="100%" y2="100" strokeWidth="2" />
              <line x1="80" y1="0" x2="120" y2="100%" strokeWidth="3" />
              <line x1="220" y1="0" x2="200" y2="100%" strokeWidth="2" />
              <line x1="320" y1="0" x2="360" y2="100%" strokeWidth="1.5" />
              <circle cx="210" cy="110" r="45" fill="none" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            {/* Pin badge */}
            <div className="relative z-10 self-center my-auto flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-espresso text-cream flex items-center justify-center shadow-md border-2 border-cream">
                <MapPin className="w-5 h-5 text-camel" />
              </div>
              <div className="mt-2 bg-cream/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-sand shadow-2xs text-xs font-semibold text-espresso">
                Mode Street Atelier
              </div>
            </div>

            {/* Coordinates caption */}
            <div className="relative z-10 flex items-center justify-between text-xs text-espresso/60 font-mono">
              <span>Nungambakkam High Rd</span>
              <span>13.0604° N, 80.2496° E</span>
            </div>
          </div>

          <p className="text-xs text-espresso/60 text-center leading-relaxed">
            Located in the heart of Nungambakkam, Chennai. Free visitor parking available on premises.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

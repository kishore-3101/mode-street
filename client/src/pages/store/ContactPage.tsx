import { useState, type FormEvent } from 'react';
import { PageShell } from '../../components/store/PageShell.js';
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded';

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your full name (minimum 2 characters).';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        newErrors.phone = 'Mobile number should be exactly 10 digits.';
      }
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a inquiry topic.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please share your query or message (minimum 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Fake submission success with no API call
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <PageShell
      title="Contact Us"
      intro="We’re here to help with sizing guidance, order tracking, returns, or fabric advice. Our Chennai atelier team is at your service."
      breadcrumbLabel="Contact Us"
      maxWidth="wide"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Contact Details + Decorative Map */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-espresso tracking-tight">
                Atelier & Studio
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

              <li className="flex items-center gap-3 pt-1 border-t border-sand/40">
                <Phone className="w-4 h-4 text-camel shrink-0" />
                <div>
                  <span className="text-xs text-espresso/60 block">Phone & WhatsApp</span>
                  <a
                    href="tel:+919876543210"
                    className={`font-medium text-espresso hover:text-camel transition-colors ${focusRing}`}
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3 pt-1 border-t border-sand/40">
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

              <li className="flex items-start gap-3 pt-1 border-t border-sand/40">
                <Clock className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-espresso/60 block">Atelier Hours</span>
                  <span className="font-medium text-espresso">
                    Mon – Sat, 10:00 AM – 8:00 PM IST
                  </span>
                  <span className="block text-xs text-espresso/55 mt-0.5">
                    Closed on Sundays & national holidays
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Decorative Map Placeholder (No external map embed) */}
          <div className="bg-cream-surface rounded-2xl border border-sand/70 p-5 space-y-3 relative overflow-hidden shadow-2xs">
            <div className="h-44 sm:h-52 w-full rounded-xl bg-sand/20 border border-sand/50 relative overflow-hidden flex flex-col justify-between p-4">
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
                <circle cx="210" cy="95" r="40" fill="none" strokeWidth="1" strokeDasharray="3 3" />
              </svg>

              {/* Pin badge */}
              <div className="relative z-10 self-center my-auto flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-espresso text-cream flex items-center justify-center shadow-md border-2 border-cream">
                  <MapPin className="w-5 h-5 text-camel" />
                </div>
                <div className="mt-2 bg-cream/95 backdrop-blur-xs px-3 py-1 rounded-full border border-sand shadow-2xs text-[11px] font-semibold text-espresso">
                  Mode Street Atelier
                </div>
              </div>

              {/* Coordinates caption */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-espresso/60 font-mono">
                <span>Nungambakkam High Rd</span>
                <span>13.0604° N, 80.2496° E</span>
              </div>
            </div>

            <p className="text-xs text-espresso/60 text-center leading-relaxed">
              Located in the heart of Nungambakkam, Chennai. Free visitor parking available on premises.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-cream-surface rounded-2xl border border-sand/70 p-6 sm:p-8 lg:p-10 shadow-2xs">
            {isSubmitted ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto border border-success/30">
                  <CheckCircle2 className="w-8 h-8 stroke-[1.75]" />
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
                  Thank You for Writing
                </h2>

                <p className="text-sm sm:text-base text-espresso/75 max-w-md mx-auto leading-relaxed">
                  We have received your message. Our team in Chennai will review your query and reply within 1 business day.
                </p>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors cursor-pointer ${focusRing}`}
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso tracking-tight">
                    Send a Message
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-espresso/70">
                    Fill out the form below and we will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-espresso"
                    >
                      Full Name <span className="text-danger" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g. Ananya Sundaram"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-cream/50 rounded-[10px] text-sm text-espresso border ${
                        errors.name ? 'border-danger focus:ring-danger' : 'border-sand focus:border-espresso'
                      } ${focusRing}`}
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-espresso"
                    >
                      Email Address <span className="text-danger" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="ananya@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-cream/50 rounded-[10px] text-sm text-espresso border ${
                        errors.email ? 'border-danger focus:ring-danger' : 'border-sand focus:border-espresso'
                      } ${focusRing}`}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-espresso"
                    >
                      Phone Number <span className="text-espresso/45 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="10-digit mobile number"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-cream/50 rounded-[10px] text-sm text-espresso border ${
                        errors.phone ? 'border-danger focus:ring-danger' : 'border-sand focus:border-espresso'
                      } ${focusRing}`}
                    />
                    {errors.phone && (
                      <p id="contact-phone-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold uppercase tracking-wider text-espresso"
                    >
                      Topic / Subject <span className="text-danger" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-cream/50 rounded-[10px] text-sm text-espresso border ${
                        errors.subject ? 'border-danger focus:ring-danger' : 'border-sand focus:border-espresso'
                      } ${focusRing}`}
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order issue or delivery status</option>
                      <option value="product">Product question or sizing advice</option>
                      <option value="returns">Returns & exchanges</option>
                      <option value="other">Bespoke styling or other inquiry</option>
                    </select>
                    {errors.subject && (
                      <p id="contact-subject-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-espresso"
                  >
                    Your Message <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Tell us how we can help you..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={`w-full px-3.5 py-2.5 bg-cream/50 rounded-[10px] text-sm text-espresso border ${
                      errors.message ? 'border-danger focus:ring-danger' : 'border-sand focus:border-espresso'
                    } ${focusRing}`}
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-[10px] bg-espresso text-cream text-xs uppercase tracking-wider font-semibold hover:bg-espresso-light active:bg-espresso-dark transition-colors cursor-pointer min-h-[46px] ${focusRing}`}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

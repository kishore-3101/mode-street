import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { INDIAN_STATES } from '../../types/index.js';
import { checkoutFormSchema, type CheckoutFormData } from '../../lib/checkout.js';

export type { CheckoutFormData };

const CHECKOUT_FORM_STORAGE_KEY = 'mode_street_checkout_draft';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData, isHoneypot: boolean) => Promise<void>;
  isSubmitting: boolean;
  serverError: string | null;
  onClearServerError: () => void;
  disabled?: boolean;
}

export function CheckoutForm({
  onSubmit,
  isSubmitting,
  serverError,
  onClearServerError,
  disabled = false,
}: CheckoutFormProps) {
  const [honeypot, setHoneypot] = useState('');

  // Read draft non-sensitive form fields from sessionStorage
  const getDraft = (): Partial<CheckoutFormData> => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      notes: '',
      ...getDraft(),
    },
  });

  const [notesCount, setNotesCount] = useState(() => (getDraft().notes || '').length);

  // Persist non-sensitive fields to sessionStorage on form change
  const handleFormChange = () => {
    try {
      const values = getValues();
      const { name, phone, email, address, city, state, pincode, notes } = values;
      sessionStorage.setItem(
        CHECKOUT_FORM_STORAGE_KEY,
        JSON.stringify({ name, phone, email, address, city, state, pincode })
      );
      setNotesCount((notes || '').length);
    } catch {
      // Ignore sessionStorage quota errors
    }
  };

  // Handle submit with double-submission guard & honeypot check
  const handleFormSubmit = async (data: CheckoutFormData) => {
    if (isSubmitting) return;

    if (honeypot.trim().length > 0) {
      // Honeypot triggered by bot: silently pretend success without calling API
      await onSubmit(data, true);
      return;
    }

    await onSubmit(data, false);
  };

  // Focus the first invalid field on validation error
  const onError = () => {
    const errorKeys = Object.keys(errors) as (keyof CheckoutFormData)[];
    if (errorKeys.length > 0) {
      setFocus(errorKeys[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onError)}
      onChange={handleFormChange}
      noValidate
      className="space-y-8"
      aria-label="Checkout information"
    >
      {/* Honeypot field (hidden from humans) */}
      <div className="hidden" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* 1. Contact Information */}
      <fieldset className="space-y-4">
        <legend className="font-serif text-2xl font-normal text-espresso tracking-tight border-b border-sand pb-2 w-full">
          Contact Details
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Full Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label htmlFor="checkout-name" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="checkout-name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Priya Sharma"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'checkout-name-error' : undefined}
              className={`w-full h-11 px-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors ${
                errors.name ? 'border-danger' : 'border-sand'
              }`}
              {...register('name', { onChange: () => serverError && onClearServerError() })}
            />
            {errors.name && (
              <p id="checkout-name-error" className="text-xs text-danger font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-phone" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              Mobile Number <span className="text-danger">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit number"
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
              className={`w-full h-11 px-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors ${
                errors.phone ? 'border-danger' : 'border-sand'
              }`}
              {...register('phone', { onChange: () => serverError && onClearServerError() })}
            />
            {errors.phone && (
              <p id="checkout-phone-error" className="text-xs text-danger font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-email" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              Email Address <span className="text-espresso/50 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              placeholder="priya@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'checkout-email-error' : undefined}
              className={`w-full h-11 px-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors ${
                errors.email ? 'border-danger' : 'border-sand'
              }`}
              {...register('email', { onChange: () => serverError && onClearServerError() })}
            />
            {errors.email && (
              <p id="checkout-email-error" className="text-xs text-danger font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* 2. Delivery Address */}
      <fieldset className="space-y-4">
        <legend className="font-serif text-2xl font-normal text-espresso tracking-tight border-b border-sand pb-2 w-full">
          Delivery Address
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Address Textarea */}
          <div className="sm:col-span-2 space-y-1.5">
            <label htmlFor="checkout-address" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              Street Address <span className="text-danger">*</span>
            </label>
            <textarea
              id="checkout-address"
              rows={3}
              autoComplete="street-address"
              placeholder="House/flat number, building name, street, locality"
              aria-required="true"
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? 'checkout-address-error' : undefined}
              className={`w-full p-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors resize-y min-h-[88px] ${
                errors.address ? 'border-danger' : 'border-sand'
              }`}
              {...register('address', { onChange: () => serverError && onClearServerError() })}
            />
            {errors.address && (
              <p id="checkout-address-error" className="text-xs text-danger font-medium">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-city" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              City <span className="text-danger">*</span>
            </label>
            <input
              id="checkout-city"
              type="text"
              autoComplete="address-level2"
              placeholder="e.g. Mumbai"
              aria-required="true"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'checkout-city-error' : undefined}
              className={`w-full h-11 px-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors ${
                errors.city ? 'border-danger' : 'border-sand'
              }`}
              {...register('city', { onChange: () => serverError && onClearServerError() })}
            />
            {errors.city && (
              <p id="checkout-city-error" className="text-xs text-danger font-medium">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-state" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              State / Union Territory <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <select
                id="checkout-state"
                autoComplete="address-level1"
                aria-required="true"
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? 'checkout-state-error' : undefined}
                className={`w-full h-11 pl-3.5 pr-9 rounded-[10px] border bg-cream-surface text-sm text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel appearance-none cursor-pointer transition-colors ${
                  errors.state ? 'border-danger' : 'border-sand'
                }`}
                {...register('state', { onChange: () => serverError && onClearServerError() })}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-espresso/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.state && (
              <p id="checkout-state-error" className="text-xs text-danger font-medium">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* PIN Code */}
          <div className="space-y-1.5">
            <label htmlFor="checkout-pincode" className="block text-xs font-semibold uppercase tracking-wider text-espresso">
              PIN Code <span className="text-danger">*</span>
            </label>
            <input
              id="checkout-pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              placeholder="6-digit PIN"
              aria-required="true"
              aria-invalid={Boolean(errors.pincode)}
              aria-describedby={errors.pincode ? 'checkout-pincode-error' : undefined}
              className={`w-full h-11 px-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors ${
                errors.pincode ? 'border-danger' : 'border-sand'
              }`}
              {...register('pincode', { onChange: () => serverError && onClearServerError() })}
            />
            {errors.pincode && (
              <p id="checkout-pincode-error" className="text-xs text-danger font-medium">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* 3. Order Notes */}
      <fieldset className="space-y-2">
        <div className="flex justify-between items-baseline border-b border-sand pb-2">
          <legend className="font-serif text-2xl font-normal text-espresso tracking-tight">
            Order Notes <span className="font-sans text-xs text-espresso/50 font-normal lowercase">(optional)</span>
          </legend>
          <span className="text-xs text-espresso/50">
            {notesCount}/300
          </span>
        </div>

        <textarea
          id="checkout-notes"
          rows={2}
          maxLength={300}
          placeholder="Special delivery instructions or landmark..."
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? 'checkout-notes-error' : undefined}
          className={`w-full p-3.5 rounded-[10px] border bg-cream-surface text-sm text-espresso placeholder:text-espresso/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel transition-colors resize-y min-h-[72px] ${
            errors.notes ? 'border-danger' : 'border-sand'
          }`}
          {...register('notes')}
        />
        {errors.notes && (
          <p id="checkout-notes-error" className="text-xs text-danger font-medium">
            {errors.notes.message}
          </p>
        )}
      </fieldset>

      {/* Inline Server Error Banner (role="alert") */}
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-[10px] border border-danger/40 bg-danger/10 text-espresso text-sm space-y-2"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-danger">Unable to place order</p>
              <p className="text-xs text-espresso/80">{serverError}</p>
            </div>
          </div>
          <div className="pt-1">
            <Link
              to="/cart"
              className="text-xs text-espresso underline underline-offset-4 hover:text-camel font-medium cursor-pointer"
            >
              Review cart
            </Link>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className={`w-full py-4 px-6 rounded-[10px] text-xs sm:text-sm uppercase tracking-wider font-semibold min-h-[50px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel cursor-pointer ${
            disabled || isSubmitting
              ? 'bg-espresso/40 text-cream/70 cursor-not-allowed'
              : 'bg-espresso text-cream hover:bg-espresso-light active:bg-espresso-dark'
          }`}
        >
          {isSubmitting ? 'Placing order...' : 'Place order'}
        </button>
      </div>
    </form>
  );
}

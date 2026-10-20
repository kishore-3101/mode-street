import { z } from 'zod';

// Helper to normalise and sanitize phone
export function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

// Helper to normalise and sanitize pincode
export function normalizePincode(raw: string): string {
  return raw.replace(/\D/g, '');
}

// Form validation schema matching backend rules
export const checkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((val) => /^\d{10}$/.test(val), {
      message: 'Please enter a valid 10-digit mobile number',
    }),
  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Please enter a valid email address',
    }),
  address: z
    .string()
    .trim()
    .min(5, 'Delivery address is required')
    .max(300, 'Address cannot exceed 300 characters'),
  city: z
    .string()
    .trim()
    .min(2, 'City is required')
    .max(60, 'City cannot exceed 60 characters'),
  state: z
    .string()
    .trim()
    .min(2, 'Please select your state / union territory'),
  pincode: z
    .string()
    .trim()
    .transform(normalizePincode)
    .refine((val) => /^\d{6}$/.test(val), {
      message: 'PIN code must be exactly 6 digits',
    }),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

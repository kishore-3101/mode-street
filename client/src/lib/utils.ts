import axios from 'axios';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOrderDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as { error?: string } | undefined;
    if (apiError?.error && typeof apiError.error === 'string') {
      return apiError.error;
    }
    if (error.response?.statusText) {
      return `Error ${error.response.status}: ${error.response.statusText}`;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

const LETTER_SIZE_ORDER: Record<string, number> = {
  '3XS': 1,
  'XXS': 2,
  'XS': 3,
  'S': 4,
  'M': 5,
  'L': 6,
  'XL': 7,
  'XXL': 8,
  '2XL': 8,
  '3XL': 9,
  'XXXL': 9,
  '4XL': 10,
  '5XL': 11,
};

/**
 * Sorts product variants:
 * 1. S, M, L, XL, XXL order for letter sizes
 * 2. Numeric ascending for numbers
 * 3. "Free size" / "One size" last
 * 4. Fall back to original order for anything else
 */
export function sortVariants<T extends { size: string }>(variants: T[]): T[] {
  return [...variants].sort((a, b) => {
    const sizeA = a.size.trim();
    const sizeB = b.size.trim();
    const upperA = sizeA.toUpperCase();
    const upperB = sizeB.toUpperCase();

    // Check "free size" / "one size" (sort last)
    const isFreeA =
      upperA === 'FREE SIZE' ||
      upperA === 'FREE' ||
      upperA === 'ONE SIZE' ||
      upperA === 'OS';
    const isFreeB =
      upperB === 'FREE SIZE' ||
      upperB === 'FREE' ||
      upperB === 'ONE SIZE' ||
      upperB === 'OS';
    if (isFreeA && !isFreeB) return 1;
    if (!isFreeA && isFreeB) return -1;
    if (isFreeA && isFreeB) return 0;

    // Check letter sizes
    const rankA = LETTER_SIZE_ORDER[upperA];
    const rankB = LETTER_SIZE_ORDER[upperB];
    if (rankA !== undefined && rankB !== undefined) {
      return rankA - rankB;
    }
    if (rankA !== undefined && rankB === undefined) {
      return -1;
    }
    if (rankA === undefined && rankB !== undefined) {
      return 1;
    }

    // Check numeric sizes
    const numA = Number(sizeA);
    const numB = Number(sizeB);
    const isNumA = !isNaN(numA) && sizeA !== '';
    const isNumB = !isNaN(numB) && sizeB !== '';
    if (isNumA && isNumB) {
      return numA - numB;
    }
    if (isNumA && !isNumB) {
      return -1;
    }
    if (!isNumA && isNumB) {
      return 1;
    }

    // Fall back to original insertion order
    return 0;
  });
}

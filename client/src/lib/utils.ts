import axios from 'axios';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
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

import { createContext } from 'react';
import type { CartItem } from '../types/index.js';

export interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (
    item: Omit<CartItem, 'qty' | 'maxQty'> & { qty?: number; maxQty?: number }
  ) => boolean;
  updateQty: (variantId: string, qty: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  clearBuyNow: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

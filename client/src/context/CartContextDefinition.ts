import { createContext } from 'react';
import type { CartItem } from '../types/index.js';

export interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (variantId: string, qty: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

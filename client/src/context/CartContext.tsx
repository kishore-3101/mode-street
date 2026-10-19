import { useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types/index.js';
import { CartContext } from './CartContextDefinition.js';

export type { CartContextValue } from './CartContextDefinition.js';

const CART_STORAGE_KEY = 'mode_street_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to read cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'qty'>, qty = 1) => {
    const addQuantity = Math.max(1, qty);
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIndex > -1) {
        return prev.map((entry, index) => {
          if (index !== existingIndex) return entry;
          const newQty = Math.min(10, entry.qty + addQuantity);
          return { ...entry, qty: newQty };
        });
      }
      return [...prev, { ...item, qty: Math.min(10, addQuantity) }];
    });
  };

  const updateQty = (variantId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(variantId);
      return;
    }
    const clampedQty = Math.min(10, qty);
    setItems((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, qty: clampedQty } : item))
    );
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clear = () => {
    setItems([]);
  };

  const count = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        addItem,
        updateQty,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

import { useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types/index.js';
import { CartContext } from './CartContextDefinition.js';

export type { CartContextValue } from './CartContextDefinition.js';

const CART_STORAGE_KEY = 'mode_street_cart';
const BUY_NOW_STORAGE_KEY = 'mode_street_buy_now';

export function CartProvider({ children }: { children: ReactNode }) {
  // Main shopping cart items (persisted to localStorage)
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

  // Separate Buy Now item (persisted to sessionStorage)
  const [buyNowItem, setBuyNowItemState] = useState<CartItem | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      console.error('Failed to read buyNowItem from sessionStorage', e);
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const setBuyNowItem = (item: CartItem | null) => {
    setBuyNowItemState(item);
    try {
      if (item) {
        sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(item));
      } else {
        sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save buyNowItem to sessionStorage', e);
    }
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
  };

  const addItem = (
    item: Omit<CartItem, 'qty' | 'maxQty'> & { qty?: number; maxQty?: number }
  ): boolean => {
    const addQuantity = Math.max(1, item.qty ?? 1);
    const stockLimit = typeof item.maxQty === 'number' ? Math.max(1, item.maxQty) : 10;
    const lineLimit = Math.min(10, stockLimit);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIndex > -1) {
        return prev.map((entry, index) => {
          if (index !== existingIndex) return entry;
          const effectiveLimit = Math.min(10, entry.maxQty || lineLimit);
          const newQty = Math.min(effectiveLimit, entry.qty + addQuantity);
          return { ...entry, qty: newQty, maxQty: effectiveLimit };
        });
      }
      return [
        ...prev,
        {
          variantId: item.variantId,
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          size: item.size,
          price: item.price,
          image: item.image,
          qty: Math.min(lineLimit, addQuantity),
          maxQty: lineLimit,
        },
      ];
    });

    return true;
  };

  const updateQty = (variantId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId !== variantId) return item;
        const lineLimit = Math.min(10, item.maxQty || 10);
        const clampedQty = Math.min(lineLimit, qty);
        return { ...item, qty: clampedQty };
      })
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
        buyNowItem,
        setBuyNowItem,
        clearBuyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

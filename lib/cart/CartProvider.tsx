"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'cob_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem: CartContextType['addItem'] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p));
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem: CartContextType['removeItem'] = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity: CartContextType['updateQuantity'] = (id, qty) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, removeItem, updateQuantity, clear }),
    [items, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

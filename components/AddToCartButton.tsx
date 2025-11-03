"use client";

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartProvider';
import { useToast } from '@/lib/ui/ToastProvider';

export default function AddToCartButton({
  id,
  name,
  price,
  image_url,
  quantity = 1,
  fullWidth = false,
}: {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity?: number;
  fullWidth?: boolean;
}) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const { show } = useToast();

  const onAdd = () => {
    setAdding(true);
    try {
      addItem({ id, name, price, image_url }, quantity);
      show(`Added “${name}” to cart`);
    } finally {
      setTimeout(() => setAdding(false), 250);
    }
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className="btn btn-primary"
      style={{ width: fullWidth ? '100%' : undefined, padding: '0.75rem 1rem' }}
      disabled={adding}
      aria-label={`Add ${name} to cart`}
    >
      {adding ? 'Adding…' : 'Add to Cart'}
    </button>
  );
}

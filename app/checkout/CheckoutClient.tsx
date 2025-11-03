"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartProvider';
import styles from './checkout.module.css';

export default function CheckoutClient() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Attach items JSON and totals
    formData.set('items', JSON.stringify(items.map((it) => ({
      product_id: it.id,
      product_name: it.name,
      product_price: it.price,
      quantity: it.quantity,
      subtotal: it.price * it.quantity,
    }))));
    formData.set('total_amount', String(total.toFixed(2)));

    try {
      const res = await fetch('/api/orders', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to place order');
      clear();
      router.push(`/order-confirmation/${data.order_number || data.order_id || 'success'}`);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shipping Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name *</label>
            <input name="full_name" type="text" className={styles.input} placeholder="John Doe" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input name="email" type="email" className={styles.input} placeholder="john@example.com" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone *</label>
            <input name="phone" type="tel" className={styles.input} placeholder="+1 (555) 123-4567" required />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Address *</label>
            <input name="address" type="text" className={styles.input} placeholder="123 Main Street" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>City *</label>
            <input name="city" type="text" className={styles.input} placeholder="New York" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>State/Province *</label>
            <input name="state" type="text" className={styles.input} placeholder="NY" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>ZIP/Postal Code *</label>
            <input name="zip" type="text" className={styles.input} placeholder="10001" required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Country *</label>
            <select name="country" className={styles.input} required>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
            </select>
          </div>
        </div>
      </section>

      {/* Payment section intentionally removed per requirements */}

      {error && (
        <div role="alert" style={{ background: '#ffecec', border: '1px solid #f5b7b7', color: '#a02020', padding: '12px 14px', borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
        {loading ? 'Placing Order…' : 'Place Order'}
      </button>
    </form>
  );
}

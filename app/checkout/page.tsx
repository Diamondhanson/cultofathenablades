import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as createMetadata } from '@/functions/seo';
import { routes } from '@/config/routes';
import styles from './checkout.module.css';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = createMetadata({
  title: 'Checkout',
  description: 'Complete your secure purchase. Fast and safe checkout process.',
});

export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.form}>
            <CheckoutClient />
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryItem}>
              <span>Damascus Steel Katana</span>
              <span>$599</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>$599</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>$599</span>
            </div>
            <div className={styles.secureCheckout}>
              <span>🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


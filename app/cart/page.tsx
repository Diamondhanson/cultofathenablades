import { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/functions/seo';
import styles from './cart.module.css';
import CartClient from './CartClient';

export const metadata: Metadata = createMetadata({
  title: 'Shopping Cart',
  description: 'Review your selected items and proceed to secure checkout.',
});

export default function CartPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Shopping Cart</h1>
        <CartClient />
      </div>
    </div>
  );
}


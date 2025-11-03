"use client";

import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useCart } from '@/lib/cart/CartProvider';
import styles from './cart.module.css';

export default function CartClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Your cart is empty</p>
        <Link href={routes.products} className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <Image
                src={item.image_url || '/vercel.svg'}
                alt={item.name}
                width={400}
                height={300}
                quality={85}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div className={styles.itemInfo}>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemPrice}>${item.price}</p>
            </div>
            <div className={styles.itemQuantity}>
              <button className={styles.quantityButton} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button className={styles.quantityButton} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</div>
            <button className={styles.removeButton} onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        {shipping === 0 && (
          <p className={styles.freeShipping}>✓ Free shipping applied!</p>
        )}
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link href={routes.checkout} className="btn btn-primary" style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
          Proceed to Checkout
        </Link>
        <Link href={routes.products} className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

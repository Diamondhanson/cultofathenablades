import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as createMetadata } from '@/functions/seo';
import { routes } from '@/config/routes';
import { createClient } from '@/lib/supabase/server';
import styles from './confirmation.module.css';

export const metadata: Metadata = createMetadata({
  title: 'Order Confirmation',
  description: 'Your order has been confirmed. Thank you for your purchase!',
});

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient();

  // Try fetch by order_number first
  let { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', params.orderId)
    .single();

  // Fallback to id
  if (!order) {
    const byId = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single();
    order = byId.data || null;
  }

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true });

  const orderItems = items || [];
  const subtotal = orderItems.reduce((sum, it) => sum + Number(it.subtotal || 0), 0);
  const shipping = Math.max(0, Number(order.total_amount) - subtotal);
  const address = order.shipping_address || {};

  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h1 className={styles.title}>Order Confirmed!</h1>
          <p className={styles.subtitle}>
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className={styles.orderId}>
            Order Number: <strong>#{order.order_number}</strong>
          </p>
          <p className={styles.email}>
            A confirmation email has been sent to your email address.
          </p>
        </div>

        <div className={styles.details}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Details</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order Date:</span>
                <span>{orderDate}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order ID:</span>
                <span>#{order.order_number}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Total:</span>
                <span className={styles.totalAmount}>${Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Items Ordered</h2>
            <div className={styles.items}>
              {orderItems.map((item: any, index: number) => (
                <div key={index} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.product_name}</h3>
                    <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>${Number(item.product_price).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <address className={styles.address}>
              {order.customer_name}<br />
              {String(address.address || '')}<br />
              {String(address.city || '')}, {String(address.state || '')} {String(address.zip || '')}<br />
              {String(address.country || '')}
            </address>
          </section>
        </div>

        <div className={styles.actions}>
          <Link href={routes.products} className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link href={routes.contact} className="btn btn-secondary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}


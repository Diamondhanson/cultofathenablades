import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender/recipient email for production
const DEFAULT_PROJECT_EMAIL = 'cultofathenablades@gmail.com';

const EMAIL_FROM = process.env.EMAIL_FROM || DEFAULT_PROJECT_EMAIL;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Cult of Athena Blades';
const EMAIL_CONTACT_TO = process.env.EMAIL_CONTACT_TO || DEFAULT_PROJECT_EMAIL;
const EMAIL_ORDERS_TO = process.env.EMAIL_ORDERS_TO || DEFAULT_PROJECT_EMAIL;
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || DEFAULT_PROJECT_EMAIL;
const BRAND = 'Cult of Athena Blades';

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] as string));
}

export async function sendContactNotification(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2 style="margin:0 0 12px;">New Contact Submission</h2>
      <p style="margin:0 0 16px; color:#666;">${BRAND}</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; background:#f7f7f7;">
        <tr><td style="width:160px; font-weight:bold;">Name</td><td>${escapeHtml(payload.name)}</td></tr>
        <tr><td style="width:160px; font-weight:bold;">Email</td><td>${escapeHtml(payload.email)}</td></tr>
        ${payload.phone ? `<tr><td style=\"width:160px; font-weight:bold;\">Phone</td><td>${escapeHtml(payload.phone)}</td></tr>` : ''}
        <tr><td style="width:160px; font-weight:bold;">Subject</td><td>${escapeHtml(payload.subject)}</td></tr>
        <tr><td style="width:160px; font-weight:bold; vertical-align:top;">Message</td><td>${escapeHtml(payload.message).replace(/\n/g, '<br/>')}</td></tr>
      </table>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
    replyTo: EMAIL_REPLY_TO || payload.email,
    subject: `[Contact] ${payload.subject}`,
    html,
  });
}

export type OrderItemInput = {
  product_id?: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

export async function sendOrderNotification(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: Record<string, any>;
  total_amount: number;
  payment_status?: string;
  status?: string;
}, items: OrderItemInput[]) {
  const address = order.shipping_address || {};

  const itemsRows = items.map((it) => `
    <tr>
      <td style="padding:8px;border:1px solid #eee;">${escapeHtml(it.product_name)}</td>
      <td style="padding:8px;border:1px solid #eee;">$${it.product_price.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #eee;">${it.quantity}</td>
      <td style="padding:8px;border:1px solid #eee;">$${it.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2 style="margin:0 0 12px;">New Order: ${escapeHtml(order.order_number)}</h2>
      <p style="margin:0 0 16px; color:#666;">${BRAND}</p>
      <h3 style="margin:16px 0 8px;">Buyer</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; background:#f7f7f7;">
        <tr><td style="width:180px; font-weight:bold;">Name</td><td>${escapeHtml(order.customer_name)}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">Email</td><td>${escapeHtml(order.customer_email)}</td></tr>
        ${order.customer_phone ? `<tr><td style=\"width:180px; font-weight:bold;\">Phone</td><td>${escapeHtml(order.customer_phone)}</td></tr>` : ''}
      </table>

      <h3 style="margin:16px 0 8px;">Shipping Address</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; background:#f7f7f7;">
        <tr><td style="width:180px; font-weight:bold;">Address</td><td>${escapeHtml(String(address.address || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">City</td><td>${escapeHtml(String(address.city || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">State</td><td>${escapeHtml(String(address.state || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">ZIP</td><td>${escapeHtml(String(address.zip || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">Country</td><td>${escapeHtml(String(address.country || ''))}</td></tr>
      </table>

      <h3 style="margin:16px 0 8px;">Items</h3>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; background:#fff;">
        <thead>
          <tr>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Item</th>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Unit Price</th>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Qty</th>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <h3 style="margin:16px 0 8px;">Totals</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; background:#f7f7f7;">
        <tr><td style="width:180px; font-weight:bold;">Total</td><td>$${order.total_amount.toFixed(2)}</td></tr>
        ${order.payment_status ? `<tr><td style=\"width:180px; font-weight:bold;\">Payment Status</td><td>${escapeHtml(order.payment_status)}</td></tr>` : ''}
        ${order.status ? `<tr><td style=\"width:180px; font-weight:bold;\">Order Status</td><td>${escapeHtml(order.status)}</td></tr>` : ''}
      </table>
    </div>
  `;

  await resend.emails.send({
    from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
    to: EMAIL_ORDERS_TO.split(',').map((s) => s.trim()).filter(Boolean),
    replyTo: EMAIL_REPLY_TO || order.customer_email,
    subject: `[Order] ${order.order_number} - $${order.total_amount.toFixed(2)}`,
    html,
  });
}

export async function sendCustomerOrderConfirmation(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: Record<string, any>;
  total_amount: number;
}, items: OrderItemInput[]) {
  const address = order.shipping_address || {};

  const itemsRows = items.map((it) => `
    <tr>
      <td style=\"padding:8px;border:1px solid #eee;\">${escapeHtml(it.product_name)}</td>
      <td style=\"padding:8px;border:1px solid #eee;\">$${it.product_price.toFixed(2)}</td>
      <td style=\"padding:8px;border:1px solid #eee;\">${it.quantity}</td>
      <td style=\"padding:8px;border:1px solid #eee;\">$${it.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2 style="margin:0 0 12px;">Thank you for your order, ${escapeHtml(order.customer_name)}!</h2>
      <p style="margin:0 0 16px; color:#666;">Order <strong>${escapeHtml(order.order_number)}</strong> — ${BRAND}</p>

      <p style="margin:0 0 16px;">We've received your order and will begin processing it shortly. Below is a summary of your purchase.</p>

      <h3 style="margin:16px 0 8px;">Items</h3>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; background:#fff;">
        <thead>
          <tr>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Item</th>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Unit Price</th>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Qty</th>
            <th align="left" style="padding:8px;border:1px solid #eee;background:#fafafa;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <h3 style="margin:16px 0 8px;">Shipping Address</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; background:#f7f7f7;">
        <tr><td style="width:180px; font-weight:bold;">Address</td><td>${escapeHtml(String(address.address || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">City</td><td>${escapeHtml(String(address.city || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">State</td><td>${escapeHtml(String(address.state || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">ZIP</td><td>${escapeHtml(String(address.zip || ''))}</td></tr>
        <tr><td style="width:180px; font-weight:bold;">Country</td><td>${escapeHtml(String(address.country || ''))}</td></tr>
      </table>

      <h3 style="margin:16px 0 8px;">Total</h3>
      <p style="margin:0 0 16px; font-size:16px;"><strong>$${order.total_amount.toFixed(2)}</strong></p>

      <p style="margin:16px 0 0; color:#666;">If you have any questions, reply to this email and we'll be happy to help.</p>
    </div>
  `;

  const isTestSender = EMAIL_FROM.endsWith('@resend.dev');
  const adminRecipients = (EMAIL_ORDERS_TO || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const to = isTestSender ? adminRecipients : [order.customer_email];

  await resend.emails.send({
    from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
    to,
    // When using test sender, mirror to admin only so it passes Resend's restriction
    subject: isTestSender
      ? `Order Confirmation — ${order.order_number} (customer: ${order.customer_email})`
      : `Order Confirmation — ${order.order_number}`,
    html,
  });
}

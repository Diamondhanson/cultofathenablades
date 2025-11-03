import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendOrderNotification, sendCustomerOrderConfirmation, type OrderItemInput } from '@/lib/email/resend';

function generateOrderNumber() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    let body: any;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = Object.fromEntries(form as any);
      if (body.items) {
        try { body.items = JSON.parse(String(body.items)); } catch {}
      }
    }

    const customer_name = String(body.full_name || body.customer_name || '').trim();
    const customer_email = String(body.email || body.customer_email || '').trim();
    const customer_phone = body.phone ? String(body.phone).trim() : undefined;

    const address = String(body.address || '')
    const city = String(body.city || '')
    const state = String(body.state || '')
    const zip = String(body.zip || body.postal || '')
    const country = String(body.country || '')

    if (!customer_name || !customer_email || !address || !city || !state || !zip || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const items: OrderItemInput[] = Array.isArray(body.items) && body.items.length
      ? body.items
      : [
          {
            product_name: String(body.summary_name || 'Product'),
            product_price: Number(body.summary_price || 0),
            quantity: Number(body.summary_qty || 1),
            subtotal: Number(body.summary_total || body.summary_price || 0),
          },
        ];

    const subtotal = items.reduce((sum, it) => sum + Number(it.subtotal || it.product_price * it.quantity), 0);
    const total_amount = Number(body.total_amount || subtotal);

    const supabase = await createClient();

    const order_number = generateOrderNumber();
    const { data: orderInsert, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        shipping_address: { address, city, state, zip, country },
        total_amount,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('*')
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const order_id = orderInsert.id;

    const orderItemsPayload = items.map((it) => ({
      order_id,
      product_id: it.product_id || null,
      product_name: it.product_name,
      product_price: it.product_price,
      quantity: it.quantity,
      subtotal: it.subtotal,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    await Promise.all([
      sendOrderNotification(
        {
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address: { address, city, state, zip, country },
          total_amount,
          payment_status: 'pending',
          status: 'pending',
        },
        items
      ),
      sendCustomerOrderConfirmation(
        {
          order_number,
          customer_name,
          customer_email,
          shipping_address: { address, city, state, zip, country },
          total_amount,
        },
        items
      ),
    ]);

    return NextResponse.json({ ok: true, order_id, order_number });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

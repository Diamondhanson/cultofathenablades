import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendContactNotification } from '@/lib/email/resend';

export async function POST(req: Request) {
  try {
    // Accept both JSON and form submissions
    const contentType = req.headers.get('content-type') || '';
    let body: any;
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = Object.fromEntries(form as any);
    }

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = body.phone ? String(body.phone).trim() : undefined;
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error: insertError } = await supabase.from('contact_submissions').insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'new',
    });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await sendContactNotification({ name, email, phone, subject, message });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

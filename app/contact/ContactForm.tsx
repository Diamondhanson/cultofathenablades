"use client";

import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to send message');
      setSuccess('Your message has been sent successfully. We will get back to you shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div role="status" style={{
          background: '#eaffea', border: '1px solid #b7e3b7', color: '#206a20',
          padding: '12px 14px', borderRadius: 8, marginBottom: 16,
        }}>
          {success}
        </div>
      )}
      {error && (
        <div role="alert" style={{
          background: '#ffecec', border: '1px solid #f5b7b7', color: '#a02020',
          padding: '12px 14px', borderRadius: 8, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name *</label>
          <input name="name" type="text" className={styles.input} placeholder="Your name" required value={form.name} onChange={onChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email *</label>
          <input name="email" type="email" className={styles.input} placeholder="your@email.com" required value={form.email} onChange={onChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone</label>
          <input name="phone" type="tel" className={styles.input} placeholder="+1 (555) 123-4567" value={form.phone} onChange={onChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Subject *</label>
          <input name="subject" type="text" className={styles.input} placeholder="How can we help?" required value={form.subject} onChange={onChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Message *</label>
          <textarea name="message" className={styles.textarea} rows={6} placeholder="Tell us more..." required value={form.message} onChange={onChange}></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
}

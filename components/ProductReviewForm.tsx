'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type ProductReviewFormProps = {
  productId: string;
  productName: string;
};

export default function ProductReviewForm({ productId, productName }: ProductReviewFormProps) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: '',
    email: '',
    rating: '5',
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = form.name.trim();
    const email = form.email.trim();
    const title = form.title.trim();
    const comment = form.comment.trim();
    const rating = Number(form.rating);

    if (!name || !comment || !rating) {
      setError('Please provide your name, rating, and a short review.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5 stars.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from('reviews').insert({
        product_id: productId,
        customer_name: name,
        customer_email: email || null,
        rating,
        title: title || null,
        comment,
        verified_purchase: false,
        approved: false,
      });

      if (insertError) throw insertError;

      setSuccess('Thank you for your review! It will appear here once it has been approved.');
      setForm({
        name: '',
        email: '',
        rating: '5',
        title: '',
        comment: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3 className="review-form-title">Write a Review for {productName}</h3>
      <form onSubmit={handleSubmit} className="review-form-grid">
        <div className="review-form-row">
          <label htmlFor="name" className="review-form-label">
            Name <span className="review-form-required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="review-form-input"
            required
          />
        </div>

        <div className="review-form-row">
          <label htmlFor="email" className="review-form-label">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="review-form-input"
            placeholder="We’ll only use this to verify your purchase."
          />
        </div>

        <div className="review-form-row">
          <label htmlFor="rating" className="review-form-label">
            Rating <span className="review-form-required">*</span>
          </label>
          <select
            id="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="review-form-input"
            required
          >
            <option value="5">★★★★★ - Exceptional</option>
            <option value="4">★★★★☆ - Great</option>
            <option value="3">★★★☆☆ - Good</option>
            <option value="2">★★☆☆☆ - Fair</option>
            <option value="1">★☆☆☆☆ - Poor</option>
          </select>
        </div>

        <div className="review-form-row">
          <label htmlFor="title" className="review-form-label">
            Review title (optional)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="review-form-input"
            placeholder="E.g. Stunning balance and finish"
          />
        </div>

        <div className="review-form-row">
          <label htmlFor="comment" className="review-form-label">
            Your review <span className="review-form-required">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className="review-form-textarea"
            rows={4}
            required
          />
        </div>

        {error && <div className="review-form-error">{error}</div>}
        {success && <div className="review-form-success">{success}</div>}

        <div className="review-form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}



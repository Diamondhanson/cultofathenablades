'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Review, Product } from '@/lib/types/database';
import styles from '../categories/categories.module.css';

type ReviewWithProduct = Review & { products?: Product };

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const toggleApproved = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ approved: !current })
        .eq('id', id);

      if (error) throw error;
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: !current } : r));
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className={styles.page}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reviews</h1>
      </div>

      <div className={styles.content}>
        {reviews.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⭐</div>
            <h2 className={styles.emptyTitle}>No Reviews Yet</h2>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.products?.name || '—'}</td>
                  <td>{review.customer_name}</td>
                  <td>{'⭐'.repeat(review.rating)}</td>
                  <td style={{ maxWidth: '300px' }}>{review.comment}</td>
                  <td>
                    <button
                      onClick={() => toggleApproved(review.id, review.approved)}
                      style={{
                        background: review.approved ? '#efe' : '#fee',
                        color: review.approved ? '#3a3' : '#c33',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {review.approved ? '✓ Approved' : '✗ Pending'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(review.id)} className={styles.deleteButton}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


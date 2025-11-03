'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Product, Category } from '@/lib/types/database';
import styles from '../categories/categories.module.css';

type ProductWithCategory = Product & { categories?: Category };

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      setProducts(products.filter((p) => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error: any) {
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !currentValue })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.map(p => 
        p.id === id ? { ...p, featured: !currentValue } : p
      ));
    } catch (error: any) {
      alert(`Failed to update product: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <Link href="/admin/dashboard/products/new" className={styles.addButton}>
          ➕ Add Product
        </Link>
      </div>

      <div className={styles.content}>
        {products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⚔️</div>
            <h2 className={styles.emptyTitle}>No Products Yet</h2>
            <p className={styles.emptyText}>
              Add your first product to start selling.
            </p>
            <Link href="/admin/dashboard/products/new" className={styles.addButton}>
              ➕ Add Product
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.imageCell}>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.imageCell}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={60}
                      height={60}
                      className={styles.categoryImage}
                    />
                  </td>
                  <td className={styles.nameCell}>{product.name}</td>
                  <td>{product.categories?.name || '—'}</td>
                  <td>${product.price}</td>
                  <td>
                    {product.in_stock ? (
                      <span style={{ color: '#3a3' }}>✓ {product.stock_quantity}</span>
                    ) : (
                      <span style={{ color: '#c33' }}>✗ Out of stock</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(product.id, product.featured)}
                      style={{
                        background: product.featured ? '#ffc' : '#f9f9f9',
                        border: '1px solid #ddd',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {product.featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/dashboard/products/${product.id}`}
                        className={styles.editButton}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>
                    </div>
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


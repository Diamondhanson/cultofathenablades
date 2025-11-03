'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types/database';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter((cat) => cat.id !== id));
      alert('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(`Failed to delete category: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <Link href="/admin/dashboard/categories/new" className={styles.addButton}>
          ➕ Add Category
        </Link>
      </div>

      <div className={styles.content}>
        {categories.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📁</div>
            <h2 className={styles.emptyTitle}>No Categories Yet</h2>
            <p className={styles.emptyText}>
              Create your first category to organize your products.
            </p>
            <Link href="/admin/dashboard/categories/new" className={styles.addButton}>
              ➕ Add Category
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.imageCell}>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className={styles.imageCell}>
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        width={60}
                        height={60}
                        className={styles.categoryImage}
                      />
                    ) : (
                      <div className={styles.categoryImage} style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📁
                      </div>
                    )}
                  </td>
                  <td className={styles.nameCell}>{category.name}</td>
                  <td>{category.slug}</td>
                  <td className={styles.descriptionCell}>
                    {category.description || '—'}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/dashboard/categories/${category.id}`}
                        className={styles.editButton}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
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


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types/database';
import styles from '../form.module.css';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    loadCategory();
  }, [params.id]);

  const loadCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image_url: data.image_url || '',
      });
      
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (err: any) {
      console.error('Error loading category:', err);
      setError('Failed to load category');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${formData.slug}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('categories')
      .upload(filePath, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('categories')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Upload new image if selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage() || imageUrl;
      }

      // Update category
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          image_url: imageUrl || null,
        })
        .eq('id', params.id);

      if (updateError) throw updateError;

      router.push('/admin/dashboard/categories');
      router.refresh();
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading category...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/dashboard/categories" className={styles.backLink}>
          ← Back to Categories
        </Link>
        <h1 className={styles.title}>Edit Category</h1>
      </div>

      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Category Name <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="slug" className={styles.label}>
              Slug <span className={styles.required}>*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Category Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            <label htmlFor="image" className={styles.fileInputLabel}>
              📁 {imagePreview ? 'Change Image' : 'Choose Image'}
            </label>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setFormData(prev => ({ ...prev, image_url: '' }));
                  }}
                  className={styles.removeImage}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Link href="/admin/dashboard/categories" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


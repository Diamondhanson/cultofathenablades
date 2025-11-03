'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import styles from './form.module.css';

export default function NewCategoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
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
      // Upload image if selected
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      // Insert category
      const { error: insertError } = await supabase
        .from('categories')
        .insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      router.push('/admin/dashboard/categories');
      router.refresh();
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/dashboard/categories" className={styles.backLink}>
          ← Back to Categories
        </Link>
        <h1 className={styles.title}>Add New Category</h1>
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
              placeholder="e.g., Katanas"
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
              placeholder="e.g., katanas"
              required
            />
            <span className={styles.helpText}>
              Used in URLs. Auto-generated from name, but you can customize it.
            </span>
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
              placeholder="Brief description of this category..."
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
              📁 Choose Image
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
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


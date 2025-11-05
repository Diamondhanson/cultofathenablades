'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types/database';
import styles from '../../categories/form.module.css';

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Main image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Sub images (max 3)
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    stock_quantity: '0',
    in_stock: true,
    featured: false,
    notes: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    setCategories(data || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const limited = files.slice(0, 3);
    setSubImageFiles(limited);

    Promise.all(
      limited.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then((previews) => setSubImagePreviews(previews));
  };

  const removeSubImageAt = (index: number) => {
    setSubImageFiles((prev) => prev.filter((_, i) => i !== index));
    setSubImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadMainImage = async (): Promise<string> => {
    if (!imageFile) throw new Error('No main image selected');

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${formData.slug}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const uploadSubImages = async (): Promise<string[]> => {
    if (subImageFiles.length === 0) return [];

    const uploadedUrls: string[] = [];
    for (const file of subImageFiles.slice(0, 3)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.slug}-sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!imageFile) {
        throw new Error('Please select a main product image');
      }

      const imageUrl = await uploadMainImage();
      const additionalImages = await uploadSubImages();

      // Notes (simple text)
      const notes = (formData.notes || '').trim() || null;

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          category_id: formData.category_id || null,
          image_url: imageUrl,
          additional_images: additionalImages,
          stock_quantity: parseInt(formData.stock_quantity),
          in_stock: formData.in_stock,
          featured: formData.featured,
          notes,
        });

      if (insertError) throw insertError;

      router.push('/admin/dashboard/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/dashboard/products" className={styles.backLink}>
          ← Back to Products
        </Link>
        <h1 className={styles.title}>Add New Product</h1>
      </div>

      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Two-column layout: images left, details right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left: Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Main Image */}
              <div className={styles.formGroup}>
                <label htmlFor="image" className={styles.label}>
                  Main Image <span className={styles.required}>*</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className={styles.fileInput}
                  required
                />
                <label htmlFor="image" className={styles.fileInputLabel}>
                  📁 Choose Main Image
                </label>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <Image
                      src={imagePreview}
                      alt="Main image preview"
                      width={200}
                      height={200}
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </div>

              {/* Sub Images */}
              <div className={styles.formGroup}>
                <label htmlFor="sub_images" className={styles.label}>
                  Sub Images (up to 3)
                </label>
                <input
                  id="sub_images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSubImagesChange}
                  className={styles.fileInput}
                />
                <label htmlFor="sub_images" className={styles.fileInputLabel}>
                  📁 Choose Sub Images
                </label>
                {subImagePreviews.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {subImagePreviews.map((preview, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <Image
                          src={preview}
                          alt={`Sub image ${idx + 1}`}
                          width={120}
                          height={120}
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removeSubImageAt(idx)}
                          className={styles.removeImage}
                          aria-label={`Remove sub image ${idx + 1}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <span className={styles.helpText}>You can upload up to 3 sub images.</span>
              </div>
            </div>

            {/* Right: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Product Name <span className={styles.required}>*</span>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>
                    Price <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="stock_quantity" className={styles.label}>
                    Stock Quantity <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="original_price" className={styles.label}>
                  Original Price (before discount)
                </label>
                <input
                  id="original_price"
                  name="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={handleChange}
                  className={styles.input}
                />
                <span className={styles.helpText}>
                  Optional. If provided and greater than Price, buyers will see a discount.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category_id" className={styles.label}>
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes" className={styles.label}>
                  Product Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Any additional notes about this product (care, maker, edition, etc.)"
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id="in_stock"
                    name="in_stock"
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={handleChange}
                  />
                  <label htmlFor="in_stock">In Stock</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label htmlFor="featured">Featured Product</label>
                </div>
              </div>
            </div>
          </div>

          {/* Description across the bottom */}
          <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.actions}>
            <Link href="/admin/dashboard/products" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


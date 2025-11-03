import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as createMetadata } from '@/functions/seo';
import { routes } from '@/config/routes';
import { createClient } from '@/lib/supabase/server';
import ImageGallery from './ImageGallery';
import type { Product } from '@/lib/types/database';
import styles from './product.module.css';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    return createMetadata({
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    });
  }

  return createMetadata({
    title: `${product.name} - Premium Blade`,
    description: product.description,
    keywords: [product.name, 'sword', 'katana', 'dagger', 'blade'],
  });
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  // Get reviews for this product
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', params.id)
    .eq('approved', true);

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const images = product.additional_images && Array.isArray(product.additional_images)
    ? [product.image_url, ...product.additional_images]
    : [product.image_url];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href={routes.home}>Home</Link>
          <span>/</span>
          <Link href={routes.products}>Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className={styles.productLayout}>
          {/* Image Gallery */}
          <ImageGallery images={images} name={product.name} />

          {/* Product Info */}
          <div className={styles.info}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            {reviews && reviews.length > 0 && (
              <div className={styles.rating}>
                <span className={styles.stars}>{'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}</span>
                <span className={styles.ratingText}>
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            )}

            <div className={styles.priceSection}>
              <span className={styles.price}>${product.price}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className={styles.originalPrice} style={{ marginLeft: '0.75rem', textDecoration: 'line-through', color: '#999' }}>
                    ${product.original_price}
                  </span>
                  <span className={styles.discount} style={{ marginLeft: '0.5rem', color: '#d4af37', fontWeight: 600 }}>
                    Save ${(product.original_price - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className={styles.specifications} style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h2 className={styles.specificationsTitle}>Specifications</h2>
            <div className={styles.specGrid}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className={styles.specItem}>
                  <span className={styles.specLabel}>{key}:</span>
                  <span className={styles.specValue}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
            {product.in_stock ? (
              <div className={styles.stock}>
                <span className={styles.inStock}>✓ In Stock ({product.stock_quantity} available)</span>
                <span className={styles.shipping}>Free shipping on orders over $200</span>
              </div>
            ) : (
              <div className={styles.outOfStock}>Out of Stock</div>
            )}

            <div className={styles.actions}>
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                image_url={product.image_url}
                fullWidth
              />
              <Link href={routes.cart} className="btn btn-secondary" style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
                View Cart
              </Link>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🛡️</span>
                <span>Authentic Craftsmanship</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🚚</span>
                <span>Secure Shipping</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>↩️</span>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>Product Details</h2>
          <div className={styles.detailsContent}>
            <p>{product.description}</p>
          </div>
        </div>

        

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className={styles.reviews}>
            <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((review) => (
                <div key={review.id} style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{review.customer_name}</strong>
                    <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  {review.title && <h4 style={{ margin: '0.5rem 0' }}>{review.title}</h4>}
                  <p style={{ color: '#666', margin: 0 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


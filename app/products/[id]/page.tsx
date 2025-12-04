import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as createMetadata } from '@/functions/seo';
import { routes } from '@/config/routes';
import { createClient } from '@/lib/supabase/server';
import ImageGallery from './ImageGallery';
import type { Product } from '@/lib/types/database';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import styles from './product.module.css';
import homeStyles from '@/app/page.module.css';
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

  // JSON-LD Product schema
  const aggregateRating = reviews && reviews.length > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: Number(averageRating.toFixed(1)),
    reviewCount: reviews.length,
  } : undefined;

  const offers = {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: Number(product.price),
    availability: product.in_stock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
  };

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description,
    category: product.categories?.name || undefined,
    offers,
    ...(aggregateRating ? { aggregateRating } : {}),
  };

  // Related products (same category)
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4);

  return (
    <div className={styles.page}>
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
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
            {product.notes_rich || product.notes ? (
              <div
                className={styles.description}
                style={{ marginTop: '-0.5rem' }}
                dangerouslySetInnerHTML={{
                  __html: product.notes_rich
                    ? generateHTML(product.notes_rich as any, [
                        StarterKit.configure({
                          heading: { levels: [2, 3, 4] },
                        }),
                        Table.configure({ resizable: true }),
                        TableRow,
                        TableHeader,
                        TableCell,
                      ])
                    : product.notes || '',
                }}
              />
            ) : null}
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
          <div
            className={styles.detailsContent}
            dangerouslySetInnerHTML={{
              __html: (product as any).description_rich
                ? generateHTML((product as any).description_rich, [
                    StarterKit.configure({
                      heading: { levels: [2, 3, 4] },
                    }),
                    Table.configure({ resizable: true }),
                    TableRow,
                    TableHeader,
                    TableCell,
                  ])
                : product.description,
            }}
          />
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

        {/* Related Products - reuse home page tiles */}
        {related && related.length > 0 && (
          <section style={{ padding: '2rem 0' }}>
            <h2 className={styles.detailsTitle}>You Might Also Like</h2>
            <div className={homeStyles.productGrid}>
              {related.slice(0, 4).map((rp: any) => (
                <div key={rp.id} className={homeStyles.productCard}>
                  <Link href={routes.productDetail(rp.id)} className={homeStyles.productLink}>
                    <div className={homeStyles.productImage}>
                      <Image
                        src={rp.image_url}
                        alt={rp.name}
                        width={600}
                        height={400}
                        quality={85}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      <div className={homeStyles.productOverlay}>
                        <Link href={routes.productDetail(rp.id)} className="btn btn-gold">
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className={homeStyles.productInfo}>
                      <h3 className={homeStyles.productName}>{rp.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p className={homeStyles.productPrice} style={{ margin: 0 }}>${rp.price}</p>
                        {rp.original_price && rp.original_price > rp.price && (
                          <span style={{ textDecoration: 'line-through', color: '#999' }}>${rp.original_price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


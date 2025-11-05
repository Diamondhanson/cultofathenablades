import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generateMetadata as createMetadata } from '@/functions/seo';
import { routes } from '@/config/routes';
import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/lib/types/database';
import styles from './products.module.css';
import AddToCartButton from '@/components/AddToCartButton';

export const metadata: Metadata = createMetadata({
  title: 'Shop Premium Swords, Katanas & Daggers',
  description: 'Browse our extensive collection of authentic swords, katanas, and daggers. High-quality blades for collectors, martial artists, and enthusiasts. Free shipping on orders over $200.',
  keywords: ['buy swords', 'katana for sale', 'daggers shop', 'medieval weapons', 'japanese swords', 'samurai katana'],
});

export const revalidate = 60; // Revalidate every 60 seconds

type ProductWithCategory = Product & { categories?: Category };

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const supabase = await createClient();
  
  // Fetch categories for the sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Fetch products with optional category filter
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  // Filter by category if specified
  if (searchParams.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single();
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }

  const { data: products } = await query;
  const productsList = (products as ProductWithCategory[]) || [];
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Our Collection</h1>
          <p className={styles.subtitle}>
            Discover premium blades crafted with precision and tradition
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          {/* Filters */}
          <aside className={styles.sidebar}>
            <h2 className={styles.filterTitle}>Filter by Category</h2>
            <ul className={styles.filterList}>
              <li>
                <Link href={routes.products} className={styles.filterLink}>
                  All Products
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${routes.products}?category=${category.slug}`}
                    className={styles.filterLink}
                  >
                    {category.name}
                </Link>
              </li>
              ))}
            </ul>
          </aside>

          {/* Products Grid */}
          <div className={styles.main}>
            {productsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No products found</p>
                <p>Check back soon for new additions to our collection!</p>
              </div>
            ) : (
            <div className={styles.productGrid}>
                {productsList.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <Link href={routes.productDetail(product.id)} className={styles.productLink}>
                    <div className={styles.productImage}>
                      <Image
                          src={product.image_url}
                          alt={`${product.name} - Premium ${product.categories?.name || 'blade'}`}
                        width={600}
                        height={400}
                        quality={85}
                        loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                        {product.in_stock && (
                        <span className={styles.badge}>In Stock</span>
                      )}
                        {product.featured && (
                          <span className={styles.badge} style={{ left: '1rem', right: 'auto', background: '#d4af37' }}>
                            ⭐ Featured
                          </span>
                        )}
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productFooter}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={styles.productPrice}>${product.price}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span style={{ textDecoration: 'line-through', color: '#999' }}>${product.original_price}</span>
                          )}
                        </div>
                        <span className={styles.viewDetails}>View Details →</span>
                      </div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <AddToCartButton
                            id={product.id}
                            name={product.name}
                            price={Number(product.price)}
                            image_url={product.image_url}
                          />
                        </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


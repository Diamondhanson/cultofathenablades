import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { generateStructuredData } from '@/functions/seo';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const revalidate = 60;

export default async function HomePage() {
  const structuredData = generateStructuredData('organization', {});
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')
    .limit(3);

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(4);

  const categoriesList = categories || [];
  const productsList = featuredProducts || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroSubtitle}>Forge Your Legacy</span>
            <span className={styles.heroMainTitle}>Master the Art of the Blade</span>
          </h1>
          <p className={styles.heroDescription}>
            Discover authentic swords, katanas, and daggers crafted with centuries-old techniques. 
            Premium quality blades for collectors, martial artists, and history enthusiasts.
          </p>
          <div className={styles.heroButtons}>
            <Link href={routes.products} className="btn btn-primary">
              Explore Collection
            </Link>
            <Link href={routes.contact} className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1592422546501-f5b4e2c5b9a4?q=80&w=2000&auto=format&fit=crop"
            alt="Premium Japanese Katana with Traditional Sheath - Authentic Handcrafted Blade"
            width={2000}
            height={1200}
            priority
            quality={90}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Browse by Category</h2>
          <p className={styles.sectionSubtitle}>
            Explore our curated collection of premium blades
          </p>
          <div className={styles.categoryGrid}>
            {categoriesList.map((category) => (
              <Link key={category.id} href={`${routes.products}?category=${category.slug}`} className={styles.categoryCard}>
                <div className={styles.categoryImage}>
                  <Image
                    src={category.image_url || 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=80&w=800&auto=format&fit=crop'}
                    alt={`${category.name} - Premium Collection`}
                    width={800}
                    height={600}
                    quality={85}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className={styles.categoryContent}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  <p className={styles.categoryDescription}>{category.description || `Explore our ${category.name.toLowerCase()} collection`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured Blades</h2>
          <p className={styles.sectionSubtitle}>
            Hand-selected masterpieces from our collection
          </p>
          {productsList.length > 0 ? (
            <div className={styles.productGrid}>
              {productsList.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={600}
                      height={400}
                      quality={85}
                      loading="lazy"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    <div className={styles.productOverlay}>
                      <Link href={routes.productDetail(product.id)} className="btn btn-gold">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>No featured products available at the moment.</p>
            </div>
          )}
          <div className={styles.viewAllButton}>
            <Link href={routes.products} className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className={styles.featureTitle}>Authentic Quality</h3>
              <p className={styles.featureDescription}>
                Every blade is crafted using traditional methods and premium materials, 
                ensuring authenticity and durability.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Fast Shipping</h3>
              <p className={styles.featureDescription}>
                Secure packaging and swift delivery worldwide. Track your order every step of the way.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💎</div>
              <h3 className={styles.featureTitle}>Expert Curation</h3>
              <p className={styles.featureDescription}>
                Hand-selected by blade experts and martial arts masters for quality and historical accuracy.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Satisfaction Guarantee</h3>
              <p className={styles.featureDescription}>
                30-day return policy and lifetime support. Your satisfaction is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Collection?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of collectors and martial artists who trust us for their blade needs.
            </p>
            <Link href={routes.products} className="btn btn-gold">
              Shop Now
            </Link>
          </div>
    </div>
      </section>
    </>
  );
}

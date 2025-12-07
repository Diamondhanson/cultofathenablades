import Link from 'next/link';
import Image from 'next/image';
import heroImg from '@/assets/images/hero-image.jpg';
import { routes } from '@/config/routes';
import { generateStructuredData } from '@/functions/seo';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const revalidate = 60;

const SAMPLE_HOME_REVIEWS = [
  {
    id: 'sample-1',
    customer_name: 'Elena M.',
    rating: 5,
    title: 'A centerpiece for my collection',
    comment:
      'The blade arrived razor sharp with flawless polish. The balance feels incredible in the hand and the fittings look even better in person.',
  },
  {
    id: 'sample-2',
    customer_name: 'David K.',
    rating: 5,
    title: 'Exactly what I was hoping for',
    comment:
      'Excellent communication, fast shipping, and a sword that feels properly built for cutting practice—not a wall hanger.',
  },
  {
    id: 'sample-3',
    customer_name: 'Sofia L.',
    rating: 4,
    title: 'Beautiful craftsmanship',
    comment:
      'Saya fit is tight, the hamon is subtle but elegant, and the grip is comfortable for longer sessions. Great value for the price.',
  },
];

export default async function HomePage() {
  const structuredData = generateStructuredData('organization', {});
  const supabase = await createClient();

  // Fetch categories with images from the database (show only those that have images)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .not('image_url', 'is', null)
    .order('name');

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(4);

  const { data: recentReviews } = await supabase
    .from('reviews')
    .select('*, products(name, slug)')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const categoriesList = categories || [];
  const productsList = featuredProducts || [];
  const homepageReviews = (recentReviews && recentReviews.length > 0 ? recentReviews : SAMPLE_HOME_REVIEWS) as any[];

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
            <span className={styles.heroSubtitle}>Honed in Tradition</span>
            <span className={styles.heroMainTitle}>Cult of Athene Blades</span>
          </h1>
          <p className={styles.heroDescription}>
            Meticulously forged blades with elegant fittings and balanced steel—crafted for collectors and
            practitioners who demand authenticity and performance.
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
            src={heroImg}
            alt="Handcrafted katana on wooden stand with lacquered saya in a studio setting"
            width={2000}
            height={1200}
            priority
            quality={90}
            sizes="100vw"
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
                    src={category.image_url}
                    alt={`${category.name} - Premium Collection`}
                    width={800}
                    height={600}
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className={styles.categoryContent}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  <p className={styles.categoryDescription}>{category.description || ''}</p>
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    <div className={styles.productOverlay}>
                      <Link href={routes.productDetail(product.slug)} className="btn btn-gold">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p className={styles.productPrice} style={{ margin: 0 }}>${product.price}</p>
                      {product.original_price && product.original_price > product.price && (
                        <span style={{ textDecoration: 'line-through', color: '#999' }}>${product.original_price}</span>
                      )}
                    </div>
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

      {/* Customer Reviews */}
      {homepageReviews.length > 0 && (
        <section className={styles.homeReviews}>
          <div className="container">
            <h2 className={styles.sectionTitle}>What Collectors Are Saying</h2>
            <p className={styles.sectionSubtitle}>
              Recent feedback from customers who’ve added our blades to their collection.
            </p>
            <div className={styles.homeReviewGrid}>
              {homepageReviews.map((review: any) => (
                <div key={review.id} className={styles.homeReviewCard}>
                  <div className={styles.homeReviewHeader}>
                    <span className={styles.homeReviewStars}>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className={styles.homeReviewName}>{review.customer_name}</span>
                  </div>
                  {review.products?.name && (
                    <p className={styles.homeReviewProduct}>
                      On{' '}
                      <Link href={routes.productDetail(review.products?.slug || '')}>
                        {review.products.name}
                      </Link>
                    </p>
                  )}
                  {review.title && (
                    <h3 className={styles.homeReviewTitle}>{review.title}</h3>
                  )}
                  <p className={styles.homeReviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

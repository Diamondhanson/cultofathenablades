import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as createMetadata } from '@/functions/seo';
import { routes } from '@/config/routes';
import styles from './legal.module.css';

export const metadata: Metadata = createMetadata({
  title: 'Terms of Service',
  description: 'Read the terms and conditions for purchasing and using products from Cult of Athena Blades.',
});

export default function TermsOfServicePage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last Updated: October 30, 2025</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Cult of Athena Blades website and purchasing our products, 
              you accept and agree to be bound by these Terms of Service. If you do not agree to these 
              terms, please do not use our website or purchase our products.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Age Requirement</h2>
            <p>
              You must be at least 18 years of age to purchase any products from our website. By making 
              a purchase, you confirm that you are of legal age in your jurisdiction to purchase and own 
              bladed weapons. We reserve the right to request age verification at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Product Use and Restrictions</h2>
            <p>All products sold on our website are intended for:</p>
            <ul className={styles.list}>
              <li>Decorative and display purposes</li>
              <li>Martial arts training and practice</li>
              <li>Historical reenactment</li>
              <li>Collection purposes</li>
            </ul>
            <p>
              <strong>Products are NOT intended for:</strong> illegal activities, violence, or 
              threatening behavior. Customers are responsible for knowing and complying with all local, 
              state, and federal laws regarding blade ownership and use.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Legal Compliance</h2>
            <p>
              It is your responsibility to ensure that your purchase and possession of our products 
              complies with all applicable laws in your jurisdiction. Some locations have restrictions 
              on blade length, type, or ownership. We are not responsible for packages seized by customs 
              or law enforcement due to local restrictions.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Orders and Payments</h2>
            <ul className={styles.list}>
              <li>All prices are in USD and subject to change without notice</li>
              <li>We accept major credit cards and other payment methods as displayed</li>
              <li>Payment is due at the time of order</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Order confirmation does not guarantee product availability</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Shipping and Delivery</h2>
            <p>
              We ship to most locations worldwide, subject to legal restrictions. Shipping times are 
              estimates and not guarantees. We are not responsible for delays caused by customs, 
              weather, or carrier issues. Risk of loss passes to the customer upon delivery to the carrier.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Returns and Refunds</h2>
            <p>
              We offer a 30-day return policy for unused products in original condition. To initiate 
              a return, contact us at <Link href={routes.contact}>our contact page</Link>. Customers 
              are responsible for return shipping costs unless the product is defective or we made an error.
            </p>
            <p>Refunds will be processed to the original payment method within 7-10 business days.</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Product Warranties</h2>
            <p>
              We stand behind the quality of our products. If you receive a defective item, contact us 
              within 30 days for a replacement or refund. Our warranty does not cover:
            </p>
            <ul className={styles.list}>
              <li>Normal wear and tear</li>
              <li>Damage from misuse or abuse</li>
              <li>Modifications made by the customer</li>
              <li>Products not purchased directly from us</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Limitation of Liability</h2>
            <p>
              Cult of Athena Blades is not liable for any injuries, damages, or losses resulting from 
              the use or misuse of our products. By purchasing our products, you accept all risks 
              associated with ownership and use. Our liability is limited to the purchase price of 
              the product.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and designs, is the property 
              of Cult of Athena Blades and protected by copyright and trademark laws. You may not use, 
              reproduce, or distribute our content without written permission.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Privacy</h2>
            <p>
              Your use of our website is also governed by our{' '}
              <Link href={routes.privacyPolicy}>Privacy Policy</Link>. Please review it to understand 
              how we collect and use your information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be 
              effective immediately upon posting. Your continued use of our website after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>13. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of the State of New York, United States, 
              without regard to conflict of law principles. Any disputes shall be resolved in the courts 
              of New York County, New York.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>14. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: legal@cultofathenablades.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Forge Street, Craftsman District, New York, NY 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


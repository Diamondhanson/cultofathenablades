import { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/functions/seo';
import styles from './legal.module.css';

export const metadata: Metadata = createMetadata({
  title: 'Privacy Policy',
  description: 'Learn how Cult of Athena Blades collects, uses, and protects your personal information.',
});

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: October 30, 2025</p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p>
              At Cult of Athena Blades, we collect information that you provide directly to us when you:
            </p>
            <ul className={styles.list}>
              <li>Create an account or place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p>
              This information may include your name, email address, shipping address, phone number, 
              payment information, and age verification (to comply with legal requirements for blade purchases).
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className={styles.list}>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you promotional materials (with your consent)</li>
              <li>Improve our website and customer experience</li>
              <li>Prevent fraud and ensure compliance with legal requirements</li>
              <li>Verify age eligibility for weapon purchases</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information with:
            </p>
            <ul className={styles.list}>
              <li>Shipping carriers to deliver your orders</li>
              <li>Payment processors to complete transactions</li>
              <li>Law enforcement when required by law</li>
              <li>Service providers who assist in our business operations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from 
              unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className={styles.list}>
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing systems</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data by authorized personnel only</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience, 
              analyze site traffic, and understand where our visitors are coming from. You can control 
              cookie preferences through your browser settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className={styles.list}>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Children's Privacy</h2>
            <p>
              Our website and products are intended for adults 18 years and older. We do not knowingly 
              collect personal information from children under 18. All blade purchases require age verification.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: privacy@cultofathenablades.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Forge Street, Craftsman District, New York, NY 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


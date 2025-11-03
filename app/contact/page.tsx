import { Metadata } from 'next';
import { generateMetadata as createMetadata } from '@/functions/seo';
import styles from './contact.module.css';
import ContactForm from './ContactForm';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Cult of Athena Blades. We are here to answer your questions about our swords, katanas, and daggers.',
  keywords: ['contact', 'customer service', 'blade experts', 'sword questions'],
});

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have questions about our blades? We're here to help!
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <div className={styles.form}>
            <h2 className={styles.formTitle}>Send us a message</h2>
            <ContactForm />
          </div>

          <div className={styles.info}>
            <div className={styles.infoCard}>
              <div className={styles.icon}>📧</div>
              <h3 className={styles.infoTitle}>Email</h3>
              <p className={styles.infoText}>info@cultofathenablades.com</p>
              <p className={styles.infoSubtext}>We respond within 24 hours</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>📞</div>
              <h3 className={styles.infoTitle}>Phone</h3>
              <p className={styles.infoText}>+1 (555) 123-4567</p>
              <p className={styles.infoSubtext}>Mon-Fri, 9am-6pm EST</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>📍</div>
              <h3 className={styles.infoTitle}>Address</h3>
              <p className={styles.infoText}>
                123 Forge Street<br />
                Craftsman District<br />
                New York, NY 10001
              </p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.icon}>⏰</div>
              <h3 className={styles.infoTitle}>Business Hours</h3>
              <p className={styles.infoText}>
                Monday - Friday: 9am - 6pm<br />
                Saturday: 10am - 4pm<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Are these real swords?</h3>
              <p className={styles.faqAnswer}>
                Yes, all our swords are functional replicas made with authentic materials and traditional techniques. 
                They are suitable for display, collection, and martial arts practice.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What is your return policy?</h3>
              <p className={styles.faqAnswer}>
                We offer a 30-day return policy for all unused items in original condition. 
                Please contact us before initiating a return.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How long does shipping take?</h3>
              <p className={styles.faqAnswer}>
                Domestic orders typically arrive within 5-7 business days. 
                International shipping varies by location, usually 10-21 days.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Do you ship internationally?</h3>
              <p className={styles.faqAnswer}>
                Yes, we ship worldwide! However, please check your local laws regarding blade ownership 
                and importation before ordering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


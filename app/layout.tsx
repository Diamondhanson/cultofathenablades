import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/lib/cart/CartProvider';
import { ToastProvider } from '@/lib/ui/ToastProvider';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cultofathenablades.com'),
  title: {
    default: 'Cult of Athena Blades | Premium Swords, Katanas & Daggers',
    template: '%s | Cult of Athena Blades',
  },
  description: 'Discover premium quality swords, katanas, and daggers. Authentic blades for collectors, martial artists, and history enthusiasts. Fast shipping and expert craftsmanship.',
  keywords: ['swords', 'katanas', 'daggers', 'blades', 'weapons', 'martial arts', 'samurai swords', 'medieval weapons', 'japanese swords'],
  authors: [{ name: 'Cult of Athena Blades' }],
  creator: 'Cult of Athena Blades',
  publisher: 'Cult of Athena Blades',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cultofathenablades.com',
    siteName: 'Cult of Athena Blades',
    title: 'Cult of Athena Blades | Premium Swords, Katanas & Daggers',
    description: 'Discover premium quality swords, katanas, and daggers. Authentic blades for collectors, martial artists, and history enthusiasts.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cult of Athena Blades',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cult of Athena Blades | Premium Swords, Katanas & Daggers',
    description: 'Discover premium quality swords, katanas, and daggers. Authentic blades for collectors, martial artists, and history enthusiasts.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}

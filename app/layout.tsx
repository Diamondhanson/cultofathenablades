import type { Metadata } from 'next';
import { Teko, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/lib/cart/CartProvider';
import { ToastProvider } from '@/lib/ui/ToastProvider';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const teko = Teko({
  subsets: ['latin'],
  variable: '--font-primary',
  weight: ['400','500','600','700'],
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
  alternates: {
    canonical: 'https://cultofathenablades.com',
  },
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
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Cult of Athena Blades',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cult of Athena Blades | Premium Swords, Katanas & Daggers',
    description: 'Discover premium quality swords, katanas, and daggers. Authentic blades for collectors, martial artists, and history enthusiasts.',
    images: ['/logo.png'],
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
  icons: {
    icon: [{ url: '/logo.png', sizes: 'any', type: 'image/png' }],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${teko.variable} ${inter.variable}`}>
      <head>
        {/* Favicon: point to /logo.png in public. If not present yet, copy assets/images/logo.png to public/logo.png */}
        <link rel="icon" type="image/png" href="/logo.png" />
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

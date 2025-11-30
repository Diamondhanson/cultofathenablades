import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/images/og-default.jpg',
  canonical,
}: SEOConfig): Metadata {
  const siteName = 'Cult of Athena Blades';
  const fullTitle = `${title} | ${siteName}`;
  const defaultKeywords = ['swords', 'katanas', 'daggers', 'blades', 'weapons', 'martial arts', 'medieval weapons'];
  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: siteName }],
    openGraph: {
      title: fullTitle,
      description,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
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
    alternates: canonical ? { canonical } : undefined,
  };
}

export function generateStructuredData(type: 'organization' | 'product' | 'webpage', data: any) {
  const baseUrl = 'https://cultofathenablades.com';

  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Cult of Athena Blades',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: 'Premium daggers, swords, and katanas for collectors and martial artists',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'info@cultofathenablades.com',
        },
        ...data,
      };

    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        image: data.image,
        description: data.description,
        brand: {
          '@type': 'Brand',
          name: 'Cult of Athena Blades',
        },
        offers: {
          '@type': 'Offer',
          url: data.url,
          priceCurrency: 'USD',
          price: data.price,
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount || 1,
        } : undefined,
      };

    case 'webpage':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data.name,
        description: data.description,
        url: data.url,
        publisher: {
          '@type': 'Organization',
          name: 'Cult of Athena Blades',
        },
      };

    default:
      return null;
  }
}



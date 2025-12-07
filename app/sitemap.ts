import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://cultofathenablades.com';
  const supabase = await createClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/privacy-policy`, lastModified: new Date() },
    { url: `${base}/terms-of-service`, lastModified: new Date() },
  ];

  // Fetch product pages
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('in_stock', true)
    .limit(500);

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((p: any) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}

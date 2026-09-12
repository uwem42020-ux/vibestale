import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600; // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/corrections-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/explains`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/live-news`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music-news`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.7,
    },
  ];

  // Category pages
  const categories = [
    'general',
    'politics',
    'business',
    'sports',
    'tech',
    'entertainment',
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'always',
    priority: 0.7,
  }));

  // Dynamic headline pages
  const supabase = await createClient();
  const { data: headlines, error } = await supabase
    .from('headlines')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('Sitemap error fetching headlines:', error.message);
    return [...staticRoutes, ...categoryRoutes];
  }

  const headlineRoutes: MetadataRoute.Sitemap = (headlines || []).map((item) => ({
    url: `${baseUrl}/headline/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(item.published_at),
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...headlineRoutes];
}
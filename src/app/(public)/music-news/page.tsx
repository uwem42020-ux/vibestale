import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  return {
    title: 'Celebrity News Nigeria | Latest Entertainment Gossip',
    description:
      'Get the latest Nigerian celebrity news, entertainment gossip, and Nollywood updates. Stay informed with AI-powered summaries from trusted entertainment sources.',
    alternates: {
      canonical: `${baseUrl}/music-news`,
    },
    openGraph: {
      title: 'Celebrity News Nigeria | Latest Entertainment Gossip',
      description:
        'Get the latest Nigerian celebrity news, entertainment gossip, and Nollywood updates. Stay informed with AI-powered summaries from trusted entertainment sources.',
      type: 'website',
      url: `${baseUrl}/music-news`,
      siteName: 'Vibestale',
    },
    twitter: {
      card: 'summary',
      title: 'Celebrity News Nigeria | Latest Entertainment Gossip',
      description:
        'Get the latest Nigerian celebrity news, entertainment gossip, and Nollywood updates. Stay informed with AI-powered summaries from trusted entertainment sources.',
    },
  };
}

export default async function CelebrityNewsPage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  const { data: news, error } = await supabase
    .from('entertainment_news')
    .select(
      'id, title, slug, original_url, image_url, ai_summary, category, published_at, source_id, entertainment_sources(name, base_url)'
    )
    .eq('ai_analysis_status', 'completed')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching entertainment news:', error);
    return <div className="text-red-500">Error loading news.</div>;
  }

  // Normalize data for HeadlineCard (expects `sources` as object or null)
  const normalizedNews = (news || []).map((item) => {
    const source = Array.isArray(item.entertainment_sources)
      ? item.entertainment_sources[0]
      : item.entertainment_sources;
    return {
      ...item,
      sources: source || null,
    };
  });

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Celebrity News',
        item: `${baseUrl}/music-news`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="md:flex md:gap-8">
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            🌟 Celebrity News
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Latest entertainment and celebrity gossip.
          </p>

          {normalizedNews.length > 0 ? (
            <div className="space-y-4">
              {normalizedNews.map((item) => (
                <HeadlineCard key={item.id} headline={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No celebrity news yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
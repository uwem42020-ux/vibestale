import { createClient } from '@/lib/supabase/server';
import HeadlinesList from '@/components/feed/HeadlinesList';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';
import Image from 'next/image';
import SourceBadge from '@/components/SourceBadge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const headlineCategories = [
  { slug: 'general', label: 'General' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'business', label: 'Business' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'tech', label: 'Tech' },
  { slug: 'entertainment', label: 'Entertainment' },
];

type NavCategory = { slug: string; label: string };
type NavLink = { href: string; label: string };
type NavItem = NavCategory | NavLink;

const navCategories: NavItem[] = [
  ...headlineCategories,
  { label: 'Live News', href: '/live-news' },
];

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  return {
    title: 'VibeStale | Nigerian News, Breaking Headlines, Politics, Sports, Tech',
    description:
      'Get the latest Nigerian news and breaking headlines on politics, business, sports, tech, entertainment, and more. Stay informed with AI-powered summaries from trusted sources.',
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: 'VibeStale | Nigerian News, Breaking Headlines, Politics, Sports, Tech',
      description:
        'Get the latest Nigerian news and breaking headlines on politics, business, sports, tech, entertainment, and more. Stay informed with AI-powered summaries from trusted sources.',
      type: 'website',
      url: baseUrl,
      siteName: 'VibeStale',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'VibeStale | Nigerian News, Breaking Headlines, Politics, Sports, Tech',
      description:
        'Get the latest Nigerian news and breaking headlines on politics, business, sports, tech, entertainment, and more. Stay informed with AI-powered summaries from trusted sources.',
    },
  };
}

export default async function HomePage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

  // 1. Main feed: latest 10 headlines
  const { data: headlines, error } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .gte('published_at', twentyFourHoursAgo)
    .order('published_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching headlines:', error);
    return <div className="text-red-500">Error loading headlines.</div>;
  }

  if (!headlines || headlines.length === 0) {
    return <div className="text-gray-400">No headlines yet.</div>;
  }

  // 2. Trending: by engagement, last 72h
  const { data: trendingHeadlines } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .gte('published_at', seventyTwoHoursAgo)
    .order('view_count', { ascending: false, nullsFirst: false })
    .order('share_count', { ascending: false, nullsFirst: false })
    .limit(5);

  // 3. Breaking News: is_breaking = true, top 2
  const { data: breakingNews } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(2);

  // 4. Sports Update: category = sports, top 2
  const { data: sportsNews } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('category', 'sports')
    .order('published_at', { ascending: false })
    .limit(2);

  // 5. Naija Latest: category = general, top 2
  const { data: naijaLatest } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('category', 'general')
    .order('published_at', { ascending: false })
    .limit(2);

  // Fallback trending items
  const trendingItems =
    trendingHeadlines && trendingHeadlines.length > 0
      ? trendingHeadlines
      : headlines.slice(0, 5);

  const mainIds = new Set(headlines.map((h) => h.id));
  const finalTrending = trendingItems.filter((item) => !mainIds.has(item.id)).slice(0, 5);

  if (finalTrending.length < 5) {
    const fillers = headlines
      .filter((h) => !finalTrending.some((t) => t.id === h.id))
      .slice(0, 5 - finalTrending.length);
    finalTrending.push(...fillers);
  }

  const trending = finalTrending;

  const trendingWithArrows = trending.map((item, index, arr) => {
    let arrow: 'up' | 'down' | null = null;
    if (arr.length >= 3) {
      if (index <= 1) arrow = 'up';
      else if (index >= arr.length - 2) arrow = 'down';
    } else if (arr.length === 2) {
      arrow = index === 0 ? 'up' : 'down';
    }
    return { ...item, arrow };
  });

  // Compact row for sidebar sections
  const CompactItem = ({ item, showArrow = false }: { item: any; showArrow?: boolean }) => (
    <Link
      href={`/headline/${item.slug}`}
      className="flex items-center gap-3 p-3 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)] last:border-b-0 group"
    >
      {showArrow && item.arrow && (
        <span className="flex items-center gap-1">
          {item.arrow === 'up' && <TrendingUp className="w-4 h-4 text-green-500 animate-bounce" />}
          {item.arrow === 'down' && <TrendingDown className="w-4 h-4 text-red-500 animate-pulse" />}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          {item.sources && (
            <SourceBadge name={item.sources.name} baseUrl={item.sources.base_url} />
          )}
        </div>
        <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {item.title}
        </h3>
      </div>
      {item.image_url && (
        <Image
          src={`/api/image?url=${encodeURIComponent(item.image_url)}`}
          alt={item.title}
          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
          width={48}
          height={48}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
    </Link>
  );

  // Small advert banner
  const SmallAdvertBanner = () => (
    <div className="w-full rounded-xl overflow-hidden border border-[var(--border)]">
      <Image
        src="/advert%20design.png"
        alt="Advertisement"
        className="w-full h-auto object-cover"
        width={320}
        height={100}
        loading="lazy"
      />
    </div>
  );

  // Structured data
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VibeStale',
    url: baseUrl,
    logo: `${baseUrl}/blacklogo.png`,
    sameAs: [
      'https://facebook.com/vibestale',
      'https://twitter.com/vibestale',
      'https://instagram.com/vibestale',
    ],
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VibeStale',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />

      <div className="md:flex md:gap-8">
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          {/* Mobile date + nav */}
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>
          <div className="md:hidden mb-6 relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
              <span className="flex-shrink-0 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-full shadow-md">
                Headlines
              </span>
              {navCategories.map((item) => {
                const href = 'slug' in item ? `/category/${item.slug}` : item.href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex-shrink-0 px-4 py-2 bg-[var(--surface)] text-[var(--text-secondary)] text-sm font-medium rounded-full border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-[var(--background)] to-transparent" />
          </div>

          {/* Mobile Trending slider */}
          <div className="md:hidden mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
              Trending News
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
              {trendingWithArrows.map((headline) => (
                <Link key={headline.id} href={`/headline/${headline.slug}`} className="flex-shrink-0 w-48 bg-[var(--surface)] rounded-xl border border-[var(--border)] p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {headline.arrow === 'up' && <TrendingUp className="w-4 h-4 text-green-500 animate-bounce" />}
                    {headline.arrow === 'down' && <TrendingDown className="w-4 h-4 text-red-500 animate-pulse" />}
                    {headline.sources && (
                      <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
                    )}
                  </div>
                  {headline.image_url ? (
                    <Image
                      src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                      alt={headline.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      width={192}
                      height={96}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-24 bg-[var(--surface-hover)] rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">{headline.title}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <SmallAdvertBanner />
            </div>
          </div>

          {/* Desktop: Main content + Sidebar with multiple sections */}
          <div className="hidden md:flex md:gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-space-grotesk">Latest Headlines</h1>
                <span className="text-sm text-[var(--text-tertiary)]">{headlines.length} stories</span>
              </div>
              <HeadlinesList initialHeadlines={headlines} />
            </div>

            <aside className="w-80 flex-shrink-0">
              <div className="space-y-6">
                <SmallAdvertBanner />

                <section>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                    Breaking News
                  </h2>
                  <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                    {(breakingNews ?? []).map((item) => (
                      <CompactItem key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                    Trending News
                  </h2>
                  <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                    {trendingWithArrows.map((item) => (
                      <CompactItem key={item.id} item={item} showArrow />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                    Sports Update
                  </h2>
                  <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                    {(sportsNews ?? []).map((item) => (
                      <CompactItem key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                    Naija Latest
                  </h2>
                  <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                    {(naijaLatest ?? []).map((item) => (
                      <CompactItem key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>

          {/* Mobile main list */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">Latest Headlines</h1>
              <span className="text-sm text-[var(--text-tertiary)]">{headlines.length} stories</span>
            </div>
            <HeadlinesList initialHeadlines={headlines} />
          </div>
        </div>
      </div>
    </>
  );
}
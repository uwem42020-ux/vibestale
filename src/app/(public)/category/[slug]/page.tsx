import { createClient } from '@/lib/supabase/server';
import CategoryHeadlinesList from '@/components/feed/CategoryHeadlinesList';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';
import SourceBadge from '@/components/SourceBadge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

const headlineCategories = [
  { slug: 'general', label: 'General' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'business', label: 'Business' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'tech', label: 'Tech' },
  { slug: 'entertainment', label: 'Entertainment' },
];

const navItems = [
  ...headlineCategories.map((cat) => ({
    href: `/category/${cat.slug}`,
    label: cat.label,
  })),
  { href: '/music-news', label: 'Celebrity News' },
  { href: '/live-news', label: 'Live News' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = headlineCategories.find((c) => c.slug === slug);
  const categoryName = category?.label || slug.charAt(0).toUpperCase() + slug.slice(1);
  const description = `Latest ${categoryName} news from Nigeria and around the world. Stay updated with breaking stories, AI summaries, and trusted sources.`;

  return {
    title: `${categoryName} News Today | VibeStale`,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/category/${slug}`,
    },
    openGraph: {
      title: `${categoryName} News Today | VibeStale`,
      description,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/category/${slug}`,
      siteName: 'VibeStale',
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} News Today | VibeStale`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  // 1. Category-specific main list
  let items: any[] = [];

  if (slug === 'entertainment') {
    const { data: generalEntertainment } = await supabase
      .from('headlines')
      .select('*, sources(name, base_url)')
      .eq('category', 'entertainment')
      .eq('ai_analysis_status', 'completed')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(10);

    const { data: celebrityNews } = await supabase
      .from('entertainment_news')
      .select('*, entertainment_sources(name, base_url)')
      .eq('ai_analysis_status', 'completed')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(10);

    const normalisedCelebrity = (celebrityNews || []).map((item: any) => ({
      ...item,
      sources: item.entertainment_sources || null,
      category: 'celebrity',
    }));

    items = [...(generalEntertainment || []), ...normalisedCelebrity]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 10);
  } else {
    const { data: headlines, error } = await supabase
      .from('headlines')
      .select('*, sources(name, base_url)')
      .eq('category', slug)
      .eq('ai_analysis_status', 'completed')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) return <div className="text-red-500">Error loading headlines.</div>;

    items = headlines || [];
  }

  // 2. Global sidebar data (same as homepage)
  const { data: breakingNews } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(2);

  const { data: trendingNews } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('view_count', { ascending: false, nullsFirst: false })
    .order('share_count', { ascending: false, nullsFirst: false })
    .limit(2);

  const { data: sportsNews } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('category', 'sports')
    .order('published_at', { ascending: false })
    .limit(2);

  const { data: naijaLatest } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('category', 'general')
    .order('published_at', { ascending: false })
    .limit(2);

  // Add arrows to trending items (for visual effect)
  const trendingWithArrows = (trendingNews || []).map((item, index, arr) => {
    let arrow: 'up' | 'down' | null = null;
    if (arr.length === 2) arrow = index === 0 ? 'up' : 'down';
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
          {item.sources && <SourceBadge name={item.sources.name} baseUrl={item.sources.base_url} />}
        </div>
        <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {item.title}
        </h3>
      </div>
      {item.image_url && (
        <img
          src={`/api/image?url=${encodeURIComponent(item.image_url)}`}
          alt={item.title}
          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
    </Link>
  );

  // Small advert banner
  const SmallAdvertBanner = () => (
    <div className="w-full rounded-xl overflow-hidden border border-[var(--border)]">
      <img
        src="/advert%20design.png"
        alt="Advertisement"
        className="w-full h-auto object-cover"
      />
    </div>
  );

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        item: `${process.env.NEXT_PUBLIC_APP_URL}/category/${slug}`,
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
        {/* Portrait advert (desktop left) */}
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          {/* Mobile nav */}
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>
          <div className="md:hidden mb-4 relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
              <span className="flex-shrink-0 px-3 py-1.5 bg-green-700 text-white text-sm font-semibold rounded-full">Headlines</span>
              {navItems.map((item) => {
                const isActive = item.href === `/category/${slug}`;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-full ${
                      isActive ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-black to-transparent" />
          </div>

          {/* Category Heading */}
          <h1 className="inline-block bg-white text-black border border-gray-300 rounded-xl px-5 py-2 text-2xl font-bold mb-6 font-space-grotesk">
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>

          {/* Mobile Trending News slider (global, not category-specific) */}
          <div className="md:hidden mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">Trending News</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
              {trendingWithArrows.map((item) => (
                <Link
                  key={item.id}
                  href={`/headline/${item.slug}`}
                  className="flex-shrink-0 w-48 bg-[var(--surface)] rounded-xl border border-[var(--border)] p-3"
                >
                  <div className="flex items-center gap-1 mb-1">
                    {item.arrow === 'up' && <TrendingUp className="w-4 h-4 text-green-500 animate-bounce" />}
                    {item.arrow === 'down' && <TrendingDown className="w-4 h-4 text-red-500 animate-pulse" />}
                    {item.sources && <SourceBadge name={item.sources.name} baseUrl={item.sources.base_url} />}
                  </div>
                  {item.image_url ? (
                    <img
                      src={`/api/image?url=${encodeURIComponent(item.image_url)}`}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-24 bg-[var(--surface-hover)] rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <SmallAdvertBanner />
            </div>
          </div>

          {/* Desktop layout: Main list + Sidebar with multiple sections */}
          <div className="hidden md:flex md:gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  {slug.charAt(0).toUpperCase() + slug.slice(1)}
                </h1>
                <span className="text-sm text-[var(--text-tertiary)]">{items.length} stories</span>
              </div>
              <CategoryHeadlinesList initialItems={items} slug={slug} />
            </div>

            {/* Sidebar: no sticky, multiple sections */}
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

          {/* Mobile main list (visible only on small screens) */}
          <div className="md:hidden">
            <CategoryHeadlinesList initialItems={items} slug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}
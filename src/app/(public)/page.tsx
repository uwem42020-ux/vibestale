import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@/lib/supabase/server';
import HeadlinesList from '@/components/feed/HeadlinesList';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import Image from 'next/image';
import SourceBadge from '@/components/SourceBadge';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
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

const EXPLAINS_DIR = path.join(process.cwd(), 'src', 'content', 'explains');

type ExplainerPreview = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  published_at: string;
  reading_time: string;
};

function getLatestExplainers(limit: number = 3): ExplainerPreview[] {
  if (!fs.existsSync(EXPLAINS_DIR)) return [];

  const files = fs.readdirSync(EXPLAINS_DIR).filter((f) => f.endsWith('.mdx'));

  const explainers = files.map((file) => {
    const filePath = path.join(EXPLAINS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    return {
      title: data.title as string,
      slug: data.slug as string,
      category: data.category as string,
      excerpt: data.excerpt as string,
      published_at: data.published_at as string,
      reading_time: data.reading_time as string,
    };
  });

  return explainers
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit);
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  return {
    title: 'Vibestale | Nigerian News, Explained',
    description:
      'Understand what is happening in Nigeria — not just what happened. Breaking news, politics, business, sports, tech, and entertainment with AI-powered context and summaries.',
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: 'Vibestale | Nigerian News, Explained',
      description:
        'Understand what is happening in Nigeria — not just what happened. Breaking news, politics, business, sports, tech, and entertainment with AI-powered context and summaries.',
      type: 'website',
      url: baseUrl,
      siteName: 'Vibestale',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Vibestale | Nigerian News, Explained',
      description:
        'Understand what is happening in Nigeria — not just what happened. Breaking news, politics, business, sports, tech, and entertainment with AI-powered context and summaries.',
    },
  };
}

export default async function HomePage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  const latestExplainers = getLatestExplainers(3);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

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

  const { data: breakingNews } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
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

  const CompactItem = ({ item, showArrow = false }: { item: any; showArrow?: boolean }) => (
    <Link
      href={`/headline/${item.slug}`}
      className="flex items-center gap-3 p-3 hover:bg-[var(--surface-hover)] active:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)] last:border-b-0 group"
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

  const SmallAdvertBanner = () => (
    <div className="w-full">
      <a
        href="https://nimart.ng"
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="block w-full rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
      >
        <Image
          src="/advert%20design.png"
          alt="Advertisement"
          className="w-full h-auto object-cover"
          width={320}
          height={100}
          loading="lazy"
        />
      </a>
      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.2em] mt-2 text-center font-medium">
        Advertisement
      </p>
    </div>
  );

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vibestale',
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
    name: 'Vibestale',
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

      {/* Hero positioning — desktop only */}
      <div className="hidden md:block mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] font-space-grotesk leading-tight">
          Nigerian News, <span className="text-[var(--accent)]">Explained.</span>
        </h1>
        <p className="text-base text-[var(--text-secondary)] mt-2 max-w-2xl">
          Understand what&apos;s happening — not just what happened. AI-powered summaries,
          context, and trusted sources.
        </p>
      </div>

      <div className="md:flex md:gap-8">
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          {/* Mobile category nav */}
          <div className="md:hidden mb-6 relative -mx-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 px-4 no-scrollbar">
              <span className="flex-shrink-0 px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-full shadow-md whitespace-nowrap">
                Headlines
              </span>
              {navCategories.map((item) => {
                const href = 'slug' in item ? `/category/${item.slug}` : item.href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex-shrink-0 px-5 py-2.5 bg-[var(--surface)] text-[var(--text-secondary)] text-sm font-medium rounded-full border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] active:scale-95 transition-all whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-[var(--background)] to-transparent" />
          </div>

          {/* Mobile Trending — Stories style with full-image display */}
          <div className="md:hidden mb-7">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xl font-bold text-[var(--text-primary)] font-space-grotesk">
                Trending
              </h2>
              <div className="flex-shrink-0">
                <LiveClock initialTime={serverNow} />
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {trendingWithArrows.map((headline) => (
                <Link
                  key={headline.id}
                  href={`/headline/${headline.slug}`}
                  className="flex-shrink-0 w-[75vw] max-w-[320px] relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md border border-[var(--border)] bg-black active:scale-[0.98] transition-transform duration-150"
                >
                  {headline.image_url ? (
                    <Image
                      src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                      alt={headline.title}
                      fill
                      sizes="(max-width: 768px) 75vw, 320px"
                      className="object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[var(--surface-hover)] flex items-center justify-center">
                      <svg className="w-12 h-12 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Top row: trend arrow + source */}
                  <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
                    {headline.arrow === 'up' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/90 backdrop-blur-sm shadow-lg">
                        <TrendingUp className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                    {headline.arrow === 'down' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/90 backdrop-blur-sm shadow-lg">
                        <TrendingDown className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                    {headline.sources && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-white/90">
                        <img
                          alt=""
                          className="w-3 h-3 rounded-sm"
                          loading="lazy"
                          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(headline.sources.base_url)}&sz=32`}
                        />
                        <span className="truncate max-w-[110px]">{headline.sources.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom gradient + title */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-[5]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-white text-[15px] font-semibold leading-snug line-clamp-3 drop-shadow-md">
                      {headline.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <SmallAdvertBanner />
            </div>
          </div>

          {/* Mobile Explains preview — no icon, See all is a button */}
          {latestExplainers.length > 0 && (
            <div className="md:hidden mb-7">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Explains
                </h2>
                <Link
                  href="/explains"
                  className="text-xs font-semibold px-3.5 py-1.5 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
                >
                  See all
                </Link>
              </div>
              <div className="space-y-2.5">
                {latestExplainers.slice(0, 2).map((explainer) => (
                  <Link
                    key={explainer.slug}
                    href={`/explains/${explainer.slug}`}
                    className="block relative bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 pl-5 hover:border-[var(--accent)]/40 active:scale-[0.98] transition-all group overflow-hidden"
                  >
                    <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-[var(--accent)]" />
                    <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-semibold rounded-full uppercase tracking-wide">
                      {explainer.category}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[var(--text-primary)] line-clamp-2 group-active:text-[var(--accent)] transition-colors mt-2">
                      {explainer.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Desktop: Main content + Sidebar */}
          <div className="hidden md:flex md:gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-space-grotesk">Latest Headlines</h2>
                <span className="text-sm text-[var(--text-tertiary)]">{headlines.length} stories</span>
              </div>
              <HeadlinesList initialHeadlines={headlines} />
            </div>

            <aside className="w-80 flex-shrink-0">
              <div className="space-y-6">
                <SmallAdvertBanner />

                <NewsletterSignup />

                {latestExplainers.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                      Vibestale Explains
                    </h2>
                    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                      {latestExplainers.slice(0, 2).map((explainer) => (
                        <Link
                          key={explainer.slug}
                          href={`/explains/${explainer.slug}`}
                          className="block p-3 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)] group"
                        >
                          <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-medium rounded-full">
                            {explainer.category}
                          </span>
                          <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors mt-2">
                            {explainer.title}
                          </h3>
                        </Link>
                      ))}
                      <Link
                        href="/explains"
                        className="block p-3 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--surface-hover)] transition-colors text-center"
                      >
                        Browse all explainers →
                      </Link>
                    </div>
                  </section>
                )}

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
import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';
import FeaturedHeadlineCard from '@/components/feed/FeaturedHeadlineCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const headlineCategories = [
  { slug: 'general', label: 'General' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'business', label: 'Business' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'tech', label: 'Tech' },
  { slug: 'entertainment', label: 'Entertainment' },
];

const mediaCategories = [
  { label: 'Music', href: '/music' },
  { label: 'Music Videos', href: '/music-videos' },
  { label: 'Celebrity News', href: '/music-news' },
  { label: 'Movies', href: '/movies' },
  { label: 'Live TV', href: '/live-tv' },
  { label: 'Memes', href: '/memes' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const { data: headlines, error } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching headlines:', error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error loading headlines</div>
          <p className="text-[var(--text-secondary)]">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!headlines || headlines.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-[var(--text-tertiary)] text-lg mb-2">No headlines yet</div>
          <p className="text-[var(--text-secondary)]">Check back soon for the latest news.</p>
        </div>
      </div>
    );
  }

  const [featured, ...rest] = headlines;

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        {/* Mobile date + nav */}
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>
        
        {/* Mobile Category Navigation */}
        <div className="md:hidden mb-6 relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            <span className="flex-shrink-0 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-full shadow-md">
              Headlines
            </span>
            {headlineCategories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`} 
                className="flex-shrink-0 px-4 py-2 bg-[var(--surface)] text-[var(--text-secondary)] text-sm font-medium rounded-full border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all"
              >
                {cat.label}
              </Link>
            ))}
            {mediaCategories.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex-shrink-0 px-4 py-2 bg-[var(--surface)] text-[var(--text-secondary)] text-sm font-medium rounded-full border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-[var(--background)] to-transparent" />
        </div>

        {/* Latest Headlines Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-space-grotesk">
              Latest Headlines
            </h1>
            <span className="text-sm text-[var(--text-tertiary)]">
              {headlines.length} stories
            </span>
          </div>

          {/* Featured Article */}
          <div className="mb-6">
            <FeaturedHeadlineCard headline={featured} />
          </div>

          {/* Rest of Headlines */}
          <div className="space-y-4">
            {rest.map((headline) => (
              <HeadlineCard key={headline.id} headline={headline} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--surface)] text-[var(--text-primary)] font-semibold rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all shadow-sm hover:shadow-lg">
              Load More Stories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 font-space-grotesk">
            Trending Now
          </h2>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
            {headlines.slice(0, 5).map((headline, index) => (
              <Link
                key={headline.id}
                href={`/headline/${headline.slug}`}
                className="flex items-center gap-4 p-4 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)] last:border-b-0 group"
              >
                {/* Number */}
                <span className="text-2xl font-bold text-[var(--accent)] w-8 text-center flex-shrink-0">
                  {index + 1}
                </span>

                {/* Image */}
                {headline.image_url ? (
                  <img
                    src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                    alt={headline.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--surface-hover)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                    {headline.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-tertiary)]">
                    {headline.category && (
                      <span className="capitalize">{headline.category}</span>
                    )}
                    {headline.sources && (
                      <>
                        <span>•</span>
                        <span>{headline.sources.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
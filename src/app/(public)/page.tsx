import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';
import FeaturedHeadlineCard from '@/components/feed/FeaturedHeadlineCard';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const categories = [
  { slug: 'general', label: 'General' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'business', label: 'Business' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'tech', label: 'Tech' },
  { slug: 'entertainment', label: 'Entertainment' },
];

export default async function HomePage() {
  const supabase = await createClient();

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
    return <div className="text-red-500">Error loading headlines.</div>;
  }

  if (!headlines || headlines.length === 0) {
    return <div className="text-gray-400">No headlines yet.</div>;
  }

  const [featured, ...rest] = headlines;

  return (
    <div className="md:flex md:gap-8">
      {/* Sidebar (desktop only) */}
      <aside className="hidden md:block w-56 flex-shrink-0">
        <div className="sticky top-24 space-y-1">
          <div className="mb-4">
            <LiveClock />
          </div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h2>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile date + categories slider */}
        <div className="md:hidden mb-4">
          <LiveClock />
        </div>
        <div className="md:hidden mb-4 relative">
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-800 text-gray-200 text-sm rounded-full"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          {/* subtle swipe hint */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-black to-transparent" />
        </div>

        {/* Featured + headlines */}
        <div className="space-y-4">
          <FeaturedHeadlineCard headline={featured} />
          {rest.map((headline) => (
            <HeadlineCard key={headline.id} headline={headline} />
          ))}
        </div>
      </div>
    </div>
  );
}
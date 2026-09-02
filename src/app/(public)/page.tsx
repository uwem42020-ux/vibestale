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
    return <div className="text-red-500">Error loading headlines.</div>;
  }

  if (!headlines || headlines.length === 0) {
    return <div className="text-gray-400">No headlines yet.</div>;
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
        <div className="md:hidden mb-4 relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            <span className="flex-shrink-0 px-3 py-1.5 bg-green-700 text-white text-sm font-semibold rounded-full">
              Headlines
            </span>
            {headlineCategories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="flex-shrink-0 px-3 py-1.5 bg-gray-800 text-gray-200 text-sm rounded-full">
                {cat.label}
              </Link>
            ))}
            {mediaCategories.map((item) => (
              <Link key={item.href} href={item.href} className="flex-shrink-0 px-3 py-1.5 bg-gray-800 text-gray-200 text-sm rounded-full">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-black to-transparent" />
        </div>

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
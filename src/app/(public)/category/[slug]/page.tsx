import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };

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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const { data: headlines, error } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('category', slug)
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) return <div className="text-red-500">Error loading headlines.</div>;

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>
        <div className="md:hidden mb-4 relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            <span className="flex-shrink-0 px-3 py-1.5 bg-green-700 text-white text-sm font-semibold rounded-full">Headlines</span>
            {headlineCategories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-full ${slug === cat.slug ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-200'}`}>
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

        <h1 className="text-2xl font-bold text-white mb-4">
          Category: {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </h1>

        {!headlines || headlines.length === 0 ? (
          <p className="text-gray-400">No headlines in this category yet.</p>
        ) : (
          <div className="space-y-4">
            {headlines.map((headline) => (
              <HeadlineCard key={headline.id} headline={headline} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';

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
    .limit(50);

  if (error) {
    console.error('Error fetching headlines:', error);
    return <div>Error loading headlines.</div>;
  }

  return (
    <div>
      <div className="mb-5 overflow-x-auto -mx-4 px-4 flex gap-2 md:hidden">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-green-50 hover:border-green-300"
          >
            {cat.label}
          </a>
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-6 hidden md:block">Latest News with AI Context</h1>
      <h2 className="text-2xl font-bold mb-4 md:hidden">Top Stories</h2>

      {headlines.length === 0 ? (
        <p>No headlines yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {headlines.map((headline) => (
            <HeadlineCard key={headline.id} headline={headline} />
          ))}
        </div>
      )}
    </div>
  );
}
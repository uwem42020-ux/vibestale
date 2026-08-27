import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';
import FeaturedHeadlineCard from '@/components/feed/FeaturedHeadlineCard';

export const dynamic = 'force-dynamic';

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
    return <div>Error loading headlines.</div>;
  }

  if (!headlines || headlines.length === 0) {
    return <div>No headlines yet.</div>;
  }

  const [featured, ...rest] = headlines;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 hidden md:block">Latest News with AI Context</h1>
      <h2 className="text-2xl font-bold mb-4 md:hidden">Top Stories</h2>

      <div className="space-y-4">
        {/* Featured story */}
        <FeaturedHeadlineCard headline={featured} />

        {/* Other headlines */}
        {rest.map((headline) => (
          <HeadlineCard key={headline.id} headline={headline} />
        ))}
      </div>
    </div>
  );
}
import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: headlines, error } = await supabase
    .from('headlines')
    .select('*')
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching headlines:', error);
    return <div>Error loading headlines.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Latest News with AI Context</h1>
      {headlines.length === 0 ? (
        <p>No headlines yet.</p>
      ) : (
        <div className="space-y-4">
          {headlines.map((headline) => (
            <HeadlineCard key={headline.id} headline={headline} />
          ))}
        </div>
      )}
    </div>
  );
}
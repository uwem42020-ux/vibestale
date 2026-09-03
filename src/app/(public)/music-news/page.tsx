import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function CelebrityNewsPage() {
  const supabase = await createClient();
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  const { data: news, error } = await supabase
    .from('entertainment_news')
    .select('*, entertainment_sources(name, base_url)')
    .eq('ai_analysis_status', 'completed')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(8);  // reduced from 30

  if (error) {
    console.error('Error fetching entertainment news:', error);
    return <div className="text-red-500">Error loading news.</div>;
  }

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">🌟 Celebrity News</h1>
        <p className="text-sm text-gray-400 mb-6">Latest entertainment and celebrity gossip.</p>

        {news && news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <HeadlineCard key={item.id} headline={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No celebrity news yet.</p>
        )}
      </div>
    </div>
  );
}
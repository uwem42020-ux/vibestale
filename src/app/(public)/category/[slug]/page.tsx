import { createClient } from '@/lib/supabase/server';
import HeadlineCard from '@/components/feed/HeadlineCard';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: headlines, error } = await supabase
    .from('headlines')
    .select('*, sources(name, base_url)')
    .eq('category', slug)
    .eq('ai_analysis_status', 'completed')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching category headlines:', error);
    return <div>Error loading headlines.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Category: {slug.charAt(0).toUpperCase() + slug.slice(1)}
      </h1>
      {headlines.length === 0 ? (
        <p>No headlines in this category yet.</p>
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
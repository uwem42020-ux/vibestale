import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import WhatsAppShare from '@/components/share/WhatsAppShare';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

function getFallbackImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/800/400`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: headline } = await supabase
    .from('headlines')
    .select('title, ai_summary, slug, original_url, published_at, category')
    .eq('slug', slug)
    .maybeSingle();

  if (!headline) {
    return { title: 'Not Found' };
  }

  return {
    title: `${headline.title} | VibeStale`,
    description: headline.ai_summary?.substring(0, 155) || '',
    openGraph: {
      title: headline.title,
      description: headline.ai_summary || '',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/headline/${headline.slug}`,
      type: 'article',
    },
  };
}

export default async function HeadlinePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: headline, error } = await supabase
    .from('headlines')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !headline) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;
  const fallbackImage = getFallbackImage(headline.slug);
  const imageSrc = headline.image_url || fallbackImage;

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <img
        src={imageSrc}
        alt={headline.title}
        className="w-full h-64 object-cover rounded mb-4"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallbackImage;
        }}
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-4">{headline.title}</h1>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <span>Source ID: {headline.source_id}</span>
        <span>·</span>
        <span>{new Date(headline.published_at || '').toLocaleDateString()}</span>
      </div>

      {headline.ai_summary && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <span className="font-semibold text-green-800">AI Analysis: </span>
          <p className="text-gray-700 mt-1">{headline.ai_summary}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <a
          href={headline.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Read Full Story on Source
        </a>
        <WhatsAppShare title={headline.title} url={shareUrl} />
      </div>
    </article>
  );
}
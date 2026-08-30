import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import WhatsAppShare from '@/components/share/WhatsAppShare';
import SourceBadge from '@/components/SourceBadge';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

function getFallbackImage(): string {
  // Return empty string so frontend can show placeholder icon if no image
  return '';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: headline } = await supabase
    .from('headlines')
    .select('title, ai_summary, slug, original_url, published_at, category, image_url, sources(name, base_url)')
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
    .select('*, sources(name, base_url)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !headline) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;

  return (
    <article className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow p-6">
      {/* Cover Image */}
      {headline.image_url ? (
        <img
          src={headline.image_url}
          alt={headline.title}
          className="w-full h-64 object-cover rounded mb-4"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 rounded mb-4 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <h1 className="text-2xl font-bold text-white mb-4">{headline.title}</h1>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400 flex-wrap">
        {headline.sources && (
          <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
        )}
        <span>·</span>
        <span>
          {new Date(headline.published_at || '').toLocaleString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </span>
        <span>·</span>
        <span className="capitalize">{headline.category || 'general'}</span>
      </div>

      {headline.ai_summary && (
        <div className="bg-green-950 border-l-4 border-green-500 p-4 mb-4">
          <span className="font-semibold text-green-300">AI Analysis: </span>
          <p className="text-gray-200 mt-1">{headline.ai_summary}</p>
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
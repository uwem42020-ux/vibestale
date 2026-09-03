import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ShareMenu from '@/components/share/ShareMenu';
import SourceBadge from '@/components/SourceBadge';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: headline } = await supabase
    .from('headlines')
    .select('title, ai_summary, slug, original_url, published_at, category, image_url, sources(name, base_url)')
    .eq('slug', slug)
    .maybeSingle();

  if (!headline) return { title: 'Not Found' };

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

  if (error || !headline) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;

  const AdvertBox = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-300">Advertise with us</p>
      <a
        href="https://wa.me/2348038887589"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 font-semibold text-lg"
      >
        WhatsApp: +234 803 888 7589
      </a>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Mobile advert before image */}
      <div className="md:hidden mb-4">
        <AdvertBox />
      </div>

      <div className="md:flex md:gap-6 md:items-start">
        {/* Main article */}
        <div className="flex-1 min-w-0">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Headlines
          </Link>

          <article className="bg-gray-900 rounded-lg shadow p-6">
            {headline.image_url ? (
              <img
                src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
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

            {/* AI Analysis */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Analysis</h2>
              {headline.ai_summary?.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-200 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <a
                href={headline.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition"
              >
                Read Full Story
              </a>
              <ShareMenu title={headline.title} url={shareUrl} />
            </div>
          </article>
        </div>

        {/* Desktop advert sidebar – aligned with article image */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="pt-10">
            <AdvertBox />
          </div>
        </aside>
      </div>
    </div>
  );
}
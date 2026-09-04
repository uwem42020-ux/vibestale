import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ShareMenu from '@/components/share/ShareMenu';
import SourceBadge from '@/components/SourceBadge';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, Calendar, Tag, Clock } from 'lucide-react';

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

  const imageUrl = headline.image_url
    ? `/api/image?url=${encodeURIComponent(headline.image_url)}`
    : '/whitelogo.png';

  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/headline/${headline.slug}`;

  return {
    title: `${headline.title} | VibeStale`,
    description: headline.ai_summary?.substring(0, 155) || '',
    openGraph: {
      title: headline.title,
      description: headline.ai_summary || '',
      url: fullUrl,
      type: 'article',
      siteName: 'VibeStale',
      images: [
        {
          url: imageUrl.startsWith('http') ? imageUrl : `${process.env.NEXT_PUBLIC_APP_URL}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: headline.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: headline.title,
      description: headline.ai_summary || '',
      images: [imageUrl.startsWith('http') ? imageUrl : `${process.env.NEXT_PUBLIC_APP_URL}${imageUrl}`],
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
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-center shadow-sm">
      <p className="text-sm text-[var(--text-secondary)] mb-2">Advertise with us</p>
      <a
        href="https://wa.me/2348038887589"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent)] font-semibold text-lg hover:text-[var(--accent-hover)] transition-colors"
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
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Headlines
          </Link>

          <article className="bg-[var(--surface)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden">
            {/* Image */}
            {headline.image_url ? (
              <div className="relative">
                <img
                  src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                  alt={headline.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-[var(--surface-hover)] flex items-center justify-center">
                <svg className="w-20 h-20 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4 font-space-grotesk leading-tight">
                {headline.title}
              </h1>

              {/* Meta info */}
              <div className="flex items-center gap-3 mb-6 text-sm text-[var(--text-tertiary)] flex-wrap">
                {headline.sources && (
                  <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(headline.published_at || '').toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(headline.published_at || '').toLocaleTimeString('en-NG', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
                {headline.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full font-medium capitalize">
                    <Tag className="w-3 h-3" />
                    {headline.category}
                  </span>
                )}
              </div>

              {/* AI Analysis */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[var(--accent)] rounded-full" />
                  Analysis
                </h2>
                <div className="space-y-4">
                  {headline.ai_summary?.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="text-[var(--text-secondary)] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-[var(--border)]">
                <a
                  href={headline.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Story
                </a>
                <ShareMenu title={headline.title} url={shareUrl} />
              </div>
            </div>
          </article>
        </div>

        {/* Desktop advert sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <AdvertBox />
          </div>
        </aside>
      </div>
    </div>
  );
}
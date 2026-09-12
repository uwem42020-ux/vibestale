import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ShareMenu from '@/components/share/ShareMenu';
import SourceBadge from '@/components/SourceBadge';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, Calendar, Tag, Clock, Info, BookOpen } from 'lucide-react';

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
    title: `${headline.title} | Vibestale`,
    description: headline.ai_summary?.substring(0, 155) || '',
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: headline.title,
      description: headline.ai_summary || '',
      url: fullUrl,
      type: 'article',
      siteName: 'Vibestale',
      publishedTime: headline.published_at || undefined,
      modifiedTime: headline.published_at || undefined,
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

  // JSON-LD structured data for NewsArticle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: headline.title,
    image: headline.image_url
      ? [`${baseUrl}/api/image?url=${encodeURIComponent(headline.image_url)}`]
      : [`${baseUrl}/whitelogo.png`],
    datePublished: headline.published_at,
    dateModified: headline.updated_at || headline.published_at,
    author: {
      '@type': 'Organization',
      name: headline.sources?.name || 'Vibestale',
      url: headline.sources?.base_url || baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vibestale',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/blacklogo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
  };

  // Ad image paths
  const bannerAdImage = '/advert%20design.png';
  const portraitAdImage = '/Advertise%20with%20vibestale.png';

  // Mobile banner ad (before article image)
  const BannerAd = () => (
    <div className="md:hidden mb-4">
      <a
        href="https://wa.me/2348038887589"
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-xl border border-[var(--border)]"
      >
        <Image
          src={bannerAdImage}
          alt="Advertisement"
          className="w-full h-auto object-cover"
          width={320}
          height={100}
          loading="lazy"
        />
      </a>
    </div>
  );

  // Mobile portrait ad + newsletter (after article)
  const MobilePostArticle = () => (
    <>
      <div className="md:hidden mt-6">
        <a
          href="https://wa.me/2348038887589"
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl border border-[var(--border)]"
        >
          <Image
            src={portraitAdImage}
            alt="Advertisement"
            className="w-full h-auto object-cover"
            style={{ minHeight: '400px' }}
            width={256}
            height={600}
            loading="lazy"
          />
        </a>
      </div>
      <div className="md:hidden mt-6">
        <NewsletterSignup />
      </div>
    </>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mobile banner ad before article image */}
      <BannerAd />

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
            {/* Article image */}
            {headline.image_url ? (
              <div className="relative">
                <Image
                  src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                  alt={headline.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  width={1200}
                  height={630}
                  priority
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

              {/* Meta */}
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

              {/* Source Attribution Box */}
              <div className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl p-4 sm:p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--accent)]/10 rounded-lg flex-shrink-0">
                    <Info className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                      Source
                    </p>
                    <p className="text-sm text-[var(--text-primary)] mb-1">
                      <span className="text-[var(--text-secondary)]">Original reporting:</span>{' '}
                      {headline.sources ? (
                        <a
                          href={headline.sources.base_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] hover:underline font-medium"
                        >
                          {headline.sources.name}
                        </a>
                      ) : (
                        <span className="font-medium">Unknown</span>
                      )}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                      This page is a Vibestale summary. All reporting credit goes to the
                      original publisher. Read the full story via the link below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis */}
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

              {/* Explains cross-link */}
              <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl p-4 sm:p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--accent)]/10 rounded-lg flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] font-semibold mb-1">
                      Want more context?
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                      Visit Vibestale Explains for deep dives into the stories that matter —
                      clear guides on how things actually work in Nigeria.
                    </p>
                    <Link
                      href="/explains"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      Explore Vibestale Explains →
                    </Link>
                  </div>
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
                  Read Full Story at {headline.sources?.name || 'Original Source'}
                </a>
                <ShareMenu title={headline.title} url={shareUrl} />
              </div>
            </div>
          </article>

          {/* Mobile portrait ad + newsletter after article */}
          <MobilePostArticle />
        </div>

        {/* Desktop sidebar: ad + newsletter */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <a
              href="https://wa.me/2348038887589"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <Image
                src="/Advertise%20with%20vibestale.png"
                alt="Advertisement"
                className="w-full h-auto object-cover"
                width={256}
                height={600}
                loading="lazy"
              />
            </a>
            <NewsletterSignup />
          </div>
        </aside>
      </div>
    </div>
  );
}
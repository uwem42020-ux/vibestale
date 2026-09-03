'use client';

import Link from 'next/link';
import SourceBadge from '@/components/SourceBadge';
import ShareMenu from '@/components/share/ShareMenu';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';

type Headline = {
  id: string;
  title: string;
  slug: string;
  ai_summary: string | null;
  source_id: string;
  category: string | null;
  published_at: string | null;
  original_url: string;
  image_url?: string | null;
  sources?: { name: string; base_url: string } | null;
};

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 60) return diffMins <= 1 ? 'just now' : `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function FeaturedHeadlineCard({ headline }: { headline: Headline }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;

  return (
    <article className="relative bg-[var(--surface)] rounded-2xl shadow-lg border border-[var(--border)] transition-all duration-300 hover:shadow-xl hover:border-[var(--accent)]/30">
      {/* Image container with its own overflow hidden */}
      <div className="relative overflow-hidden rounded-t-2xl">
        {/* Featured badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent)] text-white text-xs font-bold rounded-full shadow-lg">
            <TrendingUp className="w-3 h-3" />
            Featured
          </span>
        </div>

        <Link href={`/headline/${headline.slug}`} className="block relative">
          {headline.image_url ? (
            <>
              <img
                src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                alt={headline.title}
                className="w-full h-56 sm:h-72 lg:h-80 object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-56 sm:h-72 lg:h-80 bg-[var(--surface-hover)] flex items-center justify-center">
              <svg className="w-20 h-20 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>
      </div>

      <div className="p-5 sm:p-6">
        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-3 flex-wrap">
          {headline.sources && (
            <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
          )}
          <span className="text-[var(--text-tertiary)]">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(headline.published_at)}
          </span>
          {headline.category && (
            <span className="px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full font-medium capitalize">
              {headline.category}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/headline/${headline.slug}`}>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] leading-tight hover:text-[var(--accent)] transition-colors mb-3 font-space-grotesk">
            {headline.title}
          </h2>
        </Link>

        {/* Summary */}
        {headline.ai_summary && (
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
            {headline.ai_summary}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <a
            href={headline.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Read Full Story
          </a>
          
          <ShareMenu title={headline.title} url={shareUrl} />
        </div>
      </div>
    </article>
  );
}
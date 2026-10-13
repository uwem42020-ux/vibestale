'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SourceBadge from '@/components/SourceBadge';
import ShareMenu from '@/components/share/ShareMenu';
import { Clock, Bookmark, ArrowRight } from 'lucide-react';

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
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function HeadlineCard({ headline }: { headline: Headline }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/headline/${headline.slug}`;
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <article className="group relative bg-[var(--surface)] rounded-2xl shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-150 border border-[var(--border)] hover:border-[var(--accent)]/30">
      <div className="flex gap-3 p-3">
        {/* Image */}
        <Link
          href={`/headline/${headline.slug}`}
          className="flex-shrink-0 relative rounded-xl overflow-hidden"
        >
          {headline.image_url ? (
            <>
              <Image
                src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                alt={headline.title}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover"
                width={160}
                height={160}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {headline.category && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-white/95 text-black text-[10px] font-bold uppercase tracking-wide rounded-sm shadow-sm">
                  {headline.category}
                </span>
              )}
            </>
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Meta info */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-1.5 flex-wrap">
              {headline.sources && (
                <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
              )}
              <span className="text-[var(--text-tertiary)]">•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(headline.published_at)}
              </span>
            </div>

            {/* Title */}
            <Link href={`/headline/${headline.slug}`}>
              <h3 className="text-[15px] sm:text-lg font-semibold text-[var(--text-primary)] leading-snug line-clamp-3 hover:text-[var(--accent)] transition-colors">
                {headline.title}
              </h3>
            </Link>

            {/* Summary — hidden on small screens */}
            {headline.ai_summary && (
              <p className="hidden sm:block text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mt-1.5">
                {headline.ai_summary}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Link
                href={`/headline/${headline.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent-hover)] active:scale-95 transition-all"
              >
                Read
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-lg active:scale-90 transition-all ${
                  bookmarked
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-hover)]'
                }`}
                aria-label="Bookmark article"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <ShareMenu title={headline.title} url={shareUrl} />
          </div>
        </div>
      </div>
    </article>
  );
}
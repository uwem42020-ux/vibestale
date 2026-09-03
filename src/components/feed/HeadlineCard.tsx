'use client';

import { useState } from 'react';
import Link from 'next/link';
import SourceBadge from '@/components/SourceBadge';
import ShareMenu from '@/components/share/ShareMenu';
import { ExternalLink, Clock, Bookmark } from 'lucide-react';

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
    <article className="group relative bg-[var(--surface)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[var(--border)] hover:border-[var(--accent)]/30">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <Link 
          href={`/headline/${headline.slug}`} 
          className="flex-shrink-0 relative rounded-xl overflow-hidden"
        >
          {headline.image_url ? (
            <>
              <img
                src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
                alt={headline.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {headline.category && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
                  {headline.category}
                </span>
              )}
            </>
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center">
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
            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-2 flex-wrap">
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
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors mb-1">
                {headline.title}
              </h3>
            </Link>

            {/* Summary */}
            {headline.ai_summary && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                {headline.ai_summary}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="flex items-center gap-1">
              <a
                href={headline.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Read
              </a>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-lg transition-colors ${
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
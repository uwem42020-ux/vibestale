'use client';

import Link from 'next/link';
import SourceBadge from '@/components/SourceBadge';
import ShareMenu from '@/components/share/ShareMenu';

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
    <article className="bg-gray-900 rounded-2xl shadow-md overflow-hidden">
      <Link href={`/headline/${headline.slug}`} className="block">
        {headline.image_url ? (
          <img
            src={`/api/image?url=${encodeURIComponent(headline.image_url)}`}
            alt={headline.title}
            className="w-full h-56 sm:h-72 object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-56 sm:h-72 bg-gray-800 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          {headline.sources && (
            <SourceBadge name={headline.sources.name} baseUrl={headline.sources.base_url} />
          )}
          <span>·</span>
          <span>{timeAgo(headline.published_at)}</span>
        </div>

        <Link href={`/headline/${headline.slug}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug hover:text-green-400">
            {headline.title}
          </h2>
        </Link>

        {headline.ai_summary && (
          <p className="mt-2 text-sm text-gray-300 line-clamp-3">
            {headline.ai_summary}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
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
      </div>
    </article>
  );
}